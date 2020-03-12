import { CanvasDraw } from './canvas.grid.draw';
import { CanvasEvent } from './canvas.grid.events';
import { DataView } from "./canvas.grid.dataView";
import {FileSaver } from "./canvas.grid.fileSaver";

class CanvasGrid {

    protected context: any;
    protected dataView: DataView;
    protected events: CanvasEvent;
    protected options: any;
    protected render: CanvasDraw;
    protected fileSaver: FileSaver;

    constructor(options, columns) {
        this.initOptions(options);
        this.render = new CanvasDraw(this.options);
        this.dataView = new DataView(this.options, columns);
        this.events = new CanvasEvent(this);
        this.fileSaver = new FileSaver(this.options);
        this.fileSaver.dataView = this.dataView;
        this.dataView.updateFrame = this.updateFrame.bind(this);
        this.resize = this.resize.bind(this);
    }

    public init(): any {
        this.initCanvas();
        this.setCanvasSize();
        this.dataView.init();
        this.events.init();
        window.onresize = this.resize;
        this.render.data = this.dataView;
        this.render.render();
    }

    public update() {
        if (!this.dataView.rows || this.dataView.rows.length <= 0) {
            this.events.destoryScope();
        }
        this.dataView.update();
        this.render.render();
    }

    public updateColums() {
        this.dataView.init();
        this.setCanvasSize();
        this.setScrollBar();
        this.update();
    }

    public exportToExcel(fileName, sheetName) {
        // this.fileSaver.exportToExcel(fileName, sheetName);
    }

    public jumpToRow(key, value) {
        var row = this.dataView.jumpToRow(key, value);
        this.events.scrollIntoView(true);
        this.events.updateCurtarget(row, true);
        this.events.onfocus();
    }

    public resize() {
        var width = document.getElementById('eventOf' + this.options.name).getBoundingClientRect().width;
        if (width > 0) {
            this.updateFrame();
            this.update();
            this.onfocus();
        }
    }

    public toggleTree() {
        this.dataView.toggleTree();
        this.resize();
    }

    public onfocus() {
        this.events.onfocus();
    }
    public onblur() {
        this.events.onblur();
    }

    private initOptions(options) {
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
        for (const key in options) {
            this.options[key] = options[key];
        }
    }

    private initCanvas() {
        var container = document.getElementById(this.options.container),
            formName = this.options.name,
            htmlStr = '<div id="eventOf' + formName + '" tabindex=0  style="width:calc(100% - 8px);height:calc(100% - 8px);position:relative;z-index:1;overflow:hidden;outline:none;"><canvas id="canvasOf' + formName + '" style="width:100%;height:100%;outline:none;">当前浏览器不支持Canvas，请更换浏览器后重试!</canvas></div>'
                + '<div id = "scrollX' + formName + '"style="display:none;position:absolute;z-index:1;overflow:auto;height:8px;width:100px;border-radius:4px;bottom:0px;left:0px;background:rgba(153,153,153,0.8);"></div>'
                + '<div id = "scrollY' + formName + '"style="display:none;position:absolute;z-index:1;overflow:auto;height:100px;width:8px;border-radius:4px;right:0px;top:0px;background:rgba(153,153,153,0.8);"></div>';
        container.innerHTML = htmlStr;
        container.style.position = 'relative';
        var canvas: any = document.getElementById('canvasOf' + formName);
        this.context = canvas.getContext('2d');
        this.render.context = this.context;
    }

    private setScrollBar() {
        var options = this.options,
            rect = this.dataView.rect,
            scrollX = document.getElementById('scrollX' + options.name),
            scrollY = document.getElementById('scrollY' + options.name);
        if (rect.totalHeight > rect.viewHeight - rect.headerHeight) {
            scrollY.style.display = 'block';
            scrollY.style.height = (rect.viewHeight - rect.headerHeight) * ((rect.viewHeight - rect.headerHeight) / rect.totalHeight) + 'px';
        } else {
            scrollY.style.display = 'none';
            rect.scrollTop = 0;
        }
        if (rect.totalWidth > rect.viewWidth) {
            scrollX.style.display = 'block';
            scrollX.style.width = (rect.viewWidth) * rect.viewWidth / rect.totalWidth + 'px';
        } else {
            scrollX.style.display = 'none';
            rect.scrollLeft = 0;
        }
        this.events.updateScroll();
    }

    private setCanvasSize() {
        var ratio = window.devicePixelRatio ? devicePixelRatio : 1,
            options = this.dataView.rect,
            container = document.getElementById('eventOf' + this.options.name),
            canvas = document.getElementById('canvasOf' + this.options.name),
            width, height;
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
    }

    private updateFrame() {
        this.setCanvasSize();
        this.setScrollBar();
    }
}
window['CanvasGrid'] = CanvasGrid;
export { CanvasGrid };