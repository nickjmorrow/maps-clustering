import { Slider, Typography } from 'njm-react-component-library';
import * as React from 'react';
import { IPoint } from '../../types';
import styled from 'styled-components';

export const AhcParameters: React.SFC<IProps> = ({
	min,
	max,
	clusterCount,
	points,
	onClusterCountChange: handleClusterCountChange
}) => {
	const handleClusterCountChangeInternal = (newIterations: number) =>
		handleClusterCountChange(
			newIterations
			// convertIterationsToClusterCount(newIterations, points)
		);
	// const iterations = convertClusterCountToIterations(clusterCount, points);
	return (
		<Wrapper>
			<Typography variant="h2">Number of Clusters</Typography>
			<Slider
				min={min}
				max={max}
				value={clusterCount}
				onChange={handleClusterCountChangeInternal}
			/>
		</Wrapper>
	);
};

// helpers
// const convertIterationsToClusterCount = (
// 	iterations: number,
// 	points: IPoint[]
// ) => points.length - iterations + 1;
// const convertClusterCountToIterations = (
// 	clusterCount: number,
// 	points: IPoint[]
// ) => 1 + points.length - clusterCount;

// types
interface IProps {
	readonly min: number;
	readonly max: number;
	readonly clusterCount: number;
	readonly points: IPoint[];
	readonly onClusterCountChange: (value: number) => void;
}

// css
const Wrapper = styled.div`
	max-width: 300px;
`;
