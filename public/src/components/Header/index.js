import React, { Component } from 'react';
import { Row, Col, Menu, Input, Button } from 'antd';
import { Router, withRouter, Link } from 'react-router-dom';
import { ROUTE_PATH, ROUTE_ADMIN_PATH } from 'constants/route';
import { inject, observer } from 'mobx-react';
import { USER_INFO } from 'constants/user';
import { docTitle } from 'constants';
import { isApp } from 'utils/functions';
import './style.less';

const Search = Input.Search;

@withRouter
@inject('appStore')
@observer
class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedKeys: [],
			isOpen: false
		};
	}

	handleMenu = () => {
		let { isOpen } = this.state;
		this.setState({ isOpen: !isOpen });
	};

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
			case 'laugh':
				key = ['laugh'];
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
		const { selectedKeys, isOpen } = this.state;
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
						<Link to={'/'}>
							<h3
								title='xiange的博客'
								style={{
									display: isApp() ? 'none' : 'inline-block',
									marginRight: 15
								}}
							>
								xiange的博客
							</h3>
							<img
								src={require('assets/logo.jpg')}
								alt={'xiangeLogo'}
								title={'xiangeLogo'}
							/>
						</Link>
					</Col>
					<Col
						className={'header-menu'}
						style={{
							display: !isApp()
								? 'block'
								: isOpen
								? 'block'
								: 'none'
						}}
					>
						<Menu
							mode={isApp() ? 'vertical' : 'horizontal'}
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
					{isApp() ? (
						<Col className={'webTitle'}>
							xiange的博客
							<span
								className={isOpen ? 'isOpen' : ''}
								onClick={this.handleMenu}
							></span>
						</Col>
					) : (
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
					)}
				</Row>
			</div>
		);
	}
}
export default Header;
