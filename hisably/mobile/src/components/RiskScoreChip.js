import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, radius } from '../theme';
import { useT } from '../i18n';

const getTier = (score) => {
  if (score <= 40) return { key: 'risk.low', color: colors.success };
  if (score <= 70) return { key: 'risk.medium', color: colors.warning };
  if (score <= 85) return { key: 'risk.high', color: '#E65100' };
  return { key: 'risk.critical', color: colors.danger };
};

export const RiskScoreChip = ({ score = 0 }) => {
  const t = useT();
  const tier = getTier(score);
  return (
    <View style={styles.chip}>
      <View style={[styles.dot, { backgroundColor: tier.color }]} />
      <Text style={[typography.caption, { color: colors.textPrimary }]}>{t(tier.key)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
});
