# AWR SIDMedia Radio

## Description
The AWR SIDMedia Radio Station App is a mobile application built with React Native and Expo, designed to provide listeners with easy access to live streams, podcasts, and program schedules for AWR SIDMedia. This app offers a user-friendly interface for enjoying radio content on various platforms.

## Features
- Live radio streaming
- Podcast library with on-demand playback
- Program schedule display
- Social media integration
- Donation/Give functionality
- Prayer request submission
- About Us information

## Technologies Used
- React Native
- Expo
- TypeScript
- React Navigation
- Expo AV for audio streaming
- React Native WebView
- Context API for state management
- Track Player Services for audio handling

## Prerequisites
Before you begin, ensure you have met the following requirements:
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (for local testing)

## Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/AWR_SIDMedia_Radio.git
```

2. Navigate to the project directory:
```bash
cd AWR_SIDMedia_Radio
```

3. Install dependencies:
```bash
npm install
```

## Project Structure
```
src/
├── assets/
│   ├── AWRPresenters/
│   └── icons/
├── components/
│   ├── AppNavigation.tsx
│   ├── DrawerContent.tsx
│   ├── EditableField.tsx
│   ├── ImageUploader.tsx
│   └── Menu.tsx
├── context/
│   └── UserContext.tsx
├── screens/
│   ├── AboutUsScreen.tsx
│   ├── GiveScreen.tsx
│   ├── HomeScreen.tsx
│   ├── LiveStreamScreen.tsx
│   ├── PodcastsScreen.tsx
│   ├── PrayerScreen.tsx
│   ├── ShowManagement.tsx
│   └── SocialScreen.tsx
├── services/
│   ├── cmsApi.ts
│   └── trackPlayerServices.ts
└── types/
    └── auth.ts
```

## Running the App
To run the app locally:
1. Start the Expo development server:
```bash
expo start
```
2. Use the Expo Go app on your mobile device to scan the QR code, or run on an emulator.

## Building for Production
1. For Android:
```bash
eas build --platform android
```

2. For iOS:
```bash
eas build --platform ios
```

## Configuration
The app uses the following main configuration files:
- `app.json` - Main Expo configuration
- `babel.config.js` - Babel configuration
- `tsconfig.json` - TypeScript configuration

## Content Management
The app integrates with a headless CMS for content management. API integration is handled through the `services/cmsApi.ts` file.

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
Project Maintainer: Zanele Zama - zanele@awrsidmedia.org
Project Link: https://github.com/yourusername/AWR_SIDMedia_Radio