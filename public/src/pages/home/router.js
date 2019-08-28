import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { ROUTE_PATH } from 'constants/route';
import Loadable from 'components/Loadable';
const Home = Loadable(() => import('pages/home/home'));
const HomeDetail = Loadable(() => import('pages/home/detail'));

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
