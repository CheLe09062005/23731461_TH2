import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchProducts, Product } from '@services/productApi';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import ProductCard from '@components/ProductCard';
import { COLORS } from '@constants/theme';
import {
  STUDENT,
  DEBOUNCE_MS,
  STALE_TIME_MS,
  ROOM_LABEL,
  BANNER_IMAGE_ID,
} from '@constants/student';
import { ShopStackParamList } from '@navigation/ShopStack';

const TypedFlashList = FlashList as React.ComponentType<any>;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, DEBOUNCE_MS);
  const navigation =
    useNavigation<NativeStackNavigationProp<ShopStackParamList>>();

  const {
    data: products = [],
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: STALE_TIME_MS,
  });

  const filteredProducts = useMemo(() => {
    if (!debouncedSearch.trim()) return products;
    return products.filter(p =>
      p.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [products, debouncedSearch]);

  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard
      item={item}
      onPress={() => navigation.navigate('Detail', { id: item.id.toString() })}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header KTXGO — Thêm insets.top để tránh tai thỏ / camera hole */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <Text style={styles.headerTitle}>KTXGO</Text>
        <Text style={styles.headerSub}>Giao tận {ROOM_LABEL}</Text>
      </View>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={{
            uri: `https://picsum.photos/id/${BANNER_IMAGE_ID}/800/240`,
          }}
          style={styles.banner}
        />
      </View>

      {/* Thanh Tìm Kiếm Debounce */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder={`Tìm món (debounce) — ${STUDENT.mssv}`}
          placeholderTextColor={COLORS.textLight}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Danh sách FlashList với Pull-to-refresh */}
      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải món...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorMssv}>{STUDENT.mssv}</Text>
          <Text style={styles.errorText}>Không tải được dữ liệu món.</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => {
              refetch();
            }}
          >
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TypedFlashList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item: Product) => `${STUDENT.mssv}-${item.id}`}
          estimatedItemSize={200}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => {
                refetch();
              }}
              colors={[COLORS.primary]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.surface },
  headerSub: { fontSize: 13, color: '#DBEAFE', marginTop: 2 },
  bannerContainer: { height: 110 },
  banner: { width: '100%', height: '100%' },
  searchBox: { padding: 12 },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  listContent: { paddingHorizontal: 6, paddingBottom: 80 },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: { marginTop: 12, color: COLORS.textLight, fontSize: 14 },
  errorMssv: { color: COLORS.error, fontSize: 18, fontWeight: 'bold' },
  errorText: { color: COLORS.text, fontSize: 15, marginVertical: 8 },
  retryBtn: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: COLORS.surface, fontWeight: 'bold' },
});
