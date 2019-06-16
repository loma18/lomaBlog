import React, { Component } from 'react';
import { Row, Col, Calendar, Select, Radio, Menu } from 'antd';
import Swiper from 'components/Home/swiper';

class HomeIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: []
        }
    }

    fetchData = () => {
        let { dataList } = this.state;
        dataList = [
            {
                id: 1,
                title: '123',
                description: 'description1'
            },
            {
                id: 2,
                title: '1234',
                description: 'description2'
            },
            {
                id: 3,
                title: '12345',
                description: 'description3'
            },
        ]
        this.setState({ dataList })
    }

    componentDidMount() {
        this.fetchData();
    }


    render() {
        const { dataList } = this.state;
        return (
            <div className={'homeIndex'}>
                <Swiper />
                <div className={'home-body'}>
                    <ul>
                        {
                            dataList.map(item => {
                                return (
                                    <li key={item.id} className={'listItem'}>
                                        <Row type="flex" justify="space-between" gutter={10}>
                                            <Col className={'imgContainer'}>
                                                <img src={require('assets/swiper/1.png')} />
                                            </Col>
                                            <Col className={'articleContainer'}>
                                                <h3>{item.title}</h3>
                                                <p>{item.description}</p>
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
export default HomeIndex;