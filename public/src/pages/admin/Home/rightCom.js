import React, { Component } from 'react';
import Edit from './edit';
import Draft from './draft';
import ArticleManage from './articleManage';
import Comment from './comment';
import Catalogue from './catalogue';

export default props => {
	const { selectedKeys } = props;
	switch (selectedKeys) {
		case 'edit':
			return <Edit />;
		case 'draft':
			return <Draft />;
		case 'articleManage':
			return <ArticleManage />;
		case 'comment':
			return <Comment />;
		case 'catalogue':
			return <Catalogue />;
		default:
			return <ArticleManage />;
	}
};
