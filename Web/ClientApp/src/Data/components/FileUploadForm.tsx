import {
	authSelectors,
	FileInput,
	IInitialInputInfo,
	Typography
} from 'njm-react-component-library';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IReduxState } from 'src/reducer';
import { addPointsGroup, createPointsGroup } from '../actions';

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
			const {
				isAuthenticated,
				onCreatePointsGroup,
				onAddPointsGroup
			} = this.props;
			if (isAuthenticated) {
				onAddPointsGroup(file);
			} else {
				onCreatePointsGroup(file);
			}
		}
	};

	render() {
		const { inputInfo } = this.state;
		return (
			<div>
				<Typography variant="h2">{'Upload Points Group'}</Typography>
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
	} as IInitialInputInfo
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
