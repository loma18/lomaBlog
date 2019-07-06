import React, { Component } from 'react';
import { Row, Col, Menu, Input, Button } from 'antd';
import { Router, withRouter, Link } from 'react-router-dom';
import { ROUTE_PATH, ROUTE_ADMIN_PATH } from 'constants/route';
import { USER_INFO } from 'constants/user';
import { changeTheme } from 'utils/functions';
import './style.less';

const Search = Input.Search;

@withRouter
class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedKeys: []
		};
	}

    // 进入后台/前台
    handleClick = (pathname, clearLoginLocal = false) => {
    	let isLogin = window.localStorage.getItem(USER_INFO.IS_LOGIN);
    	const { changeStage } = this.props;
    	if (pathname == 'admin') {
    		changeTheme('light');
    		changeStage('/');
    		this.props.history.push('/');
    		if (clearLoginLocal) {
    			window.localStorage.setItem(USER_INFO.IS_LOGIN, '');
    		}
    	} else if (!isLogin) {
    		window.location.href = '/login';
    	} else {
    		changeTheme('dark');
    		changeStage('admin');
    		this.props.history.push('/admin');
    	}
    }

    handleSearch = (value) => {
    	console.log(value);
    }

    onSelect = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    	this.setState({ selectedKeys });
    }

    getDefaultSelKey = () => {
    	let pathname = window.location.pathname.split('/');
    	let key = null;
    	switch (pathname[1]) {
    		case 'home':
    		case 'original':
    		case 'reprint':
    		case 'code':
    			key = ['home'];
    			break;
    		case 'whisper':
    			key = ['whisper'];
    			break;
    		case 'admin':
    			if (!pathname[2] || pathname[2] == 'home') {
    				key = ['admin'];
    			} else {
    				key = [pathname[2]];
    			}
    			break;
    		default:
    			key = ['home'];
    	}
    	this.setState({ selectedKeys: key });
    }

    UNSAFE_componentWillReceiveProps(props) {
    	this.getDefaultSelKey();
    }
    componentDidMount() {
    	this.getDefaultSelKey();
    }

    render() {
    	const { selectedKeys } = this.state;
    	const { menuList } = this.props;

    	let pathObj = ROUTE_PATH;
    	let path = window.location.pathname.split('/');
    	if (path[1] == 'admin') {
    		pathObj = ROUTE_ADMIN_PATH;
    	}
    	return (
    		<div id={'lomaBlog-header'}>
    			<Row type="flex" justify="space-between" gutter={20} className={'nav'}>
    				<Col className={'header-logo'}>
    					<img src={require('assets/logo.jpg')} />
    				</Col>
    				<Col className={'header-menu'}>
    					<Menu mode="horizontal" selectedKeys={selectedKeys} onSelect={this.onSelect}>
    						{
    							menuList.map((item) => (
    								<Menu.Item key={item.key}>
    									<Link to={pathObj[item.key]}> {item.title}</Link>
    								</Menu.Item>
    							))
    						}
    					</Menu>
    				</Col>
    				<Col>
    					<Button onClick={() => this.handleClick(path[1])}>
    						{path[1] == 'admin' ? '进入前台' : '后台管理'}
    					</Button>
    				</Col>
    				<Col className={'header-right'}>
    					{path[1] == 'admin' ? (
    						<Button onClick={() => this.handleClick(path[1], true)}>
                                退出登陆
    						</Button>
    					) : (<Search
	placeholder="search..."
	onSearch={this.handleSearch}
    					     />)}
    				</Col>
    			</Row>
    		</div>
    	);
    }
}
export default Header;