import * as React from "react";
import { GoogleLogin } from "./GoogleLogin";
import { authenticateWithGoogle } from "Auth/auth-helpers";
import { getPointsGroups } from "../../Data";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { clientId } from "../../secrets";
import { GoogleLoginResponse } from "react-google-login";

const GoogleLoginExampleInternal: React.SFC<IDispatchProps> = ({
	handleAuthenticateWithGoogle,
	handleAuthenticateWithGoogleFailure,
	handleGetPointsGroups
}) => {
	const handleSuccess = (res: GoogleLoginResponse) => {
		handleAuthenticateWithGoogle({
			googleLoginResponse: res,
			additionalActions: [handleGetPointsGroups]
		});
	};

	return (
		<GoogleLogin
			clientId={clientId}
			handleSuccess={handleSuccess}
			handleFailure={(err: string) =>
				handleAuthenticateWithGoogleFailure(err)
			}
		/>
	);
};

// types
interface IDispatchProps {
	handleAuthenticateWithGoogle: typeof authenticateWithGoogle.request;
	handleAuthenticateWithGoogleFailure: typeof authenticateWithGoogle.failure;
	handleGetPointsGroups: typeof getPointsGroups.request;
}

// redux
const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps =>
	bindActionCreators(
		{
			handleAuthenticateWithGoogle: authenticateWithGoogle.request,
			handleAuthenticateWithGoogleFailure: authenticateWithGoogle.failure,
			handleGetPointsGroups: getPointsGroups.request
		},
		dispatch
	);

export const GoogleLoginExample = connect(
	null,
	mapDispatchToProps
)(GoogleLoginExampleInternal);
