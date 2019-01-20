import { AuthModal as GenericAuthModal } from 'njm-react-component-library';
import {
	ILoginInfo,
	IRegisterInfo
} from 'njm-react-component-library/lib/types';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { getPointsGroups } from 'src/Data';
import {
	handleLogin as handleLoginAction,
	handleRegister as handleRegisterAction
} from '../actions';

export const AuthModalInternal: React.SFC<IProps> = ({
	handleLogin,
	handleRegister,
	isOpen,
	isRegistering,
	handleToggleIsOpen
}) => {
	const handleLoginInternal = (loginInfo: ILoginInfo) => {
		const additionalActions = [getPointsGroups.request];
		handleLogin({ loginInfo, additionalActions });
		handleToggleIsOpen();
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
			handleGetPointsGroups: getPointsGroups.request
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
	handleGetPointsGroups(): void;
}

interface IOwnProps {
	isOpen: boolean;
	isRegistering?: boolean;
	handleToggleIsOpen(): void;
}

type IProps = IDispatchProps & IOwnProps;
