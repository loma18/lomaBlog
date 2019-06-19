import React, { Component } from 'react';
import { Row, Col, Calendar, Select, Radio, Menu } from 'antd';
import { Router, withRouter, Link } from "react-router-dom";
import { USER_INFO } from 'constants/user';
import './style.less';

// @withRouter 
class AdminHome extends Component {
    constructor(props) {
        super(props);
    }

    checkLogin = ()=>{
        let isLogin = window.localStorage.getItem(USER_INFO.IS_LOGIN);
        if(!isLogin){
            window.location.href = '/login';
        }
    }

    componentDidMount(){
        this.checkLogin();
    }

    render() {
        let articleList = [
            { typeName: '原创', count: 5, typeKey: 'original' },
            { typeName: '转载', count: 3, typeKey: 'reprint' },
            { typeName: '代码', count: 6, typeKey: 'code' },
        ]
        return (
            <div id={'lomaBlog-home'}>
                <h3>文章分类</h3>
                <Menu mode="vertical">
                    {
                        articleList.map(item => {
                            return (
                                <Menu.Item key={item.typeKey}>
                                    <Link to={'/' + item.typeKey}>
                                        {item.typeName}
                                        <span>{item.count}</span>
                                    </Link>
                                </Menu.Item>
                            )
                        })
                    }
                </Menu>
            </div>
        )
    }
}
export default AdminHome;