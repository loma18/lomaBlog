import React, { Component } from 'react';
import Main from 'pages/main';
import Login from 'pages/login';
import GlobalLoading from 'components/common/GlobalSpinning';
import { USER_INFO } from 'constants/user';

export default () => {
	let isLogin = window.localStorage.getItem(USER_INFO.IS_LOGIN);
	let Comp = <Main />;
	const pathname = window.location.pathname.split('/');
	if (!isLogin && pathname[1] == 'admin') {
		setTimeout(function() {
			window.location.href = '/login';
		}, 500);
	}
	if (pathname[1] == 'login') {
		Comp = <Login />;
	}
	return (
		<div>
			<GlobalLoading />
			{Comp}
		</div>
	);
};
