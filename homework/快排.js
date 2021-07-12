function quickSort(nums){
  if(nums.length<2){//如果数组长度小于2，直接返回
    return nums
  }
  var left=[],right=[],middle=[]
  var dot=nums[0]
  var sort=[]
  for(var i=0;i<nums.length;i++){
    if(nums[i]==dot){ 
      middle.push(nums[i])
    }else if(nums[i]>dot){
      right.push(nums[i])
    }else{
      left.push(nums[i])
    }
  }
  left=quickSort(left)
  right=quickSort(right)
  sort=left.concat(middle,right)
  return sort
}
// 这个方法没有使空间为1
function quickSort(arr,start=0,end=arr.length-1){
  if(end-start<1){
    return arr//递归结束条件，当数组只有一个元素时
  }

  var pivotIdx=Math.floor(Math.random()*(end-start+1))+start//由于快排的速度和哨兵的选择密切相关，因此要随机选取数据
  var pivot=arr[pivotIdx]//随机选择一个哨兵元素
  var i=start//i维护的是
  var j=start//j记录已经处理的元素位置，同时也是大于等于哨兵的最后位置


  arr[pivotIdx]=arr[end]//将哨兵元素移到数组尾部
  arr[end]=pivot

  for(;j<end;j++){//开始对数组进行处理
    if(arr[j]<pivot){//如果当前处理的元素小于哨兵元素
      var temp=arr[i]//并将当前处理的元素与小值序列尾部换位
      arr[i]=arr[j]
      arr[j]=temp
      i++//则将小值序列尾部往后移动一位
    }
  }
  arr[end]=arr[i]//处理完成后，将哨兵元素放回原位置
  arr[i]=pivot
  quickSort(arr,start,i-1)//然后对左边和右边分别进行快排
  quickSort(arr,i+1,end)//此处有坑，如果将哨兵元素放进下一级递归中后，对于大于等于哨兵元素的集合，将会一直递归下去进行排序，因为只要有两个相同的元素，就会一直对右边数组进行排序操作，达不到数组长度为1的回归条件，但是如果数组元素不相同，它们最终会缩减到长度为1而结束递归
  return arr
}