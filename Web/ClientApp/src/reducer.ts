import { combineReducers } from 'redux';
import { routerReducer, RouterState } from 'react-router-redux';
import { dataReducer, DataState } from './Data';
import { authReducer, IAuthState } from 'njm-react-component-library';

export const rootReducer = combineReducers({
	routing: routerReducer,
	data: dataReducer,
	auth: authReducer
});

export interface IReduxState {
	readonly routing: RouterState;
	readonly data: DataState;
	readonly auth: IAuthState;
}
