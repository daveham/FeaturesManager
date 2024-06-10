import {
  convertQueryStringToObject,
  fastCryptoHash,
  getDataAsParameterString,
  getNonce,
  getRequestParameterString,
  getTimeStamp,
  Oauth,
  percentEncode,
  percentEncodeData,
  sortObjectProperties,
} from '../index';

describe('percentEncode', () => {
  test('should substitute', () => {
    const input = "a!b*c'd(e)f";
    const output = 'a%21b%2Ac%27d%28e%29f';
    expect(percentEncode(input)).toEqual(output);
  });

  test('handle bad input', () => {
    expect(percentEncode()).toEqual('');
  });
});

describe('percentEncodeData', () => {
  test('encode simple object', () => {
    const input = {
      one: 1,
      two: 'two',
      3: null,
    };
    const output = {
      one: '1',
      two: 'two',
      3: 'null',
    };

    expect(percentEncodeData(input)).toEqual(output);
  });

  test('encode simple object with bad characters', () => {
    const input = {
      '(one)': 1,
      two: 'two!',
      3: '*',
    };
    const output = {
      '%28one%29': '1',
      two: 'two%21',
      3: '%2A',
    };

    expect(percentEncodeData(input)).toEqual(output);
  });

  test('encode object with arrays', () => {
    const input = {
      one: [1, 2, 3],
      two: 'two',
      3: ['*', '!'],
    };
    const output = {
      one: '1%2C2%2C3',
      two: 'two',
      3: '%252A%2C%2521',
    };

    expect(percentEncodeData(input)).toEqual(output);
  });
});

describe('getTimeStamp', () => {
  test('returns number', () => {
    const stamp = getTimeStamp();
    expect(typeof stamp).toEqual('number');
  });
});

describe('getNonce', () => {
  test('returns string of expected length', () => {
    const nonce = getNonce(16);
    expect(typeof nonce).toEqual('string');
    expect(nonce).toHaveLength(16);
  });
});

describe('convertQueryStringToObject', () => {
  test('converts from simple values', () => {
    const input = 'a=b&c=d&e=f';
    const output = convertQueryStringToObject(input);
    expect(output).toEqual({
      a: 'b',
      c: 'd',
      e: 'f',
    });
  });

  test('converts from encoded values', () => {
    const input = 'a=%28b%29&c=d%2A&e=f%2Cg';
    const output = convertQueryStringToObject(input);
    expect(output).toEqual({
      a: '(b)',
      c: 'd*',
      e: 'f,g',
    });
  });

  test('converts from complex values', () => {
    const input = 'a=b1&a=b2&c=d&e=f&e=g';
    const output = convertQueryStringToObject(input);
    expect(output).toEqual({
      a: ['b1', 'b2'],
      c: 'd',
      e: ['f', 'g'],
    });
  });
});

describe('sortObjectProperties', () => {
  test('sorts properties by key', () => {
    const input = {
      b: 'one',
      g: 'two',
      z: 'three',
      a: 'four',
    };
    const output = sortObjectProperties(input);
    expect(output).toEqual([
      {
        key: 'a',
        value: 'four',
      },
      {
        key: 'b',
        value: 'one',
      },
      {
        key: 'g',
        value: 'two',
      },
      {
        key: 'z',
        value: 'three',
      },
    ]);
  });
});

describe('getDataAsParameterString', () => {
  test('simple values', () => {
    const sortedPropertyData = sortObjectProperties({
      oauth_consumer_key: 'consumerKey',
      oauth_nonce: 'aAbBcCdD',
      oauth_signature_method: 'signatureMethod',
      oauth_timestamp: '7654',
      oauth_version: '1.0a',
    });

    const parameterString = getDataAsParameterString(sortedPropertyData);

    const expected =
      'oauth_consumer_key=consumerKey' +
      '&oauth_nonce=aAbBcCdD' +
      '&oauth_signature_method=signatureMethod' +
      '&oauth_timestamp=7654' +
      '&oauth_version=1.0a';

    expect(parameterString).toEqual(expected);
  });
});

describe('getRequestParameterString', () => {
  test('simple values', () => {
    const testRequest = {
      url: 'base?parm1=one&parm2=two',
      data: { one: '1' },
    };
    const oauthData = {
      oauth_consumer_key: 'consumerKey',
      oauth_nonce: 'aAbBcCdD',
      oauth_signature_method: 'signatureMethod',
      oauth_timestamp: '7654',
      oauth_version: '1.0a',
    };

    const parameterString = getRequestParameterString(testRequest, oauthData);

    const expected =
      'oauth_consumer_key=consumerKey' +
      '&oauth_nonce=aAbBcCdD' +
      '&oauth_signature_method=signatureMethod' +
      '&oauth_timestamp=7654' +
      '&oauth_version=1.0a' +
      '&one=1' +
      '&parm1=one' +
      '&parm2=two';

    expect(parameterString).toEqual(expected);
  });
});

describe('Oauth.toHeader', () => {
  test('returns header', () => {
    const oa = new Oauth({
      consumer: {
        key: 'consumerKey',
        token: 'consumerToken',
      },
    });
    const data = {
      oauth_consumer_key: 'consumerKey',
      oauth_nonce: 'aAbBcCdD',
      oauth_signature_method: 'signatureMethod',
      oauth_timestamp: '7654',
      oauth_version: '1.0a',
    };

    const header = oa.toHeader(data);

    expect(header).toEqual({
      Authorization:
        'OAuth oauth_consumer_key="consumerKey", ' +
        'oauth_nonce="aAbBcCdD", ' +
        'oauth_signature_method="signatureMethod", ' +
        'oauth_timestamp="7654", ' +
        'oauth_version="1.0a"',
    });
  });
});

describe('fastCryptoHash', () => {
  test('hashes body', () => {
    // HMACs lifted from Wikipedia.
    const key = 'key';
    const data = 'The quick brown fox jumps over the lazy dog';
    const expectedHash = 'de7c9b85b8b78aa6bc8a7a36f70a90701c9db4d9';
    // "3nybhbi3iqa8ino29wqQcBydtNk="

    const hash = fastCryptoHash(data, key, 'hex');
    expect(hash).toEqual(expectedHash);
  });
});
