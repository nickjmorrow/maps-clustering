import { NecessaryReduxState } from "./types";

// TODO: should check expiration of token
export const getIsAuthenticated = (state: NecessaryReduxState): boolean => {
	return (
		state.auth.authenticationInfo !== null &&
		state.auth.authenticationInfo.token !== null
	);
};
