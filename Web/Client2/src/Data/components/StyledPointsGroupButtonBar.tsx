import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { shimmer } from 'Core/animations/shimmer';

export const StyledPointsGroupButtonBar = styled('button')<{
	isActive: boolean;
	isDisabled?: boolean;
}>`
	padding: ${p => p.theme.njmTheme.spacing.ss3};
	border-radius: ${p => p.theme.njmTheme.border.borderRadius.br1};
	display: flex;
	justify-content: space-between;
	margin: 0 0 ${p => p.theme.njmTheme.spacing.ss2} 0;
	border: none;
	outline: none;
	width: ${p => p.theme.njmTheme.spacing.ss64};
	height: ${p => p.theme.njmTheme.spacing.ss12};
	align-items: center;
	${p =>
		p.isDisabled
			? css`
					cursor: not-allowed;
					animation: ${shimmer} 1s linear infinite alternate;
			  `
			: css`
					cursor: pointer;
					background-color: ${p.isActive
						? p.theme.njmTheme.colors.core.cs4
						: p.theme.njmTheme.colors.background};
					transition: background-color, ${p.theme.njmTheme.transitions.fast};
					&:hover,
					&:focus {
						background-color: ${p.isActive
							? p.theme.njmTheme.colors.core.cs4
							: p.theme.njmTheme.colors.core.cs2};
						transition: ${p.theme.njmTheme.transitions.fast};
					}
			  `}
`;
