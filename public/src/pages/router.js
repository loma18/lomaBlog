import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { ROUTE_PATH, ROUTE_ADMIN_PATH } from 'constants/route';
import Loadable from 'components/Loadable';
const Home = Loadable(() => import('pages/home'));
const Whisper = Loadable(() => import('pages/whisper'));
const AdminRouter = Loadable(() => import('pages/admin/router'));
const ErrorPage = Loadable(() => import('components/common/404'));

export default props => (
	<Switch>
		<Route
			exact
			path='/'
			render={propss => <Home {...propss} bindChild={props.bindChild} />}
		/>
		<Route
			path={ROUTE_PATH.home}
			render={propss => <Home {...propss} bindChild={props.bindChild} />}
		/>
		<Route
			path={ROUTE_PATH.original}
			render={propss => <Home {...propss} bindChild={props.bindChild} />}
		/>
		<Route
			path={ROUTE_PATH.reprint}
			render={propss => <Home {...propss} bindChild={props.bindChild} />}
		/>
		<Route
			path={ROUTE_PATH.code}
			render={propss => <Home {...propss} bindChild={props.bindChild} />}
		/>
		<Route
			path={ROUTE_PATH.whisper}
			render={propss => (
				<Whisper {...propss} bindChild={props.bindChild} />
			)}
		/>
		<Route
			path={ROUTE_PATH.laugh}
			render={propss => (
				<Whisper {...propss} bindChild={props.bindChild} />
			)}
		/>
		<Route path={ROUTE_ADMIN_PATH.admin} component={AdminRouter} />
		<Route component={ErrorPage} />
		{/* <Redirect from={props.location} to={'/'} /> */}
	</Switch>
);
