import { IOption } from 'njm-react-component-library/lib/types';
import { ItemPermissionType } from 'src/Core';

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

export interface IPointsGroup {
	pointsGroupId?: number;
	name: string;
	averageHorizontalDisplacement: number;
	averageVerticalDisplacement: number;
	itemId?: number;
	points: IPoint[];
	isActive: boolean;
	ahcInfo?: IAhcInfo;
	dateCreated: Date;
	itemPermissionType: ItemPermissionType;
}

export interface IAhcInfo {
	ahcPoints: AgglomerativeHierarchicalClusterPoint[];
	clusterSummaryInfo: Array<{
		clusterAverageDistances: Array<{
			clusterId: number;
			averageDistance: number;
		}>;
		clusterCount: number;
	}>;
}

export interface IPointsGroupFormInput {
	file: FormData;
	name: string;
}

export type PointsGroupId = number;
