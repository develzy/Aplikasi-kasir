"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Receipt,
    ShoppingCart,
    Package,
    BarChart3,
    Settings,
    LogOut,
    PlusCircle,
    Lock
} from "lucide-react";
import styles from "./Sidebar.module.css";
import { UserTier, MenuItem } from "@/config/tiers";

const menuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/", minTier: 'Basic' },
    { icon: Receipt, label: "Riwayat", href: "/transactions", minTier: 'Basic' },
    { icon: ShoppingCart, label: "Kasir / POS", href: "/pos", minTier: 'Basic' },
    { icon: Package, label: "Produk", href: "/products", minTier: 'Premium' },
    { icon: BarChart3, label: "Laporan", href: "/reports", minTier: 'Business' },
];

import { useEffect, useState } from "react";

export default function Sidebar() {
    const pathname = usePathname();
    const [storeInfo, setStoreInfo] = useState({ name: "KasUMKM", logoUrl: "" });

    useEffect(() => {
        const fetchSettings = () => {
            fetch('/api/settings')
                .then(res => res.json())
                .then(data => {
                    const settings = data as any;
                    if (settings.storeName) {
                        setStoreInfo({
                            name: settings.storeName,
                            logoUrl: settings.logoUrl || ""
                        });
                    }
                })
                .catch(() => { });
        };

        fetchSettings();
        window.addEventListener('settingsUpdated', fetchSettings);
        return () => window.removeEventListener('settingsUpdated', fetchSettings);
    }, []);

    const handleLogout = () => {
        document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        window.location.href = "/login";
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <div className={styles.logoIcon}>
                    {storeInfo.logoUrl ? (
                        <img src={storeInfo.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                        storeInfo.name.charAt(0)
                    )}
                </div>
                <span className={styles.logoText}>{storeInfo.name}</span>
            </div>

            <div className={styles.quickAdd}>
                <Link href="/pos" className="btn-primary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
                    <PlusCircle size={18} />
                    <span>Transaksi Baru</span>
                </Link>
            </div>

            <nav className={styles.nav}>
                <div className={styles.navSection}>MENU UTAMA</div>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    const currentUserTier: UserTier = 'Business'; // This would come from auth context

                    const isLocked = (tier: UserTier, minTier: UserTier): boolean => {
                        const weights = { 'Basic': 0, 'Premium': 1, 'Business': 2 };
                        return weights[tier] < weights[minTier];
                    };

                    const locked = isLocked(currentUserTier, item.minTier);

                    return (
                        <div key={item.href} style={{ position: 'relative' }}>
                            <Link
                                href={locked ? "#" : item.href}
                                className={`${styles.navItem} ${isActive ? styles.active : ""} ${locked ? styles.locked : ""}`}
                                onClick={(e) => {
                                    if (locked) {
                                        e.preventDefault();
                                        alert(`Fitur ${item.label} hanya tersedia untuk paket ${item.minTier}!`);
                                    }
                                }}
                            >
                                <div className={styles.iconContainer}>
                                    <Icon size={20} />
                                </div>
                                <span>{item.label}</span>
                                {locked && <Lock size={14} className={styles.lockIcon} />}
                                {isActive && !locked && <div className={styles.activeIndicator} />}
                            </Link>
                        </div>
                    );
                })}
            </nav>

            <div className={styles.footer}>
                <div className={styles.userProfile}>
                    <div className={styles.avatar}>AD</div>
                    <div className={styles.userInfo}>
                        <div className={styles.userName}>Admin KasZy</div>
                        <div className={styles.userTier}>Business Plan</div>
                    </div>
                </div>
                <Link href="/settings" className={styles.navItem}>
                    <Settings size={20} />
                    <span>Pengaturan</span>
                </Link>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Keluar</span>
                </button>
            </div>
        </aside>
    );
}
