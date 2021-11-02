import EventEmitter from 'events'
//封装一个类，将aria2的接口实现为js的接口
//还需要补充连接成功，失败之类的事件，暂时先隔一下
class Aria2 extends EventEmitter{
  constructor(options){
    super()
    //目前来看，参数需要
    // {
    //   port,
    //   token,
    // }
    this.options=options
    this.token=options.token
    this._id=0
    this._cbs={}
    this._timeStamp={}
    this.ws=new WebSocket(`ws://localhost:${options.port}/jsonrpc`)
    this.connectPromise = new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve)
    })
    this.ws.addEventListener('message',(e)=>{
      let data=JSON.parse(e.data)
      if(data.error){
        console.log(data)
        this.emit('uriError',data.error)
      }
      if(data.method){
        console.log(data)
        this.emit('method',data.method)
      }
      let id=data.id
      if(id){//会触发一些额外的不带id的辅助事件导致报错，因此加一个判断
        let cb=this._cbs[id]
        delete this._cbs[id]
        cb(data)
      }
    })
    
  }
}
var ary=[
      "addUri",
      "addTorrent",
      "getPeers",
      "addMetalink",
      "remove",
      "pause",
      "forcePause",
      "pauseAll",
      "forcePauseAll",
      "unpause",
      "unpauseAll",
      "forceRemove",
      "changePosition",
      "tellStatus",
      "getUris",
      "getFiles",
      "getServers",
      "tellActive",
      "tellWaiting",
      "tellStopped",
      "getOption",
      "changeUri",
      "changeOption",
      "getGlobalOption",
      "changeGlobalOption",
      "purgeDownloadResult",
      "removeDownloadResult",
      "getVersion",
      "getSessionInfo",
      "shutdown",
      "forceShutdown",
      "getGlobalStat",
      "saveSession"]
      ary.forEach(it=>{
        Aria2.prototype[it]=async function(...args){
          await this.connectPromise//连接成功后才能调用方法，否则会报错

          return new Promise((resolve,reject)=>{//使用promise可以方便操作异步行为，因为获得aria2的回信是异步监听事件，将resolve的判断回调放入全局等待监听websocket的message事件触发，之后可以使用then来操作回调的结果，也就是在调用对于的原型方法时操作这个promise即可。如果要改成回调风格，应该是把回调提前写好作为参数传入，然后存进全局等待调用，promise写法的好处是不用把回调当参数传进去了
            this._cbs[this._id]=function(data){
              if(data.error){
                reject(data.error)
              }else{
                resolve(data.result)
              }
            }
            this.ws.send(JSON.stringify({
              'jsonrpc':'2.0',
              'id':this._id,
              'method':`aria2.${it}`,
              'params':[`token:${this.token}`,...args],
            }))
            this._id++
          })
        }
      })
export default Aria2
