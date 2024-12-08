import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { Linking } from 'react-native';
import AppNavigation from '../src/components/AppNavigation';
import { HeaderBackButton } from '@react-navigation/elements';

export default function Layout() {
  const router = useRouter();

  const handleDeepLink = useCallback((url: string) => {
    try {
      const path = url.replace(/.*?:\/\//g, '').toLowerCase();
      const validRoutes = ['live-stream', 'give', 'prayer', 'podcasts', 'about-us'];
      
      if (validRoutes.includes(path)) {
        router.push(path);
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
          interruptionModeIOS: 2, // Instead of Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS
interruptionModeAndroid: 2, // Instead of Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS
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
        interruptionModeIOS: 1, // Instead of Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS
        interruptionModeAndroid: 1, // Instead of Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false
      }).catch(console.error);
    };
  }, [handleDeepLink]);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true,
          header: ({ options, back }) => (
            <View style={styles.header}>
              {back && (
                <HeaderBackButton
                  onPress={() => router.back()}
                  tintColor="#07477B"
                  labelVisible={false}
                />
              )}
              <Text style={styles.headerTitle}>{options.title}</Text>
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
      <AppNavigation />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#07477B',
  },
});