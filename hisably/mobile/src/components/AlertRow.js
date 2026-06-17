import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

const dotColors = {
  success: colors.success,
  warning: colors.warning,
  danger: colors.danger,
  info: colors.primary,
};

export const AlertRow = ({ type = 'info', message, timestamp }) => (
  <View style={styles.row}>
    <View style={[styles.dot, { backgroundColor: dotColors[type] || colors.primary }]} />
    <View style={styles.content}>
      <Text style={[typography.body, { color: colors.textPrimary }]}>{message}</Text>
      {timestamp && <Text style={[typography.caption, { color: colors.textSecondary }]}>{timestamp}</Text>}
    </View>
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 6, marginRight: 12 },
  content: { flex: 1 },
});
