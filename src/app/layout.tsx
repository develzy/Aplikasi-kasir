import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import AppWrapper from "@/components/AppWrapper";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#020617", // Updated to match new background
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "KasUMKM | Pencatatan Keuangan Modern",
  description: "Aplikasi pencatatan keuangan dan kasir modern untuk UMKM",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KasUMKM",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${outfit.variable} font-sans`}>
        <ServiceWorkerRegistration />
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
