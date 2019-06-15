import React from 'react';
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { ROUTE_PATH } from 'constants/route';
import Loadable from 'components/Loadable';
import Home from 'pages/home/home';
import AticleList from 'pages/home/articleList';
import HomeDetail from 'pages/home/detail';

export default () => {

    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path={ROUTE_PATH.home} component={Home} />
            <Route path={ROUTE_PATH.typeList} component={AticleList} />
            <Route path={ROUTE_PATH.homeDetail} component={HomeDetail} />
            {/* <Redirect from={props.location} to={'/'} /> */}
        </Switch>
    )
}