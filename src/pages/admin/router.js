import React from 'react';
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { ROUTE_ADMIN_PATH } from 'constants/route';
import Loadable from 'components/Loadable';
import Admin from 'pages/admin';

export default () => {

    return (
        <div id={'admin'}>
            <Switch>
                <Route exact path={ROUTE_ADMIN_PATH.admin} component={Admin} />
                <Route path={ROUTE_ADMIN_PATH.adminHomeModule} component={Admin} />
                {/* <Redirect from={props.location} to={'/'} /> */}
            </Switch>
        </div>
    )
}