export type IError = string;

export enum ItemPermissionType {
	Private = 1,
	Public = 2
}

export interface DatabaseSetting {
	settingId: string;
	settingValue: string;
}
