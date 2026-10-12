'use no memo';

import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export function QuickAddWidget() {
    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#070E1A',
                borderRadius: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingVertical: 10,
            }}
            clickAction="OPEN_QUICK_ADD"
        >
            {/* Sol taraf: KararOS marka ve açıklama metni */}
            <FlexWidget
                style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <TextWidget
                    text="KararOS"
                    style={{
                        fontSize: 16,
                        color: '#ffffff',
                        fontWeight: 'bold',
                    }}
                />
                <TextWidget
                    text="Sesli harcama ekle"
                    style={{
                        fontSize: 12,
                        color: '#94a3b8',
                    }}
                />
            </FlexWidget>

            {/* Sağ taraf: Yeşil yuvarlak ses ikonu */}
            <FlexWidget
                style={{
                    backgroundColor: '#10b981',
                    borderRadius: 24,
                    height: 44,
                    width: 44,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <TextWidget
                    text="🎙️"
                    style={{
                        fontSize: 22,
                    }}
                />
            </FlexWidget>
        </FlexWidget>
    );
}
