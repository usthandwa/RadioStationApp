import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Haptics from 'expo-haptics';

interface AppNavigationProps {
  showBackButton?: boolean;
}

const AppNavigation: React.FC<AppNavigationProps> = ({ showBackButton = false }) => {
  const router = useRouter();
  const currentPath = usePathname();
  const scaleAnims = useRef<{ [key: string]: Animated.Value }>({}).current;

  const routes = [
    { name: 'Home', icon: 'home', path: '/' },
    { name: 'Podcasts', icon: 'podcast', path: '/podcasts' },
    { name: 'Give', icon: 'heart', path: '/give' },
    { name: 'Prayer', icon: 'praying-hands', path: '/prayer' },
    { name: 'More', icon: 'ellipsis-h', path: '/about-us' },
  ];

  // Initialize animation values
  routes.forEach((route) => {
    if (!scaleAnims[route.path]) {
      scaleAnims[route.path] = new Animated.Value(1);
    }
  });

  const handlePress = (path: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Animate press
    Animated.sequence([
      Animated.timing(scaleAnims[path], {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnims[path], {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    router.push(path as any);
  };

  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (Platform.OS === 'ios') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            router.back();
          }}
          activeOpacity={0.7}
        >
          <Icon name="arrow-left" size={24} color="#07477B" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      )}
      {routes.map((route) => {
        const isActive = currentPath === route.path;
        return (
          <Animated.View
            key={route.name}
            style={{
              transform: [{ scale: scaleAnims[route.path] }],
            }}
          >
            <TouchableOpacity
              style={[
                styles.tabItem,
                isActive && styles.activeTab
              ]}
              onPress={() => handlePress(route.path)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.iconContainer,
                isActive && styles.activeIconContainer
              ]}>
                <Icon
                  name={route.icon}
                  size={22}
                  color={isActive ? '#fff' : '#666'}
                />
              </View>
              <Text style={[
                styles.tabText,
                isActive && styles.activeTabText
              ]}>
                {route.name}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    minWidth: 64,
  },
  activeTab: {
    // Removed border-top in favor of background indicator
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    backgroundColor: 'transparent',
  },
  activeIconContainer: {
    backgroundColor: '#07477B',
    ...Platform.select({
      ios: {
        shadowColor: '#07477B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  tabText: {
    fontSize: 11,
    marginTop: 2,
    color: '#666',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  activeTabText: {
    color: '#07477B',
    fontWeight: '700',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 16,
    top: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  backText: {
    marginLeft: 6,
    color: '#07477B',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AppNavigation;