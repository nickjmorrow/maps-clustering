import * as React from "react";
import { Landing } from ".";
import axios from "axios";

const production =
	"https://bj9jj9rzj7.execute-api.us-east-2.amazonaws.com/beta/mapclusterer/";
// const testing = "http://localhost:5002/";

axios.defaults.baseURL = production;
export const App: React.SFC = () => <Landing />;
