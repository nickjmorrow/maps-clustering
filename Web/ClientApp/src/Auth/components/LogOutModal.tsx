import * as React from 'react';
import { LogOutModal as GenericLogOutModal } from 'njm-react-component-library';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
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

// types
interface IOwnProps {
	isOpen: boolean;
	onRequestClose(): void;
}

interface IDispatchProps {
	handleLogOut(): void;
}

type IProps = IOwnProps & IDispatchProps;

// redux
const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			handleLogOut: handleLogOutAction
		},
		dispatch
	);

export const LogOutModal = connect(
	null,
	mapDispatchToProps
)(LogOutModalInternal);
