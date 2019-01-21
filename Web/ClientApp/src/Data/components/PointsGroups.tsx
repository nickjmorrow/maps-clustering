import * as React from 'react';
import styled from 'styled-components';
import { IPointsGroup } from '../types';
import {
	borderRadius,
	border,
	transitions,
	Typography
} from 'njm-react-component-library';
import { ItemPermissionType } from 'src/Core/types';
import { Dispatch, bindActionCreators } from 'redux';
import { setActivePointsGroup, deletePointsGroup } from '..';
import { connect } from 'react-redux';
import { savePointsGroup } from '../actions';

export const PointsGroupsInternal: React.SFC<IProps> = ({
	pointsGroups,
	handleDeletePointsGroup,
	handleSetActivePointsGroup,
	handleSavePointsGroup
}) => {
	const renderPointsGroup = (pg: IPointsGroup) => (
		<PointsGroupWrapper
			key={pg.pointsGroupId}
			onClick={() => handleSetActivePointsGroup(pg.pointsGroupId!)}>
			<Typography>{pg.name}</Typography>
			{!pg.pointsGroupId && (
				<button onClick={() => handleSavePointsGroup(pg)}>Save</button>
			)}
			{pg.pointsGroupId &&
				pg.itemPermissionType !== ItemPermissionType.Public && (
					<SmallCloseIcon
						onClick={() =>
							handleDeletePointsGroup(pg.pointsGroupId!)
						}>
						Delete
					</SmallCloseIcon>
				)}
		</PointsGroupWrapper>
	);

	return <div>{pointsGroups.map(renderPointsGroup)}</div>;
};

// css
const PointsGroupWrapper = styled.div`
	padding: 4px;
	border-radius: ${borderRadius.default};
	border: 1px solid transparent;
	width: min-content;
	cursor: pointer;
	&: hover {
		border: ${border.default};
		transition: ${transitions.fast};
	}
`;

const SmallCloseIcon = styled.button``;

// redux
const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			handleSetActivePointsGroup: setActivePointsGroup,
			handleDeletePointsGroup: deletePointsGroup.request,
			handleSavePointsGroup: savePointsGroup.request
		},
		dispatch
	);

export const PointsGroups = connect(
	null,
	mapDispatchToProps
)(PointsGroupsInternal);

// types
interface IOwnProps {
	pointsGroups: IPointsGroup[];
}

interface IDispatchProps {
	handleSetActivePointsGroup: typeof setActivePointsGroup;
	handleDeletePointsGroup: typeof deletePointsGroup.request;
	handleSavePointsGroup: typeof savePointsGroup.request;
}

type IProps = IOwnProps & IDispatchProps;
