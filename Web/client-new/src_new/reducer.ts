import { combineReducers } from "redux";
import { routerReducer, RouterState } from "react-router-redux";
import { dataReducer, IDataState } from "./Data";
import { authReducer, AuthState } from "Auth/auth-helpers";
import { coreReducer, ICoreState } from "./Core";

export const rootReducer = combineReducers({
	routing: routerReducer,
	data: dataReducer,
	auth: authReducer,
	core: coreReducer
});

export interface IReduxState {
	readonly routing: RouterState;
	readonly data: IDataState;
	readonly auth: AuthState;
	readonly core: ICoreState;
}
