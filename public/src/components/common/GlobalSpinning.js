import { Spin } from 'antd';
import { inject, observer } from 'mobx-react';

import React, { Component } from 'react';

@inject('appStore')
@observer
export default class GlobalSpin extends Component {
	render() {
		const { appStore } = this.props;
		return <Spin spinning={appStore.loading} size='large'></Spin>;
	}
}
