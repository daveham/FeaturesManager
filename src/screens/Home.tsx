import React from 'react';
import { Button, Surface, Text, TextInput } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { openSnackbar } from '../state/ui/actions';
import type { HomeScreenProps } from './types.tsx';

export function Home({ navigation }: HomeScreenProps): React.JSX.Element {
  const dispatch = useDispatch();

  const SmugMugValidationSchema = Yup.object().shape({
    smugMugUserId: Yup.string()
      .min(6, 'Enter a valid ID')
      .required('SmugMug ID is required'),
    smugMugPassword: Yup.string()
      .min(4, 'Password should be of minimum 8 characters length')
      .required('Password is required'),
  });

  const DropBoxValidationSchema = Yup.object().shape({
    dropBoxUserId: Yup.string()
      .min(6, 'Enter a valid ID')
      .required('DropBox ID is required'),
    dropBoxPassword: Yup.string()
      .min(4, 'Password should be of minimum 8 characters length')
      .required('Password is required'),
  });

  const handleDetailsButtonPress = () => {
    navigation.navigate('Details');
  };

  return (
    <View style={styles.root}>
      <Surface elevation={1} style={styles.form}>
        <Formik
          initialValues={{
            smugMugUserId: '',
            smugMugPassword: '',
          }}
          validationSchema={SmugMugValidationSchema}
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
                label="SmugMug User Id"
                error={Boolean(touched.smugMugUserId && errors.smugMugUserId)}
                value={values.smugMugUserId}
                onChangeText={handleChange('smugMugUserId')}
                onBlur={handleBlur('smugMugUserId')}
                style={styles.formElement}
              />
              {touched.smugMugUserId && errors.smugMugUserId && (
                <Text variant="labelSmall">{errors.smugMugUserId}</Text>
              )}
              <TextInput
                label="SmugMug Password"
                error={Boolean(
                  touched.smugMugPassword && errors.smugMugPassword,
                )}
                value={values.smugMugPassword}
                onChangeText={handleChange('smugMugPassword')}
                onBlur={handleBlur('smugMugPassword')}
                style={styles.formElement}
              />
              {touched.smugMugPassword && errors.smugMugPassword && (
                <Text variant="labelSmall">{errors.smugMugPassword}</Text>
              )}
              <View style={styles.loginButtonContainer}>
                <Button
                  disabled={!isValid}
                  mode="contained"
                  onPress={() => handleSubmit()}>
                  Login to SmugMug
                </Button>
              </View>
            </View>
          )}
        </Formik>
        <Formik
          initialValues={{
            dropBoxUserId: 'foobar@example.com',
            dropBoxPassword: 'foobar',
          }}
          validationSchema={DropBoxValidationSchema}
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
                error={Boolean(touched.dropBoxUserId && errors.dropBoxUserId)}
                value={values.dropBoxUserId}
                onChangeText={handleChange('dropBoxUserId')}
                onBlur={handleBlur('dropBoxUserId')}
                style={styles.formElement}
              />
              {touched.dropBoxUserId && errors.dropBoxUserId && (
                <Text variant="labelSmall">{errors.dropBoxUserId}</Text>
              )}
              <TextInput
                label="DropBox Password"
                error={Boolean(
                  touched.dropBoxPassword && errors.dropBoxPassword,
                )}
                value={values.dropBoxPassword}
                onChangeText={handleChange('dropBoxPassword')}
                onBlur={handleBlur('dropBoxPassword')}
                style={styles.formElement}
              />
              {touched.dropBoxPassword && errors.dropBoxPassword && (
                <Text variant="labelSmall">{errors.dropBoxPassword}</Text>
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
