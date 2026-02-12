import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

async function sha1(str: string) {
    const buffer = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest('SHA-1', buffer);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const username = formData.get('username') as string || 'default';

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const env = getRequestContext().env;
        const CLOUD_NAME = env.CLOUDINARY_CLOUD_NAME;
        const API_KEY = env.CLOUDINARY_API_KEY;
        const API_SECRET = env.CLOUDINARY_API_SECRET;

        if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
            return NextResponse.json({ error: 'Cloudinary config missing' }, { status: 500 });
        }

        // Prepare upload parameters
        const timestamp = Math.round((new Date()).getTime() / 1000).toString();
        const folder = `kasir/${username}`;

        // Items to sign: folder, timestamp (sorted alphabetically)
        const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
        const signature = await sha1(paramsToSign + API_SECRET);

        // Create form data for Cloudinary
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append('file', file);
        cloudinaryFormData.append('api_key', API_KEY);
        cloudinaryFormData.append('timestamp', timestamp);
        cloudinaryFormData.append('folder', folder);
        cloudinaryFormData.append('signature', signature);

        // Upload to Cloudinary
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: cloudinaryFormData
        });

        const data = await response.json() as any;

        if (!response.ok) {
            console.error('Cloudinary error:', data);
            return NextResponse.json({ error: data.error?.message || 'Upload failed' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            logoUrl: data.secure_url,
            message: 'Logo berhasil diunggah'
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload logo' },
            { status: 500 }
        );
    }
}
