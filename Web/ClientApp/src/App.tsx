import axios from "axios";
import * as React from "react";
import { getBaseUrl } from "services";
import { Landing } from ".";
axios.defaults.baseURL = getBaseUrl();

export const App: React.SFC = () => <Landing />;
