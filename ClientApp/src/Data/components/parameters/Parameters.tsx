import { clusterTypes } from 'src/Data/constants';
import { IOption } from 'njm-react-component-library';
import * as React from 'react';
import { AhcParameters, DbscanParameters } from '.';
import { Point } from 'src/Data/types';
import { connect } from 'react-redux';
import { getAgglomerativeHierarchicalClusters } from 'src/Data';
import { bindActionCreators, Dispatch } from 'redux';

export class ParametersInternal extends React.PureComponent<IProps, IState> {
	readonly state = initialState;

	handleMinimumPointsChange = (minimumPoints: number) =>
		this.setState({ minimumPoints });

	handleDistanceBetweenPointsChange = (distanceBetweenPoints: number) =>
		this.setState({ distanceBetweenPoints });

	handleGetAgglomerativeHierarchicalClusters = () => {
		this.props.getAgglomerativeHierarchicalClusters(this.props.points);
	};

	render() {
		const {
			points,
			clusterCount,
			currentClusterOption,
			onClusterCountChange: handleClusterCountChange
		} = this.props;
		const { minimumPoints, distanceBetweenPoints } = this.state;

		const minClusters = 1;
		const maxClusters = points.length;
		const maxDistanceBetweenPoints = 5;
		const maxMinimumPoints = 10;

		if (!currentClusterOption) {
			return null;
		}
		switch (currentClusterOption.value) {
			case clusterTypes.agglomerativeHierarchicalClusters:
				return (
					<AhcParameters
						min={minClusters}
						max={maxClusters}
						clusterCount={clusterCount}
						points={points}
						onClusterCountChange={handleClusterCountChange}
						onGetAgglomerativeHierarchicalClusters={
							this.handleGetAgglomerativeHierarchicalClusters
						}
					/>
				);
			case clusterTypes.dbscan:
				return (
					<DbscanParameters
						minDistanceBetweenPoints={minDistanceBetweenPoints}
						maxDistanceBetweenPoints={maxDistanceBetweenPoints}
						maxMinimumPoints={maxMinimumPoints}
						minMinimumPoints={minMinimumPoints}
						distanceBetweenPoints={distanceBetweenPoints}
						minimumPoints={minimumPoints}
						onDistanceBetweenPointsChange={
							this.handleDistanceBetweenPointsChange
						}
						onMinimumPointsChange={this.handleMinimumPointsChange}
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
	points: Point[];
	onClusterCountChange(clusterCount: number): void;
}

interface IDispatchProps {
	getAgglomerativeHierarchicalClusters(points: Point[]): void;
}

type IProps = IOwnProps & IDispatchProps;

type IState = typeof initialState;

// redux
const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps =>
	bindActionCreators(
		{
			getAgglomerativeHierarchicalClusters
		},
		dispatch
	);
export const Parameters = connect(
	null,
	mapDispatchToProps
)(ParametersInternal);

// state initialization
const minDistanceBetweenPoints = 1;
const minMinimumPoints = 1;

const initialState = {
	distanceBetweenPoints: minDistanceBetweenPoints,
	minimumPoints: minMinimumPoints
};
