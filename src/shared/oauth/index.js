import { createHmac } from 'crypto';

const DEFAULT_SIGNATURE_METHOD = 'PLAINTEXT';
const DEFAULT_OAUTH_VERSION = '1.0';
const DEFAULT_NONCE_LENGTH = 32;
const DEFAULT_PARAMETER_SEPARATOR = ', ';

export const SMUGMUG_OAUTH_ORIGIN = 'https://secure.smugmug.com';
export const SMUGMUG_REQUEST_TOKEN_URL =
  SMUGMUG_OAUTH_ORIGIN + '/services/oauth/1.0a/getRequestToken';
export const SMUGMUG_ACCESS_TOKEN_URL =
  SMUGMUG_OAUTH_ORIGIN + '/services/oauth/1.0a/getAccessToken';
export const SMUGMUG_AUTHORIZE_URL =
  SMUGMUG_OAUTH_ORIGIN + '/services/oauth/1.0a/authorize';
export const SMUGMUG_API_ORIGIN = 'https://api.smugmug.com';
export const SMUGMUG_BASE_URL = `${SMUGMUG_API_ORIGIN}/api/v2`;

/* from python example
  SERVICE = OAuth1Service(
    name='smugmug-oauth-web-demo',
    consumer_key=config['key'],
    consumer_secret=config['secret'],
    request_token_url=REQUEST_TOKEN_URL,
    access_token_url=ACCESS_TOKEN_URL,
    authorize_url=AUTHORIZE_URL,
    base_url=API_ORIGIN + '/api/v2')
*/

export function fastCryptoHash(stringData, key, encoding = 'base64') {
  /*
    hash_function(base_string, key) {
      return crypto
        .createHmac('sha1', key)
        .update(base_string)
        .digest('base64');
    },
  */

  return createHmac('sha1', key).update(stringData).digest(encoding);
}

export function percentEncode(data = '') {
  return encodeURIComponent(data)
    .replace(/!/g, '%21')
    .replace(/\*/g, '%2A')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
}

export function percentEncodeData(data = {}) {
  return Object.entries(data).reduce((acc, [key, value]) => {
    if (value && Array.isArray(value)) {
      const newValue = value.map(subValue => percentEncode(subValue));
      acc[percentEncode(key)] = percentEncode(newValue);
    } else {
      acc[percentEncode(key)] = percentEncode(value);
    }
    return acc;
  }, {});
}

export function getBaseUrl(url = '') {
  return url.split('?')[0];
}

export function convertQueryStringToObject(queryString = '') {
  return queryString.split('&').reduce((acc, pair) => {
    const [key, value] = pair.split('=');
    const decodedValue = decodeURIComponent(value ?? '');

    const existingValue = acc[key];
    if (existingValue) {
      if (!Array.isArray(existingValue)) {
        // replace existing value with an array containing the existing value
        acc[key] = [existingValue];
      }
      acc[key].push(decodedValue);
    } else {
      acc[key] = decodedValue;
    }

    return acc;
  }, {});
}

export function convertUrlToObject(url = '') {
  const parts = url.split('?');

  return parts.length === 1 ? {} : convertQueryStringToObject(parts[1]);
}

const nonceCharacters =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const nonceCharactersLength = nonceCharacters.length;
export function getNonce(nonceLength = 0) {
  let result = '';

  for (let i = 0; i < nonceLength; i++) {
    result +=
      nonceCharacters[Math.floor(Math.random() * nonceCharactersLength)];
  }

  return result;
}

export function getTimeStamp() {
  return Math.floor(new Date().getTime() / 1000);
}

export function sortObjectProperties(data) {
  return Object.keys(data)
    .sort()
    .reduce((acc, key) => {
      acc.push({
        key,
        value: data[key],
      });
      return acc;
    }, []);
}

export function mergeObjects(one = {}, two = {}) {
  return {
    ...one,
    ...two,
  };
}

export function getDataAsParameterString(data) {
  const dataStr = data.reduce((acc, { key, value }) => {
    // check if the value is an array
    // this means that this key has multiple values
    if (value && Array.isArray(value)) {
      const valString = value
        .sort()
        .map(item => `${key}=${item}`)
        .join('&');
      acc = `${acc}${valString}`;
    } else {
      acc = `${acc}${key}=${value}&`;
    }
    return acc;
  }, '');

  // remove the last character
  return dataStr.slice(0, dataStr.length - 1);
}

export function getRequestParameterString({ url, data }, oauthData) {
  const requestObject = oauthData?.oauth_body_hash
    ? convertUrlToObject(url)
    : mergeObjects(data, convertUrlToObject(url));

  const baseStringData = sortObjectProperties(
    percentEncodeData(mergeObjects(oauthData, requestObject)),
  );

  return getDataAsParameterString(baseStringData);
}

export function getBaseString(request, oauthData) {
  return `${request.method?.toUpperCase()}&${percentEncode(
    getBaseUrl(request.url),
  )}&${percentEncode(getRequestParameterString(request, oauthData))}`;
}

export class Oauth {
  consumer;
  nonceLength;
  version;
  parameterSeparator;
  realm;
  lastAmpersand;
  signatureMethod;
  hashFunction;
  bodyHashFunction;

  constructor(config = {}) {
    if (!config.consumer) {
      throw new Error('consumer must be defined');
    }

    this.consumer = config.consumer;
    this.nonceLength = config.nonceLength ?? DEFAULT_NONCE_LENGTH;
    this.version = config.version ?? DEFAULT_OAUTH_VERSION;
    this.parameterSeparator =
      config.parameterSeparator ?? DEFAULT_PARAMETER_SEPARATOR;
    this.realm = config.realm;
    this.lastAmpersand = config.lastAmpersand ?? true;
    this.signatureMethod = config.signatureMethod ?? DEFAULT_SIGNATURE_METHOD;

    if (
      this.signatureMethod === DEFAULT_SIGNATURE_METHOD &&
      !config.hashFunction
    ) {
      this.hashFunction = function (_baseString, key) {
        return key;
      };
    } else if (!config.hashFunction) {
      throw new Error('hashFunction must be defined');
    } else {
      this.hashFunction = config.hashFunction;
    }

    this.bodyHashFunction = config.bodyHashFunction ?? this.hashFunction;
  }

  authorize(request = {}, { key, secret } = {}) {
    const oauthData = {
      oauth_consumer_key: this.consumer.key,
      oauth_nonce: getNonce(this.nonceLength),
      oauth_signature_method: this.signatureMethod,
      oauth_timestamp: getTimeStamp(),
      oauth_version: this.version,
    };

    if (key) {
      oauthData.oauth_token = key;
    }

    if (!request.data) {
      request.data = {};
    }

    if (request.includeBodyHash) {
      oauthData.oauth_body_hash = this.getBodyHash(request, secret);
    }

    oauthData.oauth_signature = this.getSignature(request, secret, oauthData);

    return oauthData;
  }

  getBodyHash({ data } = {}, secret) {
    const body = typeof data === 'string' ? data : JSON.stringify(data);

    return this.bodyHashFunction(body, this.getSigningKey(secret));
  }

  getSignature(request, secret, oauthData) {
    return this.hashFunction(
      getBaseString(request, oauthData),
      this.getSigningKey(secret),
    );
  }

  getSigningKey(secret = '') {
    const encodedConsumerSecret = percentEncode(this.consumer.secret);

    if (!secret && !this.lastAmpersand) {
      return encodedConsumerSecret;
    }

    return `${encodedConsumerSecret}&${percentEncode(secret)}`;
  }

  toHeader(oauthData, extra = {}) {
    let headerValue = 'OAuth ';

    if (this.realm) {
      headerValue = `${headerValue}realm="${this.realm}"${this.parameterSeparator}`;
    }

    sortObjectProperties({ ...oauthData, ...extra })
      .filter(item => item.key.startsWith('oauth_'))
      .forEach(item => {
        headerValue = `${headerValue}${percentEncode(
          item.key,
        )}="${percentEncode(item.value)}"${this.parameterSeparator}`;
      });

    return {
      Authorization: headerValue.slice(
        0,
        headerValue.length - this.parameterSeparator.length,
      ),
    };
  }
}
