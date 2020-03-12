class Input {
    public target: any;
    public afterInput: any;
    public afterInputInit: any;
    private cellInput: any;
    private container: any;
    private rect: any;
    private state: string;

    public init(formName, rect) {
        this.rect = rect;
        this.container = document.getElementById('eventOf' + formName);
        this.cellInput = document.createElement('input');
        this.cellInput.setAttribute('id', 'cellInput');
        this.container.appendChild(this.cellInput);
        this.initEvent();
    }

    public show(options) {
        this.cellInput.style.display = 'block';
        this.render(options);
        if (this.afterInputInit) {
            this.afterInputInit(this.target);
        }
    }

    public hide() {
        this.cellInput.style.display = 'none';
    }

    private afterEvent() {
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
    }

    private initEvent() {
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
            } else if (e.keyCode == 27) {
                self.state = 'keydown';
                self.container.focus();
                self.hide();
            } else {
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
    }

    private render(options) {
        var maxLength = options.maxLength,
            rect = this.rect,
            scrollNum = parseInt(rect.scrollTop / rect.lineHeight + ''),
            target = this.target,
            top, left, value;
        if (target.column.isFrozen) {
            left = target.column.x;
        } else {
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
    }
}

export { Input };