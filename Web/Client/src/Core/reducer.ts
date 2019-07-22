import { ActionType } from "typesafe-actions";
import * as actions from "./actions";
import { coreTypeKeys } from "./actions";
import { DatabaseSetting } from "./types";
import produce from "immer";
import { coreSessionStorageKeys } from "./constants";

export interface ICoreState {
	readonly databaseSettings: DatabaseSetting[];
}

const storedDatabaseSettings = sessionStorage.getItem(
	coreSessionStorageKeys.databaseSettings
);

let databaseSettings = [];

if (storedDatabaseSettings) {
	databaseSettings = JSON.parse(storedDatabaseSettings);
}

export const initialState: ICoreState = {
	databaseSettings
};

export const coreReducer = (
	state: ICoreState = initialState,
	action: ActionType<typeof actions>
): ICoreState => {
	switch (action.type) {
		case coreTypeKeys.GET_DATABASE_SETTINGS_SUCCEEDED:
			return produce(state, draftState => {
				draftState.databaseSettings = action.payload;
			});
		default:
			return state;
	}
};
