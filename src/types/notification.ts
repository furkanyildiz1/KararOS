export type NotificationType =
    | 'DECISION_REVIEW' //otuz günlğük karar hatırlatması 
    | 'BUDGET_WARNING' //bütçe güvevenlik uyarısı
    | 'SAVINGS_GOAL'   //hedefe yaklaşma başarısı tarzı
    | 'SMART_INSIGHT'; //algoritmik alışkanlık sistemi içn içgörü olucak

export interface InAppNotification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string; //"on dkka önce gibi"
    isRead: boolean;
    actionText?: string; //kararı incele -> gibi
    actionRoute?: string;//route işlemi
}