import * as React from 'react';
import ReactGoogleLogin from 'react-google-login';
import { clientId } from '../../secrets';
import { Dispatch, bindActionCreators } from 'redux';
import { onAuthenticateWithGoogle } from 'njm-react-component-library/lib/Auth/actions';
import { connect } from 'react-redux';

const GoogleLoginInternal: React.SFC<IDispatchProps> = ({
	handleAuthenticateWithGoogle
}) => (
	<ReactGoogleLogin
		clientId={clientId}
		buttonText={'Sign In With Google'}
		onSuccess={handleAuthenticateWithGoogle}
		onFailure={(res: string) => console.log(res)}
	/>
);

interface IDispatchProps {
	handleAuthenticateWithGoogle: typeof onAuthenticateWithGoogle.request;
}

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps =>
	bindActionCreators(
		{
			handleAuthenticateWithGoogle: onAuthenticateWithGoogle.request
		},
		dispatch
	);

export const GoogleLogin = connect(
	null,
	mapDispatchToProps
)(GoogleLoginInternal);
