import * as React from "react";
import { Landing } from ".";
import axios from "axios";
import { getBaseUrl } from 'services';

axios.defaults.baseURL = getBaseUrl();
export const App: React.SFC = () => <Landing />;
