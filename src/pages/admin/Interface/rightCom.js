import React, { Component } from 'react';
import Edit from './edit';
import View from './view';
import GroupEdit from './groupEdit';

export default (props) => {
    const { selectedKeys, type, fetchData } = props;
    switch (type) {
        case 'edit':
        case 'create':
            return <Edit selectedKeys={selectedKeys} type={type} fetchData={fetchData} />;
        case 'view':
            return <View selectedKeys={selectedKeys} />;
        case 'groupManager':
            return <GroupEdit fetchData={fetchData} />
        default:
            return <View selectedKeys={selectedKeys} />;
    }
}