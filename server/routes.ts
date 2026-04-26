import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";
import { itinerarySchema, insertProRequestSchema, insertQuizSubmissionSchema } from "@shared/schema";
import { generateItineraryPDF } from "./pdf";
import { generateRoadTripGuide } from "./ai";
import { sendProRequestNotification } from "./email";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import rateLimit from "express-rate-limit";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY must be set");
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  console.warn('[security] WARNING: STRIPE_WEBHOOK_SECRET is not set — webhook endpoint will reject all requests');
}

const SESSION_SECRET = process.env.SESSION_SECRET || (() => {
  throw new Error("SESSION_SECRET must be set");
})();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function signToken(payload: Record<string, unknown>): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verifyToken(token: string): Record<string, unknown> | null {
  try {
    const [data, sig] = token.split('.');
    if (!data || !sig) return null;
    const expected = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    return JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

const ADMIN_TOKEN_TTL_MS = 8 * 60 * 60 * 1000;
const SUBMISSION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false });
const pdfLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });
const aiLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false });
const quizLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false });
const proLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover",
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/webhook", async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    if (!sig) {
      return res.status(400).send('Missing stripe-signature header');
    }

    let event: Stripe.Event;

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('[security] Webhook request rejected: STRIPE_WEBHOOK_SECRET not configured');
      return res.status(503).send('Webhook not available');
    }

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      try {
        const amountPaid = session.amount_total || 0;
        
        const paymentSession = await storage.getPaymentSessionByStripeId(session.id);
        
        if (!paymentSession) {
          console.error(`Payment session not found for Stripe session ${session.id}`);
          res.json({ received: true, error: 'Payment session not found' });
          return;
        }

        const pdfPath = await generateItineraryPDF(paymentSession.itineraryData as any, session.id);
        
        await storage.updatePaymentSession(session.id, {
          status: 'completed',
          amountPaid: amountPaid,
          pdfPath: pdfPath,
        });

        console.log(`Payment completed for session ${session.id}, amount: $${amountPaid / 100}, PDF generated at ${pdfPath}`);
      } catch (error) {
        console.error('Error processing payment completion:', error);
      }
    }

    res.json({ received: true });
  });

  // Free PDF download - generates and returns PDF directly without payment
  app.post("/api/generate-free-pdf", pdfLimiter, async (req, res) => {
    try {
      const itinerary = itinerarySchema.parse(req.body);
      const lang = (req.query.lang as string || 'EN').toUpperCase() as 'PT' | 'EN' | 'ES' | 'DE';
      const validLang = ['PT', 'EN', 'ES', 'DE'].includes(lang) ? lang : 'EN';
      
      // Generate unique ID for this free download
      const downloadId = `free_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      // Generate PDF directly
      const pdfPath = await generateItineraryPDF(itinerary, downloadId, validLang);
      
      if (!fs.existsSync(pdfPath)) {
        return res.status(500).json({ error: 'PDF generation failed' });
      }
      
      // Send the PDF file
      res.download(pdfPath, 'lisbon-wine-routes-itinerary.pdf', (err) => {
        if (err) {
          console.error('Error sending PDF:', err);
        }
        // Clean up the file after sending (optional - keeps disk clean)
        setTimeout(() => {
          try {
            if (fs.existsSync(pdfPath)) {
              fs.unlinkSync(pdfPath);
            }
          } catch (cleanupError) {
            console.error('Error cleaning up PDF:', cleanupError);
          }
        }, 60000); // Clean up after 1 minute
      });
    } catch (error) {
      console.error('Error generating free PDF:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });

  // Legacy paid download endpoint (kept for existing payment sessions)
  app.get("/api/download-pdf/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      const paymentSession = await storage.getPaymentSessionByStripeId(sessionId);
      
      if (!paymentSession) {
        return res.status(404).json({ error: 'Payment session not found' });
      }
      
      if (paymentSession.status !== 'completed') {
        return res.status(403).json({ error: 'Payment not completed' });
      }
      
      if (!paymentSession.pdfPath) {
        return res.status(404).json({ error: 'PDF not yet generated' });
      }
      
      if (!fs.existsSync(paymentSession.pdfPath)) {
        return res.status(404).json({ error: 'PDF file not found' });
      }
      
      res.download(paymentSession.pdfPath, `lisbon-wine-routes-itinerary.pdf`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      res.status(500).json({ error: 'Failed to download PDF' });
    }
  });

  let cachedPrice: Stripe.Price | null = null;
  let cachedDonationPrice: Stripe.Price | null = null;

  async function getOrCreateDonationPrice(): Promise<Stripe.Price> {
    if (cachedDonationPrice) return cachedDonationPrice;

    const existing = await stripe.prices.list({ lookup_keys: ['donation_5eur'], limit: 1 });
    if (existing.data.length > 0) {
      cachedDonationPrice = existing.data[0];
      return cachedDonationPrice;
    }

    const product = await stripe.products.create({
      name: 'Lisbon Wine Routes - Apoie o Nosso Trabalho',
      description: 'Contribuição para apoiar o projeto Lisbon Wine Routes',
    });

    cachedDonationPrice = await stripe.prices.create({
      product: product.id,
      currency: 'eur',
      unit_amount: 500,
      lookup_key: 'donation_5eur',
    });

    return cachedDonationPrice;
  }

  async function getOrCreatePrice(): Promise<Stripe.Price> {
    if (cachedPrice) {
      return cachedPrice;
    }

    const existingPrices = await stripe.prices.list({
      lookup_keys: ['itinerary_pro_29eur'],
      limit: 1,
    });

    if (existingPrices.data.length > 0) {
      cachedPrice = existingPrices.data[0];
      return cachedPrice;
    }

    const product = await stripe.products.create({
      name: 'Lisbon Wine Routes - Pro Itinerary',
      description: 'Personalized wine tourism Pro itinerary for the Lisbon region',
    });

    cachedPrice = await stripe.prices.create({
      product: product.id,
      currency: 'eur',
      unit_amount: 2900,
      lookup_key: 'itinerary_pro_29eur',
    });

    return cachedPrice;
  }

  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const itinerary = itinerarySchema.parse(req.body);

      let baseUrl = req.get('origin') || `${req.protocol}://${req.get('host')}`;
      
      if (process.env.REPLIT_DEV_DOMAIN) {
        let envUrl = process.env.REPLIT_DEV_DOMAIN;
        if (!envUrl.startsWith('http://') && !envUrl.startsWith('https://')) {
          envUrl = `https://${envUrl}`;
        }
        baseUrl = envUrl;
      }
      
      if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        baseUrl = `https://${baseUrl}`;
      }
      
      baseUrl = baseUrl.replace(/\/$/, '');

      const price = await getOrCreatePrice();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/itinerary`,
        metadata: {
          itineraryId: itinerary.id,
        },
        payment_intent_data: {
          metadata: {
            itineraryId: itinerary.id,
          },
        },
      });

      await storage.createPaymentSession({
        stripeSessionId: session.id,
        itineraryData: itinerary,
        status: 'pending',
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  });

  app.post("/api/create-simple-checkout", async (req, res) => {
    try {
      let baseUrl = req.get('origin') || `${req.protocol}://${req.get('host')}`;

      if (process.env.REPLIT_DEV_DOMAIN) {
        let envUrl = process.env.REPLIT_DEV_DOMAIN;
        if (!envUrl.startsWith('http://') && !envUrl.startsWith('https://')) {
          envUrl = `https://${envUrl}`;
        }
        baseUrl = envUrl;
      }

      if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        baseUrl = `https://${baseUrl}`;
      }

      baseUrl = baseUrl.replace(/\/$/, '');

      const price = await getOrCreatePrice();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: price.id, quantity: 1 }],
        mode: 'payment',
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&type=support`,
        cancel_url: `${baseUrl}/`,
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error('Error creating simple checkout session:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  });

  app.post("/api/create-donation-checkout", async (req, res) => {
    try {
      let baseUrl = req.get('origin') || `${req.protocol}://${req.get('host')}`;

      if (process.env.REPLIT_DEV_DOMAIN) {
        let envUrl = process.env.REPLIT_DEV_DOMAIN;
        if (!envUrl.startsWith('http://') && !envUrl.startsWith('https://')) {
          envUrl = `https://${envUrl}`;
        }
        baseUrl = envUrl;
      }

      if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        baseUrl = `https://${baseUrl}`;
      }

      baseUrl = baseUrl.replace(/\/$/, '');

      const price = await getOrCreateDonationPrice();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: price.id, quantity: 1 }],
        mode: 'payment',
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&type=donation`,
        cancel_url: `${baseUrl}/itinerary`,
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error('Error creating donation checkout session:', error);
      res.status(500).json({ error: 'Failed to create donation session' });
    }
  });

  app.post("/api/quiz-submission", quizLimiter, async (req, res) => {
    try {
      const validationResult = insertQuizSubmissionSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: 'Validation failed' });
      }
      const submission = await storage.createQuizSubmission(validationResult.data);
      const submissionToken = signToken({ id: submission.id, iat: Date.now() });
      res.json({ success: true, id: submission.id, submissionToken });
    } catch (error) {
      console.error('Error creating quiz submission:', error);
      res.status(500).json({ error: 'Failed to save quiz submission' });
    }
  });

  app.post("/api/quiz-submission/:id/email", async (req, res) => {
    try {
      const { id } = req.params;
      const { email, consent, submissionToken } = req.body;

      if (!submissionToken) {
        return res.status(403).json({ error: 'Missing submission token' });
      }
      const payload = verifyToken(submissionToken);
      if (!payload || payload.id !== id || typeof payload.iat !== 'number' || Date.now() - payload.iat > SUBMISSION_TOKEN_TTL_MS) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      if (!EMAIL_RE.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
      }
      const updated = await storage.updateQuizSubmissionEmail(id, email, consent ? 'true' : 'false');
      if (!updated) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating quiz submission email:', error);
      res.status(500).json({ error: 'Failed to update email' });
    }
  });

  app.post("/api/admin/login", loginLimiter, async (req, res) => {
    try {
      const { email, password } = req.body;
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (!adminEmail || !adminPassword) {
        return res.status(500).json({ error: 'Admin credentials not configured' });
      }
      const emailMatch = crypto.timingSafeEqual(
        crypto.createHash('sha256').update(email || '').digest(),
        crypto.createHash('sha256').update(adminEmail).digest()
      );
      const passMatch = crypto.timingSafeEqual(
        crypto.createHash('sha256').update(password || '').digest(),
        crypto.createHash('sha256').update(adminPassword).digest()
      );
      if (emailMatch && passMatch) {
        const token = signToken({ role: 'admin', iat: Date.now() });
        return res.json({ success: true, token });
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) {
      console.error('Error in admin login:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  function requireAdmin(req: any, res: any, next: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin' || typeof payload.iat !== 'number' || Date.now() - payload.iat > ADMIN_TOKEN_TTL_MS) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  }

  app.get("/api/admin/submissions", requireAdmin, async (req, res) => {
    try {
      const submissions = await storage.getQuizSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      res.status(500).json({ error: 'Failed to fetch submissions' });
    }
  });

  app.post("/api/pro-request", proLimiter, async (req, res) => {
    try {
      const validationResult = insertProRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ error: 'Validation failed' });
      }

      const validatedData = validationResult.data;

      if (!validatedData.preferences || validatedData.preferences.length < 10) {
        return res.status(400).json({ error: 'Please provide more details about your preferences' });
      }

      const proRequest = await storage.createProRequest(validatedData);

      console.log(`New Pro request created: ${proRequest.id}`);

      sendProRequestNotification({
        name: validatedData.name || 'N/A',
        email: validatedData.email || 'N/A',
        phone: validatedData.phone || undefined,
        duration: validatedData.duration ? parseInt(validatedData.duration, 10) : undefined,
        preferences: validatedData.preferences,
      }).catch(() => {});

      res.json({ success: true, id: proRequest.id });
    } catch (error) {
      console.error('Error creating pro request:', error);
      res.status(500).json({ error: 'Failed to create pro request' });
    }
  });

  app.get("/api/itinerary-count", async (_req, res) => {
    try {
      const dbCount = await storage.getQuizSubmissionCount();
      const BASE_COUNT = 50;
      res.json({ count: BASE_COUNT + dbCount });
    } catch (error) {
      console.error('Error getting itinerary count:', error);
      res.json({ count: 50 });
    }
  });

  app.post("/api/generate-road-trip-guide", aiLimiter, async (req, res) => {
    try {
      const itinerary = itinerarySchema.parse(req.body);

      if (!process.env.AI_INTEGRATIONS_OPENAI_BASE_URL && !process.env.OPENAI_API_KEY) {
        return res.status(503).json({ error: 'AI service not configured' });
      }

      const guide = await generateRoadTripGuide(itinerary);
      res.json(guide);
    } catch (error: any) {
      console.error('Error generating road trip guide:', error);
      if (error?.status === 429) {
        return res.status(429).json({ error: 'AI service is busy. Please try again in a moment.' });
      }
      res.status(500).json({ error: 'Failed to generate road trip guide' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
