import { IInputInfo } from 'njm-react-component-library/lib/types';
import * as React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';
import styled from 'styled-components';
import { getMapData } from '../Data';
import { AppBar } from './AppBar';
import { MapForm } from './MapForm';
import { MapPage } from '../Data/components/MapPage';

export class LandingInternal extends React.Component<IDispatchProps, {}> {
	handleClick = async (inputs: IInputInfo[]) => {
		const fileList = inputs.find(i => i.name === 'Map File')!
			.value as FileList;
		if (fileList.length) {
			const formData = new FormData();
			formData.append('file', fileList[0]);
			this.props.getMapData(formData);
		}
	};

	render() {
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
							render={() => <MapPage />}
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

// css
const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
`;
