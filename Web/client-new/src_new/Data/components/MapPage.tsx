import { IOption, StyleConstant, ThemeContext, Typography } from "@nickjmorrow/react-component-library";
import * as React from "react";
import { connect } from "react-redux";
import { GridLoader } from 'react-spinners';
import styled from "styled-components";
import { Map } from "../";
import { IReduxState } from "../../reducer";
import { getActivePointsGroup } from "../selectors";
import { IPointsGroup } from "../types";
import { MapControls } from "./MapControls";

export const MapPageInternal: React.SFC<IReduxProps> = ({
    pointsGroups,
    activePointsGroup,
    currentClusterOption
}) => {
    const { colors } = React.useContext(ThemeContext);

    return (
        <>
            {activePointsGroup ? (
                <Map activePointsGroup={activePointsGroup} />
            ) : (
                <div
                    style={{
                        height: "580px",
                        weight: "100%",
                        display: "flex",
                        justifyContent: "center",
						alignItems: "center",
						flexDirection: 'column'
                    }}
                >
				<GridLoader />
				<Typography style={{marginTop: '32px'}}>Loading clusters...</Typography>
                    
                </div>
            )}
            <Divider colors={colors} />
            <MapControls
                pointsGroups={pointsGroups}
                activePointsGroup={activePointsGroup}
                currentClusterOption={currentClusterOption}
            />
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
