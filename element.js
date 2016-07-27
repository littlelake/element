/*
# element.js
Provide minimal but useful functions to manipulating DOM.
*/

;(function(window) {
    'use strict';

    var document = window.document;
    var Element = window.Element;
    var CustomEvent = window.CustomEvent;

    /**
     * AdvancedElement constructor wrap.
     */
    function E(desc, attrs, children) {
        return new AdvancedElement(desc, attrs, children);
    }

    /**
     * @constructor
     * @param {string|Element} desc - An element description. Format: <tagName><.class><#id>, such as 'ul.todo-list#my-list'.
     * @param {Object} [attrs] - The attrs of element.
     * @param {Array} [children] - The children of element.
     * @returns {Element}
     */
    function AdvancedElement(desc, attrs, children) {
        if (desc instanceof Element) {
            this.ele = desc;
        }
        else if (desc[0] === '#') {
            this.ele = document.querySelector(desc);
        }
        else if (desc[0] === '.') {
            this.ele = document.querySelectorAll(desc);
        }
        else {
            this.ele = createElement(desc, attrs, children);
        }
    }

    /**
     * Create an element.
     *
     * @param {string} desc - An element description. Format: <tagName><.class><#id>, such as 'ul.todo-list#my-list'.
     * @param {Object} [attrs] - The attrs of element.
     * @param {Array} [children] - The children of element.
     * @returns {Element}
     * @private
     */
    function createElement(desc, attrs, children) {
        if (attrs instanceof Array) {
            children = attrs;
            attrs = null;
        }

        var info = parseElementDesc(desc);
        var ele = document.createElement(info.name);

        if (info.id) {
            ele.id = info.id;
        }
        if (info.classList) {
            info.classList.forEach(function(cssClass) {
                ele.classList.add(cssClass);
            });
        }

        if (attrs) {
            setElementAttrs(ele, attrs);
        }

        if (children) {
            setElementChildren(ele, children);
        }

        return ele;
    }

    /**
     * Parse element description.
     *
     * @example
     *  var res = parseElementDesc('ul.todo-list.my-list#my-list');
     *  // res should be: {name: 'ul', classList: ['todo-list', 'my-list'], id: 'my-list'}
     *
     * @param {string} desc
     * @returns {Object}
     * @private
     */
    function parseElementDesc(desc) {
        var res = desc.match(/^([\w\d\-]+)((\.[\w\d\-]+)*)(\#[\w\d\-]+)?$/);

        var name = res[1];
        if (!name) {
            throw new Error('Incorrect tag name in description "' + desc + '"');
        }

        var classStr = res[2];
        var classList;
        if (classStr) {
            classList = classStr.split('.').filter(function(item) {
                return /^[\s]*$/.test(item) === false;
            });
        }
        else {
            classList = [];
        }

        var id = res[4];
        if (id) {
            id = id.slice(1);
        }

        return {
            name: name,
            classList: classList,
            id: id
        };
    }

    /**
     * Set element attributes.
     *
     * @param {Element} ele
     * @param {Object} attrs
     * @private
     */
    function setElementAttrs(ele, attrs) {
        if (attrs.data) {
            for (var key in attrs.data) {
                ele.dataset[key] = attrs.data[key];
            }
            delete attrs.data;
        }

        if (attrs.class) {
            attrs.class.split(' ').forEach(function(cssClass) {
                ele.classList.add(cssClass);
            });
            delete attrs.class;
        }

        if (attrs.style && typeof attrs.style === 'object') {
            var styleStr = '';
            for (var key in attrs.style) {
                styleStr += (key + ':' + attrs.style[key] + ';');
            }
            attrs.style = styleStr;
        }

        for (var name in attrs) {
            ele[name] = attrs[name];
        }
    }

    /**
     * Set element children.
     *
     * @param {Element} ele
     * @param {Array} children
     * @private
     */
    function setElementChildren(ele, children) {
        var flatChildren = flatArray(children);
        flatChildren.forEach(function(child) {
            if (typeof child === 'string') {
                ele.appendChild(document.createTextNode(child));
            }
            else if (typeof child === 'number' || typeof child === 'boolean') {
                ele.appendChild(document.createTextNode(child.toString()));
            }
            else if (child instanceof AdvancedElement) {
                ele.appendChild(child.ele);
            }
            else {
                ele.appendChild(child);
            }
        });
    }

    /**
     * Flat array elements.
     *
     * @example
     *  var res = flatArray([1, [2, 3]]);
     *  // res should be: [1, 2, 3]
     * @param {Array} arr
     * @returns {Array}
     * @private
     */
    function flatArray(arr) {
        var res = [];
        arr.forEach(function(item) {
            if (item instanceof Array) {
                item.forEach(function(subItem) {
                    res.push(subItem);
                });
            }
            else {
                res.push(item);
            }
        });
        return res;
    }


    // methods

    /**
     * Replace an element.
     *
     * @example
     *  E('#list').replace(E('ul.my-list'));
     *
     * @param {Element} element
     * @returns {AdvancedElement}
     */
    AdvancedElement.prototype.replace = function(element) {
        this.ele.parentNode.replaceChild(element, this.ele);
        this.ele = element;
        return this;
    };

    /**
     * Remove children.
     *
     * @example
     *  // all li that index lower than 3 will be removed
     *  E('#list').removeChildren(function(li, index) {
     *      return index < 3;
     *  });
     *
     * @param {Function} fn - filter function
     * @returns {AdvancedElement}
     */
    AdvancedElement.prototype.removeChildren = function(fn) {
        var ele = this.ele;
        var removeList = [];
        for (var i = 0; i < ele.children.length; i++) {
            var res = fn(ele.children[i], i);
            if (res) {
                removeList.push(ele.children[i]);
            }
        }

        removeList.forEach(function(child) {
            ele.removeChild(child);
        });

        return this;
    };

    /**
     * Get index of parentNode.
     *
     * @example
     *  E('#item').index();
     * @returns {number}
     */
    AdvancedElement.prototype.index = function() {
        return Array.prototype.indexOf.call(this.ele.parentNode.children, this.ele);
    };

    /**
     * Show element.
     *
     * @example
     *  E('#id').show();
     *  E('#id').show('flex');
     * @param {string} [display] - default value is 'block'
     * @returns {AdvancedElement}
     */
    AdvancedElement.prototype.show = function(display) {
        if (!display) {
            display = 'block';
        }
        this.ele.style.display = display;
        return this;
    };

    /**
     * Hide element.
     *
     * @example
     *  E('#id').hide();
     * @returns {AdvancedElement}
     */
    AdvancedElement.prototype.hide = function() {
        this.ele.style.display = 'none';
        return this;
    };

    /**
     * Emit a custom event.
     *
     * @example
     *  E('#id').emit('window.confirm', 'Delete?', function(res) {
     *      if (res) {
     *          // do something
     *      }
     *  });
     *
     * @param {string} event - event name
     * @param {Any} data
     * @param {Function} callback
     */
    AdvancedElement.prototype.emit = function(event, data, callback) {
        var ev = new CustomEvent(event, {
            detail: {
                data: data,
                callback: callback
            },
            bubbles: true,
            cancelable: true
        });
        this.ele.dispatchEvent(ev);
    };

    /**
     * Add custom event handler.
     *
     * @example
     *  E('#id').on('window.confirm', function(data, callback, e) {
     *      e.stopPropagation();
     *      res = confirm(data);
     *      callback(res);
     *  });
     *
     * @param {string} event - event name
     * @param {Function} handler - event handler
     */
    AdvancedElement.prototype.on = function(event, handler) {
        this.ele.addEventListener(event, function(e) {
            handler(e.detail.data, e.detail.callback, e);
        });
    };

    window.E = E;
    window.AdvancedElement = AdvancedElement;

})(window);