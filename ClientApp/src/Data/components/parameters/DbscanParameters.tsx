import * as React from 'react';
import { Typography, Slider, Button } from 'njm-react-component-library';

export const DbscanParameters: React.SFC<IProps> = ({
	minDistanceBetweenPoints,
	maxDistanceBetweenPoints,
	minMinimumPointsPerCluster: minMinimumPoints,
	maxMinimumPointsPerCluster: maxMinimumPoints,
	maximumDistanceBetweenPoints: distanceBetweenPoints,
	minimumPointsPerCluster: minimumPoints,
	onDistanceBetweenPointsChange: handleDistanceBetweenPointsChange,
	onMinimumPointsPerClusterChange: handleMinimumPointsChange,
	onGetDbscan: handleGetDbscan
}) => {
	return (
		<div>
			<Typography variant="h2">Distance between Points</Typography>
			<Slider
				min={minDistanceBetweenPoints}
				max={maxDistanceBetweenPoints}
				value={distanceBetweenPoints}
				onChange={handleDistanceBetweenPointsChange}
			/>
			<Typography variant="h2">Minimum Points</Typography>
			<Slider
				min={minMinimumPoints}
				max={maxMinimumPoints}
				value={minimumPoints}
				onChange={handleMinimumPointsChange}
			/>
			<Button onClick={handleGetDbscan}>Get Dbscan</Button>
		</div>
	);
};

interface IProps {
	minDistanceBetweenPoints: number;
	maxDistanceBetweenPoints: number;
	minMinimumPointsPerCluster: number;
	maxMinimumPointsPerCluster: number;
	maximumDistanceBetweenPoints: number;
	minimumPointsPerCluster: number;
	onDistanceBetweenPointsChange(distanceBetweenPoints: number): void;
	onMinimumPointsPerClusterChange(minimumPoints: number): void;
	onGetDbscan(): void;
}
