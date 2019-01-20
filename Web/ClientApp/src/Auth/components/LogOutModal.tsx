import * as React from 'react';
import { LogOutModal as GenericLogOutModal } from 'njm-react-component-library';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators, Action } from 'redux';
import { handleLogOut as handleLogOutAction } from '../actions';

export const LogOutModalInternal: React.SFC<IProps> = ({
	isOpen,
	onRequestClose: handleRequestClose,
	handleLogOut
}) => {
	return (
		<GenericLogOutModal
			isOpen={isOpen}
			onRequestClose={handleRequestClose}
			onPrimaryClick={handleLogOut}
		/>
	);
};

// TODO: figure out how to pass in an array of 
// action creators that can be fired off within the LogOut saga

// types
interface IOwnProps {
    isOpen: boolean;
    logoutActions: (func(): void)[];
    onRequestClose(): void;
}

interface IDispatchProps {
	handleLogOut(action?: Action): void;
}

type IProps = IOwnProps & IDispatchProps;

// redux
const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			handleLogOut: handleLogOutAction.request
		},
		dispatch
	);

export const LogOutModal = connect(
	null,
	mapDispatchToProps
)(LogOutModalInternal);
