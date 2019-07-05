import React, { Component } from 'react';
import { Router, Route, Switch, Redirect, withRouter } from "react-router-dom";
import { BackTop } from 'antd';
import Header from 'components/Header';
import Footer from 'components/Footer';
import LomaBreadcrumb from 'components/common/Breadcrumb';
import Routers from 'pages/router';
import LomaAudio from 'components/common/Audio';
import { changeTheme } from 'utils/functions';
import './style.less';

class Main extends Component {
    constructor(props) {
        super(props);
        let isAdmin = window.location.pathname.split('/')[1] == 'admin';
        if (isAdmin) {
            changeTheme('dark');
        } else {
            changeTheme('light');
        }
        this.state = {
            stage: isAdmin ? 'backStage' : 'frontStage' //前后台是否发生切换
        }
    }

    getMenuList = () => {
        let pathname = window.location.pathname.split('/');
        let list = [
            { title: '首页', key: 'home' },
            { title: '微语', key: 'whisper' },
        ]
        if (pathname[1] == 'admin') {
            list = [
                { title: '首页', key: 'admin' },
                { title: '个人中心', key: 'mine' },
                { title: '后台接口', key: 'interface' },
                { title: '其他', key: 'others' },
            ]
        }
        return list;
    }

    changeStage = (stage) => {
        this.setState({ stage });
    }

    render() {
        let menuList = this.getMenuList();
        return (<div id={'lomaBlog-main'}>
            <div className={'lomaBlog-header'}>
                <Header menuList={menuList} changeStage={this.changeStage} />
                <LomaBreadcrumb />
            </div>
            <div className={'lomaBlog-body'}>
                <Routers />
            </div>
            <Footer />
            <BackTop />
            <LomaAudio />
        </div>)
    }
}
export default Main;