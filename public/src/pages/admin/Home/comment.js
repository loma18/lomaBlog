import React, { Component } from 'react';
import { Row, Col, Icon, Table, Popconfirm } from 'antd';
import { Router, withRouter, Link } from 'react-router-dom';
import { formatMomentToString } from 'utils';
import { fireGetRequest, firePostRequest } from 'service/app';
import {
	GET_COMMENT_LIST,
	DELETE_COMMENT_BY_ID
} from 'constants/api';
import { openNotification, showSuccessMsg } from '../../../utils';


// @withRouter
class AdminHomeComment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			pagination: {
				current: 1,
				pageSize: 20,
				showTotal: total => `共 ${total} 条`
			},
			tableData: []
		};
	}

	getColumns = () => {
		const { pagination } = this.state;
		let columns = [
			{
				title: '序号',
				dataIndex: 'NO',
				render: (txt, item, index) => {
					return (pagination.current - 1) * pagination.pageSize + index + 1;
				}
			},
			{
				title: '博客title',
				dataIndex: 'title'
			},
			{
				title: '评论内容',
				dataIndex: 'content'
			},
			{
				title: '评论者',
				dataIndex: 'username'
			},
			{
				title: '评论谁',
				dataIndex: 'parentUsername'
			},
			{
				title: '评论时间',
				dataIndex: 'createAt',
				width: 120,
				render: txt => formatMomentToString(txt, 'YYYY-MM-DD HH:mm:ss')
			},
			{
				title: '操作',
				dataIndex: 'operate',
				render: (txt, item) => {
					return (
						<Popconfirm
							title="是否确认删除?"
							onConfirm={() => this.handleDelete(item)}
							okText="是"
							cancelText="否"
						>
							<span className={'delete dangerColor'}>删除</span>
						</Popconfirm>
					)
				}
			},
		]
		return columns;
	}

	//删除评论
	handleDelete = (item) => {
		this.setState({ loading: true });
		fireGetRequest(DELETE_COMMENT_BY_ID, { id: item.id }).then(res => {
			if (res.code === 200) {
				showSuccessMsg('删除成功');
				this.fetchData();
			} else {
				openNotification('error', '删除失败', res.msg);
			}
			this.setState({ loading: false });
		}).catch(err => console.log(err))
	}

	handleTableChange = (pagination, filters, sorter) => {
		const pager = { ...this.state.pagination };
		pager.current = pagination.current;
		this.setState({ pagination: pager, tableData: [] }, () => {
			this.fetchData();
		});
	};

	fetchData = () => {
		this.setState({ loading: true });
		const { pagination } = this.state;
		fireGetRequest(GET_COMMENT_LIST, { page: pagination.current }).then(res => {
			if (res.code === 200) {
				pagination.total = res.total;
				this.setState({ tableData: res.data, pagination });
			} else {
				openNotification('error', '获取评论列表失败', res.msg);
			}
			this.setState({ loading: false });
		}).catch(err => console.log(err))
	}

	componentDidMount() {
		this.fetchData();
	}

	render() {
		const { tableData, loading, pagination } = this.state;
		return (
			<div className={'adminHomeComment'}>
				<Table
					rowClassName={() => ''}
					rowKey={'id'}
					columns={this.getColumns()}
					className={'lomaBlog-table'}
					loading={loading}
					dataSource={tableData}
					pagination={pagination}
					onChange={this.handleTableChange}
					size="small"
				/>
			</div>
		);
	}
}
export default AdminHomeComment;
