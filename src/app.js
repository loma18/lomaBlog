import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter } from 'react-router-dom'
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import App from 'components/App';
import './app.less';

class Index extends Component {
    render() {
        return (
            <div className={'lomaBlog'}>
                <LocaleProvider locale={zhCN}>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </LocaleProvider>
            </div>
        );
    }
}
ReactDOM.render(<Index />, document.getElementById('lomaBlog'));