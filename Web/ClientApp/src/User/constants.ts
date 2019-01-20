const itemController = 'item';
export const api = {
	toggleFavoriteItem: (itemId: number) =>
		`api/${itemController}/toggleFavoriteItem?itemId=${itemId}`,
	getUserFavoriteItems: `api/${itemController}/getUserFavoriteItems`,
	getItems: `api/${itemController}/getItems`
};
