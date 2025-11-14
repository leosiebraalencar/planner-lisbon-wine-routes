import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";
import { itinerarySchema } from "@shared/schema";

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
        
        await storage.updatePaymentSession(session.id, {
          status: 'completed',
          amountPaid: amountPaid,
        });

        console.log(`Payment completed for session ${session.id}, amount: $${amountPaid / 100}`);
      } catch (error) {
        console.error('Error updating payment session:', error);
      }
    }

    res.json({ received: true });
  });

  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const itinerary = itinerarySchema.parse(req.body);

      const product = await stripe.products.create({
        name: 'Lisbon Wine Routes - Personalized Itinerary',
        description: `${itinerary.days.length}-day wine tourism itinerary in Lisbon`,
      });

      const price = await stripe.prices.create({
        product: product.id,
        currency: 'usd',
        custom_unit_amount: {
          enabled: true,
          preset: 500,
          minimum: 100,
        },
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.REPLIT_DEV_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.REPLIT_DEV_DOMAIN}/itinerary`,
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
