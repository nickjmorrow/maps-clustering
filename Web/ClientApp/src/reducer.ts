import { combineReducers } from 'redux';
import { routerReducer, RouterState } from 'react-router-redux';
import { dataReducer, IDataState } from './Data';
import { authReducer } from 'njm-react-component-library/lib/Auth/reducer';
import { IAuthState } from 'njm-react-component-library/lib/Auth/types';

export const rootReducer = combineReducers({
	routing: routerReducer,
	data: dataReducer,
	auth: authReducer
});

export interface IReduxState {
	readonly routing: RouterState;
	readonly data: IDataState;
	readonly auth: IAuthState;
}
