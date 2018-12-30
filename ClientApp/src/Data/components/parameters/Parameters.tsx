import { clusterTypes } from 'src/Data/constants';
import { IOption } from 'njm-react-component-library';
import * as React from 'react';
import { AhcParameters, DbscanParameters } from '.';
import { Point } from 'src/Data/types';

export const Parameters: React.SFC<IProps> = ({
	points,
	distanceBetweenPoints,
	minimumPoints,
	clusterCount,
	currentClusterOption,
	onClusterCountChange: handleClusterCountChange,
	onGetAgglomerativeHierarchicalClusters: handleGetAgglomerativeHierarchicalClusters,
	onDistanceBetweenPointsChange: handleDistanceBetweenPointsChange,
	onMinimumPointsChange: handleMinimumPointsChange
}) => {
	const minClusters = 1;
	const maxClusters = points.length;
	const minDistanceBetweenPoints = 1;
	const maxDistanceBetweenPoints = 5;
	const minMinimumPoints = 1;
	const maxMinimumPoints = 10;

	if (!currentClusterOption) {
		return null;
	}
	switch (currentClusterOption.value) {
		case clusterTypes.agglomerativeHierarchicalClusters:
			return (
				<AhcParameters
					min={minClusters}
					max={maxClusters}
					clusterCount={clusterCount}
					points={points}
					onClusterCountChange={handleClusterCountChange}
					onGetAgglomerativeHierarchicalClusters={
						handleGetAgglomerativeHierarchicalClusters
					}
				/>
			);
		case clusterTypes.dbscan:
			return (
				<DbscanParameters
					minDistanceBetweenPoints={minDistanceBetweenPoints}
					maxDistanceBetweenPoints={maxDistanceBetweenPoints}
					maxMinimumPoints={maxMinimumPoints}
					minMinimumPoints={minMinimumPoints}
					distanceBetweenPoints={distanceBetweenPoints}
					minimumPoints={minimumPoints}
					onDistanceBetweenPointsChange={
						handleDistanceBetweenPointsChange
					}
					onMinimumPointsChange={handleMinimumPointsChange}
				/>
			);
		default:
			return <div>Hello</div>;
	}
};

interface IProps {
	distanceBetweenPoints: number;
	minimumPoints: number;
	currentClusterOption: IOption | null;
	clusterCount: number;
	points: Point[];
	onDistanceBetweenPointsChange(distanceBetweenPoints: number): void;
	onMinimumPointsChange(minimumPoints: number): void;
	onClusterCountChange(clusterCount: number): void;
	onGetAgglomerativeHierarchicalClusters(): void;
}
