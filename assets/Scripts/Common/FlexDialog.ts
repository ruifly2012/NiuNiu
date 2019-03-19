const {ccclass, property} = cc._decorator;

@ccclass
export default class FlexDialog extends cc.Component {   

    private _callback: Function = null;

    setupCallback(ok_callback: Function)
    {
        this._callback = ok_callback;
    }

    onOKClick()
    {
        if(this._callback !== null)
        {
            this._callback();
        }
        cc.log('OK!');
        this.node.destroy();
    }

    onCancelClick()
    {      
        cc.log('Cancel!');
        this.node.destroy();
    }

}
