"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);

            // Show prompt after a delay or based on some logic
            const hasBeenDismissed = localStorage.getItem("pwa-dismissed");
            if (!hasBeenDismissed) {
                setTimeout(() => setShowPrompt(true), 5000);
            }
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            console.log("User accepted the install prompt");
        } else {
            console.log("User dismissed the install prompt");
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem("pwa-dismissed", "true");
    };

    if (!showPrompt) return null;

    return (
        <div className="install-banner">
            <div className="install-content">
                <div className="install-icon">
                    <Download size={20} />
                </div>
                <div className="install-text">
                    <div className="install-title">Install KasUMKM</div>
                    <div className="install-desc">Akses cepat & fitur offline di layar utama Anda.</div>
                </div>
            </div>
            <div className="install-actions">
                <button className="btn-install" onClick={handleInstall}>Install</button>
                <button className="btn-close" onClick={handleDismiss}><X size={18} /></button>
            </div>

            <style jsx>{`
                .install-banner {
                    position: fixed;
                    bottom: 90px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: calc(100% - 2rem);
                    max-width: 500px;
                    background: var(--glass-bg);
                    backdrop-filter: blur(12px);
                    border: 1px solid var(--card-border);
                    border-radius: var(--radius-lg);
                    padding: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    z-index: 9999;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                    animation: slideUp 0.5s ease;
                }
                @keyframes slideUp {
                    from { transform: translate(-50%, 100%); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
                .install-content {
                    display: flex;
                    gap: 0.75rem;
                    align-items: center;
                }
                .install-icon {
                    width: 40px;
                    height: 40px;
                    background: var(--primary);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                .install-title {
                    font-weight: 700;
                    font-size: 0.95rem;
                }
                .install-desc {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }
                .install-actions {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .btn-install {
                    background: var(--primary);
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 0.85rem;
                    cursor: pointer;
                }
                .btn-close {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: 0.25rem;
                }
            `}</style>
        </div>
    );
}
