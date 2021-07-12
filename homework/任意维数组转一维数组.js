function flatten1(arrs){
  //先考虑把二维转一维数组，不使用数组方法。
  var ans=[]
  for(let i=0;i<arrs.length;i++){
    for(let j=0;j<arrs[i].length;j++){
      ans.push(arrs[i][j])
    }
  }
  return ans
}
function flatten2(arrs){
  //二维转一维，使用数组方法
  return arrs.reduce((a,b)=>a.concat(b))
}

function flatten3(arrs){
  //多维转一维，不使用数组方法,那得递归走起啊
  var ans=[]
  function f(arrs){
    for(let i=0;i<arrs.length;i++){
      if(typeof(arrs[i])=='object'){
        f(arrs[i])
      }else{
        ans.push(arrs[i])
      }
    }
    return
  }
  f(arrs)
  return ans
}

function flatten4(arrs){
  //concat的特性是对于数字和一维数组是可以直接归入被合并数组中
  //为了下探到最内层，还得使用递归,但是箭头函数或者说匿名函数没法写成递归形式(反正我不会)
  var ans=[]
  function f(a,b){
    if(typeof(b)=='object'){
      for(let i=0;i<b.length;i++){
         a=f(a,b[i])
      }
    }else{
      a=a.concat(b)
    }
    return a
  }
  return arrs.reduce(f,ans) 
}