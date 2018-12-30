import * as React from 'react';
import { Typography, Slider } from 'njm-react-component-library';

export const DbscanParameters: React.SFC<IProps> = ({
	minDistanceBetweenPoints,
	maxDistanceBetweenPoints,
	minMinimumPoints,
	maxMinimumPoints,
	distanceBetweenPoints,
	minimumPoints,
	onDistanceBetweenPointsChange: handleDistanceBetweenPointsChange,
	onMinimumPointsChange: handleMinimumPointsChange
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
		</div>
	);
};

interface IProps {
	minDistanceBetweenPoints: number;
	maxDistanceBetweenPoints: number;
	minMinimumPoints: number;
	maxMinimumPoints: number;
	distanceBetweenPoints: number;
	minimumPoints: number;
	onDistanceBetweenPointsChange(distanceBetweenPoints: number): void;
	onMinimumPointsChange(minimumPoints: number): void;
}
