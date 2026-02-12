"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function LoginPage() {
    const { showToast } = useToast();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simple mock auth for testing
        if (username === "admin" && password === "admin123") {
            document.cookie = "auth=true; path=/";
            setTimeout(() => {
                router.push("/");
            }, 1000);
        } else {
            showToast("Username atau Password salah!", "error");
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            background: 'var(--background)',
            zIndex: 1000,
            marginLeft: 0 // Override layout margin
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        background: 'linear-gradient(135deg, var(--primary), #818cf8)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)'
                    }}>
                        <ShieldCheck size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>KasUMKM</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Silakan masuk untuk mengelola bisnis Anda</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-muted)' }}>Username</label>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--card-border)'
                        }}>
                            <User size={18} color="var(--text-muted)" />
                            <input
                                type="text"
                                placeholder="admin"
                                style={{ background: 'none', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-muted)' }}>Password</label>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--card-border)'
                        }}>
                            <Lock size={18} color="var(--text-muted)" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                style={{ background: 'none', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{
                            width: '100%',
                            justifyContent: 'center',
                            padding: '1rem',
                            marginTop: '1rem',
                            fontSize: '1rem'
                        }}
                        disabled={loading}
                    >
                        {loading ? "Memproses..." : (
                            <>
                                <span>Masuk Sekarang</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Butuh bantuan? Hubungi IT Support
                </div>
            </div>
        </div>
    );
}
