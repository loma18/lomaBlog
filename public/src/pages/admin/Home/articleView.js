import React, { Component } from 'react';
import { Row, Col, Icon, Menu, Select, Input, Button } from 'antd';
import { Router, withRouter, Link } from 'react-router-dom';
import DateSelect from 'components/Admin/DateSelect';
import { fireGetRequest, firePostRequest } from 'service/app';
import {
	GET_ARTICLE_BY_ID
} from 'constants/api';
import { articleTypeList } from 'constants';
import { openNotification, showSuccessMsg, getPathnameByIndex, GetQueryString, formatMomentToString } from 'utils';


class AdminHomeArticleView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			resData: {},
		};
	}

	fetchData = () => {
		let id = GetQueryString('articleId');
		fireGetRequest(GET_ARTICLE_BY_ID, { ...id }).then((res) => {
			if (res.code === 200) {
				this.setState({ resData: res.data });
			} else {
				openNotification('error', '获取博客失败', res.msg);
			}
		})
			.catch((err) => console.log(err));
	}

	componentDidMount() {
		this.fetchData();
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
			tableData
		} = this.state;
		let articleTypeLists = JSON.parse(JSON.stringify(articleTypeList));
		articleTypeLists.unshift({ key: 'all', name: '文章类型', id: 0 });
		return (
			<div className={'adminHomeArticleView'}>

			</div>
		);
	}
}
export default AdminHomeArticleView;