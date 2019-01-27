import { IOption } from 'njm-react-component-library';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { clusterTypes } from 'src/Data/constants';
import { IPointsGroup } from 'src/Data/types';
import { IReduxState } from 'src/reducer';
import { AhcParameters } from '.';
import { setClusterCount } from 'src/Data/actions';

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

	handleClusterCountChangeInternal = (clusterCount: number) => {
		this.props.onSetClusterCount(clusterCount);
	};

	render() {
		const { pointsGroups, clusterCount, currentClusterOption } = this.props;

		const activePointsGroup = pointsGroups.find(pg => pg.isActive)!;
		if (!activePointsGroup || !activePointsGroup.points) {
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
						onClusterCountChange={
							this.handleClusterCountChangeInternal
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
}

interface IDispatchProps {
	onSetClusterCount: typeof setClusterCount;
}

interface IReduxProps {
	pointsGroups: IPointsGroup[];
	clusterCount: number;
}

type IProps = IOwnProps & IDispatchProps & IReduxProps;

type IState = typeof initialState;

// redux
const mapStateToProps = (state: IReduxState): IReduxProps => ({
	pointsGroups: state.data.pointsGroups,
	clusterCount: state.data.clusterCount
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
