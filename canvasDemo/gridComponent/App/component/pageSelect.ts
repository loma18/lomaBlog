class PageSelect {
    private date: any;
    private totalNum: any;
    private indexSelectValue: any;
    private options: any;
    private form: any;

    constructor(form) {
        this.form = form;
    }

    public init(id, options) {
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
    }

    public updateData(date) {
        this.date = date;
        this.updateMsg(this.date.length);
    }

    public updatePageNum(firstLoad?, status?, index?, date?) {
        var pageNum = document.getElementById("pager-number"),
            prevPage = document.createElement("div"),
            nextPage = document.createElement("div"),
            dotPage = document.createElement("div"),
            select: any = document.getElementsByClassName("pageSizeSelect")[0],
            indexValue = select.options[select.options.selectedIndex].value,
            len = this.date.length,
            num = Math.ceil(len / indexValue),
            numPage;
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
            } else {
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
        } else if (num > 8) {
            if (firstLoad || index == 1) {
                index = 1;
            } else {
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
            } else if (status == 2) {
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
            } else if (status == 3) {
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

    }

    private initGoTo() {
        var pageGoTo = document.createElement("div"),
            input = document.createElement("input"),
            goToPage = document.createElement("div");
        pageGoTo.setAttribute('id', 'pager-goto');
        input.setAttribute("class", "pageinput");
        goToPage.setAttribute("class", "goToPage");
        goToPage.innerHTML = "转至";
        pageGoTo.appendChild(input);
        pageGoTo.appendChild(goToPage);
        return pageGoTo;
    }

    private initNum() {
        var pageNum = document.createElement("div");
        pageNum.setAttribute('id', 'pager-number');
        return pageNum;
    }

    private initSize() {
        var pageSize = document.createElement("div"),
            htmlStr = '每页' + this.initOptions().outerHTML + '条';
        pageSize.setAttribute('id', 'pager-size');
        pageSize.innerHTML = htmlStr;
        return pageSize;
    }

    private initOptions() {
        var select = document.createElement('select'),
            options, text,
            pageSizeOptions = this.options.selectSizeOptions || [10, 15, 20, 30, 100];
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
    }

    private updateMsg(total) {
        var htmlStr = '总共' + total + '条';
        document.getElementById("pager-msg").innerHTML = htmlStr;
    }

    private initMsg(total) {
        var pageMsg = document.createElement("div"),
            htmlStr = '总共' + total + '条';
        pageMsg.setAttribute('id', 'pager-msg');
        pageMsg.innerHTML = htmlStr;
        return pageMsg;
    }

    private testData() {
        var arr = [];
        for (var i = 0; i < 1000; i++) {
            arr.push(i);
        }
        return arr;
    }private initEvent() {
        var self = this;
        var container = document.getElementById("pager-selector");
        container.addEventListener("click", function (e) {
            e.stopPropagation();
            var target: any = e.target,
                targetValue, oldValue = parseInt(document.getElementsByClassName("indexNum")[0].getAttribute("value"));
            if (!target) {
                return;
            }
            if (target.className == "numPage") {
                targetValue = parseInt(target.getAttribute("value"));
            } else if (target.className == "prevPage") {
                targetValue = oldValue;
                targetValue -= 1;
            } else if (target.className == "nextPage") {
                targetValue = oldValue;
                targetValue += 1;
            } else if (target.className == "pageSizeSelect") {
                if (self.indexSelectValue == target.options[target.options.selectedIndex].value) {
                    return;
                }
                self.form.form.dataView.rows = self.updatePageNum(true, null, null, self.date);
                self.form.form.update();
            } else if (target.className == "goToPage") {
                targetValue = parseInt(document.getElementsByClassName("pageinput")[0]["value"]);
            }
            if (!targetValue || targetValue == oldValue) {
                return;
            }
            self.clearCheckFlag();
            if (targetValue < 5) {
                self.form.form.dataView.rows = self.updatePageNum(false, 1, targetValue, self.date);
            } else if (4 < targetValue && targetValue < self.totalNum - 4) {
                self.form.form.dataView.rows = self.updatePageNum(false, 2, targetValue, self.date);
            } else {
                self.form.form.dataView.rows = self.updatePageNum(false, 3, targetValue, self.date);
            }
            self.form.form.update();
        });
    }

    private clearCheckFlag() {
        var list = document.getElementsByClassName("numPage");
        for (var i = 0, len = list.length; i < len; i++) {
            list[i].classList.remove("indexNum");
        }
    }
}
export {PageSelect };