import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Alert, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../theme';
import { PrimaryButton, PillInput, GlobeButton } from '../components';
import { useAuthStore } from '../store/authStore';
import { useT } from '../i18n';

const OTP_LENGTH = 6;

const OtpBoxes = ({ value, onChange, editable, inputRef }) => (
  <View style={styles.otpRow}>
    {Array.from({ length: OTP_LENGTH }).map((_, i) => {
      const active = i === value.length;
      return (
        <View key={i} style={[styles.otpBox, active && editable && styles.otpBoxActive]}>
          <Text style={[typography.title, { color: colors.textPrimary }]}>{value[i] || ''}</Text>
        </View>
      );
    })}
    <TextInput
      ref={inputRef}
      style={styles.otpHidden}
      keyboardType="number-pad"
      maxLength={OTP_LENGTH}
      value={value}
      editable={editable}
      onChangeText={onChange}
      caretHidden
    />
  </View>
);

export const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const otpRef = useRef(null);
  const t = useT();
  const { sendOtp, verifyOtp } = useAuthStore();

  const masked = phone ? `${phone.slice(0, 2)}XXX-XX${phone.slice(-3)}` : 'XXXXX-XXXXX';

  const handleSendOtp = async () => {
    if (phone.length !== 10) return Alert.alert('', t('login.invalidPhone'));
    setLoading(true);
    try {
      await sendOtp(phone);
      setStep('otp');
      setTimeout(() => otpRef.current?.focus(), 150);
    } catch (e) {
      Alert.alert(t('common.error'), e.message);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== OTP_LENGTH) return Alert.alert('', t('login.invalidOtp'));
    setLoading(true);
    try {
      await verifyOtp(phone, otp);
    } catch (e) {
      Alert.alert(t('common.error'), e.message);
    }
    setLoading(false);
  };

  const onOtpChange = (v) => {
    setOtp(v);
    if (v.length === OTP_LENGTH) handleVerifyOtp();
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.hero, { paddingTop: insets.top + 14 }]}>
        <View style={styles.topRow}>
          <View />
          <GlobeButton />
        </View>
      </View>

      <View style={styles.sheet}>
        <View style={styles.handle} />
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={[typography.heroTitle, styles.title]}>{t('login.welcome')}</Text>
          <Text style={[typography.body, styles.subtitle]}>{t('login.subtitle')}</Text>

          <Text style={[typography.labelBold, styles.label]}>{t('login.mobileNumber')}</Text>
          <PillInput
            prefix="+91"
            placeholder={t('login.phonePlaceholder')}
            keyboardType="number-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
            editable={step === 'phone'}
          />

          {step === 'otp' && (
            <>
              <Text style={[typography.labelBold, styles.label]}>{t('login.enterOtp')}</Text>
              <Text style={[typography.caption, styles.sentTo]}>{t('login.otpSentTo', { masked })}</Text>
              <OtpBoxes value={otp} onChange={onOtpChange} editable inputRef={otpRef} />
              <TouchableOpacity onPress={handleSendOtp}>
                <Text style={[typography.caption, styles.resend]}>{t('login.resendOtp')}</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>

        <View style={[styles.cta, { paddingBottom: insets.bottom + 16 }]}>
          <PrimaryButton
            title={step === 'phone' ? t('common.sendOtp') : t('common.verify')}
            onPress={step === 'phone' ? handleSendOtp : handleVerifyOtp}
            loading={loading}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.hero },
  hero: { height: '28%', paddingHorizontal: spacing.screenH },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sheet: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    marginTop: -28,
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.outlineVariant, alignSelf: 'center', marginTop: 10 },
  scroll: { paddingHorizontal: spacing.screenH, paddingTop: 16 },
  title: { color: colors.textPrimary, textAlign: 'center', marginTop: 12 },
  subtitle: { color: colors.textSecondary, textAlign: 'center', marginTop: 6, marginBottom: 28 },
  label: { color: colors.textPrimary, marginBottom: 10, marginTop: 16 },
  sentTo: { color: colors.textSecondary, marginBottom: 14 },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between' },
  otpBox: {
    width: 48, height: 52, borderRadius: 12, backgroundColor: colors.fieldBg,
    alignItems: 'center', justifyContent: 'center',
  },
  otpBoxActive: { borderWidth: 1.5, borderColor: colors.primary, backgroundColor: '#EEF1FF' },
  otpHidden: { position: 'absolute', width: '100%', height: 52, opacity: 0 },
  resend: { color: colors.primary, textAlign: 'right', marginTop: 14 },
  cta: { paddingHorizontal: spacing.screenH, paddingTop: 8 },
});
