import {
	Button,
	IOption,
	Select,
	Slider,
	Typography
} from 'njm-react-component-library';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { ReduxState } from 'src/reducer';
import { getColors } from 'src/services';
import styled from 'styled-components';
import { getAgglomerativeHierarchicalClusters } from '../actions';
import {
	getAgglomerativeHierarchicalClustersFromState,
	getPoints
} from '../selectors';
import { IClusterOption, ModeledPoint, Point } from '../types';
import { Map } from './Map';

export class MapPageInternal extends React.Component<IProps, IState> {
	readonly state = initialState;

	componentWillReceiveProps = (nextProps: IProps) =>
		this.setState({ colors: getColors(nextProps.points.length) });

	handleSliderChange = (value: number) => this.setState({ value });

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
			value,
			colors,
			distanceBetweenPoints,
			minimumPoints
		} = this.state;

		// TODO: revisit, this can be made cleaner
		const getParameters = (option: IOption | null) => {
			if (!option) {
				return;
			}
			switch (option.value) {
				case 'ahc':
					const min = 1;
					const max = points.length;
					return (
						<div>
							<Typography variant="h2">
								Number of Clusters
							</Typography>
							<Slider
								min={min}
								max={max}
								value={value}
								onChange={this.handleSliderChange}
							/>
							<Button
								onClick={
									this
										.handleGetAgglomerativeHierarchicalClusters
								}>
								Load AHCs
							</Button>
						</div>
					);
				case 'dbscan':
					return (
						<div>
							<Typography variant="h2">
								Distance between Points
							</Typography>
							<Slider
								min={1}
								max={5}
								value={distanceBetweenPoints}
								onChange={
									this.handleDistanceBetweenPointsChange
								}
							/>
							<Typography variant="h2">Minimum Points</Typography>
							<Slider
								min={1}
								max={10}
								value={minimumPoints}
								onChange={this.handleMinimumPointsChange}
							/>
						</div>
					);
				default:
					return <div>Hello</div>;
			}
		};
		const clusterOptions: IOption[] = [
			{ value: 'ahc', label: 'AHC' },
			{ value: 'dbscan', label: 'DBSCAN' },
			{
				value: 'msc',
				label: 'Mean-Shift Clustering'
			},
			{
				value: 'kmc',
				label: 'K-Means Clustering'
			}
		];

		const pointsForMap = getPointsForMap(this.state, this.props);
		const markers = getMarkers(
			pointsForMap,
			value,
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
		case 'ahc':
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
		case 'ahc':
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
	value: 30,
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
