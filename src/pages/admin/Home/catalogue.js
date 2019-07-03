import React, { Component } from 'react';
import { Row, Col, Icon, Form, Button, Input, Popconfirm } from 'antd';
import { Router, withRouter, Link } from "react-router-dom";
import { fireGetRequest, firePostRequest } from 'service/app';
import {
    GET_CATALOGUE_LIST,
    SAVE_CATALOGUE,
    DELETE_CATALOGUE
} from 'constants/api';
import { openNotification, showSuccessMsg, GetQueryString } from 'utils';

const FormItem = Form.Item;
const form = Form.create();

@withRouter
@form
class AdminHomeCatalogue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            catalogueList: [], //个人分类列表
            selKey: undefined
        }
    }

    onChange = (val) => {
        this.setState({ countInput: val })
    }

    //新增模块
    handleAdd = (id, key) => {
        const { resetFields } = this.props.form;
        let params = {};
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            params.id = id;
            params.name = id ? values['module_' + key] : values.moduleType;
            firePostRequest(SAVE_CATALOGUE, { ...params }).then(res => {
                if (res.code === 200) {
                    showSuccessMsg('保存个人分类成功');
                    if (!id) {
                        resetFields();
                        this.fetchData();
                    } else {
                        this.setState({ selKey: undefined });
                    }
                } else {
                    openNotification('error', '保存模块失败', res.msg);
                }
            }).catch(err => console.log(err))
        })
    }

    handleEdit = (key) => {
        this.setState({ selKey: key });
    }

    //确认更改
    handleConfirm = (key) => {
        let { catalogueList } = this.state;
        const { getFieldsValue } = this.props.form;
        let values = getFieldsValue(['module_' + key]);
        catalogueList[key]['name'] = values['module_' + key];
        this.setState({ catalogueList }, () => {
            this.handleAdd(catalogueList[key].id, key);
        });
    }

    //删除模块
    handleConfirmDel = (key) => {
        let { catalogueList } = this.state;
        fireGetRequest(DELETE_CATALOGUE, { id: catalogueList[key].id }).then(res => {
            if (res.code === 200) {
                showSuccessMsg('删除成功');
                this.fetchData();
            } else {
                openNotification('error', '删除失败', res.msg);
            }
        }).catch(err => console.log(err))
    }

    //取消更改
    handleCancel = () => {
        this.setState({ selKey: undefined });
    }

    fetchData = () => {
        fireGetRequest(GET_CATALOGUE_LIST).then(res => {
            if (res.code === 200) {
                this.setState({ catalogueList: res.data, selKey: undefined });
            } else {
                openNotification('error', '获取接口模块失败', res.msg);
            }
        }).catch(err => console.log(err))
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        const { catalogueList, selKey } = this.state;
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        let val = getFieldsValue(['moduleType']);
        return (
            <div className={'adminHomeCatalogue'}>
                <Form>
                    <Row type="flex" gutter={20} className={'columnHeader'}>
                        <Col className={'col40'}>模块名称</Col>
                        <Col className={'col35'}>操作</Col>
                    </Row>
                    <Row type="flex" gutter={20} className={'columnBody'}>
                        <Col className={'col40'}>
                            <FormItem label='' className={'moduleType'}>
                                {getFieldDecorator('moduleType', {
                                    initialValue: ''
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col className={'col35'}>
                            <Button onClick={() => this.handleAdd()} disabled={!val.moduleType ? true : false}>新增</Button>
                        </Col>
                    </Row>
                    {catalogueList.map((item, key) => {
                        return <Row type="flex" gutter={20} className={'columnBody'} key={key}>
                            <Col className={'col40'}>
                                <FormItem label=''>
                                    {selKey == key ? getFieldDecorator('module_' + key, {
                                        rules: [{ required: true, message: '请输入个人分类名称!' }],
                                        initialValue: item.name
                                    })(
                                        <Input />
                                    ) : item.name}
                                </FormItem>
                            </Col>
                            <Col className={'col35'}>
                                <Row type="flex">
                                    <Col>
                                        {selKey == key ? <Button onClick={() => this.handleConfirm(key)}>确认</Button> :
                                            <Button onClick={() => this.handleEdit(key)}>编辑</Button>}
                                    </Col>
                                    <Col>
                                        {selKey == key ? <Button onClick={this.handleCancel}>取消</Button> : <Popconfirm
                                            title="是否确认删除?"
                                            onConfirm={() => this.handleConfirmDel(key)}
                                            okText="是"
                                            cancelText="否"
                                        >
                                            <Button>删除</Button>
                                        </Popconfirm>}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    })}
                </Form>
            </div >
        )
    }
}
export default AdminHomeCatalogue;