function wildcardMatching(wildcard, str){
  //先来个笨办法
  var reStr='^'
  for(let i=0;i<wildcard.length;i++){
    if(wildcard[i]==='?'){
      reStr+='[^]'
    }
    if(wildcard[i]==='*'){
      reStr+='[^]*'
    }
    if(wildcard[i]!=='?'&&wildcard[i]!=='*'){//还需要考虑其他标点符号要原样传入
      reStr+=wildcard[i]
    }
  }
  reStr+='$'
  var re=new RegExp(reStr)
  return re.test(str)
}

String.prototype.match2=function(regexp){//注意匹配到的是null，还有传入的正则万一lastIndex被改了
  if(Object.getPrototypeOf(regexp)!==RegExp.prototype){
    var regexp=new RegExp(regexp)
  }
  var ans=[],ary
  var idx=regexp.lastIndex
  if(/g/.test(regexp.flags)){
    while(ary=regexp.exec(this))
      ans=ans.concat(ary)
  }else{
    return regexp.exec(this)
  }
  regexp.lastIndex=idx
  return ans
}

String.prototype.split2=function(mark){
  var mark=mark
  if(typeof(mark)=='string'){//仅使用slice，以indexOf位置为切分点
    var ary,ans=[]
    var reStr=`[^]*?(?=${mark})`
    var re=new RegExp(reStr,'g')
    var lastIdx=re.lastIndex
    while(ary=re.exec(this)){
      //注意如果切出来空字符串会死循环
      ans=ans.concat(ary)
      re.lastIndex+=mark.length//在每次exec的过程中，lastIndex会自动跳到上个匹配字符的下一位，仅就本题来说，匹配字符下面必定是mark，所以跳过即可
      lastIdx=re.lastIndex
    }
    if(lastIdx>this.length){
      ans.push('')
    }else{
      ans.push(this.slice(lastIdx))
    }
}
  if(Object.getPrototypeOf(mark)===RegExp.prototype){
    var marks=mark.source
    var ary,ans=[]
    var reStr=`[^]*?(?=(${marks}))`
    var re=new RegExp(reStr,'g')
    var lastIdx=re.lastIndex
    while(ary=re.exec(this)){
      //注意如果切出来空字符串会死循环
      ans.push(ary[0])
      re.lastIndex+=ary[1].length
      for(let i=2;i<ary.length;i++){
        ans.push(ary[i])
      }
      lastIdx=re.lastIndex
    }
    if(lastIdx>this.length){
      ans.push('')
    }else{
      ans.push(this.slice(lastIdx))
    }
  }
  return ans
}

String.prototype.replace2=function(arg1,arg2){//对通配符$&之类的处理，以$将字符串分割，然后
  if(typeof(arg1)==='string'){
    var ree=new RegExp(arg1)
  }else if(Object.getPrototypeOf(arg1)===RegExp.prototype){
    ree=arg1
  }
  if(typeof(arg2)==='string'){
    var f=function(...args){
      return arg2
    }
  }else if(typeof(arg2)==='function'){
    f=arg2
  }
  if(ree.test(this)===false){
    return this.toString()
  }
  var marks=ree.source
  var ary,ans=[]
  var reStr=`[^]*?(?=(${marks}))`
  var re=new RegExp(reStr,'g')
  var lastIdx=re.lastIndex
  if(ree.flags.includes('g')){
    //有点像split但是有所不同
      while(ary=re.exec(this)){
        //注意如果切出来空字符串会死循环
        ans.push(ary[0])
        re.lastIndex+=ary[1].length
        ary=ary.splice(1,1)
        ans.push(f(...ary))
        lastIdx=re.lastIndex
      }
  }else{
    ary=re.exec(this)
    ans.push(ary[0])
    re.lastIndex+=ary[1].length
    ary=ary.splice(1,1)
    ans.push(f(...ary))
    lastIdx=re.lastIndex
  }
  if(lastIdx>this.length){
    ans.push('')
  }else{
    ans.push(this.slice(lastIdx))
  }
    return ans.join('')
}

String.prototype.search2=function(arg){
  if(typeof(arg)==='string'){
    var re=new RegExp(arg)
  }else{
    re=arg
  }
  if(re.exec(this)){
    return re.exec(this).index
  }else{
    return -1
  }
}

RegExp.prototype.test2=function(str){
  if(this.exec(str)){
    return true
  }else{
    return false
  }
}


String.prototype.trim2 = function(c){
  if(c==undefined){
    if(/^ +| +$/.test(this)){
    return this.replace(/^ *| *$/g,'')
    }else{
      return this
    }
  }
  var reStr=`\\b${c}*|${c}*\\b`
  var re=new RegExp(reStr,'gi')
  if(re.test(this)){
  return this.replace(re,'')
  }else{
    return this
  }
}

function match(str,ref){
  
    if(str[0]=='?'||str[0]==ref[0]){
      return match(str.slice(1),ref.slice(1))
    }else if(str[0]=='*'){
      for(let i=0;i<ref.length;i++){

      }
    }
  
}

