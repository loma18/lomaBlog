import React, { Component } from 'react';
import { Row, Col, Icon, Form, Input, Tag, Tooltip, Checkbox, Select, Button } from 'antd';
import { Router, withRouter, Link } from "react-router-dom";
import LomaBlogTag from 'components/Admin/LomaBlogTag';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';

const form = Form.create();
const FormItem = Form.Item;
// @withRouter 
@form
class AdminHomeEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resData: {},
            article: [],
            catalogue: [],
            hasSelCatalogue: [],
            catalogueList: ['前端学习笔记', '服务器相关', '实用网站记录', '前端工具使用'],
            articleTypeList: [
                { key: 'original', name: '原创', id: 1 },
                { key: 'reprint', name: '转载', id: 2 },
                { key: 'code', name: '代码', id: 3 },
            ], //文章类型
            articleType: ''
        }
    }

    //tag标签确认回调
    handleInputConfirm = (tags, type, inputValue) => {
        const { catalogueList, hasSelCatalogue } = this.state;
        let tempList = JSON.parse(JSON.stringify(hasSelCatalogue))
        if (type == 'catalogue') {
            if (catalogueList.indexOf(inputValue) > -1) {
                tempList.push(inputValue);
            }
        }
        this.setState({ [type]: tags, hasSelCatalogue: tempList });
    }

    handleClose = (tags, type, removedTag) => {
        let { hasSelCatalogue } = this.state;
        let index = -1,
            tempList = JSON.parse(JSON.stringify(hasSelCatalogue));
        if (type == 'catalogue') {
            index = tempList.indexOf(removedTag);
            if (index > -1) {
                tempList.splice(index, 1);
            }
        }
        this.setState({ [type]: tags, hasSelCatalogue: tempList });
    }

    //修改个人分类选取
    onChange = (val) => {
        let { catalogue, catalogueList } = this.state;
        catalogue = catalogue.filter(item => {
            return !(val.indexOf(item) < 0 && catalogueList.indexOf(item) > -1);
        })
        if (catalogue.length <= 4) {
            val.map(item => {
                if (catalogue.indexOf(item) < 0 && catalogue.length <= 4) {
                    catalogue.push(item);
                }
            })
        }
        this.setState({ hasSelCatalogue: val, catalogue });
    }

    //改变文章类型
    handleChangeType = (val) => {
        this.setState({ articleType: val });
    }

    //发布博客
    handlePublish = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
        })
    }

    //存草稿
    saveDraft = () => {

    }

    fetchData = () => {
        this.editorInstance.setValue(BraftEditor.createEditorState('内容'));
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        const { resData, article, catalogue, hasSelCatalogue, catalogueList, articleTypeList, articleType } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className={'adminHomeEdit'}>
                <Form>
                    <FormItem label="">
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '请输入文章标题！' }],
                            initialValue: resData.title || ''
                        })(<Input placeholder={'请输入文章标题'} />)}
                    </FormItem>
                    <FormItem label="">
                        {getFieldDecorator('content', {
                            rules: [{ required: true, message: '请输入文章内容！' }]
                        })(
                            <BraftEditor
                                ref={instance => (this.editorInstance = instance)}
                                excludeControls={['media']}
                            />
                        )}
                    </FormItem>
                    <FormItem label="文章标签">
                        <LomaBlogTag
                            tags={article}
                            handleInputConfirm={this.handleInputConfirm}
                            tagName={'article'}
                            handleClose={this.handleClose}
                        />
                    </FormItem>
                    <FormItem label="个人分类" className={'catalogue'}>
                        <LomaBlogTag
                            tags={catalogue}
                            handleInputConfirm={this.handleInputConfirm}
                            tagName={'catalogue'}
                            handleClose={this.handleClose}
                        />
                        <Row>
                            <Checkbox.Group
                                disabled={catalogue.length >= 5}
                                options={catalogueList}
                                value={hasSelCatalogue}
                                onChange={this.onChange}
                            />
                        </Row>
                    </FormItem>
                    <FormItem label="文章类型" className={'article'}>
                        {getFieldDecorator('articleType', {
                            rules: [{ required: true, message: '请选择文章类型！' }],
                            initialValue: resData.articleType || articleTypeList[0] && articleTypeList[0].key
                        })(
                            <Select
                                value={articleType}
                                onChange={(val) => this.handleChangeType(val)}
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
                        )}
                    </FormItem>
                    <Row type="flex" gutter={10}>
                        <Col>
                            <Button type="primary" onClick={this.handlePublish}>发布</Button>
                        </Col>
                        <Col>
                            <Button onClick={this.saveDraft}>存草稿</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}
export default AdminHomeEdit;