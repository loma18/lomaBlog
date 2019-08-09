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
 * 获取酷狗音乐列表
 * */
// export const GET_HOT_SONGS = 'http://m.kugou.com/';
export const GET_HOT_SONGS = '/kugou/getSongs';


