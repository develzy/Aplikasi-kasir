import { MetadataRoute } from 'next';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb } from '@/db';
import { settings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    try {
        const db = getDb(getRequestContext().env.DB);
        const storeSettings = await db.select().from(settings).where(eq(settings.id, 1)).get();

        const name = storeSettings?.storeName || "KasUMKM - Bisnis Digital";
        const shortName = storeSettings?.storeName || "KasUMKM";
        const logoUrl = storeSettings?.logoUrl || "/icons/icon.svg";

        return {
            name: name,
            short_name: shortName,
            description: "Aplikasi Kasir dan Pencatatan Keuangan UMKM Modern",
            start_url: "/",
            display: "standalone",
            background_color: "#0a0a0b",
            theme_color: "#6366f1",
            icons: [
                {
                    src: logoUrl, // Use uploaded logo
                    sizes: "any",
                    type: "image/png", // Assuming uploaded is png/jpg/webp, browser handles it
                    purpose: "any"
                },
                {
                    src: logoUrl,
                    sizes: "512x512", // Just a hint, browser scales
                    type: "image/png",
                    purpose: "maskable"
                }
            ],
        }
    } catch (error) {
        console.error("Failed to generate manifest:", error);
        // Fallback
        return {
            name: "KasUMKM",
            short_name: "KasUMKM",
            start_url: "/",
            display: "standalone",
            background_color: "#0a0a0b",
            theme_color: "#6366f1",
            icons: [
                {
                    src: "/icons/icon.svg",
                    sizes: "any",
                    type: "image/svg+xml",
                }
            ]
        }
    }
}
