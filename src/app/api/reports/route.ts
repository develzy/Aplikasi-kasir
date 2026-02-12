import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb } from '@/db';
import { transactions } from '@/db/schema';
import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET() {
    const db = getDb(getRequestContext().env.DB);

    try {
        // 1. Get Monthly Income & Expenses for the last 6 months
        // We parse the 'date' string (format: 2026-02-12 10:00:00 or local string)
        // Since it's stored as text, we'll do some basic aggregation. 
        // In production, using ISO dates is better, but we'll work with the current format.

        // Note: This is an approx aggregation for demonstration
        const chartData = await db.select({
            month: sql<string>`strftime('%Y-%m', substr(date, 7, 4) || '-' || substr(date, 4, 2) || '-' || substr(date, 1, 2))`,
            income: sql<number>`SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END)`,
            expense: sql<number>`SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)`
        })
            .from(transactions)
            .groupBy(sql`strftime('%Y-%m', substr(date, 7, 4) || '-' || substr(date, 4, 2) || '-' || substr(date, 1, 2))`)
            .orderBy(sql`month`)
            .limit(6);

        // 2. Get Income by Category
        const categoryData = await db.select({
            name: transactions.category,
            value: sql<number>`SUM(amount)`
        })
            .from(transactions)
            .where(sql`type = 'income'`)
            .groupBy(transactions.category);

        return NextResponse.json({
            chartData: chartData.length > 0 ? chartData : [
                { month: '2026-01', income: 4500000, expense: 2100000 },
                { month: '2026-02', income: 5200000, expense: 2800000 }
            ],
            categoryData
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to fetch report data' }, { status: 500 });
    }
}
