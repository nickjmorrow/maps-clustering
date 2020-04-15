import { Typography, StyleConstant } from '@nickjmorrow/react-component-library';
import * as React from 'react';
import styled from 'styled-components';
import { ClusterPoint, IPointsGroup } from '../types';
import { TitleWrapper } from '../../Core/components';
import { Header } from './Header';
import { Code } from './Code';
import { Paper } from './Paper';
import { LoadingBar } from 'Data/components/LoadingBar';

export const ClustersList: React.SFC<OwnProps> = ({ activePointsGroup }) => {
	const loadingContent = (
		<div style={{ display: 'grid', gridRowGap: '8px' }}>
			<LoadingBar />
			<LoadingBar />
			<LoadingBar />
		</div>
	);
	const content = activePointsGroup ? <ClusterPointList activePointsGroup={activePointsGroup} /> : loadingContent;

	return (
		<div style={{ display: 'flex', justifyContent: 'center' }}>
			<Paper
				style={{
					width: 'min-content',
				}}
			>
				<TitleWrapper>
					<Header>Clusters</Header>
				</TitleWrapper>
				<ClustersWrapper>{content}</ClustersWrapper>
			</Paper>
		</div>
	);
};

const LoadingContent: React.FC = () => {
	return <div />;
};

const ClusterPointList: React.FC<{ activePointsGroup: IPointsGroup }> = ({ activePointsGroup }) => {
	const { clusterCount } = activePointsGroup;
	const clusteredPoints = getClusters(clusterCount, activePointsGroup);
	const clusterIds = [...new Set(clusteredPoints.map(cp => cp.clusterId))];
	const asRenderedPoints = (p: ClusterPoint) => (
		<div key={`point-id-${p.pointId}`}>
			<Typography key={p.pointId}>{p.name}</Typography>
		</div>
	);
	return (
		<>
			{clusterIds
				.sort((a: number, b: number) => a - b)
				.map((c: number) => {
					const points = clusteredPoints.filter(p => p.clusterId === c);
					const renderedPoints = points.map(asRenderedPoints);
					const intraclusterDistances = activePointsGroup.calculationOutput.clusteringSummaries[
						clusterCount - 1
					].intraclusterDistances.find(icd => icd.clusterId === c);
					const distance = intraclusterDistances && intraclusterDistances.distance;

					return (
						<div
							key={`cluster-id-${c}`}
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'flex-start',
								width: '100%',
								justifyContent: 'space-between',
							}}
						>
							<Cluster color={activePointsGroup.pointsColors[c]}>{renderedPoints}</Cluster>
							{distance === '0m' ? '' : <Code>{distance}</Code>}
						</div>
					);
				})}
		</>
	);
};

// types
interface OwnProps {
	readonly activePointsGroup: IPointsGroup;
}

// css
const Cluster = styled('div')<{
	color: string;
	spacing: StyleConstant<'spacing'>;
}>`
	border-left: ${p => p.theme.njmTheme.spacing.ss2} solid ${props => props.color};
	margin-bottom: ${p => p.theme.njmTheme.spacing.ss2};
	padding-left: ${p => p.theme.njmTheme.spacing.ss2};
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
const getClusters = (clusterCount: number, activePointsGroup: IPointsGroup): ClusterPoint[] => {
	const {
		calculationOutput: { orderedPoints: clusteredPoints },
	} = activePointsGroup;
	return clusteredPoints.map(ahc => ({
		...ahc,
		clusterId: ahc.clusterSnapshots[clusteredPoints.length - clusterCount].clusterId,
	}));
};
