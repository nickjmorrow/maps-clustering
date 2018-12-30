export enum api {
	get = '/api/data/get',
	upload = '/api/home/upload'
}

export enum localStorageKeys {
	points = 'points'
}

export const formHeaders = {
	headers: { 'Content-Type': 'multipart/form-data' }
};
