import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

export const EmptyState = ({ icon, messageHi, messageEn }) => (
  <View style={styles.container}>
    <Text style={styles.icon}>{icon}</Text>
    <Text style={[typography.body, styles.messageHi]}>{messageHi}</Text>
    {messageEn && <Text style={[typography.caption, styles.messageEn]}>{messageEn}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  icon: { fontSize: 48, marginBottom: 16 },
  messageHi: { color: colors.textPrimary, textAlign: 'center' },
  messageEn: { color: colors.textSecondary, textAlign: 'center', marginTop: 4 },
});
