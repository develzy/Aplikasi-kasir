import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb } from '@/db';
import { transactions, products } from '@/db/schema';
import { NextResponse } from 'next/server';
import { desc, eq, sql } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET() {
    const db = getDb(getRequestContext().env.DB);
    const allTransactions = await db.select().from(transactions).orderBy(desc(transactions.id)).all();
    return NextResponse.json(allTransactions);
}

export async function POST(request: Request) {
    const db = getDb(getRequestContext().env.DB);
    const data = await request.json() as any;

    const { items, ...transactionData } = data;

    try {
        // Perform batch operations for atomicity
        const batchQueries: any[] = [];

        // 1. Insert Transaction record
        batchQueries.push(
            db.insert(transactions).values({
                type: transactionData.type || 'income',
                category: transactionData.category || 'Penjualan',
                amount: transactionData.amount,
                note: transactionData.note,
                date: transactionData.date || new Date().toLocaleString('id-ID'),
                status: transactionData.status || 'Selesai'
            }).returning()
        );

        // 2. Decrement stock for each item if it's an income (sale)
        if (transactionData.type === 'income' && items && Array.isArray(items)) {
            for (const item of items) {
                batchQueries.push(
                    db.update(products)
                        .set({
                            stock: sql`${products.stock} - ${item.quantity}`
                        })
                        .where(eq(products.id, item.id))
                );
            }
        }

        const results = await db.batch(batchQueries as any);

        // The first result is the inserted transaction
        return NextResponse.json(results[0][0]);
    } catch (err: any) {
        console.error("Transaction Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
