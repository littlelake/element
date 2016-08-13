/*
# Element JS

An easy way for modularization based on jQuery or Zepto.
*/

(function(def) {
    if (typeof jQuery !== 'undefined') {
        this.E = def(jQuery);
    }
    else if (typeof Zepto !== 'undefined') {
        this.E = def(Zepto);
    }
    else if (typeof module !== 'undefined' && typeof require !== 'undefined') {
        module.exports = def(require('jquery'));
    }
})(function($) {
    'use strict';

    var g = {
        _suffixCurrentId: 0,
        styleSuffix: function() {
            this._suffixCurrentId += 1;
            return '__' + this._suffixCurrentId;
        },
        modules: {}
    };

    /**
     * Create an jQuery or Zepto object.
     *
     * @param {string|Element|jQuery|Zepto} desc - An element description. Format: <tagName><.class><#id>, such as 'ul.todo-list#my-list'.
     * @param {Object} [attrs] - The attrs of element.
     * @param {Array} [children] - The children of element.
     * @param {Function} [localCssFn] - The function that make local scope css.
     * @returns {jQuery|Zepto}
     */
    function E(desc, attrs, children, localCssFn) {
        if (typeof desc !== 'string') {
            return $(desc);
        }
        else {
            if (attrs instanceof Array) {
                children = attrs;
                attrs = null;
            }

            var info = parseElementDesc(desc);
            var ele = document.createElement(info.tagName);
            var $ele = $(ele);
            
            if (info.id) {
                $ele.attr('id', info.id);
            }
            if (info.classList) {
                $.each(info.classList, function(i, className) {
                    if (localCssFn) {
                        className = localCssFn(className);
                    }
                    $ele.addClass(className);
                });
            }

            if (attrs) {
                setElementAttrs($ele, attrs, localCssFn);
            }

            if (children) {
                var flatChildren = flatArray(children);
                $ele.append(flatChildren);
            }

            return $ele;
        }
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

        var tagName = res[1];
        if (!tagName) {
            throw new Error('Incorrect tag name in description "' + desc + '"');
        }

        var classStr = res[2];
        var classList;
        if (classStr) {
            classList = $.grep(classStr.split('.'), function(item) {
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
            tagName: tagName,
            classList: classList,
            id: id
        };
    }

    /**
     * Set element attributes.
     *
     * @param {jQuery|Zepto} $ele
     * @param {Object} attrs
     * @param {Function} localCssFn
     * @private
     */
    function setElementAttrs($ele, attrs, localCssFn) {
        if (attrs.data) {
            for (var key in attrs.data) {
                $ele.data(key, attrs.data[key]);
            }
            delete attrs.data;
        }

        if (attrs.css) {
            if (localCssFn) {
                attrs.css = localCssFn(attrs.css);
            }
            $ele.addClass(attrs.css);
            delete attrs.css;
        }

        if (attrs.style) {
            if (typeof attrs.style === 'string') {
                $ele.attr('style', attrs.style);
            }
            else {
                $ele.css(attrs.style);
            }

            delete attrs.style;
        }

        for (var name in attrs) {
            if (name.indexOf('on') === 0) {
                var ev = name.slice(2).toLowerCase();
                $ele.on(ev, attrs[name]);
            }
            else {
                $ele.attr(name, attrs[name]);
            }
        }
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
        $.each(arr, function(i, item) {
            if (item instanceof Array) {
                $.each(item, function(i, subItem) {
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
     * Make a convenient function to define component.
     */
    E.useCss = function(localCssFn) {
        return function(desc, attrs, children) {
            return E(desc, attrs, children, localCssFn);
        };
    };

    /**
     * Create local scope css.
     */
    E.css = function(cssObj, opts) {
        var suffix = g.styleSuffix();
        if (opts && opts.global) {
            suffix = '';
        }
        var rules = parseCss([''], '', suffix, cssObj);

        addCss(rules.join('\n'), opts && opts.global);

        return function(classes) {
            return $.map(classes.split(/\s+/), function(className) {
                return className + suffix;
            }).join(' ');
        };
    };

    // css helper function
    function parseCss(parents, rule, suffix, obj) {
        var res = [];
        var rules = rule.split(/\s*,\s*/); // unwind css rule such as `h1, h2 {}`

        // add suffix if the rule has class
        for (var i = 0; i < rules.length; i++) {
            if (rules[i][0] === '.') {
                rules[i] += suffix;
            }
        }

        // combine parent rules
        var currentRules = [];
        for (var i = 0; i < parents.length; i++) {
            var prefix;
            if (parents[i]) {
                prefix = parents[i] + ' ';
            }
            else {
                prefix = '';
            }

            for (var j = 0; j < rules.length; j++) {
                if (rules[j][0] === '&') {
                    currentRules.push(parents[i] + rules[j].slice(1));
                }
                else {
                    currentRules.push(prefix + rules[j]);
                }
            }
        }

        var ruleContent = '';

        for (var key in obj) {
            var val = obj[key];
            var type = typeof val;
            if (type === 'number' || type === 'boolean' || type === 'string') {
                ruleContent += humpToMinus(key) + ':' + val + ';';
            }
            else if (type === 'object') {
                var subRules = parseCss(currentRules, key, suffix, val);
                res = res.concat(subRules);
            }
        }

        if (ruleContent) {
            res.unshift(currentRules.join(',') + '{' + ruleContent + '}');
        }

        return res;
    }

    function humpToMinus(str) {
        return str.replace(/([A-Z])/g, '-$1').toLowerCase();
    }

    function addCss(css, global) {
        var $style = $('<style type="text/css"></style>');
        try {
            $style.append(css);
        }
        catch (e) {
            // fix ie bug
            $style[0].styleSheet.cssText = css;
        }

        if (global) {
            $style.prependTo('head');
        }
        else {
            $style.appendTo('head');
        }
    }
    // end of css helper


    /**
     * Define a module.
     * @example
     *  E.mod('me.TodoList', [
     *      'me.TodoItem'
     *  ], function(TodoItem) {
     *      // todo
     *  });
     * @param {string} name - module name
     * @param {Array<string>} [deps] - dependencies
     * @param {Function} def - module define function
     */
    E.mod = function(name, deps, def) {
        if (typeof deps === 'function') {
            def = deps;
            deps = [];
        }

        g.modules[name] = {
            deps: deps,
            def: def,
            res: null,
            init: false
        };
    };

    /**
     * Run a module.
     *
     * @param {string} name
     */
    E.run = function run(name) {
        var mod = g.modules[name];
        if (!mod) {
            return;
        }

        if (mod.init) {
            return mod.res;
        }
        else {
            if (mod.deps.length > 0) {
                var deps = $.map(mod.deps, run);
                mod.res = mod.def.apply(null, deps);
                mod.init = true;
            }
            else {
                mod.res = mod.def();
                mod.init = true;
            }
            return mod.res;
        }
    };

    // define method extend
    $.fn.method = function(name, fn) {
        var methods = this.get(0).__methods__;
        if (!methods) {
            methods = {};
            this.get(0).__methods__ = methods;
        }
        if (name && fn) {
            var self = this;
            methods[name] = function() {
                return fn.apply(self, arguments);
            };
        }
        else {
            return methods;
        }
    };

    return E;

});

