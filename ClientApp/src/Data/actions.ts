import { action } from 'typesafe-actions';

export enum dataTypeKeys {
	GET_DATA = 'GET_DATA',
	GET_DATA_SUCCEEDED = 'GET_DATA_SUCCEEDED',
	GET_DATA_FAILED = 'GET_DATA_FAILED'
}

export const getMapData = (payload: FormData): GetMapDataAction =>
	action(dataTypeKeys.GET_DATA, payload);
// TODO
export const getMapDataSucceeded = (payload: []): GetDataSucceededAction =>
	action(dataTypeKeys.GET_DATA_SUCCEEDED, payload);
export const getMapDataFailed = (payload: string): GetDataFailedAction =>
	action(dataTypeKeys.GET_DATA_FAILED, payload);

export type ActionTypes =
	| GetMapDataAction
	| GetDataSucceededAction
	| GetDataFailedAction;

export interface GetMapDataAction {
	type: dataTypeKeys.GET_DATA;
	payload: FormData;
}

export interface GetDataSucceededAction {
	type: dataTypeKeys.GET_DATA_SUCCEEDED;
	payload: any; // TODO
}

export interface GetDataFailedAction {
	type: dataTypeKeys.GET_DATA_FAILED;
	payload: string;
}
