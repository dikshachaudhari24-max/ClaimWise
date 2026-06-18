import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../theme';

// [inactiveIcon, activeIcon]
const icons = {
  Home: ['home-outline', 'home'],
  Invoice: ['document-text-outline', 'document-text'],
  GSTR2B: ['stats-chart-outline', 'stats-chart'],
  Tasks: ['checkmark-circle-outline', 'checkmark-circle'],
  Voice: ['mic-outline', 'mic'],
};

export const FloatingTabBar = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { bottom: insets.bottom + 20 }]} pointerEvents="box-none">
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const [inactive, active] = icons[route.name] || ['ellipse-outline', 'ellipse'];

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.tab} activeOpacity={0.8}>
              <View style={[styles.iconWrap, focused && styles.activeWrap]}>
                <Ionicons name={focused ? active : inactive} size={22} color={focused ? colors.primary : '#fff'} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.navBg,
    borderRadius: radius.pill,
    height: 64,
    paddingHorizontal: 8,
    ...shadow.nav,
  },
  tab: { width: 56, alignItems: 'center', justifyContent: 'center' },
  iconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  activeWrap: { backgroundColor: colors.hero },
});
