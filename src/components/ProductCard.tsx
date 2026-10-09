import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Product } from '@services/productApi';
import { useCartStore } from '@stores/cartStore';
import { COLORS } from '@constants/theme';
import { PRICE_MULTIPLIER } from '@constants/student';

interface ProductCardProps {
  item: Product;
  onPress: () => void;
}

const MULTIPLIER = PRICE_MULTIPLIER || 25500;

const formatPrice = (price: number) => {
  const finalPrice = price < 1000 ? price * MULTIPLIER : price;
  return `${Math.round(finalPrice)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ`;
};

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export default function ProductCard({ item, onPress }: ProductCardProps) {
  const addToCart = useCartStore(state => state.addToCart);

  const handleAdd = (e: any) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }

    // 1. Kích hoạt Haptic an toàn
    try {
      if (
        ReactNativeHapticFeedback &&
        typeof ReactNativeHapticFeedback.trigger === 'function'
      ) {
        ReactNativeHapticFeedback.trigger('selection', hapticOptions);
      }
    } catch {
      // Bỏ qua lỗi nếu máy ảo không hỗ trợ
    }

    // 2. Thêm vào giỏ
    if (typeof addToCart === 'function') {
      addToCart(item);
    } else if (useCartStore.getState()?.addToCart) {
      useCartStore.getState().addToCart(item);
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
      <View style={styles.bottomRow}>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.addBtn}
          onPress={handleAdd}
        >
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 10,
    margin: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  image: {
    width: '100%',
    height: 120,
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E3A8A',
    height: 36,
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F97316',
    flex: 1,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    color: COLORS.surface,
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 22,
  },
});
