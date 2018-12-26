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
