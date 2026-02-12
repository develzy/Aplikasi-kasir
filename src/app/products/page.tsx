"use client";

import { useEffect, useState } from "react";
import { Trash, Edit, Plus, Search, Package, AlertCircle, Save, X } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { Skeleton } from "@/components/Skeleton";

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    stock: number;
}

export default function ProductsPage() {
    const { showToast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({ name: "", price: 0, stock: 0, category: "" });
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            if (Array.isArray(data)) {
                setCategories(data);
                if (data.length > 0 && !formData.category) {
                    setFormData(prev => ({ ...prev, category: data[0].name }));
                }
            } else {
                setCategories([]);
            }
        } catch (err) {
            console.error(err);
            setCategories([]);
        }
    };

    const fetchProducts = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await fetch('/api/products');
            const data = await res.json() as Product[];
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch products:", err);
            if (!silent) showToast("Gagal memuat produk", "error");
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();

        // Poll every 10s
        const interval = setInterval(() => fetchProducts(true), 10000);
        return () => clearInterval(interval);
    }, []);

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({ name: "", price: 0, category: categories[0]?.name || "", stock: 0 });
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            category: product.category,
            stock: product.stock
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingProduct ? 'PUT' : 'POST';
        const payload = editingProduct ? { ...formData, id: editingProduct.id } : formData;

        try {
            const res = await fetch('/api/products', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchProducts();
                showToast(`Produk ${editingProduct ? 'diperbarui' : 'ditambahkan'}`);
            }
        } catch (err) {
            showToast("Gagal menyimpan produk", "error");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
        try {
            const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchProducts();
                showToast("Produk berhasil dihapus");
            }
        } catch (err) {
            showToast("Gagal menghapus produk", "error");
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: products.length,
        lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
        outOfStock: products.filter(p => p.stock === 0).length
    };

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <header className="dashboard-header" style={{ marginBottom: '2.5rem' }}>
                <div>
                    <h1 className="section-title">Manajemen Produk</h1>
                    <p className="section-desc">Kelola inventaris dan harga produk UMKM Anda secara efisien.</p>
                </div>
                <button className="btn-primary" onClick={openAddModal}>
                    <Plus size={18} />
                    <span>Tambah Produk</span>
                </button>
            </header>

            <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height="100px" />)
                ) : (
                    <>
                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem' }}>
                            <div style={{ background: 'rgba(99, 102, 241, 0.08)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '10px' }}>
                                <Package size={22} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '0.25rem' }}>Total Produk</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', lineHeight: 1 }}>{stats.total}</div>
                            </div>
                        </div>
                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem' }}>
                            <div style={{ background: 'rgba(245, 158, 11, 0.08)', color: 'var(--warning)', padding: '0.75rem', borderRadius: '10px' }}>
                                <AlertCircle size={22} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '0.25rem' }}>Stok Menipis</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', lineHeight: 1 }}>{stats.lowStock}</div>
                            </div>
                        </div>
                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem' }}>
                            <div style={{ background: 'rgba(239, 68, 68, 0.08)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '10px' }}>
                                <Package size={22} style={{ opacity: 0.6 }} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '0.25rem' }}>Stok Habis</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', lineHeight: 1 }}>{stats.outOfStock}</div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
                    <div className="input-group-search" style={{ width: '320px', background: 'rgba(255,255,255,0.02)' }}>
                        <Search size={16} color="var(--text-muted)" />
                        <input
                            type="text"
                            placeholder="Cari produk atau kategori..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '2rem' }}>
                        <Skeleton height="40px" style={{ marginBottom: '1rem' }} />
                        <Skeleton height="50px" style={{ marginBottom: '0.75rem' }} />
                        <Skeleton height="50px" style={{ marginBottom: '0.75rem' }} />
                        <Skeleton height="50px" />
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.02)' }}>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Produk</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kategori</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Harga Jual</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stok</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((p) => (
                                    <tr key={p.id} className="table-row-hover" style={{ borderBottom: '1px solid var(--card-border)', transition: 'var(--transition-base)' }}>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ fontWeight: '700', color: '#fff' }}>{p.name}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>SKU-{p.id.toString().padStart(4, '0')}</div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{ padding: '0.25rem 0.6rem', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{p.category}</span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#fff' }}>Rp {p.price.toLocaleString('id-ID')}</td>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{p.stock}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '4px',
                                                fontSize: '0.65rem',
                                                fontWeight: '700',
                                                textTransform: 'uppercase',
                                                background: p.stock === 0 ? 'rgba(239, 68, 68, 0.1)' : p.stock <= 10 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                color: p.stock === 0 ? 'var(--danger)' : p.stock <= 10 ? 'var(--warning)' : 'var(--success)',
                                                border: `1px solid ${p.stock === 0 ? 'rgba(239, 68, 68, 0.2)' : p.stock <= 10 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                                            }}>
                                                {p.stock === 0 ? 'Habis' : p.stock <= 10 ? 'Menipis' : 'Ada'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button className="icon-btn-small" onClick={() => openEditModal(p)} title="Edit"><Edit size={14} /></button>
                                                <button className="icon-btn-small danger" onClick={() => handleDelete(p.id)} title="Hapus"><Trash size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style jsx>{`
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                }
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }
                .input-group-search {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem 1rem;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--card-border);
                    transition: var(--transition-base);
                }
                .input-group-search:focus-within {
                    border-color: var(--primary);
                }
                .search-input {
                    background: none;
                    border: none;
                    color: #fff;
                    font-size: 0.875rem;
                    outline: none;
                    width: 100%;
                }
                .icon-btn-small {
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 6px;
                    color: var(--text-secondary);
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--card-border);
                }
                .icon-btn-small:hover {
                    background: rgba(255,255,255,0.08);
                    color: #fff;
                    border-color: rgba(255,255,255,0.15);
                }
                .icon-btn-small.danger:hover {
                    background: rgba(239, 68, 68, 0.1);
                    color: var(--danger);
                    border-color: rgba(239, 68, 68, 0.2);
                }
                .table-row-hover:hover {
                    background: rgba(255,255,255,0.02);
                }
                @media (max-width: 1024px) {
                    .stats-grid { grid-template-columns: 1fr; gap: 1rem; }
                    .dashboard-header { flex-direction: column; gap: 1.5rem; }
                }
            `}</style>

            {/* Product Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(2, 6, 23, 0.85)', zIndex: 1000, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)'
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{editingProduct ? 'Edit Produk' : 'Tambah Produk'}</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Nama Produk</label>
                                <input
                                    type="text"
                                    className="input-base"
                                    placeholder="Contoh: Es Kopi Gula Aren"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Harga (Rp)</label>
                                    <input
                                        type="number"
                                        className="input-base"
                                        placeholder="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Stok</label>
                                    <input
                                        type="number"
                                        className="input-base"
                                        placeholder="0"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Kategori</label>
                                <select
                                    className="input-base"
                                    style={{ appearance: 'none' }}
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                >
                                    {Array.isArray(categories) && categories.length === 0 && <option value="">Belum ada kategori</option>}
                                    {Array.isArray(categories) && categories.map(cat => (
                                        <option key={cat.id} value={cat.name} style={{ background: '#1e293b' }}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                                <button
                                    type="button"
                                    className="btn-primary"
                                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: '#fff', boxShadow: 'none' }}
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Batal
                                </button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                                    <Save size={18} />
                                    <span>{editingProduct ? 'Simpan' : 'Tambah'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )
            }
        </div >
    );
}
