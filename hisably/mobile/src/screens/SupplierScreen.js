import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, typography } from '../theme';
import { SupplierBadge, EmptyState } from '../components';
import { api } from '../services/api';

export const SupplierScreen = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getSuppliers();
        setSuppliers(data.suppliers || []);
      } catch (e) { console.log(e); }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  if (suppliers.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.saffronStripe} />
        <EmptyState icon="🏪" messageHi="कोई supplier नहीं मिला।" messageEn="Suppliers will appear after invoice uploads" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.saffronStripe} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[typography.heading, styles.title]}>Suppliers</Text>
        {suppliers.map((s, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={[typography.body, { color: colors.textPrimary, flex: 1, fontWeight: '600' }]}>
                {s.name}
              </Text>
              <SupplierBadge tier={s.reliability_tier} />
            </View>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              GSTIN: {s.gstin}
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>Score</Text>
                <Text style={[typography.body, { color: colors.textPrimary }]}>{s.reliability_score}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>Invoices</Text>
                <Text style={[typography.body, { color: colors.textPrimary }]}>{s.invoice_count}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>Errors</Text>
                <Text style={[typography.body, { color: colors.danger }]}>{s.error_count}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>Blocked</Text>
                <Text style={[typography.body, { color: colors.danger }]}>₹{s.total_itc_blocked}</Text>
              </View>
            </View>
            <Text style={[typography.caption, { color: colors.primary, marginTop: 8 }]}>
              {s.suggested_action}
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
  title: { color: colors.textPrimary, marginBottom: 16 },
  card: {
    backgroundColor: colors.surface, borderRadius: 12, padding: 16,
    marginBottom: 12, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  stat: { alignItems: 'center' },
});
