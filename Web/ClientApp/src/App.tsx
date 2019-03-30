import axios from "axios";
import * as React from "react";
import { getBaseUrl } from "services";
import { Landing } from ".";
import { BrowserRouter as Router } from "react-router-dom";
axios.defaults.baseURL = getBaseUrl();

export const App: React.SFC = () => (
	<Router>
		<Landing />
	</Router>
);
