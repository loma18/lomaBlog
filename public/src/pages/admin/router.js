import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { ROUTE_ADMIN_PATH } from 'constants/route';
import Loadable from 'components/Loadable';
import Admin from 'pages/admin';
import Interface from 'pages/admin/Interface';

export default () => (
	<div id={'admin'}>
		<Switch>
			<Route exact path={ROUTE_ADMIN_PATH.admin} component={Admin} />
			<Route path={ROUTE_ADMIN_PATH.adminHomeModule} component={Admin} />
			<Route path={ROUTE_ADMIN_PATH.interface} component={Interface} />
			{/* <Redirect from={props.location} to={'/'} /> */}
		</Switch>
	</div>
);
