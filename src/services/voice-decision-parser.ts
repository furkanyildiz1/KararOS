//burada akıllı türkçe ayrıştırıcıyı kurucaz 

//tutar tespiti kategori ve başlık seçici

import { ExpenseCategory } from "@/types/budget";

export interface ParsedVoiceDecision {
    rawText: string;
    title: string;
    amount: number;
    category: ExpenseCategory;
    confidence: number;
}

//anahtar kleime araması

const CATEGORY_KEYWORDS: Record<ExpenseCategory, string[]> = {
    'Elektronik': [
        'kulaklık', 'telefon', 'bilgisayar', 'laptop', 'tablet', 'ekran', 'monitör',
        'klavye', 'mouse', 'fare', 'şarj', 'powerbank', 'saat', 'akıllı saat', 'airpods',
        'playstation', 'ps5', 'xbox', 'konsol', 'hoparlör', 'kamera', 'televizyon', 'tv', 'elektronik'
    ],
    'Giyim & Moda': [
        'mont', 'kaban', 'ceket', 'ayakkabı', 'sneaker', 'bot', 'çizme', 'pantolon',
        'kot', 'jean', 'tişört', 'tshirt', 'gömlek', 'elbise', 'etek', 'kazak', 'hırka',
        'çanta', 'cüzdan', 'kemer', 'gözlük', 'güneş gözlüğü', 'atkı', 'bere', 'giyim', 'kıyafet'
    ],
    'Yeme & İçme': [
        'yemek', 'restoran', 'kafe', 'kahve', 'starbucks', 'akşam yemeği', 'öğle yemeği',
        'kahvaltı', 'dışarıda yemek', 'market', 'sipariş', 'burger', 'pizza', 'tatlı'
    ],
    'Sağlık & Güzellik': [
        'eczane', 'ilaç', 'vitamin', 'diş', 'doktor', 'hastane', 'kuaför', 'berber',
        'bakım', 'cilt bakımı', 'parfüm', 'makyaj', 'spor salonu', 'fitness', 'sağlık'
    ],
    'Ev & Yaşam': [
        'mobilya', 'koltuk', 'masa', 'sandalye', 'yatak', 'dolap', 'halı', 'perde',
        'süpürge', 'robot süpürge', 'ütü', 'lamba', 'dekorasyon', 'mutfak', 'ev'
    ],
    'Hobi & Eğlence': [
        'kitap', 'oyun', 'sinema', 'tiyatro', 'konser', 'etkinlik', 'kurs', 'enstrüman',
        'gitar', 'lego', 'kamp', 'hobi'
    ],
    'Ulaşım': [
        'uçak', 'uçak bileti', 'bilet', 'otobüs', 'tren', 'taksi', 'uber', 'benzin',
        'yakıt', 'mazot', 'araç', 'araba', 'bakım', 'otopark', 'ulaşım', 'seyahat', 'tatil', 'otel'
    ],
    'Eğitim': [
        'kurs', 'eğitim', 'sertifika', 'kitap', 'okul', 'üniversite', 'ders', 'seminer'
    ],
    'Diğer': []
};

//türkçe sayı kelimeleri değer tablou oluşturma

const WORD_NUMBERS: Record<string, number> = {
    'bir': 1, 'iki': 2, 'üç': 3, 'dört': 4, 'beş': 5,
    'altı': 6, 'yedi': 7, 'sekiz': 8, 'dokuz': 9, 'on': 10,
    'yirmi': 20, 'otuz': 30, 'kırk': 40, 'elli': 50,
    'altmış': 60, 'yetmiş': 70, 'seksen': 80, 'doksan': 90,
    'yüz': 100, 'bin': 1000, 'milyon': 1000000
};

//cümleden tutarı çıakrıcaz

function extractAmount(text: string): number {
    const clean = text.toLowerCase();

    //doğrudan rakam arayabilriz
    const digitMatch = clean.match(/(\d+[\d.,]*)\s*(?:tl|₺|lira|liraya|bin)?/i);
    if (digitMatch && digitMatch[1]) {
        let numStr = digitMatch[1].replace(/\./g, '').replace(/,/g, '.');
        let val = parseFloat(numStr);
        if (!isNaN(val) && val > 0) {
            // 3 bin gibi oluşum
            if (clean.includes(`${digitMatch[1]} bin`) || clean.includes(`${digitMatch[1]}bin`)) {
                val = val * 1000;
            }
            return Math.round(val);
        }

    }

    // 2. Yazıyla sayı arama (örn: "iki bin beş yüz", "üç bin", "beş yüz")
    const words = clean.split(/\s+/);
    let total = 0;
    let current = 0;
    let foundNumberWord = false;
    for (const w of words) {
        const cleanWord = w.replace(/[^a-zçğıöşü]/g, '');
        if (WORD_NUMBERS[cleanWord] !== undefined) {
            foundNumberWord = true;
            const n = WORD_NUMBERS[cleanWord];
            if (n === 1000 || n === 1000000) {
                total += (current === 0 ? 1 : current) * n;
                current = 0;
            } else if (n === 100) {
                current = (current === 0 ? 1 : current) * 100;
            } else {
                current += n;
            }
        }
    }
    total += current;
    return foundNumberWord && total > 0 ? total : 0;
}
// Cümleden Kategori Çıkarma Fonksiyonu
function detectCategory(text: string): ExpenseCategory {
    const lower = text.toLowerCase();
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        for (const kw of keywords) {
            if (lower.includes(kw)) {
                return category as ExpenseCategory;
            }
        }
    }
    return 'Diğer';
}
// Cümleden Temiz Ürün Başlığı Çıkarma
function extractCleanTitle(text: string, detectedAmount: number): string {
    let clean = text;
    // Dolgu kelimeleri temizle
    const stopWords = [
        'almayı düşünüyorum', 'almayı planlıyorum', 'almak istiyorum', 'alacağım', 'alacam',
        'harcaması yapacağım', 'harcamak istiyorum', 'satın alacağım', 'alıyorum', 'harcayacağım',
        'fiyatı', 'fiyatında', 'tutarında', 'değerinde', 'ücretinde', 'liraya', 'lira', 'tl', '₺',
        'yeni bir', 'yeni', 'bir', 'tane', 'adet', 'için', 'diye'
    ];
    // Rakamları temizle
    clean = clean.replace(new RegExp(`\\b${detectedAmount}\\b`, 'g'), '');
    clean = clean.replace(/\b\d+[\d.,]*\b/g, '');
    // Yazıyla geçen sayıları temizle
    Object.keys(WORD_NUMBERS).forEach((wn) => {
        clean = clean.replace(new RegExp(`\\b${wn}\\b`, 'gi'), '');
    });
    // Dolgu kelimeleri temizle
    stopWords.forEach((sw) => {
        clean = clean.replace(new RegExp(sw, 'gi'), '');
    });
    // Noktalama ve boşlukları temizle
    clean = clean.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').trim().replace(/\s+/g, ' ');
    if (!clean || clean.length < 2) {
        return 'Planlanan Harcama';
    }
    // Her kelimenin baş harfini büyük yap (Title Case)
    return clean
        .split(' ')
        .map((word) => word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1).toLocaleLowerCase('tr-TR'))
        .join(' ');
}
// Ana Ayrıştırıcı Fonksiyon
export function parseVoiceDecision(spokenText: string): ParsedVoiceDecision {
    const raw = (spokenText || '').trim();
    if (!raw) {
        return {
            rawText: '',
            title: 'Yeni Harcama Kararı',
            amount: 0,
            category: 'Diğer',
            confidence: 0,
        };
    }
    const amount = extractAmount(raw);
    const category = detectCategory(raw);
    const title = extractCleanTitle(raw, amount);
    // Güven skoru hesaplama
    let confidence = 0.5;
    if (amount > 0) confidence += 0.3;
    if (category !== 'Diğer') confidence += 0.2;
    return {
        rawText: raw,
        title,
        amount,
        category,
        confidence: Math.min(1, confidence),
    };


}