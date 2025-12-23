/**
 * Shows Management Screen
 *
 * CRUD interface for radio shows
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Platform,
  StatusBar,
  Picker,
} from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import {
  getAllShows,
  getAllPresenters,
  createShow,
  updateShow,
  deleteShow,
} from '@/services/storage/CMSStorage';
import { Show, Presenter, ShowCreateInput } from '@/types/cms.types';

const ShowsManagementScreen: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [presenters, setPresenters] = useState<Presenter[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formPresenterId, setFormPresenterId] = useState('');
  const [formSynopsis, setFormSynopsis] = useState('');

  const loadData = async () => {
    const showsData = await getAllShows();
    const presentersData = await getAllPresenters(false);
    setShows(showsData);
    setPresenters(presentersData);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const openCreateModal = () => {
    setEditingShow(null);
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (show: Show) => {
    setEditingShow(show);
    setFormName(show.name);
    setFormTime(show.time);
    setFormPresenterId(show.presenterId);
    setFormSynopsis(show.synopsis);
    setModalVisible(true);
  };

  const resetForm = () => {
    setFormName('');
    setFormTime('');
    setFormPresenterId('');
    setFormSynopsis('');
  };

  const handleSave = async () => {
    if (!formName.trim() || !formTime.trim() || !formPresenterId) {
      Alert.alert('Error', 'Show name, time, and presenter are required');
      return;
    }

    setLoading(true);
    try {
      const showData: ShowCreateInput = {
        name: formName.trim(),
        time: formTime.trim(),
        presenterId: formPresenterId,
        synopsis: formSynopsis.trim(),
      };

      if (editingShow) {
        await updateShow(editingShow.id, showData);
        Alert.alert('Success', 'Show updated successfully');
      } else {
        await createShow(showData);
        Alert.alert('Success', 'Show created successfully');
      }

      setModalVisible(false);
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to save show');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (show: Show) => {
    Alert.alert(
      'Delete Show',
      `Are you sure you want to delete "${show.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteShow(show.id);
            Alert.alert('Success', 'Show deleted');
            loadData();
          },
        },
      ]
    );
  };

  const getPresenterName = (presenterId: string) => {
    if (presenterId === 'dynamic') return 'Dynamic Presenter';
    const presenter = presenters.find(p => p.id === presenterId);
    return presenter?.name || 'Unknown';
  };

  const renderShowCard = (show: Show) => (
    <View key={show.id} style={styles.showCard}>
      <View style={styles.showHeader}>
        <Text style={styles.showName}>{show.name}</Text>
        <Text style={styles.showTime}>{show.time}</Text>
      </View>
      <Text style={styles.showPresenter}>Presenter: {getPresenterName(show.presenterId)}</Text>
      <Text style={styles.showSynopsis} numberOfLines={2}>
        {show.synopsis}
      </Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={() => openEditModal(show)}>
          <Icon name="edit" size={18} color="#2196F3" />
          <Text style={[styles.actionButtonText, { color: '#2196F3' }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(show)}>
          <Icon name="trash" size={18} color="#f44336" />
          <Text style={[styles.actionButtonText, { color: '#f44336' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            {editingShow ? 'Edit Show' : 'Add New Show'}
          </Text>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.label}>Show Name *</Text>
            <TextInput
              style={styles.input}
              value={formName}
              onChangeText={setFormName}
              placeholder="Enter show name"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Time Slot * (e.g., 06:00 - 09:00)</Text>
            <TextInput
              style={styles.input}
              value={formTime}
              onChangeText={setFormTime}
              placeholder="HH:MM - HH:MM"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Presenter *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formPresenterId}
                onValueChange={(value) => setFormPresenterId(value)}
                style={styles.picker}
              >
                <Picker.Item label="Select presenter..." value="" />
                <Picker.Item label="Dynamic Presenter" value="dynamic" />
                {presenters.map(p => (
                  <Picker.Item key={p.id} label={p.name} value={p.id} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Synopsis</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formSynopsis}
              onChangeText={setFormSynopsis}
              placeholder="Enter show synopsis..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={6}
            />
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor="#07477B"
      />
      <View style={styles.header}>
        <Text style={styles.title}>Shows Management</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {shows.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="microphone-slash" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No shows found</Text>
          </View>
        ) : (
          shows.map(renderShowCard)
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={openCreateModal}>
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {renderModal()}
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
    padding: 15,
  },
  showCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  showHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  showName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  showTime: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  showPresenter: {
    fontSize: 14,
    color: '#2196F3',
    marginBottom: 8,
  },
  showSynopsis: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionButtonText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#07477B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#07477B',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalContent: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  modalButtons: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#07477B',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ShowsManagementScreen;
