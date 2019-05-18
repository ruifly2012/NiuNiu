export default class EventListener {

    private _callbacks:any[];
    
    constructor() 
    {    
        this._callbacks = [];
    }
    
    get length() {return this._callbacks.length}
    
    on(eventName:string, callback_func:Function) {
        if(this._callbacks[eventName] != undefined){
            cc.warn("[EventListener] duplicate register");
        }
        this._callbacks[eventName] = callback_func;
    
        let check = this._callbacks.find((x) => x.func == callback_func && x.owner == eventName);
        
        if(check){    
            console.log('Bind Event Error!!');
            return;
        }

        let obj = {func:callback_func, owner:eventName};
        this._callbacks.push(obj);
    }

    off(eventName:string){
        if(this._callbacks[eventName] != undefined){
            this._callbacks[eventName] = undefined;
        }
    }
    
    notify(eventName: string, data?):any{
        if(this._callbacks[eventName] != undefined){
            this._callbacks[eventName](data);
        }
    }
    
    clear()
    {
    
        this._callbacks = [];
    }
}
