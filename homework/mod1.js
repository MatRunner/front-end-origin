async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
async function async2() {
  console.log('async2');
}
console.log('script start');
setTimeout(function () {
  console.log('setTimeout');
}, 0)
async1()
new Promise(function (resolve) {
  console.log('promise1')
  resolve()
}).then(function () {
  console.log('promise2')
})

console.log('script end')

/*
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
*/


/*
async2 end
Promise
async1 end
promise1
promise2
setTimeout
*/

/*
script start
async2 end
Promise
script end
async2 end1
promise1
async1 end
promise2
setTimeout
*/

async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2')
}
console.log('script start')
setTimeout(function () {
  console.log('setTimeout0')
}, 0)
setTimeout(function () {
  console.log('setTimeout3')
}, 3)
setImmediate(() => console.log('setImmediate'));
process.nextTick(() => console.log('nextTick'));
async1();
new Promise(function (resolve) {
  console.log('promise1')
  resolve();
  console.log('promise2')
}).then(function () {
  console.log('promise3')
})
console.log('script end')
/*

script start
async1 start
async2
promise1
promise2
script end
nextTick
async1 end
promise3
setImmediate后面这仨顺序不一定吧
setTimeout0
setTimeout3
*/

setTimeout(() => {
  console.log(2)
}, 2000)

new Promise((resolve, reject) => {
  console.log('p')
  resolve('p')
}).then(() => {
  setTimeout(() => {
    console.log(3)
  }, 10)
})
/*
p
3
2
*/

setTimeout(() => console.log('a'), 0)
var p = new Promise((resolve) => {
  console.log('b');
  resolve();
}
);
p.then(() => console.log('c'));
p.then(() => console.log('d'));

console.log('e');

async function async1() {
  console.log("a");
  await async2();
  console.log("b");
}
async function async2() {
  console.log('c');
}

console.log("d");

setTimeout(function () {
  console.log("e");
}, 0);

async1();

new Promise(function (resolve) {
  console.log("f");
  resolve();
}
).then(function () {
  console.log("g");
});

console.log('h');
/*
b
e
d
a
c
f
h
c
d
b
g
a
e

*/


async function f1() {
  return Promise.resolve()
}
async function f2() {
  await f1()
  console.log(1)
}
Promise.resolve().then(() => {
  console.log(2)
})