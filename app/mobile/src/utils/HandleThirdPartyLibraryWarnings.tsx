import { LogBox } from 'react-native';

// NOTE: This is a standard approach to handle non-critical warnings from third party libraries in React Native.

const WARNINGS_TO_SUPPRESS = [
    'Support for defaultProps will be removed from function components', // react-native-country-picker-modal
];

export const handleThirdPartyLibraryWarnings = () => {
    LogBox.ignoreLogs(WARNINGS_TO_SUPPRESS);
};
