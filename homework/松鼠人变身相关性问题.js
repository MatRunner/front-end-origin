/*松鼠人练习 */
/*
需求：给出若干天内的每天发生的事件，找到这些事件与是否变成松鼠的相关性
每个原始的数据类型是存储每天发生事件的数组，和一个是否变成松鼠的布尔值
要有一个函数读入原始数据，并记录原始数据每个事件和是否变成松鼠之间的关系。记录的方式为一个四元素数组，[00,01,10,11]对应于事件和松鼠的四种关系。
需要有一个函数计算相关度，命名为phi
*/
// var journal=[
// //journal记录原始数据，包含每天发生的事件，和是否变成松鼠  
// ]
function addEntry(events,didITurnIntoASquirrel){
  //在journal中添加数据的方法
  journal.push({
    events:events,
    squirrel:didITurnIntoASquirrel,
  })
}


function phi(table){
  //这个函数没啥说的，照搬公式
  return (table[3]*table[0]-table[2]*table[1])/Math.sqrt((table[2]+table[3])*(table[0]+table[1])*(table[1]+table[3])*(table[0]+table[2]))
}


function hasEvent(event,entry){
  //判断在某天某事件是否发生了
  return entry.events.indexOf(event)!=-1
}


function tableFor(event,journal){
  //将原始数据中每一个事件转化为可操作的table
  var table=[0,0,0,0];
  for(var i=0;i<journal.length;i++){//i表示的是journal中第i天的数据
    var entry=journal[i],index=0
    if(hasEvent(event,entry)){index+=1}//如果当天该事件发生了，索引加1，因为索引和事件与松鼠的四种关联状态一一对应的
    if(entry.squirrel){index+=2}//如果当天变松鼠了，索引加2
    table[index]+=1//对传入的参数event事件来说，它在journal中被遍历查找了一遍，形成了一个四元素数组
  }
  return table//返回这个数组，供公式处理
}


//需要一个函数来输出每件事情和松鼠的相关性
function gatherCorrelations(journal){
  var phis={}//建立一个对象，每个属性名为事件，值为该事件与松鼠的相关性
  for(var entry=0;entry<journal.length;entry++){
    var events=journal[entry].events//取出journal中的对象的events属性的值，它的值是一个事件组成的数组
    for(var i=0;i<events.length;i++){//遍历该事件数组
      var event=events[i]//取出该事件数组中的每一个事件
      if(!(event in phis)){//如果事件不在一个对象中，则加入这个对象，属性名为事件名，值为相关性
        phis[event]=phi(tableFor(event,journal))
      }
    }//这样遍历整个原始数据后，就能把事件和相关性作为一对键值对存入一个对象phis中
  }
  return phis
}

var JOURNAL = [
  {"events":["carrot","exercise","weekend"],"squirrel":false},
  {"events":["bread","pudding","brushed teeth","weekend","touched tree"],"squirrel":false},
  {"events":["carrot","nachos","brushed teeth","cycling","weekend"],"squirrel":false},
  {"events":["brussel sprouts","ice cream","brushed teeth","computer","weekend"],"squirrel":false},
  {"events":["potatoes","candy","brushed teeth","exercise","weekend","dentist"],"squirrel":false},
  {"events":["brussel sprouts","pudding","brushed teeth","running","weekend"],"squirrel":false},
  {"events":["pizza","brushed teeth","computer","work","touched tree"],"squirrel":false},
  {"events":["bread","beer","brushed teeth","cycling","work"],"squirrel":false},
  {"events":["cauliflower","brushed teeth","work"],"squirrel":false},
  {"events":["pizza","brushed teeth","cycling","work"],"squirrel":false},
  {"events":["lasagna","nachos","brushed teeth","work"],"squirrel":false},
  {"events":["brushed teeth","weekend","touched tree"],"squirrel":false},
  {"events":["lettuce","brushed teeth","television","weekend"],"squirrel":false},
  {"events":["spaghetti","brushed teeth","work"],"squirrel":false},
  {"events":["brushed teeth","computer","work"],"squirrel":false},
  {"events":["lettuce","nachos","brushed teeth","work"],"squirrel":false},
  {"events":["carrot","brushed teeth","running","work"],"squirrel":false},
  {"events":["brushed teeth","work"],"squirrel":false},
  {"events":["cauliflower","reading","weekend"],"squirrel":false},
  {"events":["bread","brushed teeth","weekend"],"squirrel":false},
  {"events":["lasagna","brushed teeth","exercise","work"],"squirrel":false},
  {"events":["spaghetti","brushed teeth","reading","work"],"squirrel":false},
  {"events":["carrot","ice cream","brushed teeth","television","work"],"squirrel":false},
  {"events":["spaghetti","nachos","work"],"squirrel":false},
  {"events":["cauliflower","ice cream","brushed teeth","cycling","work"],"squirrel":false},
  {"events":["spaghetti","peanuts","computer","weekend"],"squirrel":true},
  {"events":["potatoes","ice cream","brushed teeth","computer","weekend"],"squirrel":false},
  {"events":["potatoes","ice cream","brushed teeth","work"],"squirrel":false},
  {"events":["peanuts","brushed teeth","running","work"],"squirrel":false},
  {"events":["potatoes","exercise","work"],"squirrel":false},
  {"events":["pizza","ice cream","computer","work"],"squirrel":false},
  {"events":["lasagna","ice cream","work"],"squirrel":false},
  {"events":["cauliflower","candy","reading","weekend"],"squirrel":false},
  {"events":["lasagna","nachos","brushed teeth","running","weekend"],"squirrel":false},
  {"events":["potatoes","brushed teeth","work"],"squirrel":false},
  {"events":["carrot","work"],"squirrel":false},
  {"events":["pizza","beer","work","dentist"],"squirrel":false},
  {"events":["lasagna","pudding","cycling","work"],"squirrel":false},
  {"events":["spaghetti","brushed teeth","reading","work"],"squirrel":false},
  {"events":["spaghetti","pudding","television","weekend"],"squirrel":false},
  {"events":["bread","brushed teeth","exercise","weekend"],"squirrel":false},
  {"events":["lasagna","peanuts","work"],"squirrel":true},
  {"events":["pizza","work"],"squirrel":false},
  {"events":["potatoes","exercise","work"],"squirrel":false},
  {"events":["brushed teeth","exercise","work"],"squirrel":false},
  {"events":["spaghetti","brushed teeth","television","work"],"squirrel":false},
  {"events":["pizza","cycling","weekend"],"squirrel":false},
  {"events":["carrot","brushed teeth","weekend"],"squirrel":false},
  {"events":["carrot","beer","brushed teeth","work"],"squirrel":false},
  {"events":["pizza","peanuts","candy","work"],"squirrel":true},
  {"events":["carrot","peanuts","brushed teeth","reading","work"],"squirrel":false},
  {"events":["potatoes","peanuts","brushed teeth","work"],"squirrel":false},
  {"events":["carrot","nachos","brushed teeth","exercise","work"],"squirrel":false},
  {"events":["pizza","peanuts","brushed teeth","television","weekend"],"squirrel":false},
  {"events":["lasagna","brushed teeth","cycling","weekend"],"squirrel":false},
  {"events":["cauliflower","peanuts","brushed teeth","computer","work","touched tree"],"squirrel":false},
  {"events":["lettuce","brushed teeth","television","work"],"squirrel":false},
  {"events":["potatoes","brushed teeth","computer","work"],"squirrel":false},
  {"events":["bread","candy","work"],"squirrel":false},
  {"events":["potatoes","nachos","work"],"squirrel":false},
  {"events":["carrot","pudding","brushed teeth","weekend"],"squirrel":false},
  {"events":["carrot","brushed teeth","exercise","weekend","touched tree"],"squirrel":false},
  {"events":["brussel sprouts","running","work"],"squirrel":false},
  {"events":["brushed teeth","work"],"squirrel":false},
  {"events":["lettuce","brushed teeth","running","work"],"squirrel":false},
  {"events":["candy","brushed teeth","work"],"squirrel":false},
  {"events":["brussel sprouts","brushed teeth","computer","work"],"squirrel":false},
  {"events":["bread","brushed teeth","weekend"],"squirrel":false},
  {"events":["cauliflower","brushed teeth","weekend"],"squirrel":false},
  {"events":["spaghetti","candy","television","work","touched tree"],"squirrel":false},
  {"events":["carrot","pudding","brushed teeth","work"],"squirrel":false},
  {"events":["lettuce","brushed teeth","work"],"squirrel":false},
  {"events":["carrot","ice cream","brushed teeth","cycling","work"],"squirrel":false},
  {"events":["pizza","brushed teeth","work"],"squirrel":false},
  {"events":["spaghetti","peanuts","exercise","weekend"],"squirrel":true},
  {"events":["bread","beer","computer","weekend","touched tree"],"squirrel":false},
  {"events":["brushed teeth","running","work"],"squirrel":false},
  {"events":["lettuce","peanuts","brushed teeth","work","touched tree"],"squirrel":false},
  {"events":["lasagna","brushed teeth","television","work"],"squirrel":false},
  {"events":["cauliflower","brushed teeth","running","work"],"squirrel":false},
  {"events":["carrot","brushed teeth","running","work"],"squirrel":false},
  {"events":["carrot","reading","weekend"],"squirrel":false},
  {"events":["carrot","peanuts","reading","weekend"],"squirrel":true},
  {"events":["potatoes","brushed teeth","running","work"],"squirrel":false},
  {"events":["lasagna","ice cream","work","touched tree"],"squirrel":false},
  {"events":["cauliflower","peanuts","brushed teeth","cycling","work"],"squirrel":false},
  {"events":["pizza","brushed teeth","running","work"],"squirrel":false},
  {"events":["lettuce","brushed teeth","work"],"squirrel":false},
  {"events":["bread","brushed teeth","television","weekend"],"squirrel":false},
  {"events":["cauliflower","peanuts","brushed teeth","weekend"],"squirrel":false}
];


var correlations=gatherCorrelations(JOURNAL)
for(var k in correlations){
  console.log(k +':'+correlations[k])
}
console.log('================================')
for(var k in correlations){
  if(correlations[k]>0.1||correlations[k]<-0.1){
    console.log(k+':'+correlations[k])
  }
}
console.log('=================================')
for(var i=0;i<JOURNAL.length;i++){
  var entry = JOURNAL[i]
  if(hasEvent('peanuts',entry)&&!hasEvent('brushed teeth',entry)){
    entry.events.push('吃豆没刷牙')//判断，如果当天中同时发生了两件事，则增加一个合并事件
  }
}
console.log(phi(tableFor('吃豆没刷牙',JOURNAL)))