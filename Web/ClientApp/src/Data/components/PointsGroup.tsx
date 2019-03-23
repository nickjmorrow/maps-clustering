import {
	Typography,
	StyleConstant,
	ThemeContext,
	TrashIcon
} from "@nickjmorrow/react-component-library";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";
import { ItemPermissionType } from "../../Core";
import { Label } from "../../Core/components/Label";
import { deletePointsGroup, setActivePointsGroup } from "../actions";
import { IPointsGroup } from "../types";

const PointsGroupInternal: React.SFC<IProps> = ({
	pointsGroup,
	handleDeletePointsGroup,
	handleSetActivePointsGroup
}) => {
	const [isHovering, setIsHovering] = React.useState(false);
	const [
		isHoveringOverDeleteButton,
		setIsHoveringOverDeleteButton
	] = React.useState(false);
	const turnOnIsHovering = () => setIsHovering(true);
	const turnOffIsHovering = () => setIsHovering(false);

	const handleDeletePointsGroupInternal = () => {
		handleDeletePointsGroup(pointsGroup.pointsGroupId!);
	};
	const handleClick = () => {
		if (!isHoveringOverDeleteButton) {
			handleSetActivePointsGroup(pointsGroup.pointsGroupId!);
		} else {
			handleDeletePointsGroupInternal();
		}
	};

	const {
		colors,
		transitions,
		border: { borderRadius },
		spacing
	} = React.useContext(ThemeContext);
	const { isActive } = pointsGroup;

	return (
		<PointsGroupWrapper
			spacing={spacing}
			colors={colors}
			transitions={transitions}
			borderRadius={borderRadius}
			key={pointsGroup.pointsGroupId}
			onMouseEnter={turnOnIsHovering}
			onMouseLeave={turnOffIsHovering}
			isActive={isActive}
			onClick={handleClick}>
			<Typography
				colorVariant={isActive ? "primaryLight" : "primaryDark"}>
				{pointsGroup.name}
			</Typography>
			{shouldShowDeleteButton(
				pointsGroup,
				isHovering,
				isHoveringOverDeleteButton
			) && (
				<TrashIcon
					onClick={handleDeletePointsGroupInternal}
					colorVariant={"secondaryLight"}
					onMouseEnter={() => setIsHoveringOverDeleteButton(true)}
					onMouseLeave={() => setIsHoveringOverDeleteButton(false)}
				/>
			)}
			{pointsGroup.itemPermissionType === ItemPermissionType.Default &&
				(isActive || isHovering) && (
					<Label color={"white"}>{"Default"}</Label>
				)}
		</PointsGroupWrapper>
	);
};

const shouldShowDeleteButton = (
	pg: IPointsGroup,
	isHovering: boolean,
	isHoveringOverDeleteButton: boolean
) =>
	pg.pointsGroupId &&
	pg.itemPermissionType !== ItemPermissionType.Default &&
	(isHovering || pg.isActive || isHoveringOverDeleteButton);

// types
export interface IOwnProps {
	pointsGroup: IPointsGroup;
}

interface IDispatchProps {
	handleDeletePointsGroup: typeof deletePointsGroup.request;
	handleSetActivePointsGroup: typeof setActivePointsGroup;
}

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			handleDeletePointsGroup: deletePointsGroup.request,
			handleSetActivePointsGroup: setActivePointsGroup
		},
		dispatch
	);

type IProps = IOwnProps & IDispatchProps;

export const PointsGroup = connect(
	null,
	mapDispatchToProps
)(PointsGroupInternal);

// css
const PointsGroupWrapper = styled("button")<{
	isActive: boolean;
	colors: StyleConstant<"colors">;
	transitions: StyleConstant<"transitions">;
	borderRadius: StyleConstant<"border">["borderRadius"];
	spacing: StyleConstant<"spacing">;
}>`
	padding: ${p => p.spacing.ss3};
	border-radius: ${p => p.borderRadius.br1};
	display: flex;
	justify-content: space-between;
	cursor: pointer;
	margin: 0 0 ${p => p.spacing.ss2} 0;
	border: none;
	outline: none;
	width: ${p => p.spacing.ss64};
	height: ${p => p.spacing.ss12};
	align-items: center;
	background-color: ${p =>
		p.isActive ? p.colors.core.light : p.colors.background};
	transition: background-color, ${p => p.transitions.fast};
	&:hover,
	&:focus {
		background-color: ${p =>
			p.isActive ? p.colors.core.light : p.colors.core.lightest};
		transition: ${p => p.transitions.fast};
	}
`;
