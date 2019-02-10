import * as React from 'react';
import styled from 'styled-components';
import { Typography, colors } from 'njm-react-component-library';

export const Label: React.SFC<IOwnProps> = ({
	children,
	color = colors.primaryDark
}) => (
	<StyledLabel color={color}>
		<Typography variant="h4" noMargin={true} color={'inherit'}>
			{children}
		</Typography>
	</StyledLabel>
);

const StyledLabel = styled<{ color: string }, 'span'>('span')`
	text-transform: uppercase;
	color: ${props => props.color};
	display: flex;
	align-items: center;
`;

interface IOwnProps {
	children: string;
	color?: string;
}
