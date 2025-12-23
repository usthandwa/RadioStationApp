/**
 * Data Management Screen
 *
 * Export, import, backup, and restore CMS data
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Platform,
  StatusBar,
  TextInput,
} from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import * as Clipboard from 'expo-clipboard';
import {
  exportData,
  importData,
  clearAllData,
  initializeStorage,
} from '@/services/storage/CMSStorage';

const DataManagementScreen: React.FC = () => {
  const [importText, setImportText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      const jsonData = await exportData();

      if (Platform.OS === 'web') {
        // Web: Download as file
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cms-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        Alert.alert('Success', 'Data exported successfully');
      } else {
        // Mobile: Share
        await Share.share({
          message: jsonData,
          title: 'CMS Data Backup',
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      setLoading(true);
      const jsonData = await exportData();
      await Clipboard.setStringAsync(jsonData);
      Alert.alert('Success', 'Data copied to clipboard');
    } catch (error) {
      console.error('Copy error:', error);
      Alert.alert('Error', 'Failed to copy data');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!importText.trim()) {
      Alert.alert('Error', 'Please paste JSON data to import');
      return;
    }

    Alert.alert(
      'Import Data',
      'This will replace ALL current data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await importData(importText);
              Alert.alert('Success', 'Data imported successfully. Please restart the app.');
              setImportText('');
            } catch (error) {
              console.error('Import error:', error);
              Alert.alert('Error', 'Failed to import data. Check JSON format.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      setImportText(text);
      Alert.alert('Success', 'Data pasted from clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to paste from clipboard');
    }
  };

  const handleReset = async () => {
    Alert.alert(
      'Reset to Default',
      'This will DELETE all data and restore to factory defaults. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await clearAllData();
              await initializeStorage();
              Alert.alert('Success', 'Data reset to defaults. Please restart the app.');
            } catch (error) {
              console.error('Reset error:', error);
              Alert.alert('Error', 'Failed to reset data');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor="#07477B"
      />
      <View style={styles.header}>
        <Text style={styles.title}>Data Management</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Icon name="cloud-download" size={20} /> Export Data
          </Text>
          <Text style={styles.sectionDescription}>
            Backup your CMS data to a JSON file or share it
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={handleExport}
            disabled={loading}
          >
            <Icon name="download" size={20} color="#fff" />
            <Text style={styles.buttonText}>Export as JSON</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleCopyToClipboard}
            disabled={loading}
          >
            <Icon name="clipboard" size={20} color="#07477B" />
            <Text style={[styles.buttonText, { color: '#07477B' }]}>Copy to Clipboard</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Icon name="cloud-upload" size={20} /> Import Data
          </Text>
          <Text style={styles.sectionDescription}>
            Restore CMS data from a JSON backup (replaces all current data)
          </Text>
          <TextInput
            style={styles.textArea}
            value={importText}
            onChangeText={setImportText}
            placeholder="Paste JSON data here..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={6}
          />
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handlePasteFromClipboard}
          >
            <Icon name="clipboard" size={20} color="#07477B" />
            <Text style={[styles.buttonText, { color: '#07477B' }]}>Paste from Clipboard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.warningButton]}
            onPress={handleImport}
            disabled={loading || !importText.trim()}
          >
            <Icon name="upload" size={20} color="#fff" />
            <Text style={styles.buttonText}>Import Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Icon name="refresh" size={20} /> Reset to Defaults
          </Text>
          <Text style={styles.sectionDescription}>
            Delete all data and restore factory defaults
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleReset}
            disabled={loading}
          >
            <Icon name="warning" size={20} color="#fff" />
            <Text style={styles.buttonText}>Reset All Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Icon name="info-circle" size={20} color="#07477B" />
          <Text style={styles.infoText}>
            Important: Always backup your data before importing or resetting. Changes cannot be undone.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#07477B',
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#07477B',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#07477B',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#07477B',
  },
  warningButton: {
    backgroundColor: '#FF9800',
  },
  dangerButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f9f9f9',
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  infoBox: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#E65100',
    lineHeight: 20,
  },
});

export default DataManagementScreen;
