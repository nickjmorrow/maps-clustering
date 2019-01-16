import { IOption } from 'njm-react-component-library/lib/types';

export interface Point {
	pointId: number;
	name: string;
	horizontalDisplacement: number;
	verticalDisplacement: number;
}

export interface ClusteredPoint extends Point {
	clusterId: number;
}

export interface AgglomerativeHierarchicalClusterPoint extends Point {
	agglomerativeHierarchicalClusterInfos: ClusterInfo[];
}

export interface ClusterInfo {
	clusterCount: number;
	clusterId: number;
}

export interface IClusterOption extends IOption {
	parameters: React.ReactNode;
}

export type AgglomerativeHierarchicalClusterConfig = Point[];

export interface DbscanConfig {
	points: Point[];
	minimumPointsPerCluster: number;
	maximumDistanceBetweenPoints: number;
}

export interface IPointsGroup {
	pointsGroupId: number;
	pointsGroupName: string;
}
