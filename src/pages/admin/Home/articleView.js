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
			<div className={'adminHomeArticleManage'}>
				<Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal" theme={'dark'}>
					<Menu.Item key="all">
						全部
    				</Menu.Item>
					<Menu.Item key="draft">
						草稿
    				</Menu.Item>
				</Menu>
				{current == 'all' ? <Row type="flex" className={'filterContainer'}>
					<Col>筛选：</Col>
					<Col>
						<DateSelect years={years} months={months} handleSelectChange={this.handleSelectChange} />
					</Col>
					<Col>
						<Select
							value={articleType}
							onChange={(val) => this.handleChangeType(val, 'articleType')}
							className={'lomaBlog-select select-articleType'}
						>
							{articleTypeLists.map((item) => (
								<Option key={item.id} value={item.key}>
									{item.name}
								</Option>
							))}
						</Select>
					</Col>
					<Col>
						<Select
							value={catalogueType}
							onChange={(val) => this.handleChangeType(val, 'catalogueType')}
							className={'lomaBlog-select select-catalogueType'}
						>
							<Option value={'all'}>
								个人分类
    						</Option>
							{catalogueList.map((item) => (
								<Option key={item.id} value={item.id}>
									{item.name}
								</Option>
							))}
						</Select>
					</Col>
					<Col>
						<Input placeholder="请输入标题关键词" onChange={this.handleChange} value={searchVal} />
					</Col>
					<Col>
						<Button onClick={this.handleSearch} icon="search" className={'searchBtn'}>
							搜索
    					</Button>
					</Col>
				</Row> : null}
				<div className={'articleListContainer'}>
					<ul>
						{
							tableData.map((item, key) => (
								<li key={key} className={'listItem'}>
									<h3>{item.title}</h3>
									<Row type="flex" justify="space-between">
										<Col>
											<span className={'articleTypeName'}>{this.getArticleTypeName(item.articleType)}</span>
											<span className={'updateTime'}>{formatMomentToString(item.updateTime, 'YYYY年MM月DD日 HH:mm:ss')}</span>
											<span className={'icon'}><Icon type="message" />{item.comments}</span>
											<span className={'icon'}><Icon type="eye" />{item.views}</span>
											<span className={'icon'}><Icon type="heart" />{item.likes}</span>
										</Col>
										<Col>
											<span className={'lookView linkColor'}>查看</span>
											<span className={'delete dangerColor'}>删除</span>
										</Col>
									</Row>
								</li>
							))
						}
					</ul>
				</div>
			</div>
		);
	}
}
export default AdminHomeArticleView;