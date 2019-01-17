import { IOption } from 'njm-react-component-library/lib/types';

export interface IPoint {
	pointId: number;
	name: string;
	horizontalDisplacement: number;
	verticalDisplacement: number;
}

export interface ClusteredPoint extends IPoint {
	clusterId: number;
}

export interface AgglomerativeHierarchicalClusterPoint extends IPoint {
	agglomerativeHierarchicalClusterInfos: ClusterInfo[];
}

export interface ClusterInfo {
	clusterCount: number;
	clusterId: number;
}

export interface IClusterOption extends IOption {
	parameters: React.ReactNode;
}

export type AgglomerativeHierarchicalClusterConfig = IPoint[];

export interface DbscanConfig {
	points: IPoint[];
	minimumPointsPerCluster: number;
	maximumDistanceBetweenPoints: number;
}

export interface IPointsGroup {
	pointsGroupId?: number;
	name: string;
	itemId?: number;
	points: IPoint[];
}

export interface IPointsGroupInput {
	formData: FormData;
	name: string;
}
