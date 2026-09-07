import { useBudget } from '@/context/budget-context';
import { ExpenseCategory } from '@/types/budget';
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CategoryOption {
    key: ExpenseCategory;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
}

const CATEGORIES: CategoryOption[] = [
    { key: 'Elektronik', label: 'Elektronik', icon: 'headset-outline' },
    { key: 'Giyim & Moda', label: 'Giyim', icon: 'shirt-outline' },
    { key: 'Yeme & İçme', label: 'Sosyal & Yeme', icon: 'cafe-outline' },
    { key: 'Ulaşım', label: 'Seyahat', icon: 'airplane-outline' },
    { key: 'Diğer', label: 'Diğer', icon: 'cube-outline' },
];

const TIMING_OPTIONS = ['Bugün', 'Bu Hafta', 'Gelecek Ay'];
const QUICK_AMOUNTS = [1000, 2500, 5000];

export default function DecideScreen() {
    const router = useRouter();
    const { availableBudget, evaluateDecision } = useBudget();

    // Formdaki doldurulası gereken yer sabitlkeri ve defaultları
    const [title, setTitle] = useState('Kablosuz Kulaklık');
    const [amount, setAmount] = useState('2700');
    const [category, setCategory] = useState<ExpenseCategory>('Elektronik');
    const [timing, setTiming] = useState('Bugün');
    const [note, setNote] = useState('Kendim için alacağım, eski kulaklığım bozuldu.');

    // anlık simülasyon uyg için hesapalama mantığı
    const numericAmount = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0;
    const expenseRatioPercent = availableBudget > 0
        ? Math.min(100, Math.round((numericAmount / availableBudget) * 100))
        : 13;

    const handleQuickAmount = (val: number) => {
        setAmount(val.toString());
    };

    const handleCalculate = () => {
        if (!title.trim()) {
            Alert.alert('Eksik Bilgi', 'Lütfen almak istediğiniz ürünü yazın.');
            return;
        }
        if (numericAmount <= 0) {
            Alert.alert('Geçersiz Tutar', 'Lütfen geçerli bir harcama tutarı girin.');
            return;
        }

        // Karar motorunu çalıştır
        evaluateDecision({
            title: title.trim(),
            amount: numericAmount,
            category,
            date: timing,
            note: note.trim() || undefined,
        });

        // Simülasyon sonuç sayfasına git
        router.push('/decision/result' as Href);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Üst Logo Barı */}
            <View style={styles.topBar}>
                <View style={styles.brandRow}>
                    <Image
                        source={require('@/../assets/images/kararos-logo.png')}
                        style={styles.brandLogoImg}
                        resizeMode="cover"
                    />
                    <Text style={styles.brandTitle}>KararOS</Text>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>

                {/* Üst Rozetler ve Başlık */}

                <Text style={styles.mainTitle}>Bu ürünü almalı mıyım?</Text>
                <Text style={styles.mainSubtitle}>
                    Detayları yaz, bütçen ve hedefin üzerindeki gerçek etkisini saniyeler içinde görelim.
                </Text>

                {/* 1. KART: Ne Almayı Düşünüyorsun? */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.labelWithIcon}>
                            <Ionicons name="bag-handle-outline" size={16} color="#059669" style={{ marginRight: 6 }} />
                            <Text style={styles.cardLabel}>Ne almayı düşünüyorsun?</Text>
                        </View>
                        <View style={styles.stepBadge}>
                            <Text style={styles.stepBadgeText}>Adım 1</Text>
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.textInput}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Örn: Kablosuz Kulaklık"
                            placeholderTextColor="#94a3b8"
                        />
                        {title.length > 0 && (
                            <TouchableOpacity onPress={() => setTitle('')} style={styles.clearBtn}>
                                <Ionicons name="close-outline" size={18} color="#94a3b8" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* 2. KART: Tahmini Fiyatı Ne Kadar? */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.labelWithIcon}>
                            <Ionicons name="cash-outline" size={16} color="#059669" style={{ marginRight: 6 }} />
                            <Text style={styles.cardLabel}>Tahmini fiyatı ne kadar?</Text>
                        </View>
                        <Text style={styles.currencyTag}>TRY (₺)</Text>
                    </View>

                    <View style={styles.priceInputBox}>
                        <TextInput
                            style={styles.priceInput}
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="0"
                            placeholderTextColor="#94a3b8"
                            keyboardType="numeric"
                        />
                        <Text style={styles.priceSuffix}>TL</Text>
                    </View>

                    <View style={styles.quickSelectRow}>
                        <Text style={styles.quickSelectLabel}>Hızlı Seç:</Text>
                        {QUICK_AMOUNTS.map((val) => (
                            <TouchableOpacity
                                key={val}
                                style={[
                                    styles.quickPill,
                                    numericAmount === val && styles.quickPillActive,
                                ]}
                                onPress={() => handleQuickAmount(val)}
                                activeOpacity={0.7}>
                                <Text
                                    style={[
                                        styles.quickPillText,
                                        numericAmount === val && styles.quickPillTextActive,
                                    ]}>
                                    {val.toLocaleString('tr-TR')} TL
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* 3. KART: Hangi Kategoriye Ait? */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.labelWithIcon}>
                            <Ionicons name="grid-outline" size={16} color="#059669" style={{ marginRight: 6 }} />
                            <Text style={styles.cardLabel}>Hangi kategoriye ait?</Text>
                        </View>
                    </View>

                    <View style={styles.categoryPillsWrap}>
                        {CATEGORIES.map((cat) => {
                            const isSelected = category === cat.key;
                            return (
                                <TouchableOpacity
                                    key={cat.key}
                                    style={[
                                        styles.catPill,
                                        isSelected ? styles.catPillSelected : styles.catPillUnselected,
                                    ]}
                                    onPress={() => setCategory(cat.key)}
                                    activeOpacity={0.75}>
                                    <Ionicons
                                        name={cat.icon}
                                        size={15}
                                        color={isSelected ? '#ffffff' : '#0f172a'}
                                        style={{ marginRight: 6 }}
                                    />
                                    <Text
                                        style={[
                                            styles.catPillText,
                                            isSelected ? styles.catPillTextSelected : styles.catPillTextUnselected,
                                        ]}>
                                        {cat.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* 4. KART: Ne Zaman Harcamayı Planlıyorsun? */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.labelWithIcon}>
                            <Ionicons name="calendar-outline" size={16} color="#059669" style={{ marginRight: 6 }} />
                            <Text style={styles.cardLabel}>Ne zaman harcamayı planlıyorsun?</Text>
                        </View>
                    </View>

                    <View style={styles.timingSegmentContainer}>
                        {TIMING_OPTIONS.map((item) => {
                            const isSelected = timing === item;
                            return (
                                <TouchableOpacity
                                    key={item}
                                    style={[
                                        styles.timingSegmentBtn,
                                        isSelected && styles.timingSegmentBtnActive,
                                    ]}
                                    onPress={() => setTiming(item)}
                                    activeOpacity={0.8}>
                                    <Text
                                        style={[
                                            styles.timingSegmentText,
                                            isSelected && styles.timingSegmentTextActive,
                                        ]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* 5. KART: Kısa Bir Not */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.labelWithIcon}>
                            <Ionicons name="create-outline" size={16} color="#059669" style={{ marginRight: 6 }} />
                            <Text style={styles.cardLabel}>
                                Kısa bir not <Text style={styles.optionalText}>(isteğe bağlı)</Text>
                            </Text>
                        </View>
                    </View>

                    <View style={styles.noteInputBox}>
                        <TextInput
                            style={styles.noteInput}
                            value={note}
                            onChangeText={setNote}
                            placeholder="Örn: Kendim için alacağım, eski kulaklığım bozuldu."
                            placeholderTextColor="#94a3b8"
                            multiline
                            numberOfLines={3}
                        />
                    </View>
                </View>

                {/* 6. ANLIK SİMÜLASYON ÖNGÖRÜSÜ */}
                <View style={styles.previewBox}>
                    <View style={styles.previewIconWrap}>
                        <Ionicons name="bulb-outline" size={18} color="#059669" />
                    </View>
                    <View style={styles.previewContent}>
                        <Text style={styles.previewTitle}>Anlık Simülasyon Öngörüsü</Text>
                        <Text style={styles.previewText}>
                            Bu harcama aylık kullanılabilir bütçenin{' '}
                            <Text style={{ fontWeight: '800', color: '#0f172a' }}>
                                %{expenseRatioPercent > 0 ? expenseRatioPercent : 13}'ünü
                            </Text>{' '}
                            temsil ediyor.
                        </Text>
                    </View>
                </View>

                {/* 7. AKSİYON BUTONLARI */}
                <TouchableOpacity
                    style={styles.calculateBtn}
                    onPress={handleCalculate}
                    activeOpacity={0.85}>
                    <Text style={styles.calculateBtnText}>Etkiyi Hesapla</Text>
                    <Ionicons name="arrow-forward" size={18} color="#ffffff" style={{ marginLeft: 8 }} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => router.back()}
                    activeOpacity={0.7}>
                    <Text style={styles.cancelBtnText}>Vazgeç</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    topBar: {
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
    avatarBtn: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
    },
    badgeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    pillBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eff6ff',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#dbeafe',
    },
    tealDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#059669',
        marginRight: 6,
    },
    pillBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#1e293b',
    },
    timeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeBadgeText: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '500',
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: -0.5,
        marginBottom: 6,
    },
    mainSubtitle: {
        fontSize: 13,
        color: '#64748b',
        lineHeight: 19,
        marginBottom: 18,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 6,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    labelWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0f172a',
    },
    optionalText: {
        fontSize: 12,
        fontWeight: '400',
        color: '#94a3b8',
    },
    stepBadge: {
        backgroundColor: '#ecfdf5',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    stepBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#059669',
    },
    currencyTag: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748b',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f7ff',
        borderRadius: 14,
        paddingHorizontal: 14,
    },
    textInput: {
        flex: 1,
        height: 48,
        fontSize: 15,
        fontWeight: '600',
        color: '#0f172a',
    },
    clearBtn: {
        padding: 6,
    },
    priceInputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f0f7ff',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginBottom: 12,
    },
    priceInput: {
        flex: 1,
        fontSize: 26,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: -0.5,
    },
    priceSuffix: {
        fontSize: 18,
        fontWeight: '700',
        color: '#64748b',
        marginLeft: 8,
    },
    quickSelectRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    quickSelectLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
    },
    quickPill: {
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 14,
    },
    quickPillActive: {
        backgroundColor: '#0f172a',
    },
    quickPillText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#0369a1',
    },
    quickPillTextActive: {
        color: '#ffffff',
    },
    categoryPillsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    catPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 14,
    },
    catPillSelected: {
        backgroundColor: '#0f172a',
    },
    catPillUnselected: {
        backgroundColor: '#e0f2fe',
    },
    catPillText: {
        fontSize: 13,
        fontWeight: '700',
    },
    catPillTextSelected: {
        color: '#ffffff',
    },
    catPillTextUnselected: {
        color: '#0f172a',
    },
    timingSegmentContainer: {
        flexDirection: 'row',
        backgroundColor: '#f0f7ff',
        borderRadius: 14,
        padding: 4,
        gap: 4,
    },
    timingSegmentBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    timingSegmentBtnActive: {
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    timingSegmentText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748b',
    },
    timingSegmentTextActive: {
        color: '#0f172a',
        fontWeight: '800',
    },
    noteInputBox: {
        backgroundColor: '#f0f7ff',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    noteInput: {
        fontSize: 14,
        color: '#0f172a',
        minHeight: 60,
        textAlignVertical: 'top',
        lineHeight: 20,
    },
    previewBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eff6ff',
        borderRadius: 18,
        padding: 14,
        borderWidth: 1,
        borderColor: '#dbeafe',
        marginBottom: 20,
    },
    previewIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#a7f3d0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    previewContent: {
        flex: 1,
    },
    previewTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 2,
    },
    previewText: {
        fontSize: 12,
        color: '#475569',
        lineHeight: 17,
    },
    calculateBtn: {
        backgroundColor: '#0a192f',
        borderRadius: 24,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0a192f',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        marginBottom: 12,
    },
    calculateBtnText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: -0.2,
    },
    cancelBtn: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    cancelBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
});
