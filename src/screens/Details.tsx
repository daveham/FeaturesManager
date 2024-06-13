import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { smugmugTestDataAction } from 'state/api/actions';
import { closeSnackbar, openSnackbar } from 'state/ui/actions';
import { isSnackbarOpenSelector } from 'state/ui/selectors';
import { userDataAction } from 'state/user/actions';
import { userDataSelector } from 'state/user/selectors';
import { makeDataRequestMeta } from 'state/utilities';

import type { DetailsScreenProps } from './types.tsx';

export function Details(_props: DetailsScreenProps): React.JSX.Element {
  const dispatch = useDispatch();

  const { firstName, lastName } = useSelector(userDataSelector);
  const isSnackbarOpen = useSelector(isSnackbarOpenSelector);

  const handleSnackbarButtonPress = () => {
    if (isSnackbarOpen) {
      dispatch(closeSnackbar());
    } else {
      dispatch(userDataAction('bf', makeDataRequestMeta()));
      dispatch(
        openSnackbar('User name has been requested from Details screen.'),
      );
    }
  };

  const handleTestRequestPress = () => {
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
      <Button
        mode="contained"
        onPress={handleTestRequestPress}
        style={styles.testButton}>
        Test SmugMug Public Request
      </Button>
      <Button
        mode="contained"
        onPress={handleSnackbarButtonPress}
        style={styles.testButton}>
        {label}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 80,
  },
  testButton: {
    marginBottom: 40,
  },
});
