import * as React from 'react';
import { ModeledPoint } from 'src/types';
import { Typography } from 'njm-react-component-library';

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
		<div>
			{clusterIds
				.sort((a, b) => a - b)
				.map(c => {
					const points = modeledPoints.filter(
						mp =>
							mp.agglomerativeHierarchicalClusterInfos[value - 1]
								.clusterId === c
					);
					return (
						<div key={c}>
							<Typography variant="h3">{`Cluster ${c}`}</Typography>
							{points.map(p => (
								<div key={p.name}>
									<Typography>{p.name}</Typography>
								</div>
							))}
						</div>
					);
				})}
		</div>
	);
};

interface IProps {
	modeledPoints: ModeledPoint[];
	value: number;
}
