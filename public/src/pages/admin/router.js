import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { ROUTE_ADMIN_PATH } from 'constants/route';
import Loadable from 'components/Loadable';
const Admin = Loadable(() => import('pages/admin'));
const Interface = Loadable(() => import('pages/admin/Interface'));
const Whisper = Loadable(() => import('pages/whisper'));

export default () => (
	<div id={'admin'}>
		<Switch>
			<Route exact path={ROUTE_ADMIN_PATH.admin} component={Admin} />
			<Route path={ROUTE_ADMIN_PATH.adminHomeModule} component={Admin} />
			<Route path={ROUTE_ADMIN_PATH.interface} component={Interface} />
			<Route path={ROUTE_ADMIN_PATH.whisper} component={Whisper} />
			{/* <Redirect from={props.location} to={'/'} /> */}
		</Switch>
	</div>
);
