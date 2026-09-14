import { BudgetProfileDto, UpsertBudgetProfileRequest } from '@/types/api';
import { apiClient } from '../api-client';

export const BudgetApiService = {
    async getBudget(): Promise<BudgetProfileDto> {
        return await apiClient.request<BudgetProfileDto>('/budget', {
            method: 'GET',
        });
    },

    async upsertBudget(data: UpsertBudgetProfileRequest): Promise<BudgetProfileDto> {
        return await apiClient.request<BudgetProfileDto>('/budget', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }
};
