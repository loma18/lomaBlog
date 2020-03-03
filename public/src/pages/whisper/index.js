import React, { Component } from 'react';
import { Row, Col, Form, Button, Spin, Input, Popconfirm } from 'antd';
import { formatMomentToString, openNotification, showSuccessMsg } from 'utils';
import './style.less';
import { fireGetRequest, firePostRequest } from 'service/app';
import { SAVE_WHISPER, DELETE_WHISPER, GET_WHISPER_LIST } from 'constants/api';

const FormItem = Form.Item;
const form = Form.create();
@form
class Whisper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			spinLoading: false,
			page: 1,
			total: 0,
			pathname:
				props.location.pathname.indexOf('whisper') > -1
					? 'whisper'
					: 'laugh'
		};
	}

	handleAdd = () => {
		let pathname = window.location.pathname.split('/')[2];
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			}
			firePostRequest(SAVE_WHISPER, { ...values, type: pathname })
				.then(res => {
					if (res.code === 200) {
						showSuccessMsg('添加成功');
						this.props.form.resetFields();
						this.setState({ page: 1 }, () => {
							this.fetchData();
						});
					} else {
						openNotification('error', '新增微语失败', res.msg);
					}
				})
				.catch(err => console.log(err));
		});
	};

	handleDelete = item => {
		fireGetRequest(DELETE_WHISPER, { id: item.id })
			.then(res => {
				if (res.code === 200) {
					showSuccessMsg('删除成功');
					this.setState({ page: 1 }, () => {
						this.fetchData();
					});
				} else {
					openNotification('error', '删除失败', res.msg);
				}
			})
			.catch(err => console.log(err));
	};

	loadMore = () => {
		this.setState({ page: this.state.page + 1 }, () => {
			this.fetchData('', true);
		});
	};

	fetchData = (searchValue = '', isLoadMore = false) => {
		let { page, data } = this.state;
		if (searchValue) {
			this.setState({ page: 1 });
			page = 1;
		}
		this.setState({ spinLoading: true });
		let pathname = window.location.pathname.split('/');
		pathname = pathname[1] == 'admin' ? pathname[2] : pathname[1];
		fireGetRequest(GET_WHISPER_LIST, { page, searchValue, type: pathname })
			.then(res => {
				if (res.code === 200) {
					if (isLoadMore) {
						data = data.concat(res.data);
					} else {
						data = res.data;
					}
					this.setState({ data, total: res.total });
				} else {
					openNotification('error', '获取微语列表失败', res.msg);
				}
				this.setState({ spinLoading: false });
			})
			.catch(err => console.log(err));
	};

	UNSAFE_componentWillReceiveProps(props) {
		const { pathname } = this.state;
		if (props.location.pathname.indexOf(pathname) === -1) {
			this.setState(
				{
					pathname: pathname == 'whisper' ? 'laugh' : 'whisper',
					page: 1
				},
				() => {
					this.fetchData();
				}
			);
		}
	}

	componentDidMount() {
		this.fetchData();
		if (typeof this.props.bindChild == 'function') {
			this.props.bindChild(this);
		}
	}

	render() {
		const { data, spinLoading, page, total } = this.state;
		const { getFieldDecorator } = this.props.form;
		const pathname = window.location.pathname.split('/')[1];
		return (
			<div id={'lomaBlog-whisper'}>
				{pathname == 'admin' && (
					<Form>
						<FormItem>
							{getFieldDecorator('description', {
								rules: [
									{ required: true, message: '请输入内容!' }
								]
							})(
								<Input.TextArea
									placeholder='description'
									rows={5}
								/>
							)}
						</FormItem>
						<Button
							type='primary'
							onClick={this.handleAdd}
							className='login-form-button'
						>
							新增
						</Button>
					</Form>
				)}
				<Spin spinning={spinLoading}>
					<ul className={'whisperContainer'}>
						{data.map(item => {
							return (
								<li key={item.id}>
									<Row type='flex' gutter={30}>
										<Col
											className={'description'}
											dangerouslySetInnerHTML={{
												__html: item.description
											}}
										></Col>
										<Col className={'date'}>
											<span>
												{formatMomentToString(
													item.createAt,
													'YYYY-MM-DD HH:mm:ss'
												)}
											</span>
										</Col>
										{pathname == 'admin' && (
											<Col>
												<Popconfirm
													title='是否确认删除?'
													onConfirm={() =>
														this.handleDelete(item)
													}
													okText='是'
													cancelText='否'
												>
													<Button> 删除</Button>
												</Popconfirm>
											</Col>
										)}
									</Row>
								</li>
							);
						})}
					</ul>
					<p className={'loadMore'}>
						{page * 10 < total ? (
							<span onClick={this.loadMore}>加载更多</span>
						) : (
							'到底啦~'
						)}
					</p>
				</Spin>
			</div>
		);
	}
}
export default Whisper;
