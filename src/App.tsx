import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal, Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import { smugmugLoadFromLocalStorageAction } from 'state/api/actions';
import { closeSnackbar } from 'state/ui/actions';
import {
  isSnackbarOpenSelector,
  snackbarTextSelector,
} from 'state/ui/selectors';
import { makeDataRequestMeta } from 'state/utilities';

import { CombinedDefaultTheme as NavigationTheme } from '../theme';
import { AppDrawer } from './AppDrawer.tsx';

function App(): React.JSX.Element {
  const dispatch = useDispatch();

  const snackbarText = useSelector(snackbarTextSelector);
  const isSnackbarOpen = useSelector(isSnackbarOpenSelector);
  const handleDismissSnackbar = () => dispatch(closeSnackbar());

  useEffect(() => {
    setTimeout(() => {
      dispatch(smugmugLoadFromLocalStorageAction({}, makeDataRequestMeta()));
    }, 1000);
  });

  return (
    <View style={styles.root}>
      <NavigationContainer theme={NavigationTheme}>
        <AppDrawer />
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
