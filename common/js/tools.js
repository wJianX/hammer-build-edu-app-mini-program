function replaceAll(str,reallyDo, replaceWith) {
    if (!str || str.length <= 0) {
        return '';
    }
    return str.replace(new RegExp(reallyDo, "gm"), replaceWith);
}
function containValue(str1, str2) {
    if (str1 == undefined)  return false;
    return str1.indexOf(str2) >= 0; 
}
function find(func) {
	for (var i = 0; i < this.length; i++) {
		if (func(this[i], i) == true) {
			return this[i];
		}
	}
}
function Format() {
    if (arguments.length == 0)
        return null;
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        var value = arguments[i] ? arguments[i].toString() : '';
        if (str) {
            str = str.replace(re, value);
        }
    }
    return str;
};
function isEmptyOrNUll(){
	if (arguments.length == 0)
		return true;
	var v = arguments[0];
	if (v == undefined) return true;
	if ((v + "").length <= 0) return true
	return false;
};


/**
 * 函数防抖 (只执行最后一次点击)
 * @param fn
 * @param delay
 * @returns {Function}
 * @constructor
 */
const _debounce = (fn, t) => {
    let delay = t || 500;
    let timer;
    return function () {
        let args = arguments;
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = null;
            fn.apply(this, args);
        }, delay);
    }
};
 
 
/**
 * 函数节流
 * @param fn
 * @param interval
 * @returns {Function}
 * @constructor
 */
const _throttle = (fn, t) => {
    let last;
    let timer;
    let interval = t || 500;
    return function () {
        let args = arguments;
        let now = +new Date();
        if (last && now - last < interval) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                last = now;
                fn.apply(this, args);
            }, interval);
        } else {
            last = now;
            fn.apply(this, args);
        }
    }
};

/**
 * 公共跳转函数
 * @param 
 * @returns {Function}
 * @constructor
 */
const _publicJumpTab = (param) => {
	return uni.switchTab({ url: param })
}

module.exports = {
	replaceAll,
	containValue,
	find,
	Format,
	isEmptyOrNUll,
	_debounce,
	_throttle,
	_publicJumpTab
}