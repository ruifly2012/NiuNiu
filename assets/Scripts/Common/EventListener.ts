export default class EventListener {

    private _callbacks:any[];
    
    constructor() 
    {    
        this._callbacks = [];
    }
    
    get length() {return this._callbacks.length}
    
    on(self:any, callback_func:Function) 
    {
    
        let check = this._callbacks.find((x) => x.func == callback_func && x.owner == self);
        
        if(check){    
            console.log('Bind Event Error!!');
            return;
        }

        let obj = {func:callback_func, owner:self};
        this._callbacks.push(obj);
    }
    
    off(self:any, callback_func:Function) 
    {
    
        this._callbacks = this._callbacks.filter( (x)=> {
        
            return !(x.func==callback_func && x.owner==self);
        });
    }
    
    notify(...args:any[]):any{    
        let tmp_callback = this._callbacks.filter( x => x.owner === args[0] );
        tmp_callback.map((x)=>{x.func.bind(x.owner)(...args)})
    }
    
    clear()
    {
    
        this._callbacks = [];
    }
}
