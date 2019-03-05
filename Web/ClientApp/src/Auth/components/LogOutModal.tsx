import { logout } from "Auth/auth-helpers";
import { LogOutModal as GenericLogOutModal } from "njm-react-component-library";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch, Action } from "redux";
import { onRemoveUnsavedPointsGroups } from "../../Data";

export const LogOutModalInternal: React.SFC<IProps> = ({
	isOpen,
	onRequestClose: handleRequestClose,
	handleRemoveUnsavedPointsGroups,
	handleLogOut
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
	handleLogOut: typeof logout.request;
	handleRemoveUnsavedPointsGroups: typeof onRemoveUnsavedPointsGroups;
}

type IProps = IOwnProps & IDispatchProps;

// redux
const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			handleLogOut: logout.request,
			handleRemoveUnsavedPointsGroups: onRemoveUnsavedPointsGroups
		},
		dispatch
	);

export const LogOutModal = connect(
	null,
	mapDispatchToProps
)(LogOutModalInternal);
