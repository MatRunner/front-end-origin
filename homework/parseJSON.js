// 递归下降解析语法树
//其中首先对语句进行语法树转换的操作是一样的，得到语法树后，在转换成具体风格的语言

class parseJSON {
  constructor(str) {
    this.str = str//扫描一遍字符串，根据特定字符来对特定部分进行操作，使用pos遍历一遍字符串
    this.pos = 0
  }
  parseValue() {//代表不同数据类型的值开始的特殊字符
    if (this.str[this.pos] == '[') {
      return this.parseArray()
    }
    if (this.str[this.pos] == '{') {
      return this.parseObject()
    }
    if (this.str[this.pos] == '"') {//字符串一定是以引号开头
      return this.parseString()
    }
    if (this.str[this.pos] == 't') {
      return this.parseTrue()
    }
    if (this.str[this.pos] == 'f') {
      return this.parseFalse()
    }
    if (this.str[this.pos] == 'n') {
      return this.parseNull()
    }
    if (this.str[this.pos] == ',') {
      this.pos++
    }
    return this.parseNumber()
  }
  parseTrue() {
    this.pos += 4
    return true
  }
  parseFalse() {
    this.pos += 5
    return false
  }
  parseNull() {
    this.pos += 4
    return null
  }
  parseString() {
    //此时pos指向“
    this.pos++
    var str = ''
    for (; this.pos < this.str.length;) {
      if (this.str[this.pos] == '\"') {
        this.pos++
        return str
      } else {
        str += this.str[this.pos++]
      }
    }
  }
  parseNumber() {
    var num = ''
    for (; this.pos < this.str.length;) {
      if (this.str[this.pos] >= '0' && this.str[this.pos] <= '9') {
        num += this.str[this.pos++]
      } else {
        return +num
      }
    }
    return +num
  }
  parseArray() {
    //pos指向[
    var ary = []
    this.pos++
    for (; this.pos < this.str.length;) {
      if (this.str[this.pos] == ']') {//数组的结束条件
        this.pos++
        return ary
      } else if (this.str[this.pos] == ',') {
        this.pos++
      } else {
        ary.push(this.parseValue())
      }
    }
  }
  parseObject() {
    //进入时pos指向{
    var obj = {}
    this.pos++
    for (; this.pos < this.str.length;) {
      if (this.str[this.pos] == '}') {
        this.pos++
        return obj
      } else if (this.str[this.pos] == ',') {
        this.pos++
      } else {
        var key = this.parseString()
        this.pos++//跳过冒号
        obj[key] = this.parseValue()
      }
    }
  }
}




//力扣1106，将布尔类型字符串转化成布尔值
class parseBol {
  constructor(str) {
    this.str = str
    this.pos = 0
  }
  parseBoolean() {
    if (this.str[this.pos] == 'f') {
      this.pos++
      return false
    } else if (this.str[this.pos] == 't') {
      this.pos++
      return true
    }
  }
  parseParameter() {
    if (this.str[this.pos] == '&' || this.str[this.pos] == '|' || this.str[this.pos] == '!') {
      return this.parseFunction()
    }
    if (this.str[this.pos] == 't' || this.str[this.pos] == 'f') {
      return this.parseBoolean()
    }
  }
  parseFunction() {
    //该函数将字符串转化为对象的存储方式
    var obj = {
      functionName: null,
      parameters: []
    }
    if (this.str[this.pos] == '!') {
      obj['functionName'] = '!'
    } else if (this.str[this.pos] == '|') {
      obj['functionName'] = '|'
    } else if (this.str[this.pos] == '&') {
      obj['functionName'] = '&'
    }
    this.pos += 2//跳过左括号
    while (this.pos < this.str.length) {
      if (this.str[this.pos] == ')') {
        this.pos++
        return obj
      } else if (this.str[this.pos] == ',') {
        this.pos++
      } else {
        obj.parameters.push(this.parseParameter())
      }
    }
  }
  getBoolean(bol) {
    if (typeof (bol) == 'object') {
      var ary = bol.parameters.map(this.getBoolean.bind(this))//原型方法在递归时this会丢失，要对该this进行绑定
      if (bol.functionName == '&') {
        for (let i = 0; i < ary.length; i++) {
          if (!ary[i]) {
            return false
          }
        }
        return true
      }
      if (bol.functionName == '|') {
        for (let i = 0; i < ary.length; i++) {
          if (ary[i]) { return true }
        }
        return false
      }
      if (bol.functionName == '!') {
        return !ary[0]
      }
    } else {
      return bol
    }
  }
  outputRes() {
    return this.getBoolean(this.parseFunction())
  }
}


//力扣736
class parseLisp {
  constructor(str) {
    this.str = str
    this.pos = 0
    this.m = new Map()
  }
  parseValue() {
    if (this.str[this.pos] == '(') {
      this.pos++
      //左括号意味着有一个独立的语句块
      return this.parseFunction()
    }
    if (this.str[this.pos] !== ' ') {
      var part = ''
      while (this.str[this.pos] !== ' ' && this.str[this.pos] !== ')') {
        part += this.str[this.pos++]
      }
      return part
    }
  }
  parseFunction() {
    var obj = {
      functionName: null,
      parameters: []
    }
    if (this.str[this.pos] == 'l') {
      //左括号跟着一个l，肯定是let吧！
      obj.functionName = 'let'
      this.pos += 3
    } else if (this.str[this.pos] == 'a') {
      obj.functionName = 'add'
      this.pos += 3
    } else if (this.str[this.pos] == 'm') {
      obj.functionName = 'mult'
      this.pos += 4
    }
    while (this.str[this.pos] !== ')') {
      if (this.str[this.pos] == ' ') {
        this.pos++
      } else {
        obj.parameters.push(this.parseValue())
      }

    }
    this.pos++//多个括号嵌套得跳过一个右括号来结束本层
    return obj
  }
  static calculate(obj, m) {
    var operator = obj.functionName
    if (operator == 'let') {
      return parseLisp.functionLet(obj.parameters, m)
    }
    if (operator == 'add') {
      return parseLisp.functionAdd(obj.parameters, m)
    }
    if (operator == 'mult') {
      return parseLisp.functionMult(obj.parameters, m)
    }
  }
  static functionLet(ary, m) {
    //因为一直使用一个Map的话，嵌套的let函数会改变外层的Map，因此对let函数的递归调用传入拷贝的Map.
    //拷贝的位置也要注意一下，在传入前一刻拷贝
    for (var i = 0; i < ary.length - 1; i += 2) {
      if (typeof (ary[i + 1]) == 'object') {
        var n = new Map(m)
        var res = parseLisp.calculate(ary[i + 1], n)
        m.set(ary[i], res)
      } else {
        if (/^-?\d+$/.test(ary[i + 1])) {
          m.set(ary[i], Number(ary[i + 1]))
        } else {
          m.set(ary[i], m.get(ary[i + 1]))
        }
      }
    }
    if (typeof (ary[i]) == 'object') {
      var n = new Map(m)
      return parseLisp.calculate(ary[i], n)
    } else {
      if (/^-?\d+$/.test(ary[i])) {
        return Number(ary[i])
      } else {
        return m.get(ary[i])
      }
    }
  }
  static functionAdd(ary, m) {
    //当然，add和mult也会嵌套let，所以只要有递归调用就要复制一份Map
    if (typeof (ary[0]) == 'object') {
      var n = new Map(m)
      var a = parseLisp.calculate(ary[0], n)
    } else {
      if (/^-?\d+$/.test(ary[0])) {
        a = Number(ary[0])
      } else {
        a = m.get(ary[0])
      }
    }
    if (typeof (ary[1]) == 'object') {
      var n = new Map(m)
      var b = parseLisp.calculate(ary[1], n)
    } else {
      if (/^-?\d+$/.test(ary[1])) {
        var b = Number(ary[1])
      } else {
        b = m.get(ary[1])
      }
    }
    return a + b
  }
  static functionMult(ary, m) {
    if (typeof (ary[0]) == 'object') {
      var n = new Map(m)
      var a = parseLisp.calculate(ary[0], n)
    } else {
      if (/^-?\d+$/.test(ary[0])) {
        a = Number(ary[0])
      } else {
        a = m.get(ary[0])
      }
    }
    if (typeof (ary[1]) == 'object') {
      var n = new Map(m)
      var b = parseLisp.calculate(ary[1], n)
    } else {
      if (/^-?\d+$/.test(ary[1])) {
        var b = Number(ary[1])
      } else {
        b = m.get(ary[1])
      }
    }
    return a * b
  }
  giveRes() {
    this.pos = 0
    this.m = new Map()
    var obj = this.parseValue()
    return parseLisp.calculate(obj, this.m)
  }
}


