import React, { Component } from 'react';
import { Row, Col, Icon, Menu } from 'antd';
import { Router, withRouter, Link } from 'react-router-dom';
import RightCom from './Home/rightCom';
import { getPathnameByIndex } from 'utils';
import './style.less';

const { SubMenu } = Menu;

@withRouter
class AdminHome extends Component {
	constructor(props) {
		super(props);
		let leftKey = getPathnameByIndex(3);
		this.state = {
			current: leftKey || 'articleManage'
		};
	}
	handleClick = e => {
		this.setState(
			{
				current: e.key
			},
			() => {
				this.props.history.push('/admin/home/' + e.key);
			}
		);
	};

	setCurrent = () => {
		let leftKey = getPathnameByIndex(3);
		leftKey = leftKey ? leftKey : 'articleManage';
		this.setState({ current: leftKey });
	};

	UNSAFE_componentWillReceiveProps() {
		this.setCurrent();
	}

	componentDidMount() {}

	render() {
		const { current } = this.state;
		return (
			<div className={'adminHome'}>
				<Row type='flex' justify='start'>
					<Col className={'left'}>
						<Menu
							onClick={this.handleClick}
							style={{ width: 256 }}
							defaultOpenKeys={['sub1']}
							selectedKeys={[this.state.current]}
							mode='inline'
						>
							<Menu.Item key='edit'>
								<Icon type='edit' />
								写博客
							</Menu.Item>
							<SubMenu
								key='sub1'
								title={
									<span>
										<Icon type='mail' />
										<span>博客管理</span>
									</span>
								}
							>
								<Menu.Item key='articleManage'>
									文章管理
								</Menu.Item>
								<Menu.Item key='comment'>评论管理</Menu.Item>
								<Menu.Item key='catalogue'>
									个人分类管理
								</Menu.Item>
							</SubMenu>
						</Menu>
					</Col>
					<Col className={'right'}>
						<RightCom selectedKeys={current} />
					</Col>
				</Row>
			</div>
		);
	}
}
export default AdminHome;
