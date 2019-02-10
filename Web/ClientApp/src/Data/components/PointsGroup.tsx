import {
	borderRadius,
	colors,
	DeleteButton,
	transitions,
	Typography
} from 'njm-react-component-library';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { ItemPermissionType } from '../../Core';
import styled from 'styled-components';
import { deletePointsGroup, setActivePointsGroup } from '../actions';
import { IPointsGroup } from '../types';
import { Label } from '../../Core/components/Label';

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
		const { pointsGroup } = this.props;
		const { isHovering, isHoveringOverDeleteButton } = this.state;
		const { isActive } = pointsGroup;

		return (
			<PointsGroupWrapper
				key={pointsGroup.pointsGroupId}
				onMouseEnter={this.turnOnIsHovering}
				onMouseLeave={this.turnOffIsHovering}
				isActive={isActive}
				onClick={this.handleSetActivePointsGroupInternal}>
				<Typography variant="h3" noMargin={true} color={'inherit'}>
					{pointsGroup.name}
				</Typography>
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
				{pointsGroup.itemPermissionType ===
					ItemPermissionType.Default &&
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
	pg.itemPermissionType !== ItemPermissionType.Default &&
	(isHovering || pg.isActive || isHoveringOverDeleteButton);

// types
export interface IOwnProps {
	pointsGroup: IPointsGroup;
}

interface IDispatchProps {
	handleDeletePointsGroup: typeof deletePointsGroup.request;
	handleSetActivePointsGroup: typeof setActivePointsGroup;
}

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			handleDeletePointsGroup: deletePointsGroup.request,
			handleSetActivePointsGroup: setActivePointsGroup
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
const PointsGroupWrapper = styled<{ isActive: boolean }, 'button'>('button')`
	padding: 10px 6px;
	border-radius: ${borderRadius.default};
	display: flex;
	justify-content: space-between;
	cursor: pointer;
	margin: 6px 0px;
	border: none;
	outline: none;
	width: 100%;
	height: 36px;
	align-items: center;
	background-color: ${props =>
		props.isActive ? colors.primaryLight : colors.white};
	color: ${props => (props.isActive ? colors.white : colors.primaryDarkest)};
	&:hover,
	&:focus {
		background-color: ${props =>
			props.isActive ? colors.primaryLight : colors.primaryLightest};
		transition: ${transitions.fast};
	}
`;
