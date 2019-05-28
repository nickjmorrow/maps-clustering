import { IOption } from "@nickjmorrow/react-component-library";
import { ItemPermissionType } from "../Core";

export interface IPoint {
	pointId: number;
	name: string;
	horizontalDisplacement: number;
	verticalDisplacement: number;
}

export interface ClusterPoint extends IPoint {
	clusterId: number;
}

export interface ClusteredPoint extends IPoint {
	clusterSnapshots: ClusterSnapshot[];
}

// TODO: calculate orderId correctly
export interface ClusterSnapshot {
	clusterCount: number;
	clusterId: number;
	orderId: number;
}

export interface IClusterOption extends IOption {
	parameters: React.ReactNode;
}

export interface IPointsGroup {
	pointsGroupId?: number;
	name: string;
	averageHorizontalDisplacement: number;
	averageVerticalDisplacement: number;
	points: IPoint[];
	itemPermissionType: ItemPermissionType;
	calculationOutput: CalculationOutput;
	isActive: boolean;
	pointsColors: string[];
	clusterCount: number;
}

export interface CalculationOutput {
	orderedPoints: ClusteredPoint[];
	clusteringSummaries: ClusteringSummary[];
}
interface ClusteringSummary {
	clusterCount: number;
	interclusterDistance: string;
	intraclusterDistances: Array<{
		clusterId: number;
		distance: string;
	}>;
	averageClusterSize: string;
	averageIntraclusterDistance: string;
}

export type PointsGroupId = number;
