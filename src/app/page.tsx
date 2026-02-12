"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Bell
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import {
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis
} from 'recharts';

interface Transaction {
  id: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  note: string;
}

interface Stats {
  balance: number;
  income: number;
  expense: number;
  transactionCount: number;
}

import { Skeleton, CardSkeleton } from "@/components/Skeleton";

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ balance: 0, income: 0, expense: 0, transactionCount: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [storeInfo, setStoreInfo] = useState({ name: "KasUMKM", logoUrl: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, transRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/transactions')
        ]);
        const statsData = await statsRes.json() as Stats;
        const transData = await transRes.json() as Transaction[];

        setStats(statsData);
        setTransactions(transData.slice(0, 5)); // Latest 5
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };

    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json() as any;
        if (data.storeName) {
          setStoreInfo({
            name: data.storeName,
            logoUrl: data.logoUrl || ""
          });
        }
      } catch (err) { }
    };

    Promise.all([fetchData(), fetchSettings()]).finally(() => setLoading(false));
  }, []);

  const chartData = [
    { name: 'Sen', value: 4000 },
    { name: 'Sel', value: 3000 },
    { name: 'Rab', value: 5000 },
    { name: 'Kam', value: 2780 },
    { name: 'Jum', value: 1890 },
    { name: 'Sab', value: 2390 },
    { name: 'Min', value: 3490 },
  ];

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <header className="dashboard-header">
        <div>
          <h1 className="section-title">
            Selamat Datang, {storeInfo.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <p className="section-desc">Pantau performa bisnis Anda secara real-time.</p>
            <span className="badge" style={{
              background: 'rgba(99, 102, 241, 0.1)',
              color: 'var(--primary)',
              fontSize: '0.65rem',
              fontWeight: '700',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              letterSpacing: '0.05em'
            }}>
              BUSINESS
            </span>
          </div>
        </div>
        <div className="dashboard-actions">
          <div className="input-group-search">
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Cari transaksi..."
              className="search-input"
            />
          </div>
          <button className="icon-btn-card">
            <Bell size={18} />
            <span className="notification-dot"></span>
          </button>
        </div>
      </header>

      <div className="stats-grid">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height="120px" />)
        ) : (
          <>
            <StatsCard
              label="Total Saldo"
              value={`Rp ${stats.balance.toLocaleString('id-ID')}`}
              icon={Wallet}
              color="var(--primary)"
            />
            <StatsCard
              label="Pemasukan"
              value={`Rp ${stats.income.toLocaleString('id-ID')}`}
              icon={TrendingUp}
              color="var(--success)"
            />
            <StatsCard
              label="Pengeluaran"
              value={`Rp ${stats.expense.toLocaleString('id-ID')}`}
              icon={TrendingDown}
              color="var(--danger)"
            />
            <StatsCard
              label="Total Transaksi"
              value={stats.transactionCount.toString()}
              icon={ShoppingBag}
              color="var(--info)"
            />
          </>
        )}
      </div>

      <div className="main-grid">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Peforma Mingguan</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>7 Hari Terakhir</span>
          </div>
          {loading ? <Skeleton height="300px" /> : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="var(--text-muted)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1e293b',
                    border: '1px solid var(--card-border)',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Histori Terbaru</h3>
            <button style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>Lihat Semua</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} height="64px" />)
            ) : transactions.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>Belum ada transaksi</p>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: tx.type === 'income' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)'
                  }}>
                    {tx.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{tx.note || tx.category}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.date}</div>
                  </div>
                  <div style={{ fontWeight: '700', color: tx.type === 'income' ? 'var(--success)' : '#fff', fontSize: '0.875rem' }}>
                    {tx.type === 'income' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2.5rem;
        }
        .dashboard-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        .input-group-search {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--card-border);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          width: 260px;
          transition: var(--transition-base);
        }
        .input-group-search:focus-within {
          border-color: var(--primary);
          background: rgba(255, 255, 255, 0.05);
        }
        .search-input {
          background: none;
          border: none;
          color: #fff;
          font-size: 0.875rem;
          outline: none;
          width: 100%;
        }
        .icon-btn-card {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-md);
          position: relative;
          color: var(--text-secondary);
        }
        .icon-btn-card:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
        }
        .notification-dot {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          background: var(--danger);
          border: 2px solid #0f172a;
          border-radius: 50%;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .main-grid {
          display: grid;
          grid-template-columns: 1.8fr 1.2fr;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .main-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 1.5rem;
          }
          .dashboard-actions {
            width: 100%;
          }
          .input-group-search {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
