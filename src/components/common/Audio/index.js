import React, { Component } from 'react';
import { Row, Col, Icon, Progress } from 'antd';
import './style.less';

class Audio extends Component {
    constructor(props) {
        super(props);
    }

    initData = () => {
        function Visualizer(audio, canvas) {
            // set up the hooks
            this.canvas = canvas;
            this.audio = audio;
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.canvasContext = canvas.getContext("2d");

            this.WIDTH = canvas.width;
            this.HEIGHT = canvas.height;

            // clear the canvas
            this.canvasContext.clearRect(0, 0, this.WIDTH, this.HEIGHT);
            this.canvasContext.fillStyle = "";
            this.canvasContext.fillRect(0, 0, this.WIDTH, this.HEIGHT);

            // set up the analyser
            // audio -> analyser -> speaker
            this.analyser = this.audioContext.createAnalyser();
            this.source = this.audioContext.createMediaElementSource(audio);
            this.source.connect(this.analyser);
            // let the audio pass through to the speaker
            this.analyser.connect(this.audioContext.destination);

            // set up the data
            this.analyser.fftSize = 512;
            this.bufferLength = this.analyser.fftSize;
            this.dataArray = new Uint8Array(this.bufferLength);
            //new Float32Array(this.bufferLength) 配合 this.analyser.getFloatTimeDomainData(this.dataArray)使用，波动太大
            this.frame = 0;
        }

        Visualizer.prototype.render = function (data, len, context, WIDTH, HEIGHT) {
            // clear the canvas
            context.clearRect(0, 0, WIDTH, HEIGHT);
            let barWidth = (500 / len) * 5;
            let barHeight = 0;
            let x = WIDTH - len * (barWidth + 4) > 0 ? (WIDTH - len * (barWidth + 2)) / 2 : 0;
            let grd = context.createLinearGradient(0, 0, 0, HEIGHT);
            grd.addColorStop(0, "white");
            grd.addColorStop(0.2, "pink");
            grd.addColorStop(1, "red");
            for (let i = 0; i < len; i++) {
                barHeight = data[i];
                context.fillStyle = grd;
                context.fillRect(x, 100 - barHeight / 3, barWidth, barHeight / 3);
                context.fill();
                x += barWidth + 4;
            }
        };

        Visualizer.prototype.draw = function () {
            if (!this.audio.paused) {
                // update the data
                this.analyser.getByteFrequencyData(this.dataArray);
                // draw in the canvas
                this.render(this.dataArray, this.bufferLength,
                    this.canvasContext, this.WIDTH, this.HEIGHT);
            }

            let self = this;  // requestAnimationFrame binds global this
            this.frame = requestAnimationFrame(function () {
                self.draw();
            });
        };

        function init() {
            let audioNode = document.getElementById('musicEngine');
            let canvasNode = document.getElementById('canvasContainer');
            canvasNode.width = document.documentElement.offsetWidth;
            let visualizer = new Visualizer(audioNode, canvasNode);
            visualizer.draw();
        }

        init();
    }

    listenEvent = () => {

    }

    //点击展开/缩起播放器
    handleClick = (e) => {
        let operatePanel = document.querySelector('.operatePanel'),
            arrow = document.querySelector('.operatePanel .arrow');
        if (e.target.className == 'arrow') {
            operatePanel.style.left = 0;
            arrow.innerHTML = '&lt;';
            arrow.setAttribute('class', 'arrow unfold');
        } else {
            operatePanel.style.left = '-500px';
            arrow.innerHTML = '&gt;';
            arrow.setAttribute('class', 'arrow');
        }
    }

    componentDidMount() {
        this.initData();
        this.listenEvent();
    }

    render() {
        return (<div id={'lomaBlog-audio'}>
            <div className={'operatePanel'}>
                <Row type="flex" justify="space-between">
                    <Col className={'left'}></Col>
                    <Col className={'center'}>
                        <h3>就是想你</h3>
                        <p>loma</p>
                        <p>type</p>
                        <p>
                            <span>1</span>
                            <span>2</span>
                        </p>
                    </Col>
                    <Col className={'right'}>
                        <Row type="flex" justify="space-between">
                            <Col><Icon type="sound" /></Col>
                            <Col><Icon type="retweet" /></Col>
                        </Row>
                        <Row type="flex" justify="center">
                            <Col><Icon type="step-backward" /></Col>
                            <Col><Icon type="pause-circle" /></Col>
                            <Col><Icon type="step-forward" /></Col>
                        </Row>
                        <Row>
                            <Progress percent={30} />
                        </Row>

                    </Col>
                </Row>
                <p className={'arrow'} onClick={this.handleClick}>
                    &gt;
                </p>
            </div>
            <canvas id="canvasContainer" width="1000" height="100">
                您的浏览器暂不支持canvas，建议切换成谷歌浏览器
            </canvas>
            <audio id="musicEngine" src={require('assets/1.mp3')} autoPlay="autoplay">
                您的浏览器暂不支持audio，建议切换成谷歌浏览器
            </audio>
        </div>)
    }
}
export default Audio;