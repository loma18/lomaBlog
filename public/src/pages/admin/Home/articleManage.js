import React, { Component } from 'react';
import {
	Row,
	Col,
	Icon,
	Menu,
	Select,
	Input,
	Button,
	Pagination,
	Popconfirm
} from 'antd';
import { inject, observer } from 'mobx-react';
import { Router, withRouter, Link } from 'react-router-dom';
import DateSelect from 'components/Admin/DateSelect';
import { fireGetRequest, firePostRequest } from 'service/app';
import {
	GET_CATALOGUE_LIST,
	GET_FILTER_LIST,
	DELETE_BLOG
} from 'constants/api';
import { articleTypeList, articleTypeObj } from 'constants';
import {
	openNotification,
	showSuccessMsg,
	getPathnameByIndex,
	GetQueryString,
	formatMomentToString
} from 'utils';

const { Option } = Select;
const Search = Input.Search;

@withRouter
@inject('appStore')
@observer
class AdminHomeArticleManage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableData: [],
			current: 'all',
			years: '请选择年份',
			months: '请选择月份',
			articleType: 'all',
			catalogueType: 'all',
			catalogueList: [],
			searchVal: '',
			page: 1,
			total: 0
		};
	}

	handleClick = ({ item, key, keyPath, domEvent }) => {
		this.setState({ current: key, page: 1 }, () => {
			this.props.history.push('/admin/home/articleManage/' + key);
			this.fetchData();
		});
	};

	setCurrent = () => {
		let key = getPathnameByIndex(4),
			articleType = GetQueryString('articleType'),
			catalogueType = GetQueryString('catalogueType'),
			searchVal = GetQueryString('searchVal'),
			page = GetQueryString('page');
		searchVal = searchVal ? decodeURI(searchVal) : '';
		key = key ? key : 'all';
		this.setState(
			{
				page: page || 1,
				current: key,
				searchVal,
				articleType: articleType || 'all',
				catalogueType: catalogueType
					? catalogueType == 'all'
						? catalogueType
						: Number(catalogueType)
					: 'all'
			},
			() => {
				this.fetchData();
			}
		);
	};

	// 改变年/月
	handleSelectChange = (val, type) => {
		this.setState({ [type]: val });
	};

	// 改变文章/个人分类类型
	handleChangeType = (val, type) => {
		this.setState({ [type]: val });
	};

	// 关键词搜索
	handleChange = e => {
		this.setState({ searchVal: e.target.value });
	};

	// 搜索
	handleSearch = page => {
		const {
			years,
			months,
			articleType,
			catalogueType,
			searchVal
		} = this.state;
		let year = years.replace('年', '');
		let month = months.replace('月', '');
		this.props.history.push(
			'/admin/home/articleManage/all?year=' +
				year +
				'&month=' +
				month +
				'&searchVal=' +
				searchVal +
				'&articleType=' +
				articleType +
				'&catalogueType=' +
				catalogueType +
				'&page=' +
				(page ? page : 1)
		);
		this.setState({ page: page ? page : 1 }, () => {
			this.fetchData();
		});
	};

	getCatalogueList = () => {
		fireGetRequest(GET_CATALOGUE_LIST)
			.then(res => {
				if (res.code === 200) {
					this.setState({ catalogueList: res.data });
				} else {
					openNotification('error', '获取个人分类失败', res.msg);
				}
			})
			.catch(err => console.log(err));
	};

	onChange = page => {
		this.handleSearch(page);
	};

	//查看
	handleLook = item => {
		window.location.href = `/home/detail?articleType=${item.articleType}&status=${item.status}&articleId=${item.aid}&showAll=true`;
		// this.props.history.push('/home/detail?articleId=' + id);
		// this.props.appStore.setBackStage(false);
	};

	//跳转编辑
	handleEdit = item => {
		this.props.history.push(
			`/admin/home/edit?articleType=${item.articleType}&status=${item.status}&articleId=${item.aid}&showAll=true`
		);
	};

	//删除
	handleDelete = id => {
		fireGetRequest(DELETE_BLOG, { id })
			.then(res => {
				if (res.code === 200) {
					showSuccessMsg('删除成功');
					this.fetchData();
				} else {
					openNotification('error', '删除失败', res.msg);
				}
			})
			.catch(err => console.log(err));
	};

	fetchData = () => {
		const {
			current,
			years,
			months,
			articleType,
			catalogueType,
			searchVal,
			page
		} = this.state;
		let year = years.replace('请选择年份', '').replace('年', ''),
			month = months.replace('请选择月份', '').replace('月', ''),
			params = { status: 0, page, showSecret: true },
			pathname = window.location.pathname.replace(/\/$/, '').split('/');
		if (current == 'all' || pathname[pathname.length - 1] != 'draft') {
			params = {
				status: 1,
				year,
				month,
				articleType,
				catalogueType,
				searchVal,
				page,
				showSecret: true
			};
		}
		fireGetRequest(GET_FILTER_LIST, { ...params })
			.then(res => {
				if (res.code === 200) {
					this.setState({ tableData: res.data, total: res.total });
				} else {
					openNotification('error', '获取博客列表失败', res.msg);
				}
			})
			.catch(err => console.log(err));
	};

	UNSAFE_componentWillReceiveProps() {
		this.setCurrent();
	}

	componentDidMount() {
		this.setCurrent();
		this.getCatalogueList();
	}

	render() {
		const {
			current,
			years,
			months,
			articleType,
			catalogueType,
			searchVal,
			catalogueList,
			tableData,
			page,
			total
		} = this.state;
		let articleTypeLists = JSON.parse(JSON.stringify(articleTypeList));
		articleTypeLists.unshift({ key: 'all', name: '文章类型', id: 0 });
		return (
			<div className={'adminHomeArticleManage'}>
				<Menu
					onClick={this.handleClick}
					selectedKeys={[current]}
					mode='horizontal'
				>
					<Menu.Item key='all'>全部</Menu.Item>
					<Menu.Item key='draft'>草稿</Menu.Item>
				</Menu>
				{current == 'all' ? (
					<Row type='flex' className={'filterContainer'}>
						<Col>筛选：</Col>
						<Col>
							<DateSelect
								years={years}
								months={months}
								handleSelectChange={this.handleSelectChange}
							/>
						</Col>
						<Col>
							<Select
								value={articleType}
								onChange={val =>
									this.handleChangeType(val, 'articleType')
								}
								className={'lomaBlog-select select-articleType'}
							>
								{articleTypeLists.map(item => (
									<Option key={item.id} value={item.key}>
										{item.name}
									</Option>
								))}
							</Select>
						</Col>
						<Col>
							<Select
								value={catalogueType}
								onChange={val =>
									this.handleChangeType(val, 'catalogueType')
								}
								className={
									'lomaBlog-select select-catalogueType'
								}
							>
								<Option value={'all'}>个人分类</Option>
								{catalogueList.map(item => (
									<Option key={item.id} value={item.id}>
										{item.name}
									</Option>
								))}
							</Select>
						</Col>
						<Col>
							<Input
								placeholder='请输入标题关键词'
								onChange={this.handleChange}
								value={searchVal}
							/>
						</Col>
						<Col>
							<Button
								onClick={() => this.handleSearch()}
								icon='search'
								className={'searchBtn'}
							>
								搜索
							</Button>
						</Col>
					</Row>
				) : null}
				<div className={'articleListContainer'}>
					<ul>
						{tableData.map((item, key) => (
							<li key={key} className={'listItem'}>
								<h3>{item.title}</h3>
								<Row type='flex' justify='space-between'>
									<Col>
										<span className={'articleTypeName'}>
											{articleTypeObj[item.articleType]
												? articleTypeObj[
														item.articleType
												  ].name
												: item.articleType}
										</span>
										<span className={'updateTime'}>
											{formatMomentToString(
												item.updateAt,
												'YYYY年MM月DD日 HH:mm:ss'
											)}
										</span>
										{current == 'all' && (
											<span className={'icon'}>
												<Icon type='message' />
												{item.comments}
											</span>
										)}
										{current == 'all' && (
											<span className={'icon'}>
												<Icon type='eye' />
												{item.views}
											</span>
										)}
									</Col>
									<Col>
										<span
											className={'lookView linkColor'}
											onClick={() =>
												this.handleLook(item)
											}
										>
											查看
										</span>
										<span
											className={'lookView linkColor'}
											onClick={() =>
												this.handleEdit(item)
											}
										>
											编辑
										</span>

										<Popconfirm
											title='是否确认删除?'
											onConfirm={() =>
												this.handleDelete(item.aid)
											}
											okText='是'
											cancelText='否'
										>
											<span
												className={'delete dangerColor'}
											>
												删除
											</span>
										</Popconfirm>
									</Col>
								</Row>
							</li>
						))}
					</ul>
					{tableData.length > 0 && (
						<Pagination
							current={page}
							onChange={this.onChange}
							total={total}
						/>
					)}
				</div>
			</div>
		);
	}
}
export default AdminHomeArticleManage;
