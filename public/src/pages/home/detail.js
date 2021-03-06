import React, { Component } from 'react';
import { Row, Col, Button, Form, Input, message } from 'antd';
import { inject, observer } from 'mobx-react';
import { fireGetRequest, firePostRequest } from 'service/app';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import {
	GET_ARTICLE_BY_ID,
	CREATE_ARTICLE_COMMENT,
	GET_ARTICLE_COMMENT_BY_ID,
	GET_ATTACHMENT_LIST,
	DOWNLOAD_ATTACHMENT_BY_ID
} from 'constants/api';
import { openNotification, formatMomentToString, GetQueryString } from 'utils';

const FormItem = Form.Item;
const form = Form.create();
const { TextArea } = Input;

@form
@inject('appStore')
@observer
class HomeDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			resData: {},
			commentList: [],
			replyId: '',
			fileList: [],
			replyUserName: ''
		};
		this.replyText = React.createRef();
	}

	fetchData = () => {
		const id = GetQueryString('articleId');
		const helpMac = window.localStorage.getItem('helpMac');
		let status = GetQueryString('status'),
			articleType = GetQueryString('articleType'),
			showAll = GetQueryString('showAll');
		this.getAttachmentList();
		fireGetRequest(GET_ARTICLE_BY_ID, {
			id,
			helpMac,
			status,
			articleType,
			showAll
		})
			.then(res => {
				if (res.code === 200) {
					this.setState({ resData: res.data }, () => {
						this.props.appStore.setDocumentTitle(res.data.title);
						this.editorInstance.setValue(
							BraftEditor.createEditorState(
								decodeURIComponent(res.data.content)
							)
						);
						this.fetchCommentData();
					});
				} else {
					openNotification('error', '获取博客失败', res.msg);
				}
			})
			.catch(err => console.log(err));
	};

	fetchCommentData = () => {
		const id = GetQueryString('articleId');
		fireGetRequest(GET_ARTICLE_COMMENT_BY_ID, { articalId: id })
			.then(res => {
				if (res.code === 200) {
					this.setState({ commentList: res.data });
				} else {
					openNotification('error', '获取评论列表失败', res.msg);
				}
			})
			.catch(err => console.log(err));
	};

	//提交评论
	handleSubmit = () => {
		const id = GetQueryString('articleId');
		const helpMac = window.localStorage.getItem('helpMac');
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			}
			firePostRequest(CREATE_ARTICLE_COMMENT, {
				articalId: id,
				...values,
				helpMac
			})
				.then(res => {
					if (res.code === 200) {
						this.fetchCommentData();
					} else {
						openNotification('error', '提交留言失败', res.msg);
					}
				})
				.catch(err => console.log(err));
		});
	};

	//打开回复区域
	handleReply = (id, username) => {
		let { commentList } = this.state;
		commentList = this.handleData(commentList, id);
		this.setState({ replyId: id, replyUserName: username, commentList });
	};

	handleData = (lists, id = '') => {
		for (let i = 0; i < lists.length; i++) {
			if (lists[i].id == id) {
				lists[i].display = true;
			} else {
				lists[i].display = false;
			}
			if (lists[i].children && lists[i].children.length > 0) {
				lists[i].children = this.handleData(lists[i].children, id);
			}
		}
		return lists;
	};

	//取消回复
	handleCancelReply = () => {
		let { commentList } = this.state;
		commentList = this.handleData(commentList);
		this.setState({ commentList });
	};

	//提交回复
	handleSubmitReply = () => {
		const id = GetQueryString('articleId');
		const { replyId, replyUserName } = this.state;
		const { getFieldsValue } = this.props.form;
		let values = getFieldsValue(['username', 'email', 'qq']);
		const helpMac = window.localStorage.getItem('helpMac');
		// if (!values.username) {
		// 	message.warning('请先于表头处填写名字');
		// 	return;
		// }
		if (!this.replyText.current.textAreaRef.value) {
			message.warning('回复内容不能为空哦');
			return;
		}
		firePostRequest(CREATE_ARTICLE_COMMENT, {
			articalId: id,
			parentId: replyId,
			parentUsername: replyUserName,
			...values,
			content: this.replyText.current.textAreaRef.value,
			helpMac
		})
			.then(res => {
				if (res.code === 200) {
					this.fetchCommentData();
				} else {
					openNotification('error', '提交回复失败', res.msg);
				}
			})
			.catch(err => console.log(err));
		// console.log('replyid:', replyId, ',this.replyText:', this.replyText.current.textAreaRef.value);
	};

	getCommentsList = lists => {
		if (!lists || lists.length === 0) {
			return null;
		}
		return lists.map(item => {
			return (
				<li
					key={item.id}
					className={item.parentId ? 'childrenCls' : 'parentCls'}
				>
					<b>
						{!item.parentId
							? item.username
							: item.username + ' 回复 ' + item.parentUsername}
					</b>
					:{' '}
					<span>
						{formatMomentToString(
							item.createAt,
							'YYYY-MM-DD HH:mm'
						)}
					</span>
					<p>
						{item.content}
						<span
							onClick={() =>
								this.handleReply(item.id, item.username)
							}
						>
							{!item.parentId ? '评论' : '回复'}
						</span>
					</p>
					{item.display && (
						<div className={'replyComments'}>
							<TextArea
								rows={4}
								ref={this.replyText}
								maxLength={300}
							/>
							<div>
								<Button
									onClick={() => this.handleCancelReply()}
								>
									取消
								</Button>
								<Button
									onClick={() => this.handleSubmitReply()}
								>
									提交
								</Button>
							</div>
						</div>
					)}
				</li>
			);
		});
	};

	//点击下载附件
	handleDownload = item => {
		fireGetRequest(
			DOWNLOAD_ATTACHMENT_BY_ID,
			{ id: item.id },
			{ responseType: 'blob' }
		)
			.then(res => {
				let blob = new Blob([res], { type: res.type });
				let objUrl = URL.createObjectURL(blob);
				let a = document.createElement('a');
				a.href = objUrl;
				a.download = item.fileName;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
			})
			.catch(err => console.log(err));
	};

	//获取附件列表
	getAttachmentList = () => {
		let articleId = GetQueryString('articleId'),
			status = GetQueryString('status'),
			articleType = GetQueryString('articleType');
		fireGetRequest(GET_ATTACHMENT_LIST, { articleId, status, articleType })
			.then(res => {
				if (res.code === 200) {
					this.setState({ fileList: res.data });
				} else {
					openNotification('error', '获取附件列表失败', res.msg);
				}
			})
			.catch(err => console.log(err));
	};

	componentWillReceiveProps(props) {
		this.fetchData();
	}

	componentDidMount() {
		window.scrollTo(0, 0);
		this.fetchData();
	}

	render() {
		const { resData, commentList, fileList } = this.state;
		const { getFieldDecorator } = this.props.form;
		return (
			<div className={'homeDetail'}>
				<h2>{resData.title}</h2>
				<p>
					<span>
						{formatMomentToString(
							resData.createAt,
							'YYYY年MM月DD日 HH:mm:ss'
						)}
					</span>
					<span className={'rt'}>
						最后更新时间：
						{formatMomentToString(
							resData.updateAt,
							'YYYY年MM月DD日 HH:mm:ss'
						)}
					</span>
				</p>
				<hr />
				<BraftEditor
					ref={instance => (this.editorInstance = instance)}
					readOnly
					controls={[]}
				/>
				{fileList.length > 0 && (
					<Row>
						<Col>附件列表：</Col>
						<Col>
							<ul className={'attachmentList'}>
								{fileList.map(item => {
									return (
										<li key={item.id}>
											<span
												onClick={() =>
													this.handleDownload(item)
												}
											>
												{item.fileName}
											</span>
										</li>
									);
								})}
							</ul>
						</Col>
					</Row>
				)}
				<Form className='comment-form' layout={'inline'}>
					<FormItem label={'名字'}>
						{getFieldDecorator(
							'username'
							// , {
							// 	rules: [{ required: true, message: '请输入名字或昵称!' }]
							// }
						)(<Input placeholder='请输入名字或昵称' />)}
					</FormItem>
					<FormItem label={'邮箱'}>
						{getFieldDecorator('email')(
							<Input placeholder='请输入邮箱' />
						)}
					</FormItem>
					<FormItem label={'QQ'}>
						{getFieldDecorator('qq')(
							<Input placeholder='请输入QQ号' />
						)}
					</FormItem>
					<FormItem label={'留言评论'} className={'comment'}>
						{getFieldDecorator('content', {
							rules: [{ required: true, message: '请输入内容!' }]
						})(
							<TextArea
								placeholder='评论内容'
								rows={5}
								maxLength={300}
							/>
						)}
					</FormItem>
					<Button type='primary' onClick={this.handleSubmit}>
						提交
					</Button>
				</Form>
				<ul className={'commentList'}>
					{this.getCommentsList(commentList)}
				</ul>
			</div>
		);
	}
}
export default HomeDetail;
