import * as React from 'react';
import { AuthModal as GenericAuthModal } from 'njm-react-component-library';
import { connect } from 'react-redux';
import {
	handleLogin as handleLoginAction,
	handleRegister as handleRegisterAction
} from '../actions';
import { Dispatch, bindActionCreators } from 'redux';
import {
	IRegisterInfo,
	ILoginInfo
} from 'njm-react-component-library/lib/types';
import { getUserFavoriteItems } from 'src/User';

export const AuthModalInternal: React.SFC<IProps> = ({
	handleLogin,
	handleRegister,
	isOpen,
	isRegistering,
	handleToggleIsOpen,
	handleGetUserFavoriteItems
}) => {
	const handleLoginInternal = (loginInfo: ILoginInfo) => {
		const additionalActions = [handleGetUserFavoriteItems];
		handleLogin({ loginInfo, additionalActions });
	};

	return (
		<GenericAuthModal
			onRegisterClick={handleRegister}
			onLoginClick={handleLoginInternal}
			isOpen={isOpen}
			isRegistering={isRegistering}
			onRequestClose={handleToggleIsOpen}
		/>
	);
};
// redux
const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			handleLogin: handleLoginAction.request,
			handleRegister: handleRegisterAction.request,
			handleGetUserFavoriteItems: getUserFavoriteItems.request
		},
		dispatch
	);

export const AuthModal = connect(
	null,
	mapDispatchToProps
)(AuthModalInternal);

// types
interface IDispatchProps {
	handleLogin({
		loginInfo,
		additionalActions
	}: {
		loginInfo: ILoginInfo;
		additionalActions?: any[];
	}): void;
	handleRegister(registerInfo: IRegisterInfo): void;
	handleGetUserFavoriteItems(): void;
}

interface IOwnProps {
	isOpen: boolean;
	isRegistering?: boolean;
	handleToggleIsOpen(): void;
}

type IProps = IDispatchProps & IOwnProps;
