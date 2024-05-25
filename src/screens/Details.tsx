import React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { isSnackbarOpenSelector } from '../state/ui/selectors';
import { openSnackbar, closeSnackbar } from '../state/ui/actions';
import { userDataAction } from '../state/user/actions';
import { userDataSelector } from '../state/user/selectors';
import { dataRequestMeta, makeDataRequestMeta } from '../state/utilities';
import {
  smugmugOauthAction,
  smugmugTestDataAction,
} from '../state/api/actions';

export function Details(): React.JSX.Element {
  const dispatch = useDispatch();

  const { firstName, lastName } = useSelector(userDataSelector);
  const isSnackbarOpen = useSelector(isSnackbarOpenSelector);

  const handleSnackbarButtonPress = () => {
    if (isSnackbarOpen) {
      dispatch(closeSnackbar());
    } else {
      dispatch(userDataAction('bf', dataRequestMeta));
      dispatch(
        openSnackbar('User name has been requested from Details screen.'),
      );
    }
  };

  const handleSmugmugOAuthTestButtonPress = () => {
    dispatch(smugmugOauthAction({}, makeDataRequestMeta()));
  };

  const handleSmugmugPublicTestButtonPress = () => {
    dispatch(smugmugTestDataAction({}, makeDataRequestMeta()));
  };

  let label;
  if (firstName) {
    label = `${
      isSnackbarOpen ? 'Hide' : 'Show'
    } Snackbar, ${firstName} ${lastName}`;
  } else {
    label = `${isSnackbarOpen ? 'Hide' : 'Show'} Snackbar`;
  }

  return (
    <View style={styles.root}>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleSnackbarButtonPress}>
          {label}
        </Button>
      </View>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleSmugmugPublicTestButtonPress}>
          Test SmugMug Public Request
        </Button>
      </View>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleSmugmugOAuthTestButtonPress}>
          Test SmugMug OAuth Request
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'space-around', alignItems: 'center' },
  buttonContainer: {
    marginTop: 20,
  },
});
