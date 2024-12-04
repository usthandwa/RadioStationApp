#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = process.cwd();

function executeCommand(command) {
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Error executing command: ${command}`);
        process.exit(1);
    }
}

// Migration mappings
const fileMappings = {
    'screens/AboutUsScreen.tsx': 'app/(drawer)/about.tsx',
    'screens/GiveScreen.tsx': 'app/(drawer)/give.tsx',
    'screens/HomeScreen.tsx': 'app/(drawer)/home.tsx',
    'screens/LiveStreamScreen.tsx': 'app/(drawer)/live.tsx',
    'screens/PodcastsScreen.tsx': 'app/(drawer)/podcasts.tsx',
    'screens/PrayerScreen.tsx': 'app/(drawer)/prayer.tsx',
    'screens/ShowManagement.tsx': 'app/(drawer)/shows.tsx',
    'screens/SocialScreen.tsx': 'app/(drawer)/social.tsx',
    'components/navigation/DrawerContent.tsx': 'src/components/navigation/DrawerContent.tsx',
    'components/player/PlayerControls.tsx': 'src/components/player/PlayerControls.tsx',
    'services/trackPlayerServices.ts': 'src/services/player/trackPlayerServices.ts',
    'services/cmsApi.ts': 'src/services/api/cmsApi.ts'
};

function updateImportPaths(content) {
    return content
        .replace(/from ['"]\.\.\/components\/(.*?)['"]/g, "from '@components/$1'")
        .replace(/from ['"]\.\.\/services\/(.*?)['"]/g, "from '@services/$1'")
        .replace(/from ['"]\.\.\/assets\/(.*?)['"]/g, "from '@assets/$1'")
        .replace(/from ['"]\.\.\/screens\/(.*?)['"]/g, "from '../$1'");
}

function migrateFiles() {
    Object.entries(fileMappings).forEach(([source, dest]) => {
        if (fs.existsSync(source)) {
            const content = fs.readFileSync(source, 'utf8');
            const updatedContent = updateImportPaths(content);
            fs.mkdirSync(path.dirname(dest), { recursive: true });
            fs.writeFileSync(dest, updatedContent);
            console.log(`Migrated: ${source} → ${dest}`);
        }
    });
}

// Backup essential files
console.log('Creating backup...');
fs.mkdirSync('temp_backup', { recursive: true });
['assets', 'package.json'].forEach(item => {
    if (fs.existsSync(item)) {
        fs.cpSync(item, `temp_backup/${item}`, { recursive: true });
    }
});

// Clean directory
console.log('Cleaning project...');
fs.readdirSync(root)
    .filter(file => !['temp_backup', 'node_modules', '.git'].includes(file))
    .forEach(file => fs.rmSync(path.join(root, file), { recursive: true, force: true }));

// Create project structure
console.log('Creating structure...');
[
    'app/(drawer)',
    'src/assets/AWRPresenters',
    'src/assets/icons',
    'src/components/navigation',
    'src/components/player',
    'src/components/ui',
    'src/services/api',
    'src/services/player',
    'src/types'
].forEach(dir => fs.mkdirSync(dir, { recursive: true }));

// Create base files
const files = {
    'app/_layout.tsx': `
import { Drawer } from 'expo-router/drawer';
import DrawerContent from '../src/components/navigation/DrawerContent';

export default function RootLayout() {
    return (
        <Drawer drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen name="(drawer)" options={{ headerShown: false }} />
        </Drawer>
    );
}`,
    'app.json': JSON.stringify({
        expo: {
            name: "AWR SIDMedia Radio",
            slug: "awr-sidmedia-radio",
            version: "1.0.0",
            orientation: "portrait",
            scheme: "awrsidmedia",
            icon: "./src/assets/icon.png",
            splash: {
                image: "./src/assets/splash.png",
                resizeMode: "contain",
                backgroundColor: "#ffffff"
            },
            ios: {
                bundleIdentifier: "com.szama.AWRSidMediaRadioIOS",
                infoPlist: { UIBackgroundModes: ["audio"] }
            },
            android: {
                package: "com.szama.AWRSidMediaRadio",
                permissions: ["AUDIO_RECORDING", "READ_EXTERNAL_STORAGE"]
            },
            plugins: ["expo-router"]
        }
    }, null, 2),
    'babel.config.js': `module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      ['module-resolver', {
        root: ['./src'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@assets': './src/assets',
          '@services': './src/services'
        }
      }]
    ]
  };
};`,
    'tsconfig.json': JSON.stringify({
        extends: "expo/tsconfig.base",
        compilerOptions: {
            strict: true,
            baseUrl: ".",
            paths: {
                "@/*": ["src/*"],
                "@components/*": ["src/components/*"],
                "@assets/*": ["src/assets/*"],
                "@services/*": ["src/services/*"]
            }
        }
    }, null, 2)
};

// Execute in order
async function main() {
    // Create base structure
    Object.entries(files).forEach(([file, content]) => {
        fs.writeFileSync(file, content.trim());
    });

    // Restore assets
    console.log('Restoring assets...');
    if (fs.existsSync('temp_backup/assets')) {
        fs.cpSync('temp_backup/assets', 'src/assets', { recursive: true });
    }

    // Migrate files
    console.log('Starting migration...');
    migrateFiles();

    // Install dependencies
    console.log('Installing dependencies...');
    executeCommand('npm install expo@50.0.0-preview.8 expo-router@3.1.0 @react-navigation/drawer@6.6.6 react-native-reanimated@3.6.0 react-native-gesture-handler@2.14.0 expo-av@13.10.0 @react-native-async-storage/async-storage@1.21.0 --legacy-peer-deps');
   
    // Cleanup
    fs.rmSync('temp_backup', { recursive: true });

    console.log('\nReset and migration complete! Run: npm install && npx expo start');
}

main().catch(console.error);