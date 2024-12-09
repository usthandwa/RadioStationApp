import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import PodcastsScreen from '@/screens/main/podcasts/PodcastsScreen';


export default function PodcastsRoute() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerTitle: "Podcasts" }} />
      <PodcastsScreen />
    </View>
  );
}
