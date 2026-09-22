import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface AppleSignInModalProps {
    visible: boolean;
    onClose: () => void;
    onSignIn: (data: { email: string; fullName: string; providerUserId: string }) => Promise<void>;
    defaultEmail?: string;
    defaultName?: string;
}

export function AppleSignInModal({
    visible,
    onClose,
    onSignIn,
    defaultEmail,
    defaultName,
}: AppleSignInModalProps) {
    const [fullName, setFullName] = useState(defaultName || 'Furkan Yıldız');
    const [hideEmail, setHideEmail] = useState(false);
    const [customEmail, setCustomEmail] = useState(defaultEmail || 'furkanyildiz1@icloud.com');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleContinue = async () => {
        try {
            setIsSubmitting(true);
            const finalEmail = hideEmail
                ? `apple_relay_${Date.now().toString(36)}@privaterelay.appleid.com`
                : (customEmail.trim().toLowerCase() || 'user@icloud.com');

            await onSignIn({
                email: finalEmail,
                fullName: fullName.trim() || 'Apple Kullanıcısı',
                providerUserId: `apple_uid_${Date.now()}`,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}>
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onClose}
                />

                <View style={styles.sheetContainer}>
                    <View style={styles.grabber} />

                    <View style={styles.header}>
                        <View style={styles.appleLogoContainer}>
                            <Ionicons name="logo-apple" size={26} color="#ffffff" />
                        </View>
                        <Text style={styles.title}>Apple ile Giriş Yap</Text>
                        <Text style={styles.subtitle}>
                            <Text style={{ fontWeight: '700', color: '#0f172a' }}>KararOS</Text> için Apple Kimliğinizi kullanın
                        </Text>
                    </View>

                    {/* Bilgi Kutusu */}
                    <View style={styles.formSection}>
                        <Text style={styles.fieldLabel}>Ad Soyad</Text>
                        <View style={styles.inputWrap}>
                            <Ionicons name="person-outline" size={18} color="#64748b" style={styles.inputIcon} />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Adınız Soyadınız"
                                placeholderTextColor="#94a3b8"
                                value={fullName}
                                onChangeText={setFullName}
                            />
                        </View>

                        <Text style={[styles.fieldLabel, { marginTop: 12 }]}>E-Posta Seçeneği</Text>

                        {/* E-postamı Paylaş */}
                        <TouchableOpacity
                            style={[styles.radioItem, !hideEmail && styles.radioItemActive]}
                            onPress={() => setHideEmail(false)}
                            activeOpacity={0.7}>
                            <View style={[styles.radioCircle, !hideEmail && styles.radioCircleActive]}>
                                {!hideEmail && <View style={styles.radioDot} />}
                            </View>
                            <View style={styles.radioContent}>
                                <Text style={styles.radioTitle}>E-postamı Paylaş</Text>
                                <Text style={styles.radioSubtitle}>{customEmail || 'ornek@icloud.com'}</Text>
                            </View>
                        </TouchableOpacity>

                        {/* E-postamı Gizle */}
                        <TouchableOpacity
                            style={[styles.radioItem, hideEmail && styles.radioItemActive]}
                            onPress={() => setHideEmail(true)}
                            activeOpacity={0.7}>
                            <View style={[styles.radioCircle, hideEmail && styles.radioCircleActive]}>
                                {hideEmail && <View style={styles.radioDot} />}
                            </View>
                            <View style={styles.radioContent}>
                                <Text style={styles.radioTitle}>E-postamı Gizle</Text>
                                <Text style={styles.radioSubtitle}>Benzersiz, rastgele bir Apple aktarma adresi oluşturur</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Apple Butonu */}
                    <TouchableOpacity
                        style={styles.appleSubmitBtn}
                        onPress={handleContinue}
                        disabled={isSubmitting}
                        activeOpacity={0.85}>
                        {isSubmitting ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <>
                                <Ionicons name="logo-apple" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                                <Text style={styles.appleSubmitBtnText}>Apple ile Sürdür</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* İptal Butonu */}
                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={onClose}
                        disabled={isSubmitting}
                        activeOpacity={0.7}>
                        <Text style={styles.cancelBtnText}>Vazgeç</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        justifyContent: 'flex-end',
    },
    backdrop: {
        flex: 1,
    },
    sheetContainer: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 36 : 24,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 20,
    },
    grabber: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#cbd5e1',
        alignSelf: 'center',
        marginBottom: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    appleLogoContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#0f172a',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 19,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 18,
    },
    formSection: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 6,
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 46,
    },
    inputIcon: {
        marginRight: 8,
    },
    textInput: {
        flex: 1,
        fontSize: 15,
        color: '#0f172a',
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: 8,
    },
    radioItemActive: {
        backgroundColor: '#f1f5f9',
        borderColor: '#0f172a',
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#94a3b8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    radioCircleActive: {
        borderColor: '#0f172a',
    },
    radioDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#0f172a',
    },
    radioContent: {
        flex: 1,
    },
    radioTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0f172a',
    },
    radioSubtitle: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    appleSubmitBtn: {
        flexDirection: 'row',
        height: 50,
        borderRadius: 14,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    appleSubmitBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#ffffff',
    },
    cancelBtn: {
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#f8fafc',
    },
    cancelBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
});
