//tavisye sonrası veya aldığındaki gerçek hayat senaroyus

namespace KararOS.Domain.Enums;

public enum DecisionAction
{
    Pending = 0, ///karar oluştu ama henüz seçişlmedi bekliyor
    Bought = 1, //saTIN Aldı
    Postponed = 2,//ertledi 
    Cancelled = 3 //vazgeçtii
}