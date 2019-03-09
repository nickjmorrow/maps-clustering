import { developmentUrl } from "./constants";
import { productionUrl } from "./secrets";

export const getBaseUrl = () => {
      const env = process.env.NODE_ENV;
	return env === "development" ? developmentUrl : productionUrl;
};
