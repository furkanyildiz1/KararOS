import { Ionicons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthMode = 'register' | 'login';

export default function AuthScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  // Parametre belirtilmemişse veya 'login' ise doğrudan Giriş Yapma ekranı açılır
  const [mode, setMode] = useState<AuthMode>(params.mode === 'register' ? 'register' : 'login');

  useEffect(() => {
    if (params.mode === 'register') {
      setMode('register');
    } else if (params.mode === 'login') {
      setMode('login');
    }
  }, [params.mode]);

  // Kayıt Formu State'leri
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  // Giriş Formu State'leri
  const [loginEmail, setLoginEmail] = useState('selin@kararos.app');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Şifre Güvenlik Seviyesi Hesaplama (1: Düşük, 2: Orta, 3: Güçlü)
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    if (pass.length < 6) return 1;
    if (pass.length < 9) return 2;
    return 3;
  };
  const passwordStrength = getPasswordStrength(regPassword);

  const handleRegisterSubmit = () => {
    if (!acceptedTerms) {
      Alert.alert(
        'Koşullar',
        'Lütfen devam etmek için Kullanım Koşulları ve Gizlilik Politikası’nı kabul edin.'
      );
      return;
    }
    // Kayıt tamamlandıktan sonra bütçe kurulum ekranına yönlendir
    router.push('/budget-setup' as Href);
  };

  const handleLoginSubmit = () => {
    // Giriş başarılı, ana sekmelere yönlendir
    router.replace('/(tabs)' as Href);
  };

  const handleBiometricLogin = () => {
    Alert.alert(
      'Biyometrik Giriş Başarılı',
      'Face ID / Parmak İzi doğrulandı. KararOS’a yönlendiriliyorsunuz.',
      [
        {
          text: 'Tamam',
          onPress: () => router.replace('/(tabs)' as Href),
        },
      ]
    );
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert(
      `${provider} ile Giriş`,
      `${provider} hesabı ile hızlı giriş simüle ediliyor...`,
      [
        {
          text: 'Devam Et',
          onPress: () => router.replace('/(tabs)' as Href),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>

        {/* Üst Logo & Navigasyon Barı */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.navIconBtn}
            onPress={() => {
              if (mode === 'login') {
                setMode('register');
              } else {
                setMode('login');
              }
            }}
            activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={22} color="#0f172a" />
          </TouchableOpacity>

          <View style={styles.brandRow}>
            <Image
              source={require('@/../assets/images/kararos-logo.png')}
              style={styles.brandLogoImg}
              resizeMode="cover"
            />
            <Text style={styles.brandTitle}>KararOS</Text>
          </View>

          <TouchableOpacity
            style={styles.navIconBtn}
            onPress={() => setMode(mode === 'register' ? 'login' : 'register')}
            activeOpacity={0.7}>
            <Ionicons name="person-circle" size={32} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* Modlar Arası Geçiş Sekmesi (Giriş Yap / Kayıt Ol) */}
        <View style={styles.modeToggleContainer}>
          <TouchableOpacity
            style={[
              styles.modeTabBtn,
              mode === 'login' && styles.modeTabBtnActive,
            ]}
            onPress={() => setMode('login')}
            activeOpacity={0.8}>
            <Text
              style={[
                styles.modeTabText,
                mode === 'login' && styles.modeTabTextActive,
              ]}>
              Giriş Yap
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeTabBtn,
              mode === 'register' && styles.modeTabBtnActive,
            ]}
            onPress={() => setMode('register')}
            activeOpacity={0.8}>
            <Text
              style={[
                styles.modeTabText,
                mode === 'register' && styles.modeTabTextActive,
              ]}>
              Kayıt Ol
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>

          {mode === 'login' ? (
            /* ========================================================
               1. GİRİŞ YAPMA EKRANI (LOGIN VIEW)
               ======================================================== */
            <View style={styles.formWrapper}>
              {/* Üst KararOS Avatarı & Hoş Geldin */}
              <View style={styles.loginHeroCenter}>
                <View style={styles.avatarCircleContainer}>
                  <View style={styles.avatarInnerBox}>
                    <Image
                      source={require('@/../assets/images/kararos-logo.png')}
                      style={styles.loginLogoHeroImg}
                      resizeMode="cover"
                    />
                  </View>

                </View>

                <View style={styles.tagBadge}>
                  <View style={styles.greenDot} />
                  <Text style={styles.tagBadgeText}>Finansal Karar Motoru v2.4</Text>
                </View>

                <Text style={styles.loginHeroTitle}>Tekrar Hoş Geldin</Text>
                <Text style={styles.heroSubtitle}>
                  Bilinçli kararlarına kaldığın yerden devam et.
                </Text>
              </View>

              {/* Form Alanları */}
              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>E-posta Adresi</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={18} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="ornek@kararos.app"
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={loginEmail}
                    onChangeText={setLoginEmail}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Şifre</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={18} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="••••••••"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showLoginPassword}
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowLoginPassword(!showLoginPassword)}
                    style={styles.eyeBtn}>
                    <Ionicons
                      name={showLoginPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#64748b"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Beni Hatırla & Şifremi Unuttum */}
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.rememberMeRow}
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.75}>
                  <View style={[styles.checkboxBox, rememberMe && styles.checkboxBoxChecked]}>
                    {rememberMe && <Ionicons name="checkmark" size={14} color="#ffffff" />}
                  </View>
                  <Text style={styles.rememberMeText}>Beni hatırla</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      'Şifre Sıfırlama',
                      'E-posta adresinize şifre sıfırlama bağlantısı gönderildi.'
                    )
                  }
                  activeOpacity={0.7}>
                  <Text style={styles.forgotPasswordText}>Şifremi Unuttum?</Text>
                </TouchableOpacity>
              </View>

              {/* Giriş Butonu */}
              <TouchableOpacity
                style={styles.primaryAuthButton}
                onPress={handleLoginSubmit}
                activeOpacity={0.85}>
                <Text style={styles.primaryAuthButtonText}>Giriş Yap</Text>
                <Ionicons name="arrow-forward" size={18} color="#ffffff" style={{ marginLeft: 6 }} />
              </TouchableOpacity>

              {/* Face ID / Biyometrik Giriş Butonu */}
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricLogin}
                activeOpacity={0.8}>
                <View style={styles.biometricIconWrap}>
                  <Ionicons name="finger-print-outline" size={18} color="#0284c7" />
                </View>
                <Text style={styles.biometricButtonText}>
                  Face ID / Biyometrik Giriş Yap
                </Text>
              </TouchableOpacity>

              {/* Sosyal Giriş Bölümü */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>VEYA DEVAM ET</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtonsRow}>
                <TouchableOpacity
                  style={styles.socialBtn}
                  onPress={() => handleSocialLogin('Apple')}
                  activeOpacity={0.75}>
                  <Ionicons name="logo-apple" size={20} color="#0f172a" style={{ marginRight: 8 }} />
                  <Text style={styles.socialBtnText}>Apple</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialBtn}
                  onPress={() => handleSocialLogin('Google')}
                  activeOpacity={0.75}>
                  <Ionicons name="logo-google" size={18} color="#ea4335" style={{ marginRight: 8 }} />
                  <Text style={styles.socialBtnText}>Google</Text>
                </TouchableOpacity>
              </View>

              {/* Kayıt Ol Geçiş Linki */}
              <TouchableOpacity
                style={styles.switchAuthRow}
                onPress={() => setMode('register')}
                activeOpacity={0.7}>
                <Text style={styles.switchAuthText}>
                  Henüz bir hesabın yok mu?{' '}
                  <Text style={styles.switchAuthLink}>Kayıt Ol</Text>
                </Text>
              </TouchableOpacity>

              {/* Güvenlik Bilgilendirmesi */}
              <View style={styles.securityNoteBox}>
                <Ionicons name="shield-outline" size={18} color="#059669" style={{ marginRight: 10 }} />
                <Text style={styles.securityNoteText}>
                  Verileriniz banka düzeyinde 256-bit uçtan uca şifreleme ile korunur.
                </Text>
              </View>
            </View>
          ) : (
            /* ========================================================
               2. KAYIT OLMA EKRANI (REGISTER VIEW)
               ======================================================== */
            <View style={styles.formWrapper}>
              {/* Üst Rozet & Başlıklar */}
              <View style={styles.heroCenter}>
                <View style={styles.tagBadge}>
                  <View style={styles.greenDot} />
                  <Text style={styles.tagBadgeText}>KararOS'a Katıl</Text>
                </View>

                <Text style={styles.heroTitle}>
                  Harcamadan önce düşünenlerin kulübüne hoş geldin.
                </Text>

                <Text style={styles.heroSubtitle}>
                  Dürtüsel harcamalarını somut hedeflere dönüştür, finansal özgürlüğünü sakin adımlarla inşa et.
                </Text>
              </View>

              {/* Form Alanları */}
              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Ad Soyad</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={18} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Adın ve Soyadın"
                    placeholderTextColor="#94a3b8"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>E-posta Adresi</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="at-outline" size={18} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="ornek@eposta.com"
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={regEmail}
                    onChangeText={setRegEmail}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.passwordLabelRow}>
                  <Text style={styles.fieldLabel}>Şifre Oluştur</Text>
                  <Text style={styles.securityLevelLabel}>Güvenlik Seviyesi</Text>
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={18} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="••••••••••••"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showRegPassword}
                    value={regPassword}
                    onChangeText={setRegPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowRegPassword(!showRegPassword)}
                    style={styles.eyeBtn}>
                    <Ionicons
                      name={showRegPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#64748b"
                    />
                  </TouchableOpacity>
                </View>

                {/* Şifre Güvenlik Seviyesi Çubukları */}
                <View style={styles.strengthBarsRow}>
                  <View
                    style={[
                      styles.strengthBar,
                      passwordStrength >= 1 ? styles.strengthBarActive : styles.strengthBarInactive,
                    ]}
                  />
                  <View
                    style={[
                      styles.strengthBar,
                      passwordStrength >= 2 ? styles.strengthBarActive : styles.strengthBarInactive,
                    ]}
                  />
                  <View
                    style={[
                      styles.strengthBar,
                      passwordStrength >= 3 ? styles.strengthBarActive : styles.strengthBarInactive,
                    ]}
                  />
                </View>

                <Text style={styles.passwordHint}>
                  En az 8 karakter, harf ve rakam içermelidir.
                </Text>
              </View>

              {/* Kullanım Koşulları Onayı */}
              <TouchableOpacity
                style={styles.termsCheckboxRow}
                onPress={() => setAcceptedTerms(!acceptedTerms)}
                activeOpacity={0.75}>
                <View style={[styles.checkboxBox, acceptedTerms && styles.checkboxBoxChecked]}>
                  {acceptedTerms && <Ionicons name="checkmark" size={14} color="#ffffff" />}
                </View>
                <Text style={styles.termsText}>
                  <Text style={styles.termsUnderline}>Kullanım Koşulları</Text> ve{' '}
                  <Text style={styles.termsUnderline}>Gizlilik Politikası</Text>'nı okudum, kabul ediyorum.
                </Text>
              </TouchableOpacity>

              {/* Ana Kayıt Butonu */}
              <TouchableOpacity
                style={styles.primaryAuthButton}
                onPress={handleRegisterSubmit}
                activeOpacity={0.85}>
                <Text style={styles.primaryAuthButtonText}>Hesabımı Oluştur ve Başla</Text>
                <Ionicons name="arrow-forward" size={18} color="#ffffff" style={{ marginLeft: 6 }} />
              </TouchableOpacity>

              {/* Sosyal Giriş Bölümü */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>VEYA HIZLI BAĞLAN</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtonsRow}>
                <TouchableOpacity
                  style={styles.socialBtn}
                  onPress={() => handleSocialLogin('Apple')}
                  activeOpacity={0.75}>
                  <Ionicons name="logo-apple" size={20} color="#0f172a" style={{ marginRight: 8 }} />
                  <Text style={styles.socialBtnText}>Apple</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialBtn}
                  onPress={() => handleSocialLogin('Google')}
                  activeOpacity={0.75}>
                  <Ionicons name="logo-google" size={18} color="#ea4335" style={{ marginRight: 8 }} />
                  <Text style={styles.socialBtnText}>Google</Text>
                </TouchableOpacity>
              </View>

              {/* Güvenlik Notu Kartı */}
              <View style={styles.securityNoteBox}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#059669" style={{ marginRight: 10 }} />
                <Text style={styles.securityNoteText}>
                  <Text style={{ fontWeight: '700' }}>Banka Düzeyinde Güvenlik:</Text> KararOS hassas şifrelerinizi asla saklamaz veya paylaşmaz.
                </Text>
              </View>

              {/* Giriş Yap Geçiş Linki */}
              <TouchableOpacity
                style={styles.switchAuthRow}
                onPress={() => setMode('login')}
                activeOpacity={0.7}>
                <Text style={styles.switchAuthText}>
                  Zaten bir hesabın var mı?{' '}
                  <Text style={styles.switchAuthLink}>Giriş Yap</Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  navIconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandLogoImg: {
    width: 28,
    height: 28,
    borderRadius: 8,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    padding: 4,
  },
  modeTabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  modeTabBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  modeTabTextActive: {
    color: '#0f172a',
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  formWrapper: {
    flex: 1,
  },
  heroCenter: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loginHeroCenter: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircleContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarInnerBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#bbf7d0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginLogoHeroImg: {
    width: 68,
    height: 68,
    borderRadius: 20,
  },
  avatarSparkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
    marginBottom: 12,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
    marginRight: 6,
  },
  tagBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e293b',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: 28,
    letterSpacing: -0.4,
    marginBottom: 8,
    paddingHorizontal: 6,
  },
  loginHeroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  inputGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  securityLevelLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },
  eyeBtn: {
    padding: 6,
  },
  strengthBarsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthBarActive: {
    backgroundColor: '#0284c7',
  },
  strengthBarInactive: {
    backgroundColor: '#e0f2fe',
  },
  passwordHint: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 6,
  },
  termsCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#ffffff',
  },
  checkboxBoxChecked: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  termsUnderline: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: '#0f172a',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },
  forgotPasswordText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748b',
  },
  primaryAuthButton: {
    backgroundColor: '#0a192f',
    borderRadius: 24,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0a192f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    marginTop: 6,
    marginBottom: 10,
  },
  primaryAuthButtonText: {
    color: '#ffffff',
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  biometricButton: {
    backgroundColor: '#eff6ff',
    borderRadius: 24,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dbeafe',
    marginBottom: 14,
  },
  biometricIconWrap: {
    marginRight: 8,
  },
  biometricButtonText: {
    color: '#0369a1',
    fontSize: 14,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  dividerText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.5,
    paddingHorizontal: 12,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  socialBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  securityNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
    marginBottom: 16,
  },
  securityNoteText: {
    flex: 1,
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
  },
  switchAuthRow: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10,
  },
  switchAuthText: {
    fontSize: 13,
    color: '#64748b',
  },
  switchAuthLink: {
    fontWeight: '800',
    color: '#0f172a',
    textDecorationLine: 'underline',
  },
});
