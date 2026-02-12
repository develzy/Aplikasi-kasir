@echo off
echo Building for Cloudflare Pages...
call npx @cloudflare/next-on-pages@1
if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    exit /b %ERRORLEVEL%
)
echo Build successful!
echo Deploying to Cloudflare Pages...
call npx wrangler pages deploy .vercel/output/static --project-name=kas-umkm
