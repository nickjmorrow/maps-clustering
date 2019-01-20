const userItemController = 'userItem';
export const api = {
	toggleFavoriteItem: (itemId: number) =>
		`api/${userItemController}/toggleFavoriteItem?itemId=${itemId}`,
	getUserFavoriteItems: `api/${userItemController}/getUserFavoriteItems`
};
