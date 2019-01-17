import { clusterTypes } from 'src/Data/constants';
import { IOption } from 'njm-react-component-library';
import * as React from 'react';
import { AhcParameters, DbscanParameters } from '.';
import { IPoint, DbscanConfig } from 'src/Data/types';
import { connect } from 'react-redux';
import { getAgglomerativeHierarchicalClusters } from 'src/Data';
import { bindActionCreators, Dispatch } from 'redux';
import { getDbscan } from 'src/Data/actions';

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

	handleGetAgglomerativeHierarchicalClusters = () => {
		this.props.getAgglomerativeHierarchicalClusters(this.props.points);
	};

	handleGetDbscan = () => {
		const { points } = this.props;
		const {
			minimumPointsPerCluster,
			maximumDistanceBetweenPoints
		} = this.state;
		const dbscanConfig: DbscanConfig = {
			points,
			minimumPointsPerCluster,
			maximumDistanceBetweenPoints
		};
		this.props.getDbscan(dbscanConfig);
	};

	render() {
		const {
			points,
			clusterCount,
			currentClusterOption,
			onClusterCountChange: handleClusterCountChange
		} = this.props;
		const {
			minimumPointsPerCluster: minimumPointsPerCluster,
			maximumDistanceBetweenPoints: maximumDistanceBetweenPoints
		} = this.state;

		const minClusters = 1;
		const maxClusters = points.length;
		const maxDistanceBetweenPoints = 5;
		const maxMinimumPointsPerCluster = 10;

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
						minDistanceBetweenPoints={
							minMaximumDistanceBetweenPoints
						}
						maxDistanceBetweenPoints={maxDistanceBetweenPoints}
						maxMinimumPointsPerCluster={maxMinimumPointsPerCluster}
						minMinimumPointsPerCluster={minMinimumPointsPerCluster}
						maximumDistanceBetweenPoints={
							maximumDistanceBetweenPoints
						}
						minimumPointsPerCluster={minimumPointsPerCluster}
						onDistanceBetweenPointsChange={
							this.handleMaximumDistanceBetweenPointsChange
						}
						onMinimumPointsPerClusterChange={
							this.handleMinimumPointsPerClusterChange
						}
						onGetDbscan={this.handleGetDbscan}
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
	points: IPoint[];
	onClusterCountChange(clusterCount: number): void;
}

interface IDispatchProps {
	getAgglomerativeHierarchicalClusters(points: IPoint[]): void;
	getDbscan(dbscanConig: DbscanConfig): void;
}

type IProps = IOwnProps & IDispatchProps;

type IState = typeof initialState;

// redux
const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps =>
	bindActionCreators(
		{
			getAgglomerativeHierarchicalClusters,
			getDbscan: getDbscan.request
		},
		dispatch
	);
export const Parameters = connect(
	null,
	mapDispatchToProps
)(ParametersInternal);

// state initialization
const minMaximumDistanceBetweenPoints = 1;
const minMinimumPointsPerCluster = 1;

const initialState = {
	maximumDistanceBetweenPoints: minMaximumDistanceBetweenPoints,
	minimumPointsPerCluster: minMinimumPointsPerCluster
};
