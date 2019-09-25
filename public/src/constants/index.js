import React, { Component } from 'react';

export const docTitle = {
	home: '',
	whisper: '微语',
	original: '原创',
	reprint: '转载',
	code: '代码'
};

export const breadcrumbItem = {
	original: { value: 'original', title: '原创' },
	reprint: { value: 'reprint', title: '转载' },
	code: { value: 'code', title: '代码' },
	admin: { value: 'admin', title: '首页' },
	edit: { value: 'edit', title: '写博客' },
	articleManage: { value: 'articleManage', title: '文章管理' },
	comment: { value: 'comment', title: '评论管理' },
	catalogue: { value: 'catalogue', title: '个人分类管理' },
	whisper: { value: 'whisper', title: '微语' },
	mine: { value: 'mine', title: '个人中心' },
	interface: { value: 'interface', title: '后台接口' },
	others: { value: 'others', title: '其他' }
};

export const articleTypeObj = {
	original: { key: 'original', name: '原创', id: 1 },
	reprint: { key: 'reprint', name: '转载', id: 2 },
	secret: { key: 'secret', name: '私人', id: 3 }
};

export const articleTypeList = [...Object.values(articleTypeObj)]; // 文章类型

//通用分页设置
export const hxPaginationSetup = {
	defaultPageSize: 10,
	pageSize: 10,
	showQuickJumper: true,
	showTotal: (total, range) => {
		return (
			<span>
				总共<span style={{ color: '#1890ff' }}>{total}</span>条
			</span>
		);
	}
};

export const braftControls = [
	'undo',
	'redo',
	'separator',
	'font-size',
	'line-height',
	'letter-spacing',
	'separator',
	'text-color',
	'bold',
	'italic',
	'underline',
	'strike-through',
	'separator',
	'superscript',
	'subscript',
	'remove-styles',
	'emoji',
	'separator',
	'text-indent',
	'text-align',
	'separator',
	'headings',
	'list-ul',
	'list-ol',
	'blockquote',
	'code',
	'separator',
	'link',
	'separator',
	'hr',
	'separator',
	'media',
	'separator',
	'clear',
	'fullscreen'
];
