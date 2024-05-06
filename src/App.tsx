import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Portal, Snackbar } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { CombinedDefaultTheme as NavigationTheme } from '../theme';
import { closeSnackbar } from './state/ui/actions';
import { Details } from './screens/Details.tsx';
import { Home } from './screens/Home.tsx';
import {
  isSnackbarOpenSelector,
  snackbarTextSelector,
} from './state/ui/selectors';
import type { RootStackParamList } from './screens/types.tsx';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const dispatch = useDispatch();

  const snackbarText = useSelector(snackbarTextSelector);
  const isSnackbarOpen = useSelector(isSnackbarOpenSelector);
  const handleDismissSnackbar = () => dispatch(closeSnackbar());

  return (
    <View style={styles.root}>
      <NavigationContainer theme={NavigationTheme}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Details" component={Details} />
        </Stack.Navigator>
      </NavigationContainer>
      <Portal>
        <Snackbar
          duration={isSnackbarOpen ? 3000 : 0}
          visible={isSnackbarOpen}
          onDismiss={handleDismissSnackbar}>
          {snackbarText}
        </Snackbar>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;
