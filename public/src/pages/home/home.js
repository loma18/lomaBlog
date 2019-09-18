import React, { Component } from 'react';
import { Row, Col, Icon, Pagination } from 'antd';
import { Router, withRouter, Link } from 'react-router-dom';
import Swiper from 'components/Home/swiper';
import { fireGetRequest, firePostRequest } from 'service/app';
import {
	GET_FILTER_LIST
} from 'constants/api';
import { hxPaginationSetup } from 'constants';
import { openNotification, formatMomentToString } from 'utils';

@withRouter
class HomeIndex extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataList: [],
			pagination: { ...hxPaginationSetup }
		};
	}

	//点击跳转
	handleClick = (item) => {
		this.props.history.push(`/home/detail?articleType=${item.articleType}&status=${item.status}&articleId=${item.aid}`);
	}

	handleChange = (page, pageSize) => {
		const { pagination } = this.state;
		pagination.current = page;
		this.setState({ pagination }, () => {
			this.fetchData();
		});
	};

	fetchData = (searchVal = '') => {
		const { pagination } = this.state;
		let page = pagination.current ? pagination.current : 1,
			pathname = window.location.pathname.split('/')[1];
		if (pathname == 'home') {
			pathname = '';
		}
		if (searchVal) {
			page = 1;
		}
		fireGetRequest(GET_FILTER_LIST, { page, articleType: pathname, searchVal, status: 1 }).then((res) => {
			if (res.code === 200) {
				pagination.total = res.total;
				this.setState({ dataList: res.data, pagination });
			} else {
				openNotification('error', '获取博客列表失败', res.msg);
			}
		}).catch((err) => console.log(err));
	}

	componentWillReceiveProps() {
		this.fetchData();
	}

	componentDidMount() {
		this.fetchData();
		if (typeof this.props.bindChild == 'function') {
			this.props.bindChild(this);
		}
	}


	render() {
		const { dataList, pagination } = this.state;
		let pathname = window.location.pathname.split('/')[1];
		return (
			<div className={'homeIndex'}>
				{(!pathname || pathname == 'home') && <Swiper />}
				<div className={'home-body'}>
					<ul>
						{
							dataList.map((item) => (
								<li key={item.aid} className={'listItem'} onClick={() => this.handleClick(item)}>
									<Row type="flex" justify="space-between" gutter={10}>
										<Col className={'articleContainer'}>
											<h3>{item.title}</h3>
											<p className={'description'}>{item.description}</p>
											<div className={'info'}>
												<span>{formatMomentToString(item.createAt, 'YYYY年MM月DD日 HH:mm:ss')}</span>
												<span><Icon type="eye" />{item.views}</span>
												<span><Icon type="message" />{item.comments}</span>
												{item.tags.split(',').map((tag, key) => {
													return <b key={key}>{tag}</b>
												})}
											</div>
										</Col>
									</Row>
								</li>
							))
						}
					</ul>
					{dataList.length > 0 && <Pagination {...pagination} onChange={this.handleChange} />}
				</div>
			</div>
		);
	}
}
export default HomeIndex;