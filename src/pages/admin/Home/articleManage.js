import React, { Component } from 'react';
import { Row, Col, Icon, Menu, Select } from 'antd';
import { Router, withRouter, Link } from "react-router-dom";
import DateSelect from 'components/Admin/DateSelect';
import { getPathnameByIndex } from 'utils';


@withRouter
class AdminHomeArticleManage extends Component {
    constructor(props) {
        super(props);
        let key = getPathnameByIndex(4);
        this.state = {
            current: key || 'all'
        }
    }

    handleClick = ({ item, key, keyPath, domEvent }) => {
        this.setState({ current: key }, () => {
            this.props.history.push('/admin/home/articleManage/' + key);
        });
    }

    setCurrent = () => {
        let key = getPathnameByIndex(4);
        key = key ? key : 'all';
        this.setState({ current: key });
    }

    UNSAFE_componentWillReceiveProps() {
        this.setCurrent();
    }

    componentDidMount() {

    }

    render() {
        const { current } = this.state;
        let articleTypeList = [
            {}
        ]
        return (
            <div className={'adminHomeArticleManage'}>
                <Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal" theme={'dark'}>
                    <Menu.Item key="all">
                        全部
                    </Menu.Item>
                    <Menu.Item key="draft">
                        草稿
                    </Menu.Item>
                </Menu>
                <Row type="flex">
                    <Col>筛选：</Col>
                    <Col><DateSelect /></Col>
                    <Col>
                        <Select>

                        </Select>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default AdminHomeArticleManage;