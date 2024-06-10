import React, { useEffect, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Button, Portal, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

import usePrevious from 'shared/hooks/usePreviousHook';
import {
  smugmugAccessTokenSelector,
  smugmugAuthorizationUrlSelector,
} from 'state/api/selectors';

import { CombinedDefaultTheme as theme } from '../../../theme';
import type { AuthenticationScreenProps } from '../types.tsx';
import { SmugmugCredentialsDialog } from './SmugmugCredentialsDialog.tsx';
import { SmugmugVerificationDialog } from './SmugmugVerificationDialog.tsx';

// Taken from the Dialog and Modal components in react-native-paper, this is
// the duration of the animation used to show/hide a dialog.
const DEFAULT_ANIMATION_DURATION = 220;
// Take theme animation scale into account and bump to a bit longer.
const DIALOG_ANIMATION_DURATION =
  DEFAULT_ANIMATION_DURATION * theme.animation.scale * 1.1;

export function Authentication(
  _props: AuthenticationScreenProps,
): React.JSX.Element {
  const authorizationUrl = useSelector(smugmugAuthorizationUrlSelector);
  const { access_token, access_token_secret } = useSelector(
    smugmugAccessTokenSelector,
  );

  const previousAuthorizationUrl = usePrevious(authorizationUrl);

  useEffect(() => {
    if (authorizationUrl && !previousAuthorizationUrl) {
      Linking.openURL(authorizationUrl).then(() => {
        console.log(`opening URL ${authorizationUrl}`);
      });
    }
  }, [authorizationUrl, previousAuthorizationUrl]);

  const [isSmugmugCredentialsVisible, setIsSmugmugCredentialsVisible] =
    useState(false);

  const [isSmugmugCredentialsRendered, setIsSmugmugCredentialsRendered] =
    useState(false);

  const [isSmugmugVerificationVisible, setIsSmugmugVerificationVisible] =
    useState(false);

  const [isSmugmugVerificationRendered, setIsSmugmugVerificationRendered] =
    useState(false);

  // We want a fresh instance of the dialogs each time they are made visible to
  // ensure the embedded use of formik inside each dialog gets reset correctly.
  // We separate the control of visibility from the control of the dialog instance's
  // lifetime so the show/hide animation has time to run.

  const handleCloseCredentialsDialog = () => {
    // Setting visible to false will trigger the dialog's "hide" animations.
    setIsSmugmugCredentialsVisible(false);
    setTimeout(() => {
      // After the animation's duration has passed, the dialog can be
      // removed from rendering.
      setIsSmugmugCredentialsRendered(false);
    }, DIALOG_ANIMATION_DURATION);
  };

  const handleAuthenticateSmugmugPress = () => {
    // Dialog needs to be rendered before made visible to allow
    // dialog's "show" visibility animations to run.
    setIsSmugmugCredentialsRendered(true);
    setTimeout(() => {
      setIsSmugmugCredentialsVisible(true);
    }, 0);
  };

  const handleCloseVerificationDialog = () => {
    // Setting visible to false will trigger the dialog's "hide" animations.
    setIsSmugmugVerificationVisible(false);
    setTimeout(() => {
      // After the animation's duration has passed, the dialog can be
      // removed from rendering.
      setIsSmugmugVerificationRendered(false);
    }, DIALOG_ANIMATION_DURATION);
  };

  const handleVerifySmugmugPress = () => {
    // Dialog needs to be rendered before made visible to allow
    // dialog's "show" visibility animations to run.
    setIsSmugmugVerificationRendered(true);
    setTimeout(() => {
      setIsSmugmugVerificationVisible(true);
    }, 0);
  };

  const handleCancelAuthenticationPress = () => {
    console.log('Implement cancel here');
  };

  const isAuthenticated = access_token && access_token_secret;
  const authButtonEnabled = !isAuthenticated && !authorizationUrl;
  const verifyButtonEnabled = Boolean(authorizationUrl);

  const statusText = `This App is ${
    isAuthenticated ? '' : 'not '
  }authenticated with your SmugMug account.`;

  return (
    <>
      <Portal>
        {isSmugmugCredentialsRendered && (
          <SmugmugCredentialsDialog
            isVisible={isSmugmugCredentialsVisible}
            onClose={handleCloseCredentialsDialog}
          />
        )}
        {isSmugmugVerificationRendered && (
          <SmugmugVerificationDialog
            isVisible={isSmugmugVerificationVisible}
            onClose={handleCloseVerificationDialog}
          />
        )}
      </Portal>
      <View style={styles.root}>
        <View style={styles.statusContainer}>
          <Text variant="displaySmall" style={styles.statusText}>
            {statusText}
          </Text>
        </View>
        <View style={styles.docContainer}>
          <Text variant="bodyLarge">
            Authentication consists of two steps. First, submit the API
            credentials created on SmugMug on the Manage Applications page. You
            will be prompted to sign into your SmugMug site where you will
            receive a six-digit verification code. Tap the button below to open
            the dialog for the first step.
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              disabled={!authButtonEnabled}
              mode="contained"
              onPress={handleAuthenticateSmugmugPress}>
              Authenticate SmugMug
            </Button>
          </View>
        </View>
        <View style={styles.docContainer}>
          <Text variant="bodyLarge">
            For the next step, enter the verification code you received in step
            one. The app will use the code to acquire credentials that will
            allow the app to call the API on your behalf. Tap the button below
            to open the dialog for the second step.
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              disabled={!verifyButtonEnabled}
              mode="contained"
              onPress={handleVerifySmugmugPress}>
              Verify SmugMug
            </Button>
          </View>
        </View>
        <View style={styles.docContainer}>
          <View style={styles.docSection}>
            <Text variant="bodyLarge">
              If you want to cancel the app's ability to use the SmugMug API on
              your behalf, tap the button below to remove the authentication
              token from this device.
            </Text>
          </View>
          <View style={styles.docSection}>
            <Text variant="bodyLarge">
              You also need to revoke the token for this app in your SmugMug
              account. This can only be done by logging into your SmugMug site
              and revoking the token in your site's application settings.
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              disabled={!isAuthenticated}
              mode="outlined"
              onPress={handleCancelAuthenticationPress}>
              Remove Authentication
            </Button>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: '10%',
    paddingVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingTop: 20,
  },
  docContainer: {
    paddingBottom: 40,
  },
  docSection: {
    paddingVertical: 10,
  },
  statusContainer: {
    justifyContent: 'center',
    paddingVertical: 50,
  },
  statusText: {
    textAlign: 'center',
  },
});
