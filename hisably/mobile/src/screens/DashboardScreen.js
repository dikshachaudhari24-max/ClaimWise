import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, typography } from '../theme';
import { ITCAmountCard, RiskScoreChip, AlertRow } from '../components';
import { api } from '../services/api';

export const DashboardScreen = ({ navigation }) => {
  const [itc, setItc] = useState(null);
  const [risk, setRisk] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [itcData, riskData, taskData] = await Promise.all([
        api.getItcSummary().catch(() => null),
        api.getRiskScore().catch(() => null),
        api.getTasks().catch(() => ({ tasks: [] })),
      ]);
      setItc(itcData);
      setRisk(riskData);
      setTasks(taskData?.tasks?.slice(0, 2) || []);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.saffronStripe} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <Text style={[typography.heading, styles.greeting]}>नमस्ते जी 🙏</Text>
          {risk && <RiskScoreChip score={risk.score} />}
        </View>

        <Text style={[typography.heading, styles.sectionTitle]}>ITC सारांश</Text>
        <View style={styles.itcRow}>
          <ITCAmountCard
            amount={itc?.total_eligible || 0}
            labelHi="हासिल होगा"
            labelEn="Eligible ITC"
            type="success"
            onPress={() => navigation.navigate('ITCDashboard')}
          />
          <ITCAmountCard
            amount={itc?.total_recoverable || 0}
            labelHi="वापस मिल सकता"
            labelEn="Recoverable"
            type="warning"
            onPress={() => navigation.navigate('ITCDashboard')}
          />
        </View>
        <View style={[styles.itcRow, { marginTop: 8 }]}>
          <ITCAmountCard
            amount={itc?.total_blocked || 0}
            labelHi="अटका हुआ"
            labelEn="Blocked ITC"
            type="danger"
            onPress={() => navigation.navigate('ITCDashboard')}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[typography.heading, styles.sectionTitle]}>करने वाले काम</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
            <Text style={[typography.caption, { color: colors.primary }]}>सभी देखें</Text>
          </TouchableOpacity>
        </View>
        {tasks.length === 0 ? (
          <Text style={[typography.body, { color: colors.textSecondary, padding: 16 }]}>
            कोई pending काम नहीं
          </Text>
        ) : (
          tasks.map((t, i) => (
            <TouchableOpacity key={i} style={styles.taskRow}>
              <Text style={[typography.body, { color: colors.textPrimary, flex: 1 }]}>
                {t.task_type} — {t.supplier_name || 'General'}
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>&gt;</Text>
            </TouchableOpacity>
          ))
        )}

        <Text style={[typography.heading, styles.sectionTitle]}>हाल की जानकारी</Text>
        <AlertRow type="info" message="Server se connected hai" timestamp="अभी" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutralBg },
  saffronStripe: { height: 3, backgroundColor: colors.saffronAccent },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 16, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { color: colors.textPrimary },
  sectionTitle: { color: colors.textPrimary, marginBottom: 12, marginTop: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 12 },
  itcRow: { flexDirection: 'row' },
  taskRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    padding: 16, borderRadius: 12, marginBottom: 8, elevation: 1,
  },
});
