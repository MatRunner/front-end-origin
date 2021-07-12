function MyHanoi(n=3,from=1,to=3){
  var obj={
    arr1:[],
    arr2:[],
    arr3:[],
  } 
  var a=n,b=0,c=0//用三个值记录三个栈的长度,调用输出操作函数，是输出操作的关键参考值
  for(let i=n;i>0;i--){
    obj.arr1.push(i)
  }//把初始状态压入第一个栈
  //以上为初始数据的建立===========================
  return hanoiN(obj.arr1,obj.arr2,obj.arr3,n)
  function output(){//一个专门用来输出操作的函数
    var from=0,to=0
    if(obj.arr1.length>a){
      to='1'
    }else if(obj.arr1.length<a){
      from='1'
    }
    if(obj.arr2.length>b){
      to='2'
    }else if(obj.arr2.length<b){
      from='2'
    }
    if(obj.arr3.length>c){
      to='3'
    }else if(obj.arr3.length<c){
      from='3'
    }
    a=obj.arr1.length
    b=obj.arr2.length
    c=obj.arr3.length
    return from+'->'+to
  }
  function hanoi3(arr1,arr2,arr3) {//一个函数记录三层汉诺塔的操作，回归条件
  arr3.push(arr1.pop())
  console.log(output())
  arr2.push(arr1.pop())
  console.log(output())
  arr2.push(arr3.pop())
  console.log(output())
  arr3.push(arr1.pop())
  console.log(output())
  arr1.push(arr2.pop())
  console.log(output())
  arr3.push(arr2.pop())
  console.log(output())
  arr3.push(arr1.pop())
  console.log(output())
  return arr3
}
  function hanoiN(arr1,arr2,arr3,n){//该函数表示对n层汉诺塔应该操作后，第一个位置的塔在操作后都应该在第三个位置
    if(n==3){
      return hanoi3(arr1,arr2,arr3)
    }else{
      hanoiN(arr1,arr3,arr2,n-1)//把n-1层放在第二个位置
      arr3.push(arr1.pop())//第一个位置放第三个
      console.log(output())
      hanoiN(arr2,arr1,arr3,n-1)//第二个位置的n-1个放第三个
    }
  }
}
//抽象能力对代码太重要了吧！
// ============================================================================================================================
/*
上面我的解题过程太麻烦了，有很多不必要的过程。
比如没必要建立三个数组来模拟栈行为
没必要单独写一个输出操作的函数
回归条件也没必要从3开始
服了服了
*/
function XieHanoi(n=3,from=1,to=3,temp=2){
  if(n==1){
    console.log(from+'->'+to)
    return
  }else{
    XieHanoi(n-1,from,temp,to)//把移动操作直接抽象到参数传入上
    XieHanoi(1,from,to,temp)
    XieHanoi(n-1,temp,to,from)
  }
}