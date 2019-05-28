import { getIsAuthenticated } from "Auth/auth-helpers";
import { AuthModal, LogOutModal } from "Auth/components";
import {
	Modal,
	Button,
	PopulatedAppBar
} from "@nickjmorrow/react-component-library";
import * as React from "react";
import { useState } from "react";
import GoogleLogin, { GoogleLoginResponse } from "react-google-login";
import { connect } from "react-redux";
import { IReduxState } from "../../reducer";
import { clientId } from "../../secrets";
import { getDatabaseSettingValue } from "../selectors";
import { settingIds } from "../constants";

export const AppBarInternal: React.FC<IProps> = ({
	isAuthenticated,
	appName
}) => {
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
	const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false);
	const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

	const handleToggleAuthModal = () => setIsAuthModalOpen(prev => !prev);

	const handleToggleGoogleModal = () => setIsGoogleModalOpen(prev => !prev);

	const handleToggleLogoutModal = () => setIsLogOutModalOpen(prev => !prev);

	const handleSuccess = (response: GoogleLoginResponse) => {
		console.log(response.getAuthResponse().access_token);
		console.log(response.getBasicProfile().getEmail());
		console.log(response.getBasicProfile().getName());
		console.log(response.getAuthResponse().expires_at);
		console.log(response.isSignedIn());
		console.log(response.getId());
	};

	const handleFailure = (response: any) => {
		console.log(response);
	};

	const googleModal = (
		<Modal
			isOpen={isGoogleModalOpen}
			onRequestClose={handleToggleGoogleModal}>
			<GoogleLogin
				clientId={clientId}
				buttonText="Login!"
				onSuccess={handleSuccess}
				onFailure={handleFailure}
			/>
		</Modal>
	);

	const rightComponents = isAuthenticated ? (
		<>
			<AppBarButton onClick={handleToggleLogoutModal}>
				Log Out
			</AppBarButton>
		</>
	) : (
		<>
			<AppBarButton onClick={handleToggleAuthModal}>Sign In</AppBarButton>
		</>
	);
	return (
		<>
			<PopulatedAppBar
				appName={appName}
				styleVariant={"primary"}
				rightComponents={rightComponents}
			/>
			<AuthModal
				isOpen={isAuthModalOpen}
				isRegistering={false}
				handleToggleIsOpen={handleToggleAuthModal}
			/>
			<LogOutModal
				isOpen={isLogOutModalOpen}
				onRequestClose={() => setIsLogOutModalOpen(false)}
			/>
			{googleModal}
		</>
	);
};

// types
type ReduxProps = ReturnType<typeof mapStateToProps>;

type IProps = ReduxProps;

// redux
const mapStateToProps = (state: IReduxState) => ({
	isAuthenticated: getIsAuthenticated(state),
	appName: getDatabaseSettingValue(state, settingIds.appName)
});

export const AppBar = connect(
	mapStateToProps,
	null
)(AppBarInternal);

const AppBarButton: React.FC<{
	onClick: () => void;
	children: React.ReactNode;
}> = ({ onClick: handleClick, children }) => (
	<Button showBoxShadow={false} useMargin={false} onClick={handleClick}>
		{children}
	</Button>
);
