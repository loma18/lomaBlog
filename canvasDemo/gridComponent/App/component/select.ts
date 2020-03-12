import {Input } from './input';

class Select {
    public target: any;
    public initSelectData: any;
    public afterSelected: any;
    private options: any;
    private cellSelect: any;
    private Input: Input;
    private container: any;
    private formName: string;

    constructor(containerId, formName) {
        this.container = document.getElementById(containerId);
        this.formName = formName;
        this.init();
    }

    public show(target) {
        this.target = target;
        this.options = this.initSelectData ? this.initSelectData(target) : undefined;
        if (!this.options || this.options.result == false || !this.options.data) {
            return;
        }
        this.render();
    }

    public hide() {
        this.cellSelect.innerText = '';
        this.cellSelect.style.display = 'none';
    }

    private init() {
        var ul = document.createElement('ul');
        ul.setAttribute('id', 'cellSelectOf' + this.formName);
        ul.className = 'cellSelect';
        ul.style.display = 'none';
        this.cellSelect = ul;
        this.container.appendChild(this.cellSelect);
        this.initEvent();
        // this.render();
    }

    private initEvent() {
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
    }

    private selectByKeyboard() {
        // console.log('test');
    }

    private matchData(str) {
        var selectOption = this.cellSelect.children;
        for (var i = 0, len = selectOption.length; i < len; i++) {
            if (selectOption[i].innerText.indexOf(str) < 0) {
                selectOption[i].style.display = 'none';
            }
        }
    }

    private render() {
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
    }
}

export {Select };