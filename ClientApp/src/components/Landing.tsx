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
import { routes } from '../Core/constants';

export class LandingInternal extends React.Component<IDispatchProps, {}> {
	render() {
		const renderedRoutes = routes.map(r => (
			<Route
				exact={true}
				key={r.route}
				path={r.route}
				component={r.component}
			/>
		));
		return (
			<BrowserRouter>
				<Wrapper>
					<AppBar />
					<Switch>{renderedRoutes}</Switch>
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
