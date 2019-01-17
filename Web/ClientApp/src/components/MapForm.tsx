import * as React from 'react';
import { IInputInfo } from 'njm-react-component-library/lib/types';
import { Form } from 'njm-react-component-library';
import { Dispatch, bindActionCreators } from 'redux';
import { createPointsGroup, IPointsGroupInput } from 'src/Data';
import { connect } from 'react-redux';
import { mapFormFields } from 'src/Data/constants';

export const MapFormInternal: React.SFC<IProps> = ({ onCreatePointsGroup }) => {
	const handleClick = async (inputs: IInputInfo[]) => {
		const fileList = inputs.find(i => i.name === mapFormFields.file)!
			.value as FileList;
		const name = inputs.find(i => i.name === mapFormFields.mapName)!
			.value as string;
		if (fileList.length) {
			const formData = new FormData();
			formData.append('file', fileList[0]);
			const pointsGroupInput = {
				formData,
				name
			};
			onCreatePointsGroup(pointsGroupInput);
		}
	};
	return (
		<Form
			title={'Form'}
			inputs={[
				{
					name: mapFormFields.mapName,
					type: 'text',
					placeholder: 'Map Name'
				},
				{
					name: mapFormFields.file,
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
			onCreatePointsGroup: createPointsGroup
		},
		dispatch
	);
export const MapForm = connect(
	null,
	mapDispatchToProps
)(MapFormInternal);

// types
interface IDispatchProps {
	onCreatePointsGroup(payload: IPointsGroupInput): void;
}

type IProps = IDispatchProps;
