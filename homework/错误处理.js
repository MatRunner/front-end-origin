function primitiveMultiply(a,b){
  if(Math.random()>0.5){
    return a*b
  }else{
    throw new MultiplicatorUnitFailure
  }
}
class MultiplicatorUnitFailure extends Error{}
function operator(a,b){
  try{
   return primitiveMultiply(a,b)
  }catch(e){
    if(e instanceof MultiplicatorUnitFailure){//需要对错误类型进行判断
      return operator(a,b)//写循环也可以
    }else{
      throw e
    }
  }
}


var box={
  locked:true,
  unlock:function(){this.locked=false},
  lock:function(){this.locked=true},
  _content:[],
  get content(){
    if(this.locked){
      throw new Error('Locked!')
    }
    return this._content
  }
}

function withBoxUnlocked(f){
  try{
    box.unlock()
    return f()
  }finally{
    box.lock()
  }
}
