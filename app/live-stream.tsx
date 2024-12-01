import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import LiveStreamScreen from '../src/screens/LiveStreamScreen';

export default function LiveStreamRoute() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerTitle: "Live Stream" }} />
      <LiveStreamScreen />
    </View>
  );
}
