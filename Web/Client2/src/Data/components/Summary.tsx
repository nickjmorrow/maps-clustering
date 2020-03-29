import { Typography } from '@nickjmorrow/react-component-library';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { IReduxState } from 'reducer';
import styled from 'styled-components';
import { TitleWrapper } from '../../Core/components/TitleWrapper';
import { getActivePointsGroup } from '../../Data/selectors';
import { Code } from './Code';
import { Header } from './Header';

// TODO: relative imports

export const Summary: React.SFC = () => {
	const activePointsGroup = useSelector((state: IReduxState) => getActivePointsGroup(state));
	if (!activePointsGroup) {
		return null;
	}
	const clusteringSummary =
		activePointsGroup.calculationOutput.clusteringSummaries[activePointsGroup.clusterCount - 1];
	const { averageClusterSize, averageIntraclusterDistance, interclusterDistance } = clusteringSummary;
	return (
		<div>
			<TitleWrapper>
				<Header>Summary</Header>
			</TitleWrapper>
			<TextWrapper>
				<Wrapper>
					<Typography colorVariant={'secondaryDark'}>Average distance between clusters:</Typography>
					<Code>{interclusterDistance}</Code>
				</Wrapper>
				<Wrapper>
					<Typography colorVariant={'secondaryDark'}>Average distance within clusters:</Typography>
					<Code>{averageIntraclusterDistance}</Code>
				</Wrapper>
				<Wrapper>
					<Typography colorVariant={'secondaryDark'}>Average points per cluster:</Typography>
					<Code>{averageClusterSize}</Code>
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

// const FlexCenter = styled.div`
// 	display: flex;
// 	align-items: center;
// 	flex-direction: column;
// 	@media (min-width: 800px) {
// 		align-items: flex-start;
// 	}
// `;

const TextWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: space-between;
	min-width: 400px;
`;
