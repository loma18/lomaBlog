/**
 * 此文件处理表格控件中提示框相关的事件
 */

class ToolTip {
    public target: any;
    public beforeToolTipShow: any;
    protected container: any;
    protected toolTip: any;
    protected strTip: any;
    private batchBox: any;

    public init(id) {
        this.container = document.querySelector('#' + id);
        this.batchBox = this.container.parentElement;
        this.batchBox.style.position = "relative";
        this.strTip = this.beforeToolTipShow ? this.beforeToolTipShow(this.target) : '';
        if (this.strTip) {
            this.render();
        }
    }

    public destory() {
        var toolTip = document.getElementById('toolTip');
        if (toolTip && toolTip.parentNode) {
            toolTip.parentNode.removeChild(toolTip);

        }
    }

    private render() {
        var toolTip = document.createElement('div'),
            x,
            y,
            width,
            height,
            clientWidth,
            clientHeight;
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
            } else {
                this.toolTip.style.bottom = height - y + 10 + "px";
            }
        } else {
            this.toolTip.style.top = y + 16 + "px";
        }
        if (this.target.clientX + this.toolTip.getBoundingClientRect().width > clientWidth || x + this.toolTip.getBoundingClientRect().width > width) {
            if (x - this.toolTip.getBoundingClientRect().width < 0) {
                this.toolTip.style.right = 0;
            } else {
                this.toolTip.style.right = width - x + "px";
            }
        } else {
            this.toolTip.style.left = x + "px";
        }
        //如果窗口缩小，可能会使tips在左侧显示，影响序号列tips显示
        if (x < 50 || this.target.clientX < 50) {
            this.toolTip.style.right = "";
            this.toolTip.style.left = x + "px";
        }
    }
}

export {ToolTip };