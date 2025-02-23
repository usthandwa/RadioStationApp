import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRegistry } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import LiveStreamScreen from './src/screens/LiveStreamScreen';
import GiveScreen from './src/screens/GiveScreen';
import PrayerScreen from './src/screens/PrayerScreen';
import PodcastsScreen from './src/screens/PodcastsScreen';
import AboutUsScreen from './src/screens/AboutUsScreen';
import ErrorBoundary from './src/components/ErrorBoundary';
import AdminPage from './src/services/adminDashboard';
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
        {/* <Stack.Screen name="VisualTester" component={LiveStreamVisualTester} /> */}
      </Stack.Navigator>
      <ErrorBoundary>
      <AdminPage />
    </ErrorBoundary>
    </NavigationContainer>
  );
};
AppRegistry.registerComponent('awrsidmedia', () => App);
export default App;