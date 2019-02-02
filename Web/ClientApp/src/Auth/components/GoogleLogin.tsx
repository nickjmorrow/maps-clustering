import * as React from 'react';
import ReactGoogleLogin, { GoogleLoginResponse } from 'react-google-login';
import { clientId } from '../../secrets';
import { Dispatch, bindActionCreators } from 'redux';
import { onAuthenticateWithGoogle } from 'njm-react-component-library/lib/Auth/actions';
import { connect } from 'react-redux';
import { getPointsGroups } from '../../Data';

const GoogleLoginInternal: React.SFC<IDispatchProps> = ({
	handleAuthenticateWithGoogle,
	handleGetPointsGroups
}) => (
	<ReactGoogleLogin
		clientId={clientId}
		buttonText={'Sign In With Google'}
		onSuccess={(res: GoogleLoginResponse) =>
			handleAuthenticateWithGoogle({
				googleLoginResponse: res,
				additionalActions: [handleGetPointsGroups]
			})
		}
		onFailure={(res: string) => console.log(res)}
	/>
);

interface IDispatchProps {
	handleAuthenticateWithGoogle: typeof onAuthenticateWithGoogle.request;
	handleGetPointsGroups: typeof getPointsGroups.request;
}

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps =>
	bindActionCreators(
		{
			handleAuthenticateWithGoogle: onAuthenticateWithGoogle.request,
			handleGetPointsGroups: getPointsGroups.request
		},
		dispatch
	);

export const GoogleLogin = connect(
	null,
	mapDispatchToProps
)(GoogleLoginInternal);
