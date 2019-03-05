import {
	populateUserStateFromLocalStorageIfAvailable,
	getIsAuthenticated
} from "Auth/auth-helpers";
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
// import { VerticalNavMenu } from "njm-react-component-library";
import { FileUploadForm } from "./FileUploadForm";
import Axios from "axios";

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

		Axios.get("api/test/getpersistedvalues")
			.then(({ data }: { data: string[] }) => console.log(data))
			.catch(err => console.error(err));

		Axios.post(
			"api/test/addtestvalue",
			{ testValueId: "YEARS" },
			{
				headers: {
					"Content-Type": "application/json"
				}
			}
		)
			.then(({ data }: { data: string[] }) => console.log(data))
			.catch(err => console.error(err));
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
						matches ? (
							<div>
								{
									"<VerticalNavMenu buttonProps={() => { return; }}/>"
								}
							</div>
						) : null
					}
				</Media>
				<FileUploadForm />
				<div style={{ marginTop: "30px" }}>
					<Footer />
				</div>
			</Wrapper>
		);
	}
}

// css
const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
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
