import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { IReduxState } from "../../../reducer";
import { setClusterCount } from "../../actions";
import { getActivePointsGroup } from "../../selectors";
import { IPointsGroup } from "../../types";
import { AhcParameters } from "./AhcParameters";

// TODO: use hooks to make functional component
class ParametersInternal extends React.PureComponent<IProps, IState> {
	readonly state = initialState;

	handleClusterCountChangeInternal = (clusterCount: number) => {
		const { activePointsGroup, onSetClusterCount } = this.props;
		onSetClusterCount({
			pointsGroupId: activePointsGroup.pointsGroupId,
			clusterCount
		});
	};

	render() {
		const { activePointsGroup } = this.props;
		if (!activePointsGroup) {
			return null;
		}

		const { clusterCount } = activePointsGroup;

		const { points } = activePointsGroup;
		const minClusters = 1;
		const maxClusters = points.length;

		return (
			<AhcParameters
				min={minClusters}
				max={maxClusters}
				clusterCount={clusterCount}
				points={points}
				onClusterCountChange={this.handleClusterCountChangeInternal}
			/>
		);
	}
}

// types
interface IDispatchProps {
	readonly onSetClusterCount: typeof setClusterCount;
}

interface IReduxProps {
	readonly activePointsGroup: IPointsGroup;
}

type IProps = IDispatchProps & IReduxProps;

type IState = typeof initialState;

// redux
const mapStateToProps = (state: IReduxState): IReduxProps => ({
	activePointsGroup: getActivePointsGroup(state)
});
const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps =>
	bindActionCreators(
		{
			onSetClusterCount: setClusterCount
		},
		dispatch
	);
export const Parameters = connect(
	mapStateToProps,
	mapDispatchToProps
)(ParametersInternal);

// state initialization
const minMaximumDistanceBetweenPoints = 1;
const minMinimumPointsPerCluster = 1;

const initialState = {
	maximumDistanceBetweenPoints: minMaximumDistanceBetweenPoints,
	minimumPointsPerCluster: minMinimumPointsPerCluster
};
