import React from 'react';
import { WidgetTaskHandlerProps, WidgetTaskHandler } from 'react-native-android-widget';
import { QuickAddWidget } from './QuickAddWidget';
import { Linking } from 'react-native';

export const widgetTaskHandler: WidgetTaskHandler = async (props: WidgetTaskHandlerProps) => {
    switch (props.widgetAction) {
        case 'WIDGET_ADDED':
        case 'WIDGET_UPDATE':
        case 'WIDGET_RESIZED':
            props.renderWidget(<QuickAddWidget />);
            break;

        case 'WIDGET_CLICK':
            if (props.clickAction === 'OPEN_QUICK_ADD') {
                // Platform bağımsız derin bağlantı (deep link)
                Linking.openURL('kararos://quick-add?source=widget');
            }
            break;

        case 'WIDGET_DELETED':
            // Temizleme işlemleri (gerekirse)
            break;
    }
};
