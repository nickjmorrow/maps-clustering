import { Slider, Typography } from 'njm-react-component-library';
import * as React from 'react';
import { IPoint } from 'src/Data/types';

export const AhcParameters: React.SFC<IProps> = ({
	min,
	max,
	clusterCount,
	points,
	onClusterCountChange: handleClusterCountChange
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
		</div>
	);
};

// helpers
const convertIterationsToClusterCount = (
	iterations: number,
	points: IPoint[]
) => points.length - iterations + 1;
const convertClusterCountToIterations = (
	clusterCount: number,
	points: IPoint[]
) => 1 + points.length - clusterCount;

// types
interface IProps {
	min: number;
	max: number;
	clusterCount: number;
	points: IPoint[];
	onClusterCountChange(value: number): void;
}
