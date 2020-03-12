/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./App/grid/canvas.grid.core.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./App/component/input.ts":
/*!********************************!*\
  !*** ./App/component/input.ts ***!
  \********************************/
/*! exports provided: Input */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Input", function() { return Input; });
var Input = /** @class */ (function () {
    function Input() {
    }
    Input.prototype.init = function (formName, rect) {
        this.rect = rect;
        this.container = document.getElementById('eventOf' + formName);
        this.cellInput = document.createElement('input');
        this.cellInput.setAttribute('id', 'cellInput');
        this.container.appendChild(this.cellInput);
        this.initEvent();
    };
    Input.prototype.show = function (options) {
        this.cellInput.style.display = 'block';
        this.render(options);
        if (this.afterInputInit) {
            this.afterInputInit(this.target);
        }
    };
    Input.prototype.hide = function () {
        this.cellInput.style.display = 'none';
    };
    Input.prototype.afterEvent = function () {
        var result = true;
        this.target.value = this.cellInput.value;
        this.target.rect.x = 0;
        if (this.afterInput) {
            result = this.afterInput(this.target);
        }
        if (!result) {
            this.cellInput.value = this.target.row[this.target.column.ID] != undefined ? this.target.row[this.target.column.ID] : "";
        }
        this.container.focus();
    };
    Input.prototype.initEvent = function () {
        var self = this;
        this.cellInput.addEventListener('blur', function () {
            if (self.state == 'keydown') {
                self.state = '';
                return;
            }
            self.afterEvent();
        });
        this.cellInput.addEventListener('keydown', function (e) {
            if (e.keyCode == 13 || e.keyCode == 9) {
                self.state = 'keydown';
                self.afterEvent();
                self.hide();
            }
            else if (e.keyCode == 27) {
                self.state = 'keydown';
                self.container.focus();
                self.hide();
            }
            else {
                e.stopPropagation();
            }
        });
        this.cellInput.addEventListener('keyup', function (e) {
            e.stopPropagation();
        });
        this.cellInput.addEventListener('click', function (e) {
            e.stopPropagation();
        });
        this.cellInput.addEventListener('mousedown', function (e) {
            e.stopPropagation();
        });
        this.cellInput.addEventListener('mousemove', function (e) {
            e.stopPropagation();
        });
        this.cellInput.addEventListener('paste', function (e) {
            e.stopPropagation();
        });
    };
    Input.prototype.render = function (options) {
        var maxLength = options.maxLength, rect = this.rect, scrollNum = parseInt(rect.scrollTop / rect.lineHeight + ''), target = this.target, top, left, value;
        if (target.column.isFrozen) {
            left = target.column.x;
        }
        else {
            left = target.column.x - rect.scrollLeft;
            left = left < rect.frozenWidth ? rect.frozenWidth : left;
        }
        this.cellInput.style.height = options.outBorder ? this.target.column.height + 'px' : this.target.rect.height + 'px';
        this.cellInput.style.width = options.outBorder ? this.target.column.width + 'px' : this.target.rect.width + 'px';
        this.cellInput.style.textIndent = this.target.column.textIndent - 2 + 'px';
        top = (target.row.showNo - scrollNum - 1) * rect.lineHeight + rect.headerHeight;
        top = top > rect.headerHeight ? top : rect.headerHeight;
        this.cellInput.style.top = options.outBorder ? top + 'px' : top + this.target.column.inputStyle.padding + 'px';
        this.cellInput.style.left = options.outBorder ? left + 'px' : left + this.target.column.inputStyle.left + 1 + 'px';
        value = options.text != undefined ? options.text : this.target.row[this.target.column.ID];
        if (value == undefined) {
            value = '';
        }
        this.cellInput.value = '' + value;
        if (maxLength) {
            this.cellInput.setAttribute('maxlength', maxLength);
        }
        this.cellInput.focus();
        if (options.allSelected) {
            this.cellInput.select();
        }
    };
    return Input;
}());



/***/ }),

/***/ "./App/component/pageSelect.ts":
/*!*************************************!*\
  !*** ./App/component/pageSelect.ts ***!
  \*************************************/
/*! exports provided: PageSelect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageSelect", function() { return PageSelect; });
var PageSelect = /** @class */ (function () {
    function PageSelect(form) {
        this.form = form;
    }
    PageSelect.prototype.init = function (id, options) {
        this.options = options;
        var outContainer = document.getElementById(id);
        this.date = this.options.date || this.testData();
        var container = document.createElement("div"), pageGoTo, pageNum, pageSize, pageMsg;
        container.setAttribute('id', 'pager-selector');
        pageGoTo = this.initGoTo();
        pageNum = this.initNum();
        pageSize = this.initSize();
        pageMsg = this.initMsg(this.date.length);
        container.appendChild(pageGoTo);
        container.appendChild(pageNum);
        container.appendChild(pageSize);
        container.appendChild(pageMsg);
        outContainer.appendChild(container);
        this.updatePageNum(true);
        this.initEvent();
    };
    PageSelect.prototype.updateData = function (date) {
        this.date = date;
        this.updateMsg(this.date.length);
    };
    PageSelect.prototype.updatePageNum = function (firstLoad, status, index, date) {
        var pageNum = document.getElementById("pager-number"), prevPage = document.createElement("div"), nextPage = document.createElement("div"), dotPage = document.createElement("div"), select = document.getElementsByClassName("pageSizeSelect")[0], indexValue = select.options[select.options.selectedIndex].value, len = this.date.length, num = Math.ceil(len / indexValue), numPage;
        this.indexSelectValue = indexValue;
        pageNum.setAttribute('id', 'pager-number');
        prevPage.setAttribute("class", "prevPage");
        nextPage.setAttribute("class", "nextPage");
        dotPage.setAttribute("class", "dotPage");
        prevPage.innerHTML = "<<";
        nextPage.innerHTML = ">>";
        dotPage.innerHTML = "...";
        this.totalNum = num;
        pageNum.innerHTML = "";
        if (index) {
            index = parseInt(index);
        }
        if (num <= 8) {
            if (firstLoad || index == 1) {
                index = 1;
            }
            else {
                pageNum.appendChild(prevPage);
            }
            for (var i = 0; i < num; i++) {
                numPage = document.createElement("div");
                numPage.setAttribute("value", i + 1);
                numPage.setAttribute("class", "numPage");
                if (i == (index - 1)) {
                    numPage.classList.add("indexNum");
                }
                numPage.innerHTML = i + 1;
                pageNum.appendChild(numPage);
            }
            if (index != num) {
                pageNum.appendChild(nextPage);
            }
        }
        else if (num > 8) {
            if (firstLoad || index == 1) {
                index = 1;
            }
            else {
                pageNum.appendChild(prevPage);
            }
            if (firstLoad || status == 1) {
                for (var i1 = 0; i1 < 7; i1++) {
                    numPage = document.createElement("div");
                    numPage.setAttribute("value", i1 + 1);
                    numPage.setAttribute("class", "numPage");
                    if (i1 == (index - 1)) {
                        numPage.classList.add("indexNum");
                    }
                    numPage.innerHTML = i1 + 1;
                    pageNum.appendChild(numPage);
                }
                pageNum.appendChild(dotPage);
                numPage = document.createElement("div");
                numPage.setAttribute("value", num);
                numPage.setAttribute("class", "numPage");
                numPage.innerHTML = num;
                pageNum.appendChild(numPage);
                pageNum.appendChild(nextPage);
            }
            else if (status == 2) {
                numPage = document.createElement("div");
                numPage.setAttribute("value", 1);
                numPage.setAttribute("class", "numPage");
                numPage.innerHTML = 1;
                pageNum.appendChild(numPage);
                pageNum.appendChild(dotPage);
                for (var i2 = index - 2, len1 = index + 3; i2 < len1; i2++) {
                    numPage = document.createElement("div");
                    numPage.setAttribute("value", i2 + 1);
                    numPage.setAttribute("class", "numPage");
                    if (i2 == (index - 1)) {
                        numPage.classList.add("indexNum");
                    }
                    numPage.innerHTML = i2 + 1;
                    pageNum.appendChild(numPage);
                }
                dotPage = document.createElement("div");
                dotPage.setAttribute("class", "dotPage");
                dotPage.innerHTML = "...";
                pageNum.appendChild(dotPage);
                numPage = document.createElement("div");
                numPage.setAttribute("value", num);
                numPage.setAttribute("class", "numPage");
                numPage.innerHTML = num;
                pageNum.appendChild(numPage);
                pageNum.appendChild(nextPage);
            }
            else if (status == 3) {
                numPage = document.createElement("div");
                numPage.setAttribute("value", 1);
                numPage.setAttribute("class", "numPage");
                numPage.innerHTML = 1;
                pageNum.appendChild(numPage);
                pageNum.appendChild(dotPage);
                for (var i3 = num - 6; i3 < num; i3++) {
                    numPage = document.createElement("div");
                    numPage.setAttribute("value", i3 + 1);
                    numPage.setAttribute("class", "numPage");
                    if (i3 == (index - 1)) {
                        numPage.classList.add("indexNum");
                    }
                    numPage.innerHTML = i3 + 1;
                    pageNum.appendChild(numPage);
                }
                if (index != num) {
                    pageNum.appendChild(nextPage);
                }
            }
        }
        document.getElementsByClassName("pageinput")[0]["value"] = index;
        if (date) {
            var arr = [];
            for (var i4 = (index - 1) * parseInt(indexValue); i4 < (index * parseInt(indexValue)); i4++) {
                if (!date[i4]) {
                    break;
                }
                arr.push(date[i4]);
            }
            date = arr;
            return date;
        }
    };
    PageSelect.prototype.initGoTo = function () {
        var pageGoTo = document.createElement("div"), input = document.createElement("input"), goToPage = document.createElement("div");
        pageGoTo.setAttribute('id', 'pager-goto');
        input.setAttribute("class", "pageinput");
        goToPage.setAttribute("class", "goToPage");
        goToPage.innerHTML = "转至";
        pageGoTo.appendChild(input);
        pageGoTo.appendChild(goToPage);
        return pageGoTo;
    };
    PageSelect.prototype.initNum = function () {
        var pageNum = document.createElement("div");
        pageNum.setAttribute('id', 'pager-number');
        return pageNum;
    };
    PageSelect.prototype.initSize = function () {
        var pageSize = document.createElement("div"), htmlStr = '每页' + this.initOptions().outerHTML + '条';
        pageSize.setAttribute('id', 'pager-size');
        pageSize.innerHTML = htmlStr;
        return pageSize;
    };
    PageSelect.prototype.initOptions = function () {
        var select = document.createElement('select'), options, text, pageSizeOptions = this.options.selectSizeOptions || [10, 15, 20, 30, 100];
        select.setAttribute("class", "pageSizeSelect");
        for (var i = 0, len = pageSizeOptions.length; i < len; i++) {
            options = document.createElement('option');
            options.setAttribute('class', 'pageSizeOptions');
            options.setAttribute('value', pageSizeOptions[i]);
            text = document.createTextNode(pageSizeOptions[i] + "");
            options.appendChild(text);
            select.appendChild(options);
        }
        return select;
    };
    PageSelect.prototype.updateMsg = function (total) {
        var htmlStr = '总共' + total + '条';
        document.getElementById("pager-msg").innerHTML = htmlStr;
    };
    PageSelect.prototype.initMsg = function (total) {
        var pageMsg = document.createElement("div"), htmlStr = '总共' + total + '条';
        pageMsg.setAttribute('id', 'pager-msg');
        pageMsg.innerHTML = htmlStr;
        return pageMsg;
    };
    PageSelect.prototype.testData = function () {
        var arr = [];
        for (var i = 0; i < 1000; i++) {
            arr.push(i);
        }
        return arr;
    };
    PageSelect.prototype.initEvent = function () {
        var self = this;
        var container = document.getElementById("pager-selector");
        container.addEventListener("click", function (e) {
            e.stopPropagation();
            var target = e.target, targetValue, oldValue = parseInt(document.getElementsByClassName("indexNum")[0].getAttribute("value"));
            if (!target) {
                return;
            }
            if (target.className == "numPage") {
                targetValue = parseInt(target.getAttribute("value"));
            }
            else if (target.className == "prevPage") {
                targetValue = oldValue;
                targetValue -= 1;
            }
            else if (target.className == "nextPage") {
                targetValue = oldValue;
                targetValue += 1;
            }
            else if (target.className == "pageSizeSelect") {
                if (self.indexSelectValue == target.options[target.options.selectedIndex].value) {
                    return;
                }
                self.form.form.dataView.rows = self.updatePageNum(true, null, null, self.date);
                self.form.form.update();
            }
            else if (target.className == "goToPage") {
                targetValue = parseInt(document.getElementsByClassName("pageinput")[0]["value"]);
            }
            if (!targetValue || targetValue == oldValue) {
                return;
            }
            self.clearCheckFlag();
            if (targetValue < 5) {
                self.form.form.dataView.rows = self.updatePageNum(false, 1, targetValue, self.date);
            }
            else if (4 < targetValue && targetValue < self.totalNum - 4) {
                self.form.form.dataView.rows = self.updatePageNum(false, 2, targetValue, self.date);
            }
            else {
                self.form.form.dataView.rows = self.updatePageNum(false, 3, targetValue, self.date);
            }
            self.form.form.update();
        });
    };
    PageSelect.prototype.clearCheckFlag = function () {
        var list = document.getElementsByClassName("numPage");
        for (var i = 0, len = list.length; i < len; i++) {
            list[i].classList.remove("indexNum");
        }
    };
    return PageSelect;
}());



/***/ }),

/***/ "./App/component/scope.ts":
/*!********************************!*\
  !*** ./App/component/scope.ts ***!
  \********************************/
/*! exports provided: Scope */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Scope", function() { return Scope; });
var Scope = /** @class */ (function () {
    function Scope(containerId, formName, rect) {
        this.state = 'solid';
        this.container = document.getElementById(containerId);
        this.rect = rect;
        this.init(formName);
    }
    Scope.prototype.changeState = function (type) {
        if (type == 'none') {
            this.scopeDiv.style["border-style"] = 'solid';
            this.state = 'solid';
            return;
        }
        this.scopeDiv.style["border-style"] = 'dashed';
        this.state = 'dashed';
    };
    Scope.prototype.showScope = function (firstTarget, lastTarget, treeWidth) {
        lastTarget = lastTarget ? lastTarget : firstTarget;
        var rect = this.rect, height = this.container.clientHeight, width = this.container.clientWidth, scrollNum = parseInt(rect.scrollTop / rect.lineHeight + ''), top, bottom, left, right, leftTarget = firstTarget, rightTarget = lastTarget, topTarget = firstTarget, bottomTarget = lastTarget;
        if (firstTarget.column.x - lastTarget.column.x > 0) {
            leftTarget = lastTarget;
            rightTarget = firstTarget;
        }
        if (firstTarget.row.showNo > lastTarget.row.showNo) {
            topTarget = lastTarget;
            bottomTarget = firstTarget;
        }
        top = (topTarget.row.showNo - scrollNum - 1) * rect.lineHeight + rect.headerHeight;
        top = top > rect.headerHeight ? top : rect.headerHeight;
        bottom = height - (bottomTarget.row.showNo - scrollNum) * rect.lineHeight - rect.headerHeight;
        bottom = bottom < 0 ? 0 : bottom;
        if (leftTarget.column.isFrozen) {
            left = leftTarget.column.x;
        }
        else {
            left = leftTarget.column.x - rect.scrollLeft;
            left = left < rect.frozenWidth ? rect.frozenWidth : left;
        }
        if (rightTarget.column.isFrozen) {
            right = width - (rightTarget.column.x + rightTarget.column.width);
        }
        else {
            right = width - (rightTarget.column.x + rightTarget.column.width - rect.scrollLeft);
        }
        right = right < 0 ? 0 : right;
        if (top + bottom >= height) {
            this.scopeDiv.style.display = 'none';
            this.scopeLine.style.display = 'none';
            return;
        }
        else {
            this.scopeDiv.style.display = 'block';
            this.scopeLine.style.display = 'block';
        }
        if (left + right >= width) {
            this.scopeDiv.style.display = 'none';
        }
        this.scopeDiv.style.top = top + 'px';
        this.scopeLine.style.top = top + 'px';
        var scopeWidth = width - (left + right);
        this.scopeDiv.style.width = scopeWidth + 'px';
        this.scopeDiv.style.bottom = bottom + 'px';
        this.scopeLine.style.bottom = bottom + 'px';
        this.scopeDiv.style.left = left + 'px';
        this.scopeLine.style.left = treeWidth + 'px';
        this.scopeDiv.style.border = '1px ' + this.state + ' black';
        this.scopeLine.style["border-style"] = '';
        this.scopeLine.style.border = "1px solid black";
        this.scopeLine.style.position = "absolute";
        this.scopeDiv.style.position = "absolute";
    };
    Scope.prototype.destory = function (name) {
        var scopeDiv = document.getElementsByClassName('scopeDiv'), scopeLine = document.getElementsByClassName('scopeLine');
        for (var i = 0; i < scopeDiv.length; i++) {
            if (scopeDiv[i].getAttribute('id') == name + 'scopeDiv') {
                continue;
            }
            if (scopeDiv && scopeDiv[i].parentNode) {
                scopeDiv[i]['style'].display = 'none';
            }
            if (scopeLine && scopeLine[i]) {
                scopeLine[i]['style'].display = 'none';
            }
        }
    };
    Scope.prototype.init = function (formName) {
        var copyArea = document.createElement('textarea'), scopeDiv = document.createElement('div'), scopeLine = document.createElement('div');
        copyArea.className = 'copyArea';
        scopeDiv.className = 'scopeDiv';
        scopeLine.className = 'scopeLine';
        copyArea.setAttribute('id', 'copyAreaOf' + formName);
        scopeDiv.setAttribute('id', 'scopeDiv' + formName);
        scopeLine.setAttribute('id', 'scopeLine' + formName);
        scopeDiv.style.display = 'none';
        scopeLine.style.display = 'none';
        scopeDiv.onselectstart = function (e) {
            e.preventDefault();
            return false;
        };
        scopeLine.onselectstart = function (e) {
            e.preventDefault();
            return false;
        };
        this.scopeDiv = scopeDiv;
        this.scopeLine = scopeLine;
        this.container.appendChild(copyArea);
        this.container.appendChild(scopeDiv);
        this.container.appendChild(scopeLine);
    };
    return Scope;
}());



/***/ }),

/***/ "./App/component/select.ts":
/*!*********************************!*\
  !*** ./App/component/select.ts ***!
  \*********************************/
/*! exports provided: Select */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Select", function() { return Select; });
var Select = /** @class */ (function () {
    function Select(containerId, formName) {
        this.container = document.getElementById(containerId);
        this.formName = formName;
        this.init();
    }
    Select.prototype.show = function (target) {
        this.target = target;
        this.options = this.initSelectData ? this.initSelectData(target) : undefined;
        if (!this.options || this.options.result == false || !this.options.data) {
            return;
        }
        this.render();
    };
    Select.prototype.hide = function () {
        this.cellSelect.innerText = '';
        this.cellSelect.style.display = 'none';
    };
    Select.prototype.init = function () {
        var ul = document.createElement('ul');
        ul.setAttribute('id', 'cellSelectOf' + this.formName);
        ul.className = 'cellSelect';
        ul.style.display = 'none';
        this.cellSelect = ul;
        this.container.appendChild(this.cellSelect);
        this.initEvent();
        // this.render();
    };
    Select.prototype.initEvent = function () {
        var self = this;
        this.cellSelect.addEventListener('click', function (e) {
            e.stopPropagation();
            var result = true;
            if (e.target.nodeName.toLowerCase() == "li") {
                self.target.index = e.target.getAttribute("key");
                self.afterSelected(self.target);
                self.hide();
            }
            self.container.focus();
        });
        // this.Input.cellInput.addEventListener('input', function (e) {
        //     // _self.Select.matchData(this.value, target);
        // });
    };
    Select.prototype.selectByKeyboard = function () {
        // console.log('test');
    };
    Select.prototype.matchData = function (str) {
        var selectOption = this.cellSelect.children;
        for (var i = 0, len = selectOption.length; i < len; i++) {
            if (selectOption[i].innerText.indexOf(str) < 0) {
                selectOption[i].style.display = 'none';
            }
        }
    };
    Select.prototype.render = function () {
        var data = this.options.data, li, id = this.options.id, title = this.options.title;
        for (var i = 0, len = data.length; i < len; i++) {
            li = document.createElement('li');
            li.className = 'cellOption';
            li.innerText = data[i][title];
            li.setAttribute('title', data[i][title]);
            li.setAttribute('key', data[i][id]);
            this.cellSelect.appendChild(li);
        }
        this.cellSelect.style.display = 'block';
        this.cellSelect.style.width = this.target.rect.width + "px";
        this.cellSelect.style.left = this.target.rect.left + 1 + 'px';
        this.cellSelect.style.top = this.target.rect.top + 1 + 'px';
    };
    return Select;
}());



/***/ }),

/***/ "./App/component/toolTip.ts":
/*!**********************************!*\
  !*** ./App/component/toolTip.ts ***!
  \**********************************/
/*! exports provided: ToolTip */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ToolTip", function() { return ToolTip; });
/**
 * 此文件处理表格控件中提示框相关的事件
 */
var ToolTip = /** @class */ (function () {
    function ToolTip() {
    }
    ToolTip.prototype.init = function (id) {
        this.container = document.querySelector('#' + id);
        this.batchBox = this.container.parentElement;
        this.batchBox.style.position = "relative";
        this.strTip = this.beforeToolTipShow ? this.beforeToolTipShow(this.target) : '';
        if (this.strTip) {
            this.render();
        }
    };
    ToolTip.prototype.destory = function () {
        var toolTip = document.getElementById('toolTip');
        if (toolTip && toolTip.parentNode) {
            toolTip.parentNode.removeChild(toolTip);
        }
    };
    ToolTip.prototype.render = function () {
        var toolTip = document.createElement('div'), x, y, width, height, clientWidth, clientHeight;
        toolTip.setAttribute('id', 'toolTip');
        toolTip.style.position = "absolute";
        toolTip.style.zIndex = '1000';
        x = this.target.rect.clickX ? this.target.rect.clickX : this.target.rect.x;
        y = this.target.rect.clickY ? this.target.rect.clickY : this.target.rect.y;
        width = this.batchBox.clientWidth;
        height = this.batchBox.clientHeight;
        clientWidth = document.documentElement.clientWidth;
        clientHeight = document.documentElement.clientHeight;
        toolTip.innerText = this.strTip;
        this.batchBox.appendChild(toolTip);
        this.toolTip = document.querySelector('#toolTip');
        if (!this.target.toolTipsNoUp && (this.target.clientY + this.toolTip.getBoundingClientRect().height + 18 > clientHeight || y + this.toolTip.getBoundingClientRect().height + 18 > height)) {
            if (y - this.toolTip.getBoundingClientRect().height < 0) {
                this.toolTip.style.bottom = 10 + "px";
            }
            else {
                this.toolTip.style.bottom = height - y + 10 + "px";
            }
        }
        else {
            this.toolTip.style.top = y + 16 + "px";
        }
        if (this.target.clientX + this.toolTip.getBoundingClientRect().width > clientWidth || x + this.toolTip.getBoundingClientRect().width > width) {
            if (x - this.toolTip.getBoundingClientRect().width < 0) {
                this.toolTip.style.right = 0;
            }
            else {
                this.toolTip.style.right = width - x + "px";
            }
        }
        else {
            this.toolTip.style.left = x + "px";
        }
        //如果窗口缩小，可能会使tips在左侧显示，影响序号列tips显示
        if (x < 50 || this.target.clientX < 50) {
            this.toolTip.style.right = "";
            this.toolTip.style.left = x + "px";
        }
    };
    return ToolTip;
}());



/***/ }),

/***/ "./App/grid/canvas.grid.core.ts":
/*!**************************************!*\
  !*** ./App/grid/canvas.grid.core.ts ***!
  \**************************************/
/*! exports provided: CanvasGrid */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CanvasGrid", function() { return CanvasGrid; });
/* harmony import */ var _canvas_grid_draw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvas.grid.draw */ "./App/grid/canvas.grid.draw.ts");
/* harmony import */ var _canvas_grid_events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./canvas.grid.events */ "./App/grid/canvas.grid.events.ts");
/* harmony import */ var _canvas_grid_dataView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./canvas.grid.dataView */ "./App/grid/canvas.grid.dataView.ts");
/* harmony import */ var _canvas_grid_fileSaver__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./canvas.grid.fileSaver */ "./App/grid/canvas.grid.fileSaver.ts");




var CanvasGrid = /** @class */ (function () {
    function CanvasGrid(options, columns) {
        this.initOptions(options);
        this.render = new _canvas_grid_draw__WEBPACK_IMPORTED_MODULE_0__["CanvasDraw"](this.options);
        this.dataView = new _canvas_grid_dataView__WEBPACK_IMPORTED_MODULE_2__["DataView"](this.options, columns);
        this.events = new _canvas_grid_events__WEBPACK_IMPORTED_MODULE_1__["CanvasEvent"](this);
        this.fileSaver = new _canvas_grid_fileSaver__WEBPACK_IMPORTED_MODULE_3__["FileSaver"](this.options);
        this.fileSaver.dataView = this.dataView;
        this.dataView.updateFrame = this.updateFrame.bind(this);
        this.resize = this.resize.bind(this);
    }
    CanvasGrid.prototype.init = function () {
        this.initCanvas();
        this.setCanvasSize();
        this.dataView.init();
        this.events.init();
        window.onresize = this.resize;
        this.render.data = this.dataView;
        this.render.render();
    };
    CanvasGrid.prototype.update = function () {
        if (!this.dataView.rows || this.dataView.rows.length <= 0) {
            this.events.destoryScope();
        }
        this.dataView.update();
        this.render.render();
    };
    CanvasGrid.prototype.updateColums = function () {
        this.dataView.init();
        this.setCanvasSize();
        this.setScrollBar();
        this.update();
    };
    CanvasGrid.prototype.exportToExcel = function (fileName, sheetName) {
        // this.fileSaver.exportToExcel(fileName, sheetName);
    };
    CanvasGrid.prototype.jumpToRow = function (key, value) {
        var row = this.dataView.jumpToRow(key, value);
        this.events.scrollIntoView(true);
        this.events.updateCurtarget(row, true);
        this.events.onfocus();
    };
    CanvasGrid.prototype.resize = function () {
        var width = document.getElementById('eventOf' + this.options.name).getBoundingClientRect().width;
        if (width > 0) {
            this.updateFrame();
            this.update();
            this.onfocus();
        }
    };
    CanvasGrid.prototype.toggleTree = function () {
        this.dataView.toggleTree();
        this.resize();
    };
    CanvasGrid.prototype.onfocus = function () {
        this.events.onfocus();
    };
    CanvasGrid.prototype.onblur = function () {
        this.events.onblur();
    };
    CanvasGrid.prototype.initOptions = function (options) {
        this.options = {
            name: 'Grid',
            container: '',
            headerHeight: 36,
            headerBackground: '#F4F4FB',
            headerColor: '#000',
            headerFont: '14px Arial, Helvetica, sans-serif',
            headerAlign: 'start',
            headerLineColor: '#f0f0f0',
            lineHeight: 36,
            lineColor: '#f0f0f0',
            lineWidth: 1,
            bodyBackground: '#FFF',
            bodyColor: '#707070',
            borderLine: 'all',
            textIndent: 16,
            readOnly: false,
            iconList: {},
            iconSize: 16,
            hasCellSelect: false,
            hasHover: false,
            startLevel: 1,
            treeColor: '#ccc',
            treeLineStyle: [4, 2],
            expandToLevel: false,
        };
        for (var key in options) {
            this.options[key] = options[key];
        }
    };
    CanvasGrid.prototype.initCanvas = function () {
        var container = document.getElementById(this.options.container), formName = this.options.name, htmlStr = '<div id="eventOf' + formName + '" tabindex=0  style="width:calc(100% - 8px);height:calc(100% - 8px);position:relative;z-index:1;overflow:hidden;outline:none;"><canvas id="canvasOf' + formName + '" style="width:100%;height:100%;outline:none;">当前浏览器不支持Canvas，请更换浏览器后重试!</canvas></div>'
            + '<div id = "scrollX' + formName + '"style="display:none;position:absolute;z-index:1;overflow:auto;height:8px;width:100px;border-radius:4px;bottom:0px;left:0px;background:rgba(153,153,153,0.8);"></div>'
            + '<div id = "scrollY' + formName + '"style="display:none;position:absolute;z-index:1;overflow:auto;height:100px;width:8px;border-radius:4px;right:0px;top:0px;background:rgba(153,153,153,0.8);"></div>';
        container.innerHTML = htmlStr;
        container.style.position = 'relative';
        var canvas = document.getElementById('canvasOf' + formName);
        this.context = canvas.getContext('2d');
        this.render.context = this.context;
    };
    CanvasGrid.prototype.setScrollBar = function () {
        var options = this.options, rect = this.dataView.rect, scrollX = document.getElementById('scrollX' + options.name), scrollY = document.getElementById('scrollY' + options.name);
        if (rect.totalHeight > rect.viewHeight - rect.headerHeight) {
            scrollY.style.display = 'block';
            scrollY.style.height = (rect.viewHeight - rect.headerHeight) * ((rect.viewHeight - rect.headerHeight) / rect.totalHeight) + 'px';
        }
        else {
            scrollY.style.display = 'none';
            rect.scrollTop = 0;
        }
        if (rect.totalWidth > rect.viewWidth) {
            scrollX.style.display = 'block';
            scrollX.style.width = (rect.viewWidth) * rect.viewWidth / rect.totalWidth + 'px';
        }
        else {
            scrollX.style.display = 'none';
            rect.scrollLeft = 0;
        }
        this.events.updateScroll();
    };
    CanvasGrid.prototype.setCanvasSize = function () {
        var ratio = window.devicePixelRatio ? devicePixelRatio : 1, options = this.dataView.rect, container = document.getElementById('eventOf' + this.options.name), canvas = document.getElementById('canvasOf' + this.options.name), width, height;
        if (!container || !canvas) {
            return;
        }
        width = container.getBoundingClientRect().width,
            height = container.getBoundingClientRect().height;
        options.viewWidth = width;
        options.viewHeight = height;
        canvas.setAttribute('width', width * ratio + '');
        canvas.setAttribute('height', height * ratio + '');
        canvas.style.width = Math.floor(width) + 'px';
        canvas.style.height = Math.floor(height) + 'px';
        this.context.scale(ratio, ratio);
    };
    CanvasGrid.prototype.updateFrame = function () {
        this.setCanvasSize();
        this.setScrollBar();
    };
    return CanvasGrid;
}());
window['CanvasGrid'] = CanvasGrid;



/***/ }),

/***/ "./App/grid/canvas.grid.dataView.ts":
/*!******************************************!*\
  !*** ./App/grid/canvas.grid.dataView.ts ***!
  \******************************************/
/*! exports provided: DataView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataView", function() { return DataView; });
var DataView = /** @class */ (function () {
    function DataView(options, columns) {
        this.renderRows = [];
        this.colsLevel = 1;
        this.rowLevel = 1;
        this.options = options;
        this.columns = columns;
        this.initRect();
    }
    DataView.prototype.init = function () {
        this.initColums();
    };
    DataView.prototype.initRow = function () {
        this.initRows();
    };
    DataView.prototype.doFilter = function (rowsMap) {
        this.rowsMap = rowsMap;
        this.filterRows();
    };
    DataView.prototype.update = function () {
        var minX = this.rect.scrollLeft + this.rect.frozenWidth, maxX = this.rect.scrollLeft + this.rect.viewWidth, minY = this.rect.scrollTop, maxY = this.rect.scrollTop + this.rect.viewHeight - this.rect.headerHeight;
        this.updateRenderRows(minY, maxY);
        this.updateRenderCols(minX, maxX);
    };
    DataView.prototype.toggleTree = function () {
        if (this.treeState != 'fold') {
            this.treeState = 'fold';
            this.updateWidthByID('tree', 0);
        }
        else {
            this.treeState = 'expand';
            this.updateWidthByID('tree', 'expand');
        }
    };
    DataView.prototype.jumpToRow = function (key, value) {
        var rows = this.rows;
        for (var i = 0, len = rows.length; i < len; i++) {
            if (rows[i][key] == value) {
                this.selectedRowByRender = rows[i].showNo;
                this.selectedRow = rows[i].index;
                return rows[i];
            }
        }
    };
    DataView.prototype.initRect = function () {
        this.rect = {
            viewWidth: 0,
            viewHeight: 0,
            totalWidth: 0,
            totalHeight: 0,
            headerHeight: 0,
            scrollWidth: 0,
            scrollLeft: 0,
            scrollTop: 0,
            widthSetByNum: 0,
            frozenWidth: 0,
            lineHeight: this.options.lineHeight,
        };
    };
    DataView.prototype.initColums = function () {
        this.frozenColumns = [];
        this.activeColumns = [];
        this.renderLeafCols = [];
        this.leafActiveCols = [];
        this.leafFrozenCols = [];
        this.renderFrozenCols = [];
        this.rect.widthSetByNum = 0;
        this.rect.totalWidth = 0;
        this.rect.frozenWidth = 0;
        this.calcLevel(this.columns, 1);
        this.calcPos(this.columns, 0, 0);
        this.update();
    };
    DataView.prototype.calcLevel = function (columns, level) {
        if (level > this.colsLevel) {
            this.colsLevel = level;
        }
        for (var i = 0, len = columns.length; i < len; i++) {
            columns[i].level = level;
            if (columns[i].children) {
                this.calcLevel(columns[i].children, level + 1);
            }
            else if (columns[i].percentageWidth != true) {
                this.rect.widthSetByNum += columns[i].width;
            }
        }
        this.rect.headerHeight = this.colsLevel * this.options.headerHeight;
    };
    DataView.prototype.calcPos = function (columns, coordinateX, coordinateY, columnID, width) {
        var curWidth = 0, percent = 0, adaptiveWidth = this.rect.viewWidth - this.rect.widthSetByNum;
        for (var i = 0, len = columns.length; i < len; i++) {
            if (!columns[i].isColumnHide) {
                columns[i].x = coordinateX;
                columns[i].y = coordinateY;
            }
            if (columns[i].children) {
                columns[i].height = this.options.headerHeight;
                columns[i].width = this.calcPos(columns[i].children, coordinateX, columns[i].height + coordinateY, columnID, width);
            }
            else {
                columns[i].height = (this.colsLevel - columns[i].level + 1) * this.options.headerHeight;
                columns[i].width = columns[i].width ? columns[i].width : 120;
                if (!columnID) {
                    if (columns[i].percentageWidth == true && typeof (columns[i].width) == "string") {
                        percent = columns[i].width.replace('%', '') / 100;
                        columns[i].width = adaptiveWidth > 0 ? adaptiveWidth * percent : 120;
                    }
                    columns[i] = this.checkMaxMinWidth(columns[i]);
                }
                else if (width != undefined && columns[i].ID == columnID) {
                    if (columnID == 'tree' && width == 'expand') {
                        columns[i].width = columns[i].textIndent * 2 + this.rowLevel * 20;
                    }
                    else {
                        columns[i].width = width;
                    }
                }
                if (columns[i].isFrozen == true) {
                    this.leafFrozenCols.push(columns[i]);
                    this.leafFrozenCols[this.leafFrozenCols.length - 1]['index'] = this.leafFrozenCols.length - 1;
                }
                else {
                    this.leafActiveCols.push(columns[i]);
                    this.leafActiveCols[this.leafActiveCols.length - 1]['index'] = this.leafActiveCols.length - 1;
                }
                if (!columns[i].isColumnHide) {
                    this.rect.totalWidth += columns[i].width;
                }
                curWidth += columns[i].width;
            }
            if (columns[i].isFrozen == true) {
                if (!columns[i].isColumnHide) {
                    this.renderFrozenCols.push(columns[i]);
                    this.rect.frozenWidth += columns[i].width;
                }
                this.frozenColumns.push(columns[i]);
            }
            else {
                this.activeColumns.push(columns[i]);
            }
            if (!columns[i].isColumnHide) {
                coordinateX += columns[i].width;
            }
        }
        return curWidth;
    };
    DataView.prototype.checkMaxMinWidth = function (column) {
        var minWidth = column.minWidth ? column.minWidth : 30, maxWidth = column.maxWidth ? column.maxWidth : this.rect.viewWidth * 0.9;
        if (column.width < minWidth) {
            column.width = minWidth;
        }
        if (maxWidth > 0 && column.width > maxWidth) {
            column.width = maxWidth;
        }
        return column;
    };
    DataView.prototype.updateRenderCols = function (minX, maxX) {
        var data = this.activeColumns;
        if (!data) {
            return;
        }
        this.renderColumns = [];
        this.renderLeafCols = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].isColumnHide) {
                continue;
            }
            if (data[i].x + data[i].width > minX && data[i].x < maxX) {
                this.renderColumns.push(data[i]);
                if (!data[i].children) {
                    this.renderLeafCols.push(data[i]);
                }
            }
        }
    };
    DataView.prototype.updateRenderRows = function (minY, maxY) {
        var data = this.rows;
        if (!data) {
            return;
        }
        this.renderRows = [];
        minY = minY / this.options.lineHeight;
        for (var i = parseInt(minY); i < Math.floor(maxY / this.options.lineHeight) + 1 && i < data.length; i++) {
            data[i]['NO'] = i + 1;
            this.renderRows.push(data[i]);
        }
    };
    DataView.prototype.expandGridTree = function (target) {
        var programID = target.row.id, data = this.rowData;
        for (var i = 0, len = data.length; i < len; i++) {
            if (data[i].id != programID) {
                continue;
            }
            if (data[i].isFold == true) {
                data[i].isFold = false;
                break;
            }
            data[i].isFold = true;
            break;
        }
        this.filterRows();
    };
    DataView.prototype.expandToLevel = function (level) {
        var data = this.rowData;
        if (this.options.startLevel == 0) {
            level -= 1;
        }
        for (var i = 0, len = data.length; i < len; i++) {
            if (!data[i].isMiddleLevel) {
                continue;
            }
            if (data[i].level == level) {
                data[i].isFold = true;
            }
            else if (data[i].level < level) {
                data[i].isFold = false;
            }
        }
        this.filterRows();
    };
    DataView.prototype.filterRows = function () {
        var rows = this.rowData, currentLevel, result;
        this.rows = [];
        this.allRows = [];
        for (var i = 0, len = rows.length; i < len; i++) {
            if (this.rowsMap && this.rowsMap(rows[i].id, rows[i]) == false) {
                continue;
            }
            this.allRows.push(rows[i]);
            this.allRows[this.allRows.length - 1]['index'] = i + 1;
            if (currentLevel != undefined && rows[i].level > currentLevel) {
                continue;
            }
            this.rows.push(rows[i]);
            this.rows[this.rows.length - 1]['index'] = i + 1;
            this.rows[this.rows.length - 1]['showNo'] = this.rows.length;
            if (rows[i].isFold == true) {
                currentLevel = rows[i].level;
                continue;
            }
            else {
                currentLevel = undefined;
            }
        }
        this.rect.totalHeight = this.rows.length * this.options.lineHeight < this.rect.viewHeight - this.rect.headerHeight ? this.rows.length * this.options.lineHeight : (this.rows.length + 1) * this.options.lineHeight;
        this.updateFrame();
    };
    DataView.prototype.initRows = function () {
        var rows = this.rowData, currentLevel, hideLevel, isHide, result, chidlIsHide;
        this.rows = [];
        this.allRows = [];
        for (var i = 0, len = rows.length; i < len; i++) {
            if (hideLevel != undefined && hideLevel < rows[i].level) {
                continue;
            }
            hideLevel = undefined;
            isHide = this.beforeInitRow ? this.beforeInitRow(rows[i]) : undefined;
            if (rows[i].isMiddleLevel) {
                if (isHide == true) {
                    hideLevel = rows[i].level;
                    continue;
                }
                result = false;
                for (var j = i + 1, length = rows.length; j < length; j++) {
                    if (rows[j].level <= rows[i].level) {
                        break;
                    }
                    chidlIsHide = this.beforeInitRow ? this.beforeInitRow(rows[j]) : undefined;
                    if (chidlIsHide == true) {
                        continue;
                    }
                    if (!rows[j].isMiddleLevel) {
                        result = true;
                        break;
                    }
                }
            }
            else {
                if (isHide == true) {
                    continue;
                }
                result = true;
            }
            if (this.options.startLevel == 0 && rows[i].level + 1 > this.rowLevel) {
                this.rowLevel = rows[i].level + 1;
            }
            else if (this.options.startLevel == 0 && rows[i].level > this.rowLevel) {
                this.rowLevel = rows[i].level;
            }
            if (result != false) {
                this.allRows.push(rows[i]);
                this.allRows[this.allRows.length - 1]['index'] = i + 1;
                this.allRows[this.allRows.length - 1]['showNo'] = this.allRows.length;
            }
            if (currentLevel != undefined && rows[i].level > currentLevel) {
                continue;
            }
            if (result == false) {
                i = j - 1;
                continue;
            }
            this.rows.push(rows[i]);
            this.rows[this.rows.length - 1]['index'] = i + 1;
            this.rows[this.rows.length - 1]['showNo'] = this.rows.length;
            if (rows[i].isFold == true) {
                currentLevel = rows[i].level;
                continue;
            }
            else {
                currentLevel = undefined;
            }
        }
        this.rect.totalHeight = this.rows.length * this.options.lineHeight < this.rect.viewHeight - this.rect.headerHeight ? this.rows.length * this.options.lineHeight : (this.rows.length + 1) * this.options.lineHeight;
        this.updateFrame();
    };
    DataView.prototype.updateWidthByID = function (ID, width) {
        this.frozenColumns = [];
        this.activeColumns = [];
        this.renderLeafCols = [];
        this.renderFrozenCols = [];
        this.leafActiveCols = [];
        this.leafFrozenCols = [];
        this.rect.totalWidth = 0;
        this.rect.frozenWidth = 0;
        this.calcPos(this.columns, 0, 0, ID, width);
    };
    return DataView;
}());



/***/ }),

/***/ "./App/grid/canvas.grid.draw.ts":
/*!**************************************!*\
  !*** ./App/grid/canvas.grid.draw.ts ***!
  \**************************************/
/*! exports provided: CanvasDraw */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CanvasDraw", function() { return CanvasDraw; });
var CanvasDraw = /** @class */ (function () {
    function CanvasDraw(options) {
        this.options = options;
    }
    CanvasDraw.prototype.render = function () {
        this.rect = this.data.rect;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.clearRect(0, 0, this.rect.viewWidth, this.rect.viewHeight);
        this.tipsMap = {};
        this.treeWidth = this.getTreeWidth();
        this.renderHeader();
        this.renderBody();
    };
    CanvasDraw.prototype.renderHeader = function () {
        var frozenColumns = this.data.frozenColumns, activeColumns = this.data.renderColumns, renderFrozenCols = this.data.renderFrozenCols, context = this.context, options = this.options;
        if (options.headerBackground) {
            context.save();
            context.fillStyle = options.headerBackground;
            var height = options.headerHeight * this.data.colsLevel;
            context.fillRect(0, 0, this.rect.viewWidth, height);
            context.restore();
        }
        context.save();
        context.fillStyle = options.headerColor ? options.headerColor : '#FFF';
        context.strokeStyle = options.headerLineColor ? options.headerLineColor : '#F0F0F0';
        context.font = options.headerFont ? options.headerFont : '12px Arial, Helvetica, sans-serif';
        context.textAlign = options.headerAlign ? options.headerAlign : 'center';
        context.lineWidth = options.lineWidth ? options.lineWidth : 1;
        context.save();
        context.translate(0 - this.rect.scrollLeft, 0);
        for (var j = 0; j < activeColumns.length; j++) {
            this.drawCell(activeColumns[j]);
        }
        context.restore();
        context.clearRect(0, 0, this.rect.frozenWidth, this.rect.headerHeight);
        if (options.headerBackground) {
            context.save();
            context.fillStyle = options.headerBackground;
            height = options.headerHeight * this.data.colsLevel;
            context.fillRect(0, 0, this.rect.frozenWidth, height);
            context.restore();
        }
        for (var i = 0; i < renderFrozenCols.length; i++) {
            this.drawCell(renderFrozenCols[i]);
        }
        context.restore();
    };
    CanvasDraw.prototype.drawCell = function (data) {
        var context = this.context, iconResult;
        var x = data.x, y = data.y, w = (data.ID == 'tree' ? this.treeWidth : data.width), h = data.height, text = data.name, textX = data.x, textIndent = this.options.textIndent ? this.options.textIndent : 8, textY = data.y + data.height * 0.5, textW = (data.ID == 'tree' ? this.treeWidth : data.width) - 2 * textIndent, options = this.options;
        if (data.headerTextAlign || options.headerAlign) {
            context.textAlign = data.headerTextAlign ? data.headerTextAlign : options.headerAlign;
        }
        else {
            context.textAlign = 'center';
        }
        if (data.headIcon && data.headIconList.length > 0) {
            iconResult = this.renderIcon(data.headIconList, 'header', data, y, data.height);
        }
        if (iconResult) {
            textX += iconResult.beforeTextIcon;
            textW = iconResult.afterTextIcon - iconResult.beforeTextIcon - textIndent;
        }
        if (context.textAlign == "center" || data.headerTextAlign == 'center') {
            context.textAlign = 'center';
            textX = textX + textW * 0.5 + textIndent;
        }
        else if (data.headerTextAlign == 'end') {
            context.textAlign = 'end';
            textX = textX + data.width - textIndent;
        }
        else {
            textX += textIndent;
        }
        if (data.noLine == 2) {
            this.strokeRect(x - 0.5 - 40, y - 2, w + 40, h);
        }
        else if (data.noLine != 1) {
            this.strokeRect(x - 0.5, y - 2, w, h);
        }
        if (data.ID == 'tree' && this.data.rowLevel) {
            context.save();
            context.textAlign = 'center';
            context.font = '12px Arial, Helvetica, sans-serif';
            context.strokeStyle = this.options.treeColor;
            for (var i = 0; i < this.data.rowLevel; i++) {
                text = i + 1;
                textX = x + data.textIndent + i * 20 + 10;
                if (textX + 10 < data.x + this.treeWidth) {
                    this.fillText(text, textX, textY, 20, data, "header");
                    if (this.options.expandToLevel == true) {
                        this.strokeRect(textX - 10, textY - 11, 20, 20);
                    }
                }
            }
            context.restore();
            return;
        }
        this.fillText(text, textX, textY, textW, data, "header");
    };
    CanvasDraw.prototype.renderBody = function () {
        var rows = this.data.renderRows, context = this.context, options = this.options, headerHeight = this.data.colsLevel * options.headerHeight;
        if (rows.length <= 0) {
            return;
        }
        context.save();
        context.font = options.bodyFont ? options.bodyFont : '12px Arial, Helvetica, sans-serif';
        context.fillStyle = options.bodyColor ? options.bodyColor : '#FFF';
        context.strokeStyle = options.lineColor ? options.lineColor : '#F0F0F0';
        context.lineWidth = options.lineWidth ? options.lineWidth : 1;
        context.save();
        context.translate(0 - this.rect.scrollLeft, headerHeight - this.rect.scrollTop);
        for (var j = 0; j < rows.length; j++) {
            this.renderRow(rows[j], this.data.renderLeafCols, j, true);
        }
        context.restore();
        context.save();
        context.translate(0, headerHeight - this.rect.scrollTop);
        context.clearRect(0, this.rect.scrollTop, this.rect.frozenWidth, this.rect.viewHeight - headerHeight);
        for (var i = 0; i < rows.length; i++) {
            this.renderRow(rows[i], this.data.leafFrozenCols, i, false);
        }
        context.restore();
        context.restore();
        context.restore();
    };
    CanvasDraw.prototype.getTreeWidth = function () {
        if (!(this.data && this.data.columns)) {
            return;
        }
        var len = this.data.columns.length;
        for (var i = 0; i < len; i++) {
            if (this.data.columns[i].ID == "tree") {
                if (this.data.columns[i].isColumnHide) {
                    return 0;
                }
                return this.data.rowLevel * 20 + this.data.columns[i].textIndent * 2;
            }
        }
    };
    CanvasDraw.prototype.renderRow = function (row, columns, num, isLeafCols) {
        if (!row || columns.length <= 0) {
            return;
        }
        var context = this.context, options = this.options, y = options.lineHeight * num + this.rect.scrollTop, h = options.lineHeight, rowOption, isLast = false;
        if (options.hasHover == true && this.data.hoverTarget && row.NO == this.data.hoverTarget.row.NO) {
            row['isHover'] = true;
        }
        else {
            row['isHover'] = false;
        }
        rowOption = this.beforeRenderRow ? this.beforeRenderRow(row) : null;
        if (rowOption && rowOption.background) {
            context.save();
            context.fillStyle = rowOption.background;
            if (options.formStyle == 1) {
                if (isLeafCols) {
                    context.fillRect(0 - 0.5 + this.treeWidth, y - 1, this.rect.viewWidth - this.treeWidth + this.rect.scrollLeft, h);
                }
                else {
                    context.fillRect(0 - 0.5 + this.treeWidth, y - 1, this.rect.frozenWidth - this.treeWidth, h);
                }
            }
            else {
                context.fillRect(0 - 0.5 + this.rect.scrollLeft, y, this.rect.viewWidth, h);
            }
            context.restore();
        }
        if (options.borderLine == 'row') {
            if (options.formStyle == 1) {
                this.strokeRect(-1 + this.treeWidth, y - 1, this.rect.viewWidth + 2 + this.rect.scrollLeft, h);
            }
            else {
                this.strokeRect(-1 + this.rect.scrollLeft, y, this.rect.viewWidth + 2, h);
            }
        }
        context.save();
        if (rowOption && rowOption.font) {
            context.font = rowOption.font;
        }
        for (var i = 0, len = columns.length; i < len; i++) {
            if (i == len - 1) {
                isLast = true;
            }
            this.renderCell(row, columns[i], num, isLast);
        }
        context.restore();
    };
    CanvasDraw.prototype.renderCell = function (row, column, num, isLast) {
        var context = this.context, options = this.options, cellOptions, text = '', e = {}, iconResult, columnID = column.ID, x = column.x, y = options.lineHeight * num + this.rect.scrollTop, w = column.width, h = options.lineHeight, textY = y + h * 0.5, textX, textW;
        if (isLast == true) {
            w -= 1;
        }
        e['column'] = column;
        e['row'] = row;
        cellOptions = this.beforeRenderCell ? this.beforeRenderCell(e) : null;
        if (cellOptions && cellOptions.result == false) {
            return;
        }
        if (columnID == 'tree' && this.treeWidth) {
            this.drawTree(column, num);
            return;
        }
        if (cellOptions && cellOptions.background) {
            context.save();
            context.fillStyle = cellOptions.background;
            context.fillRect(x, y, w, h);
            context.restore();
        }
        if (options.borderLine == 'all') {
            this.strokeRect(x, y, w, h);
        }
        if (row[columnID] != undefined && row[columnID] != null) {
            text = row[columnID];
        }
        if (column.inputType == 'inner') {
            textX = column.inputStyle.left + column.x;
            textW = column.inputStyle.width;
            if (column.inputStyle.right) {
                textW = column.width - column.inputStyle.left - column.inputStyle.right;
            }
            context.save();
            if (cellOptions && cellOptions.lineColor) {
                context.strokeStyle = cellOptions.lineColor;
            }
            if (cellOptions && cellOptions.lineWidth) {
                context.lineWidth = cellOptions.lineWidth;
            }
            if (column.inputStyle.background) {
                context.fillStyle = cellOptions.inputStyle.background ? cellOptions.inputStyle.background : column.inputStyle.background;
                context.fillRect(textX, y + column.inputStyle.padding, textW, h - 2 * column.inputStyle.padding - 1);
            }
            this.strokeRect(textX, y + column.inputStyle.padding, textW, h - 2 * column.inputStyle.padding - 1);
            context.restore();
            if (cellOptions && cellOptions.editType == 'select') {
                this.drawSelect(context, column.inputStyle.left + column.x, y + column.inputStyle.padding, column.inputStyle.width, h - 2 * column.inputStyle.padding);
                textW -= 20;
            }
        }
        if (column.hasIcon && column.iconList.length > 0) {
            iconResult = this.renderIcon(column.iconList, row, column, y, this.options.lineHeight);
        }
        if (iconResult) {
            if (column.textIndent) {
                textX = x + iconResult.beforeTextIcon + column.textIndent;
                textW = iconResult.afterTextIcon - iconResult.beforeTextIcon - column.textIndent;
            }
            else {
                textX = x + iconResult.beforeTextIcon + options.textIndent;
                textW = iconResult.afterTextIcon - iconResult.beforeTextIcon - options.textIndent;
            }
        }
        else {
            textX = column.textIndent ? x + column.textIndent : x + options.textIndent;
            textW = column.textIndent ? w - column.textIndent * 2 : w - options.textIndent * 2;
        }
        if (text != undefined && text != null && textW > 0) {
            this.renderText(text, textX, textY, textW, row, column);
        }
    };
    CanvasDraw.prototype.strokeRect = function (x, y, w, h) {
        this.context.strokeRect(x + 0.5, y + 0.5, w, h);
    };
    CanvasDraw.prototype.renderIcon = function (icons, row, column, y, height) {
        var options = this.options, iconOptions, iconSrc, iconX, iconW = this.options.iconSize, iconH = this.options.iconSize, iconY = y + (height - iconH) * 0.5, beforeTextIcon = 0, afterTextIcon = column.width, e = { row: row, column: column };
        for (var i = 0, len = icons.length; i < len; i++) {
            e['iconNum'] = i;
            if (row.NO + '_' + column.ID + '_' + icons[i].operateType == this.data.hoverIcon) {
                e['isHover'] = true;
            }
            else {
                e['isHover'] = false;
            }
            iconOptions = this.beforeRenderIcon ? this.beforeRenderIcon(e) : null;
            iconSrc = icons[i].src;
            if (iconOptions && iconOptions.result == true) {
                iconSrc = iconOptions.src ? iconOptions.src : icons[i].src;
            }
            if (icons[i].left) {
                iconX = column.x + icons[i].left;
            }
            else if (icons[i].right) {
                iconX = column.x + column.width - icons[i].right;
            }
            if (icons[i].position == 'beforeText') {
                if (iconX + iconW - column.x > beforeTextIcon) {
                    beforeTextIcon = iconX + iconW - column.x;
                }
            }
            else if (icons[i].position == 'afterText') {
                if (iconX - column.x < afterTextIcon) {
                    afterTextIcon = iconX - column.x;
                }
            }
            if (iconOptions && iconOptions.result == false) {
                continue;
            }
            if (iconX > column.x + column.width) {
                return;
            }
            this.context.drawImage(options.iconList[iconSrc], iconX, iconY, iconW, iconH);
        }
        return {
            'beforeTextIcon': beforeTextIcon,
            'afterTextIcon': afterTextIcon,
        };
    };
    CanvasDraw.prototype.renderText = function (text, x, y, width, row, column) {
        var e = { 'row': row, 'column': column };
        var textOptions = this.beforeRenderText ? this.beforeRenderText(e) : null, context = this.context;
        context.save();
        context.textAlign = column.textAlign;
        if (textOptions && textOptions.color) {
            context.fillStyle = textOptions.color;
        }
        if (textOptions && textOptions.font) {
            context.font = textOptions.font;
        }
        if (textOptions && textOptions.text != undefined) {
            text = textOptions.text;
        }
        if (context.textAlign == 'center') {
            x = x + width * 0.5;
        }
        if (context.textAlign == 'end') {
            x = x + width;
        }
        this.fillText(text, x, y, width, column, row.NO);
        context.restore();
    };
    CanvasDraw.prototype.fillText = function (text, x, y, width, column, rowIndex) {
        var context = this.context;
        if (context.measureText(text).width > width && !column.noOmit) {
            if (this.options.uid != undefined) {
                this.tipsMap[this.options.uid + "_" + rowIndex + "_" + column.ID] = text;
            }
            text = this.clipText(text.toString(), width);
        }
        context.fillText(text, x, y, width);
    };
    CanvasDraw.prototype.clipText = function (text, width) {
        var context = this.context, result = parseInt(width) / 6.6, initiallyNum = parseInt(result), newText = text.substring(0, initiallyNum);
        if (context.measureText(newText + "...").width > width) {
            for (var i = initiallyNum; context.measureText(newText + "...").width > width && i >= 0; i--) {
                newText = text.substring(0, i);
            }
        }
        else {
            for (var j = initiallyNum; context.measureText(newText + "...").width < width; j++) {
                newText = text.substring(0, j);
            }
        }
        return newText + "...";
    };
    CanvasDraw.prototype.drawTree = function (column, rowNo) {
        var row = this.data.renderRows[rowNo], level = this.options.startLevel == 1 ? row.level : row.level + 1, lineHeight = this.options.lineHeight, x, y, lineType, isLast, expandType, nextLevel, ctx = this.context;
        if (this.data.renderRows[rowNo + 1]) {
            nextLevel = this.options.startLevel == 1 ? this.data.renderRows[rowNo + 1].level : this.data.renderRows[rowNo + 1].level + 1;
        }
        ctx.save();
        ctx.fillStyle = this.options.treeColor;
        ctx.strokeStyle = this.options.treeColor;
        if (row.isMiddleLevel) {
            x = column.x + column.textIndent + (level - 1) * 20 + 3;
            y = Math.floor((rowNo + 0.5) * lineHeight - 14 * 0.5) + this.rect.scrollTop;
            if (row.isFold == true) {
                expandType = true;
            }
            else {
                expandType = false;
            }
            if (x + 16 < column.width) {
                this.drawExpand(ctx, x, y, 14, 14, expandType);
            }
        }
        else {
            x = column.x + column.textIndent + (level - 1) * 20 + 10;
            y = Math.floor((rowNo + 0.5) * lineHeight - 5 * 0.5) + this.rect.scrollTop;
            if (x + 5 < column.width) {
                this.drawSquare(ctx, x + 0.5, y + 0.5, 5, 5);
            }
        }
        for (var i = level - 1; i > 0; i--) {
            isLast = false;
            x = column.x + column.textIndent + (i - 1) * 20 + 10;
            y = rowNo * lineHeight + this.rect.scrollTop;
            if (i == level - 1) {
                isLast = true;
            }
            lineType = this.comparePath(level, nextLevel, i, isLast);
            if (x + 16 < column.width) {
                this.drawLine(ctx, x, y, 14, lineHeight, lineType);
            }
        }
        ctx.restore();
    };
    CanvasDraw.prototype.comparePath = function (level, nextLevel, index, isLast) {
        var type = 'straight';
        if (isLast && level > nextLevel || !nextLevel || (index >= nextLevel && level - nextLevel > 1)) {
            type = 'break';
        }
        return type;
    };
    CanvasDraw.prototype.drawSquare = function (ctx, x, y, w, h) {
        ctx.fillRect(x + 0.5, y + 0.5, w, h);
    };
    CanvasDraw.prototype.drawExpand = function (ctx, x, y, w, h, type) {
        this.strokeRect(x, y, w, h);
        ctx.beginPath();
        ctx.moveTo(x + 3.5, y + 0.5 * h + 0.5);
        ctx.lineTo(x + w - 2.5, y + 0.5 * h + 0.5);
        ctx.stroke();
        ctx.closePath();
        if (type == true) {
            ctx.beginPath();
            ctx.moveTo(x + 0.5 * w + 0.5, y + 3.5);
            ctx.lineTo(x + 0.5 * w + 0.5, y + h - 2.5);
            ctx.stroke();
            ctx.closePath();
        }
        else {
            ctx.beginPath();
            ctx.save();
            ctx.setLineDash(this.options.treeLineStyle);
            ctx.moveTo(x + 0.5 * w + 0.5, y + h);
            ctx.lineTo(x + 0.5 * w + 0.5, y + h + 12);
            ctx.stroke();
            ctx.restore();
        }
    };
    CanvasDraw.prototype.drawLine = function (ctx, x, y, w, h, type) {
        ctx.save();
        ctx.setLineDash(this.options.treeLineStyle);
        if (type == 'straight') {
            ctx.beginPath();
            ctx.moveTo(x + 0.5, y + 0.5);
            ctx.lineTo(x + 0.5, y + h + 0.5);
            ctx.stroke();
        }
        else if (type == 'break') {
            ctx.beginPath();
            ctx.moveTo(x + 0.5, y + 0.5);
            ctx.lineTo(x + 0.5, y + 0.5 * h + 0.5);
            if (this.options.formStyle == 1) {
                ctx.lineTo(x + 10 + 0.5, y + 0.5 * h + 0.5);
            }
            else {
                ctx.lineTo(x + w + 0.5, y + 0.5 * h + 0.5);
            }
            ctx.stroke();
        }
        ctx.restore();
    };
    CanvasDraw.prototype.drawSelect = function (ctx, x, y, w, h) {
        ctx.save();
        ctx.strokeStyle = '#F2F2F9';
        ctx.fillStyle = '#bbb';
        ctx.beginPath();
        ctx.moveTo(x + w - 18, y + h * 0.5 - 2);
        ctx.lineTo(x + w - 10, y + h * 0.5 - 2);
        ctx.lineTo(x + w - 14, y + h * 0.5 + 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    };
    return CanvasDraw;
}());



/***/ }),

/***/ "./App/grid/canvas.grid.events.ts":
/*!****************************************!*\
  !*** ./App/grid/canvas.grid.events.ts ***!
  \****************************************/
/*! exports provided: CanvasEvent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CanvasEvent", function() { return CanvasEvent; });
/* harmony import */ var _component_input__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component/input */ "./App/component/input.ts");
/* harmony import */ var _component_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../component/select */ "./App/component/select.ts");
/* harmony import */ var _component_toolTip__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../component/toolTip */ "./App/component/toolTip.ts");
/* harmony import */ var _component_scope__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../component/scope */ "./App/component/scope.ts");
/* harmony import */ var _component_pageSelect__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../component/pageSelect */ "./App/component/pageSelect.ts");





// import {History } from './canvas.grid.history';
var CanvasEvent = /** @class */ (function () {
    // private History: History;
    function CanvasEvent(form) {
        this.isDestory = true;
        this.state = '';
        this.selectState = 'none';
        this.selectedRange = {};
        this.form = form;
        this.options = form.options;
        this.rect = form.dataView.rect;
        this.hoverTarget = form.dataView.hoverTarget;
        this.container = 'eventOf' + this.options.name;
        this.Input = new _component_input__WEBPACK_IMPORTED_MODULE_0__["Input"]();
        this.ToolTip = new _component_toolTip__WEBPACK_IMPORTED_MODULE_2__["ToolTip"]();
        this.pageSelect = new _component_pageSelect__WEBPACK_IMPORTED_MODULE_4__["PageSelect"](this);
        this.scrollDragEnd = this.scrollDragEnd.bind(this);
        this.setScrollPos = this.setScrollPos.bind(this);
        // this.History = new History();
    }
    CanvasEvent.prototype.init = function () {
        this.initEvent();
        if (this.options.hasCellSelect) {
            this.Scope = new _component_scope__WEBPACK_IMPORTED_MODULE_3__["Scope"](this.container, this.options.name, this.rect);
            this.copyArea = document.getElementById('copyAreaOf' + this.options.name);
        }
        if (this.options.hasPageSelect) {
            this.pageSelect.init(this.container, this.options);
        }
        this.Select = new _component_select__WEBPACK_IMPORTED_MODULE_1__["Select"](this.options.container, this.options.name);
        this.Select.initSelectData = this.initSelectData;
        this.Select.afterSelected = this.afterSelected;
        this.Input.afterInputInit = this.afterInputInit;
        this.Input.afterInput = this.afterInput;
        this.Input.init(this.options.name, this.rect);
    };
    CanvasEvent.prototype.destoryEvent = function (e) {
        window['active'] = 'document';
        clearInterval(window['directionTimeID']);
        window['directionTimeID'] = null;
        this.destory();
        this.destoryScope();
        this.selectedRange = {};
    };
    CanvasEvent.prototype.updateScroll = function () {
        this.setScrollPos(this.rect.scrollLeft, this.rect.scrollTop);
    };
    CanvasEvent.prototype.destoryScope = function (name, target) {
        if (this.options.hasCellSelect == true) {
            if (name) {
                this.Scope.destory(name);
                if (!target || this.container != window["active"]) {
                    this.curTarget = null;
                    this.firstTarget = null;
                    this.lastTarget = null;
                }
            }
            else {
                this.Scope.destory();
                this.curTarget = null;
                this.firstTarget = null;
                this.lastTarget = null;
            }
        }
        this.selectState = 'none';
    };
    CanvasEvent.prototype.scrollIntoView = function (isCenter) {
        var height = this.form.dataView.selectedRowByRender * this.rect.lineHeight, scrollTop;
        if (isCenter) {
            if (height <= this.rect.scrollTop) {
                if (height < Math.floor((this.rect.viewHeight - this.rect.headerHeight) / 2)) {
                    scrollTop = 0;
                }
                else {
                    scrollTop = height - Math.floor((this.rect.viewHeight - this.rect.headerHeight) / 2);
                }
            }
            else if (height > this.rect.scrollTop + this.rect.viewHeight - this.rect.headerHeight) {
                scrollTop = height - Math.floor((this.rect.viewHeight - this.rect.headerHeight) / 2);
            }
        }
        else {
            if (height - this.rect.lineHeight <= this.rect.scrollTop) {
                scrollTop = height - this.rect.lineHeight;
            }
            else if (height + this.rect.lineHeight > this.rect.scrollTop + this.rect.viewHeight - this.rect.headerHeight) {
                scrollTop = height - this.rect.viewHeight + this.rect.headerHeight + this.rect.lineHeight;
            }
        }
        this.setScrollPos(undefined, scrollTop);
    };
    CanvasEvent.prototype.onfocus = function () {
        document.getElementById('eventOf' + this.options.name).focus();
        window['active'] = this.container;
    };
    CanvasEvent.prototype.onblur = function () {
        document.getElementById('eventOf' + this.options.name).blur();
    };
    CanvasEvent.prototype.updateCurtarget = function (row, isLastRow) {
        if (!this.curTarget) {
            this.curTarget = {};
            var columns = this.form.dataView.columns, column;
            for (var i = 0; i < columns.length; i++) {
                if (!columns[i].isColumnHide && columns[i].ID != 'tree') {
                    column = columns[i];
                    break;
                }
            }
            this.curTarget.column = column;
        }
        this.curTarget.row = row;
        this.firstTarget = this.curTarget;
        this.lastTarget = this.curTarget;
        if (isLastRow) {
            this.updateScope();
        }
    };
    CanvasEvent.prototype.setScrollPos = function (scrollLeft, scrollTop) {
        if (scrollLeft != undefined) {
            this.rect.scrollLeft = scrollLeft;
            if (this.rect.scrollLeft > this.rect.totalWidth - this.rect.viewWidth) {
                this.rect.scrollLeft = this.rect.totalWidth - this.rect.viewWidth;
            }
            if (this.rect.scrollLeft < 0) {
                this.rect.scrollLeft = 0;
            }
        }
        if (scrollTop != undefined) {
            this.rect.scrollTop = scrollTop;
            if (this.rect.scrollTop > this.rect.totalHeight - this.rect.viewHeight + this.rect.headerHeight) {
                this.rect.scrollTop = this.rect.totalHeight - this.rect.viewHeight + this.rect.headerHeight;
            }
            if (this.rect.scrollTop <= 0) {
                this.rect.scrollTop = 0;
            }
        }
        this.scroll();
    };
    CanvasEvent.prototype.updateScrollBarPos = function () {
        var viewHeight = this.rect.viewHeight - this.rect.headerHeight;
        this.scrollX.style.left = this.rect.scrollLeft * this.rect.viewWidth / this.rect.totalWidth + 'px';
        this.scrollY.style.top = this.rect.scrollTop * viewHeight / this.rect.totalHeight + this.rect.headerHeight + 'px';
    };
    CanvasEvent.prototype.initEvent = function () {
        var options = this.options, eventLayer = document.querySelector('#eventOf' + options.name), mousewheel = 'mousewheel';
        if (document.onmousewheel === undefined) {
            mousewheel = 'DOMMouseScroll';
        }
        document.onclick = this.destoryEvent.bind(this);
        this.scrollX = document.querySelector('#scrollX' + options.name);
        this.scrollY = document.querySelector('#scrollY' + options.name);
        this.scrollX.addEventListener('mousedown', this.scrollDragstart.bind(this));
        this.scrollY.addEventListener('mousedown', this.scrollDragstart.bind(this));
        eventLayer.removeEventListener('click', this.click.bind(this));
        eventLayer.addEventListener('click', this.click.bind(this));
        eventLayer.removeEventListener('contextmenu', this.contextmenu.bind(this));
        eventLayer.addEventListener('contextmenu', this.contextmenu.bind(this));
        eventLayer.removeEventListener(mousewheel, this.mousewheel.bind(this));
        eventLayer.addEventListener(mousewheel, this.mousewheel.bind(this));
        eventLayer.removeEventListener('mousemove', this.mousemove.bind(this));
        eventLayer.addEventListener('mousemove', this.mousemove.bind(this));
        eventLayer.removeEventListener('mouseleave', this.mouseLeave.bind(this));
        eventLayer.addEventListener('mouseleave', this.mouseLeave.bind(this));
        eventLayer.removeEventListener('mouseenter', this.mouseEnter.bind(this));
        eventLayer.addEventListener('mouseenter', this.mouseEnter.bind(this));
        eventLayer.removeEventListener('mouseup', this.mouseup.bind(this));
        eventLayer.addEventListener('mouseup', this.mouseup.bind(this));
        eventLayer.removeEventListener("keydown", this.handleKeyDown.bind(this));
        eventLayer.addEventListener("keydown", this.handleKeyDown.bind(this));
    };
    CanvasEvent.prototype.click = function (e) {
        if (window['active'] != this.container) {
            window['active'] = this.container;
            return;
        }
        var target = this.getCurrentCell(e), result, state;
        e.stopPropagation();
        this.onfocus();
        if (this.dragTimeId) {
            clearTimeout(this.dragTimeId);
            this.dragTimeId = undefined;
        }
        this.destory();
        if (this.state == 'drag') {
            this.state = '';
            return;
        }
        if (this.inputState == 'inputing') {
            this.inputState = '';
        }
        if (e.shiftKey != true) {
            this.destoryScope(this.container, target);
        }
        else {
            this.handleScroll(target);
            this.firstTarget = this.curTarget ? this.curTarget : this.firstTarget;
            this.lastTarget = target;
            if (!this.firstTarget) {
                return;
            }
            if (target.row == 'header') {
                this.firstTarget.row = this.form.dataView.rows[0];
                this.lastTarget['row'] = this.form.dataView.rows[this.form.dataView.rows.length - 1];
                this.lastTarget['column'] = target.column;
            }
            var index = this.firstTarget.row.index < this.lastTarget.row.index ? this.firstTarget.row.index : this.lastTarget.row.index;
            this.setSelectedRow(index);
            this.updateScope();
            this.getSelectItems(this.firstTarget, this.lastTarget);
            this.selectState = 'double';
            return;
        }
        if (this.lastTarget || this.firstTarget) {
            this.firstTarget = null;
            this.lastTarget = null;
        }
        if (this.cellClick) {
            this.cellClick();
        }
        if (!target) {
            return;
        }
        result = this.afterClick(target);
        if (!result) {
            return;
        }
        if (target.row == 'header') {
            this.handleHeader(target);
            return;
        }
        if (this.options.hasCellSelect == true && target.column.ID != 'tree') {
            target = this.handleScroll(target);
            if (target.actionType && target.actionType.type == 'operate') {
                this.clickEventAssignment(target);
            }
            else if (this.curTarget && this.curTarget.row == target.row && this.curTarget.column.ID == target.column.ID) {
                this.clickEventAssignment(target);
                state = true;
            }
            else if (target.column.clickShow) {
                if (this.beforeClick && this.beforeClick(target)) {
                    this.clickEventAssignment(target);
                }
            }
            if (!state) {
                this.Scope.changeState('none');
            }
            this.setSelectedRow(target.row.index);
            this.showScope(target);
            this.curTarget = target;
            this.selectState = 'single';
        }
        else {
            this.clickEventAssignment(target);
        }
    };
    CanvasEvent.prototype.contextmenu = function (e) {
        e.preventDefault();
    };
    CanvasEvent.prototype.mousewheel = function (e) {
        var scrollLeft, scrollTop;
        if (e.type == 'DOMMouseScroll') {
            e.wheelDelta = -e.detail;
        }
        if (e.shiftKey) {
            e.preventDefault();
            if (this.rect.totalWidth <= this.rect.viewWidth) {
                return;
            }
            if (e.wheelDelta < 0) {
                scrollLeft = this.rect.scrollLeft + 50;
            }
            else {
                scrollLeft = this.rect.scrollLeft - 50;
            }
        }
        else {
            if (this.rect.totalHeight <= this.rect.viewHeight - this.rect.headerHeight) {
                return;
            }
            if (e.wheelDelta < 0) {
                scrollTop = this.rect.scrollTop + this.options.lineHeight;
            }
            else {
                scrollTop = this.rect.scrollTop - this.options.lineHeight;
            }
        }
        if (this.beforeScroll) {
            this.beforeScroll();
        }
        this.setScrollPos(scrollLeft, scrollTop);
    };
    CanvasEvent.prototype.scroll = function () {
        if (window['active'] != this.container) {
            this.destoryScope(this.container);
        }
        this.destory();
        this.updateScrollBarPos();
        this.form.update();
        if (this.options.hasCellSelect) {
            if (this.lastTarget && window['active'] == this.container) {
                this.updateScope();
            }
            else {
                this.showScope(this.curTarget);
            }
        }
    };
    CanvasEvent.prototype.scrollDragstart = function (e) {
        document.body.onmousemove = this.scrollDraging.bind(this);
        var body = document.getElementsByTagName('body');
        body[0].addEventListener('click', this.scrollDragEnd);
        body[0].addEventListener('mouseleave', this.scrollDragEnd);
        if (e.target.id.indexOf('scrollX') >= 0) {
            this.scrollBarType = 'scrollX';
            this.scrollX.style.background = 'rgba(102,102,102,0.8)';
            this.scrollStartPosX = e.screenX;
        }
        else {
            this.scrollBarType = 'scrollY';
            this.scrollY.style.background = 'rgba(102,102,102,0.8)';
            this.scrollStartPosY = e.screenY;
        }
        if (this.beforeScroll) {
            this.beforeScroll();
        }
        this.state = 'scrollDrag';
    };
    CanvasEvent.prototype.scrollDraging = function (e) {
        var scrollLeft, scrollTop;
        e.preventDefault();
        if (this.scrollBarType == 'scrollX') {
            scrollLeft = this.rect.scrollLeft + (e.screenX - this.scrollStartPosX) * (this.rect.totalWidth / this.rect.viewWidth);
            this.scrollStartPosX = e.screenX;
        }
        else {
            scrollTop = this.rect.scrollTop + (e.screenY - this.scrollStartPosY) * (this.rect.totalHeight / (this.rect.viewHeight - this.rect.headerHeight));
            this.scrollStartPosY = e.screenY;
        }
        this.setScrollPos(scrollLeft, scrollTop);
    };
    CanvasEvent.prototype.scrollDragEnd = function (e) {
        e.stopPropagation();
        this.scrollX.style.background = 'rgba(153,153,153,0.8)';
        this.scrollY.style.background = 'rgba(153,153,153,0.8)';
        document.body.onmousemove = null;
        var body = document.getElementsByTagName('body');
        body[0].removeEventListener('click', this.scrollDragEnd);
        body[0].removeEventListener('mouseleave', this.scrollDragEnd);
        this.state = '';
        this.onfocus();
    };
    CanvasEvent.prototype.mousemove = function (e) {
        if (e.buttons == 1) {
            if (this.timeId) {
                clearTimeout(this.timeId);
                this.timeId = undefined;
            }
            if (this.state != 'drag') {
                this.ToolTip.destory();
            }
            this.handleDrag(e);
        }
        else {
            if (this.hoverEvent && e.screenX == this.hoverEvent.screenX && e.screenY == this.hoverEvent.screenY) {
                return;
            }
            if (this.state == 'resizeCol' && this.dragCell) {
                this.dragCell.parentNode.removeChild(this.dragCell);
                this.dragCell = null;
                this.dragTarget = null;
            }
            this.ToolTip.destory();
            this.dragCancel();
            this.hoverEvent = e;
            this.handleHover(e);
        }
    };
    CanvasEvent.prototype.mouseLeave = function (e) {
        if (e.buttons == 1) {
            this.dragEnd(e.clientX);
        }
        else {
            if (this.timeId) {
                clearTimeout(this.timeId);
                this.timeId = undefined;
            }
        }
        if (this.state == "drag") {
            this.leaveDirection = this.getLeaveDirection(e);
            this.moveScrollBar(this.leaveDirection);
        }
    };
    CanvasEvent.prototype.mouseEnter = function (e) {
        this.leaveDirection = "";
        if (e.buttons == 0 || window['directionTimeID'] || this.state == 'drag' || this.state == 'scrollDrag') {
            window["active"] = this.container;
        }
        else {
            window["active"] = 'document';
        }
        clearInterval(window['directionTimeID']);
        window['directionTimeID'] = null;
    };
    CanvasEvent.prototype.getLeaveDirection = function (e) {
        var left = this.form.context.canvas.getBoundingClientRect().left, top = this.form.context.canvas.getBoundingClientRect().top, width = this.form.context.canvas.getBoundingClientRect().width, height = this.form.context.canvas.getBoundingClientRect().height, x = (e.clientX - left - width / 2) * (width > height ? (height / width) : 1), y = (e.clientY - top - height / 2) * (height > width ? (width / height) : 1), dirName = ['top', 'right', 'bottom', 'left'], direction = Math.round((((Math.atan2(y, x) * 180 / Math.PI) + 180) / 90) + 3) % 4;
        return dirName[direction];
    };
    CanvasEvent.prototype.moveScrollBar = function (direction) {
        var totalWidth = this.form.dataView.rect.totalWidth, totalHeight = this.form.dataView.rect.totalHeight + this.form.options.lineHeight, viewWidth = this.form.dataView.rect.viewWidth, viewHeight = this.rect.viewHeight - this.rect.headerHeight, _self = this;
        switch (direction) {
            case "top":
                window['directionTimeID'] = setInterval(function () {
                    _self.rect.scrollTop -= 10;
                    if (_self.rect.scrollTop <= 0) {
                        clearInterval(window['directionTimeID']);
                        window['directionTimeID'] = null;
                    }
                    _self.setScrollPos(undefined, _self.rect.scrollTop);
                }, 10);
                break;
            case "right":
                window['directionTimeID'] = setInterval(function () {
                    _self.rect.scrollLeft += 10;
                    if (_self.rect.scrollLeft >= totalWidth - viewWidth) {
                        clearInterval(window['directionTimeID']);
                        window['directionTimeID'] = null;
                    }
                    _self.setScrollPos(_self.rect.scrollLeft, undefined);
                }, 10);
                break;
            case "bottom":
                window['directionTimeID'] = setInterval(function () {
                    _self.rect.scrollTop += 10;
                    if (_self.rect.scrollTop >= totalHeight - viewHeight) {
                        clearInterval(window['directionTimeID']);
                        window['directionTimeID'] = null;
                    }
                    _self.setScrollPos(undefined, _self.rect.scrollTop);
                }, 10);
                break;
            default:
                window['directionTimeID'] = setInterval(function () {
                    _self.rect.scrollLeft -= 10;
                    if (_self.rect.scrollLeft <= 0) {
                        clearInterval(window['directionTimeID']);
                        window['directionTimeID'] = null;
                    }
                    _self.setScrollPos(_self.rect.scrollLeft, undefined);
                }, 10);
        }
    };
    CanvasEvent.prototype.mouseup = function (e) {
        if (this.state == 'resizeCol') {
            this.dragEnd(e.clientX);
            window['active'] = this.container;
            return;
        }
        e.stopPropagation();
        if (window['active'] != this.container) {
            window['active'] = this.container;
            return false;
        }
        var index;
        if (this.state != 'drag') {
            return false;
        }
        if (this.firstTarget && this.lastTarget) {
            index = this.firstTarget.row.index < this.lastTarget.row.index ? this.firstTarget.row.index : this.lastTarget.row.index;
            this.setSelectedRow(index);
            this.getSelectItems(this.firstTarget, this.lastTarget);
            this.selectState = 'double';
            this.curTarget = null;
        }
    };
    CanvasEvent.prototype.copy = function (e) {
        var copyText = this.selectText;
        if (copyText == '') {
            copyText = ' ';
        }
        if (copyText) {
            this.copyArea.value = copyText;
            this.copyArea.select();
            this.Scope.changeState();
        }
    };
    CanvasEvent.prototype.paste = function (e, operateDataList, type) {
        if (!this.selectedRange || !this.selectedRange.rows || !this.selectedRange.columns) {
            return;
        }
        var clipText = this.copyArea.value, Data = this.form.dataView.rows, items, row = [], line = [], columns = this.selectedRange.columns, rows = this.selectedRange.rows, target = {}, reg = /\r/;
        if (type) {
            columns = operateDataList.selectedRange.columns;
            rows = operateDataList.selectedRange.rows;
        }
        items = clipText.split("\n");
        if (!items[items.length - 1] && items[items.length - 1] !== 0) {
            items.pop();
        }
        for (var k = 0; k < items.length; k++) {
            items[k] = items[k].split("\t");
        }
        if (items.length > 0) {
            if (items.length == 1 && rows.length > 1) {
                for (var g = 1; g < rows.length; g++) {
                    items[g] = items[0];
                }
            }
            else if (rows.length % items.length == 0 && rows.length != items.length) {
                var newItem = [];
                for (var f = 0; f < items.length; f++) {
                    for (var d = f; d < rows.length; d += items.length) {
                        newItem[d] = items[f];
                    }
                }
                items = newItem;
            }
            if (items[0].length == 1 && columns.length > 1) {
                for (var p = 0; p < items.length; p++) {
                    for (var q = 0; q < columns.length; q++) {
                        items[p][q] = items[p][0];
                    }
                }
            }
            for (var i = 0; i < items.length; i++) {
                if ((Data.length == i) || (rows[0].showNo + i > Data.length)) {
                    break;
                }
                row[i] = Data[rows[0].showNo - 1 + i];
            }
            for (var j = 0; j < items[0].length; j++) {
                if (columns.length == 1) {
                    line = this.findColumns(columns[0], items[0].length);
                    break;
                }
                line[j] = columns[j];
            }
            for (var m = 0; m < row.length; m++) {
                target["row"] = row[m];
                for (var n = 0; n < line.length; n++) {
                    target["column"] = line[n];
                    target["value"] = String(items[m][n]).replace(reg, "");
                    if (type == 'undo' && operateDataList) {
                        target["value"] = operateDataList.data[m][n].from.toString();
                    }
                    else if (type == 'redo' && operateDataList) {
                        target["value"] = operateDataList.data[m][n].to.toString();
                    }
                    this.afterPaste(target, m, n);
                }
            }
            // 全部单元格粘贴完成回调
            if (this.afterPasteComplete) {
                if (!type) {
                    this.afterPasteComplete(this.selectedRange);
                }
                else {
                    this.afterPasteComplete();
                }
            }
        }
    };
    CanvasEvent.prototype.findColumns = function (row, num) {
        var leafFrozenCols = this.form.dataView.leafFrozenCols, leafActiveCols = this.form.dataView.leafActiveCols, columns = [], leafColumns;
        if (row.isFrozen == true) {
            leafColumns = leafFrozenCols.concat(leafActiveCols);
        }
        else {
            leafColumns = leafActiveCols;
        }
        for (var i = row.index; i < leafColumns.length; i++) {
            if (columns.length >= num) {
                break;
            }
            if (leafColumns[i].isColumnHide != true) {
                columns.push(leafColumns[i]);
            }
        }
        return columns;
    };
    CanvasEvent.prototype.getCurrentCell = function (e) {
        var options = this.options, container = document.querySelector('#eventOf' + options.name), x = e.clientX - container.getBoundingClientRect().left, y = e.clientY - container.getBoundingClientRect().top, headerHeight = this.rect.headerHeight, rows = this.form.dataView.renderRows, target = { rect: {} }, scrollLeft = this.rect.scrollLeft, numbers, columns;
        if (!x || !y || x > container.clientWidth || y > container.clientHeight) {
            return;
        }
        target.rect.clickX = x;
        target.rect.clickY = y;
        if (y < headerHeight) {
            target.rect.x = x;
            target.rect.y = y;
            target.row = 'header';
        }
        else {
            numbers = Math.floor((y - headerHeight) / options.lineHeight);
            if (numbers <= rows.length) {
                target.row = rows[numbers];
                target.rect.top = headerHeight + numbers * options.lineHeight;
                target.rect.height = options.lineHeight;
            }
        }
        if (x < this.rect.frozenWidth) {
            columns = target.row == 'header' ? this.form.dataView.frozenColumns : this.form.dataView.leafFrozenCols;
            scrollLeft = 0;
        }
        else {
            columns = target.row == 'header' ? this.form.dataView.renderColumns : this.form.dataView.renderLeafCols;
        }
        for (var i = 0, len = columns.length; i < len; i++) {
            if (columns[i].isColumnHide) {
                continue;
            }
            if (columns[i].x - scrollLeft >= x || x >= columns[i].x + columns[i].width - scrollLeft) {
                continue;
            }
            if (target.row == 'header' && (columns[i].y >= y || y >= columns[i].y + columns[i].height)) {
                continue;
            }
            target.column = columns[i];
            target.rect.left = columns[i].x - scrollLeft;
            target.rect.width = columns[i].width;
            break;
        }
        if (!target.column && x >= this.rect.frozenWidth) {
            for (var j = columns.length - 1; j >= 0; j--) {
                if (x >= columns[j].x + columns[j].width - scrollLeft && x <= columns[j].x + columns[j].width - scrollLeft + 8 && !columns[j].isColumnHide) {
                    target.column = columns[j];
                    target.rect.left = columns[j].x - scrollLeft;
                    target.rect.width = columns[j].width;
                    break;
                }
            }
            if (!target.column && x - this.rect.frozenWidth <= 8) {
                var frozenColumns = target.row == 'header' ? this.form.dataView.frozenColumns : this.form.dataView.leafFrozenCols;
                target.column = frozenColumns[frozenColumns.length - 1];
                target.rect.left = frozenColumns[frozenColumns.length - 1].x - scrollLeft;
                target.rect.width = frozenColumns[frozenColumns.length - 1].width;
            }
        }
        target.actionType = this.getActionType(target);
        if (target.row && target.column) {
            return target;
        }
    };
    CanvasEvent.prototype.clickEventAssignment = function (target) {
        if (!target.actionType) {
            return;
        }
        if (target.row == 'header') {
            this.handleHeader(target);
        }
        else {
            this.handleBody(target);
        }
    };
    CanvasEvent.prototype.handleHeader = function (target) {
        if (target.actionType.type == 'operate') {
            this.destoryScope();
            this.doAction(target);
            return;
        }
        this.selectColumn(target);
    };
    CanvasEvent.prototype.handleBody = function (target) {
        switch (target.actionType.type) {
            case 'operate':
                this.doAction(target);
                break;
            case 'input':
                this.showEdit(target);
                break;
            default: break;
        }
    };
    CanvasEvent.prototype.getActionType = function (target) {
        if (!target.column || !target.row) {
            return;
        }
        var delatX = target.rect.clickX - target.rect.left, deltaY = target.rect.clickY - target.rect.top, iconList = target.column.iconList, column = target.column, options = {}, headIconList = target.column.headIconList, inputWidth;
        if (target.column && target.column.ID == 'tree') {
            if (target.row && target.row.isMiddleLevel) {
                var level = this.options.startLevel == 1 ? target.row.level - 1 : target.row.level;
                if (20 * level + column.textIndent + 3 < delatX && delatX < 20 * level + column.textIndent + 17) {
                    if ((this.options.lineHeight - 14) * 0.5 < deltaY && deltaY < (this.options.lineHeight - 14) * 0.5 + 14) {
                        options['type'] = 'operate';
                        options['operateType'] = 'expand';
                    }
                }
            }
            if (target.row == 'header' && (delatX - column.textIndent) / 20 > 0) {
                options['type'] = 'operate';
                options['operateType'] = 'expandToLevel';
                options['expandToLevel'] = Math.ceil((delatX - column.textIndent) / 20);
            }
        }
        if (iconList && iconList.length > 0 && target.row != 'header') {
            for (var i = 0, len = iconList.length; i < len; i++) {
                if (iconList[i].left && iconList[i].left < delatX && delatX < (iconList[i].left + this.options.iconSize)) {
                    options['type'] = iconList[i].type;
                    options['operateType'] = iconList[i].operateType;
                    if (iconList[i].hoverSrc != undefined) {
                        options['isIcon'] = true;
                    }
                }
                if (iconList[i].right && column.width - iconList[i].right < delatX && delatX < column.width - iconList[i].right + this.options.iconSize) {
                    options['type'] = iconList[i].type;
                    options['operateType'] = iconList[i].operateType;
                    options['isIcon'] = true;
                    if (iconList[i].hoverSrc != undefined) {
                        options['isIcon'] = true;
                    }
                }
            }
        }
        else if (headIconList && headIconList.length > 0 && target.row == 'header') {
            for (var j = 0, length = headIconList.length; j < length; j++) {
                if (headIconList[j].left && headIconList[j].left < delatX && delatX < (headIconList[j].left + this.options.iconSize)) {
                    options['type'] = headIconList[j].type;
                    options['operateType'] = headIconList[j].operateType;
                }
                if (headIconList[j].right && column.width - headIconList[j].right < delatX && delatX < column.width - headIconList[j].right + this.options.iconSize) {
                    options['type'] = headIconList[j].type;
                    options['operateType'] = headIconList[j].operateType;
                }
            }
        }
        if (column.inputType == 'inner' && target.row != 'header') {
            inputWidth = column.inputStyle.width;
            if (column.inputStyle.right) {
                inputWidth = column.width - column.inputStyle.left - column.inputStyle.right;
            }
            if (column.inputStyle.left < delatX && delatX < column.inputStyle.left + inputWidth && options['type'] != 'operate') {
                options['type'] = 'input';
            }
            target.rect.width = inputWidth;
            target.rect.left = target.rect.left + column.inputStyle.left;
            target.rect.height = this.options.lineHeight - column.inputStyle.padding * 2;
            target.rect.top = target.rect.top + column.inputStyle.padding;
        }
        if (column.hasTips == true && !options.type) {
            options['type'] = 'tips';
        }
        if (target.row == 'header') {
            if (delatX <= 8) {
                options['borderPos'] = 'right';
            }
            if (delatX > 8 && target.rect.width - delatX <= 8) {
                options['borderPos'] = 'left';
            }
        }
        return options;
    };
    CanvasEvent.prototype.showEdit = function (target, type) {
        if ((target && target.column && target.column.editType != 'input' && target.column.editType != 'select') && target.actionType.type != 'input') {
            return;
        }
        var inputOptions = this.beforeInputShow ? this.beforeInputShow(target, type) : undefined;
        if (!inputOptions || inputOptions.result == false) {
            return;
        }
        if (inputOptions.type == 'select' && !type) {
            this.showSelect(target);
        }
        else {
            this.showInput(target, inputOptions);
        }
    };
    CanvasEvent.prototype.showInput = function (target, inputOptions) {
        if (this.inputState == 'inputing') {
            return;
        }
        this.inputState = 'inputing';
        this.Input.target = target;
        this.Input.show(inputOptions);
    };
    CanvasEvent.prototype.showSelect = function (target) {
        target.rect.top += this.options.lineHeight;
        this.Select.show(target);
    };
    CanvasEvent.prototype.showToolTip = function (target) {
        this.ToolTip.target = target;
        this.ToolTip.beforeToolTipShow = this.beforeToolTipShow;
        this.ToolTip.init(this.container);
    };
    CanvasEvent.prototype.doAction = function (target) {
        if (target.column.ID == 'tree' && target.actionType.operateType == 'expand') {
            this.form.dataView.expandGridTree(target);
            this.destoryScope();
            this.form.update();
        }
        else if (target.actionType.operateType == "downArrow") {
            this.showEdit(target);
        }
        else if (target.column.ID == 'tree' && target.actionType.operateType == 'expandToLevel') {
            if (this.options.expandToLevel == false) {
                return;
            }
            this.form.dataView.expandToLevel(target.actionType.expandToLevel);
            this.destoryScope();
        }
        else {
            this.afterAction(target);
        }
    };
    CanvasEvent.prototype.handleHover = function (e) {
        var target = this.getCurrentCell(e);
        if (this.timeId) {
            clearTimeout(this.timeId);
            this.timeId = undefined;
        }
        if (!target) {
            return;
        }
        if (!target.column.children && (target.actionType.borderPos == 'left' || target.actionType.borderPos == 'right')) {
            if (target.actionType.borderPos == 'left') {
                this.dragTarget = target.column;
            }
            else {
                if (target.column.isFrozen) {
                    this.dragTarget = this.form.dataView.leafFrozenCols[target.column.index - 1];
                }
                else {
                    if (target.column.index - 1 >= 0) {
                        var activeCol = false;
                        for (var i = target.column.index - 1; i >= 0; i--) {
                            if (this.form.dataView.leafActiveCols[i].isColumnHide == false) {
                                activeCol = true;
                                this.dragTarget = this.form.dataView.leafActiveCols[i];
                                break;
                            }
                        }
                        if (!activeCol) {
                            this.dragTarget = this.form.dataView.leafFrozenCols[this.form.dataView.leafFrozenCols.length - 1];
                        }
                    }
                    else {
                        this.dragTarget = this.form.dataView.leafFrozenCols[this.form.dataView.leafFrozenCols.length - 1];
                    }
                }
            }
            if (this.dragTarget.resizable == false || this.dragTarget.ID == 'tree') {
                this.dragTarget = null;
                return;
            }
            this.dragStart();
            return;
        }
        else {
            if (this.options.hasHover == true && this.hoverTarget && this.hoverTarget.row.NO != target.row.NO) {
                this.form.dataView.hoverTarget = target;
                this.form.render.render();
            }
            if (this.options.hasHover == true && target.row.NO + '_' + target.column.ID + '_' + target.actionType.operateType != this.form.dataView.hoverIcon) {
                this.form.dataView.hoverIcon = undefined;
                this.form.render.render();
            }
            if (this.options.hasHover == true && target.actionType.isIcon == true) {
                this.form.dataView.hoverIcon = target.row.NO + '_' + target.column.ID + '_' + target.actionType.operateType;
                this.form.render.render();
            }
            this.hoverTarget = target;
            this.timeId = setTimeout(function () {
                if (this.hoverTarget.actionType) {
                    this.hoverTarget.clientX = e.clientX;
                    this.hoverTarget.clientY = e.clientY;
                    this.showToolTip(this.hoverTarget);
                }
            }.bind(this), 500);
        }
    };
    CanvasEvent.prototype.destory = function () {
        this.Input.hide();
        this.Select.hide();
        this.ToolTip.destory();
    };
    CanvasEvent.prototype.showScope = function (target) {
        if (window['active'] != this.container) {
            this.destoryScope(this.options.name);
        }
        if (!target) {
            return;
        }
        this.Scope.showScope(target, target, this.form.render.treeWidth);
        if (target.row[target.column.ID] != undefined) {
            this.selectText = target.row[target.column.ID];
            var copyOption = this.beforeCopy ? this.beforeCopy(target) : undefined;
            if (copyOption && copyOption.text != undefined) {
                this.selectText = copyOption.text;
            }
        }
        else {
            this.selectText = '';
        }
        this.selectedRange['rows'] = [target.row];
        this.selectedRange['columns'] = [target.column];
    };
    CanvasEvent.prototype.selectColumn = function (target) {
        var rows = this.form.dataView.rows || [];
        this.firstTarget = {};
        this.lastTarget = {};
        this.firstTarget['column'] = target.column;
        this.lastTarget['column'] = target.column;
        this.firstTarget['row'] = rows[0];
        this.lastTarget['row'] = rows[rows.length - 1];
        this.getSelectItems(this.firstTarget, this.lastTarget);
        this.updateScope();
        this.curTarget = null;
        this.Scope.changeState('none');
    };
    CanvasEvent.prototype.updateScope = function () {
        if (!this.firstTarget || !this.lastTarget) {
            return;
        }
        this.Scope.showScope(this.firstTarget, this.lastTarget, this.form.render.treeWidth);
    };
    CanvasEvent.prototype.handleDrag = function (e) {
        e.preventDefault();
        if (this.state == 'scrollDrag') {
            return;
        }
        if (this.state == 'resizeCol') {
            this.updateResizePos(e);
        }
        else {
            this.selectByScope(e);
        }
    };
    CanvasEvent.prototype.selectByScope = function (e) {
        if (window['active'] != this.container) {
            return;
        }
        var target = this.getCurrentCell(e);
        if (!target || target.column.ID == 'tree') {
            return;
        }
        if (target.row == 'header' && this.selectState != 'columnSelect' && this.selectState != 'preSelect') {
            if (e.shiftKey && (this.firstTarget || this.curTarget)) {
                this.firstTarget['row'] = this.form.dataView.rows[0];
                this.firstTarget['column'] = this.curTarget ? this.curTarget.column : this.firstTarget.column;
                this.selectState = 'columnSelect';
            }
            else {
                this.selectColumn(target);
                this.selectState = 'columnSelect';
                return;
            }
        }
        if (this.selectState == 'single' || this.selectState == 'none') {
            this.firstTarget = target;
            this.showScope(target);
            this.selectState = 'preSelect';
            return;
        }
        if (this.firstTarget && this.lastTarget && this.selectState == 'double') {
            this.firstTarget = target;
            this.showScope(target);
            this.selectState = 'preSelect';
            return;
        }
        if (!this.firstTarget) {
            return;
        }
        this.dragTimeId = setTimeout(function () {
            this.state = 'drag';
            this.lastTarget = target;
            if (this.selectState == 'columnSelect') {
                this.lastTarget.row = this.form.dataView.rows[this.form.dataView.rows.length - 1];
            }
            else if (target.row == 'header') {
                this.lastTarget.row = this.form.dataView.rows[0];
            }
            this.updateScope();
            this.Scope.changeState('none');
        }.bind(this), 0);
    };
    CanvasEvent.prototype.getSelectItems = function (first, last) {
        var row = [], selectedColumns = [], text = "", result = "", rowNo, numbers;
        var leftTarget = first, rightTarget = last, columns, startIndex, endIndex, copyOption;
        this.selectedRange['columns'] = [];
        if (first.column.x > last.column.x) {
            leftTarget = last;
            rightTarget = first;
        }
        startIndex = leftTarget.column.index;
        endIndex = rightTarget.column.index + 1;
        numbers = Math.abs(first.row.showNo - last.row.showNo) + 1;
        rowNo = first.row.showNo - last.row.showNo > 0 ? last.row.showNo : first.row.showNo;
        row = this.form.dataView.rows.slice(rowNo - 1, rowNo - 1 + numbers);
        if (rightTarget.column.isFrozen) {
            columns = this.form.dataView.leafFrozenCols;
        }
        else if (!leftTarget.column.isFrozen) {
            columns = this.form.dataView.leafActiveCols;
        }
        else {
            endIndex = this.form.dataView.leafFrozenCols.length;
            selectedColumns = this.form.dataView.leafFrozenCols.slice(startIndex, endIndex);
            startIndex = 0;
            endIndex = rightTarget.column.index + 1;
            columns = this.form.dataView.leafActiveCols;
        }
        selectedColumns = selectedColumns.concat(columns.slice(startIndex, endIndex));
        for (var m = 0; m < row.length; m++) {
            for (var n = 0; n < selectedColumns.length; n++) {
                if (selectedColumns[n].isColumnHide) {
                    continue;
                }
                if (m == 0) {
                    this.selectedRange.columns.push(selectedColumns[n]);
                }
                text = (row[m][selectedColumns[n].ID] != undefined ? row[m][selectedColumns[n].ID] : "");
                copyOption = this.beforeCopy ? this.beforeCopy({ row: row[m], column: selectedColumns[n] }) : undefined;
                if (copyOption && copyOption.text != undefined) {
                    text = copyOption.text;
                }
                if (n < selectedColumns.length - 1) {
                    text += '\t';
                }
                result += text;
            }
            result = result + '\n';
        }
        this.selectText = result;
        this.selectedRange['rows'] = row;
    };
    CanvasEvent.prototype.handleKeyDown = function (e) {
        // 方向键
        if (e.keyCode >= 37 && e.keyCode <= 40 || e.keyCode == 13 || e.keyCode == 9) {
            e.preventDefault();
            e.stopPropagation();
            this.inputState = '';
            this.setSelectedCell(e);
            this.Scope.changeState('none');
        }
        if (e.keyCode == 27) {
            if (this.inputState == 'inputing') {
                this.inputState = '';
                return;
            }
            this.Scope.changeState('none');
        }
        if (e.keyCode == 67 && e.ctrlKey == true) {
            this.copy(e);
        }
        if (e.keyCode == 86 && e.ctrlKey == true) {
            this.copyArea.select();
            setTimeout(this.paste.bind(this), 0);
        }
        if (e.ctrlKey != true && (e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode >= 48 && e.keyCode <= 57)) {
            if (!this.curTarget) {
                return;
            }
            this.showEdit(this.curTarget, 'keydown');
        }
        // if (e.ctrlKey == true && e.keyCode == '89') {
        //     e.stopPropagation();
        //     this.redo();
        // }
        // if (e.ctrlKey == true && e.keyCode == '90') {
        //     e.stopPropagation();
        //     this.undo();
        // }
    };
    // private undo() {
    //     var operate: any = this.History.undo();
    //     if (operate) {
    //         this.doHistory(operate, 'undo');
    //     }
    // }
    // private redo() {
    //     var operate = this.History.redo();
    //     if (operate) {
    //         this.doHistory(operate, 'redo');
    //     }
    // }
    CanvasEvent.prototype.doHistory = function (operate, type) {
        switch (operate.operateType) {
            case 'input':
                this.afterInput(operate.target, operate, type);
                break;
            case 'select':
                this.comboBoxChange(operate.to, operate, type);
                break;
            case 'paste':
                this.paste(operate.target, operate, type);
                break;
            default:
                break;
        }
    };
    CanvasEvent.prototype.dragStart = function () {
        this.state = 'resizeCol';
        document.getElementById('eventOf' + this.options.name).style.cursor = 'col-resize';
    };
    CanvasEvent.prototype.dragCancel = function () {
        this.state = '';
        document.getElementById('eventOf' + this.options.name).style.cursor = 'default';
        this.dragTarget = null;
        this.dragCell = null;
    };
    CanvasEvent.prototype.dragEnd = function (mousePos) {
        if (!this.dragTarget) {
            return;
        }
        var width = mousePos - document.getElementById(this.container).getBoundingClientRect().left - this.calcLeftPos();
        var minWidth = this.dragTarget.minWidth ? this.dragTarget.minWidth : 30;
        var maxWidth = this.dragTarget.maxWidth ? this.dragTarget.maxWidth : this.rect.viewWidth * 0.9;
        if (this.dragTarget.isFrozen) {
            var activeMaxColWidth = this.getActiveMaxColWidth();
            var lastWidth = this.getFrozenWidth(this.dragTarget, activeMaxColWidth);
            maxWidth = lastWidth >= maxWidth ? maxWidth : lastWidth;
        }
        this.state = '';
        if (width <= minWidth) {
            width = minWidth;
        }
        if (width >= maxWidth) {
            width = maxWidth;
        }
        document.getElementById('eventOf' + this.options.name).style.cursor = 'default';
        this.destory();
        this.destoryScope();
        if (this.dragCell) {
            this.dragCell.parentNode.removeChild(this.dragCell);
        }
        this.dragCell = null;
        this.firstTarget = null;
        if (width == this.dragTarget.width) {
            return;
        }
        this.form.dataView.updateWidthByID(this.dragTarget.ID, width);
        this.form.updateFrame();
        this.form.update();
        this.dragTarget.width = width;
        if (this.afterResizeColumn) {
            this.afterResizeColumn(this.dragTarget);
        }
        this.dragTarget = null;
    };
    CanvasEvent.prototype.getFrozenWidth = function (column, maxWidth) {
        var columns = this.form.dataView.frozenColumns, lastWidth = this.rect.viewWidth - maxWidth; //剩余可供调整宽度
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].ID != column.ID) {
                lastWidth -= columns[i].width;
            }
        }
        return lastWidth - 2;
    };
    CanvasEvent.prototype.getActiveMaxColWidth = function () {
        var maxWidth, columns = this.form.dataView.activeColumns;
        for (var i = 0, len = columns.length; i < len; i++) {
            if (!columns[i].isColumnHide && !maxWidth) {
                maxWidth = columns[i].width;
            }
            if (maxWidth && columns[i].width > maxWidth) {
                maxWidth = columns[i].width;
            }
        }
        return maxWidth;
    };
    CanvasEvent.prototype.updateResizePos = function (e) {
        if (!this.dragTarget) {
            return;
        }
        if (this.dragCell) {
            this.dragCell.style.right = this.rect.viewWidth - (e.clientX - e.currentTarget.getBoundingClientRect().left) - 5 + 'px';
        }
        else {
            var dragCell = document.createElement('div');
            dragCell.setAttribute('id', 'dragCellOf' + this.options.name);
            dragCell.style.position = 'absolute';
            dragCell.style.border = '1px dashed #aaa';
            dragCell.style.top = '-1px';
            dragCell.style.bottom = '-1px';
            dragCell.style.left = this.calcLeftPos() + 'px';
            dragCell.style.right = this.rect.viewWidth - (e.clientX - e.currentTarget.getBoundingClientRect().left) - 5 + 'px';
            document.getElementById(this.container).appendChild(dragCell);
            this.dragCell = dragCell;
        }
    };
    CanvasEvent.prototype.calcLeftPos = function () {
        var left = this.dragTarget.x - this.rect.scrollLeft;
        if (this.dragTarget.isFrozen) {
            left = this.dragTarget.x;
        }
        else {
            left = left < this.rect.frozenWidth ? this.rect.frozenWidth : left;
        }
        return left;
    };
    CanvasEvent.prototype.handleScroll = function (target) {
        var top = (target.row.showNo) * this.rect.lineHeight + this.rect.headerHeight - this.rect.scrollTop;
        var scrollLeft = undefined, scrollTop = undefined;
        if (target.column.x - this.rect.scrollLeft < this.rect.frozenWidth) {
            scrollLeft = this.rect.scrollLeft - this.rect.frozenWidth + target.column.x - this.rect.scrollLeft;
        }
        if (target.column.x + target.column.width - this.rect.scrollLeft > this.rect.viewWidth) {
            scrollLeft = target.column.x + target.column.width - this.rect.viewWidth;
        }
        if (top + this.options.lineHeight > this.rect.viewHeight) {
            scrollTop = this.rect.scrollTop + this.options.lineHeight + top - this.rect.viewHeight;
        }
        else if (top <= this.rect.headerHeight) {
            scrollTop = this.rect.scrollTop + top - this.rect.headerHeight - this.rect.lineHeight;
        }
        if (scrollLeft == undefined && scrollTop == undefined) {
            return target;
        }
        this.setScrollPos(scrollLeft, scrollTop);
        if (scrollLeft) {
            target.rect.left = target.column.x - scrollLeft + 1;
            return target;
        }
    };
    CanvasEvent.prototype.setSelectedCell = function (e) {
        // 13：Enter；9：Tab；37：左，38：上；39：右；40：下；
        // 上下左右分别移动当前单元格至对应方向；Enter同40，Shift + Enter 同38；
        // Tab同39，Shift + Tab 同37，可以换行；
        // Shift + 方向键，分别选中对应方向的单元格；
        // Ctrl + 方向键，分别移动到边界单元格；
        var rows = this.form.dataView.rows, columns, key = e.keyCode, tempTarget = this.curTarget ? this.curTarget : this.firstTarget;
        columns = this.form.dataView.renderFrozenCols;
        if (!tempTarget) {
            return;
        }
        for (var i = 0, len = this.form.dataView.leafActiveCols.length; i < len; i++) {
            if (!this.form.dataView.leafActiveCols[i].isColumnHide) {
                columns = columns.concat([this.form.dataView.leafActiveCols[i]]);
            }
        }
        for (var j = 0; j < columns.length; j++) {
            if (columns[j].ID == 'tree') {
                columns.splice(j, 1);
            }
            columns[j].colIndex = j;
        }
        if (e.ctrlKey && 37 <= key && key <= 40) {
            switch (key) {
                case 37: {
                    tempTarget.column = columns[0];
                    break;
                }
                case 38: {
                    tempTarget.row = rows[0];
                    break;
                }
                case 39: {
                    tempTarget.column = columns[columns.length - 1];
                    break;
                }
                case 40: {
                    tempTarget.row = rows[rows.length - 1];
                    break;
                }
                default:
                    break;
            }
            this.curTarget = tempTarget;
            this.firstTarget = null;
            this.lastTarget = null;
            this.showScope(this.curTarget);
            this.setSelectedRow(this.curTarget.row.id, this.curTarget.row.showNo);
        }
        else {
            if (e.shiftKey && key != 9 && key != 13) {
                if (this.lastTarget) {
                    tempTarget = this.lastTarget;
                }
                else {
                    tempTarget = this.curTarget;
                    this.firstTarget = JSON.parse(JSON.stringify(this.curTarget));
                    this.curTarget = null;
                }
            }
            else {
                tempTarget = this.curTarget ? this.curTarget : this.firstTarget;
            }
            if ((key == 38 || (e.shiftKey && key == 13)) && tempTarget.row.showNo > 1) {
                tempTarget.row = rows[tempTarget.row.showNo - 2];
            }
            if ((key == 40 || (!e.shiftKey && key == 13)) && tempTarget.row.showNo < rows.length) {
                if (key == 13 && this.inputState == 'inputing') {
                    this.inputState = '';
                }
                tempTarget.row = rows[tempTarget.row.showNo];
            }
            if (key == 37 && tempTarget.column.colIndex > 0) {
                tempTarget.column = columns[tempTarget.column.colIndex - 1];
            }
            if (key == 39 && tempTarget.column.colIndex < columns.length - 1) {
                tempTarget.column = columns[tempTarget.column.colIndex + 1];
            }
            if (e.keyCode == 9 && !e.shiftKey) {
                if (tempTarget.column.colIndex < columns.length - 1) {
                    tempTarget.column = columns[tempTarget.column.colIndex + 1];
                }
                else if (tempTarget.row.showNo < rows.length) {
                    tempTarget.column = columns[0];
                    tempTarget.row = rows[tempTarget.row.showNo];
                }
                else if (tempTarget.column.colIndex == columns.length - 1 && tempTarget.row.showNo == rows.length) {
                    tempTarget.column = columns[0];
                    tempTarget.row = rows[0];
                }
            }
            if (e.keyCode == 9 && e.shiftKey) {
                if (tempTarget.column.colIndex > 0) {
                    tempTarget.column = columns[tempTarget.column.colIndex - 1];
                }
                else if (tempTarget.row.showNo > 1) {
                    tempTarget.column = columns[columns.length - 1];
                    tempTarget.row = rows[tempTarget.row.showNo - 2];
                }
                else if (tempTarget.column.colIndex == 0 && tempTarget.row.showNo == 1) {
                    tempTarget.column = columns[columns.length - 1];
                    tempTarget.row = rows[rows.length - 1];
                }
            }
            if (e.shiftKey && key != 9 && key != 13) {
                this.lastTarget = tempTarget;
                this.getSelectItems(this.firstTarget, this.lastTarget);
                this.setSelectedRow(this.firstTarget.row.id, this.lastTarget.row.showNo);
                this.updateScope();
            }
            else {
                this.curTarget = tempTarget;
                if (this.firstTarget) {
                    this.firstTarget = null;
                    this.lastTarget = null;
                }
                this.setSelectedRow(this.curTarget.row.id, this.curTarget.row.showNo);
                this.showScope(this.curTarget);
            }
        }
        this.handleScroll(tempTarget);
        tempTarget = null;
    };
    CanvasEvent.prototype.setSelectedRow = function (index, no) {
        this.form.dataView.selectedRow = index;
        this.form.dataView.selectedRowByRender = no;
        this.form.render.render();
    };
    CanvasEvent.prototype.getSelections = function () {
        return this.selectedRange;
    };
    return CanvasEvent;
}());



/***/ }),

/***/ "./App/grid/canvas.grid.fileSaver.ts":
/*!*******************************************!*\
  !*** ./App/grid/canvas.grid.fileSaver.ts ***!
  \*******************************************/
/*! exports provided: FileSaver */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FileSaver", function() { return FileSaver; });
var FileSaver = /** @class */ (function () {
    function FileSaver(options) {
        this.table = '';
        this.options = options;
    }
    FileSaver.prototype.exportToExcel = function (fileName, sheetName) {
        var blob, excel;
        this.table = '';
        this.renderTable();
        excel = this.initExcel(sheetName);
        blob = new Blob([excel], { type: 'vnd.ms-excel' });
        this.downLoad(blob, fileName + '.xls');
    };
    FileSaver.prototype.initExcel = function (sheetName) {
        var excelFile = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
        excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel"; charset="UTF-8">';
        excelFile += '<head>';
        excelFile += '<!--[if gte mso 9]>';
        excelFile += '<xml>';
        excelFile += '<x:ExcelWorkbook>';
        excelFile += '<x:ExcelWorksheets>';
        excelFile += '<x:ExcelWorksheet>';
        excelFile += '<x:Name>';
        excelFile += sheetName || 'New Sheet';
        excelFile += '</x:Name>';
        excelFile += '<x:WorksheetOptions>';
        excelFile += '<x:DisplayGridlines/>';
        excelFile += '<x:SummaryBelow/>';
        excelFile += '<x:sheetPr><x:outlinePr><x:summaryBelow="0"/></x:outlinePr</x:sheetPr>';
        excelFile += '</x:WorksheetOptions>';
        excelFile += '</x:ExcelWorksheet>';
        excelFile += '</x:ExcelWorksheets>';
        excelFile += '</x:ExcelWorkbook>';
        excelFile += '</xml>';
        excelFile += '<![endif]-->';
        excelFile += '</head>';
        excelFile += '<body>';
        excelFile += this.table;
        excelFile += '</body>';
        excelFile += '</html>';
        return excelFile;
    };
    FileSaver.prototype.renderTable = function () {
        this.table += '<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">';
        var rows = ['header'].concat(this.dataView.allRows);
        for (var i = 0, len = rows.length; i < len; i++) {
            this.renderRow(rows[i]);
        }
        this.table += '</table>';
    };
    FileSaver.prototype.renderRow = function (row) {
        var columns = this.dataView.leafFrozenCols.concat(this.dataView.leafActiveCols);
        this.table += '<tr height=30';
        if (row != 'header' && row.level >= 0) {
            this.table += ' style="mso-outline-level:' + row.level + '"';
        }
        this.table += '>';
        for (var i = 0, len = columns.length; i < len; i++) {
            if (columns[i].ID == 'tree') {
                continue;
            }
            this.renderCell(row, columns[i]);
        }
        this.table += '</tr>';
    };
    FileSaver.prototype.renderCell = function (row, column) {
        var options = this.beforeRenderCell ? this.beforeRenderCell({ row: row, column: column }) : {};
        //忽略对应列导出
        if (options.ignoreColumn == true) {
            return;
        }
        var text = row != 'header' ? row[column.ID] : column.name;
        var style = 'white-space:nowrap;vertical-align:middle;';
        this.table += '<td';
        if (row == 'header') {
            if (column.isColumnHide == true) {
                this.table += ' width=' + 0;
            }
            else {
                style += 'width:' + column.width + 'px; ';
            }
            style += 'text-align:center;';
        }
        else {
            style += 'text-align:left;';
            style += 'mso-char-indent-count:1;padding-left:' + column.textIndent + 'px;';
        }
        if (options.background) {
            style += 'background:' + options.background + ';';
        }
        if (options.font) {
            style += 'font:' + options.font + ';';
        }
        if (options.color) {
            style += 'color:' + options.color + ';';
        }
        if (options.borderTop) {
            style += 'border-top:' + options.borderTop + ';';
        }
        if (options.borderRight) {
            style += 'border-right:' + options.borderRight + ';';
        }
        if (options.borderBottom) {
            style += 'border-bottom:' + options.borderBottom + ';';
        }
        if (options.borderLeft) {
            style += 'border-left:' + options.borderLeft + ';';
        }
        if (options.textType == 'text') {
            style += "mso-number-format:'\@';";
        }
        this.table += ' style="' + style + '">';
        if (row != 'header' && options.text != undefined) {
            text = options.text;
        }
        this.table += this.escapeHTHL(text);
        this.table += '</td>';
    };
    FileSaver.prototype.escapeHTHL = function (str) {
        var entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#x2F;',
            " ": '&nbsp;'
        };
        function escapeHtml(str) {
            return String(str).replace(/[&<>"'\/ ]/g, function (s) {
                return entityMap[s];
            });
        }
        return escapeHtml(str);
    };
    FileSaver.prototype.downLoad = function (blob, fileName) {
        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName);
        }
        else {
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(link.href);
        }
    };
    return FileSaver;
}());



/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map