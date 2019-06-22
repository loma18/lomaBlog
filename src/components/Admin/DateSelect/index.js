import React, { Component } from 'react';
import { Select } from 'antd';
import './style.less';

const Option = Select.Option;

export default (params = {}) => {
	//选择年月下拉框时调用
	const handleSelectChange = (val, type) => {
		params.handleSelectChange(val, type);
	};

	const getItems = type => {
		let resultList = [];
		if (type == 'years') {
			let currentYear = new Date().getFullYear();
			for (let i = 0; i < 3; i++) {
				resultList.push({
					id: currentYear,
					name: currentYear + '年'
				});
				currentYear--;
			}
		} else {
			resultList = [
				{ id: 1, name: '1月' },
				{ id: 2, name: '2月' },
				{ id: 3, name: '3月' },
				{ id: 4, name: '4月' },
				{ id: 5, name: '5月' },
				{ id: 6, name: '6月' },
				{ id: 7, name: '7月' },
				{ id: 8, name: '8月' },
				{ id: 9, name: '9月' },
				{ id: 10, name: '10月' },
				{ id: 11, name: '11月' },
				{ id: 12, name: '12月' }
			];
		}
		return resultList;
	};

	const getSelectItem = type => {
		let items = getItems(type);
		return (
			<Select
				placeholder={type == 'years' ? '年' : '月'}
				value={params[type]}
				onChange={val => handleSelectChange(val, type)}
				className={'lomaBlog-select select-' + type}
			>
				{items.map(item => {
					return (
						<Option key={item.id} value={item.name}>
							{item.name}
						</Option>
					);
				})}
			</Select>
		);
	};
	return (
		<div className="dateSelect">
			{getSelectItem('years')}
			{getSelectItem('months')}
		</div>
	);
};
