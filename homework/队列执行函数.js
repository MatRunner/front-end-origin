//基本编程思想，面向需求，对功能的抽象
//需求: 函数队列，依次执行. 每个函数可以接一个next函数作为参数，调用next则执行队列里下一个函数
//需要实现：1. 函数队列形式，需要有一个装函数队列的容器；2. 一个记录当前是否有函数在执行的标度. 3. 队列启动函数
//注意如果不对next函数加以限制，next()被同时多次调用会出问题
//会出现的问题，若队列内已经存在了很多函数，且这些函数内的next都是同步调用的，如果起始函数异步执行了next，则会形成很深的调用栈，有爆栈的风险
//该问题是因为addTask里的task是同步调用的写法，解决方案是改成异步调用，但是调用优先级应紧随该函数后，node环境中的process.nextTick()符合该要求，浏览器中可以使用Promise.resolve().then()替代
class TaskQueue {
  constructor() {
    this.queue = []//队列抽象
    this.isRun = false//标度抽象
  }
  addTask(task) {//对函数的入队进行了判断，实际上不用判断
    if (this.isRun) {
      this.queue.push(task)
    } else {
      this.isRun = true
      task(this.next.bind(this))//这里的next才是实参
    }
    return this
  }
  next() {
    if (this.queue.length > 0) {
      this.isRun = true
      this.queue.shift()(this.next.bind(this))
    } else {
      this.isRun = false
    }
  }

}

class TaskQueue {//这种写法和上面的区别是，把函数的入队和出队操作区分的更加明显，所有函数都会经过入队和出队的过程
  constructor() {
    this.queue = []
    this.isRun = false
  }
  addTask(task) {
    this.queue.push(task)
    if (this.queue.length > 0 && !this.isRun) {
      this.isRun = true
      this.queue.shift()(this.next.bind(this))
    }
    return this
  }
  next() {
    if (this.queue.length > 0) {
      this.queue.shift()(this.next.bind(this))
    } else {
      this.isRun = false
    }
  }
}

var q = new TaskQueue()//传递实参的任务交由类中的方法来完成，这里传递一个next的意义是默认我们已经有这样一个方法，调用这个传入方法可以实现函数的队列机制。
q.addTask(function (next) {//add的这个func是一个实参，但是func里的next又是一个形参？数组的方法Map，Array.map(function(x){})这尼玛不是一模一样么！区别是本例中形参是函数
  console.log(1)
  setTimeout(next, 1000)
}).addTask(function (next) {
  console.log(2)
  setTimeout(next, 2000)
}).addTask(function (next) {
  console.log(3)
  setTimeout(next, 4000)
}).addTask(function (next) {
  console.log(4)
  next()
})



class TaskLimit {//限制同时执行的函数个数，当然这个也可以写成无脑入队版本的
  constructor(n) {
    this.limit = n
    this.count = 0
    this.queue = []
  }
  addTask(task) {
    if (this.count < this.limit) {
      this.count++
      task(this.next.bind(this))
    } else {
      this.queue.push(task)
    }
    return this
  }
  next() {
    this.count--
    if (this.queue.length > 0) {
      this.queue.shift()(this.next.bind(this))
    }
  }

}

var l = new TaskLimit(3)
l.addTask(function (next) {
  console.log(1)
  setTimeout(next, 1000)
}).addTask(function (next) {
  console.log(2)
  setTimeout(next, 1000)
}).addTask(function (next) {
  console.log(3)
  setTimeout(next, 1000)
}).addTask(function (next) {
  console.log(4)
  setTimeout(next, 1000)
}).addTask(function (next) {
  console.log(5)
  setTimeout(next, 1000)
}).addTask(function (next) {
  console.log(6)
  setTimeout(next, 1000)
}).addTask(function (next) {
  console.log(7)
  setTimeout(next, 1000)
})



