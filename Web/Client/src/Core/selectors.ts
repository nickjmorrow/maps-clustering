import { IReduxState } from 'reducer';

export const coreSelector = (state: IReduxState) => state.core;
export const databaseSettingsSelector = (state: IReduxState) => coreSelector(state).databaseSettings;

export const getDatabaseSettingValue = (state: IReduxState, settingId: string) => {
	const databaseSetting = state.core.databaseSettings.find(ds => ds.settingId === settingId);

	return databaseSetting?.settingValue;
};
