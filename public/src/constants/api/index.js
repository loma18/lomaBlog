// 登陆
export const USER_LOGIN = '/login';

/** ****************************************后台管理 ***************************************************/
/**
 * 博客增删改查
 */
export const SAVE_BLOG = '/blog/save'; // 保存修改博客

export const DELETE_BLOG = '/blog/deleteArticle'; // 删除博客

export const GET_CATALOGUE_LIST = '/getCatalogueList'; // 获取个人分类

export const SAVE_CATALOGUE = '/catalogue/save'; // 保存修改个人分类

export const DELETE_CATALOGUE = '/catalogue/delete'; // 删除个人分类

export const GET_FILTER_LIST = '/blog/getFilterList'; // 根据条件筛选获取博客列表

export const GET_ARTICLE_BY_ID = '/blog/getArticle'; // 根据id获取博客

export const CREATE_ARTICLE_COMMENT = '/blog/createArticleComment'; // 新增博客评论

export const GET_ARTICLE_COMMENT_BY_ID = '/blog/getArticleComment'; // 根据id获取博客评论列表

export const GET_ARTICLE_TYPE_COUNT = '/blog/getArticleTypeCount'; // 获取文章分类各自数量

export const GET_ATTACHMENT_LIST = '/blog/attachment/getList'; // 获取博客附件列表

export const DOWNLOAD_ATTACHMENT_BY_ID = '/blog/attachment/download'; // 下载博客附件

/**
 * 后台接口
 */
export const GET_INTERFACE_MODULE_LIST = '/interface/getModuleList'; // 获取模块列表

export const SAVE_INTERFACE_MODULE = '/interface/module/save'; // 保存/修改模块列表

export const DELETE_INTERFACE_MODULE = '/interface/module/delete'; // 删除模块

export const SAVE_INTERFACE = '/interface/save'; // 保存/修改接口

export const GET_INTERFACE_LIST = '/interface/getList'; // 获取模块及接口

export const GET_INTERFACE_DETAILE_BY_ID = '/interface/getDetailById'; // 获取接口详情

export const DELETE_INTERFACE_BY_ID = '/interface/delete'; // 删除接口

/**
 * 微语
 */
export const SAVE_WHISPER = '/whisper/save'; //保存微语

export const DELETE_WHISPER = '/whisper/delete'; //删除微语

export const GET_WHISPER_LIST = '/whisper/getList'; //获取微语列表

/**
 * 评论管理
 */
export const GET_COMMENT_LIST = '/comment/getList'; //获取全部评论

export const DELETE_COMMENT_BY_ID = '/comment/deleteById'; //删除评论

/**
 * 获取酷狗音乐列表
 * */
export const GET_HOT_SONGS = '/source/getHotSongs'; //获取新歌列表

export const GET_OTHER_SONGS = '/source/getOtherSongs'; //获取其他歌曲分类列表

export const GET_SONGS = '/source/getSongs'; //获取歌曲

export const GET_SONGS_CATAGORIZE_LIST = '/source/getSongsList'; //获取歌曲分类列表

export const SEARCH_SONGS_LIST = '/source/searchSongsList'; //搜索歌曲

export const GET_SONGS_ACCESS_KEY = '/source/getSongsAccessKey'; //获取歌词所需id及accesskey

export const GET_SONGS_LYRICS = '/source/getSongsLyrics'; //获取歌词
