import React from 'react';
import { Button, Surface, Text, TextInput } from 'react-native-paper';
import { Linking, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { openSnackbar } from '../state/ui/actions';
import type { HomeScreenProps } from './types.tsx';
import {
  smugmugAuthorizationUrlAction,
  smugmugConsumerCredentialsAction,
  smugmugRequestTokenAction,
  smugmugTestDataAction,
  smugmugTestRequestAction,
  smugmugVerificationPinAction,
} from '../state/api/actions';
import {
  smugmugConsumerCredentialsSelector,
  smugmugRequestTokenSelector,
  smugmugAuthorizationUrlSelector,
  smugmugVerificationPinSelector,
  smugmugAccessTokenSelector,
} from '../state/api/selectors';
import { makeDataRequestMeta } from '../state/utilities';
import {
  SMUGMUG_API_KEY,
  SMUGMUG_API_KEY_SECRET,
} from '../shared/constants/env-constants';

type smugmugCredentialsFormProps = {
  smugmugApiKey: string | undefined;
  smugmugApiSecret: string | undefined;
};

type smugmugPinFormProps = {
  smugmugVerifierPin: string | undefined;
};

const SmugmugCredentialsValidationSchema = Yup.object().shape({
  smugmugApiKey: Yup.string()
    .length(32, 'A SmugMug API key is 32 characters long')
    .required('Key is required'),
  smugmugApiSecret: Yup.string()
    .length(64, 'A SmugMug API secret is 64 characters long')
    .required('Secret is required'),
});

const SmugmugVerifierValidationSchema = Yup.object().shape({
  smugmugVerifierPin: Yup.string()
    .length(6, 'Should be 6 digits')
    .required('The PIN is required'),
});

/*
const DropboxValidationSchema = Yup.object().shape({
  dropboxUserId: Yup.string()
    .min(6, 'Enter a valid ID')
    .required('DropBox ID is required'),
  dropboxPassword: Yup.string()
    .min(4, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
});
*/

export function Home({ navigation }: HomeScreenProps): React.JSX.Element {
  const dispatch = useDispatch();

  const [showSmugmugKey, setShowSmugmugKey] = React.useState(false);
  const [showSmugmugSecret, setShowSmugmugSecret] = React.useState(false);

  const { smugmugApiKey, smugmugApiSecret } = useSelector(
    smugmugConsumerCredentialsSelector,
  );
  const { oauth_token, oauth_token_secret, oauth_callback_confirmed } =
    useSelector(smugmugRequestTokenSelector);
  const authorizationUrl = useSelector(smugmugAuthorizationUrlSelector);
  const smugmugVerificationPin = useSelector(smugmugVerificationPinSelector);
  const { access_token, access_token_secret } = useSelector(
    smugmugAccessTokenSelector,
  );

  const handleDetailsButtonPress = () => {
    navigation.navigate('Details');
  };

  const handleAuthenticationButtonPress = () => {
    navigation.navigate('Authentication');
  };

  const handleShowSmugmugKeyPress = () => {
    setShowSmugmugKey(!showSmugmugKey);
  };

  const handleShowSmugmugSecretPress = () => {
    setShowSmugmugSecret(!showSmugmugSecret);
  };

  const handleOpenInBrowserPress = () => {
    Linking.openURL(authorizationUrl).then(() => {
      console.log(`opening URL ${authorizationUrl}`);
    });
  };

  const handleVerifyPress = ({ smugmugVerifierPin }: smugmugPinFormProps) => {
    console.log('verify press', smugmugVerifierPin);
    dispatch(smugmugVerificationPinAction(smugmugVerifierPin));
  };

  const handleOnSubmitCredentialsPress = (
    credentials: smugmugCredentialsFormProps,
  ) => {
    dispatch(smugmugConsumerCredentialsAction(credentials));
    dispatch(smugmugRequestTokenAction(credentials, makeDataRequestMeta()));
  };

  const handleTestRequestPress = () => {
    dispatch(
      smugmugTestRequestAction(
        {
          smugmugApiKey,
          smugmugApiSecret,
          access_token,
          access_token_secret,
        },
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
          validationSchema={SmugmugCredentialsValidationSchema}
          onSubmit={(values: smugmugCredentialsFormProps) => {
            handleOnSubmitCredentialsPress(values);
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
                  Submit Credentials
                </Button>
              </View>
            </View>
          )}
        </Formik>
        <View style={styles.loginButtonContainer}>
          <Text>{authorizationUrl}</Text>
          <Button
            disabled={!authorizationUrl}
            mode="contained"
            onPress={handleOpenInBrowserPress}>
            Visit SmugMug for PIN
          </Button>
        </View>
      </Surface>

      <Surface elevation={1} style={styles.form}>
        <Formik
          initialValues={{
            smugmugVerifierPin: '',
          }}
          validationSchema={SmugmugVerifierValidationSchema}
          onSubmit={(values: smugmugPinFormProps) => {
            handleVerifyPress(values);
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
                label="SmugMug Verification PIN"
                error={Boolean(
                  touched.smugmugVerifierPin && errors.smugmugVerifierPin,
                )}
                value={values.smugmugVerifierPin}
                onChangeText={handleChange('smugmugVerifierPin')}
                onBlur={handleBlur('smugmugVerifierPin')}
                style={styles.formElement}
              />
              {touched.smugmugVerifierPin && errors.smugmugVerifierPin && (
                <Text variant="labelSmall">{`${errors.smugmugVerifierPin}`}</Text>
              )}
              <View style={styles.loginButtonContainer}>
                <Button
                  disabled={!isValid}
                  mode="contained"
                  onPress={() => handleSubmit()}>
                  Verify PIN
                </Button>
              </View>
            </View>
          )}
        </Formik>
        <View style={styles.loginButtonContainer}>
          <Button
            disabled={
              !access_token ||
              !access_token_secret ||
              !smugmugApiKey ||
              !smugmugApiSecret
            }
            mode="contained"
            onPress={handleTestRequestPress}>
            SmugMug Test Request
          </Button>
        </View>
      </Surface>

      <Button mode="contained-tonal" onPress={handleDetailsButtonPress}>
        See Details
      </Button>
      <Button mode="contained-tonal" onPress={handleAuthenticationButtonPress}>
        Authentication
      </Button>
    </View>
  );
}

/*
        <View style={styles.loginButtonContainer}>
          <Button
            disabled={!oauth_callback_confirmed}
            mode="contained"
            onPress={handleOpenInBrowserPress}>
            Request Auth URL
          </Button>
        </View>
 */

/*
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
 */
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
