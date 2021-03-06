import React, { Component } from 'react';
import { List, Avatar } from 'antd';
import { fireGetRequest } from '../../service/app';

class ArticleList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataList: []
		};
	}

	fetchData = () => {
		let { dataList } = this.state;
		let pathname = window.location.pathname.split('/');
		let typeName = pathname[pathname.length - 1];
		// fireGetRequest(, { typeName }).then(res => {
		// 	if (res.code === 200) {
		// 		this.setState({ dataList: res.data });
		// 	}
		// }).catch(err => console.log(err))
		if (typeName == 'original') {
			dataList = [
				{ title: 'title1' },
				{ title: 'title2' },
				{ title: 'title3' }
			];
		} else if (typeName == 'reprint') {
			dataList = [
				{ title: 'title4' },
				{ title: 'title5' },
				{ title: 'title6' }
			];
		} else {
			dataList = [
				{ title: 'title7' },
				{ title: 'title8' },
				{ title: 'title9' }
			];
		}
		this.setState({ dataList });
	};

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.fetchData();
	}

	componentDidMount() {
		this.fetchData();
	}

	render() {
		const { dataList } = this.state;
		return (
			<div className={'articleList'}>
				<List
					itemLayout='horizontal'
					dataSource={dataList}
					renderItem={item => (
						<List.Item>
							<List.Item.Meta
								avatar={
									<Avatar
										src={require('assets/swiper/1.png')}
									/>
								}
								title={
									<a href='https://ant.design'>
										{item.title}
									</a>
								}
								description='lomalomaloma'
							/>
						</List.Item>
					)}
				/>
			</div>
		);
	}
}
export default ArticleList;
