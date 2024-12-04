// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import TabBarIcon from '@components/navigation/TabBarIcon';

import { Colors } from 'constants/Colors';
import { useColorScheme } from 'hooks/useColorScheme';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme]?.tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}