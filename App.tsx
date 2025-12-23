import React from 'react';
import 'expo-router/entry';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRegistry } from 'react-native';
import HomeScreen from './src/screens/main/home/HomeScreen';

import SocialScreen from './src/screens/main/social/SocialScreen';
import PodcastsScreen from './src/screens/main/podcasts/PodcastsScreen';
import LiveStreamScreen from './src/screens/main/live/LiveStreamScreen';
import AboutUsScreen from './src/screens/main/About/AboutUsScreen';
import GiveScreen from './src/screens/main/give/GiveScreen';
import PrayerScreen from './src/screens/main/prayer/PrayerScreen';

// CMS Admin Screens
import CMSDashboardScreen from './src/screens/admin/CMSDashboardScreen';
import PresentersManagementScreen from './src/screens/admin/PresentersManagementScreen';
import ShowsManagementScreen from './src/screens/admin/ShowsManagementScreen';
import LineupEditorScreen from './src/screens/admin/LineupEditorScreen';
import DataManagementScreen from './src/screens/admin/DataManagementScreen';

// import LiveStreamVisualTester from './src/screens/LiveStreamVisualTester';

// In your navigation or main render function:

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="LiveStream" component={LiveStreamScreen} />
        <Stack.Screen name="Give" component={GiveScreen} />
        <Stack.Screen name="Prayer" component={PrayerScreen} />
        <Stack.Screen name="Podcasts" component={PodcastsScreen} />
        <Stack.Screen name="AboutUs" component={AboutUsScreen} />

        {/* CMS Admin Screens */}
        <Stack.Screen name="CMSDashboard" component={CMSDashboardScreen} options={{ title: 'CMS Dashboard' }} />
        <Stack.Screen name="PresentersManagement" component={PresentersManagementScreen} options={{ title: 'Manage Presenters' }} />
        <Stack.Screen name="ShowsManagement" component={ShowsManagementScreen} options={{ title: 'Manage Shows' }} />
        <Stack.Screen name="LineupEditor" component={LineupEditorScreen} options={{ title: 'Edit Lineup' }} />
        <Stack.Screen name="DataManagement" component={DataManagementScreen} options={{ title: 'Data Management' }} />

        {/* <Stack.Screen name="VisualTester" component={LiveStreamVisualTester} /> */}

      </Stack.Navigator>
    </NavigationContainer>
  );
};

AppRegistry.registerComponent('AWRSIDMediaRadio', () => App);
export default App;