var matrunner=function(){
  
  function chunk(arr,n){
    var ans=[]
    var group=[]
    for(var i=0;i<arr.length;){
      if(group.length<n){
        group.push(arr[i++])
      }else{
        ans.push(group)
        group=[]
      }
    }
    ans.push(group)
    return ans
  }

  function compact(arr){
    return arr.filter(x=>x)
  }

  function uniq(arr){
    var ans=[]
    var m=new Map()
    for(var i=0;i<arr.length;i++){
      if(!m.has(arr[i])){
        m.set(arr[i],1)
        ans.push(arr[i])
      }
    }
    return ans
  }

  function uniqBy(arr,f){
    function uniqIdx(arr){
      var idx=[]
      var m=new Map()
      for(var i=0;i<arr.length;i++){
        if(!m.has(arr[i])){
          m.set(arr[i],1)
          idx.push(i)
        }
      }
      return idx
    }
    var ans=[]
    if(typeof(f)=='function'){
      var a= uniqIdx(arr.map(f))
    }else{
      var a= uniqIdx(arr.map(x=>x[f]))
    }
    for(let i=0;i<a.length;i++){
      ans.push(arr[a[i]])
    }
    return ans
  }

  function flattenDeep(arr){
    var ans=[]
    for(let i=0;i<arr.length;i++){
      if(Array.isArray(arr[i])){
        var a=flattenDeep(arr[i])
        for(let j=0;j<a.length;j++){
          ans.push(a[j])
        }
      }else{
        ans.push(arr[i])
      }
    }
    return ans
  }

  function flattenDepth(arr,depth=1){
    var ans=[]
    if(depth==0){
      return arr.slice()
    }
    for(let i=0;i<arr.length;i++){
      if(Array.isArray(arr[i])){
        arr[i]=flattenDepth(arr[i],depth-1)
        for(let j=0;j<arr[i].length;j++){
          ans.push(arr[i][j])
        }
      }else{
        ans.push(arr[i])
      }
    }
    return ans
  }

  function groupBy(arr,f){
    var ans={}
    if(typeof(f)=='function'){
      arr.forEach(x=>{
        if(f(x) in ans){
          ans[f(x)].push(x)
        }else{
          ans[f(x)]=[x]
        }
      })
    }else{
      arr.forEach(x=>{
        if(x[f] in ans){
          ans[x[f]].push(x)
        }else{
          ans[x[f]]=[x]
        }
      })
    }
    return ans
  }

  function keyBy(arr,f){
    var ans={}
    if(typeof(f)=='function'){
      arr.forEach(x=>{
        ans[f(x)]=x
      })
    }else{
      arr.forEach(x=>{
        ans[x[f]]=x
      })
    }
    return ans
  }

  function forEach(arr,f){
    for(var i=0;i<arr.length;i++){
      f(arr[i])
    }
  }

  function map(arr,f){
    var ans=[]
    for(let i=0;i<arr.length;i++){
      ans.push(f(arr[i]))
    }
    return ans
  }

  function filter(arr,f){
    var ans=[]
    arr.forEach(x=>{
      if(f(x)){
        ans.push(x)
      }
    })
    return ans
  }

  function reduce(arr,f,initial=arr[0]){
    var result=initial
    var idx=1
    if(arguments.length>2){
      idx=0
    }
    for(var i=idx;i<arr.length;i++){
      result=f(result,arr[i])
    }
    return result
  }

  function zip(...arr){
    var maxLength=0
    arr.forEach(x=>{
      maxLength=Math.max(maxLength,x.length)
    })
    var ans=new Array(maxLength)
    arr.forEach(x=>{
      for(let i=0;i<maxLength;i++){
        if(!ans[i]){
          ans[i]=[]
        }
        ans[i].push(x[i])
      }
    })
    return ans
  }

  function unzip(arr){
    var ans=[]
    arr.forEach(x=>{
      for(let i=0;i<x.length;i++){
        if(!ans[i]){
          ans[i]=[]
        }
        ans[i].push(x[i])
      }
    })
    return ans//咋感觉和zip一个玩意？
  }

  function keys(obj){
    var ans=[]
    for(var key in obj){
      ans.push(key)
    }
    return ans
  }

  function values(obj){
    var ans=[]
    for(var key in obj){
      ans.push(obj[key])
    }
    return ans
  }

  function every(obj,f){
    if(typeof(f)=='function'){
      return obj.reduce((x,y)=>f(x)&&f(y))
    }
    if(Array.isArray(f)){
      for(var key of obj){
        if(key[f[0]]!==f[1]){
          return false
        }
      }
      return true
    }
    if(typeof(f)=='object'){
      for(var key of obj){
        if(!isEqual(key,f)){
          return false
        }
      }
      return true
    }
  }
  function isEqual(obj1,obj2){
    if(typeof(obj1)!==typeof(obj2)){
      return false
    }
    if(Array.isArray(obj1)^Array.isArray(obj2)){
      return false
    }
    if(Array.isArray(obj1)&&Array.isArray(obj2)){
      if(obj1.length!=obj2.length){
        return false
      }else{
        for(let i=0;i<obj1.length;i++){
          if(obj1[i]!=obj2[i]){
            return false
          }
        }
        return true
      }
    }
    if(typeof(obj1)=='object'){
      //还需要对比属性数量
      var count1=0,count2=0
      for(var k in obj1){
        count1++
      }
      for(var s in obj2){
        count2++
      }
      if(count1!=count2){
        return false
      }
      for(var key in obj1){
        if(key in obj2){
           if(!isEqual(obj1[key],obj2[key])){
             return false
           }
        }else{
          return false
        }
      }
    }else{
      return obj1==obj2
    }
    return true
  }

  function some(obj,f){
    if(typeof(f)=='function'){
      return obj.reduce((x,y)=>f(x)||f(y))
    }
    if(Array.isArray(f)){
      for(var key of obj){
        if(key[f[0]]==f[1]){
          return true
        }
      }
      return false
    }
    if(typeof(f)=='object'){
      for(var key of obj){
        if(isEqual(key,f)){
          return true
        }
      }
      return false
    }
  }

  function sortBy(obj,f){
    var ans=[]
    if(typeof(f)=='function'){
      obj.sort((x,y)=>f(x)-f(y))
    }
    return obj
  }
  return {
    'chunk':chunk,
    'compact':compact,
    'uniq':uniq,
    'uniqBy':uniqBy,
    'flattenDeep':flattenDeep,
    'flattenDepth':flattenDepth,
    'groupBy':groupBy,
    'keyBy':keyBy,
    'forEach':forEach,
    'map':map,
    'filter':filter,
    'reduce':reduce,
    'zip':zip,
    'unzip':unzip,
    'keys':keys,
    'values':values,
    'every':every,
    'isEqual':isEqual,
    'some':some,
    'sortBy':sortBy,
  }
}()
