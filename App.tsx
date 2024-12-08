import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRegistry } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import LiveStreamScreen from './src/screens/LiveStreamScreen';
import GiveScreen from './src/screens/GiveScreen';
import PrayerScreen from './src/screens/PrayerScreen';
import SocialScreen from './src/screens/SocialScreen';
import PodcastsScreen from './src/screens/PodcastsScreen';
import AboutUsScreen from './src/screens/AboutUsScreen';
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
    </NavigationContainer>
  );
};

AppRegistry.registerComponent('RadioStationApp', () => App);
export default App;