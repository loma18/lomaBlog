CREATE DATABASE lomaBlog CHARSET=UTF8;
USE lomaBlog;
--创建用户表
CREATE TABLE lomaBlog_user(
uid    INT PRIMARY KEY AUTO_INCREMENT,
uname  VARCHAR(20) NOT NULL DEFAULT "",
upwd   VARCHAR(32) NOT NULL DEFAULT "",
nname  VARCHAR(20) NOT NULL DEFAULT "",
phno   VARCHAR(20) NOT NULL DEFAULT ""
);
SET NAMES GBK;
INSERT INTO lomaBlog_user VALUES
(null,'909622852',123456,'xiange18','15219033482'),
(null,'583780581',123456,'xiange','18826489001');

--创建个人分类表
CREATE TABLE lomaBlog_catalogue(
cid     INT PRIMARY KEY AUTO_INCREMENT,
cname   VARCHAR(100) NOT NULL DEFAULT ""
);

--创建文章和个人分类关联表
CREATE TABLE lomaBlog_article_catalogue(
id     INT PRIMARY KEY AUTO_INCREMENT,
aid    INT NOT NULL DEFAULT 0,
cid    INT NOT NULL DEFAULT 0
);

--创建文章表
-- status 表状态：0：草稿 1:已发布
-- articleType 表文章类型：original：原创 reprint:转载 code:代码
CREATE TABLE lomaBlog_article(
aid         INT PRIMARY KEY AUTO_INCREMENT,
title       VARCHAR(100) NOT NULL DEFAULT "",
content     TEXT(30000) NOT NULL DEFAULT "",
tags        VARCHAR(100) NOT NULL DEFAULT "",
status      INT NOT NULL DEFAULT 0,
createAt    bigint,
updateAt    bigint,
articleType VARCHAR(20),
likes       INT NOT NULL DEFAULT 0,
comments    INT NOT NULL DEFAULT 0,
views       INT NOT NULL DEFAULT 0 
);


--创建文章评论管理表
CREATE TABLE lomaBlog_article_comment(
id          INT PRIMARY KEY AUTO_INCREMENT,
aid         INT NOT NULL DEFAULT 0,
username    VARCHAR(20) NOT NULL DEFAULT "",
wechat      VARCHAR(50) NOT NULL DEFAULT "", 
email       VARCHAR(50) NOT NULL DEFAULT "", 
content     VARCHAR(1000) NOT NULL DEFAULT "", 
createAt    TIMESTAMP NOT NULL DEFAULT NOW()
);


--创建接口分组表
CREATE TABLE lomaBlog_interfaceGroup(
gid          INT PRIMARY KEY AUTO_INCREMENT,
title       VARCHAR(100) NOT NULL DEFAULT ""
);

--创建接口表
CREATE TABLE lomaBlog_interface(
id          INT PRIMARY KEY AUTO_INCREMENT,
moduleId    INT NOT NULL DEFAULT 0,
fieldList   VARCHAR(3000) NOT NULL DEFAULT "",
resFieldList   VARCHAR(3000) NOT NULL DEFAULT "",
paramType   VARCHAR(20) NOT NULL DEFAULT "",
methods     VARCHAR(20) NOT NULL DEFAULT "",
title       VARCHAR(100) NOT NULL DEFAULT "",
routePath   VARCHAR(100) NOT NULL DEFAULT ""
);



































































































