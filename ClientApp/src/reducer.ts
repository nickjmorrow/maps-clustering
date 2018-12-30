import { combineReducers } from 'redux';
import { routerReducer, RouterState } from 'react-router-redux';
import { dataReducer, DataState } from './Data';

export const rootReducer = combineReducers({
	routing: routerReducer,
	data: dataReducer
});

export interface ReduxState {
	readonly routing: RouterState;
	readonly data: DataState;
}
