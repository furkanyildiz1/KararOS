import { useBudget } from '@/context/budget-context';
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
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
    const { budgetProfile, decisions, goals, addGoal, deleteGoal } = useBudget();

    // Yeni Hedef Modalı State'leri
    const [showAddModal, setShowAddModal] = useState(false);
    const [targetName, setTargetName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [targetMonths, setTargetMonths] = useState(6);
    const [selectedCat, setSelectedCat] = useState('Seyahat');
    const [autoTransfer, setAutoTransfer] = useState(true);

    const formatCurrency = (val: number) => {
        return val.toLocaleString('tr-TR');
    };

    const getGoalCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
        if (category.includes('Seyahat') || category.includes('Tatil') || category.includes('Ulaşım')) return 'airplane-outline';
        if (category.includes('Teknoloji') || category.includes('Elektronik')) return 'hardware-chip-outline';
        if (category.includes('Acil Fon') || category.includes('Güvenlik')) return 'shield-checkmark-outline';
        if (category.includes('Ev') || category.includes('Yaşam')) return 'home-outline';
        if (category.includes('Giyim') || category.includes('Moda')) return 'shirt-outline';
        if (category.includes('Eğitim')) return 'school-outline';
        return 'flag-outline';
    };

    const handleAddGoalSubmit = async () => {
        if (!targetName.trim()) {
            Alert.alert('Eksik Bilgi', 'Lütfen hedefinize bir isim verin.');
            return;
        }
        const amountNum = parseInt(targetAmount.replace(/[^0-9]/g, ''), 10);
        if (isNaN(amountNum) || amountNum <= 0) {
            Alert.alert('Geçersiz Tutar', 'Lütfen geçerli bir hedef tutarı girin.');
            return;
        }

        await addGoal({
            title: targetName.trim(),
            category: selectedCat,
            targetAmount: amountNum,
            currentAmount: 0,
            targetMonths: targetMonths,
            autoTransfer: autoTransfer,
        });

        // Formu temizle ve modalı kapat
        setTargetName('');
        setTargetAmount('');
        setTargetMonths(6);
        setSelectedCat('Seyahat');
        setShowAddModal(false);
        Alert.alert('Hedef Oluşturuldu 🎯', `"${targetName.trim()}" hedefiniz tasarruf kalkanına bağlandı.`);
    };

    const handleDeleteGoal = (id: string, name: string) => {
        Alert.alert(
            'Hedefi Sil',
            `"${name}" hedefini silmek istediğinize emin misiniz?`,
            [
                { text: 'Vazgeç', style: 'cancel' },
                {
                    text: 'Evet, Sil',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteGoal(id);
                    },
                },
            ]
        );
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

                {/* Yeni Hedef Ekle Artı Butonu */}
                <TouchableOpacity
                    style={styles.headerAddBtn}
                    onPress={() => setShowAddModal(true)}
                    activeOpacity={0.8}>
                    <Ionicons name="add" size={22} color="#059669" />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>

                {/* Sayfa Başlığı */}
                <View style={styles.titleSection}>
                    <Text style={styles.pageTitle}>Tasarruf Hedeflerin</Text>
                    <Text style={styles.pageSubtitle}>
                        Verdiğin her harcama kararı bu hedeflere ne kadar hızlı ulaşacağını belirler.
                    </Text>
                </View>

                {/* HEDEFLER LİSTESİ */}
                {goals.length === 0 ? (
                    <View style={styles.emptyGoalCard}>
                        <View style={styles.emptyIconCircle}>
                            <Ionicons name="flag-outline" size={28} color="#059669" />
                        </View>
                        <Text style={styles.emptyGoalTitle}>Henüz Bir Hedef Eklenmedi</Text>
                        <Text style={styles.emptyGoalSubtitle}>
                            Aylık tasarruf havuzunu yönlendirmek ve kararlarının hedeflerine etkisini görmek için ilk hedefini oluştur.
                        </Text>
                        <TouchableOpacity
                            style={styles.emptyAddBtn}
                            onPress={() => setShowAddModal(true)}
                            activeOpacity={0.85}>
                            <Ionicons name="add-circle" size={18} color="#ffffff" style={{ marginRight: 6 }} />
                            <Text style={styles.emptyAddBtnText}>İlk Hedefini Ekle</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    goals.map((goal, index) => {
                        const monthlyRequired = Math.round(goal.targetAmount / (goal.targetMonths || 1));
                        const percent = Math.min(100, Math.max(0, Math.round((goal.currentAmount / goal.targetAmount) * 100)));
                        const isPrimary = index === 0;

                        return (
                            <View key={goal.id} style={styles.mainGoalCard}>
                                {/* Kart Üst Satırı: Kategori / Öncelik Hapı & Çöp Kutusu */}
                                <View style={styles.goalCardTopBar}>
                                    <View style={[styles.priorityPill, isPrimary ? styles.priorityPillPrimary : styles.priorityPillSecondary]}>
                                        <Ionicons
                                            name={getGoalCategoryIcon(goal.category)}
                                            size={14}
                                            color={isPrimary ? '#059669' : '#0284c7'}
                                            style={{ marginRight: 6 }}
                                        />
                                        <Text style={[styles.priorityPillText, { color: isPrimary ? '#059669' : '#0284c7' }]}>
                                            {isPrimary ? `Öncelikli Hedef • ${goal.category}` : goal.category}
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => handleDeleteGoal(goal.id, goal.title)}
                                        style={styles.deleteGoalBtn}
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                        <Ionicons name="trash-outline" size={16} color="#94a3b8" />
                                    </TouchableOpacity>
                                </View>

                                {/* Başlık ve Yüzde Göstergesi */}
                                <View style={styles.goalTitleRow}>
                                    <Text style={styles.mainGoalName}>{goal.title}</Text>
                                    <View style={styles.percentBadge}>
                                        <Text style={styles.percentBadgeText}>%{percent}</Text>
                                    </View>
                                </View>

                                {/* İstatistikler */}
                                <View style={styles.statsRow}>
                                    <View style={styles.statBox}>
                                        <Text style={styles.statBoxLabel}>Hedef Tutar</Text>
                                        <Text style={styles.statBoxValue}>
                                            {formatCurrency(goal.targetAmount)} <Text style={styles.currencyText}>TL</Text>
                                        </Text>
                                        <Text style={styles.statBoxSub}>Kalan: {formatCurrency(Math.max(0, goal.targetAmount - goal.currentAmount))} TL</Text>
                                    </View>

                                    <View style={styles.statBox}>
                                        <Text style={styles.statBoxLabel}>Gereken Aylık</Text>
                                        <Text style={styles.statBoxValue}>
                                            {formatCurrency(monthlyRequired)} <Text style={styles.monthText}>TL/ay</Text>
                                        </Text>
                                        <Text style={styles.statBoxSub}>Süre: {goal.targetMonths} Ay</Text>
                                    </View>
                                </View>

                                {/* İlerleme Çubuğu */}
                                <View style={styles.progressSection}>
                                    <View style={styles.progressBarBg}>
                                        <View style={[styles.progressBarFill, { width: `${Math.max(4, percent)}%` }]} />
                                    </View>
                                </View>
                            </View>
                        );
                    })
                )}

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
                        <Text style={styles.historyTimeRange}>Geçmiş Kararlar</Text>
                    </View>

                    {decisions.length === 0 ? (
                        <View style={{ paddingVertical: 18, alignItems: 'center' }}>
                            <Text style={{ color: '#64748b', fontSize: 13 }}>
                                Henüz değerlendirilmiş bir harcama kararı bulunmuyor.
                            </Text>
                        </View>
                    ) : (
                        decisions.slice(0, 5).map((d) => (
                            <View key={d.id} style={styles.impactItem}>
                                <View style={[
                                    styles.impactIconBox,
                                    d.action === 'POSTPONED' && { backgroundColor: '#dcfce7' },
                                    d.action === 'BOUGHT' && { backgroundColor: '#e0f2fe' },
                                    d.action === 'CANCELLED' && { backgroundColor: '#fee2e2' },
                                ]}>
                                    <Ionicons
                                        name={d.action === 'POSTPONED' ? 'hourglass-outline' : (d.action === 'BOUGHT' ? 'cart-outline' : 'close-circle-outline')}
                                        size={20}
                                        color={d.action === 'POSTPONED' ? '#15803d' : (d.action === 'BOUGHT' ? '#0369a1' : '#dc2626')}
                                    />
                                </View>
                                <View style={styles.impactContent}>
                                    <View style={styles.impactTopRow}>
                                        <Text style={styles.impactItemTitle}>{d.request.title}</Text>
                                        <View style={[
                                            styles.badgeBought,
                                            d.action === 'POSTPONED' && styles.badgePostponed,
                                            d.action === 'CANCELLED' && { backgroundColor: '#fee2e2' },
                                        ]}>
                                            <Text style={[
                                                styles.badgeBoughtText,
                                                d.action === 'POSTPONED' && styles.badgePostponedText,
                                                d.action === 'CANCELLED' && { color: '#dc2626' },
                                            ]}>
                                                {d.action === 'POSTPONED' ? 'Ertelendi' : (d.action === 'BOUGHT' ? 'Satın Alındı' : (d.action === 'CANCELLED' ? 'Vazgeçildi' : 'Beklemede'))}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={styles.impactDescText}>
                                        {formatCurrency(d.request.amount)} TL • {d.action === 'POSTPONED' ? 'Tasarruf tamponu korundu' : 'Bütçeden düşüldü'}
                                    </Text>
                                    <View style={styles.impactMetaRow}>
                                        <Text style={styles.impactMetaText}>Tarih: {d.actionDate || d.request.date || 'Bugün'}</Text>
                                        <Text style={styles.impactMetaText}>• {d.request.category}</Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    )}
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

                        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 24 }}>
                            {/* Hedef Adı */}
                            <Text style={styles.fieldLabel}>Hedef Adı *</Text>
                            <View style={styles.inputBoxRow}>
                                <TextInput
                                    style={styles.fieldInput}
                                    value={targetName}
                                    onChangeText={setTargetName}
                                    placeholder="Örn: Japonya Seyahati, Yeni Bilgisayar"
                                />
                                <Ionicons name="flag-outline" size={20} color="#64748b" />
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
                                        placeholder="0"
                                        value={targetAmount}
                                        onChangeText={(val) => setTargetAmount(val.replace(/[^0-9]/g, ''))}
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
                                    {[1, 3, 6, 12, 24].map((m) => (
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
                                                {(parseInt(targetAmount || '0', 10) / (targetMonths || 1)).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺ <Text style={styles.monthText}>/ ay</Text>
                                            </Text>
                                        </View>
                                        <View style={styles.safeBadge}>
                                            <Ionicons name="checkmark-circle" size={14} color="#059669" style={{ marginRight: 4 }} />
                                            <Text style={styles.safeBadgeText}>Hedef Kalkanı</Text>
                                        </View>
                                    </View>
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
                                onPress={handleAddGoalSubmit}
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
    headerAddBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#ecfdf5',
        alignItems: 'center',
        justifyContent: 'center',
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
        borderRadius: 22,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        elevation: 2,
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
    },
    emptyGoalCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'dashed',
    },
    emptyIconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ecfdf5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    emptyGoalTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 6,
        textAlign: 'center',
    },
    emptyGoalSubtitle: {
        fontSize: 12.5,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 16,
        paddingHorizontal: 10,
    },
    emptyAddBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#059669',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 14,
    },
    emptyAddBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#ffffff',
    },
    goalCardTopBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    priorityPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    priorityPillPrimary: {
        backgroundColor: '#ecfdf5',
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    priorityPillSecondary: {
        backgroundColor: '#f0f9ff',
        borderWidth: 1,
        borderColor: '#bae6fd',
    },
    priorityPillText: {
        fontSize: 11.5,
        fontWeight: '700',
    },
    deleteGoalBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    goalTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    mainGoalName: {
        flex: 1,
        fontSize: 20,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: -0.3,
        marginRight: 10,
    },
    percentBadge: {
        backgroundColor: '#ecfdf5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    percentBadgeText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#059669',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 14,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#f8fafc',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
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
        marginTop: 2,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#f1f5f9',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#059669',
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
    greenDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#059669',
        marginRight: 6,
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
