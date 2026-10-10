/**
 * Sentry Crash Monitoring Service
 *
 * Uygulama genelinde hata yakalama ve raporlama merkezi.
 * DSN değeri .env dosyasından okunur; tanımsızsa Sentry başlatılmaz.
 */

import Constants from 'expo-constants';

// Sentry lazy-import: paket yoksa (Expo Go ortamı) çökmemesi için
let SentryModule: typeof import('@sentry/react-native') | null = null;
try {
  SentryModule = require('@sentry/react-native');
} catch {
  // Expo Go veya web ortamı — Sentry atlanır
}

const DSN: string | undefined =
  (Constants.expoConfig?.extra as Record<string, unknown> | undefined)
    ?.sentryDsn as string | undefined;

let initialized = false;

/**
 * Sentry'yi başlat — uygulama entry point'inde (App/RootLayout) bir kez çağrılmalı.
 */
export function initSentry(): void {
  if (!SentryModule || !DSN) {
    if (__DEV__) {
      console.log('[Sentry] DSN bulunamadı veya paket yüklü değil — atlanıyor.');
    }
    return;
  }

  if (initialized) return;
  initialized = true;

  SentryModule.init({
    dsn: DSN,

    // Ortama göre environment etiketleri
    environment: __DEV__ ? 'development' : 'production',

    // Performans izleme: %100 dev, %20 prod
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,

    // Release ismi EAS build sırasında otomatik eklenir
    // Manuel override gerekiyorsa:
    // release: `com.kararos.app@${Constants.expoConfig?.version}`,

    // Kişisel veri filtreleme — KVKK uyumu
    beforeSend(event) {
      // Kullanıcı email/ip gibi hassas bilgileri temizle
      if (event.user) {
        delete event.user.email;
        delete event.user.ip_address;
      }
      return event;
    },

    // Debug modunda Sentry loglarını konsola yaz
    debug: __DEV__,
  });

  if (__DEV__) {
    console.log('[Sentry] Başlatıldı ✓');
  }
}

/**
 * Kullanıcı kimliğini Sentry'ye bildir (anonim ID kullan, email değil)
 */
export function identifySentryUser(userId: string): void {
  if (!SentryModule || !initialized) return;
  SentryModule.setUser({ id: userId });
}

/**
 * Kullanıcı çıkış yaptığında Sentry oturumunu temizle
 */
export function clearSentryUser(): void {
  if (!SentryModule || !initialized) return;
  SentryModule.setUser(null);
}

/**
 * Manuel hata raporlama — try/catch bloklarında kullan
 */
export function captureError(error: unknown, context?: Record<string, unknown>): void {
  if (!SentryModule || !initialized) {
    if (__DEV__) console.error('[Sentry] Hata yakalandı (raporlanmadı):', error);
    return;
  }

  if (context) {
    SentryModule.withScope((scope) => {
      scope.setExtras(context);
      SentryModule!.captureException(error);
    });
  } else {
    SentryModule.captureException(error);
  }
}

/**
 * Özel mesaj / uyarı raporlama
 */
export function captureMessage(
  message: string,
  level: 'debug' | 'info' | 'warning' | 'error' = 'info'
): void {
  if (!SentryModule || !initialized) return;
  SentryModule.captureMessage(message, level);
}

/**
 * Breadcrumb ekle — bir olaydan önce ne yapıldığını izlemek için
 */
export function addBreadcrumb(
  category: string,
  message: string,
  data?: Record<string, unknown>
): void {
  if (!SentryModule || !initialized) return;
  SentryModule.addBreadcrumb({ category, message, data, level: 'info' });
}
