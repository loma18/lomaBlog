import React, { Component } from 'react';
import { Row, Col, Menu, Input } from 'antd';
import { Router, withRouter, Link } from "react-router-dom";
import './style.less';

const Search = Input.Search;

class Footer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id={'lomaBlog-footer'}>
               footer
            </div>
        )
    }
}
export default Footer;