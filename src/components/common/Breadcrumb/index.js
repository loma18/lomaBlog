import React, { Component } from 'react';
import { Router, withRouter, Link } from "react-router-dom";
import { Breadcrumb } from 'antd';
import { breadcrumbItem } from 'constants';
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
            case 'original':
                routes.push({
                    path: '/' + pathname[1],
                    breadcrumbName: breadcrumbItem[pathname[1]].title
                })
                break;
            case 'reprint':
                routes.push({
                    path: '/' + pathname[1],
                    breadcrumbName: breadcrumbItem[pathname[1]].title
                })
                break;
            case 'code':
                routes.push({
                    path: '/' + pathname[1],
                    breadcrumbName: breadcrumbItem[pathname[1]].title
                })
                break;
            case 'admin':
                if (!pathname[2]) {
                    routes.push({
                        path: '/' + pathname[1],
                        breadcrumbName: breadcrumbItem[pathname[1]].title
                    })
                } else {
                    routes.push({
                        path: '/' + pathname[1] + '/' + pathname[2],
                        breadcrumbName: breadcrumbItem[pathname[2]].title
                    })
                }
                break;
            default:
                routes.push({ path: '/' + pathname[1], breadcrumbName: '首页' });
        }

        return routes;
    }

    itemRender = (route, params, routes, paths) => {
        const last = routes.indexOf(route) === routes.length - 1;
        return last || !route.path ? (
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