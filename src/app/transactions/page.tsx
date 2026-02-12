"use client";

import { useEffect, useState } from "react";
import { Filter, Download, ArrowUpRight, ArrowDownLeft, MoreVertical, Search, Plus } from "lucide-react";
import { Skeleton } from "@/components/Skeleton";
import { exportToCSV } from "@/utils/export";

interface Transaction {
    id: number;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    date: string;
    status: string;
    note: string;
}

export default function TransactionsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/transactions')
            .then(res => res.json())
            .then((data) => {
                setTransactions(data as Transaction[]);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch transactions:", err);
                setLoading(false);
            });
    }, []);

    const filteredTransactions = transactions.filter(tx =>
        tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.note?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <header className="transactions-header">
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Riwayat Transaksi</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Kelola dan pantau semua aliran dana bisnis Anda.</p>
                </div>
                <div className="transactions-actions">
                    <button
                        className="card"
                        style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        onClick={() => exportToCSV(transactions, `transaksi-${new Date().toISOString().split('T')[0]}.csv`)}
                    >
                        <Download size={18} />
                        <span>Ekspor CSV</span>
                    </button>
                    <button className="btn-primary">
                        <Plus size={18} />
                        <span>Tambah Transaksi</span>
                    </button>
                </div>
            </header>

            <div className="card" style={{ marginBottom: '2rem', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="search-box">
                        <Search size={18} color="var(--text-muted)" />
                        <input
                            type="text"
                            placeholder="Cari kategori atau catatan..."
                            style={{ background: 'none', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '1.5rem' }}>
                        <Skeleton height="40px" className="skeleton-title" />
                        <Skeleton height="80px" style={{ marginBottom: '1rem' }} />
                        <Skeleton height="80px" style={{ marginBottom: '1rem' }} />
                        <Skeleton height="80px" style={{ marginBottom: '1rem' }} />
                        <Skeleton height="80px" style={{ marginBottom: '1rem' }} />
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <table className="transactions-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.02)' }}>
                                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>TRANSAKSI</th>
                                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>KATEGORI</th>
                                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>TANGGAL</th>
                                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>STATUS</th>
                                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>JUMLAH</th>
                                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((tx) => (
                                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--card-border)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '12px',
                                                    background: tx.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)'
                                                }}>
                                                    {tx.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600' }}>{tx.note || tx.category}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TXID-{tx.id}00241</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: 'var(--radius-sm)',
                                                background: 'rgba(255,255,255,0.05)',
                                                fontSize: '0.8rem',
                                                fontWeight: 500
                                            }}>
                                                {tx.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{tx.date}</td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <span className="badge badge-success" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>{tx.status}</span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right', fontWeight: '700', color: tx.type === 'income' ? 'var(--success)' : '#fff' }}>
                                            {tx.type === 'income' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                            <button style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><MoreVertical size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile Card View */}
                        <div className="transactions-cards">
                            {filteredTransactions.map((tx) => (
                                <div key={tx.id} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '12px',
                                                background: tx.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)'
                                            }}>
                                                {tx.type === 'income' ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '600', fontSize: '1.05rem', marginBottom: '0.25rem' }}>{tx.note || tx.category}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TXID-{tx.id}00241</div>
                                            </div>
                                        </div>
                                        <button style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
                                            <MoreVertical size={20} />
                                        </button>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Kategori</div>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: 'var(--radius-sm)',
                                                background: 'rgba(255,255,255,0.05)',
                                                fontSize: '0.8rem',
                                                fontWeight: 500,
                                                display: 'inline-block'
                                            }}>
                                                {tx.category}
                                            </span>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Status</div>
                                            <span className="badge badge-success" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>{tx.status}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--card-border)' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.date}</div>
                                        <div style={{ fontWeight: '700', fontSize: '1.25rem', color: tx.type === 'income' ? 'var(--success)' : '#fff' }}>
                                            {tx.type === 'income' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <style jsx>{`
                .transactions-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .transactions-actions {
                    display: flex;
                    gap: 0.75rem;
                }
                .search-box {
                    position: relative;
                    background: rgba(255,255,255,0.05);
                    padding: 0.5rem 1rem;
                    border-radius: var(--radius-md);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    width: 400px;
                    max-width: 100%;
                }
                .transactions-table {
                    display: table;
                }
                .transactions-cards {
                    display: none;
                }
                @media (max-width: 768px) {
                    .transactions-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                    }
                    .transactions-actions {
                        width: 100%;
                        flex-direction: column;
                    }
                    .transactions-actions button {
                        width: 100%;
                        justify-content: center;
                    }
                    .search-box {
                        width: 100%;
                    }
                    .transactions-table {
                        display: none;
                    }
                    .transactions-cards {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                        padding: 1rem;
                    }
                }
            `}</style>
        </div>
    );
}
