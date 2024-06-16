import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Summary } from 'components/Summary';
import usePreviousHook from 'shared/hooks/usePreviousHook';
import { isAuthenticatedSelector } from 'state/api/selectors';
import { summaryDataAction } from 'state/summary/actions';
import { makeDataRequestMeta } from 'state/utilities';

import type { HomeScreenProps } from './types.tsx';

export function Home(_props: HomeScreenProps): React.JSX.Element {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const previousIsAuthenticated = usePreviousHook(isAuthenticated);

  useEffect(() => {
    if (isAuthenticated && !previousIsAuthenticated) {
      dispatch(summaryDataAction({}, makeDataRequestMeta()));
    }
  }, [dispatch, isAuthenticated, previousIsAuthenticated]);

  return (
    <View style={styles.root}>
      <Summary />
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
