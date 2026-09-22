import { AuthResponse, LoginRequest, RegisterRequest } from '@/types/api';
import { apiClient } from '../api-client';
import { StorageService } from '../storage-service';

export const AuthApiService = {
    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await apiClient.request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        await StorageService.saveAccessToken(response.accessToken);
        await StorageService.saveRefreshToken(response.refreshToken);
        return response;
    },

    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await apiClient.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        await StorageService.saveAccessToken(response.accessToken);
        await StorageService.saveRefreshToken(response.refreshToken);
        return response;
    },

    async socialLogin(data: {
        provider: 'Google' | 'Apple';
        idToken?: string;
        email?: string;
        fullName?: string;
        providerUserId?: string;
    }): Promise<AuthResponse> {
        const response = await apiClient.request<AuthResponse>('/auth/social-login', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        await StorageService.saveAccessToken(response.accessToken);
        await StorageService.saveRefreshToken(response.refreshToken);
        return response;
    },

    async logout(): Promise<void> {
        const refreshToken = await StorageService.getRefreshToken();
        if (refreshToken) {
            await apiClient.request('/auth/revoke-token', {
                method: 'POST',
                body: JSON.stringify({ refreshToken }),
            }).catch(() => { });
        }
        await StorageService.clearAuth();
    },

    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        await apiClient.request('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword }),
        });
    },

    async deleteAccount(): Promise<void> {
        await apiClient.request('/auth/account', {
            method: 'DELETE',
        });
        await StorageService.clearAuth();
    },

    async sendVerificationCode(email: string): Promise<{ message: string }> {
        return await apiClient.request<{ message: string }>('/auth/send-verification-code', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    async verifyCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
        return await apiClient.request<{ success: boolean; message: string }>('/auth/verify-code', {
            method: 'POST',
            body: JSON.stringify({ email, code }),
        });
    }
};
