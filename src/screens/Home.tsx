import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { HomeFeatures } from 'components/HomeFeatures';
import { Summary } from 'components/Summary';
import usePrevious from 'shared/hooks/usePreviousHook';
import { isAuthenticatedSelector } from 'state/api/selectors';
import { homePageFeaturesDataAction } from 'state/homeFeatures/actions';
import { summaryDataAction } from 'state/summary/actions';
import { summaryLoadingSelector } from 'state/summary/selectors';
import { makeDataRequestMeta } from 'state/utilities';

import type { HomeScreenProps } from './types.tsx';

export function Home(_props: HomeScreenProps): React.JSX.Element {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const previousIsAuthenticated = usePrevious(isAuthenticated);

  const loadingSummaryData = useSelector(summaryLoadingSelector);
  const previousLoadingSummaryData = usePrevious(loadingSummaryData);

  useEffect(() => {
    if (isAuthenticated && !previousIsAuthenticated) {
      dispatch(summaryDataAction({}, makeDataRequestMeta()));
    }
  }, [dispatch, isAuthenticated, previousIsAuthenticated]);

  useEffect(() => {
    if (previousLoadingSummaryData && !loadingSummaryData) {
      dispatch(homePageFeaturesDataAction({}, makeDataRequestMeta()));
    }
  }, [dispatch, loadingSummaryData, previousLoadingSummaryData]);

  return (
    <View style={styles.root}>
      <Summary />
      <HomeFeatures />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
