import {
	IOption,
	Select,
	Slider,
	Typography
} from 'njm-react-component-library';
import * as React from 'react';
import { connect } from 'react-redux';
import { getPoints } from 'src/Data/selectors';
import { Point } from 'src/Data/types';
import { ReduxState } from 'src/reducer';
import { getColors } from 'src/services';
import { IClusterOption } from '../types';
import styled from 'styled-components';
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
		const getParameters = (option: IClusterOption | null) => {
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
							<div>
								<Slider
									min={min}
									max={max}
									value={value}
									onChange={this.handleSliderChange}
								/>
								{value}
							</div>
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

		const markers = getMarkers(points, value, colors);

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
	points: getPoints(state)
});
export const MapPage = connect(
	mapStateToProps,
	null
)(MapPageInternal);

// helpers
const getMarkers = (
	modeledPoints: Point[],
	value: number,
	colors: string[]
) => {
	if (!modeledPoints.length) {
		return [];
	}
	return modeledPoints.map(mp => ({
		position: {
			lat: mp.verticalDisplacement,
			lng: mp.horizontalDisplacement
		},
		label: {
			text: mp.name
		},
		icon: {
			fillColor: 'red'
			// colors[
			// 	mp.agglomerativeHierarchicalClusterInfos[value - 1]
			// 		.clusterId
			// ]
		}
	}));
};

// types
type IProps = IReduxProps;

const initialState = {
	value: 30,
	currentClusterOption: null as IClusterOption | null,
	colors: [] as string[],
	minimumPoints: 1,
	distanceBetweenPoints: 1
};

type IState = typeof initialState;

interface IReduxProps {
	points: Point[];
}

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
