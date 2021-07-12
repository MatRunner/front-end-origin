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
      ans=arr.slice()
    }
    for(let i=0;i<arr.length;i++){
      if(Array.isArray(arr[i])){
        var a=flattenDepth(arr[i],depth-1)
        for(let j=0;j<a.length;j++){
          ans.push(a[j])
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

  return {
    'chunk':chunk,
    'compact':compact,
    'uniq':uniq,
    'uniqBy':uniqBy,
    'flattenDeep':flattenDeep,
    'flattenDepth':flattenDepth,
    'groupBy':groupBy,
  }
}()
