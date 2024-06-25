export const homePageDataSelector = state => state.homeFeatures.homePageData;
export const homePageDataLoadingSelector = state =>
  state.homeFeatures.homePageDataLoading;
export const homePageFeaturesDataSelector = state =>
  state.homeFeatures.homePageFeaturesData;
export const homePageFeatureSourcesSelector = state =>
  homePageFeaturesDataSelector(state)?.featureSources;
export const homePageFeatureDestinationSelector = state =>
  homePageFeaturesDataSelector(state)?.featureDestination;
export const homePageFeaturesDataLoadingSelector = state =>
  state.homeFeatures.homePageFeaturesDataLoading;
