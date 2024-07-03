import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { Portal, Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import { smugmugLoadFromLocalStorageAction } from 'state/api/actions';
import { closeSnackbar } from 'state/ui/actions';
import {
  isSnackbarOpenSelector,
  snackbarContentSelector,
} from 'state/ui/selectors';
import { makeDataRequestMeta } from 'state/utilities';

import { theme } from '../theme';
import { AppDrawer } from './AppDrawer.tsx';

function App(): React.JSX.Element {
  const dispatch = useDispatch();

  const snackbarContent = useSelector(snackbarContentSelector);
  const isSnackbarOpen = useSelector(isSnackbarOpenSelector);
  const handleDismissSnackbar = () => dispatch(closeSnackbar());

  useEffect(() => {
    setTimeout(() => {
      dispatch(smugmugLoadFromLocalStorageAction({}, makeDataRequestMeta()));
    }, 100);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.root}>
      <NavigationContainer
        theme={theme}
        onReady={() => {
          BootSplash.hide();
        }}>
        <AppDrawer />
      </NavigationContainer>
      <Portal>
        <Snackbar
          duration={isSnackbarOpen ? 7000 : 0}
          visible={isSnackbarOpen}
          style={[
            styles.snackbar,
            snackbarContent.error && styles.snackbarError,
          ]}
          onDismiss={handleDismissSnackbar}>
          {snackbarContent.text}
        </Snackbar>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  snackbar: { marginBottom: 80, marginHorizontal: 40, padding: 10 },
  snackbarError: {
    backgroundColor: theme.colors.errorContainer,
  },
});

export default App;
