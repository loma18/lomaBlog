import React, { Component } from 'react';
import { Row, Col, Calendar, Select, Radio, Menu } from 'antd';
import Swiper from 'components/Home/swiper';
import { fireGetRequest, firePostRequest } from 'service/app';
import {
	GET_FILTER_LIST
} from 'constants/api';
import { openNotification, showSuccessMsg, GetQueryString, getPathnameByIndex } from 'utils';

class HomeIndex extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataList: []
		};
	}

    fetchData = () => {
		let { dataList } = this.state;
		let id = GetQueryString('articleId');
    	fireGetRequest(GET_FILTER_LIST, { id }).then((res) => {
			if (res.code === 200) {
				this.setState({ tableData: res.data });
			} else {
				openNotification('error', '获取博客列表失败', res.msg);
			}
		})
			.catch((err) => console.log(err));
    	this.setState({ dataList });
    }

    componentDidMount() {
    	this.fetchData();
    }


    render() {
    	const { dataList } = this.state;
    	return (
    		<div className={'homeIndex'}>
    			<Swiper />
    			<div className={'home-body'}>
    				<ul>
    					{
    						dataList.map((item) => (
    							<li key={item.id} className={'listItem'}>
    								<Row type="flex" justify="space-between" gutter={10}>
    									<Col className={'imgContainer'}>
    										<img src={require('assets/swiper/1.png')} />
    									</Col>
    									<Col className={'articleContainer'}>
    										<h3>{item.title}</h3>
    										<p>{item.description}</p>
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
export default HomeIndex;