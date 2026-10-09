import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { fetchProducts, Product } from '@services/productApi';
import { useCartStore } from '@stores/cartStore';
import { COLORS } from '@constants/theme';
import { STUDENT, PRICE_MULTIPLIER } from '@constants/student';

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

export default function DetailScreen() {
  const route = useRoute<any>();
  const { id } = route.params || {};

  const addToCart = useCartStore(state => state.addToCart);

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const product = products.find((p: Product) => String(p.id) === String(id));

  const handleAddToCart = () => {
    if (!product) return;

    // 1. Kích hoạt Haptic safe-check (Biến thể selection)
    try {
      if (
        ReactNativeHapticFeedback &&
        typeof ReactNativeHapticFeedback.trigger === 'function'
      ) {
        ReactNativeHapticFeedback.trigger('selection', hapticOptions);
      }
    } catch {
      // Bỏ qua lỗi nếu máy ảo không hỗ trợ Rung
    }

    // 2. Thêm vào giỏ hàng
    if (typeof addToCart === 'function') {
      addToCart(product);
    } else if (useCartStore.getState()?.addToCart) {
      useCartStore.getState().addToCart(product);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải chi tiết món...</Text>
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.errorMssv}>{STUDENT.mssv}</Text>
        <Text style={styles.errorText}>Không tìm thấy sản phẩm!</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Bố cục dạng Card đúng chuẩn Biến thể */}
      <View style={styles.card}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <Text style={styles.subText}>Giao nội khu · nhận tận phòng</Text>

        <Text style={styles.description} numberOfLines={3}>
          {product.description}
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addBtn}
          onPress={handleAddToCart}
        >
          <Text style={styles.addBtnText}>Thêm vào giỏ · Haptic</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textLight,
    fontSize: 14,
  },
  errorMssv: {
    color: COLORS.error,
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: COLORS.text,
    fontSize: 15,
    marginVertical: 8,
  },
  retryBtn: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: COLORS.surface,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 240,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  subText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  addBtnText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
