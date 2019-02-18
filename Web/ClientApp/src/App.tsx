import * as React from "react";
import { Landing } from ".";
import axios from "axios";

axios.defaults.baseURL =
	"https://bj9jj9rzj7.execute-api.us-east-2.amazonaws.com/beta/mapclusterer/";
export const App: React.SFC = () => <Landing />;
