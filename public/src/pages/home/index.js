import React, { Component } from 'react';
import { Row, Col, Calendar, Select, Radio, Menu } from 'antd';
import { Router, withRouter, Link } from 'react-router-dom';
import { fireGetRequest } from 'service/app';
import { GET_FILTER_LIST, GET_ARTICLE_TYPE_COUNT } from 'constants/api';
import { openNotification } from 'utils';
import { articleTypeObj } from 'constants';
import Routers from './router';
import { isApp } from 'utils/functions';
import './style.less';

const { Group, Button } = Radio;
@withRouter
class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hotArticleList: [],
			articleList: []
		};
	}

	onPanelChange = (date, mode) => {
		console.log(date, mode);
	};

	onSelect = date => {
		console.log(date.valueOf());
	};

	// 日历头部自定义
	headerRender = ({ value, type, onChange, onTypeChange }) => {
		const start = 0;
		const end = 12;
		const monthOptions = [];

		const current = value.clone();
		const localeData = value.localeData();
		const months = [];
		for (let i = 0; i < 12; i++) {
			current.month(i);
			months.push(localeData.monthsShort(current));
		}

		for (let index = start; index < end; index++) {
			monthOptions.push(
				<Select.Option className='month-item' key={`${index}`}>
					{months[index]}
				</Select.Option>
			);
		}
		const month = value.month();

		const year = value.year();
		const options = [];
		for (let i = year - 10; i < year + 10; i += 1) {
			options.push(
				<Select.Option key={i} value={i} className='year-item'>
					{i}
				</Select.Option>
			);
		}
		return (
			<div style={{ padding: 10 }}>
				<Row type='flex' justify='space-between'>
					<Col>
						<Group
							size='small'
							onChange={e => onTypeChange(e.target.value)}
							value={type}
						>
							<Button value='month'>Month</Button>
							<Button value='year'>Year</Button>
						</Group>
					</Col>
					<Col>
						<Select
							size='small'
							dropdownMatchSelectWidth={false}
							className='my-year-select'
							onChange={newYear => {
								const now = value.clone().year(newYear);
								onChange(now);
							}}
							value={String(year)}
						>
							{options}
						</Select>
					</Col>
					<Col>
						<Select
							size='small'
							dropdownMatchSelectWidth={false}
							value={String(month)}
							onChange={selectedMonth => {
								const newValue = value.clone();
								newValue.month(parseInt(selectedMonth, 10));
								onChange(newValue);
							}}
						>
							{monthOptions}
						</Select>
					</Col>
				</Row>
			</div>
		);
	};

	handleJump = typeKey => {
		this.props.history.push('/' + typeKey);
	};

	fetchData = () => {
		let p1 = fireGetRequest(GET_FILTER_LIST, { hotArticle: true }),
			p2 = fireGetRequest(GET_ARTICLE_TYPE_COUNT);
		Promise.all([p1, p2])
			.then(res => {
				if (res[0].code === 200) {
					this.setState({ hotArticleList: res[0].data });
				} else {
					openNotification('error', '获取热门文章列表失败', res.msg);
				}
				if (res[1].code === 200) {
					this.setState({ articleList: res[1].data });
				} else {
					openNotification('error', '获取文章分类失败', res.msg);
				}
			})
			.catch(err => console.log(err));
		// fireGetRequest(GET_FILTER_LIST, { hotArticle: true }).then((res) => {
		// 	if (res.code === 200) {
		// 		this.setState({ hotArticleList: res.data });
		// 	} else {
		// 		openNotification('error', '获取热门文章列表失败', res.msg);
		// 	}
		// }).catch((err) => console.log(err));
	};

	componentDidMount() {
		this.fetchData();
	}

	render() {
		const { hotArticleList, articleList } = this.state;
		return (
			<div id={'lomaBlog-home'}>
				<Row type='flex' justify='space-between' gutter={20}>
					<Col className={'left'}>
						<Routers bindChild={this.props.bindChild} />
					</Col>
					{!isApp() && (
						<Col className={'right'}>
							<div className={'calendar'}>
								<Calendar
									fullscreen={false}
									onPanelChange={this.onPanelChange}
									onSelect={this.onSelect}
									headerRender={this.headerRender}
								/>
							</div>
							<div className={'article'}>
								<h3>文章分类</h3>
								<Menu mode='vertical'>
									{articleList.map(item => (
										<Menu.Item key={item.articleType}>
											<div
												onClick={() =>
													this.handleJump(
														item.articleType
													)
												}
											>
												{
													articleTypeObj[
														item.articleType
													].name
												}
												<span>({item.total})</span>
											</div>
										</Menu.Item>
									))}
								</Menu>
							</div>
							<div className={'hot-article'}>
								<h3>热门文章</h3>
								{hotArticleList.map(item => {
									return (
										<div
											className={'hot-item'}
											key={item.aid}
										>
											<h4 title={item.title}>
												<Link
													to={`/home/detail?articleType=${item.articleType}&status=${item.status}&articleId=${item.aid}`}
												>
													{item.title}
												</Link>
											</h4>
											<p>
												标签：
												{item.tags
													.split(',')
													.map((tag, key) => {
														return (
															<b key={key}>
																{tag}
															</b>
														);
													})}
											</p>
										</div>
									);
								})}
							</div>
						</Col>
					)}
				</Row>
			</div>
		);
	}
}
export default Home;
