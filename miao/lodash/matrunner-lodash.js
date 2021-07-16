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
    if(Array.isArray(arr)){
      for(let i=0;i<arr.length;i++){
        f(arr[i])
      }
    }
    if(typeof(arr)=='object'){
      for(let key in arr){
        f(arr[key],key)
      }
    }
    return arr
  }

  function map(arr,f){
    var ans=[]
    if(Array.isArray(arr)){
      if(typeof(f)=='function'){
        arr.forEach(x=>{
          ans.push(f(x))
        })
      }
      if(typeof(f)=='string'){
        for(var key of arr){
          if(f in key){
            ans.push(key[f])
          }
        }
      }
    }
    if(typeof(arr)=='object'&&!Array.isArray(arr)){
      if(typeof(f)=='function'){
        for(var key in arr){
          ans.push(f(arr[key]))
        }
      }
    }
    return ans
  }

  function filter(arr,f){
    var ans=[]
    if(typeof(f)=='function'){
      arr.forEach(x=>{
        if(f(x)){
          ans.push(x)
        }
      })
    }
    if(Array.isArray(f)){
      for(let i=0;i<arr.length;i++){
        if(arr[i][f[0]]==f[1]){
          ans.push(arr[i])
        }
      }
    }
    if(typeof(f)=='object'){//取出两个对象中的同名属性进行过滤
      for(var key of arr){
        var flag=true
        for(var k in f){
          if(!(k in key)){
            flag=false
          }else if(!isEqual(f[k],key[k])){
            flag=false
          }
        }
        if(flag){
          ans.push(key)
        }
      }
    }
    if(typeof(f)=='string'){
      for(var key of arr){
        if(f in key){
          if(key[f]){
            ans.push(key)
          }
        }
      }
    }
    return ans
  }

  function reduce(arr,f,initial=arr[0]){
    if(Array.isArray(arr)){
      var result=initial
      var idx=1
      if(arguments.length>2){
        idx=0
      }
      for(var i=idx;i<arr.length;i++){
        result=f(result,arr[i])
      }
    }
    if(typeof(arr)=='object'&&!Array.isArray(arr)){
      result={}
      if(arguments.length>2){
        result=initial
      }
      for(let key in arr){
        f(result,arr[key],key)
      }
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
    if(typeof(f)=='string'){
      for(var key of obj){
        if(!key[f]){
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
          if(!isEqual(obj1[i],obj2[i])){
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
    if(typeof(f)=='string'){
      for(var key of obj){
        if(key[f]){
          return true
        }
      }
      return false
    }
  }

  function sortBy(obj,arr){
    //突然想起谷歌是不稳定的，火狐是稳定的，那还是自己写排序吧
    //需要一个compare函数
    function compare(a,b,ary,idx=0){
      if(typeof(ary[idx])=='function'){
        if(ary[idx](a)>ary[idx](b)){
          return 1
        }else if(ary[idx](a)<ary[idx](b)){
          return -1
        }else{
          if(idx+1<ary.length){
            return compare(a,b,ary,idx+1)
          }else{
            return 0
          }
        }
      }
      if(typeof(ary[idx])=='string'){
        if(a[ary[idx]]>b[ary[idx]]){
          return 1
        }else if(a[ary[idx]]<b[ary[idx]]){
          return -1
        }else{
          if(idx+1<ary.length){
            return compare(a,b,ary,idx+1)
          }else{
            return 0
          }
        }
      }
    }
    //然后自己再写个插入排序
    for(var i=1;i<obj.length;i++){
      var val=obj[i]
      for(var j=i-1;j>=0;j--){
        if(compare(val,obj[j],arr)<0){
          obj[j+1]=obj[j]
        }else{
          break
        }
      }
      obj[j+1]=val
    }
    return obj
  }

  function reverse(arr){
    var i=0,j=arr.length-1
    for(;i<j;i++,j--){
      [arr[i],arr[j]]=[arr[j],arr[i]]//解构赋值yyds
    }
    return arr
  }
  
  function countBy(arr,f){
    var obj={}
    if(typeof(f)=='function'){
      arr.forEach(x=>{
        if(f(x) in obj){
          obj[f(x)]++
        }else{
          obj[f(x)]=1
        }
      })
    }
    if(typeof(f)=='string'){
      arr.forEach(x=>{
        if(x[f] in obj){
          obj[x[f]]++
        }else{
          obj[x[f]]=1
        }
      })
    }
    return obj
  }

  function reduceRight(arr,f,initial=arr[arr.length-1]){
    var result=initial
    var idx=arr.length-2
    if(arguments.length>2){
      idx=arr.length-1
    }
    for(var i=idx;i>=0;i--){
      result=f(result,arr[i])
    }
    return result
  }

  function shuffle(arr){
    for(var i=arr.length-1;i>=0;i--){
      var randomIdx=Math.floor(Math.random()*(i+1))
      var randomVal=arr[randomIdx]
      arr[randomIdx]=arr[i]
      arr[i]=randomVal
    }
    return arr
  }

  function isNaN(val){
    //包装类型的判断不了，包装完以后成个对象了，自身的地址等于自身的地址？
    if(typeof(val)=='object'){
      var ref=new Number(1)
      if(Object.getPrototypeOf(ref)===Object.getPrototypeOf(val)){
        val=Number(val)
      }
    }
    return !(val===val)
  }

  function isNull(val){
    return Object.getPrototypeOf(Object.prototype)===val
  }

  function isNil(val){
    return val===undefined||val===null
  }

  function isUndefined(val){
    return val===undefined
  }

  function toArray(val){
    var ans=[]
    if(typeof(val)=='object'){
      if(!val){return ans}
      for(let key in val){
        ans.push(val[key])
      }
    }
    if(typeof(val)=='string'){
      for(let i=0;i<val.length;i++){
        ans.push(val[i])
      }
    }
    return ans
  }

  function sum(arr){
    var res=0
    for(let i=0;i<arr.length;i++){
      res+=arr[i]
    }
    return res
  }

  function sumBy(arr,f){
    var res=0
    if(typeof(f)=='function'){
      arr.forEach(x=>{
        res+=f(x)
      })
    }
    if(typeof(f)=='string'){
      arr.forEach(x=>{
        res+=x[f]
      })
    }
    return res
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
    'reverse':reverse,
    'countBy':countBy,
    'reduceRight':reduceRight,
    'shuffle':shuffle,
    'isNaN':isNaN,
    'isNull':isNull,
    'isNil':isNil,
    'isUndefined':isUndefined,
    'toArray':toArray,
    'sum':sum,
    'sumBy':sumBy,
  }
}()
