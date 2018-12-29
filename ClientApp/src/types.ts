import { IOption } from 'njm-react-component-library';

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
