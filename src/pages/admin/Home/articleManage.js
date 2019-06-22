import React, { Component } from 'react';
import { Row, Col, Icon, Menu, Select, Input, Button } from 'antd';
import { Router, withRouter, Link } from "react-router-dom";
import DateSelect from 'components/Admin/DateSelect';
import { getPathnameByIndex, GetQueryString, formatMomentToString } from 'utils';

const Search = Input.Search;

@withRouter
class AdminHomeArticleManage extends Component {
    constructor(props) {
        super(props);
        let key = getPathnameByIndex(4),
            years = GetQueryString('years'),
            months = GetQueryString('months'),
            articleType = GetQueryString('type'),
            catalogueType = GetQueryString('catalogue'),
            searchVal = GetQueryString('searchVal'),
            currentDate = new Date(),
            currentYear = currentDate.getFullYear(),
            currentMonth = currentDate.getMonth() + 1;
        years = years ? years : currentYear;
        months = months ? months : currentMonth;
        searchVal = searchVal ? decodeURI(searchVal) : '';
        this.state = {
            current: key || 'all',
            years: years + '年',
            months: months + '月',
            articleType: articleType || 'all',
            catalogueType: catalogueType || 'all',
            searchVal
        }
    }

    handleClick = ({ item, key, keyPath, domEvent }) => {
        this.setState({ current: key }, () => {
            this.props.history.push('/admin/home/articleManage/' + key);
        });
    }

    setCurrent = () => {
        let key = getPathnameByIndex(4);
        key = key ? key : 'all';
        this.setState({ current: key });
    }

    //改变年/月
    handleSelectChange = (val, type) => {
        this.setState({ [type]: val });
    }

    //改变文章/个人分类类型
    handleChangeType = (val, type) => {
        this.setState({ [type]: val });
    }

    //关键词搜索
    handleChange = (e) => {
        this.setState({ searchVal: e.target.value });
    }

    //搜索
    handleSearch = () => {
        const { years, months, articleType, catalogueType, searchVal } = this.state;
        let year = years.replace('年', ''),
            month = months.replace('月', '');
        this.props.history.push('/admin/home/articleManage/all?year=' +
            year + '&month=' + month + '&searchVal=' + searchVal +
            '&articleType=' + articleType + '&catalogueType=' + catalogueType);

    }

    UNSAFE_componentWillReceiveProps() {
        this.setCurrent();
    }

    componentDidMount() {

    }

    render() {
        const { current, years, months, articleType, catalogueType, searchVal } = this.state;
        let articleTypeList = [
            { key: 'all', name: '文章类型', id: 0 },
            { key: 'original', name: '原创', id: 1 },
            { key: 'reprint', name: '转载', id: 2 },
            { key: 'code', name: '代码', id: 3 },
        ];
        let catalogueList = [
            { key: 'all', name: '个人分类', id: 0 },
            { key: 'webStudy', name: '前端学习', id: 1 },
            { key: 'webTool', name: '前端工具', id: 2 }
        ];
        let articleList = [{
            title: 'reactRouter4',
            content: 'contentcontentcontentcontent',
            articleTypeName: '原创',
            articleTypeId: 1,
            catalogueTypeName: '前端学习',
            catalogueTypeId: 1,
            createTime: new Date('2019-06-20 15:30').getTime(),
            updateTime: new Date('2019-06-20 18:01').getTime(),
        }]
        return (
            <div className={'adminHomeArticleManage'}>
                <Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal" theme={'dark'}>
                    <Menu.Item key="all">
                        全部
                    </Menu.Item>
                    <Menu.Item key="draft">
                        草稿
                    </Menu.Item>
                </Menu>
                <Row type="flex" className={'filterContainer'}>
                    <Col>筛选：</Col>
                    <Col>
                        <DateSelect years={years} months={months} handleSelectChange={this.handleSelectChange} />
                    </Col>
                    <Col>
                        <Select
                            value={articleType}
                            onChange={(val) => this.handleChangeType(val, 'articleType')}
                            className={'lomaBlog-select select-articleType'}
                        >
                            {articleTypeList.map(item => {
                                return (
                                    <Option key={item.id} value={item.key}>
                                        {item.name}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Col>
                    <Col>
                        <Select
                            value={catalogueType}
                            onChange={(val) => this.handleChangeType(val, 'catalogueType')}
                            className={'lomaBlog-select select-catalogueType'}
                        >
                            {catalogueList.map(item => {
                                return (
                                    <Option key={item.id} value={item.key}>
                                        {item.name}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Col>
                    <Col>
                        <Input placeholder="请输入标题关键词" onChange={this.handleChange} value={searchVal} />
                    </Col>
                    <Col>
                        <Button onClick={this.handleSearch} icon="search" className={'searchBtn'}>
                            搜索
                        </Button>
                    </Col>
                </Row>
                <div className={'articleListContainer'}>
                    <ul>
                        {
                            articleList.map((item, key) => {
                                return (
                                    <li key={key} className={'listItem'}>
                                        <h3>{item.title}</h3>
                                        <Row type="flex" justify="space-between">
                                            <Col>
                                                <span className={'articleTypeName'}>{item.articleTypeName}</span>
                                                <span className={'updateTime'}>{formatMomentToString(item.updateTime, 'YYYY年MM月DD日 HH:mm:ss')}</span>
                                                <span className={'icon'}><Icon type="message" /></span>
                                                <span className={'icon'}><Icon type="eye" /></span>
                                                <span className={'icon'}><Icon type="heart" /></span>
                                            </Col>
                                            <Col>
                                                <span className={'lookView linkColor'}>查看1</span>
                                                <span className={'delete dangerColor'}>删除</span>
                                            </Col>
                                        </Row>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}
export default AdminHomeArticleManage;