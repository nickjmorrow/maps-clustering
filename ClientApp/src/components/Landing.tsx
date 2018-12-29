import axios from 'axios';
import {
	AppBar,
	Button,
	Select,
	Slider,
	Typography
} from 'njm-react-component-library';
import { IInputInfo, IOption } from 'njm-react-component-library/lib/types';
import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { labeledRoutes } from 'src/constants';
import { ModeledPoint } from 'src/types';
import styled from 'styled-components';
import { getColors } from '../services';
import { Clusters } from './Clusters';
import { Map } from './Map';
import { MapForm } from './MapForm';

const initialState = {
	modeledPoints: [] as ModeledPoint[],
	value: 10,
	colors: [] as string[],
	currentClusterOption: null as IClusterOption | null
};

type IState = typeof initialState;

export class Landing extends React.Component<{}, IState> {
	readonly state = initialState;

	componentDidMount = () => {
		if (
			localStorage.getItem('data') !== null &&
			this.state.modeledPoints.length === 0
		) {
			const modeledPoints = JSON.parse(localStorage.getItem('data')!);
			const numModeledPoints = modeledPoints.length;
			if (numModeledPoints > 0) {
				this.setState({
					modeledPoints,
					value: numModeledPoints,
					colors: getColors(numModeledPoints)
				});
			}
		}
	};

	handleClick = async (inputs: IInputInfo[]) => {
		const fileList = inputs.find(i => i.name === 'Map File')!
			.value as FileList;
		if (fileList.length) {
			const formData = new FormData();
			formData.append('file', fileList[0]);
			const { data }: { data: ModeledPoint[] } = await axios.post(
				'/api/home/upload',
				formData,
				{
					headers: { 'Content-Type': 'multipart/form-data' }
				}
			);

			this.setState({
				modeledPoints: data,
				value: data.length
			});
			localStorage.setItem('data', JSON.stringify(data));
		}
	};

	handleSliderChange = (value: number) => {
		console.log('hi');
		this.setState({ value });
	};

	handleClusterTypeChange = (option: IClusterOption) =>
		this.setState({ currentClusterOption: option });

	render() {
		const {
			modeledPoints,
			value,
			colors,
			currentClusterOption: currentOption
		} = this.state;
		const min = 1;
		const max = modeledPoints.length;

		const markers = getMarkers(modeledPoints, value, colors);

		const linkButtons = labeledRoutes.map(e => (
			<Button
				key={e.path}
				path={e.path}
				onClick={() => {
					return;
				}}>
				{e.label}
			</Button>
		));

		const handleSliderChange = this.handleSliderChange;

		const ahcParameters = (
			<div>
				<Typography variant="h2">Number of Clusters</Typography>
				<div>
					<Slider
						min={min}
						max={max}
						value={this.state.value}
						onChange={handleSliderChange}
					/>
					{this.state.value}
				</div>
			</div>
		);

		const clusterOptions: IClusterOption[] = [
			{ value: 'ahc', label: 'AHC', parameters: ahcParameters },
			{ value: 'dbscan', label: 'DBSCAN', parameters: <div>Hello</div> },
			{
				value: 'msc',
				label: 'Mean-Shift Clustering',
				parameters: <div>Hello</div>
			},
			{
				value: 'kmc',
				label: 'K-Means Clustering',
				parameters: <div>Hello</div>
			}
		];

		// const clusterParameters = currentOption && currentOption.parameters;

		return (
			<BrowserRouter>
				<Wrapper>
					<AppBar>
						<div>
							<Typography variant="h2" color="light">
								Location Clusterer
							</Typography>
						</div>
						<ButtonWrapper>{linkButtons}</ButtonWrapper>
					</AppBar>
					<Switch>
						<Route
							exact={true}
							path="/form"
							render={() => (
								<MapForm onClick={this.handleClick} />
							)}
						/>
						<Route
							exact={true}
							path="/map"
							render={() => <Map markers={markers} />}
						/>
					</Switch>
					<MapControls>
						<InfoPanel>
							<Typography variant="h1">Parameters</Typography>
							<Typography variant="h2">Cluster Type</Typography>
							<Select
								options={clusterOptions}
								onChange={this.handleClusterTypeChange}
								currentOption={currentOption}
								removeNoneOptionAfterSelection={true}
							/>
							{currentOption &&
								currentOption.value === 'ahc' &&
								ahcParameters}
						</InfoPanel>
						<InfoPanel>
							<Typography variant="h1">Results</Typography>
							<Typography variant="h2">Clusters</Typography>
							<Clusters
								modeledPoints={modeledPoints}
								value={modeledPoints.length - value + 1}
							/>
						</InfoPanel>
					</MapControls>
				</Wrapper>
			</BrowserRouter>
		);
	}
}

interface IClusterOption extends IOption {
	parameters: React.ReactNode;
}

const InfoPanel = styled.div`
	margin: 0px 16px;
`;

const MapControls = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
`;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
`;

const getMarkers = (
	modeledPoints: ModeledPoint[],
	value: number,
	colors: string[]
) => {
	if (!modeledPoints.length) {
		return [];
	}
	if (colors.length < value - 1) {
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
			fillColor:
				colors[
					mp.agglomerativeHierarchicalClusterInfos[value - 1]
						.clusterId
				]
		}
	}));
};

const ButtonWrapper = styled.div`
	display: flex;
	flex-direction: row;
`;
