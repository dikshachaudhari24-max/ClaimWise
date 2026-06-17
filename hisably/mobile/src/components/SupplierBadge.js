import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

const tierConfig = {
  green: { label: 'Reliable', labelHi: 'विश्वसनीय', color: colors.success, bg: colors.successLight },
  yellow: { label: 'Caution', labelHi: 'सावधान', color: colors.warning, bg: colors.warningLight },
  red: { label: 'Problematic', labelHi: 'समस्या', color: colors.danger, bg: colors.dangerLight },
};

export const SupplierBadge = ({ tier }) => {
  const config = tierConfig[tier] || tierConfig.green;
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[typography.caption, { color: config.color, fontWeight: '600' }]}>
        {config.labelHi}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
