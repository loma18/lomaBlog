import React, { Component } from 'react';
import { Router, Route, Switch, Redirect, withRouter } from "react-router-dom";
import Header from 'components/Header';
import LomaBreadcrumb from 'components/common/Breadcrumb'; 
import Routers from 'pages/router';
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
            <Header menuList={menuList} />
            <LomaBreadcrumb />
            <div className={'lomaBlog-body'}>
                <Routers />
            </div>
        </div>)
    }
}
export default Main;