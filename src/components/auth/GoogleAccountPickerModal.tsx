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

interface GoogleAccount {
    id: string;
    email: string;
    fullName: string;
    initials: string;
    color: string;
}

interface GoogleAccountPickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectAccount: (account: { email: string; fullName: string; providerUserId: string }) => Promise<void>;
    defaultEmail?: string;
    defaultName?: string;
}

const DEFAULT_ACCOUNTS: GoogleAccount[] = [
    {
        id: 'g-1',
        email: 'furkanyildiz1@gmail.com',
        fullName: 'Furkan Yıldız',
        initials: 'FY',
        color: '#2563eb',
    },
    {
        id: 'g-2',
        email: 'kararos.user@gmail.com',
        fullName: 'KararOS Kullanıcısı',
        initials: 'KU',
        color: '#059669',
    },
];

export function GoogleAccountPickerModal({
    visible,
    onClose,
    onSelectAccount,
    defaultEmail,
    defaultName,
}: GoogleAccountPickerModalProps) {
    const [isCustomMode, setIsCustomMode] = useState(false);
    const [customEmail, setCustomEmail] = useState(defaultEmail || '');
    const [customName, setCustomName] = useState(defaultName || '');
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleSelect = async (account: { email: string; fullName: string; id: string }) => {
        try {
            setIsSelecting(true);
            setSelectedId(account.id);
            await onSelectAccount({
                email: account.email.trim().toLowerCase(),
                fullName: account.fullName.trim() || 'Google Kullanıcısı',
                providerUserId: `google_${account.id}_${Date.now()}`,
            });
        } finally {
            setIsSelecting(false);
            setSelectedId(null);
        }
    };

    const handleCustomSubmit = async () => {
        if (!customEmail.trim() || !customEmail.includes('@')) {
            return;
        }
        try {
            setIsSelecting(true);
            setSelectedId('custom');
            const name = customName.trim() || customEmail.split('@')[0];
            await onSelectAccount({
                email: customEmail.trim().toLowerCase(),
                fullName: name,
                providerUserId: `google_custom_${Date.now()}`,
            });
        } finally {
            setIsSelecting(false);
            setSelectedId(null);
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
                    {/* Tutamaç Çubuğu */}
                    <View style={styles.grabber} />

                    {/* Google Başlık & Logo */}
                    <View style={styles.header}>
                        <View style={styles.googleLogoContainer}>
                            <Ionicons name="logo-google" size={24} color="#ea4335" />
                        </View>
                        <Text style={styles.title}>Google ile oturum açın</Text>
                        <Text style={styles.subtitle}>
                            <Text style={{ fontWeight: '700', color: '#0f172a' }}>KararOS</Text> uygulamasına devam etmek için bir hesap seçin
                        </Text>
                    </View>

                    {!isCustomMode ? (
                        <View style={styles.accountList}>
                            {DEFAULT_ACCOUNTS.map((acc) => {
                                const isThisSelected = isSelecting && selectedId === acc.id;
                                return (
                                    <TouchableOpacity
                                        key={acc.id}
                                        style={styles.accountItem}
                                        onPress={() => handleSelect(acc)}
                                        disabled={isSelecting}
                                        activeOpacity={0.7}>
                                        <View style={[styles.avatar, { backgroundColor: acc.color }]}>
                                            <Text style={styles.avatarText}>{acc.initials}</Text>
                                        </View>
                                        <View style={styles.accountInfo}>
                                            <Text style={styles.accountName}>{acc.fullName}</Text>
                                            <Text style={styles.accountEmail}>{acc.email}</Text>
                                        </View>
                                        {isThisSelected ? (
                                            <ActivityIndicator size="small" color="#2563eb" />
                                        ) : (
                                            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}

                            {/* Başka bir hesap ekle */}
                            <TouchableOpacity
                                style={styles.addAccountBtn}
                                onPress={() => setIsCustomMode(true)}
                                disabled={isSelecting}
                                activeOpacity={0.7}>
                                <View style={styles.addAccountIconWrap}>
                                    <Ionicons name="person-add-outline" size={18} color="#2563eb" />
                                </View>
                                <Text style={styles.addAccountText}>Başka bir Google hesabı kullan</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        /* Özel E-Posta Giriş Modu */
                        <View style={styles.customForm}>
                            <Text style={styles.customFormTitle}>Google Hesabınızı Girin</Text>

                            <View style={styles.inputWrap}>
                                <Ionicons name="mail-outline" size={18} color="#64748b" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="ornek@gmail.com"
                                    placeholderTextColor="#94a3b8"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={customEmail}
                                    onChangeText={setCustomEmail}
                                    autoFocus
                                />
                            </View>

                            <View style={styles.inputWrap}>
                                <Ionicons name="person-outline" size={18} color="#64748b" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Adınız Soyadınız (İsteğe bağlı)"
                                    placeholderTextColor="#94a3b8"
                                    value={customName}
                                    onChangeText={setCustomName}
                                />
                            </View>

                            <View style={styles.customBtnRow}>
                                <TouchableOpacity
                                    style={styles.backBtn}
                                    onPress={() => setIsCustomMode(false)}
                                    disabled={isSelecting}>
                                    <Text style={styles.backBtnText}>Geri</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.submitBtn,
                                        (!customEmail.trim() || isSelecting) && styles.submitBtnDisabled,
                                    ]}
                                    onPress={handleCustomSubmit}
                                    disabled={!customEmail.trim() || isSelecting}>
                                    {isSelecting ? (
                                        <ActivityIndicator size="small" color="#ffffff" />
                                    ) : (
                                        <Text style={styles.submitBtnText}>Devam Et</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* Güvenlik & Gizlilik Bilgisi */}
                    <Text style={styles.disclaimerText}>
                        Devam etmeden önce KararOS'un Gizlilik Politikası ve Kullanım Koşulları geçerli olacaktır.
                    </Text>

                    {/* İptal Butonu */}
                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={onClose}
                        disabled={isSelecting}
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
    googleLogoContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fef2f2',
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
    accountList: {
        marginVertical: 6,
    },
    accountItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 14,
        backgroundColor: '#f8fafc',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 15,
    },
    accountInfo: {
        flex: 1,
    },
    accountName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 2,
    },
    accountEmail: {
        fontSize: 13,
        color: '#64748b',
    },
    addAccountBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 14,
        backgroundColor: '#eff6ff',
        marginTop: 2,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#bfdbfe',
    },
    addAccountIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#dbeafe',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    addAccountText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2563eb',
    },
    customForm: {
        marginVertical: 10,
    },
    customFormTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 12,
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        marginBottom: 12,
    },
    inputIcon: {
        marginRight: 8,
    },
    textInput: {
        flex: 1,
        fontSize: 15,
        color: '#0f172a',
    },
    customBtnRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 6,
        marginBottom: 12,
    },
    backBtn: {
        flex: 1,
        height: 46,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
    },
    submitBtn: {
        flex: 2,
        height: 46,
        borderRadius: 12,
        backgroundColor: '#2563eb',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitBtnDisabled: {
        backgroundColor: '#94a3b8',
    },
    submitBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
    },
    disclaimerText: {
        fontSize: 11,
        color: '#94a3b8',
        textAlign: 'center',
        lineHeight: 16,
        marginTop: 6,
        marginBottom: 16,
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
