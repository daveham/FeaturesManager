import { all, put, select, takeEvery } from 'redux-saga/effects';

import {
  exploreDataAction,
  homePageDataAction,
} from 'state/homeFeatures/actions';
import { summaryDataAction } from 'state/summary/actions';
import { summaryDataSelector } from 'state/summary/selectors';
import { openSnackbar } from 'state/ui/actions';
import {
  isDataRequestAction,
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
// const rootNodeQueryExpansionKey = '/api/v2/node/WrXjf!children?count=25';

export function* homePageDataErrorSaga(message) {
  console.log('homePageDataErrorSaga', message);
  yield put(summaryDataAction(message, makeErrorDataResponseMeta()));
  yield put(openSnackbar({ text: message }));
}

export function* homePageDataSaga(_action) {
  const summaryData = yield select(summaryDataSelector);

  // get the URI for the root node from the summary data
  const rootNodeUri = summaryData?.Uris?.Node?.Uri;
  if (!rootNodeUri) {
    yield* homePageDataErrorSaga('Summary data not loaded.');
    return;
  }

  let capturedData;
  const intercept = (payload, meta) => {
    capturedData = payload;
    return homePageDataAction(payload, meta);
  };

  let url = `${rootNodeUri}?_config=${rootNodeQueryExpansion}`;
  const requestArgs = yield* prepareAuthRequest(url);
  let result = yield* callApi(getRequest, requestArgs, {
    successAction: intercept,
    errorAction: homePageDataAction,
  });
  if (!result) {
    return;
  }

  const baseUri = capturedData.Response.Uri;
  const expansionKey = `${baseUri}!children?count=25`;
  const expansionData = capturedData.Expansions[expansionKey];

  console.log('homePageDataSaga from root node query', {
    capturedData,
    expansionKey,
    expansionData,
  });

  const featuresNode = expansionData.Node.find(n => n.Name === 'Features');
  if (!featuresNode) {
    yield* homePageDataErrorSaga('Failed to find Features node.');
    return;
  }

  // Get all of the albums in the features folder.
  const featuresFolderChildrenUri = `/node/${featuresNode.NodeID}!children?count=20`;
  const featuresFolderChildrenRequestArgs = yield* prepareAuthRequest(
    featuresFolderChildrenUri,
  );
  result = yield* callApi(getRequest, featuresFolderChildrenRequestArgs, {
    successAction: intercept,
    errorAction: exploreDataAction,
  });
  if (!result) {
    return;
  }

  console.log('homePageDataSaga from features nodes query', {
    capturedData,
  });

  const featureSources = capturedData.Response.Node.filter(
    n => n.Name !== 'Home',
  ).map(n => ({ name: n.Name, nodeId: n.NodeID }));

  const homeNode = capturedData.Response.Node.find(n => n.Name === 'Home');
  const featureDestination = { name: homeNode.Name, nodeId: homeNode.NodeID };

  console.log('homePageDataSaga features nodes', {
    featureDestination,
    featureSources,
  });

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
      action => isDataRequestAction(action, homePageDataAction),
      homePageDataSaga,
    ),
    takeEvery(
      action => isDataRequestAction(action, exploreDataAction),
      exploreDataSaga,
    ),
  ]);
}
