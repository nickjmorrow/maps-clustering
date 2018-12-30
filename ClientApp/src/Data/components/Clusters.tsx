import { Typography } from 'njm-react-component-library';
import * as React from 'react';
import styled from 'styled-components';
import { ClusteredPoint } from '../types';

export const Clusters: React.SFC<IProps> = ({ clusteredPoints }) => {
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

interface IProps {
	clusteredPoints: ClusteredPoint[];
}

const Cluster = styled.div`
	width: 300px;
`;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	min-height: 500px;
`;
