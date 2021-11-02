import {useContext,createContext,useEffect,useState} from 'react'

//实现redux
let StoreContext=createContext()
StoreContext.displayName='MyStoreContext'
function Provider({store,children}){//都在props字段上
  //原生的Provider也是一个组件，作用是在函数组件中将store转发给内层，而react中具备转发数据功能的只有context
  //跨组件提供数据的方法只有一种，就是创建Context，这个Provider本质上还是一个语法糖
  useEffect(()=>{
    //当store更新时，还需要刷新组件,用一种取巧的方式来刷新组件
    let [a,seta]=useState(0)
    return store.subscribe(()=>{
      seta(a=>a+1)
    })
  })
  return (
    <StoreContext.Provider value={{store:store}}>//由于每次传入的value要发生变化组件才会更新，因此每次要创建新的store
      {children}
    </StoreContext.Provider>
  )
}

function useSelector(func){
  //Selector获得全局的数据
  let store=useContext(StoreContext)
  let state=store.getState()
  return func(state)
}

function useDispatch(){
  //dispatch和selector是搭配使用的
  let store=useContext(StoreContext)
  return store.dispatch
}

function connect(mapState,mapDispatch){
  //使用在类组件中，它返回一个高阶组件
  return function (Comp){
    let store=useContext(StoreContext)
    let state=store.getState()
    let state2=mapState(state)
    let dispatch2=mapDispatch(dispatch)
    return function Comp(props){
      return(
        <Comp {...props} {...state2} {...dispatch2}></Comp>
      )
    }
  }
}