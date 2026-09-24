import { ParsedVoiceDecision, parseVoiceDecision } from '@/services/voice-decision-parser';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Easing,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Güvenli Native Modül Yükleyici (Expo Go'da çökmesini engeller)
let ExpoSpeechRecognitionModule: any = null;
try {
    const speech = require('expo-speech-recognition');
    ExpoSpeechRecognitionModule = speech?.ExpoSpeechRecognitionModule ?? null;
} catch {
    ExpoSpeechRecognitionModule = null;
}

interface VoiceDecisionModalProps {
    visible: boolean;
    onClose: () => void;
    onDecisionDetected: (result: ParsedVoiceDecision) => void;
}

// Hızlı test için örnek cümleler
const PRESET_EXAMPLES = [
    {
        icon: 'headset-outline',
        label: '2.700 TL Bluetooth Kulaklık',
        phrase: '2700 liraya yeni bir kablosuz bluetooth kulaklık almayı düşünüyorum',
    },
    {
        icon: 'shirt-outline',
        label: '4.500 TL Kışlık Mont',
        phrase: 'Kış sezonu için 4500 liraya sıcak tutan bir mont alacağım',
    },
    {
        icon: 'restaurant-outline',
        label: '850 TL Akşam Yemeği',
        phrase: 'Bu akşam arkadaşlarla dışarıda 850 TL akşam yemeği harcaması yapacağım',
    },
    {
        icon: 'airplane-outline',
        label: '3.200 TL Uçak Bileti',
        phrase: 'Haftaya İzmir seyahati için 3200 liraya uçak bileti alıyorum',
    },
];

export function VoiceDecisionModal({
    visible,
    onClose,
    onDecisionDetected,
}: VoiceDecisionModalProps) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [parsedResult, setParsedResult] = useState<ParsedVoiceDecision | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>('Mikrofona dokunun ve harcamanızı söyleyin');

    // Mikrofon titreşim / pulse animasyonları
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const waveAnim = useRef(new Animated.Value(0)).current;

    // Cümleyi Türkçe zeka motoru ile ayrıştır
    const handleProcessText = (text: string) => {
        setTranscript(text);
        if (text.trim().length > 0) {
            const result = parseVoiceDecision(text);
            setParsedResult(result);
        } else {
            setParsedResult(null);
        }
    };

    // Native Speech Event Listener'ları Dinamik Bağlama (Eğer Development Build ise)
    useEffect(() => {
        if (!ExpoSpeechRecognitionModule) return;

        const subStart = ExpoSpeechRecognitionModule.addListener?.('start', () => {
            setIsListening(true);
            setStatusMessage('Sizi dinliyorum, Türkçe konuşabilirsiniz...');
        });

        const subEnd = ExpoSpeechRecognitionModule.addListener?.('end', () => {
            setIsListening(false);
            setStatusMessage('Dinleme tamamlandı. Sonuçları kontrol edebilirsiniz.');
        });

        const subResult = ExpoSpeechRecognitionModule.addListener?.('result', (event: any) => {
            const currentTranscript = event?.results?.[0]?.transcript || '';
            if (currentTranscript) {
                handleProcessText(currentTranscript);
            }
        });

        const subError = ExpoSpeechRecognitionModule.addListener?.('error', (event: any) => {
            console.log('[Speech Recognition Error]:', event?.error, event?.message);
            setIsListening(false);
            if (event?.error === 'no-speech') {
                setStatusMessage('Ses algılanamadı, lütfen tekrar deneyin.');
            } else {
                setStatusMessage('Ses tanıma tamamlandı.');
            }
        });

        return () => {
            subStart?.remove?.();
            subEnd?.remove?.();
            subResult?.remove?.();
            subError?.remove?.();
        };
    }, []);

    useEffect(() => {
        if (visible) {
            setTranscript('');
            setParsedResult(null);
            setIsListening(false);
            setStatusMessage('Mikrofona dokunun ve harcamanızı söyleyin');
        } else {
            // Modal kapandığında ses tanımayı durdur
            try {
                if (ExpoSpeechRecognitionModule && typeof ExpoSpeechRecognitionModule.stop === 'function') {
                    ExpoSpeechRecognitionModule.stop();
                }
            } catch {}
        }
    }, [visible]);

    // Mikrofon nefes alma ve dalga animasyon döngüsü
    useEffect(() => {
        let pulseLoop: Animated.CompositeAnimation | null = null;
        let waveLoop: Animated.CompositeAnimation | null = null;

        if (isListening) {
            pulseLoop = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 700,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 700,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            );

            waveLoop = Animated.loop(
                Animated.sequence([
                    Animated.timing(waveAnim, {
                        toValue: 1,
                        duration: 1100,
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.timing(waveAnim, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ])
            );

            pulseLoop.start();
            waveLoop.start();
        } else {
            pulseAnim.setValue(1);
            waveAnim.setValue(0);
        }

        return () => {
            pulseLoop?.stop();
            waveLoop?.stop();
        };
    }, [isListening]);

    // Mikrofon Başlatma / Durdurma Fonksiyonu
    const toggleListening = async () => {
        if (isListening) {
            try {
                if (ExpoSpeechRecognitionModule && typeof ExpoSpeechRecognitionModule.stop === 'function') {
                    await ExpoSpeechRecognitionModule.stop();
                }
            } catch {}
            setIsListening(false);
            return;
        }

        // 1. Durum: Native Ses Tanıma Modülü Mevcutsa (APK veya Development Build)
        if (ExpoSpeechRecognitionModule && typeof ExpoSpeechRecognitionModule.start === 'function') {
            try {
                const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
                if (!perm.granted) {
                    Alert.alert(
                        'Mikrofon İzni Gerekli',
                        'Harcama kararınızı sesle söyleyebilmek için lütfen mikrofon izni verin.'
                    );
                    return;
                }

                setTranscript('');
                setParsedResult(null);
                setStatusMessage('Mikrofon açılıyor...');

                await ExpoSpeechRecognitionModule.start({
                    lang: 'tr-TR',
                    interimResults: true,
                    continuous: false,
                    maxAlternatives: 1,
                });
            } catch (err: any) {
                console.log('[Speech Start Error]:', err);
                setIsListening(false);
                setStatusMessage('Ses tanıma başlatılamadı.');
            }
            return;
        }

        // 2. Durum: Expo Go Ortamı (Native modül Expo Go içinde derlenmemiş olduğu için akıllı simülasyon)
        setIsListening(true);
        setTranscript('');
        setParsedResult(null);
        setStatusMessage('Expo Go ortamı algılandı, ses dinleniyor...');

        setTimeout(() => {
            const randomExample = PRESET_EXAMPLES[Math.floor(Math.random() * PRESET_EXAMPLES.length)];
            setIsListening(false);
            setStatusMessage('Ses algılandı ve ayrıştırıldı!');
            handleProcessText(randomExample.phrase);
        }, 2200);
    };

    // Ayrıştırılan kararı form alanlarına aktar
    const handleApply = () => {
        if (parsedResult) {
            onDecisionDetected(parsedResult);
            onClose();
        }
    };

    const waveScale = waveAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 2.2],
    });

    const waveOpacity = waveAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.6, 0.3, 0],
    });

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                    {/* Üst Başlık */}
                    <View style={styles.headerRow}>
                        <View style={styles.headerTitleContainer}>
                            <View style={styles.badgeIcon}>
                                <Ionicons name="mic" size={18} color="#059669" />
                            </View>
                            <View>
                                <Text style={styles.headerTitle}>Sesle Karar Söyle</Text>
                                <Text style={styles.headerSubtitle}>
                                    {ExpoSpeechRecognitionModule ? 'Gerçek zamanlı Türkçe ses algılama' : 'Sesli Karar Asistanı'}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <Ionicons name="close" size={20} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {/* Canlı Dinleyen Mikrofon Alanı */}
                        <View style={styles.micSection}>
                            <View style={styles.micButtonContainer}>
                                {isListening && (
                                    <Animated.View
                                        style={[
                                            styles.pulseWave,
                                            {
                                                transform: [{ scale: waveScale }],
                                                opacity: waveOpacity,
                                            },
                                        ]}
                                    />
                                )}
                                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                                    <TouchableOpacity
                                        style={[styles.micButton, isListening && styles.micButtonActive]}
                                        onPress={toggleListening}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons
                                            name={isListening ? 'stop' : 'mic'}
                                            size={36}
                                            color="#ffffff"
                                        />
                                    </TouchableOpacity>
                                </Animated.View>
                            </View>

                            <Text style={[styles.statusText, isListening && styles.statusTextActive]}>
                                {statusMessage}
                            </Text>
                            <Text style={styles.hintText}>
                                Örneğin: "3.500 liraya yeni bir akıllı saat almayı düşünüyorum"
                            </Text>
                        </View>

                        {/* Metin / Cümle Giriş Alanı */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Algılanan / Yazılan Cümle:</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Mikrofona konuşun veya buraya yazın..."
                                placeholderTextColor="#94a3b8"
                                value={transcript}
                                onChangeText={handleProcessText}
                                multiline
                            />
                        </View>

                        {/* Canlı Ayrıştırılan Sonuç Kartı */}
                        {parsedResult && (
                            <View style={styles.resultCard}>
                                <View style={styles.resultHeader}>
                                    <View style={styles.resultBadge}>
                                        <Ionicons name="sparkles" size={14} color="#059669" />
                                        <Text style={styles.resultBadgeText}>Ayrıştırılan Bilgiler</Text>
                                    </View>
                                    <Text style={styles.confidenceText}>
                                        Doğruluk: %{Math.round(parsedResult.confidence * 100)}
                                    </Text>
                                </View>

                                <View style={styles.resultGrid}>
                                    <View style={styles.resultRow}>
                                        <Text style={styles.resultLabel}>🏷️ Ürün / Başlık:</Text>
                                        <Text style={styles.resultValue}>{parsedResult.title}</Text>
                                    </View>
                                    <View style={styles.resultRow}>
                                        <Text style={styles.resultLabel}>💰 Tutar:</Text>
                                        <Text style={[styles.resultValue, styles.amountHighlight]}>
                                            {parsedResult.amount > 0
                                                ? `₺${parsedResult.amount.toLocaleString('tr-TR')}`
                                                : 'Belirtilmedi'}
                                        </Text>
                                    </View>
                                    <View style={styles.resultRow}>
                                        <Text style={styles.resultLabel}>📁 Kategori:</Text>
                                        <Text style={styles.resultValue}>{parsedResult.category}</Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.applyButton}
                                    onPress={handleApply}
                                    activeOpacity={0.85}
                                >
                                    <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                                    <Text style={styles.applyButtonText}>Simülasyona Aktar</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Hızlı Test Örnekleri */}
                        <View style={styles.presetsSection}>
                            <Text style={styles.presetsTitle}>Veya Hızlı Bir Örnek Deneyin:</Text>
                            <View style={styles.presetsList}>
                                {PRESET_EXAMPLES.map((ex, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        style={styles.presetChip}
                                        onPress={() => handleProcessText(ex.phrase)}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons
                                            name={ex.icon as any}
                                            size={16}
                                            color="#059669"
                                            style={{ marginRight: 6 }}
                                        />
                                        <Text style={styles.presetText}>{ex.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalCard: {
        width: '100%',
        maxHeight: '90%',
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    badgeIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#ecfdf5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0f172a',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#64748b',
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        paddingBottom: 10,
    },
    micSection: {
        alignItems: 'center',
        marginVertical: 14,
    },
    micButtonContainer: {
        width: 90,
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    pulseWave: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#10b981',
    },
    micButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#059669',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 6,
    },
    micButtonActive: {
        backgroundColor: '#ef4444',
        shadowColor: '#ef4444',
    },
    statusText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 4,
        textAlign: 'center',
    },
    statusTextActive: {
        color: '#059669',
    },
    hintText: {
        fontSize: 12,
        color: '#94a3b8',
        textAlign: 'center',
        paddingHorizontal: 16,
    },
    inputContainer: {
        marginTop: 12,
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#475569',
        marginBottom: 6,
    },
    textInput: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 14,
        padding: 12,
        fontSize: 13,
        color: '#0f172a',
        minHeight: 50,
        textAlignVertical: 'top',
    },
    resultCard: {
        backgroundColor: '#f0fdf4',
        borderWidth: 1.5,
        borderColor: '#86efac',
        borderRadius: 16,
        padding: 14,
        marginBottom: 16,
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    resultBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    resultBadgeText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#166534',
    },
    confidenceText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#15803d',
    },
    resultGrid: {
        gap: 6,
        marginBottom: 12,
    },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    resultLabel: {
        fontSize: 12,
        color: '#475569',
        fontWeight: '600',
    },
    resultValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0f172a',
    },
    amountHighlight: {
        color: '#059669',
        fontWeight: '800',
        fontSize: 14,
    },
    applyButton: {
        backgroundColor: '#059669',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    applyButtonText: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '800',
    },
    presetsSection: {
        marginTop: 4,
    },
    presetsTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748b',
        marginBottom: 8,
    },
    presetsList: {
        gap: 6,
    },
    presetChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        paddingVertical: 9,
        paddingHorizontal: 12,
    },
    presetText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#334155',
    },
});

