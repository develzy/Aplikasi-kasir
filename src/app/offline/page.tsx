"use client";

import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg)',
            padding: '2rem'
        }}>
            <div className="card" style={{
                maxWidth: '500px',
                padding: '3rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(245, 158, 11, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--warning)'
                }}>
                    <WifiOff size={40} />
                </div>

                <div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                        Anda Sedang Offline
                    </h1>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        Koneksi internet Anda terputus. Beberapa fitur mungkin tidak tersedia,
                        tetapi Anda masih dapat melihat data yang sudah di-cache.
                    </p>
                </div>

                <button
                    className="btn-primary"
                    onClick={handleRefresh}
                    style={{
                        padding: '0.75rem 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <RefreshCw size={18} />
                    <span>Coba Lagi</span>
                </button>

                <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'rgba(99, 102, 241, 0.05)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)'
                }}>
                    <strong style={{ color: 'var(--primary)' }}>💡 Tips:</strong> Transaksi yang Anda buat saat offline
                    akan otomatis tersinkronisasi ketika koneksi kembali.
                </div>
            </div>
        </div>
    );
}
