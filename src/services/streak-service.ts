import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalyticsService } from './analytics-service';

const STREAK_KEY = '@kararos_user_streak';

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

function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
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

export const StreakService = {
  /**
   * Güncel seri (streak) verilerini getirir
   */
  async getStreak(): Promise<StreakData> {
    try {
      const stored = await AsyncStorage.getItem(STREAK_KEY);
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

      // Eğer son aktif günden bugüne 1 günden fazla geçmişse seri bozulmuştur
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
   * Kullanıcı bir karar simüle ettiğinde veya karar aldığında seriyi günceller
   */
  async recordActivity(): Promise<StreakData> {
    try {
      const current = await this.getStreak();
      const today = getTodayStr();

      // Zaten bugün puan almışsa mevcut durumu koru
      if (current.lastActiveDate === today) {
        return { ...current, isActiveToday: true };
      }

      let newStreak = 1;
      if (current.lastActiveDate) {
        const daysDiff = getDayDifference(current.lastActiveDate, today);
        if (daysDiff === 1) {
          // Tam dün aktifti -> ardışık gün, seriyi 1 artır
          newStreak = current.currentStreak + 1;
        } else if (daysDiff === 0) {
          newStreak = current.currentStreak;
        } else {
          // 1 günden fazla boşluk -> 1'den yeniden başla
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

      await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(updated));

      // Telemetri event'i gönder
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
