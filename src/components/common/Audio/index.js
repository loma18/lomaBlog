import React, { Component } from 'react';
import { Row, Col, Icon, Progress, Slider } from 'antd';
import './style.less';

class Audio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fold: true, //播放器是否折叠
            play: false, //播放/暂停
            volume: 0.3, //媒体音量
            muted: false, //静音状态
        }
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

        Visualizer.prototype.init = function () {
            this.audioContext = null;
            this.analyser = null;
            this.source = null;
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
        if (!this.visualizer) {
            let init = () => {
                let canvasNode = document.getElementById('canvasContainer');
                canvasNode.width = document.documentElement.offsetWidth;
                this.visualizer = new Visualizer(this.audioNode, canvasNode);
                this.visualizer.draw();
            }
            init();
        } else {
            this.visualizer.draw();
        }
    }

    //点击上一首/下一首
    handleStep = (type) => {
        if (type == 'prev') {
            this.audioNode.src = require('assets/1.mp3');
        } else if (type == 'next') {
            this.audioNode.src = require('assets/2.mp3');
        }
        this.setState({ play: true }, () => {
            this.audioNode.play();
            if (!this.visualizer) {
                this.initData();
            } else {
                this.visualizer.draw();
            }
        })
    }

    //播放/暂停
    handlePlay = () => {
        this.setState({ play: !this.state.play }, () => {
            if (this.state.play) {
                this.audioNode.play();
                this.initData();
            } else {
                this.audioNode.pause();
            }
        });
    }

    //点击展开/缩起播放器
    handleClick = (e) => {
        this.setState({ fold: !this.state.fold });
    }

    initAudioData = () => {
        const { volume } = this.state;
        this.audioNode.volume = volume;
    }

    listenEvent = () => {

        this.audioNode.onpause = function () {
            console.log('pause');
        }
        this.audioNode.onplay = function () {
            console.log('play');
        }
        document.onkeydown = (e) => {
            if (!this.state.fold && e.keyCode == 32) {
                e.preventDefault();
                this.handlePlay();
            }
        }
        window.onscroll = (e) => {
            this.setState({ fold: true });
        }
    }

    componentDidMount() {
        this.audioNode = document.getElementById('musicEngine');
        this.listenEvent();
        this.initAudioData()
    }

    render() {
        const { play, fold, volume, muted } = this.state;
        return (<div id={'lomaBlog-audio'}>
            <div className={'operatePanel ' + (fold ? '' : 'unfold')}>
                <Row type="flex" justify="space-between">
                    <Col className={'left'}></Col>
                    <Col className={'center'}>
                        <h3 className={'songName'}>就是想你就是想你就是想你</h3>
                        <p className={'singer'}>loma</p>
                        <p className={'songType'}>type</p>
                        <p>
                            <span>1</span>
                            <span>2</span>
                        </p>
                    </Col>
                    <Col className={'right'}>
                        <Row type="flex" justify="space-between">
                            <Col className={'topLeft ' + (muted ? 'muted' : '')}>
                                <Icon type="sound"
                                    onClick={() => this.setState({ muted: !muted }, () => {
                                        this.audioNode.muted = this.state.muted;
                                    })}
                                />
                                <Slider
                                    tooltipVisible={false}
                                    value={muted ? 0 : volume}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    className={'volumnSlider'}
                                    onChange={(val) => this.setState({ volume: val, muted: false }, () => {
                                        this.audioNode.volume = val;
                                    })}
                                />
                            </Col>
                            <Col><Icon type="retweet" /></Col>
                        </Row>
                        <Row type="flex" justify="center" gutter={10}>
                            <Col><Icon type="step-backward" onClick={() => this.handleStep('prev')} /></Col>
                            <Col>
                                <Icon type={play ? "pause-circle" : "play-circle"} onClick={this.handlePlay} />
                            </Col>
                            <Col><Icon type="step-forward" onClick={() => this.handleStep('next')} /></Col>
                        </Row>
                        <Row>
                            <Progress percent={30} />
                        </Row>

                    </Col>
                </Row>
                <p className={'arrow'} onClick={this.handleClick}>
                    {fold ? '>' : '<'}
                </p>
            </div>
            <canvas id="canvasContainer" width="1000" height="100">
                您的浏览器暂不支持canvas，建议切换成谷歌浏览器
            </canvas>
            <audio id="musicEngine" src={require('assets/1.mp3')}>
                您的浏览器暂不支持audio，建议切换成谷歌浏览器
            </audio>
        </div>)
    }
}
export default Audio;