import { AuthState } from "./reducer";

export type UserFavoriteItemId = number;
export type ItemId = number;

export interface LoginInfo {
	email: string;
	password: string;
}

export interface RegisterInfo {
	email: string;
	password: string;
	name: string;
}

export interface User {
	name: string;
	email: string;
	password: string;
	userId: number;
	token: string;
}

export interface NecessaryReduxState {
	auth: AuthState;
}
