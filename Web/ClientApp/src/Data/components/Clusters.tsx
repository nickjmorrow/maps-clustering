import { Typography, IOption } from 'njm-react-component-library';
import * as React from 'react';
import styled from 'styled-components';
import { ClusteredPoint, IPointsGroup } from '../types';
import { clusterTypes } from '../constants';
import { connect } from 'react-redux';
import { IReduxState } from '../../reducer';

export const ClustersInternal: React.SFC<IProps> = ({
	activePointsGroup,
	currentClusterOption,
	clusterCount
}) => {
	if (!activePointsGroup) {
		return null;
	}
	const clusteredPoints = getClusters(
		currentClusterOption,
		clusterCount,
		activePointsGroup
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
	const asRenderedPoints = (p: ClusteredPoint) => (
		<Typography key={p.pointId}>{p.name}</Typography>
	);
	const renderedClusteredPoints = clusterIds
		.sort((a: number, b: number) => a - b)
		.map((c: number) => {
			const points = clusteredPoints.filter(p => p.clusterId === c);
			const renderedPoints = points.map(asRenderedPoints);
			return (
				<Cluster key={c} color={activePointsGroup.pointsColors[c]}>
					{renderedPoints}
				</Cluster>
			);
		});
	return <Wrapper>{renderedClusteredPoints}</Wrapper>;
};

// types
interface IOwnProps {
	activePointsGroup: IPointsGroup;
	currentClusterOption: IOption;
	clusterCount: number;
}

interface IReduxProps {
	clusterCount: number;
}

type IProps = IOwnProps & IReduxProps;

// redux
const mapStateToProps = (state: IReduxState): IReduxProps => ({
	clusterCount: state.data.clusterCount
});

export const Clusters = connect(mapStateToProps)(ClustersInternal);

// css
const Cluster = styled<{ color: string }, 'div'>('div')`
	width: 300px;
	border-left: 5px solid ${props => props.color};
	margin-bottom: 8px;
	padding-left: 6px;
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
	activePointsGroup: IPointsGroup
): ClusteredPoint[] => {
	const unclusteredPoints = activePointsGroup.points.map(p => ({
		...p,
		clusterId: p.pointId
	}));

	switch (currentClusterOption.value) {
		case clusterTypes.none:
			return unclusteredPoints;
		case clusterTypes.ahcs:
			return activePointsGroup.ahcInfo.ahcPoints.map(ahc => {
				return {
					...ahc,
					clusterId: ahc.clusterInfos[clusterCount - 1].clusterId
				};
			});
		default:
			return unclusteredPoints;
	}
};
