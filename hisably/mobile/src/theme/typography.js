import { StyleSheet } from 'react-native';

// Plus Jakarta Sans family names (loaded via @expo-google-fonts/plus-jakarta-sans).
// If fonts haven't loaded yet, React Native falls back to the system font gracefully.
export const fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
};

// Type scale per design spec. Custom fonts already carry their weight, so we set
// only fontFamily (no fontWeight) to avoid faux-bold on Android.
export const typography = StyleSheet.create({
  // Ultra-bold hero screen titles ("Welcome", "Invoice Validation Center")
  heroTitle: {
    fontFamily: fonts.extrabold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.6,
  },
  // "Hisably" wordmark
  wordmark: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  // display-bold — large rupee amounts
  display: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  amount: {
    fontFamily: fonts.bold,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  // headline-lg-mobile — screen titles
  title: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    lineHeight: 26,
  },
  // section headers
  section: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 22,
  },
  // card labels / button text
  labelBold: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 18,
  },
  // body / description
  body: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  bodyMd: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  // captions / timestamps / sub-labels
  caption: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
  },
  // Backwards-compatible aliases
  heading: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    lineHeight: 26,
  },
});
