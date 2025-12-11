import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity } from 'react-native';
import { Stack, useRouter, usePathname } from 'expo-router';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import { Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@expo/vector-icons/FontAwesome5';
import * as Haptics from 'expo-haptics';
import AppNavigation from '@/src/components/AppNavigation';

export default function Layout() {
  const router = useRouter();
  const pathname = usePathname();

  const handleDeepLink = useCallback((url: string) => {
    try {
      const path = url.replace(/.*?:\/\//g, '').toLowerCase();
      const validRoutes = ['live-stream', 'give', 'prayer', 'podcasts', 'about-us'];

      if (validRoutes.includes(path)) {
        router.push(path as any);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Deep link handling error:', error);
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    let linkingSubscription: any;

    async function setup() {
      try {
        // Setup audio
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          interruptionModeIOS: InterruptionModeIOS.DuckOthers,
          interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false
        });

        // Setup deep linking
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          handleDeepLink(initialUrl);
        }

        linkingSubscription = Linking.addEventListener('url', ({ url }) => handleDeepLink(url));
      } catch (error) {
        console.error('Setup error:', error);
      }
    }

    setup();

    return () => {
      linkingSubscription?.remove();
      // Reset audio mode on unmount
      Audio.setAudioModeAsync({
        playsInSilentModeIOS: false,
        staysActiveInBackground: false,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false
      }).catch(console.error);
    };
  }, [handleDeepLink]);

  const handleBackPress = useCallback(() => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Always navigate to home instead of going back in history
    router.push('/');
  }, [router]);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true,
          animation: 'slide_from_right',
          presentation: 'card',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          header: ({ options, back }) => (
            <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
              <View style={styles.header}>
                <View style={styles.headerContent}>
                  {back && (
                    <TouchableOpacity
                      onPress={handleBackPress}
                      style={styles.backButton}
                      activeOpacity={0.7}
                    >
                      <Icon name="home" size={20} color="#07477B" />
                      <Text style={styles.backText}>Home</Text>
                    </TouchableOpacity>
                  )}
                  <Text style={[styles.headerTitle, !back && styles.headerTitleCentered]}>
                    {options.title}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (Platform.OS === 'ios') {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                      router.push('/menu');
                    }}
                    style={styles.menuButton}
                    activeOpacity={0.7}
                  >
                    <Icon name="bars" size={20} color="#07477B" />
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          ),
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            animation: 'fade'
          }}
        />
        <Stack.Screen
          name="live-stream"
          options={{
            title: "Live Stream",
            animation: 'slide_from_right'
          }}
        />
        <Stack.Screen
          name="give"
          options={{
            title: "Give",
            animation: 'slide_from_right'
          }}
        />
        <Stack.Screen
          name="prayer"
          options={{
            title: "Prayer",
            animation: 'slide_from_right'
          }}
        />
        <Stack.Screen
          name="podcasts"
          options={{
            title: "Podcasts",
            animation: 'slide_from_right'
          }}
        />
        <Stack.Screen
          name="about-us"
          options={{
            title: "About Us",
            animation: 'slide_from_right'
          }}
        />
        <Stack.Screen
          name="menu"
          options={{
            headerShown: false,
            animation: 'slide_from_right'
          }}
        />
      </Stack>
      {pathname && <AppNavigation />}
    </>
  );
}

const styles = StyleSheet.create({
  headerSafeArea: {
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    paddingHorizontal: 16,
  },
  backButton: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    gap: 6,
  },
  backText: {
    color: '#07477B',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 4,
  },
  menuButton: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#07477B',
    letterSpacing: 0.3,
  },
  headerTitleCentered: {
    textAlign: 'center',
  },
});