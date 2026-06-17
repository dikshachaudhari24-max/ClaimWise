import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { colors, typography } from '../theme';
import { ITCAmountCard } from '../components';
import { api } from '../services/api';

export const ITCDashboardScreen = () => {
  const [itc, setItc] = useState(null);
  const [mismatches, setMismatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [itcData, mData] = await Promise.all([
          api.getItcSummary().catch(() => null),
          api.getMismatches().catch(() => ({ mismatches: [] })),
        ]);
        setItc(itcData);
        setMismatches(mData.mismatches?.filter((m) => !m.resolved) || []);
      } catch (e) { console.log(e); }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  const blockedByType = {};
  mismatches.forEach((m) => {
    const type = m.mismatch_type || 'other';
    blockedByType[type] = (blockedByType[type] || 0) + (m.amount_difference || 0);
  });

  return (
    <View style={styles.container}>
      <View style={styles.saffronStripe} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[typography.heading, styles.sectionTitle]}>ITC की जानकारी</Text>

        <View style={styles.row}>
          <ITCAmountCard
            amount={itc?.total_eligible || 0}
            labelHi="Eligible ITC"
            labelEn="हासिल होगा"
            type="success"
          />
        </View>

        <Text style={[typography.heading, styles.sectionTitle]}>अभी वापस मिल सकता है</Text>
        <View style={[styles.row, { marginBottom: 8 }]}>
          <ITCAmountCard
            amount={itc?.total_recoverable || 0}
            labelHi="Recoverable"
            labelEn="वापस मिल सकता"
            type="warning"
          />
        </View>

        {itc?.priority_actions?.map((action, i) => (
          <View key={i} style={styles.actionRow}>
            <View style={styles.actionLeft}>
              <Text style={[typography.body, { color: colors.textPrimary }]}>
                {action.supplier_name || action.action_hi || 'Action required'}
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>
                {action.action_hi || action.action_en || ''}
              </Text>
            </View>
            <Text style={[typography.body, { color: colors.warning, fontWeight: '600' }]}>
              ₹{(action.amount || 0).toLocaleString('en-IN')}
            </Text>
          </View>
        ))}

        <Text style={[typography.heading, styles.sectionTitle]}>Blocked ITC Breakdown</Text>
        {Object.entries(blockedByType).map(([type, amount], i) => (
          <View key={i} style={styles.breakdownRow}>
            <Text style={[typography.body, { color: colors.textPrimary, flex: 1 }]}>
              {type.replace('_', ' ')}
            </Text>
            <Text style={[typography.body, { color: colors.danger, fontWeight: '600' }]}>
              ₹{amount.toLocaleString('en-IN')}
            </Text>
          </View>
        ))}

        <View style={[styles.row, { marginTop: 8 }]}>
          <ITCAmountCard
            amount={itc?.total_blocked || 0}
            labelHi="Total Blocked"
            labelEn="अटका हुआ"
            type="danger"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutralBg },
  saffronStripe: { height: 3, backgroundColor: colors.saffronAccent },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 16, paddingBottom: 32 },
  sectionTitle: { color: colors.textPrimary, marginBottom: 12, marginTop: 16 },
  row: { marginBottom: 16 },
  actionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.surface, padding: 16, borderRadius: 12, marginBottom: 8, elevation: 1,
  },
  actionLeft: { flex: 1, marginRight: 8 },
  breakdownRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.dangerLight, padding: 14, borderRadius: 10, marginBottom: 6,
  },
});
