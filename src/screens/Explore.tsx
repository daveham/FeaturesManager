import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Dialog,
  HelperText,
  Text,
  TextInput,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { API_V2 } from 'shared/oauth';
import { exploreDataAction } from 'state/explore/actions';
import { exploreLoadingSelector } from 'state/explore/selectors';
import { makeDataRequestMeta } from 'state/utilities';

import type { ExploreScreenProps } from './types.tsx';

type exploreFormProps = {
  query: string | undefined;
};

const initialFormValues: exploreFormProps = {
  query: undefined,
};

const ExploreValidationScheme = Yup.object().shape({
  query: Yup.string().min(1, 'Cannot be empty').required('A value is required'),
});

export function Explore(_props: ExploreScreenProps): React.JSX.Element {
  const dispatch = useDispatch();

  const loadingExploreData = useSelector(exploreLoadingSelector);

  const handleLoadExploreDataPress = ({ query }: exploreFormProps) => {
    dispatch(exploreDataAction({ query }, makeDataRequestMeta()));
  };

  return (
    <View style={styles.root}>
      <Formik
        initialValues={initialFormValues}
        validationSchema={ExploreValidationScheme}
        onSubmit={(values: exploreFormProps, actions) => {
          handleLoadExploreDataPress(values);
          actions.setSubmitting(false);
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          isValid,
          isSubmitting,
          errors,
          touched,
          values,
        }) => (
          <Dialog visible dismissable={false}>
            <Dialog.Title>Query SmugMug Data</Dialog.Title>
            <Dialog.Content>
              <View style={styles.helpContainer}>
                <Text style={styles.helpText}>
                  Enter a valid SmugMug API expression. For example, the URI for
                  an Album:
                </Text>
                <Text style={styles.exampleText}>/api/v2/album/67FH2H</Text>
                <Text style={styles.helpText}>
                  You don't have to include the first part of the URI,
                  <Text style={styles.inlineExampleText}>{` ${API_V2}`}</Text>
                </Text>
                <Text style={styles.exampleText}>album/67FH2H</Text>
              </View>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                label="Expression"
                error={Boolean(touched.query && errors.query)}
                value={values.query}
                onChangeText={handleChange('query')}
                onBlur={handleBlur('query')}
                style={styles.formElement}
              />
              {touched.query && errors.query && (
                <HelperText type="error">{`${errors.query}`}</HelperText>
              )}
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                disabled={!isValid || isSubmitting || loadingExploreData}
                mode="contained"
                onPress={() => handleSubmit()}>
                Submit
              </Button>
            </Dialog.Actions>
          </Dialog>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 30,
  },
  formElement: {
    marginTop: 15,
  },
  helpContainer: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 10,
  },
  helpText: {
    fontSize: 16,
  },
  exampleText: {
    fontSize: 16,
    fontFamily: 'Menlo',
    fontWeight: 'bold',
    paddingLeft: 20,
    marginTop: 12,
    marginBottom: 20,
  },
  inlineExampleText: {
    fontSize: 16,
    fontFamily: 'Menlo',
    fontWeight: 'bold',
  },
});
