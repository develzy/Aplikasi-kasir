"use client";

import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export default function OnlineStatusIndicator() {
    const [isOnline, setIsOnline] = useState(true);
    const [showIndicator, setShowIndicator] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowIndicator(true);
            setTimeout(() => setShowIndicator(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowIndicator(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!showIndicator) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000,
            padding: '0.75rem 1.5rem',
            borderRadius: '50px',
            background: isOnline ? 'rgba(16, 185, 129, 0.95)' : 'rgba(245, 158, 11, 0.95)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            animation: 'slideDown 0.3s ease-out'
        }}>
            {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
            <span>{isOnline ? 'Kembali Online' : 'Mode Offline'}</span>
            <style jsx global>{`
        @keyframes slideDown {
          from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>
        </div>
    );
}
