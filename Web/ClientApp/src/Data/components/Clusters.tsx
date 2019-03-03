import { Typography } from "njm-react-component-library";
import * as React from "react";
import styled from "styled-components";
import { ClusteredPoint, IPointsGroup } from "../types";
import { TitleWrapper } from "../../Core/components";

export const Clusters: React.SFC<IOwnProps> = ({ activePointsGroup }) => {
	if (!activePointsGroup) {
		return null;
	}
	const { clusterCount } = activePointsGroup;
	const clusteredPoints = getClusters(clusterCount, activePointsGroup);
	const clusterIds = [...new Set(clusteredPoints.map(cp => cp.clusterId))];
	const asRenderedPoints = (p: ClusteredPoint) => (
		<Typography key={p.pointId}>{p.name}</Typography>
	);
	const renderedClusteredPoints = clusterIds
		.sort((a: number, b: number) => a - b)
		.map((c: number) => {
			const points = clusteredPoints.filter(p => p.clusterId === c);
			const renderedPoints = points.map(asRenderedPoints);
			return (
				<Cluster key={c} color={activePointsGroup.pointsColors[c]}>
					{renderedPoints}
				</Cluster>
			);
		});
	return (
		<Wrapper>
			<TitleWrapper>
				<Typography sizeVariant={5}>Clusters</Typography>
			</TitleWrapper>
			<ClustersWrapper>{renderedClusteredPoints}</ClustersWrapper>
		</Wrapper>
	);
};

// types
interface IOwnProps {
	readonly activePointsGroup: IPointsGroup;
}

// css
const Cluster = styled("div")<{ color: string }>`
	width: max-content;
	border-left: 5px solid ${props => props.color};
	margin-bottom: 8px;
	padding-left: 6px;
`;

const ClustersWrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	grid-area: clusters;
`;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

// helpers
const getClusters = (
	clusterCount: number,
	activePointsGroup: IPointsGroup
): ClusteredPoint[] => {
	const ahcPoints = activePointsGroup.ahcInfo.ahcPoints;
	return activePointsGroup.ahcInfo.ahcPoints.map(ahc => ({
		...ahc,
		clusterId: ahc.clusterInfos[ahcPoints.length - clusterCount].clusterId
	}));
};
