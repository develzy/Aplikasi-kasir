import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb } from '@/db';
import { transactions } from '@/db/schema';
import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET() {
    const db = getDb(getRequestContext().env.DB);

    // Total Balance (Total Income - Total Expense)
    // For simplicity since D1/SQLite doesn't have sophisticated aggregation in one go via Drizzle perfectly without raw sql sometimes:
    const incomeResult = await db.select({ total: sql<number>`sum(amount)` }).from(transactions).where(sql`type = 'income'`).get();
    const expenseResult = await db.select({ total: sql<number>`sum(amount)` }).from(transactions).where(sql`type = 'expense'`).get();
    const transCount = await db.select({ count: sql<number>`count(*)` }).from(transactions).get();

    const income = incomeResult?.total || 0;
    const expense = expenseResult?.total || 0;
    const balance = income - expense;
    const count = transCount?.count || 0;

    return NextResponse.json({
        balance,
        income,
        expense,
        transactionCount: count
    });
}
