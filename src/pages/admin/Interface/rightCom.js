import React, { Component } from 'react';
import Edit from './edit';
import View from './view';
import GroupEdit from './groupEdit';

export default (props) => {
    const { selectedKeys, type } = props;
    switch (type) {
        case 'edit':
        case 'create':
            return <Edit selectedKeys={selectedKeys} type={type}/>;
        case 'view':
            return <View selectedKeys={selectedKeys} />;
            case 'groupManager':
            return <GroupEdit />
        default:
            return <View selectedKeys={selectedKeys} />;
    }
}