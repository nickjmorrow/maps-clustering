import * as React from 'react';
import styled from 'styled-components';
import { Typography, colors } from 'njm-react-component-library';

export const Footer: React.SFC = () => (
	<StyledFooter>
		<Typography color="light" style={{ padding: '6px', fontSize: '16px' }}>
			Content Content Content
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
