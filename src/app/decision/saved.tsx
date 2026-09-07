import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { useBudget } from '@/context/budget-context';

export default function DecisionSavedScreen() {
  const router = useRouter();
  const { decisions, availableBudget } = useBudget();
  const [notifyEvaluation, setNotifyEvaluation] = useState(true);

  // En son karar kaydı veya fallback
  const lastDecision = decisions[0] || {
    id: 'dec-saved-1',
    request: {
      title: 'Kablosuz Kulaklık',
      amount: 2700,
      category: 'Elektronik' as const,
      date: 'Bugün',
    },
    response: {
      projectedAvailableBudget: 11370,
      projectedSavingsGap: 3630,
    },
    action: 'BOUGHT' as const,
    actionDate: 'Bugün, 24 Ekim',
    impactStatus: 'Bekleniyor',
  };

  const isBought = lastDecision.action === 'BOUGHT';

  const formatCurrency = (val: number) => {
    return val.toLocaleString('tr-TR');
  };

  const handleGoHome = () => {
    router.replace('/(tabs)' as Href);
  };

  const handleGoHistory = () => {
    router.replace('/(tabs)/history' as Href);
  };

  const getItemIcon = (title: string, category: string): keyof typeof Ionicons.glyphMap => {
    if (title.toLowerCase().includes('kulaklık') || category.includes('Elektronik')) return 'headset-outline';
    if (title.toLowerCase().includes('tatil') || category.includes('Seyahat') || category.includes('Ulaşım')) return 'airplane-outline';
    if (title.toLowerCase().includes('ayakkabı') || category.includes('Giyim')) return 'footsteps-outline';
    return 'bag-handle-outline';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleGoHome}
          activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>

        <View style={styles.brandRow}>
          <Image
            source={require('@/../assets/images/kararos-logo.png')}
            style={styles.brandLogoImg}
            resizeMode="cover"
          />
          <Text style={styles.brandTitle}>Karar Onay</Text>
          <View style={styles.activeGreenDot} />
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
        
        {/* 1. HERO BAŞARI KARTI */}
        <View style={styles.heroSuccessCard}>
          <View style={styles.heroCheckCircle}>
            <Ionicons name="checkmark" size={28} color="#ffffff" />
          </View>

          <Text style={styles.heroSuccessTitle}>Kararını kaydettik.</Text>
          <Text style={styles.heroSuccessSubtitle}>
            Bilinçli bir tercih yaptın. Gerçek bütçe etkisini ay sonunda birlikte değerlendireceğiz.
          </Text>

          <View style={styles.activeTrackingBadge}>
            <View style={styles.trackingDot} />
            <Text style={styles.trackingBadgeText}>Aktif İzleme Başlatıldı</Text>
          </View>
        </View>

        {/* 2. İŞLEM DETAY KARTI */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>İŞLEM DETAYI</Text>
            <View
              style={[
                styles.actionPill,
                isBought ? styles.actionPillBought : styles.actionPillPostponed,
              ]}>
              <Ionicons
                name={isBought ? 'checkmark' : 'refresh'}
                size={12}
                color={isBought ? '#059669' : '#0369a1'}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.actionPillText,
                  isBought ? styles.actionPillTextBought : styles.actionPillTextPostponed,
                ]}>
                {isBought ? 'Alındı' : 'Ertelendi'}
              </Text>
            </View>
          </View>

          <View style={styles.itemRow}>
            <View style={styles.itemIconBox}>
              <Ionicons
                name={getItemIcon(lastDecision.request.title, lastDecision.request.category)}
                size={20}
                color="#0284c7"
              />
            </View>

            <View style={styles.itemMainCol}>
              <Text style={styles.itemTitle} numberOfLines={1}>
                {lastDecision.request.title}
              </Text>
              <Text style={styles.itemSubText}>
                {lastDecision.request.category} • {lastDecision.actionDate || 'Bugün, 24 Ekim'}
              </Text>
            </View>

            <View style={styles.itemAmountCol}>
              <Text style={styles.itemAmount}>
                {formatCurrency(lastDecision.request.amount)} TL
              </Text>
              <Text style={styles.itemFrequency}>Tek Sefer</Text>
            </View>
          </View>

          <View style={styles.sourceBox}>
            <Ionicons name="card-outline" size={15} color="#64748b" style={{ marginRight: 8 }} />
            <Text style={styles.sourceLabel}>Kaynak:</Text>
            <Text style={styles.sourceValue}>Maaş Hesabı • Bütçe İçi</Text>
          </View>
        </View>

        {/* 3. 30 GÜNLÜK DENEYİM KARTI */}
        <View style={styles.experienceCard}>
          <View style={styles.expThumbnailBox}>
            <Ionicons name="headset" size={24} color="#0284c7" />
          </View>
          <View style={styles.expContent}>
            <View style={styles.expHeaderRow}>
              <Ionicons name="leaf-outline" size={13} color="#059669" style={{ marginRight: 4 }} />
              <Text style={styles.expBadgeTitle}>30 GÜNLÜK DENEYİM</Text>
            </View>
            <Text style={styles.expDesc} numberOfLines={2}>
              Bu kararın sana sağladığı faydayı ve kullanım sıklığını önümüzdeki 30 gün izleyeceğiz.
            </Text>
          </View>
        </View>

        {/* 4. AY SONU BEKLENTİSİ KARTI */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.trendHeaderLeft}>
              <Ionicons name="trending-up-outline" size={18} color="#0f172a" style={{ marginRight: 6 }} />
              <Text style={styles.sectionHeaderTitle}>Ay Sonu Beklentisi</Text>
            </View>
            <View style={styles.balancePill}>
              <Text style={styles.balancePillText}>Dengeli</Text>
            </View>
          </View>

          {/* Çift Metrik Kutuları */}
          <View style={styles.dualMetricsRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricBoxLabel}>Kalan Güvenli Pay</Text>
              <Text style={styles.metricBoxAmount}>
                {formatCurrency(lastDecision.response?.projectedAvailableBudget || 11370)} TL
              </Text>
              <Text style={styles.metricBoxSubText}>+420 TL tampon</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricBoxLabel}>Hedef Güvenliği</Text>
              <Text style={styles.metricBoxAmount}>%82</Text>
              <Text style={styles.metricBoxSubText}>İtalya Tatili Fonu</Text>
            </View>
          </View>

          {/* Bütçe Kapasite Çubuğu */}
          <View style={styles.capacityHeaderRow}>
            <Text style={styles.capacityLabel}>Bütçe Kapasitesi Kullanımı</Text>
            <Text style={styles.capacityPercent}>%64</Text>
          </View>

          <View style={styles.capacityBar}>
            <View style={[styles.capacitySegmentBlack, { flex: 54 }]} />
            <View style={[styles.capacitySegmentGreen, { flex: 10 }]} />
            <View style={[styles.capacitySegmentLight, { flex: 36 }]} />
          </View>

          <View style={styles.capacityLegends}>
            <View style={styles.capLegendItem}>
              <View style={[styles.capLegendDot, { backgroundColor: '#0f172a' }]} />
              <Text style={styles.capLegendText}>Önceki Harcamalar</Text>
            </View>
            <View style={styles.capLegendItem}>
              <View style={[styles.capLegendDot, { backgroundColor: '#059669' }]} />
              <Text style={styles.capLegendText}>Bu Karar</Text>
            </View>
          </View>

          {/* Bildirim Switch Satırı */}
          <View style={styles.switchRow}>
            <View style={styles.switchIconWrap}>
              <Ionicons name="notifications-outline" size={18} color="#0f172a" />
            </View>
            <View style={styles.switchContent}>
              <Text style={styles.switchTitle}>Ay Sonu Değerlendirmesi</Text>
              <Text style={styles.switchSubtitle}>
                Harcama gerçekleşme bildirimi al
              </Text>
            </View>
            <Switch
              value={notifyEvaluation}
              onValueChange={setNotifyEvaluation}
              trackColor={{ false: '#cbd5e1', true: '#059669' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* 5. GÜVENCE / BİLGİ KUTUSU */}
        <View style={styles.infoAssuranceBox}>
          <Ionicons name="heart-outline" size={16} color="#64748b" style={styles.infoAssuranceIcon} />
          <Text style={styles.infoAssuranceText}>
            Bu kararın hedeflerine etkisi 30 gün boyunca takip edilecek. Eğer fikrin değişirse veya ürünü iade edersen istediğin an güncelleyebilirsin.
          </Text>
        </View>

        {/* 6. AKSİYON BUTONLARI */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleGoHome}
          activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>Tamam (Ana Sayfaya Dön)</Text>
          <Ionicons name="arrow-forward" size={16} color="#ffffff" style={{ marginLeft: 6 }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={handleGoHistory}
          activeOpacity={0.75}>
          <Text style={styles.secondaryBtnText}>Geçmiş Kararlarımda Gör</Text>
        </TouchableOpacity>

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
  activeGreenDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#059669',
    marginLeft: 2,
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
  heroSuccessCard: {
    backgroundColor: '#ecfdf5',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    marginBottom: 14,
  },
  heroCheckCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  heroSuccessTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  heroSuccessSubtitle: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
    paddingHorizontal: 10,
  },
  activeTrackingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  trackingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
    marginRight: 6,
  },
  trackingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 0.3,
  },
  trendHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  actionPillBought: {
    backgroundColor: '#dcfce7',
  },
  actionPillPostponed: {
    backgroundColor: '#e0f2fe',
  },
  actionPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionPillTextBought: {
    color: '#15803d',
  },
  actionPillTextPostponed: {
    color: '#0369a1',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemIconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  itemMainCol: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  itemSubText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  itemAmountCol: {
    alignItems: 'flex-end',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  itemFrequency: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  sourceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sourceLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginRight: 4,
  },
  sourceValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  experienceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 14,
  },
  expThumbnailBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  expContent: {
    flex: 1,
  },
  expHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  expBadgeTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  expDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
  balancePill: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  balancePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065f46',
  },
  dualMetricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#f0f7ff',
    borderRadius: 14,
    padding: 12,
  },
  metricBoxLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  metricBoxAmount: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  metricBoxSubText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '700',
  },
  capacityHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  capacityLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  capacityPercent: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  capacityBar: {
    flexDirection: 'row',
    height: 7,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  capacitySegmentBlack: {
    backgroundColor: '#0f172a',
  },
  capacitySegmentGreen: {
    backgroundColor: '#059669',
  },
  capacitySegmentLight: {
    backgroundColor: '#e2e8f0',
  },
  capacityLegends: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 14,
  },
  capLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  capLegendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  capLegendText: {
    fontSize: 10.5,
    color: '#64748b',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  switchIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  switchContent: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  switchSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  infoAssuranceBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#eff6ff',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#dbeafe',
    marginBottom: 20,
  },
  infoAssuranceIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoAssuranceText: {
    flex: 1,
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 17,
  },
  primaryBtn: {
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
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  secondaryBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryBtnText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
  },
});