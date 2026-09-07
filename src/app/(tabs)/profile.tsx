import { NotificationModal } from '@/components/notifications/notification-modal';
import { useBudget } from '@/context/budget-context';
import { useNotifications } from '@/context/notification-context';
import { scheduleDecisionReviewNotification } from '@/services/notification-service';
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const router = useRouter();
    const { budgetProfile } = useBudget();
    const { unreadCount, simulateTrigger } = useNotifications();

    // Bildirim Modal Durumu
    const [notifModalVisible, setNotifModalVisible] = useState(false);

    // Akıllı Asistan Tercihleri Switch State'leri
    const [delayRule, setDelayRule] = useState(true);
    const [safetyBuffer, setSafetyBuffer] = useState(true);
    const [monthlyReview, setMonthlyReview] = useState(true);

    // Kullanılabilir Karar Payı Hesabı (Gelir - Sabit Gider - Tasarruf)
    const decisionPool = Math.max(
        0,
        budgetProfile.monthlyIncome - budgetProfile.fixedExpenses - budgetProfile.savingsGoal
    );

    const formatCurrency = (val: number) => {
        return '₺' + val.toLocaleString('tr-TR');
    };

    const handleExport = () => {
        Alert.alert('Rapor Dışa Aktar', 'Karar geçmişin PDF/JSON formatında hazırlanıyor...');
    };

    const handleSimulateNotif = async () => {
        // 1. Uygulama içi bildirim merkezine ekle
        simulateTrigger('DECISION_REVIEW');

        // 2. Cihazın işletim sistemine 5 saniye sonrasına gerçek kilit ekranı alarmı kur
        const notifId = await scheduleDecisionReviewNotification(
            'Kablosuz Kulaklık',
            '2.700 TL',
            5
        );

        if (notifId) {
            Alert.alert(
                'Cihaz Bildirimi Planlandı! 🔔',
                'Bildirim merkezine eklendi. Ayrıca 5 saniye sonra telefonuna GERÇEK bir kilit ekranı bildirimi gelecek!\n\nİstersen uygulamayı arka plana atıp test edebilirsin.'
            );
        } else {
            Alert.alert(
                'Uygulama İçi Bildirim Eklendi 🔔',
                'Bildirim merkezine eklendi. (Telefon kilit ekranı bildirimi için sistem bildirim izni gereklidir).'
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Üst Bar */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerIconBtn}
                    onPress={() => router.back()}
                    activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={22} color="#0f172a" />
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <Image
                        source={require('@/../assets/images/kararos-logo.png')}
                        style={styles.brandLogoImg}
                        resizeMode="cover"
                    />
                    <Text style={styles.headerBrand}>KararOS</Text>
                    <View style={styles.onlineDot} />
                </View>

                {/* Sağ tarafı sol geri butonu ile dengelemek için boş alan */}
                <View style={styles.headerRightSpacer} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>

                {/* 1. KULLANICI PROFİL KARTI */}
                <View style={styles.userCard}>
                    <View style={styles.userHeaderRow}>
                        <View style={styles.avatarCircle}>
                            <Text style={styles.avatarText}>FY</Text>
                            <View style={styles.verifiedDot}>
                                <Ionicons name="checkmark" size={10} color="#ffffff" />
                            </View>
                        </View>

                        <View style={styles.userInfoCol}>
                            <View style={styles.userNameRow}>
                                <Text style={styles.userName}>Furkan Yıldız</Text>
                                <Ionicons name="checkmark-circle" size={16} color="#059669" />
                            </View>
                            <Text style={styles.userEmail}>furkan.yildiz@example.com</Text>
                            <View style={styles.badgeRow}>
                                <View style={styles.greenMiniDot} />
                                <Text style={styles.badgeText}>Aktif Karar Takipçisi • 4. Ay</Text>
                            </View>
                        </View>
                    </View>

                    {/* Genel Karar Uyumu Sağlık Kartı */}
                    <View style={styles.healthCard}>
                        <View style={styles.healthLeft}>
                            <View style={styles.healthIconBox}>
                                <Ionicons name="shield-checkmark" size={20} color="#059669" />
                            </View>
                            <View>
                                <Text style={styles.healthLabel}>Genel Karar Uyumu</Text>
                                <Text style={styles.healthValue}>Harika Denge</Text>
                            </View>
                        </View>
                        <View style={styles.healthPill}>
                            <Text style={styles.healthPillText}>%86 sağlıklı</Text>
                        </View>
                    </View>
                </View>

                {/* 2. BÜTÇE VE KARAR PARAMETRELERİ */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>BÜTÇE VE KARAR PARAMETRELERİ</Text>
                    <Text style={styles.sectionSubtitle}>
                        Simülasyon motorunun referans aldığı temel finansal verilerin
                    </Text>

                    {/* Parametre 1: Aylık Net Gelir */}
                    <View style={styles.paramCard}>
                        <View style={styles.paramIconBox}>
                            <Ionicons name="wallet-outline" size={20} color="#2563eb" />
                        </View>
                        <View style={styles.paramInfo}>
                            <Text style={styles.paramLabel}>Aylık Net Gelir</Text>
                            <Text style={styles.paramValue}>{formatCurrency(budgetProfile.monthlyIncome)}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.editBtn}
                            onPress={() => router.push('/budget-setup' as Href)}
                            activeOpacity={0.7}>
                            <Text style={styles.editBtnText}>Düzenle</Text>
                            <Ionicons name="pencil" size={12} color="#0f172a" style={{ marginLeft: 3 }} />
                        </TouchableOpacity>
                    </View>

                    {/* Parametre 2: Aylık Sabit Giderler */}
                    <View style={styles.paramCard}>
                        <View style={styles.paramIconBox}>
                            <Ionicons name="home-outline" size={20} color="#6366f1" />
                        </View>
                        <View style={styles.paramInfo}>
                            <Text style={styles.paramLabel}>Aylık Sabit Giderler</Text>
                            <Text style={styles.paramValue}>{formatCurrency(budgetProfile.fixedExpenses)}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.editBtn}
                            onPress={() => router.push('/budget-setup' as Href)}
                            activeOpacity={0.7}>
                            <Text style={styles.editBtnText}>Düzenle</Text>
                            <Ionicons name="pencil" size={12} color="#0f172a" style={{ marginLeft: 3 }} />
                        </TouchableOpacity>
                    </View>

                    {/* Parametre 3: Aylık Tasarruf Hedefi */}
                    <View style={styles.paramCard}>
                        <View style={styles.paramIconBox}>
                            <Ionicons name="flag-outline" size={20} color="#0d9488" />
                        </View>
                        <View style={styles.paramInfo}>
                            <View style={styles.paramTagRow}>
                                <Text style={styles.paramLabel}>Aylık Tasarruf Hedefi</Text>
                                <View style={styles.goalTag}>
                                    <Text style={styles.goalTagText}>İtalya Tatili</Text>
                                </View>
                            </View>
                            <Text style={styles.paramValue}>{formatCurrency(budgetProfile.savingsGoal)}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.editBtn}
                            onPress={() => router.push('/budget-setup' as Href)}
                            activeOpacity={0.7}>
                            <Text style={styles.editBtnText}>Düzenle</Text>
                            <Ionicons name="pencil" size={12} color="#0f172a" style={{ marginLeft: 3 }} />
                        </TouchableOpacity>
                    </View>

                    {/* Kullanılabilir Karar Payı Güvenlik Kartı */}
                    <View style={styles.decisionShieldCard}>
                        <View style={styles.shieldHeaderRow}>
                            <View style={styles.shieldTitleRow}>
                                <Ionicons name="lock-closed" size={16} color="#047857" style={{ marginRight: 6 }} />
                                <Text style={styles.shieldTitle}>Kullanılabilir Karar Payı</Text>
                            </View>
                            <Text style={styles.shieldAmount}>
                                {formatCurrency(decisionPool)} <Text style={styles.shieldMonthText}>/ ay</Text>
                            </Text>
                        </View>
                        <View style={styles.shieldProgressBg}>
                            <View style={[styles.shieldProgressFill, { width: '75%' }]} />
                        </View>
                        <Text style={styles.shieldSubtitle}>
                            Her yeni harcama simülasyonunda bu tutar üzerinden güvenlik payı hesaplanır.
                        </Text>
                    </View>
                </View>

                {/* 3. AKILLI ASİSTAN TERCİHLERİ */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>AKILLI ASİSTAN TERCİHLERİ</Text>

                    {/* Tercih 1: 30 Gün Erteleme Kuralı */}
                    <View style={styles.switchCard}>
                        <View style={styles.switchTextCol}>
                            <Text style={styles.switchMainTitle}>30 Gün Erteleme Kuralı</Text>
                            <Text style={styles.switchSubText}>
                                2.000 TL üzeri dürtüsel harcamalarda bekleme süresi önerisi sun.
                            </Text>
                        </View>
                        <Switch
                            value={delayRule}
                            onValueChange={setDelayRule}
                            trackColor={{ false: '#cbd5e1', true: '#0f172a' }}
                            thumbColor="#ffffff"
                        />
                    </View>

                    {/* Tercih 2: Dinamik Güvenlik Tamponu */}
                    <View style={styles.switchCard}>
                        <View style={styles.switchTextCol}>
                            <Text style={styles.switchMainTitle}>Dinamik Güvenlik Tamponu</Text>
                            <Text style={styles.switchSubText}>
                                Hesaplanamayan acil durumlar için bütçede otomatik %5 esneme payı bırak.
                            </Text>
                        </View>
                        <Switch
                            value={safetyBuffer}
                            onValueChange={setSafetyBuffer}
                            trackColor={{ false: '#cbd5e1', true: '#0f172a' }}
                            thumbColor="#ffffff"
                        />
                    </View>

                    {/* Tercih 3: Ay Sonu Karar Değerlendirmesi */}
                    <View style={styles.switchCard}>
                        <View style={styles.switchTextCol}>
                            <Text style={styles.switchMainTitle}>Ay Sonu Karar Değerlendirmesi</Text>
                            <Text style={styles.switchSubText}>
                                Alınan ürünlerin sağladığı faydayı 30 gün sonra hatırlat.
                            </Text>
                        </View>
                        <Switch
                            value={monthlyReview}
                            onValueChange={setMonthlyReview}
                            trackColor={{ false: '#cbd5e1', true: '#0f172a' }}
                            thumbColor="#ffffff"
                        />
                    </View>
                </View>

                {/* 4. GİZLİLİK VE HESAP */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>GİZLİLİK VE HESAP</Text>

                    {/* Bildirim Merkezi Butonu */}
                    <TouchableOpacity
                        style={styles.menuRow}
                        onPress={() => setNotifModalVisible(true)}
                        activeOpacity={0.7}>
                        <View style={styles.menuRowLeft}>
                            <View style={[styles.menuIcon, { backgroundColor: '#ecfdf5' }]}>
                                <Ionicons name="notifications-outline" size={18} color="#059669" />
                            </View>
                            <View>
                                <Text style={styles.menuTitle}>Bildirim Merkezi</Text>
                                <Text style={styles.menuSubtitle}>
                                    {unreadCount > 0 ? `${unreadCount} okunmamış bildirim var` : 'Tüm bildirimler güncel'}
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                    </TouchableOpacity>

                    {/* Simülasyon Test Bildirimi */}
                    <TouchableOpacity
                        style={styles.menuRow}
                        onPress={handleSimulateNotif}
                        activeOpacity={0.7}>
                        <View style={styles.menuRowLeft}>
                            <View style={[styles.menuIcon, { backgroundColor: '#fef3c7' }]}>
                                <Ionicons name="sparkles-outline" size={18} color="#d97706" />
                            </View>
                            <View>
                                <Text style={styles.menuTitle}>Bildirim Simülasyonu Yap</Text>
                                <Text style={styles.menuSubtitle}>30 günlük değerlendirme anı uyarısı tetikle</Text>
                            </View>
                        </View>
                        <Ionicons name="flash-outline" size={16} color="#d97706" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
                        <View style={styles.menuRowLeft}>
                            <View style={[styles.menuIcon, { backgroundColor: '#eff6ff' }]}>
                                <Ionicons name="shield-outline" size={18} color="#2563eb" />
                            </View>
                            <View>
                                <Text style={styles.menuTitle}>Veri Gizliliği & Güvenlik</Text>
                                <Text style={styles.menuSubtitle}>Bankasız, izole cihaz içi veri saklama</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuRow} onPress={handleExport} activeOpacity={0.7}>
                        <View style={styles.menuRowLeft}>
                            <View style={[styles.menuIcon, { backgroundColor: '#f0fdf4' }]}>
                                <Ionicons name="download-outline" size={18} color="#059669" />
                            </View>
                            <View>
                                <Text style={styles.menuTitle}>Karar Raporunu Dışa Aktar</Text>
                                <Text style={styles.menuSubtitle}>PDF veya JSON formatında</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
                        <View style={styles.menuRowLeft}>
                            <View style={[styles.menuIcon, { backgroundColor: '#f1f5f9' }]}>
                                <Ionicons name="information-circle-outline" size={18} color="#475569" />
                            </View>
                            <View>
                                <Text style={styles.menuTitle}>KararOS Hakkında & Destek</Text>
                                <Text style={styles.menuSubtitle}>Versiyon v1.4.0</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                    </TouchableOpacity>
                </View>

                {/* 5. Çıkış Butonu */}
                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={() => router.replace('/auth' as Href)}
                    activeOpacity={0.8}>
                    <Ionicons name="log-out-outline" size={18} color="#dc2626" style={{ marginRight: 6 }} />
                    <Text style={styles.logoutBtnText}>Çıkış Yap</Text>
                </TouchableOpacity>

                {/* 6. Alt Güvenlik Açıklaması */}
                <View style={styles.disclaimerRow}>
                    <Ionicons name="lock-closed-outline" size={14} color="#94a3b8" style={{ marginRight: 6 }} />
                    <Text style={styles.disclaimerText}>
                        KararOS bir yatırım danışmanı değil, kişisel karar asistanıdır. Verileriniz üçüncü şahıslarla paylaşılmaz.
                    </Text>
                </View>

            </ScrollView>

            {/* Uygulama İçi Bildirim Merkezi Modalı */}
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
        paddingVertical: 10,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    headerIconBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    brandLogoImg: {
        width: 26,
        height: 26,
        borderRadius: 8,
    },
    headerBrand: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
    },
    onlineDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#10b981',
    },
    headerRightSpacer: {
        width: 38,
        height: 38,
    },
    scrollContent: {
        paddingHorizontal: 18,
        paddingTop: 16,
        paddingBottom: 40,
    },
    userCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 18,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    userHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#0f172a',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginRight: 14,
    },
    avatarText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '800',
    },
    verifiedDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#059669',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    userInfoCol: {
        flex: 1,
    },
    userNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    userName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0f172a',
    },
    userEmail: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    greenMiniDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10b981',
        marginRight: 6,
    },
    badgeText: {
        fontSize: 11,
        color: '#059669',
        fontWeight: '700',
    },
    healthCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f0fdf4',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    healthLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    healthIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#dcfce7',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    healthLabel: {
        fontSize: 11,
        color: '#166534',
        fontWeight: '600',
    },
    healthValue: {
        fontSize: 14,
        fontWeight: '800',
        color: '#14532d',
    },
    healthPill: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    healthPillText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#059669',
    },
    section: {
        marginBottom: 22,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '800',
        color: '#475569',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    sectionSubtitle: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 12,
    },
    paramCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    paramIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    paramInfo: {
        flex: 1,
    },
    paramTagRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    paramLabel: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '500',
    },
    goalTag: {
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 6,
    },
    goalTagText: {
        fontSize: 10,
        color: '#0369a1',
        fontWeight: '700',
    },
    paramValue: {
        fontSize: 17,
        fontWeight: '800',
        color: '#0f172a',
        marginTop: 2,
    },
    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    editBtnText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#0f172a',
    },
    decisionShieldCard: {
        backgroundColor: '#ecfdf5',
        borderRadius: 18,
        padding: 16,
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#a7f3d0',
    },
    shieldHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    shieldTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    shieldTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#047857',
    },
    shieldAmount: {
        fontSize: 16,
        fontWeight: '800',
        color: '#065f46',
    },
    shieldMonthText: {
        fontSize: 12,
        color: '#047857',
        fontWeight: '600',
    },
    shieldProgressBg: {
        height: 6,
        backgroundColor: '#d1fae5',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 8,
    },
    shieldProgressFill: {
        height: '100%',
        backgroundColor: '#059669',
        borderRadius: 3,
    },
    shieldSubtitle: {
        fontSize: 11,
        color: '#047857',
        lineHeight: 16,
    },
    switchCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    switchTextCol: {
        flex: 1,
        marginRight: 12,
    },
    switchMainTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 2,
    },
    switchSubText: {
        fontSize: 11,
        color: '#64748b',
        lineHeight: 15,
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    menuRowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    menuTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0f172a',
    },
    menuSubtitle: {
        fontSize: 11,
        color: '#64748b',
        marginTop: 1,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#fee2e2',
        borderRadius: 16,
        paddingVertical: 14,
        marginBottom: 16,
    },
    logoutBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#dc2626',
    },
    disclaimerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 8,
    },
    disclaimerText: {
        flex: 1,
        fontSize: 11,
        color: '#94a3b8',
        lineHeight: 16,
    },
});
