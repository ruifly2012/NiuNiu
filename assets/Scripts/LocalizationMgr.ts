/**
 * 在地化文字管理物件
 */
export default class LocalizationMgr{
    private texts = {};
    private init: boolean = false;

    constructor() 
    {
        let url = "text/localization.json";
        cc.loader.loadRes(url, (err, res) =>
        {
            if (cc.isValid(err))
            {
                cc.error("Localization: " + err);
                return;
            }
            
            let JsonObj = res["json"];
            let Lanuage = JsonObj["Language"];
            cc.log("Language: " + Lanuage);
            this.texts = JsonObj[Lanuage];

            if (this.texts == undefined)
            {
                cc.error("Localization[" + Lanuage + "] is empty.");
                return;
            }
            this.init = true;
        });
    }

    /**
     * 取得在地化文字
     * @param key 文字Key
     */
    get(key: string): string
    {
        if (!this.init)
            return "";
        if (!cc.isValid(this.texts[key]))
            return "";

        return this.texts[key];
    }
}
