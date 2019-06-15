import React, { Component } from 'react';
import { Router, withRouter, Link } from "react-router-dom";
import { Breadcrumb } from 'antd';
import './style.less';

@withRouter
class LomaBreadcrumb extends Component {
    constructor(props) {
        super(props);
    }

    getRoutes = () => {
        let pathname = this.props.location.pathname.split('/');
        let routes = [{ path: '', breadcrumbName: '当前位置' }];
        switch (pathname[1]) {
            case 'home':
                routes.push({ path: '/' + pathname[1], breadcrumbName: '首页' });
                break;
            case 'whisper':
                routes.push({ path: '/' + pathname[1], breadcrumbName: '微语' });
                break;
            default:
                routes.push({ path: '/' + pathname[1], breadcrumbName: '首页' });
        }

        return routes;
    }

    itemRender = (route, params, routes, paths) => {
        const last = routes.indexOf(route) === routes.length - 1;
        return last ? (
            <span>{route.breadcrumbName}</span>
        ) : (
                <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
            );
    }

    render() {
        let routes = this.getRoutes();
        return (<div id={'lomaBlog-breadcrumb'}>
            <Breadcrumb itemRender={this.itemRender} routes={routes} />
        </div>)
    }
}
export default LomaBreadcrumb;