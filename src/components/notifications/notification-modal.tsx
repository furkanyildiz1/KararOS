// src/components/notifications/notification-modal.tsx
import { useNotifications } from '@/context/notification-context';
import { InAppNotification, NotificationType } from '@/types/notification';
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface NotificationModalProps {
    visible: boolean;
    onClose: () => void;
}

export function NotificationModal({ visible, onClose }: NotificationModalProps) {
    const router = useRouter();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

    const filtered = notifications.filter((n) => (filter === 'UNREAD' ? !n.isRead : true));

    const getTypeIcon = (type: NotificationType) => {
        switch (type) {
            case 'DECISION_REVIEW':
                return { icon: 'time-outline' as const, bg: '#fef3c7', color: '#d97706' };
            case 'BUDGET_WARNING':
                return { icon: 'warning-outline' as const, bg: '#fee2e2', color: '#dc2626' };
            case 'SAVINGS_GOAL':
                return { icon: 'leaf-outline' as const, bg: '#ecfdf5', color: '#059669' };
            case 'SMART_INSIGHT':
                return { icon: 'bulb-outline' as const, bg: '#eff6ff', color: '#0284c7' };
        }
    };

    const handleItemPress = (item: InAppNotification) => {
        markAsRead(item.id);
        if (item.actionRoute) {
            onClose();
            router.push(item.actionRoute as Href);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                {/* Modal Üst Başlık */}
                <View style={styles.modalHeader}>
                    <View style={styles.modalHeaderLeft}>
                        <Text style={styles.modalTitle}>Bildirimler</Text>
                        {unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadBadgeText}>{unreadCount} yeni</Text>
                            </View>
                        )}
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={22} color="#0f172a" />
                    </TouchableOpacity>
                </View>

                {/* Filtre ve Tümünü Oku Butonu */}
                <View style={styles.filterBar}>
                    <View style={styles.filterPills}>
                        <TouchableOpacity
                            style={[styles.filterPill, filter === 'ALL' && styles.filterPillActive]}
                            onPress={() => setFilter('ALL')}>
                            <Text style={[styles.filterPillText, filter === 'ALL' && styles.filterPillTextActive]}>
                                Tümü ({notifications.length})
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.filterPill, filter === 'UNREAD' && styles.filterPillActive]}
                            onPress={() => setFilter('UNREAD')}>
                            <Text style={[styles.filterPillText, filter === 'UNREAD' && styles.filterPillTextActive]}>
                                Okunmamış ({unreadCount})
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {unreadCount > 0 && (
                        <TouchableOpacity onPress={markAllAsRead} style={styles.markAllBtn}>
                            <Text style={styles.markAllText}>Tümünü Oku</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Bildirim Listesi */}
                <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                    {filtered.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="notifications-off-outline" size={42} color="#cbd5e1" />
                            <Text style={styles.emptyText}>Henüz gösterilecek bildirim yok.</Text>
                        </View>
                    ) : (
                        filtered.map((item) => {
                            const meta = getTypeIcon(item.type);
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[styles.notifCard, !item.isRead && styles.notifCardUnread]}
                                    onPress={() => handleItemPress(item)}
                                    activeOpacity={0.85}>
                                    <View style={[styles.iconBox, { backgroundColor: meta.bg }]}>
                                        <Ionicons name={meta.icon} size={20} color={meta.color} />
                                    </View>

                                    <View style={styles.cardContent}>
                                        <View style={styles.cardTopRow}>
                                            <Text style={styles.cardTitle}>{item.title}</Text>
                                            <Text style={styles.cardTime}>{item.timestamp}</Text>
                                        </View>
                                        <Text style={styles.cardMessage}>{item.message}</Text>

                                        {item.actionText && (
                                            <View style={styles.actionRow}>
                                                <Text style={styles.actionText}>{item.actionText}</Text>
                                            </View>
                                        )}
                                    </View>

                                    {!item.isRead && <View style={styles.unreadDot} />}
                                </TouchableOpacity>
                            );
                        })
                    )}
                </ScrollView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: { flex: 1, backgroundColor: '#f8fafc' },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 14,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    modalHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    modalTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
    unreadBadge: { backgroundColor: '#ecfdf5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
    unreadBadgeText: { fontSize: 11, fontWeight: '700', color: '#059669' },
    closeBtn: { padding: 4 },
    filterBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    filterPills: { flexDirection: 'row', gap: 8 },
    filterPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, backgroundColor: '#e2e8f0' },
    filterPillActive: { backgroundColor: '#0f172a' },
    filterPillText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
    filterPillTextActive: { color: '#ffffff' },
    markAllBtn: { paddingVertical: 4 },
    markAllText: { fontSize: 12, fontWeight: '700', color: '#059669' },
    listContent: { paddingHorizontal: 20, paddingBottom: 30, gap: 10 },
    notifCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#ffffff',
        borderRadius: 18,
        padding: 14,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    notifCardUnread: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
    iconBox: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    cardContent: { flex: 1 },
    cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    cardTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
    cardTime: { fontSize: 11, color: '#94a3b8' },
    cardMessage: { fontSize: 12.5, color: '#475569', lineHeight: 17, marginBottom: 6 },
    actionRow: { alignSelf: 'flex-start' },
    actionText: { fontSize: 12, fontWeight: '700', color: '#0f172a' },
    unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#059669', marginLeft: 6, marginTop: 4 },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
    emptyText: { fontSize: 14, color: '#94a3b8', fontWeight: '500' },
});
