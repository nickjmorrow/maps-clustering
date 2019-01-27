import { colors, IOption } from 'njm-react-component-library';
import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Clusters, Map, Parameters } from '../';
import { FileUploadForm } from '../../Core/components';
import { IReduxState } from '../../reducer';
import { getActivePointsGroup } from '../selectors';
import { IPointsGroup } from '../types';
import { PointsGroupList } from './PointsGroupList';
import { Summary } from './Summary';

export const MapPageInternal: React.SFC<IReduxProps> = ({
	pointsGroups,
	activePointsGroup,
	currentClusterOption
}) => {
	if (!activePointsGroup) {
		return null;
	}

	const markers = getMarkers(activePointsGroup);

	const defaultPosition = activePointsGroup && {
		lat: activePointsGroup.averageVerticalDisplacement,
		lng: activePointsGroup.averageHorizontalDisplacement
	};

	return (
		<div>
			<Map markers={markers} defaultPosition={defaultPosition} />
			<Divider />
			<MapControls>
				<PointsGroupAndParametersWrapper>
					{/* <TitleWrapper> */}
					{/* <Typography variant="h1">Parameters</Typography> */}
					{/* </TitleWrapper> */}
					<FlexColumn>
						<PointsGroupList pointsGroups={pointsGroups} />
						<Parameters
							currentClusterOption={currentClusterOption}
						/>
					</FlexColumn>
				</PointsGroupAndParametersWrapper>
				{/* <TitleWrapper> */}
				{/* <Typography variant="h1">Results</Typography> */}
				{/* </TitleWrapper> */}
				<Clusters activePointsGroup={activePointsGroup} />
				<SummaryFormWrapper>
					<Summary />
					<FileUploadForm />
				</SummaryFormWrapper>
			</MapControls>
		</div>
	);
};

// redux
const mapStateToProps = (state: IReduxState): IReduxProps => ({
	pointsGroups: state.data.pointsGroups,
	activePointsGroup: getActivePointsGroup(state),
	currentClusterOption: state.data.currentClusterOption
});

export const MapPage = connect(
	mapStateToProps,
	null
)(MapPageInternal);

// types
interface IReduxProps {
	readonly pointsGroups: IPointsGroup[];
	readonly activePointsGroup: IPointsGroup;
	readonly currentClusterOption: IOption;
}

// css
const PointsGroupAndParametersWrapper = styled.div`
	width: 100%;
	grid-area: pointsgroupandparameters;
	display: flex;
	justify-content: center;
`;

const FlexColumn = styled.div`
	display: flex;
	flex-direction: column;
	width: max-content;
`;

const MapControls = styled.div`
	display: grid;
	grid-template-areas: 'pointsgroupandparameters' 'clusters' 'summaryform';
	margin: 0 auto;
	@media (min-width: 900px) {
		grid-template-areas: 'pointsgroupandparameters clusters' 'summaryform clusters';
		grid-template-columns: repeat(2, 1fr);
	}
	@media (min-width: 1200px) {
		grid-template-areas: 'pointsgroupandparameters clusters summaryform';
		grid-template-columns: repeat(3, 1fr);
	}
`;

const Divider = styled.div`
	height: 20px;
	background-color: ${colors.darkGray};
`;

// const FlexWrapper = styled.div`
// 	display: grid;
// 	grid-template-areas: 'clusters' 'summary' 'fileuploadform';
// 	@media (min-width: 1200px) {
// 		grid-template-areas: 'clusters summary' 'clusters fileuploadform';
// 	}
// `;

// const ResultsWrapper = styled.div``;

const SummaryFormWrapper = styled.div`
	grid-area: summaryform;
	width: 100%;
`;

// const TitleWrapper = styled.div`
// 	display: flex;
// 	justify-content: center;
// 	@media (min-width: 900px) {
// 		justify-content: flex-start;
// 	}
// `;

// helpers
const getMarkers = (activePointsGroup: IPointsGroup) => {
	const { clusterCount, pointsColors, points } = activePointsGroup;
	return activePointsGroup.ahcInfo.ahcPoints.map(mp => ({
		position: {
			lat: mp.verticalDisplacement,
			lng: mp.horizontalDisplacement
		},
		label: {
			text: mp.name
		},
		icon: {
			fillColor:
				pointsColors[
					mp.clusterInfos[points.length - clusterCount].clusterId
				]
		}
	}));
};
