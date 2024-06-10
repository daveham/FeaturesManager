import {
  DrawerNavigationProp,
  DrawerScreenProps,
} from '@react-navigation/drawer';
// import type {
//   NativeStackNavigationProp,
//   NativeStackScreenProps,
// } from '@react-navigation/native-stack';

// export type RootStackParamList = {
//   Home: undefined;
//   Details: undefined;
//   Authentication: undefined;
// };

export type RootDrawerParamList = {
  Home: undefined;
  Details: undefined;
  Authentication: undefined;
};

export type HomeScreenProps = DrawerScreenProps<RootDrawerParamList, 'Home'>;

export type AuthenticationScreenProps = DrawerScreenProps<
  RootDrawerParamList,
  'Authentication'
>;

export type DetailsScreenProps = DrawerScreenProps<
  RootDrawerParamList,
  'Details'
>;

export type HomeScreenNavigationProp = DrawerNavigationProp<
  RootDrawerParamList,
  'Home'
>;
