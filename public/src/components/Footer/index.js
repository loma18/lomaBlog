import React, { Component } from 'react';
import { Row, Col, Menu, Input } from 'antd';
import { Router, withRouter, Link } from 'react-router-dom';
import './style.less';

const Search = Input.Search;

class Footer extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id={'lomaBlog-footer'}>
				<Row>
					<Col>
						<a href="/introduce" target="_blank">关于我</a>
					</Col>
				</Row>
			</div>
		);
	}
}
export default Footer;
