import {
	Slider,
	Typography,
	StyleConstant,
	ThemeContext
} from "@nickjmorrow/react-component-library";
import * as React from "react";
import { IPoint } from "../../types";
import styled from "styled-components";
import { TitleWrapper } from "../../../Core/components";
import "rc-slider/assets/index.css";

export const AhcParameters: React.SFC<IProps> = ({
	min,
	max,
	clusterCount,
	points,
	onClusterCountChange: handleClusterCountChange
}) => {
	const handleClusterCountChangeInternal = (newIterations: number) =>
		handleClusterCountChange(newIterations);
	const { spacing } = React.useContext(ThemeContext);
	return (
		<Wrapper spacing={spacing}>
			<TitleWrapper>
				<Typography sizeVariant={5}>Number of Clusters</Typography>
			</TitleWrapper>
			<Slider
				min={min}
				max={max}
				value={clusterCount}
				onChange={handleClusterCountChangeInternal}
			/>
		</Wrapper>
	);
};

// types
interface IProps {
	readonly min: number;
	readonly max: number;
	readonly clusterCount: number;
	readonly points: IPoint[];
	readonly onClusterCountChange: (value: number) => void;
}

// css
const Wrapper = styled("div")<{ spacing: StyleConstant<"spacing"> }>`
	max-width: 400px;
	margin-top: ${p => p.spacing.ss4};
`;
