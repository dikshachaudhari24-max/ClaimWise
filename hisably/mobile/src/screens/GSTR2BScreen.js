import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { colors, typography } from '../theme';
import { PrimaryButton, EmptyState } from '../components';
import { api } from '../services/api';

const filterLabels = ['सभी', 'GSTIN गलत', 'Amount गलत', 'Invoice नहीं'];
const filterKeys = [null, 'gstin_mismatch', 'amount_mismatch', 'missing_invoice'];

export const GSTR2BScreen = () => {
  const [mismatches, setMismatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeFilter, setActiveFilter] = useState(0);

  useEffect(() => { loadMismatches(); }, []);

  const loadMismatches = async () => {
    try {
      const data = await api.getMismatches();
      setMismatches(data.mismatches || []);
    } catch (e) { console.log(e); }
    setLoading(false);
  };

  const handleUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: ['text/csv', 'application/vnd.ms-excel'] });
    if (result.canceled) return;
    setUploading(true);
    try {
      await api.uploadGstr2b(result.assets[0].uri, result.assets[0].name);
      await loadMismatches();
      Alert.alert('', 'GSTR-2B processed successfully');
    } catch (e) {
      Alert.alert('Error', 'Upload में गड़बड़ हुई');
    }
    setUploading(false);
  };

  const filtered = activeFilter === 0
    ? mismatches
    : mismatches.filter((m) => m.mismatch_type === filterKeys[activeFilter]);

  const matched = mismatches.length === 0 ? 0 : mismatches.filter((m) => m.resolved).length;
  const total = mismatches.length + matched;

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  if (mismatches.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.saffronStripe} />
        <EmptyState icon="📊" messageHi="GSTR-2B file upload करें।" messageEn="Upload your GSTR-2B file to start reconciliation" />
        <View style={styles.uploadBtn}>
          <PrimaryButton title="File Upload करें" onPress={handleUpload} loading={uploading} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.saffronStripe} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.counterRow}>
          {[
            { label: 'कुल Invoice', value: total, color: colors.primary },
            { label: 'मिले', value: matched, color: colors.success },
            { label: 'नहीं मिले', value: mismatches.filter((m) => m.mismatch_type === 'missing_invoice').length, color: colors.danger },
            { label: 'गलत', value: mismatches.filter((m) => m.mismatch_type !== 'missing_invoice').length, color: colors.warning },
          ].map((c, i) => (
            <View key={i} style={styles.counterCard}>
              <Text style={[typography.amount, { color: c.color, fontSize: 24 }]}>{c.value}</Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>{c.label}</Text>
            </View>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {filterLabels.map((label, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.filterChip, activeFilter === i && styles.filterChipActive]}
              onPress={() => setActiveFilter(i)}
            >
              <Text style={[typography.caption, { color: activeFilter === i ? '#fff' : colors.textPrimary }]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filtered.map((m, i) => (
          <View key={i} style={styles.mismatchRow}>
            <View style={styles.mismatchLeft}>
              <Text style={[typography.body, { color: colors.textPrimary }]}>{m.supplier_name || 'Unknown'}</Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>
                {m.mismatch_type?.replace('_', ' ')}
              </Text>
            </View>
            <Text style={[typography.body, { color: colors.danger, fontWeight: '600' }]}>
              ₹{m.amount_difference?.toLocaleString('en-IN')}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutralBg },
  saffronStripe: { height: 3, backgroundColor: colors.saffronAccent },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 16, paddingBottom: 32 },
  uploadBtn: { padding: 24 },
  counterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  counterCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: 12,
    alignItems: 'center', marginHorizontal: 4, elevation: 1,
  },
  filterRow: { flexDirection: 'row', marginBottom: 16 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16,
    backgroundColor: colors.surface, marginRight: 8, elevation: 1,
  },
  filterChipActive: { backgroundColor: colors.primary },
  mismatchRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.surface, padding: 16, borderRadius: 12, marginBottom: 8, elevation: 1,
  },
  mismatchLeft: { flex: 1 },
});
