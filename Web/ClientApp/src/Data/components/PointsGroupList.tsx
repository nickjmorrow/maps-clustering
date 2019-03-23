import * as React from "react";
import { IPointsGroup } from "../types";
import { PointsGroup } from "./PointsGroup";
import { TitleWrapper } from "../../Core/components";
import { Header } from "./Header";

export const PointsGroupList: React.SFC<IOwnProps> = ({ pointsGroups }) => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "flex-start"
			}}>
			<TitleWrapper>
				<Header>Points Groups</Header>
			</TitleWrapper>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					flexDirection: "column",
					width: "100%"
				}}>
				{pointsGroups.map(pg => (
					<PointsGroup key={pg.pointsGroupId} pointsGroup={pg} />
				))}
			</div>
		</div>
	);
};
// types
interface IOwnProps {
	pointsGroups: IPointsGroup[];
}
