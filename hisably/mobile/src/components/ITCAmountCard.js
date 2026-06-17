import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

const typeStyles = {
  success: { bg: colors.successLight, text: colors.success },
  warning: { bg: colors.warningLight, text: colors.warning },
  danger: { bg: colors.dangerLight, text: colors.danger },
};

export const ITCAmountCard = ({ amount, labelHi, labelEn, type = 'success', onPress }) => {
  const style = typeStyles[type];
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: style.bg }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[typography.amount, { color: style.text }]}>
        ₹{amount?.toLocaleString('en-IN') || '0'}
      </Text>
      <Text style={[typography.body, styles.labelHi]}>{labelHi}</Text>
      {labelEn && <Text style={[typography.caption, styles.labelEn]}>{labelEn}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minHeight: 100,
    elevation: 2,
    marginHorizontal: 4,
  },
  labelHi: { color: colors.textPrimary, marginTop: 4 },
  labelEn: { color: colors.textSecondary, marginTop: 2 },
});
