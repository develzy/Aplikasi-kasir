import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb } from '@/db';
import { settings } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET() {
    const db = getDb(getRequestContext().env.DB);
    // Get settings (should always be id=1)
    let storeSettings = await db.select().from(settings).where(eq(settings.id, 1)).get();

    if (!storeSettings) {
        // Return defaults if not exists
        return NextResponse.json({
            storeName: "KasUMKM",
            address: "Jl. Digital No. 123, Indonesia",
            phone: "0812-3456-7890",
            currency: "IDR"
        });
    }

    return NextResponse.json(storeSettings);
}

export async function POST(request: Request) {
    const db = getDb(getRequestContext().env.DB);
    const data = await request.json() as any;

    // Upsert settings with id=1
    const existing = await db.select().from(settings).where(eq(settings.id, 1)).get();

    if (existing) {
        await db.update(settings).set(data).where(eq(settings.id, 1));
    } else {
        await db.insert(settings).values({ id: 1, ...data });
    }

    return NextResponse.json({ success: true });
}
