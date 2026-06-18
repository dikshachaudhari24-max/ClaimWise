import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme';

/**
 * Layered-sheet scaffold: a Sky-Blue hero header with the white content sheet
 * pulled up over it (32px top corners). Highly configurable so every screen
 * shares the exact same header + sheet treatment.
 */
export const Screen = ({
  children,
  heroHeight = 170,
  wordmark = true,
  subtitle,                 // small line under the wordmark, inside the hero
  leftIcon,                 // Ionicons name (e.g. 'menu', 'arrow-back', 'close')
  onLeftPress,
  rightIcons = [],          // [{ name, onPress, badge }]
  heroExtra,                // custom node rendered in the hero below the top row
  heroRight,                // custom node on the right of the top row (e.g. globe)
  scroll = true,
  contentStyle,
  sheet = true,
  sheetTitle,               // ultra-bold title rendered at the top of the sheet
  handle = true,
}) => {
  const insets = useSafeAreaInsets();
  const Body = scroll ? ScrollView : View;
  const bodyProps = scroll
    ? { contentContainerStyle: [styles.sheetContent, contentStyle], showsVerticalScrollIndicator: false }
    : { style: [styles.sheetStatic, contentStyle] };

  return (
    <View style={styles.root}>
      <View style={[styles.hero, { paddingTop: insets.top + 14, height: heroHeight + insets.top }]}>
        <View style={styles.topRow}>
          <View style={styles.topLeft}>
            {leftIcon ? (
              <TouchableOpacity onPress={onLeftPress} hitSlop={hit} style={styles.iconBtn}>
                <Ionicons name={leftIcon} size={24} color={colors.primary} />
              </TouchableOpacity>
            ) : wordmark ? (
              <Text style={[typography.wordmark, styles.wordmark]}>Hisably</Text>
            ) : null}
          </View>
          <View style={styles.topRight}>
            {heroRight}
            {rightIcons.map((ic, i) => (
              <TouchableOpacity key={i} onPress={ic.onPress} hitSlop={hit} style={styles.iconBtn}>
                <Ionicons name={ic.name} size={22} color={colors.primary} />
                {ic.badge != null && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{ic.badge}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {subtitle ? <Text style={[typography.title, styles.subtitle]}>{subtitle}</Text> : null}
        {heroExtra}
      </View>

      {sheet ? (
        <View style={styles.sheet}>
          {handle && <View style={styles.handle} />}
          <Body {...bodyProps}>
            {sheetTitle ? <Text style={[typography.heroTitle, styles.sheetTitle]}>{sheetTitle}</Text> : null}
            {children}
          </Body>
        </View>
      ) : (
        children
      )}
    </View>
  );
};

const hit = { top: 10, bottom: 10, left: 10, right: 10 };

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.hero },
  hero: { paddingHorizontal: spacing.screenH },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topLeft: { flexDirection: 'row', alignItems: 'center' },
  topRight: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { marginLeft: 12, padding: 2 },
  wordmark: { color: colors.primary },
  subtitle: { color: colors.primary, opacity: 0.72, marginTop: 8 },
  badge: {
    position: 'absolute', top: -4, right: -6, minWidth: 16, height: 16, borderRadius: 8,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
  },
  badgeText: { color: '#fff', fontSize: 9, fontFamily: typography.caption.fontFamily },
  sheet: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    marginTop: -28,
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.outlineVariant, alignSelf: 'center', marginTop: 10 },
  sheetContent: { paddingHorizontal: spacing.screenH, paddingTop: spacing.sheetTop, paddingBottom: 120 },
  sheetStatic: { flex: 1, paddingHorizontal: spacing.screenH, paddingTop: spacing.sheetTop },
  sheetTitle: { color: colors.textPrimary, marginBottom: 16 },
});
