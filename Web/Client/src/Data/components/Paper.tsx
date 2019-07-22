import {
	Paper as GenericPaper,
	ThemeContext
} from "@nickjmorrow/react-component-library";
import * as React from "react";

export const Paper: React.FC<{ style?: React.CSSProperties }> = ({
	children,
	style
}) => {
	const { spacing } = React.useContext(ThemeContext);
	const defaultStyle = { padding: spacing.ss6, height: "min-content" };
	const paperStyle = { ...defaultStyle, ...style };
	return <GenericPaper style={paperStyle}>{children}</GenericPaper>;
};
