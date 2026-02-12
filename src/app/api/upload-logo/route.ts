import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const username = formData.get('username') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        if (!username) {
            return NextResponse.json({ error: 'Username is required' }, { status: 400 });
        }

        // Buat path untuk folder kasir/username
        const uploadDir = path.join(process.cwd(), 'public', 'kasir', username);

        // Buat folder jika belum ada
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Konversi file ke buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Dapatkan ekstensi file
        const fileExtension = file.name.split('.').pop() || 'png';
        const fileName = `logo.${fileExtension}`;
        const filePath = path.join(uploadDir, fileName);

        // Simpan file
        await writeFile(filePath, buffer);

        // Return URL yang bisa diakses
        const logoUrl = `/kasir/${username}/${fileName}`;

        return NextResponse.json({
            success: true,
            logoUrl,
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
