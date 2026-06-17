import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { colors, typography } from '../theme';
import { api } from '../services/api';

export const VoiceScreen = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (text) => {
    const q = text || query;
    if (!q.trim()) return;

    setLoading(true);
    setHistory((prev) => [...prev.slice(-4), { role: 'user', content: q }]);

    try {
      const res = await api.chatQuery(q);
      setResponse(res.response_text);
      setHistory((prev) => [...prev, { role: 'assistant', content: res.response_text }]);
    } catch (e) {
      setResponse('कुछ गड़बड़ हुई। दोबारा try करें।');
    }
    setQuery('');
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.saffronStripe} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {history.length === 0 && !response && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>🎙</Text>
            <Text style={[typography.heading, { color: colors.textSecondary, textAlign: 'center' }]}>
              कुछ पूछें — मैं हिंदी में जवाब दूंगा
            </Text>
          </View>
        )}

        {history.map((msg, i) => (
          <View
            key={i}
            style={[
              styles.chatBubble,
              msg.role === 'user' ? styles.userBubble : styles.assistantBubble,
            ]}
          >
            <Text style={[typography.body, { color: msg.role === 'user' ? '#fff' : colors.textPrimary }]}>
              {msg.content}
            </Text>
          </View>
        ))}

        {loading && (
          <View style={[styles.chatBubble, styles.assistantBubble]}>
            <Text style={[typography.body, { color: colors.textSecondary }]}>सोच रहा हूँ...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.quickQuestions}>
        {['Is mahine kitna ITC mila?', 'Blocked ITC kitna hai?', 'Top supplier kaun hai?'].map((q, i) => (
          <TouchableOpacity key={i} style={styles.quickChip} onPress={() => handleSend(q)}>
            <Text style={[typography.caption, { color: colors.primary }]}>{q}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="अपना सवाल लिखें..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => handleSend()}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend()}>
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutralBg },
  saffronStripe: { height: 3, backgroundColor: colors.saffronAccent },
  scroll: { padding: 16, paddingBottom: 16, flexGrow: 1 },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 300 },
  placeholderIcon: { fontSize: 48, marginBottom: 16 },
  chatBubble: { padding: 14, borderRadius: 12, marginBottom: 8, maxWidth: '85%' },
  userBubble: { backgroundColor: colors.primary, alignSelf: 'flex-end' },
  assistantBubble: { backgroundColor: colors.surface, alignSelf: 'flex-start', elevation: 1 },
  quickQuestions: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, paddingBottom: 8 },
  quickChip: {
    backgroundColor: colors.primaryLight, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 16, marginRight: 8, marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row', padding: 12, backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.divider,
  },
  input: {
    flex: 1, height: 48, backgroundColor: colors.neutralBg, borderRadius: 24,
    paddingHorizontal: 16, fontSize: 16, marginRight: 8,
  },
  sendBtn: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  sendIcon: { color: '#fff', fontSize: 20 },
});
