import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useCartStore, CartItem } from '@stores/cartStore';
import { useLocationStore } from '@stores/locationStore';
import { ROOM_LABEL, PRICE_MULTIPLIER } from '@constants/student';
import { COLORS } from '@constants/theme';

const MULTIPLIER = PRICE_MULTIPLIER || 25500;

const getItemPrice = (price: number) => {
  return price < 1000 ? price * MULTIPLIER : price;
};

const formatPrice = (price: number) => {
  const finalPrice = getItemPrice(price);
  return `${Math.round(finalPrice)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ`;
};

export default function CartScreen() {
  const items = useCartStore(state => state.items);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const updateQuantity = useCartStore(state => state.updateQuantity);

  const locationStore = useLocationStore() as any;
  const shippingFee =
    locationStore.shippingFee ??
    locationStore.fee ??
    locationStore.shipFee ??
    null;

  const totalAmount = useMemo(() => {
    const itemsTotal = items.reduce(
      (sum, item) => sum + getItemPrice(item.price) * item.quantity,
      0,
    );
    return itemsTotal + (shippingFee || 0);
  }, [items, shippingFee]);

  const handleRemove = (id: number | string) => {
    removeFromCart(id);
  };

  const handleUpdateQty = (item: CartItem, delta: number) => {
    const newQty = item.quantity + delta;
    updateQuantity(item.id, newQty);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const itemTotal = getItemPrice(item.price) * item.quantity;
    return (
      <View style={styles.card}>
        <Image
          source={{ uri: item.image }}
          style={styles.itemImage}
          resizeMode="contain"
        />
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.itemSubText}>
            ×{item.quantity} {formatPrice(itemTotal)}
          </Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.qtyBtn}
              onPress={() => handleUpdateQty(item, -1)}
            >
              <Text style={styles.qtyBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{item.quantity}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.qtyBtn}
              onPress={() => handleUpdateQty(item, 1)}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.deleteSquareBtn}
          onPress={() => handleRemove(item.id)}
        >
          <Text style={styles.deleteIconText}>🗑</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <View style={styles.shippingBox}>
        <Text style={styles.addressTitle}>Giao đến {ROOM_LABEL}</Text>
        {shippingFee !== null ? (
          <Text style={styles.shippingFeeText}>
            Phí ship: {formatPrice(shippingFee)} (công thức B)
          </Text>
        ) : (
          <Text style={styles.noFeeText}>Chưa ước tính phí — mở tab Tôi</Text>
        )}
      </View>

      <Text style={styles.totalText}>
        Tổng hàng: {formatPrice(totalAmount)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Giỏ hàng đang trống 🛒</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => String(item.id)}
          renderItem={renderCartItem}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  listContent: {
    padding: 12,
    paddingBottom: 90,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  itemSubText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 4,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  qtyBtn: {
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  qtyValue: {
    marginHorizontal: 12,
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  deleteSquareBtn: {
    backgroundColor: '#EF4444',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteIconText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  footerContainer: {
    marginTop: 10,
  },
  shippingBox: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: '#F97316',
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
  },
  addressTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  shippingFeeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F97316',
    marginTop: 4,
  },
  noFeeText: {
    fontSize: 13,
    color: '#EF4444',
    marginTop: 4,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginVertical: 10,
  },
});
