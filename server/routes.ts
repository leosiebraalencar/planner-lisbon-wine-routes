import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";
import { itinerarySchema } from "@shared/schema";
import { generateItineraryPDF } from "./pdf";
import path from "path";
import fs from "fs";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY must be set");
}

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

    try {
      if (process.env.STRIPE_WEBHOOK_SECRET) {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } else {
        console.warn('WARNING: STRIPE_WEBHOOK_SECRET not set, skipping webhook signature verification');
        event = JSON.parse(req.body.toString());
      }
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

  async function getOrCreatePrice(): Promise<Stripe.Price> {
    if (cachedPrice) {
      return cachedPrice;
    }

    const existingPrices = await stripe.prices.list({
      lookup_keys: ['itinerary_pwyw'],
      limit: 1,
    });

    if (existingPrices.data.length > 0) {
      cachedPrice = existingPrices.data[0];
      return cachedPrice;
    }

    const product = await stripe.products.create({
      name: 'Lisbon Wine Routes - Personalized Itinerary',
      description: 'Personalized wine tourism itinerary for Lisbon',
    });

    cachedPrice = await stripe.prices.create({
      product: product.id,
      currency: 'usd',
      custom_unit_amount: {
        enabled: true,
        preset: 500,
        minimum: 100,
      },
      lookup_key: 'itinerary_pwyw',
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

  const httpServer = createServer(app);

  return httpServer;
}
