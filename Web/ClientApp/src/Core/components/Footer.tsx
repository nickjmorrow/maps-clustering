import * as React from 'react';
import styled from 'styled-components';
import { Typography, colors } from 'njm-react-component-library';

const currentYear = new Date().getFullYear();
const defaultText = `© ${currentYear} Nicholas Morrow`;

export const Footer: React.SFC<IOwnProps> = ({ text = defaultText }) => (
	<StyledFooter>
		<Typography color="light" style={{ padding: '6px', fontSize: '16px' }}>
			{text}
		</Typography>
	</StyledFooter>
);

const StyledFooter = styled.div`
	margin-top: 24px;
	background-color: ${colors.primary};
	display: flex;
	align-items: center;
	padding: 4px;
`;

interface IOwnProps {
	text?: string;
}
