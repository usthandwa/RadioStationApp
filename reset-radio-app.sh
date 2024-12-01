#!/bin/bash

echo "Starting AWR_Sidmedia Radio reset for Expo..."

# Create a temporary directory for backing up src and App.tsx
mkdir -p temp_backup

# Backup src folder and App.tsx
echo "Backing up src folder and App.tsx..."
cp -R src temp_backup/
cp reset-radio-app.sh temp_backup/
cp App.tsx temp_backup/

# Remove all files and folders except the script and temp_backup
find . -maxdepth 1 ! -name 'reset-radio-app.sh' ! -name 'temp_backup' ! -name '.' ! -name '..' -exec rm -rf {} +

# Initialize new Expo project
echo "Initializing new Expo project..."
npx create-expo-app@latest AWR_Sidmedia RadioExpo -t expo-template-blank-typescript

# Move the new project files to the current directory
echo "Moving new project files..."
mv AWR_Sidmedia RadioExpo/* .
mv AWR_Sidmedia RadioExpo/.[!.]* .
rmdir AWR_Sidmedia RadioExpo

# Restore src folder and App.tsx
echo "Restoring src folder and App.tsx..."
rm -rf src
rm App.tsx
mv temp_backup/src .
mv temp_backup/App.tsx .
mv temp_backup/reset-radio-app.sh .

# Copy assets
echo "Copying assets..."
mkdir -p assets
cp src/assets/splash.png assets/
cp src/assets/adaptive-icon.png assets/
cp src/assets/icon.png assets/
cp src/assets/favicon.png assets/

# Clean up
rm -rf temp_backup

# Install dependencies
echo "Installing dependencies..."
npx expo install react@18.2.0 react-native@0.72.3 expo-status-bar@~1.6.0 \
@expo/vector-icons@^14.0.0 @react-native-async-storage/async-storage@1.18.2 \
@react-native-community/masked-view@0.1.11 @react-navigation/native@^6.1.18 \
@react-navigation/stack@^6.4.1 react-native-gesture-handler@~2.12.0 \
react-native-reanimated@~3.3.0 react-native-safe-area-context@4.6.3 \
react-native-screens@~3.22.0 react-native-vector-icons@10.2.0 \
react-native-webview@13.2.2 expo-av@~13.4.1 expo-background-fetch@~11.3.0 \
expo-notifications@~0.20.1 expo-sharing@~11.5.0 expo-linking@~5.0.2 \
expo-splash-screen

# Install dev dependencies
echo "Installing dev dependencies..."
npm install --save-dev @babel/core@^7.25.7 @babel/preset-env@^7.25.7 \
@babel/runtime@^7.25.7 @react-native/babel-preset@0.75.4 \
@react-native/eslint-config@0.75.4 @react-native/metro-config@0.75.4 \
@react-native/typescript-config@0.75.4 @types/react@~18.2.14 \
@types/react-native-vector-icons@6.4.18 @types/react-test-renderer@18.3.0 \
babel-jest@^29.7.0 eslint@^8.57.1 jest@^29.7.0 prettier@2.8.8 \
react-test-renderer@18.3.1 typescript@^5.1.3

# Update app.json for Expo
echo "Updating app.json for Expo..."
cat > app.json << EOL
{
  "expo": {
    "name": "AWR_Sidmedia Radio",
    "slug": "AWR_Sidmedia Radio",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
EOL

# Update babel.config.js for Expo
echo "Updating babel.config.js for Expo..."
cat > babel.config.js << EOL
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
EOL

# Create eas.json for EAS build configuration
echo "Creating eas.json..."
cat > eas.json << EOL
{
  "cli": {
    "version": ">= 3.13.3"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
EOL

# Update App.tsx
echo "Updating App.tsx..."
cat > App.tsx << EOL
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import LiveStreamScreen from './src/screens/LiveStreamScreen';
import GiveScreen from './src/screens/GiveScreen';
import PrayerScreen from './src/screens/PrayerScreen';
import SocialScreen from './src/screens/SocialScreen';
import PodcastsScreen from './src/screens/PodcastsScreen';
import AboutUsScreen from './src/screens/AboutUsScreen';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
EOL

# Create a README.md file with instructions
echo "Creating README.md..."
cat > README.md << EOL
# AWR_Sidmedia Radio (Expo version)

This is the Expo version of the AWR_Sidmedia Radio.

## Getting Started

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`
   npx expo start
   \`\`\`

3. Run on Android:
   \`\`\`
   npx expo run:android
   \`\`\`

4. Run on Web:
   \`\`\`
   npx expo start --web
   \`\`\`

5. Build for production:
   \`\`\`
   eas build --platform android
   eas build --platform web
   \`\`\`

## Notes

- Make sure to update the \`app.json\` file with your app's specific configurations.
- You may need to adjust some code in the screen components to work with Expo's APIs.
- For audio streaming, use the Expo AV module instead of react-native-track-player.
EOL

# Final cleanup
echo "Performing final cleanup..."
watchman watch-del-all
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-map-*

echo "AWR_Sidmedia Radio reset for Expo complete!"
echo "Please review your project, especially the App.tsx and any Expo-specific configurations."