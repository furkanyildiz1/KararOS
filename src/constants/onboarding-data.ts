export interface FeatureItem {
    id: string;
    iconName: string; // Ionicons veya MaterialCommunityIcons adı
    iconFamily: 'ionicons' | 'material' | 'feather';
    title: string;
    description: string;
}

export interface OnboardingSlide {
    id: string;
    stepNumber: string; // "1 / 3"
    title: string;
    highlightedTitle?: string;
    description: string;
    features: FeatureItem[];
    buttonText: string;
}

export const ONBOARDING_DATA: OnboardingSlide[] = [
    {
        id: 'slide-1',
        stepNumber: '1 / 3',
        title: 'Harcamadan önce\netkisini gör.',
        description:
            'KararOS, bir alışveriş ya da harcama kararı vermeden önce bunun aylık bütçene ve tasarruf hedefine etkisini anlamanı sağlar.',
        buttonText: 'Devam',
        features: [
            {
                id: '1-1',
                iconFamily: 'ionicons',
                iconName: 'calendar-outline',
                title: 'Bütçene etkisini önceden gör',
                description: 'Bir harcamanın aylık planını nasıl etkileyeceğini önceden anla.',
            },
            {
                id: '1-2',
                iconFamily: 'material',
                iconName: 'target',
                title: 'Hedefinden ne kadar uzaklaşacağını bil',
                description: 'Tasarruf hedefine etkisini karar vermeden önce fark et.',
            },
            {
                id: '1-3',
                iconFamily: 'material',
                iconName: 'scale-balance',
                title: 'Alternatiflerini karşılaştır',
                description: 'Şimdi al, ertele ya da vazgeç seçeneklerini bilinçli değerlendir.',
            },
        ],
    },
    {
        id: 'slide-2',
        stepNumber: '2 / 3',
        title: 'Sor, seç, takip et.\nKararların senden öğrensin.',
        description:
            'KararOS, sadece harcamalarını göstermekle kalmaz. Verdiğin kararların sonucunu izler ve zamanla sana daha kişisel öneriler sunar.',
        buttonText: 'Devam',
        features: [
            {
                id: '2-1',
                iconFamily: 'ionicons',
                iconName: 'document-text-outline',
                title: 'Sadece rapor değil',
                description: 'Ne olduğunu değil, ne olacağını anlamana yardım eder.',
            },
            {
                id: '2-2',
                iconFamily: 'ionicons',
                iconName: 'person-outline',
                title: 'Davranışını tanır',
                description: 'Geçici harcamaları ve alışkanlıklarını ayırt etmeye başlar.',
            },
            {
                id: '2-3',
                iconFamily: 'material',
                iconName: 'bullseye-arrow',
                title: 'Karar odaklıdır',
                description: 'Bütçe uygulaması gibi değil, karar yardımcısı gibi çalışır.',
            },
        ],
    },
    {
        id: 'slide-3',
        stepNumber: '3 / 3',
        title: 'Daha iyi kararlar,\ndaha güçlü finansal gelecek.',
        description:
            'KararOS ile harcama kararlarını daha bilinçli ver, bütçeni koru ve tasarruf hedeflerine daha kontrollü ilerle.',
        buttonText: 'Başlayalım',
        features: [
            {
                id: '3-1',
                iconFamily: 'material',
                iconName: 'chart-pie',
                title: 'Bütçeni daha bilinçli yönet',
                description: 'Gelirini, giderini ve hedefini daha net gör.',
            },
            {
                id: '3-2',
                iconFamily: 'material',
                iconName: 'sprout-outline',
                title: 'Tasarruf hedeflerini sürdürülebilir hâle getir',
                description: 'Küçük kararların uzun vadeli etkisini fark et.',
            },
            {
                id: '3-3',
                iconFamily: 'ionicons',
                iconName: 'search-outline',
                title: 'Harcama alışkanlıklarını zaman içinde fark et',
                description: 'Nerede zorlandığını ve nerede güçlendiğini gör.',
            },
        ],
    },
];
