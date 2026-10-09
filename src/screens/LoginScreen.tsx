import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuthStore } from '@stores/authStore';
import { COLORS } from '@constants/theme';
import { STUDENT, VARIANT, examStamp } from '@constants/student';

export default function LoginScreen() {
  const [inputValue, setInputValue] = useState('');
  const login = useAuthStore(state => state.login);

  const handleLogin = () => {
    if (!inputValue.trim()) {
      Alert.alert(
        'Lỗi',
        `Vui lòng nhập ${
          VARIANT.authField === 'phone' ? 'số điện thoại' : 'email'
        }`,
      );
      return;
    }
    // Token giả chuẩn định dạng đề thi: ktxgo-{mssv}-{stamp}
    const fakeToken = `ktxgo-${STUDENT.mssv}-${examStamp()}`;
    login(fakeToken);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Tiêu đề & Dòng phụ */}
        <Text style={styles.title}>KTXGO</Text>
        <Text style={styles.subtitle}>Giao đồ tận phòng ký túc xá</Text>

        {/* Ô nhập thông tin */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={
              VARIANT.authField === 'phone'
                ? 'Phone — 0901234567'
                : 'Email — 23731461@iuh.edu.vn'
            }
            placeholderTextColor={COLORS.textLight}
            keyboardType={
              VARIANT.authField === 'phone' ? 'phone-pad' : 'email-address'
            }
            value={inputValue}
            onChangeText={setInputValue}
          />
        </View>

        {/* Nút Vào cửa hàng */}
        <TouchableOpacity
          style={styles.btn}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>Vào cửa hàng</Text>
        </TouchableOpacity>

        {/* Dòng trạng thái Auth Stack */}
        <Text style={styles.authNote}>Auth Stack · chưa có token</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // #EFF6FF
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: COLORS.primary, // #1D4ED8
    marginBottom: 4,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 36,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    backgroundColor: COLORS.surface, // #FFFFFF
    borderWidth: 1,
    borderColor: COLORS.border, // #BFDBFE
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
  },
  btn: {
    width: '100%',
    backgroundColor: COLORS.primary, // #1D4ED8
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  btnText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  authNote: {
    fontSize: 12,
    color: COLORS.textLight,
  },
});
