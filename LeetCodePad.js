var lowestCommonAncestor = function(root, p, q) {
  //广度搜索，对每个节点，如果找不到p和q，则返回上一个找到的
  //从上往下的搜索
  function f(root){
      var queue=[root]
  for(var i=0;i<queue.length;i++){
      if(queue[i].left){
          queue.push(queue[i].left)
      }
      if(queue[i].right){
          queue.push(queue[i].right)
      }
  }
  if(queue.includes(p)&&queue.includes(q)){
      return true
  }else{
      return false
  }
  }
  
  var node=root
      if(f(node)){
          if(node.left&&node.right){
              if(!f(node.left)&&!f(node.right)){
                  return node
              }else if(f(node.left)){
                  return lowestCommonAncestor(node.left,p,q)
              }else if(f(node.right)){
                  return lowestCommonAncestor(node.right,p,q)
              }
          }
          if(node.left&&!node.right){
              if(!f(node.left)){
                  return node
              }else{
                  return lowestCommonAncestor(node.left,p,q)
              }
          }
          if(!node.left&&node.right){
              if(!f(node.right)){
                  return node
              }else{
                  return lowestCommonAncestor(node.right,p,q)
              }
          }
      }
};