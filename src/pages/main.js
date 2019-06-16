import React, { Component } from 'react';
import { Router, Route, Switch, Redirect, withRouter } from "react-router-dom";
import { BackTop } from 'antd';
import Header from 'components/Header';
import Footer from 'components/Footer';
import LomaBreadcrumb from 'components/common/Breadcrumb';
import Routers from 'pages/router';
import LomaAudio from 'components/common/Audio';
import './style.less';

class Main extends Component {
    constructor(props) {
        super(props);
    }

    getMenuList = () => {
        let list = [
            { title: '首页', key: 'home' },
            { title: '微语', key: 'whisper' },
        ]
        return list;
    }

    render() {
        let menuList = this.getMenuList();
        return (<div id={'lomaBlog-main'}>
            <div className={'lomaBlog-header'}>
                <Header menuList={menuList} />
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