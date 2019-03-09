import { getIsAuthenticated } from "Auth/auth-helpers";
import { AuthModal, LogOutModal } from "Auth/components";
import {
	Modal,
	PopulatedAppBar as GenericAppBar
} from "@nickjmorrow/react-component-library";
import * as React from "react";
import { useState } from "react";
import GoogleLogin, { GoogleLoginResponse } from "react-google-login";
import { connect } from "react-redux";
import { IReduxState } from "../../reducer";
import { clientId } from "../../secrets";

export const AppBarInternal: React.FC<IProps> = ({ isAuthenticated }) => {
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
	const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false);
	const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

	const handleToggleAuthModal = () => setIsAuthModalOpen(prev => !prev);

	const handleToggleGoogleModal = () => setIsGoogleModalOpen(prev => !prev);

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
	return (
		<>
			<GenericAppBar
				links={[]}
				appName={"Location Clusterer"}
				isAuthenticated={isAuthenticated}
				onSignInClick={handleToggleAuthModal}
				onLogOutClick={() => setIsLogOutModalOpen(true)}
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
interface IReduxProps {
	isAuthenticated: boolean;
}

type IProps = IReduxProps;

// redux
const mapStateToProps = (state: IReduxState): IReduxProps => ({
	isAuthenticated: getIsAuthenticated(state)
});

export const AppBar = connect(
	mapStateToProps,
	null
)(AppBarInternal);
