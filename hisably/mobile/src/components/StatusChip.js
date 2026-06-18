import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, radius } from '../theme';

const tones = {
  success: { bg: colors.successLight, text: colors.success },
  warning: { bg: colors.warningLight, text: colors.warning },
  danger: { bg: colors.dangerLight, text: colors.danger },
  info: { bg: colors.primaryLight, text: colors.primary },
  neutral: { bg: '#ECECEC', text: colors.textSecondary },
};

export const StatusChip = ({ label, tone = 'neutral', style }) => {
  const t = tones[tone] || tones.neutral;
  return (
    <View style={[styles.chip, { backgroundColor: t.bg }, style]}>
      <Text style={[typography.caption, { color: t.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
});
