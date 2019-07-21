import React, { Component } from 'react';

export const breadcrumbItem = {
	original: { value: 'original', title: '原创' },
	reprint: { value: 'reprint', title: '转载' },
	code: { value: 'code', title: '代码' },
	admin: { value: 'admin', title: '首页' },
	edit: { value: 'edit', title: '写博客' },
	articleManage: { value: 'articleManage', title: '文章管理' },
	comment: { value: 'comment', title: '评论管理' },
	catalogue: { value: 'catalogue', title: '个人分类管理' },
	mine: { value: 'mine', title: '个人中心' },
	interface: { value: 'interface', title: '后台接口' },
	others: { value: 'others', title: '其他' }
};

export const articleTypeList = [
	{ key: 'original', name: '原创', id: 1 },
	{ key: 'reprint', name: '转载', id: 2 },
	{ key: 'code', name: '代码', id: 3 }
]; // 文章类型

//通用分页设置
export const hxPaginationSetup = {
	defaultPageSize: 10,
	pageSize: 10,
	showQuickJumper: true,
	showTotal: (total, range) => {
		return (
			<span>
				总共<span style={{ color: '#15bace' }}>{total}</span>条
			</span>
		);
	}
};
