import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { StorageService } from './storage-service';

// Geliştirme ortamında Mobil Cihaz / Emülatör / Web IP yönetimi
const getBaseUrl = (): string => {
    // Expo Go ile fiziksel cihazda çalışırken geliştirme makinesinin yerel Wi-Fi IP'sini al
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
        const ip = hostUri.split(':')[0];
        return `http://${ip}:5100/api`;
    }
    return Platform.select({
        android: 'http://10.0.2.2:5100/api',
        default: 'http://localhost:5100/api',
    });
};

const API_BASE_URL = getBaseUrl();
console.log(`[KararOS API] Base URL: ${API_BASE_URL}`);

class ApiClient {
    private static instance: ApiClient;
    private isRefreshing = false;

    private constructor() { }

    public static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = await StorageService.getAccessToken();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            let response = await fetch(url, {
                ...options,
                headers,
            });

            // Token süresi dolmuşsa (401), Refresh Token ile yenilemeyi dene
            if (response.status === 401 && !this.isRefreshing) {
                const refreshed = await this.tryRefreshToken();
                if (refreshed) {
                    const newToken = await StorageService.getAccessToken();
                    headers['Authorization'] = `Bearer ${newToken}`;
                    response = await fetch(url, {
                        ...options,
                        headers,
                    });
                }
            }

            if (!response.ok) {
                const errorBody = await response.json().catch(() => null);
                const errorMessage = errorBody?.detail || errorBody?.title || `HTTP Hatası: ${response.status}`;
                throw new Error(errorMessage);
            }

            if (response.status === 204) {
                return {} as T;
            }

            return await response.json();
        } catch (error: any) {
            // console.error React Native'de kırmızı LogBox açtığı için console.log kullanıyoruz
            if (__DEV__) {
                console.log(`[API] ${endpoint} -> ${error.message}`);
            }
            throw error;
        }
    }

    private async tryRefreshToken(): Promise<boolean> {
        this.isRefreshing = true;
        try {
            const refreshToken = await StorageService.getRefreshToken();
            if (!refreshToken) return false;

            const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                await StorageService.clearAuth();
                return false;
            }

            const data = await response.json();
            await StorageService.saveAccessToken(data.accessToken);
            await StorageService.saveRefreshToken(data.refreshToken);
            return true;
        } catch {
            return false;
        } finally {
            this.isRefreshing = false;
        }
    }
}

export const apiClient = ApiClient.getInstance();
