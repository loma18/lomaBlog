import React, { Component } from 'react';
import { Row, Col, Menu, Input, Button } from 'antd';
import { Router, withRouter, Link } from 'react-router-dom';
import { ROUTE_PATH, ROUTE_ADMIN_PATH } from 'constants/route';
import { inject, observer } from 'mobx-react';
import { USER_INFO } from 'constants/user';
import { docTitle } from 'constants';
import './style.less';

const Search = Input.Search;

@withRouter
@inject('appStore')
@observer
class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedKeys: []
		};
	}

	handleSearch = value => {
		if (typeof this.props.handleSearch == 'function') {
			this.props.handleSearch(value);
		}
	};

	onSelect = ({ item, key, keyPath, selectedKeys, domEvent }) => {
		this.setState({ selectedKeys });
	};

	// 进入后台/前台
	handleClick = () => {
		window.localStorage.setItem(USER_INFO.IS_LOGIN, '');
		window.location.href = '/login';
	};

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
		this.props.appStore.setDocumentTitle(docTitle[pathname[1]]);
		this.setState({ selectedKeys: key });
	};

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
				<Row
					type='flex'
					justify='space-between'
					gutter={20}
					className={'nav'}
				>
					<Col className={'header-logo'}>
						<img
							src={require('assets/logo.jpg')}
							alt={'xiangeLogo'}
							title={'xiangeLogo'}
						/>
					</Col>
					<Col className={'header-menu'}>
						<Menu
							mode='horizontal'
							selectedKeys={selectedKeys}
							onSelect={this.onSelect}
						>
							{menuList.map(item => (
								<Menu.Item key={item.key}>
									<Link to={pathObj[item.key]}>
										{' '}
										{item.title}
									</Link>
								</Menu.Item>
							))}
						</Menu>
					</Col>
					<Col className={'header-right'}>
						{path[1] == 'admin' ? (
							<Button onClick={() => this.handleClick()}>
								退出登陆
							</Button>
						) : (
							<Search
								placeholder='search...'
								onSearch={this.handleSearch}
							/>
						)}
					</Col>
				</Row>
			</div>
		);
	}
}
export default Header;
