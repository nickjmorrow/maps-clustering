import {
	PopulatedAppBar as GenericAppBar,
	authSelectors,
	Modal
} from 'njm-react-component-library';
import * as React from 'react';
import { connect } from 'react-redux';
import { IReduxState } from '../../reducer';
import { AuthModal, LogOutModal } from '../../Auth';
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login';
import { clientId } from '../../secrets';

const { getIsAuthenticated } = authSelectors;

export class AppBarInternal extends React.PureComponent<
	IProps,
	typeof initialState
> {
	readonly state = initialState;

	handleToggleAuthModal = () =>
		this.setState(prevState => ({
			isAuthModalOpen: !prevState.isAuthModalOpen
		}));

	handleToggleLogOutModal = () =>
		this.setState(prevState => ({
			isLogOutModalOpen: !prevState.isLogOutModalOpen
		}));

	responseGoogle = (response: any) => console.log(response);

	handleToggleGoogleModal = () =>
		this.setState(prevState => ({
			isGoogleModalOpen: !prevState.isGoogleModalOpen
		}));

	handleSuccess = (response: GoogleLoginResponse) => {
		console.log(response.getAuthResponse().access_token);
		console.log(response.getBasicProfile().getEmail());
		console.log(response.getBasicProfile().getName());
		console.log(response.getAuthResponse().expires_at);
		console.log(response.isSignedIn());
		console.log(response.getId());
	};

	handleFailure = (response: any) => {
		console.log(response);
	};
	render() {
		const {
			isAuthModalOpen,
			isLogOutModalOpen,
			isGoogleModalOpen
		} = this.state;
		const { isAuthenticated } = this.props;

		const googleModal = (
			<Modal
				isOpen={isGoogleModalOpen}
				onRequestClose={this.handleToggleGoogleModal}>
				<GoogleLogin
					clientId={clientId}
					buttonText="Login!"
					onSuccess={this.handleSuccess}
					onFailure={this.handleFailure}
				/>
			</Modal>
		);
		return (
			<div>
				<GenericAppBar
					links={[]}
					appName={'Location Clusterer'}
					isAuthenticated={isAuthenticated}
					onLogInClick={this.handleToggleAuthModal}
					onRegisterClick={this.handleToggleAuthModal}
					onLogOutClick={this.handleToggleLogOutModal}
				/>
				<AuthModal
					isOpen={isAuthModalOpen}
					handleToggleIsOpen={this.handleToggleAuthModal}
				/>
				<LogOutModal
					isOpen={isLogOutModalOpen}
					onRequestClose={this.handleToggleLogOutModal}
				/>
				{googleModal}
			</div>
		);
	}
}

// types
interface IReduxProps {
	isAuthenticated: boolean;
}

const initialState = {
	isAuthModalOpen: false,
	isLogOutModalOpen: false,
	isGoogleModalOpen: false
};

type IProps = IReduxProps;

// redux
const mapStateToProps = (state: IReduxState): IReduxProps => ({
	isAuthenticated: getIsAuthenticated(state)
});

export const AppBar = connect(
	mapStateToProps,
	null
)(AppBarInternal);
