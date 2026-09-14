import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
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

    useEffect(() => {
        setTextValue(value.toString());
    }, [value]);

    // Para formatlayıcı (Örn: 45400 -> ₺45.400)
    const formatCurrency = (val: number) => {
        return '₺' + val.toLocaleString('tr-TR');
    };

    // Elle değer girilip onaylandığında
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

    // Tutara delta ekleme/çıkarma
    const handleAdjust = (delta: number) => {
        const nextVal = Math.max(min, Math.min(max, value + delta));
        onChange(nextVal);
        setTextValue(nextVal.toString());
    };

    return (
        <View style={styles.card}>
            <Text style={styles.label}>{label}</Text>

            {/* Tutar Alanı & Stepper Satırı */}
            <View style={styles.mainAmountRow}>
                <TouchableOpacity
                    style={[styles.stepperBtn, value <= min && styles.stepperBtnDisabled]}
                    onPress={() => handleAdjust(-step)}
                    disabled={value <= min}
                    activeOpacity={0.7}>
                    <Ionicons name="remove" size={20} color={value <= min ? '#cbd5e1' : '#0f172a'} />
                </TouchableOpacity>

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
                        <Ionicons name="pencil" size={16} color="#94a3b8" style={styles.editIcon} />
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[styles.stepperBtn, value >= max && styles.stepperBtnDisabled]}
                    onPress={() => handleAdjust(step)}
                    disabled={value >= max}
                    activeOpacity={0.7}>
                    <Ionicons name="add" size={20} color={value >= max ? '#cbd5e1' : '#0f172a'} />
                </TouchableOpacity>
            </View>

            {/* Hızlı Artırma / Azaltma Butonları */}
            <View style={styles.quickChipsRow}>
                <TouchableOpacity
                    style={styles.chipBtn}
                    onPress={() => handleAdjust(-1000)}
                    activeOpacity={0.7}>
                    <Text style={styles.chipText}>-₺1.000</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.chipBtn}
                    onPress={() => handleAdjust(-500)}
                    activeOpacity={0.7}>
                    <Text style={styles.chipText}>-₺500</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.chipBtn}
                    onPress={() => handleAdjust(500)}
                    activeOpacity={0.7}>
                    <Text style={styles.chipText}>+₺500</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.chipBtn}
                    onPress={() => handleAdjust(1000)}
                    activeOpacity={0.7}>
                    <Text style={styles.chipText}>+₺1.000</Text>
                </TouchableOpacity>
            </View>

            {/* Alt Aralık Bilgisi */}
            <View style={styles.rangeInfoRow}>
                <Text style={styles.rangeText}>Min: {minLabel || formatCurrency(min)}</Text>
                <Text style={styles.rangeText}>Maks: {maxLabel || formatCurrency(max)}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        paddingVertical: 18,
        paddingHorizontal: 18,
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
        fontWeight: '700',
        color: '#334155',
        marginBottom: 12,
        letterSpacing: -0.2,
    },
    mainAmountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 4,
    },
    stepperBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepperBtnDisabled: {
        backgroundColor: '#f8fafc',
    },
    valueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 14,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        minWidth: 160,
    },
    valueText: {
        fontSize: 24,
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
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderWidth: 2,
        borderColor: '#0f172a',
        minWidth: 160,
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
        minWidth: 90,
        padding: 0,
        textAlign: 'center',
    },
    quickChipsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 14,
        gap: 6,
    },
    chipBtn: {
        flex: 1,
        backgroundColor: '#f8fafc',
        borderRadius: 10,
        paddingVertical: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    chipText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#475569',
    },
    rangeInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f8fafc',
    },
    rangeText: {
        fontSize: 11,
        color: '#94a3b8',
        fontWeight: '500',
    },
});
