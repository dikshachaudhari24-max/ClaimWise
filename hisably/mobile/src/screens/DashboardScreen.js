import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow } from '../theme';
import { Screen, ITCAmountCard, RiskScoreChip, AlertRow } from '../components';
import { api } from '../services/api';
import { useT } from '../i18n';

export const DashboardScreen = ({ navigation }) => {
  const [itc, setItc] = useState(null);
  const [risk, setRisk] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const t = useT();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [itcData, riskData, taskData] = await Promise.all([
        api.getItcSummary().catch(() => null),
        api.getRiskScore().catch(() => null),
        api.getTasks().catch(() => ({ tasks: [] })),
      ]);
      setItc(itcData);
      setRisk(riskData);
      setTasks((taskData?.tasks || []).filter((x) => x.status !== 'completed').slice(0, 3));
    } catch (e) { console.log(e); }
    setLoading(false);
  };

  const greeting = (
    <View style={styles.greetRow}>
      <Text style={[typography.display, styles.greeting]}>{t('dash.greeting', { name: 'there' })}</Text>
      {risk && <RiskScoreChip score={risk.score} />}
    </View>
  );

  return (
    <Screen
      wordmark={false}
      heroHeight={130}
      leftIcon="menu"
      rightIcons={[{ name: 'notifications-outline' }]}
      heroExtra={greeting}
    >
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <>
          <Text style={[typography.section, styles.sectionTitle]}>{t('dash.itcSummary')}</Text>
          <View style={styles.stack}>
            <ITCAmountCard amount={itc?.total_eligible || 0} label={t('itc.eligible')} type="eligible" onPress={() => navigation.navigate('ITCDashboard')} />
            <ITCAmountCard amount={itc?.total_recoverable || 0} label={t('itc.pendingAction')} type="recoverable" onPress={() => navigation.navigate('ITCDashboard')} />
            <ITCAmountCard amount={itc?.total_blocked || 0} label={t('itc.disputed')} type="blocked" onPress={() => navigation.navigate('ITCDashboard')} />
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[typography.section, { color: colors.textPrimary }]}>{t('dash.openTasks')}</Text>
            <TouchableOpacity onPress={() => navigation.getParent()?.navigate('Tasks')}>
              <Text style={[typography.caption, { color: colors.primary }]}>{t('common.viewAll')}</Text>
            </TouchableOpacity>
          </View>

          {tasks.length === 0 ? (
            <Text style={[typography.body, styles.muted]}>{t('dash.noTasks')}</Text>
          ) : (
            tasks.map((task, i) => (
              <View key={i} style={styles.taskRow}>
                <View style={[styles.taskDot, { backgroundColor: i === 0 ? colors.danger : colors.outlineVariant }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[typography.labelBold, { color: colors.textPrimary }]}>
                    {(task.task_type || '').replace(/_/g, ' ')}
                  </Text>
                  <Text style={[typography.caption, { color: colors.textSecondary }]}>
                    {task.supplier_name || t('common.general')}
                  </Text>
                </View>
                {i === 0 ? (
                  <View style={styles.actionBtn}>
                    <Text style={[typography.caption, { color: '#fff' }]}>{t('common.action')}</Text>
                  </View>
                ) : (
                  <Ionicons name="chevron-forward" size={18} color={colors.outline} />
                )}
              </View>
            ))
          )}

          <Text style={[typography.section, styles.sectionTitle]}>{t('dash.recentAlerts')}</Text>
          <AlertRow type="success" title={t('dash.connected')} subtitle={t('common.now')} />
        </>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  greetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  greeting: { color: colors.primary },
  sectionTitle: { color: colors.textPrimary, marginTop: spacing.sectionGap, marginBottom: spacing.sectionHeaderGap },
  stack: { gap: spacing.cardGap },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sectionGap, marginBottom: spacing.sectionHeaderGap },
  muted: { color: colors.textSecondary, paddingVertical: 8 },
  taskRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    paddingVertical: spacing.rowPaddingV, paddingHorizontal: spacing.rowPaddingH,
    borderRadius: radius.card, marginBottom: 12, ...shadow.card,
  },
  taskDot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.iconTextGap },
  actionBtn: { backgroundColor: colors.primary, paddingHorizontal: 16, height: 32, borderRadius: radius.smallBtn, alignItems: 'center', justifyContent: 'center' },
});
