import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { parseVoiceDecision, ParsedVoiceDecision } from '@/services/voice-decision-parser';
import { DecisionApiService } from '@/services/api/decision-api';
import { useBudget } from '@/context/budget-context';
import { AnalyticsService } from '@/services/analytics-service';
import { StreakService } from '@/services/streak-service';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

let ExpoSpeechRecognitionModule: any = null;
try {
    const speech = require('expo-speech-recognition');
    ExpoSpeechRecognitionModule = speech?.ExpoSpeechRecognitionModule ?? null;
} catch {}

export default function QuickAddScreen() {
    const router = useRouter();
    const { refreshData } = useBudget();
    const [status, setStatus] = useState('Başlatılıyor...');
    const [parsedResult, setParsedResult] = useState<ParsedVoiceDecision | null>(null);
    const [evaluation, setEvaluation] = useState<any>(null);
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        AnalyticsService.track('widget_clicked');
        AnalyticsService.trackScreen('QuickAddWidget');
        let subStart: any, subEnd: any, subResult: any, subError: any;

        const startSTT = async () => {
            if (!ExpoSpeechRecognitionModule || typeof ExpoSpeechRecognitionModule.start !== 'function') {
                setStatus('Ses modülü bulunamadı.');
                return;
            }

            try {
                const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
                if (!perm.granted) {
                    setStatus('Mikrofon izni reddedildi.');
                    return;
                }

                subStart = ExpoSpeechRecognitionModule.addListener?.('start', () => {
                    setIsListening(true);
                    setStatus('Sizi dinliyorum...');
                });

                subEnd = ExpoSpeechRecognitionModule.addListener?.('end', () => {
                    setIsListening(false);
                });

                subResult = ExpoSpeechRecognitionModule.addListener?.('result', async (event: any) => {
                    const text = event?.results?.[0]?.transcript || '';
                    if (text) {
                        setStatus('Ayrıştırılıyor...');
                        const result = parseVoiceDecision(text);
                        setParsedResult(result);
                        
                        try {
                            setStatus('Bütçe etkisi hesaplanıyor...');
                            const evalResult = await DecisionApiService.evaluate({
                                title: result.title || 'Hızlı Harcama',
                                amount: result.amount,
                                category: (result.category || 'Diğer') as any,
                                plannedDate: new Date().toISOString().split('T')[0],
                            });
                            setEvaluation(evalResult);
                            setStatus('Tamamlandı!');
                        } catch (err) {
                            setStatus('Hesaplama hatası.');
                        }
                    }
                });

                subError = ExpoSpeechRecognitionModule.addListener?.('error', (event: any) => {
                    setIsListening(false);
                    setStatus('Ses anlaşılamadı.');
                });

                await ExpoSpeechRecognitionModule.start({
                    lang: 'tr-TR',
                    interimResults: false,
                    continuous: false,
                    maxAlternatives: 1,
                });
            } catch (error) {
                setStatus('Başlatılamadı.');
            }
        };

        startSTT();

        return () => {
            subStart?.remove?.();
            subEnd?.remove?.();
            subResult?.remove?.();
            subError?.remove?.();
            try {
                if (ExpoSpeechRecognitionModule?.stop) ExpoSpeechRecognitionModule.stop();
            } catch {}
        };
    }, []);

    const handleSave = async () => {
        if (!parsedResult) return;
        setStatus('Kaydediliyor...');
        try {
            await DecisionApiService.create({
                title: parsedResult.title || 'Hızlı Harcama',
                amount: parsedResult.amount,
                category: (parsedResult.category || 'Diğer') as any,
                plannedDate: new Date().toISOString().split('T')[0],
            });
            await StreakService.recordActivity();
            await AnalyticsService.track('decision_completed', {
                verdict: 'WIDGET_ADD',
                action: 'BOUGHT',
                amount: parsedResult.amount,
                category: parsedResult.category,
            });
            await refreshData?.();
            router.replace('/(tabs)');
        } catch (error) {
            setStatus('Kaydedilemedi.');
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={[styles.iconContainer, isListening && styles.listening]}>
                    <Ionicons name="mic-outline" size={48} color={isListening ? "#10b981" : "#94a3b8"} />
                </View>
                <Text style={styles.statusText}>{status}</Text>

                {parsedResult && evaluation && (
                    <View style={styles.resultContainer}>
                        <Text style={styles.title}>{parsedResult.title}</Text>
                        <Text style={styles.amount}>{parsedResult.amount} TL</Text>
                        <Text style={styles.category}>{parsedResult.category}</Text>

                        <View style={styles.evalContainer}>
                            <Text style={styles.scoreText}>Skor: {evaluation.score}/100</Text>
                            <Text style={styles.impactText}>
                                Bütçeye Etkisi: %{evaluation.budgetImpactPercentage.toFixed(1)}
                            </Text>
                        </View>

                        <View style={styles.actions}>
                            <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={handleCancel}>
                                <Text style={styles.btnCancelText}>İptal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={handleSave}>
                                <Text style={styles.btnSaveText}>Kaydet</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#070E1A' },
    content: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
    iconContainer: {
        width: 96, height: 96, borderRadius: 48,
        backgroundColor: '#0f172a',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
    },
    listening: {
        backgroundColor: '#064e3b',
        borderWidth: 2, borderColor: '#10b981'
    },
    statusText: { color: '#94a3b8', fontSize: 16, marginBottom: 32 },
    resultContainer: {
        width: '100%',
        backgroundColor: '#0f172a',
        padding: 24,
        borderRadius: 24,
        alignItems: 'center',
    },
    title: { color: '#ffffff', fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
    amount: { color: '#10b981', fontSize: 32, fontWeight: '900', marginBottom: 8 },
    category: { color: '#94a3b8', fontSize: 16, marginBottom: 24 },
    evalContainer: {
        width: '100%', padding: 16, borderRadius: 16,
        backgroundColor: '#1e293b', marginBottom: 24,
    },
    scoreText: { color: '#38bdf8', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    impactText: { color: '#cbd5e1', fontSize: 14 },
    actions: { flexDirection: 'row', gap: 16, width: '100%' },
    btn: {
        flex: 1, paddingVertical: 16, borderRadius: 16,
        alignItems: 'center',
    },
    btnCancel: { backgroundColor: '#1e293b' },
    btnCancelText: { color: '#ffffff', fontWeight: 'bold' },
    btnSave: { backgroundColor: '#10b981' },
    btnSaveText: { color: '#070E1A', fontWeight: 'bold' },
});
