import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export interface SocialAuthResult {
    provider: 'Google' | 'Apple';
    idToken?: string;
    email: string;
    fullName: string;
    providerUserId: string;
}

export const SocialAuthService = {
    /**
     * Apple Kimliği ile Girişin yerel olarak kullanılabilir olup olmadığını kontrol eder.
     */
    async isAppleAuthAvailable(): Promise<boolean> {
        if (Platform.OS !== 'ios') return false;
        try {
            return await AppleAuthentication.isAvailableAsync();
        } catch {
            return false;
        }
    },

    /**
     * Apple ile Yerel Giriş Yap (Native iOS Apple Authentication)
     */
    async signInWithAppleNative(): Promise<SocialAuthResult | null> {
        if (Platform.OS !== 'ios') {
            throw new Error('Apple ile Giriş yalnızca iOS cihazlarda kullanılabilir.');
        }

        const isAvailable = await AppleAuthentication.isAvailableAsync();
        if (!isAvailable) {
            return null;
        }

        const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
        });

        const givenName = credential.fullName?.givenName || '';
        const familyName = credential.fullName?.familyName || '';
        const fullName = `${givenName} ${familyName}`.trim() || 'Apple Kullanıcısı';
        const email = credential.email || `apple_${credential.user.substring(0, 10)}@privaterelay.appleid.com`;

        return {
            provider: 'Apple',
            idToken: credential.identityToken || undefined,
            email: email,
            fullName: fullName,
            providerUserId: credential.user,
        };
    },
};
