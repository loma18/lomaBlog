import optionsData from "./TestData/test.js";
import iconList from "./TestData/test.js";
export default class Business {
    // public row;
    private grid: any;
    private iconlist;

    constructor() {
        this.afterLoad();
        this.grid = new window["CanvasGrid"](optionsData.options, optionsData.columns);
        this.grid.dataView.rowData = optionsData.rows;
        this.grid.init();
        this.grid.dataView.initRow();
        this.renderEvent();
    }

    private renderEvent() {
        this.grid.events.afterClick = function (e) {
            console.log(e);
            return true;
        }
    }
    private afterLoad() {
        // this.iconlist = iconList.iconlist;
        // for(var key in this.iconlist){

        // }
    }
}
new Business();