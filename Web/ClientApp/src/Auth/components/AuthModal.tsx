import {
	authActions,
	AuthModal as GenericAuthModal
} from "njm-react-component-library";
import { ILoginInfo } from "njm-react-component-library/lib/Auth/types";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { getPointsGroups } from "../../Data";
import { GoogleLoginExample } from "./GoogleLoginExample";

const { onLogin, onRegister } = authActions;

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
			renderAdditionalComponents={[() => <GoogleLoginExample key={1} />]}
		/>
	);
};
// redux
const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			handleLogin: onLogin.request,
			handleRegister: onRegister.request,
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
	handleLogin: typeof onLogin.request;
	handleRegister: typeof onRegister.request;
	handleGetPointsGroups(): void;
}

interface IOwnProps {
	isOpen: boolean;
	isRegistering?: boolean;
	handleToggleIsOpen(): void;
}

type IProps = IDispatchProps & IOwnProps;
