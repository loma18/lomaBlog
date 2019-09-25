import { Spin } from 'antd';

import React, { Component } from 'react';

const AsyncComponent = importComponent => {
	return class extends Component {
		constructor(props) {
			super(props);

			this.state = {
				component: null
			};
		}

		componentDidMount() {
			importComponent().then(cmp => {
				this.setState({ component: cmp.default });
			});
		}
		componentWillUnmount() {
			this.setState = () => {
				return;
			};
		}

		render() {
			const C = this.state.component;
			return C ? (
				<C {...this.props} />
			) : (
				<div className={'globalLoading'}>
					<Spin size='large' />
				</div>
			);
		}
	};
};
export default AsyncComponent;
