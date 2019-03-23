import * as React from "react";
import { connect } from "react-redux";
import { IReduxState } from "reducer";
import { Paper } from "./Paper";
import { Parameters } from "./Parameters";
import { PointsGroupList } from "./PointsGroupList";
import { pointsGroupsSelector } from "../selectors";

export const PointsGroupControlsInternal: React.FC<
	ReturnType<typeof mapStateToProps>
> = ({ pointsGroups }) => {
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
				<Parameters />
			</Paper>
		</div>
	);
};

const mapStateToProps = (state: IReduxState) => ({
	pointsGroups: pointsGroupsSelector(state)
});

export const PointsGroupControls = connect(
	mapStateToProps,
	null
)(PointsGroupControlsInternal);
