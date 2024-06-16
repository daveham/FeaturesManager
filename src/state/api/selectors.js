export const smugmugConsumerCredentialsSelector = state =>
  state.api.smugmugConsumerCredentials;
export const smugmugAuthorizationUrlSelector = state =>
  state.api.smugmugAuthorizationUrl;
export const smugmugRequestTokenSelector = state =>
  state.api.smugmugRequestToken;
export const smugmugAccessTokenSelector = state => state.api.smugmugAccessToken;
export const smugmugVerificationPinSelector = state =>
  state.api.smugmugVerificationPin;

export const isAuthenticatedSelector = state => {
  const { key, secret } = smugmugConsumerCredentialsSelector(state);
  const { access_token, access_token_secret } =
    smugmugAccessTokenSelector(state);

  return key && secret && access_token && access_token_secret;
};
