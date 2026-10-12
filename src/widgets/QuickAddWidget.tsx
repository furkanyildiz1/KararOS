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
                paddingHorizontal: 12,
                paddingVertical: 8,
            }}
            clickAction="OPEN_QUICK_ADD"
        >
            {/* Sol taraf: KararOS marka ve açıklama metni */}
            <FlexWidget
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginRight: 6,
                }}
            >
                <TextWidget
                    text="KararOS"
                    style={{
                        fontSize: 14,
                        color: '#ffffff',
                        fontWeight: 'bold',
                    }}
                />
                <TextWidget
                    text="Sesli harcama ekle"
                    style={{
                        fontSize: 10,
                        color: '#94a3b8',
                    }}
                />
            </FlexWidget>

            {/* Sağ taraf: Yeşil yuvarlak ses ikonu */}
            <FlexWidget
                style={{
                    backgroundColor: '#10b981',
                    borderRadius: 18,
                    height: 36,
                    width: 36,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <TextWidget
                    text="🎙️"
                    style={{
                        fontSize: 18,
                    }}
                />
            </FlexWidget>
        </FlexWidget>
    );
}
