import * as React from "react";
import { IPointsGroup } from "../types";
import { PointsGroup } from "./PointsGroup";
import { TitleWrapper } from "../../Core/components";
import { Header } from "./Header";

export const PointsGroupList: React.SFC<IOwnProps> = ({ pointsGroups }) => {
	return (
		<>
			<TitleWrapper>
				<Header>Points Groups</Header>
			</TitleWrapper>
			{pointsGroups.map(pg => (
				<PointsGroup key={pg.pointsGroupId} pointsGroup={pg} />
			))}
		</>
	);
};
// types
interface IOwnProps {
	pointsGroups: IPointsGroup[];
}
