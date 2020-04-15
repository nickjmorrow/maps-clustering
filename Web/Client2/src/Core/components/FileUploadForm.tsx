import { FileInput, Typography } from '@nickjmorrow/react-component-library';
import { getIsAuthenticated } from 'Auth/auth-helpers';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { addPointsGroup, createPointsGroup } from '../../Data/actions';
import { IReduxState } from '../../reducer';
import { TitleWrapper } from './TitleWrapper';

export class FileUploadFormInternal extends React.PureComponent<IProps, typeof initialState> {
	readonly state = initialState;

	handleFileChange = (fileList: FileList | null) => {
		if (fileList && fileList.length) {
			const file = new FormData();
			file.append('file', fileList[0]);
			const { onCreatePointsGroup } = this.props;

			onCreatePointsGroup(file);
		}
	};

	render() {
		return (
			<>
				<TitleWrapper>
					<Typography sizeVariant={4}>{'Upload Points Group'}</Typography>
				</TitleWrapper>
				<FileInput labelOnUpload={'Upload'} onChange={this.handleFileChange} useMargin={false} />
			</>
		);
	}
}

// css

// types
const initialState = {
	inputInfo: {
		name: 'file',
		type: 'file',
	},
};

interface DispatchProps {
	onCreatePointsGroup: typeof createPointsGroup.request;
	onAddPointsGroup: typeof addPointsGroup.request;
}

type IProps = DispatchProps;

// redux
const mapStateToProps = (state: IReduxState) => ({
	isAuthenticated: getIsAuthenticated(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			onCreatePointsGroup: createPointsGroup.request,
			onAddPointsGroup: addPointsGroup.request,
		},
		dispatch,
	);

export const FileUploadForm = connect(mapStateToProps, mapDispatchToProps)(FileUploadFormInternal);
