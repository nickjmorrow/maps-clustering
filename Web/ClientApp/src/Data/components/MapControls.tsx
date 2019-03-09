import * as React from "react";
import styled from "styled-components";
import {
	Clusters,
	PointsGroupList,
	Summary,
	Parameters,
	IPointsGroup
} from "Data";
import { FileUploadForm } from "Core";
import {
	IOption,
	ThemeContext,
	StyleConstant
} from "@nickjmorrow/react-component-library";

export const MapControls: React.FC<{
	pointsGroups: IPointsGroup[];
	currentClusterOption: IOption;
	activePointsGroup: IPointsGroup;
}> = ({ pointsGroups, currentClusterOption, activePointsGroup }) => {
	const { spacing } = React.useContext(ThemeContext);
	return (
		<Wrapper spacing={spacing}>
			<PointsGroupAndParametersWrapper>
				<FlexColumn>
					<PointsGroupList pointsGroups={pointsGroups} />
					<Parameters currentClusterOption={currentClusterOption} />
				</FlexColumn>
			</PointsGroupAndParametersWrapper>
			<Clusters activePointsGroup={activePointsGroup} />
			<SummaryFormWrapper>
				<Summary />
				<FileUploadForm />
			</SummaryFormWrapper>
		</Wrapper>
	);
};

const PointsGroupAndParametersWrapper = styled.div`
	width: 100%;
	grid-area: pointsgroupandparameters;
	display: flex;
	justify-content: center;
`;

const FlexColumn = styled.div`
	display: flex;
	flex-direction: column;
	width: 300px;
`;

const Wrapper = styled("div")<{ spacing: StyleConstant<"spacing"> }>`
	display: grid;
	grid-template-areas: "pointsgroupandparameters" "clusters" "summaryform";
	margin: ${p => p.spacing.ss8} auto 0px auto;
	grid-row-gap: ${p => p.spacing.ss6};
	@media (min-width: 900px) {
		grid-template-areas: "pointsgroupandparameters clusters" "summaryform clusters";
		grid-template-columns: repeat(2, 1fr);
	}
	@media (min-width: 1200px) {
		grid-template-areas: "pointsgroupandparameters clusters summaryform";
		grid-template-columns: repeat(3, 1fr);
	}
`;

const SummaryFormWrapper = styled.div`
	grid-area: summaryform;
	width: 100%;
`;
