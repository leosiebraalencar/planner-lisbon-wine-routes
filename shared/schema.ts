import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb } from "drizzle-orm/pg-core";
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

export const quizResponseSchema = z.object({
  duration: z.number().min(1).max(10),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.enum(['economico', 'moderado', 'premium']),
  travelers: z.enum(['sozinho', 'casal', 'familia', 'grupo']),
  preferences: z.array(z.string()),
  specialRequests: z.string().optional(),
});

export type QuizResponse = z.infer<typeof quizResponseSchema>;

export const itinerarySchema = z.object({
  id: z.string(),
  quizData: quizResponseSchema,
  days: z.array(z.object({
    day: z.number(),
    region: z.string(),
    morning: z.object({
      time: z.string(),
      activity: z.string(),
      location: z.string(),
      description: z.string(),
      duration: z.string(),
    }),
    afternoon: z.object({
      time: z.string(),
      activity: z.string(),
      location: z.string(),
      description: z.string(),
      duration: z.string(),
    }),
    evening: z.object({
      time: z.string(),
      activity: z.string(),
      location: z.string(),
      description: z.string(),
      duration: z.string(),
    }),
  })),
  highlights: z.array(z.string()),
  recommendations: z.object({
    restaurants: z.array(z.string()),
    tips: z.array(z.string()),
  }),
});

export type Itinerary = z.infer<typeof itinerarySchema>;
