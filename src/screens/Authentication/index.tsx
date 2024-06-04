import React, { useState } from 'react';
import {
  Button,
  Icon,
  List,
  MD3Colors,
  Portal,
  Text,
} from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { CombinedDefaultTheme as theme } from '../../../theme';
import type { AuthenticationScreenProps } from '../types.tsx';
import {
  smugmugConsumerCredentialsSelector,
  smugmugRequestTokenSelector,
  smugmugAuthorizationUrlSelector,
  smugmugVerificationPinSelector,
  smugmugAccessTokenSelector,
} from '../../state/api/selectors';

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
  const authButtonEnabled = !isAuthenticated;
  const verifyButtonEnabled = !isAuthenticated && !authButtonEnabled;

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
            A lot of text will go here to explain the first part of
            authenticating with SmugMug. Explain the use of the consumer API
            values that, when submitted will lead to the authenticating on a
            user account on SmugMug.
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
            A lot of text will go here to explain the second part of
            authenticating with SmugMug. Explain the use of the verification
            code that needs to be entered here. Once the code is confirmed, this
            application will have access to the authenticated user's SmugMug
            site.
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
              Tap the button below to remove the authentication token from this
              device.
            </Text>
          </View>
          <View style={styles.docSection}>
            <Text variant="bodyLarge">
              You also need to revoke the token for this app in your SmugMug
              account.
            </Text>
            <Text variant="bodyLarge">
              <Icon size={25} source="menu-right" />
              Visit the Account Settings page in your SmugMug site.
            </Text>
            <Text variant="bodyLarge">
              <Icon size={25} source="menu-right" />
              Select the Privacy tab.
            </Text>
            <Text variant="bodyLarge">
              <Icon size={25} source="menu-right" />
              View the Authorized Services table.
            </Text>
            <Text variant="bodyLarge">
              <Icon size={25} source="menu-right" />
              Tap Revoke Token on the row for "Features Manager".
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
  boldText: {
    fontWeight: 'bold',
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
  listItem: {
    paddingVertical: 0,
  },
  listItemContent: {
    paddingLeft: 0,
  },
  listItemIcon: {
    paddingLeft: 20,
    paddingRight: 4,
  },
});
