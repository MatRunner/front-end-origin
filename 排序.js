function bubbleSort(arr){//冒泡排序
  for(let j=arr.length-1;j>0;j--){
    for(let i=0;i<j;i++){
      if(arr[i]>arr[i+1]){//可以内置一个布尔值判断是否发生了位置变动，如果未发生，则排序已经完成
        var temp=arr[i+1]
        arr[i+1]=arr[i]
        arr[i]=temp
      }
    }
  }
  return arr
}
function selectSort(arr){//选择排序
  for(let i=0;i<arr.length-1;i++){
    var minIdx=i//设置待排序位点，最多排n-1次即可
    for(let j=i+1;j<arr.length;j++){//在该位点后找到最小值
      if(arr[j]<arr[minIdx]){//如果在未排序序列中检索到最小值，
        minIdx=j
      }
    }
    var temp=arr[minIdx]//则把这个值与待排序位点交换
    arr[minIdx]=arr[i]
    arr[i]=temp
  }
  return arr
}