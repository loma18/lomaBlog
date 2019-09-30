import React, { Component } from 'react';
import { Upload, Icon, Modal, Divider, Button } from 'antd';
import { Router, withRouter, Link } from 'react-router-dom';
import DateSelect from 'components/Admin/DateSelect';
import { fireGetRequest, firePostRequest } from 'service/app';
import { UPLOAD_PHOTOS, GET_PHOTOS, DELETE_PHOTOS } from 'constants/api';
import { articleTypeList } from 'constants';
import {
	openNotification,
	showSuccessMsg,
	getPathnameByIndex,
	GetQueryString,
	formatMomentToString
} from 'utils';
import '../style.less';

function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
}

class Photos extends Component {
	constructor(props) {
		super(props);
		this.state = {
			file: [],
			previewVisible: false,
			previewImage: '',
			fileList: []
		};
	}

	handleCancel = () => this.setState({ previewVisible: false });

	handlePreview = async file => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}

		this.setState({
			previewImage: file.url || file.preview,
			previewVisible: true
		});
	};

	handleChange = ({ fileList }) => this.setState({ fileList });

	handleUpload = () => {
		let formData = new FormData();
		const { fileList } = this.state;
		fileList.map((val, index) => {
			formData.append('file', val.originFileObj);
		});
		firePostRequest(UPLOAD_PHOTOS, formData)
			.then(res => {
				if (res.code === 200) {
					showSuccessMsg('上传成功');
					this.fetchData();
				} else {
					openNotification('error', '上传失败', res.msg);
				}
			})
			.catch(err => console.log(err));
	};

	deletePhotos = id => {
		fireGetRequest(DELETE_PHOTOS, { id })
			.then(res => {
				if (res.code === 200) {
					showSuccessMsg('删除成功');
					this.fetchData();
				} else {
					openNotification('error', '删除照片列表失败', res.msg);
				}
			})
			.catch(err => console.log(err));
	};

	fetchData = () => {
		fireGetRequest(GET_PHOTOS)
			.then(res => {
				if (res.code === 200) {
					this.setState({ file: res.data });
				} else {
					openNotification('error', '获取照片列表失败', res.msg);
				}
			})
			.catch(err => console.log(err));
	};

	componentDidMount() {
		this.fetchData();
	}

	render() {
		const { previewVisible, previewImage, fileList, file } = this.state;
		const uploadButton = (
			<div>
				<Icon type='plus' />
				<div className='ant-upload-text'>Upload</div>
			</div>
		);
		return (
			<div className='clearfix photosPage'>
				<Upload
					action='http://www.mocky.io/v2/5d91c65b310000327b10ca42'
					listType='picture-card'
					fileList={fileList}
					multiple
					onPreview={this.handlePreview}
					onChange={this.handleChange}
				>
					{fileList.length >= 8 ? null : uploadButton}
				</Upload>
				<Button onClick={this.handleUpload}>上传照片</Button>
				<Modal
					visible={previewVisible}
					footer={null}
					onCancel={this.handleCancel}
				>
					<img
						alt='example'
						style={{ width: '100%' }}
						src={previewImage}
					/>
				</Modal>
				<Divider />
				<ul className={'photosContainer'}>
					{file.map(item => {
						return (
							<li key={item.id}>
								<img
									src={item.url}
									onClick={() => this.handlePreview(item)}
								/>
								<span
									onClick={() => this.deletePhotos(item.id)}
								>
									删除
								</span>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}
export default Photos;
