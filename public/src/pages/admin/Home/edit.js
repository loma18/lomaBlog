import React, { Component } from 'react';
import { Row, Col, Icon, Form, Input, Spin, Tooltip, Checkbox, Select, Button, message, Upload } from 'antd';
import { Router, withRouter, Link } from 'react-router-dom';
import { fireGetRequest, firePostRequest } from 'service/app';
import {
	SAVE_BLOG,
	GET_CATALOGUE_LIST,
	GET_ARTICLE_BY_ID,
	GET_ATTACHMENT_LIST
} from 'constants/api';
import { openNotification, showSuccessMsg, GetQueryString } from 'utils';
import LomaBlogTag from 'components/Admin/LomaBlogTag';
import BraftEditor from 'braft-editor';
import { articleTypeList } from 'constants';
import 'braft-editor/dist/index.css';

const form = Form.create();
const FormItem = Form.Item;
const { Option } = Select;

@withRouter
@form
class AdminHomeEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			resData: {},
			article: [],
			catalogue: [], // 最终个人分类
			hasSelCatalogue: [], // 选中之前已有分类
			catalogueList: [], // [{id:1,name:'前端'}],
			compareList: [],
			fileList: [], //所有附件，用于界面显示
			backFileList: [], //后台返回附件
			spinLoading: false
		};
	}

	// tag标签确认回调
	handleInputConfirm = (tags, type, inputValue) => {
		const { compareList, hasSelCatalogue } = this.state;
		let tempList = JSON.parse(JSON.stringify(hasSelCatalogue));
		if (type == 'catalogue') {
			if (compareList.indexOf(inputValue) > -1) {
				tempList.push(inputValue);
			}
		}
		this.setState({ [type]: tags, hasSelCatalogue: tempList });
	}

	handleClose = (tags, type, removedTag) => {
		let { hasSelCatalogue } = this.state;
		let index = -1;
		let tempList = JSON.parse(JSON.stringify(hasSelCatalogue));
		if (type == 'catalogue') {
			index = tempList.indexOf(removedTag);
			if (index > -1) {
				tempList.splice(index, 1);
			}
		}
		this.setState({ [type]: tags, hasSelCatalogue: tempList });
	}

	// 修改个人分类选取
	onChange = (val) => {
		let { catalogue, compareList } = this.state;
		catalogue = catalogue.filter((item) => !(val.indexOf(item) < 0 && compareList.indexOf(item) > -1));
		if (catalogue.length <= 4) {
			val.map((item) => {
				if (catalogue.indexOf(item) < 0 && catalogue.length <= 4) {
					catalogue.push(item);
				}
			});
		}
		this.setState({ hasSelCatalogue: val, catalogue });
	}

	getTransData = () => {
		const { catalogue, catalogueList, compareList } = this.state;
		let list = catalogue.map((item) => {
			if (compareList.indexOf(item) > -1) {
				for (let i = 0; i < catalogueList.length; i++) {
					if (item == catalogueList[i].label) {
						return catalogueList[i];
					}
				}
			} else {
				return { name: item };
			}
		});
		return list;
	}

	// 发布博客
	handlePublish = (isPublish = true) => {
		const { article, resData, catalogue, backFileList, fileList } = this.state;
		let backFileIds = this.getID(backFileList),
			upLoadfileList = [];
		let formData = new FormData();
		fileList.map((val, index) => {
			if (!val.id) {
				upLoadfileList.push(val.originFileObj);
				formData.append('file', val.originFileObj)
			}
		});
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (err) {
				return;
			}
			if (!catalogue || catalogue.length === 0) {
				message.info('请至少勾选一个个人分类');
				return;
			}
			values.id = resData.aid;
			values.status = resData.status != undefined && resData.status != 0 ? resData.status : (isPublish ? 1 : 0);
			values.catalogue = this.getTransData();
			values.catalogue = JSON.stringify(values.catalogue);
			values.article = JSON.stringify(article);
			// values.content = values.content.toHTML();
			values.description = values.content.toHTML().replace(/<(\S|\s)*?>/g, '').slice(0, 300);
			values.content = values.content.toRAW();
			values.attachmentIds = JSON.stringify(backFileIds);
			for (var key in values) {
				formData.append([key], values[key]);
			}
			// values.files = upLoadfileList;
			this.setState({ spinLoading: true });
			firePostRequest(SAVE_BLOG, formData).then((res) => {
				if (res.code === 200) {
					showSuccessMsg('保存成功');
					this.props.history.push('/admin/home/articleManage');
				}
				this.setState({ spinLoading: false });
			})
				.catch((err) => console.log(err));
		});
	}

	getID = lists => {
		return lists.map(list => {
			return list.id > 0 ? list.id : -list.id;
		});
	};

	// 获取个人分类列表
	getCatalogueList = () => {
		let compareList = [];
		fireGetRequest(GET_CATALOGUE_LIST).then((res) => {
			if (res.code === 200) {
				res.data = res.data.map((item) => {
					item.value = item.name;
					item.label = item.name;
					compareList.push(item.name);
					return item;
				});
				this.setState({ catalogueList: res.data, compareList }, () => {
					this.fetchData();
				});
			} else {
				openNotification('error', '获取个人分类列表失败', res.msg);
			}
		})
			.catch((err) => console.log(err));
	}

	getCatalogue = () => {
		const { resData, catalogueList } = this.state;
		let cid = resData.cid,
			catalogue = [],
			article = [];
		if (!cid) {
			return;
		}
		catalogue = cid.map(item => {
			for (let i = 0; i < catalogueList.length; i++) {
				if (item == catalogueList[i].id) {
					return catalogueList[i].name;
				}
			}
		})
		if (resData.tags) {
			article = resData.tags.split(',');
		}
		this.setState({ catalogue, hasSelCatalogue: catalogue, article });
	}

	beforeUpload = (file, fileList) => {
		if (file.size > 1000000) {
			return false;
		} else {
			return true;
		}
	};

	onChangeCallBack = list => {
		list.fileList = list.fileList.map(item => {
			item.status = 'done';
			return item;
		});
		this.setState({ fileList: list.fileList });
	};

	afterRemoveFile = (file, index) => {
		let currentIndex = '';
		let { backFileList } = this.state;
		backFileList.forEach((v, i) => {
			if (file.uid == v.uid) {
				currentIndex = i;
				return;
			}
		});

		backFileList.splice(currentIndex, 1);

		this.setState({ backFileList });
	};

	//处理返回的附件列表
	transData = list => {
		for (let i = 0; i < list.length; i++) {
			list[i].uid = -list[i].id;
			list[i].name = list[i].fileName;
			list[i].status = 'done';
		}
		return list;
	};

	getAttachmentList = () => {
		let articleId = GetQueryString('articleId'),
			backFileList = [];
		fireGetRequest(GET_ATTACHMENT_LIST, { articleId }).then(res => {
			if (res.code === 200) {
				backFileList = this.transData(res.data);
				this.setState({ fileList: backFileList, backFileList });
			} else {
				openNotification('error', '获取附件列表失败', res.msg);
			}
		}).catch(err => console.log(err))
	}

	fetchData = () => {
		let articleId = GetQueryString('articleId');
		if (!articleId) {
			return;
		}
		fireGetRequest(GET_ARTICLE_BY_ID, { id: articleId, showAll: true }).then(res => {
			if (res.code === 200) {
				this.setState({ resData: res.data }, () => {
					this.getCatalogue();
				});
				this.editorInstance.setValue(BraftEditor.createEditorState(res.data.content));
			} else {
				openNotification('error', '获取文章失败', res.msg);
			}
		}).catch(err => console.log(err))
	}

	componentDidMount() {
		this.getCatalogueList();
		this.getAttachmentList();
	}

	render() {
		const { resData, article, catalogue, hasSelCatalogue, catalogueList, spinLoading, fileList } = this.state;
		const { getFieldDecorator } = this.props.form;
		return (
			<div className={'adminHomeEdit'}>
				<Spin spinning={spinLoading}>
					<Form>
						<FormItem label="">
							{getFieldDecorator('title', {
								rules: [{ required: true, message: '请输入文章标题！' }],
								initialValue: resData.title || ''
							})(<Input placeholder={'请输入文章标题'} />)}
						</FormItem>
						<FormItem label="">
							{getFieldDecorator('content', {
								rules: [{ required: true, message: '请输入文章内容！' }]
							})(
								<BraftEditor
									ref={(instance) => (this.editorInstance = instance)}
									excludeControls={['media']}
								/>
							)}
						</FormItem>
						<FormItem label="文章标签">
							<LomaBlogTag
								tags={article}
								handleInputConfirm={this.handleInputConfirm}
								tagName={'article'}
								handleClose={this.handleClose}
							/>
						</FormItem>
						<FormItem label="个人分类" className={'catalogue'}>
							<LomaBlogTag
								tags={catalogue}
								handleInputConfirm={this.handleInputConfirm}
								tagName={'catalogue'}
								handleClose={this.handleClose}
							/>
							<Row>
								<Checkbox.Group
									disabled={catalogue.length >= 5}
									options={catalogueList}
									value={hasSelCatalogue}
									onChange={this.onChange}
								/>
							</Row>
						</FormItem>
						<FormItem label="文章类型" className={'article'}>
							{getFieldDecorator('articleType', {
								rules: [{ required: true, message: '请选择文章类型！' }],
								initialValue: resData.articleType || articleTypeList[0] && articleTypeList[0].key
							})(
								<Select
									className={'lomaBlog-select select-articleType'}
								>
									{articleTypeList.map((item) => (
										<Option key={item.id} value={item.key}>
											{item.name}
										</Option>
									))}
								</Select>
							)}
						</FormItem>
						<FormItem label="附件" className={'attachment'}>
							<Upload
								onChange={this.onChangeCallBack}
								fileList={fileList}
								onRemove={this.afterRemoveFile}
								beforeUpload={this.beforeUpload}
								multiple
								action=""
								isDragger={false}
							>
								<Button>
									<Icon type="upload" /> 上传文件
    							</Button>
							</Upload>
						</FormItem>
						<Row type="flex" gutter={10}>
							<Col>
								<Button type="primary" onClick={() => this.handlePublish(true)}>发布</Button>
							</Col>
							<Col>
								<Button onClick={() => this.handlePublish(false)}>存草稿</Button>
							</Col>
						</Row>
					</Form>
				</Spin>
			</div>
		);
	}
}
export default AdminHomeEdit;