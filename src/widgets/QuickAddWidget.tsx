import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export function QuickAddWidget() {
    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#070E1A',
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
            }}
            clickAction="OPEN_QUICK_ADD"
        >
            <FlexWidget
                style={{
                    backgroundColor: '#10b981',
                    borderRadius: 32,
                    height: 64,
                    width: 64,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                }}
            >
                <TextWidget
                    text="🎙️"
                    style={{
                        fontSize: 28,
                    }}
                />
            </FlexWidget>
            <TextWidget
                text="Hızlı Ekle"
                style={{
                    fontSize: 16,
                    color: '#ffffff',
                    fontWeight: 'bold',
                }}
            />
        </FlexWidget>
    );
}
