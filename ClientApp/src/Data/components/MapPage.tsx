import { IOption, Select, Typography } from 'njm-react-component-library';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { ReduxState } from 'src/reducer';
import { getColors } from 'src/services';
import styled from 'styled-components';
import { getAgglomerativeHierarchicalClusters } from '../actions';
import { clusterOptions, clusterTypes } from '../constants';
import {
	getAgglomerativeHierarchicalClustersFromState,
	getPoints
} from '../selectors';
import { IClusterOption, ModeledPoint, Point } from '../types';
import { Map } from './Map';
import { AhcParameters, DbscanParameters } from './parameters';

export class MapPageInternal extends React.Component<IProps, IState> {
	readonly state = initialState;

	componentWillReceiveProps = (nextProps: IProps) =>
		this.setState({ colors: getColors(nextProps.points.length) });

	handleClusterCountChange = (clusterCount: number) =>
		this.setState({ clusterCount });

	handleClusterTypeChange = (currentClusterOption: IClusterOption) =>
		this.setState({ currentClusterOption });

	handleDistanceBetweenPointsChange = (distanceBetweenPoints: number) =>
		this.setState({ distanceBetweenPoints });

	handleMinimumPointsChange = (minimumPoints: number) => {
		this.setState({ minimumPoints });
	};

	handleGetAgglomerativeHierarchicalClusters = () => {
		this.props.getAgglomerativeHierarchicalClusters(this.props.points);
	};

	render() {
		const { points } = this.props;
		const {
			currentClusterOption,
			clusterCount: clusterCount,
			colors,
			distanceBetweenPoints,
			minimumPoints
		} = this.state;
		const minClusters = 1;
		const maxClusters = points.length;
		const minDistanceBetweenPoints = 1;
		const maxDistanceBetweenPoints = 5;
		const minMinimumPoints = 1;
		const maxMinimumPoints = 10;

		// TODO: revisit, this can be made cleaner
		const getParameters = (option: IOption | null) => {
			if (!option) {
				return;
			}
			switch (option.value) {
				case clusterTypes.agglomerativeHierarchicalClusters:
					return (
						<AhcParameters
							min={minClusters}
							max={maxClusters}
							clusterCount={clusterCount}
							onClusterCountChange={this.handleClusterCountChange}
							onGetAgglomerativeHierarchicalClusters={
								this.handleGetAgglomerativeHierarchicalClusters
							}
						/>
					);
				case clusterTypes.dbscan:
					return (
						<DbscanParameters
							minDistanceBetweenPoints={minDistanceBetweenPoints}
							maxDistanceBetweenPoints={maxDistanceBetweenPoints}
							maxMinimumPoints={maxMinimumPoints}
							minMinimumPoints={minMinimumPoints}
							distanceBetweenPoints={distanceBetweenPoints}
							minimumPoints={minimumPoints}
							onDistanceBetweenPointsChange={
								this.handleDistanceBetweenPointsChange
							}
							onMinimumPointsChange={
								this.handleMinimumPointsChange
							}
						/>
					);
				default:
					return <div>Hello</div>;
			}
		};

		const pointsForMap = getPointsForMap(this.state, this.props);
		const markers = getMarkers(
			pointsForMap,
			clusterCount,
			colors,
			currentClusterOption
		);

		return (
			<div>
				<Map markers={markers} />
				<MapControls>
					<InfoPanel>
						<Typography variant="h1">Parameters</Typography>
						<Typography variant="h2">Cluster Type</Typography>
						<Select
							options={clusterOptions}
							onChange={this.handleClusterTypeChange}
							currentOption={currentClusterOption}
							removeNoneOptionAfterSelection={true}
						/>
						{getParameters(currentClusterOption)}
					</InfoPanel>
					<InfoPanel>
						<Typography variant="h1">Results</Typography>
						<Typography variant="h2">Clusters</Typography>
						{/* <Clusters
							modeledPoints={points}
							value={points.length - value + 1}
						/> */}
					</InfoPanel>
				</MapControls>
			</div>
		);
	}
}

// redux
const mapStateToProps = (state: ReduxState): IReduxProps => ({
	points: getPoints(state),
	agglomerativeHierarchicalClusters: getAgglomerativeHierarchicalClustersFromState(
		state
	)
});

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps =>
	bindActionCreators(
		{
			getAgglomerativeHierarchicalClusters
		},
		dispatch
	);

export const MapPage = connect(
	mapStateToProps,
	mapDispatchToProps
)(MapPageInternal);

// helpers
const getPointsForMap = (
	state: IState,
	props: IProps
): Point[] | ModeledPoint[] => {
	if (state.currentClusterOption === null) {
		return props.points;
	}
	const { currentClusterOption } = state;
	switch (currentClusterOption.value) {
		case clusterTypes.agglomerativeHierarchicalClusters:
			return props.agglomerativeHierarchicalClusters.length > 0
				? props.agglomerativeHierarchicalClusters
				: props.points;
		default:
			return props.points;
	}
};
const getFillColorFunc = (
	currentClusterOption: IOption | null,
	colors: string[],
	value: number
) => {
	const defaultFillColorFunc = (p: Point | ModeledPoint) => 'red';
	if (!currentClusterOption || colors.length === 0) {
		return defaultFillColorFunc;
	}
	switch (currentClusterOption.value) {
		case clusterTypes.agglomerativeHierarchicalClusters:
			return (p: ModeledPoint) =>
				colors[
					p.agglomerativeHierarchicalClusterInfos[value - 1].clusterId
				];
		default:
			return defaultFillColorFunc;
	}
};
const getMarkers = (
	modeledPoints: Point[],
	value: number,
	colors: string[],
	currentClusterOption: IOption | null
) => {
	if (!modeledPoints.length) {
		return [];
	}
	const fillColorFunc = getFillColorFunc(currentClusterOption, colors, value);
	return modeledPoints.map(mp => ({
		position: {
			lat: mp.verticalDisplacement,
			lng: mp.horizontalDisplacement
		},
		label: {
			text: mp.name
		},
		icon: {
			fillColor: fillColorFunc(mp)
		}
	}));
};

// types
const initialState = {
	clusterCount: 30,
	currentClusterOption: null as IOption | null,
	colors: [] as string[],
	minimumPoints: 1,
	distanceBetweenPoints: 1
};

type IState = typeof initialState;

interface IReduxProps {
	points: Point[];
	agglomerativeHierarchicalClusters: ModeledPoint[];
}

interface IDispatchProps {
	getAgglomerativeHierarchicalClusters(points: Point[]): void;
}

type IProps = IReduxProps & IDispatchProps;

// css
const InfoPanel = styled.div`
	margin: 0px 16px;
	min-width: 300px;
	min-height: 300px;
`;

const MapControls = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
`;
