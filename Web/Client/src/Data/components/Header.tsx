import * as React from 'react';
import { Typography, ThemeContext } from '@nickjmorrow/react-component-library';

export const Header: React.FC = ({ children }) => {
	const { spacing } = React.useContext(ThemeContext);
	return (
		<Typography sizeVariant={5} weightVariant={3} style={{ marginBottom: spacing.ss1 }}>
			{children}
		</Typography>
	);
};
