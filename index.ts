import 'expo-router/entry';
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandler } from './src/widgets/widget-task-handler';

// Android Widget Handler'ı uygulamanın en üst giriş noktasında kaydet
registerWidgetTaskHandler(widgetTaskHandler);
