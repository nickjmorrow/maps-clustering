import {
	getIsAuthenticated,
	populateUserStateFromLocalStorageIfAvailable
} from "Auth/auth-helpers";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";
import {
	getPointsGroups,
	MapPage,
	populatePointsGroupsStateFromLocalStorageIfAvailable,
	savePointsGroupIfStoredLocally
} from "../../Data";
import { IReduxState } from "../../reducer";
import { AppBar } from "./AppBar";
import { Footer } from "./Footer";
import { getDatabaseSettings } from "../actions";

export class LandingInternal extends React.PureComponent<IProps> {
	componentDidMount = () => {
		const {
			handlePopulateUserStateFromLocalStorageIfAvailable,
			handlePopulatePointsGroupsStateFromLocalStorageIfAvailable,
			handleGetPointsGroups,
			handleGetDatabaseSettings
		} = this.props;

		handlePopulateUserStateFromLocalStorageIfAvailable();
		handlePopulatePointsGroupsStateFromLocalStorageIfAvailable();
		handleGetPointsGroups();
		handleGetDatabaseSettings();
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
			<Wrapper>
				<AppBar />
				<MapPage />
				<Footer />
			</Wrapper>
		);
	}
}

// css
const Wrapper = styled.div`
	display: block;
	min-height: 100vh;
	position: relative;
	overflow: hidden;
`;

// types
interface IDispatchProps {
	handleSavePointsGroupIfStoredLocally: typeof savePointsGroupIfStoredLocally.request;
	handlePopulatePointsGroupsStateFromLocalStorageIfAvailable: typeof populatePointsGroupsStateFromLocalStorageIfAvailable.request;
	handlePopulateUserStateFromLocalStorageIfAvailable: typeof populateUserStateFromLocalStorageIfAvailable.request;
	handleGetPointsGroups: typeof getPointsGroups.request;
	handleGetDatabaseSettings: typeof getDatabaseSettings.request;
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
				populateUserStateFromLocalStorageIfAvailable.request,
			handleGetPointsGroups: getPointsGroups.request,
			handleSavePointsGroupIfStoredLocally:
				savePointsGroupIfStoredLocally.request,
			handleGetDatabaseSettings: getDatabaseSettings.request
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
