import { login, register, LoginInfo } from "Auth/auth-helpers";
import { AuthModal as GenericAuthModal } from "@nickjmorrow/react-component-library";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { getPointsGroups } from "../../Data";
import { GoogleLoginExample } from "./GoogleLoginExample";

export const AuthModalInternal: React.SFC<IProps> = ({
	handleLogin,
	handleRegister,
	isOpen,
	isRegistering,
	handleToggleIsOpen
}) => {
	const handleLoginInternal = (loginInfo: LoginInfo) => {
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
			handleLogin: login.request,
			handleRegister: register.request,
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
	handleLogin: typeof login.request;
	handleRegister: typeof register.request;
	handleGetPointsGroups(): void;
}

interface IOwnProps {
	isOpen: boolean;
	isRegistering?: boolean;
	handleToggleIsOpen(): void;
}

type IProps = IDispatchProps & IOwnProps;
