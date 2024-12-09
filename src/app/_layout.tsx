import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, Image } from 'react-native';
import { Slot, Stack, useRouter } from 'expo-router';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import { Linking } from 'react-native';

import { HeaderBackButton } from '@react-navigation/elements';
import Menu from '@/components/ui/Menu';
import AppNavigation from '@/navigation/AppNavigation';


export default function Layout() {
  const router = useRouter();
  const [currentAudio, setCurrentAudio] = useState<Audio.Sound | null>(null);

  const handleDeepLink = useCallback((url: string) => {
    try {
      const path = url.replace(/.*?:\/\//g, '').toLowerCase();
      const validRoutes = ['live-stream', 'give', 'prayer', 'podcasts', 'about-us'];
      
      if (validRoutes.includes(path)) {
        router.push(path);
      } else {
        Linking.canOpenURL(url).then(supported => {
          if (supported) {
            router.push('/');
          }
        });
      }
    } catch (error) {
      console.error('Deep link error:', error);
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    let linkingSubscription: ReturnType<typeof Linking.addEventListener>;

    async function setup() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          interruptionModeIOS: InterruptionModeIOS.DuckOthers,
          interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false
        });

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
      if (currentAudio) {
        currentAudio.unloadAsync();
      }
      Audio.setAudioModeAsync({
        playsInSilentModeIOS: false,
        staysActiveInBackground: false,
        interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
        interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false
      }).catch(console.error);
    };
  }, [handleDeepLink, currentAudio]);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true,
          contentStyle: { paddingBottom: 0 },
          header: ({ options, back }) => (
            <View style={[styles.header, { backgroundColor: '#fff' }]}>
              {back && (
                <HeaderBackButton
                  onPress={() => router.back()}
                  tintColor="#07477B"
                  labelVisible={false}
                />
              )}
              <Text style={styles.headerTitle}>{options.title || 'Home'}</Text>
              <Image
                source={require('@/assets/awr_sidmedia_logo.png')}
                style={styles.logo}
                accessibilityLabel="AWR SIDMedia Logo"
              />
              <Menu />
            </View>
          ),
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="live-stream" options={{ title: "Live Stream" }} />
        <Stack.Screen name="give" options={{ title: "Give" }} />
        <Stack.Screen name="prayer" options={{ title: "Prayer" }} />
        <Stack.Screen name="podcasts" options={{ title: "Podcasts" }} />
        <Stack.Screen name="about-us" options={{ title: "About Us" }} />
      </Stack>
      <View style={styles.navigation}>
        <AppNavigation />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Platform.OS === 'ios' ? 88 : 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#07477B',
  },
  logo: {
    width: 100,
    height: 30,
    resizeMode: 'contain',
  },
  navigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  }
});