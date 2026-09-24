import { VoiceDecisionModal } from '@/components/voice/voice-decision-modal';
import { useBudget } from '@/context/budget-context';
import { ParsedVoiceDecision } from '@/services/voice-decision-parser';
import { ExpenseCategory } from '@/types/budget';
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
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
    { key: 'Elektronik', label: 'Elektronik', icon: 'hardware-chip-outline' },
    { key: 'Giyim & Moda', label: 'Giyim & Moda', icon: 'shirt-outline' },
    { key: 'Yeme & İçme', label: 'Yeme & Sosyal', icon: 'restaurant-outline' },
    { key: 'Ulaşım', label: 'Ulaşım & Seyahat', icon: 'car-sport-outline' },
    { key: 'Sağlık & Güzellik', label: 'Sağlık & Bakım', icon: 'medkit-outline' },
    { key: 'Ev & Yaşam', label: 'Ev & Yaşam', icon: 'home-outline' },
    { key: 'Hobi & Eğlence', label: 'Hobi & Eğlence', icon: 'game-controller-outline' },
    { key: 'Eğitim', label: 'Eğitim & Kitap', icon: 'school-outline' },
    { key: 'Diğer', label: 'Diğer', icon: 'apps-outline' },
];

const TIMING_OPTIONS = ['Bugün', 'Bu Hafta', 'Gelecek Ay'];
const QUICK_AMOUNTS = [1000, 2500, 5000];

const MONTH_NAMES_TR = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];
const DAY_NAMES_TR = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

export default function DecideScreen() {
    const router = useRouter();
    const { availableBudget, evaluateDecision, evaluateDecisionAsync } = useBudget();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Formdaki doldurulası gereken yer sabitlkeri ve defaultları
    const [title, setTitle] = useState('Kablosuz Kulaklık');
    const [amount, setAmount] = useState('2700');
    const [category, setCategory] = useState<ExpenseCategory>('Elektronik');
    const [timing, setTiming] = useState('Bugün');
    const [note, setNote] = useState('Kendim için alacağım, eski kulaklığım bozuldu.');

    // Takvim modal state'leri
    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [calYear, setCalYear] = useState(() => new Date().getFullYear());
    const [calMonth, setCalMonth] = useState(() => new Date().getMonth());

    // Sesli karar modalı state'i
    const [showVoiceModal, setShowVoiceModal] = useState(false);

    const handleVoiceDecisionDetected = (result: ParsedVoiceDecision) => {
        if (result.title) setTitle(result.title);
        if (result.amount > 0) setAmount(result.amount.toString());
        if (result.category) setCategory(result.category);
    };


    const handlePrevMonth = () => {
        if (calMonth === 0) {
            setCalMonth(11);
            setCalYear((prev) => prev - 1);
        } else {
            setCalMonth((prev) => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (calMonth === 11) {
            setCalMonth(0);
            setCalYear((prev) => prev + 1);
        } else {
            setCalMonth((prev) => prev + 1);
        }
    };

    const handleSelectDate = (day: number) => {
        const dStr = String(day).padStart(2, '0');
        const mStr = String(calMonth + 1).padStart(2, '0');
        const formatted = `${dStr}.${mStr}.${calYear}`;
        setTiming(formatted);
        setShowCalendarModal(false);
    };

    const handleQuickDateSelect = (type: 'today' | 'tomorrow' | 'nextWeek' | 'monthEnd') => {
        const today = new Date();
        let target = new Date();
        if (type === 'today') {
            setTiming('Bugün');
            setShowCalendarModal(false);
            return;
        } else if (type === 'tomorrow') {
            target.setDate(today.getDate() + 1);
        } else if (type === 'nextWeek') {
            target.setDate(today.getDate() + 7);
        } else if (type === 'monthEnd') {
            target = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        }
        const dStr = String(target.getDate()).padStart(2, '0');
        const mStr = String(target.getMonth() + 1).padStart(2, '0');
        setTiming(`${dStr}.${mStr}.${target.getFullYear()}`);
        setShowCalendarModal(false);
    };

    // Ay günleri matrisi
    const daysInCurrentMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
    const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const daysArray: (number | null)[] = [];
    for (let i = 0; i < startOffset; i++) {
        daysArray.push(null);
    }
    for (let d = 1; d <= daysInCurrentMonth; d++) {
        daysArray.push(d);
    }

    const isToday = (day: number) => {
        const today = new Date();
        return (
            today.getDate() === day &&
            today.getMonth() === calMonth &&
            today.getFullYear() === calYear
        );
    };

    // Kullanıcının negatif veya geçersiz karakterler girmesini engelleyen filtreleme
    const handleAmountChange = (text: string) => {
        // Virgülü noktaya çevir, negatif (-) işareti ve rakam/nokta haricindeki tüm karakterleri temizle
        let cleaned = text.replace(',', '.').replace(/[^0-9.]/g, '');
        // Birden fazla nokta girilmesini engelle
        const parts = cleaned.split('.');
        if (parts.length > 2) {
            cleaned = parts[0] + '.' + parts.slice(1).join('');
        }
        setAmount(cleaned);
    };

    // anlık simülasyon uyg için hesaplama mantığı (sadece sıfırdan büyük pozitif değerler)
    const rawParsed = parseFloat(amount.replace(',', '.'));
    const numericAmount = isNaN(rawParsed) || rawParsed <= 0 ? 0 : rawParsed;
    const expenseRatioPercent = availableBudget > 0 && numericAmount > 0
        ? Math.min(100, Math.round((numericAmount / availableBudget) * 100))
        : 0;

    const handleQuickAmount = (val: number) => {
        setAmount(val.toString());
    };

    const handleCalculate = async () => {
        if (!title.trim()) {
            Alert.alert('Eksik Bilgi', 'Lütfen almak istediğiniz ürünü yazın.');
            return;
        }

        const parsedAmount = parseFloat(amount.replace(',', '.'));
        if (!amount.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
            Alert.alert(
                'Geçersiz Tutar',
                'Harcama tutarı 0 veya sıfırın altında (negatif) olamaz. Lütfen sıfırdan büyük geçerli bir tutar girin.'
            );
            return;
        }

        if (!timing.trim()) {
            Alert.alert('Eksik Bilgi', 'Lütfen harcamayı yapmayı planladığınız tarihi belirtin.');
            return;
        }

        setIsSubmitting(true);
        try {
            // Karar motorunu çalıştır
            if (evaluateDecisionAsync) {
                await evaluateDecisionAsync({
                    title: title.trim(),
                    amount: parsedAmount,
                    category,
                    date: timing.trim(),
                    note: note.trim() || undefined,
                });
            } else {
                evaluateDecision({
                    title: title.trim(),
                    amount: parsedAmount,
                    category,
                    date: timing.trim(),
                    note: note.trim() || undefined,
                });
            }

            // Simülasyon sonuç sayfasına git
            router.push('/decision/result' as Href);
        } catch (err: any) {
            Alert.alert('Hata', 'Karar değerlendirilirken bir hata oluştu: ' + (err?.message || 'Bilinmeyen hata'));
        } finally {
            setIsSubmitting(false);
        }
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

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.scrollContent}>

                    {/* Üst Rozetler ve Başlık */}

                    <Text style={styles.mainTitle}>Bu ürünü almalı mıyım?</Text>
                    <Text style={styles.mainSubtitle}>
                        Detayları yaz, bütçen ve hedefin üzerindeki gerçek etkisini saniyeler içinde görelim.
                    </Text>

                    {/* 1. KART: Ne Almayı Düşünüyorsun? */}
                    {/* 1. KART: Ne Almayı Düşünüyorsun? */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.labelWithIcon}>
                                <Ionicons name="bag-handle-outline" size={16} color="#059669" style={{ marginRight: 6 }} />
                                <Text style={styles.cardLabel}>Ne almayı düşünüyorsun?</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.voiceTriggerBtn}
                                onPress={() => setShowVoiceModal(true)}
                                activeOpacity={0.75}
                            >
                                <Ionicons name="mic" size={14} color="#059669" />
                                <Text style={styles.voiceTriggerText}>Sesle Söyle</Text>
                            </TouchableOpacity>
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
                                onChangeText={handleAmountChange}
                                placeholder="0"
                                placeholderTextColor="#94a3b8"
                                keyboardType="decimal-pad"
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

                        {/* Manuel Tarih Girişi ve Takvim Butonu (Üstte) */}
                        <View style={styles.dateInputWrapper}>
                            <View style={styles.customDateBox}>
                                <Ionicons name="create-outline" size={16} color="#059669" style={{ marginRight: 8 }} />
                                <TextInput
                                    style={styles.customDateTextInput}
                                    value={timing}
                                    onChangeText={setTiming}
                                    placeholder="Örn: 24.10.2026 veya Özel Tarih"
                                    placeholderTextColor="#94a3b8"
                                />
                                {timing.length > 0 && (
                                    <TouchableOpacity onPress={() => setTiming('')} style={styles.clearDateBtn}>
                                        <Ionicons name="close-circle" size={16} color="#94a3b8" />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <TouchableOpacity
                                style={styles.calPickerBtn}
                                onPress={() => setShowCalendarModal(true)}
                                activeOpacity={0.85}>
                                <Ionicons name="calendar" size={18} color="#ffffff" />
                            </TouchableOpacity>
                        </View>

                        {/* 3 Hızlı Seçenek */}
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
                        onPress={() => {
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace('/(tabs)' as Href);
                            }
                        }}
                        activeOpacity={0.7}>
                        <Text style={styles.cancelBtnText}>Vazgeç</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* TAKVİM SEÇİM MODALI */}
            <Modal
                visible={showCalendarModal}
                animationType="fade"
                transparent
                onRequestClose={() => setShowCalendarModal(false)}>
                <View style={styles.calModalOverlay}>
                    <View style={styles.calModalCard}>
                        {/* Modal Üst Başlık */}
                        <View style={styles.calModalHeader}>
                            <View style={styles.calHeaderTitleRow}>
                                <View style={styles.calIconBadge}>
                                    <Ionicons name="calendar" size={18} color="#059669" />
                                </View>
                                <View>
                                    <Text style={styles.calModalMainTitle}>Tarih Seçimi</Text>
                                    <Text style={styles.calModalSubtitle}>Harcamayı planladığın günü seç</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => setShowCalendarModal(false)}
                                style={styles.calCloseBtn}
                                activeOpacity={0.7}>
                                <Ionicons name="close" size={20} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        {/* Hızlı Seçim Butonları */}
                        <View style={styles.calQuickRow}>
                            <TouchableOpacity
                                style={styles.calQuickChip}
                                onPress={() => handleQuickDateSelect('today')}>
                                <Text style={styles.calQuickChipText}>Bugün</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.calQuickChip}
                                onPress={() => handleQuickDateSelect('tomorrow')}>
                                <Text style={styles.calQuickChipText}>Yarın</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.calQuickChip}
                                onPress={() => handleQuickDateSelect('nextWeek')}>
                                <Text style={styles.calQuickChipText}>Haftaya</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.calQuickChip}
                                onPress={() => handleQuickDateSelect('monthEnd')}>
                                <Text style={styles.calQuickChipText}>Ay Sonu</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Ay Navigasyonu */}
                        <View style={styles.calNavRow}>
                            <TouchableOpacity
                                style={styles.calNavBtn}
                                onPress={handlePrevMonth}
                                activeOpacity={0.7}>
                                <Ionicons name="chevron-back" size={20} color="#0f172a" />
                            </TouchableOpacity>
                            <Text style={styles.calMonthYearText}>
                                {MONTH_NAMES_TR[calMonth]} {calYear}
                            </Text>
                            <TouchableOpacity
                                style={styles.calNavBtn}
                                onPress={handleNextMonth}
                                activeOpacity={0.7}>
                                <Ionicons name="chevron-forward" size={20} color="#0f172a" />
                            </TouchableOpacity>
                        </View>

                        {/* Gün Başlıkları */}
                        <View style={styles.calWeekDaysRow}>
                            {DAY_NAMES_TR.map((dayName, idx) => (
                                <Text key={idx} style={styles.calWeekDayLabel}>
                                    {dayName}
                                </Text>
                            ))}
                        </View>

                        {/* Günler Izgarası */}
                        <View style={styles.calDaysGrid}>
                            {daysArray.map((day, index) => {
                                if (day === null) {
                                    return <View key={`empty-${index}`} style={styles.calDayCell} />;
                                }
                                const dFormatted = `${String(day).padStart(2, '0')}.${String(calMonth + 1).padStart(2, '0')}.${calYear}`;
                                const isSelected = timing === dFormatted || (timing === 'Bugün' && isToday(day));
                                const todayFlag = isToday(day);

                                return (
                                    <TouchableOpacity
                                        key={`day-${day}`}
                                        style={[
                                            styles.calDayCell,
                                            isSelected && styles.calDayCellSelected,
                                            todayFlag && !isSelected && styles.calDayCellToday,
                                        ]}
                                        onPress={() => handleSelectDate(day)}
                                        activeOpacity={0.7}>
                                        <Text
                                            style={[
                                                styles.calDayText,
                                                isSelected && styles.calDayTextSelected,
                                                todayFlag && !isSelected && styles.calDayTextToday,
                                            ]}>
                                            {day}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </View>
            </Modal>
            <VoiceDecisionModal
                visible={showVoiceModal}
                onClose={() => setShowVoiceModal(false)}
                onDecisionDetected={handleVoiceDecisionDetected}
            />
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
    dateInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 8,
    },
    customDateBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f7ff',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
    },
    customDateTextInput: {
        flex: 1,
        fontSize: 13,
        fontWeight: '600',
        color: '#0f172a',
        paddingVertical: 0,
    },
    clearDateBtn: {
        padding: 4,
    },
    calPickerBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#059669',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    // Calendar Modal Styles
    calModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    calModalCard: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    calModalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    calHeaderTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    calIconBadge: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#ecfdf5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    calModalMainTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0f172a',
    },
    calModalSubtitle: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 1,
    },
    calCloseBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    calQuickRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 14,
    },
    calQuickChip: {
        flex: 1,
        backgroundColor: '#f1f5f9',
        paddingVertical: 7,
        borderRadius: 10,
        alignItems: 'center',
    },
    calQuickChipText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#334155',
    },
    calNavRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 6,
        marginBottom: 10,
    },
    calNavBtn: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    calMonthYearText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#0f172a',
    },
    calWeekDaysRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    calWeekDayLabel: {
        flex: 1,
        textAlign: 'center',
        fontSize: 11,
        fontWeight: '700',
        color: '#94a3b8',
    },
    calDaysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    calDayCell: {
        width: `${100 / 7}%`,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginVertical: 2,
    },
    calDayCellSelected: {
        backgroundColor: '#059669',
    },
    calDayCellToday: {
        borderWidth: 1.5,
        borderColor: '#059669',
    },
    calDayText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1e293b',
    },
    calDayTextSelected: {
        color: '#ffffff',
        fontWeight: '800',
    },
    calDayTextToday: {
        color: '#059669',
        fontWeight: '800',
    },
    voiceTriggerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ecfdf5',
        borderWidth: 1,
        borderColor: '#a7f3d0',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        gap: 4,
    },
    voiceTriggerText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#059669',
    },

});
