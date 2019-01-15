import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { routes } from '../Core/constants';
import { AppBar } from './AppBar';

export const Landing: React.SFC<{}> = () => {
	return (
		<BrowserRouter>
			<Wrapper>
				<AppBar />
				<Switch>{renderedRoutes}</Switch>
			</Wrapper>
		</BrowserRouter>
	);
};

const renderedRoutes = routes.map(r => (
	<Route exact={true} key={r.route} path={r.route} component={r.component} />
));

// css
const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
`;
