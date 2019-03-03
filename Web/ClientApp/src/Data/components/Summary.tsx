import * as React from "react";
import {
	Typography,
	ThemeContext,
	StyleConstant
} from "njm-react-component-library";
import styled from "styled-components";
import { TitleWrapper } from "../../Core/components/TitleWrapper";

export const Summary: React.SFC = () => {
	const {
		colors,
		border: { borderRadius }
	} = React.useContext(ThemeContext);
	return (
		<FlexCenter>
			<TitleWrapper>
				<Typography sizeVariant={4}>Summary</Typography>
			</TitleWrapper>
			<TextWrapper>
				<Wrapper>
					<Typography>
						The average distance between clusters is:
					</Typography>
					<Code colors={colors} borderRadius={borderRadius}>
						1.3 km
					</Code>
				</Wrapper>
				<Wrapper>
					<Typography>
						The average size of each cluster is:
					</Typography>
					<Code colors={colors} borderRadius={borderRadius}>
						9.2 points
					</Code>
				</Wrapper>
			</TextWrapper>
		</FlexCenter>
	);
};

const Code = styled("span")<{
	colors: StyleConstant<"colors">;
	borderRadius: StyleConstant<"border">["borderRadius"];
}>`
	font-family: "Courier New", Courier, monospace;
	background-color: ${p => p.colors.core.lightest};
	color: ${p => p.colors.core.dark};
	padding: 4px;
	border-radius: ${p => p.borderRadius.br1};
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
