import {
	Typography,
	ThemeContext,
	StyleConstant
} from "@nickjmorrow/react-component-library";
import * as React from "react";
import styled from "styled-components";
import { ClusterPoint, IPointsGroup } from "../types";
import { TitleWrapper } from "../../Core/components";
import { Header } from "./Header";
import { Code } from "./Code";
import { Paper } from "./Paper";

export const Clusters: React.SFC<IOwnProps> = ({ activePointsGroup }) => {
	if (!activePointsGroup) {
		return null;
	}

	const { spacing } = React.useContext(ThemeContext);
	const { clusterCount } = activePointsGroup;
	const clusteredPoints = getClusters(clusterCount, activePointsGroup);
	const clusterIds = [...new Set(clusteredPoints.map(cp => cp.clusterId))];
	const asRenderedPoints = (p: ClusterPoint) => (
		<div>
			<Typography key={p.pointId}>{p.name}</Typography>
		</div>
	);
	const renderedClusteredPoints = clusterIds
		.sort((a: number, b: number) => a - b)
		.map((c: number) => {
			const points = clusteredPoints.filter(p => p.clusterId === c);
			const renderedPoints = points.map(asRenderedPoints);
			const intraclusterDistances = activePointsGroup.clusteringOutput.clusteringSummaries[
				clusterCount - 1
			].intraclusterDistances.find(icd => icd.clusterId === c);
			const distance =
				intraclusterDistances && intraclusterDistances.distance;

			return (
				<div
					key={`cluster-id-${c}`}
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "flex-start",
						width: "100%",
						justifyContent: "space-between"
					}}>
					<Cluster
						spacing={spacing}
						color={activePointsGroup.pointsColors[c]}>
						{renderedPoints}
					</Cluster>
					{distance === "0m" ? "" : <Code>{distance}</Code>}
				</div>
			);
		});
	return (
		<div style={{ display: "flex", justifyContent: "center" }}>
			<Paper
				style={{
					width: "min-content"
				}}>
				<TitleWrapper>
					<Header>Clusters</Header>
				</TitleWrapper>
				<ClustersWrapper>{renderedClusteredPoints}</ClustersWrapper>
			</Paper>
		</div>
	);
};

// types
interface IOwnProps {
	readonly activePointsGroup: IPointsGroup;
}

// css
const Cluster = styled("div")<{
	color: string;
	spacing: StyleConstant<"spacing">;
}>`
	border-left: ${p => p.spacing.ss2} solid ${props => props.color};
	margin-bottom: ${p => p.spacing.ss2};
	padding-left: ${p => p.spacing.ss2};
`;

const ClustersWrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	grid-area: clusters;
	align-items: center;
	width: 350px;
	@media (min-width: 900px) {
		align-items: flex-start;
	}
`;

// helpers
const getClusters = (
	clusterCount: number,
	activePointsGroup: IPointsGroup
): ClusterPoint[] => {
	const {
		clusteringOutput: { clusteredPoints }
	} = activePointsGroup;
	return clusteredPoints.map(ahc => ({
		...ahc,
		clusterId:
			ahc.clusterSnapshots[clusteredPoints.length - clusterCount]
				.clusterId
	}));
};
