import * as React from 'react';
import { ModeledPoint } from '../types';
import { Typography } from 'njm-react-component-library';
import styled from 'styled-components';

export const Clusters: React.SFC<IProps> = ({ modeledPoints, value }) => {
	const clusterIds = modeledPoints.reduce(
		(agg, mp) => {
			const clusterId =
				mp.agglomerativeHierarchicalClusterInfos[value - 1].clusterId;
			if (!agg.find(x => x === clusterId)) {
				agg.push(clusterId);
			}
			return agg;
		},
		[] as number[]
	);
	return (
		<Wrapper>
			{clusterIds
				.sort((a, b) => a - b)
				.map(c => {
					const points = modeledPoints.filter(
						mp =>
							mp.agglomerativeHierarchicalClusterInfos[value - 1]
								.clusterId === c
					);
					return (
						<Cluster key={c}>
							<Typography variant="h3">{`Cluster ${c}`}</Typography>
							{points.map(p => (
								<div key={p.name}>
									<Typography>{p.name}</Typography>
								</div>
							))}
						</Cluster>
					);
				})}
		</Wrapper>
	);
};

interface IProps {
	modeledPoints: ModeledPoint[];
	value: number;
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
