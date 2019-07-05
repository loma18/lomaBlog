import React, { Component } from 'react';
import { Row, Col, Icon, Menu } from 'antd';
import { Router, withRouter, Link } from 'react-router-dom';
import RightCom from './rightCom';
import { fireGetRequest, firePostRequest } from 'service/app';
import {
	GET_INTERFACE_LIST
} from 'constants/api';
import { openNotification, showSuccessMsg, GetQueryString, getPathnameByIndex } from 'utils';

const { SubMenu } = Menu;

@withRouter
class AdminInterface extends Component {
	constructor(props) {
		super(props);
		this.state = {
			current:'create',
			type:'', // 编辑或查看：edit/view
			apiList:[
				// {
				//     id: 1, title: '管理首页', path: '', children: [
				//         { id: 101, title: '获取个人分类', path: '/getCatalogue' },
				//         { id: 102, title: '保存', path: '/save' },
				//     ]
				// },
				// {
				//     id: 2, title: '管理首页2', path: '', children: [
				//         { id: 201, title: '获取个人分类2', path: '/getCatalogue' },
				//         { id: 202, title: '保存2', path: '/save' },
				//         { id: 203, title: '获取个人分类3', path: '/getCatalogue' },
				//         { id: 204, title: '保存3', path: '/save' },
				//     ]
				// }
			]
		};
	}
    handleClick = (e) => {
    	let type = '';
    	if (e.key == 'create' || e.key == 'groupManager') {
    		type = e.key;
    	} else {
    		type = e.domEvent.target.className == 'edit' ? 'edit' : 'view';
    	}
    	this.setState({
    		current:e.key,
    		type
    	});
    };

    // setCurrent = () => {
    //     let leftKey = getPathnameByIndex(3);
    //     leftKey = leftKey ? leftKey : 'articleManage';
    //     this.setState({ current: leftKey });
    // }

    // UNSAFE_componentWillReceiveProps() {
    //     this.setCurrent();
    // }

    getMenuList = (data) => data.map((item) => (<SubMenu
    	key={item.id + ''}
    	title={
    		<span>{item.title}</span>
    	}
    >
    	{
    		item.children.map((list) => (
    			<Menu.Item key={list.id + ''}>
    				<Row type="flex">
    					<Col>
    						<h4>
    							{list.title}<br />
    							{list.routePath}
    						</h4>
    					</Col>
    					<Col>
    						<span className={'edit'}>编辑</span>
    					</Col>
    				</Row>
    			</Menu.Item>
    		))
    	}
    </SubMenu>))

    fetchData = () => {
    	fireGetRequest(GET_INTERFACE_LIST).then((res) => {
    		if (res.code === 200) {
    			this.setState({ apiList:res.data, current:'', type:'' });
    		} else {
    			openNotification('error', '获取接口列表失败', res.msg);
    		}
    	})
    		.catch((err) => console.log(err));
    }

    componentDidMount() {
    	this.fetchData();
    }

    render() {
    	const { current, apiList, type } = this.state;
    	return (
    		<div className={'adminInterface'}>
    			<Row type="flex" justify="start">
    				<Col className={'left'}>
    					<Menu
    						theme={'dark'}
    						onClick={this.handleClick}
    						style={{ width:256 }}
    						selectedKeys={[this.state.current]}
    						mode="inline"
    					>
    						<Menu.Item key="create"><Icon type="edit" />新增</Menu.Item>
    						<SubMenu
    							key="interface"
    							title={<span><Icon type="api" /><span>接口</span></span>}
    						>
    							{
    								this.getMenuList(apiList)
    							}
    						</SubMenu>
    						<Menu.Item key="groupManager">接口分组管理</Menu.Item>
    					</Menu>
    				</Col>
    				<Col className={'right'}>
    					{current ? <RightCom
    						selectedKeys={current}
    						type={type}
    						fetchData={this.fetchData}
    					/> : (
    						<p>请选择查看或编辑接口</p>
    					)}
    				</Col>
    			</Row>
    		</div>
    	);
    }
}
export default AdminInterface;