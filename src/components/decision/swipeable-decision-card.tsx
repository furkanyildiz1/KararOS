import React, { useRef } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SwipeableDecisionCardProps {
  children: React.ReactNode;
  onPostpone: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

const SWIPE_THRESHOLD = 150; // İki buton için açılma genişliği

export const SwipeableDecisionCard: React.FC<SwipeableDecisionCardProps> = ({
  children,
  onPostpone,
  onDelete,
  disabled = false,
}) => {
  const pan = useRef(new Animated.Value(0)).current;
  const isOpen = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (disabled) return false;
        // Yalnızca belirgin yatay hareket olduğunda yakala (dikey kaydırmayı engelleme)
        return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderMove: (_, gestureState) => {
        // Yalnızca sola kaydırmaya izin ver (dx <= 0)
        let newX = gestureState.dx;
        if (isOpen.current) {
          newX -= SWIPE_THRESHOLD;
        }
        // Sağa fazla kaymayı engelle (en fazla 0) ve sola maksimum -170'e sınırla
        if (newX > 0) newX = 0;
        if (newX < -170) newX = -170;
        pan.setValue(newX);
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentPos = isOpen.current ? gestureState.dx - SWIPE_THRESHOLD : gestureState.dx;
        // Eğer -60'tan fazla sola çekildiyse menüyü aç
        if (currentPos < -60) {
          Animated.spring(pan, {
            toValue: -SWIPE_THRESHOLD,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
          isOpen.current = true;
        } else {
          // Kapat
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
          isOpen.current = false;
        }
      },
    })
  ).current;

  const closeMenu = () => {
    Animated.spring(pan, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
    isOpen.current = false;
  };

  const handlePostponePress = () => {
    closeMenu();
    onPostpone();
  };

  const handleDeletePress = () => {
    closeMenu();
    onDelete();
  };

  return (
    <View style={styles.container}>
      {/* Arkada açılan aksiyon alanı */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.postponeButton}
          onPress={handlePostponePress}
          activeOpacity={0.85}>
          <Ionicons name="refresh" size={18} color="#ffffff" />
          <Text style={styles.actionButtonText}>Ertele</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeletePress}
          activeOpacity={0.85}>
          <Ionicons name="trash-outline" size={18} color="#ffffff" />
          <Text style={styles.actionButtonText}>İptal Et</Text>
        </TouchableOpacity>
      </View>

      {/* Ön tarafta kaydırılan ana kart */}
      <Animated.View
        style={[
          styles.cardContent,
          {
            transform: [{ translateX: pan }],
          },
        ]}
        {...panResponder.panHandlers}>
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 20,
    marginBottom: 12,
  },
  actionContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: SWIPE_THRESHOLD,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    borderRadius: 20,
  },
  postponeButton: {
    flex: 1,
    backgroundColor: '#0284c7', // Mavi / Erteleme
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#dc2626', // Kırmızı / İptal-Sil
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  cardContent: {
    backgroundColor: 'transparent',
  },
});
