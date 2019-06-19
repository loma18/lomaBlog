import React, { Component } from 'react';
import Main from 'pages/main';
import Login from 'pages/login';

export default () => {
    let Comp = <Main />;
    const pathname = window.location.pathname.split('/');
    if (pathname[1] == 'login') {
        Comp = <Login />;
    }
    return Comp;
}