import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import GiveScreen from '@/screens/main/give/GiveScreen';


export default function GiveRoute() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerTitle: "Give" }} />
      <GiveScreen />
    </View>
  );
}
