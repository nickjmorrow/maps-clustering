import * as React from 'react';
import { IInputInfo } from 'njm-react-component-library/lib/types';
import { Form } from 'njm-react-component-library';
import { Dispatch, bindActionCreators } from 'redux';
import { getMapData as getMapDataAction } from 'src/Data';
import { connect } from 'react-redux';

export const MapFormInternal: React.SFC<IProps> = ({ getMapData }) => {
	const handleClick = async (inputs: IInputInfo[]) => {
		const fileList = inputs.find(i => i.name === 'Map File')!
			.value as FileList;
		if (fileList.length) {
			const formData = new FormData();
			formData.append('file', fileList[0]);
			getMapData(formData);
		}
	};
	return (
		<Form
			title={'Form'}
			inputs={[
				{
					name: 'Filename',
					type: 'text',
					placeholder: 'Map Name'
				},
				{
					name: 'Map File',
					type: 'file'
				}
			]}
			onClick={handleClick}
		/>
	);
};

// redux
const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps =>
	bindActionCreators(
		{
			getMapData: getMapDataAction
		},
		dispatch
	);
export const MapForm = connect(
	null,
	mapDispatchToProps
)(MapFormInternal);

// types
interface IDispatchProps {
	getMapData(payload: FormData): void;
}

type IProps = IDispatchProps;
