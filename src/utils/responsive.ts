import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Figma / Standart tasarım baz genişliği ve yüksekliği (Örn: iPhone 14 / Pixel standardı ~390x844)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Genişliğe göre yatay ölçeklendirme (padding, margin, width vb.)
 */
export const scale = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Yüksekliğe göre dikey ölçeklendirme (height, minHeight, vertical padding vb.)
 */
export const verticalScale = (size: number): number => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * Metin boyutları ve ikonlar için kontrollü dinamik font ölçeklendirme.
 * Aşırı küçük veya aşırı devasa olmasını factor (0.5 varsayılan) ile dengeler.
 */
export const moderateScale = (size: number, factor = 0.5): number => {
  const scaled = size + (scale(size) - size) * factor;
  return Math.round(PixelRatio.roundToNearestPixel(scaled));
};

export const Screen = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_HEIGHT < 700 || SCREEN_WIDTH < 375,
  isMediumDevice: SCREEN_HEIGHT >= 700 && SCREEN_HEIGHT < 840,
  isLargeDevice: SCREEN_HEIGHT >= 840,
};
