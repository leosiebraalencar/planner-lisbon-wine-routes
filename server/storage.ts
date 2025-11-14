import { users, paymentSessions, type User, type InsertUser, type PaymentSession, type InsertPaymentSession } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPaymentSession(session: InsertPaymentSession): Promise<PaymentSession>;
  getPaymentSessionByStripeId(stripeSessionId: string): Promise<PaymentSession | undefined>;
  updatePaymentSession(stripeSessionId: string, updates: Partial<PaymentSession>): Promise<PaymentSession | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createPaymentSession(insertSession: InsertPaymentSession): Promise<PaymentSession> {
    const [session] = await db
      .insert(paymentSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getPaymentSessionByStripeId(stripeSessionId: string): Promise<PaymentSession | undefined> {
    const [session] = await db
      .select()
      .from(paymentSessions)
      .where(eq(paymentSessions.stripeSessionId, stripeSessionId));
    return session || undefined;
  }

  async updatePaymentSession(stripeSessionId: string, updates: Partial<PaymentSession>): Promise<PaymentSession | undefined> {
    const [updated] = await db
      .update(paymentSessions)
      .set(updates)
      .where(eq(paymentSessions.stripeSessionId, stripeSessionId))
      .returning();
    return updated || undefined;
  }
}

export const storage = new DatabaseStorage();
