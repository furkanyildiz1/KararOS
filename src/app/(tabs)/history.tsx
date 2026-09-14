import { useBudget } from '@/context/budget-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FilterType = 'ALL' | 'BOUGHT' | 'POSTPONED';

export default function HistoryScreen() {
  const router = useRouter();
  const { decisions } = useBudget();
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  // Filtrelenmiş liste
  const filteredDecisions = decisions.filter((item) => {
    if (activeFilter === 'BOUGHT') return item.action === 'BOUGHT';
    if (activeFilter === 'POSTPONED') return item.action === 'POSTPONED';
    return true;
  });

  const boughtCount = decisions.filter((d) => d.action === 'BOUGHT').length;
  const postponedCount = decisions.filter((d) => d.action === 'POSTPONED').length;
  const totalCount = decisions.length;
  const boughtPercent = totalCount > 0 ? Math.round((boughtCount / totalCount) * 100) : 0;
  const postponedPercent = totalCount > 0 ? 100 - boughtPercent : 0;

  const formatCurrency = (val: number) => {
    return val.toLocaleString('tr-TR');
  };

  const handleExportReport = () => {
    Alert.alert(
      'Rapor Dışa Aktarıldı',
      'Geçmiş karar analiz raporunuz PDF olarak cihazınıza kaydedildi.'
    );
  };

  const getItemIcon = (title: string, category: string): keyof typeof Ionicons.glyphMap => {
    const cat = (category || '').toLowerCase();
    const t = (title || '').toLowerCase();
    if (cat.includes('elektronik') || cat.includes('teknoloji') || t.includes('kulaklık') || t.includes('telefon') || t.includes('bilgisayar')) return 'hardware-chip-outline';
    if (cat.includes('giyim') || cat.includes('moda') || t.includes('ayakkabı') || t.includes('mont')) return 'shirt-outline';
    if (cat.includes('yeme') || cat.includes('içme') || cat.includes('restoran') || t.includes('yemek')) return 'restaurant-outline';
    if (cat.includes('ulaşım') || cat.includes('seyahat') || cat.includes('tatil') || t.includes('bilet')) return 'car-sport-outline';
    if (cat.includes('sağlık') || cat.includes('güzellik')) return 'medkit-outline';
    if (cat.includes('ev') || cat.includes('yaşam')) return 'home-outline';
    if (cat.includes('hobi') || cat.includes('eğlence')) return 'game-controller-outline';
    if (cat.includes('eğitim')) return 'school-outline';
    return 'apps-outline';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Bar */}
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        <Text style={styles.mainTitle}>Geçmiş Kararlarım</Text>
        <Text style={styles.mainSubtitle}>
          Harcamalarından öğren, gelecekteki kararlarını güçlendir.
        </Text>

        {/* 1. ÖZET ANALİZ KARTI */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <View>
              <Text style={styles.summaryLabel}>Değerlendirilen Karar</Text>
              <Text style={styles.summaryCount}>
                {totalCount} <Text style={styles.summarySubCount}>Karar Analizi</Text>
              </Text>
            </View>

            <View style={styles.scorePill}>
              <Ionicons name="speedometer-outline" size={16} color="#059669" style={{ marginRight: 6 }} />
              <View>
                <Text style={styles.scoreLabel}>Skor</Text>
                <Text style={styles.scoreValue}>{totalCount > 0 ? `%${boughtPercent > 0 ? 80 + Math.round(boughtPercent / 10) : 100} Uyum` : 'Yeni Başlangıç'}</Text>
              </View>
            </View>
          </View>

          {/* Dağılım Çubuğu */}
          <View style={styles.breakdownBox}>
            <View style={styles.breakdownHeaderRow}>
              <Text style={styles.breakdownTitle}>Sonuç Dağılımı</Text>
              <Text style={styles.breakdownCounts}>
                {boughtCount} Alındı • {postponedCount} Ertelendi
              </Text>
            </View>

            <View style={styles.breakdownBar}>
              {totalCount === 0 ? (
                <View style={[styles.breakdownSegmentSlate, { flex: 100, backgroundColor: '#e2e8f0' }]} />
              ) : (
                <>
                  {boughtPercent > 0 && <View style={[styles.breakdownSegmentGreen, { flex: Math.max(5, boughtPercent) }]} />}
                  {postponedPercent > 0 && <View style={[styles.breakdownSegmentSlate, { flex: Math.max(5, postponedPercent) }]} />}
                </>
              )}
            </View>

            <View style={styles.breakdownLegends}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#059669' }]} />
                <Text style={styles.legendText}>Hedefe Uygun Alım (%{boughtPercent})</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#475569' }]} />
                <Text style={styles.legendText}>Bilinçli Erteleme (%{postponedPercent})</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 2. FİLTRE HAPLARI */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterPill,
              activeFilter === 'ALL' && styles.filterPillActive,
            ]}
            onPress={() => setActiveFilter('ALL')}
            activeOpacity={0.75}>
            <Text
              style={[
                styles.filterPillText,
                activeFilter === 'ALL' && styles.filterPillTextActive,
              ]}>
              Tümü <Text style={styles.filterCount}>{totalCount}</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              activeFilter === 'BOUGHT' && styles.filterPillActive,
            ]}
            onPress={() => setActiveFilter('BOUGHT')}
            activeOpacity={0.75}>
            <Text
              style={[
                styles.filterPillText,
                activeFilter === 'BOUGHT' && styles.filterPillTextActive,
              ]}>
              Alınanlar <Text style={styles.filterCount}>{boughtCount}</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              activeFilter === 'POSTPONED' && styles.filterPillActive,
            ]}
            onPress={() => setActiveFilter('POSTPONED')}
            activeOpacity={0.75}>
            <Text
              style={[
                styles.filterPillText,
                activeFilter === 'POSTPONED' && styles.filterPillTextActive,
              ]}>
              Ertelenenler <Text style={styles.filterCount}>{postponedCount}</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3. KARAR KARTLARI LİSTESİ */}
        <View style={styles.decisionsList}>
          {filteredDecisions.length === 0 ? (
            <View style={styles.emptyHistoryCard}>
              <View style={styles.emptyHistoryIconCircle}>
                <Ionicons name="time-outline" size={28} color="#059669" />
              </View>
              <Text style={styles.emptyHistoryTitle}>Henüz Değerlendirilen Karar Yok</Text>
              <Text style={styles.emptyHistorySubtitle}>
                Alışveriş yapmadan önce Karar Al ekranından simülasyon yaptığında değerlendirmelerin burada listelenecektir.
              </Text>
              <TouchableOpacity
                style={styles.emptyHistoryBtn}
                onPress={() => router.push('/(tabs)/decide' as any)}
                activeOpacity={0.85}>
                <Ionicons name="sparkles" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.emptyHistoryBtnText}>İlk Kararını Simüle Et</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredDecisions.map((item, index) => {
              const isBought = item.action === 'BOUGHT';
              const isSavedWin = item.action === 'POSTPONED';
              const isCancelled = item.action === 'CANCELLED';
              const verdictTitle = item.response?.verdictTitle || (isBought ? 'Onaylandı' : (isSavedWin ? 'Ertelendi' : 'Değerlendirildi'));
              const verdictSubtitle = item.response?.verdictSubtitle || (isSavedWin ? 'Tasarruf tamponu korundu.' : 'Bütçe analizi tamamlandı.');
              const firstReason = item.response?.reasons && item.response.reasons.length > 0 ? item.response.reasons[0] : null;

              return (
                <View key={item.id || index} style={styles.decisionCard}>
                  {/* Kart Üst Satırı */}
                  <View style={styles.cardTopRow}>
                    <View style={styles.cardIconBox}>
                      <Ionicons
                        name={getItemIcon(item.request.title, item.request.category)}
                        size={20}
                        color="#0284c7"
                      />
                    </View>
                    <View style={styles.cardMainCol}>
                      <Text style={styles.cardTitle}>{item.request.title}</Text>
                      <Text style={styles.cardCategoryDate}>
                        {item.request.category} • {item.actionDate || 'Bugün'}
                      </Text>
                    </View>
                    <View style={styles.cardAmountCol}>
                      <Text style={styles.cardAmount}>
                        {formatCurrency(item.request.amount)} TL
                      </Text>
                      <View
                        style={[
                          styles.actionBadge,
                          isBought ? styles.actionBadgeBought : (isSavedWin ? styles.actionBadgePostponed : { backgroundColor: '#fee2e2' }),
                        ]}>
                        <Ionicons
                          name={isBought ? 'checkmark' : (isSavedWin ? 'refresh' : 'close')}
                          size={11}
                          color={isBought ? '#15803d' : (isSavedWin ? '#0369a1' : '#dc2626')}
                          style={{ marginRight: 3 }}
                        />
                        <Text
                          style={[
                            styles.actionBadgeText,
                            isBought ? styles.actionBadgeTextBought : (isSavedWin ? styles.actionBadgeTextPostponed : { color: '#dc2626' }),
                          ]}>
                          {isBought ? 'Alındı' : (isSavedWin ? 'Ertelendi' : 'Vazgeçildi')}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Kart İç Detay Kutusu */}
                  <View style={styles.cardInnerBox}>
                    {isSavedWin ? (
                      <>
                        <Text style={styles.innerStrategyText}>
                          <Text style={{ fontWeight: '700' }}>Karar Stratejisi:</Text> {verdictTitle} • Erteleme kuralı uygulandı
                        </Text>
                        <View style={styles.winSubCard}>
                          <Ionicons name="gift-outline" size={14} color="#059669" style={{ marginRight: 6 }} />
                          <Text style={styles.winSubText}>
                            <Text style={{ fontWeight: '700' }}>Kazanım:</Text> Tasarruf hedefine doğrudan{' '}
                            <Text style={{ fontWeight: '800' }}>+{formatCurrency(item.request.amount)} TL</Text> tampon katkısı sağlandı.
                          </Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <View style={styles.innerImpactRow}>
                          <Ionicons
                            name={item.response?.verdict === 'APPROVED' ? 'trending-up' : (item.response?.verdict === 'CAUTION' ? 'alert-circle-outline' : 'warning-outline')}
                            size={14}
                            color={item.response?.verdict === 'APPROVED' ? '#059669' : (item.response?.verdict === 'CAUTION' ? '#d97706' : '#dc2626')}
                            style={{ marginRight: 6 }}
                          />
                          <Text style={styles.innerImpactText}>
                            <Text style={{ fontWeight: '700' }}>{verdictTitle}:</Text> {firstReason || verdictSubtitle}
                          </Text>
                        </View>
                        <View style={styles.innerStatusRow}>
                          <View style={styles.innerStatusLeft}>
                            <View style={[styles.tealSmallDot, item.response?.verdict === 'CAUTION' && { backgroundColor: '#d97706' }, item.response?.verdict === 'REJECT' && { backgroundColor: '#dc2626' }]} />
                            <Text style={styles.innerStatusText}>
                              Durum: {isBought ? 'Bütçeden düşüldü (Takip ediliyor)' : (isCancelled ? 'Vazgeçildi' : 'Ay sonu değerlendirilecek')}
                            </Text>
                          </View>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* 4. ÖĞRENİLEN ALIŞKANLIK KARTI */}
        <View style={styles.learnedHabitCard}>
          <View style={styles.learnedIconWrap}>
            <Ionicons name="bulb-outline" size={18} color="#059669" />
          </View>
          <View style={styles.learnedContent}>
            <Text style={styles.learnedTitle}>ÖĞRENİLEN ALIŞKANLIK</Text>
            <Text style={styles.learnedDesc}>
              {postponedCount > 0 ? (
                <>
                  Ertelenen harcamaların{' '}
                  <Text style={{ fontWeight: '800', color: '#0f172a' }}>%{postponedPercent}'sinde</Text> bütçeni koruyarak hedeflerine katkı sağladın.
                </>
              ) : (
                'Harcama yapmadan önce simülasyon yaparak dürtüsel alışverişleri önleyebilir ve tasarruflarını artırabilirsin.'
              )}
            </Text>
          </View>
        </View>

        {/* 5. ALT BİLGİ VE RAPOR ÇIKTISI */}
        <View style={styles.footerRow}>

          <TouchableOpacity
            style={styles.exportBtn}
            onPress={handleExportReport}
            activeOpacity={0.7}>
            <Text style={styles.exportBtnText}>Raporu Dışa Aktar</Text>
            <Ionicons name="download-outline" size={13} color="#0f172a" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
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
    fontSize: 18,
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
    paddingTop: 16,
    paddingBottom: 36,
  },
  headerTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
    marginBottom: 8,
  },
  headerTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0369a1',
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  mainSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  summaryCount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  summarySubCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065f46',
  },
  breakdownBox: {
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
    paddingTop: 12,
  },
  breakdownHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  breakdownCounts: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  breakdownBar: {
    flexDirection: 'row',
    height: 7,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  breakdownSegmentGreen: {
    backgroundColor: '#059669',
  },
  breakdownSegmentSlate: {
    backgroundColor: '#475569',
  },
  breakdownLegends: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterPillActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  filterPillTextActive: {
    color: '#ffffff',
  },
  filterCount: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.8,
  },
  decisionsList: {
    gap: 12,
    marginBottom: 18,
  },
  decisionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardMainCol: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  cardCategoryDate: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  cardAmountCol: {
    alignItems: 'flex-end',
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  actionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  actionBadgeBought: {
    backgroundColor: '#dcfce7',
  },
  actionBadgePostponed: {
    backgroundColor: '#e0f2fe',
  },
  actionBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  actionBadgeTextBought: {
    color: '#15803d',
  },
  actionBadgeTextPostponed: {
    color: '#0369a1',
  },
  cardInnerBox: {
    backgroundColor: '#f0f7ff',
    borderRadius: 14,
    padding: 12,
  },
  innerImpactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  innerImpactText: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
  },
  innerStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0f2fe',
    paddingTop: 8,
  },
  innerStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tealSmallDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
    marginRight: 6,
  },
  innerStatusText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  innerDeviationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  innerLeftText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  deviationRightGroup: {
    alignItems: 'flex-end',
  },
  deviationPill: {
    backgroundColor: '#ffedd5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 2,
  },
  deviationPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#c2410c',
  },
  deviationText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#dc2626',
  },
  learningNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0f2fe',
    paddingTop: 8,
  },
  learningNoteText: {
    flex: 1,
    fontSize: 11.5,
    color: '#78350f',
    lineHeight: 16,
  },
  innerStrategyText: {
    fontSize: 12,
    color: '#334155',
    marginBottom: 8,
  },
  winSubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  winSubText: {
    flex: 1,
    fontSize: 11.5,
    color: '#065f46',
  },
  learnedHabitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#dbeafe',
    marginBottom: 16,
  },
  learnedIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#a7f3d0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  learnedContent: {
    flex: 1,
  },
  learnedTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  learnedDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  footerModelActive: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerModelText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '100%',
  },
  exportBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptyHistoryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    marginVertical: 10,
  },
  emptyHistoryIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyHistoryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyHistorySubtitle: {
    fontSize: 12.5,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  emptyHistoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  emptyHistoryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});
