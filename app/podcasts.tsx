import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import PodcastsScreen from '../src/screens/PodcastsScreen';

export default function PodcastsRoute() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerTitle: "Podcasts" }} />
      <PodcastsScreen />
    </View>
  );
}
