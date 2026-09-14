import { InAppNotification, NotificationType } from '@/types/notification';
import React, { createContext, useContext, useState } from 'react';

interface NotificationContextType {
    notifications: InAppNotification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    addNotification: (notification: Omit<InAppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
    simulateTrigger: (type: NotificationType) => void;
}

const INITIAL_NOTIFICATIONS: InAppNotification[] = [
    {
        id: 'notif-welcome',
        type: 'SMART_INSIGHT',
        title: 'KararOS’a Hoş Geldin! 🚀',
        message: 'Bilinçli harcama ve bütçe koruma asistanın aktif. Aklındaki harcamaları Karar Al sekmesinden simüle edebilirsin.',
        timestamp: 'Şimdi',
        isRead: false,
        actionText: 'İlk Kararını Sor ➔',
        actionRoute: '/(tabs)/decide',
    },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<InAppNotification[]>(INITIAL_NOTIFICATIONS);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };

    const addNotification = (
        notif: Omit<InAppNotification, 'id' | 'timestamp' | 'isRead'>
    ) => {
        const newNotif: InAppNotification = {
            ...notif,
            id: `notif-${Date.now()}`,
            timestamp: 'Şimdi',
            isRead: false,
        };
        setNotifications((prev) => [newNotif, ...prev]);
    };

    // Test amacıyla simüle bildirim tetikleme
    const simulateTrigger = (type: NotificationType) => {
        if (type === 'DECISION_REVIEW') {
            addNotification({
                type: 'DECISION_REVIEW',
                title: 'Karar Hatırlatması 🎯',
                message: 'Kablosuz Kulaklık için ay sonu değerlendirme zamanı geldi.',
                actionText: 'İncele ➔',
                actionRoute: '/(tabs)/history',
            });
        }
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                markAsRead,
                markAllAsRead,
                addNotification,
                simulateTrigger,
            }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
