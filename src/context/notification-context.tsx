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

// Pazar testi için hazır zengin başlangıç bildirimleri
const INITIAL_NOTIFICATIONS: InAppNotification[] = [
    {
        id: 'notif-1',
        type: 'DECISION_REVIEW',
        title: '30 Günlük Süre Doldu ⏳',
        message: 'Ertelediğin "Spor Ayakkabı (2.400 TL)" için karar anı. Hala almak istiyor musun?',
        timestamp: '15 dk önce',
        isRead: false,
        actionText: 'Kararı Değerlendir ➔',
        actionRoute: '/(tabs)/history',
    },
    {
        id: 'notif-2',
        type: 'SAVINGS_GOAL',
        title: 'Tasarruf Tamponu Oluştu 🎉',
        message: 'Eğlence harcamalarındaki tasarruf sayesinde 420 TL İtalya Tatili fonuna aktarıldı.',
        timestamp: '2 saat önce',
        isRead: false,
        actionText: 'Hedefi Gör ➔',
        actionRoute: '/(tabs)/goals',
    },
    {
        id: 'notif-3',
        type: 'BUDGET_WARNING',
        title: 'Restoran Harcama Uyarısı ⚠️',
        message: 'Bu haftaki dışarıda yemek harcaman bütçelenen sınırın %80’ine ulaştı.',
        timestamp: 'Dün',
        isRead: true,
    },
    {
        id: 'notif-4',
        type: 'SMART_INSIGHT',
        title: 'Haftalık Karar Özeti 📊',
        message: 'Bu hafta aldığın 3 karardan 2 tanesinde dürtüsel harcamanı başarıyla engelledin.',
        timestamp: '3 gün önce',
        isRead: true,
        actionText: 'Öğrenim Raporunu İncele ➔',
        actionRoute: '/(tabs)/history',
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
