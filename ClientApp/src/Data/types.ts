import { IOption } from 'njm-react-component-library/lib/types';

export interface Point {
	pointId: number;
	name: string;
	horizontalDisplacement: number;
	verticalDisplacement: number;
}

export interface ModeledPoint {
	agglomerativeHierarchicalClusterInfos: ClusterInfo[];
	horizontalDisplacement: number;
	verticalDisplacement: number;
	pointId: number;
	name: string;
}

export interface ClusterInfo {
	clusterCount: number;
	clusterId: number;
}

export interface IClusterOption extends IOption {
	parameters: React.ReactNode;
}
