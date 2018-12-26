import * as React from 'react';
import { IInputInfo } from 'njm-react-component-library/lib/types';
import { Form } from 'njm-react-component-library';

export const MapForm: React.SFC<IProps> = ({ onClick: handleClick }) => {
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

interface IProps {
	onClick(inputs: IInputInfo[]): void;
}
