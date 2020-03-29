import { PopulatedAppBar } from '@nickjmorrow/react-component-library';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../reducer';
import { settingIds } from '../constants';
import { getDatabaseSettingValue } from '../selectors';

export const AppBar: React.FC = () => {
	const appName = useSelector((state: IReduxState) => getDatabaseSettingValue(state, settingIds.appName));
	return <PopulatedAppBar appName={appName} styleVariant={1} />;
};
