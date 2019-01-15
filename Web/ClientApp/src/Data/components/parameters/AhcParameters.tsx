import * as React from 'react';
import { Typography, Button, Slider } from 'njm-react-component-library';
import { Point } from 'src/Data/types';

export const AhcParameters: React.SFC<IProps> = ({
	min,
	max,
	clusterCount,
	points,
	onClusterCountChange: handleClusterCountChange,
	onGetAgglomerativeHierarchicalClusters: handleGetAgglomerativeHierarchicalClusters
}) => {
	const handleClusterCountChangeInternal = (newIterations: number) =>
		handleClusterCountChange(
			convertIterationsToClusterCount(newIterations, points)
		);
	const iterations = convertClusterCountToIterations(clusterCount, points);
	return (
		<div>
			<Typography variant="h2">Number of Clusters</Typography>
			<Slider
				min={min}
				max={max}
				value={iterations}
				onChange={handleClusterCountChangeInternal}
			/>
			<Button onClick={handleGetAgglomerativeHierarchicalClusters}>
				Load AHCs
			</Button>
		</div>
	);
};

// helpers
const convertIterationsToClusterCount = (iterations: number, points: Point[]) =>
	points.length - iterations + 1;
const convertClusterCountToIterations = (
	clusterCount: number,
	points: Point[]
) => 1 + points.length - clusterCount;

// types
interface IProps {
	min: number;
	max: number;
	clusterCount: number;
	points: Point[];
	onClusterCountChange(value: number): void;
	onGetAgglomerativeHierarchicalClusters(): void;
}