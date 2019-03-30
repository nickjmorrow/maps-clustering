import { apiKey } from "../secrets";

export const googleMapURL = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`;

export const manhattanPosition = { lat: 40.7831, lng: -73.9712 };
export const scale = 6;

const databaseSettingController = "databaseSetting";
export const coreApi = {
	getDatabaseSettings: `/api/${databaseSettingController}/getDatabaseSettings`
};

export const settingIds = {
	appName: "appName"
};

export const coreSessionStorageKeys = {
	databaseSettings: "databaseSettings"
};
