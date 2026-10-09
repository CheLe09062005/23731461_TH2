import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { STUDENT, examStamp, VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Watermark() {
  const insets = useSafeAreaInsets();
  // Vị trí nằm DƯỚI (Bottom) vì variant = 1
  const positionStyle = VARIANT.watermarkAtTop
    ? { top: insets.top || 10 }
    : { bottom: insets.bottom + 55 };

  return (
    <View style={[styles.container, positionStyle]} pointerEvents="none">
      <Text style={styles.text}>
        TH2 · {STUDENT.mssv} · {STUDENT.hoTen} · #{examStamp()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(191, 219, 254, 0.85)',
    paddingVertical: 4,
    zIndex: 9999,
  },
  text: { fontSize: 10, color: COLORS.primary, fontWeight: 'bold' },
});
