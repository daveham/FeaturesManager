export const identity = value => value;
export const noPayload = () => undefined;
export const pickMeta = (_payload, meta) => meta;

export function createActionMapForData(actionTypes) {
  return actionTypes.reduce((map, type) => {
    map[`${type}_ACTION`] = [identity, pickMeta];
    return map;
  }, {});
}

export function createActionMapForMetaNoPayload(actionTypes) {
  return actionTypes.reduce((map, type) => {
    map[`${type}_ACTION`] = [noPayload, pickMeta];
    return map;
  }, {});
}

export function createActionMapForPayloadWithMeta(actionTypes) {
  return actionTypes.reduce((map, type) => {
    map[`${type}_ACTION`] = [identity, pickMeta];
    return map;
  }, {});
}

export const DATA_REQUEST_ACTION = 'data_request';
export const DATA_RESPONSE_ACTION = 'data_response';

export function isDataRequestAction(action, filter) {
  if (filter && action.type !== filter?.toString()) {
    return false;
  }
  return action?.meta?.type === DATA_REQUEST_ACTION;
}

export function isDataResponseAction(action, filter) {
  if (filter && action.type !== filter?.toString()) {
    return false;
  }
  return action?.meta?.type === DATA_RESPONSE_ACTION;
}

export const dataRequestMeta = { type: DATA_REQUEST_ACTION };
export const dataResponseMeta = { type: DATA_RESPONSE_ACTION };

export function makeDataRequestMeta(meta) {
  return meta ? { ...meta, ...dataRequestMeta } : dataRequestMeta;
}

export function makeDataResponseMeta(meta) {
  return meta ? { ...meta, ...dataResponseMeta } : dataResponseMeta;
}

export function makeErrorDataResponseMeta(meta) {
  if (meta) {
    return {
      ...meta,
      ...dataResponseMeta,
      error: true,
    };
  }
  return { ...dataResponseMeta, error: true };
}

// Make meta value for data request that should not activate an activity/loading indicator.
export function makeBackgroundDataRequestMeta(meta) {
  return meta
    ? { ...meta, ...dataRequestMeta, background: true }
    : dataRequestMeta;
}

export function isBackgroundDataRequest(action = {}) {
  return Boolean(action.meta?.background);
}
