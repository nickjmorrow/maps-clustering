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
import { ModeledPoint } from 'src/types';
import styled from 'styled-components';
import { getColors } from '../services';
import { Clusters } from './Clusters';
import { Map } from './Map';
import { MapForm } from './MapForm';

const initialOptions: IOption[] = [
	{ value: 'ahc', label: 'AHC' },
	{ value: 'dbscan', label: 'DBSCAN' },
	{ value: 'msc', label: 'Mean-Shift Clustering' },
	{ value: 'kmc', label: 'K-Means Clustering' }
];

const initialState = {
	modeledPoints: [] as ModeledPoint[],
	value: 0,
	colors: [] as string[],
	options: initialOptions,
	currentOption: initialOptions[0]
};

type IState = typeof initialState;

export class Landing extends React.Component<{}, IState> {
	readonly state = initialState;

	componentDidMount = () => {
		if (
			localStorage.getItem('data') !== null &&
			this.state.modeledPoints.length === 0
		) {
			const data = JSON.parse(localStorage.getItem('data')!);
			if (data.length > 0) {
				this.setState({
					modeledPoints: data,
					value: data.length,
					colors: getColors(data.length)
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

	handleSliderChange = (value: number) => this.setState({ value });

	handleClusterTypeChange = (option: IOption) =>
		this.setState({ currentOption: option });

	render() {
		const {
			modeledPoints,
			value,
			colors,
			options,
			currentOption
		} = this.state;
		const min = 1;
		const max = modeledPoints.length;

		const markers = getMarkers(modeledPoints, value, colors);

		const linkButtons = [
			{ path: '/form', label: 'Upload File' },
			{ path: '/map', label: 'View Map' },
			{ path: '/info', label: 'Info' }
		].map(e => (
			<Button
				key={e.path}
				path={e.path}
				onClick={() => {
					return;
				}}>
				{e.label}
			</Button>
		));
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
								options={options}
								onChange={this.handleClusterTypeChange}
								currentOption={currentOption}
								removeNoneOptionAfterSelection={true}
							/>
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
