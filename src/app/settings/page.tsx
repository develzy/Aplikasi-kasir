"use client";

import { useEffect, useState } from "react";
import {
    Store,
    MapPin,
    Phone,
    CreditCard as Currency,
    Save,
    CheckCircle,
    Smartphone,
    Layers,
    Plus,
    Trash2,
    Bell,
    ShieldCheck,
    Upload,
    Loader2
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function SettingsPage() {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        storeName: "",
        address: "",
        phone: "",
        currency: "IDR",
        logoUrl: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [activeTab, setActiveTab] = useState<'profile' | 'categories' | 'notifications' | 'security' | 'mobile'>('profile');
    const [categories, setCategories] = useState<any[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [uploading, setUploading] = useState(false);

    // Additional settings states
    const [notifications, setNotifications] = useState({
        orderEmail: true,
        stockAlert: true,
        weeklyReport: false
    });

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                const json = await res.json() as any;
                setFormData({
                    storeName: json.storeName || "",
                    address: json.address || "",
                    phone: json.phone || "",
                    currency: json.currency || "IDR",
                    logoUrl: json.logoUrl || ""
                });
            } catch (err) {
                console.error(err);
            }
        };

        const loadCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                const json = await res.json();
                if (Array.isArray(json)) {
                    setCategories(json);
                } else {
                    setCategories([]);
                }
            } catch (err) {
                console.error(err);
                setCategories([]);
            }
        };

        Promise.all([loadSettings(), loadCategories()]).finally(() => setLoading(false));
    }, []);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validasi ukuran file (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showToast("Ukuran file maksimal 5MB", "error");
            return;
        }

        // Validasi tipe file
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            showToast("Format file harus PNG, JPG, atau WebP", "error");
            return;
        }

        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('username', formData.storeName || 'default'); // Gunakan nama toko sebagai username

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
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowSuccess(true);
                showToast("Pengaturan disimpan");
                window.dispatchEvent(new Event('settingsUpdated'));
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (err) {
            showToast("Gagal menyimpan pengaturan", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Memuat pengaturan...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Pengaturan Toko</h1>
                <p style={{ color: 'var(--text-muted)' }}>Sesuaikan identitas bisnis Anda agar muncul di struk dan laporan.</p>
            </header>

            <div className="settings-layout">
                {/* Sidebar Settings */}
                <aside className="settings-sidebar">
                    <button
                        className={`card sidebar-btn ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <Store size={18} />
                        <span>Profil Toko</span>
                    </button>
                    <button
                        className={`card sidebar-btn ${activeTab === 'categories' ? 'active' : ''}`}
                        onClick={() => setActiveTab('categories')}
                    >
                        <Layers size={18} />
                        <span>Kategori Produk</span>
                    </button>
                    <button
                        className={`card sidebar-btn ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <Bell size={18} />
                        <span>Notifikasi</span>
                    </button>
                    <button
                        className={`card sidebar-btn ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <ShieldCheck size={18} />
                        <span>Keamanan</span>
                    </button>
                    <button
                        className={`card sidebar-btn ${activeTab === 'mobile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('mobile')}
                    >
                        <Smartphone size={18} />
                        <span>Tampilan Mobile</span>
                    </button>
                </aside>

                {/* Main Settings Form */}
                {/* Main Settings Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {activeTab === 'profile' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Live Preview Card */}
                            <div className="card branding-preview">
                                <div className="preview-label">Live Preview Struk & Branding</div>
                                <div className="preview-content">
                                    <div className="preview-logo">
                                        {formData.logoUrl ? (
                                            <img src={formData.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <Store size={32} />
                                        )}
                                    </div>
                                    <div className="preview-info">
                                        <h3>{formData.storeName || "Nama Toko"}</h3>
                                        <p>{formData.address || "Alamat Toko"}</p>
                                        <p>{formData.phone || "No. Telepon"}</p>
                                    </div>
                                    <div className="tier-pill">BUSINESS PLAN</div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="card minimalism-form">
                                <div className="form-section-title">Informasi Dasar</div>

                                <div className="input-group">
                                    <label>Logo Toko</label>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        {/* Preview Small */}
                                        <div
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: 'var(--radius-md)',
                                                overflow: 'hidden',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid var(--card-border)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}
                                        >
                                            {formData.logoUrl ? (
                                                <img src={formData.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <Store size={32} color="var(--text-muted)" />
                                            )}
                                        </div>

                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    type="button"
                                                    className="btn-primary"
                                                    style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'var(--card-border)', flex: 1 }}
                                                    onClick={() => document.getElementById('logo-upload')?.click()}
                                                    disabled={uploading}
                                                >
                                                    {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                                                    <span>{uploading ? 'Mengunggah...' : 'Pilih File Logo'}</span>
                                                </button>
                                                <input
                                                    id="logo-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    onChange={handleLogoUpload}
                                                />
                                            </div>

                                            <input
                                                type="url"
                                                value={formData.logoUrl}
                                                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                                placeholder="Atau tempel URL gambar (https://...)"
                                                style={{ fontSize: '0.85rem' }}
                                            />
                                            <span className="input-hint">Format: JPG, PNG, WebP. Maksimal 5MB.</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label>Nama Bisnis</label>
                                    <input
                                        type="text"
                                        value={formData.storeName}
                                        onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                                        placeholder="Nama Toko Anda"
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Alamat Operasional</label>
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Tuliskan alamat lengkap..."
                                        style={{ minHeight: '100px' }}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="input-group">
                                        <label>No. WhatsApp / Telp</label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="0812..."
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Mata Uang</label>
                                        <select
                                            value={formData.currency}
                                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                        >
                                            <option value="IDR">Rupiah (IDR)</option>
                                            <option value="USD">US Dollar (USD)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-footer">
                                    <div className={`status-msg ${showSuccess ? 'visible' : ''}`}>
                                        <CheckCircle size={16} />
                                        Tersimpan
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        disabled={saving}
                                    >
                                        {saving ? "Menyimpan..." : <><Save size={18} /><span>Simpan Perubahan</span></>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : activeTab === 'notifications' ? (
                        <div className="card minimalism-form">
                            <h3 style={{ marginBottom: '1.5rem' }}>Pengaturan Notifikasi</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="toggle-group">
                                    <div>
                                        <div style={{ fontWeight: '600' }}>Notifikasi Transaksi</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Terima notifikasi untuk setiap penjualan baru.</div>
                                    </div>
                                    <input type="checkbox" checked={notifications.orderEmail} onChange={() => setNotifications({ ...notifications, orderEmail: !notifications.orderEmail })} />
                                </div>
                                <div className="toggle-group">
                                    <div>
                                        <div style={{ fontWeight: '600' }}>Alert Stok Menipis</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Dapatkan peringatan ketika stok barang di bawah 10 unit.</div>
                                    </div>
                                    <input type="checkbox" checked={notifications.stockAlert} onChange={() => setNotifications({ ...notifications, stockAlert: !notifications.stockAlert })} />
                                </div>
                                <div className="toggle-group">
                                    <div>
                                        <div style={{ fontWeight: '600' }}>Laporan Mingguan</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Kirim ringkasan peforma bisnis di akhir pekan.</div>
                                    </div>
                                    <input type="checkbox" checked={notifications.weeklyReport} onChange={() => setNotifications({ ...notifications, weeklyReport: !notifications.weeklyReport })} />
                                </div>
                            </div>
                            <div className="form-footer">
                                <button className="btn-primary" onClick={() => showToast("Preferensi notifikasi disimpan")}>
                                    <Save size={18} />
                                    <span>Simpan Preferensi</span>
                                </button>
                            </div>
                        </div>
                    ) : activeTab === 'security' ? (
                        <div className="card minimalism-form">
                            <h3 style={{ marginBottom: '1rem', color: 'var(--danger)' }}>Zona Bahaya</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                                Tindakan di bawah ini bersifat permanen dan tidak dapat dibatalkan. Mohon berhati-hati.
                            </p>

                            <div style={{ background: 'rgba(244, 63, 94, 0.05)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                                <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Hapus Semua Data Transaksi</div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                    Ini akan menghapus seluruh riwayat penjualan Anda namun tetap menyisakan daftar produk.
                                </p>
                                <button
                                    className="btn-primary"
                                    style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }}
                                    onClick={() => confirm("Hapus SEMUA riwayat transaksi? Data tidak bisa dikembalikan.") && showToast("Data dibersihkan (Demo)")}
                                >
                                    Bersihkan Riwayat
                                </button>
                            </div>
                        </div>
                    ) : activeTab === 'mobile' ? (
                        <div className="card minimalism-form">
                            <h3 style={{ marginBottom: '1.5rem' }}>Integrasi Mobile PWA</h3>
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <Smartphone size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                                <h4 style={{ marginBottom: '0.5rem' }}>Gunakan KasZy di Handphone</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                                    Aplikasi ini mendukung PWA (Progressive Web App). Anda bisa menginstalnya langsung di layar utama smartphone Anda.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left' }}>
                                    <div className="card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                                        <div style={{ fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Android / Chrome</div>
                                        <ol style={{ fontSize: '0.75rem', paddingLeft: '1.25rem', color: 'var(--text-muted)' }}>
                                            <li>Klik menu titik tiga di Chrome</li>
                                            <li>Pilih "Install App" atau "Add to Home Screen"</li>
                                        </ol>
                                    </div>
                                    <div className="card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                                        <div style={{ fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.5rem' }}>iOS / Safari</div>
                                        <ol style={{ fontSize: '0.75rem', paddingLeft: '1.25rem', color: 'var(--text-muted)' }}>
                                            <li>Klik ikon "Share" di bawah</li>
                                            <li>Pilih "Add to Home Screen"</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="card" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Manajemen Kategori</h3>

                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                                <input
                                    type="text"
                                    placeholder="Nama kategori baru..."
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '0.75rem', border: '1px solid var(--card-border)', color: '#fff', borderRadius: 'var(--radius-md)' }}
                                />
                                <button
                                    className="btn-primary"
                                    onClick={async () => {
                                        if (!newCategory) return;
                                        const res = await fetch('/api/categories', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ name: newCategory })
                                        });
                                        if (res.ok) {
                                            const json = await res.json();
                                            setCategories([...categories, json]);
                                            setNewCategory("");
                                            showToast("Kategori ditambahkan");
                                        }
                                    }}
                                >
                                    <Plus size={18} />
                                    <span>Tambah</span>
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {Array.isArray(categories) && categories.map(cat => (
                                    <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <Layers size={18} color="var(--primary)" />
                                            <span style={{ fontWeight: '500' }}>{cat.name}</span>
                                        </div>
                                        <button
                                            style={{ color: 'var(--danger)', background: 'none' }}
                                            onClick={async () => {
                                                if (!confirm("Hapus kategori ini?")) return;
                                                const res = await fetch(`/api/categories?id=${cat.id}`, { method: 'DELETE' });
                                                if (res.ok) {
                                                    setCategories(categories.filter(c => c.id !== cat.id));
                                                    showToast("Kategori dihapus");
                                                }
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="card" style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px dashed var(--success)' }}>
                        <h4 style={{ color: 'var(--success)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Tip Profesional</h4>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>
                            {activeTab === 'profile'
                                ? "Pastikan alamat dan nomor telepon akurat agar pelanggan dapat menghubungi Anda kembali melalui informasi yang tertera di struk belanja."
                                : "Kategori yang rapi memudahkan Anda dalam mencari produk di halaman Kasir dan melihat laporan performa per jenis barang."}
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .settings-layout {
                    display: grid;
                    grid-template-columns: 250px 1fr;
                    gap: 3rem;
                }
                .settings-sidebar {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .sidebar-btn {
                    padding: 0.75rem 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    border: none;
                    cursor: pointer;
                    text-align: left;
                    transition: all 0.2s ease;
                    background: none;
                    color: var(--text-muted);
                }
                .sidebar-btn:hover {
                    background: rgba(255,255,255,0.05);
                }
                .sidebar-btn.active {
                    background: rgba(99, 102, 241, 0.1) !important;
                    color: var(--primary) !important;
                    font-weight: 600;
                }
                .sidebar-btn.gray {
                    opacity: 0.5;
                    cursor: default;
                }
                .sidebar-btn.gray:hover { background: none; }
                
                .branding-preview {
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 2rem;
                    position: relative;
                    overflow: hidden;
                }
                
                .preview-label {
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--primary);
                    margin-bottom: 1.5rem;
                }
                
                .preview-content {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                
                .preview-logo {
                    width: 64px;
                    height: 64px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: var(--radius-lg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                    flex-shrink: 0;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .preview-info h3 {
                    margin: 0 0 0.25rem 0;
                    font-size: 1.25rem;
                    color: #fff;
                }
                
                .preview-info p {
                    margin: 0;
                    font-size: 0.85rem;
                    color: var(--text-muted);
                }
                
                .tier-pill {
                    margin-left: auto;
                    font-size: 0.65rem;
                    font-weight: 800;
                    padding: 0.35rem 0.75rem;
                    background: var(--primary);
                    color: #fff;
                    border-radius: 999px;
                    letter-spacing: 0.05em;
                }
                
                .minimalism-form {
                    padding: 2.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.75rem;
                }
                
                .form-section-title {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #fff;
                    margin-bottom: 0.5rem;
                }
                
                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.6rem;
                }
                
                .input-group label {
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: var(--text-muted);
                }
                
                .input-group input, .input-group textarea, .input-group select {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--card-border);
                    border-radius: var(--radius-md);
                    padding: 0.75rem 1rem;
                    color: #fff;
                    font-size: 0.95rem;
                    transition: all 0.2s ease;
                    outline: none;
                    font-family: inherit;
                }
                
                .input-group input:focus, .input-group textarea:focus {
                    background: rgba(255, 255, 255, 0.06);
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                }
                
                .input-hint {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }
                
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                
                .form-footer {
                    margin-top: 1rem;
                    padding-top: 2rem;
                    border-top: 1px solid var(--card-border);
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    gap: 1.5rem;
                }
                
                .status-msg {
                    color: var(--success);
                    font-size: 0.85rem;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    opacity: 0;
                    transform: translateX(10px);
                    transition: all 0.3s ease;
                }
                
                .status-msg.visible {
                    opacity: 1;
                    transform: translateX(0);
                }

                .toggle-group {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid var(--card-border);
                    border-radius: var(--radius-md);
                }

                .toggle-group input[type="checkbox"] {
                    width: 40px;
                    height: 20px;
                    cursor: pointer;
                }
                
                .settings-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                @media (max-width: 768px) {
                    .settings-layout {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
                    .settings-sidebar {
                        display: none;
                    }
                    .settings-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                }
            `}</style>
        </div>
    );
}
