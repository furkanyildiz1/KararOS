import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavingsGoalItem } from '@/types/budget';

const ACCESS_TOKEN_KEY = '@kararos_access_token';
const REFRESH_TOKEN_KEY = '@kararos_refresh_token';
const USER_EMAIL_KEY = '@kararos_user_email';
const USER_NAME_KEY = '@kararos_user_name';
const USER_JOIN_DATE_KEY = '@kararos_user_join_date';
const REMEMBER_ME_KEY = '@kararos_remember_me';
const ONBOARDING_COMPLETED_KEY = '@kararos_onboarding_completed';
const SAVINGS_GOALS_KEY = '@kararos_savings_goals';

export interface UserProfileData {
    fullName: string;
    email: string;
    joinDate: string; // ISO String
}

export const StorageService = {
    // 1. Access & Refresh Token Yönetimi (API Client İçin)
    async saveAccessToken(token: string): Promise<void> {
        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
    },

    async getAccessToken(): Promise<string | null> {
        return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    },

    async saveRefreshToken(token: string): Promise<void> {
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
    },

    async getRefreshToken(): Promise<string | null> {
        return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    },

    async clearAuth(): Promise<void> {
        const keysToRemove = [
            ACCESS_TOKEN_KEY,
            REFRESH_TOKEN_KEY,
            REMEMBER_ME_KEY,
        ];
        await AsyncStorage.multiRemove(keysToRemove);
    },

    // Kullanıcı hesabını ve tüm verilerini kalıcı olarak silmek istediğinde çağrılır
    async deleteUserData(email?: string): Promise<void> {
        const session = await this.getAuthSession();
        const userEmail = email?.trim().toLowerCase() || session.email?.trim().toLowerCase();
        const keysToRemove = [
            ACCESS_TOKEN_KEY,
            REFRESH_TOKEN_KEY,
            USER_EMAIL_KEY,
            USER_NAME_KEY,
            REMEMBER_ME_KEY,
            USER_JOIN_DATE_KEY,
            SAVINGS_GOALS_KEY,
            `${SAVINGS_GOALS_KEY}_default`,
            `${SAVINGS_GOALS_KEY}_undefined`,
        ];
        if (userEmail) {
            keysToRemove.push(`${SAVINGS_GOALS_KEY}_${userEmail}`);
        }
        await AsyncStorage.multiRemove(keysToRemove);
    },

    // 2. Onboarding Durumu
    async isOnboardingCompleted(): Promise<boolean> {
        const val = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
        return val === 'true';
    },

    async hasSeenOnboarding(): Promise<boolean> {
        return await this.isOnboardingCompleted();
    },

    async setOnboardingCompleted(): Promise<void> {
        await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    },

    // 3. Oturum Bilgisi & Kullanıcı Profili
    async saveAuthSession(token: string, email: string, rememberMe: boolean, fullName?: string): Promise<void> {
        const items: [string, string][] = [
            [ACCESS_TOKEN_KEY, token],
            [USER_EMAIL_KEY, email],
        ];

        if (rememberMe) {
            items.push([REMEMBER_ME_KEY, 'true']);
        }

        if (fullName) {
            items.push([USER_NAME_KEY, fullName]);
        }

        // Kayıt tarihi henüz yoksa bugünü kaydet
        const existingJoinDate = await AsyncStorage.getItem(USER_JOIN_DATE_KEY);
        if (!existingJoinDate) {
            items.push([USER_JOIN_DATE_KEY, new Date().toISOString()]);
        }

        await AsyncStorage.multiSet(items);
        if (!rememberMe) {
            await AsyncStorage.removeItem(REMEMBER_ME_KEY);
        }
    },

    async getAuthSession(): Promise<{ token: string | null; email: string | null; rememberMe: boolean; fullName: string | null }> {
        const values = await AsyncStorage.multiGet([
            ACCESS_TOKEN_KEY,
            USER_EMAIL_KEY,
            REMEMBER_ME_KEY,
            USER_NAME_KEY,
        ]);
        const token = values[0][1];
        const email = values[1][1];
        const rememberMe = values[2][1] === 'true';
        const fullName = values[3][1];
        return { token, email, rememberMe, fullName };
    },

    async saveUserProfile(fullName: string, email: string): Promise<void> {
        await AsyncStorage.multiSet([
            [USER_NAME_KEY, fullName],
            [USER_EMAIL_KEY, email],
        ]);
    },

    async getUserProfile(): Promise<UserProfileData> {
        const values = await AsyncStorage.multiGet([
            USER_NAME_KEY,
            USER_EMAIL_KEY,
            USER_JOIN_DATE_KEY,
        ]);
        return {
            fullName: values[0][1] || 'Kullanıcı',
            email: values[1][1] || 'kullanici@kararos.app',
            joinDate: values[2][1] || new Date().toISOString(),
        };
    },

    // 4. Tasarruf Hedefleri Kalıcılığı (Kullanıcı Bazlı İzolasyon)
    async saveSavingsGoals(goals: SavingsGoalItem[], userEmail?: string): Promise<void> {
        let email = userEmail?.trim().toLowerCase();
        if (!email) {
            const session = await this.getAuthSession();
            email = session.email?.trim().toLowerCase();
        }
        if (!email) return;
        await AsyncStorage.setItem(`${SAVINGS_GOALS_KEY}_${email}`, JSON.stringify(goals));
    },

    async getSavingsGoals(userEmail?: string): Promise<SavingsGoalItem[]> {
        let email = userEmail?.trim().toLowerCase();
        if (!email) {
            const session = await this.getAuthSession();
            email = session.email?.trim().toLowerCase();
        }
        if (!email) return [];
        const data = await AsyncStorage.getItem(`${SAVINGS_GOALS_KEY}_${email}`);
        if (!data) return [];
        try {
            return JSON.parse(data);
        } catch {
            return [];
        }
    },

    async clearAuthSession(): Promise<void> {
        await this.clearAuth();
    },
};

