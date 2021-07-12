function range(start,end,step=1){
  var arr=[]
  for(var i=start;i<end;i+=step){
    arr.push(i)
  }
  return arr
}
function reverseArray(arr){
  var l=arr.length
  var arrRe=[]
  for(var i=0,j=l-1;i<l;i++){
    arrRe[j--]=arr[i]
  }
  return arrRe
}
function reverseArrayInPlace(arr){
  var l=0,r=arr.length-1
  while(l<r){
    var temp=arr[l]
    arr[l]=arr[r]
    arr[r]=temp
    l++
    r--
  }
  return arr
}

function isEqual(obj1,obj2){
  if(typeof(obj1)!==typeof(obj2)){
    return false
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