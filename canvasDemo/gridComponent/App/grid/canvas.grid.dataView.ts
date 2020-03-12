class DataView {
    public rows: Array<any>;
    public allRows: Array<any>;
    public rect: any;
    public rowData: Array<any>;
    public updateFrame: any;
    public treeState: any;
    public beforeFilterRow: any;
    public beforeInitRow: any;
    public rowsMap: any;
    protected columns: Array<any>;
    protected options: any;
    protected renderColumns: Array<any>;
    protected activeColumns: Array<any>;
    protected leafActiveCols: Array<any>;
    protected renderLeafCols: Array<any>;
    protected frozenColumns: Array<any>;
    protected renderFrozenCols: Array<any>;
    protected leafFrozenCols: Array<any>;
    protected renderRows: Array<any> = [];
    protected colsLevel: number = 1;
    protected rowLevel: number = 1;
    protected hoverTarget: any;
    protected hoverIcon: any;
    protected selectedRow: any;
    protected selectedRowByRender: any;

    constructor(options, columns) {
        this.options = options;
        this.columns = columns;
        this.initRect();
    }

    public init() {
        this.initColums();
    }

    public initRow() {
        this.initRows();
    }

    public doFilter(rowsMap) {
        this.rowsMap = rowsMap;
        this.filterRows();
    }

    public update() {
        var minX = this.rect.scrollLeft + this.rect.frozenWidth,
            maxX = this.rect.scrollLeft + this.rect.viewWidth,
            minY = this.rect.scrollTop,
            maxY = this.rect.scrollTop + this.rect.viewHeight - this.rect.headerHeight;
        this.updateRenderRows(minY, maxY);
        this.updateRenderCols(minX, maxX);
    }

    public toggleTree() {
        if (this.treeState != 'fold') {
            this.treeState = 'fold';
            this.updateWidthByID('tree', 0);
        } else {
            this.treeState = 'expand';
            this.updateWidthByID('tree', 'expand');
        }
    }

    public jumpToRow(key, value) {
        var rows = this.rows;
        for (var i = 0, len = rows.length; i < len; i++) {
            if (rows[i][key] == value) {
                this.selectedRowByRender = rows[i].showNo;
                this.selectedRow = rows[i].index;
                return rows[i];
            }
        }
    }

    private initRect() {
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
    }

    private initColums() {
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
    }

    private calcLevel(columns, level) {
        if (level > this.colsLevel) {
            this.colsLevel = level;
        }
        for (var i = 0, len = columns.length; i < len; i++) {
            columns[i].level = level;
            if (columns[i].children) {
                this.calcLevel(columns[i].children, level + 1);
            } else if (columns[i].percentageWidth != true) {
                this.rect.widthSetByNum += columns[i].width;
            }
        }
        this.rect.headerHeight = this.colsLevel * this.options.headerHeight;
    }

    private calcPos(columns, coordinateX, coordinateY, columnID?, width?) {
        var curWidth = 0, percent = 0,
            adaptiveWidth = this.rect.viewWidth - this.rect.widthSetByNum;
        for (var i = 0, len = columns.length; i < len; i++) {
            if (!columns[i].isColumnHide) {
                columns[i].x = coordinateX;
                columns[i].y = coordinateY;
            }
            if (columns[i].children) {
                columns[i].height = this.options.headerHeight;
                columns[i].width = this.calcPos(columns[i].children, coordinateX, columns[i].height + coordinateY, columnID, width);
            } else {
                columns[i].height = (this.colsLevel - columns[i].level + 1) * this.options.headerHeight;
                columns[i].width = columns[i].width ? columns[i].width : 120;
                if (!columnID) {
                    if (columns[i].percentageWidth == true && typeof (columns[i].width) == "string") {
                        percent = columns[i].width.replace('%', '') / 100;
                        columns[i].width = adaptiveWidth > 0 ? adaptiveWidth * percent : 120;
                    }
                    columns[i] = this.checkMaxMinWidth(columns[i]);
                } else if (width != undefined && columns[i].ID == columnID) {
                    if (columnID == 'tree' && width == 'expand') {
                        columns[i].width = columns[i].textIndent * 2 + this.rowLevel * 20;
                    } else {
                        columns[i].width = width;
                    }
                }
                if (columns[i].isFrozen == true) {
                    this.leafFrozenCols.push(columns[i]);
                    this.leafFrozenCols[this.leafFrozenCols.length - 1]['index'] = this.leafFrozenCols.length - 1;
                } else {
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
            } else {
                this.activeColumns.push(columns[i]);
            }
            if (!columns[i].isColumnHide) {
                coordinateX += columns[i].width;
            }
        }
        return curWidth;
    }

    private checkMaxMinWidth(column) {
        var minWidth = column.minWidth ? column.minWidth : 30,
            maxWidth = column.maxWidth ? column.maxWidth : this.rect.viewWidth * 0.9;
        if (column.width < minWidth) {
            column.width = minWidth;
        }
        if (maxWidth > 0 && column.width > maxWidth) {
            column.width = maxWidth;
        }
        return column;
    }

    private updateRenderCols(minX, maxX) {
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
    }

    private updateRenderRows(minY, maxY) {
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
    }

    private expandGridTree(target) {
        var programID = target.row.id,
            data = this.rowData;
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
    }

    private expandToLevel(level) {
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
            } else if (data[i].level < level) {
                data[i].isFold = false;
            }
        }
        this.filterRows();
    }

    private filterRows() {
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
            } else {
                currentLevel = undefined;
            }
        }
        this.rect.totalHeight = this.rows.length * this.options.lineHeight < this.rect.viewHeight - this.rect.headerHeight ? this.rows.length * this.options.lineHeight : (this.rows.length + 1) * this.options.lineHeight;
        this.updateFrame();
    }

    private initRows() {
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
            } else {
                if (isHide == true) {
                    continue;
                }
                result = true;
            }
            if (this.options.startLevel == 0 && rows[i].level + 1 > this.rowLevel) {
                this.rowLevel = rows[i].level + 1;
            } else if (this.options.startLevel == 0 && rows[i].level > this.rowLevel) {
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
            } else {
                currentLevel = undefined;
            }
        }
        this.rect.totalHeight = this.rows.length * this.options.lineHeight < this.rect.viewHeight - this.rect.headerHeight ? this.rows.length * this.options.lineHeight : (this.rows.length + 1) * this.options.lineHeight;
        this.updateFrame();
    }

    private updateWidthByID(ID, width) {
        this.frozenColumns = [];
        this.activeColumns = [];
        this.renderLeafCols = [];
        this.renderFrozenCols = [];
        this.leafActiveCols = [];
        this.leafFrozenCols = [];
        this.rect.totalWidth = 0;
        this.rect.frozenWidth = 0;
        this.calcPos(this.columns, 0, 0, ID, width);
    }
}

export { DataView };