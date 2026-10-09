import React, { useMemo } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ShopStack from '@navigation/ShopStack';
import CartScreen from '@screens/CartScreen';
import MeScreen from '@screens/MeScreen';
import { useCartStore } from '@stores/cartStore';
import { COLORS } from '@constants/theme';
import { VARIANT } from '@constants/student';

export type MainTabsParamList = {
  ShopTab: undefined;
  CartTab: undefined;
  MeTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export default function MainTabs() {
  const insets = useSafeAreaInsets();
  const totalQuantity = useCartStore(state => state.totalQuantity());

  const bottomPadding = Math.max(insets.bottom, 12);
  const tabBarHeight = 56 + bottomPadding;

  const dynamicTabBarStyle = useMemo(
    () => [
      styles.tabBar,
      {
        height: tabBarHeight,
        paddingBottom: bottomPadding,
      },
    ],
    [tabBarHeight, bottomPadding],
  );

  const renderTabIcon = (routeName: string, focused: boolean) => {
    let icon = '🛍️';
    if (routeName === 'ShopTab') icon = '🛍️';
    else if (routeName === 'CartTab') icon = '🛒';
    else if (routeName === 'MeTab') icon = '👤';

    return (
      <Text
        style={[
          styles.tabIcon,
          focused ? styles.iconActive : styles.iconInactive,
        ]}
      >
        {icon}
      </Text>
    );
  };

  const ShopTabItem = (
    <Tab.Screen
      key="ShopTab"
      name="ShopTab"
      component={ShopStack}
      options={{ title: 'Cửa hàng', headerShown: false }}
    />
  );

  const CartTabItem = (
    <Tab.Screen
      key="CartTab"
      name="CartTab"
      component={CartScreen}
      options={{
        title: 'Giỏ',
        headerTitle: 'GIỎ HÀNG',
        headerTitleAlign: 'center',
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
      }}
    />
  );

  const MeTabItem = (
    <Tab.Screen
      key="MeTab"
      name="MeTab"
      component={MeScreen}
      options={{
        title: 'Tôi',
        headerTitle: 'TÔI · LOCATION',
        headerTitleAlign: 'center',
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
      }}
    />
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarIcon: ({ focused }) => renderTabIcon(route.name, focused),
        tabBarStyle: dynamicTabBarStyle,
      })}
    >
      {VARIANT.tabOrder === 'shopFirst' ? (
        <>
          {ShopTabItem}
          {CartTabItem}
          {MeTabItem}
        </>
      ) : (
        <>
          {CartTabItem}
          {ShopTabItem}
          {MeTabItem}
        </>
      )}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 18,
  },
  iconActive: {
    opacity: 1,
  },
  iconInactive: {
    opacity: 0.6,
  },
  header: {
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    color: COLORS.surface,
    fontWeight: 'bold',
    fontSize: 18,
  },
  tabBar: {
    paddingTop: 6,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
