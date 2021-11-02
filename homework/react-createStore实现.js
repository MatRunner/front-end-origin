function createStore(reducer,init){
  let state=init
  let fs=[]
  let res={
    getState(){
      return state
    },
    dispatch(action){
      let oldstate=state
      state=reducer(state,action)
      if(oldstate==state){
        fs.forEach(it=>{
          it()
        })
      }
      return action 
    },
    subscribe(f){
      fs.push(f)
      return function(){
        let pos=fs.indexOf(f)
        fs.splice(pos,1)
      }
    }
  }
  return res
}