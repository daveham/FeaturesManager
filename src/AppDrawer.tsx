import React from 'react';
import { Icon } from 'react-native-paper';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { Authentication } from 'screens/Authentication';
import { Details } from 'screens/Details';
import { Explore } from 'screens/Explore';
import { Home } from 'screens/Home';
import { RootDrawerParamList } from 'screens/types.tsx';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export function AppDrawer(): React.JSX.Element {
  // Due to inline handler for "drawerIcon" property in Drawer.Screen options.
  /* eslint-disable react/no-unstable-nested-components */
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerIcon: ({ color, size, focused }) => (
            <Icon
              source={focused ? 'camera' : 'camera-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Explore"
        component={Explore}
        options={{
          drawerIcon: ({ color, size, focused }) => (
            <Icon
              source={focused ? 'compass' : 'compass-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Authentication"
        component={Authentication}
        options={{
          drawerIcon: ({ color, size, focused }) => (
            <Icon
              source={focused ? 'shield-lock' : 'shield-lock-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Details"
        component={Details}
        options={{
          drawerIcon: ({ color, size, focused }) => (
            <Icon
              source={focused ? 'tooltip-text' : 'tooltip-text-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
  /* eslint-enable react/no-unstable-nested-components */
}
