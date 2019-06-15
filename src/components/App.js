import React, { Component } from 'react';
import Main from 'pages/main';
import Login from 'pages/login';

export default () => {
    let isLogin = true;
    let Comp = <Login />
    if (isLogin) {
        Comp = <Main />
    }
    return (Comp);
}