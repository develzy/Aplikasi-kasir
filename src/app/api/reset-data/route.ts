import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb } from '@/db';
import { transactions, cartItems } from '@/db/schema';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function DELETE() {
    try {
        const db = getDb(getRequestContext().env.DB);

        // Delete all transactions
        await db.delete(transactions);

        // Optional: clear cart items too if they are considered part of "transaction data"
        // await db.delete(cartItems); 

        return NextResponse.json({ success: true, message: 'All transaction history deleted.' });
    } catch (error) {
        console.error('Failed to reset data:', error);
        return NextResponse.json({ error: 'Failed to reset data' }, { status: 500 });
    }
}
