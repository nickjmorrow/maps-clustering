import {
	authSelectors,
	FileInput,
	IInitialInputInfo,
	Typography
} from 'njm-react-component-library';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IReduxState } from '../../reducer';
import { addPointsGroup, createPointsGroup } from '../../Data/actions';
import styled from 'styled-components';
import { TitleWrapper } from './TitleWrapper';

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
			<Wrapper>
				<TitleWrapper>
					<Typography variant="h2">
						{'Upload Points Group'}
					</Typography>
				</TitleWrapper>
				<FileInput
					inputInfo={inputInfo}
					onChange={this.handleFileChange}
				/>
			</Wrapper>
		);
	}
}

// css
const Wrapper = styled.div`
	grid-area: fileuploadform;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 0 auto;
	@media (min-width: 800px) {
		align-items: flex-start;
	}
`;

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
