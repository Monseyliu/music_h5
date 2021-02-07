// dom 操作相关js
export function addClass(el, className){
    if(hasClass(el, className)) return;
    
    let NewClass = el.className.split(' ');
    NewClass.push(className);
    el.className = NewClass.join(' ');
}
// 类名
export function hasClass(el, className){
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
    return reg.test(el.className)
}

// 属性操作
export function getData(el, name, val) {
    const prefix = 'data-';
    name = prefix + name;
    if(val) {
        return el.setAttribute(name, val);
    } else {
        return el.getAttribute(name)
    }
}

// 封装 transform 相关操作的 JS
let elementStyle = document.createElement('div').style;

let vendor = (() => {
    // 不同浏览器的 transform 属性名
    let transformNames = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform'
    }

    for(let key in transformNames) {
        if(elementStyle[transformNames[key]] !== undefined) {
            return key
        }
    }
    return false 
})()
// 将方法暴露出去
export function prefixStyle (style) {
    if (vendor === false) {
      return false
    }
  
    if (vendor === 'standard') {
      return style
    }
  
    return vendor + style.charAt(0).toUpperCase() + style.substr(1)
  }