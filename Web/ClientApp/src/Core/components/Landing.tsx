import { authActions, authSelectors } from 'njm-react-component-library';
import * as React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';
import styled from 'styled-components';
import {
	getPointsGroups,
	MapPage,
	populatePointsGroupsStateFromLocalStorageIfAvailable,
	savePointsGroupIfStoredLocally
} from '../../Data';
import { IReduxState } from '../../reducer';
import { AppBar } from './AppBar';

const { getIsAuthenticated } = authSelectors;
const { onPopulateUserStateFromLocalStorageIfAvailable } = authActions;

export class LandingInternal extends React.PureComponent<IProps> {
	componentDidMount = () => {
		const {
			handlePopulateUserStateFromLocalStorageIfAvailable,
			handlePopulatePointsGroupsStateFromLocalStorageIfAvailable,
			handleGetPointsGroups
		} = this.props;

		handlePopulateUserStateFromLocalStorageIfAvailable();
		handlePopulatePointsGroupsStateFromLocalStorageIfAvailable();
		handleGetPointsGroups();
	};

	componentWillReceiveProps = (nextProps: IProps) => {
		const {
			handleSavePointsGroupIfStoredLocally,
			isAuthenticated
		} = nextProps;
		if (isAuthenticated) {
			handleSavePointsGroupIfStoredLocally();
		}
	};

	render() {
		return (
			<BrowserRouter>
				<Wrapper>
					<AppBar />
					<MapPage />
				</Wrapper>
			</BrowserRouter>
		);
	}
}

// css
const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
`;

// types
interface IDispatchProps {
	handleSavePointsGroupIfStoredLocally: typeof savePointsGroupIfStoredLocally.request;
	handlePopulatePointsGroupsStateFromLocalStorageIfAvailable: typeof populatePointsGroupsStateFromLocalStorageIfAvailable.request;
	handlePopulateUserStateFromLocalStorageIfAvailable: typeof onPopulateUserStateFromLocalStorageIfAvailable.request;
	handleGetPointsGroups: typeof getPointsGroups.request;
}

interface IReduxProps {
	isAuthenticated: boolean;
}
type IProps = IDispatchProps & IReduxProps;

// redux
const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps =>
	bindActionCreators(
		{
			handlePopulatePointsGroupsStateFromLocalStorageIfAvailable:
				populatePointsGroupsStateFromLocalStorageIfAvailable.request,
			handlePopulateUserStateFromLocalStorageIfAvailable:
				onPopulateUserStateFromLocalStorageIfAvailable.request,
			handleGetPointsGroups: getPointsGroups.request,
			handleSavePointsGroupIfStoredLocally:
				savePointsGroupIfStoredLocally.request
		},
		dispatch
	);

const mapStateToProps = (state: IReduxState): IReduxProps => ({
	isAuthenticated: getIsAuthenticated(state)
});

export const Landing = connect(
	mapStateToProps,
	mapDispatchToProps
)(LandingInternal);
