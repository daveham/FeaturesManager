import React, { useState } from 'react';
import * as Yup from 'yup';
import { Button, Dialog, HelperText, TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import { StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

import {
  SMUGMUG_API_KEY,
  SMUGMUG_API_KEY_SECRET,
} from '../../shared/constants/env-constants';
import {
  smugmugConsumerCredentialsAction,
  // smugmugRequestTokenAction,
} from '../../state/api/actions';

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
    // temporarily disabled for dev
    // dispatch(smugmugRequestTokenAction(credentials, makeDataRequestMeta()));
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
      }) => {
        console.log('cred-dlg render', {
          isVisible,
          isValid,
          isSubmitting,
          values,
          errors,
          touched,
        });
        return (
          <Dialog visible={isVisible} onDismiss={onClose}>
            <Dialog.Title>SmugMug API Credentials</Dialog.Title>
            <Dialog.Content style={styles.content}>
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
                <HelperText type="error">{`${errors.smugmugApiKey}`}</HelperText>
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
                <HelperText type="error">{`${errors.smugmugApiSecret}`}</HelperText>
              )}
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                disabled={!isValid || isSubmitting}
                mode="contained"
                onPress={() => handleSubmit()}>
                Submit Credentials
              </Button>
              <Button
                mode="contained"
                disabled={isSubmitting}
                onPress={onClose}>
                Cancel
              </Button>
            </Dialog.Actions>
          </Dialog>
        );
      }}
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
});
