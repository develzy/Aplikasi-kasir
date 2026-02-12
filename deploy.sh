#!/bin/bash
set -e

echo "🚀 Starting Cloudflare Pages deployment..."

# Set PATH to include npm
export PATH="/c/Program Files/nodejs:$PATH"

cd /d/KasZy

echo "📦 Building with @cloudflare/next-on-pages..."
npx @cloudflare/next-on-pages@1

echo "✅ Build complete!"
echo "🚀 Deploying to Cloudflare Pages..."

npx wrangler pages deploy .vercel/output/static --project-name=kas-umkm

echo "✅ Deployment complete!"
