// dom 操作相关js
export function addClass(el, className){
    if(hasClass(el, className)) return;
    
    let NewClass = el.className.split(' ');
    NewClass.push(className);
    el.className = NewClass.join(' ');
}

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