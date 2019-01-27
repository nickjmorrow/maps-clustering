import { IOption } from 'njm-react-component-library';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { clusterTypes } from '../../constants';
import { IPointsGroup } from '../../types';
import { IReduxState } from '../../../reducer';
import { AhcParameters } from './AhcParameters';
import { setClusterCount } from '../../actions';
import { getActivePointsGroup } from '../../selectors';

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
		const { activePointsGroup, currentClusterOption } = this.props;
		if (!activePointsGroup) {
			return null;
		}

		const { clusterCount } = activePointsGroup;

		const { points } = activePointsGroup;
		const minClusters = 1;
		const maxClusters = points.length;

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
				throw new Error(
					`Unexpected clusterOption: ${currentClusterOption}`
				);
		}
	}
}

// types
interface IOwnProps {
	readonly currentClusterOption: IOption;
}

interface IDispatchProps {
	readonly onSetClusterCount: typeof setClusterCount;
}

interface IReduxProps {
	readonly activePointsGroup: IPointsGroup;
}

type IProps = IOwnProps & IDispatchProps & IReduxProps;

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
