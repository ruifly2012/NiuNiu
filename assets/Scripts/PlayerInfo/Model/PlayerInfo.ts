const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerInfo{
    user_head: string = "";
    user_name: string = "";
    user_level: number = -1;
    user_exp:number = -1.0;
    user_vip:number = -1;
}
