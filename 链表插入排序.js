var insertionSortList = function(head) {
    //链表的插入排序，我自己是想不出来
    //思路为：从链表头部维护一个排好序的链，排好序链的下一个为处理节点，判断处理节点，根据不同情况插入到排好序的链中
    if(!head||!head.next){
      return head
    }
    var sortedTail=head
    var untreatedNode=head.next
    var dummy=new ListNode(-Infinity,head)
    while(untreatedNode){
      if(untreatedNode.val>=sortedTail.val){
        sortedTail=sortedTail.next
      }else{
        sortedTail.next=untreatedNode.next//跳过当前的处理值连接到下一个待处理值
        var p=dummy
        while(p.next.val<=untreatedNode.val){
          p=p.next
        }
        untreatedNode.next=p.next//插入已经排序的部分
        p.next=untreatedNode
      }
      untreatedNode=sortedTail.next//每次处理完还需要得到下一个待处理节点
    }
    return dummy.next
};