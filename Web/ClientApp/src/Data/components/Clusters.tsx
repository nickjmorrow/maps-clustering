import { Typography, IOption } from 'njm-react-component-library';
import * as React from 'react';
import styled from 'styled-components';
import { ClusteredPoint, IPointsGroup } from '../types';
import { clusterTypes } from '../constants';
import { getAhcs } from '../actions';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

export const ClustersInternal: React.SFC<IProps> = ({
	activePointsGroup,
	currentClusterOption,
	clusterCount,
	onGetAhcs
}) => {
	const clusteredPoints = getClusters(
		currentClusterOption,
		clusterCount,
		activePointsGroup,
		onGetAhcs
	);
	const clusterIds = clusteredPoints.reduce(
		(agg, cp) => {
			const clusterId = cp.clusterId;
			if (!agg.find(x => x === clusterId)) {
				agg.push(clusterId);
			}
			return agg;
		},
		[] as number[]
	);
	const includeClusterLabelling =
		clusterIds.length !== clusteredPoints.length;
	const asRenderedPoints = (p: ClusteredPoint) => (
		<Typography key={p.pointId}>{p.name}</Typography>
	);
	const renderedUnclusteredPoints = clusteredPoints.map(asRenderedPoints);
	const renderedClusteredPoints = clusterIds
		.sort((a: number, b: number) => a - b)
		.map((c: number) => {
			const points = clusteredPoints.filter(p => p.clusterId === c);
			const renderedPoints = points.map(asRenderedPoints);
			return (
				<Cluster key={c}>
					<Typography variant="h3">{`Cluster ${c}`}</Typography>
					{renderedPoints}
				</Cluster>
			);
		});
	return (
		<Wrapper>
			{includeClusterLabelling
				? renderedClusteredPoints
				: renderedUnclusteredPoints}
		</Wrapper>
	);
};

// types
interface IOwnProps {
	activePointsGroup: IPointsGroup;
	currentClusterOption: IOption;
	clusterCount: number;
}

interface IDispatchProps {
	onGetAhcs: typeof getAhcs.request;
}

type IProps = IDispatchProps & IOwnProps;

// redux
const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			onGetAhcs: getAhcs.request
		},
		dispatch
	);

export const Clusters = connect(
	null,
	mapDispatchToProps
)(ClustersInternal);

// css
const Cluster = styled.div`
	width: 300px;
`;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	min-height: 500px;
`;

// helpers

const getClusters = (
	currentClusterOption: IOption,
	clusterCount: number,
	activePointsGroup: IPointsGroup,
	onGetAhcs: (pointsGroup: IPointsGroup) => void
): ClusteredPoint[] => {
	if (!activePointsGroup || !activePointsGroup.points) {
		return [];
	}
	const unclusteredPoints = activePointsGroup.points.map(p => ({
		...p,
		clusterId: p.pointId
	}));

	if (currentClusterOption.value === clusterTypes.none) {
		return unclusteredPoints;
	}

	switch (currentClusterOption.value) {
		case clusterTypes.ahcs:
			// if clusterInfo is not present, request for it and return
			// unclustered points
			if (
				activePointsGroup.ahcInfo === undefined ||
				activePointsGroup.ahcInfo.ahcPoints === undefined
			) {
				onGetAhcs(activePointsGroup);
				return unclusteredPoints;
			}

			return activePointsGroup.ahcInfo.ahcPoints.map(ahc => {
				return {
					...ahc,
					clusterId:
						ahc.agglomerativeHierarchicalClusterInfos[
							clusterCount - 1
						].clusterId
				};
			});
		default:
			return unclusteredPoints;
	}
};
