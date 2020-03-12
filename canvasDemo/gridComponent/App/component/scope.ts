class Scope {
    private rect: any;
    private container: any;
    private scopeDiv: any;
    private scopeLine: any;
    private state: string = 'solid';

    constructor(containerId, formName, rect) {
        this.container = document.getElementById(containerId);
        this.rect = rect;
        this.init(formName);
    }

    public changeState(type) {
        if (type == 'none') {
            this.scopeDiv.style["border-style"] = 'solid';
            this.state = 'solid';
            return;
        }
        this.scopeDiv.style["border-style"] = 'dashed';
        this.state = 'dashed';
    }

    public showScope(firstTarget, lastTarget?, treeWidth?) {
        lastTarget = lastTarget ? lastTarget : firstTarget;
        var rect = this.rect,
            height = this.container.clientHeight,
            width = this.container.clientWidth,
            scrollNum = parseInt(rect.scrollTop / rect.lineHeight + ''),
            top, bottom, left, right, leftTarget = firstTarget, rightTarget = lastTarget, topTarget = firstTarget, bottomTarget = lastTarget;
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
        } else {
            left = leftTarget.column.x - rect.scrollLeft;
            left = left < rect.frozenWidth ? rect.frozenWidth : left;
        }
        if (rightTarget.column.isFrozen) {
            right = width - (rightTarget.column.x + rightTarget.column.width);
        } else {
            right = width - (rightTarget.column.x + rightTarget.column.width - rect.scrollLeft);
        }
        right = right < 0 ? 0 : right;
        if (top + bottom >= height) {
            this.scopeDiv.style.display = 'none';
            this.scopeLine.style.display = 'none';
            return;
        } else {
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
    }

    public destory(name?) {
        var scopeDiv = document.getElementsByClassName('scopeDiv'),
            scopeLine = document.getElementsByClassName('scopeLine');
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
    }

    private init(formName) {
        var copyArea = document.createElement('textarea'),
            scopeDiv = document.createElement('div'),
            scopeLine = document.createElement('div');
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
    }
}
export {Scope };