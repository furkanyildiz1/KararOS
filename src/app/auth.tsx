import { useBudget } from '@/context/budget-context';
import { AuthApiService } from '@/services/api/auth-api';
import { StorageService } from '@/services/storage-service';
import { Ionicons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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

type AuthMode = 'register' | 'login';

export default function AuthScreen() {
  const router = useRouter();
  const { refreshData } = useBudget();
  const params = useLocalSearchParams<{ mode?: string }>();
  // Parametre belirtilmemişse veya 'login' ise doğrudan Giriş Yapma ekranı açılır
  const [mode, setMode] = useState<AuthMode>(params.mode === 'register' ? 'register' : 'login');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (params.mode === 'login' || params.mode === 'register') {
      setMode(params.mode as AuthMode);
    }
  }, [params.mode]);

  // Kayıt Formu State'leri
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [acceptedMarketing, setAcceptedMarketing] = useState(false);

  // E-Posta Doğrulama Modalı State'leri
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(60);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Giriş Formu State'leri
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  //şifre unutma modal stateleir
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);//tip güvenliğ için yazıcaz bşr veya iki default bir 
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotNewPassConfirm, setForgotNewPassConfirm] = useState('');
  const [showForgotNewPass, setShowForgotNewPass] = useState(false);
  const [forgotCountdown, setForgotCountdown] = useState(60);
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);


  // Kayıtlı e-posta varsa otomatik yükle
  useEffect(() => {
    async function loadSavedCredentials() {
      try {
        const session = await StorageService.getAuthSession();
        if (session.email) {
          setLoginEmail(session.email);
          setRememberMe(session.rememberMe);
        }
      } catch { }
    }
    loadSavedCredentials();
  }, []);

  // Geri sayım sayacı
  useEffect(() => {
    let interval: any;
    if (otpModalVisible && otpCountdown > 0) {
      interval = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpModalVisible, otpCountdown]);

  const showPolicyAlert = (title: string, text: string) => { Alert.alert(title, text, [{ text: 'Kapat' }]); };

  //şifre unutma geri sayıma racı
  useEffect(() => {
    let interval: any;
    if (forgotModalVisible && forgotStep === 2 && forgotCountdown > 0) {
      interval = setInterval(() => {
        setForgotCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [forgotModalVisible, forgotStep, forgotCountdown]);

  const handleSendForgotCode = async () => {
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      Alert.alert('Eksik bilgi', 'Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    try {
      setIsSubmittingForgot(true);
      await AuthApiService.forgotPassword(forgotEmail.trim().toLowerCase());
      setForgotStep(2);
      setForgotCountdown(60);
      Alert.alert('Kod Gönderildi 📧', `${forgotEmail.trim().toLowerCase()} adresinize 6 haneli şifre sıfırlama kodu gönderildi.`);
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Sıfırlama kodu gönderilemedi.');
    } finally {
      setIsSubmittingForgot(false);
    }
  };

  // 2. Yeni Şifreyi Kaydet ve Giriş Yap (2. Aşama)
  const handleResetPasswordSubmit = async () => {
    if (forgotOtp.length < 6) {
      Alert.alert('Eksik Kod', 'Lütfen 6 haneli doğrulama kodunu eksiksiz girin.');
      return;
    }
    if (!forgotNewPass || forgotNewPass.length < 6) {
      Alert.alert('Geçersiz Şifre', 'Yeni şifreniz en az 6 karakter olmalıdır.');
      return;
    }
    if (forgotNewPass !== forgotNewPassConfirm) {
      Alert.alert('Şifreler Eşleşmiyor', 'Girdiğiniz yeni şifreler birbiriyle eşleşmiyor.');
      return;
    }
    try {
      setIsSubmittingForgot(true);
      const res = await AuthApiService.resetPassword(
        forgotEmail.trim().toLowerCase(),
        forgotOtp.trim(),
        forgotNewPass
      );
      await StorageService.saveAuthSession(res.accessToken, forgotEmail.trim().toLowerCase(), rememberMe, res.user?.fullName);
      if (refreshData) {
        await refreshData();
      }
      setForgotModalVisible(false);
      Alert.alert('Şifreniz Güncellendi 🔐', 'Yeni şifrenizle başarıyla giriş yapıldı.');
      router.replace('/(tabs)' as Href);
    } catch (error: any) {
      Alert.alert('İşlem Başarısız', error.message || 'Şifre sıfırlanamadı. Kodu kontrol edin.');
    } finally {
      setIsSubmittingForgot(false);
    }
  };

  // Şifre Güvenlik Seviyesi Hesaplama (1: Düşük, 2: Orta, 3: Güçlü)
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    if (pass.length < 6) return 1;
    if (pass.length < 9) return 2;
    return 3;
  };
  const passwordStrength = getPasswordStrength(regPassword);

  const isValidEmail = (email: string): boolean => {
    const trimmed = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      return false;
    }
    const parts = trimmed.split('@');
    if (parts.length !== 2) return false;
    const domain = parts[1];
    const dotParts = domain.split('.');
    if (dotParts.length < 2) return false;
    const tld = dotParts[dotParts.length - 1];
    if (tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) return false;
    const domainName = dotParts[0];
    if (domainName.length < 2) return false;

    // Typo domain kontrolü (.co ve hatalı domainler)
    const invalidTypos = [
      'gmal.com', 'gm.com', 'gmai.com', 'hotmial.com', 'yaho.com', 'outlok.com',
      'gmail.co', 'hotmail.co', 'yahoo.co', 'outlook.co', 'icloud.co'
    ];
    if (invalidTypos.includes(domain)) {
      return false;
    }

    return true;
  };

  const handleRegisterSubmit = async () => {
    if (!acceptedTerms) {
      Alert.alert(
        'Koşullar',
        'Lütfen devam etmek için Kullanım Koşulları ve Gizlilik Politikası’nı kabul edin.'
      );
      return;
    }
    if (!fullName.trim() || !regEmail.trim() || !regPassword) {
      Alert.alert('Eksik Bilgi', 'Lütfen ad soyad, e-posta ve şifre alanlarını doldurun.');
      return;
    }
    if (!isValidEmail(regEmail)) {
      Alert.alert(
        'Geçersiz E-Posta Formatı',
        'Lütfen geçerli ve standartlara uygun bir e-posta adresi girin (örn: ornek@gmail.com). .co veya eksik domainler kabul edilmez.'
      );
      return;
    }
    if (regPassword.length < 6) {
      Alert.alert('Geçersiz Şifre', 'Şifreniz en az 6 karakter olmalıdır.');
      return;
    }

    try {
      setIsSubmitting(true);
      // Backend üzerinden gerçek e-posta gönderimi tetikle
      await AuthApiService.sendVerificationCode(regEmail.trim().toLowerCase());
      setOtpCode('');
      setOtpCountdown(60);
      setOtpModalVisible(true);

      Alert.alert(
        'Doğrulama Kodu Gönderildi 📧',
        `Doğrulama kodu ${regEmail.trim().toLowerCase()} adresinize gönderildi. Lütfen gelen kutunuzu (ve gerekiyorsa spam klasörünü) kontrol ediniz.`
      );
    } catch (error: any) {
      Alert.alert('Kod Gönderilemedi', error.message || 'Doğrulama kodu gönderilirken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyAndCreateAccount = async () => {
    if (otpCode.trim().length !== 6) {
      Alert.alert('Eksik Kod', 'Lütfen e-postanıza gelen 6 haneli doğrulama kodunu eksiksiz girin.');
      return;
    }

    try {
      setIsVerifyingOtp(true);
      // 1. Backend kod doğrulaması
      await AuthApiService.verifyCode(regEmail.trim().toLowerCase(), otpCode.trim());

      // 2. Kod başarılı ise kullanıcı kaydını tamamla
      const res = await AuthApiService.register({
        fullName: fullName.trim(),
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        isTermsAccepted: acceptedTerms,
        isKvkkAccepted: acceptedTerms,
        isMarketingConsentAccepted: acceptedMarketing,
      });

      await StorageService.saveAuthSession(res.accessToken, regEmail.trim().toLowerCase(), true, fullName.trim());
      if (refreshData) {
        await refreshData();
      }
      setOtpModalVisible(false);
      Alert.alert('Hesap Doğrulandı 🎉', 'E-posta adresiniz başarıyla doğrulandı ve hesabınız oluşturuldu.');
      router.push('/budget-setup' as Href);
    } catch (error: any) {
      Alert.alert('Doğrulama Başarısız', error.message || 'Kod doğrulanamadı veya kayıt sırasında bir hata oluştu.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (otpCountdown > 0) return;
    try {
      await AuthApiService.sendVerificationCode(regEmail.trim().toLowerCase());
      setOtpCountdown(60);
      Alert.alert(
        'Yeni Kod Gönderildi 📧',
        `Yeni doğrulama kodu ${regEmail.trim().toLowerCase()} adresinize tekrar gönderildi.`
      );
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Yeni kod gönderilemedi.');
    }
  };

  const handleLoginSubmit = async () => {
    if (!loginEmail.trim() || !loginPassword) {
      Alert.alert('Eksik Bilgi', 'Lütfen e-posta ve şifrenizi girin.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await AuthApiService.login({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      const userDisplayName = res.user?.fullName || fullName.trim() || '';
      await StorageService.saveAuthSession(res.accessToken, loginEmail.trim(), rememberMe, userDisplayName);
      if (refreshData) {
        await refreshData();
      }
      // Giriş başarılı, ana sekmelere yönlendir
      router.replace('/(tabs)' as Href);
    } catch (error: any) {
      Alert.alert('Giriş Başarısız', error.message || 'Giriş yapılamadı. Bilgilerinizi kontrol edin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>

        {/* Üst Logo & Navigasyon Barı */}
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
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
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
                  onPress={() => {
                    setForgotEmail(loginEmail.trim());
                    setForgotStep(1);
                    setForgotOtp('');
                    setForgotNewPass('');
                    setForgotNewPassConfirm('');
                    setForgotModalVisible(true);
                  }}
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
              {/* 1. ZORUNLU: Kullanım Koşulları ve Gizlilik Politikası */}
              <View style={styles.termsContainer}>
                <TouchableOpacity
                  style={styles.termsCheckboxRow}
                  onPress={() => setAcceptedTerms(!acceptedTerms)}
                  activeOpacity={0.75}>
                  <View style={[styles.checkboxBox, acceptedTerms && styles.checkboxBoxChecked]}>
                    {acceptedTerms && <Ionicons name="checkmark" size={14} color="#ffffff" />}
                  </View>
                  <Text style={styles.termsText}>
                    <Text
                      style={styles.termsUnderline}
                      onPress={() =>
                        showPolicyAlert(
                          'Kullanım Koşulları',
                          'KararOS simülasyon ve harcama karar destek aracıdır. Kişisel bütçe verilerinizi güvenle yönetmenizi sağlar.'
                        )
                      }>
                      Kullanım Koşulları
                    </Text>
                    ’nı ve{' '}
                    <Text
                      style={styles.termsUnderline}
                      onPress={() =>
                        showPolicyAlert(
                          'Gizlilik Politikası',
                          'Verileriniz üçüncü taraflarla paylaşılmaz. Bankasız, cihaz içi izole mimariyle korunur.'
                        )
                      }>
                      Gizlilik Politikası
                    </Text>
                    ’nı okudum, kabul ediyorum.{' '}
                    <Text style={{ color: '#dc2626', fontWeight: '700' }}>*</Text>
                  </Text>
                </TouchableOpacity>

                {/* 2. İSTEĞE BAĞLI: Pazarlama ve Bildirim İzni */}
                <TouchableOpacity
                  style={[styles.termsCheckboxRow, { marginTop: 8 }]}
                  onPress={() => setAcceptedMarketing(!acceptedMarketing)}
                  activeOpacity={0.75}>
                  <View style={[styles.checkboxBox, acceptedMarketing && styles.checkboxBoxChecked]}>
                    {acceptedMarketing && <Ionicons name="checkmark" size={14} color="#ffffff" />}
                  </View>
                  <Text style={styles.termsTextOptional}>
                    Yeni karar modelleri ve bütçe tasarruf ipuçları hakkında bildirim almayı kabul ediyorum.{' '}
                    <Text style={{ color: '#94a3b8', fontStyle: 'italic' }}>(İsteğe bağlı)</Text>
                  </Text>
                </TouchableOpacity>
              </View>


              {/* Ana Kayıt Butonu */}
              <TouchableOpacity
                style={styles.primaryAuthButton}
                onPress={handleRegisterSubmit}
                activeOpacity={0.85}>
                <Text style={styles.primaryAuthButtonText}>Hesabımı Oluştur ve Başla</Text>
                <Ionicons name="arrow-forward" size={18} color="#ffffff" style={{ marginLeft: 6 }} />
              </TouchableOpacity>

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

      {/* ========================================================
          E-POSTA DOĞRULAMA MODALI (OTP VERIFICATION)
          ======================================================== */}
      <Modal
        visible={otpModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setOtpModalVisible(false)}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.otpCard}>
            {/* Modal Üst Kapatma */}
            <View style={styles.otpHeaderRow}>
              <View style={styles.otpBadgeWrap}>
                <Ionicons name="mail" size={20} color="#059669" />
              </View>
              <TouchableOpacity
                style={styles.otpCloseBtn}
                onPress={() => setOtpModalVisible(false)}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                activeOpacity={0.7}>
                <Ionicons name="close" size={22} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text style={styles.otpTitle}>E-Postanı Doğrula</Text>
            <Text style={styles.otpSubtitle}>
              <Text style={{ fontWeight: '700', color: '#0f172a' }}>{regEmail.trim().toLowerCase()}</Text> adresine 6 haneli bir onay kodu gönderdik.
            </Text>

            {/* Kod Giriş Alanı */}
            <View style={styles.otpInputWrap}>
              <TextInput
                style={styles.otpTextInput}
                placeholder="••••••"
                placeholderTextColor="#cbd5e1"
                keyboardType="number-pad"
                maxLength={6}
                value={otpCode}
                onChangeText={(val) => setOtpCode(val.replace(/[^0-9]/g, ''))}
                autoFocus
              />
            </View>

            {/* Tekrar Gönder Butonu & Sayacı */}
            <TouchableOpacity
              style={styles.resendBtn}
              onPress={handleResendOtp}
              disabled={otpCountdown > 0}
              activeOpacity={0.75}>
              <Ionicons
                name="refresh-outline"
                size={15}
                color={otpCountdown > 0 ? '#94a3b8' : '#2563eb'}
                style={{ marginRight: 5 }}
              />
              <Text style={[styles.resendText, otpCountdown === 0 && styles.resendTextActive]}>
                {otpCountdown > 0 ? `Kodu Tekrar Gönder (${otpCountdown}s)` : 'Kodu Tekrar Gönder'}
              </Text>
            </TouchableOpacity>

            {/* Doğrula ve Başla Butonu */}
            <TouchableOpacity
              style={[
                styles.otpSubmitBtn,
                (otpCode.trim().length !== 6 || isVerifyingOtp) && styles.otpSubmitBtnDisabled,
              ]}
              onPress={handleVerifyAndCreateAccount}
              disabled={otpCode.trim().length !== 6 || isVerifyingOtp}
              activeOpacity={0.85}>
              {isVerifyingOtp ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Text style={styles.otpSubmitBtnText}>Hesabımı Doğrula ve Başla</Text>
                  <Ionicons name="arrow-forward" size={17} color="#ffffff" style={{ marginLeft: 6 }} />
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      {/* ========================================================
          ŞİFRE SIFIRLAMA MODALI (FORGOT PASSWORD)
          ======================================================== */}
      <Modal
        visible={forgotModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setForgotModalVisible(false)}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.otpCard}>
            {/* Modal Üst Kapatma */}
            <View style={styles.otpHeaderRow}>
              <View style={[styles.otpBadgeWrap, { backgroundColor: '#eff6ff' }]}>
                <Ionicons name="key" size={20} color="#2563eb" />
              </View>
              <TouchableOpacity
                style={styles.otpCloseBtn}
                onPress={() => setForgotModalVisible(false)}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                activeOpacity={0.7}>
                <Ionicons name="close" size={22} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text style={styles.otpTitle}>Şifreni Sıfırla</Text>
            <Text style={styles.otpSubtitle}>
              {forgotStep === 1
                ? 'Hesabına bağlı e-posta adresini gir. Sana 6 haneli bir kurtarma kodu göndereceğiz.'
                : `${forgotEmail} adresine gelen 6 haneli kodu ve yeni şifreni gir.`}
            </Text>

            {forgotStep === 1 ? (
              /* AŞAMA 1: E-Posta Girişi */
              <View style={{ marginTop: 12 }}>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="E-Posta Adresiniz"
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={forgotEmail}
                    onChangeText={setForgotEmail}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.primaryAuthButton, { marginTop: 16 }, isSubmittingForgot && { opacity: 0.6 }]}
                  onPress={handleSendForgotCode}
                  disabled={isSubmittingForgot}
                  activeOpacity={0.85}>
                  {isSubmittingForgot ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <>
                      <Text style={styles.primaryAuthButtonText}>Doğrulama Kodu Gönder</Text>
                      <Ionicons name="arrow-forward" size={18} color="#ffffff" style={{ marginLeft: 6 }} />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              /* AŞAMA 2: Kod ve Yeni Şifre Girişi */
              <View style={{ marginTop: 8 }}>
                {/* 6 Haneli OTP Kod Girişi */}
                <View style={styles.otpInputsContainer}>
                  {[0, 1, 2, 3, 4, 5].map((index) => {
                    const digit = forgotOtp[index] || '';
                    const isFocused = forgotOtp.length === index;
                    return (
                      <View
                        key={index}
                        style={[
                          styles.otpBox,
                          digit ? styles.otpBoxFilled : null,
                          isFocused ? styles.otpBoxActive : null,
                        ]}>
                        <Text style={styles.otpBoxText}>{digit}</Text>
                      </View>
                    );
                  })}
                  <TextInput
                    style={styles.otpHiddenInput}
                    value={forgotOtp}
                    onChangeText={(val) => {
                      const clean = val.replace(/[^0-9]/g, '').slice(0, 6);
                      setForgotOtp(clean);
                    }}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoFocus
                  />
                </View>

                {/* Yeni Şifre */}
                <View style={[styles.inputContainer, { marginTop: 14 }]}>
                  <Ionicons name="lock-closed-outline" size={20} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Yeni Şifre (En az 6 karakter)"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showForgotNewPass}
                    value={forgotNewPass}
                    onChangeText={setForgotNewPass}
                  />
                  <TouchableOpacity
                    onPress={() => setShowForgotNewPass(!showForgotNewPass)}
                    style={styles.eyeBtn}>
                    <Ionicons
                      name={showForgotNewPass ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#64748b"
                    />
                  </TouchableOpacity>
                </View>

                {/* Yeni Şifre Tekrar */}
                <View style={[styles.inputContainer, { marginTop: 10 }]}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Yeni Şifre (Tekrar)"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showForgotNewPass}
                    value={forgotNewPassConfirm}
                    onChangeText={setForgotNewPassConfirm}
                  />
                </View>

                {/* Onay Butonu */}
                <TouchableOpacity
                  style={[styles.primaryAuthButton, { marginTop: 16 }, isSubmittingForgot && { opacity: 0.6 }]}
                  onPress={handleResetPasswordSubmit}
                  disabled={isSubmittingForgot}
                  activeOpacity={0.85}>
                  {isSubmittingForgot ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <>
                      <Text style={styles.primaryAuthButtonText}>Şifremi Sıfırla ve Giriş Yap</Text>
                      <Ionicons name="checkmark-circle" size={18} color="#ffffff" style={{ marginLeft: 6 }} />
                    </>
                  )}
                </TouchableOpacity>

                {/* Kodu Tekrar Gönder */}
                <View style={styles.otpResendRow}>
                  {forgotCountdown > 0 ? (
                    <Text style={styles.otpCountdownText}>
                      Tekrar kod iste ({forgotCountdown}s)
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={handleSendForgotCode} activeOpacity={0.7}>
                      <Text style={styles.otpResendBtnText}>Yeni Kod Gönder</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  otpCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  otpHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  otpBadgeWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpCloseBtn: {
    padding: 4,
  },
  otpTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  otpSubtitle: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 19,
    marginBottom: 20,
  },
  otpInputWrap: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#0f172a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  otpTextInput: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    letterSpacing: 12,
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginBottom: 20,
  },
  resendText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
  },
  resendTextActive: {
    color: '#2563eb',
    fontWeight: '700',
  },
  otpSubmitBtn: {
    backgroundColor: '#0a192f',
    borderRadius: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpSubmitBtnDisabled: {
    opacity: 0.5,
  },
  otpSubmitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  termsContainer: {
    marginVertical: 14,
    gap: 10,
  },
  termsTextOptional: {
    flex: 1,
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
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
  otpInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    position: 'relative',
  },
  otpBox: {
    width: 44,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFilled: {
    borderColor: '#059669',
    backgroundColor: '#f0fdf4',
  },
  otpBoxActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  otpBoxText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  otpHiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
  },
  otpResendRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  otpCountdownText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#94a3b8',
  },
  otpResendBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },

});
