import * as React from 'react';
import styled from 'styled-components';
import { shimmer } from 'Core/animations/shimmer';

export const LoadingBar = styled.div`
	width: 254px;
	height: 32px;
	background-color: ${p => p.theme.njmTheme.colors.neutral.cs3};
	animation: ${shimmer} 1s linear infinite alternate;
	border-radius: ${p => p.theme.njmTheme.border.borderRadius.br1};
`;
