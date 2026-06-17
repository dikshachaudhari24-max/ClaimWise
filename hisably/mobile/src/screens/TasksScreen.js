import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { colors, typography } from '../theme';
import { EmptyState } from '../components';
import { api } from '../services/api';

const statusConfig = {
  pending: { label: 'Open', color: colors.danger },
  in_progress: { label: 'Progress में', color: colors.warning },
  completed: { label: 'Done', color: colors.success },
};

const filterLabels = ['सभी', 'Open', 'Progress में', 'Done'];
const filterKeys = [null, 'pending', 'in_progress', 'completed'];

export const TasksScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(0);

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data.tasks || []);
    } catch (e) { console.log(e); }
    setLoading(false);
  };

  const handleDone = async (taskId) => {
    try {
      await api.markTaskDone(taskId, 'manual', 'Marked done');
      await loadTasks();
    } catch (e) {
      Alert.alert('Error', 'Task complete करने में गड़बड़ हुई');
    }
  };

  const filtered = activeFilter === 0
    ? tasks
    : tasks.filter((t) => t.status === filterKeys[activeFilter]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.saffronStripe} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[typography.heading, styles.title]}>करने वाले काम</Text>

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

        {filtered.length === 0 ? (
          <EmptyState icon="✅" messageHi="सब ठीक है! कोई pending काम नहीं।" />
        ) : (
          filtered.map((t, i) => {
            const status = statusConfig[t.status] || statusConfig.pending;
            return (
              <View key={i} style={styles.taskCard}>
                <View style={styles.taskHeader}>
                  <Text style={[typography.body, { color: colors.textPrimary, flex: 1 }]}>
                    {t.task_type?.replace('_', ' ')}
                  </Text>
                  <View style={[styles.statusChip, { backgroundColor: status.color }]}>
                    <Text style={[typography.caption, { color: '#fff' }]}>{status.label}</Text>
                  </View>
                </View>
                {t.supplier_name && (
                  <Text style={[typography.caption, { color: colors.textSecondary }]}>
                    {t.supplier_name}
                  </Text>
                )}
                {t.amount && (
                  <Text style={[typography.body, { color: colors.warning, marginTop: 4 }]}>
                    ₹{t.amount.toLocaleString('en-IN')} ITC affected
                  </Text>
                )}
                {t.status !== 'completed' && (
                  <TouchableOpacity
                    style={styles.doneBtn}
                    onPress={() => handleDone(t.id)}
                  >
                    <Text style={[typography.caption, { color: colors.primary }]}>Done करें</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
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
  filterRow: { flexDirection: 'row', marginBottom: 16 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16,
    backgroundColor: colors.surface, marginRight: 8, elevation: 1,
  },
  filterChipActive: { backgroundColor: colors.primary },
  taskCard: {
    backgroundColor: colors.surface, borderRadius: 12, padding: 16,
    marginBottom: 12, elevation: 2,
  },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  doneBtn: { marginTop: 12, alignSelf: 'flex-start' },
});
