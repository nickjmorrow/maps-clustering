import { LogOutModal as GenericLogOutModal } from 'njm-react-component-library';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { onRemoveUnsavedPointsGroups } from 'src/Data';
import { onLogOut } from '../actions';

export const LogOutModalInternal: React.SFC<IProps> = ({
	isOpen,
	onRequestClose: handleRequestClose,
	handleLogOut,
	handleRemoveUnsavedPointsGroups
}) => {
	const logOutActions: Array<() => Action> = [
		handleRemoveUnsavedPointsGroups
	];
	return (
		<GenericLogOutModal
			isOpen={isOpen}
			onRequestClose={handleRequestClose}
			onPrimaryClick={() => handleLogOut(logOutActions)}
		/>
	);
};

// types
interface IOwnProps {
	isOpen: boolean;
	onRequestClose(): void;
}

interface IDispatchProps {
	handleLogOut: typeof onLogOut.request;
	handleRemoveUnsavedPointsGroups: typeof onRemoveUnsavedPointsGroups;
}

type IProps = IOwnProps & IDispatchProps;

// redux
const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			handleLogOut: onLogOut.request,
			handleRemoveUnsavedPointsGroups: onRemoveUnsavedPointsGroups
		},
		dispatch
	);

export const LogOutModal = connect(
	null,
	mapDispatchToProps
)(LogOutModalInternal);
