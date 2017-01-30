(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.bore = global.bore || {})));
}(this, (function (exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var _window = window;
var DocumentFragment = _window.DocumentFragment;
var Node = _window.Node;
var Promise$1 = _window.Promise;
var slice = [].slice;


function startsWith(key, val) {
  return key.indexOf(val) === 0;
}

function shouldBeAttr(key, val) {
  return startsWith(key, 'aria-') || startsWith(key, 'data-');
}

function handleFunction(Fn) {
  return Fn.prototype instanceof HTMLElement ? new Fn() : Fn();
}

function h(name, attrs) {
  var node = typeof name === 'function' ? handleFunction(name) : document.createElement(name);
  Object.keys(attrs || []).forEach(function (attr) {
    return shouldBeAttr(attr, attrs[attr]) ? node.setAttribute(attr, attrs[attr]) : node[attr] = attrs[attr];
  });

  for (var _len = arguments.length, chren = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    chren[_key - 2] = arguments[_key];
  }

  chren.forEach(function (child) {
    return node.appendChild(child instanceof Node ? child : document.createTextNode(child));
  });
  return node;
}

var _window2 = window;
var customElements = _window2.customElements;
var HTMLElement = _window2.HTMLElement;
var NodeFilter = _window2.NodeFilter;
var _document = document;
var body = _document.body;
var attachShadow = HTMLElement.prototype.attachShadow;

var diff = require('skatejs-dom-diff').default.diff;

// Ensure we can force sync operations in the polyfill.


if (customElements) {
  customElements.enableFlush = true;
}

// Create and add a fixture to append nodes to.
var fixture = document.createElement('div');
document.body.appendChild(fixture);

// Override to force mode "open" so we can query against all shadow roots.
HTMLElement.prototype.attachShadow = function () {
  return attachShadow.call(this, { mode: 'open' });
};

// Ensures polyfill operations are run sync.
function flush() {
  if (customElements && typeof customElements.flush === 'function') {
    customElements.flush();
  }
}

// Abstraction for browsers not following the spec.
function matches(node, query) {
  return (node.matches || node.msMatchesSelector).call(node, query);
}

var Wrapper = function () {
  function Wrapper(node) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, Wrapper);

    this.opts = opts;

    var isStringNode = typeof node === 'string';
    var isRootNode = !node.parentNode;

    // If the fixture has been removed from the document, re-insert it.
    if (!body.contains(fixture)) {
      body.appendChild(fixture);
    }

    // If this is a new node, clean up the fixture.
    // Add the node to the fixture so it runs the connectedCallback().
    if (isRootNode) {
      fixture.innerHTML = '';

      if (isStringNode) {
        fixture.innerHTML = node;
        this.node = fixture.firstElementChild;
      } else {
        fixture.appendChild(node);
        this.node = node;
      }

      var customElementDefinition = customElements.get(this.node.localName);
      customElementDefinition && flush();
    } else {
      this.node = node;
    }
  }

  createClass(Wrapper, [{
    key: 'all',
    value: function all(query) {
      var _this = this;

      var shadowRoot = this.shadowRoot;

      var temp = [];

      // Custom element constructors
      if (query.prototype instanceof HTMLElement) {
        this.walk(shadowRoot, function (node) {
          return node instanceof query;
        }, function (node) {
          return temp.push(node);
        });
        // Custom filtering function
      } else if (typeof query === 'function') {
        this.walk(shadowRoot, query, function (node) {
          return temp.push(node);
        });
        // Diffing node trees
        //
        // We have to check if the node type is an element rather than checking
        // instanceof because the ShadyDOM polyfill seems to fail the prototype
        // chain lookup.
      } else if (query.nodeType === Node.ELEMENT_NODE) {
        this.walk(shadowRoot, function (node) {
          return diff({ destination: query, source: node, root: true }).length === 0;
        }, function (node) {
          return temp.push(node);
        });
        // Using an object as criteria
      } else if ((typeof query === 'undefined' ? 'undefined' : _typeof(query)) === 'object') {
        var _ret = function () {
          var keys = Object.keys(query);
          if (keys.length === 0) {
            return {
              v: temp
            };
          }
          _this.walk(shadowRoot, function (node) {
            return keys.every(function (key) {
              return node[key] === query[key];
            });
          }, function (node) {
            return temp.push(node);
          });
          // Selector
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      } else if (typeof query === 'string') {
        this.walk(shadowRoot, function (node) {
          return matches(node, query);
        }, function (node) {
          return temp.push(node);
        }, { skip: true });
      }

      return temp.map(function (n) {
        return new Wrapper(n, _this.opts);
      });
    }
  }, {
    key: 'has',
    value: function has(query) {
      return !!this.one(query);
    }
  }, {
    key: 'one',
    value: function one(query) {
      return this.all(query)[0];
    }
  }, {
    key: 'wait',
    value: function wait(func) {
      return this.waitFor(function (wrap) {
        return !!wrap.node.shadowRoot;
      }).then(func);
    }
  }, {
    key: 'waitFor',
    value: function waitFor(func) {
      var _this2 = this;

      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { delay: 1 },
          delay = _ref.delay;

      return new Promise$1(function (resolve, reject) {
        var check = function check() {
          var ret = function () {
            try {
              return func(_this2);
            } catch (e) {
              reject(e);
            }
          }();
          if (ret) {
            resolve(_this2);
          } else {
            setTimeout(check, delay);
          }
        };
        setTimeout(check, delay);
      }).catch(function (e) {
        throw e;
      });
    }
  }, {
    key: 'walk',
    value: function walk(node, query, callback) {
      var _this3 = this;

      var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { root: false, skip: false };

      // The ShadyDOM polyfill creates a shadow root that is a <div /> but is an
      // instanceof a DocumentFragment. For some reason a tree walker can't
      // traverse it, so we must traverse each child. Due to this implementation
      // detail, we must also tell the walker to include the root node, which it
      // doesn't do with the default implementation.
      if (node instanceof DocumentFragment) {
        slice.call(node.children).forEach(function (child) {
          _this3.walk(child, query, callback, {
            root: true,
            skip: opts.skip
          });
        });
        return;
      }

      var acceptNode = function acceptNode(node) {
        return query(node) ? NodeFilter.FILTER_ACCEPT : opts.skip ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_REJECT;
      };

      // IE requires a function, standards compliant browsers require an object.
      acceptNode.acceptNode = acceptNode;

      // Last argument here is for IE.
      var tree = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, acceptNode, true);

      // Include the main node.
      if (opts.root && query(node)) {
        callback(node);
      }

      // Call user callback for each node.
      while (tree.nextNode()) {
        callback(tree.currentNode);
      }
    }
  }, {
    key: 'shadowRoot',
    get: function get() {
      var node = this.node;

      return node.shadowRoot || node;
    }
  }]);
  return Wrapper;
}();

function mount(elem) {
  return new Wrapper(elem);
}

exports.h = h;
exports.mount = mount;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
