import axios from "axios";
import * as React from "react";
import { getBaseUrl } from "services";
import { Landing } from ".";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeContext, getThemeFromNewInputs } from '@nickjmorrow/react-component-library';
axios.defaults.baseURL = getBaseUrl();


const inputs = {
	typography: {
		fontFamily: {
			title: 'PT Sans, sans-serif'
		}
	}
}
export const App: React.SFC = () => (
	<Router>
		<ThemeContext.Provider value={getThemeFromNewInputs(inputs)}>
		<Landing />
		</ThemeContext.Provider>
	</Router>
);
