import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { smugmugTestDataAction } from 'state/api/actions';
import { makeDataRequestMeta } from 'state/utilities';

import type { HomeScreenProps } from './types.tsx';

export function Home({ navigation }: HomeScreenProps): React.JSX.Element {
  const dispatch = useDispatch();

  const handleDetailsButtonPress = () => {
    navigation.navigate('Details');
  };

  const handleAuthenticationButtonPress = () => {
    navigation.navigate('Authentication');
  };

  const handleTestRequestPress = () => {
    dispatch(smugmugTestDataAction({}, makeDataRequestMeta()));
  };

  return (
    <View style={styles.root}>
      <Button
        mode="contained"
        onPress={handleTestRequestPress}
        style={styles.testButton}>
        Test SmugMug Public Request
      </Button>
      <Button
        mode="contained-tonal"
        onPress={handleAuthenticationButtonPress}
        style={styles.testButton}>
        Authentication
      </Button>
      <Button
        mode="contained-tonal"
        onPress={handleDetailsButtonPress}
        style={styles.testButton}>
        See Details
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
