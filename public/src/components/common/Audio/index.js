import React, { Component } from 'react';
import { Row, Col, Icon, Progress, Slider } from 'antd';
import { fireGetRequest } from 'service/app';
import {
	GET_HOT_SONGS,
	GET_SONGS
} from 'constants/api';
import { getMinute } from 'utils';
import './style.less';

class Audio extends Component {
	constructor(props) {
		super(props);
		this.state = {
			songs: [], //播放列表
			songHash: '', //当前播放歌曲hash
			songData: '', //当前播放歌曲信息
			selSongKey: '', //当前播放歌曲序号
			currentTime: 0, //当前播放歌曲当前播放时长
			playMode: 'loop', //当前播放模式 loop:循环播放 random:随机播放
			fold: true, // 播放器是否折叠
			play: false, // 播放/暂停
			stop: true, // 停止播放
			volume: 0.3, // 媒体音量
			muted: false // 静音状态
		};
	}

	initData = (_this) => {
		function Visualizer(audio, canvas) {
			// set up the hooks
			this.canvas = canvas;
			this.audio = audio;
			this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
			this.canvasContext = canvas.getContext('2d');

			this.WIDTH = canvas.width;
			this.HEIGHT = canvas.height;

			// clear the canvas
			this.canvasContext.clearRect(0, 0, this.WIDTH, this.HEIGHT);
			this.canvasContext.fillStyle = '';
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
			// new Float32Array(this.bufferLength) 配合 this.analyser.getFloatTimeDomainData(this.dataArray)使用，波动太大
			this.frame = 0;
		}

		Visualizer.prototype.init = function () {
			this.audioContext = null;
			this.analyser = null;
			this.source = null;
		};

		Visualizer.prototype.render = function (data, len, context, WIDTH, HEIGHT) {
			// clear the canvas
			context.clearRect(0, 0, WIDTH, HEIGHT);
			let barWidth = (500 / len) * 5;
			let barHeight = 0;
			let x = (WIDTH - 600) / 2;
			let originX = x;
			let grd = context.createLinearGradient(0, 0, 0, HEIGHT);
			grd.addColorStop(0, 'white');
			grd.addColorStop(0.2, 'red');
			grd.addColorStop(0.8, 'orange');
			grd.addColorStop(1, 'red');
			for (let i = 0; i < len; i += 4) {
				barHeight = data[i];
				// if (barHeight > 0) {
				//     context.fillStyle = 'red';
				//     context.fillRect(x, (95 - barHeight / 3) / 1.2, barWidth, 3);
				// }
				context.fillStyle = grd;
				context.fillRect(x, 40 - barHeight / 8, barWidth, barHeight / 8);
				context.fill();
				x += barWidth + 8;
				if (x > originX + 600) {
					return;
				}
			}
		};

		Visualizer.prototype.draw = function () {
			_this.setState({ currentTime: this.audio.currentTime }, () => {
				// if (this.audio.ended) {
				// 	console.log('ended');
				// 	_this.handleStep('next');
				// 	return;
				// }
			})

			if (!this.audio.paused) {
				// console.log('dataArray', this.dataArray);
				// update the data
				this.analyser.getByteFrequencyData(this.dataArray);
				// draw in the canvas
				this.render(this.dataArray, this.bufferLength,
					this.canvasContext, this.WIDTH, this.HEIGHT);
			}

			let self = this; // requestAnimationFrame binds global this
			this.frame = requestAnimationFrame(function () {
				self.draw();
			});
		};
		if (!this.visualizer) {
			let init = () => {
				this.canvasNode.width = document.documentElement.offsetWidth;
				this.visualizer = new Visualizer(this.audioNode, this.canvasNode);
				this.visualizer.draw();
			};
			init();
		} else {
			this.visualizer.draw();
		}
	}

	// 点击上一首/下一首
	handleStep = (type, key = '') => {
		let { selSongKey, songs } = this.state;
		if (key === selSongKey) {
			return;
		}
		if (type == 'prev') {
			selSongKey = !selSongKey && selSongKey !== 0 ? 0 : selSongKey - 1;
			selSongKey = selSongKey < 0 ? songs.length - 1 : selSongKey;
		} else if (type == 'next') {
			selSongKey = !selSongKey && selSongKey !== 0 ? 0 : selSongKey + 1;
			selSongKey = selSongKey > songs.length - 1 ? 0 : selSongKey;

		} else {
			selSongKey = key;
		}
		this.setState({ selSongKey, songHash: songs[selSongKey].hash, currentTime: 0 }, () => {
			this.fetchSong();
		})

	}

	//改变播放模式
	changePlayMode = () => {
		let { playMode } = this.state;
		playMode = playMode == 'loop' ? 'random' : 'loop';
		this.setState({ playMode });
	}

	// 播放/暂停
	handlePlay = () => {
		const { songs } = this.state;
		if (!this.visualizer) {
			this.setState({ selSongKey: 0, songHash: songs[0].hash }, () => {
				this.fetchSong();
			})
		}
		this.setState({ play: !this.state.play }, () => {

			if (this.state.play) {
				this.audioNode.play();
			} else {
				this.audioNode.pause();
			}
		});
	}

	// 点击展开/缩起播放器
	handleClick = (e) => {
		this.setState({ fold: !this.state.fold }, () => {
			if (!this.state.fold) {
				this.fetchSongsData();
			}
		});
	}

	//获取酷狗音乐列表
	fetchSongsData = () => {
		fireGetRequest(GET_HOT_SONGS, { json: true }).then(res => {
			if (res.data && res.data.length > 0) {
				this.setState({ songs: res.data })
			} else {
				this.setState({ songs: [] })
			}
		}).catch(err => console.log(err))
	}

	//获取具体哪首歌播放地址
	fetchSong = () => {
		const { songHash } = this.state;
		console.log('beforefetchdata');
		fireGetRequest(GET_SONGS, { cmd: 'playInfo', hash: songHash }).then(res => {
			if (res && res.url) {
				console.log('fetchdata');
				this.setState({ songData: res, play: true }, () => {
					this.audioNode.src = '/source/' + this.state.songData.url;
					this.audioNode.play();
				})
			}
			// else {
			// 	this.setState({ songUrl: '' })
			// }
		}).catch(err => console.log(err))
	}

	// 停止播放
	handleStop = () => {
		let canvasContext = this.canvasNode.getContext('2d');
		canvasContext.clearRect(0, 0, this.canvasNode.width, this.canvasNode.height);
		this.canvasNode.width = 0;
		this.audioNode.pause();
		this.audioNode.currentTime = 0;
		this.setState({ play: false, stop: true });
	}

	initAudioData = () => {
		const { volume } = this.state;
		this.audioNode.volume = volume;
		// this.audioNode.loop = true;
	}

	listenEvent = () => {

		this.audioNode.onpause = () => {
			if (this.audioNode.ended) { //判断是否结束，如果结束，则播放下一首歌
				if (this.state.playMode == 'random') {
					const { songs } = this.state;
					this.setState({ selSongKey: Math.floor(Math.random() * songs.length) }, () => {
						this.handleStep('next');
					})
				} else {
					this.handleStep('next');
				}
			}
		};
		this.audioNode.onplay = () => {
			if (!this.canvasNode.width) {
				this.canvasNode.width = document.documentElement.offsetWidth;
			}
			this.setState({ stop: false });
			this.initData(this);
		};
		document.onkeydown = (e) => {
			if (!this.state.fold && e.keyCode == 32) {
				e.preventDefault();
				this.handlePlay();
			}
		};
		// window.onscroll = (e) => {
		// 	this.setState({ fold: true });
		// };
	}

	componentDidMount() {
		this.audioNode = document.getElementById('musicEngine');
		this.canvasNode = document.getElementById('canvasContainer');
		this.listenEvent();
		this.initAudioData();
	}

	render() {
		const {
			play,
			fold,
			volume,
			muted,
			stop,
			songs,
			songData,
			selSongKey,
			currentTime,
			playMode
		} = this.state;
		let fileInfo = [],
			imgUrl = songData.album_img && songData.album_img.replace(/\/\{size\}/, ''),
			duration = songs[selSongKey] ? songs[selSongKey].duration : 0;
		return (<div id={'lomaBlog-audio'} className={fold ? 'containerFold' : 'containerUnfold'}>
			<div className={'operatePanel ' + (fold ? '' : 'unfold')}>
				<div className={'songPanel'}>
					<ul>
						<li>
							<span>序号</span>
							<span>歌名</span>
							<span>时长</span>
							<span>歌手</span>
						</li>
						{songs.map((item, key) => {
							fileInfo = item.filename.split('-');
							return (
								<li
									key={key}
									onClick={() => this.handleStep('current', key)}
									className={key === selSongKey ? 'activeSong' : ''}
								>
									<span>{key + 1}</span>
									<span>{fileInfo[1]}</span>
									<span>{getMinute(item.duration)}</span>
									<span>{fileInfo[0]}</span>
								</li>
							)
						})}
					</ul>
				</div>
				<Row type="flex" justify="space-between">
					<Col className={'left'} style={{
						backgroundImage: imgUrl ? `url(/source/${imgUrl})` :
							`url(${require('../../../assets/logo.jpg')})`
					}}
					></Col>
					<Col className={'center'}>
						<h3 className={'songName'}>{songData.songName}</h3>
						<p className={'singer'}>{songData.singerName}</p>
						{/* <p className={'songType'}>{}</p> */}
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
										this.audioNode.muted = false;
									})}
								/>
							</Col>
							<Col>
								<Icon
									type={playMode == 'loop' ? 'retweet' : 'shake'}
									onClick={this.changePlayMode}
								/>
							</Col>
						</Row>
						<Row type="flex" justify="center" gutter={10}>
							<Col className={'turnOff'}><i onClick={() => this.handleStop()} title={'停止'} /></Col>
							<Col><Icon type="step-backward" onClick={() => this.handleStep('prev')}
								title={'上一首'}
								disabled={songs.length == 0}
							     /></Col>
							<Col>
								<Icon type={play ? 'pause-circle' : 'play-circle'} onClick={this.handlePlay}
									title={'播放/暂停'}
									disabled={songs.length == 0}
								/>
							</Col>
							<Col><Icon type="step-forward" onClick={() => this.handleStep('next')}
								title={'下一首'}
								disabled={songs.length == 0}
							     /></Col>
						</Row>
						<Row type="flex">
							<Col span={2}>{getMinute(currentTime)}</Col>
							<Col span={20}>
								<Slider
									tooltipVisible={false}
									disabled={!selSongKey && selSongKey !== 0}
									value={currentTime}
									min={0}
									max={duration}
									step={1}
									className={'processSlider'}
									onChange={(val) => this.setState({ currentTime: val }, () => {
										this.audioNode.currentTime = val;
									})}
								/>
							</Col>
							<Col span={2}>{getMinute(duration)}</Col>
						</Row>

					</Col>
				</Row>
				<p className={'arrow'} onClick={this.handleClick}>
					{fold ? '>' : '<'}
				</p>
			</div>
			<div className={'canvasCover ' + (stop ? 'hide' : '')}>
			</div>
			<canvas id="canvasContainer" width="0" height="40">
				您的浏览器暂不支持canvas，建议切换成谷歌浏览器
    		</canvas>
			<audio id="musicEngine" crossOrigin="anonymous" >
				您的浏览器暂不支持audio，建议切换成谷歌浏览器
    		</audio>
		</div>);
	}
}
export default Audio;