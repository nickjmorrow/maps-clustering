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

export interface ModeledPoint extends Point {
	agglomerativeHierarchicalClusterInfos: ClusterInfo[];
}

export interface ClusterInfo {
	clusterCount: number;
	clusterId: number;
}

export interface IClusterOption extends IOption {
	parameters: React.ReactNode;
}
