import React, { Component } from 'react';
import { Row, Col, Icon, Progress, Slider, Input } from 'antd';
import { fireGetRequest } from 'service/app';
import {
	GET_HOT_SONGS,
	GET_OTHER_SONGS,
	GET_SONGS,
	GET_SONGS_CATAGORIZE_LIST,
	SEARCH_SONGS_LIST,
	GET_SONGS_ACCESS_KEY,
	GET_SONGS_LYRICS
} from 'constants/api';
import { getMinute, openNotification, splitStr } from 'utils';
import './style.less';
import { isApp } from 'utils/functions';
import { Base64 } from 'js-base64';

const Search = Input.Search;

class Audio extends Component {
	constructor(props) {
		super(props);
		this.state = {
			songs: [], //播放列表
			songData: '', //当前播放歌曲信息
			lyrics: '', //当前播放歌曲歌词
			lyricsShow: true, //歌词显示状态
			selSongKey: 0, //当前播放歌曲序号
			currentTime: 0, //当前播放歌曲当前播放时长
			playMode: 'loop', //当前播放模式 loop:循环播放 random:随机播放
			fold: true, // 播放器是否折叠
			play: false, // 播放/暂停
			stop: true, // 停止播放
			volume: 0.3, // 媒体音量
			muted: false, // 静音状态
			panelSide: 'songs', //播放面板 songs:歌曲面,categorize:分类面
			categorizeList: [], //歌曲分类
			specialKey: '-1', //被选中歌曲分类排序key
			rotates: 0 //歌曲封面旋转角度
		};
	}

	initData = _this => {
		function Visualizer(audio, canvas) {
			// set up the hooks
			this.canvas = canvas;
			this.audio = audio;
			this.audioContext = new (window.AudioContext ||
				window.webkitAudioContext)();
			this.canvasContext = canvas.getContext('2d');

			this.WIDTH = canvas.width;
			this.HEIGHT = canvas.height;

			this.lyrics = '';

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

		Visualizer.prototype.init = function() {
			this.audioContext = null;
			this.analyser = null;
			this.source = null;
		};

		Visualizer.prototype.render = function(
			data,
			len,
			context,
			WIDTH,
			HEIGHT
		) {
			// clear the canvas
			context.clearRect(0, 0, WIDTH, HEIGHT);
			context.font = '25px Arial';
			let barWidth = (500 / len) * 5;
			let barHeight = 0;
			let x = (WIDTH - 600) / 2;
			let originX = x;
			let grd = context.createLinearGradient(0, 0, WIDTH, 0);
			grd.addColorStop(0, 'pink');
			grd.addColorStop(0.4, 'red');
			grd.addColorStop(0.6, 'orange');
			grd.addColorStop(1, 'pink');
			if (this.lyrics) {
				context.fillStyle = grd;
				context.fillText(
					this.lyrics,
					(WIDTH - context.measureText(this.lyrics).width) / 2,
					20
				);
				context.fill();
			}
			grd = context.createLinearGradient(0, 0, 0, HEIGHT);
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
				context.fillRect(
					x,
					50 - barHeight / 8,
					barWidth,
					barHeight / 8
				);
				context.fill();
				x += barWidth + 8;
				if (x > originX + 600) {
					return;
				}
			}
		};

		Visualizer.prototype.draw = function() {
			if (!this.audio.paused) {
				this.lyrics = _this.getCurLyrics(this.audio.currentTime);
				// console.log('dataArray', this.dataArray);
				let { rotates } = _this.state;
				rotates = rotates + 0.5 > 360 ? 0 : rotates + 0.5;
				_this.setState({
					currentTime: this.audio.currentTime,
					rotates
				});
				// update the data
				this.analyser.getByteFrequencyData(this.dataArray);
				// draw in the canvas
				this.render(
					this.dataArray,
					this.bufferLength,
					this.canvasContext,
					this.WIDTH,
					this.HEIGHT
				);
			}

			let self = this; // requestAnimationFrame binds global this
			this.frame = requestAnimationFrame(function() {
				self.draw();
			});
		};
		if (!this.visualizer) {
			let init = () => {
				this.canvasNode.width = document.documentElement.offsetWidth;
				this.visualizer = new Visualizer(
					this.audioNode,
					this.canvasNode
				);
				this.visualizer.draw();
			};
			init();
		} else {
			this.visualizer.draw();
		}
	};

	// 点击上一首/下一首
	handleStep = (type, key) => {
		let { selSongKey, songs, songData } = this.state;
		if (key != undefined && songs[key].album_id == songData.albumid) {
			return;
		}
		if (type == 'prev') {
			selSongKey = !selSongKey ? songs.length - 1 : selSongKey - 1;
		} else if (type == 'next') {
			selSongKey = selSongKey == songs.length - 1 ? 0 : selSongKey + 1;
		} else {
			selSongKey = key;
		}
		this.setState({ selSongKey, currentTime: 0 }, () => {
			this.fetchSong();
		});
	};

	//改变播放模式
	changePlayMode = () => {
		let { playMode } = this.state;
		playMode = playMode == 'loop' ? 'random' : 'loop';
		this.setState({ playMode });
	};

	// 播放/暂停
	handlePlay = () => {
		if (!this.visualizer) {
			this.fetchSong();
		}
		this.setState({ play: !this.state.play }, () => {
			if (this.state.play) {
				this.audioNode.play();
			} else {
				this.audioNode.pause();
			}
		});
	};

	// 点击展开/缩起播放器
	handleClick = e => {
		const { specialKey, play } = this.state;
		this.setState({ fold: !this.state.fold }, () => {
			if (!this.state.fold && !play) {
				this.fetchSongsData(specialKey);
			}
		});
	};

	//获取酷狗音乐列表
	fetchSongsData = specialKey => {
		let data = [];
		const { categorizeList } = this.state;
		this.setState({ specialKey }, () => {
			let url =
				specialKey == '-1'
					? GET_HOT_SONGS
					: GET_OTHER_SONGS +
					  '/' +
					  categorizeList[specialKey].specialid;
			fireGetRequest(url, { json: true })
				.then(res => {
					if (specialKey == '-1') {
						data = res.data ? res.data : [];
					} else {
						data =
							res.list && res.list.list && res.list.list.info
								? res.list.list.info
								: [];
					}
					this.setState(
						{ songs: data, selSongKey: 0, panelSide: 'songs' },
						() => {
							this.fetchSong();
						}
					);
				})
				.catch(err => console.log(err));
		});
	};

	//获取具体哪首歌播放地址
	fetchSong = () => {
		const { selSongKey, songs } = this.state;
		fireGetRequest(GET_SONGS, {
			cmd: 'playInfo',
			hash: songs[selSongKey].hash
		})
			.then(res => {
				if (res && res.url) {
					this.setState({ songData: res, play: true }, () => {
						this.audioNode.src =
							'/source/getMp3/' +
							this.state.songData.url.replace(
								'http://fs.open.kugou.com/',
								''
							);
						this.audioNode.play();
					});
				} else {
					openNotification(
						'error',
						'获取歌曲失败,自动跳转下一曲',
						res.error
					);
					this.handleStep('next');
				}
				// else {
				// 	this.setState({ songUrl: '' })
				// }
			})
			.catch(err => console.log(err));
		fireGetRequest(GET_SONGS_ACCESS_KEY, {
			ver: 1,
			client: 'mobi',
			hash: songs[selSongKey].hash
		})
			.then(res => {
				if (res.status === 200) {
					let candidates = res.candidates[0];
					return fireGetRequest(GET_SONGS_LYRICS, {
						ver: 1,
						client: 'pc',
						id: candidates.id,
						accesskey: candidates.accesskey,
						fmt: 'lrc',
						charset: 'utf8'
					});
				}
			})
			.then(res => {
				if (res.status === 200) {
					let content = Base64.decode(res.content);
					content = content
						.trim()
						.replace(/^\[(\S|\s)*offset:0]/, '');
					content = splitStr(content);
					this.setState({ lyrics: content });
				}
			})
			.catch(err => console.log(err));
	};

	// 停止播放
	handleStop = () => {
		let canvasContext = this.canvasNode.getContext('2d');
		canvasContext.clearRect(
			0,
			0,
			this.canvasNode.width,
			this.canvasNode.height
		);
		this.canvasNode.width = 0;
		this.audioNode.pause();
		this.audioNode.currentTime = 0;
		this.setState({ play: false, stop: true, currentTime: 0, rotates: 0 });
	};

	//改变歌曲面板
	handleChangePanel = () => {
		let { panelSide } = this.state;
		panelSide = panelSide == 'songs' ? 'categorize' : 'songs';
		this.setState({ panelSide }, () => {
			if (this.state.panelSide == 'categorize') {
				this.fetchCategorizeList();
			}
		});
	};

	//获取歌曲分类列表
	fetchCategorizeList = () => {
		fireGetRequest(GET_SONGS_CATAGORIZE_LIST)
			.then(res => {
				if (res.plist && res.plist.list && res.plist.list.info) {
					this.setState({ categorizeList: res.plist.list.info });
				} else {
					openNotification('error', '获取歌曲分类列表失败', res);
				}
			})
			.catch(err => console.log(err));
	};

	//全网搜索歌曲
	handleSearch = val => {
		if (!val) {
			this.fetchSongsData(this.state.specialKey);
			return;
		}
		fireGetRequest(SEARCH_SONGS_LIST, {
			format: 'json',
			keyword: val,
			page: 1,
			pagesize: 50,
			showtype: 1
		})
			.then(res => {
				if (res.data && res.data.info) {
					this.setState({ songs: res.data.info, selSongKey: 0 });
				}
			})
			.catch(err => console.log(err));
	};

	//获取当前歌词
	getCurLyrics = currentTime => {
		const { lyrics } = this.state;
		let nextTime = 0;
		for (let i = 0; i < lyrics.length; i++) {
			nextTime = i < lyrics.length - 2 ? lyrics[i + 1].start : 1000;
			if (currentTime >= lyrics[i].start && currentTime <= nextTime) {
				return lyrics[i].lyrics;
			}
		}
	};

	//关闭歌词
	handleCloseLyrics = () => {
		const { lyricsShow } = this.state;
		this.setState({ lyricsShow: !lyricsShow }, () => {
			if (this.state.lyricsShow) {
				this.canvasNode.classList.remove('hide');
			} else {
				this.canvasNode.classList.add('hide');
			}
		});
	};

	initAudioData = () => {
		const { volume } = this.state;
		this.audioNode.volume = volume;
		// this.audioNode.loop = true;
	};

	listenEvent = () => {
		this.audioNode.onpause = () => {
			if (this.audioNode.ended) {
				//判断是否结束，如果结束，则播放下一首歌
				if (this.state.playMode == 'random') {
					const { songs } = this.state;
					this.setState(
						{
							selSongKey: Math.floor(Math.random() * songs.length)
						},
						() => {
							this.handleStep('next');
						}
					);
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
		document.onkeydown = e => {
			if (!this.state.fold && e.keyCode == 32) {
				e.preventDefault();
				this.handlePlay();
			}
		};
		// window.onscroll = (e) => {
		// 	this.setState({ fold: true });
		// };
	};

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
			playMode,
			rotates,
			panelSide,
			specialKey,
			categorizeList,
			lyricsShow
		} = this.state;
		let fileInfo = [],
			imgUrl =
				songData.album_img &&
				songData.album_img.replace(/\/\{size\}/, ''),
			duration = songs[selSongKey] ? songs[selSongKey].duration : 0;
		return (
			<div
				id={'lomaBlog-audio'}
				className={fold ? 'containerFold' : 'containerUnfold'}
			>
				<div className={'operatePanel ' + (fold ? '' : 'unfold')}>
					<div className={'songPanel'}>
						<Row className={'panelHeader'} type='flex' gutter={30}>
							<Col
								className={'curType'}
								title={
									specialKey == -1
										? '酷狗新歌榜'
										: categorizeList[specialKey].specialname
								}
							>
								{specialKey == -1
									? '酷狗新歌榜'
									: categorizeList[specialKey].specialname}
							</Col>
							<Col
								onClick={this.handleChangePanel}
								className={'categorySel'}
							>
								{panelSide == 'songs' ? '歌曲分类' : '返回列表'}
							</Col>
							<Col className={'searchSongs'}>
								<Search
									placeholder='全网搜索...'
									onSearch={this.handleSearch}
								/>
							</Col>
						</Row>
						<ul
							className={'categorizeList'}
							style={{
								display: panelSide == 'songs' ? 'none' : 'flex'
							}}
						>
							<li
								onClick={() => this.fetchSongsData('-1')}
								className={specialKey == '-1' ? 'active' : ''}
							>
								<img
									src={require('../../../assets/logo.jpg')}
									alt='酷狗新歌榜'
									title='酷狗新歌榜'
								/>
								<p title={'酷狗新歌榜'}>酷狗新歌榜</p>
							</li>
							{categorizeList.map((item, key) => {
								return (
									<li
										key={key}
										onClick={() => this.fetchSongsData(key)}
										className={
											specialKey == key ? 'active' : ''
										}
									>
										<img
											src={
												'/source/getImage/' +
												item.imgurl
													.replace(
														'http://imge.kugou.com/',
														''
													)
													.replace(/\/\{size\}/, '')
											}
											alt={item.specialname}
											title={item.specialname}
										/>
										<p title={item.specialname}>
											{item.specialname}
										</p>
									</li>
								);
							})}
						</ul>
						<ul
							className={'songsList'}
							style={{
								display: panelSide == 'songs' ? 'block' : 'none'
							}}
						>
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
										onClick={() =>
											this.handleStep('current', key)
										}
										className={
											key === selSongKey
												? 'activeSong'
												: ''
										}
									>
										<span>{key + 1}</span>
										<span>{fileInfo[1]}</span>
										<span>{getMinute(item.duration)}</span>
										<span>{fileInfo[0]}</span>
									</li>
								);
							})}
						</ul>
					</div>
					<Row type='flex' justify='space-between'>
						<Col
							className={'left'}
							style={{
								backgroundImage: imgUrl
									? `url(/source/getImage/${imgUrl.replace(
											'http://imge.kugou.com/',
											''
									  )})`
									: `url(${require('../../../assets/logo.jpg')})`,
								transform: `rotate(${rotates}deg)`
							}}
						></Col>
						{!isApp() && (
							<Col className={'center'}>
								<h3 className={'songName'}>
									{songData.songName}
								</h3>
								<p className={'singer'}>
									{songData.singerName}
								</p>
								{/* <p className={'songType'}>{}</p> */}
								<p>
									<span onClick={this.handleCloseLyrics}>
										{lyricsShow ? '关闭歌词' : '显示歌词'}
									</span>
								</p>
							</Col>
						)}
						<Col className={'right'}>
							<Row type='flex' justify='space-between'>
								<Col
									className={
										'topLeft ' + (muted ? 'muted' : '')
									}
								>
									<Icon
										type='sound'
										onClick={() =>
											this.setState(
												{ muted: !muted },
												() => {
													this.audioNode.muted = this.state.muted;
												}
											)
										}
									/>
									<Slider
										tooltipVisible={false}
										value={muted ? 0 : volume}
										min={0}
										max={1}
										step={0.01}
										className={'volumnSlider'}
										onChange={val =>
											this.setState(
												{ volume: val, muted: false },
												() => {
													this.audioNode.volume = val;
													this.audioNode.muted = false;
												}
											)
										}
									/>
								</Col>
								<Col>
									<Icon
										type={
											playMode == 'loop'
												? 'retweet'
												: 'shake'
										}
										onClick={this.changePlayMode}
									/>
								</Col>
							</Row>
							<Row type='flex' justify='center' gutter={10}>
								<Col className={'turnOff'}>
									<i
										onClick={() => this.handleStop()}
										title={'停止'}
									/>
								</Col>
								<Col>
									<Icon
										type='step-backward'
										onClick={() => this.handleStep('prev')}
										title={'上一首'}
										disabled={songs.length == 0}
									/>
								</Col>
								<Col>
									<Icon
										type={
											play
												? 'pause-circle'
												: 'play-circle'
										}
										onClick={this.handlePlay}
										title={'播放/暂停'}
										disabled={songs.length == 0}
									/>
								</Col>
								<Col>
									<Icon
										type='step-forward'
										onClick={() => this.handleStep('next')}
										title={'下一首'}
										disabled={songs.length == 0}
									/>
								</Col>
							</Row>
							<Row type='flex'>
								<Col span={3}>{getMinute(currentTime)}</Col>
								<Col span={17}>
									<Slider
										tooltipVisible={false}
										disabled={
											!selSongKey && selSongKey !== 0
										}
										value={currentTime}
										min={0}
										max={duration}
										step={1}
										className={'processSlider'}
										onChange={val =>
											this.setState(
												{ currentTime: val },
												() => {
													this.audioNode.currentTime = val;
												}
											)
										}
									/>
								</Col>
								<Col span={4}>{getMinute(duration)}</Col>
							</Row>
						</Col>
					</Row>
					<p className={'arrow'} onClick={this.handleClick}>
						{fold ? '>' : '<'}
					</p>
				</div>
				<div
					className={
						'canvasCover ' + (stop || !lyricsShow ? 'hide' : '')
					}
				></div>
				<canvas id='canvasContainer' width='0' height='50'>
					您的浏览器暂不支持canvas，建议切换成谷歌浏览器
				</canvas>
				<audio id='musicEngine' crossOrigin='anonymous'>
					您的浏览器暂不支持audio，建议切换成谷歌浏览器
				</audio>
			</div>
		);
	}
}
export default Audio;
