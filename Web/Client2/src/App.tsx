import axios from 'axios';
import * as React from 'react';
import { getBaseUrl } from 'services';
import { Landing } from 'Core';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeContext, getThemeFromNewInputs, ArgumentType } from '@nickjmorrow/react-component-library';
import { ThemeProvider } from 'styled-components';

axios.defaults.baseURL = getBaseUrl();

const inputs: ArgumentType<typeof getThemeFromNewInputs>[0] = {
	typography: {
		fontFamily: {
			title: 'PT Sans, sans-serif',
		},
	},
	appSettings: {
		appName: 'Geoclustering',
		githubUrl: 'https://github.com/nickjmorrow/geoclustering',
	},
};

export const App: React.SFC = () => {
	const theme = getThemeFromNewInputs(inputs);
	return (
		<Router>
			<ThemeProvider theme={{ njmTheme: theme }}>
				<ThemeContext.Provider value={theme}>
					<Landing />
				</ThemeContext.Provider>
			</ThemeProvider>
		</Router>
	);
};
