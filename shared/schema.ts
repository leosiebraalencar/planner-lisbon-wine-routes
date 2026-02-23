import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const paymentSessions = pgTable("payment_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stripeSessionId: text("stripe_session_id").notNull().unique(),
  itineraryData: jsonb("itinerary_data").notNull(),
  status: text("status").notNull().default('pending'),
  amountPaid: integer("amount_paid"),
  pdfPath: text("pdf_path"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPaymentSessionSchema = createInsertSchema(paymentSessions).omit({
  id: true,
  createdAt: true,
});

export type InsertPaymentSession = z.infer<typeof insertPaymentSessionSchema>;
export type PaymentSession = typeof paymentSessions.$inferSelect;

export const proRequests = pgTable("pro_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  duration: text("duration"),
  preferences: text("preferences").notNull(),
  quizData: jsonb("quiz_data"),
  referrer: text("referrer"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProRequestSchema = createInsertSchema(proRequests).omit({
  id: true,
  createdAt: true,
});

export type InsertProRequest = z.infer<typeof insertProRequestSchema>;
export type ProRequest = typeof proRequests.$inferSelect;

export const quizSubmissions = pgTable("quiz_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email"),
  marketingConsent: text("marketing_consent").default('false'),
  quizData: jsonb("quiz_data").notNull(),
  language: text("language").default('PT'),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertQuizSubmissionSchema = createInsertSchema(quizSubmissions).omit({
  id: true,
  createdAt: true,
});

export type InsertQuizSubmission = z.infer<typeof insertQuizSubmissionSchema>;
export type QuizSubmission = typeof quizSubmissions.$inferSelect;

export const quizResponseSchema = z.object({
  customerName: z.string().optional(),
  duration: z.number().min(1).max(10),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.enum(['economico', 'moderado', 'premium']),
  travelers: z.enum(['sozinho', 'casal', 'familia', 'grupo']),
  groupSize: z.number().min(3).max(100).optional(),
  languagePreference: z.enum(['portugues', 'ingles', 'espanhol', 'frances', 'alemao']).optional(),
  preferences: z.array(z.string()),
  gastronomyStyle: z.array(z.string()).optional(),
  hotelStyle: z.enum(['moderno', 'rustico', 'historico']).optional(),
  accommodationMobility: z.enum(['single_location', 'multiple_locations']).optional(),
  regionPreferences: z.array(z.enum(['oeste', 'setubal', 'oeiras', 'sintra', 'surprise'])).optional(),
  specialRequests: z.string().optional(),
  arrival: z.enum(['aviao', 'trem', 'carro', 'outros', 'ja_em_lisboa']).optional(),
  needsCarRental: z.boolean().optional(),
  wantsPrivateGuide: z.boolean().optional(),
  hasAccommodation: z.boolean().optional(),
  accommodationPreference: z.enum(['central_lisboa', 'vinicolas_proximas', 'sugestao_equipa']).optional(),
});

export type QuizResponse = z.infer<typeof quizResponseSchema>;

export const activitySchema = z.object({
  time: z.string(),
  activity: z.string(),
  location: z.string(),
  description: z.string(),
  duration: z.string(),
  address: z.string().optional(),
  price: z.number().optional(),
  affiliateUrl: z.string().optional(),
  affiliateProvider: z.enum(['winalist', 'getyourguide', 'booking', 'discovercars', 'googlemaps', 'thefork', 'direct']).optional(),
  isTheFork: z.boolean().optional(),
  theForkPromoCode: z.string().optional(),
});

export const localizedStringSchema = z.object({
  PT: z.string(),
  EN: z.string(),
  ES: z.string(),
  DE: z.string(),
});

export type LocalizedString = z.infer<typeof localizedStringSchema>;

export const narratedBlockSchema = z.object({
  title: localizedStringSchema,
  content: localizedStringSchema,
  tip: localizedStringSchema.optional(),
  alert: localizedStringSchema.optional(),
  suggestion: localizedStringSchema.optional(),
});

export const planBSchema = z.object({
  scenario: localizedStringSchema,
  solution: localizedStringSchema,
});

export const googleMapsLinkSchema = z.object({
  dayNumber: z.number(),
  label: z.string(),
  url: z.string(),
});

export const roadTripGuideSchema = z.object({
  carPickupChecklist: z.array(localizedStringSchema),
  narratedBlocks: z.array(narratedBlockSchema),
  whatToBring: z.object({
    documents: z.array(localizedStringSchema),
    comfort: z.array(localizedStringSchema),
    safety: z.array(localizedStringSchema),
    technology: z.array(localizedStringSchema),
    climate: z.array(localizedStringSchema),
  }),
  drivingTips: z.array(localizedStringSchema),
  planB: z.array(planBSchema),
  googleMapsLinks: z.array(googleMapsLinkSchema),
  summary: localizedStringSchema,
});

export type RoadTripGuide = z.infer<typeof roadTripGuideSchema>;

export const itinerarySchema = z.object({
  id: z.string(),
  quizData: quizResponseSchema,
  days: z.array(z.object({
    day: z.number(),
    region: z.string(),
    morning: activitySchema,
    afternoon: activitySchema,
    evening: activitySchema,
    hotel: z.object({
      name: z.string(),
      description: z.string().optional(),
      affiliateUrl: z.string().optional(),
      budgetCategory: z.string().optional(),
    }).optional(),
    carRentalPickup: z.object({
      provider: z.string(),
      affiliateUrl: z.string(),
    }).optional(),
  })),
  highlights: z.array(z.string()),
  recommendations: z.object({
    restaurants: z.array(z.object({
      name: z.string(),
      address: z.string().optional(),
      description: z.string().optional(),
      price: z.number().optional(),
      affiliateUrl: z.string().optional(),
      isTheFork: z.boolean().optional(),
      theForkPromoCode: z.string().optional(),
    })),
    hotels: z.array(z.object({
      name: z.string(),
      description: z.string().optional(),
      budgetCategory: z.string().optional(),
      affiliateUrl: z.string().optional(),
    })).optional(),
    tips: z.array(z.string()),
    accommodation: z.object({
      name: z.string(),
      address: z.string().optional(),
      affiliateUrl: z.string().optional(),
    }).optional(),
    carRental: z.object({
      provider: z.string(),
      affiliateUrl: z.string(),
    }).optional(),
  }),
  roadTripGuide: roadTripGuideSchema.optional(),
});

export type Activity = z.infer<typeof activitySchema>;
export type Itinerary = z.infer<typeof itinerarySchema>;
