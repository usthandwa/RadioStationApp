import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface AppNavigationProps {
  showBackButton?: boolean;
}

const AppNavigation: React.FC<AppNavigationProps> = ({ showBackButton = false }) => {
  const router = useRouter();
  const currentPath = usePathname();

  const routes = [
    { name: 'Home', icon: 'home', path: '/' },
    { name: 'Podcasts', icon: 'podcast', path: '/podcasts' },
    { name: 'Give', icon: 'hand-holding-heart', path: '/give' },
    { name: 'Prayer', icon: 'praying-hands', path: '/prayer' },
    { name: 'More', icon: 'ellipsis-h', path: '/about-us' },
  ];

  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="arrow-left" size={24} color="#07477B" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      )}
      {routes.map((route) => (
        <TouchableOpacity
          key={route.name}
          style={[
            styles.tabItem,
            currentPath === route.path && styles.activeTab
          ]}
          onPress={() => router.push(route.path)}
        >
          <Icon name={route.icon} size={24} color={currentPath === route.path ? '#07477B' : '#666'} />
          <Text style={[
            styles.tabText,
            currentPath === route.path && styles.activeTabText
          ]}>
            {route.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tabItem: {
    alignItems: 'center',
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#07477B',
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  activeTabText: {
    color: '#07477B',
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 10,
    top: 10,
  },
  backText: {
    marginLeft: 5,
    color: '#07477B',
    fontSize: 16,
  },
});

export default AppNavigation;