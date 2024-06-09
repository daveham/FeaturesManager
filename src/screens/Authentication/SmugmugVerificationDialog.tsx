import React from 'react';
import * as Yup from 'yup';
import { Button, Dialog, HelperText, TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import { StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

import { smugmugVerificationPinAction } from 'state/api/actions';

type smugmugPinFormProps = {
  smugmugVerifierPin: string | undefined;
};

const initialFormValues: smugmugPinFormProps = {
  smugmugVerifierPin: undefined,
};

const SmugmugVerifierValidationSchema = Yup.object().shape({
  smugmugVerifierPin: Yup.string()
    .length(6, 'Should be 6 digits')
    .required('The PIN is required'),
});

export function SmugmugVerificationDialog({
  isVisible = false,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}): React.ReactElement {
  const dispatch = useDispatch();

  const handleVerifyPress = ({ smugmugVerifierPin }: smugmugPinFormProps) => {
    dispatch(smugmugVerificationPinAction(smugmugVerifierPin));
    onClose();
  };

  return (
    <Formik
      initialValues={initialFormValues}
      validationSchema={SmugmugVerifierValidationSchema}
      onSubmit={(values: smugmugPinFormProps, actions) => {
        handleVerifyPress(values);
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
          <Dialog.Title>SmugMug Verification Code</Dialog.Title>
          <Dialog.Content style={styles.content}>
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
              <HelperText type="error">{`${errors.smugmugVerifierPin}`}</HelperText>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              disabled={!isValid || isSubmitting}
              mode="contained"
              onPress={() => handleSubmit()}>
              Verify PIN
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
});
