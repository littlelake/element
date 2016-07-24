/*
# element.js
Provide minimal but useful functions to manipulating DOM.
*/

;(function(window) {
    'use strict';

    var document = window.document;

    /**
     * Create an element
     *
     * @param {string} desc - An element description. Format: <tagName><.class><#id>, such as 'ul.todo-list#my-list'.
     * @param {Object} [attrs] - The attrs of element.
     * @param {Array} [children] - The children of element.
     * @returns {Element}
     */
    function E(desc, attrs, children) {
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

    /**
     * Get element by id or return element directly.
     *
     * @param {Element|string} idOrEle - id or element
     * @returns {Element}
     * @private
     */
    function getElement(idOrEle) {
        if (idOrEle instanceof Element) {
            return idOrEle;
        }
        else {
            return document.getElementById(idOrEle);
        }
    }

    /**
     * Utils
     *
     * Provide useful functions to manipulating DOM.
     */
    var Utils = {

        /**
         * Replace an element.
         *
         * @example
         *  replace('list', E('ul.my-list'));
         *
         * @param {Element|string} idOrEle
         * @param {Element} element
         */
        replace: function(idOrEle, element) {
            var ele = getElement(idOrEle);
            ele.parentNode.replaceChild(element, ele);
        },

        /**
         * Remove children.
         *
         * @example
         *  // all li that index lower than 3 will be removed
         *  removeChildren('list', function(li, index) {
         *      return index < 3;
         *  });
         * @param {Element|string} idOrEle
         * @param {Function} fn - filter function
         */
        removeChildren: function(idOrEle, fn) {
            var ele = getElement(idOrEle);
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
        },

        /**
         * Get index of parentNode.
         *
         * @example
         *  indexOf('list', li);
         * @param {Element|string} idOrEle - parent node
         * @param {Element} child
         * @return {number}
         */
        indexOf: function(idOrEle, child) {
            var ele = getElement(idOrEle);
            return Array.prototype.indexOf.call(ele.children, child);
        },

        /**
         * Show element(s).
         *
         * @example
         *  show(eleC);
         *  show('flex', [eleA, eleB]);
         * @param {string} [display] - default value is 'block'
         * @param {Array|HTMLCollection|Element} - the element(s) to show
         */
        show: function(display, collection) {
            if (typeof display !== 'string') {
                collection = display;
                display = 'block';
            }

            if (collection instanceof Element) {
                collection = [collection];
            }

            for (var i = 0; i < collection.length; i++) {
                collection[i].style.display = display;
            }
        },

        /**
         * Hide element(s).
         *
         * @example
         *  hide(eleC);
         *  hide([eleA, eleB]);
         * @param {Array|HTMLCollection|Element} - the element(s) to hide
         */
        hide: function(collection) {
            if (collection instanceof Element) {
                collection = [collection];
            }

            for (var i = 0; i < collection.length; i++) {
                collection[i].style.display = 'none';
            }
        }
    };

    for (var methodName in Utils) {
        E[methodName] = Utils[methodName];
    }

    window.E = E;

})(window);