function g(target) {
  // 从start起步，能否通过*3或+5找到target，找得到返回true，找不到返回false
  function f(start, history) {
    if (start == target) {
      console.log(history)
      return
    }
    if (start > target) {
      return
    }
    f(start * 3, '(' + history + ')*3')
    f(start + 5, history + '+5')
  }
  
  f(1, '0 + 1')
}