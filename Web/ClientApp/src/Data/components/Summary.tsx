import * as React from 'react';
import { Typography, colors, borderRadius } from 'njm-react-component-library';
import styled from 'styled-components';
import { TitleWrapper } from '../../Core/components/TitleWrapper';

export const Summary: React.SFC = () => {
	return (
		<FlexCenter>
			<TitleWrapper>
				<Typography variant="h2">Summary</Typography>
			</TitleWrapper>
			<TextWrapper>
				<Wrapper>
					<Typography>
						The average distance between clusters is:
					</Typography>
					<Code>1.3 km</Code>
				</Wrapper>
				<Wrapper>
					<Typography>
						The average size of each cluster is:
					</Typography>
					<Code>9.2 points</Code>
				</Wrapper>
			</TextWrapper>
		</FlexCenter>
	);
};

const Code = styled.span`
	font-family: 'Courier New', Courier, monospace;
	background-color: ${colors.primaryLightest};
	color: ${colors.primaryDark};
	padding: 4px;
	border-radius: ${borderRadius.default};
	font-weight: 600;
	white-space: nowrap;
`;

const Wrapper = styled.div`
	margin: 12px 0px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	grid-area: summary;
	width: 100%;
`;

const FlexCenter = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	@media (min-width: 800px) {
		align-items: flex-start;
	}
`;

const TextWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 400px;
`;
