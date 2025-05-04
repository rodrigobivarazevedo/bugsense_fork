# BugSense Mobile App

A React Native mobile application built with Expo.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Yarn](https://yarnpkg.com/) package manager
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Mobile device, iOS Simulator (XCode for Mac users) and/or Android Studio

## Getting Started

1. Install dependencies:
```bash
yarn install
```

2. Start the development server:
```bash
yarn start
```

This will open the Expo Developer Tools in your browser. From there, you can:
- Press `i` to open in iOS simulator
- Press `a` to open in Android emulator
- Scan the QR code with your phone (using Expo Go app) to run on your device

## Available Scripts

- `yarn start` - Starts the Expo development server
- `yarn ios` - Starts the app in iOS simulator
- `yarn android` - Starts the app in Android emulator
- `yarn web` - Starts the app in web browser
- `yarn test` - Runs the test suite

## Project Structure

```
app/mobile/
├── src/           # Source code
├── index.ts       # Entry point
├── app.json       # Expo configuration
└── package.json   # Dependencies and scripts
```

## Dependencies

This project uses several key dependencies:
- React Native & Expo
- React Navigation for routing
- i18next for internationalization
- Styled Components for styling
- Lottie for animations

## Development

The app is built with TypeScript and follows modern React Native development practices. Make sure to:
1. Write tests for new features
2. Follow the existing code style
3. Update documentation when adding new features

## Testing

Run the test suite:
```bash
yarn test
```

## Troubleshooting

If you encounter any issues:
1. Clear the Metro bundler cache: `yarn start --clear`
2. Delete the `node_modules` folder and run `yarn install` again
3. Make sure your Expo CLI is up to date: `npm install -g expo-cli`
