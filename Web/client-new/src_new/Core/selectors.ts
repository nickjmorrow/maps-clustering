import { ICoreState } from "./reducer";

interface IExpectedReduxState {
	core: ICoreState;
}

export const coreSelector = (state: IExpectedReduxState) => state.core;
export const databaseSettingsSelector = (state: IExpectedReduxState) =>
	coreSelector(state).databaseSettings;

// TODO: memoize if not already
export const getDatabaseSettingValue = (
	state: IExpectedReduxState,
	settingId: string
) => {
      
	const databaseSetting = state.core.databaseSettings.find(
		ds => ds.settingId === settingId
	);

	return (databaseSetting && databaseSetting.settingValue) || undefined;
};
