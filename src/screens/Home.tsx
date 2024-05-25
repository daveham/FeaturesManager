import React from 'react';
import { Button, Surface, Text, TextInput } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { openSnackbar } from '../state/ui/actions';
import type { HomeScreenProps } from './types.tsx';
import {
  smugmugAuthorizationUrlAction,
  smugmugCredentialsAction,
  smugmugRequestTokenAction,
} from '../state/api/actions';
import {
  smugmugCredentialsSelector,
  smugmugRequestTokenSelector,
} from '../state/api/selectors';
import { makeDataRequestMeta } from '../state/utilities';
import {
  SMUGMUG_API_KEY,
  SMUGMUG_API_KEY_SECRET,
} from '../shared/constants/env-constants';

export function Home({ navigation }: HomeScreenProps): React.JSX.Element {
  const dispatch = useDispatch();

  const [showSmugmugKey, setShowSmugmugKey] = React.useState(false);
  const [showSmugmugSecret, setShowSmugmugSecret] = React.useState(false);

  const { key: smugmugApiKey, secret: smugmugApiSecret } = useSelector(
    smugmugCredentialsSelector,
  );
  const { oauth_token, oauth_token_secret, oauth_callback_confirmed } =
    useSelector(smugmugRequestTokenSelector);

  const SmugmugValidationSchema = Yup.object().shape({
    smugmugApiKey: Yup.string()
      .length(32, 'A SmugMug API key is 32 characters long')
      .required('Key is required'),
    smugmugApiSecret: Yup.string()
      .length(64, 'A SmugMug API secret is 64 characters long')
      .required('Secret is required'),
  });

  const DropboxValidationSchema = Yup.object().shape({
    dropboxUserId: Yup.string()
      .min(6, 'Enter a valid ID')
      .required('DropBox ID is required'),
    dropboxPassword: Yup.string()
      .min(4, 'Password should be of minimum 8 characters length')
      .required('Password is required'),
  });

  const handleDetailsButtonPress = () => {
    navigation.navigate('Details');
  };

  const handleShowSmugmugKeyPress = () => {
    setShowSmugmugKey(!showSmugmugKey);
  };

  const handleShowSmugmugSecretPress = () => {
    setShowSmugmugSecret(!showSmugmugSecret);
  };

  const handleRequestTokenPress = () => {
    dispatch(
      smugmugRequestTokenAction(
        { smugmugApiKey, smugmugApiSecret },
        makeDataRequestMeta(),
      ),
    );
  };

  const handleRequestAuthUrlPress = () => {
    dispatch(
      smugmugAuthorizationUrlAction(
        { oauth_token, oauth_token_secret },
        makeDataRequestMeta(),
      ),
    );
  };

  return (
    <View style={styles.root}>
      <Surface elevation={1} style={styles.form}>
        <Formik
          initialValues={{
            smugmugApiKey: SMUGMUG_API_KEY,
            smugmugApiSecret: SMUGMUG_API_KEY_SECRET,
          }}
          validationSchema={SmugmugValidationSchema}
          onSubmit={values => {
            dispatch(
              smugmugCredentialsAction({
                key: values.smugmugApiKey,
                secret: values.smugmugApiSecret,
              }),
            );
            dispatch(openSnackbar(JSON.stringify(values, null, 2)));
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            isValid,
            errors,
            touched,
            values,
          }) => (
            <View style={styles.group}>
              <TextInput
                label="SmugMug API Key"
                error={Boolean(touched.smugmugApiKey && errors.smugmugApiKey)}
                value={values.smugmugApiKey}
                onChangeText={handleChange('smugmugApiKey')}
                onBlur={handleBlur('smugmugApiKey')}
                secureTextEntry={!showSmugmugKey}
                right={
                  <TextInput.Icon
                    icon="eye"
                    onPress={handleShowSmugmugKeyPress}
                  />
                }
                style={styles.formElement}
              />
              {touched.smugmugApiKey && errors.smugmugApiKey && (
                <Text variant="labelSmall">{`${errors.smugmugApiKey}`}</Text>
              )}
              <TextInput
                label="SmugMug API Secret"
                error={Boolean(
                  touched.smugmugApiSecret && errors.smugmugApiSecret,
                )}
                value={values.smugmugApiSecret}
                onChangeText={handleChange('smugmugApiSecret')}
                onBlur={handleBlur('smugmugApiSecret')}
                secureTextEntry={!showSmugmugSecret}
                right={
                  <TextInput.Icon
                    icon="eye"
                    onPress={handleShowSmugmugSecretPress}
                  />
                }
                style={styles.formElement}
              />
              {touched.smugmugApiSecret && errors.smugmugApiSecret && (
                <Text variant="labelSmall">{`${errors.smugmugApiSecret}`}</Text>
              )}
              <View style={styles.loginButtonContainer}>
                <Button
                  disabled={!isValid}
                  mode="contained"
                  onPress={() => handleSubmit()}>
                  Save Credentials
                </Button>
              </View>
            </View>
          )}
        </Formik>
        <View style={styles.loginButtonContainer}>
          <Button
            disabled={!smugmugApiKey || !smugmugApiSecret}
            mode="contained"
            onPress={handleRequestTokenPress}>
            Request Token
          </Button>
        </View>
        <View style={styles.loginButtonContainer}>
          <Button
            disabled={!oauth_callback_confirmed}
            mode="contained"
            onPress={handleRequestAuthUrlPress}>
            Request Auth URL
          </Button>
        </View>
      </Surface>
      <Surface elevation={1} style={styles.form}>
        <Formik
          initialValues={{
            dropboxUserId: 'foobar@example.com',
            dropboxPassword: 'foobar',
          }}
          validationSchema={DropboxValidationSchema}
          onSubmit={values => {
            console.log('dropbox form submit handler');
            dispatch(openSnackbar(JSON.stringify(values, null, 2)));
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            isValid,
            errors,
            touched,
            values,
          }) => (
            <View style={styles.group}>
              <TextInput
                label="DropBox User Id"
                error={Boolean(touched.dropboxUserId && errors.dropboxUserId)}
                value={values.dropboxUserId}
                onChangeText={handleChange('dropboxUserId')}
                onBlur={handleBlur('dropboxUserId')}
                style={styles.formElement}
              />
              {touched.dropboxUserId && errors.dropboxUserId && (
                <Text variant="labelSmall">{errors.dropboxUserId}</Text>
              )}
              <TextInput
                label="DropBox Password"
                error={Boolean(
                  touched.dropboxPassword && errors.dropboxPassword,
                )}
                value={values.dropboxPassword}
                onChangeText={handleChange('dropboxPassword')}
                onBlur={handleBlur('dropboxPassword')}
                style={styles.formElement}
              />
              {touched.dropboxPassword && errors.dropboxPassword && (
                <Text variant="labelSmall">{errors.dropboxPassword}</Text>
              )}
              <View style={styles.loginButtonContainer}>
                <Button
                  disabled={!isValid}
                  mode="contained"
                  onPress={() => handleSubmit()}>
                  Login to DropBox
                </Button>
              </View>
            </View>
          )}
        </Formik>
      </Surface>
      <Button mode="contained-tonal" onPress={handleDetailsButtonPress}>
        See Details
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 80,
  },
  form: {
    width: '70%',
    paddingVertical: 50,
    paddingHorizontal: 80,
  },
  group: {
    paddingBottom: 20,
  },
  formElement: {
    marginTop: 8,
  },
  loginButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
  },
});
