import React from 'react';
import ReactSwipe from 'react-swipe';
import './swiper.less';

class Category extends React.Component {
    constructor() {
        super();
        this.state = {
            index: 0
        }
    }
    render() {
        const { index } = this.state;
        let opt = {
            auto: 3000,
            callback: function (index) {
                this.setState({ index: Number(index) })
            }.bind(this)
        }

        let imgList = [
            require('assets/swiper/1.png'),
            require('assets/swiper/2.png'),
            require('assets/swiper/3.png'),
            require('assets/swiper/4.png'),
            require('assets/swiper/5.png'),
            require('assets/swiper/6.png'),
        ]

        return (
            <div className="swiper">
                <ReactSwipe className="carousel" swipeOptions={opt}>
                    {imgList.map((item, key) => {
                        return <div key={key} className="carousel-item">
                            <img src={item} />
                        </div>
                    })}
                </ReactSwipe>
                <div className="index-container">
                    <ul>
                        {imgList.map((item, key) => {
                            return <li key={key} className={index === key ? 'selected' : ''}></li>
                        })}
                    </ul>
                </div>
            </div>
        )
    }
    componentDidUpdate() {
    }
}

export default Category;