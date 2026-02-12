import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db';
import { settings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json() as { image: string };
        const base64Image = data.image;

        if (!base64Image) {
            return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
        }

        // Validate basic base64 format (simple check)
        if (!base64Image.startsWith('data:image/')) {
            return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
        }

        const db = getDb(getRequestContext().env.DB);

        // Update settings directly
        // Assuming id=1 for single store settings
        const existing = await db.select().from(settings).where(eq(settings.id, 1)).get();

        if (existing) {
            await db.update(settings)
                .set({ logoUrl: base64Image })
                .where(eq(settings.id, 1));
        } else {
            await db.insert(settings).values({
                id: 1,
                logoUrl: base64Image
            });
        }

        return NextResponse.json({
            success: true,
            logoUrl: base64Image,
            message: 'Logo berhasil disimpan ke database'
        });

    } catch (error: any) {
        console.error('Logo save error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to save logo' },
            { status: 500 }
        );
    }
}
