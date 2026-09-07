import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

// Expo Go Android SDK 53+ da native notification modülü kaldırıldığı için kontrollü yükleme yapıyoruz
const isExpoGoAndroid =
    Platform.OS === 'android' &&
    (Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
        Constants.appOwnership === 'expo');

let Notifications: typeof import('expo-notifications') | null = null;

if (!isExpoGoAndroid && Platform.OS !== 'web') {
    try {
        Notifications = require('expo-notifications');
        Notifications?.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowBanner: true,
                shouldShowList: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            }),
        });
    } catch (err) {
        console.warn('Notifications modülü yüklenemedi:', err);
    }
}

/**
 * 1. Kullanıcıdan işletim sistemi bildirim izni ister
 */
export async function requestNotificationPermissions(): Promise<boolean> {
    if (!Notifications || isExpoGoAndroid || Platform.OS === 'web') {
        return false;
    }

    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return false;
        }

        // Android 8+ için bildirim kanalı zorunludur
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('kararos-decisions', {
                name: 'Karar Hatırlatıcıları',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#059669',
            });
        }

        return true;
    } catch {
        return false;
    }
}

/**
 * 2. Cihaza Kilit Ekranı Bildirim Alarmı Kurar (30 gün veya test için X saniye)
 * @param title Ürün başlığı
 * @param amount Tutar
 * @param delaySeconds Kaç saniye sonra çalacağı
 */
export async function scheduleDecisionReviewNotification(
    title: string,
    amount: string,
    delaySeconds: number = 30 * 24 * 60 * 60
): Promise<string | null> {
    if (!Notifications || isExpoGoAndroid || Platform.OS === 'web') {
        return null;
    }

    try {
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) {
            return null;
        }

        // İşletim sistemine zamanlanmış bildirimi kaydediyoruz
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: '30 Günlük Süre Doldu ⏳',
                body: `Ertelediğin "${title} (${amount})" için karar anı. Hala almak istiyor musun?`,
                data: {
                    route: '/(tabs)/history',
                    productTitle: title,
                    productAmount: amount,
                },
                sound: true,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: Math.max(1, delaySeconds),
            },
        });

        return notificationId;
    } catch {
        return null;
    }
}

/**
 * 3. Kullanıcı kararı erken tamamlarsa alarmı iptal eder
 */
export async function cancelScheduledDecisionNotification(notificationId: string) {
    if (!Notifications) return;
    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch {}
}
