import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from './sagas';
import { routerMiddleware } from 'react-router-redux';
import { rootReducer, ReduxState } from './reducer';

const sagaMiddleware = createSagaMiddleware();

const configureStore = (history: any, initialState: ReduxState) => {
	const middleware = [sagaMiddleware, routerMiddleware(history)];

	// In development, use the browser's Redux dev tools extension if installed
	const enhancers = [];
	const isDevelopment = process.env.NODE_ENV === 'development';
	if (
		isDevelopment &&
		typeof window !== 'undefined' &&
		(window as any).devToolsExtension
	) {
		enhancers.push((window as any).devToolsExtension());
	}

	const intermediateStore = createStore(
		rootReducer,
		initialState,
		compose(
			applyMiddleware(...middleware),
			...enhancers
		)
	);

	sagaMiddleware.run(rootSaga);

	return intermediateStore;
};

export const store = configureStore(history, (window as any).initialReduxState);
