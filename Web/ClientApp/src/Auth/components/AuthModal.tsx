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

export const AuthModalInternal: React.SFC<IProps> = ({
	handleLogin,
	handleRegister,
	isOpen,
	isRegistering,
	handleToggleIsOpen
}) => {
	return (
		<GenericAuthModal
			onRegisterClick={handleRegister}
			onLoginClick={handleLogin}
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
			handleRegister: handleRegisterAction.request
		},
		dispatch
	);

export const AuthModal = connect(
	null,
	mapDispatchToProps
)(AuthModalInternal);

// types
interface IDispatchProps {
	handleLogin(loginInfo: ILoginInfo): void;
	handleRegister(registerInfo: IRegisterInfo): void;
}

interface IOwnProps {
	isOpen: boolean;
	isRegistering?: boolean;
	handleToggleIsOpen(): void;
}

type IProps = IDispatchProps & IOwnProps;
