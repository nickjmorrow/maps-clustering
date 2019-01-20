import { LogOutModal as GenericLogOutModal } from 'njm-react-component-library';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { removeUnsavedPointsGroups } from 'src/Data';
import { handleLogOut as handleLogOutAction } from '../actions';

export const LogOutModalInternal: React.SFC<IProps> = ({
	isOpen,
	onRequestClose: handleRequestClose,
	handleLogOut,
	handleRemoveUnsavedPointsGroups
}) => {
	const logOutActions: any[] = [handleRemoveUnsavedPointsGroups];
	return (
		<GenericLogOutModal
			isOpen={isOpen}
			onRequestClose={handleRequestClose}
			onPrimaryClick={() => handleLogOut(logOutActions)}
		/>
	);
};

// TODO: figure out how to pass in an array of
// action creators that can be fired off within the LogOut saga

// types
interface IOwnProps {
	isOpen: boolean;
	onRequestClose(): void;
}

interface IDispatchProps {
	handleLogOut(actions?: any[]): void;
	handleRemoveUnsavedPointsGroups(): void;
}

type IProps = IOwnProps & IDispatchProps;

// redux
const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			handleLogOut: handleLogOutAction.request,
			handleRemoveUnsavedPointsGroups: removeUnsavedPointsGroups
		},
		dispatch
	);

export const LogOutModal = connect(
	null,
	mapDispatchToProps
)(LogOutModalInternal);
