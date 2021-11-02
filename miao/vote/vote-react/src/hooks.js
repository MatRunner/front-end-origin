import { useCallback,useState} from "react";

export function useInput(init=''){
  let [value,setValue]=useState(init)
  let onChange=useCallback(function(e){
    setValue(e.target.value)
  },[])
  return{
    value,
    onChange,
  }
}

export function useBooleanChecked(init=false){
  let [check,setCheck]=useState(init)
  let onChange=useCallback(function(e){
    setCheck(e.target.checked)
  })
  return{
    checked:check,
    onChange,
  }
}
