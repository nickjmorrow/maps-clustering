import {
	StyleConstant,
	ThemeContext
} from "@nickjmorrow/react-component-library";
import styled from "styled-components";
import * as React from "react";
const StyledCode = styled("span")<{
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

export const Code: React.FC = ({ children }) => {
	const {
		colors,
		border: { borderRadius }
	} = React.useContext(ThemeContext);
	return (
		<StyledCode borderRadius={borderRadius} colors={colors}>
			{children}
		</StyledCode>
	);
};
