import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { ROUTE_PATH, ROUTE_ADMIN_PATH } from 'constants/route';
import Loadable from 'components/Loadable';
import Home from 'pages/home';
import Whisper from 'pages/whisper';
import AdminRouter from 'pages/admin/router';

export default (props) => (
	<Switch>
		<Route exact path="/" render={(propss) => <Home {...propss} bindChild={props.bindChild} />} />
		<Route path={ROUTE_PATH.home} render={(propss) => <Home {...propss} bindChild={props.bindChild} />} />
		<Route path={ROUTE_PATH.original} render={(propss) => <Home {...propss} bindChild={props.bindChild} />} />
		<Route path={ROUTE_PATH.reprint} render={(propss) => <Home {...propss} bindChild={props.bindChild} />} />
		<Route path={ROUTE_PATH.code} render={(propss) => <Home {...propss} bindChild={props.bindChild} />} />
		<Route path={ROUTE_PATH.whisper} component={Whisper} />
		<Route path={ROUTE_ADMIN_PATH.admin} component={AdminRouter} />
		{/* <Redirect from={props.location} to={'/'} /> */}
	</Switch>
);
