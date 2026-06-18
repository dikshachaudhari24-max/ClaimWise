import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadow } from '../theme';

const typeStyles = {
  eligible: { color: colors.success, bg: colors.successLight, icon: 'checkmark-circle' },
  recoverable: { color: colors.warning, bg: colors.warningLight, icon: 'time' },
  blocked: { color: colors.danger, bg: colors.dangerLight, icon: 'alert-circle' },
  // legacy aliases
  success: { color: colors.success, bg: colors.successLight, icon: 'checkmark-circle' },
  warning: { color: colors.warning, bg: colors.warningLight, icon: 'time' },
  danger: { color: colors.danger, bg: colors.dangerLight, icon: 'alert-circle' },
};

const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export const ITCAmountCard = ({ amount, label, type = 'eligible', onPress }) => {
  const s = typeStyles[type] || typeStyles.eligible;
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: s.bg, borderLeftColor: s.color }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={s.icon} size={22} color={s.color} />
      </View>
      <Text style={[typography.labelBold, styles.label, { color: s.color }]}>{label}</Text>
      <Text style={[typography.amount, { color: s.color }]}>{formatINR(amount)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    padding: 16,
    borderLeftWidth: 4,
    ...shadow.card,
  },
  iconWrap: { marginBottom: 8 },
  label: { marginBottom: 4 },
});
