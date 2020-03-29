import { getPointsGroups, MapPage } from 'Data';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { getDatabaseSettings } from 'Core/actions';
import { AppBar } from 'Core/components/AppBar';
import { Footer } from 'Core/components/Footer';

export const Landing: React.SFC = () => {
	const dispatch = useDispatch();
	const handleGetPointsGroups = () => dispatch(getPointsGroups.request());
	const handleGetDatabaseSettings = () => dispatch(getDatabaseSettings.request());

	React.useEffect(() => {
		handleGetDatabaseSettings();
		handleGetPointsGroups();
	}, []);

	return (
		<Wrapper>
			<AppBar />
			<MapPage />
			<Footer />
		</Wrapper>
	);
};

// css
const Wrapper = styled.div`
	display: block;
	min-height: 100vh;
	position: relative;
	overflow: hidden;
`;
