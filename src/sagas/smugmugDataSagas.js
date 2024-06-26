import { all, put, select, takeEvery } from 'redux-saga/effects';

import log from 'shared/utilities/logger';
import {
  exploreDataAction,
  homePageFeaturesDataAction,
  homePageFeaturesDataProgressAction,
} from 'state/homeFeatures/actions';
import { summaryDataAction } from 'state/summary/actions';
import { summaryDataSelector } from 'state/summary/selectors';
import { openSnackbar } from 'state/ui/actions';
import {
  isDataRequestAction,
  makeDataResponseMeta,
  makeErrorDataResponseMeta,
} from 'state/utilities';

import { callApi, getRequest, prepareAuthRequest } from './apiUtils';

export function* summaryDataSaga(_action) {
  const requestArgs = yield* prepareAuthRequest('!authuser');
  yield* callApi(getRequest, requestArgs, {
    responseAction: summaryDataAction,
    successPayloadTransform: data => data.Response.User,
  });
}

const rootNodeQueryExpansion = JSON.stringify({
  expand: {
    ChildNodes: {
      args: {
        count: 25,
      },
    },
  },
});

const featuresNodeQueryExpansion = JSON.stringify({
  expand: {
    ChildNodes: {
      expand: {
        Album: {
          expand: {
            AlbumHighlightImage: {},
          },
        },
      },
      args: {
        count: 20,
      },
    },
  },
});

// const rootNodeQueryExpansionKey = '/api/v2/node/WrXjf!children?count=25';

export function* homePageFeaturesDataErrorSaga(message) {
  log.error('homePageFeaturesDataErrorSaga', message);
  yield put(homePageFeaturesDataAction(message, makeErrorDataResponseMeta()));
  yield put(openSnackbar({ text: message }));
}

export function* homePageFeaturesDataSaga(_action) {
  const summaryData = yield select(summaryDataSelector);

  // get the URI for the root node from the summary data
  const rootNodeUri = summaryData?.Uris?.Node?.Uri;
  if (!rootNodeUri) {
    return yield* homePageFeaturesDataErrorSaga('Summary data not loaded.');
  }

  let capturedData;
  const intercept = (payload, meta) => {
    capturedData = payload;
    return homePageFeaturesDataProgressAction(payload, meta);
  };

  // Get root node's children so we can find the Features folder.
  let url = `${rootNodeUri}?_config=${rootNodeQueryExpansion}`;
  const requestArgs = yield* prepareAuthRequest(url);
  let result = yield* callApi(getRequest, requestArgs, {
    successAction: intercept,
    errorAction: homePageFeaturesDataAction,
  });
  if (!result) {
    return;
  }

  const baseUri = capturedData.Response.Uri;
  const expansionKey = `${baseUri}!children?count=25`;
  const expansionData = capturedData.Expansions[expansionKey];

  log.debug('homePageDataSaga from root node query', {
    capturedData,
    expansionKey,
    expansionData,
  });

  // Find the Features node by name.
  const featuresNode = expansionData.Node.find(n => n.Name === 'Features');
  if (!featuresNode) {
    return yield* homePageFeaturesDataErrorSaga(
      'Failed to find Features node.',
    );
  }

  // Get all of the albums in the features folder.
  // const featuresFolderChildrenUri = `/node/${featuresNode.NodeID}!children?count=20`;
  const featuresFolderChildrenUri = `/node/${featuresNode.NodeID}?_config=${featuresNodeQueryExpansion}`;
  const featuresFolderChildrenRequestArgs = yield* prepareAuthRequest(
    featuresFolderChildrenUri,
  );
  result = yield* callApi(getRequest, featuresFolderChildrenRequestArgs, {
    successAction: intercept,
    errorAction: homePageFeaturesDataAction,
  });
  if (!result) {
    return;
  }

  log.debug('homePageDataSaga from features nodes query', {
    capturedData,
  });

  // captureData.Response.Node has Features Folder node
  //  Name: Features, NodeID:vKhjrb

  // captureData.Expansion[/api/v2/node/vKhjrb!children?count=20] has parent folder of child Album nodes
  //   .Locator: Node
  //   .Node - array of child node objects

  // captureData.Expansions[/api/v2/album/Xbg97R] - Highlights
  //   .Locator: Album
  //   .Album.* - album properties
  //     .AlbumKey, .HighlightAlbumImageUri, .Title, .Name, .ImageCount
  //     .Uris.AlbumImages.Uri
  // captureData.Expansions[/api/v2/album/D8XCpf] - Home
  // captureData.Expansions[/api/v2/album/GQwJfP] - Wildflowers
  // captureData.Expansions[/api/v2/album/67FH2H] - Rocks
  // captureData.Expansions[/api/v2/album/6CjZck] - Parade
  // captureData.Expansions[/api/v2/album/qW3HrV] - Boulders
  // captureData.Expansions[/api/v2/album/rjm9fc] - Bison

  // Object.keys(capturedData.Expansions).map(key => {
  //    identify by Expansions[key].Locator = Album or Node
  // }

  let featureSources = [];
  let featureDestination;
  let highlightImages = [];
  Object.keys(capturedData.Expansions).forEach(key => {
    const child = capturedData.Expansions[key];
    if (child.Locator === 'Album') {
      const album = child.Album;
      const data = {
        name: album.Name,
        key: album.AlbumKey,
        nodeId: album.NodeID,
        description: album.Description,
        imageCount: album.ImageCount,
        imagesLastUpdated: album.ImagesLastUpdated,
        highlightImageUri: album.HighlightAlbumImageUri,
        albumImagesUri: album.Uris.AlbumImages.Uri,
      };
      if (album.Name === 'Home') {
        featureDestination = data;
      } else {
        featureSources.push(data);
      }
    } else if (child.Locator === 'AlbumImage') {
      const albumImage = child.AlbumImage;
      highlightImages.push({
        thumbnailUrl: albumImage.ThumbnailUrl,
        title: albumImage.Title,
        key: albumImage.ImageKey,
        albumKey: albumImage.AlbumKey,
        collectedFrom: albumImage.CollectedFrom,
      });
    }
  });

  log.debug('homePageDataSaga features nodes', {
    featureDestination,
    featureSources,
    highlightImages,
  });

  let hasImageError = false;
  highlightImages.forEach(image => {
    if (image.albumKey === featureDestination.key) {
      featureDestination.highlightImage = image;
    } else {
      const owner = featureSources.find(s => s.key === image.albumKey);
      if (owner) {
        owner.highlightImage = image;
      } else {
        hasImageError = true;
      }
    }
  });

  if (hasImageError) {
    return yield* homePageFeaturesDataErrorSaga(
      'Could not connect highlight image with an album.',
    );
  }

  yield put(
    homePageFeaturesDataAction(
      { featureSources, featureDestination },
      makeDataResponseMeta(),
    ),
  );

  // Simple Spaces Page as node - no children
  // let exploreUrl = '/api/v2/node/2s5WnS';
  // let exploreRequestArgs = yield* prepareAuthRequest(exploreUrl);
  // result = yield* callApi(getRequest, exploreRequestArgs, {
  //   successAction: exploreDataAction,
  //   errorAction: exploreDataAction,
  // });
  // if (!result) {
  //   return;
  // }

  // Simple Spaces Page as Page
  // exploreUrl = '/api/v2/page/2s5WnS';
  // exploreRequestArgs = yield* prepareAuthRequest(exploreUrl);
  // result = yield* callApi(getRequest, exploreRequestArgs, {
  //   successAction: exploreDataAction,
  //   errorAction: exploreDataAction,
  // });
}

// A utility that tries to create a better error message by extracting specific
// information provided in the SmugMug API error payload.
function controlledErrorTransform(res) {
  if (res.Code && res.Message) {
    if (res.Response?.UriDescription) {
      return `Query for ${res.Response.UriDescription} ${res.Response.EndpointType} ${res.Message} (${res.Code})`;
    }
    return `Error: ${res.Message} ${res.Code}`;
  }
  return undefined;
}

export function* exploreDataSaga({ payload: { query } }) {
  const queryRequestArgs = yield* prepareAuthRequest(query);
  yield* callApi(getRequest, queryRequestArgs, {
    responseAction: exploreDataAction,
    successMessage: 'Query succeeded. View the results in redux state.',
    controlledErrorTransform,
  });
}

export default function* rootSaga() {
  yield all([
    takeEvery(
      action => isDataRequestAction(action, summaryDataAction),
      summaryDataSaga,
    ),
    takeEvery(
      action => isDataRequestAction(action, homePageFeaturesDataAction),
      homePageFeaturesDataSaga,
    ),
    takeEvery(
      action => isDataRequestAction(action, exploreDataAction),
      exploreDataSaga,
    ),
  ]);
}
