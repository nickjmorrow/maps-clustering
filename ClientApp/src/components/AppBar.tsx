import { PopulatedAppBar as GenericAppBar } from 'njm-react-component-library';
import * as React from 'react';
import { connect } from 'react-redux';
import { isAuthenticatedSelector } from 'src/Auth/selectors';
import { IReduxState } from 'src/reducer';
import { AuthModal, LogOutModal } from 'src/Auth';

export class AppBarInternal extends React.PureComponent<IProps, IOwnState> {
	readonly state = initialState;

	handleToggleAuthModal = () =>
		this.setState(prevState => {
			const x = {
				isAuthModalOpen: !prevState.isAuthModalOpen
			};
			console.log(x);
			return x;
		});

	handleToggleLogOutModal = () =>
		this.setState(prevState => ({
			isLogOutModalOpen: !prevState.isLogOutModalOpen
		}));

	render() {
		const { isAuthModalOpen, isLogOutModalOpen } = this.state;
		const { isAuthenticated } = this.props;
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
	isLogOutModalOpen: false
};

type IOwnState = typeof initialState;

type IProps = IReduxProps;

// redux
const mapStateToProps = (state: IReduxState): IReduxProps => ({
	isAuthenticated: isAuthenticatedSelector(state)
});

export const AppBar = connect(
	mapStateToProps,
	null
)(AppBarInternal);
