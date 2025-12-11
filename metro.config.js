const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Set src as the app directory for expo-router
config.watchFolders = [path.resolve(__dirname, 'src')];

module.exports = config;
