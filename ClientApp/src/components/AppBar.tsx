import {
	AppBar as GenericAppBar,
	Button,
	Typography
} from 'njm-react-component-library';
import * as React from 'react';
import styled from 'styled-components';
import { labeledRoutes } from '../constants';

export const AppBar: React.SFC = () => {
	return (
		<GenericAppBar>
			<div>
				<Typography variant="h2" color="light">
					Location Clusterer
				</Typography>
			</div>
			<ButtonWrapper>{linkButtons}</ButtonWrapper>
		</GenericAppBar>
	);
};

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

const ButtonWrapper = styled.div`
	display: flex;
	flex-direction: row;
`;
