/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const ORANGE = '#F36B2A';
export const LIGHT_ORANGE_BG = '#FFF7F3';
export const BORDER_ORANGE = '#FFE1D6';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    orange: ORANGE,
    lightOrangeBg: LIGHT_ORANGE_BG,
    borderOrange: BORDER_ORANGE,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    orange: ORANGE,
    lightOrangeBg: '#2B1A13', // darker orange-tinted bg for dark mode
    borderOrange: '#3A2317', // darker border for dark mode
  },
};
