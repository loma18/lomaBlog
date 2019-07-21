import React, { Component } from 'react';
import { Row, Col, Calendar, Select, Radio, Menu } from 'antd';
import { fireGetRequest, firePostRequest } from 'service/app';
import {
	GET_ARTICLE_BY_ID
} from 'constants/api';
import { openNotification, formatMomentToString, GetQueryString } from 'utils';

class HomeDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			resData: {}
		}
	}

	fetchData = () => {
		const id = GetQueryString('articleId');
		fireGetRequest(GET_ARTICLE_BY_ID, { id }).then((res) => {
			if (res.code === 200) {
				this.setState({ resData: res.data });
			} else {
				openNotification('error', '获取博客失败', res.msg);
			}
		})
			.catch((err) => console.log(err));
	}

	componentDidMount() {
		window.scrollTo(0, 0);
		this.fetchData();
	}

	render() {
		const { resData } = this.state;
		return (
			<div className={'homeDetail'}>
				<h2>{resData.title}</h2>
				<p>{formatMomentToString(resData.createAt, 'YYYY年MM月DD日 HH:mm:ss')}</p>
				<hr />
				<div dangerouslySetInnerHTML={{ __html: resData.content }}>
				</div>
			</div>
		);
	}
}
export default HomeDetail;
