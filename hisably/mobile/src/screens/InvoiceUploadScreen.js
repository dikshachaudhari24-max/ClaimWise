import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { colors, typography } from '../theme';
import { api } from '../services/api';

const uploadTiles = [
  { icon: '📷', labelHi: 'Camera से खींचें', type: 'camera' },
  { icon: '🖼', labelHi: 'Gallery से चुनें', type: 'gallery' },
  { icon: '📄', labelHi: 'PDF Upload', type: 'pdf' },
  { icon: '✏', labelHi: 'खुद भरें (Manual)', type: 'manual' },
];

export const InvoiceUploadScreen = ({ navigation }) => {
  const [processing, setProcessing] = useState(false);

  const handleUpload = async (type) => {
    let fileUri, fileName;

    try {
      if (type === 'camera') {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) { Alert.alert('', 'Camera permission required'); return; }
        const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
        if (result.canceled) return;
        fileUri = result.assets[0].uri;
        fileName = 'invoice_photo.jpg';
      } else if (type === 'gallery') {
        const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
        if (result.canceled) return;
        fileUri = result.assets[0].uri;
        fileName = 'invoice_gallery.jpg';
      } else if (type === 'pdf') {
        const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
        if (result.canceled) return;
        fileUri = result.assets[0].uri;
        fileName = result.assets[0].name;
      } else {
        navigation.navigate('ManualInvoice');
        return;
      }

      setProcessing(true);
      const res = await api.uploadInvoice(fileUri, fileName);
      setProcessing(false);
      Alert.alert('Invoice uploaded', `Status: ${res.status}`);
    } catch (e) {
      setProcessing(false);
      Alert.alert('Error', 'Invoice upload में कुछ गड़बड़ हुई। दोबारा try करें।');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.saffronStripe} />
      <View style={styles.content}>
        <Text style={[typography.heading, styles.title]}>Invoice जोड़ें</Text>
        <Text style={[typography.body, styles.subtitle]}>
          WhatsApp से मिली photo या PDF यहाँ upload करें
        </Text>

        <View style={styles.grid}>
          {uploadTiles.map((tile, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.tile, i === 0 && { backgroundColor: colors.primaryLight }]}
              onPress={() => handleUpload(tile.type)}
              activeOpacity={0.7}
            >
              <Text style={styles.tileIcon}>{tile.icon}</Text>
              <Text style={[typography.body, styles.tileLabel]}>{tile.labelHi}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Modal visible={processing} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[typography.heading, styles.processingText]}>Invoice पढ़ रहे हैं...</Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>कुछ सेकंड लगेंगे</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  saffronStripe: { height: 3, backgroundColor: colors.saffronAccent },
  content: { flex: 1, padding: 24 },
  title: { color: colors.textPrimary, textAlign: 'center', marginTop: 24 },
  subtitle: { color: colors.textSecondary, textAlign: 'center', marginTop: 8, marginBottom: 32 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: '48%', backgroundColor: colors.surface, borderRadius: 12, padding: 24,
    alignItems: 'center', marginBottom: 16, elevation: 2,
  },
  tileIcon: { fontSize: 32, marginBottom: 8 },
  tileLabel: { color: colors.textPrimary, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 40, alignItems: 'center' },
  processingText: { color: colors.textPrimary, marginTop: 16, marginBottom: 8 },
});
