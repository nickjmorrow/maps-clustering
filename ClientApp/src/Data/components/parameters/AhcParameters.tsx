import * as React from 'react';
import { Typography, Button, Slider } from 'njm-react-component-library';

export const AhcParameters: React.SFC<IProps> = ({
	min,
	max,
	clusterCount,
	onDistanceBetweenPointsChange: handleDistanceBetweenPointsChange,
	onGetAgglomerativeHierarchicalClusters: handleGetAgglomerativeHierarchicalClusters
}) => (
	<div>
		<Typography variant="h2">Number of Clusters</Typography>
		<Slider
			min={min}
			max={max}
			value={clusterCount}
			onChange={handleDistanceBetweenPointsChange}
		/>
		<Button onClick={handleGetAgglomerativeHierarchicalClusters}>
			Load AHCs
		</Button>
	</div>
);

interface IProps {
	min: number;
	max: number;
	clusterCount: number;
	onDistanceBetweenPointsChange(value: number): void;
	onGetAgglomerativeHierarchicalClusters(): void;
}
