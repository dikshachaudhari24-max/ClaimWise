import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius } from '../theme';

export const PrimaryButton = ({ title, onPress, loading, disabled, variant = 'primary', icon }) => {
  const isPrimary = variant === 'primary';
  const textColor = isPrimary ? '#fff' : colors.primary;
  return (
    <TouchableOpacity
      style={[styles.button, isPrimary ? styles.primary : styles.secondary, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.inner}>
          <Text style={[typography.labelBold, { color: textColor }]}>{title}</Text>
          {icon && <Ionicons name={icon} size={18} color={textColor} style={styles.icon} />}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: radius.button,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  inner: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginLeft: 8 },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.hero },
  disabled: { opacity: 0.5 },
});
