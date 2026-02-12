"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                pointerEvents: 'none'
            }}>
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        style={{
                            pointerEvents: 'auto',
                            minWidth: '300px',
                            padding: '1rem',
                            borderRadius: '12px',
                            background: 'var(--glass-bg)',
                            backdropFilter: 'blur(20px)',
                            border: `1px solid ${toast.type === 'success' ? 'rgba(16, 185, 129, 0.2)' :
                                    toast.type === 'error' ? 'rgba(244, 63, 94, 0.2)' :
                                        'rgba(99, 102, 241, 0.2)'
                                }`,
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            animation: 'slideIn 0.3s ease-out forwards',
                            color: '#fff'
                        }}
                    >
                        <div style={{
                            color: toast.type === 'success' ? 'var(--success)' :
                                toast.type === 'error' ? 'var(--danger)' :
                                    'var(--primary)'
                        }}>
                            {toast.type === 'success' && <CheckCircle size={20} />}
                            {toast.type === 'error' && <AlertCircle size={20} />}
                            {toast.type === 'info' && <Info size={20} />}
                        </div>
                        <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: '500' }}>{toast.message}</div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
            <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
