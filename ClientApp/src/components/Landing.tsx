import axios from 'axios';
import {
	AppBar,
	Button,
	Slider,
	Typography
} from 'njm-react-component-library';
import { IInputInfo } from 'njm-react-component-library/lib/types';
import * as React from 'react';
import { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ModeledPoint } from 'src/types';
import styled from 'styled-components';
import { getColors } from '../services';
import { Clusters } from './Clusters';
import { Map } from './Map';
import { MapForm } from './MapForm';

export const Landing: React.SFC = () => {
	const [modeledPoints, setModeledPoints] = useState([] as ModeledPoint[]);
	const [value, setValue] = useState(0);
	const [colors, setColors] = useState([] as string[]);
	const min = 1;
	const max = modeledPoints.length;

	// TODO: use effect?
	if (localStorage.getItem('data') !== null && modeledPoints.length === 0) {
		const data = JSON.parse(localStorage.getItem('data')!);
		if (data.length > 0) {
			setModeledPoints(data);
			setValue(data.length);
			setColors(getColors(data.length));
		}
	}

	// TODO: use effect?
	const handleClick = async (inputs: IInputInfo[]) => {
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
			setModeledPoints(data);
			setValue(data.length);
			localStorage.setItem('data', JSON.stringify(data));
		}
	};

	const handleSliderChange = (sliderValue: number) => setValue(sliderValue);

	const markers = getMarkers(modeledPoints, value, colors);

	return (
		<BrowserRouter>
			<Wrapper>
				<AppBar>
					<div>
						<Typography variant="h2" color="light">
							Location Clusterer
						</Typography>
					</div>
					<ButtonWrapper>
						<Button
							path="/form"
							onClick={() => {
								return;
							}}>
							Upload File
						</Button>
						<Button
							path="/map"
							onClick={() => {
								return;
							}}>
							View Map
						</Button>
					</ButtonWrapper>
				</AppBar>
				<Switch>
					<Route
						exact={true}
						path="/form"
						render={() => <MapForm onClick={handleClick} />}
					/>
					<Route
						exact={true}
						path="/map"
						render={() => <Map markers={markers} />}
					/>
				</Switch>
				<SliderWrapper>
					<Slider
						min={min}
						max={max}
						value={value}
						onChange={handleSliderChange}
					/>
					{value}
				</SliderWrapper>
				<Results>
					<Typography variant="h1">Results</Typography>
					<Typography variant="h2">Clusters</Typography>
					<Clusters modeledPoints={modeledPoints} value={value} />
				</Results>
			</Wrapper>
		</BrowserRouter>
	);
};

const Results = styled.div``;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
`;

const SliderWrapper = styled.div`
	position: absolute;
	bottom: 0;
	background-color: rgba(255, 255, 255, 50%);
	z-index: 1;
	left: 20%;
	right: 20%;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 1rem 0;
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
