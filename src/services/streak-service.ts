import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalyticsService } from './analytics-service';
import { StreakApiService } from './api/streak-api';

const STREAK_KEY_PREFIX = '@kararos_user_streak_v2';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  isActiveToday: boolean;
}

function getTodayStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseLocalDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;
  return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
}

function getDayDifference(dateStr1: string, dateStr2: string): number {
  const d1 = parseLocalDate(dateStr1);
  const d2 = parseLocalDate(dateStr2);
  if (!d1 || !d2) return 999;
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Kullanıcıya özgü AsyncStorage anahtarını döndürür.
 */
async function getStreakKey(userEmail?: string): Promise<string> {
  if (userEmail) {
    return `${STREAK_KEY_PREFIX}_${userEmail.trim().toLowerCase()}`;
  }
  try {
    const { StorageService } = await import('./storage-service');
    const session = await StorageService.getAuthSession();
    if (session.email) {
      return `${STREAK_KEY_PREFIX}_${session.email.trim().toLowerCase()}`;
    }
  } catch {
    // ignore
  }
  return `${STREAK_KEY_PREFIX}_default`;
}

export const StreakService = {
  /**
   * Güncel seri (streak) verilerini getirir.
   * Önce Backend API'den kullanıcıya ait veritabanı kaydını çeker.
   * Çekilen veriyi AsyncStorage'a da sync eder.
   * Backend erişilemezse (offline vb.) AsyncStorage'dan fallback sağlar.
   */
  async getStreak(userEmail?: string): Promise<StreakData> {
    const key = await getStreakKey(userEmail);

    // 1. Önce Backend API'den almayı dene
    try {
      const serverData = await StreakApiService.getStreak();
      const streakData: StreakData = {
        currentStreak: serverData.currentStreak,
        longestStreak: serverData.longestStreak,
        lastActiveDate: serverData.lastActiveDate || '',
        isActiveToday: serverData.isActiveToday,
      };

      // Local storage'a da senkronize et
      await AsyncStorage.setItem(key, JSON.stringify(streakData));
      return streakData;
    } catch {
      // Backend çağrısı başarısız olursa (örneğin internet yoksa veya token henüz yoksa) local fallback'e geç
    }

    // 2. Local fallback
    try {
      const stored = await AsyncStorage.getItem(key);
      if (!stored) {
        return {
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: '',
          isActiveToday: false,
        };
      }

      const data: StreakData = JSON.parse(stored);
      const today = getTodayStr();
      const isActiveToday = data.lastActiveDate === today;

      let effectiveCurrentStreak = data.currentStreak;
      if (!isActiveToday && data.lastActiveDate) {
        const daysDiff = getDayDifference(data.lastActiveDate, today);
        if (daysDiff > 1) {
          effectiveCurrentStreak = 0;
        }
      }

      return {
        currentStreak: effectiveCurrentStreak,
        longestStreak: Math.max(data.longestStreak || 0, effectiveCurrentStreak),
        lastActiveDate: data.lastActiveDate,
        isActiveToday,
      };
    } catch {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: '',
        isActiveToday: false,
      };
    }
  },

  /**
   * Kullanıcı bir karar simüle ettiğinde veya karar aldığında seriyi kaydeder.
   * Önce Backend API'ye gönderip veritabanına yazar.
   * Dönen veriyi AsyncStorage'a yazar.
   */
  async recordActivity(userEmail?: string): Promise<StreakData> {
    const key = await getStreakKey(userEmail);

    // 1. Backend API'ye kaydetmeyi dene
    try {
      const serverData = await StreakApiService.recordActivity();
      const streakData: StreakData = {
        currentStreak: serverData.currentStreak,
        longestStreak: serverData.longestStreak,
        lastActiveDate: serverData.lastActiveDate || getTodayStr(),
        isActiveToday: serverData.isActiveToday,
      };

      // Local storage'ı da güncelle
      await AsyncStorage.setItem(key, JSON.stringify(streakData));

      // Telemetri event'i gönder
      await AnalyticsService.track('retention_streak_updated', {
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
      });

      return streakData;
    } catch {
      // Offline fallback
    }

    // 2. Offline / Local fallback işlemi
    try {
      const current = await this.getStreak(userEmail);
      const today = getTodayStr();

      if (current.lastActiveDate === today) {
        return { ...current, isActiveToday: true };
      }

      let newStreak = 1;
      if (current.lastActiveDate) {
        const daysDiff = getDayDifference(current.lastActiveDate, today);
        if (daysDiff === 1) {
          newStreak = current.currentStreak + 1;
        } else if (daysDiff === 0) {
          newStreak = current.currentStreak;
        } else {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      const newLongest = Math.max(current.longestStreak, newStreak);

      const updated: StreakData = {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastActiveDate: today,
        isActiveToday: true,
      };

      await AsyncStorage.setItem(key, JSON.stringify(updated));

      await AnalyticsService.track('retention_streak_updated', {
        currentStreak: newStreak,
        longestStreak: newLongest,
      });

      return updated;
    } catch {
      return {
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: getTodayStr(),
        isActiveToday: true,
      };
    }
  },
};
