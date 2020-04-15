import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from './sagas';
import { routerMiddleware } from 'react-router-redux';
import { rootReducer, IReduxState } from './reducer';
import { createBrowserHistory } from 'history';

const sagaMiddleware = createSagaMiddleware();

const configureStore = (history: any, initialState: IReduxState) => {
	const middleware = [sagaMiddleware, routerMiddleware(history)];

	// In development, use the browser's Redux dev tools extension if installed
	const enhancers: any[] = [];
	const isDevelopment = process.env.NODE_ENV === 'development';
	if (isDevelopment && typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION__) {
		enhancers.push((window as any).__REDUX_DEVTOOLS_EXTENSION__());
	}

	const intermediateStore = createStore(
		rootReducer,
		initialState as any,
		compose(applyMiddleware(...middleware), ...enhancers),
	);

	sagaMiddleware.run(rootSaga);

	return intermediateStore;
};

export const store = configureStore(createBrowserHistory(), (window as any).initialReduxState);
