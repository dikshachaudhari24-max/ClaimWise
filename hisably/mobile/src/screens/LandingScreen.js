import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';
import { PrimaryButton } from '../components';

const benefits = [
  { icon: '₹', labelHi: 'CA की ज़रूरत नहीं', labelEn: 'No CA needed for daily tracking', color: colors.success },
  { icon: '🗣', labelHi: 'हिंदी में समझें', labelEn: 'Ask questions in Hindi', color: colors.primary },
  { icon: '🔄', labelHi: 'अपना पैसा वापस पाएं', labelEn: 'Recover your blocked ITC', color: colors.warning },
];

export const LandingScreen = ({ navigation }) => (
  <View style={styles.container}>
    <View style={styles.saffronStripe} />
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.hero}>
        <Text style={[typography.display, styles.logo]}>Hisably</Text>
        <Text style={[typography.heading, styles.taglineHi]}>आपका AI GST सहायक</Text>
        <Text style={[typography.caption, styles.taglineEn]}>Your AI GST Compliance Assistant</Text>
      </View>

      <View style={styles.benefitsContainer}>
        {benefits.map((b, i) => (
          <View key={i} style={[styles.benefitCard, { borderLeftColor: b.color }]}>
            <Text style={styles.benefitIcon}>{b.icon}</Text>
            <View style={styles.benefitText}>
              <Text style={[typography.body, { color: colors.textPrimary }]}>{b.labelHi}</Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>{b.labelEn}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.aboutSection}>
        <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center' }]}>
          Hisably छोटे व्यापारियों के लिए बनाया गया है जो GST compliance आसान बनाना चाहते हैं — बिना किसी CA के।
        </Text>
      </View>
    </ScrollView>

    <View style={styles.ctaSection}>
      <PrimaryButton title="शुरू करें" onPress={() => navigation.navigate('Login')} />
      <Text
        style={[typography.body, styles.loginLink]}
        onPress={() => navigation.navigate('Login')}
      >
        पहले से account है? Login करें
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  saffronStripe: { height: 3, backgroundColor: colors.saffronAccent },
  scroll: { padding: 24, paddingBottom: 120 },
  hero: { alignItems: 'center', marginTop: 40, marginBottom: 32 },
  logo: { color: colors.primary, fontSize: 36 },
  taglineHi: { color: colors.textPrimary, marginTop: 8 },
  taglineEn: { color: colors.textSecondary, marginTop: 4 },
  benefitsContainer: { marginBottom: 24 },
  benefitCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 2,
  },
  benefitIcon: { fontSize: 24, marginRight: 16 },
  benefitText: { flex: 1 },
  aboutSection: { paddingHorizontal: 16, marginBottom: 24 },
  ctaSection: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, backgroundColor: colors.surface },
  loginLink: { color: colors.primary, textAlign: 'center', marginTop: 12 },
});
