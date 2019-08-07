import React, { Component } from 'react';
import { Row, Col, Icon, Form, Input, Spin, Tooltip, Checkbox, Select, Button, message } from 'antd';
import { Router, withRouter, Link } from 'react-router-dom';
import { fireGetRequest, firePostRequest } from 'service/app';
import {
	SAVE_BLOG,
	GET_CATALOGUE_LIST
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
		const { article, resData, catalogue } = this.state;
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (err) {
				return;
			}
			if (!catalogue || catalogue.length === 0) {
				message.info('请至少勾选一个个人分类');
				return;
			}
			values.id = resData.id;
			values.status = resData.status != undefined ? resData.status : (isPublish ? 1 : 0);
			values.catalogue = this.getTransData();
			values.article = article;
			values.content = values.content.toHTML();
			this.setState({ spinLoading: true });
			firePostRequest(SAVE_BLOG, { ...values }).then((res) => {
				if (res.code === 200) {
					showSuccessMsg('保存成功');
					this.props.history.push('/admin/home/articleManage');
				}
				this.setState({ spinLoading: false });
			})
				.catch((err) => console.log(err));
		});
	}

	// 存草稿
	saveDraft = () => {

	}

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
				this.setState({ catalogueList: res.data, compareList });
			} else {
				openNotification('error', '获取个人分类列表失败', res.message);
			}
		})
			.catch((err) => console.log(err));
	}

	fetchData = () => {
		let articleId = GetQueryString('articleId');
		this.getCatalogueList();
		if (!articleId) {
			return;
		}
		this.editorInstance.setValue(BraftEditor.createEditorState('内容'));
	}

	componentDidMount() {
		this.fetchData();
	}

	render() {
		const { resData, article, catalogue, hasSelCatalogue, catalogueList, spinLoading } = this.state;
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
						<Row type="flex" gutter={10}>
							<Col>
								<Button type="primary" onClick={this.handlePublish}>发布</Button>
							</Col>
							<Col>
								<Button onClick={this.saveDraft}>存草稿</Button>
							</Col>
						</Row>
					</Form>
				</Spin>
			</div>
		);
	}
}
export default AdminHomeEdit;