export type IError = string;

export enum ItemPermissionType {
	Private = 1,
	Default = 2
}

export interface DatabaseSetting {
	settingId: string;
	settingValue: string;
}
