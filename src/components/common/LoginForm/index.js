import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Icon, notification } from 'antd';
import { USER_INFO } from 'constants/user';
import './style.less';

const FormItem = Form.Item;
const form = Form.create();

@form
class LoginForm extends Component {
    constructor(props) {
        super(props);
    }

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            if (values.username == 'Loma' && values.password == 'xiange18') {
                window.localStorage.setItem(USER_INFO.IS_LOGIN, true);
                window.location.href = '/admin';
            } else {
                notification.open({
                    message: 'error',
                    description: '登陆名或密码不正确，请重新输入'
                });
            }
        });
    };

    componentDidMount(){
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Row className={'loginForm'} type="flex" justify="center">
                <Col>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入名字!' }],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Username"
                                />,
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
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
        )
    }
}
export default LoginForm;