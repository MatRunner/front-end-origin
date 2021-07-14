function arrayToTree(arr,rootIdx=0){
  if(!arr[rootIdx]){
    return null
  }
  var root=createTreeNode(arr[rootIdx])
  root.left=arrayToTree(arr,rootIdx*2+1)
  root.right=arrayToTree(arr,rootIdx*2+2)
  return root
}
function createTreeNode(val){
  return {
    val:val,
    left:null,
    right:null,
  }
}
function treeToArray(root,idx=0,arr=[]){
  if(root){
    arr[idx]=root.val
    treeToArray(root.left,idx*2+1,arr)
    treeToArray(root.right,idx*2+2,arr) 
  }
  return arr
}

function denseTreeToArray(root){
  if(!root){return []}
  var nodes=[root]
  var ans=[]
  for(let i=0;i<nodes.length;i++){
    if(nodes[i]){
      ans.push(nodes[i].val)
      nodes.push(nodes[i].left,nodes[i].right)
    }else{
      ans.push(null)
    }
  }
  return ans
}

function arrayToDenseTree(arr){
  if(arr.length==0){
    return null
  }
  var root=createTreeNode(arr[0])
  var nodes=[root]
  for(let i=1,j=0;i<arr.length&&j<nodes.length;){
    if(arr[i]){
      nodes[j].left=createTreeNode(arr[i++])
      nodes.push(nodes[j].left)
    }else{
      nodes[j].left=null
    }
    if(arr[i]){
      nodes[j].right=createTreeNode(arr[i++])
      nodes.push(nodes[j].right)
    }else{
      nodes[j].right=null
    }
    j++
  }
  return root
}