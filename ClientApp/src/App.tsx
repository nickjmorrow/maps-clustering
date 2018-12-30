import * as React from 'react';
import { Landing } from '.';
import { Point } from './Data/types';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { getMapDataSucceeded } from './Data';

export class AppInternal extends React.Component<IProps> {
	public render() {
		const handleLocalStorage = () => {
			if (localStorage.getItem('points') !== null) {
				const points = JSON.parse(
					localStorage.getItem('points')!
				) as Point[];
				this.props.getMapDataSucceeded(points);
			}
		};
		handleLocalStorage();
		return <Landing />;
	}
}

// types
interface IDispatchProps {
	getMapDataSucceeded(points: Point[]): void;
}
type IProps = IDispatchProps;

// redux
const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps =>
	bindActionCreators(
		{
			getMapDataSucceeded
		},
		dispatch
	);
export const App = connect(
	null,
	mapDispatchToProps
)(AppInternal);
