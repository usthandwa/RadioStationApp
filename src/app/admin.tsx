// app/admin.tsx
import AppNavigation from '@/src/components/AppNavigation';
import AdminPage from '@/src/services/adminDashboard';
import React from 'react';

import { View, StyleSheet } from 'react-native';

export default function AdminScreen() {
  return (
    <View style={styles.container}>
      <AdminPage />
      <AppNavigation showBackButton={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});