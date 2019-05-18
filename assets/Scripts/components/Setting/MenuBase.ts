

const {ccclass, property} = cc._decorator;

@ccclass
export default abstract class MenuBase extends cc.Component {

    public abstract open();

    public abstract close();

}
