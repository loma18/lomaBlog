import React, { Component } from 'react';
import { Icon, Input, Tag, Tooltip } from 'antd';
import './LomaBlogTag.less';

class LomaBlogTag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: props.tags || [],
            inputVisible: false,
            inputValue: '',
        }
    }

    handleClose = removedTag => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        const { handleClose, tagName } = this.props;
        this.setState({ tags }, () => {
            handleClose(this.state.tags, tagName, removedTag)
        });
    };

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    };

    handleInputChange = e => {
        this.setState({ inputValue: e.target.value });
    };

    handleInputConfirm = () => {
        const { inputValue } = this.state;
        const { handleInputConfirm, tagName } = this.props;
        let { tags } = this.state;
        if (inputValue && tags.indexOf(inputValue) === -1 && tags.length <= 4) {
            tags = [...tags, inputValue];
        }
        handleInputConfirm(tags, tagName, inputValue);
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
    };

    saveInputRef = input => (this.input = input);

    UNSAFE_componentWillReceiveProps(props) {
        this.setState({ tags: props.tags });
    }

    componentDidMount() {
    }

    render() {
        const { tags, inputVisible, inputValue } = this.state;
        return (
            <div className={'lomaBlog-tag'}>
                {tags.map((tag, index) => {
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                        <Tag key={tag} closable={index !== tags.length - 1} onClose={() => this.handleClose(tag)}>
                            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                        </Tag>
                    );
                    return isLongTag ? (
                        <Tooltip title={tag} key={tag}>
                            {tagElem}
                        </Tooltip>
                    ) : (
                            tagElem
                        );
                })}
                {inputVisible && (
                    <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        className={'tagInpug'}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                    />
                )}
                <Tag onClick={this.showInput} className={'addTag'}>
                    <Icon type="plus" /> 添加标签
                        </Tag>
                <span>最多五个标签</span>
            </div>
        )
    }
}
export default LomaBlogTag;
