import { LucideIcon } from "lucide-react";
import styles from "./StatsCard.module.css";

interface StatsCardProps {
    label: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    icon: LucideIcon;
    color?: string;
}

export default function StatsCard({ label, value, trend, trendUp, icon: Icon, color }: StatsCardProps) {
    return (
        <div className="card">
            <div className={styles.container}>
                <div className={styles.content}>
                    <span className={styles.label}>{label}</span>
                    <h3 className={styles.value}>{value}</h3>
                    {trend && (
                        <div className={`${styles.trend} ${trendUp ? styles.up : styles.down}`}>
                            {trendUp ? "↑" : "↓"} {trend}
                            <span className={styles.trendText}> vs bulan lalu</span>
                        </div>
                    )}
                </div>
                <div
                    className={styles.iconWrapper}
                    style={{ background: color ? `${color}20` : "rgba(255, 255, 255, 0.05)", color: color || "inherit" }}
                >
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
}
