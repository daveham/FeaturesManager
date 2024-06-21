import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { Authentication } from 'screens/Authentication';
import { Details } from 'screens/Details';
import { Explore } from 'screens/Explore';
import { Home } from 'screens/Home';
import { RootDrawerParamList } from 'screens/types.tsx';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export function AppDrawer(): React.JSX.Element {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Explore" component={Explore} />
      <Drawer.Screen name="Authentication" component={Authentication} />
      <Drawer.Screen name="Details" component={Details} />
    </Drawer.Navigator>
  );
}
