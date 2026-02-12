"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, BarChart3, Calendar, ArrowUpRight, ArrowDownRight, Download } from "lucide-react";
import { Skeleton } from "@/components/Skeleton";
import { exportToCSV } from "@/utils/export";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';

export default function ReportsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = (silent = false) => {
        if (!silent) setLoading(true);
        fetch('/api/reports')
            .then(res => res.json())
            .then(json => {
                setData(json);
                if (!silent) setLoading(false);
            })
            .catch(err => {
                console.error(err);
                if (!silent) setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => fetchData(true), 10000);
        return () => clearInterval(interval);
    }, []);

    // if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Memuat laporan...</div>;

    const COLORS = ['#6366f1', '#10b881', '#f59e0b', '#f43f5e', '#8b5cf6'];

    const chartDataArray = data?.chartData || [];
    const categoryDataArray = data?.categoryData || [];

    const totalIncome = chartDataArray.reduce((acc: number, cur: any) => acc + (cur.income || 0), 0) || 0;
    const totalExpense = chartDataArray.reduce((acc: number, cur: any) => acc + (cur.expense || 0), 0) || 0;
    const netProfit = totalIncome - totalExpense;
    const margin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Laporan Bisnis</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Analisis performa keuangan UMKM Anda.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        className="card"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', border: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.05)' }}
                        onClick={() => exportToCSV(chartDataArray, `laporan-bulanan-${new Date().getFullYear()}.csv`)}
                    >
                        <Download size={18} />
                        <span>CSV</span>
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}
                    >
                        <Download size={18} />
                        <span>Cetak Laporan</span>
                    </button>
                </div>
            </header>

            {/* Summary Cards */}
            <div className="reports-stats-grid">
                {loading ? (
                    <>
                        <Skeleton height="135px" />
                        <Skeleton height="135px" />
                        <Skeleton height="135px" />
                        <Skeleton height="135px" />
                    </>
                ) : (
                    <>
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '8px' }}>
                                    <TrendingUp size={20} />
                                </div>
                                <span style={{ color: 'var(--success)', fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>
                                    <ArrowUpRight size={14} /> 12%
                                </span>
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Pendapatan</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '0.25rem' }}>Rp {totalIncome.toLocaleString('id-ID')}</div>
                        </div>

                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--danger)', padding: '0.5rem', borderRadius: '8px' }}>
                                    <TrendingDown size={20} />
                                </div>
                                <span style={{ color: 'var(--danger)', fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>
                                    <ArrowDownRight size={14} /> 5%
                                </span>
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Pengeluaran</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '0.25rem' }}>Rp {totalExpense.toLocaleString('id-ID')}</div>
                        </div>

                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.5rem', borderRadius: '8px' }}>
                                    <DollarSign size={20} />
                                </div>
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Laba Bersih</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '0.25rem', color: netProfit >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                                Rp {netProfit.toLocaleString('id-ID')}
                            </div>
                        </div>

                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', padding: '0.5rem', borderRadius: '8px' }}>
                                    <BarChart3 size={20} />
                                </div>
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Margin Keuntungan</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '0.25rem' }}>{margin.toFixed(1)}%</div>
                        </div>
                    </>
                )}
            </div>

            <div className="grid-responsive-reports">
                {/* Main Chart */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 className="chart-title">
                            <Calendar size={20} color="var(--primary)" />
                            Perbandingan Bulanan
                        </h3>
                        <div className="chart-legend">
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></div> Pemasukan
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--danger)' }}></div> Pengeluaran
                            </span>
                        </div>
                    </div>

                    <div style={{ width: '100%', height: '300px' }}>
                        {loading ? <Skeleton height="300px" /> : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartDataArray}>
                                    <defs>
                                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--danger)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rp ${value / 1000000}jt`} />
                                    <Tooltip
                                        contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ fontSize: '0.85rem' }}
                                    />
                                    <Area type="monotone" dataKey="income" stroke="var(--primary)" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
                                    <Area type="monotone" dataKey="expense" stroke="var(--danger)" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                        <PieChartIcon size={20} color="var(--primary)" />
                        Sumber Pemasukan
                    </h3>
                    <div style={{ width: '100%', height: '240px' }}>
                        {loading ? <Skeleton height="240px" /> : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryDataArray}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data?.categoryData?.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '0.75rem', paddingTop: '1rem' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                        {data?.categoryData?.map((cat: any, i: number) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>{cat.name}</span>
                                <span style={{ fontWeight: '600' }}>Rp {cat.value.toLocaleString('id-ID')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Monthly Breakdown Table */}
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--card-border)' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>Rincian Laba Rugi</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.02)' }}>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>BULAN</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>PEMASUKAN</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>PENGELUARAN</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>LABA KOTOR</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'right' }}>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--card-border)' }}>
                                    <td colSpan={5} style={{ padding: '1rem 1.5rem' }}>
                                        <Skeleton height="40px" />
                                    </td>
                                </tr>
                            ))
                        ) : data?.chartData?.map((m: any, i: number) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--card-border)' }}>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>{m.month}</td>
                                <td style={{ padding: '1rem 1.5rem', color: 'var(--success)' }}>+ Rp {m.income.toLocaleString('id-ID')}</td>
                                <td style={{ padding: '1rem 1.5rem', color: 'var(--danger)' }}>- Rp {m.expense.toLocaleString('id-ID')}</td>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: '700' }}>Rp {(m.income - m.expense).toLocaleString('id-ID')}</td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                    <span className="badge" style={{
                                        background: (m.income - m.expense) >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                        color: (m.income - m.expense) >= 0 ? 'var(--success)' : 'var(--danger)'
                                    }}>
                                        {(m.income - m.expense) >= 0 ? 'Untung' : 'Rugi'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .reports-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.5rem;
                }
                .grid-responsive-reports {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 1.5rem;
                }
                .chart-legend {
                    display: flex;
                    gap: 1rem;
                    font-size: 0.75rem;
                }
                @media (max-width: 1200px) {
                    .reports-stats-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 1rem;
                    }
                }
                @media (max-width: 1024px) {
                    .grid-responsive-reports {
                        grid-template-columns: 1fr;
                    }
                }
                @media (max-width: 640px) {
                    .reports-stats-grid {
                        grid-template-columns: 1fr;
                    }
                }
                @media (max-width: 768px) {
                    h1 {
                        font-size: 1.5rem !important;
                    }
                    header {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 1rem;
                    }
                    header button {
                        width: 100%;
                        justify-content: center;
                    }
                    .chart-title {
                        font-size: 1rem;
                    }
                    .chart-legend {
                        display: none;
                    }
                }
                @media print {
                    .sidebar, .bottom-nav, button { display: none !important; }
                    main { margin-left: 0 !important; padding: 0 !important; }
                    .card { border: none !important; box-shadow: none !important; background: #fff !important; color: #000 !important; }
                    h1, h2, h3, p, span { color: #000 !important; }
                    text { fill: #000 !important; }
                }
            `}</style>
        </div>
    );
}
