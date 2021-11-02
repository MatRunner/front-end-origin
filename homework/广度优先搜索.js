var basic={//一个散列表记录初始数据，包括每个节点的邻居及其权重
  'Start':{'A':5,'B':2,},
  'A':{'C':4,'D':2,},
  'B':{'A':8,'D':7,},
  'C':{'D':6,'End':3,},
  'D':{'End':1,},
}
var cost={//一个散列表记录到达相应节点的最低花费
  'A':5,
  'B':2,
  'C':Infinity,
  'D':Infinity,
  'End':Infinity,
}
var parents={//一个散列表记录到达节点最小花费的父节点
  'A':'Start',
  'B':'Start',

}
var treated={}//一个散列表记录已经被处理过的节点
function findLowestCost(cost){//找花费最低节点
  var node=''
  var lowest=Infinity
  for(var key in cost){
    if(cost[key]<lowest&&!(key in treated)){//且要求当前节点没被处理过，这是迪克斯特拉算法的要求
      lowest=cost[key]//如果花费小于当前值，则更新
      node=key
    }
  }
  return node//返回cost表中未被处理的最小花费的节点
}
var node=findLowestCost(cost)
while(node!=''){//循环条件是仍有节点未被处理，这个循环条件还是挺妙的
  for(var key in basic[node]){
    if(basic[node][key]<cost[key]){
      cost[key]=basic[node][key]
      parents[key]=node
    }
  }
  treated[node]='treated'
  node=findLowestCost(cost)
}
function findShortest(node){//该函数根据终点追溯到起点的最短距离
  var distace=0
  while(node!='Start'){
    distace+=cost[node]
    node=parents[node]
  }
  return distace
}
