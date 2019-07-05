import React, { Component } from 'react';
import { Descriptions, Table, Spin } from 'antd';
import { fireGetRequest } from 'service/app';
import { GET_INTERFACE_DETAILE_BY_ID } from 'constants/api';
import { openNotification } from 'utils';


class AdminInterfaceView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			resData:{ fieldList:[], resFieldList:[] },
			spinLoading:false
		};
	}

    columns = [
    	{
    		title:'字段名',
    		dataIndex:'field'
    	},
    	{
    		title:'备注',
    		dataIndex:'remark'
    	},
    	{
    		title:'类型',
    		dataIndex:'type'
    	},
    	{
    		title:'是否必须',
    		dataIndex:'require',
    		render:(txt) => txt === 0 ? '否' : '是'
    	}
    ]

    UNSAFE_componentWillReceiveProps(props) {
    	this.fetchData(props.selectedKeys);
    }

    fetchData = (selectedKey) => {
    	let selectedKeys = selectedKey ? selectedKey : this.props.selectedKeys;
    	this.setState({ spinLoading:true });
    	fireGetRequest(GET_INTERFACE_DETAILE_BY_ID, { id:selectedKeys }).then((res) => {
    		if (res.code === 200) {
    			if (res.data.fieldList) {
    				res.data.fieldList = JSON.parse(res.data.fieldList).map((item, key) => {
    					item.key = key;
    					return item;
    				});
    			}
    			if (res.data.resFieldList) {
    				res.data.resFieldList = JSON.parse(res.data.resFieldList).map((item, key) => {
    					item.key = key;
    					return item;
    				});
    			}
    			this.setState({ resData:res.data });
    		} else {
    			openNotification('error', '获取接口信息失败', res.message);
    		}
    		this.setState({ spinLoading:false });
    	})
    		.catch((err) => console.log(err));
    }

    componentDidMount() {
    	this.fetchData();
    }

    render() {
    	const { resData, spinLoading } = this.state;
    	return (
    		<div className={'adminInterfaceView'}>
    			<Spin spinning={spinLoading}>
    				<Descriptions bordered title="接口信息" border size={'small'}>
    					<Descriptions.Item label="接口名称">{resData.title}</Descriptions.Item>
    					<Descriptions.Item label="请求路径">{resData.routePath}</Descriptions.Item>
    					<Descriptions.Item label="请求方式">{resData.methods}</Descriptions.Item>
    				</Descriptions>
    				<div className={'requestContainer'}>
                        请求参数
    					<Table
    						columns={this.columns}
    						dataSource={resData.fieldList}
    						pagination={false}
    						rowKey={'key'}
    						bordered
    					/>
    				</div>
    				<div className={'responseContainer'}>
                        响应参数
    					<Table
    						columns={this.columns}
    						dataSource={resData.resFieldList}
    						pagination={false}
    						rowKey={'key'}
    						bordered
    					/>
    				</div>
    			</Spin>
    		</div>
    	);
    }
}
export default AdminInterfaceView;