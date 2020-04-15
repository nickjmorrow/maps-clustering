import { Button, Typography } from '@nickjmorrow/react-component-library';
import * as React from 'react';
import ReactGoogleLogin, { GoogleLoginResponse } from 'react-google-login';

export const GoogleLogin: React.SFC<IOwnProps> = ({
	handleSuccess,
	handleFailure = () => {
		return;
	},
	clientId,
}) => {
	const handleSuccessFix: any = handleSuccess;
	return (
		<ReactGoogleLogin
			clientId={clientId}
			buttonText={'Sign In With Google'}
			onSuccess={handleSuccessFix}
			render={renderButton}
			onFailure={handleFailure}
		/>
	);
};

const renderButton: ((props?: { onClick: () => void } | undefined) => JSX.Element) | undefined = renderProps => (
	<Button style={{ width: '100%' }} onClick={renderProps!.onClick}>
		<Typography style={{ textTransform: 'capitalize' }} colorVariant="primaryLight">
			Sign In With Google
		</Typography>
	</Button>
);

// types
interface IOwnProps {
	clientId: string;
	handleSuccess: (res: GoogleLoginResponse) => void;
	handleFailure?: (error: any) => void;
}
