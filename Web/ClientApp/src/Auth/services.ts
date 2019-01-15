import Axios from 'axios';
import { Point } from 'src/Data';
import { IUser } from './types';

export const addToLocalStorage = (value: object, key: string) => {
	localStorage.setItem(key, JSON.stringify(value));
};

export const addToLocalStorageIfNotPresent = (value: object, key: string) => {
	if (!isInLocalStorage(key)) {
		addToLocalStorage(value, key);
	}
};

export const addTokenToDefaultHeader = (token: string) => {
	Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const isInLocalStorage = (key: string): boolean =>
	localStorage.getItem(key) !== null;

export const getFromLocalStorage = (key: string) =>
	JSON.parse(localStorage.getItem(key)!);

export const removeFromLocalStorage = (key: string) =>
	localStorage.removeItem(key);

export const populateStateFromLocalStorageIfAvailable = (
	dispatchFunc: (val: IUser | Point[]) => void,
	key: string
) => {
	if (isInLocalStorage(key)) {
		const value = getFromLocalStorage(key);
		return dispatchFunc(value);
	}
};
