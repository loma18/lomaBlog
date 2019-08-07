import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { ROUTE_PATH } from 'constants/route';
import Loadable from 'components/Loadable';
import Home from 'pages/home/home';
import AticleList from 'pages/home/articleList';
import HomeDetail from 'pages/home/detail';

export default (props) => (
	<Switch>
		<Route exact path="/" render={(propss) => <Home {...propss} bindChild={props.bindChild} />} />
		<Route exact path={ROUTE_PATH.home} render={(propss) => <Home {...propss} bindChild={props.bindChild} />} />}/>
		<Route path={ROUTE_PATH.original} render={(propss) => <Home {...propss} bindChild={props.bindChild} />} />
		<Route path={ROUTE_PATH.reprint} render={(propss) => <Home {...propss} bindChild={props.bindChild} />} />
		<Route path={ROUTE_PATH.code} render={(propss) => <Home {...propss} bindChild={props.bindChild} />} />
		<Route path={ROUTE_PATH.homeDetail} component={HomeDetail} />
		{/* <Redirect from={props.location} to={'/'} /> */}
	</Switch>
);
