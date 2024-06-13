import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { smugmugTestRequestAction } from 'state/api/actions';
import { makeDataRequestMeta } from 'state/utilities';

import type { HomeScreenProps } from './types.tsx';

export function Home(_props: HomeScreenProps): React.JSX.Element {
  const dispatch = useDispatch();

  const handleSummaryButtonPress = () => {
    dispatch(smugmugTestRequestAction({}, makeDataRequestMeta()));
  };

  return (
    <View style={styles.root}>
      <Button
        mode="contained-tonal"
        onPress={handleSummaryButtonPress}
        style={styles.testButton}>
        Request Summary Data
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
