import { IOption, LoadingIcon, StyleConstant, ThemeContext } from "@nickjmorrow/react-component-library";
import * as React from "react";
import { connect } from "react-redux";
import { Route } from 'react-router';
import styled from "styled-components";
import { Map } from "../";
import { IReduxState } from "../../reducer";
import { About } from '../components/About';
import { getActivePointsGroup } from "../selectors";
import { IPointsGroup } from "../types";
import { MapControls } from "./MapControls";

export const MapPageInternal: React.SFC<IReduxProps> = ({
	pointsGroups,
	activePointsGroup,
	currentClusterOption
}) => {
    const { colors } = React.useContext(ThemeContext);
    if (!activePointsGroup) {
        return <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: '0px', width: '100%'}}>
        <LoadingIcon sizeVariant={4} />
        </div>;
    }

	const Main = () => (
		<>
		<Map activePointsGroup={activePointsGroup} />
			<Divider colors={colors} />
			<MapControls
				pointsGroups={pointsGroups}
				activePointsGroup={activePointsGroup}
				currentClusterOption={currentClusterOption}
			/>
			</>
	);
	return (
		<>
			<Route path={'/about'} component={About} />
			<Route path={'/'} component={Main} exact={true} />
		</>
	);
};



// redux
const mapStateToProps = (state: IReduxState): IReduxProps => ({
	pointsGroups: state.data.pointsGroups,
	activePointsGroup: getActivePointsGroup(state),
	currentClusterOption: state.data.currentClusterOption
});

export const MapPage = connect(
	mapStateToProps,
	null
)(MapPageInternal);

// types
interface IReduxProps {
	readonly pointsGroups: IPointsGroup[];
	readonly activePointsGroup: IPointsGroup;
	readonly currentClusterOption: IOption;
}

// css
const Divider = styled("div")<{ colors: StyleConstant<"colors"> }>`
	height: 20px;
	background-color: ${p => p.colors.neutral.cs6};
`;
