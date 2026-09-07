//gelir sabit gider ve tasarruf hedefi için aynı kart yapısını kullancaz
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';


interface BudgetSliderCardProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (val: number) => void;
    minLabel?: string;
    maxLabel?: string;
}

export const BudgetSliderCard: React.FC<BudgetSliderCardProps> = ({
    label,
    value,
    min,
    max,
    step = 500,
    onChange,
    minLabel,
    maxLabel,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [textValue, setTextValue] = useState(value.toString());

    // Para formatlayıcı (Örn: 45400 -> ₺45.400)
    const formatCurrency = (val: number) => {
        return '₺' + val.toLocaleString('tr-TR');
    };

    //elle değer girilince çalışacak fonk
    const handleTextSubmit = () => {
        setIsEditing(false);
        const numeric = parseInt(textValue.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(numeric)) {
            const clamped = Math.max(min, Math.min(max, numeric));
            onChange(clamped);
            setTextValue(clamped.toString());
        } else {
            setTextValue(value.toString());
        }
    };

    //ilerleme çubuğunda yüzde hesabu
    const progressPercent = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

    //[-] ve [+] butonlarıile adımlama

    const handleStep = (direction: 'prev' | 'next') => {
        const delta = direction === 'next' ? step : -step;
        const nextVal = Math.max(min, Math.min(max, value + delta));
        onChange(nextVal);
        setTextValue(nextVal.toString());
    };

    return (
        <View style={styles.card}>
            <Text style={styles.label}>{label}</Text>
            {/* Tutar Alanı: Düzenleme modunda TextInput, normal modda Touchable */}
            <View style={styles.valueRow}>
                {isEditing ? (
                    <View style={styles.inputContainer}>
                        <Text style={styles.currencyPrefix}>₺</Text>
                        <TextInput
                            style={styles.textInput}
                            keyboardType="number-pad"
                            value={textValue}
                            onChangeText={setTextValue}
                            onBlur={handleTextSubmit}
                            onSubmitEditing={handleTextSubmit}
                            autoFocus
                        />
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.valueButton}
                        onPress={() => {
                            setTextValue(value.toString());
                            setIsEditing(true);
                        }}
                        activeOpacity={0.7}>
                        <Text style={styles.valueText}>{formatCurrency(value)}</Text>
                        <Ionicons name="pencil" size={18} color="#94a3b8" style={styles.editIcon} />
                    </TouchableOpacity>
                )}
            </View>
            {/* Slider / İlerleme Çubuğu ve +/- Butonları */}
            <View style={styles.sliderContainer}>
                <TouchableOpacity
                    style={styles.stepButton}
                    onPress={() => handleStep('prev')}
                    activeOpacity={0.6}>
                    <Ionicons name="remove" size={16} color="#0f172a" />
                </TouchableOpacity>
                <View style={styles.trackWrapper}>
                    <View style={styles.trackBackground}>
                        <View
                            style={[
                                styles.trackFill,
                                { width: `${progressPercent}%` },
                            ]}
                        />
                        {/* Slider Düğmesi (Thumb) */}
                        <View
                            style={[
                                styles.thumb,
                                { left: `${progressPercent}%` },
                            ]}
                        />
                    </View>
                    <View style={styles.rangeLabelsRow}>
                        <Text style={styles.rangeLabel}>{minLabel || formatCurrency(min)}</Text>
                        <Text style={styles.rangeLabel}>{maxLabel || formatCurrency(max)}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.stepButton}
                    onPress={() => handleStep('next')}
                    activeOpacity={0.6}>
                    <Ionicons name="add" size={16} color="#0f172a" />
                </TouchableOpacity>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        paddingVertical: 18,
        paddingHorizontal: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 2,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 10,
        letterSpacing: -0.2,
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 4,
    },
    valueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
    },
    valueText: {
        fontSize: 26,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: -0.5,
    },
    editIcon: {
        marginLeft: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderWidth: 1.5,
        borderColor: '#3b82f6',
    },
    currencyPrefix: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0f172a',
        marginRight: 4,
    },
    textInput: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0f172a',
        minWidth: 120,
        padding: 0,
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    stepButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    trackWrapper: {
        flex: 1,
        marginHorizontal: 12,
    },
    trackBackground: {
        height: 6,
        borderRadius: 3,
        backgroundColor: '#e2e8f0',
        position: 'relative',
        justifyContent: 'center',
    },
    trackFill: {
        height: 6,
        borderRadius: 3,
        backgroundColor: '#0d9488',
    },
    thumb: {
        position: 'absolute',
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#ffffff',
        borderWidth: 3,
        borderColor: '#0d9488',
        marginLeft: -9,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    rangeLabelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    rangeLabel: {
        fontSize: 11,
        color: '#94a3b8',
        fontWeight: '500',
    },
});
