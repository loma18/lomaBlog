class CanvasDraw {

    public data: any;
    public selectedRow: any;
    public rowID: any;
    public beforeRenderCell: any;
    public beforeRenderIcon: any;
    public beforeRenderColumn: any;
    public beforeRenderRow: any;
    public beforeRenderText: any;
    public context: any;
    private options: any;
    private iconList: any;
    private rect: any;
    private tipsMap: any;
    private treeWidth: any;

    constructor(options) {
        this.options = options;
    }

    public render() {
        this.rect = this.data.rect;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.clearRect(0, 0, this.rect.viewWidth, this.rect.viewHeight);
        this.tipsMap = {};
        this.treeWidth = this.getTreeWidth();
        this.renderHeader();
        this.renderBody();
    }

    private renderHeader() {
        var frozenColumns = this.data.frozenColumns,
            activeColumns = this.data.renderColumns,
            renderFrozenCols = this.data.renderFrozenCols,
            context = this.context,
            options = this.options;
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
    }

    private drawCell(data) {
        var context = this.context, iconResult;
        var x = data.x,
            y = data.y,
            w = (data.ID == 'tree' ? this.treeWidth : data.width),
            h = data.height,
            text = data.name,
            textX = data.x,
            textIndent = this.options.textIndent ? this.options.textIndent : 8,
            textY = data.y + data.height * 0.5,
            textW = (data.ID == 'tree' ? this.treeWidth : data.width) - 2 * textIndent,
            options = this.options;
        if (data.headerTextAlign || options.headerAlign) {
            context.textAlign = data.headerTextAlign ? data.headerTextAlign : options.headerAlign;
        } else {
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
        } else if (data.headerTextAlign == 'end') {
            context.textAlign = 'end';
            textX = textX + data.width - textIndent;
        } else {
            textX += textIndent;
        }

        if (data.noLine == 2) {
            this.strokeRect(x - 0.5 - 40, y - 2, w + 40, h);
        } else if (data.noLine != 1) {
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
    }

    private renderBody() {
        var rows = this.data.renderRows,
            context = this.context,
            options = this.options,
            headerHeight = this.data.colsLevel * options.headerHeight;
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
    }

    private getTreeWidth() {
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
    }

    private renderRow(row, columns, num, isLeafCols) {
        if (!row || columns.length <= 0) {
            return;
        }
        var context = this.context,
            options = this.options,
            y = options.lineHeight * num + this.rect.scrollTop,
            h = options.lineHeight,
            rowOption, isLast = false;
        if (options.hasHover == true && this.data.hoverTarget && row.NO == this.data.hoverTarget.row.NO) {
            row['isHover'] = true;
        } else {
            row['isHover'] = false;
        }
        rowOption = this.beforeRenderRow ? this.beforeRenderRow(row) : null;
        if (rowOption && rowOption.background) {
            context.save();
            context.fillStyle = rowOption.background;
            if (options.formStyle == 1) {
                if (isLeafCols) {
                    context.fillRect(0 - 0.5 + this.treeWidth, y - 1, this.rect.viewWidth - this.treeWidth + this.rect.scrollLeft, h);
                } else {
                    context.fillRect(0 - 0.5 + this.treeWidth, y - 1, this.rect.frozenWidth - this.treeWidth, h);
                }
            } else {
                context.fillRect(0 - 0.5 + this.rect.scrollLeft, y, this.rect.viewWidth, h);
            }
            context.restore();
        }
        if (options.borderLine == 'row') {
            if (options.formStyle == 1) {
                this.strokeRect(-1 + this.treeWidth, y - 1, this.rect.viewWidth + 2 + this.rect.scrollLeft, h);
            } else {
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
    }
    private renderCell(row, column, num, isLast) {
        var context = this.context,
            options = this.options,
            cellOptions,
            text = '',
            e: any = {}, iconResult: any,
            columnID = column.ID,
            x = column.x,
            y = options.lineHeight * num + this.rect.scrollTop,
            w = column.width,
            h = options.lineHeight,
            textY = y + h * 0.5,
            textX,
            textW;
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
            } else {
                textX = x + iconResult.beforeTextIcon + options.textIndent;
                textW = iconResult.afterTextIcon - iconResult.beforeTextIcon - options.textIndent;
            }
        } else {
            textX = column.textIndent ? x + column.textIndent : x + options.textIndent;
            textW = column.textIndent ? w - column.textIndent * 2 : w - options.textIndent * 2;
        }

        if (text != undefined && text != null && textW > 0) {
            this.renderText(text, textX, textY, textW, row, column);
        }
    }

    private strokeRect(x, y, w, h) {
        this.context.strokeRect(x + 0.5, y + 0.5, w, h);
    }

    private renderIcon(icons, row, column, y, height) {
        var options = this.options,
            iconOptions,
            iconSrc, iconX,
            iconW = this.options.iconSize,
            iconH = this.options.iconSize,
            iconY = y + (height - iconH) * 0.5,
            beforeTextIcon = 0, afterTextIcon = column.width,
            e = { row: row, column: column };
        for (var i = 0, len = icons.length; i < len; i++) {
            e['iconNum'] = i;
            if (row.NO + '_' + column.ID + '_' + icons[i].operateType == this.data.hoverIcon) {
                e['isHover'] = true;
            } else {
                e['isHover'] = false;
            }
            iconOptions = this.beforeRenderIcon ? this.beforeRenderIcon(e) : null;
            iconSrc = icons[i].src;
            if (iconOptions && iconOptions.result == true) {
                iconSrc = iconOptions.src ? iconOptions.src : icons[i].src;
            }
            if (icons[i].left) {
                iconX = column.x + icons[i].left;
            } else if (icons[i].right) {
                iconX = column.x + column.width - icons[i].right;
            }
            if (icons[i].position == 'beforeText') {
                if (iconX + iconW - column.x > beforeTextIcon) {
                    beforeTextIcon = iconX + iconW - column.x;
                }
            } else if (icons[i].position == 'afterText') {
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
    }

    private renderText(text, x, y, width, row, column) {
        var e = { 'row': row, 'column': column };
        var textOptions = this.beforeRenderText ? this.beforeRenderText(e) : null,
            context = this.context;
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
    }

    private fillText(text, x, y, width, column, rowIndex) {
        var context = this.context;
        if (context.measureText(text).width > width && !column.noOmit) {
            if (this.options.uid != undefined) {
                this.tipsMap[this.options.uid + "_" + rowIndex + "_" + column.ID] = text;
            }
            text = this.clipText(text.toString(), width);
        }
        context.fillText(text, x, y, width);
    }

    private clipText(text, width) {
        var context = this.context, result: any = parseInt(width) / 6.6,
            initiallyNum = parseInt(result),
            newText = text.substring(0, initiallyNum);
        if (context.measureText(newText + "...").width > width) {
            for (var i = initiallyNum; context.measureText(newText + "...").width > width && i >= 0; i--) {
                newText = text.substring(0, i);
            }
        } else {
            for (var j = initiallyNum; context.measureText(newText + "...").width < width; j++) {
                newText = text.substring(0, j);
            }
        }
        return newText + "...";
    }

    private drawTree(column, rowNo) {
        var row = this.data.renderRows[rowNo],
            level = this.options.startLevel == 1 ? row.level : row.level + 1,
            lineHeight = this.options.lineHeight,
            x, y, lineType, isLast, expandType,
            nextLevel, ctx = this.context;
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
            } else {
                expandType = false;
            }
            if (x + 16 < column.width) {
                this.drawExpand(ctx, x, y, 14, 14, expandType);
            }
        } else {
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
    }
    private comparePath(level, nextLevel, index, isLast) {
        var type = 'straight';
        if (isLast && level > nextLevel || !nextLevel || (index >= nextLevel && level - nextLevel > 1)) {
            type = 'break';
        }
        return type;
    }

    private drawSquare(ctx, x, y, w, h) {
        ctx.fillRect(x + 0.5, y + 0.5, w, h);
    }

    private drawExpand(ctx, x, y, w, h, type) {
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
        } else {
            ctx.beginPath();
            ctx.save();
            ctx.setLineDash(this.options.treeLineStyle);
            ctx.moveTo(x + 0.5 * w + 0.5, y + h);
            ctx.lineTo(x + 0.5 * w + 0.5, y + h + 12);
            ctx.stroke();
            ctx.restore();
        }
    }

    private drawLine(ctx, x, y, w, h, type) {
        ctx.save();
        ctx.setLineDash(this.options.treeLineStyle);
        if (type == 'straight') {
            ctx.beginPath();
            ctx.moveTo(x + 0.5, y + 0.5);
            ctx.lineTo(x + 0.5, y + h + 0.5);
            ctx.stroke();
        } else if (type == 'break') {
            ctx.beginPath();
            ctx.moveTo(x + 0.5, y + 0.5);
            ctx.lineTo(x + 0.5, y + 0.5 * h + 0.5);
            if (this.options.formStyle == 1) {
                ctx.lineTo(x + 10 + 0.5, y + 0.5 * h + 0.5);
            } else {
                ctx.lineTo(x + w + 0.5, y + 0.5 * h + 0.5);
            }
            ctx.stroke();
        }
        ctx.restore();
    }

    private drawSelect(ctx, x, y, w, h) {
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
    }
}

export { CanvasDraw as CanvasDraw };