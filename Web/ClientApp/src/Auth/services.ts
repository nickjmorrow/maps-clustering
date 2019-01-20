import Axios from 'axios';

export const addTokenToDefaultHeader = (token: string) => {
	Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};
