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

const NOTIFICATIONS_STORAGE_KEY = '@kararos_in_app_notifications';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<InAppNotification[]>(INITIAL_NOTIFICATIONS);

    // Uygulama açılışında kayıtlı bildirimleri yükle
    React.useEffect(() => {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY).then((data: string | null) => {
            if (data) {
                try {
                    const parsed = JSON.parse(data);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setNotifications(parsed);
                    }
                } catch {}
            }
        });
    }, []);

    // Bildirimleri kaydet
    const saveNotifs = (newNotifs: InAppNotification[]) => {
        setNotifications(newNotifs);
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(newNotifs)).catch(() => {});
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const markAsRead = (id: string) => {
        const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
        saveNotifs(updated);
    };

    const markAllAsRead = () => {
        const updated = notifications.map((n) => ({ ...n, isRead: true }));
        saveNotifs(updated);
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
        const updated = [newNotif, ...notifications];
        saveNotifs(updated);
    };

    // Bildirim tetikleme yardımcısı
    const simulateTrigger = (_type: NotificationType) => {
        // Dinamik bildirimler addNotification üzerinden eklenir
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
