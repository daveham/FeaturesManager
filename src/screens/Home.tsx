import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { HomeFeatures } from 'components/HomeFeatures';
import { Summary } from 'components/Summary';
import usePreviousHook from 'shared/hooks/usePreviousHook';
import { isAuthenticatedSelector } from 'state/api/selectors';
import { homePageFeaturesDataAction } from 'state/homeFeatures/actions';
import { homePageDataLoadingSelector } from 'state/homeFeatures/selectors';
import { summaryDataAction } from 'state/summary/actions';
import { makeDataRequestMeta } from 'state/utilities';

import type { HomeScreenProps } from './types.tsx';

export function Home(_props: HomeScreenProps): React.JSX.Element {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const previousIsAuthenticated = usePreviousHook(isAuthenticated);

  const loadingHomePageData = useSelector(homePageDataLoadingSelector);

  useEffect(() => {
    if (isAuthenticated && !previousIsAuthenticated) {
      dispatch(summaryDataAction({}, makeDataRequestMeta()));
    }
  }, [dispatch, isAuthenticated, previousIsAuthenticated]);

  const handleLoadHomePageDataPress = () => {
    dispatch(homePageFeaturesDataAction({}, makeDataRequestMeta()));
  };

  return (
    <View style={styles.root}>
      <Summary />
      <HomeFeatures />
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          disabled={loadingHomePageData}
          onPress={handleLoadHomePageDataPress}>
          Home Page Data
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingTop: 20,
  },
  root: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
