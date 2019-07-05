import React, { Component } from 'react';
import LoginForm from 'components/common/LoginForm';
import './style.less';

class Login extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div id={'lomaBlog-Login'}>
				<LoginForm />
			</div>
		);
	}
}
export default Login;
