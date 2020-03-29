import {
	Slider,
	StyleConstant,
	ThemeContext,
	Typography
} from "@nickjmorrow/react-component-library";
import "rc-slider/assets/index.css";
import * as React from "react";
import styled from "styled-components";
import { TitleWrapper } from "../../../Core/components";
import { IPoint } from "../../types";

export const AhcParameters: React.SFC<IProps> = ({
	min,
	max,
	clusterCount,
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
			<div
				style={{
					width: "100%",
					display: "flex"
				}}>
				<Slider
					min={min}
					max={max}
					value={clusterCount}
					onChange={handleClusterCountChangeInternal}
				/>
			</div>
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
	margin-top: ${p => p.spacing.ss4};
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
`;
