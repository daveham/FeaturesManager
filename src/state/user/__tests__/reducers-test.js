import { dataRequestMeta, dataResponseMeta } from '../../utilities';
import { userDataAction } from '../actions';
import reducer from '../reducers';

describe('user reducers', () => {
  test('returns the initial state', () => {
    const state = reducer({}, { type: 'any' });
    expect(state.userData).toEqual({});
  });

  test('assigns from payload for data response action', () => {
    const data = { firstName: 'Ben', lastName: 'Franklin' };
    const action = userDataAction(data, dataResponseMeta);
    const state = reducer({}, action);
    expect(state.userData).toEqual(data);
  });

  test('does not assign from payload for data request action', () => {
    const data = 'bf';
    const action = userDataAction(data, dataRequestMeta);
    const state = reducer({}, action);
    expect(state.userData).toEqual({});
  });
});
