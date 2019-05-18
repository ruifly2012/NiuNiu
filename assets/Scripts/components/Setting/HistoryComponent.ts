

const { ccclass, property } = cc._decorator;

@ccclass
export default class HistoryComponent extends cc.Component {
    @property(cc.Label) serialNumber: cc.Label = null;
    @property(cc.Label) noteNumber: cc.Label = null;
    @property(cc.Label) gameName: cc.Label = null;
    @property(cc.Label) profit: cc.Label = null;
    @property(cc.Label) endTime: cc.Label = null;

    get Height(): number{
        // return this.node.getContentSize().height;
        return 100;
    }

    init(_serial: number, _note: string, _gamename: string,profitsymbol: boolean, _profit: string, _endtime: number) {
        this.serialNumber.string = (_serial+1).toString();
        this.noteNumber.string = _note;
        this.gameName.string = _gamename;
        this.profitFormat(profitsymbol,_profit);
        this.endTime.string = this.timeFormatter(_endtime);
    }

    private timeFormatter(unix_timestamp) {
        var date = new Date(unix_timestamp * 1000);
        var Year = date.getFullYear();
        var Month = ("0" + (date.getMonth() + 1)).substr(-2);
        var day = ("0" + (date.getDate())).substr(-2);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        var formattedTime = Year + '-' + Month + '-' + day + " " + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        return formattedTime;
    }

    private profitFormat(final: boolean, _profit: string) {
        if (final == true) {
            this.profit.node.color = cc.color(0, 255, 0);
            this.profit.string = "+" + _profit;
        } else {
            this.profit.node.color = cc.color(255, 0, 0);
            this.profit.string = "-" + _profit;
        }

    }
}
