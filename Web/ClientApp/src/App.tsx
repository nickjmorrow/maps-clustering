import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Landing } from '.';
import {
	populateUserStateFromLocalStorageIfAvailable,
	isAuthenticatedSelector
} from './Auth';
import {
	populatePointsStateFromLocalStorageIfAvailable,
	getPointsGroups
} from './Data';
import { IReduxState } from './reducer';

export class AppInternal extends React.Component<IProps> {
	componentDidMount = () => {
		const {
			onPopulateUserStateFromLocalStorageIfAvailable,
			onPopulatePointsStateFromLocalStorageIfAvailable
		} = this.props;
		onPopulateUserStateFromLocalStorageIfAvailable();
		onPopulatePointsStateFromLocalStorageIfAvailable();
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
	onPopulatePointsStateFromLocalStorageIfAvailable(): void;
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
			onPopulatePointsStateFromLocalStorageIfAvailable: populatePointsStateFromLocalStorageIfAvailable,
			onPopulateUserStateFromLocalStorageIfAvailable: populateUserStateFromLocalStorageIfAvailable,
			onGetPointsGroups: getPointsGroups.request
		},
		dispatch
	);

const mapStateToProps = (state: IReduxState): IReduxProps => ({
	isAuthenticated: isAuthenticatedSelector(state)
});

export const App = connect(
	mapStateToProps,
	mapDispatchToProps
)(AppInternal);
