# AWR SIDmedia Radio Station App

## Description

The AWR SIDmedia Radio Station App is a mobile application built with React Native and Expo, designed to provide listeners with easy access to live streams, podcasts, and program schedules for AWR SIDmedia. This app offers a user-friendly interface for enjoying radio content on various platforms.

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
- React Navigation (Stack Navigator)
- Expo AV for audio streaming
- React Native WebView for embedded content

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (for local testing)

## Installation

To install the AWR SIDmedia Radio Station App, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/szama/RadioStationApp.git
   ```

2. Navigate to the project directory:
   ```
   cd RadioStationApp
   ```

3. Install dependencies:
   ```
   npm install
   ```

## Running the App

To run the app locally:

1. Start the Expo development server:
   ```
   expo start
   ```

2. Use the Expo Go app on your mobile device to scan the QR code, or run on an emulator.

## Project Structure

- `App.tsx` - Main application component with navigation setup
- `src/` - Contains the main application code
  - `screens/` - Individual screen components
    - `HomeScreen.tsx`
    - `LiveStreamScreen.tsx`
    - `GiveScreen.tsx`
    - `PrayerScreen.tsx`
    - `PodcastsScreen.tsx`
    - `AboutUsScreen.tsx`
    - `SocialScreen.tsx`
   - `Components/` -reusable content
    - `AppNavigation.tsx`
    - `trackPlayerServices.ts`
- `assets/` - Images, fonts, and other static assets

## Configuration

The project uses the following configuration in `app.json`:

- Name: "RadioStationApp"
- Slug: "RadioStationApp"
- Version: "1.0.0"
- Scheme: "awrsidmedia"
- Orientation: portrait
- iOS bundle identifier: "com.szama.RadioStationAppIOS"
- Android package: "com.szama.RadioStationApp"

For full configuration details, refer to the `app.json` file in the project root.

## Content Management System (CMS)

This app uses Strapi as a headless CMS to manage content. To set up the CMS:

1. Install Strapi globally: `npm install -g strapi`
2. Create a new Strapi project: `strapi new awrsidmedia-cms --quickstart`
3. Configure content types in the Strapi admin panel (shows, podcasts, live stream info, prayer requests)
4. Update the `API_URL` in `src/services/cmsApi.ts` to point to your Strapi instance

For more information on using Strapi, refer to the [Strapi documentation](https://strapi.io/documentation).

## Building for Production

To create a production build:

1. For Android:
   ```
   eas build --platform android
   ```

2. For iOS:
   ```
   eas build --platform ios
   ```

Follow the prompts to complete the build process.

## Contributing

Contributions to the AWR SIDmedia Radio Station App are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

AWR SIDmedia - contact@awrsidmedia.org

Project Link: [https://github.com/szama/RadioStationApp](https://github.com/szama/RadioStationApp)

## Acknowledgements

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript](https://www.typescriptlang.org/)