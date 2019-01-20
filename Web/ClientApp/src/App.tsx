import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Landing } from '.';
import {
	populateUserStateFromLocalStorageIfAvailable,
	getIsAuthenticated
} from './Auth';
import {
	getPointsGroups,
	populatePointsGroupsStateFromLocalStorageIfAvailable
} from './Data';
import { IReduxState } from './reducer';

export class AppInternal extends React.Component<IProps> {
	componentDidMount = () => {
		const {
			onPopulateUserStateFromLocalStorageIfAvailable,
			onPopulatePointsGroupsStateFromLocalStorageIfAvailable
		} = this.props;
		onPopulateUserStateFromLocalStorageIfAvailable();
		onPopulatePointsGroupsStateFromLocalStorageIfAvailable();
	};

	componentWillReceiveProps = (nextProps: IProps) => {
		if (nextProps.isAuthenticated) {
			this.props.onGetPointsGroups();
		}
	};

	public render() {
		return <Landing />;
	}
}

// types
interface IDispatchProps {
	onPopulatePointsGroupsStateFromLocalStorageIfAvailable(): void;
	onPopulateUserStateFromLocalStorageIfAvailable(): void;
	onGetPointsGroups(): void;
}

interface IReduxProps {
	isAuthenticated: boolean;
}
type IProps = IDispatchProps & IReduxProps;

// redux
const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps =>
	bindActionCreators(
		{
			onPopulatePointsGroupsStateFromLocalStorageIfAvailable:
				populatePointsGroupsStateFromLocalStorageIfAvailable.request,
			onPopulateUserStateFromLocalStorageIfAvailable:
				populateUserStateFromLocalStorageIfAvailable.request,
			onGetPointsGroups: getPointsGroups.request
		},
		dispatch
	);

const mapStateToProps = (state: IReduxState): IReduxProps => ({
	isAuthenticated: getIsAuthenticated(state)
});

export const App = connect(
	mapStateToProps,
	mapDispatchToProps
)(AppInternal);
