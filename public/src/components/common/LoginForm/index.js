import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Icon, notification } from 'antd';
import { USER_INFO } from 'constants/user';
import { inject, observer } from 'mobx-react';
import { showSuccessMsg } from 'utils';
import { firePostRequest } from 'service/app';
import { USER_LOGIN } from 'constants/api';
import './style.less';

const FormItem = Form.Item;
const form = Form.create();

@inject('appStore')
@form
@observer
class LoginForm extends Component {
	constructor(props) {
		super(props);
	}

    handleSubmit = () => {
    	const { loginSubmit, loading } = this.props.appStore;
    	this.props.form.validateFields((err, values) => {
    		if (err) {
    			return;
    		}
    		firePostRequest(USER_LOGIN, {
    			uname: values.username,
    			upwd: values.password
    		}).then(function (res) {
    			if (res.code === 200) {
    				showSuccessMsg(res.msg);
    				window.localStorage.setItem(USER_INFO.IS_LOGIN, true);
    				window.location.href = '/admin';
    				// loginSubmit(res.)
    			} else {
    				notification.open({
    					message: 'error',
    					description: '登陆名或密码不正确，请重新输入'
    				});
    			}
    		})
    			.catch(function (error) {
    			console.log(error);
    		});
    		// if (values.username == 'Loma' && values.password == 'xiange18') {
    		//     window.localStorage.setItem(USER_INFO.IS_LOGIN, true);
    		//     window.location.href = '/admin';
    		// } else {
    		//     notification.open({
    		//         message: 'error',
    		//         description: '登陆名或密码不正确，请重新输入'
    		//     });
    		// }
    	});
    };

    componentDidMount() {
    }

    render() {
    	const { getFieldDecorator } = this.props.form;
    	return (
    		<Row className={'loginForm'} type="flex" justify="center">
    			<Col>
    				<Form onSubmit={this.handleSubmit} className="login-form">
    					<FormItem>
    						{getFieldDecorator('username', {
    							rules: [{ required: true, message: '请输入名字!' }]
    						})(
    							<Input
	prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
	placeholder="Username"
    							/>,
    						)}
    					</FormItem>
    					<FormItem>
    						{getFieldDecorator('password', {
    							rules: [{ required: true, message: '请输入密码!' }]
    						})(
    							<Input
	prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
	type="password"
	placeholder="Password"
    							/>,
    						)}
    					</FormItem>
    					<Button type="primary" onClick={this.handleSubmit} className="login-form-button">
                            登陆
    					</Button>
    				</Form>
    			</Col>
    		</Row>
    	);
    }
}
export default LoginForm;