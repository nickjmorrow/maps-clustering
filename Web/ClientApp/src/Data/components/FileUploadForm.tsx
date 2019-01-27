import {
	FileInput,
	IInitialInputInfo,
	ITextInputInfo,
	TextInput,
	Typography,
	authSelectors
} from 'njm-react-component-library';
import * as React from 'react';
import { addPointsGroup, createPointsGroup } from '../actions';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IReduxState } from 'src/reducer';

const { getIsAuthenticated } = authSelectors;

export class FileUploadFormInternal extends React.PureComponent<
	IProps,
	typeof initialState
> {
	readonly state = initialState;

	handleFileChange = (fileList: FileList | null) => {
		if (fileList && fileList.length) {
			const file = new FormData();
			file.append('file', fileList[0]);
			const pointsGroupInput = {
				file,
				name: this.state.textInputInfo.value
			};
			const {
				isAuthenticated,
				onCreatePointsGroup,
				onAddPointsGroup
			} = this.props;
			if (isAuthenticated) {
				onAddPointsGroup(pointsGroupInput);
			} else {
				onCreatePointsGroup(pointsGroupInput);
			}
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

interface IReduxProps {
	isAuthenticated: boolean;
}

interface IDispatchProps {
	onCreatePointsGroup: typeof createPointsGroup.request;
	onAddPointsGroup: typeof addPointsGroup.request;
}

type IProps = IReduxProps & IDispatchProps;

// redux
const mapStateToProps = (state: IReduxState) => ({
	isAuthenticated: getIsAuthenticated(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			onCreatePointsGroup: createPointsGroup.request,
			onAddPointsGroup: addPointsGroup.request
		},
		dispatch
	);

export const FileUploadForm = connect(
	mapStateToProps,
	mapDispatchToProps
)(FileUploadFormInternal);
