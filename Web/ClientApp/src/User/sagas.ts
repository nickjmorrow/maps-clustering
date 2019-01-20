import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { userActions, userTypeKeys, IFavoriteItemAction } from './actions';
import { api } from './constants';

function* handleGetUserFavoriteItems() {
	try {
		const { data } = yield call(axios.get, api.getUserFavoriteItems);
		yield put(userActions.getUserFavoriteItems.success(data));
	} catch (error) {
		yield put(userActions.getUserFavoriteItems.failure(error));
	}
}

function* watchGetUserFavoriteItems() {
	yield takeLatest(
		userTypeKeys.GET_USER_FAVORITE_ITEMS,
		handleGetUserFavoriteItems
	);
}

function* handleToggleFavoriteItemAsync(action: IFavoriteItemAction) {
	try {
		const { data } = yield call(
			axios.post,
			api.toggleFavoriteItem(action.payload),
			action.payload
		);
		yield put(userActions.toggleFavoriteItem.success(data));
	} catch (error) {
		yield put(userActions.toggleFavoriteItem.failure(error));
	}
}

function* watchHandleToggleFavoriteItem() {
	yield takeLatest(userTypeKeys.FAVORITE_ITEM, handleToggleFavoriteItemAsync);
}

export const sagas = [watchGetUserFavoriteItems, watchHandleToggleFavoriteItem];
