import {
	FileInput,
	IInitialInputInfo,
	ITextInputInfo,
	TextInput,
	Typography
} from 'njm-react-component-library';
import * as React from 'react';
import { createPointsGroup } from '../actions';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

export class FileUploadFormInternal extends React.PureComponent<
	IDispatchProps,
	typeof initialState
> {
	readonly state = initialState;

	handleFileChange = (fileList: FileList | null) => {
		// this.setState(prevState => ({
		// 	inputInfo: { ...prevState.inputInfo, value: file }
		// }));
		if (fileList && fileList.length) {
			const file = new FormData();
			file.append('file', fileList[0]);
			const pointsGroupInput = {
				file,
				name: this.state.textInputInfo.value
			};
			this.props.onCreatePointsGroup(pointsGroupInput);
		}
	};

	handleTextChange = (text: string) =>
		this.setState(prevState => ({
			textInputInfo: { ...prevState.textInputInfo, value: text }
		}));

	render() {
		const { inputInfo, textInputInfo } = this.state;
		return (
			<div>
				<Typography variant="h2">{'Upload Points Group'}</Typography>
				<TextInput
					textInputInfo={textInputInfo}
					onChange={this.handleTextChange}
				/>
				<FileInput
					inputInfo={inputInfo}
					onChange={this.handleFileChange}
				/>
			</div>
		);
	}
}

// types
const initialState = {
	inputInfo: {
		name: 'file',
		type: 'file'
	} as IInitialInputInfo,
	textInputInfo: {
		name: 'file name',
		type: 'text',
		value: '',
		placeholder: 'Points Group Name'
	} as ITextInputInfo
};

interface IDispatchProps {
	onCreatePointsGroup: typeof createPointsGroup.request;
}

// redux
const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			onCreatePointsGroup: createPointsGroup.request
		},
		dispatch
	);

export const FileUploadForm = connect(
	null,
	mapDispatchToProps
)(FileUploadFormInternal);
