import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Modal, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow } from '../theme';
import { Screen, StatusChip } from '../components';
import { api } from '../services/api';
import { useT } from '../i18n';

const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const statusTone = (s) => {
  if (['validated', 'processed', 'ok', 'clean', 'completed'].includes(s)) return { tone: 'success', key: 'status.completed' };
  if (['pending', 'processing'].includes(s)) return { tone: 'info', key: 'status.processing' };
  return { tone: 'danger', key: null };
};

const FieldRow = ({ label, value }) => (
  <View style={styles.fieldRow}>
    <Text style={[typography.caption, { color: colors.textSecondary, width: 120 }]}>{label}</Text>
    <Text style={[typography.body, { color: colors.textPrimary, flex: 1 }]} numberOfLines={2}>{value || '—'}</Text>
  </View>
);

export const InvoiceUploadScreen = ({ navigation }) => {
  const [processing, setProcessing] = useState(false);
  const [recent, setRecent] = useState([]);
  const [extractedData, setExtractedData] = useState(null);
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
        return;
      }

      setProcessing(true);
      const res = await api.uploadInvoice(fileUri, fileName);
      setProcessing(false);

      if (res.error) {
        Alert.alert(t('common.error'), res.error);
        return;
      }

      if (res.extracted) {
        setExtractedData({ ...res.extracted, status: res.status, invoice_id: res.invoice_id });
      } else {
        Alert.alert(t('upload.uploaded'), `Status: ${res.status}`);
      }
      loadRecent();
    } catch (e) {
      setProcessing(false);
      Alert.alert(t('common.error'), e.message || t('upload.error'));
    }
  };

  return (
    <Screen wordmark subtitle={t('upload.title')} heroHeight={120}>
      {!extractedData ? (
        <>
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
                        {inv.invoice_number || 'Invoice'}
                      </Text>
                      <Text style={[typography.caption, { color: colors.textSecondary }]} numberOfLines={1}>
                        {inv.supplier_name || inv.date || ''}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      {inv.amount > 0 && <Text style={[typography.labelBold, { color: colors.textPrimary, marginBottom: 2 }]}>{formatINR(inv.amount)}</Text>}
                      <StatusChip label={st.key ? t(st.key) : (inv.status || '').replace(/_/g, ' ')} tone={st.tone} />
                    </View>
                  </View>
                );
              })}
            </>
          )}
        </>
      ) : (
        <View>
          <View style={styles.resultHeader}>
            <Ionicons name="checkmark-circle" size={28} color={colors.success} />
            <Text style={[typography.title, { color: colors.success, marginLeft: 10 }]}>Invoice Extracted</Text>
          </View>

          <StatusChip
            label={(extractedData.status || 'processing').replace(/_/g, ' ')}
            tone={statusTone(extractedData.status).tone}
          />

          <View style={styles.resultCard}>
            <Text style={[typography.section, { color: colors.textPrimary, marginBottom: 12 }]}>Invoice Details</Text>
            <FieldRow label="Supplier" value={extractedData.supplier_name} />
            <FieldRow label="GSTIN" value={extractedData.supplier_gstin} />
            <FieldRow label="Invoice No." value={extractedData.invoice_number} />
            <FieldRow label="Date" value={extractedData.date} />
            <FieldRow label="HSN Code" value={extractedData.hsn_code} />
            <FieldRow label="Description" value={extractedData.product_description} />
          </View>

          <View style={styles.resultCard}>
            <Text style={[typography.section, { color: colors.textPrimary, marginBottom: 12 }]}>Amount Breakdown</Text>
            <FieldRow label="Taxable Value" value={formatINR(extractedData.taxable_value)} />
            <FieldRow label="CGST" value={formatINR(extractedData.cgst_amount)} />
            <FieldRow label="SGST" value={formatINR(extractedData.sgst_amount)} />
            <FieldRow label="IGST" value={formatINR(extractedData.igst_amount)} />
            <FieldRow label="Total GST" value={formatINR(extractedData.gst_amount)} />
            <FieldRow label="GST %" value={extractedData.gst_percent ? `${extractedData.gst_percent}%` : '—'} />
            <View style={styles.totalRow}>
              <Text style={[typography.labelBold, { color: colors.textPrimary }]}>Total Amount</Text>
              <Text style={[typography.amount || typography.display, { color: colors.primary }]}>{formatINR(extractedData.total_amount)}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.uploadAnother} onPress={() => setExtractedData(null)}>
            <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
            <Text style={[typography.labelBold, { color: colors.primary, marginLeft: 8 }]}>Upload Another Invoice</Text>
          </TouchableOpacity>
        </View>
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
  resultHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 4 },
  resultCard: { backgroundColor: colors.surface, borderRadius: radius.card, padding: 16, marginTop: 16, ...shadow.card },
  fieldRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.divider },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, marginTop: 6, borderTopWidth: 2, borderTopColor: colors.primary },
  uploadAnother: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, paddingVertical: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: colors.surface, borderRadius: radius.card, padding: 36, alignItems: 'center', marginHorizontal: 40 },
  processingText: { color: colors.textPrimary, marginTop: 16, marginBottom: 6 },
});
