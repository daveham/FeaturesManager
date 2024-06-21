import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Dialog,
  HelperText,
  Text,
  TextInput,
} from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

import {
  SMUGMUG_API_KEY,
  SMUGMUG_API_KEY_SECRET,
} from 'shared/constants/env-constants';
import {
  smugmugConsumerCredentialsAction,
  smugmugRequestTokenAction,
} from 'state/api/actions';
import { makeDataRequestMeta } from 'state/utilities';

type smugmugCredentialsFormProps = {
  smugmugApiKey: string | undefined;
  smugmugApiSecret: string | undefined;
};

const initialFormValues: smugmugCredentialsFormProps = {
  smugmugApiKey: SMUGMUG_API_KEY,
  smugmugApiSecret: SMUGMUG_API_KEY_SECRET,
};

const SmugmugCredentialsValidationSchema = Yup.object().shape({
  smugmugApiKey: Yup.string()
    .length(32, 'A SmugMug API key is 32 characters long')
    .required('Key is required'),
  smugmugApiSecret: Yup.string()
    .length(64, 'A SmugMug API secret is 64 characters long')
    .required('Secret is required'),
});

export function SmugmugCredentialsDialog({
  isVisible = false,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}): React.ReactElement {
  const dispatch = useDispatch();

  const [showSmugmugKey, setShowSmugmugKey] = useState(false);
  const [showSmugmugSecret, setShowSmugmugSecret] = useState(false);

  const handleShowSmugmugKeyPress = () => {
    setShowSmugmugKey(!showSmugmugKey);
  };

  const handleShowSmugmugSecretPress = () => {
    setShowSmugmugSecret(!showSmugmugSecret);
  };

  const handleOnSubmitCredentialsPress = (
    credentials: smugmugCredentialsFormProps,
  ) => {
    dispatch(smugmugConsumerCredentialsAction(credentials));
    dispatch(smugmugRequestTokenAction(credentials, makeDataRequestMeta()));
    onClose();
  };

  return (
    <Formik
      initialValues={initialFormValues}
      validationSchema={SmugmugCredentialsValidationSchema}
      onSubmit={(values: smugmugCredentialsFormProps, actions) => {
        handleOnSubmitCredentialsPress(values);
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
        <Dialog visible={isVisible} onDismiss={onClose}>
          <Dialog.Title>SmugMug API Credentials</Dialog.Title>
          <Dialog.Content style={styles.content}>
            <View style={styles.guidanceContainer}>
              <Text variant="bodyLarge">
                Enter the API Key and the API Key Secret that you generated in
                the API keys section of the Account Settings page of your
                SmugMug site.
              </Text>
            </View>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
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
              <HelperText type="error">{`${errors.smugmugApiKey}`}</HelperText>
            )}
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
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
              <HelperText type="error">{`${errors.smugmugApiSecret}`}</HelperText>
            )}
            <View style={styles.guidanceContainer}>
              <Text variant="bodyLarge">
                After these credentials are submitted, the SmugMug website will
                open in a browser. Log into your SmugMug account and copy the
                six digit verification code displayed in the browser. Return to
                this app and use the code for the next step in authentication.
              </Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              disabled={!isValid || isSubmitting}
              mode="contained"
              onPress={() => handleSubmit()}>
              Submit Credentials
            </Button>
            <Button mode="contained" disabled={isSubmitting} onPress={onClose}>
              Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 30,
  },
  formElement: {
    marginTop: 15,
  },
  guidanceContainer: {
    paddingVertical: 30,
  },
});
