import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

const getTier = (score) => {
  if (score <= 40) return { label: 'Low Risk', labelHi: 'कम जोखिम', color: colors.success, bg: colors.successLight };
  if (score <= 70) return { label: 'Medium Risk', labelHi: 'मध्यम जोखिम', color: colors.warning, bg: colors.warningLight };
  if (score <= 85) return { label: 'High Risk', labelHi: 'अधिक जोखिम', color: '#E65100', bg: colors.warningLight };
  return { label: 'Critical', labelHi: 'गंभीर जोखिम', color: colors.danger, bg: colors.dangerLight };
};

export const RiskScoreChip = ({ score }) => {
  const tier = getTier(score);
  return (
    <View style={[styles.chip, { backgroundColor: tier.bg }]}>
      <Text style={[typography.caption, { color: tier.color, fontWeight: '600' }]}>
        {tier.labelHi} — Score: {score}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
});
