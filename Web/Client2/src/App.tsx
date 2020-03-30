import axios from 'axios';
import * as React from 'react';
import { getBaseUrl } from 'services';
import { Landing } from 'Core';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeContext, getThemeFromNewInputs, ArgumentType } from '@nickjmorrow/react-component-library';
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

console.log('loading app');

export const App: React.SFC = () => (
	<Router>
		<ThemeContext.Provider value={getThemeFromNewInputs(inputs)}>
			<Landing />
		</ThemeContext.Provider>
	</Router>
);
