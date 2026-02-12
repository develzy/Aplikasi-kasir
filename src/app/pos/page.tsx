"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Trash2,
    Plus,
    Minus,
    CreditCard,
    Banknote,
    User,
    ChevronRight,
    Filter,
    LayoutGrid,
    List,
    AlignLeft
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { Skeleton } from "@/components/Skeleton";

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    stock: number;
}

interface CartItem extends Product {
    quantity: number;
}

export default function POSPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("Semua");
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'list'>('grid');

    const [storeSettings, setStoreSettings] = useState<any>(null);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchProducts = () => {
            fetch('/api/products')
                .then(res => res.json())
                .then(data => {
                    setProducts(data as Product[]);
                });
        };

        const fetchCategories = () => {
            fetch('/api/categories')
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setCategories(data);
                    } else {
                        setCategories([]);
                    }
                })
                .catch(() => setCategories([]));
        };

        const fetchSettings = () => {
            fetch('/api/settings')
                .then(res => res.json())
                .then(data => {
                    setStoreSettings(data);
                    setLoading(false);
                });
        };

        // Initial fetch
        fetchProducts();
        fetchCategories();
        fetchSettings();

        // Poll every 10 seconds for products (realtime stock updates)
        const interval = setInterval(fetchProducts, 10000);
        return () => clearInterval(interval);
    }, []);

    const addToCart = (product: Product) => {
        if (product.stock <= 0) return showToast("Stok habis!", "error");
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        showToast(`Ditambahkan: ${product.name}`);
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const [showReceipt, setShowReceipt] = useState(false);
    const [lastOrder, setLastOrder] = useState<any>(null);

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        setLoading(true);
        try {
            const orderData = {
                type: 'income',
                category: 'Penjualan POS',
                amount: total,
                note: `Penjualan ${cart.length} item: ${cart.map(i => i.name).join(', ')}`,
                items: cart.map(i => ({ id: i.id, quantity: i.quantity }))
            };

            // Create transaction
            await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            setLastOrder({
                items: [...cart],
                subtotal,
                tax,
                total,
                date: new Date().toLocaleString('id-ID'),
                id: Math.floor(Math.random() * 10000)
            });

            setCart([]);
            setShowReceipt(true);

            // Refresh products (stocks)
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data as Product[]);
        } catch (err) {
            showToast("Gagal memproses transaksi", "error");
        } finally {
            setLoading(false);
        }
    };

    const printReceipt = () => {
        window.print();
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "Semua" || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="pos-layout" style={{ display: 'grid', gap: '2rem', height: 'calc(100vh - 4rem)' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <header className="pos-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h1 className="section-title" style={{ fontSize: '1.75rem' }}>Kasir POS</h1>
                            <p className="section-desc">Pilih produk untuk pesanan baru.</p>
                        </div>
                        <div className="view-selector">
                            <button
                                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button
                                className={`view-btn ${viewMode === 'compact' ? 'active' : ''}`}
                                onClick={() => setViewMode('compact')}
                            >
                                <List size={18} />
                            </button>
                            <button
                                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <AlignLeft size={18} />
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="pos-search-container">
                            <Search size={18} color="var(--text-muted)" />
                            <input
                                type="text"
                                placeholder="Cari barcode atau nama produk..."
                                className="pos-search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="category-scroll">
                            <button
                                className={`category-pill ${selectedCategory === "Semua" ? 'active' : ''}`}
                                onClick={() => setSelectedCategory("Semua")}
                            >
                                Semua
                            </button>
                            {Array.isArray(categories) && categories.map(cat => (
                                <button
                                    key={cat.id}
                                    className={`category-pill ${selectedCategory === cat.name ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(cat.name)}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                <div className={`pos-products-grid view-${viewMode}`}>
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="card" style={{ padding: '0.75rem' }}>
                                <Skeleton height="120px" style={{ marginBottom: '0.75rem' }} />
                                <Skeleton height="1.25rem" width="70%" style={{ marginBottom: '0.5rem' }} />
                                <Skeleton height="1rem" width="40%" />
                            </div>
                        ))
                    ) : filteredProducts.length === 0 ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                            Tidak ada produk yang ditemukan.
                        </div>
                    ) : filteredProducts.map(product => (
                        <button
                            key={product.id}
                            className={`product-card ${product.stock <= 0 ? 'out-of-stock' : ''} mode-${viewMode}`}
                            onClick={() => addToCart(product)}
                            disabled={product.stock <= 0}
                        >
                            <div className="product-image">
                                {product.category === 'Coffee' ? '☕' : product.category === 'Snack' ? '🥐' : '📦'}
                                {product.stock <= 5 && product.stock > 0 && <span className="stock-badge">Stok Terbatas</span>}
                            </div>
                            <div className="product-info">
                                <span className="product-name">{product.name}</span>
                                <span className="product-price">Rp {product.price.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="product-footer">
                                <span style={{ color: product.stock <= 5 ? 'var(--warning)' : 'var(--text-muted)' }}>
                                    {product.stock} Tersedia
                                </span>
                                <Plus size={16} color="var(--primary)" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem 0' }}>
                <div style={{ padding: '0 1.5rem', marginBottom: '1rem' }}>
                    <h3>Pesanan Saat Ini</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', marginTop: '0.75rem' }}>
                        <User size={16} color="var(--primary)" />
                        <span>Pelanggan Umum</span>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.5rem' }}>
                    {cart.length === 0 ? (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            <p>Keranjang kosong</p>
                        </div>
                    ) : cart.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{item.name}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                                    <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '4px' }}><Minus size={14} /></button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '4px' }}><Plus size={14} /></button>
                                    <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: 'auto', color: 'var(--danger)', background: 'none', border: 'none' }}><Trash2 size={14} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <span style={{ fontWeight: '700' }}>Total</span>
                        <span style={{ fontWeight: '700', fontSize: '1.25rem' }}>Rp {total.toLocaleString('id-ID')}</span>
                    </div>
                    <button
                        className="btn-primary"
                        style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || loading}
                    >
                        {loading ? "Memproses..." : "Bayar Sekarang"}
                    </button>
                </div>
            </div>

            <style jsx global>{`
                .pos-layout {
                    grid-template-columns: 1fr 400px;
                    height: calc(100vh - 4rem) !important;
                }
                
                .pos-search {
                    background: var(--card-bg);
                    padding: 0.875rem 1.25rem;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--card-border);
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    transition: all 0.2s ease;
                }
                
                .pos-layout {
                    display: grid;
                    grid-template-columns: 1fr 380px;
                    gap: 2rem;
                    height: calc(100vh - 4rem);
                }

                .pos-main {
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .pos-header {
                    margin-bottom: 2rem;
                }

                .pos-search-container {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--card-border);
                    border-radius: var(--radius-md);
                    padding: 0.75rem 1.25rem;
                    transition: var(--transition-base);
                    margin-bottom: 1.5rem;
                }

                .pos-search-container:focus-within {
                    border-color: var(--primary);
                    background: rgba(255, 255, 255, 0.05);
                }

                .pos-search-input {
                    background: none;
                    border: none;
                    color: #fff;
                    outline: none;
                    width: 100%;
                    font-size: 0.9375rem;
                }

                .category-scroll {
                    display: flex;
                    gap: 0.75rem;
                    overflow-x: auto;
                    padding-bottom: 0.5rem;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }

                .category-scroll::-webkit-scrollbar {
                    display: none;
                }

                .category-pill {
                    padding: 0.5rem 1.25rem;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--card-border);
                    border-radius: 999px;
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                    font-weight: 600;
                    white-space: nowrap;
                    transition: var(--transition-base);
                }

                .category-pill:hover {
                    background: rgba(255, 255, 255, 0.08);
                    color: #fff;
                }

                .category-pill.active {
                    background: var(--primary);
                    color: #fff;
                    border-color: var(--primary);
                }

                .pos-products-grid {
                    display: grid;
                    gap: 1.5rem;
                    overflow-y: auto;
                    padding-bottom: 2rem;
                }

                .pos-products-grid.view-grid {
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                }

                .pos-products-grid.view-compact {
                    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                    gap: 1rem;
                }

                .pos-products-grid.view-list {
                    grid-template-columns: 1fr;
                    gap: 0.75rem;
                }

                .product-card {
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    border-radius: var(--radius-lg);
                    padding: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    transition: var(--transition-base);
                }

                .product-card:hover:not(:disabled) {
                    transform: translateY(-4px);
                    border-color: rgba(255, 255, 255, 0.15);
                    background: rgba(255, 255, 255, 0.05);
                }

                .product-card.mode-compact {
                    padding: 0.875rem;
                    gap: 0.75rem;
                }

                .product-card.mode-list {
                    flex-direction: row;
                    align-items: center;
                    padding: 0.875rem 1.25rem;
                }

                .product-image {
                    height: 120px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: var(--radius-md);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    position: relative;
                }

                .mode-compact .product-image { height: 90px; font-size: 2rem; }
                .mode-list .product-image { height: 50px; width: 50px; font-size: 1.5rem; flex-shrink: 0; }

                .product-info { flex: 1; }
                .product-name { display: block; font-weight: 700; color: #fff; font-size: 0.9375rem; margin-bottom: 0.25rem; }
                .product-price { display: block; color: var(--primary); font-weight: 700; font-size: 1rem; }

                .mode-list .product-info { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }

                .product-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 0.875rem;
                    border-top: 1px solid var(--card-border);
                    font-size: 0.8125rem;
                    color: var(--text-muted);
                }

                .mode-list .product-footer { border: none; padding: 0; width: 80px; }

                .stock-badge {
                    position: absolute;
                    top: 0.5rem; right: 0.5rem;
                    background: var(--warning);
                    color: #000;
                    font-size: 0.625rem;
                    font-weight: 800;
                    padding: 0.2rem 0.5rem;
                    border-radius: 4px;
                    text-transform: uppercase;
                }

                .view-selector {
                    display: flex;
                    gap: 0.25rem;
                    background: rgba(255, 255, 255, 0.03);
                    padding: 0.25rem;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--card-border);
                }

                .view-btn {
                    padding: 0.5rem;
                    border-radius: 6px;
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .view-btn.active {
                    background: var(--primary);
                    color: #fff;
                }

                .pos-cart-container {
                    display: flex;
                    flex-direction: column;
                    padding: 1.5rem;
                    height: 100%;
                    background: var(--background);
                }

                @media (max-width: 1200px) {
                    .pos-layout {
                        grid-template-columns: 1fr;
                        height: auto;
                    }
                    .pos-products-grid {
                        max-height: 60vh;
                    }
                    .pos-cart-container {
                        height: auto;
                        min-height: 500px;
                    }
                }

                @media (max-width: 768px) {
                    .pos-products-grid {
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    }
                }
            `}</style>

            {/* Receipt Modal */}
            {showReceipt && lastOrder && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.8)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div className="card" style={{ width: '350px', padding: '2rem', background: '#fff', color: '#000' }} id="receipt-print">
                        <div style={{ textAlign: 'center', borderBottom: '1px dashed #ccc', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: '#000' }}>
                                {storeSettings?.storeName || "KasUMKM"}
                            </h2>
                            <p style={{ fontSize: '0.8rem' }}>{storeSettings?.address || "Jl. Digital No. 123"}</p>
                            <p style={{ fontSize: '0.8rem' }}>Telp: {storeSettings?.phone || "0812-3456-7890"}</p>
                        </div>

                        <div style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>ID Order:</span>
                                <span>#{lastOrder.id}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Tanggal:</span>
                                <span>{lastOrder.date}</span>
                            </div>
                        </div>

                        <div style={{ borderBottom: '1px dashed #ccc', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            {lastOrder.items.map((item: any) => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Subtotal:</span>
                                <span>Rp {lastOrder.subtotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Pajak (10%):</span>
                                <span>Rp {lastOrder.tax.toLocaleString('id-ID')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                                <span>TOTAL:</span>
                                <span>Rp {lastOrder.total.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', fontSize: '0.8rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                            Terima kasih telah berbelanja!
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem' }} className="no-print">
                            <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={printReceipt}>Cetak</button>
                            <button
                                className="card"
                                style={{ flex: 1, justifyContent: 'center', padding: '0.75rem', background: '#f1f5f9', color: '#000', border: '1px solid #ccc' }}
                                onClick={() => setShowReceipt(false)}
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
