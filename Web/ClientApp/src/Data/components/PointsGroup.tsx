import * as React from 'react';
import { IPointsGroup } from '../types';
import styled from 'styled-components';
import {
	borderRadius,
	colors,
	transitions,
	Typography,
	DeleteButton
} from 'njm-react-component-library';
import { ItemPermissionType } from 'src/Core';
import {
	savePointsGroup,
	setActivePointsGroup,
	deletePointsGroup
} from '../actions';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Label } from './Label';

class PointsGroupInternal extends React.Component<IProps, IState> {
	readonly state = initialState;

	turnOnIsHovering = () => this.setState({ isHovering: true });
	turnOffIsHovering = () => this.setState({ isHovering: false });
	turnOnIsHoveringOverDeleteButton = () =>
		this.setState({ isHoveringOverDeleteButton: true });
	turnOffIsHoveringOverDeleteButton = () =>
		this.setState({ isHoveringOverDeleteButton: false });
	handleDeletePointsGroupInternal = () => {
		const { handleDeletePointsGroup, pointsGroup } = this.props;
		handleDeletePointsGroup(pointsGroup.pointsGroupId!);
	};
	handleSetActivePointsGroupInternal = () => {
		const { handleSetActivePointsGroup, pointsGroup } = this.props;
		if (!this.state.isHoveringOverDeleteButton) {
			handleSetActivePointsGroup(pointsGroup.pointsGroupId!);
		}
	};

	public render() {
		const { pointsGroup, handleSavePointsGroup } = this.props;
		const { isHovering, isHoveringOverDeleteButton } = this.state;
		const { isActive } = pointsGroup;

		return (
			<PointsGroupWrapper
				key={pointsGroup.pointsGroupId}
				onMouseEnter={this.turnOnIsHovering}
				onMouseLeave={this.turnOffIsHovering}
				isActive={isActive}
				onClick={this.handleSetActivePointsGroupInternal}>
				<Typography variant="h4" noMargin={true} color={'inherit'}>
					{pointsGroup.name}
				</Typography>
				{!pointsGroup.pointsGroupId && (
					<button onClick={() => handleSavePointsGroup(pointsGroup)}>
						Save
					</button>
				)}
				{shouldShowDeleteButton(
					pointsGroup,
					isHovering,
					isHoveringOverDeleteButton
				) && (
					<DeleteButton
						onClick={this.handleDeletePointsGroupInternal}
						onMouseEnter={this.turnOnIsHoveringOverDeleteButton}
						onMouseLeave={this.turnOffIsHoveringOverDeleteButton}
					/>
				)}
				{pointsGroup.itemPermissionType === ItemPermissionType.Public &&
					(isActive || isHovering) && (
						<Label color={colors.white}>{'Default'}</Label>
					)}
			</PointsGroupWrapper>
		);
	}
}

const shouldShowDeleteButton = (
	pg: IPointsGroup,
	isHovering: boolean,
	isHoveringOverDeleteButton: boolean
) =>
	pg.pointsGroupId &&
	pg.itemPermissionType !== ItemPermissionType.Public &&
	(isHovering || pg.isActive || isHoveringOverDeleteButton);

// types
export interface IOwnProps {
	pointsGroup: IPointsGroup;
}

interface IDispatchProps {
	handleDeletePointsGroup: typeof deletePointsGroup.request;
	handleSetActivePointsGroup: typeof setActivePointsGroup;
	handleSavePointsGroup: typeof savePointsGroup.request;
}

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			handleDeletePointsGroup: deletePointsGroup.request,
			handleSetActivePointsGroup: setActivePointsGroup,
			handleSavePointsGroup: savePointsGroup.request
		},
		dispatch
	);

type IProps = IOwnProps & IDispatchProps;

export const PointsGroup = connect(
	null,
	mapDispatchToProps
)(PointsGroupInternal);

const initialState = {
	isHovering: false,
	isHoveringOverDeleteButton: false
};

type IState = typeof initialState;

// css
const PointsGroupWrapper = styled<{ isActive: boolean }, 'div'>('div')`
	padding: 6px;
	border-radius: ${borderRadius.default};
	width: 12em;
	display: flex;
	justify-content: space-between;
	cursor: pointer;
	margin: 6px 0px;
	background-color: ${props =>
		props.isActive ? colors.primaryLight : colors.white};
	color: ${props => (props.isActive ? colors.white : colors.primaryDarkest)};
	&: hover {
		background-color: ${props =>
			props.isActive ? colors.primaryLight : colors.primaryLightest};
		transition: ${transitions.fast};
	}
`;