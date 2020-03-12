import { Input } from '../component/input';
import { Select } from '../component/select';
import { ToolTip } from '../component/toolTip';
import { Scope } from '../component/scope';
import { PageSelect } from '../component/pageSelect';
// import {History } from './canvas.grid.history';

class CanvasEvent {
    public beforeInputShow: any;
    public beforeSelectShow: any;
    public afterSelectShow: any;
    public cellClick: any;
    public afterClick: any;
    public afterInput: any;
    public afterInputInit: any;
    public afterSelected: any;
    public afterSelectItem: any;
    public afterAction: any;
    public initSelectData: any;
    public choseChecked: any;
    public beforeToolTipShow: any;
    public afterPaste: any;
    public afterPasteComplete: any;
    public afterResizeColumn: any;
    public beforeCopy: any;
    public beforeScroll: any;
    public comboBoxChange: any;
    public beforeClick: any;
    private container: any;
    private hoverEvent: any;
    private form: any;
    private Input: Input;
    private Scope;
    private pageSelect;
    private Select: Select;
    private ToolTip: ToolTip;
    private isDestory = true;
    private curTarget: any;
    private firstTarget: any;
    private lastTarget: any;
    private selectText: any;
    private copyArea: any;
    private options: any;
    private rect: any;
    private timeId: any;
    private dragTimeId: any;
    private state: any = '';
    private selectState: any = 'none';
    private dragTarget: any;
    private dragCell: any;
    private mousePos: any;
    private hoverTarget: any;
    private leaveDirection: any;
    private scrollX: any;
    private scrollY: any;
    private scrollStartPosX;
    private scrollStartPosY;
    private scrollBarType;
    private selectedRange: any = {};
    private inputState: any;
    // private History: History;

    constructor(form) {
        this.form = form;
        this.options = form.options;
        this.rect = form.dataView.rect;
        this.hoverTarget = form.dataView.hoverTarget;
        this.container = 'eventOf' + this.options.name;
        this.Input = new Input();
        this.ToolTip = new ToolTip();
        this.pageSelect = new PageSelect(this);
        this.scrollDragEnd = this.scrollDragEnd.bind(this);
        this.setScrollPos = this.setScrollPos.bind(this);
        // this.History = new History();
    }

    public init() {
        this.initEvent();
        if (this.options.hasCellSelect) {
            this.Scope = new Scope(this.container, this.options.name, this.rect);
            this.copyArea = document.getElementById('copyAreaOf' + this.options.name);
        }
        if (this.options.hasPageSelect) {
            this.pageSelect.init(this.container, this.options);
        }
        this.Select = new Select(this.options.container, this.options.name);
        this.Select.initSelectData = this.initSelectData;
        this.Select.afterSelected = this.afterSelected;
        this.Input.afterInputInit = this.afterInputInit;
        this.Input.afterInput = this.afterInput;
        this.Input.init(this.options.name, this.rect);
    }

    public destoryEvent(e) {
        window['active'] = 'document';
        clearInterval(window['directionTimeID']);
        window['directionTimeID'] = null;
        this.destory();
        this.destoryScope();
        this.selectedRange = {};
    }

    public updateScroll() {
        this.setScrollPos(this.rect.scrollLeft, this.rect.scrollTop);
    }

    public destoryScope(name?, target?) {
        if (this.options.hasCellSelect == true) {
            if (name) {
                this.Scope.destory(name);
                if (!target || this.container != window["active"]) {
                    this.curTarget = null;
                    this.firstTarget = null;
                    this.lastTarget = null;
                }
            } else {
                this.Scope.destory();
                this.curTarget = null;
                this.firstTarget = null;
                this.lastTarget = null;
            }
        }
        this.selectState = 'none';
    }

    public scrollIntoView(isCenter?) {
        var height = this.form.dataView.selectedRowByRender * this.rect.lineHeight, scrollTop;
        if (isCenter) {
            if (height <= this.rect.scrollTop) {
                if (height < Math.floor((this.rect.viewHeight - this.rect.headerHeight) / 2)) {
                    scrollTop = 0;
                } else {
                    scrollTop = height - Math.floor((this.rect.viewHeight - this.rect.headerHeight) / 2);
                }
            } else if (height > this.rect.scrollTop + this.rect.viewHeight - this.rect.headerHeight) {
                scrollTop = height - Math.floor((this.rect.viewHeight - this.rect.headerHeight) / 2);
            }
        } else {
            if (height - this.rect.lineHeight <= this.rect.scrollTop) {
                scrollTop = height - this.rect.lineHeight;
            } else if (height + this.rect.lineHeight > this.rect.scrollTop + this.rect.viewHeight - this.rect.headerHeight) {
                scrollTop = height - this.rect.viewHeight + this.rect.headerHeight + this.rect.lineHeight;
            }
        }
        this.setScrollPos(undefined, scrollTop);
    }

    public onfocus() {
        document.getElementById('eventOf' + this.options.name).focus();
        window['active'] = this.container;
    }
    public onblur() {
        document.getElementById('eventOf' + this.options.name).blur();
    }
    public updateCurtarget(row, isLastRow) {
        if (!this.curTarget) {
            this.curTarget = {};
            var columns = this.form.dataView.columns,
                column;
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
    }

    private setScrollPos(scrollLeft, scrollTop) {
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
    }

    private updateScrollBarPos() {
        var viewHeight = this.rect.viewHeight - this.rect.headerHeight;
        this.scrollX.style.left = this.rect.scrollLeft * this.rect.viewWidth / this.rect.totalWidth + 'px';
        this.scrollY.style.top = this.rect.scrollTop * viewHeight / this.rect.totalHeight + this.rect.headerHeight + 'px';
    }

    private initEvent() {
        var options = this.options,
            eventLayer = document.querySelector('#eventOf' + options.name),
            mousewheel = 'mousewheel';
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
    }
    private click(e) {
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
        } else {
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
            } else if (this.curTarget && this.curTarget.row == target.row && this.curTarget.column.ID == target.column.ID) {
                this.clickEventAssignment(target);
                state = true;
            } else if (target.column.clickShow) {
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
        } else {
            this.clickEventAssignment(target);
        }
    }

    private contextmenu(e) {
        e.preventDefault();
    }

    private mousewheel(e) {
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
            } else {
                scrollLeft = this.rect.scrollLeft - 50;
            }
        } else {
            if (this.rect.totalHeight <= this.rect.viewHeight - this.rect.headerHeight) {
                return;
            }
            if (e.wheelDelta < 0) {
                scrollTop = this.rect.scrollTop + this.options.lineHeight;
            } else {
                scrollTop = this.rect.scrollTop - this.options.lineHeight;
            }
        }
        if (this.beforeScroll) {
            this.beforeScroll();
        }
        this.setScrollPos(scrollLeft, scrollTop);
    }

    private scroll() {
        if (window['active'] != this.container) {
            this.destoryScope(this.container);
        }
        this.destory();
        this.updateScrollBarPos();
        this.form.update();
        if (this.options.hasCellSelect) {
            if (this.lastTarget && window['active'] == this.container) {
                this.updateScope();
            } else {
                this.showScope(this.curTarget);
            }
        }
    }

    private scrollDragstart(e) {
        document.body.onmousemove = this.scrollDraging.bind(this);
        var body = document.getElementsByTagName('body');
        body[0].addEventListener('click', this.scrollDragEnd);
        body[0].addEventListener('mouseleave', this.scrollDragEnd);
        if (e.target.id.indexOf('scrollX') >= 0) {
            this.scrollBarType = 'scrollX';
            this.scrollX.style.background = 'rgba(102,102,102,0.8)';
            this.scrollStartPosX = e.screenX;
        } else {
            this.scrollBarType = 'scrollY';
            this.scrollY.style.background = 'rgba(102,102,102,0.8)';
            this.scrollStartPosY = e.screenY;
        }
        if (this.beforeScroll) {
            this.beforeScroll();
        }
        this.state = 'scrollDrag';
    }

    private scrollDraging(e) {
        var scrollLeft, scrollTop;
        e.preventDefault();
        if (this.scrollBarType == 'scrollX') {
            scrollLeft = this.rect.scrollLeft + (e.screenX - this.scrollStartPosX) * (this.rect.totalWidth / this.rect.viewWidth);
            this.scrollStartPosX = e.screenX;
        } else {
            scrollTop = this.rect.scrollTop + (e.screenY - this.scrollStartPosY) * (this.rect.totalHeight / (this.rect.viewHeight - this.rect.headerHeight));
            this.scrollStartPosY = e.screenY;
        }
        this.setScrollPos(scrollLeft, scrollTop);
    }

    private scrollDragEnd(e) {
        e.stopPropagation();
        this.scrollX.style.background = 'rgba(153,153,153,0.8)';
        this.scrollY.style.background = 'rgba(153,153,153,0.8)';
        document.body.onmousemove = null;
        var body = document.getElementsByTagName('body');
        body[0].removeEventListener('click', this.scrollDragEnd);
        body[0].removeEventListener('mouseleave', this.scrollDragEnd);
        this.state = '';
        this.onfocus();
    }

    private mousemove(e) {
        if (e.buttons == 1) {
            if (this.timeId) {
                clearTimeout(this.timeId);
                this.timeId = undefined;
            }
            if (this.state != 'drag') {
                this.ToolTip.destory();
            }
            this.handleDrag(e);
        } else {
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
    }

    private mouseLeave(e) {
        if (e.buttons == 1) {
            this.dragEnd(e.clientX);
        } else {
            if (this.timeId) {
                clearTimeout(this.timeId);
                this.timeId = undefined;
            }
        }
        if (this.state == "drag") {
            this.leaveDirection = this.getLeaveDirection(e);
            this.moveScrollBar(this.leaveDirection);
        }
    }

    private mouseEnter(e) {
        this.leaveDirection = "";
        if (e.buttons == 0 || window['directionTimeID'] || this.state == 'drag' || this.state == 'scrollDrag') {
            window["active"] = this.container;
        } else {
            window["active"] = 'document';
        }
        clearInterval(window['directionTimeID']);
        window['directionTimeID'] = null;
    }

    private getLeaveDirection(e) {
        var left = this.form.context.canvas.getBoundingClientRect().left,
            top = this.form.context.canvas.getBoundingClientRect().top,
            width = this.form.context.canvas.getBoundingClientRect().width,
            height = this.form.context.canvas.getBoundingClientRect().height,
            x = (e.clientX - left - width / 2) * (width > height ? (height / width) : 1),
            y = (e.clientY - top - height / 2) * (height > width ? (width / height) : 1),
            dirName = ['top', 'right', 'bottom', 'left'],
            direction = Math.round((((Math.atan2(y, x) * 180 / Math.PI) + 180) / 90) + 3) % 4;
        return dirName[direction];
    }
    private moveScrollBar(direction) {
        var totalWidth = this.form.dataView.rect.totalWidth,
            totalHeight = this.form.dataView.rect.totalHeight + this.form.options.lineHeight,
            viewWidth = this.form.dataView.rect.viewWidth,
            viewHeight = this.rect.viewHeight - this.rect.headerHeight,
            _self = this;
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
    }

    private mouseup(e) {
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
    }

    private copy(e) {
        var copyText = this.selectText;
        if (copyText == '') {
            copyText = ' ';
        }
        if (copyText) {
            this.copyArea.value = copyText;
            this.copyArea.select();
            this.Scope.changeState();
        }
    }

    private paste(e, operateDataList?, type?) {
        if (!this.selectedRange || !this.selectedRange.rows || !this.selectedRange.columns) {
            return;
        }
        var clipText = this.copyArea.value,
            Data = this.form.dataView.rows,
            items,
            row = [],
            line = [],
            columns = this.selectedRange.columns,
            rows = this.selectedRange.rows,
            target = {},
            reg = /\r/;
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
            } else if (rows.length % items.length == 0 && rows.length != items.length) {
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
                    } else if (type == 'redo' && operateDataList) {
                        target["value"] = operateDataList.data[m][n].to.toString();
                    }
                    this.afterPaste(target, m, n);
                }
            }
            // 全部单元格粘贴完成回调
            if (this.afterPasteComplete) {
                if (!type) {
                    this.afterPasteComplete(this.selectedRange);
                } else {
                    this.afterPasteComplete();
                }
            }
        }
    }

    private findColumns(row, num) {
        var leafFrozenCols = this.form.dataView.leafFrozenCols,
            leafActiveCols = this.form.dataView.leafActiveCols, columns = [], leafColumns;
        if (row.isFrozen == true) {
            leafColumns = leafFrozenCols.concat(leafActiveCols);
        } else {
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
    }
    private getCurrentCell(e) {
        var options = this.options,
            container = document.querySelector('#eventOf' + options.name),
            x = e.clientX - container.getBoundingClientRect().left,
            y = e.clientY - container.getBoundingClientRect().top,
            headerHeight = this.rect.headerHeight,
            rows = this.form.dataView.renderRows,
            target: any = { rect: {} },
            scrollLeft = this.rect.scrollLeft,
            numbers, columns;
        if (!x || !y || x > container.clientWidth || y > container.clientHeight) {
            return;
        }
        target.rect.clickX = x;
        target.rect.clickY = y;
        if (y < headerHeight) {
            target.rect.x = x;
            target.rect.y = y;
            target.row = 'header';
        } else {
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
        } else {
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
    }

    private clickEventAssignment(target) {
        if (!target.actionType) {
            return;
        }
        if (target.row == 'header') {
            this.handleHeader(target);
        } else {
            this.handleBody(target);
        }
    }

    private handleHeader(target) {
        if (target.actionType.type == 'operate') {
            this.destoryScope();
            this.doAction(target);
            return;
        }
        this.selectColumn(target);
    }

    private handleBody(target) {
        switch (target.actionType.type) {
            case 'operate':
                this.doAction(target);
                break;
            case 'input':
                this.showEdit(target);
                break;
            default: break;
        }
    }

    private getActionType(target) {
        if (!target.column || !target.row) {
            return;
        }
        var delatX = target.rect.clickX - target.rect.left,
            deltaY = target.rect.clickY - target.rect.top,
            iconList = target.column.iconList,
            column = target.column,
            options: any = {},
            headIconList = target.column.headIconList,
            inputWidth;
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
        } else if (headIconList && headIconList.length > 0 && target.row == 'header') {
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
    }
    private showEdit(target, type?) {
        if ((target && target.column && target.column.editType != 'input' && target.column.editType != 'select') && target.actionType.type != 'input') {
            return;
        }
        var inputOptions = this.beforeInputShow ? this.beforeInputShow(target, type) : undefined;
        if (!inputOptions || inputOptions.result == false) {
            return;
        }
        if (inputOptions.type == 'select' && !type) {
            this.showSelect(target);
        } else {
            this.showInput(target, inputOptions);
        }
    }

    private showInput(target, inputOptions) {
        if (this.inputState == 'inputing') {
            return;
        }
        this.inputState = 'inputing';
        this.Input.target = target;
        this.Input.show(inputOptions);
    }

    private showSelect(target) {
        target.rect.top += this.options.lineHeight;
        this.Select.show(target);
    }

    private showToolTip(target) {
        this.ToolTip.target = target;
        this.ToolTip.beforeToolTipShow = this.beforeToolTipShow;
        this.ToolTip.init(this.container);
    }

    private doAction(target) {
        if (target.column.ID == 'tree' && target.actionType.operateType == 'expand') {
            this.form.dataView.expandGridTree(target);
            this.destoryScope();
            this.form.update();
        } else if (target.actionType.operateType == "downArrow") {
            this.showEdit(target);
        } else if (target.column.ID == 'tree' && target.actionType.operateType == 'expandToLevel') {
            if (this.options.expandToLevel == false) {
                return;
            }
            this.form.dataView.expandToLevel(target.actionType.expandToLevel);
            this.destoryScope();
        } else {
            this.afterAction(target);
        }
    }

    private handleHover(e) {
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
            } else {
                if (target.column.isFrozen) {
                    this.dragTarget = this.form.dataView.leafFrozenCols[target.column.index - 1];
                } else {
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
                    } else {
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
        } else {
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
    }

    private destory() {
        this.Input.hide();
        this.Select.hide();
        this.ToolTip.destory();
    }

    private showScope(target) {
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
        } else {
            this.selectText = '';
        }
        this.selectedRange['rows'] = [target.row];
        this.selectedRange['columns'] = [target.column];
    }

    private selectColumn(target) {
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
    }

    private updateScope() {
        if (!this.firstTarget || !this.lastTarget) {
            return;
        }
        this.Scope.showScope(this.firstTarget, this.lastTarget, this.form.render.treeWidth);
    }

    private handleDrag(e) {
        e.preventDefault();
        if (this.state == 'scrollDrag') {
            return;
        }
        if (this.state == 'resizeCol') {
            this.updateResizePos(e);
        } else {
            this.selectByScope(e);
        }
    }

    private selectByScope(e) {
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
            } else {
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
            } else if (target.row == 'header') {
                this.lastTarget.row = this.form.dataView.rows[0];
            }
            this.updateScope();
            this.Scope.changeState('none');
        }.bind(this), 0);
    }
    private getSelectItems(first, last) {
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
        } else if (!leftTarget.column.isFrozen) {
            columns = this.form.dataView.leafActiveCols;
        } else {
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
    }

    private handleKeyDown(e) {
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
    }

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

    private doHistory(operate, type) {
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
    }

    private dragStart() {
        this.state = 'resizeCol';
        document.getElementById('eventOf' + this.options.name).style.cursor = 'col-resize';
    }

    private dragCancel() {
        this.state = '';
        document.getElementById('eventOf' + this.options.name).style.cursor = 'default';
        this.dragTarget = null;
        this.dragCell = null;
    }

    private dragEnd(mousePos) {
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
    }

    private getFrozenWidth(column, maxWidth) {
        var columns = this.form.dataView.frozenColumns,
            lastWidth = this.rect.viewWidth - maxWidth; //剩余可供调整宽度
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].ID != column.ID) {
                lastWidth -= columns[i].width;
            }
        }
        return lastWidth - 2;
    }

    private getActiveMaxColWidth() {
        var maxWidth,
            columns = this.form.dataView.activeColumns;
        for (var i = 0, len = columns.length; i < len; i++) {
            if (!columns[i].isColumnHide && !maxWidth) {
                maxWidth = columns[i].width;
            }
            if (maxWidth && columns[i].width > maxWidth) {
                maxWidth = columns[i].width;
            }
        }
        return maxWidth;
    }

    private updateResizePos(e) {
        if (!this.dragTarget) {
            return;
        }
        if (this.dragCell) {
            this.dragCell.style.right = this.rect.viewWidth - (e.clientX - e.currentTarget.getBoundingClientRect().left) - 5 + 'px';
        } else {
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
    }
    private calcLeftPos() {
        var left = this.dragTarget.x - this.rect.scrollLeft;
        if (this.dragTarget.isFrozen) {
            left = this.dragTarget.x;
        } else {
            left = left < this.rect.frozenWidth ? this.rect.frozenWidth : left;
        }
        return left;
    }

    private handleScroll(target) {
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
        } else if (top <= this.rect.headerHeight) {
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
    }

    private setSelectedCell(e) {

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
        } else {
            if (e.shiftKey && key != 9 && key != 13) {
                if (this.lastTarget) {
                    tempTarget = this.lastTarget;
                } else {
                    tempTarget = this.curTarget;
                    this.firstTarget = JSON.parse(JSON.stringify(this.curTarget));
                    this.curTarget = null;
                }
            } else {
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
                } else if (tempTarget.row.showNo < rows.length) {
                    tempTarget.column = columns[0];
                    tempTarget.row = rows[tempTarget.row.showNo];
                } else if (tempTarget.column.colIndex == columns.length - 1 && tempTarget.row.showNo == rows.length) {
                    tempTarget.column = columns[0];
                    tempTarget.row = rows[0];
                }
            }
            if (e.keyCode == 9 && e.shiftKey) {
                if (tempTarget.column.colIndex > 0) {
                    tempTarget.column = columns[tempTarget.column.colIndex - 1];
                } else if (tempTarget.row.showNo > 1) {
                    tempTarget.column = columns[columns.length - 1];
                    tempTarget.row = rows[tempTarget.row.showNo - 2];
                } else if (tempTarget.column.colIndex == 0 && tempTarget.row.showNo == 1) {
                    tempTarget.column = columns[columns.length - 1];
                    tempTarget.row = rows[rows.length - 1];
                }
            }
            if (e.shiftKey && key != 9 && key != 13) {
                this.lastTarget = tempTarget;
                this.getSelectItems(this.firstTarget, this.lastTarget);
                this.setSelectedRow(this.firstTarget.row.id, this.lastTarget.row.showNo);
                this.updateScope();
            } else {
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
    }

    private setSelectedRow(index, no?) {
        this.form.dataView.selectedRow = index;
        this.form.dataView.selectedRowByRender = no;
        this.form.render.render();
    }

    private getSelections() {
        return this.selectedRange;
    }
}
export { CanvasEvent };