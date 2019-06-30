import React, { Component } from 'react';
import { Row, Col, Icon, Menu } from 'antd';
import { Router, withRouter, Link } from "react-router-dom";
import { getPathnameByIndex } from 'utils';


@withRouter
class AdminInterfaceView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resData:{},
            current: '',
        }
    }
    handleClick = e => {
        this.setState({
            current: e.key,
        }, () => {
            this.props.history.push('/admin/home/' + e.key);
        });
    };

    setCurrent = () => {
        let leftKey = getPathnameByIndex(3);
        leftKey = leftKey ? leftKey : 'articleManage';
        this.setState({ current: leftKey });
    }

    UNSAFE_componentWillReceiveProps() {
        this.setCurrent();
    }

    fetchData = () => {

    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        const { current, apiList } = this.state;
        return (
            <div className={'adminInterfaceView'}>
            adminInterfaceView
            </div>
        )
    }
}
export default AdminInterfaceView;