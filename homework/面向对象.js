function Vector(x,y){
  this.x=x
  this.y=y
}
Vector.prototype.plus=function(num){
  return new Vector(this.x+num.x,this.y+num.y)
}
Vector.prototype.minus=function(num){
  return new Vector(this.x-num.x,this.y-num.y)
}



function Complex(real,imag){
  this.real=real
  this.imag=imag
}

Complex.prototype.multiple=function(plural){
  return new Complex(this.real*plural.real-this.imag*plural.imag,this.real*plural.imag+this.imag*plural.x)
}
Complex.prototype.division=function(plural){
  var conjugate=plural.real*plural.real+plural.imag*plural.imag
  return new Complex((this.real*plural.real+this.imag*plural.imag)/conjugate,(this.imag*plural.real-this.real*plural.imag)/conjugate)
}
Complex.prototype.toString=function(){
  return ''+this.real+'+'+this.imag+'i'
}


function MyMap(ary){
  this.iMap=ary==undefined?[]:ary
}
MyMap.prototype._keyidx=function(key){
  if(key!==key){
    return this.iMap.findIndex(it=>it[0]!==it[0])
  }else{
    return this.iMap.findIndex(it=>it[0]===key)
  }
}
MyMap.prototype.set=function(key,val){
  for(let element of this.iMap){
    if(element[0]==key){
      element[1]=val
      return
    }
  }
  this.iMap.push([key,val])
  return
}
MyMap.prototype.get=function(key){
  for(let element of this.iMap){
    if(element[0]==key){return element[1]}
  }
  return undefined
}
MyMap.prototype.has=function(key){
  for(let element of this.iMap){
    if(element[0]==key){return true}
  }
  return false
}
MyMap.prototype.delete=function(key){
  for(let element of this.iMap){
    if(element[0]==key){
      var idx=this.iMap.indexOf(element)
      this.iMap.splice(idx,1)
      return true
    }
  }
  return false
}
MyMap.prototype.clear=function(){
  this.iMap=[]
  return
}
MyMap.prototype.size=function(){
  return this.iMap.length
}
Object.defineProperty(MyMap,'size',{
  get:function(){
    var size=this.iMap.length
    return size
  }
})

function MySet(ary){
  this.iSet=[]
  if(ary!==undefined){
    for(let i=0;i<ary.length;i++){
      this.iSet.add(ary[i])
    }
  }
}
MySet.prototype.add=function(key){
  for(let element of this.iSet){
    if(element==key){return this.iSet}
  }
  this.iSet.push(key)
  return this.iSet
}
MySet.prototype.has=function(key){
  for(let element of this.iSet){
    if(key==element){return true}
  }
  return false
}
MySet.prototype.delete=function(key){
  if(key!==key){
    for(let i=0;i<this.iSet;i++){
      if(this.iSet[i]!==this.iSet[i]){
        this.iSet.splice(i,1)
        return true
      }
  }
  return false
}
  var idx=this.iSet.indexOf(key)
  if(idx==-1){return false}
  this.iSet.splice(idx,1)
  return true
}
MySet.prototype.clear=function(){
  this.iSet=[]
  return this.iSet
}
MySet.prototype.size=function(){
  return this.iSet.length
}




Array.prototype.MyIdxOf=function(val){
  for(let i=0;i<this.length;i++){
    if(this[i]===val){return i}
  }
  return -1
}

function ListNode(key,val,next){
  this.key=key===undefined?undefined:key
  this.val=val===undefined?undefined:val
  this.next=next===undefined?null:next
}

class MyMap2{//缺陷就是没有对NaN进行判断，懒得写了
  constructor(ary){
    this.head=null
    if(ary!==undefined||ary.length!==0){
      for(let i=0;i<ary.length;i++){
        if(!this.head){
          this.head=new ListNode(ary[i][0],ary[i][1])
          this.head.key=ary[i][0]
          this.head.val=ary[i][1]
          var node=this.head
        }else{
          node.next=new ListNode(ary[i][0],ary[i][1])
          node=node.next
        }
      }
    }
  }
  _search(key){
    var dummy=new ListNode('dummy',0,this.head)
    var node=dummy
    while(node.next){
      if(node.next.key===key){
        return node
      }
    }
    return node
  }
  has(key){
    var node=this._search(key)
    if(!node.next){
      return false
    }else{
      return true
    }
  }
  set(key,val){
    var node=this._search(key)
    if(node.next){
      node.next.val=val
    }else{
      node.next=new ListNode(key,val)
    }
  }
  delete(key){
    var node=this._search(key)
    if(node.key=='dummy'){
      this.head=node.next
    }
    if(node.next){
      node.next=node.next.next
      return true
    }else{
      return false
    }
  }
  get(key){
    var node=this._search(key)
    if(node.next){
      return node.next.val
    }else{
      return undefined
    }
  }
  get size(){
    var num=0
    var node=this.head
    while(node){
      num++
      node=node.next
    }
    return num
  }
}

class MySet2 extends MyMap2{
  constructor(ary){
    var ary2=ary.map(x=>[x,0])
    super(ary2)
  }
  add(key){
    this.set(key,0)
  }
}