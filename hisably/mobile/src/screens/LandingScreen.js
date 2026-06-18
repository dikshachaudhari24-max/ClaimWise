import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow } from '../theme';
import { PrimaryButton, LanguageChips, LandingDocIllustration } from '../components';
import { useAuthStore } from '../store/authStore';
import { useT } from '../i18n';

export const LandingScreen = ({ navigation }) => {
  const { loginDemo } = useAuthStore();
  const insets = useSafeAreaInsets();
  const t = useT();

  const benefits = [
    { icon: 'scan-outline', color: colors.success, titleKey: 'landing.benefit1.title', descKey: 'landing.benefit1.desc' },
    { icon: 'sync-outline', color: colors.primary, titleKey: 'landing.benefit2.title', descKey: 'landing.benefit2.desc' },
    { icon: 'shield-checkmark-outline', color: colors.warning, titleKey: 'landing.benefit3.title', descKey: 'landing.benefit3.desc' },
  ];

  return (
    <View style={styles.root}>
      <View style={[styles.hero, { paddingTop: insets.top }]}>
        <LandingDocIllustration />
        <View style={styles.heroCenter}>
          <Text style={[typography.heroTitle, styles.wordmark]}>Hisably</Text>
          <Text style={[typography.title, styles.tagline]}>{t('app.tagline')}</Text>
        </View>
      </View>

      <View style={styles.sheet}>
        <View style={styles.handle} />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={[typography.caption, styles.langLabel]}>{t('landing.selectLanguage')}</Text>
          <LanguageChips />

          <View style={styles.benefits}>
            {benefits.map((b, i) => (
              <View key={i} style={[styles.benefitCard, { borderLeftColor: b.color }]}>
                <View style={styles.benefitIcon}>
                  <Ionicons name={b.icon} size={22} color={colors.primary} />
                </View>
                <View style={styles.benefitText}>
                  <Text style={[typography.section, { color: colors.textPrimary }]}>{t(b.titleKey)}</Text>
                  <Text style={[typography.body, { color: colors.textSecondary, marginTop: 2 }]}>{t(b.descKey)}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={[styles.cta, { paddingBottom: insets.bottom + 16 }]}>
          <PrimaryButton title={t('common.getStarted')} icon="arrow-forward" onPress={() => navigation.navigate('Login')} />
          <Text style={[typography.body, styles.link]} onPress={() => navigation.navigate('Login')}>
            {t('landing.haveAccount')}
          </Text>
          <Text style={[typography.body, styles.demoLink]} onPress={loginDemo}>
            {t('landing.demoMode')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.hero },
  hero: { height: '42%', paddingHorizontal: spacing.screenH },
  heroCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  wordmark: { color: colors.primary, fontSize: 40, lineHeight: 48 },
  tagline: { color: colors.primary, opacity: 0.8, marginTop: 8 },
  sheet: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    marginTop: -28,
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.outlineVariant, alignSelf: 'center', marginTop: 10 },
  scroll: { paddingHorizontal: spacing.screenH, paddingTop: 20, paddingBottom: 12 },
  langLabel: { color: colors.textSecondary, marginBottom: 10 },
  benefits: { marginTop: spacing.sectionGap - 8 },
  benefitCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: 16,
    marginBottom: spacing.cardGap,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    ...shadow.card,
  },
  benefitIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.hero, alignItems: 'center', justifyContent: 'center', marginRight: spacing.iconTextGap },
  benefitText: { flex: 1 },
  cta: { paddingHorizontal: spacing.screenH, paddingTop: 12 },
  link: { color: colors.primary, textAlign: 'center', marginTop: 14 },
  demoLink: { color: colors.textSecondary, textAlign: 'center', marginTop: 12 },
});
