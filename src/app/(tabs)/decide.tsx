import { useBudget } from '@/context/budget-context';
import { ExpenseCategory } from '@/types/budget';
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES: ExpenseCategory[] = [
    'Elektronik',
    'Giyim & Moda',
    'Yeme & İçme',
    'Sağlık & Güzellik',
    'Ev & Yaşam',
    'Hobi & Eğlence',
    'Ulaşım',
    'Eğitim',
    'Diğer',
]

export default function DecideScreen() {
    const router = useRouter();
    const { evaluateDecision } = useBudget();

    //form alanları
    const [title, setTitle] = useState("kablosuz kulaklık");
    const [amount, setAmount] = useState('2700');
    const [category, setCategory] = useState<ExpenseCategory>('Elektronik');
    const [date, setDate] = useState('Bugün');
    const [note, setNote] = useState('Kendim için alacağım.');
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    //hesapla butonuna basılınca

    const handleCalculate = () => {
        const numericAmount = parseFloat(amount.replace(/[^0-9.]/g, ''));

        if (!title.trim()) {
            Alert.alert('Eksik Bilgi', 'Lütfen bir ürün / harcama adı girin.');
            return;
        }
        if (isNaN(numericAmount) || numericAmount <= 0) {
            Alert.alert("Geçersiz Tutar", "Lütfen geçerli bir harcama tutarı girin.");
            return;
        }

        //karr motorunu çalıştırma ve sonucu contexte kaydetme
        evaluateDecision({
            title: title.trim(),
            amount: numericAmount,
            category,
            date,
            note: note.trim() || undefined,
        });

        //karar etki & sonuç ekranına yönlendirme

        router.push('/decision/result' as Href);

    };


    return (
        <SafeAreaView style={styles.container}>
            {/* Üst Bar */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={24} color="#0f172a" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Bu ürünü almalı mıyım?</Text>
                    <Text style={styles.headerSubtitle}>Almak istediğin ürünü ekle</Text>
                </View>
                <View style={styles.placeholder} />
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>
                {/* Form Kartı */}
                <View style={styles.formCard}>
                    <Text style={styles.formSectionTitle}>Ürün / Harcama Bilgisi</Text>
                    {/* 1. Ürün Adı */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Ürün adı</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Örn: Kablosuz Kulaklık"
                            placeholderTextColor="#94a3b8"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>
                    {/* 2. Tahmini Fiyat */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Tahmini Fiyat (₺)</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Örn: 2700"
                            placeholderTextColor="#94a3b8"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />
                    </View>
                    {/* 3. Kategori Seçimi */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Kategori</Text>
                        <TouchableOpacity
                            style={styles.selectButton}
                            onPress={() => setShowCategoryModal(true)}
                            activeOpacity={0.7}>
                            <Text style={styles.selectButtonText}>{category}</Text>
                            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                    {/* 4. Almak İstediğin Tarih */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Almak istediğin tarih</Text>
                        <View style={styles.datePickerRow}>
                            <Text style={styles.dateText}>{date}</Text>
                            <Ionicons name="calendar-outline" size={18} color="#64748b" />
                        </View>
                    </View>
                    {/* 5. Not (opsiyonel) */}
                    <View style={[styles.inputGroup, { borderBottomWidth: 0 }]}>
                        <Text style={styles.inputLabel}>Not (opsiyonel)</Text>
                        <TextInput
                            style={[styles.textInput, styles.textArea]}
                            placeholder="Örn: Kendim için alacağım."
                            placeholderTextColor="#94a3b8"
                            value={note}
                            onChangeText={setNote}
                            multiline
                        />
                    </View>
                </View>
                {/* Hesapla Aksiyon Butonu */}
                <TouchableOpacity
                    style={styles.calculateButton}
                    onPress={handleCalculate}
                    activeOpacity={0.85}>
                    <Text style={styles.calculateButtonText}>Hesapla</Text>
                </TouchableOpacity>
            </ScrollView>
            {/* Kategori Seçim Modalı */}
            <Modal
                visible={showCategoryModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowCategoryModal(false)}>
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowCategoryModal(false)}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Kategori Seçin</Text>
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.modalItem,
                                    category === cat && styles.modalItemSelected,
                                ]}
                                onPress={() => {
                                    setCategory(cat);
                                    setShowCategoryModal(false);
                                }}>
                                <Text
                                    style={[
                                        styles.modalItemText,
                                        category === cat && styles.modalItemTextSelected,
                                    ]}>
                                    {cat}
                                </Text>
                                {category === cat && (
                                    <Ionicons name="checkmark" size={18} color="#059669" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
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
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        letterSpacing: -0.3,
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    placeholder: {
        width: 40,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 28,
    },
    formCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    formSectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 16,
        letterSpacing: -0.2,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#0f172a',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    textArea: {
        minHeight: 60,
        textAlignVertical: 'top',
    },
    selectButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    selectButtonText: {
        fontSize: 15,
        color: '#0f172a',
        fontWeight: '500',
    },
    datePickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    dateText: {
        fontSize: 15,
        color: '#0f172a',
        fontWeight: '500',
    },
    calculateButton: {
        backgroundColor: '#0f172a',
        borderRadius: 24,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
    },
    calculateButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: -0.2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        paddingHorizontal: 28,
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        elevation: 6,
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 14,
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    modalItemSelected: {
        backgroundColor: '#f0fdf4',
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    modalItemText: {
        fontSize: 15,
        color: '#334155',
    },
    modalItemTextSelected: {
        color: '#059669',
        fontWeight: '700',
    },
});
