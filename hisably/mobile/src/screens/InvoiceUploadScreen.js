import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow } from '../theme';
import { Screen, StatusChip } from '../components';
import { api } from '../services/api';
import { useT } from '../i18n';

const statusTone = (s) => {
  if (['validated', 'processed', 'ok', 'clean', 'completed'].includes(s)) return { tone: 'success', key: 'status.completed' };
  if (['pending', 'processing'].includes(s)) return { tone: 'info', key: 'status.processing' };
  return { tone: 'danger', key: null };
};

export const InvoiceUploadScreen = ({ navigation }) => {
  const [processing, setProcessing] = useState(false);
  const [recent, setRecent] = useState([]);
  const t = useT();

  const tiles = [
    { icon: 'scan-outline', labelKey: 'upload.scan', type: 'camera', tinted: true },
    { icon: 'images-outline', labelKey: 'upload.gallery', type: 'gallery' },
    { icon: 'document-outline', labelKey: 'upload.pdf', type: 'pdf' },
    { icon: 'create-outline', labelKey: 'upload.manual', type: 'manual' },
  ];

  useEffect(() => { loadRecent(); }, []);

  const loadRecent = async () => {
    try {
      const data = await api.getInvoices(1, 5);
      setRecent(data.invoices || data.items || []);
    } catch (e) { /* no recent yet */ }
  };

  const handleUpload = async (type) => {
    let fileUri, fileName;
    try {
      if (type === 'camera') {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) return Alert.alert('', t('upload.cameraPerm'));
        const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
        if (result.canceled) return;
        fileUri = result.assets[0].uri; fileName = 'invoice_photo.jpg';
      } else if (type === 'gallery') {
        const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
        if (result.canceled) return;
        fileUri = result.assets[0].uri; fileName = 'invoice_gallery.jpg';
      } else if (type === 'pdf') {
        const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
        if (result.canceled) return;
        fileUri = result.assets[0].uri; fileName = result.assets[0].name;
      } else {
        navigation.navigate('ManualInvoice');
        return;
      }

      setProcessing(true);
      const res = await api.uploadInvoice(fileUri, fileName);
      setProcessing(false);
      Alert.alert(t('upload.uploaded'), `Status: ${res.status}`);
      loadRecent();
    } catch (e) {
      setProcessing(false);
      Alert.alert(t('common.error'), t('upload.error'));
    }
  };

  return (
    <Screen wordmark subtitle={t('upload.title')} heroHeight={120}>
      <View style={styles.grid}>
        {tiles.map((tile, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.tile, tile.tinted && styles.tileTinted]}
            onPress={() => handleUpload(tile.type)}
            activeOpacity={0.85}
          >
            <View style={styles.tileIcon}>
              <Ionicons name={tile.icon} size={26} color={colors.primary} />
            </View>
            <Text style={[typography.labelBold, styles.tileLabel]}>{t(tile.labelKey)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {recent.length > 0 && (
        <>
          <Text style={[typography.section, styles.sectionTitle]}>{t('upload.recent')}</Text>
          {recent.map((inv, i) => {
            const st = statusTone(inv.status);
            return (
              <View key={i} style={styles.recentRow}>
                <View style={styles.recentIcon}>
                  <Ionicons name="document-text-outline" size={20} color={colors.outline} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[typography.labelBold, { color: colors.textPrimary }]} numberOfLines={1}>
                    {inv.invoice_number || inv.file_url || 'Invoice'}
                  </Text>
                  <Text style={[typography.caption, { color: colors.textSecondary }]} numberOfLines={1}>
                    {inv.supplier_name || inv.date || ''}
                  </Text>
                </View>
                <StatusChip label={st.key ? t(st.key) : (inv.status || '').replace(/_/g, ' ')} tone={st.tone} />
              </View>
            );
          })}
        </>
      )}

      <Modal visible={processing} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[typography.section, styles.processingText]}>{t('upload.processing')}</Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>{t('upload.processingSub')}</Text>
          </View>
        </View>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: '48%', backgroundColor: colors.surface, borderRadius: radius.card, padding: 20,
    alignItems: 'center', marginBottom: spacing.cardGap, ...shadow.card,
  },
  tileTinted: { backgroundColor: colors.primaryLight },
  tileIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.hero, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  tileLabel: { color: colors.textPrimary, textAlign: 'center' },
  sectionTitle: { color: colors.textPrimary, marginTop: spacing.sectionGap - 8, marginBottom: spacing.sectionHeaderGap },
  recentRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    paddingVertical: spacing.rowPaddingV, paddingHorizontal: spacing.rowPaddingH,
    borderRadius: radius.card, marginBottom: 12, ...shadow.card,
  },
  recentIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.neutralBg, alignItems: 'center', justifyContent: 'center', marginRight: spacing.iconTextGap },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: colors.surface, borderRadius: radius.card, padding: 36, alignItems: 'center', marginHorizontal: 40 },
  processingText: { color: colors.textPrimary, marginTop: 16, marginBottom: 6 },
});
