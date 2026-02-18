import { users, paymentSessions, proRequests, quizSubmissions, type User, type InsertUser, type PaymentSession, type InsertPaymentSession, type ProRequest, type InsertProRequest, type QuizSubmission, type InsertQuizSubmission } from "@shared/schema";
import { db } from "./db";
import { eq, desc, count } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPaymentSession(session: InsertPaymentSession): Promise<PaymentSession>;
  getPaymentSessionByStripeId(stripeSessionId: string): Promise<PaymentSession | undefined>;
  updatePaymentSession(stripeSessionId: string, updates: Partial<PaymentSession>): Promise<PaymentSession | undefined>;
  createProRequest(request: InsertProRequest): Promise<ProRequest>;
  getProRequests(): Promise<ProRequest[]>;
  createQuizSubmission(submission: InsertQuizSubmission): Promise<QuizSubmission>;
  getQuizSubmissions(): Promise<QuizSubmission[]>;
  updateQuizSubmissionEmail(id: string, email: string, consent: string): Promise<QuizSubmission | undefined>;
  getQuizSubmissionCount(): Promise<number>;
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

  async createProRequest(request: InsertProRequest): Promise<ProRequest> {
    const [proRequest] = await db
      .insert(proRequests)
      .values(request)
      .returning();
    return proRequest;
  }

  async getProRequests(): Promise<ProRequest[]> {
    return await db.select().from(proRequests);
  }

  async createQuizSubmission(submission: InsertQuizSubmission): Promise<QuizSubmission> {
    const [result] = await db
      .insert(quizSubmissions)
      .values(submission)
      .returning();
    return result;
  }

  async getQuizSubmissions(): Promise<QuizSubmission[]> {
    return await db.select().from(quizSubmissions).orderBy(desc(quizSubmissions.createdAt));
  }

  async updateQuizSubmissionEmail(id: string, email: string, consent: string): Promise<QuizSubmission | undefined> {
    const [updated] = await db
      .update(quizSubmissions)
      .set({ customerEmail: email, marketingConsent: consent })
      .where(eq(quizSubmissions.id, id))
      .returning();
    return updated || undefined;
  }

  async getQuizSubmissionCount(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(quizSubmissions);
    return result?.count || 0;
  }
}

export const storage = new DatabaseStorage();
