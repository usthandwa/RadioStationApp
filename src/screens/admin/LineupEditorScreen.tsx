/**
 * Lineup Editor Screen
 *
 * Edit weekday, Friday, and weekend schedules
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import {
  getAllSchedules,
  getAllShows,
  updateSchedule,
} from '@/services/storage/CMSStorage';
import { Schedule, Show } from '@/types/cms.types';

const LineupEditorScreen: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<'weekday' | 'friday' | 'weekend'>('weekday');

  const loadData = async () => {
    const schedulesData = await getAllSchedules();
    const showsData = await getAllShows();
    setSchedules(schedulesData);
    setShows(showsData);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const getSchedule = () => {
    return schedules.find(s => s.type === selectedSchedule);
  };

  const getShowName = (showId: string) => {
    const show = shows.find(s => s.id === showId);
    return show ? `${show.name} (${show.time})` : 'Unknown Show';
  };

  const moveShowUp = async (index: number) => {
    const schedule = getSchedule();
    if (!schedule || index === 0) return;

    const newShowIds = [...schedule.showIds];
    [newShowIds[index], newShowIds[index - 1]] = [newShowIds[index - 1], newShowIds[index]];

    await updateSchedule(schedule.id, { showIds: newShowIds });
    await loadData();
  };

  const moveShowDown = async (index: number) => {
    const schedule = getSchedule();
    if (!schedule || index === schedule.showIds.length - 1) return;

    const newShowIds = [...schedule.showIds];
    [newShowIds[index], newShowIds[index + 1]] = [newShowIds[index + 1], newShowIds[index]];

    await updateSchedule(schedule.id, { showIds: newShowIds });
    await loadData();
  };

  const removeShow = async (index: number) => {
    const schedule = getSchedule();
    if (!schedule) return;

    Alert.alert(
      'Remove Show',
      'Remove this show from the schedule?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const newShowIds = schedule.showIds.filter((_, i) => i !== index);
            await updateSchedule(schedule.id, { showIds: newShowIds });
            await loadData();
            Alert.alert('Success', 'Show removed from schedule');
          },
        },
      ]
    );
  };

  const addShow = async (showId: string) => {
    const schedule = getSchedule();
    if (!schedule) return;

    const newShowIds = [...schedule.showIds, showId];
    await updateSchedule(schedule.id, { showIds: newShowIds });
    await loadData();
    Alert.alert('Success', 'Show added to schedule');
  };

  const renderScheduleTab = (type: 'weekday' | 'friday' | 'weekend', label: string) => (
    <TouchableOpacity
      style={[styles.tab, selectedSchedule === type && styles.activeTab]}
      onPress={() => setSelectedSchedule(type)}
    >
      <Text style={[styles.tabText, selectedSchedule === type && styles.activeTabText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const currentSchedule = getSchedule();
  const availableShows = shows.filter(
    show => !currentSchedule?.showIds.includes(show.id)
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor="#07477B"
      />
      <View style={styles.header}>
        <Text style={styles.title}>Lineup Editor</Text>
      </View>

      <View style={styles.tabs}>
        {renderScheduleTab('weekday', 'Monday-Thursday')}
        {renderScheduleTab('friday', 'Friday')}
        {renderScheduleTab('weekend', 'Weekend')}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Current Lineup</Text>
        {currentSchedule?.showIds.map((showId, index) => (
          <View key={`${showId}-${index}`} style={styles.showItem}>
            <View style={styles.showInfo}>
              <Text style={styles.orderNumber}>{index + 1}</Text>
              <Text style={styles.showNameText}>{getShowName(showId)}</Text>
            </View>
            <View style={styles.showActions}>
              <TouchableOpacity
                onPress={() => moveShowUp(index)}
                disabled={index === 0}
                style={styles.actionBtn}
              >
                <Icon name="arrow-up" size={18} color={index === 0 ? '#ccc' : '#2196F3'} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => moveShowDown(index)}
                disabled={index === (currentSchedule?.showIds.length || 0) - 1}
                style={styles.actionBtn}
              >
                <Icon
                  name="arrow-down"
                  size={18}
                  color={index === (currentSchedule?.showIds.length || 0) - 1 ? '#ccc' : '#2196F3'}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeShow(index)} style={styles.actionBtn}>
                <Icon name="trash" size={18} color="#f44336" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {availableShows.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Available Shows</Text>
            {availableShows.map(show => (
              <TouchableOpacity
                key={show.id}
                style={styles.availableShow}
                onPress={() => addShow(show.id)}
              >
                <Text style={styles.availableShowText}>
                  {show.name} ({show.time})
                </Text>
                <Icon name="plus-circle" size={24} color="#4CAF50" />
              </TouchableOpacity>
            ))}
          </>
        )}
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#07477B',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#07477B',
  },
  scrollContent: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#07477B',
    marginTop: 10,
    marginBottom: 15,
  },
  showItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  showInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#07477B',
    marginRight: 15,
    minWidth: 30,
  },
  showNameText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  showActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 8,
    marginLeft: 5,
  },
  availableShow: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availableShowText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
});

export default LineupEditorScreen;
