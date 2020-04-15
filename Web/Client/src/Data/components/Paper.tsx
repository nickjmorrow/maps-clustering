import { Paper as GenericPaper, useThemeContext } from '@nickjmorrow/react-component-library';
import * as React from 'react';

export const Paper: React.FC<{ style?: React.CSSProperties }> = ({ children, style }) => {
	const theme = useThemeContext();
	const defaultStyle = {
		padding: theme.spacing.ss6,
		height: 'min-content',
		boxShadow: theme.boxShadow.bs1,
		borderRadius: theme.border.borderRadius.br1,
	};
	const paperStyle = { ...defaultStyle, ...style };
	return <GenericPaper style={paperStyle}>{children}</GenericPaper>;
};
