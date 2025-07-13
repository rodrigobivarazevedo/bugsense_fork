import { Dimensions, PixelRatio } from 'react-native';

/**
 * Responsive utilities for the mobile app.
 *
 * This module provides a set of functions to help with responsive design in the mobile app.
 * It includes utilities for converting between different units of measurement, such as rem, vw, and vh.
 * 
 * PS: React-Native does not directly support rem units, so we use this as a workaround.
 */

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const getAutomaticBaseWidth = () => {
    const pixelDensity = PixelRatio.get();
    const screenArea = SCREEN_WIDTH * SCREEN_HEIGHT;

    const densityFactor = Math.min(pixelDensity, 3);
    const areaFactor = Math.sqrt(screenArea) / 1000;

    let baseWidth = 375;

    if (SCREEN_WIDTH > 600) {
        baseWidth = Math.min(SCREEN_WIDTH * 0.8, 1024);
    }

    const adjustment = (densityFactor * areaFactor) / 2;
    baseWidth = Math.round(baseWidth + adjustment);

    return Math.max(320, Math.min(baseWidth, 1024));
};

export const getCurrentBaseWidth = () => getAutomaticBaseWidth();

export const getScreenInfo = () => ({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    aspectRatio: SCREEN_WIDTH / SCREEN_HEIGHT,
    pixelDensity: PixelRatio.get(),
    baseWidth: getAutomaticBaseWidth(),
    scale: SCREEN_WIDTH / getAutomaticBaseWidth()
});

const BASE_UNIT_REM_TO_PIXEL_RATIO = 16;

export const rem = (size: number): number => {
    const baseWidth = getAutomaticBaseWidth();
    const scale = SCREEN_WIDTH / baseWidth;

    const minScale = SCREEN_WIDTH < 400 ? 0.7 : 0.8;
    const maxScale = SCREEN_WIDTH > 800 ? 1.6 : 1.4;
    const clampedScale = Math.max(minScale, Math.min(scale, maxScale));

    const newSize = size * BASE_UNIT_REM_TO_PIXEL_RATIO * clampedScale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const relativeWidthOrHeight = (percentage: number, isHeight: boolean = false): number => {
    const dimension = isHeight ? SCREEN_HEIGHT : SCREEN_WIDTH;
    const newSize = (dimension * percentage) / 100;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const vw = (percentage: number): number => relativeWidthOrHeight(percentage, false);
export const vh = (percentage: number): number => relativeWidthOrHeight(percentage, true);
