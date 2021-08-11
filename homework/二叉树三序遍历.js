function traversal(root){
  var preOrder=[],inOrder=[],postOrder=[]
  var p=root
  var stack=[]//通过栈来模拟对树的先序遍历过程，首次遇到一个节点将其入栈
  var m=new Map()//建立一个哈希表记录每个节点遇到的次数
  while(1){
    while(p){
      if(!m.has(p)){//先判断是否已经遇到该节点
        stack.push(p)//如果节点存在则入栈
        m.set(p,1)//遇到第一次
        preOrder.push(p.val)//入栈意味着第一次遇到该节点
      }
      p=p.left//节点向左下方向移动
    }
    //如果p为空，则说明p的父节点没有左子，且此时p的父节点在栈顶，只要从栈顶拿到父节点，获得右子即可
    //这里需要判断栈是否已空，空栈说明所有节点已经处理完毕
    if(stack.length==0){break}
    var node=stack[stack.length-1]//拿到栈顶元素的值
    if(m.get(node)==2){
      stack.pop()//遇到第三次出栈
      postOrder.push(node.val)//出栈意味着三次遇到该节点，
    }else{
      m.set(node,2)//否则记录该节点已经遇到两次了
      inOrder.push(node.val)
    }
    p=node.right
  }
  console.log('先序：'+preOrder,'中序：'+inOrder,'后序：'+postOrder)
  return 
}