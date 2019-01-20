import * as actions from './actions';
import * as components from './components';
import * as reducer from './reducer';
import * as sagas from './sagas';
import * as selectors from './selectors';

export * from './actions';
export * from './components';
export * from './reducer';
export * from './sagas';
export * from './selectors';

export const auth = {
	actions,
	components,
	reducer,
	sagas,
	selectors
};
