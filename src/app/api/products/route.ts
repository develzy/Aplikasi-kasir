import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb } from '@/db';
import { products } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET() {
    const db = getDb(getRequestContext().env.DB);
    const allProducts = await db.select().from(products).all();
    return NextResponse.json(allProducts);
}

export async function POST(request: Request) {
    const db = getDb(getRequestContext().env.DB);
    const data = await request.json() as any;
    const result = await db.insert(products).values(data).returning();
    return NextResponse.json(result[0]);
}

export async function PUT(request: Request) {
    const db = getDb(getRequestContext().env.DB);
    const data = await request.json() as any;
    const { id, ...updateData } = data;
    const result = await db.update(products)
        .set(updateData)
        .where(eq(products.id, id))
        .returning();
    return NextResponse.json(result[0]);
}

export async function DELETE(request: Request) {
    const db = getDb(getRequestContext().env.DB);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await db.delete(products).where(eq(products.id, parseInt(id)));
    return NextResponse.json({ success: true });
}
