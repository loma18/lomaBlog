import React, { Component } from 'react';
import { Row, Col, Menu, Input, Button } from 'antd';
import { Router, withRouter, Link } from "react-router-dom";
import { ROUTE_ADMIN_PATH } from 'constants/route';
import { USER_INFO } from 'constants/user';
import './style.less';

const Search = Input.Search;

@withRouter
class Header extends Component {
    constructor(props) {
        super(props);
    }

    //进入后台
    handleClick = () => {
        let isLogin = window.localStorage.getItem(USER_INFO.IS_LOGIN);
        if (!isLogin) {
            window.location.href = '/login';
        } else {
            this.props.history.push('/admin');
        }
    }

    handleSearch = (value) => {
        console.log(value);
    }

    getDefaultSelKey = () => {
        let pathname = window.location.pathname.split('/');
        switch (pathname[1]) {
            case 'home':
            case 'original':
            case 'reprint':
            case 'code':
                return ['home'];
            case 'whisper':
                return ['whisper'];
            default:
                return ['home'];
        }
    }

    render() {
        const { menuList } = this.props;
        return (
            <div id={'lomaBlog-header'}>
                <Row type="flex" justify="space-between" gutter={20} className={'nav'}>
                    <Col className={'header-logo'}>
                        <img src={require('assets/logo.jpg')} />
                    </Col>
                    <Col className={'header-menu'}>
                        <Menu mode="horizontal" defaultSelectedKeys={this.getDefaultSelKey()}>
                            {
                                menuList.map(item => {
                                    return (
                                        <Menu.Item key={item.key}>
                                            <Link to={'/' + item.key}> {item.title}</Link>
                                        </Menu.Item>
                                    )
                                })
                            }
                        </Menu>
                    </Col>
                    <Col>
                        <Button onClick={this.handleClick}>
                            后台管理
                        </Button>
                    </Col>
                    <Col className={'header-right'}>
                        <Search
                            placeholder="search..."
                            onSearch={this.handleSearch}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}
export default Header;