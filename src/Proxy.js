// Generated by CoffeeScript 2.5.0
(function() {
  /*
   * 动态代理
   * 通过传入目标对象实例化代理类
   * 外部通过该代理间接访问目标对象
   * 我们可以通过该代理来规范外部的访问、提供安全的调用、丰富目标对象的行为
   * 通常我们需要通过继承该类来制定不同类型的对象的代理，否则外部访问与直接访问目标对象无异
   * 鉴于javaScript弱类型的特征，建议在子类中做类型限制，使代理模块化
   */
  var Proxy;

  Proxy = class Proxy {
    constructor(target1, security) {
      this.target = target1;
      if (this.target) {
        this.instance(this.target, security);
      }
    }

    /*
     * 实例化代理过程
     * 通过遍历目标对象以及递归原型链，对目标对象的行为进行封装
     * 默认地，只对目标对象的行为进行封装代理，如果你需要代理目标对象的属性或更多的功能，可以覆盖该过程
     * 安全模式下，理论上目标对象为只读状态
     * @param target 目标对象
     * @param private 是否安全模式
     * @return null
     */
    instance(target, security = false) {
      var get_key, i, key, len, ref;
      ref = Object.getOwnPropertyNames(target);
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        if (key !== "constructor") {
          if (typeof target[key] === "function") {
            if (!this.hasOwnProperty(key)) {
              this[key] = this.proxy(target[key]);
            }
          } else {
            if (security) {
              get_key = `get${key.substring(0, 1).toUpperCase()}${key.substring(1)}`;
              if (!this.hasOwnProperty(get_key)) {
                (function() {
                  var temp_k;
                  temp_k = key;
                  return this[get_key] = function() {
                    return target[temp_k];
                  };
                }).call(this);
              }
            } else if (!this.hasOwnProperty(key)) {
              this[key] = target[key];
              if (typeof target[key] !== "object") {
                (function() {
                  var temp_k, temp_v;
                  temp_k = key;
                  temp_v = target[key];
                  return Object.defineProperty(this, temp_k, {
                    set: function(val) {
                      target[temp_k] = val;
                      return temp_v = val;
                    },
                    get: function() {
                      return temp_v;
                    }
                  });
                }).call(this);
              }
            }
          }
        }
      }
      if (target.__proto__ && target.__proto__ !== Object.prototype) {
        return this.instance(target.__proto__);
      }
    }

    /*
     * 目标对象行为的封装
     * 默认地除了目标对象行为，不做其他操作
     * 你需要在子类中覆盖该方法，制定需要类型的对象行为封装
     * @param f 目标对象行为
     * @return 目标对象封装后的行为
     */
    proxy(f) {
      var that;
      that = this;
      return function() {
        var e;
        try {
          return f.apply(that.target, arguments);
        } catch (error) {
          e = error;
          return LOG.error(e.stack);
        }
      };
    }

  };

  module.exports = Proxy;

}).call(this);