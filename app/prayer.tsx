import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import PrayerScreen from '../src/screens/PrayerScreen';

export default function PrayerRoute() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerTitle: "Prayer" }} />
      <PrayerScreen />
    </View>
  );
}
