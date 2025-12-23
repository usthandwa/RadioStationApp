/**
 * Presenters Management Screen
 *
 * CRUD interface for radio presenters - list, add, edit, archive, restore
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Image,
  Switch,
  Platform,
  StatusBar,
} from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import {
  getAllPresenters,
  createPresenter,
  updatePresenter,
  archivePresenter,
  restorePresenter,
  deletePresenter,
} from '@/services/storage/CMSStorage';
import { Presenter, PresenterCreateInput } from '@/types/cms.types';
import { useFocusEffect } from '@react-navigation/native';

const PresentersManagementScreen: React.FC = () => {
  const [presenters, setPresenters] = useState<Presenter[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPresenter, setEditingPresenter] = useState<Presenter | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formImagePath, setFormImagePath] = useState('');
  const [formTwitter, setFormTwitter] = useState('');
  const [formInstagram, setFormInstagram] = useState('');
  const [formFacebook, setFormFacebook] = useState('');

  const loadPresenters = async () => {
    const data = await getAllPresenters(showArchived);
    setPresenters(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadPresenters();
    }, [showArchived])
  );

  const openCreateModal = () => {
    setEditingPresenter(null);
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (presenter: Presenter) => {
    setEditingPresenter(presenter);
    setFormName(presenter.name);
    setFormBio(presenter.bio);
    setFormImagePath(presenter.imagePath);
    setFormTwitter(presenter.socials?.twitter || '');
    setFormInstagram(presenter.socials?.instagram || '');
    setFormFacebook(presenter.socials?.facebook || '');
    setModalVisible(true);
  };

  const resetForm = () => {
    setFormName('');
    setFormBio('');
    setFormImagePath('');
    setFormTwitter('');
    setFormInstagram('');
    setFormFacebook('');
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      Alert.alert('Error', 'Presenter name is required');
      return;
    }

    setLoading(true);
    try {
      const presenterData: PresenterCreateInput = {
        name: formName.trim(),
        bio: formBio.trim(),
        imagePath: formImagePath,
        socials: {
          twitter: formTwitter.trim() || undefined,
          instagram: formInstagram.trim() || undefined,
          facebook: formFacebook.trim() || undefined,
        },
      };

      if (editingPresenter) {
        // Update existing
        await updatePresenter(editingPresenter.id, presenterData);
        Alert.alert('Success', 'Presenter updated successfully');
      } else {
        // Create new
        await createPresenter(presenterData);
        Alert.alert('Success', 'Presenter created successfully');
      }

      setModalVisible(false);
      loadPresenters();
    } catch (error) {
      Alert.alert('Error', 'Failed to save presenter');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (presenter: Presenter) => {
    Alert.alert(
      'Archive Presenter',
      `Are you sure you want to archive ${presenter.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          style: 'destructive',
          onPress: async () => {
            await archivePresenter(presenter.id);
            Alert.alert('Success', 'Presenter archived');
            loadPresenters();
          },
        },
      ]
    );
  };

  const handleRestore = async (presenter: Presenter) => {
    await restorePresenter(presenter.id);
    Alert.alert('Success', 'Presenter restored');
    loadPresenters();
  };

  const handleDelete = async (presenter: Presenter) => {
    Alert.alert(
      'Delete Presenter',
      `Are you sure you want to permanently delete ${presenter.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deletePresenter(presenter.id);
            Alert.alert('Success', 'Presenter deleted permanently');
            loadPresenters();
          },
        },
      ]
    );
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera roll permissions are needed to select an image');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormImagePath(result.assets[0].uri);
    }
  };

  const renderPresenterCard = (presenter: Presenter) => (
    <View key={presenter.id} style={styles.presenterCard}>
      <View style={styles.presenterHeader}>
        <Text style={styles.presenterName}>{presenter.name}</Text>
        {presenter.isArchived && <Text style={styles.archivedBadge}>ARCHIVED</Text>}
      </View>
      <Text style={styles.presenterBio} numberOfLines={2}>
        {presenter.bio}
      </Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={() => openEditModal(presenter)}>
          <Icon name="edit" size={18} color="#2196F3" />
          <Text style={[styles.actionButtonText, { color: '#2196F3' }]}>Edit</Text>
        </TouchableOpacity>

        {presenter.isArchived ? (
          <TouchableOpacity style={styles.actionButton} onPress={() => handleRestore(presenter)}>
            <Icon name="refresh" size={18} color="#4CAF50" />
            <Text style={[styles.actionButtonText, { color: '#4CAF50' }]}>Restore</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.actionButton} onPress={() => handleArchive(presenter)}>
            <Icon name="archive" size={18} color="#FF9800" />
            <Text style={[styles.actionButtonText, { color: '#FF9800' }]}>Archive</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(presenter)}>
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
            {editingPresenter ? 'Edit Presenter' : 'Add New Presenter'}
          </Text>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={formName}
              onChangeText={setFormName}
              placeholder="Enter presenter name"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formBio}
              onChangeText={setFormBio}
              placeholder="Enter presenter bio"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>Profile Image</Text>
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <Icon name="image" size={20} color="#07477B" />
              <Text style={styles.imagePickerText}>
                {formImagePath ? 'Change Image' : 'Select Image'}
              </Text>
            </TouchableOpacity>
            {formImagePath && (
              <Text style={styles.imagePathText} numberOfLines={1}>
                {formImagePath}
              </Text>
            )}

            <Text style={styles.sectionTitle}>Social Media</Text>

            <Text style={styles.label}>Twitter</Text>
            <TextInput
              style={styles.input}
              value={formTwitter}
              onChangeText={setFormTwitter}
              placeholder="@username"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Instagram</Text>
            <TextInput
              style={styles.input}
              value={formInstagram}
              onChangeText={setFormInstagram}
              placeholder="@username"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Facebook</Text>
            <TextInput
              style={styles.input}
              value={formFacebook}
              onChangeText={setFormFacebook}
              placeholder="username or page URL"
              placeholderTextColor="#999"
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
        <Text style={styles.title}>Presenters Management</Text>
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Show Archived</Text>
          <Switch value={showArchived} onValueChange={setShowArchived} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {presenters.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="user-times" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {showArchived ? 'No archived presenters' : 'No presenters found'}
            </Text>
          </View>
        ) : (
          presenters.map(renderPresenterCard)
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#07477B',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    marginRight: 10,
    color: '#666',
  },
  scrollContent: {
    padding: 15,
  },
  presenterCard: {
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
  presenterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  presenterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  archivedBadge: {
    backgroundColor: '#FF9800',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
  },
  presenterBio: {
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
    height: 100,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#07477B',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f0f8ff',
  },
  imagePickerText: {
    marginLeft: 10,
    color: '#07477B',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePathText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#07477B',
    marginTop: 20,
    marginBottom: 10,
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

export default PresentersManagementScreen;
