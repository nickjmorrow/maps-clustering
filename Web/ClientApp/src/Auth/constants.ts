export const api = {
	register: '/api/auth/register',
	login: '/api/auth/login',
	toggleFavoriteItem: (itemId: number) =>
		`api/userItem/toggleFavoriteItem?itemId=${itemId}`,
	getUserFavoriteItems: 'api/userItem/getUserFavoriteItems'
};

export const USER = 'USER';
