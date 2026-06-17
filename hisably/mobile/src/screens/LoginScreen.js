import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { colors, typography } from '../theme';
import { PrimaryButton } from '../components';
import { useAuthStore } from '../store/authStore';

export const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);
  const { sendOtp, verifyOtp } = useAuthStore();

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      Alert.alert('', 'कृपया 10 अंकों का मोबाइल नंबर डालें');
      return;
    }
    setLoading(true);
    try {
      await sendOtp(phone);
      setStep('otp');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('', 'कृपया 6 अंकों का OTP डालें');
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(phone, otp);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.saffronStripe} />
      <View style={styles.content}>
        <Text style={[typography.heading, styles.logo]}>Hisably</Text>

        {step === 'phone' ? (
          <>
            <Text style={[typography.heading, styles.label]}>अपना मोबाइल नंबर डालें</Text>
            <View style={styles.phoneRow}>
              <View style={styles.prefix}>
                <Text style={typography.body}>+91</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="98XXXXXXXX"
                keyboardType="number-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
              />
            </View>
            <PrimaryButton title="OTP भेजें" onPress={handleSendOtp} loading={loading} />
          </>
        ) : (
          <>
            <Text style={[typography.heading, styles.label]}>OTP डालें</Text>
            <Text style={[typography.caption, styles.sublabel]}>
              +91 {phone.slice(0, 2)}XXX-XX{phone.slice(-3)} पर भेजा गया
            </Text>
            <TextInput
              style={[styles.input, styles.otpInput]}
              placeholder="______"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={(v) => {
                setOtp(v);
                if (v.length === 6) handleVerifyOtp();
              }}
              textAlign="center"
              letterSpacing={8}
            />
            <PrimaryButton title="Verify करें" onPress={handleVerifyOtp} loading={loading} />
            <Text
              style={[typography.caption, styles.resend]}
              onPress={() => handleSendOtp()}
            >
              OTP नहीं मिला? फिर से भेजें
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  saffronStripe: { height: 3, backgroundColor: colors.saffronAccent },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  logo: { color: colors.primary, fontSize: 28, textAlign: 'center', marginBottom: 40 },
  label: { color: colors.textPrimary, marginBottom: 16 },
  sublabel: { color: colors.textSecondary, marginBottom: 16 },
  phoneRow: { flexDirection: 'row', marginBottom: 24 },
  prefix: {
    height: 56, width: 60, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: colors.divider, borderRadius: 8, marginRight: 8,
    backgroundColor: colors.neutralBg,
  },
  input: {
    flex: 1, height: 56, borderWidth: 2, borderColor: colors.divider, borderRadius: 8,
    paddingHorizontal: 16, fontSize: 16,
  },
  otpInput: { marginBottom: 24, fontSize: 24, fontWeight: '600' },
  resend: { color: colors.primary, textAlign: 'center', marginTop: 16 },
});
