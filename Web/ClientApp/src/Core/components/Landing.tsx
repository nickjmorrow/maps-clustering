import { authActions, authSelectors } from "njm-react-component-library";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import Media from "react-media";
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
import { VerticalNavMenu } from "njm-react-component-library";
import { FileUploadForm } from "./FileUploadForm";
import Axios from "axios";

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

		Axios.get(
			"https://bj9jj9rzj7.execute-api.us-east-2.amazonaws.com/beta/mapclusterer/api/test/getpersistedvalues",
			{
				headers: {
					"Access-Control-Allow-Origin": "*", // Required for CORS support to work
					"Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
				}
			}
		).then(({ data }: { data: string[] }) => console.log(data));
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
				<Media query={`(max-width: 800px)`}>
					{matches =>
						matches ? <VerticalNavMenu links={[]} /> : null
					}
				</Media>
				<FileUploadForm />
				<Footer />
			</Wrapper>
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
