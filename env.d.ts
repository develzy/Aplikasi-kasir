interface CloudflareEnv {
    DB: D1Database;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
}

declare global {
    namespace NodeJS {
        interface ProcessEnv extends CloudflareEnv { }
    }
}
