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
	handleClick = (id) => {
		this.props.history.push('/home/detail?articleId=' + id);
	}

	handleChange = (page, pageSize) => {
		const { pagination } = this.state;
		pagination.current = page;
		this.setState({ pagination }, () => {
			this.fetchData();
		});
	};

	fetchData = () => {
		const { pagination } = this.state;
		let page = pagination.current ? pagination.current : 1;
		fireGetRequest(GET_FILTER_LIST, { page }).then((res) => {
			if (res.code === 200) {
				pagination.total = res.total;
				this.setState({ dataList: res.data, pagination });
			} else {
				openNotification('error', '获取博客列表失败', res.msg);
			}
		})
			.catch((err) => console.log(err));
	}

	componentDidMount() {
		this.fetchData();
	}


	render() {
		const { dataList, pagination } = this.state;
		return (
			<div className={'homeIndex'}>
				<Swiper />
				<div className={'home-body'}>
					<ul>
						{
							dataList.map((item) => (
								<li key={item.aid} className={'listItem'}>
									<Row type="flex" justify="space-between" gutter={10}>
										<Col className={'articleContainer'}>
											<h3 onClick={() => this.handleClick(item.aid)}>{item.title}</h3>
											<p dangerouslySetInnerHTML={{ __html: item.content }}></p>
											<div className={'info'}>
												<span>{formatMomentToString(item.createAt, 'YYYY年MM月DD日 HH:mm:ss')}</span>
												<span><Icon type="eye" />{item.views}</span>
												<span><Icon type="message" />{item.comments}</span>
												<span><Icon type="heart" />{item.likes}</span>
											</div>
										</Col>
									</Row>
								</li>
							))
						}
					</ul>
					<Pagination {...pagination} onChange={this.handleChange} />
				</div>
			</div>
		);
	}
}
export default HomeIndex;