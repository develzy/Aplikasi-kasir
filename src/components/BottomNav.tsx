"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    History,
    BarChart2,
    Settings
} from "lucide-react";
import styles from "./BottomNav.module.css";

const navItems = [
    { icon: LayoutDashboard, label: "Home", href: "/" },
    { icon: ShoppingCart, label: "POS", href: "/pos" },
    { icon: Package, label: "Produk", href: "/products" },
    { icon: History, label: "History", href: "/transactions" },
    { icon: BarChart2, label: "Laporan", href: "/reports" },
    { icon: Settings, label: "Setelan", href: "/settings" },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className={styles.bottomNav}>
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                    >
                        <Icon size={20} />
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
