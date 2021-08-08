var matrunner = function () {
  //=========================================================================================================================
  //工具类函数，先造点轮子
  function iteratee(arg) {
    if (typeof (arg) == 'function') {
      return arg
    }
    if (typeof (arg) == 'string') {
      return function (element) {
        return element[arg]
      }
    }
    if (Array.isArray(arg)) {
      return function (obj) {
        if (!(arg[0] in obj)) {
          return false
        } else {
          if (!isEqual(arg[1], obj[arg[0]])) {
            return false
          } else {
            return true
          }
        }
      }
    }
    if (Object.getPrototypeOf(arg) === Object.prototype) {
      return function (obj) {
        if (isEqual(obj, arg)) {
          return true
        } else {
          return false
        }
      }
    }
  }

  function matches(obj) {
    return function (src) {
      for (var key in obj) {
        if (!(key in obj)) {
          return false
        } else {
          if (!isEqual(obj[key], src[key])) {
            return false
          }
        }
      }
      return true
    }
  }
  function matchesProperty(ary) {
    return function (obj) {
      if (!(ary[0] in obj)) {
        return false
      } else {
        if (!isEqual(ary[1], obj[ary[0]])) {
          return false
        } else {
          return true
        }
      }
    }
  }
  function shellSort(nums, f = it => it) {
    for (var step = nums.length >> 1; step > 0; step = step >> 1) {
      for (var i = step; i < nums.length; i++) {
        for (var j = i - step; j >= 0; j -= step) {
          if (f(nums[j + step]) < f(nums[j])) {
            [nums[j], nums[j + step]] = [nums[j + step], nums[j]]
          } else {
            break
          }
        }
      }
    }
    return nums
  }
  function stringToObjPath(str) {
    return str.split('.').map(x => x.split('[')).reduce((a, b) => a.concat(b)).map(x => x.split(']')).reduce((a, b) => a.concat(b)).filter(x => x !== '')
  }
  //=========================================================================================================================

  function chunk(arr, n) {
    var ans = []
    var group = []
    for (var i = 0; i < arr.length;) {
      if (group.length < n) {
        group.push(arr[i++])
      } else {
        ans.push(group)
        group = []
      }
    }
    ans.push(group)
    return ans
  }

  function compact(arr) {
    return arr.filter(x => x)
  }

  function uniq(arr) {
    var ans = []
    var m = new Map()
    for (var i = 0; i < arr.length; i++) {
      if (!m.has(arr[i])) {
        m.set(arr[i], 1)
        ans.push(arr[i])
      }
    }
    return ans
  }

  function uniqBy(arr, f) {
    function uniqIdx(arr) {
      var idx = []
      var m = new Map()
      for (var i = 0; i < arr.length; i++) {
        if (!m.has(arr[i])) {
          m.set(arr[i], 1)
          idx.push(i)
        }
      }
      return idx
    }
    var ans = []
    if (typeof (f) == 'function') {
      var a = uniqIdx(arr.map(f))
    } else {
      var a = uniqIdx(arr.map(x => x[f]))
    }
    for (let i = 0; i < a.length; i++) {
      ans.push(arr[a[i]])
    }
    return ans
  }

  function flattenDeep(arr) {
    var ans = []
    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i])) {
        var a = flattenDeep(arr[i])
        for (let j = 0; j < a.length; j++) {
          ans.push(a[j])
        }
      } else {
        ans.push(arr[i])
      }
    }
    return ans
  }

  function flattenDepth(arr, depth = 1) {
    var ans = []
    if (depth == 0) {
      return arr.slice()
    }
    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i])) {
        arr[i] = flattenDepth(arr[i], depth - 1)
        for (let j = 0; j < arr[i].length; j++) {
          ans.push(arr[i][j])
        }
      } else {
        ans.push(arr[i])
      }
    }
    return ans
  }

  function groupBy(arr, f) {
    var ans = {}
    if (typeof (f) == 'function') {
      arr.forEach(x => {
        if (f(x) in ans) {
          ans[f(x)].push(x)
        } else {
          ans[f(x)] = [x]
        }
      })
    } else {
      arr.forEach(x => {
        if (x[f] in ans) {
          ans[x[f]].push(x)
        } else {
          ans[x[f]] = [x]
        }
      })
    }
    return ans
  }

  function keyBy(arr, f) {
    var ans = {}
    if (typeof (f) == 'function') {
      arr.forEach(x => {
        ans[f(x)] = x
      })
    } else {
      arr.forEach(x => {
        ans[x[f]] = x
      })
    }
    return ans
  }

  function forEach(arr, f) {
    if (Array.isArray(arr)) {
      for (let i = 0; i < arr.length; i++) {
        f(arr[i])
      }
    }
    if (typeof (arr) == 'object') {
      for (let key in arr) {
        f(arr[key], key)
      }
    }
    return arr
  }

  function map(ary, f) {
    var ans = []
    if (typeof (f) == 'string') {
      var str = f.split('.')
      if (str.length > 1) {
        ary.forEach(x => {
          var t = x
          for (var i = 0; i < str.length; i++) {
            t = t[str[i]]
          }
          ans.push(t)
        })
        return ans
      } else {
        f = iteratee(f)
      }
    }
    if (Array.isArray(f)) {

    }
    if (Object.getPrototypeOf(ary) === Object.prototype) {
      for (var key in ary) {
        ans.push(f(ary[key]))
      }
      return ans
    }
    for (let i = 0; i < ary.length; i++) {
      ans.push(f(ary[i], i, ary))
    }
    return ans
  }

  function filter(arr, f) {
    var ans = []
    if (typeof (f) == 'function') {
      arr.forEach(x => {
        if (f(x)) {
          ans.push(x)
        }
      })
    }
    if (Array.isArray(f)) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][f[0]] == f[1]) {
          ans.push(arr[i])
        }
      }
    }
    if (typeof (f) == 'object') {//取出两个对象中的同名属性进行过滤
      for (var key of arr) {
        var flag = true
        for (var k in f) {
          if (!(k in key)) {
            flag = false
          } else if (!isEqual(f[k], key[k])) {
            flag = false
          }
        }
        if (flag) {
          ans.push(key)
        }
      }
    }
    if (typeof (f) == 'string') {
      for (var key of arr) {
        if (f in key) {
          if (key[f]) {
            ans.push(key)
          }
        }
      }
    }
    return ans
  }

  function reduce(arr, f, initial = arr[0]) {
    if (Array.isArray(arr)) {
      var result = initial
      var idx = 1
      if (arguments.length > 2) {
        idx = 0
      }
      for (var i = idx; i < arr.length; i++) {
        result = f(result, arr[i])
      }
    }
    if (typeof (arr) == 'object' && !Array.isArray(arr)) {
      result = {}
      if (arguments.length > 2) {
        result = initial
      }
      for (let key in arr) {
        f(result, arr[key], key)
      }
    }
    return result
  }

  function zip(...arr) {
    var maxLength = 0
    arr.forEach(x => {
      maxLength = Math.max(maxLength, x.length)
    })
    var ans = new Array(maxLength)
    arr.forEach(x => {
      for (let i = 0; i < maxLength; i++) {
        if (!ans[i]) {
          ans[i] = []
        }
        ans[i].push(x[i])
      }
    })
    return ans
  }

  function unzip(arr) {
    var ans = []
    arr.forEach(x => {
      for (let i = 0; i < x.length; i++) {
        if (!ans[i]) {
          ans[i] = []
        }
        ans[i].push(x[i])
      }
    })
    return ans//咋感觉和zip一个玩意？
  }

  function keys(obj) {
    var ans = []
    for (var key in obj) {
      ans.push(key)
    }
    return ans
  }

  function values(obj) {
    var ans = []
    for (var key in obj) {
      ans.push(obj[key])
    }
    return ans
  }

  function every(obj, f) {
    if (typeof (f) == 'function') {
      return obj.reduce((x, y) => f(x) && f(y))
    }
    if (Array.isArray(f)) {
      for (var key of obj) {
        if (key[f[0]] !== f[1]) {
          return false
        }
      }
      return true
    }
    if (typeof (f) == 'object') {
      for (var key of obj) {
        if (!isEqual(key, f)) {
          return false
        }
      }
      return true
    }
    if (typeof (f) == 'string') {
      for (var key of obj) {
        if (!key[f]) {
          return false
        }
      }
      return true
    }
  }

  function isEqual(obj1, obj2) {
    if (typeof (obj1) !== typeof (obj2)) {
      return false
    }
    if (Array.isArray(obj1) ^ Array.isArray(obj2)) {
      return false
    }
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length != obj2.length) {
        return false
      } else {
        for (let i = 0; i < obj1.length; i++) {
          if (!isEqual(obj1[i], obj2[i])) {
            return false
          }
        }
        return true
      }
    }
    if (typeof (obj1) == 'object') {
      //还需要对比属性数量
      var count1 = 0, count2 = 0
      for (var k in obj1) {
        count1++
      }
      for (var s in obj2) {
        count2++
      }
      if (count1 != count2) {
        return false
      }
      for (var key in obj1) {
        if (key in obj2) {
          if (!isEqual(obj1[key], obj2[key])) {
            return false
          }
        } else {
          return false
        }
      }
    } else {
      return obj1 == obj2
    }
    return true
  }

  function some(obj, f) {
    if (typeof (f) == 'function') {
      return obj.reduce((x, y) => f(x) || f(y))
    }
    if (Array.isArray(f)) {
      for (var key of obj) {
        if (key[f[0]] == f[1]) {
          return true
        }
      }
      return false
    }
    if (typeof (f) == 'object') {
      for (var key of obj) {
        if (isEqual(key, f)) {
          return true
        }
      }
      return false
    }
    if (typeof (f) == 'string') {
      for (var key of obj) {
        if (key[f]) {
          return true
        }
      }
      return false
    }
  }

  function sortBy(obj, arr) {
    //突然想起谷歌是不稳定的，火狐是稳定的，那还是自己写排序吧
    //需要一个compare函数
    function compare(a, b, ary, idx = 0) {
      if (typeof (ary[idx]) == 'function') {
        if (ary[idx](a) > ary[idx](b)) {
          return 1
        } else if (ary[idx](a) < ary[idx](b)) {
          return -1
        } else {
          if (idx + 1 < ary.length) {
            return compare(a, b, ary, idx + 1)
          } else {
            return 0
          }
        }
      }
      if (typeof (ary[idx]) == 'string') {
        if (a[ary[idx]] > b[ary[idx]]) {
          return 1
        } else if (a[ary[idx]] < b[ary[idx]]) {
          return -1
        } else {
          if (idx + 1 < ary.length) {
            return compare(a, b, ary, idx + 1)
          } else {
            return 0
          }
        }
      }
    }
    //然后自己再写个插入排序
    for (var i = 1; i < obj.length; i++) {
      var val = obj[i]
      for (var j = i - 1; j >= 0; j--) {
        if (compare(val, obj[j], arr) < 0) {
          obj[j + 1] = obj[j]
        } else {
          break
        }
      }
      obj[j + 1] = val
    }
    return obj
  }

  function reverse(arr) {
    var i = 0, j = arr.length - 1
    for (; i < j; i++, j--) {
      [arr[i], arr[j]] = [arr[j], arr[i]]//解构赋值yyds
    }
    return arr
  }

  function countBy(arr, f) {
    var obj = {}
    if (typeof (f) == 'function') {
      arr.forEach(x => {
        if (f(x) in obj) {
          obj[f(x)]++
        } else {
          obj[f(x)] = 1
        }
      })
    }
    if (typeof (f) == 'string') {
      arr.forEach(x => {
        if (x[f] in obj) {
          obj[x[f]]++
        } else {
          obj[x[f]] = 1
        }
      })
    }
    return obj
  }

  function reduceRight(arr, f, initial = arr[arr.length - 1]) {
    var result = initial
    var idx = arr.length - 2
    if (arguments.length > 2) {
      idx = arr.length - 1
    }
    for (var i = idx; i >= 0; i--) {
      result = f(result, arr[i])
    }
    return result
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i >= 0; i--) {
      var randomIdx = Math.floor(Math.random() * (i + 1))
      var randomVal = arr[randomIdx]
      arr[randomIdx] = arr[i]
      arr[i] = randomVal
    }
    return arr
  }

  function isNaN(val) {
    //包装类型的判断不了，包装完以后成个对象了，自身的地址等于自身的地址？
    if (typeof (val) == 'object') {
      var ref = new Number(1)
      if (Object.getPrototypeOf(ref) === Object.getPrototypeOf(val)) {
        val = Number(val)
      }
    }
    return !(val === val)
  }

  function isNull(val) {
    return Object.getPrototypeOf(Object.prototype) === val
  }

  function isNil(val) {
    return val === undefined || val === null
  }

  function isUndefined(val) {
    return val === undefined
  }

  function toArray(val) {
    var ans = []
    if (typeof (val) == 'object') {
      if (!val) { return ans }
      for (let key in val) {
        ans.push(val[key])
      }
    }
    if (typeof (val) == 'string') {
      for (let i = 0; i < val.length; i++) {
        ans.push(val[i])
      }
    }
    return ans
  }

  function sum(arr) {
    var res = 0
    for (let i = 0; i < arr.length; i++) {
      res += arr[i]
    }
    return res
  }

  function sumBy(arr, f) {
    var res = 0
    if (typeof (f) == 'function') {
      arr.forEach(x => {
        res += f(x)
      })
    }
    if (typeof (f) == 'string') {
      arr.forEach(x => {
        res += x[f]
      })
    }
    return res
  }

  function difference(arr, ...compare) {
    var ans = []
    var ref = []
    ref = compare.reduce((ary1, ary2) => {
      return ary1.concat(ary2)
    }, [])
    for (var i = 0; i < arr.length; i++) {
      if (!ref.includes(arr[i])) {
        ans.push(arr[i])
      }
    }
    return ans
  }

  function diffenrenceBy(arr, ...compare) {
    var ans = []
    var f = compare.pop()
    var ref = compare.reduce((ary1, ary2) => {
      return ary1.concat(ary2)
    }, [])
    if (typeof (f) == 'function') {
      ref = ref.map(x => f(x))
      for (let i = 0; i < arr.length; i++) {
        if (!ref.includes(f(arr[i]))) {
          ans.push(arr[i])
        }
      }
    }
    if (typeof (f) == 'string') {
      ref = ref.map(x => x[f])
      for (var i = 0; i < arr.length; i++) {
        if (!ref.includes(arr[i][f])) {
          ans.push(arr[i])
        }
      }
    }
    if (Array.isArray(f)) {
      compare.push(f)
      return difference(arr, ...compare)
    }
    return ans
  }

  function differenceWith(arr, ref, f) {
    var ans = []
    for (var i = 0; i < arr.length; i++) {
      var flag = true
      for (var key of ref) {
        if (f(arr[i], key)) {
          flag = false
          break
        }
      }
      if (flag) {
        ans.push(arr[i])
      }
    }
    return ans
  }

  function drop(arr, n = 1) {
    var ans = []
    if (n > arr.length - 1) { return ans }
    for (var i = n; i < arr.length; i++) {
      ans.push(arr[i])
    }
    return ans
  }

  function dropRight(arr, n = 1) {
    var ans = []
    if (n > arr.length - 1) {
      return ans
    }
    for (var i = 0; i < arr.length - n; i++) {
      ans.push(arr[i])
    }
    return ans
  }

  function dropWhile(ary, f) {
    var ans
    if (typeof (f) == 'function') {
      for (let i = 0; i < ary.length; i++) {
        if (!f(ary[i])) {
          ans = ary.slice(i)
          break
        }
      }
    }
    if (Array.isArray(f)) {
      for (let i = 0; i < ary.length; i++) {
        if (!(f[0] in ary[i])) {
          ans = ary.slice(i)
          break
        } else if (!isEqual(f[1], ary[i][f[0]])) {
          ans = ary.slice(i)
          break
        }
      }
    }
    if (Object.getPrototypeOf(f) === Object.prototype) {
      for (let i = 0; i < ary.length; i++) {
        if (!isEqual(f, ary[i])) {
          ans = ary.slice(i)
          break
        }
      }
    }
    if (typeof (f) == 'string') {
      for (let i = 0; i < ary.length; i++) {
        if (!(f in ary[i])) {
          ans = ary.slice(i)
          break
        } else if (!ary[i][f]) {
          ans = ary.slice(i)
          break
        }
      }
    }
    return ans
  }

  function dropRightWhile(ary, f) {
    var ans
    if (typeof (f) == 'function') {
      for (let i = ary.length - 1; i >= 0; i--) {
        if (!f(ary[i])) {
          ans = ary.slice(0, i + 1)
          break
        }
      }
    }
    if (Array.isArray(f)) {
      for (let i = ary.length - 1; i >= 0; i--) {
        if (!(f[0] in ary[i])) {
          ans = ary.slice(0, i + 1)
          break
        } else if (!isEqual(f[1], ary[i][f[0]])) {
          ans = ary.slice(0, i + 1)
          break
        }
      }
    }
    if (Object.getPrototypeOf(f) === Object.prototype) {
      for (let i = ary.length - 1; i >= 0; i--) {
        if (!isEqual(f, ary[i])) {
          ans = ary.slice(0, i + 1)
          break
        }
      }
    }
    if (typeof (f) == 'string') {
      for (let i = ary.length - 1; i >= 0; i--) {
        if (!(f in ary[i])) {
          ans = ary.slice(0, i + 1)
          break
        } else if (!ary[i][f]) {
          ans = ary.slice(0, i + 1)
          break
        }
      }
    }
    return ans
  }

  function fill(ary, value, start = 0, end = ary.length) {
    for (let i = start; i < end; i++) {
      ary[i] = value
    }
    return ary
  }

  function findIndex(ary, f, fromIndex = 0) {
    if (typeof (f) == 'function') {
      for (let i = fromIndex; i < ary.length; i++) {
        if (f(ary[i])) {
          return i
        }
      }
      return -1
    }
    if (Array.isArray(f)) {
      for (let i = fromIndex; i < ary.length; i++) {
        if (f[0] in ary[i]) {
          if (f[1] == ary[i][f[0]]) {
            return i
          }
        }
      }
      return -1
    }
    if (Object.getPrototypeOf(f) === Object.prototype) {
      for (let i = fromIndex; i < ary.length; i++) {
        if (isEqual(ary[i], f)) {
          return i
        }
      }
      return -1
    }
    if (typeof (f) == 'string') {
      for (let i = fromIndex; i < ary.length; i++) {
        if (f in ary[i]) {
          if (ary[i][f]) {
            return i
          }
        }
      }
      return -1
    }
  }

  function findLastIndex(ary, f, fromIndex = ary.length - 1) {
    if (typeof (f) == 'function') {
      for (let i = fromIndex; i >= 0; i--) {
        if (f(ary[i])) {
          return i
        }
      }
      return -1
    }
    if (Array.isArray(f)) {
      for (let i = fromIndex; i >= 0; i--) {
        if (f[0] in ary[i]) {
          if (f[1] == ary[i][f[0]]) {
            return i
          }
        }
      }
      return -1
    }
    if (Object.getPrototypeOf(f) === Object.prototype) {
      for (let i = fromIndex; i >= 0; i--) {
        if (isEqual(ary[i], f)) {
          return i
        }
      }
      return -1
    }
    if (typeof (f) == 'string') {
      for (let i = fromIndex; i >= 0; i--) {
        if (f in ary[i]) {
          if (ary[i][f]) {
            return i
          }
        }
      }
      return -1
    }
  }

  function fromPairs(ary) {
    var obj = {}
    ary.forEach(element => {
      if (element[0] in obj) {
        obj[element[0]] = element[1]
      } else {
        obj[element[0]] = element[1]
      }
    })
    return obj
  }

  function head(ary) {
    return ary.length == 0 ? undefined : ary[0]
  }

  function indexOf(ary, value, fromIndex = 0) {
    for (let i = fromIndex; i < ary.length; i++) {
      if (ary[i] === value) {
        return i
      }
    }
    return -1
  }

  function initial(ary) {
    ary.pop()
    return ary
  }

  function intersectionBy(ary, ...args) {
    var f = args.pop()
    var ans = []
    var ref = args.reduce((ary1, ary2) => { return ary1.concat(ary2) }, [])
    if (typeof (f) == 'function') {
      ref = ref.map(x => f(x))
      ary.forEach(element => {
        if (ref.includes(f(element))) {
          ans.push(element)
        }
      })
    }
    if (typeof (f) == 'string') {
      ref = ref.map(x => x[f])
      ary.forEach(element => {
        if (ref.includes(element[f])) {
          ans.push(element)
        }
      })
    }
    if (Array.isArray(f)) {
      ref.concat(f)
      ary.forEach(element => {
        if (ref.includes(element)) {
          ans.push(element)
        }
      })
    }
    return ans
  }

  function intersection(ary, ...args) {
    var ref = args.reduce((a, b) => a.concat(b), [])
    var ans = []
    ary.forEach(element => {
      if (ref.includes(element)) {
        ans.push(element)
      }
    })
    return ans
  }

  function intersectionWith(ary, ...args) {
    var ref = args.reduce((ary1, ary2) => {
      return ary1.concat(ary2)
    }, [])
    var ans = []
    ary.forEach(element => {
      ref.forEach(compare => {
        if (isEqual(element, compare)) {
          ans.push(element)
        }
      })
    })
    return ans
  }
  function join(ary, mark) {
    mark = '' + mark
    return ary.reduce((a, b) => {
      return a + mark + b
    })
  }

  function last(ary) {
    return ary.length == 0 ? undefined : ary[ary.length - 1]
  }

  function lastIndexOf(ary, value, fromIndex = ary.length - 1) {
    for (let i = fromIndex; i >= 0; i--) {
      if (ary[i] === value) {
        return i
      }
    }
    return -1
  }

  function nth(ary, n) {
    if (n < 0) {
      var pos = ary.length + n
    } else {
      pos = n
    }
    return ary[pos]
  }

  function pull(ary, ...args) {
    for (let i = 0; i < ary.length;) {
      if (args.includes(ary[i])) {
        ary.splice(i, 1)
      } else {
        i++
      }
    }
    return ary
  }

  function pullAll(ary, ref) {
    return pull(ary, ...ref)
  }

  function pullAllBy(ary, ref, f) {
    for (let i = 0; i < ary.length;) {
      if (ref.map(x => x[f]).includes(ary[i][f])) {
        ary.splice(i, 1)
      } else {
        i++
      }
    }
    return ary
  }

  function pullAllWith(ary, ref, f) {
    for (let i = 0; i < ary.length;) {
      var flag = false
      for (let j = 0; j < ref.length; j++) {
        if (f(ary[i], ref[j])) {
          flag = true
          break
        }
      }
      if (flag) {
        ary.splice(i, 1)
      } else {
        i++
      }
    }
    return ary
  }

  function flatten(ary) {
    var ans = []
    for (let i = 0; i < ary.length; i++) {
      if (Array.isArray(ary[i])) {
        ary[i].forEach(x => {
          ans.push(x)
        })
      } else {
        ans.push(ary[i])
      }
    }
    return ans
  }

  function sortedIndex(ary, value) {
    var left = 0, right = ary.length - 1
    if (value >= ary[right]) {
      return right + 1
    }
    if (value < ary[left]) {
      return 0
    }
    while (left < right) {
      var mid = left + (right - left >> 1)
      if (ary[mid] >= value) {
        right = mid
      } else {
        left = mid + 1
      }
    }
    return left
  }

  function sortedIndexBy(ary, value, f) {
    if (typeof (f) == 'function') {
      return sortedIndex(ary.map(x => f(x)), f(value))
    }
    if (typeof (f) == 'string') {
      return sortedIndex(ary.map(x => x[f]), value[f])
    }
  }

  function sortedIndexOf(ary, value) {
    var left = 0, right = ary.length - 1
    while (left < right) {
      var mid = left + (right - left >> 1)
      if (ary[mid] < value) {
        left = mid + 1
      } else {
        right = mid
      }
    }
    if (ary[left] === value) {
      return left
    } else {
      return -1
    }
  }

  function sortedLastIndex(ary, value) {
    var left = 0, right = ary.length - 1
    if (value >= ary[right]) {
      return right + 1
    }
    if (value < ary[left]) {
      return 0
    }
    while (left < right) {
      var mid = left + (right - left >> 1)
      if (ary[mid] > value) {
        right = mid
      } else {
        left = mid + 1
      }
    }
    return left
  }

  function sortedLastIndexBy(ary, value, f) {
    return sortedLastIndex(ary.map(x => x[f]), value[f])
  }

  function sortedLastIndexOf(ary, value) {
    var left = 0, right = ary.length - 1
    while (left <= right) {
      var mid = left + (right - left >> 1)
      if (ary[mid] <= value) {
        left = mid + 1
      } else {
        right = mid - 1
      }
    }
    if (ary[right] === value) {
      return right
    } else {
      return -1
    }
  }

  function sortedUniq(ary) {
    var ans = []
    if (ary.length == 0) { return [] }
    ans.push(ary[0])
    for (let i = 1; i < ary.length; i++) {
      if (ary[i] > ary[i - 1]) {
        ans.push(ary[i])
      }
    }
    return ans
  }

  function sortedUniqBy(ary, f) {
    if (ary.length == 0) { return [] }
    var ans = [ary[0]]
    for (let i = 0; i < ary.length; i++) {
      if (f(ary[i]) > f(ary[i - 1])) {
        ans.push(ary[i])
      }
    }
    return ans
  }

  function tail(ary) {
    return ary.slice(1)
  }

  function take(ary, n = 1) {
    var ans = []
    for (let i = 0; i < ary.length && i < n; i++) {
      ans.push(ary[i])
    }
    return ans
  }

  function takeRight(ary, n = 1) {
    var ans = []
    for (let i = ary.length - 1; i >= 0 && i >= ary.length - n; i--) {
      ans.unshift(ary[i])
    }
    return ans
  }

  function takeWhile(ary, f) {
    var f = iteratee(f)
    for (let i = 0; i < ary.length; i++) {
      if (!f(ary[i])) {
        return take(ary, i)
      }
    }
  }

  function takeRightWhile(ary, f) {
    var f = iteratee(f)
    for (let i = ary.length - 1; i >= 0; i--) {
      if (!f(ary[i])) {
        return takeRight(ary, ary.length - i - 1)
      }
    }
  }

  function union(...ary) {
    for (let i = 1; i < ary.length; i++) {
      for (let j = 0; j < ary[i].length; j++) {
        if (!ary[0].includes(ary[i][j])) {
          ary[0].push(ary[i][j])
        }
      }
    }
    return ary[0]
  }

  function unionBy(...ary) {
    var f = ary.pop()
    if (typeof (f) == 'function') {
      var ref = ary[0].map(x => f(x))
      for (let i = 1; i < ary.length; i++) {
        for (let j = 0; j < ary[i].length; j++) {
          if (!ref.includes(f(ary[i][j]))) {
            ary[0].push(ary[i][j])
          }
        }
      }
      return ary[0]
    }
    if (typeof (f) == 'string') {
      var ref = ary[0].map(x => x[f])
      for (let i = 1; i < ary.length; i++) {
        for (let j = 0; j < ary[i].length; j++) {
          if (!ref.includes(ary[i][j][f])) {
            ary[0].push(ary[i][j])
          }
        }
      }
      return ary[0]
    }
  }

  function unionWith(...ary) {
    var f = ary.pop()
    for (let i = 1; i < ary.length; i++) {
      for (let j = 0; j < ary[i].length; j++) {
        var flag = true
        for (let k = 0; k < ary[0].length; k++) {
          if (f(ary[0][k], ary[i][j])) {
            flag = false
            break
          }
        }
        if (flag) { ary[0].push(ary[i][j]) }
      }
    }
    return ary[0]
  }

  function uniqWith(ary, f) {
    var ans = [ary[0]]
    for (let i = 1; i < ary.length; i++) {
      var flag = true
      for (let j = 0; j < ans.length; j++) {
        if (f(ans[j], ary[i])) {
          flag = false
          break
        }
      }
      if (flag) {
        ans.push(ary[i])
      }
    }
    return ans
  }

  function unzipWith(ary, f) {
    var ans = new Array(ary[0].length)
    for (let i = 0; i < ans.length; i++) {
      ans[i] = ary.reduce((a, b) => {
        return f(a[i], b[i])
      })
    }
    return ans
  }

  function without(ary, ...args) {
    var ans = []
    for (let i = 0; i < ary.length; i++) {
      if (!args.includes(ary[i])) {
        ans.push(ary[i])
      }
    }
    return ans
  }

  function xor(...args) {
    return xorBy(...args, it => it)
  }

  function xorBy(...args) {
    var f = args.pop()
    var ans = []
    f = iteratee(f)
    var ary = args.reduce((a, b) => a.concat(b))
    var ary2 = ary.map(x => f(x))
    var record = {}
    for (let i = 0; i < ary2.length; i++) {
      if (ary2[i] in record) {
        record[ary2[i]] = -1
      } else {
        record[ary2[i]] = 1
      }
    }
    for (let i = 0; i < ary2.length; i++) {
      if (record[ary2[i]] == 1) {
        ans.push(ary[i])
      }
    }
    return ans
  }

  function xorWith(...args) {
    var f = args.pop()
    f = iteratee(f)
    var ans = []
    var ary = args.reduce((a, b) => a.concat(b))
    for (let i = 0; i < ary.length - 1; i++) {
      var flag = true
      for (let j = i + 1; j < ary.length; j++) {
        if (f(ary[i], ary[j])) {
          flag = false
          break
        }
      }
      if (flag) {
        ans.push(ary[i])
      }
    }
    return ans
  }

  function zipObject(ary1, ary2) {
    var obj = {}
    for (let i = 0; i < ary1.length; i++) {
      if (i < ary2.length) {
        obj[ary1[i]] = ary2[i]
      } else {
        obj[ary1[i]] = undefined
      }
    }
    return obj
  }

  function zipObjectDeep(ary1, ary2) {//真是给我写哭了
    var obj = {}
    for (var i = 0; i < ary1.length; i++) {
      var key = obj
      var path = ary1[i].split('.')
      for (var j = 0; j < path.length - 1; j++) {//最后一个单独判断，前面肯定都是对象
        if (/\[/.test(path[j])) {
          var objname = path[j].slice(0, path[j].indexOf('['))
          if (!(objname in key)) {
            key[objname] = []
          }
          key = key[objname]
          var re = /\d+(?=.*\d)/g
          var temp
          while (temp = re.exec(path[j])) {
            if (Array.isArray(key)) {
              key = key[Number(temp[0])]
            } else {
              key[Number(temp[0])] = []
              key = key[Number(temp[0])]
            }
          }
          re = /\d+(?!.*\d)/g//对于多维数组的特殊处理
          temp = re.exec(path[j])
          if (!(Number(temp[0]) in key)) {
            key[Number(temp[0])] = {}
          }
          key = key[Number(temp[0])]

        } else {
          if (!(path[j] in key)) {
            key[path[j]] = {}
          }
          key = key[path[j]]
        }
      }
      //对最后一个.分隔的单独判断
      if (/\[/.test(path[j])) {
        var objname = path[j].slice(0, path[j].indexOf('['))
        if (!(objname in key)) {
          key[objname] = []
        }
        key = key[objname]
        var re = re = /\d+(?=.*\d)/g
        var temp
        while (temp = re.exec(path[j])) {
          if (Array.isArray(key)) {
            key = key[Number(temp[0])]
          } else {
            key[Number(temp[0])] = []
            key = key[Number(temp[0])]
          }
        }
        re = /\d+(?!.*\d)/g
        temp = re.exec(path[j])
        key[Number(temp[0])] = ary2[i]
      } else {
        key[path[j]] = ary2[i]
      }
    }
    return obj
  }

  function zipWith(...args) {
    var f = args.pop()
    f = iteratee(f)
    var ary = zip(...args)
    var ans = []
    for (let i = 0; i < ary.length; i++) {
      ans.push(f(...ary[i]))
    }
    return ans
  }
  function parseJson(str) {
    var str = new parseJSON(str)
    return str.parseValue()
  }
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

  return {
    'chunk': chunk,
    'compact': compact,
    'uniq': uniq,
    'uniqBy': uniqBy,
    'flatten': flatten,
    'flattenDeep': flattenDeep,
    'flattenDepth': flattenDepth,
    'groupBy': groupBy,
    'keyBy': keyBy,
    'forEach': forEach,
    'map': map,
    'filter': filter,
    'reduce': reduce,
    'zip': zip,
    'unzip': unzip,
    'keys': keys,
    'values': values,
    'every': every,
    'isEqual': isEqual,
    'some': some,
    'sortBy': sortBy,
    'reverse': reverse,
    'countBy': countBy,
    'reduceRight': reduceRight,
    'shuffle': shuffle,
    'isNaN': isNaN,
    'isNull': isNull,
    'isNil': isNil,
    'isUndefined': isUndefined,
    'toArray': toArray,
    'sum': sum,
    'sumBy': sumBy,
    'difference': difference,
    'differenceBy': diffenrenceBy,
    'differenceWith': differenceWith,
    'drop': drop,
    'dropRight': dropRight,
    'dropRightWhile': dropRightWhile,
    'dropWhile': dropWhile,
    'fill': fill,
    'findIndex': findIndex,
    'findLastIndex': findLastIndex,
    'fromPairs': fromPairs,
    'head': head,
    'indexOf': indexOf,
    'initial': initial,
    'intersection': intersection,
    'intersectionBy': intersectionBy,
    'intersectionWith': intersectionWith,
    'join': join,
    'last': last,
    'lastIndexOf': lastIndexOf,
    'nth': nth,
    'pull': pull,
    'pullAll': pullAll,
    'pullAllBy': pullAllBy,
    'pullAllWith': pullAllWith,
    'sortedIndex': sortedIndex,
    'sortedIndexBy': sortedIndexBy,
    'sortedIndexOf': sortedIndexOf,
    'sortedLastIndex': sortedLastIndex,
    'sortedLastIndexBy': sortedLastIndexBy,
    'sortedLastIndexOf': sortedLastIndexOf,
    'sortedUniq': sortedUniq,
    'sortedUniqBy': sortedUniqBy,
    'tail': tail,
    'take': take,
    'takeRight': takeRight,
    'takeRightWhile': takeRightWhile,
    'takeWhile': takeWhile,
    'union': union,
    'unionBy': unionBy,
    'unionWith': unionWith,
    'uniqWith': uniqWith,
    'unzipWith': unzipWith,
    'without': without,
    'xor': xor,
    'xorBy': xorBy,
    'xorWith': xorWith,
    'zipObject': zipObject,
    'zipObjectDeep': zipObjectDeep,
    'zipWith': zipWith,
    'parseJson': parseJson,
  }
}()
