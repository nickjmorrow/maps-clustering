import { Typography } from 'njm-react-component-library';
import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IReduxState } from '../../reducer';
import { ClusteredPoint, IPointsGroup } from '../types';

export const ClustersInternal: React.SFC<IProps> = ({
	activePointsGroup,
	clusterCount
}) => {
	if (!activePointsGroup) {
		return null;
	}
	const clusteredPoints = getClusters(clusterCount, activePointsGroup);
	const clusterIds = [...new Set(clusteredPoints.map(cp => cp.clusterId))];
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
	return (
		<Wrapper>
			<Typography variant="h2">Clusters</Typography>
			{renderedClusteredPoints}
		</Wrapper>
	);
};

// types
interface IOwnProps {
	readonly activePointsGroup: IPointsGroup;
	readonly clusterCount: number;
}

interface IReduxProps {
	readonly clusterCount: number;
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
	clusterCount: number,
	activePointsGroup: IPointsGroup
): ClusteredPoint[] => {
	return activePointsGroup.ahcInfo.ahcPoints.map(ahc => ({
		...ahc,
		clusterId: ahc.clusterInfos[clusterCount - 1].clusterId
	}));
};
