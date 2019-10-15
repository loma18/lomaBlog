/* eslint-disable */
let express = require("express");
let router = express.Router();
const request = require('request');


//获取新歌列表
router.get("/source/getHotSongs", (req, res) => {
    let url = 'http://m.kugou.com' + req.originalUrl.replace(req.path, '');
    req.pipe(request(url)).pipe(res);
});

//获取其他歌曲分类列表
router.get("/source/getOtherSongs/:id", (req, res) => {
    let url = 'http://m.kugou.com/plist/list/' + req.params.id + req.originalUrl.replace(req.path, '');
    req.pipe(request(url)).pipe(res);
});

//获取歌曲
router.get("/source/getSongs", (req, res) => {
    let url = 'http://m.kugou.com/app/i/getSongInfo.php' + req.originalUrl.replace(req.path, '');
    req.pipe(request(url)).pipe(res);
});

//获取歌曲分类列表
router.get("/source/getSongsList", (req, res) => {
    let url = 'http://m.kugou.com/plist/index&json=true' + req.originalUrl.replace(req.path, '');
    req.pipe(request(url)).pipe(res);
});

//搜索歌曲
router.get("/source/searchSongsList", (req, res) => {
    let url = 'http://mobilecdn.kugou.com/api/v3/search/song' + req.originalUrl.replace(req.path, '');
    req.pipe(request(url)).pipe(res);
});

//获取歌词所需id及accesskey
router.get("/source/getSongsAccessKey", (req, res) => {
    let url = 'http://krcs.kugou.com/search' + req.originalUrl.replace(req.path, '');
    req.pipe(request(url)).pipe(res);
});

//获取歌词
router.get("/source/getSongsLyrics", (req, res) => {
    let url = 'http://lyrics.kugou.com/download' + req.originalUrl.replace(req.path, '');
    req.pipe(request(url)).pipe(res);
});

//获取图片资源
router.get(/\/source\/getImage\/*/, (req, res) => {
    getSource(req, res, /source\/getImage\//);
});

//获取mp3资源
router.get(/\/source\/getMp3\/*/, (req, res) => {
    getSource(req, res, /source\/getMp3\//);
});

function getSource(req, res, regStr) {
    let reg = /(https?:\/\/)+(\s|\S)*?\//;
    let domain = req.originalUrl.match(reg)[0];
    let url = domain + req.originalUrl.replace(regStr, '');
    req.pipe(request(url)).pipe(res);
}
// router.get(/\/source\/*/, (req, res) => {
//     let url = req.originalUrl.replace(/\/source\//, '');
//     req.pipe(request(url)).pipe(res);
// });




module.exports = router;