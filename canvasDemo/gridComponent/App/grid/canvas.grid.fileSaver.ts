class FileSaver {

    public dataView: any;
    public beforeRenderCell: any;
    private options: any;
    private table: string = '';

    constructor(options) {
        this.options = options;
    }

    public exportToExcel(fileName, sheetName) {
        var blob, excel;
        this.table = '';
        this.renderTable();
        excel = this.initExcel(sheetName);
        blob = new Blob([excel], { type: 'vnd.ms-excel' });
        this.downLoad(blob, fileName + '.xls');
    }

    private initExcel(sheetName) {
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
    }

    private renderTable() {
        this.table += '<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">';
        var rows = ['header'].concat(this.dataView.allRows);
        for (var i = 0, len = rows.length; i < len; i++) {
            this.renderRow(rows[i]);
        }
        this.table += '</table>';
    }

    private renderRow(row) {
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
    }

    private renderCell(row, column) {
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
            } else {
                style += 'width:' + column.width + 'px; ';
            }
            style += 'text-align:center;';
        } else {
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
    }
    private escapeHTHL(str) {
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
    }

    private downLoad(blob, fileName) {
        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName);
        } else {
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(link.href);
        }
    }
}

export { FileSaver };