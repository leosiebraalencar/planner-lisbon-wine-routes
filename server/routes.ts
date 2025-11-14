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
