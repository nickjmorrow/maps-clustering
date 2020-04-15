import { Typography } from '@nickjmorrow/react-component-library';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { IReduxState } from 'reducer';
import styled from 'styled-components';
import { TitleWrapper } from '../../Core/components/TitleWrapper';
import { getActivePointsGroup } from '../../Data/selectors';
import { Code } from './Code';
import { Header } from './Header';
import { IPointsGroup } from 'Data/types';
import { LoadingBar } from 'Data/components/LoadingBar';

export const Summary: React.SFC = () => {
	const activePointsGroup = useSelector((state: IReduxState) => getActivePointsGroup(state));
	if (activePointsGroup) {
		return <LoadedSummary activePointsGroup={activePointsGroup} />;
	}

	return <UnloadedSummary />;
};

const CustomLoadingBar = styled(LoadingBar)``;

const UnloadedSummary: React.FC = () => {
	return (
		<TemplateSummary
			interclusterDistance={<CustomLoadingBar style={{ width: '56px', height: '26px' }} />}
			averageIntraclusterDistance={<CustomLoadingBar style={{ width: '27px', height: '26px' }} />}
			averageClusterSize={<CustomLoadingBar style={{ width: '104px', height: '26px' }} />}
		/>
	);
};

const LoadedSummary: React.FC<{ activePointsGroup: IPointsGroup }> = ({ activePointsGroup }) => {
	const clusteringSummary =
		activePointsGroup.calculationOutput.clusteringSummaries[activePointsGroup.clusterCount - 1];
	const { averageClusterSize, averageIntraclusterDistance, interclusterDistance } = clusteringSummary;
	return (
		<TemplateSummary
			interclusterDistance={<Code>{interclusterDistance}</Code>}
			averageIntraclusterDistance={<Code>{averageIntraclusterDistance}</Code>}
			averageClusterSize={<Code>{averageClusterSize}</Code>}
		/>
	);
};

const TemplateSummary: React.FC<{
	interclusterDistance: React.ReactNode;
	averageIntraclusterDistance: React.ReactNode;
	averageClusterSize: React.ReactNode;
}> = ({ interclusterDistance, averageIntraclusterDistance, averageClusterSize }) => {
	return (
		<div>
			<TitleWrapper>
				<Header>Summary</Header>
			</TitleWrapper>
			<TextWrapper>
				<Wrapper>
					<Typography colorVariant={'secondaryDark'}>Average distance between clusters:</Typography>
					{interclusterDistance}
				</Wrapper>
				<Wrapper>
					<Typography colorVariant={'secondaryDark'}>Average distance within clusters:</Typography>
					{averageIntraclusterDistance}
				</Wrapper>
				<Wrapper>
					<Typography colorVariant={'secondaryDark'}>Average points per cluster:</Typography>
					{averageClusterSize}
				</Wrapper>
			</TextWrapper>
		</div>
	);
};

const Wrapper = styled.div`
	margin: 0 0 12px 0;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-start;
	grid-area: summary;
`;

const TextWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: space-between;
	min-width: 400px;
`;
