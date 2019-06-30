import React, { Component } from 'react';
import { Row, Col, Icon, Form, Button, Input, InputNumber, Select, Popconfirm } from 'antd';
import { Router, withRouter, Link } from "react-router-dom";
import { fireGetRequest, firePostRequest } from 'service/app';
import {
    SAVE_INTERFACE,
    GET_INTERFACE_MODULE_LIST
} from 'constants/api';
import { openNotification, showSuccessMsg, GetQueryString } from 'utils';
import { getPathnameByIndex } from 'utils';

const FormItem = Form.Item;
const form = Form.create();
const { Option } = Select;

@withRouter
@form
class AdminInterfaceEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resData: {},
            fieldList: [], //待保存字段列表
            apiGroup: [], //接口分组列表
            selKey: undefined //正在编辑的字段key
        }
    }

    handleSave = () => {
        const { fieldList } = this.state;
        const { selectedKeys, type } = this.props;
        let params = {};
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            if (values.moduleType == '-1') {
                this.props.form.setFields({ moduleType: { errors: [new Error('请选择模块')] } });
                return;
            }
            if (type != 'create') {
                params.id = selectedKeys;
            }
            params.fieldList = JSON.stringify(fieldList);
            params.paramType = values.paramType;
            params.methods = values.methods;
            params.moduleId = values.moduleType;
            params.routePath = values.routePath;
            params.title = values.title;
            firePostRequest(SAVE_INTERFACE, { ...params }).then(res => {
                if (res.code === 200) {
                    showSuccessMsg('保存成功');
                } else {
                    openNotification('error', '保存失败', res.msg);
                }
            }).catch(err => console.log(err))
        })
    }

    handleAdd = () => {
        let { fieldList } = this.state;
        const { getFieldsValue } = this.props.form;
        let values = getFieldsValue(['field', 'remark', 'type', 'require']),
            obj = { field: values.field, remark: values.remark, type: values.type, require: values.require };
        fieldList.unshift(obj);
        this.setState({ fieldList }, () => {
            this.props.form.resetFields(['field', 'remark', 'type', 'require']);
        });
    }

    onChange = (val) => {
        this.setState({ countInput: val })
    }

    handleConfirmDel = (key) => {
        let { fieldList } = this.state;
        fieldList.splice(key, 1);
        this.setState({ fieldList });
    }

    handleEdit = (key) => {
        this.setState({ selKey: key });
    }

    //取消更改
    handleCancel = () => {
        this.setState({ selKey: undefined });
    }

    //确认更改
    handleConfirm = (key) => {
        let { fieldList } = this.state;
        const { getFieldsValue } = this.props.form;
        let values = getFieldsValue(['field_' + key, 'remark_' + key, 'type_' + key, 'require_' + key]);
        fieldList[key] = { field: values['field_' + key], remark: values['remark_' + key], type: values['type_' + key], require: values['require_' + key] }
        this.setState({ fieldList, selKey: undefined });
    }

    getModuleList = () => {
        fireGetRequest(GET_INTERFACE_MODULE_LIST).then(res => {
            if (res.code === 200) {
                this.setState({ apiGroup: res.data });
            } else {
                openNotification('error', '获取接口模块失败', res.msg);
            }
        }).catch(err => console.log(err))
    }

    fetchData = () => {
        this.getModuleList();
        const { type } = this.props;
        if (type == 'create') {
            return;
        }
        // fireGetRequest()
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        const {
            apiGroup,
            fieldList,
            selKey
        } = this.state;
        const { type } = this.props;
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        let val = getFieldsValue(['field']);
        return (
            <div className={'adminInterfaceEdit'}>
                <Form>
                    <FormItem label='接口名称' className={'title'}>
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '请填写接口名称!' }],
                            initialValue: ''
                        })(<Input />)}
                    </FormItem>
                    <FormItem label='参数类型' className={'paramType'}>
                        {getFieldDecorator('paramType', {
                            rules: [{ required: true, message: '请选择参数类型!' }],
                            initialValue: 'request'
                        })(
                            <Select >
                                <Option value={'request'}>请求参数</Option>
                                <Option value={'response'}>响应参数</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label='请求方式' className={'methods'}>
                        {getFieldDecorator('methods', {
                            rules: [{ required: true, message: '请选择请求方式!' }],
                            initialValue: 'get'
                        })(
                            <Select >
                                <Option value={'get'}>GET</Option>
                                <Option value={'post'}>POST</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label='所属模块' className={'moduleType'}>
                        {getFieldDecorator('moduleType', {
                            rules: [{ required: true, message: '请选择所属模块!' }],
                            initialValue: '-1'
                        })(
                            <Select >
                                <Option value={'-1'}>选择所属模块</Option>
                                {apiGroup.map(item => {
                                    return (
                                        <Option value={item.id} key={item.id}>{item.title}</Option>
                                    )
                                })}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label='请求路径' className={'routePath'}>
                        {getFieldDecorator('routePath', {
                            rules: [{ required: true, message: '请填写请求路径!' }],
                            initialValue: ''
                        })(<Input />)}
                    </FormItem>
                    <Row type="flex" gutter={20} className={'columnHeader'}>
                        <Col className={'col20'}>字段名</Col>
                        <Col className={'col20'}>备注</Col>
                        <Col className={'col15'}>字段类型</Col>
                        <Col className={'col10'}>是否必需</Col>
                        <Col className={'col35'}>操作</Col>
                    </Row>
                    <Row type="flex" gutter={20} className={'columnBody'}>
                        <Col className={'col20'}>
                            <FormItem label=''>
                                {getFieldDecorator('field', {
                                    initialValue: ''
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col className={'col20'}>
                            <FormItem label=''>
                                {getFieldDecorator('remark', {
                                    initialValue: ''
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col className={'col15'}>
                            <FormItem label=''>
                                {getFieldDecorator('type', {
                                    initialValue: 'string'
                                })(
                                    <Select >
                                        <Option value={'string'}>string</Option>
                                        <Option value={'number'}>number</Option>
                                        <Option value={'array'}>array</Option>
                                        <Option value={'date'}>date</Option>
                                        <Option value={'timestamp'}>timestamp</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col className={'col10'}>
                            <FormItem label=''>
                                {getFieldDecorator('require', {
                                    initialValue: 0
                                })(
                                    <Select >
                                        <Option value={1}>是</Option>
                                        <Option value={0}>否</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col className={'col35'}>
                            <Button onClick={this.handleAdd} disabled={val.field ? false : true}>新增</Button>
                        </Col>
                    </Row>
                    {
                        fieldList.map((item, key) => {
                            return <Row type="flex" gutter={20} className={'columnBody'} key={key}>
                                <Col className={'col20'}>
                                    <FormItem label=''>
                                        {selKey == key ? getFieldDecorator('field_' + key, {
                                            rules: [{ required: true, message: '请输入字段名!' }],
                                            initialValue: item.field
                                        })(
                                            <Input />
                                        ) : item.field}
                                    </FormItem>
                                </Col>
                                <Col className={'col20'}>
                                    <FormItem label=''>
                                        {selKey == key ? getFieldDecorator('remark_' + key, {
                                            initialValue: item.remark
                                        })(
                                            <Input />
                                        ) : item.remark}
                                    </FormItem>
                                </Col>
                                <Col className={'col15'}>
                                    <FormItem label=''>
                                        {selKey == key ? getFieldDecorator('type_' + key, {
                                            rules: [{ required: true, message: '请选择字段类型!' }],
                                            initialValue: item.type
                                        })(
                                            <Select >
                                                <Option value={'string'}>string</Option>
                                                <Option value={'number'}>number</Option>
                                                <Option value={'array'}>array</Option>
                                                <Option value={'date'}>date</Option>
                                                <Option value={'timestamp'}>timestamp</Option>
                                            </Select>
                                        ) : item.type}
                                    </FormItem>
                                </Col>
                                <Col className={'col10'}>
                                    <FormItem label=''>
                                        {selKey == key ? getFieldDecorator('require_' + key, {
                                            rules: [{ required: true, message: '请选择是否字段必须!' }],
                                            initialValue: item.require
                                        })(
                                            <Select >
                                                <Option value={1}>是</Option>
                                                <Option value={0}>否</Option>
                                            </Select>
                                        ) : (item.require == 1 ? '是' : '否')}
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
                        })
                    }
                </Form>
                <Row type="flex" gutter={20} className={'columnFooter'} justify="center">
                    <Col><Button onClick={this.handleSave}>保存</Button></Col>
                </Row>
            </div>
        )
    }
}
export default AdminInterfaceEdit;