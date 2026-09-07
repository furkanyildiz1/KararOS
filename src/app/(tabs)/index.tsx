import { NotificationModal } from '@/components/notifications/notification-modal';
import { useBudget } from '@/context/budget-context';
import { useNotifications } from '@/context/notification-context';
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const router = useRouter();
    const {
        budgetProfile,
        availableBudget,
        savingsProgress,
    } = useBudget();
    const { unreadCount } = useNotifications();
    const [notifModalVisible, setNotifModalVisible] = useState(false);

    const formatCurrency = (val: number) => {
        return val.toLocaleString('tr-TR');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Üst Bar */}
            <View style={styles.header}>
                <View style={styles.brandRow}>
                    <Image
                        source={require('@/../assets/images/kararos-logo.png')}
                        style={styles.brandLogoImg}
                        resizeMode="cover"
                    />
                    <Text style={styles.brandTitle}>KararOS</Text>
                </View>

                {/* Bildirim Zili & Rozeti */}
                <TouchableOpacity
                    style={styles.notifBtn}
                    onPress={() => setNotifModalVisible(true)}
                    activeOpacity={0.7}>
                    <Ionicons name="notifications-outline" size={24} color="#0f172a" />
                    {unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadBadgeText}>
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>

                {/* Karşılama Alanı */}
                <View style={styles.greetingRow}>
                    <View style={styles.greetingTextCol}>
                        <Text style={styles.greetingTitle}>Günaydın, Selin 👋</Text>
                        <Text style={styles.greetingSubtitle}>
                            Harcamadan önce düşün, hedeflerini koru.
                        </Text>
                    </View>

                </View>

                {/* 1. HERO KART: Bugün Vermen Gereken Bir Karar Var Mı? */}
                <View style={styles.heroCard}>
                    <View style={styles.heroTagPill}>
                        <Text style={styles.heroTagText}>ASK ➔ CHOOSE ➔ TRACK ➔ LEARN</Text>
                    </View>

                    <Text style={styles.heroTitle}>
                        Bugün vermen gereken bir karar var mı?
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        Bir harcama yapmadan önce bütçene ve hedeflerine etkisini 20 saniyede gör.
                    </Text>

                    <TouchableOpacity
                        style={styles.heroActionButton}
                        onPress={() => router.push('/(tabs)/decide' as Href)}
                        activeOpacity={0.85}>
                        <Ionicons name="add" size={20} color="#064e3b" style={{ marginRight: 4 }} />
                        <Text style={styles.heroActionText}>Yeni Karar Sor</Text>
                    </TouchableOpacity>

                    <View style={styles.heroSubRow}>
                        <Ionicons name="flash-outline" size={12} color="#34d399" style={{ marginRight: 4 }} />
                        <Text style={styles.heroSubText}>Anında etki simülasyonu</Text>
                    </View>
                </View>

                {/* 2. İKİLİ METRİK KARTLARI */}
                <View style={styles.metricsRow}>
                    {/* Sol Kart: Ay Sonu Tahmini */}
                    <View style={styles.metricCard}>
                        <View style={styles.metricCardHeader}>
                            <Text style={styles.metricCardLabel}>Ay sonu tahmini</Text>
                            <Ionicons name="shield-checkmark-outline" size={16} color="#059669" />
                        </View>
                        <Text style={styles.metricCardAmount}>
                            {formatCurrency(availableBudget)} <Text style={styles.metricCurrency}>TL</Text>
                        </Text>
                        <View style={styles.safeZoneBadge}>
                            <View style={styles.greenDot} />
                            <Text style={styles.safeZoneText}>Güvenli bölge</Text>
                        </View>
                    </View>

                    {/* Sağ Kart: Hedefe Kalan */}
                    <View style={styles.metricCard}>
                        <View style={styles.metricCardHeader}>
                            <Text style={styles.metricCardLabel}>Hedefe kalan</Text>
                            <Ionicons name="flag-outline" size={16} color="#d97706" />
                        </View>
                        <Text style={styles.metricCardAmount}>
                            {formatCurrency(savingsProgress.gap)} <Text style={styles.metricCurrency}>TL</Text>
                        </Text>
                        <View style={styles.goalMiniProgress}>
                            <View style={styles.goalMiniProgressBar}>
                                <View style={[styles.goalMiniProgressFill, { width: '60%' }]} />
                            </View>
                            <View style={styles.goalMiniProgressLabels}>
                                <Text style={styles.goalPercentText}>%60 tamamlandı</Text>
                                <Text style={styles.goalNameText}>İtalya Fonu</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* 3. AKILLI GÖZLEMLER */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>Akıllı Gözlemler</Text>
                        <Text style={styles.sectionSubtitle}>Sana özel rehber</Text>
                    </View>

                    {/* Gözlem 1: Dışarıda Yemek */}
                    <View style={styles.insightCard}>
                        <View style={[styles.insightIconBox, { backgroundColor: '#fef3c7' }]}>
                            <Ionicons name="restaurant-outline" size={18} color="#b45309" />
                        </View>
                        <View style={styles.insightContent}>
                            <View style={styles.insightTopRow}>
                                <Text style={styles.insightName}>Dışarıda Yemek</Text>
                                <Text style={styles.insightDate}>Son 14 gün</Text>
                            </View>
                            <Text style={styles.insightDesc}>
                                Restoran harcaman geçen aya göre arttı. Dışarıda yemek kararı alırken simülasyon yapmayı deneyebilirsin.
                            </Text>
                            <TouchableOpacity
                                style={styles.insightActionBtn}
                                onPress={() => router.push('/(tabs)/decide' as Href)}
                                activeOpacity={0.7}>
                                <Text style={styles.insightActionText}>Harcama sınırını gör ➔</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Gözlem 2: Tasarruf Tamponu */}
                    <View style={[styles.insightCard, { backgroundColor: '#ecfdf5', borderColor: '#bbf7d0' }]}>
                        <View style={[styles.insightIconBox, { backgroundColor: '#d1fae5' }]}>
                            <Ionicons name="leaf" size={18} color="#059669" />
                        </View>
                        <View style={styles.insightContent}>
                            <View style={styles.insightTopRow}>
                                <Text style={styles.insightName}>Tasarruf Tamponu</Text>
                                <Text style={[styles.insightDate, { color: '#059669', fontWeight: '700' }]}>
                                    Harika gidiyorsun
                                </Text>
                            </View>
                            <Text style={[styles.insightDesc, { color: '#065f46' }]}>
                                Bu ay eğlence harcamalarında düşüş var. <Text style={{ fontWeight: '800' }}>420 TL</Text> fazladan tasarruf tamponu oluşturdun.
                            </Text>
                            <View style={styles.savedPill}>
                                <Ionicons name="shield-checkmark" size={12} color="#059669" style={{ marginRight: 4 }} />
                                <Text style={styles.savedPillText}>Hedefine aktarıldı</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* 4. SON DEĞERLENDİRİLEN */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>Son Değerlendirilen</Text>
                        <TouchableOpacity onPress={() => router.push('/(tabs)/history' as Href)}>
                            <Text style={styles.seeAllText}>Tümünü gör</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.recentItem}>
                        <View style={styles.recentIconBox}>
                            <Ionicons name="headset-outline" size={20} color="#0284c7" />
                        </View>
                        <View style={styles.recentContent}>
                            <Text style={styles.recentTitle}>Kablosuz Kulaklık</Text>
                            <Text style={styles.recentSub}>2.700 TL • Teknoloji</Text>
                        </View>
                        <View style={styles.recentBadge}>
                            <Ionicons name="checkmark-circle" size={14} color="#059669" style={{ marginRight: 4 }} />
                            <Text style={styles.recentBadgeText}>Alabilirsin</Text>
                        </View>
                    </View>
                </View>

                {/* 5. Alt Bilgilendirme */}
                <View style={styles.disclaimerBox}>
                    <Ionicons name="information-circle-outline" size={14} color="#94a3b8" style={{ marginRight: 6 }} />
                    <Text style={styles.disclaimerText}>
                        KararOS bir yatırım danışmanı değil, akıllı karar asistanıdır.
                    </Text>
                </View>

            </ScrollView>

            {/* Bildirim Merkezi Modalı */}
            <NotificationModal
                visible={notifModalVisible}
                onClose={() => setNotifModalVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    brandLogoImg: {
        width: 26,
        height: 26,
        borderRadius: 8,
    },
    brandTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: -0.3,
    },
    notifBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    unreadBadge: {
        position: 'absolute',
        top: 2,
        right: 2,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#ef4444',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
        borderWidth: 1.5,
        borderColor: '#ffffff',
    },
    unreadBadgeText: {
        fontSize: 9,
        fontWeight: '800',
        color: '#ffffff',
    },
    scrollContent: {
        paddingHorizontal: 18,
        paddingTop: 16,
        paddingBottom: 36,
    },
    greetingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    greetingTextCol: {
        flex: 1,
    },
    greetingTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: -0.4,
    },
    greetingSubtitle: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 2,
    },
    leafIconBadge: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#ecfdf5',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
    heroCard: {
        backgroundColor: '#0a192f',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#0a192f',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 14,
        elevation: 5,
    },
    heroTagPill: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 12,
    },
    heroTagText: {
        color: '#a7f3d0',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.4,
    },
    heroTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '800',
        lineHeight: 26,
        letterSpacing: -0.4,
        marginBottom: 8,
    },
    heroSubtitle: {
        color: '#94a3b8',
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 18,
    },
    heroActionButton: {
        backgroundColor: '#34d399',
        borderRadius: 20,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    heroActionText: {
        color: '#064e3b',
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: -0.2,
    },
    heroSubRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroSubText: {
        color: '#a7f3d0',
        fontSize: 11,
        fontWeight: '600',
    },
    metricsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    metricCard: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    metricCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    metricCardLabel: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
    },
    metricCardAmount: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: -0.4,
        marginBottom: 8,
    },
    metricCurrency: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
    },
    safeZoneBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ecfdf5',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    greenDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10b981',
        marginRight: 6,
    },
    safeZoneText: {
        fontSize: 11,
        color: '#059669',
        fontWeight: '700',
    },
    goalMiniProgress: {
        marginTop: 2,
    },
    goalMiniProgressBar: {
        height: 5,
        backgroundColor: '#f1f5f9',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 4,
    },
    goalMiniProgressFill: {
        height: '100%',
        backgroundColor: '#059669',
        borderRadius: 3,
    },
    goalMiniProgressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    goalPercentText: {
        fontSize: 10,
        color: '#059669',
        fontWeight: '700',
    },
    goalNameText: {
        fontSize: 10,
        color: '#64748b',
        fontWeight: '500',
    },
    section: {
        marginBottom: 20,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0f172a',
    },
    sectionSubtitle: {
        fontSize: 12,
        color: '#64748b',
    },
    seeAllText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#059669',
    },
    insightCard: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 18,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    insightIconBox: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    insightContent: {
        flex: 1,
    },
    insightTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    insightName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0f172a',
    },
    insightDate: {
        fontSize: 11,
        color: '#94a3b8',
    },
    insightDesc: {
        fontSize: 12,
        color: '#475569',
        lineHeight: 17,
        marginBottom: 6,
    },
    insightActionBtn: {
        alignSelf: 'flex-start',
    },
    insightActionText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#0f172a',
    },
    savedPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#a7f3d0',
    },
    savedPillText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#059669',
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 18,
        padding: 14,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    recentIconBox: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#f0f9ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    recentContent: {
        flex: 1,
    },
    recentTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0f172a',
    },
    recentSub: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 1,
    },
    recentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dcfce7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    recentBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#15803d',
    },
    disclaimerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    disclaimerText: {
        fontSize: 11,
        color: '#94a3b8',
        textAlign: 'center',
    },
});
