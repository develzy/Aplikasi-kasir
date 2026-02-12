import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import AppWrapper from "@/components/AppWrapper";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
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
    <html lang="en">
      <body className={outfit.className}>
        <ServiceWorkerRegistration />
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
