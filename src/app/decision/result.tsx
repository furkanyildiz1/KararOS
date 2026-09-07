import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { useBudget } from '@/context/budget-context';

export default function DecisionResultScreen() {
  const router = useRouter();
  const { activeEvaluation, saveDecisionAction, availableBudget } = useBudget();

  // Aktif değerlendirme yoksa varsayılan fallback veri
  const evaluation = activeEvaluation || {
    id: 'resp-fallback',
    request: {
      title: 'Kablosuz Kulaklık',
      amount: 2700,
      category: 'Elektronik' as const,
      date: 'Bugün',
    },
    verdict: 'APPROVED' as const,
    verdictTitle: 'Alabilirsin',
    verdictSubtitle: 'Bütçen bunu rahatça kucaklıyor.',
    riskLevel: 'LOW' as const,
    currentAvailableBudget: 14070,
    projectedAvailableBudget: 11370,
    projectedSavingsGap: 3630,
    expenseRatio: 0.19,
    budgetUsagePercent: 57,
    reasons: [
      'Bütçende bu harcamayı karşılayacak sağlıklı bir esneme payı var.',
      'Günlük ortalama harcama planının altında kalmaya devam ediyorsun.',
      'Bu ayki 6.000 TL tasarruf hedefine ulaşma ihtimalin %82 seviyesinde.',
    ],
  };

  const isApproved = evaluation.verdict === 'APPROVED';
  const isCaution = evaluation.verdict === 'CAUTION';

  const formatCurrency = (val: number) => {
    return val.toLocaleString('tr-TR');
  };

  const handleAction = (action: 'BOUGHT' | 'POSTPONED') => {
    saveDecisionAction(evaluation, action);
    router.push('/decision/saved' as Href);
  };

  // Kategoriye göre ikon belirleme
  const getCategoryIcon = (cat: string): keyof typeof Ionicons.glyphMap => {
    if (cat.includes('Elektronik')) return 'headset-outline';
    if (cat.includes('Giyim')) return 'shirt-outline';
    if (cat.includes('Yeme') || cat.includes('Sosyal')) return 'restaurant-outline';
    if (cat.includes('Seyahat') || cat.includes('Ulaşım')) return 'airplane-outline';
    return 'bag-handle-outline';
  };

  const remainingPercent = evaluation.currentAvailableBudget > 0
    ? Math.round((evaluation.projectedAvailableBudget / evaluation.currentAvailableBudget) * 100)
    : 81;

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>

        <View style={styles.brandRow}>
          <Image
            source={require('@/../assets/images/kararos-logo.png')}
            style={styles.brandLogoImg}
            resizeMode="cover"
          />
          <Text style={styles.brandTitle}>Karar Simülatörü</Text>
        </View>

        <TouchableOpacity
          style={styles.avatarBtn}
          onPress={() => router.push('/(tabs)/profile' as Href)}
          activeOpacity={0.7}>
          <Ionicons name="person-circle" size={32} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* 1. ÜST ÖZET KARTI */}
        <View style={styles.topSummaryCard}>
          <View style={styles.summaryIconBox}>
            <Ionicons
              name={getCategoryIcon(evaluation.request.category)}
              size={20}
              color="#0284c7"
            />
          </View>
          <View style={styles.summaryContent}>
            <View style={styles.summarySubRow}>
              <Text style={styles.summaryTag}>SİMÜLASYON SONUCU</Text>
              <Text style={styles.summaryCategoryDot}>• {evaluation.request.category}</Text>
            </View>
            <Text style={styles.summaryTitle} numberOfLines={1}>
              {evaluation.request.title}
            </Text>
          </View>
          <Text style={styles.summaryAmount}>
            {formatCurrency(evaluation.request.amount)} TL
          </Text>
        </View>

        {/* 2. HERO KARAR VERDİCT KARTI */}
        <View
          style={[
            styles.heroVerdictCard,
            isApproved && styles.heroApproved,
            isCaution && styles.heroCaution,
            !isApproved && !isCaution && styles.heroReject,
          ]}>
          <View
            style={[
              styles.verdictBadge,
              isApproved && styles.verdictBadgeApproved,
              isCaution && styles.verdictBadgeCaution,
              !isApproved && !isCaution && styles.verdictBadgeReject,
            ]}>
            <Ionicons
              name={isApproved ? 'checkmark-circle' : isCaution ? 'warning' : 'close-circle'}
              size={14}
              color={isApproved ? '#059669' : isCaution ? '#b45309' : '#dc2626'}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.verdictBadgeText,
                isApproved && styles.verdictBadgeTextApproved,
                isCaution && styles.verdictBadgeTextCaution,
                !isApproved && !isCaution && styles.verdictBadgeTextReject,
              ]}>
              {evaluation.verdictTitle}
            </Text>
          </View>

          <Text style={styles.heroTitle}>
            {isApproved
              ? 'Bütçen bunu rahatça kucaklıyor.'
              : isCaution
              ? 'Bütçeni biraz zorlayabilir.'
              : 'Bu harcamayı ertelemeni öneririz.'}
          </Text>

          <Text style={styles.heroSubtitle}>
            {isApproved
              ? 'Bu alışveriş bütçeni önemli ölçüde zorlamıyor ve ay sonu nakit dengeni güvende tutuyor.'
              : evaluation.verdictSubtitle}
          </Text>

          <View style={styles.riskRow}>
            <Ionicons name="shield-checkmark-outline" size={14} color="#059669" style={{ marginRight: 4 }} />
            <Text style={styles.riskText}>
              Risk Analizi:{' '}
              <Text style={{ fontWeight: '700' }}>
                {evaluation.riskLevel === 'LOW'
                  ? 'Düşük Etki Seviyesi'
                  : evaluation.riskLevel === 'MEDIUM'
                  ? 'Orta Etki Seviyesi'
                  : 'Yüksek Risk Seviyesi'}
              </Text>
            </Text>
          </View>
        </View>

        {/* 3. DİNAMİK PROJEKSİYON KARTI */}
        <View style={styles.projectionCard}>
          <View style={styles.projectionHeader}>
            <View style={styles.projTitleRow}>
              <Ionicons name="swap-horizontal" size={18} color="#0f172a" style={{ marginRight: 6 }} />
              <Text style={styles.projectionTitle}>Bugün alırsan ne değişecek?</Text>
            </View>
            <View style={styles.dynamicBadge}>
              <Text style={styles.dynamicBadgeText}>Dinamik Projeksiyon</Text>
            </View>
          </View>

          {/* Projeksiyon Satır 1: Ay Sonunda Kalan Nakit */}
          <View style={styles.projRow}>
            <View style={styles.projLeftCol}>
              <Text style={styles.projLabel}>Ay Sonunda Kalan Nakit</Text>
            </View>
            <View style={styles.projFlowRow}>
              <Text style={styles.projOldValue}>
                {formatCurrency(evaluation.currentAvailableBudget || availableBudget)} TL
              </Text>
              <Ionicons name="arrow-forward" size={14} color="#94a3b8" style={{ marginHorizontal: 6 }} />
              <Text style={styles.projNewValue}>
                {formatCurrency(evaluation.projectedAvailableBudget)} TL
              </Text>
            </View>
          </View>

          {/* Çift Renkli Progress Bar */}
          <View style={styles.dualBarContainer}>
            <View style={[styles.dualBarLeft, { flex: remainingPercent }]} />
            <View style={[styles.dualBarRight, { flex: 100 - remainingPercent }]} />
          </View>
          <View style={styles.dualBarLabels}>
            <Text style={styles.barLabelLeft}>Kalan: %{remainingPercent} Güvenli Pay</Text>
            <Text style={styles.barLabelRight}>
              -{formatCurrency(evaluation.request.amount)} TL Harcama
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Projeksiyon Satır 2: Tasarruf Hedefine Mesafe */}
          <View style={styles.projRow}>
            <View style={styles.savingsLabelGroup}>
              <Ionicons name="wallet-outline" size={15} color="#64748b" style={{ marginRight: 6 }} />
              <Text style={styles.projLabel}>Tasarruf Hedefine Mesafe</Text>
            </View>
            <View style={styles.savingsRightGroup}>
              <Text style={styles.savingsSubLabel}>Hedefe Kalan:</Text>
              <Text style={styles.savingsGapValue}>
                {formatCurrency(evaluation.projectedSavingsGap)} TL
              </Text>
            </View>
          </View>

          <View style={styles.singleBarContainer}>
            <View style={[styles.singleBarFill, { width: '45%' }]} />
          </View>
          <View style={styles.singleBarLabels}>
            <Text style={styles.singleBarLabelLeft}>Gerçekleşen: 2.370 TL</Text>
            <Text style={styles.singleBarLabelRight}>Hedef: 6.000 TL (Güvenli Aralıkta)</Text>
          </View>
        </View>

        {/* 4. NEDEN BÖYLE DÜŞÜNÜYORUZ? */}
        <View style={styles.reasonsCard}>
          <View style={styles.reasonsHeader}>
            <Ionicons name="bulb-outline" size={18} color="#0284c7" style={{ marginRight: 6 }} />
            <Text style={styles.reasonsTitle}>Neden böyle düşünüyoruz?</Text>
          </View>

          <View style={styles.reasonsList}>
            {evaluation.reasons.map((reason, idx) => (
              <View key={idx} style={styles.reasonItem}>
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={13} color="#059669" />
                </View>
                <Text style={styles.reasonText}>{reason}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 5. ALTERNATİF SENARYO */}
        <View style={styles.altScenarioBox}>
          <View style={styles.altIconWrap}>
            <Ionicons name="bulb-outline" size={16} color="#0284c7" />
          </View>
          <View style={styles.altContent}>
            <Text style={styles.altTitle}>ALTERNATİF SENARYO</Text>
            <Text style={styles.altText}>
              Şimdilik ertelersen ay sonu birikim hedefine{' '}
              <Text style={{ fontWeight: '800', color: '#0f172a' }}>12 gün daha erken</Text> ulaşırsın.
            </Text>
          </View>
        </View>

        {/* 6. AKSİYON BUTONLARI */}
        <TouchableOpacity
          style={styles.primaryActionBtn}
          onPress={() => handleAction('BOUGHT')}
          activeOpacity={0.85}>
          <Text style={styles.primaryActionText}>
            Alışverişi Yapacağım (Kararı Kaydet)
          </Text>
          <Ionicons name="checkmark" size={18} color="#ffffff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryActionBtn}
          onPress={() => handleAction('POSTPONED')}
          activeOpacity={0.8}>
          <Ionicons name="information-circle-outline" size={16} color="#0f172a" style={{ marginRight: 6 }} />
          <Text style={styles.secondaryActionText}>
            Vazgeçtim / Ertelemek İstiyorum
          </Text>
        </TouchableOpacity>

        <View style={styles.footerDisclaimer}>
          <Ionicons name="chevron-back" size={12} color="#94a3b8" style={{ marginRight: 4 }} />
          <Text style={styles.footerDisclaimerText}>
            Karar senin. KararOS sadece seni ve hedeflerini korumak için simüle eder.
          </Text>
        </View>

      </ScrollView>
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
  backBtn: {
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
    width: 26,
    height: 26,
    borderRadius: 8,
  },
  brandTitle: {
    fontSize: 17,
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
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 40,
  },
  topSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  summaryIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  summaryContent: {
    flex: 1,
  },
  summarySubRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  summaryCategoryDot: {
    fontSize: 9,
    fontWeight: '600',
    color: '#94a3b8',
    marginLeft: 4,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 1,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginLeft: 8,
  },
  heroVerdictCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
  },
  heroApproved: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  heroCaution: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  heroReject: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  verdictBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 12,
  },
  verdictBadgeApproved: {
    backgroundColor: '#d1fae5',
  },
  verdictBadgeCaution: {
    backgroundColor: '#fef3c7',
  },
  verdictBadgeReject: {
    backgroundColor: '#fee2e2',
  },
  verdictBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  verdictBadgeTextApproved: {
    color: '#059669',
  },
  verdictBadgeTextCaution: {
    color: '#b45309',
  },
  verdictBadgeTextReject: {
    color: '#dc2626',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 28,
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 14,
  },
  riskRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  projectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  projectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  projTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  dynamicBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  dynamicBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0369a1',
  },
  projRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projLeftCol: {
    flex: 1,
  },
  projLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  projFlowRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projOldValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    textDecorationLine: 'none',
  },
  projNewValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  dualBarContainer: {
    flexDirection: 'row',
    height: 7,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    marginBottom: 6,
  },
  dualBarLeft: {
    backgroundColor: '#0f172a',
  },
  dualBarRight: {
    backgroundColor: '#34d399',
  },
  dualBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  barLabelLeft: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  barLabelRight: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 10,
  },
  savingsLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingsRightGroup: {
    alignItems: 'flex-end',
  },
  savingsSubLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  savingsGapValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#059669',
  },
  singleBarContainer: {
    height: 6,
    backgroundColor: '#e0f2fe',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
    marginTop: 4,
  },
  singleBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  singleBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  singleBarLabelLeft: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  singleBarLabelRight: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  reasonsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  reasonsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reasonsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  reasonsList: {
    gap: 8,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0f7ff',
    padding: 12,
    borderRadius: 14,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  reasonText: {
    flex: 1,
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
    fontWeight: '500',
  },
  altScenarioBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#dbeafe',
    marginBottom: 20,
  },
  altIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  altContent: {
    flex: 1,
  },
  altTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0369a1',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  altText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  primaryActionBtn: {
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
    marginBottom: 10,
  },
  primaryActionText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  secondaryActionBtn: {
    backgroundColor: '#e0f2fe',
    borderRadius: 24,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  secondaryActionText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
  },
  footerDisclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  footerDisclaimerText: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
