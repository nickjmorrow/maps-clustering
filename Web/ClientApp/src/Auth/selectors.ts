import { IReduxState } from 'src/reducer';

export const getIsAuthenticated = (state: IReduxState): boolean => {
	return (
		state.auth.authenticationInfo !== null &&
		state.auth.authenticationInfo.userId !== null
	);
};
