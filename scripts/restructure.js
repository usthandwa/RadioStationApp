#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = process.cwd();

// Create new directories without deleting
function createDirectories() {
    [
        'app/(drawer)',
        'src/assets/AWRPresenters',
        'src/assets/icons',
        'src/components/navigation',
        'src/components/player',
        'src/components/ui',
        'src/services/api',
        'src/services/player'
    ].forEach(dir => {
        const fullPath = path.join(root, dir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
    });
}

// Move files with path updates
function moveFiles() {
    const moves = {
        'screens/AboutUsScreen.tsx': 'app/(drawer)/about.tsx',
        'screens/GiveScreen.tsx': 'app/(drawer)/give.tsx',
        'screens/HomeScreen.tsx': 'app/(drawer)/home.tsx',
        'screens/LiveStreamScreen.tsx': 'app/(drawer)/live.tsx',
        'screens/PodcastsScreen.tsx': 'app/(drawer)/podcasts.tsx',
        'screens/PrayerScreen.tsx': 'app/(drawer)/prayer.tsx',
        'screens/ShowManagement.tsx': 'app/(drawer)/shows.tsx',
        'screens/SocialScreen.tsx': 'app/(drawer)/social.tsx',
        'components/DrawerContent.tsx': 'src/components/navigation/DrawerContent.tsx',
        'components/PlayerControls.tsx': 'src/components/player/PlayerControls.tsx',
        'services/trackPlayerServices.ts': 'src/services/player/trackPlayerServices.ts',
        'services/cmsApi.ts': 'src/services/api/cmsApi.ts'
    };

    Object.entries(moves).forEach(([oldPath, newPath]) => {
        const fullOldPath = path.join(root, oldPath);
        const fullNewPath = path.join(root, newPath);

        if (fs.existsSync(fullOldPath)) {
            const content = fs.readFileSync(fullOldPath, 'utf8')
                .replace(/from ['"]\.\.\/components\/(.*?)['"]/g, "from '@components/$1'")
                .replace(/from ['"]\.\.\/services\/(.*?)['"]/g, "from '@services/$1'")
                .replace(/from ['"]\.\.\/assets\/(.*?)['"]/g, "from '@assets/$1'");

            fs.mkdirSync(path.dirname(fullNewPath), { recursive: true });
            fs.writeFileSync(fullNewPath, content);
            console.log(`Moved & Updated: ${oldPath} → ${newPath}`);
        }
    });
}

// Update configs without overwriting
function updateConfigs() {
    // Add/update necessary config files here
    const babelConfig = `module.exports = function(api) {
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
};`;

    fs.writeFileSync('babel.config.js', babelConfig);
}

try {
    console.log('Creating directories...');
    createDirectories();

    console.log('Moving files...');
    moveFiles();

    console.log('Updating configs...');
    updateConfigs();

    console.log('Installing dependencies...');
    execSync('npm install expo@50.0.0-preview.8 expo-router@3.1.0 @react-navigation/drawer@6.6.6 react-native-reanimated@3.6.0 react-native-gesture-handler@2.14.0 --legacy-peer-deps', { stdio: 'inherit' });

    console.log('✅ Done!');
} catch (error) {
    console.error('Error:', error);
    process.exit(1);
}