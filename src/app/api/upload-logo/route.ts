import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto'; // Use standard Node crypto

// Allow Node.js runtime features (nodejs_compat is enabled in wrangler.toml)
// export const runtime = 'edge'; // REMOVED to allow node:crypto

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        // Removed dynamic folder for now to simplify signature and ensure success
        // const username = formData.get('username') as string || 'default';

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const env = getRequestContext().env;
        const CLOUD_NAME = env.CLOUDINARY_CLOUD_NAME;
        const API_KEY = env.CLOUDINARY_API_KEY;
        const API_SECRET = env.CLOUDINARY_API_SECRET;

        if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
            console.error("Missing Cloudinary Config");
            return NextResponse.json({ error: 'Cloudinary config missing' }, { status: 500 });
        }

        // Prepare upload parameters
        const timestamp = Math.round((new Date()).getTime() / 1000).toString();

        // Simplified: Only sign the timestamp to avoid sorting/encoding issues with folder paths
        const paramsToSign = `timestamp=${timestamp}`;

        // Standard Node.js SHA1 Hash
        const signature = crypto.createHash('sha1')
            .update(paramsToSign + API_SECRET)
            .digest('hex');

        // Create form data for Cloudinary
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append('file', file);
        cloudinaryFormData.append('api_key', API_KEY);
        cloudinaryFormData.append('timestamp', timestamp);
        // cloudinaryFormData.append('folder', ...); // Skip folder for now
        cloudinaryFormData.append('signature', signature);

        // Upload to Cloudinary
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: cloudinaryFormData
        });

        const data = await response.json() as any;

        if (!response.ok) {
            console.error('Cloudinary error response:', data);
            return NextResponse.json({
                error: data.error?.message || 'Upload failed',
                debug: { timestamp, signature } // Debug info just in case
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            logoUrl: data.secure_url,
            message: 'Logo berhasil diunggah'
        });

    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to upload logo' },
            { status: 500 }
        );
    }
}
