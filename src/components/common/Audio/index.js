import React, { Component } from 'react';
import './style.less';
import mp3 from 'assets/1.mp3';

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
            this.canvasContext.fillStyle = 'rgb(200, 200, 200)';
            this.canvasContext.fillRect(0, 0, this.WIDTH, this.HEIGHT);

            // set up the analyser
            // audio -> analyser -> speaker
            this.analyser = this.audioContext.createAnalyser();
            this.source = this.audioContext.createMediaElementSource(audio);
            this.source.connect(this.analyser);
            // let the audio pass through to the speaker
            this.analyser.connect(this.audioContext.destination);

            // set up the data
            this.analyser.fftSize = 1024;
            this.bufferLength = this.analyser.fftSize;
            this.dataArray = new Float32Array(this.bufferLength);
            this.frame = 0;
        }

        Visualizer.prototype.render = function (data, len, context, WIDTH, HEIGHT) {
            // clear the canvas
            context.fillStyle = 'rgb(70, 70, 70)';
            context.fillRect(0, 0, WIDTH, HEIGHT);

            // // configure the stroke
            context.lineWIDTH = 2;
            context.strokeStyle = 'rgb(255, 255, 255)';
            context.beginPath();

            // draw the waves
            var x = 0, sliceWIDTH = WIDTH * 1.0 / len;
            context.moveTo(0, data[0] * HEIGHT / 2 + HEIGHT / 2);
            for (var i = 1; i < len; i++) {
                var y = HEIGHT / 2 + data[i] * HEIGHT / 2;
                context.lineTo(x, y);
                x += sliceWIDTH;
            }
            context.lineTo(WIDTH, data[len - 1] * HEIGHT / 2 + HEIGHT / 2);

            // show it
            context.stroke();


            // let barWidth = 2;//(500 / len) * 2.5;
            // let barHeight = 0;
            // let x = 0;
            // for(let i = 0; i < len; i++) {
            //   barHeight = data[i];
            //   context.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
            //   context.fillRect(x,500-barHeight/2,barWidth,barHeight/2);
            //   context.fill();
            //   x += barWidth + 1;
            // }
        };

        Visualizer.prototype.draw = function () {
            if (!this.audio.paused) {
                // update the data
                this.analyser.getFloatTimeDomainData(this.dataArray);
                // draw in the canvas
                this.render(this.dataArray, this.bufferLength,
                    this.canvasContext, this.WIDTH, this.HEIGHT);
            }

            var self = this;  // requestAnimationFrame binds global this
            this.frame = requestAnimationFrame(function () {
                self.draw();
            });
        };

        function init() {
            var audioNode = document.getElementById('musicEngine');
            var canvasNode = document.getElementById('canvasContainer');

            var visualizer = new Visualizer(audioNode, canvasNode);
            visualizer.draw();
        }

        init();
    }

    componentDidMount() {
        this.initData();
    }

    render() {
        return (<div id={'lomaBlog-audio'}>
            <canvas id="canvasContainer" width="500" height="500"></canvas>
            <audio id="musicEngine" src={require('assets/1.mp3')} autoPlay="autoplay">111</audio>
        </div>)
    }
}
export default Audio;