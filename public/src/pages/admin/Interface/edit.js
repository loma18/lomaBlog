import React, { Component } from 'react';
import { Row, Col, Icon, Form, Button, Input, InputNumber, Select, Popconfirm, Spin } from 'antd';
import { Router, withRouter, Link } from 'react-router-dom';
import { fireGetRequest, firePostRequest } from 'service/app';
import {
	SAVE_INTERFACE,
	GET_INTERFACE_MODULE_LIST,
	GET_INTERFACE_DETAILE_BY_ID,
	DELETE_INTERFACE_BY_ID
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
			fieldList: [], // 待保存字段列表
			resFieldList: [], // 响应字段列表
			apiGroup: [], // 接口分组列表
			selKey: undefined, // 正在编辑的字段key
			type: undefined, // 记录编辑的是响应字段还是请求字段
			paramType: 'request',
			spinLoading: false
		};
	}

    handleSave = () => {
    	const { fieldList, resFieldList } = this.state;
    	const { selectedKeys, type, fetchData } = this.props;
    	let params = {};
    	this.props.form.validateFieldsAndScroll((err, values) => {
    		if (err) {
    			return;
    		}
    		if (values.moduleType == '-1') {
    			this.props.form.setFields({ moduleType: { errors: [new Error('请选择模块')] } });
    			return;
    		}
    		this.setState({ spinLoading: true });
    		if (type != 'create') {
    			params.id = selectedKeys;
    		}
    		params.fieldList = JSON.stringify(fieldList);
    		params.resFieldList = JSON.stringify(resFieldList);
    		params.paramType = values.paramType;
    		params.methods = values.methods;
    		params.moduleId = values.moduleType;
    		params.routePath = values.routePath;
    		params.title = values.title;
    		firePostRequest(SAVE_INTERFACE, { ...params }).then((res) => {
    			if (res.code === 200) {
    				showSuccessMsg('保存成功');
    				fetchData(); // 重新获取左侧列表
    			} else {
    				openNotification('error', '保存失败', res.msg);
    			}
    			this.setState({ spinLoading: false });
    		})
    			.catch((err) => console.log(err));
    	});
    }

    handleAdd = () => {
    	let { fieldList, resFieldList, paramType } = this.state;
    	let list = paramType == 'request' ? fieldList : resFieldList;
    	const { getFieldsValue } = this.props.form;
    	let values = getFieldsValue(['field', 'remark', 'type', 'require']);
    	let obj = { field: values.field, remark: values.remark, type: values.type, require: values.require };
    	list.unshift(obj);
    	if (paramType == 'request') {
    		this.setState({ fieldList: list }, () => {
    			this.props.form.resetFields(['field', 'remark', 'type', 'require']);
    		});
    	} else {
    		this.setState({ resFieldList: list }, () => {
    			this.props.form.resetFields(['field', 'remark', 'type', 'require']);
    		});
    	}
    }

    onChange = (val) => {
    	this.setState({ countInput: val });
    }

    handleConfirmDel = (key, type) => {
    	let { fieldList, resFieldList } = this.state;
    	if (type == 'req') {
    		fieldList.splice(key, 1);
    		this.setState({ fieldList });
    	} else {
    		resFieldList.splice(key, 1);
    		this.setState({ resFieldList });
    	}
    }

    handleEdit = (key, type) => {
    	this.setState({ selKey: key, type });
    }

    // 取消更改
    handleCancel = () => {
    	this.setState({ selKey: undefined, type: undefined });
    }

    // 确认更改
    handleConfirm = (key, type) => {
    	let { fieldList, resFieldList } = this.state;
    	let list = type == 'req' ? fieldList : resFieldList;
    	const { getFieldsValue } = this.props.form;
    	let values = getFieldsValue(['field_' + key + type, 'remark_' + key + type, 'type_' + key + type, 'require_' + key + type]);
    	list[key] = { field: values['field_' + key + type], remark: values['remark_' + key + type], type: values['type_' + key + type], require: values['require_' + key + type] };
    	if (type == 'req') {
    		this.setState({ fieldList: list, selKey: undefined, type: undefined });
    	} else {
    		this.setState({ resFieldList: list, selKey: undefined, type: undefined });
    	}
    }

    getModuleList = () => {
    	fireGetRequest(GET_INTERFACE_MODULE_LIST).then((res) => {
    		if (res.code === 200) {
    			this.setState({ apiGroup: res.data });
    		} else {
    			openNotification('error', '获取接口模块失败', res.msg);
    		}
    	})
    		.catch((err) => console.log(err));
    }

    // 删除接口
    handleDelete = () => {
    	const { selectedKeys, fetchData } = this.props;
    	this.setState({ spinLoading: true });
    	fireGetRequest(DELETE_INTERFACE_BY_ID, { id: selectedKeys }).then((res) => {
    		if (res.code === 200) {
    			showSuccessMsg('删除成功');
    			fetchData();
    		} else {
    			openNotification('error', '删除失败', res.msg);
    		}
    		this.setState({ spinLoading: false });
    	})
    		.catch((err) => console.log(err));
    }

    onSelect = (val) => {
    	this.setState({ paramType: val });
    }

    getEleList = (type) => {
    	const { getFieldDecorator } = this.props.form;
    	const { selKey, fieldList, resFieldList } = this.state;
    	let list = [];
    	let isEditNow = false;
    	if (type == 'req') {
    		list = fieldList;
    	} else {
    		list = resFieldList;
    	}
    	return list.map((item, key) => {
    		isEditNow = selKey == key && type == this.state.type;
    		return <Row type="flex" gutter={20} className={'columnBody'} key={key}>
    			<Col className={'col20'}>
    				<FormItem label="">
    					{isEditNow ? getFieldDecorator('field_' + key + type, {
    						rules: [{ required: true, message: '请输入字段名!' }],
    						initialValue: item.field
    					})(
    						<Input />
    					) : item.field}
    				</FormItem>
    			</Col>
    			<Col className={'col20'}>
    				<FormItem label="">
    					{isEditNow ? getFieldDecorator('remark_' + key + type, {
    						initialValue: item.remark
    					})(
    						<Input />
    					) : item.remark}
    				</FormItem>
    			</Col>
    			<Col className={'col15'}>
    				<FormItem label="">
    					{isEditNow ? getFieldDecorator('type_' + key + type, {
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
    				<FormItem label="">
    					{isEditNow ? getFieldDecorator('require_' + key + type, {
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
    						{isEditNow ? <Button onClick={() => this.handleConfirm(key, type)}>确认</Button>
    							: <Button onClick={() => this.handleEdit(key, type)}>编辑</Button>}
    					</Col>
    					<Col>
    						{isEditNow ? <Button onClick={this.handleCancel}>取消</Button> : <Popconfirm
	title="是否确认删除?"
	onConfirm={() => this.handleConfirmDel(key, type)}
	okText="是"
	cancelText="否"
    						                                                               >
    							<Button>删除</Button>
    						</Popconfirm>}
    					</Col>
    				</Row>
    			</Col>
    		</Row>;
    	});
    }

    fetchData = () => {
    	this.getModuleList();
    	const { type, selectedKeys } = this.props;
    	if (type == 'create' || selectedKeys == 'create') {
    		return;
    	}
    	let fieldList = [];
    	let resFieldList = [];
    	this.setState({ spinLoading: true });
    	fireGetRequest(GET_INTERFACE_DETAILE_BY_ID, { id: selectedKeys }).then((res) => {
    		if (res.code === 200) {
    			if (res.data.fieldList) {
    				fieldList = JSON.parse(res.data.fieldList);
    			}
    			if (res.data.resFieldList) {
    				resFieldList = JSON.parse(res.data.resFieldList);
    			}
    			this.setState({ resData: res.data, fieldList, resFieldList });
    		} else {
    			openNotification('error', '获取接口信息失败', res.msg);
    		}
    		this.setState({ spinLoading: false });
    	})
    		.catch((err) => console.log(err));
    }

    UNSAFE_componentWillReceiveProps(props) {
    	if (props.selectedKeys != this.props.selectedKeys) {
    		this.setState({ resData: {}, fieldList: [], resFieldList: [] }, () => {
    			this.fetchData();
    		});
    	}
    }

    componentDidMount() {
    	this.fetchData();
    }

    render() {
    	const {
    		apiGroup,
    		fieldList,
    		resFieldList,
    		selKey,
    		resData,
    		spinLoading
    	} = this.state;
    	const { getFieldDecorator, getFieldsValue } = this.props.form;
    	let val = getFieldsValue(['field']);
    	return (
    		<div className={'adminInterfaceEdit'}>
    			<Spin spinning={spinLoading}>
    				<Form>
    					<FormItem label="接口名称" className={'title'}>
    						{getFieldDecorator('title', {
    							rules: [{ required: true, message: '请填写接口名称!' }],
    							initialValue: resData.title || ''
    						})(<Input />)}
    					</FormItem>
    					<FormItem label="参数类型" className={'paramType'}>
    						{getFieldDecorator('paramType', {
    							rules: [{ required: true, message: '请选择参数类型!' }],
    							initialValue: resData.paramType || 'request'
    						})(
    							<Select onSelect={this.onSelect}>
    								<Option value={'request'}>请求参数</Option>
    								<Option value={'response'}>响应参数</Option>
    							</Select>
    						)}
    					</FormItem>
    					<FormItem label="请求方式" className={'methods'}>
    						{getFieldDecorator('methods', {
    							rules: [{ required: true, message: '请选择请求方式!' }],
    							initialValue: resData.methods || 'get'
    						})(
    							<Select >
    								<Option value={'get'}>GET</Option>
    								<Option value={'post'}>POST</Option>
    							</Select>
    						)}
    					</FormItem>
    					<FormItem label="所属模块" className={'moduleType'}>
    						{getFieldDecorator('moduleType', {
    							rules: [{ required: true, message: '请选择所属模块!' }],
    							initialValue: resData.moduleId || '-1'
    						})(
    							<Select >
    								<Option value={'-1'}>选择所属模块</Option>
    								{apiGroup.map((item) => (
    									<Option value={item.id} key={item.id}>{item.title}</Option>
    								))}
    							</Select>
    						)}
    					</FormItem>
    					<FormItem label="请求路径" className={'routePath'}>
    						{getFieldDecorator('routePath', {
    							rules: [{ required: true, message: '请填写请求路径!' }],
    							initialValue: resData.routePath || ''
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
    							<FormItem label="">
    								{getFieldDecorator('field', {
    									initialValue: ''
    								})(
    									<Input />
    								)}
    							</FormItem>
    						</Col>
    						<Col className={'col20'}>
    							<FormItem label="">
    								{getFieldDecorator('remark', {
    									initialValue: ''
    								})(
    									<Input />
    								)}
    							</FormItem>
    						</Col>
    						<Col className={'col15'}>
    							<FormItem label="">
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
    							<FormItem label="">
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
    							<Button onClick={this.handleAdd} disabled={!val.field}>新增</Button>
    						</Col>
    					</Row>
    					<Row className={'paramsTitle'}>请求参数</Row>
    					{
    						this.getEleList('req')
    					}
    					<Row className={'paramsTitle'}>响应参数</Row>
    					{
    						this.getEleList('res')
    					}
    				</Form>
    			</Spin>
    			<Row type="flex" gutter={20} className={'columnFooter'} justify="center">
    				<Col><Button onClick={this.handleSave}>保存</Button></Col>
    				<Col>
    					<Popconfirm
	title="是否确认删除?"
	onConfirm={this.handleDelete}
	okText="是"
	cancelText="否"
    					>
    						<Button>删除接口</Button>
    					</Popconfirm>
    				</Col>
    			</Row>
    		</div>
    	);
    }
}
export default AdminInterfaceEdit;