import axios from 'axios';
import { IInputInfo } from 'njm-react-component-library/lib/types';
import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ModeledPoint } from 'src/types';
import styled from 'styled-components';
import { AppBar } from './AppBar';
import { MapForm } from './MapForm';
import { MapPage } from './MapPage';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { getMapData } from '../Data';

export class LandingInternal extends React.Component<IDispatchProps, IState> {
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
					modeledPoints
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
			this.props.getMapData(formData);
			const { data }: { data: ModeledPoint[] } = await axios.post(
				'/api/home/upload',
				formData,
				{
					headers: { 'Content-Type': 'multipart/form-data' }
				}
			);

			this.setState({
				modeledPoints: data
			});
			localStorage.setItem('data', JSON.stringify(data));
		}
	};

	render() {
		const { modeledPoints } = this.state;

		return (
			<BrowserRouter>
				<Wrapper>
					<AppBar />
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
							render={() => (
								<MapPage modeledPoints={modeledPoints} />
							)}
						/>
					</Switch>
				</Wrapper>
			</BrowserRouter>
		);
	}
}

// redux
const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps =>
	bindActionCreators(
		{
			getMapData
		},
		dispatch
	);
export const Landing = connect(
	null,
	mapDispatchToProps
)(LandingInternal);

// types
interface IDispatchProps {
	getMapData(payload: FormData): void;
}

const initialState = {
	modeledPoints: [] as ModeledPoint[]
};

type IState = typeof initialState;

// css
const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
`;
