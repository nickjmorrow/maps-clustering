import { action } from "typesafe-actions";
import { DatabaseSetting } from "./types";

export enum coreTypeKeys {
	GET_DATABASE_SETTINGS = "GET_DATABASE_SETTINGS",
	GET_DATABASE_SETTINGS_SUCCEEDED = "GET_DATABASE_SETTINGS_SUCCEEDED",
	GET_DATABASE_SETTINGS_FAILED = "GET_DATABASE_SETTINGS_FAILED"
}

export const getDatabaseSettings = {
	request: () => action(coreTypeKeys.GET_DATABASE_SETTINGS),
	success: (payload: DatabaseSetting[]) =>
		action(coreTypeKeys.GET_DATABASE_SETTINGS_SUCCEEDED, payload),
	failure: (payload: string) =>
		action(coreTypeKeys.GET_DATABASE_SETTINGS_FAILED, payload)
};
