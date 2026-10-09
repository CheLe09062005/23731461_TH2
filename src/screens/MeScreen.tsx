import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ScrollView,
} from 'react-native';
import { useCampusLocation } from '@hooks/useCampusLocation';
import { useLocationStore } from '@stores/locationStore';
import { useAuthStore } from '@stores/authStore';
import { STUDENT } from '@constants/student';
import { COLORS } from '@constants/theme';

const formatPrice = (price: number) => {
  return `${Math.round(price)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ`;
};

export default function MeScreen() {
  const campusLocation = useCampusLocation() as any;
  const locationStore = useLocationStore() as any;
  const logout = useAuthStore(state => state.logout);

  const permissionStatus =
    campusLocation.permissionStatus ??
    locationStore.permissionStatus ??
    locationStore.status ??
    'granted';

  const distanceKm =
    campusLocation.distanceKm ??
    campusLocation.distance ??
    locationStore.distanceKm ??
    locationStore.distance ??
    null;

  const shippingFee =
    campusLocation.shippingFee ??
    campusLocation.fee ??
    locationStore.shippingFee ??
    locationStore.fee ??
    null;

  const getLocationAndCalculate =
    campusLocation.getLocationAndCalculate ||
    campusLocation.getLocation ||
    locationStore.getLocation ||
    (() => {});

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Thông tin sinh viên */}
      <View style={styles.userSection}>
        <Text style={styles.userName}>{STUDENT.hoTen}</Text>
        <Text style={styles.userSub}>{STUDENT.mssv} · #093856</Text>
      </View>

      {/* Card trạng thái Vị trí & Phí ship */}
      <View style={styles.locationCard}>
        <Text style={styles.statusLabel}>
          Quyền:{' '}
          <Text
            style={
              permissionStatus === 'granted'
                ? styles.statusGranted
                : styles.statusDenied
            }
          >
            {permissionStatus}
          </Text>
        </Text>

        {distanceKm !== null ? (
          <Text style={styles.distanceText}>
            ≈{' '}
            {typeof distanceKm === 'number'
              ? distanceKm.toFixed(1)
              : distanceKm}{' '}
            km tới cổng KTX
          </Text>
        ) : (
          <Text style={styles.distanceText}>Chưa xác định vị trí KTX</Text>
        )}

        <Text style={styles.feeLabel}>Phí ship ước tính</Text>
        <Text style={styles.feeValue}>
          {shippingFee !== null ? formatPrice(shippingFee) : '-- đ'}
        </Text>
      </View>

      {/* Các nút thao tác */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={getLocationAndCalculate}
        >
          <Text style={styles.primaryBtnText}>Lấy vị trí ước tính ship</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={handleOpenSettings}
        >
          <Text style={styles.outlineBtnText}>Mở Cài đặt (blocked)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dangerBtn} onPress={logout}>
          <Text style={styles.dangerBtnText}>Đăng xuất</Text>
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
    alignItems: 'center',
  },
  userSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  userSub: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  locationCard: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    marginVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statusLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statusGranted: {
    color: '#16A34A',
  },
  statusDenied: {
    color: '#DC2626',
  },
  distanceText: {
    fontSize: 14,
    color: '#1E3A8A',
    marginTop: 6,
  },
  feeLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 12,
  },
  feeValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F97316',
    marginTop: 2,
  },
  buttonSection: {
    width: '100%',
    marginTop: 8,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryBtnText: {
    color: COLORS.surface,
    fontSize: 15,
    fontWeight: 'bold',
  },
  outlineBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  outlineBtnText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  dangerBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  dangerBtnText: {
    color: COLORS.surface,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
