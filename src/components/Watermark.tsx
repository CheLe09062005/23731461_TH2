import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { STUDENT, examStamp, VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';

export default function Watermark() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 12);
  const tabBarHeight = 56 + bottomInset;

  const dynamicStyle = useMemo(
    () => [
      styles.container,
      VARIANT.watermarkAtTop ? { top: insets.top } : { bottom: tabBarHeight },
    ],
    [insets.top, tabBarHeight],
  );

  const stampText = `TH2 · ${STUDENT.mssv} · ${
    STUDENT.hoTen
  } · #${examStamp()}`;

  return (
    <View style={dynamicStyle} pointerEvents="none">
      <Text style={styles.text} numberOfLines={1} adjustsFontSizeToFit>
        {stampText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(219, 234, 254, 0.95)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    elevation: 5,
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    width: '100%',
  },
});
