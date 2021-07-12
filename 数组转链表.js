//数组转链表器，做题用
function LinkList(val){
  return {
    val:val,
    next:null,
  }
}
function arrayToList(arr){
  var zero=LinkList(0)
  var pre=zero
  for(let i=0;i<arr.length;i++){
    var node=LinkList(arr[i])
    pre.next=node
    pre=node
  }
  return zero.next
}