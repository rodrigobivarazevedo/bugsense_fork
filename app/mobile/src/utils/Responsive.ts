import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const baseWidth = 375;
const baseUnit = 16;

export const rem = (size: number): number => {
    const scale = SCREEN_WIDTH / baseWidth;
    const newSize = size * baseUnit * scale;

    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// TODO: Confirm this works for all device sizes