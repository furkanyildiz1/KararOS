import {
    CreateDecisionRequest,
    DecisionEvaluationResponse,
    DecisionRecordResponse,
    EvaluateDecisionRequest,
    UpdateDecisionActionRequest
} from '@/types/api';
import { apiClient } from '../api-client';

export const DecisionApiService = {
    /**
     * Karar motoru simülasyonu (Veritabanına yazmaz, anlık skor ve etki döner)
     */
    async evaluate(data: EvaluateDecisionRequest): Promise<DecisionEvaluationResponse> {
        return await apiClient.request<DecisionEvaluationResponse>('/decisions/evaluate', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Kararı veritabanına kaydeder
     */
    async create(data: CreateDecisionRequest): Promise<DecisionRecordResponse> {
        return await apiClient.request<DecisionRecordResponse>('/decisions', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Geçmiş kararları listeler
     */
    async getAll(): Promise<DecisionRecordResponse[]> {
        return await apiClient.request<DecisionRecordResponse[]>('/decisions', {
            method: 'GET',
        });
    },

    /**
     * Karar için aksiyonu günceller (Bought / Postponed / Cancelled)
     */
    async updateAction(id: string, data: UpdateDecisionActionRequest): Promise<DecisionRecordResponse> {
        return await apiClient.request<DecisionRecordResponse>(`/decisions/${id}/action`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }
};
