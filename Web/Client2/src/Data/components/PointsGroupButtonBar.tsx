import { Typography, TrashIcon } from '@nickjmorrow/react-component-library';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { ItemPermissionType } from '../../Core';
import { Label } from '../../Core/components/Label';
import { deletePointsGroup, setActivePointsGroup } from '../actions';
import { IPointsGroup } from '../types';
import { StyledPointsGroupButtonBar } from 'Data/components/StyledPointsGroupButtonBar';

const PointsGroupInternal: React.SFC<IProps> = ({
	pointsGroup,
	handleDeletePointsGroup,
	handleSetActivePointsGroup,
}) => {
	const [isHovering, setIsHovering] = React.useState(false);
	const [isHoveringOverDeleteButton, setIsHoveringOverDeleteButton] = React.useState(false);
	const turnOnIsHovering = () => setIsHovering(true);
	const turnOffIsHovering = () => setIsHovering(false);

	const handleDeletePointsGroupInternal = () => {
		handleDeletePointsGroup(pointsGroup.pointsGroupId!);
	};
	const handleClick = () => {
		if (!isHoveringOverDeleteButton) {
			handleSetActivePointsGroup(pointsGroup.pointsGroupId!);
		} else {
			handleDeletePointsGroupInternal();
		}
	};

	const { isActive } = pointsGroup;

	return (
		<StyledPointsGroupButtonBar
			key={pointsGroup.pointsGroupId}
			onMouseEnter={turnOnIsHovering}
			onMouseLeave={turnOffIsHovering}
			isActive={isActive}
			onClick={handleClick}
		>
			<Typography colorVariant={isActive ? 'primaryLight' : 'primaryDark'}>{pointsGroup.name}</Typography>
			{shouldShowDeleteButton(pointsGroup, isHovering, isHoveringOverDeleteButton) && (
				<TrashIcon
					onClick={handleDeletePointsGroupInternal}
					colorVariant={'primaryLight'}
					sizeVariant={2}
					onMouseEnter={() => setIsHoveringOverDeleteButton(true)}
					onMouseLeave={() => setIsHoveringOverDeleteButton(false)}
				/>
			)}
			{pointsGroup.itemPermissionType === ItemPermissionType.Public && (isActive || isHovering) && (
				<Label color={'white'}>{'Default'}</Label>
			)}
		</StyledPointsGroupButtonBar>
	);
};

const shouldShowDeleteButton = (pg: IPointsGroup, isHovering: boolean, isHoveringOverDeleteButton: boolean) =>
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
}

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			handleDeletePointsGroup: deletePointsGroup.request,
			handleSetActivePointsGroup: setActivePointsGroup,
		},
		dispatch,
	);

type IProps = IOwnProps & IDispatchProps;

export const PointsGroupButtonBar = connect(null, mapDispatchToProps)(PointsGroupInternal);
