import { StreakDto } from '@/types/api';
import { apiClient } from '../api-client';

export const StreakApiService = {
    async getStreak(): Promise<StreakDto> {
        return await apiClient.request<StreakDto>('/streak', {
            method: 'GET',
        });
    },

    async recordActivity(): Promise<StreakDto> {
        return await apiClient.request<StreakDto>('/streak/record', {
            method: 'POST',
        });
    }
};
