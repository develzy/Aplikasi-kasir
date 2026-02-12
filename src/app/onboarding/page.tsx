"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { Store, Upload, Loader2, Save } from "lucide-react";

export default function OnboardingPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        storeName: "",
        logoUrl: ""
    });
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            showToast("Ukuran file maksimal 5MB", "error");
            return;
        }

        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            showToast("Format file harus PNG, JPG, atau WebP", "error");
            return;
        }

        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('username', formData.storeName || 'default');

        try {
            const res = await fetch('/api/upload-logo', {
                method: 'POST',
                body: formDataUpload
            });

            const data = await res.json() as { success?: boolean; logoUrl?: string; error?: string };

            if (data.success && data.logoUrl) {
                setFormData(prev => ({ ...prev, logoUrl: data.logoUrl! }));
                showToast("Logo berhasil diunggah");
            } else {
                showToast(data.error || "Gagal mengunggah logo", "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Terjadi kesalahan upload", "error");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.logoUrl) {
            showToast("Logo toko wajib diisi", "error");
            return;
        }

        if (!formData.storeName) {
            showToast("Nama toko wajib diisi", "error");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                showToast("Pengaturan toko berhasil disimpan");
                router.push('/'); // Redirect to dashboard
                // Force reload to update context/manifest if needed
                window.location.href = '/';
            } else {
                showToast("Gagal menyimpan pengaturan", "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Terjadi kesalahan", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--background)',
            padding: '1.5rem'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '64px', height: '64px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--primary)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <Store size={32} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Selamat Datang di KasUMKM</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Silakan lengkapi identitas toko Anda sebelum memulai.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Store Name Input */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                            Nama Toko
                        </label>
                        <div className="input-with-icon">
                            <Store size={18} className="input-icon" />
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Masukkan nama toko Anda"
                                value={formData.storeName}
                                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Logo Upload */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                            Logo Toko <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <div
                            className="card"
                            style={{
                                padding: '1.5rem',
                                border: '1px dashed var(--card-border)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '1rem',
                                background: 'rgba(255,255,255,0.02)',
                                cursor: 'pointer',
                                position: 'relative'
                            }}
                            onClick={() => document.getElementById('logo-upload')?.click()}
                        >
                            {formData.logoUrl ? (
                                <img
                                    src={formData.logoUrl}
                                    alt="Logo Preview"
                                    style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '8px' }}
                                />
                            ) : (
                                <div style={{
                                    width: '64px', height: '64px',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Upload size={24} color="var(--text-muted)" />
                                </div>
                            )}

                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                                    {uploading ? 'Mengunggah...' : formData.logoUrl ? 'Ganti Logo' : 'Upload Logo'}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    Dukungan: PNG, JPG, WebP (Max 5MB)
                                </p>
                            </div>

                            <input
                                id="logo-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                style={{ display: 'none' }}
                                disabled={uploading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ justifyContent: 'center', padding: '1rem' }}
                        disabled={submitting || uploading || !formData.logoUrl || !formData.storeName}
                    >
                        {submitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>Menyimpan...</span>
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                <span>Mulai Sekarang</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
            <style jsx>{`
                .input-with-icon {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .input-icon {
                    position: absolute;
                    left: 1rem;
                    color: var(--text-muted);
                }
                .input-field {
                    width: 100%;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--card-border);
                    border-radius: var(--radius-md);
                    padding: 0.75rem 1rem 0.75rem 2.75rem;
                    color: #fff;
                    font-size: 0.9375rem;
                    outline: none;
                    transition: all 0.2s ease;
                }
                .input-field:focus {
                    border-color: var(--primary);
                    background: rgba(255,255,255,0.08);
                }
            `}</style>
        </div>
    );
}
