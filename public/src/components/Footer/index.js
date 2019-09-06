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
					<Col>
						<p><a href="http://icp.chinaz.com/loma18.com" target="_blank">粤ICP备19110811号</a></p>
					</Col>
					<Col>
						© CopyRight {new Date().getFullYear()} xiange的博客
					</Col>
				</Row>
			</div>
		);
	}
}
export default Footer;
