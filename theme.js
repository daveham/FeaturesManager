import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
} from 'react-native-paper';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

const figmaLightColors = {
  primary: '#313951',
  surfaceTint: '#565E77',
  onPrimary: '#FFFFFF',
  primaryContainer: '#545C76',
  onPrimaryContainer: '#FFFFFF',
  secondary: '#005C42',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#0E8462',
  onSecondaryContainer: '#FFFFFF',
  tertiary: '#626102',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#E0DE78',
  onTertiaryContainer: '#454500',
  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',
  background: '#FCF8FB',
  onBackground: '#1B1B1D',
  surface: '#FCF8FB',
  onSurface: '#1B1B1D',
  surfaceVariant: '#E2E2EA',
  onSurfaceVariant: '#45464D',
  outline: '#76777E',
  outlineVariant: '#C6C6CE',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#303032',
  inverseOnSurface: '#F3F0F2',
  inversePrimary: '#BEC6E4',
  primaryFixed: '#DAE2FF',
  onPrimaryFixed: '#121B31',
  primaryFixedDim: '#BEC6E4',
  onPrimaryFixedVariant: '#3E465F',
  secondaryFixed: '#92F6CC',
  onSecondaryFixed: '#002115',
  secondaryFixedDim: '#75D9B1',
  onSecondaryFixedVariant: '#00513A',
  tertiaryFixed: '#E9E780',
  onTertiaryFixed: '#1D1D00',
  tertiaryFixedDim: '#CDCB68',
  onTertiaryFixedVariant: '#4A4900',
  surfaceDim: '#DCD9DB',
  surfaceBright: '#FCF8FB',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F6F3F5',
  surfaceContainer: '#F0EDEF',
  surfaceContainerHigh: '#EAE7EA',
  surfaceContainerHighest: '#E4E2E4',
};

const figmaDarkColors = {
  primary: '#BEC6E4',
  surfaceTint: '#BEC6E4',
  onPrimary: '#283047',
  primaryContainer: '#3C445C',
  onPrimaryContainer: '#D4DBFA',
  secondary: '#75D9B1',
  onSecondary: '#003827',
  secondaryContainer: '#0E8462',
  onSecondaryContainer: '#FFFFFF',
  tertiary: '#FFFCC1',
  onTertiary: '#333200',
  tertiaryContainer: '#D5D36F',
  onTertiaryContainer: '#3E3E00',
  error: '#FFB4AB',
  onError: '#690005',
  errorContainer: '#93000A',
  onErrorContainer: '#FFDAD6',
  background: '#131315',
  onBackground: '#E4E2E4',
  surface: '#131315',
  onSurface: '#E4E2E4',
  surfaceVariant: '#45464D',
  onSurfaceVariant: '#C6C6CE',
  outline: '#909097',
  outlineVariant: '#45464D',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#E4E2E4',
  inverseOnSurface: '#303032',
  inversePrimary: '#565E77',
  primaryFixed: '#DAE2FF',
  onPrimaryFixed: '#121B31',
  primaryFixedDim: '#BEC6E4',
  onPrimaryFixedVariant: '#3E465F',
  secondaryFixed: '#92F6CC',
  onSecondaryFixed: '#002115',
  secondaryFixedDim: '#75D9B1',
  onSecondaryFixedVariant: '#00513A',
  tertiaryFixed: '#E9E780',
  onTertiaryFixed: '#1D1D00',
  tertiaryFixedDim: '#CDCB68',
  onTertiaryFixedVariant: '#4A4900',
  surfaceDim: '#131315',
  surfaceBright: '#39393B',
  surfaceContainerLowest: '#0E0E10',
  surfaceContainerLow: '#1B1B1D',
  surfaceContainer: '#1F1F21',
  surfaceContainerHigh: '#2A2A2C',
  surfaceContainerHighest: '#353436',
};

const MD3ModLight = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...figmaLightColors,
  },
};

const MD3ModDark = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...figmaDarkColors,
  },
};

const NavModLight = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...figmaLightColors,
  },
};

const NavModDark = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    ...figmaDarkColors,
  },
};

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavModLight,
  reactNavigationDark: NavModDark,
  materialLight: MD3ModLight,
  materialDark: MD3ModDark,
});

export const CombinedDefaultTheme = {
  ...MD3LightTheme,
  ...LightTheme,
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
    ...figmaLightColors,
  },
};

export const CombinedDarkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  roundness: 2,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
    ...figmaDarkColors,
  },
};
