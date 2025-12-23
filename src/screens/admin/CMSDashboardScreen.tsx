/**
 * CMS Dashboard Screen
 *
 * Main admin dashboard for managing presenters, shows, and lineups.
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import { initializeStorage } from '@/services/storage/CMSStorage';
import { useNavigation } from '@react-navigation/native';

interface DashboardCardProps {
  title: string;
  icon: string;
  onPress: () => void;
  color: string;
  description: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon, onPress, color, description }) => (
  <TouchableOpacity style={[styles.card, { borderLeftColor: color }]} onPress={onPress}>
    <View style={styles.cardHeader}>
      <Icon name={icon as any} size={32} color={color} />
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    <Text style={styles.cardDescription}>{description}</Text>
  </TouchableOpacity>
);

const CMSDashboardScreen: React.FC = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Initialize storage on mount
    initializeStorage().catch(error => {
      console.error('Failed to initialize storage:', error);
    });
  }, []);

  const navigateTo = (screen: string) => {
    (navigation as any).navigate(screen);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor="#07477B"
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Icon name="dashboard" size={40} color="#07477B" />
          <Text style={styles.title}>CMS Dashboard</Text>
          <Text style={styles.subtitle}>Manage your radio station content</Text>
        </View>

        <View style={styles.cardsContainer}>
          <DashboardCard
            title="Presenters"
            icon="user"
            color="#2196F3"
            description="Add, edit, archive, and manage radio presenters"
            onPress={() => navigateTo('PresentersManagement')}
          />

          <DashboardCard
            title="Shows"
            icon="microphone"
            color="#4CAF50"
            description="Manage show details, synopses, and assignments"
            onPress={() => navigateTo('ShowsManagement')}
          />

          <DashboardCard
            title="Lineup Editor"
            icon="calendar"
            color="#FF9800"
            description="Edit weekday, Friday, and weekend schedules"
            onPress={() => navigateTo('LineupEditor')}
          />

          <DashboardCard
            title="Data Management"
            icon="database"
            color="#9C27B0"
            description="Export, import, and backup your CMS data"
            onPress={() => navigateTo('DataManagement')}
          />
        </View>

        <View style={styles.infoBox}>
          <Icon name="info-circle" size={20} color="#07477B" />
          <Text style={styles.infoText}>
            This is a local CMS. All changes are stored on this device. Use Data Management to backup your content.
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
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#07477B',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  cardsContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 15,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#07477B',
    lineHeight: 20,
  },
});

export default CMSDashboardScreen;
