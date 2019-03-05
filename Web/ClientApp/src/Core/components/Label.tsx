import * as React from "react";
import styled from "styled-components";
import { Typography } from "njm-react-component-library";

export const Label: React.SFC<IOwnProps> = ({ children, color }) => {
	return (
		<StyledLabel color={"red"}>
			<Typography sizeVariant={2} colorVariant={"primaryLight"}>
				{children}
			</Typography>
		</StyledLabel>
	);
};

const StyledLabel = styled("span")<{ color: string }>`
	text-transform: uppercase;
	color: ${props => props.color};
	display: flex;
	align-items: center;
`;

interface IOwnProps {
	children: string;
	color?: string;
}
