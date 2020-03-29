import * as React from 'react';
import styled from 'styled-components';
import { Clusters, Summary, IPointsGroup } from 'Data';
import { FileUploadForm } from 'Core';
import { IOption, ThemeContext, StyleConstant } from '@nickjmorrow/react-component-library';
import { PointsGroupControls } from './PointsGroupControls';
import { Paper } from './Paper';

export const MapControls: React.FC<{
	pointsGroups: IPointsGroup[];
	currentClusterOption: IOption;
	activePointsGroup: IPointsGroup;
}> = ({ activePointsGroup }) => {
	const { spacing } = React.useContext(ThemeContext);
	return (
		<Wrapper spacing={spacing}>
			<PointsGroupControls />
			<Clusters activePointsGroup={activePointsGroup} />
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<Paper style={{ display: 'flex', justifyContent: 'flex-start' }}>
					<Summary />
					<FileUploadForm />
				</Paper>
			</div>
		</Wrapper>
	);
};

// const PointsGroupAndParametersWrapper = styled.div`
// 	width: 100%;
// 	grid-area: pointsgroupandparameters;
// 	display: flex;
// 	justify-content: center;
// `;

// const FlexColumn = styled.div`
// 	display: flex;
// 	flex-direction: column;
// 	width: 300px;
// `;

const Wrapper = styled('div')<{ spacing: StyleConstant<'spacing'> }>`
	display: grid;
	grid-row-gap: ${p => p.spacing.ss6};
	grid-auto-flow: row;
	margin-top: ${p => p.spacing.ss6};
	@media (min-width: 1200px) {
		grid-auto-flow: column;
	}
`;

// display: grid;
// grid-auto-flow: column;
// margin: ${p => p.spacing.ss8} auto 0px auto;
// @media (min-width: 900px) {
// 	grid-template-areas: "pointsgroupandparameters clusters" "summaryform clusters";
// 	grid-template-columns: repeat(2, 1fr);
// }
// @media (min-width: 1200px) {
// 	grid-template-areas: "pointsgroupandparameters clusters summaryform";
// 	grid-auto-flow: column;
// 	grid-template-columns: none;
// }
