import { action } from 'typesafe-actions';

export enum dataTypeKeys {
	GET_DATA = 'GET_DATA',
	GET_DATA_SUCCEEDED = 'GET_DATA_SUCCEEDED',
	GET_DATA_FAILED = 'GET_DATA_FAILED'
}

export const getData = (): GetDataAction => action(dataTypeKeys.GET_DATA);
// TODO
export const getDataSucceeded = (payload: []): GetDataSucceededAction =>
	action(dataTypeKeys.GET_DATA_SUCCEEDED, payload);
export const getDataFailed = (payload: string): GetDataFailedAction =>
	action(dataTypeKeys.GET_DATA_FAILED, payload);

export type ActionTypes =
	| GetDataAction
	| GetDataSucceededAction
	| GetDataFailedAction;

export interface GetDataAction {
	type: dataTypeKeys.GET_DATA;
}

export interface GetDataSucceededAction {
	type: dataTypeKeys.GET_DATA_SUCCEEDED;
	payload: any; // TODO
}

export interface GetDataFailedAction {
	type: dataTypeKeys.GET_DATA_FAILED;
	payload: string;
}
