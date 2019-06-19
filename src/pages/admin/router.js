import React from 'react';
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { ROUTE_ADMIN_PATH } from 'constants/route';
import Loadable from 'components/Loadable';
import Admin from 'pages/admin';

export default () => {

    return (
        <Switch>
            <Route exact path={ROUTE_ADMIN_PATH.admin} component={Admin} />
            {/* <Redirect from={props.location} to={'/'} /> */}
        </Switch>
    )
}