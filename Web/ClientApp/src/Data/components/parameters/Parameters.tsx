import { IOption } from 'njm-react-component-library';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { getAhcs } from 'src/Data';
import { clusterTypes } from 'src/Data/constants';
import { IPointsGroup } from 'src/Data/types';
import { IReduxState } from 'src/reducer';
import { AhcParameters } from '.';
// import { getDbscan } from 'src/Data/actions';

export class ParametersInternal extends React.PureComponent<IProps, IState> {
	readonly state = initialState;

	handleMinimumPointsPerClusterChange = (minimumPoints: number) =>
		this.setState({ minimumPointsPerCluster: minimumPoints });

	handleMaximumDistanceBetweenPointsChange = (
		maximumDistanceBetweenPoints: number
	) =>
		this.setState({
			maximumDistanceBetweenPoints
		});

	handleGetAhcs = () => {
		const { onGetAhcs, pointsGroups } = this.props;
		onGetAhcs(pointsGroups.find(pg => pg.isActive)!);
	};

	render() {
		const {
			pointsGroups,
			clusterCount,
			currentClusterOption,
			onClusterCountChange: handleClusterCountChange
		} = this.props;

		const activePointsGroup = pointsGroups.find(pg => pg.isActive)!;
		if (!activePointsGroup) {
			return null;
		}
		const { points } = activePointsGroup;
		const minClusters = 1;
		const maxClusters = points.length;

		if (!currentClusterOption) {
			return null;
		}
		switch (currentClusterOption.value) {
			case clusterTypes.ahcs:
				return (
					<AhcParameters
						min={minClusters}
						max={maxClusters}
						clusterCount={clusterCount}
						points={points}
						onClusterCountChange={handleClusterCountChange}
						onGetAgglomerativeHierarchicalClusters={
							this.handleGetAhcs
						}
					/>
				);
			default:
				return <div>Hello</div>;
		}
	}
}

// types
interface IOwnProps {
	currentClusterOption: IOption | null;
	clusterCount: number;
	onClusterCountChange(clusterCount: number): void;
}

interface IDispatchProps {
	onGetAhcs(pointsGroupId: IPointsGroup): void;
}

interface IReduxProps {
	pointsGroups: IPointsGroup[];
}

type IProps = IOwnProps & IDispatchProps & IReduxProps;

type IState = typeof initialState;

// redux
const mapStateToProps = (state: IReduxState): IReduxProps => ({
	pointsGroups: state.data.pointsGroups
});
const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps =>
	bindActionCreators(
		{
			onGetAhcs: getAhcs.request
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
