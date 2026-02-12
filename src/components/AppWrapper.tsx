"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import { ToastProvider } from "@/context/ToastContext";
import OnlineStatusIndicator from "@/components/OnlineStatusIndicator";
import InstallPrompt from "@/components/InstallPrompt";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";
    const isOnboardingPage = pathname === "/onboarding";

    useEffect(() => {
        const checkSettings = async () => {
            // Skip check on login or onboarding pages
            if (isLoginPage || isOnboardingPage) return;

            try {
                const res = await fetch('/api/settings');
                const settings = await res.json() as any;

                // If logo is missing or still default (null/empty), redirect to onboarding
                if (!settings.logoUrl) {
                    router.push('/onboarding');
                }
            } catch (error) {
                console.error("Failed to check settings:", error);
            }
        };

        checkSettings();
    }, [pathname, isLoginPage, isOnboardingPage, router]);

    if (isLoginPage || isOnboardingPage) {
        return (
            <ToastProvider>
                <>{children}</>
            </ToastProvider>
        );
    }

    return (
        <ToastProvider>
            <OnlineStatusIndicator />
            <Sidebar />
            <main className="main-content">
                <div style={{ padding: "1.5rem", paddingBottom: "80px" }}>
                    {children}
                </div>
            </main>
            <BottomNav />
            <InstallPrompt />
            <style jsx global>{`
        .main-content {
          margin-left: var(--sidebar-width);
          min-height: 100vh;
          transition: margin 0.3s ease;
        }
        @media (max-width: 1023px) {
          .main-content {
            margin-left: 0;
          }
        }
      `}</style>
        </ToastProvider>
    );
}
