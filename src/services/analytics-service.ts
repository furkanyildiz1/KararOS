import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const ANALYTICS_EVENTS_KEY = '@kararos_analytics_events';
const ANALYTICS_CONSENT_KEY = '@kararos_analytics_consent';
const MAX_LOCAL_EVENTS = 150;

export type AnalyticsEventType =
  | 'session_start'
  | 'session_end'
  | 'screen_view'
  | 'auth_login'
  | 'auth_register'
  | 'budget_setup_completed'
  | 'decision_started'
  | 'decision_completed'
  | 'widget_clicked'
  | 'notification_scheduled'
  | 'retention_streak_updated';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  properties?: Record<string, any>;
  timestamp: string;
  platform: string;
}

export interface FunnelMetricsSummary {
  totalLogins: number;
  totalRegisters: number;
  budgetSetupsCompleted: number;
  decisionsStarted: number;
  decisionsCompleted: number;
  voiceDecisionsCount: number;
  manualDecisionsCount: number;
  voiceUsageRatio: number; // Yüzde 0-100
  widgetClicksCount: number;
}

class AnalyticsServiceClass {
  private isEnabled: boolean = true;
  private sessionStartTime: number = Date.now();
  private posthogClient: any = null; // Gelecekte eklenebilecek harici SDK köprüsü

  constructor() {
    this.initConsent();
  }

  private async initConsent() {
    try {
      const consent = await AsyncStorage.getItem(ANALYTICS_CONSENT_KEY);
      if (consent !== null) {
        this.isEnabled = consent === 'true';
      }
    } catch {
      this.isEnabled = true;
    }
  }

  /**
   * KVKK ve GDPR uyumu: Kullanıcı tercihi değiştiğinde çağrılır
   */
  async setAnalyticsConsent(enabled: boolean): Promise<void> {
    this.isEnabled = enabled;
    try {
      await AsyncStorage.setItem(ANALYTICS_CONSENT_KEY, enabled ? 'true' : 'false');
    } catch {}
  }

  async getAnalyticsConsent(): Promise<boolean> {
    return this.isEnabled;
  }

  /**
   * Ana Olay İzleme Metodu (Event Tracking)
   */
  async track(type: AnalyticsEventType, properties?: Record<string, any>): Promise<void> {
    if (!this.isEnabled) {
      return;
    }

    const event: AnalyticsEvent = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      properties,
      timestamp: new Date().toISOString(),
      platform: Platform.OS,
    };

    // 1. Konsola debug logu (development)
    if (__DEV__) {
      console.log(`📊 [Analytics] ${type}`, properties || '');
    }

    // 2. Harici servis köprüsü (PostHog / Mixpanel hazır kanca)
    if (this.posthogClient?.capture) {
      try {
        this.posthogClient.capture(type, properties);
      } catch (err) {
        console.warn('PostHog capture hatası:', err);
      }
    }

    // 3. Yerel Güvenli Telemetri Depolama (Son MAX_LOCAL_EVENTS olay)
    try {
      const stored = await AsyncStorage.getItem(ANALYTICS_EVENTS_KEY);
      const list: AnalyticsEvent[] = stored ? JSON.parse(stored) : [];
      list.push(event);

      if (list.length > MAX_LOCAL_EVENTS) {
        list.splice(0, list.length - MAX_LOCAL_EVENTS);
      }

      await AsyncStorage.setItem(ANALYTICS_EVENTS_KEY, JSON.stringify(list));
    } catch {
      // sessizce devam et
    }
  }

  /**
   * Ekran Görüntüleme Olayı
   */
  async trackScreen(screenName: string, additionalProps?: Record<string, any>): Promise<void> {
    await this.track('screen_view', { screenName, ...additionalProps });
  }

  /**
   * Oturum Başlatma ve Sonlandırma
   */
  startSession() {
    this.sessionStartTime = Date.now();
    this.track('session_start');
  }

  endSession() {
    const durationSeconds = Math.round((Date.now() - this.sessionStartTime) / 1000);
    this.track('session_end', { durationSeconds });
  }

  /**
   * Kaydedilmiş Yerel Olaylardan Funnel ve Metrik Özeti Çıkarma
   * (İnternet olmasa veya harici SDK olmasa bile uygulamanın kendi analizini sunmasını sağlar)
   */
  async getMetricsSummary(): Promise<FunnelMetricsSummary> {
    try {
      const stored = await AsyncStorage.getItem(ANALYTICS_EVENTS_KEY);
      const list: AnalyticsEvent[] = stored ? JSON.parse(stored) : [];

      let totalLogins = 0;
      let totalRegisters = 0;
      let budgetSetupsCompleted = 0;
      let decisionsStarted = 0;
      let decisionsCompleted = 0;
      let voiceDecisionsCount = 0;
      let manualDecisionsCount = 0;
      let widgetClicksCount = 0;

      for (const ev of list) {
        if (ev.type === 'auth_login') totalLogins++;
        if (ev.type === 'auth_register') totalRegisters++;
        if (ev.type === 'budget_setup_completed') budgetSetupsCompleted++;
        if (ev.type === 'decision_completed') decisionsCompleted++;
        if (ev.type === 'widget_clicked') widgetClicksCount++;

        if (ev.type === 'decision_started') {
          decisionsStarted++;
          if (ev.properties?.method === 'voice') {
            voiceDecisionsCount++;
          } else {
            manualDecisionsCount++;
          }
        }
      }

      const totalMethods = voiceDecisionsCount + manualDecisionsCount;
      const voiceUsageRatio = totalMethods > 0 ? Math.round((voiceDecisionsCount / totalMethods) * 100) : 0;

      return {
        totalLogins,
        totalRegisters,
        budgetSetupsCompleted,
        decisionsStarted,
        decisionsCompleted,
        voiceDecisionsCount,
        manualDecisionsCount,
        voiceUsageRatio,
        widgetClicksCount,
      };
    } catch {
      return {
        totalLogins: 0,
        totalRegisters: 0,
        budgetSetupsCompleted: 0,
        decisionsStarted: 0,
        decisionsCompleted: 0,
        voiceDecisionsCount: 0,
        manualDecisionsCount: 0,
        voiceUsageRatio: 0,
        widgetClicksCount: 0,
      };
    }
  }

  /**
   * Tüm yerel olay loglarını temizler (Veri Sıfırlama)
   */
  async clearLocalEvents(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ANALYTICS_EVENTS_KEY);
    } catch {}
  }
}

export const AnalyticsService = new AnalyticsServiceClass();
