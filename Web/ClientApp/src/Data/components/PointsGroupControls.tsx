import * as React from "react";
import { connect } from "react-redux";
import { IReduxState } from "reducer";
import { getCurrentClusterOption, getPointsGroups } from "../selectors";
import { Paper } from "./Paper";
import { Parameters } from "./Parameters";
import { PointsGroupList } from "./PointsGroupList";

export const PointsGroupControlsInternal: React.FC<Props> = ({
	pointsGroups,
	currentClusterOption
}) => {
	return (
		<div
			style={{
				width: "100%",
				display: "flex",
				justifyContent: "center"
			}}>
			<Paper
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					width: "min-content"
				}}>
				<PointsGroupList pointsGroups={pointsGroups} />
				<Parameters currentClusterOption={currentClusterOption} />
			</Paper>
		</div>
	);
};

type Props = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: IReduxState) => ({
	pointsGroups: getPointsGroups(state),
	currentClusterOption: getCurrentClusterOption(state)
});

export const PointsGroupControls = connect(
	mapStateToProps,
	null
)(PointsGroupControlsInternal);
