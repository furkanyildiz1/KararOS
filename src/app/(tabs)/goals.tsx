import { useBudget } from '@/context/budget-context';
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GoalsScreen() {
    const router = useRouter();
    const { budgetProfile } = useBudget();

    // Yeni Hedef Modalı State'leri
    const [showAddModal, setShowAddModal] = useState(false);
    const [targetName, setTargetName] = useState('Japonya Seyahati');
    const [targetAmount, setTargetAmount] = useState('30000');
    const [targetMonths, setTargetMonths] = useState(6);
    const [selectedCat, setSelectedCat] = useState('Seyahat');
    const [autoTransfer, setAutoTransfer] = useState(true);

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

                <View style={styles.headerRightSpacer} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>

                {/* Rozet ve Başlık */}
                <View style={styles.titleSection}>
                    <View style={styles.tagPill}>
                        <Ionicons name="flag" size={13} color="#059669" style={{ marginRight: 4 }} />
                        <Text style={styles.tagPillText}>HEDEF ODAKLI KARARLAR</Text>
                    </View>
                    <Text style={styles.pageTitle}>Tasarruf Hedeflerin</Text>
                    <Text style={styles.pageSubtitle}>
                        Verdiğin her harcama kararı bu hedeflere ne kadar hızlı ulaşacağını belirler.
                    </Text>
                </View>

                {/* 1. KART: Öncelikli Hedef (İtalya Tatili Fonu) */}
                <View style={styles.mainGoalCard}>
                    <View style={styles.goalImageOverlay}>
                        <View style={styles.goalCardHeader}>
                            <View style={styles.aheadBadge}>
                                <View style={styles.greenDot} />
                                <Text style={styles.aheadBadgeText}>Planın Önünde (+420 TL)</Text>
                            </View>
                        </View>

                        <View style={styles.goalTitleRow}>
                            <View>
                                <View style={styles.priorityRow}>
                                    <Ionicons name="airplane" size={14} color="#cbd5e1" style={{ marginRight: 4 }} />
                                    <Text style={styles.priorityLabel}>Öncelikli Hedef</Text>
                                </View>
                                <Text style={styles.mainGoalName}>İtalya Tatili Fonu</Text>
                            </View>
                            <Text style={styles.mainGoalPercent}>%60</Text>
                        </View>
                    </View>

                    {/* Kart İçi İstatistikler */}
                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Text style={styles.statBoxLabel}>Biriken Tutar</Text>
                            <Text style={styles.statBoxValue}>21.600 <Text style={styles.currencyText}>TL</Text></Text>
                            <Text style={styles.statBoxSub}>Hedef: 36.000 TL</Text>
                        </View>

                        <View style={styles.statBox}>
                            <Text style={styles.statBoxLabel}>Kalan Süre & Hız</Text>
                            <Text style={styles.statBoxValue}>~2.5 <Text style={styles.monthText}>Ay</Text></Text>
                            <Text style={styles.statBoxSub}>6.000 TL / ay plan</Text>
                        </View>
                    </View>

                    {/* İlerleme Çubuğu */}
                    <View style={styles.progressSection}>
                        <View style={styles.progressLabelRow}>
                            <Text style={styles.remainText}>Kalan: 14.400 TL</Text>
                            <Text style={styles.speedText}>📈 Hızlı İlerleme</Text>
                        </View>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: '60%' }]} />
                        </View>
                    </View>

                    {/* Karar Kazanımı Bilgi Kutusu */}
                    <View style={styles.gainBox}>
                        <View style={styles.gainIconCircle}>
                            <Ionicons name="checkmark-circle" size={20} color="#059669" />
                        </View>
                        <View style={styles.gainTextContainer}>
                            <Text style={styles.gainTitle}>KARAR KAZANIMI</Text>
                            <Text style={styles.gainDesc}>
                                Bu ay ertelediğin <Text style={styles.boldText}>"Spor Ayakkabı"</Text> kararı hedefe <Text style={styles.gainHighlight}>12 gün erken</Text> yaklaşmanı sağladı.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* 2. KART: Acil Durum Fonu */}
                <View style={styles.secondaryGoalCard}>
                    <View style={styles.secCardTop}>
                        <View style={styles.secIconBox}>
                            <Ionicons name="shield-outline" size={20} color="#0284c7" />
                        </View>
                        <View style={styles.secTitleBox}>
                            <View style={styles.secTitleRow}>
                                <Text style={styles.secGoalName}>Acil Durum Fonu</Text>
                                <View style={styles.secTag}>
                                    <Text style={styles.secTagText}>3 Aylık Gider</Text>
                                </View>
                                <Text style={styles.secPercent}>%76</Text>
                            </View>
                            <Text style={styles.secSubtitle}>Öncelik: Finansal Güvenlik</Text>
                        </View>
                    </View>

                    <View style={styles.secAmountsRow}>
                        <Text style={styles.secAmountText}><Text style={styles.boldText}>42.000 TL</Text> birikti</Text>
                        <Text style={styles.secAmountSub}>Hedef: 55.000 TL</Text>
                    </View>

                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFillSec, { width: '76%' }]} />
                    </View>

                    <View style={styles.secFooterRow}>
                        <Text style={styles.secFooterLeft}>Tamamlanmaya 13.000 TL kaldı</Text>
                        <Text style={styles.secFooterRight}>✓ Rayında</Text>
                    </View>
                </View>

                {/* 3. KART: Hızlı Karar Simülatörü (Dark Card) */}
                <View style={styles.simulatorCard}>
                    <View style={styles.simCardTop}>
                        <Text style={styles.simTag}>HIZLI KARAR SİMÜLATÖRÜ</Text>
                        <Ionicons name="sparkles" size={18} color="#a7f3d0" />
                    </View>
                    <Text style={styles.simTitle}>Yeni bir harcama hedefini geciktirir mi?</Text>
                    <Text style={styles.simSubtitle}>
                        Aklındaki bir harcamayı girmeden önce hedeflerine etkisini tek tıkla test et.
                    </Text>

                    <TouchableOpacity
                        style={styles.simButton}
                        onPress={() => router.push('/(tabs)/decide' as Href)}
                        activeOpacity={0.85}>
                        <Ionicons name="add-circle-outline" size={18} color="#064e3b" style={{ marginRight: 6 }} />
                        <Text style={styles.simBtnText}>Harcama Etkisini Simüle Et</Text>
                    </TouchableOpacity>
                </View>

                {/* 4. BÖLÜM: Son Kararların Hedefe Yansıması */}
                <View style={styles.historySection}>
                    <View style={styles.historyHeaderRow}>
                        <Text style={styles.historyTitle}>Son Kararların Hedefe Yansıması</Text>
                        <Text style={styles.historyTimeRange}>Son 14 gün</Text>
                    </View>

                    {/* Karar Yansıma 1 */}
                    <View style={styles.impactItem}>
                        <View style={[styles.impactIconBox, { backgroundColor: '#dcfce7' }]}>
                            <Ionicons name="shirt-outline" size={20} color="#15803d" />
                        </View>
                        <View style={styles.impactContent}>
                            <View style={styles.impactTopRow}>
                                <Text style={styles.impactItemTitle}>Spor Ayakkabı</Text>
                                <View style={styles.badgePostponed}>
                                    <Text style={styles.badgePostponedText}>Ertelendi</Text>
                                </View>
                            </View>
                            <Text style={styles.impactDescText}>
                                2.400 TL bütçede tutuldu ➔ <Text style={styles.greenText}>İtalya Fonu korundu (+12 gün)</Text>
                            </Text>
                            <View style={styles.impactMetaRow}>
                                <Text style={styles.impactMetaText}>Karar Tarihi: 18 Mayıs</Text>
                                <Text style={styles.impactMetaText}>• Rasyonel Puan: 9.4/10</Text>
                            </View>
                        </View>
                    </View>

                    {/* Karar Yansıma 2 */}
                    <View style={styles.impactItem}>
                        <View style={[styles.impactIconBox, { backgroundColor: '#e0f2fe' }]}>
                            <Ionicons name="headset-outline" size={20} color="#0369a1" />
                        </View>
                        <View style={styles.impactContent}>
                            <View style={styles.impactTopRow}>
                                <Text style={styles.impactItemTitle}>Kablosuz Kulaklık</Text>
                                <View style={styles.badgeBought}>
                                    <Text style={styles.badgeBoughtText}>Alındı</Text>
                                </View>
                            </View>
                            <Text style={styles.impactDescText}>
                                2.700 TL harcandı ➔ <Text style={styles.blueText}>Hedef takvimini bozmadı (Güvenli Alan)</Text>
                            </Text>
                            <View style={styles.impactMetaRow}>
                                <Text style={styles.impactMetaText}>Karar Tarihi: 12 Mayıs</Text>
                                <Text style={styles.impactMetaText}>• Serbest Harcama Havuzundan</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* 5. Buton: + Yeni Hedef Ekle */}
                <TouchableOpacity
                    style={styles.addGoalBtn}
                    onPress={() => setShowAddModal(true)}
                    activeOpacity={0.8}>
                    <Ionicons name="add-circle-outline" size={20} color="#0f172a" style={{ marginRight: 6 }} />
                    <Text style={styles.addGoalBtnText}>Yeni Hedef Ekle</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* YENİ HEDEF EKLEME MODALI */}
            <Modal
                visible={showAddModal}
                animationType="slide"
                transparent
                onRequestClose={() => setShowAddModal(false)}>
                <View style={styles.modalBg}>
                    <View style={styles.modalSheet}>
                        <View style={styles.sheetHandle} />

                        {/* Modal Başlık */}
                        <View style={styles.modalHeader}>
                            <View style={styles.modalTag}>
                                <View style={styles.greenDot} />
                                <Text style={styles.modalTagText}>HEDEF BELİRLEME</Text>
                            </View>
                            <TouchableOpacity onPress={() => setShowAddModal(false)}>
                                <Ionicons name="close-circle-outline" size={24} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalMainTitle}>Yeni Hedef Ekle</Text>
                        <Text style={styles.modalMainSubtitle}>
                            Birikim hedefin günlük harcamalarını yönlendirsin. Simülasyon motoru her kararını bu hedefe göre tartar.
                        </Text>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
                            {/* Hedef Adı */}
                            <Text style={styles.fieldLabel}>Hedef Adı *</Text>
                            <View style={styles.inputBoxRow}>
                                <TextInput
                                    style={styles.fieldInput}
                                    value={targetName}
                                    onChangeText={setTargetName}
                                    placeholder="Örn: Japonya Seyahati"
                                />
                                <Ionicons name="airplane-outline" size={20} color="#64748b" />
                            </View>

                            {/* Kategori Seçimleri */}
                            <View style={styles.catPillsRow}>
                                {['Seyahat', 'Teknoloji', 'Acil Fon', 'Diğer'].map((cat) => (
                                    <TouchableOpacity
                                        key={cat}
                                        style={[styles.catPill, selectedCat === cat && styles.catPillActive]}
                                        onPress={() => setSelectedCat(cat)}>
                                        <Text style={[styles.catPillText, selectedCat === cat && styles.catPillTextActive]}>
                                            {cat === 'Seyahat' ? '✈️ ' : cat === 'Teknoloji' ? '💻 ' : cat === 'Acil Fon' ? '🛡️ ' : '🎯 '}
                                            {cat}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Hedeflenen Tutar */}
                            <View style={styles.amountCard}>
                                <View style={styles.amountHeader}>
                                    <Text style={styles.amountCardTitle}>Hedeflenen Toplam Tutar</Text>
                                    <Text style={styles.amountCardSub}>Net Birikim</Text>
                                </View>
                                <View style={styles.amountInputRow}>
                                    <TextInput
                                        style={styles.amountBigText}
                                        keyboardType="numeric"
                                        value={targetAmount}
                                        onChangeText={setTargetAmount}
                                    />
                                    <Text style={styles.amountCurrency}>₺</Text>
                                </View>
                                <View style={styles.quickAddRow}>
                                    {['+5.000 ₺', '+10.000 ₺', '+25.000 ₺'].map((q, idx) => (
                                        <TouchableOpacity
                                            key={q}
                                            style={styles.quickAddBtn}
                                            onPress={() => {
                                                const add = idx === 0 ? 5000 : idx === 1 ? 10000 : 25000;
                                                setTargetAmount((prev) => (parseInt(prev || '0', 10) + add).toString());
                                            }}>
                                            <Text style={styles.quickAddText}>{q}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Süre / Aylık Tutar Hesabı */}
                            <View style={styles.calcBox}>
                                <View style={styles.calcTopRow}>
                                    <Text style={styles.calcTitle}>Hedef Süresi: <Text style={styles.boldText}>{targetMonths} Ay</Text></Text>
                                </View>

                                {/* Slider Adımları */}
                                <View style={styles.sliderRow}>
                                    {[1, 6, 12, 24].map((m) => (
                                        <TouchableOpacity
                                            key={m}
                                            style={[styles.stepPill, targetMonths === m && styles.stepPillActive]}
                                            onPress={() => setTargetMonths(m)}>
                                            <Text style={[styles.stepText, targetMonths === m && styles.stepTextActive]}>{m} Ay</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Aylık Gereken Tutar Kartı */}
                                <View style={styles.monthlyReqCard}>
                                    <View style={styles.monthlyReqTop}>
                                        <View>
                                            <Text style={styles.monthlyReqLabel}>Gereken Aylık Tasarruf</Text>
                                            <Text style={styles.monthlyReqValue}>
                                                {(parseInt(targetAmount || '0', 10) / targetMonths).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺ <Text style={styles.monthText}>/ ay</Text>
                                            </Text>
                                        </View>
                                        <View style={styles.safeBadge}>
                                            <Ionicons name="checkmark-circle" size={14} color="#059669" style={{ marginRight: 4 }} />
                                            <Text style={styles.safeBadgeText}>Rahat Karşılanabilir</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.monthlyReqDesc}>
                                        Bu hedefi eklersen serbest karar payın aylık güncellenir ve simülasyon motoru harcamaları bu kalkana göre tartar.
                                    </Text>
                                </View>
                            </View>

                            {/* Erteleme Kazanımlarını Aktar Switch'i */}
                            <View style={styles.switchRowCard}>
                                <View style={styles.switchTextCol}>
                                    <Text style={styles.switchTitle}>Erteleme Kazanımlarını Aktar</Text>
                                    <Text style={styles.switchSubtitle}>
                                        Vazgeçtiğin veya ertelediğin harcamaların tutarı sanal olarak bu hedefe aktarılır.
                                    </Text>
                                </View>
                                <Switch
                                    value={autoTransfer}
                                    onValueChange={setAutoTransfer}
                                    trackColor={{ false: '#cbd5e1', true: '#059669' }}
                                    thumbColor="#ffffff"
                                />
                            </View>

                            {/* Oluştur Butonu */}
                            <TouchableOpacity
                                style={styles.modalSubmitBtn}
                                onPress={() => setShowAddModal(false)}
                                activeOpacity={0.85}>
                                <Text style={styles.modalSubmitText}>Hedefi Oluştur ve Karar Motoruna Bağla ➔</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

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
        paddingBottom: 36,
    },
    titleSection: {
        marginBottom: 18,
    },
    tagPill: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#ecfdf5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
    },
    tagPillText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#059669',
        letterSpacing: 0.3,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    pageSubtitle: {
        fontSize: 13,
        color: '#64748b',
        lineHeight: 18,
    },
    mainGoalCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        elevation: 3,
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    goalImageOverlay: {
        backgroundColor: '#1e293b',
        padding: 18,
        paddingTop: 16,
    },
    goalCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    aheadBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10b981',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    greenDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ffffff',
        marginRight: 6,
    },
    aheadBadgeText: {
        color: '#ffffff',
        fontSize: 11,
        fontWeight: '700',
    },
    goalTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    priorityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    priorityLabel: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '500',
    },
    mainGoalName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#ffffff',
        letterSpacing: -0.3,
    },
    mainGoalPercent: {
        fontSize: 26,
        fontWeight: '800',
        color: '#34d399',
    },
    statsRow: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        padding: 12,
    },
    statBoxLabel: {
        fontSize: 11,
        color: '#64748b',
        fontWeight: '600',
        marginBottom: 4,
    },
    statBoxValue: {
        fontSize: 17,
        fontWeight: '800',
        color: '#0f172a',
    },
    currencyText: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
    },
    monthText: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '600',
    },
    statBoxSub: {
        fontSize: 11,
        color: '#94a3b8',
        marginTop: 2,
    },
    progressSection: {
        paddingHorizontal: 16,
        marginBottom: 14,
    },
    progressLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    remainText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#334155',
    },
    speedText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#059669',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#e2e8f0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#10b981',
        borderRadius: 4,
    },
    gainBox: {
        flexDirection: 'row',
        backgroundColor: '#ecfdf5',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 12,
        borderRadius: 14,
        alignItems: 'flex-start',
    },
    gainIconCircle: {
        marginRight: 10,
        marginTop: 2,
    },
    gainTextContainer: {
        flex: 1,
    },
    gainTitle: {
        fontSize: 10,
        fontWeight: '800',
        color: '#047857',
        letterSpacing: 0.4,
        marginBottom: 2,
    },
    gainDesc: {
        fontSize: 12,
        color: '#065f46',
        lineHeight: 17,
    },
    gainHighlight: {
        fontWeight: '800',
        color: '#047857',
    },
    boldText: {
        fontWeight: '700',
        color: '#0f172a',
    },
    secondaryGoalCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    secCardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    secIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#f0f9ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    secTitleBox: {
        flex: 1,
    },
    secTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    secGoalName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
    },
    secTag: {
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    secTagText: {
        fontSize: 10,
        color: '#0369a1',
        fontWeight: '700',
    },
    secPercent: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0284c7',
    },
    secSubtitle: {
        fontSize: 11,
        color: '#64748b',
        marginTop: 2,
    },
    secAmountsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    secAmountText: {
        fontSize: 12,
        color: '#334155',
    },
    secAmountSub: {
        fontSize: 12,
        color: '#94a3b8',
    },
    progressBarFillSec: {
        height: '100%',
        backgroundColor: '#0284c7',
        borderRadius: 4,
    },
    secFooterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    secFooterLeft: {
        fontSize: 11,
        color: '#64748b',
    },
    secFooterRight: {
        fontSize: 11,
        fontWeight: '700',
        color: '#059669',
    },
    simulatorCard: {
        backgroundColor: '#0f172a',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
    },
    simCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    simTag: {
        fontSize: 11,
        fontWeight: '800',
        color: '#a7f3d0',
        letterSpacing: 0.5,
    },
    simTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    simSubtitle: {
        fontSize: 13,
        color: '#94a3b8',
        lineHeight: 18,
        marginBottom: 16,
    },
    simButton: {
        backgroundColor: '#34d399',
        borderRadius: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    simBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#064e3b',
    },
    historySection: {
        marginBottom: 20,
    },
    historyHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
    },
    historyTimeRange: {
        fontSize: 12,
        color: '#64748b',
    },
    impactItem: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 18,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    impactIconBox: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    impactContent: {
        flex: 1,
    },
    impactTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    impactItemTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0f172a',
    },
    badgePostponed: {
        backgroundColor: '#dcfce7',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    badgePostponedText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#15803d',
    },
    badgeBought: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    badgeBoughtText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#475569',
    },
    impactDescText: {
        fontSize: 12,
        color: '#475569',
        lineHeight: 17,
        marginBottom: 4,
    },
    greenText: {
        color: '#15803d',
        fontWeight: '700',
    },
    blueText: {
        color: '#0369a1',
        fontWeight: '600',
    },
    impactMetaRow: {
        flexDirection: 'row',
        gap: 6,
    },
    impactMetaText: {
        fontSize: 11,
        color: '#94a3b8',
    },
    addGoalBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        borderStyle: 'dashed',
        borderRadius: 18,
        paddingVertical: 14,
    },
    addGoalBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0f172a',
    },
    modalBg: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalSheet: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 20,
        paddingTop: 12,
        maxHeight: '90%',
    },
    sheetHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#cbd5e1',
        alignSelf: 'center',
        marginBottom: 12,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ecfdf5',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    modalTagText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#059669',
    },
    modalMainTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 4,
    },
    modalMainSubtitle: {
        fontSize: 12,
        color: '#64748b',
        lineHeight: 17,
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#334155',
        marginBottom: 6,
    },
    inputBoxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 14,
        marginBottom: 14,
    },
    fieldInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 15,
        color: '#0f172a',
        fontWeight: '600',
    },
    catPillsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    catPill: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 14,
    },
    catPillActive: {
        backgroundColor: '#0f172a',
    },
    catPillText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#475569',
    },
    catPillTextActive: {
        color: '#ffffff',
    },
    amountCard: {
        backgroundColor: '#eff6ff',
        borderRadius: 18,
        padding: 16,
        marginBottom: 16,
    },
    amountHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    amountCardTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1e40af',
    },
    amountCardSub: {
        fontSize: 11,
        color: '#3b82f6',
    },
    amountInputRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginVertical: 6,
    },
    amountBigText: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1e3a8a',
        minWidth: 120,
    },
    amountCurrency: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1e3a8a',
        marginLeft: 4,
    },
    quickAddRow: {
        flexDirection: 'row',
        gap: 8,
    },
    quickAddBtn: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    quickAddText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#2563eb',
    },
    calcBox: {
        backgroundColor: '#ffffff',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        padding: 16,
        marginBottom: 16,
    },
    calcTopRow: {
        marginBottom: 10,
    },
    calcTitle: {
        fontSize: 14,
        color: '#475569',
    },
    sliderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    stepPill: {
        flex: 1,
        backgroundColor: '#f1f5f9',
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 10,
        marginHorizontal: 3,
    },
    stepPillActive: {
        backgroundColor: '#0f172a',
    },
    stepText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
    },
    stepTextActive: {
        color: '#ffffff',
    },
    monthlyReqCard: {
        backgroundColor: '#f8fafc',
        borderRadius: 14,
        padding: 12,
    },
    monthlyReqTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    monthlyReqLabel: {
        fontSize: 11,
        color: '#64748b',
        fontWeight: '600',
    },
    monthlyReqValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0f172a',
    },
    safeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ecfdf5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    safeBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#059669',
    },
    monthlyReqDesc: {
        fontSize: 11,
        color: '#64748b',
        lineHeight: 16,
    },
    switchRowCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        padding: 14,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    switchTextCol: {
        flex: 1,
        marginRight: 12,
    },
    switchTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 2,
    },
    switchSubtitle: {
        fontSize: 11,
        color: '#64748b',
        lineHeight: 15,
    },
    modalSubmitBtn: {
        backgroundColor: '#0f172a',
        borderRadius: 18,
        paddingVertical: 16,
        alignItems: 'center',
    },
    modalSubmitText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '700',
    },
});
