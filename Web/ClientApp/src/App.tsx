import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Landing } from '.';
import { populateUserStateFromLocalStorageIfAvailable } from './Auth';
import { populatePointsStateFromLocalStorageIfAvailable } from './Data';

export class AppInternal extends React.Component<IProps> {
	componentDidMount = () => {
		const {
			onPopulateUserStateFromLocalStorageIfAvailable,
			onPopulatePointsStateFromLocalStorageIfAvailable
		} = this.props;
		onPopulateUserStateFromLocalStorageIfAvailable();
		onPopulatePointsStateFromLocalStorageIfAvailable();
	};
	public render() {
		return <Landing />;
	}
}

// types
interface IDispatchProps {
	onPopulatePointsStateFromLocalStorageIfAvailable(): void;
	onPopulateUserStateFromLocalStorageIfAvailable(): void;
}
type IProps = IDispatchProps;

// redux
const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps =>
	bindActionCreators(
		{
			onPopulatePointsStateFromLocalStorageIfAvailable: populatePointsStateFromLocalStorageIfAvailable,
			onPopulateUserStateFromLocalStorageIfAvailable: populateUserStateFromLocalStorageIfAvailable
		},
		dispatch
	);
export const App = connect(
	null,
	mapDispatchToProps
)(AppInternal);
