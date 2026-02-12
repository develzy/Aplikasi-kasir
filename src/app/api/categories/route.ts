import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb } from '@/db';
import { categories } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET() {
    try {
        const db = getDb(getRequestContext().env.DB);
        const allCategories = await db.select().from(categories).all();
        return NextResponse.json(allCategories);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const db = getDb(getRequestContext().env.DB);
        const { name } = await request.json() as any;

        const result = await db.insert(categories).values({ name }).returning();
        return NextResponse.json(result[0]);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        const db = getDb(getRequestContext().env.DB);
        await db.delete(categories).where(eq(categories.id, parseInt(id)));
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
