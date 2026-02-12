export type UserTier = 'Basic' | 'Premium' | 'Business';

export interface MenuItem {
    icon: any;
    label: string;
    href: string;
    minTier: UserTier;
}

export const TIERS = {
    Basic: {
        name: 'Basic',
        color: '#94a3b8', // Gray
        features: ['Kasir (POS)', 'Riwayat Transaksi'],
    },
    Premium: {
        name: 'Premium',
        color: '#10b981', // Green
        features: ['Kasir (POS)', 'Riwayat Transaksi', 'Manajemen Produk'],
    },
    Business: {
        name: 'Business',
        color: '#6366f1', // Indigo
        features: ['Kasir (POS)', 'Riwayat Transaksi', 'Manajemen Produk', 'Laporan Lengkap', 'Ekspor Data'],
    },
};
