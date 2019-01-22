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

class PointsGroupInternal extends React.Component<IProps, IState> {
	readonly state = initialState;

	toggleIsHovering = () =>
		this.setState(prevState => ({
			isHovering: !prevState.isHovering
		}));

	public render() {
		const {
			pointsGroup,
			handleDeletePointsGroup,
			handleSetActivePointsGroup,
			handleSavePointsGroup
		} = this.props;
		const { isHovering } = this.state;
		const { isActive } = pointsGroup;

		return (
			<PointsGroupWrapper
				key={pointsGroup.pointsGroupId}
				onMouseEnter={this.toggleIsHovering}
				onMouseLeave={this.toggleIsHovering}
				isActive={isActive}
				onClick={() =>
					handleSetActivePointsGroup(pointsGroup.pointsGroupId!)
				}>
				<Typography variant="h4" noMargin={true} color={'inherit'}>
					{pointsGroup.name}
				</Typography>
				{!pointsGroup.pointsGroupId && (
					<button onClick={() => handleSavePointsGroup(pointsGroup)}>
						Save
					</button>
				)}
				{shouldShowDeleteButton(pointsGroup, isHovering) && (
					<DeleteButton
						onClick={() =>
							handleDeletePointsGroup(pointsGroup.pointsGroupId!)
						}
					/>
				)}
			</PointsGroupWrapper>
		);
	}
}

const shouldShowDeleteButton = (pg: IPointsGroup, isHovering: boolean) =>
	pg.pointsGroupId &&
	pg.itemPermissionType !== ItemPermissionType.Public &&
	isHovering;

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
	isHovering: false
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
	background-color: ${props =>
		props.isActive ? colors.primaryLight : colors.white};
	color: ${props => (props.isActive ? colors.white : colors.primaryDarkest)};
	&: hover {
		background-color: ${props =>
			props.isActive ? colors.primaryLight : colors.primaryLightest};
		transition: ${transitions.fast};
	}
`;
