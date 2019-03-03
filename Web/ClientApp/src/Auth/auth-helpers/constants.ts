export const api = {
	register: "/api/auth/register",
	login: "/api/auth/login",
	logout: "TODO",
	authenticateWithGoogle: "TODO",
	toggleFavoriteItem: (itemId: number) =>
		`api/userItem/toggleFavoriteItem?itemId=${itemId}`,
	getUserFavoriteItems: "api/userItem/getUserFavoriteItems"
};

export const USER = "USER";

export const localStorageKeys = {
	user: "USER"
};
