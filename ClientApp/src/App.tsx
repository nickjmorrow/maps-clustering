import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Landing } from '.';
import {
	IUser,
	populateStateFromLocalStorageIfAvailable,
	setCurrentUser
	// USER
} from './Auth';
import { getMapDataSucceeded, Point } from './Data';

export class AppInternal extends React.Component<IProps> {
	componentDidMount = () => {
		const { onGetMapDataSucceeded } = this.props;
		// populateStateFromLocalStorageIfAvailable(onSetCurrentUser, USER);
		populateStateFromLocalStorageIfAvailable(
			onGetMapDataSucceeded,
			'points'
		);
	};
	public render() {
		return <Landing />;
	}
}

// types
interface IDispatchProps {
	onGetMapDataSucceeded(points: Point[]): void;
	onSetCurrentUser(user: IUser): void;
}
type IProps = IDispatchProps;

// redux
const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps =>
	bindActionCreators(
		{
			onGetMapDataSucceeded: getMapDataSucceeded,
			onSetCurrentUser: setCurrentUser
		},
		dispatch
	);
export const App = connect(
	null,
	mapDispatchToProps
)(AppInternal);
