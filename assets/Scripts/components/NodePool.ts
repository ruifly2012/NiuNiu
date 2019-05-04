const { ccclass, property } = cc._decorator;

@ccclass
export default class NodePool extends cc.Component {
    @property(cc.Prefab) prefab: cc.Prefab = null;
    @property(Number) size: number = 0;
    @property(String) defaultName: string = "";

    /**是否初始化 */
    isInitial: boolean = false;
    /**儲存已從Pool中拿出的Chip */
    list = {};
    /**Node Pool 本體 */
    private pool: cc.NodePool = null;

    onLoad() {
        if (!this.isInitial)
            this.init();
    }

    /**初始化Node Pool */
    init() {
        this.isInitial = true;
        this.pool = new cc.NodePool();

        for (let i = 0; i < this.size; ++i) {
            let obj = cc.instantiate(this.prefab);
            obj.name += this.defaultName + i.toString();
            this.pool.put(obj);
        }
        cc.log("NodePool create instance : " + this.size);
    }

    /**要求從Pool中拿取一個prefab*/
    request() {
        if (!this.isInitial)
            this.init();

        let obj = null;
        if (this.pool.size() <= 0) {
            obj = cc.instantiate(this.prefab);
            obj.name += this.defaultName + this.size.toString();
            this.pool.put(obj);
            cc.log("NodePool add new");
            this.size++;
        }
        obj = this.pool.get();
        this.list[obj.name] = obj;

        return obj;
    }

    /**
     * 歸還從Pool中拿取的Node
     * @param obj Pool中拿取出來的物件本體
     */
    return(obj) {
        if (this.list[obj.name] != undefined) {
            this.pool.put(obj);
            this.list[obj.name] = undefined;
        }
    }

    /**清除場面上所有從Pool中取出的Node並歸還進Pool */
    clearAll() {
        for (let i = 0; i < this.size; i++) {
            if (this.list[this.defaultName + i.toString()] != undefined) {
                this.pool.put(this.list[this.defaultName + i.toString()]);
                this.list[this.defaultName + i.toString()] = undefined;
            }
        }
    }
}
