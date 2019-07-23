import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { ROUTE_PATH, ROUTE_ADMIN_PATH } from 'constants/route';
import Loadable from 'components/Loadable';
import Home from 'pages/home';
import Whisper from 'pages/whisper';
import AdminRouter from 'pages/admin/router';

export default () => (
	<Switch>
		<Route exact path="/" component={Home} />
		<Route path={ROUTE_PATH.home} component={Home} />
		<Route path={ROUTE_PATH.original} component={Home} />
		<Route path={ROUTE_PATH.reprint} component={Home} />
		<Route path={ROUTE_PATH.code} component={Home} />
		<Route path={ROUTE_PATH.whisper} component={Whisper} />
		<Route path={ROUTE_ADMIN_PATH.admin} component={AdminRouter} />
		{/* <Redirect from={props.location} to={'/'} /> */}
	</Switch>
);
