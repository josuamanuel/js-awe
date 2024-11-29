let myGlobal = typeof globalThis !== undefined ? globalThis : typeof window !== undefined ? window : typeof global !== undefined ? global : typeof self !== undefined ? self : typeof this !== undefined ? this : {}
let performance = myGlobal.performance
if(performance === undefined) performance = {}

const dict = {
  upperLetters: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
  lowerLetters: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
  numbers: [0,1,2,3,4,5,6,7,8,9]
};

function anonymize(toAnonymize)
{
  let changes = 0;
  const result = toAnonymize
    .split('')
    .map(char => {
      let toReturn;
      const type = getTypeDict(char);

      if(type)
        toReturn = type[getRandomInt(type.length -1)];
      else toReturn = char;

      if(toReturn !== char) changes++;
      return toReturn
    })
    .join('');

  if(changes < toAnonymize.length/2) return Array.from({length: result.length}).fill('*').join('')
  
  return result
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getTypeDict(char)
{
  const type = char.charCodeAt();

  if( type > 47 && type < 58 ) return dict.numbers
  if( type > 64 && type < 91 ) return dict.upperLetters 
  if( type > 96 && type < 123 ) return dict.lowerLetters

  return undefined
}

var collectionClone = clone$1;

/*
  Deep clones all properties except functions

  var arr = [1, 2, 3];
  var subObj = {aa: 1};
  var obj = {a: 3, b: 5, c: arr, d: subObj};
  var objClone = clone(obj);
  arr.push(4);
  subObj.bb = 2;
  obj; // {a: 3, b: 5, c: [1, 2, 3, 4], d: {aa: 1}}
  objClone; // {a: 3, b: 5, c: [1, 2, 3], d: {aa: 1, bb: 2}}
*/

function clone$1(obj) {
  let result = obj;
  var type = {}.toString.call(obj).slice(8, -1);
  if (type == 'Set') {
    return new Set([...obj].map(value => clone$1(value)));
  }
  if (type == 'Map') {
    return new Map([...obj].map(kv => [clone$1(kv[0]), clone$1(kv[1])]));
  }
  if (type == 'Date') {
    return new Date(obj.getTime());
  }
  if (type == 'RegExp') {
    return RegExp(obj.source, getRegExpFlags(obj));
  }
  if (type == 'Array' || type == 'Object') {
    result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
      // include prototype properties
      result[key] = clone$1(obj[key]);
    }
  }
  // primitives and non-supported objects (e.g. functions) land here
  return result;
}

function getRegExpFlags(regExp) {
  if (typeof regExp.source.flags == 'string') {
    return regExp.source.flags;
  } else {
    var flags = [];
    regExp.global && flags.push('g');
    regExp.ignoreCase && flags.push('i');
    regExp.multiline && flags.push('m');
    regExp.sticky && flags.push('y');
    regExp.unicode && flags.push('u');
    return flags.join('');
  }
}

var global$1 = (typeof global !== "undefined" ? global :
  typeof self !== "undefined" ? self :
  typeof window !== "undefined" ? window : {});

/*
from https://github.com/substack/vm-browserify/blob/bfd7c5f59edec856dc7efe0b77a4f6b2fa20f226/index.js

MIT license no Copyright holder mentioned
*/


function Object_keys(obj) {
  if (Object.keys) return Object.keys(obj)
  else {
    var res = [];
    for (var key in obj) res.push(key);
    return res;
  }
}

function forEach$1(xs, fn) {
  if (xs.forEach) return xs.forEach(fn)
  else
    for (var i = 0; i < xs.length; i++) {
      fn(xs[i], i, xs);
    }
}
var _defineProp;

function defineProp(obj, name, value) {
  if (typeof _defineProp !== 'function') {
    _defineProp = createDefineProp;
  }
  _defineProp(obj, name, value);
}

function createDefineProp() {
  try {
    Object.defineProperty({}, '_', {});
    return function(obj, name, value) {
      Object.defineProperty(obj, name, {
        writable: true,
        enumerable: false,
        configurable: true,
        value: value
      });
    };
  } catch (e) {
    return function(obj, name, value) {
      obj[name] = value;
    };
  }
}

var globals = ['Array', 'Boolean', 'Date', 'Error', 'EvalError', 'Function',
  'Infinity', 'JSON', 'Math', 'NaN', 'Number', 'Object', 'RangeError',
  'ReferenceError', 'RegExp', 'String', 'SyntaxError', 'TypeError', 'URIError',
  'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape',
  'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'undefined', 'unescape'
];

function Context() {}
Context.prototype = {};

function Script(code) {
  if (!(this instanceof Script)) return new Script(code);
  this.code = code;
}
function otherRunInContext(code, context) {
  var args = Object_keys(global$1);
  args.push('with (this.__ctx__){return eval(this.__code__)}');
  var fn = Function.apply(null, args);
  return fn.apply({
    __code__: code,
    __ctx__: context
  });
}
Script.prototype.runInContext = function(context) {
  if (!(context instanceof Context)) {
    throw new TypeError('needs a \'context\' argument.');
  }
  if (global$1.document) {
    var iframe = global$1.document.createElement('iframe');
    if (!iframe.style) iframe.style = {};
    iframe.style.display = 'none';

    global$1.document.body.appendChild(iframe);

    var win = iframe.contentWindow;
    var wEval = win.eval,
      wExecScript = win.execScript;

    if (!wEval && wExecScript) {
      // win.eval() magically appears when this is called in IE:
      wExecScript.call(win, 'null');
      wEval = win.eval;
    }

    forEach$1(Object_keys(context), function(key) {
      win[key] = context[key];
    });
    forEach$1(globals, function(key) {
      if (context[key]) {
        win[key] = context[key];
      }
    });

    var winKeys = Object_keys(win);

    var res = wEval.call(win, this.code);

    forEach$1(Object_keys(win), function(key) {
      // Avoid copying circular objects like `top` and `window` by only
      // updating existing context properties or new properties in the `win`
      // that was only introduced after the eval.
      if (key in context || indexOf$1(winKeys, key) === -1) {
        context[key] = win[key];
      }
    });

    forEach$1(globals, function(key) {
      if (!(key in context)) {
        defineProp(context, key, win[key]);
      }
    });
    global$1.document.body.removeChild(iframe);

    return res;
  }
  return otherRunInContext(this.code, context);
};

Script.prototype.runInThisContext = function() {
  var fn = new Function('code', 'return eval(code);');
  return fn.call(global$1, this.code); // maybe...
};

Script.prototype.runInNewContext = function(context) {
  var ctx = createContext(context);
  var res = this.runInContext(ctx);
  if (context) {
    forEach$1(Object_keys(ctx), function(key) {
      context[key] = ctx[key];
    });
  }

  return res;
};


function createScript(code) {
  return new Script(code);
}

function createContext(context) {
  if (isContext(context)) {
    return context;
  }
  var copy = new Context();
  if (typeof context === 'object') {
    forEach$1(Object_keys(context), function(key) {
      copy[key] = context[key];
    });
  }
  return copy;
}
function runInContext(code, contextifiedSandbox, options) {
  var script = new Script(code);
  return script.runInContext(contextifiedSandbox, options);
}
function runInThisContext(code, options) {
  var script = new Script(code);
  return script.runInThisContext(options);
}
function isContext(context) {
  return context instanceof Context;
}
function runInNewContext(code, sandbox, options) {
  var script = new Script(code);
  return script.runInNewContext(sandbox, options);
}
var vm = {
  runInContext: runInContext,
  isContext: isContext,
  createContext: createContext,
  createScript: createScript,
  Script: Script,
  runInThisContext: runInThisContext,
  runInNewContext: runInNewContext
};


/*
from indexOf
@ author tjholowaychuk
@ license MIT
*/
var _indexOf$1 = [].indexOf;

function indexOf$1(arr, obj){
  if (_indexOf$1) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
}

/**
 * @implements {IHooks}
 */
class Hooks {
  /**
   * @callback HookCallback
   * @this {*|Jsep} this
   * @param {Jsep} env
   * @returns: void
   */
  /**
   * Adds the given callback to the list of callbacks for the given hook.
   *
   * The callback will be invoked when the hook it is registered for is run.
   *
   * One callback function can be registered to multiple hooks and the same hook multiple times.
   *
   * @param {string|object} name The name of the hook, or an object of callbacks keyed by name
   * @param {HookCallback|boolean} callback The callback function which is given environment variables.
   * @param {?boolean} [first=false] Will add the hook to the top of the list (defaults to the bottom)
   * @public
   */
  add(name, callback, first) {
    if (typeof arguments[0] != 'string') {
      // Multiple hook callbacks, keyed by name
      for (let name in arguments[0]) {
        this.add(name, arguments[0][name], arguments[1]);
      }
    } else {
      (Array.isArray(name) ? name : [name]).forEach(function (name) {
        this[name] = this[name] || [];
        if (callback) {
          this[name][first ? 'unshift' : 'push'](callback);
        }
      }, this);
    }
  }

  /**
   * Runs a hook invoking all registered callbacks with the given environment variables.
   *
   * Callbacks will be invoked synchronously and in the order in which they were registered.
   *
   * @param {string} name The name of the hook.
   * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
   * @public
   */
  run(name, env) {
    this[name] = this[name] || [];
    this[name].forEach(function (callback) {
      callback.call(env && env.context ? env.context : env, env);
    });
  }
}

/**
 * @implements {IPlugins}
 */
class Plugins {
  constructor(jsep) {
    this.jsep = jsep;
    this.registered = {};
  }

  /**
   * @callback PluginSetup
   * @this {Jsep} jsep
   * @returns: void
   */
  /**
   * Adds the given plugin(s) to the registry
   *
   * @param {object} plugins
   * @param {string} plugins.name The name of the plugin
   * @param {PluginSetup} plugins.init The init function
   * @public
   */
  register(...plugins) {
    plugins.forEach(plugin => {
      if (typeof plugin !== 'object' || !plugin.name || !plugin.init) {
        throw new Error('Invalid JSEP plugin format');
      }
      if (this.registered[plugin.name]) {
        // already registered. Ignore.
        return;
      }
      plugin.init(this.jsep);
      this.registered[plugin.name] = plugin;
    });
  }
}

//     JavaScript Expression Parser (JSEP) 1.4.0

class Jsep {
  /**
   * @returns {string}
   */
  static get version() {
    // To be filled in by the template
    return '1.4.0';
  }

  /**
   * @returns {string}
   */
  static toString() {
    return 'JavaScript Expression Parser (JSEP) v' + Jsep.version;
  }
  // ==================== CONFIG ================================
  /**
   * @method addUnaryOp
   * @param {string} op_name The name of the unary op to add
   * @returns {Jsep}
   */
  static addUnaryOp(op_name) {
    Jsep.max_unop_len = Math.max(op_name.length, Jsep.max_unop_len);
    Jsep.unary_ops[op_name] = 1;
    return Jsep;
  }

  /**
   * @method jsep.addBinaryOp
   * @param {string} op_name The name of the binary op to add
   * @param {number} precedence The precedence of the binary op (can be a float). Higher number = higher precedence
   * @param {boolean} [isRightAssociative=false] whether operator is right-associative
   * @returns {Jsep}
   */
  static addBinaryOp(op_name, precedence, isRightAssociative) {
    Jsep.max_binop_len = Math.max(op_name.length, Jsep.max_binop_len);
    Jsep.binary_ops[op_name] = precedence;
    if (isRightAssociative) {
      Jsep.right_associative.add(op_name);
    } else {
      Jsep.right_associative.delete(op_name);
    }
    return Jsep;
  }

  /**
   * @method addIdentifierChar
   * @param {string} char The additional character to treat as a valid part of an identifier
   * @returns {Jsep}
   */
  static addIdentifierChar(char) {
    Jsep.additional_identifier_chars.add(char);
    return Jsep;
  }

  /**
   * @method addLiteral
   * @param {string} literal_name The name of the literal to add
   * @param {*} literal_value The value of the literal
   * @returns {Jsep}
   */
  static addLiteral(literal_name, literal_value) {
    Jsep.literals[literal_name] = literal_value;
    return Jsep;
  }

  /**
   * @method removeUnaryOp
   * @param {string} op_name The name of the unary op to remove
   * @returns {Jsep}
   */
  static removeUnaryOp(op_name) {
    delete Jsep.unary_ops[op_name];
    if (op_name.length === Jsep.max_unop_len) {
      Jsep.max_unop_len = Jsep.getMaxKeyLen(Jsep.unary_ops);
    }
    return Jsep;
  }

  /**
   * @method removeAllUnaryOps
   * @returns {Jsep}
   */
  static removeAllUnaryOps() {
    Jsep.unary_ops = {};
    Jsep.max_unop_len = 0;
    return Jsep;
  }

  /**
   * @method removeIdentifierChar
   * @param {string} char The additional character to stop treating as a valid part of an identifier
   * @returns {Jsep}
   */
  static removeIdentifierChar(char) {
    Jsep.additional_identifier_chars.delete(char);
    return Jsep;
  }

  /**
   * @method removeBinaryOp
   * @param {string} op_name The name of the binary op to remove
   * @returns {Jsep}
   */
  static removeBinaryOp(op_name) {
    delete Jsep.binary_ops[op_name];
    if (op_name.length === Jsep.max_binop_len) {
      Jsep.max_binop_len = Jsep.getMaxKeyLen(Jsep.binary_ops);
    }
    Jsep.right_associative.delete(op_name);
    return Jsep;
  }

  /**
   * @method removeAllBinaryOps
   * @returns {Jsep}
   */
  static removeAllBinaryOps() {
    Jsep.binary_ops = {};
    Jsep.max_binop_len = 0;
    return Jsep;
  }

  /**
   * @method removeLiteral
   * @param {string} literal_name The name of the literal to remove
   * @returns {Jsep}
   */
  static removeLiteral(literal_name) {
    delete Jsep.literals[literal_name];
    return Jsep;
  }

  /**
   * @method removeAllLiterals
   * @returns {Jsep}
   */
  static removeAllLiterals() {
    Jsep.literals = {};
    return Jsep;
  }
  // ==================== END CONFIG ============================

  /**
   * @returns {string}
   */
  get char() {
    return this.expr.charAt(this.index);
  }

  /**
   * @returns {number}
   */
  get code() {
    return this.expr.charCodeAt(this.index);
  }
  /**
   * @param {string} expr a string with the passed in express
   * @returns Jsep
   */
  constructor(expr) {
    // `index` stores the character number we are currently at
    // All of the gobbles below will modify `index` as we move along
    this.expr = expr;
    this.index = 0;
  }

  /**
   * static top-level parser
   * @returns {jsep.Expression}
   */
  static parse(expr) {
    return new Jsep(expr).parse();
  }

  /**
   * Get the longest key length of any object
   * @param {object} obj
   * @returns {number}
   */
  static getMaxKeyLen(obj) {
    return Math.max(0, ...Object.keys(obj).map(k => k.length));
  }

  /**
   * `ch` is a character code in the next three functions
   * @param {number} ch
   * @returns {boolean}
   */
  static isDecimalDigit(ch) {
    return ch >= 48 && ch <= 57; // 0...9
  }

  /**
   * Returns the precedence of a binary operator or `0` if it isn't a binary operator. Can be float.
   * @param {string} op_val
   * @returns {number}
   */
  static binaryPrecedence(op_val) {
    return Jsep.binary_ops[op_val] || 0;
  }

  /**
   * Looks for start of identifier
   * @param {number} ch
   * @returns {boolean}
   */
  static isIdentifierStart(ch) {
    return ch >= 65 && ch <= 90 ||
    // A...Z
    ch >= 97 && ch <= 122 ||
    // a...z
    ch >= 128 && !Jsep.binary_ops[String.fromCharCode(ch)] ||
    // any non-ASCII that is not an operator
    Jsep.additional_identifier_chars.has(String.fromCharCode(ch)); // additional characters
  }

  /**
   * @param {number} ch
   * @returns {boolean}
   */
  static isIdentifierPart(ch) {
    return Jsep.isIdentifierStart(ch) || Jsep.isDecimalDigit(ch);
  }

  /**
   * throw error at index of the expression
   * @param {string} message
   * @throws
   */
  throwError(message) {
    const error = new Error(message + ' at character ' + this.index);
    error.index = this.index;
    error.description = message;
    throw error;
  }

  /**
   * Run a given hook
   * @param {string} name
   * @param {jsep.Expression|false} [node]
   * @returns {?jsep.Expression}
   */
  runHook(name, node) {
    if (Jsep.hooks[name]) {
      const env = {
        context: this,
        node
      };
      Jsep.hooks.run(name, env);
      return env.node;
    }
    return node;
  }

  /**
   * Runs a given hook until one returns a node
   * @param {string} name
   * @returns {?jsep.Expression}
   */
  searchHook(name) {
    if (Jsep.hooks[name]) {
      const env = {
        context: this
      };
      Jsep.hooks[name].find(function (callback) {
        callback.call(env.context, env);
        return env.node;
      });
      return env.node;
    }
  }

  /**
   * Push `index` up to the next non-space character
   */
  gobbleSpaces() {
    let ch = this.code;
    // Whitespace
    while (ch === Jsep.SPACE_CODE || ch === Jsep.TAB_CODE || ch === Jsep.LF_CODE || ch === Jsep.CR_CODE) {
      ch = this.expr.charCodeAt(++this.index);
    }
    this.runHook('gobble-spaces');
  }

  /**
   * Top-level method to parse all expressions and returns compound or single node
   * @returns {jsep.Expression}
   */
  parse() {
    this.runHook('before-all');
    const nodes = this.gobbleExpressions();

    // If there's only one expression just try returning the expression
    const node = nodes.length === 1 ? nodes[0] : {
      type: Jsep.COMPOUND,
      body: nodes
    };
    return this.runHook('after-all', node);
  }

  /**
   * top-level parser (but can be reused within as well)
   * @param {number} [untilICode]
   * @returns {jsep.Expression[]}
   */
  gobbleExpressions(untilICode) {
    let nodes = [],
      ch_i,
      node;
    while (this.index < this.expr.length) {
      ch_i = this.code;

      // Expressions can be separated by semicolons, commas, or just inferred without any
      // separators
      if (ch_i === Jsep.SEMCOL_CODE || ch_i === Jsep.COMMA_CODE) {
        this.index++; // ignore separators
      } else {
        // Try to gobble each expression individually
        if (node = this.gobbleExpression()) {
          nodes.push(node);
          // If we weren't able to find a binary expression and are out of room, then
          // the expression passed in probably has too much
        } else if (this.index < this.expr.length) {
          if (ch_i === untilICode) {
            break;
          }
          this.throwError('Unexpected "' + this.char + '"');
        }
      }
    }
    return nodes;
  }

  /**
   * The main parsing function.
   * @returns {?jsep.Expression}
   */
  gobbleExpression() {
    const node = this.searchHook('gobble-expression') || this.gobbleBinaryExpression();
    this.gobbleSpaces();
    return this.runHook('after-expression', node);
  }

  /**
   * Search for the operation portion of the string (e.g. `+`, `===`)
   * Start by taking the longest possible binary operations (3 characters: `===`, `!==`, `>>>`)
   * and move down from 3 to 2 to 1 character until a matching binary operation is found
   * then, return that binary operation
   * @returns {string|boolean}
   */
  gobbleBinaryOp() {
    this.gobbleSpaces();
    let to_check = this.expr.substr(this.index, Jsep.max_binop_len);
    let tc_len = to_check.length;
    while (tc_len > 0) {
      // Don't accept a binary op when it is an identifier.
      // Binary ops that start with a identifier-valid character must be followed
      // by a non identifier-part valid character
      if (Jsep.binary_ops.hasOwnProperty(to_check) && (!Jsep.isIdentifierStart(this.code) || this.index + to_check.length < this.expr.length && !Jsep.isIdentifierPart(this.expr.charCodeAt(this.index + to_check.length)))) {
        this.index += tc_len;
        return to_check;
      }
      to_check = to_check.substr(0, --tc_len);
    }
    return false;
  }

  /**
   * This function is responsible for gobbling an individual expression,
   * e.g. `1`, `1+2`, `a+(b*2)-Math.sqrt(2)`
   * @returns {?jsep.BinaryExpression}
   */
  gobbleBinaryExpression() {
    let node, biop, prec, stack, biop_info, left, right, i, cur_biop;

    // First, try to get the leftmost thing
    // Then, check to see if there's a binary operator operating on that leftmost thing
    // Don't gobbleBinaryOp without a left-hand-side
    left = this.gobbleToken();
    if (!left) {
      return left;
    }
    biop = this.gobbleBinaryOp();

    // If there wasn't a binary operator, just return the leftmost node
    if (!biop) {
      return left;
    }

    // Otherwise, we need to start a stack to properly place the binary operations in their
    // precedence structure
    biop_info = {
      value: biop,
      prec: Jsep.binaryPrecedence(biop),
      right_a: Jsep.right_associative.has(biop)
    };
    right = this.gobbleToken();
    if (!right) {
      this.throwError("Expected expression after " + biop);
    }
    stack = [left, biop_info, right];

    // Properly deal with precedence using [recursive descent](http://www.engr.mun.ca/~theo/Misc/exp_parsing.htm)
    while (biop = this.gobbleBinaryOp()) {
      prec = Jsep.binaryPrecedence(biop);
      if (prec === 0) {
        this.index -= biop.length;
        break;
      }
      biop_info = {
        value: biop,
        prec,
        right_a: Jsep.right_associative.has(biop)
      };
      cur_biop = biop;

      // Reduce: make a binary expression from the three topmost entries.
      const comparePrev = prev => biop_info.right_a && prev.right_a ? prec > prev.prec : prec <= prev.prec;
      while (stack.length > 2 && comparePrev(stack[stack.length - 2])) {
        right = stack.pop();
        biop = stack.pop().value;
        left = stack.pop();
        node = {
          type: Jsep.BINARY_EXP,
          operator: biop,
          left,
          right
        };
        stack.push(node);
      }
      node = this.gobbleToken();
      if (!node) {
        this.throwError("Expected expression after " + cur_biop);
      }
      stack.push(biop_info, node);
    }
    i = stack.length - 1;
    node = stack[i];
    while (i > 1) {
      node = {
        type: Jsep.BINARY_EXP,
        operator: stack[i - 1].value,
        left: stack[i - 2],
        right: node
      };
      i -= 2;
    }
    return node;
  }

  /**
   * An individual part of a binary expression:
   * e.g. `foo.bar(baz)`, `1`, `"abc"`, `(a % 2)` (because it's in parenthesis)
   * @returns {boolean|jsep.Expression}
   */
  gobbleToken() {
    let ch, to_check, tc_len, node;
    this.gobbleSpaces();
    node = this.searchHook('gobble-token');
    if (node) {
      return this.runHook('after-token', node);
    }
    ch = this.code;
    if (Jsep.isDecimalDigit(ch) || ch === Jsep.PERIOD_CODE) {
      // Char code 46 is a dot `.` which can start off a numeric literal
      return this.gobbleNumericLiteral();
    }
    if (ch === Jsep.SQUOTE_CODE || ch === Jsep.DQUOTE_CODE) {
      // Single or double quotes
      node = this.gobbleStringLiteral();
    } else if (ch === Jsep.OBRACK_CODE) {
      node = this.gobbleArray();
    } else {
      to_check = this.expr.substr(this.index, Jsep.max_unop_len);
      tc_len = to_check.length;
      while (tc_len > 0) {
        // Don't accept an unary op when it is an identifier.
        // Unary ops that start with a identifier-valid character must be followed
        // by a non identifier-part valid character
        if (Jsep.unary_ops.hasOwnProperty(to_check) && (!Jsep.isIdentifierStart(this.code) || this.index + to_check.length < this.expr.length && !Jsep.isIdentifierPart(this.expr.charCodeAt(this.index + to_check.length)))) {
          this.index += tc_len;
          const argument = this.gobbleToken();
          if (!argument) {
            this.throwError('missing unaryOp argument');
          }
          return this.runHook('after-token', {
            type: Jsep.UNARY_EXP,
            operator: to_check,
            argument,
            prefix: true
          });
        }
        to_check = to_check.substr(0, --tc_len);
      }
      if (Jsep.isIdentifierStart(ch)) {
        node = this.gobbleIdentifier();
        if (Jsep.literals.hasOwnProperty(node.name)) {
          node = {
            type: Jsep.LITERAL,
            value: Jsep.literals[node.name],
            raw: node.name
          };
        } else if (node.name === Jsep.this_str) {
          node = {
            type: Jsep.THIS_EXP
          };
        }
      } else if (ch === Jsep.OPAREN_CODE) {
        // open parenthesis
        node = this.gobbleGroup();
      }
    }
    if (!node) {
      return this.runHook('after-token', false);
    }
    node = this.gobbleTokenProperty(node);
    return this.runHook('after-token', node);
  }

  /**
   * Gobble properties of of identifiers/strings/arrays/groups.
   * e.g. `foo`, `bar.baz`, `foo['bar'].baz`
   * It also gobbles function calls:
   * e.g. `Math.acos(obj.angle)`
   * @param {jsep.Expression} node
   * @returns {jsep.Expression}
   */
  gobbleTokenProperty(node) {
    this.gobbleSpaces();
    let ch = this.code;
    while (ch === Jsep.PERIOD_CODE || ch === Jsep.OBRACK_CODE || ch === Jsep.OPAREN_CODE || ch === Jsep.QUMARK_CODE) {
      let optional;
      if (ch === Jsep.QUMARK_CODE) {
        if (this.expr.charCodeAt(this.index + 1) !== Jsep.PERIOD_CODE) {
          break;
        }
        optional = true;
        this.index += 2;
        this.gobbleSpaces();
        ch = this.code;
      }
      this.index++;
      if (ch === Jsep.OBRACK_CODE) {
        node = {
          type: Jsep.MEMBER_EXP,
          computed: true,
          object: node,
          property: this.gobbleExpression()
        };
        if (!node.property) {
          this.throwError('Unexpected "' + this.char + '"');
        }
        this.gobbleSpaces();
        ch = this.code;
        if (ch !== Jsep.CBRACK_CODE) {
          this.throwError('Unclosed [');
        }
        this.index++;
      } else if (ch === Jsep.OPAREN_CODE) {
        // A function call is being made; gobble all the arguments
        node = {
          type: Jsep.CALL_EXP,
          'arguments': this.gobbleArguments(Jsep.CPAREN_CODE),
          callee: node
        };
      } else if (ch === Jsep.PERIOD_CODE || optional) {
        if (optional) {
          this.index--;
        }
        this.gobbleSpaces();
        node = {
          type: Jsep.MEMBER_EXP,
          computed: false,
          object: node,
          property: this.gobbleIdentifier()
        };
      }
      if (optional) {
        node.optional = true;
      } // else leave undefined for compatibility with esprima

      this.gobbleSpaces();
      ch = this.code;
    }
    return node;
  }

  /**
   * Parse simple numeric literals: `12`, `3.4`, `.5`. Do this by using a string to
   * keep track of everything in the numeric literal and then calling `parseFloat` on that string
   * @returns {jsep.Literal}
   */
  gobbleNumericLiteral() {
    let number = '',
      ch,
      chCode;
    while (Jsep.isDecimalDigit(this.code)) {
      number += this.expr.charAt(this.index++);
    }
    if (this.code === Jsep.PERIOD_CODE) {
      // can start with a decimal marker
      number += this.expr.charAt(this.index++);
      while (Jsep.isDecimalDigit(this.code)) {
        number += this.expr.charAt(this.index++);
      }
    }
    ch = this.char;
    if (ch === 'e' || ch === 'E') {
      // exponent marker
      number += this.expr.charAt(this.index++);
      ch = this.char;
      if (ch === '+' || ch === '-') {
        // exponent sign
        number += this.expr.charAt(this.index++);
      }
      while (Jsep.isDecimalDigit(this.code)) {
        // exponent itself
        number += this.expr.charAt(this.index++);
      }
      if (!Jsep.isDecimalDigit(this.expr.charCodeAt(this.index - 1))) {
        this.throwError('Expected exponent (' + number + this.char + ')');
      }
    }
    chCode = this.code;

    // Check to make sure this isn't a variable name that start with a number (123abc)
    if (Jsep.isIdentifierStart(chCode)) {
      this.throwError('Variable names cannot start with a number (' + number + this.char + ')');
    } else if (chCode === Jsep.PERIOD_CODE || number.length === 1 && number.charCodeAt(0) === Jsep.PERIOD_CODE) {
      this.throwError('Unexpected period');
    }
    return {
      type: Jsep.LITERAL,
      value: parseFloat(number),
      raw: number
    };
  }

  /**
   * Parses a string literal, staring with single or double quotes with basic support for escape codes
   * e.g. `"hello world"`, `'this is\nJSEP'`
   * @returns {jsep.Literal}
   */
  gobbleStringLiteral() {
    let str = '';
    const startIndex = this.index;
    const quote = this.expr.charAt(this.index++);
    let closed = false;
    while (this.index < this.expr.length) {
      let ch = this.expr.charAt(this.index++);
      if (ch === quote) {
        closed = true;
        break;
      } else if (ch === '\\') {
        // Check for all of the common escape codes
        ch = this.expr.charAt(this.index++);
        switch (ch) {
          case 'n':
            str += '\n';
            break;
          case 'r':
            str += '\r';
            break;
          case 't':
            str += '\t';
            break;
          case 'b':
            str += '\b';
            break;
          case 'f':
            str += '\f';
            break;
          case 'v':
            str += '\x0B';
            break;
          default:
            str += ch;
        }
      } else {
        str += ch;
      }
    }
    if (!closed) {
      this.throwError('Unclosed quote after "' + str + '"');
    }
    return {
      type: Jsep.LITERAL,
      value: str,
      raw: this.expr.substring(startIndex, this.index)
    };
  }

  /**
   * Gobbles only identifiers
   * e.g.: `foo`, `_value`, `$x1`
   * Also, this function checks if that identifier is a literal:
   * (e.g. `true`, `false`, `null`) or `this`
   * @returns {jsep.Identifier}
   */
  gobbleIdentifier() {
    let ch = this.code,
      start = this.index;
    if (Jsep.isIdentifierStart(ch)) {
      this.index++;
    } else {
      this.throwError('Unexpected ' + this.char);
    }
    while (this.index < this.expr.length) {
      ch = this.code;
      if (Jsep.isIdentifierPart(ch)) {
        this.index++;
      } else {
        break;
      }
    }
    return {
      type: Jsep.IDENTIFIER,
      name: this.expr.slice(start, this.index)
    };
  }

  /**
   * Gobbles a list of arguments within the context of a function call
   * or array literal. This function also assumes that the opening character
   * `(` or `[` has already been gobbled, and gobbles expressions and commas
   * until the terminator character `)` or `]` is encountered.
   * e.g. `foo(bar, baz)`, `my_func()`, or `[bar, baz]`
   * @param {number} termination
   * @returns {jsep.Expression[]}
   */
  gobbleArguments(termination) {
    const args = [];
    let closed = false;
    let separator_count = 0;
    while (this.index < this.expr.length) {
      this.gobbleSpaces();
      let ch_i = this.code;
      if (ch_i === termination) {
        // done parsing
        closed = true;
        this.index++;
        if (termination === Jsep.CPAREN_CODE && separator_count && separator_count >= args.length) {
          this.throwError('Unexpected token ' + String.fromCharCode(termination));
        }
        break;
      } else if (ch_i === Jsep.COMMA_CODE) {
        // between expressions
        this.index++;
        separator_count++;
        if (separator_count !== args.length) {
          // missing argument
          if (termination === Jsep.CPAREN_CODE) {
            this.throwError('Unexpected token ,');
          } else if (termination === Jsep.CBRACK_CODE) {
            for (let arg = args.length; arg < separator_count; arg++) {
              args.push(null);
            }
          }
        }
      } else if (args.length !== separator_count && separator_count !== 0) {
        // NOTE: `&& separator_count !== 0` allows for either all commas, or all spaces as arguments
        this.throwError('Expected comma');
      } else {
        const node = this.gobbleExpression();
        if (!node || node.type === Jsep.COMPOUND) {
          this.throwError('Expected comma');
        }
        args.push(node);
      }
    }
    if (!closed) {
      this.throwError('Expected ' + String.fromCharCode(termination));
    }
    return args;
  }

  /**
   * Responsible for parsing a group of things within parentheses `()`
   * that have no identifier in front (so not a function call)
   * This function assumes that it needs to gobble the opening parenthesis
   * and then tries to gobble everything within that parenthesis, assuming
   * that the next thing it should see is the close parenthesis. If not,
   * then the expression probably doesn't have a `)`
   * @returns {boolean|jsep.Expression}
   */
  gobbleGroup() {
    this.index++;
    let nodes = this.gobbleExpressions(Jsep.CPAREN_CODE);
    if (this.code === Jsep.CPAREN_CODE) {
      this.index++;
      if (nodes.length === 1) {
        return nodes[0];
      } else if (!nodes.length) {
        return false;
      } else {
        return {
          type: Jsep.SEQUENCE_EXP,
          expressions: nodes
        };
      }
    } else {
      this.throwError('Unclosed (');
    }
  }

  /**
   * Responsible for parsing Array literals `[1, 2, 3]`
   * This function assumes that it needs to gobble the opening bracket
   * and then tries to gobble the expressions as arguments.
   * @returns {jsep.ArrayExpression}
   */
  gobbleArray() {
    this.index++;
    return {
      type: Jsep.ARRAY_EXP,
      elements: this.gobbleArguments(Jsep.CBRACK_CODE)
    };
  }
}

// Static fields:
const hooks = new Hooks();
Object.assign(Jsep, {
  hooks,
  plugins: new Plugins(Jsep),
  // Node Types
  // ----------
  // This is the full set of types that any JSEP node can be.
  // Store them here to save space when minified
  COMPOUND: 'Compound',
  SEQUENCE_EXP: 'SequenceExpression',
  IDENTIFIER: 'Identifier',
  MEMBER_EXP: 'MemberExpression',
  LITERAL: 'Literal',
  THIS_EXP: 'ThisExpression',
  CALL_EXP: 'CallExpression',
  UNARY_EXP: 'UnaryExpression',
  BINARY_EXP: 'BinaryExpression',
  ARRAY_EXP: 'ArrayExpression',
  TAB_CODE: 9,
  LF_CODE: 10,
  CR_CODE: 13,
  SPACE_CODE: 32,
  PERIOD_CODE: 46,
  // '.'
  COMMA_CODE: 44,
  // ','
  SQUOTE_CODE: 39,
  // single quote
  DQUOTE_CODE: 34,
  // double quotes
  OPAREN_CODE: 40,
  // (
  CPAREN_CODE: 41,
  // )
  OBRACK_CODE: 91,
  // [
  CBRACK_CODE: 93,
  // ]
  QUMARK_CODE: 63,
  // ?
  SEMCOL_CODE: 59,
  // ;
  COLON_CODE: 58,
  // :

  // Operations
  // ----------
  // Use a quickly-accessible map to store all of the unary operators
  // Values are set to `1` (it really doesn't matter)
  unary_ops: {
    '-': 1,
    '!': 1,
    '~': 1,
    '+': 1
  },
  // Also use a map for the binary operations but set their values to their
  // binary precedence for quick reference (higher number = higher precedence)
  // see [Order of operations](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)
  binary_ops: {
    '||': 1,
    '??': 1,
    '&&': 2,
    '|': 3,
    '^': 4,
    '&': 5,
    '==': 6,
    '!=': 6,
    '===': 6,
    '!==': 6,
    '<': 7,
    '>': 7,
    '<=': 7,
    '>=': 7,
    '<<': 8,
    '>>': 8,
    '>>>': 8,
    '+': 9,
    '-': 9,
    '*': 10,
    '/': 10,
    '%': 10,
    '**': 11
  },
  // sets specific binary_ops as right-associative
  right_associative: new Set(['**']),
  // Additional valid identifier chars, apart from a-z, A-Z and 0-9 (except on the starting char)
  additional_identifier_chars: new Set(['$', '_']),
  // Literals
  // ----------
  // Store the values to return for the various literals we may encounter
  literals: {
    'true': true,
    'false': false,
    'null': null
  },
  // Except for `this`, which is special. This could be changed to something like `'self'` as well
  this_str: 'this'
});
Jsep.max_unop_len = Jsep.getMaxKeyLen(Jsep.unary_ops);
Jsep.max_binop_len = Jsep.getMaxKeyLen(Jsep.binary_ops);

// Backward Compatibility:
const jsep = expr => new Jsep(expr).parse();
const stdClassProps = Object.getOwnPropertyNames(class Test {});
Object.getOwnPropertyNames(Jsep).filter(prop => !stdClassProps.includes(prop) && jsep[prop] === undefined).forEach(m => {
  jsep[m] = Jsep[m];
});
jsep.Jsep = Jsep; // allows for const { Jsep } = require('jsep');

const CONDITIONAL_EXP = 'ConditionalExpression';
var ternary = {
  name: 'ternary',
  init(jsep) {
    // Ternary expression: test ? consequent : alternate
    jsep.hooks.add('after-expression', function gobbleTernary(env) {
      if (env.node && this.code === jsep.QUMARK_CODE) {
        this.index++;
        const test = env.node;
        const consequent = this.gobbleExpression();
        if (!consequent) {
          this.throwError('Expected expression');
        }
        this.gobbleSpaces();
        if (this.code === jsep.COLON_CODE) {
          this.index++;
          const alternate = this.gobbleExpression();
          if (!alternate) {
            this.throwError('Expected expression');
          }
          env.node = {
            type: CONDITIONAL_EXP,
            test,
            consequent,
            alternate
          };

          // check for operators of higher priority than ternary (i.e. assignment)
          // jsep sets || at 1, and assignment at 0.9, and conditional should be between them
          if (test.operator && jsep.binary_ops[test.operator] <= 0.9) {
            let newTest = test;
            while (newTest.right.operator && jsep.binary_ops[newTest.right.operator] <= 0.9) {
              newTest = newTest.right;
            }
            env.node.test = newTest.right;
            newTest.right = env.node;
            env.node = test;
          }
        } else {
          this.throwError('Expected :');
        }
      }
    });
  }
};

// Add default plugins:

jsep.plugins.register(ternary);

const FSLASH_CODE = 47; // '/'
const BSLASH_CODE = 92; // '\\'

var index$1 = {
  name: 'regex',
  init(jsep) {
    // Regex literal: /abc123/ig
    jsep.hooks.add('gobble-token', function gobbleRegexLiteral(env) {
      if (this.code === FSLASH_CODE) {
        const patternIndex = ++this.index;
        let inCharSet = false;
        while (this.index < this.expr.length) {
          if (this.code === FSLASH_CODE && !inCharSet) {
            const pattern = this.expr.slice(patternIndex, this.index);
            let flags = '';
            while (++this.index < this.expr.length) {
              const code = this.code;
              if (code >= 97 && code <= 122 // a...z
              || code >= 65 && code <= 90 // A...Z
              || code >= 48 && code <= 57) {
                // 0-9
                flags += this.char;
              } else {
                break;
              }
            }
            let value;
            try {
              value = new RegExp(pattern, flags);
            } catch (e) {
              this.throwError(e.message);
            }
            env.node = {
              type: jsep.LITERAL,
              value,
              raw: this.expr.slice(patternIndex - 1, this.index)
            };

            // allow . [] and () after regex: /regex/.test(a)
            env.node = this.gobbleTokenProperty(env.node);
            return env.node;
          }
          if (this.code === jsep.OBRACK_CODE) {
            inCharSet = true;
          } else if (inCharSet && this.code === jsep.CBRACK_CODE) {
            inCharSet = false;
          }
          this.index += this.code === BSLASH_CODE ? 2 : 1;
        }
        this.throwError('Unclosed Regex');
      }
    });
  }
};

const PLUS_CODE = 43; // +
const MINUS_CODE = 45; // -

const plugin = {
  name: 'assignment',
  assignmentOperators: new Set(['=', '*=', '**=', '/=', '%=', '+=', '-=', '<<=', '>>=', '>>>=', '&=', '^=', '|=', '||=', '&&=', '??=']),
  updateOperators: [PLUS_CODE, MINUS_CODE],
  assignmentPrecedence: 0.9,
  init(jsep) {
    const updateNodeTypes = [jsep.IDENTIFIER, jsep.MEMBER_EXP];
    plugin.assignmentOperators.forEach(op => jsep.addBinaryOp(op, plugin.assignmentPrecedence, true));
    jsep.hooks.add('gobble-token', function gobbleUpdatePrefix(env) {
      const code = this.code;
      if (plugin.updateOperators.some(c => c === code && c === this.expr.charCodeAt(this.index + 1))) {
        this.index += 2;
        env.node = {
          type: 'UpdateExpression',
          operator: code === PLUS_CODE ? '++' : '--',
          argument: this.gobbleTokenProperty(this.gobbleIdentifier()),
          prefix: true
        };
        if (!env.node.argument || !updateNodeTypes.includes(env.node.argument.type)) {
          this.throwError(`Unexpected ${env.node.operator}`);
        }
      }
    });
    jsep.hooks.add('after-token', function gobbleUpdatePostfix(env) {
      if (env.node) {
        const code = this.code;
        if (plugin.updateOperators.some(c => c === code && c === this.expr.charCodeAt(this.index + 1))) {
          if (!updateNodeTypes.includes(env.node.type)) {
            this.throwError(`Unexpected ${env.node.operator}`);
          }
          this.index += 2;
          env.node = {
            type: 'UpdateExpression',
            operator: code === PLUS_CODE ? '++' : '--',
            argument: env.node,
            prefix: false
          };
        }
      }
    });
    jsep.hooks.add('after-expression', function gobbleAssignment(env) {
      if (env.node) {
        // Note: Binaries can be chained in a single expression to respect
        // operator precedence (i.e. a = b = 1 + 2 + 3)
        // Update all binary assignment nodes in the tree
        updateBinariesToAssignments(env.node);
      }
    });
    function updateBinariesToAssignments(node) {
      if (plugin.assignmentOperators.has(node.operator)) {
        node.type = 'AssignmentExpression';
        updateBinariesToAssignments(node.left);
        updateBinariesToAssignments(node.right);
      } else if (!node.operator) {
        Object.values(node).forEach(val => {
          if (val && typeof val === 'object') {
            updateBinariesToAssignments(val);
          }
        });
      }
    }
  }
};

/* eslint-disable no-bitwise -- Convenient */

// register plugins
jsep.plugins.register(index$1, plugin);
jsep.addUnaryOp('typeof');
jsep.addLiteral('null', null);
jsep.addLiteral('undefined', undefined);
const BLOCKED_PROTO_PROPERTIES = new Set(['constructor', '__proto__', '__defineGetter__', '__defineSetter__']);
const SafeEval = {
  /**
   * @param {jsep.Expression} ast
   * @param {Record<string, any>} subs
   */
  evalAst(ast, subs) {
    switch (ast.type) {
      case 'BinaryExpression':
      case 'LogicalExpression':
        return SafeEval.evalBinaryExpression(ast, subs);
      case 'Compound':
        return SafeEval.evalCompound(ast, subs);
      case 'ConditionalExpression':
        return SafeEval.evalConditionalExpression(ast, subs);
      case 'Identifier':
        return SafeEval.evalIdentifier(ast, subs);
      case 'Literal':
        return SafeEval.evalLiteral(ast, subs);
      case 'MemberExpression':
        return SafeEval.evalMemberExpression(ast, subs);
      case 'UnaryExpression':
        return SafeEval.evalUnaryExpression(ast, subs);
      case 'ArrayExpression':
        return SafeEval.evalArrayExpression(ast, subs);
      case 'CallExpression':
        return SafeEval.evalCallExpression(ast, subs);
      case 'AssignmentExpression':
        return SafeEval.evalAssignmentExpression(ast, subs);
      default:
        throw SyntaxError('Unexpected expression', ast);
    }
  },
  evalBinaryExpression(ast, subs) {
    const result = {
      '||': (a, b) => a || b(),
      '&&': (a, b) => a && b(),
      '|': (a, b) => a | b(),
      '^': (a, b) => a ^ b(),
      '&': (a, b) => a & b(),
      // eslint-disable-next-line eqeqeq -- API
      '==': (a, b) => a == b(),
      // eslint-disable-next-line eqeqeq -- API
      '!=': (a, b) => a != b(),
      '===': (a, b) => a === b(),
      '!==': (a, b) => a !== b(),
      '<': (a, b) => a < b(),
      '>': (a, b) => a > b(),
      '<=': (a, b) => a <= b(),
      '>=': (a, b) => a >= b(),
      '<<': (a, b) => a << b(),
      '>>': (a, b) => a >> b(),
      '>>>': (a, b) => a >>> b(),
      '+': (a, b) => a + b(),
      '-': (a, b) => a - b(),
      '*': (a, b) => a * b(),
      '/': (a, b) => a / b(),
      '%': (a, b) => a % b()
    }[ast.operator](SafeEval.evalAst(ast.left, subs), () => SafeEval.evalAst(ast.right, subs));
    return result;
  },
  evalCompound(ast, subs) {
    let last;
    for (let i = 0; i < ast.body.length; i++) {
      if (ast.body[i].type === 'Identifier' && ['var', 'let', 'const'].includes(ast.body[i].name) && ast.body[i + 1] && ast.body[i + 1].type === 'AssignmentExpression') {
        // var x=2; is detected as
        // [{Identifier var}, {AssignmentExpression x=2}]
        // eslint-disable-next-line @stylistic/max-len -- Long
        // eslint-disable-next-line sonarjs/updated-loop-counter -- Convenient
        i += 1;
      }
      const expr = ast.body[i];
      last = SafeEval.evalAst(expr, subs);
    }
    return last;
  },
  evalConditionalExpression(ast, subs) {
    if (SafeEval.evalAst(ast.test, subs)) {
      return SafeEval.evalAst(ast.consequent, subs);
    }
    return SafeEval.evalAst(ast.alternate, subs);
  },
  evalIdentifier(ast, subs) {
    if (Object.hasOwn(subs, ast.name)) {
      return subs[ast.name];
    }
    throw ReferenceError(`${ast.name} is not defined`);
  },
  evalLiteral(ast) {
    return ast.value;
  },
  evalMemberExpression(ast, subs) {
    const prop = ast.computed ? SafeEval.evalAst(ast.property) // `object[property]`
    : ast.property.name; // `object.property` property is Identifier
    const obj = SafeEval.evalAst(ast.object, subs);
    if (obj === undefined || obj === null) {
      throw TypeError(`Cannot read properties of ${obj} (reading '${prop}')`);
    }
    if (!Object.hasOwn(obj, prop) && BLOCKED_PROTO_PROPERTIES.has(prop)) {
      throw TypeError(`Cannot read properties of ${obj} (reading '${prop}')`);
    }
    const result = obj[prop];
    if (typeof result === 'function') {
      return result.bind(obj); // arrow functions aren't affected by bind.
    }
    return result;
  },
  evalUnaryExpression(ast, subs) {
    const result = {
      '-': a => -SafeEval.evalAst(a, subs),
      '!': a => !SafeEval.evalAst(a, subs),
      '~': a => ~SafeEval.evalAst(a, subs),
      // eslint-disable-next-line no-implicit-coercion -- API
      '+': a => +SafeEval.evalAst(a, subs),
      typeof: a => typeof SafeEval.evalAst(a, subs)
    }[ast.operator](ast.argument);
    return result;
  },
  evalArrayExpression(ast, subs) {
    return ast.elements.map(el => SafeEval.evalAst(el, subs));
  },
  evalCallExpression(ast, subs) {
    const args = ast.arguments.map(arg => SafeEval.evalAst(arg, subs));
    const func = SafeEval.evalAst(ast.callee, subs);
    // if (func === Function) {
    //     throw new Error('Function constructor is disabled');
    // }
    return func(...args);
  },
  evalAssignmentExpression(ast, subs) {
    if (ast.left.type !== 'Identifier') {
      throw SyntaxError('Invalid left-hand side in assignment');
    }
    const id = ast.left.name;
    const value = SafeEval.evalAst(ast.right, subs);
    subs[id] = value;
    return subs[id];
  }
};

/**
 * A replacement for NodeJS' VM.Script which is also {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP | Content Security Policy} friendly.
 */
class SafeScript {
  /**
   * @param {string} expr Expression to evaluate
   */
  constructor(expr) {
    this.code = expr;
    this.ast = jsep(this.code);
  }

  /**
   * @param {object} context Object whose items will be added
   *   to evaluation
   * @returns {EvaluatedResult} Result of evaluated code
   */
  runInNewContext(context) {
    // `Object.create(null)` creates a prototypeless object
    const keyMap = Object.assign(Object.create(null), context);
    return SafeEval.evalAst(this.ast, keyMap);
  }
}

/* eslint-disable camelcase -- Convenient for escaping */


/**
 * @typedef {null|boolean|number|string|object|GenericArray} JSONObject
 */

/**
 * @typedef {any} AnyItem
 */

/**
 * @typedef {any} AnyResult
 */

/**
 * Copies array and then pushes item into it.
 * @param {GenericArray} arr Array to copy and into which to push
 * @param {AnyItem} item Array item to add (to end)
 * @returns {GenericArray} Copy of the original array
 */
function push(arr, item) {
  arr = arr.slice();
  arr.push(item);
  return arr;
}
/**
 * Copies array and then unshifts item into it.
 * @param {AnyItem} item Array item to add (to beginning)
 * @param {GenericArray} arr Array to copy and into which to unshift
 * @returns {GenericArray} Copy of the original array
 */
function unshift(item, arr) {
  arr = arr.slice();
  arr.unshift(item);
  return arr;
}

/**
 * Caught when JSONPath is used without `new` but rethrown if with `new`
 * @extends Error
 */
class NewError extends Error {
  /**
   * @param {AnyResult} value The evaluated scalar value
   */
  constructor(value) {
    super('JSONPath should not be called with "new" (it prevents return ' + 'of (unwrapped) scalar values)');
    this.avoidNew = true;
    this.value = value;
    this.name = 'NewError';
  }
}

/**
* @typedef {object} ReturnObject
* @property {string} path
* @property {JSONObject} value
* @property {object|GenericArray} parent
* @property {string} parentProperty
*/

/**
* @callback JSONPathCallback
* @param {string|object} preferredOutput
* @param {"value"|"property"} type
* @param {ReturnObject} fullRetObj
* @returns {void}
*/

/**
* @callback OtherTypeCallback
* @param {JSONObject} val
* @param {string} path
* @param {object|GenericArray} parent
* @param {string} parentPropName
* @returns {boolean}
*/

/**
 * @typedef {any} ContextItem
 */

/**
 * @typedef {any} EvaluatedResult
 */

/**
* @callback EvalCallback
* @param {string} code
* @param {ContextItem} context
* @returns {EvaluatedResult}
*/

/**
 * @typedef {typeof SafeScript} EvalClass
 */

/**
 * @typedef {object} JSONPathOptions
 * @property {JSON} json
 * @property {string|string[]} path
 * @property {"value"|"path"|"pointer"|"parent"|"parentProperty"|
 *   "all"} [resultType="value"]
 * @property {boolean} [flatten=false]
 * @property {boolean} [wrap=true]
 * @property {object} [sandbox={}]
 * @property {EvalCallback|EvalClass|'safe'|'native'|
 *   boolean} [eval = 'safe']
 * @property {object|GenericArray|null} [parent=null]
 * @property {string|null} [parentProperty=null]
 * @property {JSONPathCallback} [callback]
 * @property {OtherTypeCallback} [otherTypeCallback] Defaults to
 *   function which throws on encountering `@other`
 * @property {boolean} [autostart=true]
 */

/**
 * @param {string|JSONPathOptions} opts If a string, will be treated as `expr`
 * @param {string} [expr] JSON path to evaluate
 * @param {JSON} [obj] JSON object to evaluate against
 * @param {JSONPathCallback} [callback] Passed 3 arguments: 1) desired payload
 *     per `resultType`, 2) `"value"|"property"`, 3) Full returned object with
 *     all payloads
 * @param {OtherTypeCallback} [otherTypeCallback] If `@other()` is at the end
 *   of one's query, this will be invoked with the value of the item, its
 *   path, its parent, and its parent's property name, and it should return
 *   a boolean indicating whether the supplied value belongs to the "other"
 *   type or not (or it may handle transformations and return `false`).
 * @returns {JSONPath}
 * @class
 */
function JSONPath(opts, expr, obj, callback, otherTypeCallback) {
  // eslint-disable-next-line no-restricted-syntax -- Allow for pseudo-class
  if (!(this instanceof JSONPath)) {
    try {
      return new JSONPath(opts, expr, obj, callback, otherTypeCallback);
    } catch (e) {
      if (!e.avoidNew) {
        throw e;
      }
      return e.value;
    }
  }
  if (typeof opts === 'string') {
    otherTypeCallback = callback;
    callback = obj;
    obj = expr;
    expr = opts;
    opts = null;
  }
  const optObj = opts && typeof opts === 'object';
  opts = opts || {};
  this.json = opts.json || obj;
  this.path = opts.path || expr;
  this.resultType = opts.resultType || 'value';
  this.flatten = opts.flatten || false;
  this.wrap = Object.hasOwn(opts, 'wrap') ? opts.wrap : true;
  this.sandbox = opts.sandbox || {};
  this.eval = opts.eval === undefined ? 'safe' : opts.eval;
  this.ignoreEvalErrors = typeof opts.ignoreEvalErrors === 'undefined' ? false : opts.ignoreEvalErrors;
  this.parent = opts.parent || null;
  this.parentProperty = opts.parentProperty || null;
  this.callback = opts.callback || callback || null;
  this.otherTypeCallback = opts.otherTypeCallback || otherTypeCallback || function () {
    throw new TypeError('You must supply an otherTypeCallback callback option ' + 'with the @other() operator.');
  };
  if (opts.autostart !== false) {
    const args = {
      path: optObj ? opts.path : expr
    };
    if (!optObj) {
      args.json = obj;
    } else if ('json' in opts) {
      args.json = opts.json;
    }
    const ret = this.evaluate(args);
    if (!ret || typeof ret !== 'object') {
      throw new NewError(ret);
    }
    return ret;
  }
}

// PUBLIC METHODS
JSONPath.prototype.evaluate = function (expr, json, callback, otherTypeCallback) {
  let currParent = this.parent,
    currParentProperty = this.parentProperty;
  let {
    flatten,
    wrap
  } = this;
  this.currResultType = this.resultType;
  this.currEval = this.eval;
  this.currSandbox = this.sandbox;
  callback = callback || this.callback;
  this.currOtherTypeCallback = otherTypeCallback || this.otherTypeCallback;
  json = json || this.json;
  expr = expr || this.path;
  if (expr && typeof expr === 'object' && !Array.isArray(expr)) {
    if (!expr.path && expr.path !== '') {
      throw new TypeError('You must supply a "path" property when providing an object ' + 'argument to JSONPath.evaluate().');
    }
    if (!Object.hasOwn(expr, 'json')) {
      throw new TypeError('You must supply a "json" property when providing an object ' + 'argument to JSONPath.evaluate().');
    }
    ({
      json
    } = expr);
    flatten = Object.hasOwn(expr, 'flatten') ? expr.flatten : flatten;
    this.currResultType = Object.hasOwn(expr, 'resultType') ? expr.resultType : this.currResultType;
    this.currSandbox = Object.hasOwn(expr, 'sandbox') ? expr.sandbox : this.currSandbox;
    wrap = Object.hasOwn(expr, 'wrap') ? expr.wrap : wrap;
    this.currEval = Object.hasOwn(expr, 'eval') ? expr.eval : this.currEval;
    callback = Object.hasOwn(expr, 'callback') ? expr.callback : callback;
    this.currOtherTypeCallback = Object.hasOwn(expr, 'otherTypeCallback') ? expr.otherTypeCallback : this.currOtherTypeCallback;
    currParent = Object.hasOwn(expr, 'parent') ? expr.parent : currParent;
    currParentProperty = Object.hasOwn(expr, 'parentProperty') ? expr.parentProperty : currParentProperty;
    expr = expr.path;
  }
  currParent = currParent || null;
  currParentProperty = currParentProperty || null;
  if (Array.isArray(expr)) {
    expr = JSONPath.toPathString(expr);
  }
  if (!expr && expr !== '' || !json) {
    return undefined;
  }
  const exprList = JSONPath.toPathArray(expr);
  if (exprList[0] === '$' && exprList.length > 1) {
    exprList.shift();
  }
  this._hasParentSelector = null;
  const result = this._trace(exprList, json, ['$'], currParent, currParentProperty, callback).filter(function (ea) {
    return ea && !ea.isParentSelector;
  });
  if (!result.length) {
    return wrap ? [] : undefined;
  }
  if (!wrap && result.length === 1 && !result[0].hasArrExpr) {
    return this._getPreferredOutput(result[0]);
  }
  return result.reduce((rslt, ea) => {
    const valOrPath = this._getPreferredOutput(ea);
    if (flatten && Array.isArray(valOrPath)) {
      rslt = rslt.concat(valOrPath);
    } else {
      rslt.push(valOrPath);
    }
    return rslt;
  }, []);
};

// PRIVATE METHODS

JSONPath.prototype._getPreferredOutput = function (ea) {
  const resultType = this.currResultType;
  switch (resultType) {
    case 'all':
      {
        const path = Array.isArray(ea.path) ? ea.path : JSONPath.toPathArray(ea.path);
        ea.pointer = JSONPath.toPointer(path);
        ea.path = typeof ea.path === 'string' ? ea.path : JSONPath.toPathString(ea.path);
        return ea;
      }
    case 'value':
    case 'parent':
    case 'parentProperty':
      return ea[resultType];
    case 'path':
      return JSONPath.toPathString(ea[resultType]);
    case 'pointer':
      return JSONPath.toPointer(ea.path);
    default:
      throw new TypeError('Unknown result type');
  }
};
JSONPath.prototype._handleCallback = function (fullRetObj, callback, type) {
  if (callback) {
    const preferredOutput = this._getPreferredOutput(fullRetObj);
    fullRetObj.path = typeof fullRetObj.path === 'string' ? fullRetObj.path : JSONPath.toPathString(fullRetObj.path);
    // eslint-disable-next-line n/callback-return -- No need to return
    callback(preferredOutput, type, fullRetObj);
  }
};

/**
 *
 * @param {string} expr
 * @param {JSONObject} val
 * @param {string} path
 * @param {object|GenericArray} parent
 * @param {string} parentPropName
 * @param {JSONPathCallback} callback
 * @param {boolean} hasArrExpr
 * @param {boolean} literalPriority
 * @returns {ReturnObject|ReturnObject[]}
 */
JSONPath.prototype._trace = function (expr, val, path, parent, parentPropName, callback, hasArrExpr, literalPriority) {
  // No expr to follow? return path and value as the result of
  //  this trace branch
  let retObj;
  if (!expr.length) {
    retObj = {
      path,
      value: val,
      parent,
      parentProperty: parentPropName,
      hasArrExpr
    };
    this._handleCallback(retObj, callback, 'value');
    return retObj;
  }
  const loc = expr[0],
    x = expr.slice(1);

  // We need to gather the return value of recursive trace calls in order to
  // do the parent sel computation.
  const ret = [];
  /**
   *
   * @param {ReturnObject|ReturnObject[]} elems
   * @returns {void}
   */
  function addRet(elems) {
    if (Array.isArray(elems)) {
      // This was causing excessive stack size in Node (with or
      //  without Babel) against our performance test:
      //  `ret.push(...elems);`
      elems.forEach(t => {
        ret.push(t);
      });
    } else {
      ret.push(elems);
    }
  }
  if ((typeof loc !== 'string' || literalPriority) && val && Object.hasOwn(val, loc)) {
    // simple case--directly follow property
    addRet(this._trace(x, val[loc], push(path, loc), val, loc, callback, hasArrExpr));
    // eslint-disable-next-line unicorn/prefer-switch -- Part of larger `if`
  } else if (loc === '*') {
    // all child properties
    this._walk(val, m => {
      addRet(this._trace(x, val[m], push(path, m), val, m, callback, true, true));
    });
  } else if (loc === '..') {
    // all descendent parent properties
    // Check remaining expression with val's immediate children
    addRet(this._trace(x, val, path, parent, parentPropName, callback, hasArrExpr));
    this._walk(val, m => {
      // We don't join m and x here because we only want parents,
      //   not scalar values
      if (typeof val[m] === 'object') {
        // Keep going with recursive descent on val's
        //   object children
        addRet(this._trace(expr.slice(), val[m], push(path, m), val, m, callback, true));
      }
    });
    // The parent sel computation is handled in the frame above using the
    // ancestor object of val
  } else if (loc === '^') {
    // This is not a final endpoint, so we do not invoke the callback here
    this._hasParentSelector = true;
    return {
      path: path.slice(0, -1),
      expr: x,
      isParentSelector: true
    };
  } else if (loc === '~') {
    // property name
    retObj = {
      path: push(path, loc),
      value: parentPropName,
      parent,
      parentProperty: null
    };
    this._handleCallback(retObj, callback, 'property');
    return retObj;
  } else if (loc === '$') {
    // root only
    addRet(this._trace(x, val, path, null, null, callback, hasArrExpr));
  } else if (/^(-?\d*):(-?\d*):?(\d*)$/u.test(loc)) {
    // [start:end:step]  Python slice syntax
    addRet(this._slice(loc, x, val, path, parent, parentPropName, callback));
  } else if (loc.indexOf('?(') === 0) {
    // [?(expr)] (filtering)
    if (this.currEval === false) {
      throw new Error('Eval [?(expr)] prevented in JSONPath expression.');
    }
    const safeLoc = loc.replace(/^\?\((.*?)\)$/u, '$1');
    // check for a nested filter expression
    const nested = /@.?([^?]*)[['](\??\(.*?\))(?!.\)\])[\]']/gu.exec(safeLoc);
    if (nested) {
      // find if there are matches in the nested expression
      // add them to the result set if there is at least one match
      this._walk(val, m => {
        const npath = [nested[2]];
        const nvalue = nested[1] ? val[m][nested[1]] : val[m];
        const filterResults = this._trace(npath, nvalue, path, parent, parentPropName, callback, true);
        if (filterResults.length > 0) {
          addRet(this._trace(x, val[m], push(path, m), val, m, callback, true));
        }
      });
    } else {
      this._walk(val, m => {
        if (this._eval(safeLoc, val[m], m, path, parent, parentPropName)) {
          addRet(this._trace(x, val[m], push(path, m), val, m, callback, true));
        }
      });
    }
  } else if (loc[0] === '(') {
    // [(expr)] (dynamic property/index)
    if (this.currEval === false) {
      throw new Error('Eval [(expr)] prevented in JSONPath expression.');
    }
    // As this will resolve to a property name (but we don't know it
    //  yet), property and parent information is relative to the
    //  parent of the property to which this expression will resolve
    addRet(this._trace(unshift(this._eval(loc, val, path.at(-1), path.slice(0, -1), parent, parentPropName), x), val, path, parent, parentPropName, callback, hasArrExpr));
  } else if (loc[0] === '@') {
    // value type: @boolean(), etc.
    let addType = false;
    const valueType = loc.slice(1, -2);
    switch (valueType) {
      case 'scalar':
        if (!val || !['object', 'function'].includes(typeof val)) {
          addType = true;
        }
        break;
      case 'boolean':
      case 'string':
      case 'undefined':
      case 'function':
        if (typeof val === valueType) {
          addType = true;
        }
        break;
      case 'integer':
        if (Number.isFinite(val) && !(val % 1)) {
          addType = true;
        }
        break;
      case 'number':
        if (Number.isFinite(val)) {
          addType = true;
        }
        break;
      case 'nonFinite':
        if (typeof val === 'number' && !Number.isFinite(val)) {
          addType = true;
        }
        break;
      case 'object':
        if (val && typeof val === valueType) {
          addType = true;
        }
        break;
      case 'array':
        if (Array.isArray(val)) {
          addType = true;
        }
        break;
      case 'other':
        addType = this.currOtherTypeCallback(val, path, parent, parentPropName);
        break;
      case 'null':
        if (val === null) {
          addType = true;
        }
        break;
      /* c8 ignore next 2 */
      default:
        throw new TypeError('Unknown value type ' + valueType);
    }
    if (addType) {
      retObj = {
        path,
        value: val,
        parent,
        parentProperty: parentPropName
      };
      this._handleCallback(retObj, callback, 'value');
      return retObj;
    }
    // `-escaped property
  } else if (loc[0] === '`' && val && Object.hasOwn(val, loc.slice(1))) {
    const locProp = loc.slice(1);
    addRet(this._trace(x, val[locProp], push(path, locProp), val, locProp, callback, hasArrExpr, true));
  } else if (loc.includes(',')) {
    // [name1,name2,...]
    const parts = loc.split(',');
    for (const part of parts) {
      addRet(this._trace(unshift(part, x), val, path, parent, parentPropName, callback, true));
    }
    // simple case--directly follow property
  } else if (!literalPriority && val && Object.hasOwn(val, loc)) {
    addRet(this._trace(x, val[loc], push(path, loc), val, loc, callback, hasArrExpr, true));
  }

  // We check the resulting values for parent selections. For parent
  // selections we discard the value object and continue the trace with the
  // current val object
  if (this._hasParentSelector) {
    for (let t = 0; t < ret.length; t++) {
      const rett = ret[t];
      if (rett && rett.isParentSelector) {
        const tmp = this._trace(rett.expr, val, rett.path, parent, parentPropName, callback, hasArrExpr);
        if (Array.isArray(tmp)) {
          ret[t] = tmp[0];
          const tl = tmp.length;
          for (let tt = 1; tt < tl; tt++) {
            // eslint-disable-next-line @stylistic/max-len -- Long
            // eslint-disable-next-line sonarjs/updated-loop-counter -- Convenient
            t++;
            ret.splice(t, 0, tmp[tt]);
          }
        } else {
          ret[t] = tmp;
        }
      }
    }
  }
  return ret;
};
JSONPath.prototype._walk = function (val, f) {
  if (Array.isArray(val)) {
    const n = val.length;
    for (let i = 0; i < n; i++) {
      f(i);
    }
  } else if (val && typeof val === 'object') {
    Object.keys(val).forEach(m => {
      f(m);
    });
  }
};
JSONPath.prototype._slice = function (loc, expr, val, path, parent, parentPropName, callback) {
  if (!Array.isArray(val)) {
    return undefined;
  }
  const len = val.length,
    parts = loc.split(':'),
    step = parts[2] && Number.parseInt(parts[2]) || 1;
  let start = parts[0] && Number.parseInt(parts[0]) || 0,
    end = parts[1] && Number.parseInt(parts[1]) || len;
  start = start < 0 ? Math.max(0, start + len) : Math.min(len, start);
  end = end < 0 ? Math.max(0, end + len) : Math.min(len, end);
  const ret = [];
  for (let i = start; i < end; i += step) {
    const tmp = this._trace(unshift(i, expr), val, path, parent, parentPropName, callback, true);
    // Should only be possible to be an array here since first part of
    //   ``unshift(i, expr)` passed in above would not be empty, nor `~`,
    //     nor begin with `@` (as could return objects)
    // This was causing excessive stack size in Node (with or
    //  without Babel) against our performance test: `ret.push(...tmp);`
    tmp.forEach(t => {
      ret.push(t);
    });
  }
  return ret;
};
JSONPath.prototype._eval = function (code, _v, _vname, path, parent, parentPropName) {
  this.currSandbox._$_parentProperty = parentPropName;
  this.currSandbox._$_parent = parent;
  this.currSandbox._$_property = _vname;
  this.currSandbox._$_root = this.json;
  this.currSandbox._$_v = _v;
  const containsPath = code.includes('@path');
  if (containsPath) {
    this.currSandbox._$_path = JSONPath.toPathString(path.concat([_vname]));
  }
  const scriptCacheKey = this.currEval + 'Script:' + code;
  if (!JSONPath.cache[scriptCacheKey]) {
    let script = code.replaceAll('@parentProperty', '_$_parentProperty').replaceAll('@parent', '_$_parent').replaceAll('@property', '_$_property').replaceAll('@root', '_$_root').replaceAll(/@([.\s)[])/gu, '_$_v$1');
    if (containsPath) {
      script = script.replaceAll('@path', '_$_path');
    }
    if (this.currEval === 'safe' || this.currEval === true || this.currEval === undefined) {
      JSONPath.cache[scriptCacheKey] = new this.safeVm.Script(script);
    } else if (this.currEval === 'native') {
      JSONPath.cache[scriptCacheKey] = new this.vm.Script(script);
    } else if (typeof this.currEval === 'function' && this.currEval.prototype && Object.hasOwn(this.currEval.prototype, 'runInNewContext')) {
      const CurrEval = this.currEval;
      JSONPath.cache[scriptCacheKey] = new CurrEval(script);
    } else if (typeof this.currEval === 'function') {
      JSONPath.cache[scriptCacheKey] = {
        runInNewContext: context => this.currEval(script, context)
      };
    } else {
      throw new TypeError(`Unknown "eval" property "${this.currEval}"`);
    }
  }
  try {
    return JSONPath.cache[scriptCacheKey].runInNewContext(this.currSandbox);
  } catch (e) {
    if (this.ignoreEvalErrors) {
      return false;
    }
    throw new Error('jsonPath: ' + e.message + ': ' + code);
  }
};

// PUBLIC CLASS PROPERTIES AND METHODS

// Could store the cache object itself
JSONPath.cache = {};

/**
 * @param {string[]} pathArr Array to convert
 * @returns {string} The path string
 */
JSONPath.toPathString = function (pathArr) {
  const x = pathArr,
    n = x.length;
  let p = '$';
  for (let i = 1; i < n; i++) {
    if (!/^(~|\^|@.*?\(\))$/u.test(x[i])) {
      p += /^[0-9*]+$/u.test(x[i]) ? '[' + x[i] + ']' : "['" + x[i] + "']";
    }
  }
  return p;
};

/**
 * @param {string} pointer JSON Path
 * @returns {string} JSON Pointer
 */
JSONPath.toPointer = function (pointer) {
  const x = pointer,
    n = x.length;
  let p = '';
  for (let i = 1; i < n; i++) {
    if (!/^(~|\^|@.*?\(\))$/u.test(x[i])) {
      p += '/' + x[i].toString().replaceAll('~', '~0').replaceAll('/', '~1');
    }
  }
  return p;
};

/**
 * @param {string} expr Expression to convert
 * @returns {string[]}
 */
JSONPath.toPathArray = function (expr) {
  const {
    cache
  } = JSONPath;
  if (cache[expr]) {
    return cache[expr].concat();
  }
  const subx = [];
  const normalized = expr
  // Properties
  .replaceAll(/@(?:null|boolean|number|string|integer|undefined|nonFinite|scalar|array|object|function|other)\(\)/gu, ';$&;')
  // Parenthetical evaluations (filtering and otherwise), directly
  //   within brackets or single quotes
  .replaceAll(/[['](\??\(.*?\))[\]'](?!.\])/gu, function ($0, $1) {
    return '[#' + (subx.push($1) - 1) + ']';
  })
  // Escape periods and tildes within properties
  .replaceAll(/\[['"]([^'\]]*)['"]\]/gu, function ($0, prop) {
    return "['" + prop.replaceAll('.', '%@%').replaceAll('~', '%%@@%%') + "']";
  })
  // Properties operator
  .replaceAll('~', ';~;')
  // Split by property boundaries
  .replaceAll(/['"]?\.['"]?(?![^[]*\])|\[['"]?/gu, ';')
  // Reinsert periods within properties
  .replaceAll('%@%', '.')
  // Reinsert tildes within properties
  .replaceAll('%%@@%%', '~')
  // Parent
  .replaceAll(/(?:;)?(\^+)(?:;)?/gu, function ($0, ups) {
    return ';' + ups.split('').join(';') + ';';
  })
  // Descendents
  .replaceAll(/;;;|;;/gu, ';..;')
  // Remove trailing
  .replaceAll(/;$|'?\]|'$/gu, '');
  const exprList = normalized.split(';').map(function (exp) {
    const match = exp.match(/#(\d+)/u);
    return !match || !match[1] ? exp : subx[match[1]];
  });
  cache[expr] = exprList;
  return cache[expr].concat();
};
JSONPath.prototype.safeVm = {
  Script: SafeScript
};

JSONPath.prototype.vm = vm;

const logWithPrefix = (title, displayFunc) => (message) => {

  let finalMessage = message;

  if (typeof displayFunc === 'function') {

    finalMessage = displayFunc(message);
  }

  console.log(`${title}: ${finalMessage}`);

  return message
};


class CustomError extends Error {
  constructor(name = 'GENERIC', message = name, data = { status: 500 }) {
    super(message);
    super.name = name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.data = data;
  }

  map(func) {
    return this
  }

  chain(func) {
    return this
  }

  static of = CustomError
}
// try {
//   throw new CustomError('aa','bb',{a:1,b:2})
// }catch(e)
// {
//   console.log(`name: ${e.name}, message: ${e.message}, data: ${JSON.stringify(e.data)}, stack: ${e.stack}`)
// }
//
// mapping a function to CustomError should return the CustomError without exeecuting the function
// import { pipeWithChain, R } from './ramdaExt.js'
// let divide = (dividend, divisor) => 
//   divisor !== 0 
//     ? dividend/divisor
//     : new CustomError('ZERO_DIVISION_EXC','Division by zero',{dividend,divisor}) 

// R.map(a => {
//   console.log(`It shouldn't print this`)
//   return a +2
// })(divide(8,0)) //?

function createCustomErrorClass(errorName) {
  const errorClass = class extends CustomError {
    constructor(name, message, data) {
      super(name, message, data);
      this.name = errorName;
    }
  };

  return errorClass;
}


class Enum {

  constructor(values, rules) {
    // activeObjectKey will be an object with keys from values array and only one current key active: {ON:false,OFF:true}
    let activeObjectKey;

    // It will contain the active key for example 'OFF'. Once initialized activeObjectKey[activeKey] should be always equal to true
    let activeKey;

    let stateRules;

    if (Array.isArray(values) === false) throw new CustomError('NOT_AN_ARRAY', 'Only Array composed of non objects are permitted')
    if (values.filter((elem) => elem === 'object').length > 0) throw new CustomError('ARRAY_VALUES_MUST_BE_OF_BASIC_TYPE', 'Only basic types are allowed')

    let valuesNotAllowed = values.filter(elem => elem === 'get' || elem === 'set' || elem === 'getValue');

    if (valuesNotAllowed.length > 0) {
      throw new CustomError('ENUM_INVALID_ENUM_VALUE', `The following ENUM value/s are not allowed: ${valuesNotAllowed} as they are reserved words for enum`)
    }

    let valuesWithoutDuplicates = removeDuplicates(values);
    activeObjectKey = arrayToObject(valuesWithoutDuplicates, function defaultValue() { return false });
    activeKey = values[0];
    activeObjectKey[activeKey] = true;

    if (rules !== undefined) setupRules(rules);

    this.get = get;
    this.set = set;
    this.getValue = getValue;

    return new Proxy(activeObjectKey, this)

    ///

    function setupRules(rules) {
      if (rules === null || typeof rules !== 'object' || Array.isArray(rules) === true) {
        throw new CustomError('ENUM_RULES_BAD_FORMAT', 'rules is not an object: ' + rules)
      }

      for (let elem in rules) {
        if (activeObjectKey[elem] === undefined || Array.isArray(rules[elem]) === false) {
          throw new CustomError('ENUM_RULES_BAD_FORMAT', 'Each attribute of rules must be an element in the ENUM and its value should be an array: ' + activeObjectKey[elem] + rules[elem])
        }

        let valuesWithProblems = rules[elem].filter(itemTo => activeObjectKey[itemTo] === undefined);

        if (valuesWithProblems.length > 0) {
          throw new CustomError('ENUM_RULES_BAD_FORMAT', 'All elements in a rule entry must be one of the list values in the ENUM. The following values dont exist: ' + valuesWithProblems)
        }
      }

      stateRules = collectionClone(rules);
    }

    function get(_target, prop) {
      if (prop === 'getValue') {
        return getValue
      }

      if (activeObjectKey[prop] == null) throw new CustomError('ENUM_INVALID_PROPERTY', `.${prop} is none of the possible values ${this}`)

      return activeObjectKey[prop]
    }

    function set(_undefined, prop, value) {
      if (value !== true) {
        throw new CustomError('ENUM_ACTIVATION_NO_TRUE', `Tryng to set ${prop} with ${value} but activation only admits true`)
      }

      if (activeObjectKey[prop] === undefined) {
        throw new CustomError('ENUM_INVALID_PROPERTY', `.${prop} is none of the possible values ${this}`)
      }

      if (validateChange(activeKey, prop)) {
        activeObjectKey[activeKey] = false;
        activeObjectKey[prop] = true;
        activeKey = prop;
      } else throw new CustomError('ENUM_TRANSITION_NOT_ALLOWED', `.From: ${activeKey} --> To: ${prop}`)

      return true
    }

    function validateChange(activeElement, prop) {
      if (stateRules === undefined) return true

      return stateRules[activeElement] !== undefined && stateRules[activeElement].indexOf(prop) !== -1

    }
    function getValue() {
      return activeKey
    }
  }
}
// const ENGINE = new Enum(
//   ['UNDEFINED', 'START', 'SPEED', 'BREAK', 'STOP','ABANDONED'],
//   {
//     'UNDEFINED':['START'],
//     'START':['SPEED', 'BREAK', 'STOP'],
//     'SPEED':['BREAK', 'STOP'],
//   }
// )
// ENGINE.START = true
// ENGINE.START //?
// ENGINE.SPEED = true
// ENGINE.SPEED 

// try {
//   ENGINE.SPEED = true
// }catch(e)
// {
//   e  //? ENUM_TRANSITION_NOT_ALLOWED It is not defined to go to itself.
// }

// try {
//   const result = new Enum(
//     ['UNDEFINED', 'START', 'SPEED', 'BREAK', 'STOP','ABANDONED'],
//     {
//       'UNDEFINED':['START'],
//       'START':['SPEED', 'BREAK', 'STOP'],
//       'SPEEDRT':['BREAK', 'STOP'],
//     }
//   )

// } catch (e) {
//   e //?  ENUM_RULES_BAD_FORMAT SPEEDRT is not valid
// }


class EnumMap {
  constructor(values) {

    return new Proxy(collectionClone(values), this)
  }

  get(target, prop) {
    if (target[prop] == null && this[prop] == null) throw new CustomError('ENUM_OUT_OF_RANGE', `.${prop} is none of the possible values ${this}`)

    if (this[prop] != null) return this[prop]

    return target[prop]
  }

  set(_undefined, prop) {
    throw new CustomError('ENUM_NOT_MODIFIABLE', `Object of .${prop} is not modifiable`)
  }

  invert() {
    let invertedValues = {};

    for (const elem in this) {
      if (this.hasOwnProperty(elem)) {
        if (invertedValues[this[elem]] === undefined) {
          invertedValues[this[elem]] = [];
        }

        pushUniqueKey(elem, invertedValues[this[elem]]);
      }
    }

    if (Object.keys(invertedValues).reduce((acum, current) => acum && invertedValues[current].length === 1, true)) {
      invertedValues = Object.keys(invertedValues).reduce(
        (acum, current) => {
          acum[current] = invertedValues[current][0];
          return acum
        },
        {}
      );
    }

    return new EnumMap(collectionClone(invertedValues))
  }

}
// {
//   const SWITCHER = new EnumMap({ON:0,OFF:1})
//   SWITCHER.ON //? 0
//   SWITCHER.OFF //? 1
//   try { SWITCHER.ONFF
//   }catch(e){
//     e // ENUM_OUT_OF_RANGE
//   }
//   const INVERT_SWITCHER = SWITCHER.invert()
//   INVERT_SWITCHER['0'] //?
//   const value = SWITCHER.ON
//   value === 0 //? true
// }


function transition(states, events, transitions) {
  states.forEach(validateStateFormat);
  events.forEach(validateEventFormat);

  let state = states[0];
  let finalTransitions = Object.entries(transitions).reduce(
    (acum, [stateKey, stateValue]) => {
      // validations
      validateState(stateKey);

      let newStateValue = stateValue;
      if (typeof stateValue === 'string') {
        validateState(stateValue);

        newStateValue = events.reduce(
          (acum, current) => {
            acum[current] = stateValue;
            return acum
          },
          {}
        );
      } else {
        Object.entries(newStateValue).forEach(([key, value]) => {
          validateEvent(key);
          validateState(value);
        });
      }



      acum[stateKey] = { ...acum[stateKey], ...newStateValue };
      return acum
    },
    states.reduce(
      (acum, current) => {
        acum[current] =
          events.reduce(
            (acum2, el2) => {
              acum2[el2] = el2.toUpperCase();
              return acum2
            },
            {}
          );
        return acum
      },
      {}
    )
  );

  function sendEvent(event) {
    validateEvent(event);
    return state = finalTransitions[state][event]
  }

  sendEvent.valueOf = () => state;

  return sendEvent

  function validateStateFormat(state) {
    if (state !== state.toUpperCase())
      throw new CustomError('STATE_MUST_BE_UPPERCASE', `The state: ${state} does not have all characters in uppercase`)
  }

  function validateState(state) {
    if (states.some(el => el === state) === false)
      throw new CustomError('STATE_NOT_FOUND', `The state: ${state} was not found in the list of states supplied: ${states}`)
  }


  function validateEventFormat(event) {
    if (event !== event.toLowerCase())
      throw new CustomError('EVENT_MUST_BE_LOWERCASE', `The event: ${event} does not have all characters in lowercase`)
  }


  function validateEvent(event) {
    if (events.some(el => el === event) === false)
      throw new CustomError('EVENT_NOT_FOUND', `The event: ${event} was not found in the list of events supplied: ${events}`)
  }
}

// const tranDef = [
//   ['SYNC', 'PROMISE', 'FUTURE', 'PROMISE_AND_FUTURE'],
//   ['sync','promise','future'],
//   // STATE:{event:NEW_STATE}
//   // if a event is not defined within a STATE then the default value is selected STATE:{missing_event: NEW_STATE(missing_event.toUpperCase())}
//   {
//     PROMISE:{
//       sync:'PROMISE',
//       future: 'PROMISE_AND_FUTURE'
//       //by default: promise: 'PROMISE'
//     },
//     FUTURE:{
//       sync:'FUTURE',
//       promise: 'PROMISE_AND_FUTURE',
//     },
//     PROMISE_AND_FUTURE: 'PROMISE_AND_FUTURE' // same as {sync: 'PROMISE_AND_FUTURE', promise: 'PROMISE_AND_FUTURE', future: 'PROMISE_AND_FUTURE'}
//   }
// ]

// const typeOfList = transition(...tranDef)

// typeOfList('future') //?
// typeOfList('future') //?
// typeOfList('promise') //?
// typeOfList('sync') //?
// try{
//   typeOfList('sync2')  //?
// }catch(e) {console.log(e)}

// typeOfList('sync') //?

// typeOfList.valueOf() //?

function arrayToObject(arr, defaultValueFunction) {
  return arr.reduce((acum, current, index) => {
    acum[current] = defaultValueFunction(current, index);
    return acum
  }, {})
}

function arrayOfObjectsToObject(iterable) {
  if (typeof iterable?.[Symbol.iterator] === 'function') {
    let acum = {};
    for (let elem of iterable) {
      for (const key in elem) {
        acum[key] = elem[key];
      }
    }
    return acum
  }

  return arr.reduce((acum, current, index) => {
    for (const key in current) {
      acum[key] = current[key];
    }
    return acum
  }, {})
}

function removeDuplicates(arr) {
  return [...new Set(arr)]
}

// reviver is called for each node as: reviver(nodeRef, currentPath, parent, key). 
// For example: being objIni={a:{b:{c:3}},d:4} the reviver to call node a.b will be
// reviver({c:3}, ['a','b'], {b:{c:3}}, 'b') currentPath=['$', 'parent', 'son', '0', 'jose']
// reviver return value will impact traverse: 
//  undefined: do nothing.
//  Any value: assign this value (parent[key])
//  traverse.stop: stop inmediatly traverse
//  traverse.skip: skip node. It doesnt look at children of node.
//  prune: if true remove node.


function traverse$1(objIni, reviver, pureFunction = true) {
  const currentPath = ['$'];

  const objClone = pureFunction ? collectionClone(objIni) : objIni;

  let exitVar = false;
  let objForReviver = {};
  objForReviver['$'] = objClone;

  let isSkipNodeOnce = reviverProcess(reviver, objForReviver, '$', currentPath);

  if (objClone !== objForReviver['$']) return objForReviver['$']

  if (exitVar === true) return objForReviver['$']

  if (isSkipNodeOnce === false) {
    traverseRec(objForReviver['$']);
  }

  return objForReviver['$']

  function traverseRec(obj) {

    if (obj && obj instanceof Object && exitVar === false) {
      for (const prop in obj) {

        if (obj.hasOwnProperty(prop)) {
          currentPath.push(prop);

          let isSkipNodeOnce = reviverProcess(reviver, obj, prop, currentPath);

          if (exitVar === true) return

          if (isSkipNodeOnce === false) {
            traverseRec(obj[prop]);
          }

          currentPath.pop();
        }
      }
    }
  }

  function reviverProcess(reviver, obj, prop, currentPath) {
    let isSkipNodeOnce = false;

    if (reviver) {
      const resultReviver = reviver(obj[prop], currentPath, obj, prop);
      if (resultReviver !== undefined && resultReviver !== traverse$1.stop && resultReviver !== traverse$1.skip && resultReviver !== traverse$1.delete) {
        obj[prop] = resultReviver;
      }

      if (resultReviver === traverse$1.stop) {
        exitVar = true;
      }

      if (resultReviver === traverse$1.skip) {
        isSkipNodeOnce = true;
      }

      if (resultReviver === traverse$1.delete) {
        obj[prop] = undefined;
        isSkipNodeOnce = true;
      }
    }

    return isSkipNodeOnce
  }

}

traverse$1.skip = Symbol();
traverse$1.stop = Symbol();
traverse$1.delete = Symbol();

traverse$1.matchPath = function (pathStringQuery, reviverPath) {

  let pathStringArr = pathStringQuery.split('.');

  if (pathStringArr.length !== reviverPath.length) {
    return false;
  }

  return pathStringArr.every(
    (el, index) => el === '*' || el === reviverPath[index]
  )
};

function traverseVertically(functionToRun, verFields, toTraverse) {
  if (Array.isArray(toTraverse) === false) return

  let runIndex = 0;
  let maxLength = 0;
  let firstTime = true;
  for (let i = 0; firstTime || i < maxLength; i++) {
    let toReturn = [];
    for (let j = 0; j < toTraverse.length; j++) {
      toReturn[j] = { ...toTraverse[j] };
      for (const field of verFields) {
        if (firstTime) {
          maxLength = toTraverse[j]?.[field]?.length > maxLength
            ? toTraverse[j][field].length
            : maxLength;
        }
        toReturn[j][field] = toTraverse[j]?.[field]?.[i];
      }
    }
    if (maxLength !== 0) {
      functionToRun(toReturn, runIndex);
      runIndex++;
    }
    firstTime = false;
  }
}


function project$1(paths, json, removeWithDelete=true) {
  const toDelete = Symbol();
  let copy;
  if (json === null || json === undefined ) return json
  if (Array.isArray(json)) copy = [];
  else if (Object.getPrototypeOf(json) === Object.prototype) copy = {};
  else if (Array.isArray(paths) === false) throw new Error('paths must be an array')
  else if (paths.filter(el => el === '+$').length - paths.filter(el => el === '-$').length > 0) return json
  else return undefined

  paths.forEach((pathWithSign) => {
    if (pathWithSign[0] !== '+' && pathWithSign[0] !== '-') {
      throw new Error('ivanlid format')
    }
    const isInclude = pathWithSign[0] === '+';
    const path = pathWithSign.substring(1);

    const result = JSONPath({ resultType: 'all', path, json });

    let pendingToFilter= new Map();

    result.forEach(({ pointer, value }, index) => {
      const setAtPath = pointer.substring(1).split('/');

      if (setAtPath.length === 1 && setAtPath[0] === '') copy = isInclude ? collectionClone(value) : undefined; 
      else {
        if(removeWithDelete === true && isInclude === false) {
          const parentPath = setAtPath.slice(0,-1);
          const parent = getAt(copy, parentPath);
        
          if(Array.isArray(parent) === true) {
            // Arrays are stored in a map to be reviewed later to filter out the items mark for deletion.
            pendingToFilter.set(parentPath.join('/'), parent);
            // mark element for deletion
            setAt(copy, setAtPath, toDelete);
          }else {
            const fieldToDelete = setAtPath[setAtPath.length -1];
            delete parent[fieldToDelete];
            setAt(copy, parentPath, parent);
          }

        }else
          setAt(copy, setAtPath, isInclude ? collectionClone(value) : undefined);
      }
    });
    
    pendingToFilter.forEach((parent, parentPath) => {
      const compactingDeleteItems = parent.filter(el => el !== toDelete);
      setAt(copy, parentPath.split('/'), compactingDeleteItems);
    });

  });

  return copy
}
// {
//   const users = [
//     {
//       name: 'Jose',
//       age: 47,
//       salary: 52000,
//       posts: [
//         { id: 1, message: 'test', likes: 2 },
//         { id: 2, message: 'test1', likes: 2 },
//         { id: 3, message: 'test2', likes: 2 },
//       ],
//     },
//     {
//       name: 'Luchi',
//       age: 49,
//       salary: 52000,
//       twoLevels: {a:3},
//       posts: [
//         { id: 1, message: 'testL', likes: 2 },
//         { id: 2, message: 'testL1', likes: 2 },
//         { id: 3, message: 'testL2', likes: 2 },
//       ],
//     },
//   ]

//   const pathToSelect = ['+$', '-$[*].age', '-$[*].twoLevels.a', '-$[*].posts[:-1]'] //, '-$[*].age'];

//   project(pathToSelect, users) //?
//   project(['+$[*].posts[0,2]', '-$[*].posts[1]'], users) //?
//   project(['+$.a.b','-$.a.b.d'], {a:{b:{c:3,d:5,e:9}}}) //?
//   project(['+$'], 2) //?
// }

function copyPropsWithValueUsingRules(objDest, copyRules, shouldUpdateOnlyEmptyFields = false) {

  return function (inputObj) {
    copyRules.map(
      (rule) => {
        let from, to;
        if (typeof rule === 'object') {
          from = rule.from;
          to = rule.to;
        } else {
          from = rule;
          to = rule;
        }

        let valueToCopy = getAt(inputObj, from);

        if(typeof rule.transform === 'function') {
          valueToCopy = rule.transform(valueToCopy);
        }

        if (valueToCopy === undefined || valueToCopy === null) return

        if (shouldUpdateOnlyEmptyFields === true && isEmpty$1(getAt(objDest, to)))
          setAt(objDest, to, valueToCopy);

        if (shouldUpdateOnlyEmptyFields === false)
          setAt(objDest, to, valueToCopy);

      }
    );

    return objDest
  }
}
// {
//   let objTo = {a:{b:2},c:3}
//   let objFrom = {a:{b:4},c:8,d:{e:{f:12}},l:5}
//   copyPropsWithValueUsingRules(objTo, [{from:'a.b', to:'c'}, {from:'d.e.f', to:'d'}])(objFrom)
//   objTo
// }
// {
//   let objTo = {a:{b:2},c:3}
//   let objFrom = {a:{b:4},c:8,d:{e:{f:12}}, l:5}
//   copyPropsWithValueUsingRules(objTo, 
//     [
//       {from:'a.b', to:'c'},
//       {from:'d.e.f', to:'d.f'},
//       {from:'d.e.g', to:'d.g'}
//     ],
//     true
//   )(objFrom)
//   objTo
// }
// {
//   let objTo = {a:{b:2},c:12}
//   let objFrom = {a:{b:4},g:"2228",d:{e:{f:12}}, l:5}
//   copyPropsWithValueUsingRules(objTo, 
//     [
//       {from:'g', to:'e', transform: parseInt},
//       {from:'d.e.f', to:'d.f'},
//       {from:'d.e.g', to:'d.g'}
//     ],
//     true
//   )(objFrom)
//   objTo
// }

function copyPropsWithValue(objDest, shouldUpdateOnlyEmptyFields = false) {
  return function (inputObj) {
    traverse$1(inputObj, (nodeValue, currentPath) => {

      if (isALeaf(nodeValue) === false) return

      if (nodeValue === undefined || nodeValue === null || currentPath.length === 1) return

      const destPath = currentPath.slice(1 - currentPath.length);

      if (shouldUpdateOnlyEmptyFields === true) {
        const valueAtDest = getAt(objDest, destPath);
        if (isEmpty$1(valueAtDest)) setAt(objDest, destPath, nodeValue);

        return
      }

      setAt(objDest, destPath, nodeValue); //?

    });

    return objDest
  }
}
// {
//   let objTo = { a: { b: 2 }, c: 3, h: { i: 3 } }
//   let objFrom = { a: { b: 4 }, c: undefined, d: { e: { f: 12 } } }
//   copyPropsWithValue(objTo)(objFrom) //?
//   objTo
// }
// {
//   let objTo = { a: { b: 2 }, c: 3, h: { i: 3 } }
//   let objFrom = { a: { b: 4 }, c: '', d: { e: { f: 12 } } }
//   copyPropsWithValue(objTo, undefined, true)(objFrom) //?
//   objTo
// }

function isALeaf(node) {
  const isABranch =
    (node?.constructor.name === 'Object' && Object.keys(node).length > 0) ||
    (node?.constructor.name == 'Array' && node.length > 0);

  return !isABranch
}
// isALeaf(undefined) //?
// isALeaf({a:'this is a leaf'}.a) //?
// isALeaf(new Date()) //?
// isALeaf([]) //?
// isALeaf({}) //?
// isALeaf({a:3}) //?
// isALeaf([undefined]) //?

function isEmpty$1(value) {
  if (
    value === undefined ||
    value === null ||
    value === '' ||
    value === 0 ||
    value === 0n ||
    value !== value ||
    (Array.isArray(value) && value?.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  ) return true

  return false
}
//isEmpty(0) //?

function firstCapital(str) {

  return typeof str === 'string' ? str[0].toUpperCase() + str.substring(1).toLowerCase() : str
}


function queryObjToStr(query) {
  return Object.keys(query).reduce((acum, current) => {
    const newAcum = acum ? acum + '&' : acum;
    return newAcum + current + '=' + query[current]
  }, '')
}

function varSubsDoubleBracket(strToResolveVars, state, mode) {
  if (typeof strToResolveVars !== 'string') {
    return strToResolveVars
  }

  // regex to deal with the case the entire value is a substitution group
  // let regexVar = /"{{(.*?)(?:=(.*?))?}}"/g
  // ask ChatGPT to do a more performant regex without look ahead
  let regexVar = /"{{([^=}]+)(?:=([^}]+))?}}"/g;

  let resultStr = strToResolveVars.replace(
    regexVar,
    (_notused, group1, group2) => {
      if (state && state[group1] !== undefined) {
        if (typeof state[group1] === 'string') return '"' + state[group1] + '"'
        else if (typeof state[group1] === 'object') {
          if (mode === 'url' && Array.isArray(state[group1]))
            return arrayToListQuery(state[group1])
          if (mode === 'url' && !Array.isArray(state[group1]))
            return objToQueryParams(state[group1])
          if (!mode) return JSON.stringify(state[group1])
        } else return state[group1]
      } else {
        if (group2 === undefined) return null
        //else if(group2.substring(0,2) === '\\"' && group2.substring([group2.length -1],2) === '\\"') return ('"' + group2 + '"')
        else return group2.replace(/\\"/g, '"')
      }
    }
  );

  // regex to do partial substitution of a group inside of a string value
  // let regexVarPartial = /{{(.*?)(?:=(.*?))?}}/g
  // ask ChatGPT to do a more performant regex without look ahead
  let regexVarPartial = /{{([^=}]+)(?:=([^}]+))?}}/g;


  let resultStrFinal = resultStr.replace(
    regexVarPartial,
    (_notused, group1, group2) => {
      if (state && state[group1] !== undefined) {
        if (typeof state[group1] === 'object') {
          if (mode === 'url' && Array.isArray(state[group1]))
            return arrayToListQuery(state[group1])
          if (mode === 'url' && !Array.isArray(state[group1]))
            return objToQueryParams(state[group1])
          if (!mode) return JSON.stringify(state[group1])
        } else return state[group1]
      } else {
        if (group2 === undefined) return null
        //else if(group2.substring(0,2) === '\\"' && group2.substring([group2.length -1],2) === '\\"') return ('"' + group2 + '"')
        else return group2.replace(/\\"/g, '')
      }
    }
  );

  return resultStrFinal
}
// varSubsDoubleBracket(`
// {
//   "response": {
//     "id": 1231,
//     "description": "{{description=\"This is a test\"}}",
//     "car": "{{plate}}",
//     "active": "{{active=true}}",
//     "ratenumber": "{{rate=10}}"
//   }
// }`, {plate:{a:3}, active:false}) //?

// varSubsDoubleBracket('https://bank.account?accounts={{accounts}}&c=3', {accounts:['10232-1232','2331-1233']},'url') //?
// varSubsDoubleBracket('https://bank.account?{{params=a=1&b=2}}&c=3', {params:{a:'10232-1232',b:'2331-1233'}},'url') //?
// varSubsDoubleBracket('https://bank.account?{{params=a=1&b=2}}&c=3', {},'url') //?

function arrayToListQuery(arr) {
  return arr.reduce((prev, curr) => prev + ',' + curr)
}

function objToQueryParams(obj) {
  return Object.keys(obj)
    .reduce((acum, curr) => acum + curr + '=' + obj[curr] + '&', '')
    .slice(0, -1)
}

function urlCompose(gatewayUrl, serviceName, servicePath) {
  return {
    gatewayUrl,
    serviceName,
    servicePath,
    url: gatewayUrl + serviceName + servicePath
  }
}

function urlDecompose(url, listOfServiceNames) {
  return listOfServiceNames
    .filter(elem => url.split(elem).length >= 2)
    .map(elem => {
      const [part1, ...restParts] = url.split(elem);
      return {
        gatewayUrl: part1,
        serviceName: elem,
        servicePath: restParts.join(elem)
      }
    })
}

function indexOfNthMatch(string, toMatch, nth) {
  return string.split(toMatch, nth).join(toMatch).length
}


function toDate(date)
{
  return date
      ? date instanceof Date
        ? date
        : new Date(date)
      : new Date()
}

function isDate(d) {
  return d instanceof Date && !isNaN(d);
}

function isStringADate(stringDate) {
  if (typeof stringDate !== 'string') return false

  return isDate(new Date(stringDate))
}

function dateFormatter(format) {
  return (date) => formatDate(format, date)
}

function formatDate(format, date) {
  let dateToProcess = toDate(date);

  if (isDate(dateToProcess) === false) return undefined


  const months = new EnumMap({
    'January': '01',
    'February': '02',
    'March': '03',
    'April': '04',
    'May': '05',
    'June': '06',
    'July': '07',
    'August': '08',
    'September': '09',
    'October': '10',
    'November': '11',
    'December': '12'
  });

  const indexMonths = months.invert();

  const days = new EnumMap({
    'Sunday': '0',
    'Monday': '1',
    'Tuesday': '2',
    'Wednesday': '3',
    'Thursday': '4',
    'Friday': '5',
    'Saturday': '6'
  });

  const indexDays = days.invert();

  const dateIsoString = dateToProcess.toISOString();

  const YYYY = dateIsoString.substring(0, 4);
  const YY = dateIsoString.substring(2, 4);
  const MM = dateIsoString.substring(5, 7);
  const DD = dateIsoString.substring(8, 10);
  const D = parseInt(DD, 10).toString();
  const hh = dateIsoString.substring(11, 13);
  const h = parseInt(hh, 10).toString();
  const mm = dateIsoString.substring(14, 16);
  const ss = dateIsoString.substring(17, 19);
  const mil = dateIsoString.substring(20, 23);
  const mi = dateIsoString.substring(20, 22);

  const month = indexMonths[MM];
  const dayOfWeek = indexDays[dateToProcess.getDay()];

  return format
    .replace(/\$YYYY/g, YYYY)
    .replace(/\$YY/g, YY)
    .replace(/\$MM/g, MM)
    .replace(/\$DD/g, DD)
    .replace(/\$D/g, D)
    .replace(/\$hh/g, hh)
    .replace(/\$h/g, h)
    .replace(/\$mm/g, mm)
    .replace(/\$ss/g, ss)
    .replace(/\$mil/g, mil)
    .replace(/\$mi/g, mi)
    .replace(/\$month/g, month)
    .replace(/\$dayOfWeek/g, dayOfWeek)

}
//formatDate('$YYYY-$MM-$DD', new Date('2021-02-28')) //?

function YYYY_MM_DD_hh_mm_ss_ToUtcDate(dateYYYY_MM_DD_hh_mm_ss) {
  // Input format has 1 char (any could work) between each elements: years, months, days, hours, minutes and seconds
  const dateYYYY = parseInt(dateYYYY_MM_DD_hh_mm_ss.substring(0, 4));
  const dateMM = parseInt(dateYYYY_MM_DD_hh_mm_ss.substring(5, 7)) - 1; // Months start with 0
  const dateDD = parseInt(dateYYYY_MM_DD_hh_mm_ss.substring(8, 10));
  const datehh = parseInt(dateYYYY_MM_DD_hh_mm_ss.substring(11, 13));
  const datemm = parseInt(dateYYYY_MM_DD_hh_mm_ss.substring(14, 16));
  const datess = parseInt(dateYYYY_MM_DD_hh_mm_ss.substring(17, 19));

  return Date.UTC(dateYYYY, dateMM, dateDD, datehh, datemm, datess)
}

function dateToObj(date) {
  let dateToProcess = toDate(date);

  if (isDate(dateToProcess) === false) return undefined

  let ISODate = dateToProcess.toISOString();

  return {
    YYYY: parseInt(ISODate.substring(0, 4)),
    MM: parseInt(ISODate.substring(5, 7)),
    DD: parseInt(ISODate.substring(8, 10)),
    hh: parseInt(ISODate.substring(11, 13)),
    mm: parseInt(ISODate.substring(14, 16)),
    ss: parseInt(ISODate.substring(17, 19)),
    mil: parseInt(ISODate.substring(20, 23))
  }
}
//dateToObj() //?
// const toPeriod = new Date()
// const fromPeriod = `${dateToObj(toPeriod).YYYY - 3}${formatDate('-$MM-$DD', toPeriod)}` 
// fromPeriod //?

function diffInDaysYYYY_MM_DD(iniDate, endDate) {
  return Math.ceil(
    (
      new Date(endDate) - new Date(iniDate)
    ) / (1000 * 60 * 60 * 24)
  ) //?
}

function subtractDays(daysToSubtract, date) {
  let dateToProcess = toDate(date);

  if (isDate(dateToProcess) === false) return dateToProcess

  return new Date(dateToProcess.valueOf() - 864E5*daysToSubtract)
}
// subtractDays(2, "2023-03-26").toISOString() //?
// subtractDays(3, "2023-03-27").toISOString() //?
// subtractDays(9, "2023-04-02").toISOString() //?

function addDays(daysToAdd, date) {
  let dateToProcess = toDate(date);

  if (isDate(dateToProcess) === false) return dateToProcess

  return new Date(dateToProcess.valueOf()+864E5*daysToAdd)
}
// addDays(2, "2023-03-24").toISOString() //?
// addDays(3, "2023-03-24").toISOString() //?
// addDays(9, "2023-03-24").toISOString() //?


function previousDayOfWeek(dayOfWeek, date) {
  let dateToProcess = toDate(date);

  if (isDate(dateToProcess) === false) return dateToProcess

  let diffInDaysOfWeek = dateToProcess.getDay() - dayOfWeek;

  let toSubtract = diffInDaysOfWeek >= 0
    ? diffInDaysOfWeek
    : 7 + diffInDaysOfWeek;

  return subtractDays(toSubtract, dateToProcess)
}
//previousDayOfWeek(6,new Date('2021-05-07')) //?
//previousDayOfWeek(1,new Date('2021-03-25')) //?

function getSameDateOrPreviousFridayForWeekends(date) {
  let dateToProcess = toDate(date);

  if (isDate(dateToProcess) === false) return dateToProcess

  const dayOfWeek = dateToProcess.getUTCDay();

  if (dayOfWeek > 0 && dayOfWeek < 6) return dateToProcess

  //Sunday
  if (dayOfWeek === 0) return subtractDays(2, dateToProcess)

  //Saturday (dayOfWeek === 6)
  return subtractDays(1, dateToProcess)
}
// getSameDateOrPreviousFridayForWeekends() //?
// //2021-05-14T00:00:00.000Z
// getSameDateOrPreviousFridayForWeekends(new Date('2021-05-15')).toISOString() //?
// ////2021-05-14T00:00:00.000Z
// getSameDateOrPreviousFridayForWeekends(new Date('2021-05-16')).toISOString() //?

function isDateMidnight(date) {
  return date?.toISOString?.()?.substring(10, 24) === 'T00:00:00.000Z'
}

function setDateToMidnight(date) {

  if(typeof date === 'string') return new Date(date.substring(0,10))

  let dateToProcess = date === undefined 
    ? new Date()
    : isDate(date)
      ? date
      : new Date(date);

  if(isNaN(+dateToProcess)) return dateToProcess

  if(isDateMidnight(dateToProcess)) return dateToProcess

  return new Date(dateToProcess.toISOString().substring(0,10))
}

const {
  colors,
  colorMessage,
  colorMessageByStatus,
  colorByStatus
} = (function () {
  //alias
  const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    blue: '\x1b[34m',
    //most importants
    reset: '\x1b[0m',
    reverse: '\x1b[7m',
    fgBlack: '\x1b[30m',
    fgRed: '\x1b[31m',
    fgGreen: '\x1b[32m',
    fgYellow: '\x1b[33m',
    //Others
    fgBlue: '\x1b[34m',
    fgMagenta: '\x1b[35m',
    fgCyan: '\x1b[36m',
    fgWhite: '\x1b[37m',
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    hidden: '\x1b[8m'
  };

  const colorMessage = (message, color) =>
    colors[color] + message + colors.reset;

  const colorMessageByStatus = (message, status) => {
    let colorStatus

      ; (status >= 200) & (status < 300)
        ? (colorStatus = colors.green)
        : (status >= 300) & (status < 400)
          ? (colorStatus = colors.cyan)
          : (status >= 400) & (status < 500)
            ? (colorStatus = colors.yellow)
            : (colorStatus = colors.red);

    return colorStatus + message + colors.reset
  };

  const colorByStatus = status => {
    let colorStatus

      ; (status >= 200) & (status < 300)
        ? (colorStatus = colors.green)
        : (status >= 300) & (status < 400)
          ? (colorStatus = colors.cyan)
          : (status >= 400) & (status < 500)
            ? (colorStatus = colors.yellow)
            : (colorStatus = colors.red);

    return colorStatus
  };

  return { colors, colorMessage, colorMessageByStatus, colorByStatus }
})();

function findDeepKey(objIni, keyToFind) {
  const currentPath = [];
  const result = [];

  traverse(objIni);

  function traverse(obj) {
    for (const prop in obj) {
      if (prop === keyToFind) {
        result.push([...currentPath]);
        result[result.length - 1].push(prop);
        result.push(obj[prop]);
      }

      if (obj[prop] !== null && typeof obj[prop] == 'object') {
        currentPath.push(prop);
        traverse(obj[prop]);
        currentPath.pop();
      }
    }
  }
  return result
}
// {
//   findDeepKey([{a:{astra:2}},{astra:5}], 'astra') //?
// }
function deepFreeze(o) {
  Object.getOwnPropertyNames(o).forEach(prop => {
    if (
      o[prop] !== null &&
      (typeof o[prop] === 'object' || typeof o[prop] === 'function')
    ) {
      deepFreeze(o[prop]);
    }
  });

  Object.freeze(o);

  return o
}

function getAt(obj, valuePath) {
  if (obj === undefined || obj === null || valuePath === undefined || valuePath === null) {
    return
  }

  if (valuePath === '') return obj

  let result = obj;

  const valuePathArray = typeof valuePath === 'string' ? valuePath.split('.') : valuePath;

  for (let o of valuePathArray) {
    if (result === undefined) return result

    if (
      (result instanceof Object)
    ) {
      if (o === '$last' && Array.isArray(result)) result = result[result.length - 1];
      else result = result[o];
    } else {
      result = undefined;
    }
  }

  return result
}


// getAt(undefined, '') //?
// getAt(5, '') //?
// getAt({arr:[1,2,{b:3}],j:{n:3}}, 'j') //?
// getAt({arr:[1,2,{b:3}],j:{n:3}}, 'arr.$last.b') //?
// getAt({arr:[1,2,{b:3}],j:{n:3}}, 'j') //?


function setAt(obj, valuePath, value) {
  // modified the value of an existing property:   {a:8} ==> 'a' with 12 => {a:12}
  const MODIFIED = 'MODIFIED';

  // added another property to an existing object: {a:8} ==> 'b' with 14 => {a:8,b:14}   --or--   {a:{c:8}} == 'a.b' with 14 => {a:{c:8, b:14}}
  const ADDED = 'ADDED';

  // The path provoked the creation of a new object that was nested.
  // Examples: {a:8} == 'a.b' with 3 => {a:{b:3}}  --or--   {a:{b:3}} == 'c.d' with 3 => {a:{b:3},c:{d:3}}
  // Before the request the penultimate path item is not an object. As in: a of 'a.b' ... or c of 'c.d' for the above examples
  const CREATED = 'CREATED';

  const FAILED = 'FAILED';

  let result = obj;
  let valueReturn = FAILED;
  let valuePathArray;

  if (obj === undefined || obj === null || valuePath === undefined || valuePath === null) {
    throw { name: 'setAtParamsException', msg: 'obj: ' + obj + ', valuePath: ' + valuePath + ', value: ' + value }
  }

  try {
    valuePathArray = typeof valuePath === 'string' ? valuePath.split('.') : valuePath;
    for (let i = 0, j = valuePathArray.length; i < j; i++) {

      let field = nameToIndex(result, valuePathArray[i]);
    
      if (i === (valuePathArray.length - 1)) {
        if (result?.[valuePathArray[i]] !== undefined) {
          if (valueReturn !== CREATED) valueReturn = MODIFIED;
        } else {
          if (valueReturn !== CREATED) valueReturn = ADDED;
        }

        result[field] = value;
      } else {
        if (typeof result[field] !== 'object') {
          if (Number.isNaN(Number(valuePathArray[i + 1]))) result[field] = {};
          else result[field] = [];

          valueReturn = CREATED;
        }

        result = result[field];
      }
    }
    if (valueReturn === FAILED) {
      throw { name: 'setAtException', msg: 'obj: ' + obj + ', valuePath: ' + valuePath + ', value: ' + value }
    }
  }
  catch (e) {
    console.log(e + ' Warning: There was an exception in setAt(obj, valuePath, value)... obj: ' + obj + ' valuePath: ' + valuePath + ' value: ' + value);
    valueReturn = FAILED;
    return valueReturn
  }
  return valueReturn

  function nameToIndex(obj, field)
  {
    if (Array.isArray(obj) && field === '$last') {
      return obj.length - 1
    }

    if (Array.isArray(obj) && field === '$push') {
      return obj.length 
    }

    if (Array.isArray(obj) && parseInt(field) < 0) {
      return obj.length + parseInt(valuePathArray[i])
    }

    return field
  }
}

const sorterByPaths = (paths, isAsc = true) => {
  let great = 1;
  let less = -1;

  if (isAsc === false) {
    great = -1;
    less = 1;
  }

  let pathArr;
  if (typeof paths === 'string') pathArr = [paths];
  else pathArr = [...paths];

  return (objA, objB) => {

    for (let currentPath of pathArr) {
      if ( (getAt(objA, currentPath)??-Infinity) > (getAt(objB, currentPath)??-Infinity) ) return great
      else if( (getAt(objA, currentPath)??-Infinity) < (getAt(objB, currentPath)??-Infinity) ) return less
    }

    return 0
  }

};
// console.log(
//   [{a:{b:3}}, {a:{b:2}}, {a:{b:5}}, {a:{b:4}}].sort(sorterByPaths('a.b')),
//   [{a:{b:3}}, {a:{b:2}}, {a:{b:5}}, {a:{b:4}}].sort(sorterByPaths('a.b', true)),
//   [{a:{b:3}}, {a:{b:2}}, {a:{b:5}}, {a:{b:4}}].sort(sorterByPaths('a.b', false)),
//   [{a:{b:3}}, {a:{b:2}}, {a:{b:5}}, {a:{b:4}}].sort(sorterByPaths(['a.b'], false)),
//   [{a:{b:3,c:2}}, {a:{b:3,c:1}}, {a:{b:5}}, {a:{b:4}}].sort(sorterByPaths(['a.b','a.c'], true)),
//   [{a:3},{a:4},{a:undefined},{a:2},{a:1},{a:undefined},{a:0},{a:undefined}].sort(sorterByPaths(['a']))
// )

function filterFlatMap(mapWithUndefinedFilterFun, data) {
  let result = [];
  let resultSize = 0;
  let mappedItem;

  for (let index = 0, dataLength = data.length; index < dataLength; index++) {
    mappedItem = mapWithUndefinedFilterFun(data[index], index, data);

    if (mappedItem !== undefined) {
      if (Array.isArray(mappedItem) === true) {
        for (let mappedItemIndex = 0, mappedItemLength = mappedItem.length; mappedItemIndex < mappedItemLength; mappedItemIndex++) {
          if (mappedItem[mappedItemIndex] !== undefined) result[resultSize++] = mappedItem[mappedItemIndex];
        }
      } else {
        result[resultSize++] = mappedItem;
      }

    }
  }

  return result
}
// filterFlatMap(
//   (elem, index)=> {
//     if(index === 0) return [elem, elem + 2, undefined]
//     if(index === 1) return elem + 2
//     if(index === 2) return undefined
//     if(index === 5) return [undefined]
//     if(index === 6) return []

//     return elem
//   }
//   , [1,4,13,3,8,9,11]) //?

const arraySorter = (isAsc = true) =>
  (a, b) => {
    if (isAsc === false) {
      if (a < b) return 1
      if (a > b) return -1
      return 0
    }

    if (a < b) return -1
    if (a > b) return 1
    return 0
  };
// [1, 4, 3, 6].sort(arraySorter()); //?
// ['as', 'dc', 'ce', ' as'].sort(arraySorter(false)); //?
// [new Date('2020-01-01'), new Date('2021-01-05')].sort(arraySorter(true)); //?


function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function sleepWithValue(ms, value) {
  const clonedValue = collectionClone(value);
  return new Promise(resolve =>
    setTimeout(() => resolve(clonedValue), ms)
  )
}

function sleepWithFunction(ms, func, ...params) {
  const clonedParams = collectionClone(params);
  return new Promise(resolve =>
    setTimeout(() => resolve(func(...clonedParams)), ms)
  )
}

async function retryWithSleep(times, updateSleepTimeFun, funToRun, funToRunParams, shouldStopRetrying) {
  let result;
  let currentSleepTime = 0;

  for (let index = 0; index < times; index++) {
    if (index > 0) await sleep(currentSleepTime);

    try {
      result = await funToRun(...funToRunParams);
    } catch (e) {
      if (index === times - 1) throw e
      result = e;
    }

    if (shouldStopRetrying === undefined && ((result instanceof Error) === false)) {
      return result
    }

    try {
      if (shouldStopRetrying?.(result) === true) return result
    } catch (e) {
      console.log('Called to shouldStopFun failed with params: ', { currentSleepTime, index });
      console.log('Throwing exception...');
      throw e
    }

    const extractError = result?.message ?? result?.error ?? result?.code ?? result?.status ?? result?.status ?? result?.name;
    console.log(`Iteration: ${index + 1} sleepTime: ${currentSleepTime} Error: ${extractError}`);

    try {
      currentSleepTime = updateSleepTimeFun(currentSleepTime, index);
    } catch (e) {
      console.log('Calling updateSleepTimeFun failed with params: ', { currentSleepTime, index });
      throw e
    }

  }

  return result

}
// retryWithSleep(
//   10, 
//   (_, index) => 300 + index*500, 
//   (input)=> Math.random() < 0.9 ? new Error('Error...'): {value:'OK',status:'Didnt failed'}, 
//   []
// )
//   .then(result => console.log(result))

// retryWithSleep(
//   10, 
//   (_, index) => 300 + index*500, 
//   (input)=> {input.total = input.total + Math.random(); return input}, 
//   [{total:0}],
//   (currentResult) => currentResult.total > 5? true: false
// )
//   .then(result => console.log(result))

const notTo = funct => (...params) => !funct(...params);

function pushUniqueKey(row, table, indexes = [0]) {

  const keyOfRowToInsert = key(row, indexes);

  if (
    table.find(rowTable => key(rowTable, indexes) === keyOfRowToInsert)
    ===
    undefined
  ) {
    table.push(row);
    return row
  }

  return undefined

  ////
  function key(row, indexes) {
    //if (Array.isArray(row) === false) return row
    if (typeof row !== 'object') return row

    return indexes.reduce((acum, current, index) => acum + `-${index}-` + row[current], '')
  }

}
// pushUniqueKey(
//   [2,3],
//   [[1,2],[2,3],[1,3]],
//   [0,1]
// ) //?
// pushUniqueKey(
//   [2,4],
//   [[1,2],[2,3],[1,3]],
//   [0,1]
// ) //?
// pushUniqueKey(
//   4,
//   [1,2],
// ) //?
// pushUniqueKey(
//   2,
//   [1,2],
// ) //?
// pushUniqueKey(
//   {a:2,b:4},
//   [{a:1,b:2},{a:2,b:5},{a:3,b:4}],
//   ['a','b']
// ) //?
// pushUniqueKey(
//   {a:2,b:4},
//   [{a:1,b:2},{a:2,b:4},{a:3,b:4}],
//   ['a','b']
// ) //?


function pushUniqueKeyOrChange(newRow, table, indexes = [0], mergeFun) {

  if (pushUniqueKey(newRow, table, indexes) === undefined) {

    const newRowKey = key(newRow, indexes);
    return table.map(
      (existingRow) => {
        if (newRowKey === key(existingRow, indexes)) return mergeFun(newRow, existingRow)

        return existingRow
      }
    )
  }

  return table

  ////
  function key(row, indexes) {
    //if (Array.isArray(row) === false) return row
    if (typeof row !== 'object') return row

    return indexes.reduce((acum, current, index) => acum + `-${index}-` + row[current], '')
  }

}
// pushUniqueKeyOrChange(
//   [1,3],
//   [[1,2],[2,3],[1,3]],
//   [0],
//   (newRow, existingRow) => [newRow[0] + existingRow[0], newRow[1] + existingRow[1]]
// ) //?

function pushAt(pos, value, arr) {
  if (Array.isArray(arr) === false) throw new CustomError('PUSHAT_LAST_PARAMETER_MUST_BE_ARRAY')

  // if(pos >= arr.length) {
  //   arr[pos] = value 
  //   return arr
  // }

  const length = arr.length;
  repeat$1(arr.length - pos).times(index => arr[length - index] = arr[length - index - 1]);
  arr[pos] = value;
  return arr

}
// pushAt(0,2,[]) //?
// pushAt(0,2,[1,2,3]) //?
// pushAt(5,2,[1,2,3]) //?

function memoize() {
  const resultsMap = new Map();

  function memoizeMap(func, ...params) {
    let key = JSON.stringify(params);
    let result = resultsMap.get(key);

    if (result === undefined && resultsMap.has(key) === false) {
      result = func(...params);
      resultsMap.set(key, result);
    }

    return result
  }

  function memoizeWithHashFun(func, hashFunc, ...params) {
    let key = JSON.stringify(hashFunc(params));
    let result = resultsMap.get(key);

    if (result === undefined && resultsMap.has(key) === false) {
      result = func(...params);
      resultsMap.set(key, result);
    }

    return result
  }

  return { memoizeMap, memoizeWithHashFun }

}

// const plus = (a,b) => a+b
// const plusMem = memoize()
// plusMem(plus, 2,3) //?
// plusMem(plus, 2,3) //?
// plusMem(plus, 3,3) //?
//

function fillWith(mapper, lenOrWhileTruthFun) {
  let result = [];

  let isWhileTruthFun =
    typeof lenOrWhileTruthFun === 'function'
      ? lenOrWhileTruthFun
      : (index) => index < lenOrWhileTruthFun;

  let index = -1;
  let isWhileTruth;
  do {
    index++;
    result[index] = mapper(index, result);
    isWhileTruth = isWhileTruthFun(index, result);
    if (!isWhileTruth) result.pop();
  } while (isWhileTruth)

  return result
}
// console.log(
//   fillWith(
//     (index) => index*2,
//     (index, result) => result[index] < 12
//   ) //?
// )

// console.log(
//   fillWith(
//     (index) => index*2,
//     12
//   ) //?
// )



// can be called with list of parameters or with array.
//console.log(replaceAll('I like red cars and red houses', {from:'red',to:'yellow'},{from:'e',to:'E'}))
//console.log(replaceAll('I like red cars and red houses', [{from:'red',to:'yellow'},{from:'e',to:'E'}]))
function replaceAll(str, ...fromTo) {
  if (fromTo[0][0].from !== undefined) fromTo = fromTo[0];

  return fromTo.reduce(
    (acum, current) =>
      acum.split(current.from).join(current.to)
    , str
  )
}

function cleanString(str) {
  return str.replace(/([^a-z0-9 .,]+)/gi, '').replace(/  */g, ' ').trim()
}
//cleanString('  Only let%ters,%% numbers 1,2,3 d@ot &*&an(((d co[mma. Text is trimmed   ')  ===  
//  'Only letters, numbers 1,2,3 dot and comma. Text is trimmed' //?

function repeat$1(numberOfTimes) {
  let toReturn = [];
  function times(funToRepeat) {
    for (let index = 0; index < numberOfTimes; index++) {
      toReturn[index] = funToRepeat(index);
    }

    return toReturn
  }

  async function awaitTimes(funToRepeat) {
    for (let index = 0; index < numberOfTimes; index++) {
      toReturn[index] = await funToRepeat(index);
    }

    return toReturn
  }

  function value(value) {
    return Array(numberOfTimes).fill(value)
  }

  return { times, awaitTimes, value }
}
// repeat(8).times((index) => {
//   console.log(index)
// })

// repeat(8).value(0) //?

function oneIn(period) {

  let count = 0;

  function call(runFunc) {

    function toExecute(...args) {

      if (count === 0) {
        count = period - 1;
        return runFunc(...args)
      }
      count--;
    }

    toExecute.reset = () => count = 0;

    return toExecute
  }

  return { call }
}

// let myRunEvery = oneIn(3).call((txt1, txt2, txt3)=>{console.log(txt1, txt2, txt3);return 3})
// myRunEvery('jose','is great', '...') //?
// myRunEvery('jose','is great', '...') //?
// myRunEvery('jose','is great', '...') //?
// myRunEvery('jose','is great', '...') //?
// myRunEvery('jose','is great', '...') //?
// myRunEvery.reset()
// myRunEvery('jose','is great', '...') //?
// myRunEvery('jose','is great', '...') //?
// myRunEvery('jose','is great', '...') //?



function* loopIndexGenerator(initValue, iterations) {
  let count = 0;

  while (true) {
    yield initValue + count % iterations;
    count++;
  }
}
// let cycles = loopIndexGenerator(2, 3)
// cycles.next() //?
// cycles.next() //?
// cycles.next() //?
// cycles.next() //?
// cycles.next() //?


function processExit(error) {
  console.log(`Shutting down with error: ${error}`);
  try {
    process.exit(1);
  } catch (e) {
    console.log(e);
  }
}

const jsUtils = {
  logWithPrefix,
  firstCapital,
  varSubsDoubleBracket,
  queryObjToStr,
  CustomError,
  urlCompose,
  urlDecompose,
  indexOfNthMatch,
  colors,
  colorMessage,
  colorMessageByStatus,
  colorByStatus,
  findDeepKey,
  deepFreeze,
  getAt,
  setAt,
  sorterByPaths,
  filterFlatMap,
  arraySorter,
  isPromise,
  sleep,
  sleepWithValue,
  sleepWithFunction,
  notTo,
  arrayToObject,
  arrayOfObjectsToObject,
  removeDuplicates,
  traverse: traverse$1,
  traverseVertically,
  project: project$1,
  copyPropsWithValue,
  copyPropsWithValueUsingRules,
  EnumMap,
  Enum,
  transition,
  pushUniqueKey,
  pushUniqueKeyOrChange,
  pushAt,
  memoize,
  fillWith,
  isDate,
  isEmpty: isEmpty$1,
  isStringADate,
  formatDate,
  dateFormatter,
  YYYY_MM_DD_hh_mm_ss_ToUtcDate,
  dateToObj,
  diffInDaysYYYY_MM_DD,
  subtractDays,
  addDays,
  previousDayOfWeek,
  getSameDateOrPreviousFridayForWeekends,
  isDateMidnight,
  setDateToMidnight,
  replaceAll,
  cleanString,
  repeat: repeat$1,
  oneIn,
  loopIndexGenerator,
  retryWithSleep,
  processExit
};

function cloneCopy(to, from, firstCleanTo, shallow) {


  if (firstCleanTo) {
    Object.setPrototypeOf(to, Object.getPrototypeOf(from));

    for (let prop in to) {
      if (to.hasOwnProperty(prop)) {
        delete to[prop];
      }
    }
  }


  if (shallow) {
    for (let prop in from) {
      if (from.hasOwnProperty(prop)) {
        to[prop] = from[prop];
      }
    }
  } else {
    for (let prop in from) {
      if (from.hasOwnProperty(prop)) {
        to[prop] = collectionClone(from[prop]); //, reviverPromiseForCloneDeep)
      }
    }
  }

  return to
}

function wildcardToRegExp(pathSearch, flagsString, separator = '.',matchFromStart = true, matchToEnd = true) {

  let escSeparator = escapeRegExp(separator);

  let result = pathSearch.split(separator).join(`${escSeparator}`);
  result = result.split('*').join(`[^${escSeparator}]*`);
  result = result.split(`[^${escSeparator}]*[^${escSeparator}]*`).join('.*');
  result = `${matchFromStart?'^':''}${result}${matchToEnd?'$':''}`;
  let regExToReturn = new RegExp(result, flagsString);

  return regExToReturn
}

function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}


function promiseAll(obj) {
  let objRoot = { root: obj };

  let toReturn = promiseAllRec(objRoot);

  if (jsUtils.isPromise(toReturn) === false) {
    toReturn = Promise.resolve(toReturn);
  }

  return toReturn.then(objRoot => objRoot.root)

  function promiseAllRec(objRoot) {
    const arrayOfPromises = [];
    const arrayOfRefToPromises = [];

    jsUtils.traverse(objRoot, (ref, _undefined, parent, son) => {
      if (jsUtils.isPromise(ref)) {
        arrayOfPromises.push(ref);
        arrayOfRefToPromises.push({ parent, son });
      }
    }, false);

    if (arrayOfPromises.length > 0) {
      return Promise.all(arrayOfPromises)
        .then((arrayOfResolutions) => {
          arrayOfResolutions.map((resolution, index) => {
            arrayOfRefToPromises[index].parent[arrayOfRefToPromises[index].son] = resolution;
          });
          return promiseAllRec(objRoot)
        })
    } else return objRoot
  }

}

/**
 * A function that always returns `false`. Any passed in parameters are ignored.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Function
 * @sig * -> Boolean
 * @param {*}
 * @return {Boolean}
 * @see R.T
 * @example
 *
 *      R.F(); //=> false
 */
var F$1 = function () {
  return false;
};

/**
 * A function that always returns `true`. Any passed in parameters are ignored.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Function
 * @sig * -> Boolean
 * @param {*}
 * @return {Boolean}
 * @see R.F
 * @example
 *
 *      R.T(); //=> true
 */
var T = function () {
  return true;
};

/**
 * A special placeholder value used to specify "gaps" within curried functions,
 * allowing partial application of any combination of arguments, regardless of
 * their positions.
 *
 * If `g` is a curried ternary function and `_` is `R.__`, the following are
 * equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2, _)(1, 3)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @name __
 * @constant
 * @memberOf R
 * @since v0.6.0
 * @category Function
 * @example
 *
 *      const greet = R.replace('{name}', R.__, 'Hello, {name}!');
 *      greet('Alice'); //=> 'Hello, Alice!'
 */
var __ = {
  '@@functional/placeholder': true
};

function _isPlaceholder(a) {
  return a != null && typeof a === 'object' && a['@@functional/placeholder'] === true;
}

/**
 * Optimized internal one-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */

function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}

/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */

function _curry2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;

      case 1:
        return _isPlaceholder(a) ? f2 : _curry1(function (_b) {
          return fn(a, _b);
        });

      default:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function (_a) {
          return fn(_a, b);
        }) : _isPlaceholder(b) ? _curry1(function (_b) {
          return fn(a, _b);
        }) : fn(a, b);
    }
  };
}

/**
 * Adds two values.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Math
 * @sig Number -> Number -> Number
 * @param {Number} a
 * @param {Number} b
 * @return {Number}
 * @see R.subtract
 * @example
 *
 *      R.add(2, 3);       //=>  5
 *      R.add(7)(10);      //=> 17
 */

var add =
/*#__PURE__*/
_curry2(function add(a, b) {
  return Number(a) + Number(b);
});

/**
 * Private `concat` function to merge two array-like objects.
 *
 * @private
 * @param {Array|Arguments} [set1=[]] An array-like object.
 * @param {Array|Arguments} [set2=[]] An array-like object.
 * @return {Array} A new, merged array.
 * @example
 *
 *      _concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
 */
function _concat(set1, set2) {
  set1 = set1 || [];
  set2 = set2 || [];
  var idx;
  var len1 = set1.length;
  var len2 = set2.length;
  var result = [];
  idx = 0;

  while (idx < len1) {
    result[result.length] = set1[idx];
    idx += 1;
  }

  idx = 0;

  while (idx < len2) {
    result[result.length] = set2[idx];
    idx += 1;
  }

  return result;
}

function _arity(n, fn) {
  /* eslint-disable no-unused-vars */
  switch (n) {
    case 0:
      return function () {
        return fn.apply(this, arguments);
      };

    case 1:
      return function (a0) {
        return fn.apply(this, arguments);
      };

    case 2:
      return function (a0, a1) {
        return fn.apply(this, arguments);
      };

    case 3:
      return function (a0, a1, a2) {
        return fn.apply(this, arguments);
      };

    case 4:
      return function (a0, a1, a2, a3) {
        return fn.apply(this, arguments);
      };

    case 5:
      return function (a0, a1, a2, a3, a4) {
        return fn.apply(this, arguments);
      };

    case 6:
      return function (a0, a1, a2, a3, a4, a5) {
        return fn.apply(this, arguments);
      };

    case 7:
      return function (a0, a1, a2, a3, a4, a5, a6) {
        return fn.apply(this, arguments);
      };

    case 8:
      return function (a0, a1, a2, a3, a4, a5, a6, a7) {
        return fn.apply(this, arguments);
      };

    case 9:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        return fn.apply(this, arguments);
      };

    case 10:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        return fn.apply(this, arguments);
      };

    default:
      throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
  }
}

/**
 * Internal curryN function.
 *
 * @private
 * @category Function
 * @param {Number} length The arity of the curried function.
 * @param {Array} received An array of arguments received thus far.
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */

function _curryN(length, received, fn) {
  return function () {
    var combined = [];
    var argsIdx = 0;
    var left = length;
    var combinedIdx = 0;

    while (combinedIdx < received.length || argsIdx < arguments.length) {
      var result;

      if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
        result = received[combinedIdx];
      } else {
        result = arguments[argsIdx];
        argsIdx += 1;
      }

      combined[combinedIdx] = result;

      if (!_isPlaceholder(result)) {
        left -= 1;
      }

      combinedIdx += 1;
    }

    return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length, combined, fn));
  };
}

/**
 * Returns a curried equivalent of the provided function, with the specified
 * arity. The curried function has two unusual capabilities. First, its
 * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
 * following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
 * the following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @since v0.5.0
 * @category Function
 * @sig Number -> (* -> a) -> (* -> a)
 * @param {Number} length The arity for the returned function.
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curry
 * @example
 *
 *      const sumArgs = (...args) => R.sum(args);
 *
 *      const curriedAddFourNumbers = R.curryN(4, sumArgs);
 *      const f = curriedAddFourNumbers(1, 2);
 *      const g = f(3);
 *      g(4); //=> 10
 */

var curryN =
/*#__PURE__*/
_curry2(function curryN(length, fn) {
  if (length === 1) {
    return _curry1(fn);
  }

  return _arity(length, _curryN(length, [], fn));
});

/**
 * Creates a new list iteration function from an existing one by adding two new
 * parameters to its callback function: the current index, and the entire list.
 *
 * This would turn, for instance, [`R.map`](#map) function into one that
 * more closely resembles `Array.prototype.map`. Note that this will only work
 * for functions in which the iteration callback function is the first
 * parameter, and where the list is the last parameter. (This latter might be
 * unimportant if the list parameter is not used.)
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category Function
 * @category List
 * @sig (((a ...) -> b) ... -> [a] -> *) -> (((a ..., Int, [a]) -> b) ... -> [a] -> *)
 * @param {Function} fn A list iteration function that does not pass index or list to its callback
 * @return {Function} An altered list iteration function that passes (item, index, list) to its callback
 * @example
 *
 *      const mapIndexed = R.addIndex(R.map);
 *      mapIndexed((val, idx) => idx + '-' + val, ['f', 'o', 'o', 'b', 'a', 'r']);
 *      //=> ['0-f', '1-o', '2-o', '3-b', '4-a', '5-r']
 */

var addIndex =
/*#__PURE__*/
_curry1(function addIndex(fn) {
  return curryN(fn.length, function () {
    var idx = 0;
    var origFn = arguments[0];
    var list = arguments[arguments.length - 1];
    var args = Array.prototype.slice.call(arguments, 0);

    args[0] = function () {
      var result = origFn.apply(this, _concat(arguments, [idx, list]));
      idx += 1;
      return result;
    };

    return fn.apply(this, args);
  });
});

/**
 * Optimized internal three-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */

function _curry3(fn) {
  return function f3(a, b, c) {
    switch (arguments.length) {
      case 0:
        return f3;

      case 1:
        return _isPlaceholder(a) ? f3 : _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        });

      case 2:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function (_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) ? _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        }) : _curry1(function (_c) {
          return fn(a, b, _c);
        });

      default:
        return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function (_a, _b) {
          return fn(_a, _b, c);
        }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function (_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        }) : _isPlaceholder(a) ? _curry1(function (_a) {
          return fn(_a, b, c);
        }) : _isPlaceholder(b) ? _curry1(function (_b) {
          return fn(a, _b, c);
        }) : _isPlaceholder(c) ? _curry1(function (_c) {
          return fn(a, b, _c);
        }) : fn(a, b, c);
    }
  };
}

/**
 * Applies a function to the value at the given index of an array, returning a
 * new copy of the array with the element at the given index replaced with the
 * result of the function application.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category List
 * @sig Number -> (a -> a) -> [a] -> [a]
 * @param {Number} idx The index.
 * @param {Function} fn The function to apply.
 * @param {Array|Arguments} list An array-like object whose value
 *        at the supplied index will be replaced.
 * @return {Array} A copy of the supplied array-like object with
 *         the element at index `idx` replaced with the value
 *         returned by applying `fn` to the existing element.
 * @see R.update
 * @example
 *
 *      R.adjust(1, R.toUpper, ['a', 'b', 'c', 'd']);      //=> ['a', 'B', 'c', 'd']
 *      R.adjust(-1, R.toUpper, ['a', 'b', 'c', 'd']);     //=> ['a', 'b', 'c', 'D']
 * @symb R.adjust(-1, f, [a, b]) = [a, f(b)]
 * @symb R.adjust(0, f, [a, b]) = [f(a), b]
 */

var adjust =
/*#__PURE__*/
_curry3(function adjust(idx, fn, list) {
  var len = list.length;

  if (idx >= len || idx < -len) {
    return list;
  }

  var _idx = (len + idx) % len;

  var _list = _concat(list);

  _list[_idx] = fn(list[_idx]);
  return _list;
});

/**
 * Tests whether or not an object is an array.
 *
 * @private
 * @param {*} val The object to test.
 * @return {Boolean} `true` if `val` is an array, `false` otherwise.
 * @example
 *
 *      _isArray([]); //=> true
 *      _isArray(null); //=> false
 *      _isArray({}); //=> false
 */
var _isArray = Array.isArray || function _isArray(val) {
  return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
};

function _isTransformer(obj) {
  return obj != null && typeof obj['@@transducer/step'] === 'function';
}

/**
 * Returns a function that dispatches with different strategies based on the
 * object in list position (last argument). If it is an array, executes [fn].
 * Otherwise, if it has a function with one of the given method names, it will
 * execute that function (functor case). Otherwise, if it is a transformer,
 * uses transducer created by [transducerCreator] to return a new transformer
 * (transducer case).
 * Otherwise, it will default to executing [fn].
 *
 * @private
 * @param {Array} methodNames properties to check for a custom implementation
 * @param {Function} transducerCreator transducer factory if object is transformer
 * @param {Function} fn default ramda implementation
 * @return {Function} A function that dispatches on object in list position
 */

function _dispatchable(methodNames, transducerCreator, fn) {
  return function () {
    if (arguments.length === 0) {
      return fn();
    }

    var obj = arguments[arguments.length - 1];

    if (!_isArray(obj)) {
      var idx = 0;

      while (idx < methodNames.length) {
        if (typeof obj[methodNames[idx]] === 'function') {
          return obj[methodNames[idx]].apply(obj, Array.prototype.slice.call(arguments, 0, -1));
        }

        idx += 1;
      }

      if (_isTransformer(obj)) {
        var transducer = transducerCreator.apply(null, Array.prototype.slice.call(arguments, 0, -1));
        return transducer(obj);
      }
    }

    return fn.apply(this, arguments);
  };
}

function _reduced(x) {
  return x && x['@@transducer/reduced'] ? x : {
    '@@transducer/value': x,
    '@@transducer/reduced': true
  };
}

var _xfBase = {
  init: function () {
    return this.xf['@@transducer/init']();
  },
  result: function (result) {
    return this.xf['@@transducer/result'](result);
  }
};

var XAll =
/*#__PURE__*/
function () {
  function XAll(f, xf) {
    this.xf = xf;
    this.f = f;
    this.all = true;
  }

  XAll.prototype['@@transducer/init'] = _xfBase.init;

  XAll.prototype['@@transducer/result'] = function (result) {
    if (this.all) {
      result = this.xf['@@transducer/step'](result, true);
    }

    return this.xf['@@transducer/result'](result);
  };

  XAll.prototype['@@transducer/step'] = function (result, input) {
    if (!this.f(input)) {
      this.all = false;
      result = _reduced(this.xf['@@transducer/step'](result, false));
    }

    return result;
  };

  return XAll;
}();

var _xall =
/*#__PURE__*/
_curry2(function _xall(f, xf) {
  return new XAll(f, xf);
});

/**
 * Returns `true` if all elements of the list match the predicate, `false` if
 * there are any that don't.
 *
 * Dispatches to the `all` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> Boolean
 * @param {Function} fn The predicate function.
 * @param {Array} list The array to consider.
 * @return {Boolean} `true` if the predicate is satisfied by every element, `false`
 *         otherwise.
 * @see R.any, R.none, R.transduce
 * @example
 *
 *      const equals3 = R.equals(3);
 *      R.all(equals3)([3, 3, 3, 3]); //=> true
 *      R.all(equals3)([3, 3, 1, 3]); //=> false
 */

var all =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['all'], _xall, function all(fn, list) {
  var idx = 0;

  while (idx < list.length) {
    if (!fn(list[idx])) {
      return false;
    }

    idx += 1;
  }

  return true;
}));

/**
 * Returns the larger of its two arguments.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord a => a -> a -> a
 * @param {*} a
 * @param {*} b
 * @return {*}
 * @see R.maxBy, R.min
 * @example
 *
 *      R.max(789, 123); //=> 789
 *      R.max('a', 'b'); //=> 'b'
 */

var max =
/*#__PURE__*/
_curry2(function max(a, b) {
  return b > a ? b : a;
});

function _map(fn, functor) {
  var idx = 0;
  var len = functor.length;
  var result = Array(len);

  while (idx < len) {
    result[idx] = fn(functor[idx]);
    idx += 1;
  }

  return result;
}

function _isString(x) {
  return Object.prototype.toString.call(x) === '[object String]';
}

/**
 * Tests whether or not an object is similar to an array.
 *
 * @private
 * @category Type
 * @category List
 * @sig * -> Boolean
 * @param {*} x The object to test.
 * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
 * @example
 *
 *      _isArrayLike([]); //=> true
 *      _isArrayLike(true); //=> false
 *      _isArrayLike({}); //=> false
 *      _isArrayLike({length: 10}); //=> false
 *      _isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
 *      _isArrayLike({nodeType: 1, length: 1}) // => false
 */

var _isArrayLike =
/*#__PURE__*/
_curry1(function isArrayLike(x) {
  if (_isArray(x)) {
    return true;
  }

  if (!x) {
    return false;
  }

  if (typeof x !== 'object') {
    return false;
  }

  if (_isString(x)) {
    return false;
  }

  if (x.length === 0) {
    return true;
  }

  if (x.length > 0) {
    return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
  }

  return false;
});

var XWrap =
/*#__PURE__*/
function () {
  function XWrap(fn) {
    this.f = fn;
  }

  XWrap.prototype['@@transducer/init'] = function () {
    throw new Error('init not implemented on XWrap');
  };

  XWrap.prototype['@@transducer/result'] = function (acc) {
    return acc;
  };

  XWrap.prototype['@@transducer/step'] = function (acc, x) {
    return this.f(acc, x);
  };

  return XWrap;
}();

function _xwrap(fn) {
  return new XWrap(fn);
}

/**
 * Creates a function that is bound to a context.
 * Note: `R.bind` does not provide the additional argument-binding capabilities of
 * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
 *
 * @func
 * @memberOf R
 * @since v0.6.0
 * @category Function
 * @category Object
 * @sig (* -> *) -> {*} -> (* -> *)
 * @param {Function} fn The function to bind to context
 * @param {Object} thisObj The context to bind `fn` to
 * @return {Function} A function that will execute in the context of `thisObj`.
 * @see R.partial
 * @example
 *
 *      const log = R.bind(console.log, console);
 *      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
 *      // logs {a: 2}
 * @symb R.bind(f, o)(a, b) = f.call(o, a, b)
 */

var bind =
/*#__PURE__*/
_curry2(function bind(fn, thisObj) {
  return _arity(fn.length, function () {
    return fn.apply(thisObj, arguments);
  });
});

function _arrayReduce(xf, acc, list) {
  var idx = 0;
  var len = list.length;

  while (idx < len) {
    acc = xf['@@transducer/step'](acc, list[idx]);

    if (acc && acc['@@transducer/reduced']) {
      acc = acc['@@transducer/value'];
      break;
    }

    idx += 1;
  }

  return xf['@@transducer/result'](acc);
}

function _iterableReduce(xf, acc, iter) {
  var step = iter.next();

  while (!step.done) {
    acc = xf['@@transducer/step'](acc, step.value);

    if (acc && acc['@@transducer/reduced']) {
      acc = acc['@@transducer/value'];
      break;
    }

    step = iter.next();
  }

  return xf['@@transducer/result'](acc);
}

function _methodReduce(xf, acc, obj, methodName) {
  return xf['@@transducer/result'](obj[methodName](bind(xf['@@transducer/step'], xf), acc));
}

var symIterator = typeof Symbol !== 'undefined' ? Symbol.iterator : '@@iterator';
function _reduce(fn, acc, list) {
  if (typeof fn === 'function') {
    fn = _xwrap(fn);
  }

  if (_isArrayLike(list)) {
    return _arrayReduce(fn, acc, list);
  }

  if (typeof list['fantasy-land/reduce'] === 'function') {
    return _methodReduce(fn, acc, list, 'fantasy-land/reduce');
  }

  if (list[symIterator] != null) {
    return _iterableReduce(fn, acc, list[symIterator]());
  }

  if (typeof list.next === 'function') {
    return _iterableReduce(fn, acc, list);
  }

  if (typeof list.reduce === 'function') {
    return _methodReduce(fn, acc, list, 'reduce');
  }

  throw new TypeError('reduce: list must be array or iterable');
}

var XMap =
/*#__PURE__*/
function () {
  function XMap(f, xf) {
    this.xf = xf;
    this.f = f;
  }

  XMap.prototype['@@transducer/init'] = _xfBase.init;
  XMap.prototype['@@transducer/result'] = _xfBase.result;

  XMap.prototype['@@transducer/step'] = function (result, input) {
    return this.xf['@@transducer/step'](result, this.f(input));
  };

  return XMap;
}();

var _xmap =
/*#__PURE__*/
_curry2(function _xmap(f, xf) {
  return new XMap(f, xf);
});

function _has(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var toString$1 = Object.prototype.toString;

var _isArguments =
/*#__PURE__*/
function () {
  return toString$1.call(arguments) === '[object Arguments]' ? function _isArguments(x) {
    return toString$1.call(x) === '[object Arguments]';
  } : function _isArguments(x) {
    return _has('callee', x);
  };
}();

var hasEnumBug = !
/*#__PURE__*/
{
  toString: null
}.propertyIsEnumerable('toString');
var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString']; // Safari bug

var hasArgsEnumBug =
/*#__PURE__*/
function () {

  return arguments.propertyIsEnumerable('length');
}();

var contains = function contains(list, item) {
  var idx = 0;

  while (idx < list.length) {
    if (list[idx] === item) {
      return true;
    }

    idx += 1;
  }

  return false;
};
/**
 * Returns a list containing the names of all the enumerable own properties of
 * the supplied object.
 * Note that the order of the output array is not guaranteed to be consistent
 * across different JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig {k: v} -> [k]
 * @param {Object} obj The object to extract properties from
 * @return {Array} An array of the object's own properties.
 * @see R.keysIn, R.values, R.toPairs
 * @example
 *
 *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
 */


var keys = typeof Object.keys === 'function' && !hasArgsEnumBug ?
/*#__PURE__*/
_curry1(function keys(obj) {
  return Object(obj) !== obj ? [] : Object.keys(obj);
}) :
/*#__PURE__*/
_curry1(function keys(obj) {
  if (Object(obj) !== obj) {
    return [];
  }

  var prop, nIdx;
  var ks = [];

  var checkArgsLength = hasArgsEnumBug && _isArguments(obj);

  for (prop in obj) {
    if (_has(prop, obj) && (!checkArgsLength || prop !== 'length')) {
      ks[ks.length] = prop;
    }
  }

  if (hasEnumBug) {
    nIdx = nonEnumerableProps.length - 1;

    while (nIdx >= 0) {
      prop = nonEnumerableProps[nIdx];

      if (_has(prop, obj) && !contains(ks, prop)) {
        ks[ks.length] = prop;
      }

      nIdx -= 1;
    }
  }

  return ks;
});

/**
 * Takes a function and
 * a [functor](https://github.com/fantasyland/fantasy-land#functor),
 * applies the function to each of the functor's values, and returns
 * a functor of the same shape.
 *
 * Ramda provides suitable `map` implementations for `Array` and `Object`,
 * so this function may be applied to `[1, 2, 3]` or `{x: 1, y: 2, z: 3}`.
 *
 * Dispatches to the `map` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * Also treats functions as functors and will compose them together.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Functor f => (a -> b) -> f a -> f b
 * @param {Function} fn The function to be called on every element of the input `list`.
 * @param {Array} list The list to be iterated over.
 * @return {Array} The new list.
 * @see R.transduce, R.addIndex, R.pluck, R.project
 * @example
 *
 *      const double = x => x * 2;
 *
 *      R.map(double, [1, 2, 3]); //=> [2, 4, 6]
 *
 *      R.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}
 * @symb R.map(f, [a, b]) = [f(a), f(b)]
 * @symb R.map(f, { x: a, y: b }) = { x: f(a), y: f(b) }
 * @symb R.map(f, functor_o) = functor_o.map(f)
 */

var map$1 =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['fantasy-land/map', 'map'], _xmap, function map(fn, functor) {
  switch (Object.prototype.toString.call(functor)) {
    case '[object Function]':
      return curryN(functor.length, function () {
        return fn.call(this, functor.apply(this, arguments));
      });

    case '[object Object]':
      return _reduce(function (acc, key) {
        acc[key] = fn(functor[key]);
        return acc;
      }, {}, keys(functor));

    default:
      return _map(fn, functor);
  }
}));

/**
 * Determine if the passed argument is an integer.
 *
 * @private
 * @param {*} n
 * @category Type
 * @return {Boolean}
 */
var _isInteger = Number.isInteger || function _isInteger(n) {
  return n << 0 === n;
};

/**
 * Returns the nth element of the given list or string. If n is negative the
 * element at index length + n is returned.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Number -> [a] -> a | Undefined
 * @sig Number -> String -> String
 * @param {Number} offset
 * @param {*} list
 * @return {*}
 * @example
 *
 *      const list = ['foo', 'bar', 'baz', 'quux'];
 *      R.nth(1, list); //=> 'bar'
 *      R.nth(-1, list); //=> 'quux'
 *      R.nth(-99, list); //=> undefined
 *
 *      R.nth(2, 'abc'); //=> 'c'
 *      R.nth(3, 'abc'); //=> ''
 * @symb R.nth(-1, [a, b, c]) = c
 * @symb R.nth(0, [a, b, c]) = a
 * @symb R.nth(1, [a, b, c]) = b
 */

var nth =
/*#__PURE__*/
_curry2(function nth(offset, list) {
  var idx = offset < 0 ? list.length + offset : offset;
  return _isString(list) ? list.charAt(idx) : list[idx];
});

/**
 * Returns a function that when supplied an object returns the indicated
 * property of that object, if it exists.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @typedefn Idx = String | Int | Symbol
 * @sig Idx -> {s: a} -> a | Undefined
 * @param {String|Number} p The property name or array index
 * @param {Object} obj The object to query
 * @return {*} The value at `obj.p`.
 * @see R.path, R.props, R.pluck, R.project, R.nth
 * @example
 *
 *      R.prop('x', {x: 100}); //=> 100
 *      R.prop('x', {}); //=> undefined
 *      R.prop(0, [100]); //=> 100
 *      R.compose(R.inc, R.prop('x'))({ x: 3 }) //=> 4
 */

var prop =
/*#__PURE__*/
_curry2(function prop(p, obj) {
  if (obj == null) {
    return;
  }

  return _isInteger(p) ? nth(p, obj) : obj[p];
});

/**
 * Returns a new list by plucking the same named property off all objects in
 * the list supplied.
 *
 * `pluck` will work on
 * any [functor](https://github.com/fantasyland/fantasy-land#functor) in
 * addition to arrays, as it is equivalent to `R.map(R.prop(k), f)`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Functor f => k -> f {k: v} -> f v
 * @param {Number|String} key The key name to pluck off of each object.
 * @param {Array} f The array or functor to consider.
 * @return {Array} The list of values for the given key.
 * @see R.project, R.prop, R.props
 * @example
 *
 *      var getAges = R.pluck('age');
 *      getAges([{name: 'fred', age: 29}, {name: 'wilma', age: 27}]); //=> [29, 27]
 *
 *      R.pluck(0, [[1, 2], [3, 4]]);               //=> [1, 3]
 *      R.pluck('val', {a: {val: 3}, b: {val: 5}}); //=> {a: 3, b: 5}
 * @symb R.pluck('x', [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}]) = [1, 3, 5]
 * @symb R.pluck(0, [[1, 2], [3, 4], [5, 6]]) = [1, 3, 5]
 */

var pluck =
/*#__PURE__*/
_curry2(function pluck(p, list) {
  return map$1(prop(p), list);
});

/**
 * Returns a single item by iterating through the list, successively calling
 * the iterator function and passing it an accumulator value and the current
 * value from the array, and then passing the result to the next call.
 *
 * The iterator function receives two values: *(acc, value)*. It may use
 * [`R.reduced`](#reduced) to shortcut the iteration.
 *
 * The arguments' order of [`reduceRight`](#reduceRight)'s iterator function
 * is *(value, acc)*.
 *
 * Note: `R.reduce` does not skip deleted or unassigned indices (sparse
 * arrays), unlike the native `Array.prototype.reduce` method. For more details
 * on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
 *
 * Dispatches to the `reduce` method of the third argument, if present. When
 * doing so, it is up to the user to handle the [`R.reduced`](#reduced)
 * shortcuting, as this is not implemented by `reduce`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig ((a, b) -> a) -> a -> [b] -> a
 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
 *        current element from the array.
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.reduced, R.addIndex, R.reduceRight
 * @example
 *
 *      R.reduce(R.subtract, 0, [1, 2, 3, 4]) // => ((((0 - 1) - 2) - 3) - 4) = -10
 *      //          -               -10
 *      //         / \              / \
 *      //        -   4           -6   4
 *      //       / \              / \
 *      //      -   3   ==>     -3   3
 *      //     / \              / \
 *      //    -   2           -1   2
 *      //   / \              / \
 *      //  0   1            0   1
 *
 * @symb R.reduce(f, a, [b, c, d]) = f(f(f(a, b), c), d)
 */

var reduce =
/*#__PURE__*/
_curry3(_reduce);

/**
 * Takes a list of predicates and returns a predicate that returns true for a
 * given list of arguments if every one of the provided predicates is satisfied
 * by those arguments.
 *
 * The function returned is a curried function whose arity matches that of the
 * highest-arity predicate.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Logic
 * @sig [(*... -> Boolean)] -> (*... -> Boolean)
 * @param {Array} predicates An array of predicates to check
 * @return {Function} The combined predicate
 * @see R.anyPass
 * @example
 *
 *      const isQueen = R.propEq('rank', 'Q');
 *      const isSpade = R.propEq('suit', '♠︎');
 *      const isQueenOfSpades = R.allPass([isQueen, isSpade]);
 *
 *      isQueenOfSpades({rank: 'Q', suit: '♣︎'}); //=> false
 *      isQueenOfSpades({rank: 'Q', suit: '♠︎'}); //=> true
 */

var allPass =
/*#__PURE__*/
_curry1(function allPass(preds) {
  return curryN(reduce(max, 0, pluck('length', preds)), function () {
    var idx = 0;
    var len = preds.length;

    while (idx < len) {
      if (!preds[idx].apply(this, arguments)) {
        return false;
      }

      idx += 1;
    }

    return true;
  });
});

/**
 * Returns a function that always returns the given value. Note that for
 * non-primitives the value returned is a reference to the original value.
 *
 * This function is known as `const`, `constant`, or `K` (for K combinator) in
 * other languages and libraries.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig a -> (* -> a)
 * @param {*} val The value to wrap in a function
 * @return {Function} A Function :: * -> val.
 * @example
 *
 *      const t = R.always('Tee');
 *      t(); //=> 'Tee'
 */

var always =
/*#__PURE__*/
_curry1(function always(val) {
  return function () {
    return val;
  };
});

/**
 * Returns the first argument if it is falsy, otherwise the second argument.
 * Acts as the boolean `and` statement if both inputs are `Boolean`s.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Logic
 * @sig a -> b -> a | b
 * @param {Any} a
 * @param {Any} b
 * @return {Any}
 * @see R.both, R.or
 * @example
 *
 *      R.and(true, true); //=> true
 *      R.and(true, false); //=> false
 *      R.and(false, true); //=> false
 *      R.and(false, false); //=> false
 */

var and$1 =
/*#__PURE__*/
_curry2(function and(a, b) {
  return a && b;
});

var XAny =
/*#__PURE__*/
function () {
  function XAny(f, xf) {
    this.xf = xf;
    this.f = f;
    this.any = false;
  }

  XAny.prototype['@@transducer/init'] = _xfBase.init;

  XAny.prototype['@@transducer/result'] = function (result) {
    if (!this.any) {
      result = this.xf['@@transducer/step'](result, false);
    }

    return this.xf['@@transducer/result'](result);
  };

  XAny.prototype['@@transducer/step'] = function (result, input) {
    if (this.f(input)) {
      this.any = true;
      result = _reduced(this.xf['@@transducer/step'](result, true));
    }

    return result;
  };

  return XAny;
}();

var _xany =
/*#__PURE__*/
_curry2(function _xany(f, xf) {
  return new XAny(f, xf);
});

/**
 * Returns `true` if at least one of the elements of the list match the predicate,
 * `false` otherwise.
 *
 * Dispatches to the `any` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> Boolean
 * @param {Function} fn The predicate function.
 * @param {Array} list The array to consider.
 * @return {Boolean} `true` if the predicate is satisfied by at least one element, `false`
 *         otherwise.
 * @see R.all, R.none, R.transduce
 * @example
 *
 *      const lessThan0 = R.flip(R.lt)(0);
 *      const lessThan2 = R.flip(R.lt)(2);
 *      R.any(lessThan0)([1, 2]); //=> false
 *      R.any(lessThan2)([1, 2]); //=> true
 */

var any$1 =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['any'], _xany, function any(fn, list) {
  var idx = 0;

  while (idx < list.length) {
    if (fn(list[idx])) {
      return true;
    }

    idx += 1;
  }

  return false;
}));

/**
 * Takes a list of predicates and returns a predicate that returns true for a
 * given list of arguments if at least one of the provided predicates is
 * satisfied by those arguments.
 *
 * The function returned is a curried function whose arity matches that of the
 * highest-arity predicate.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Logic
 * @sig [(*... -> Boolean)] -> (*... -> Boolean)
 * @param {Array} predicates An array of predicates to check
 * @return {Function} The combined predicate
 * @see R.allPass
 * @example
 *
 *      const isClub = R.propEq('suit', '♣');
 *      const isSpade = R.propEq('suit', '♠');
 *      const isBlackCard = R.anyPass([isClub, isSpade]);
 *
 *      isBlackCard({rank: '10', suit: '♣'}); //=> true
 *      isBlackCard({rank: 'Q', suit: '♠'}); //=> true
 *      isBlackCard({rank: 'Q', suit: '♦'}); //=> false
 */

var anyPass =
/*#__PURE__*/
_curry1(function anyPass(preds) {
  return curryN(reduce(max, 0, pluck('length', preds)), function () {
    var idx = 0;
    var len = preds.length;

    while (idx < len) {
      if (preds[idx].apply(this, arguments)) {
        return true;
      }

      idx += 1;
    }

    return false;
  });
});

/**
 * ap applies a list of functions to a list of values.
 *
 * Dispatches to the `ap` method of the second argument, if present. Also
 * treats curried functions as applicatives.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category Function
 * @sig [a -> b] -> [a] -> [b]
 * @sig Apply f => f (a -> b) -> f a -> f b
 * @sig (r -> a -> b) -> (r -> a) -> (r -> b)
 * @param {*} applyF
 * @param {*} applyX
 * @return {*}
 * @example
 *
 *      R.ap([R.multiply(2), R.add(3)], [1,2,3]); //=> [2, 4, 6, 4, 5, 6]
 *      R.ap([R.concat('tasty '), R.toUpper], ['pizza', 'salad']); //=> ["tasty pizza", "tasty salad", "PIZZA", "SALAD"]
 *
 *      // R.ap can also be used as S combinator
 *      // when only two functions are passed
 *      R.ap(R.concat, R.toUpper)('Ramda') //=> 'RamdaRAMDA'
 * @symb R.ap([f, g], [a, b]) = [f(a), f(b), g(a), g(b)]
 */

var ap$1 =
/*#__PURE__*/
_curry2(function ap(applyF, applyX) {
  return typeof applyX['fantasy-land/ap'] === 'function' ? applyX['fantasy-land/ap'](applyF) : typeof applyF.ap === 'function' ? applyF.ap(applyX) : typeof applyF === 'function' ? function (x) {
    return applyF(x)(applyX(x));
  } : _reduce(function (acc, f) {
    return _concat(acc, map$1(f, applyX));
  }, [], applyF);
});

function _aperture(n, list) {
  var idx = 0;
  var limit = list.length - (n - 1);
  var acc = new Array(limit >= 0 ? limit : 0);

  while (idx < limit) {
    acc[idx] = Array.prototype.slice.call(list, idx, idx + n);
    idx += 1;
  }

  return acc;
}

var XAperture =
/*#__PURE__*/
function () {
  function XAperture(n, xf) {
    this.xf = xf;
    this.pos = 0;
    this.full = false;
    this.acc = new Array(n);
  }

  XAperture.prototype['@@transducer/init'] = _xfBase.init;

  XAperture.prototype['@@transducer/result'] = function (result) {
    this.acc = null;
    return this.xf['@@transducer/result'](result);
  };

  XAperture.prototype['@@transducer/step'] = function (result, input) {
    this.store(input);
    return this.full ? this.xf['@@transducer/step'](result, this.getCopy()) : result;
  };

  XAperture.prototype.store = function (input) {
    this.acc[this.pos] = input;
    this.pos += 1;

    if (this.pos === this.acc.length) {
      this.pos = 0;
      this.full = true;
    }
  };

  XAperture.prototype.getCopy = function () {
    return _concat(Array.prototype.slice.call(this.acc, this.pos), Array.prototype.slice.call(this.acc, 0, this.pos));
  };

  return XAperture;
}();

var _xaperture =
/*#__PURE__*/
_curry2(function _xaperture(n, xf) {
  return new XAperture(n, xf);
});

/**
 * Returns a new list, composed of n-tuples of consecutive elements. If `n` is
 * greater than the length of the list, an empty list is returned.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category List
 * @sig Number -> [a] -> [[a]]
 * @param {Number} n The size of the tuples to create
 * @param {Array} list The list to split into `n`-length tuples
 * @return {Array} The resulting list of `n`-length tuples
 * @see R.transduce
 * @example
 *
 *      R.aperture(2, [1, 2, 3, 4, 5]); //=> [[1, 2], [2, 3], [3, 4], [4, 5]]
 *      R.aperture(3, [1, 2, 3, 4, 5]); //=> [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
 *      R.aperture(7, [1, 2, 3, 4, 5]); //=> []
 */

var aperture =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xaperture, _aperture));

/**
 * Returns a new list containing the contents of the given list, followed by
 * the given element.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig a -> [a] -> [a]
 * @param {*} el The element to add to the end of the new list.
 * @param {Array} list The list of elements to add a new item to.
 *        list.
 * @return {Array} A new list containing the elements of the old list followed by `el`.
 * @see R.prepend
 * @example
 *
 *      R.append('tests', ['write', 'more']); //=> ['write', 'more', 'tests']
 *      R.append('tests', []); //=> ['tests']
 *      R.append(['tests'], ['write', 'more']); //=> ['write', 'more', ['tests']]
 */

var append =
/*#__PURE__*/
_curry2(function append(el, list) {
  return _concat(list, [el]);
});

/**
 * Applies function `fn` to the argument list `args`. This is useful for
 * creating a fixed-arity function from a variadic function. `fn` should be a
 * bound function if context is significant.
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category Function
 * @sig (*... -> a) -> [*] -> a
 * @param {Function} fn The function which will be called with `args`
 * @param {Array} args The arguments to call `fn` with
 * @return {*} result The result, equivalent to `fn(...args)`
 * @see R.call, R.unapply
 * @example
 *
 *      const nums = [1, 2, 3, -99, 42, 6, 7];
 *      R.apply(Math.max, nums); //=> 42
 * @symb R.apply(f, [a, b, c]) = f(a, b, c)
 */

var apply$1 =
/*#__PURE__*/
_curry2(function apply(fn, args) {
  return fn.apply(this, args);
});

/**
 * Returns a list of all the enumerable own properties of the supplied object.
 * Note that the order of the output array is not guaranteed across different
 * JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig {k: v} -> [v]
 * @param {Object} obj The object to extract values from
 * @return {Array} An array of the values of the object's own properties.
 * @see R.valuesIn, R.keys, R.toPairs
 * @example
 *
 *      R.values({a: 1, b: 2, c: 3}); //=> [1, 2, 3]
 */

var values =
/*#__PURE__*/
_curry1(function values(obj) {
  var props = keys(obj);
  var len = props.length;
  var vals = [];
  var idx = 0;

  while (idx < len) {
    vals[idx] = obj[props[idx]];
    idx += 1;
  }

  return vals;
});

// delegating calls to .map

function mapValues(fn, obj) {
  return _isArray(obj) ? obj.map(fn) : keys(obj).reduce(function (acc, key) {
    acc[key] = fn(obj[key]);
    return acc;
  }, {});
}
/**
 * Given a spec object recursively mapping properties to functions, creates a
 * function producing an object of the same structure, by mapping each property
 * to the result of calling its associated function with the supplied arguments.
 *
 * @func
 * @memberOf R
 * @since v0.20.0
 * @category Function
 * @sig {k: ((a, b, ..., m) -> v)} -> ((a, b, ..., m) -> {k: v})
 * @param {Object} spec an object recursively mapping properties to functions for
 *        producing the values for these properties.
 * @return {Function} A function that returns an object of the same structure
 * as `spec', with each property set to the value returned by calling its
 * associated function with the supplied arguments.
 * @see R.converge, R.juxt
 * @example
 *
 *      const getMetrics = R.applySpec({
 *        sum: R.add,
 *        nested: { mul: R.multiply }
 *      });
 *      getMetrics(2, 4); // => { sum: 6, nested: { mul: 8 } }
 * @symb R.applySpec({ x: f, y: { z: g } })(a, b) = { x: f(a, b), y: { z: g(a, b) } }
 */


var applySpec =
/*#__PURE__*/
_curry1(function applySpec(spec) {
  spec = mapValues(function (v) {
    return typeof v == 'function' ? v : applySpec(v);
  }, spec);
  return curryN(reduce(max, 0, pluck('length', values(spec))), function () {
    var args = arguments;
    return mapValues(function (f) {
      return apply$1(f, args);
    }, spec);
  });
});

/**
 * Takes a value and applies a function to it.
 *
 * This function is also known as the `thrush` combinator.
 *
 * @func
 * @memberOf R
 * @since v0.25.0
 * @category Function
 * @sig a -> (a -> b) -> b
 * @param {*} x The value
 * @param {Function} f The function to apply
 * @return {*} The result of applying `f` to `x`
 * @example
 *
 *      const t42 = R.applyTo(42);
 *      t42(R.identity); //=> 42
 *      t42(R.add(1)); //=> 43
 */

var applyTo =
/*#__PURE__*/
_curry2(function applyTo(x, f) {
  return f(x);
});

/**
 * Makes an ascending comparator function out of a function that returns a value
 * that can be compared with `<` and `>`.
 *
 * @func
 * @memberOf R
 * @since v0.23.0
 * @category Function
 * @sig Ord b => (a -> b) -> a -> a -> Number
 * @param {Function} fn A function of arity one that returns a value that can be compared
 * @param {*} a The first item to be compared.
 * @param {*} b The second item to be compared.
 * @return {Number} `-1` if fn(a) < fn(b), `1` if fn(b) < fn(a), otherwise `0`
 * @see R.descend
 * @example
 *
 *      const byAge = R.ascend(R.prop('age'));
 *      const people = [
 *        { name: 'Emma', age: 70 },
 *        { name: 'Peter', age: 78 },
 *        { name: 'Mikhail', age: 62 },
 *      ];
 *      const peopleByYoungestFirst = R.sort(byAge, people);
 *        //=> [{ name: 'Mikhail', age: 62 },{ name: 'Emma', age: 70 }, { name: 'Peter', age: 78 }]
 */

var ascend =
/*#__PURE__*/
_curry3(function ascend(fn, a, b) {
  var aa = fn(a);
  var bb = fn(b);
  return aa < bb ? -1 : aa > bb ? 1 : 0;
});

/**
 * Makes a shallow clone of an object, setting or overriding the specified
 * property with the given value. Note that this copies and flattens prototype
 * properties onto the new object as well. All non-primitive properties are
 * copied by reference.
 *
 * @private
 * @param {String|Number} prop The property name to set
 * @param {*} val The new value
 * @param {Object|Array} obj The object to clone
 * @return {Object|Array} A new object equivalent to the original except for the changed property.
 */

function _assoc(prop, val, obj) {
  if (_isInteger(prop) && _isArray(obj)) {
    var arr = [].concat(obj);
    arr[prop] = val;
    return arr;
  }

  var result = {};

  for (var p in obj) {
    result[p] = obj[p];
  }

  result[prop] = val;
  return result;
}

/**
 * Checks if the input value is `null` or `undefined`.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Type
 * @sig * -> Boolean
 * @param {*} x The value to test.
 * @return {Boolean} `true` if `x` is `undefined` or `null`, otherwise `false`.
 * @example
 *
 *      R.isNil(null); //=> true
 *      R.isNil(undefined); //=> true
 *      R.isNil(0); //=> false
 *      R.isNil([]); //=> false
 */

var isNil$1 =
/*#__PURE__*/
_curry1(function isNil(x) {
  return x == null;
});

/**
 * Makes a shallow clone of an object, setting or overriding the nodes required
 * to create the given path, and placing the specific value at the tail end of
 * that path. Note that this copies and flattens prototype properties onto the
 * new object as well. All non-primitive properties are copied by reference.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Object
 * @typedefn Idx = String | Int | Symbol
 * @sig [Idx] -> a -> {a} -> {a}
 * @param {Array} path the path to set
 * @param {*} val The new value
 * @param {Object} obj The object to clone
 * @return {Object} A new object equivalent to the original except along the specified path.
 * @see R.dissocPath
 * @example
 *
 *      R.assocPath(['a', 'b', 'c'], 42, {a: {b: {c: 0}}}); //=> {a: {b: {c: 42}}}
 *
 *      // Any missing or non-object keys in path will be overridden
 *      R.assocPath(['a', 'b', 'c'], 42, {a: 5}); //=> {a: {b: {c: 42}}}
 */

var assocPath =
/*#__PURE__*/
_curry3(function assocPath(path, val, obj) {
  if (path.length === 0) {
    return val;
  }

  var idx = path[0];

  if (path.length > 1) {
    var nextObj = !isNil$1(obj) && _has(idx, obj) ? obj[idx] : _isInteger(path[1]) ? [] : {};
    val = assocPath(Array.prototype.slice.call(path, 1), val, nextObj);
  }

  return _assoc(idx, val, obj);
});

/**
 * Makes a shallow clone of an object, setting or overriding the specified
 * property with the given value. Note that this copies and flattens prototype
 * properties onto the new object as well. All non-primitive properties are
 * copied by reference.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Object
 * @typedefn Idx = String | Int
 * @sig Idx -> a -> {k: v} -> {k: v}
 * @param {String|Number} prop The property name to set
 * @param {*} val The new value
 * @param {Object} obj The object to clone
 * @return {Object} A new object equivalent to the original except for the changed property.
 * @see R.dissoc, R.pick
 * @example
 *
 *      R.assoc('c', 3, {a: 1, b: 2}); //=> {a: 1, b: 2, c: 3}
 */

var assoc =
/*#__PURE__*/
_curry3(function assoc(prop, val, obj) {
  return assocPath([prop], val, obj);
});

/**
 * Wraps a function of any arity (including nullary) in a function that accepts
 * exactly `n` parameters. Any extraneous parameters will not be passed to the
 * supplied function.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig Number -> (* -> a) -> (* -> a)
 * @param {Number} n The desired arity of the new function.
 * @param {Function} fn The function to wrap.
 * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
 *         arity `n`.
 * @see R.binary, R.unary
 * @example
 *
 *      const takesTwoArgs = (a, b) => [a, b];
 *
 *      takesTwoArgs.length; //=> 2
 *      takesTwoArgs(1, 2); //=> [1, 2]
 *
 *      const takesOneArg = R.nAry(1, takesTwoArgs);
 *      takesOneArg.length; //=> 1
 *      // Only `n` arguments are passed to the wrapped function
 *      takesOneArg(1, 2); //=> [1, undefined]
 * @symb R.nAry(0, f)(a, b) = f()
 * @symb R.nAry(1, f)(a, b) = f(a)
 * @symb R.nAry(2, f)(a, b) = f(a, b)
 */

var nAry =
/*#__PURE__*/
_curry2(function nAry(n, fn) {
  switch (n) {
    case 0:
      return function () {
        return fn.call(this);
      };

    case 1:
      return function (a0) {
        return fn.call(this, a0);
      };

    case 2:
      return function (a0, a1) {
        return fn.call(this, a0, a1);
      };

    case 3:
      return function (a0, a1, a2) {
        return fn.call(this, a0, a1, a2);
      };

    case 4:
      return function (a0, a1, a2, a3) {
        return fn.call(this, a0, a1, a2, a3);
      };

    case 5:
      return function (a0, a1, a2, a3, a4) {
        return fn.call(this, a0, a1, a2, a3, a4);
      };

    case 6:
      return function (a0, a1, a2, a3, a4, a5) {
        return fn.call(this, a0, a1, a2, a3, a4, a5);
      };

    case 7:
      return function (a0, a1, a2, a3, a4, a5, a6) {
        return fn.call(this, a0, a1, a2, a3, a4, a5, a6);
      };

    case 8:
      return function (a0, a1, a2, a3, a4, a5, a6, a7) {
        return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7);
      };

    case 9:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8);
      };

    case 10:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);
      };

    default:
      throw new Error('First argument to nAry must be a non-negative integer no greater than ten');
  }
});

/**
 * Wraps a function of any arity (including nullary) in a function that accepts
 * exactly 2 parameters. Any extraneous parameters will not be passed to the
 * supplied function.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category Function
 * @sig (a -> b -> c -> ... -> z) -> ((a, b) -> z)
 * @param {Function} fn The function to wrap.
 * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
 *         arity 2.
 * @see R.nAry, R.unary
 * @example
 *
 *      const takesThreeArgs = function(a, b, c) {
 *        return [a, b, c];
 *      };
 *      takesThreeArgs.length; //=> 3
 *      takesThreeArgs(1, 2, 3); //=> [1, 2, 3]
 *
 *      const takesTwoArgs = R.binary(takesThreeArgs);
 *      takesTwoArgs.length; //=> 2
 *      // Only 2 arguments are passed to the wrapped function
 *      takesTwoArgs(1, 2, 3); //=> [1, 2, undefined]
 * @symb R.binary(f)(a, b, c) = f(a, b)
 */

var binary =
/*#__PURE__*/
_curry1(function binary(fn) {
  return nAry(2, fn);
});

function _isFunction(x) {
  var type = Object.prototype.toString.call(x);
  return type === '[object Function]' || type === '[object AsyncFunction]' || type === '[object GeneratorFunction]' || type === '[object AsyncGeneratorFunction]';
}

/**
 * "lifts" a function to be the specified arity, so that it may "map over" that
 * many lists, Functions or other objects that satisfy the [FantasyLand Apply spec](https://github.com/fantasyland/fantasy-land#apply).
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category Function
 * @sig Number -> (*... -> *) -> ([*]... -> [*])
 * @param {Function} fn The function to lift into higher context
 * @return {Function} The lifted function.
 * @see R.lift, R.ap
 * @example
 *
 *      const madd3 = R.liftN(3, (...args) => R.sum(args));
 *      madd3([1,2,3], [1,2,3], [1]); //=> [3, 4, 5, 4, 5, 6, 5, 6, 7]
 */

var liftN =
/*#__PURE__*/
_curry2(function liftN(arity, fn) {
  var lifted = curryN(arity, fn);
  return curryN(arity, function () {
    return _reduce(ap$1, map$1(lifted, arguments[0]), Array.prototype.slice.call(arguments, 1));
  });
});

/**
 * "lifts" a function of arity >= 1 so that it may "map over" a list, Function or other
 * object that satisfies the [FantasyLand Apply spec](https://github.com/fantasyland/fantasy-land#apply).
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category Function
 * @sig (*... -> *) -> ([*]... -> [*])
 * @param {Function} fn The function to lift into higher context
 * @return {Function} The lifted function.
 * @see R.liftN
 * @example
 *
 *      const madd3 = R.lift((a, b, c) => a + b + c);
 *
 *      madd3([100, 200], [30, 40], [5, 6, 7]); //=> [135, 136, 137, 145, 146, 147, 235, 236, 237, 245, 246, 247]
 *
 *      const madd5 = R.lift((a, b, c, d, e) => a + b + c + d + e);
 *
 *      madd5([10, 20], [1], [2, 3], [4], [100, 200]); //=> [117, 217, 118, 218, 127, 227, 128, 228]
 */

var lift =
/*#__PURE__*/
_curry1(function lift(fn) {
  return liftN(fn.length, fn);
});

/**
 * A function which calls the two provided functions and returns the `&&`
 * of the results.
 * It returns the result of the first function if it is false-y and the result
 * of the second function otherwise. Note that this is short-circuited,
 * meaning that the second function will not be invoked if the first returns a
 * false-y value.
 *
 * In addition to functions, `R.both` also accepts any fantasy-land compatible
 * applicative functor.
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category Logic
 * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
 * @param {Function} f A predicate
 * @param {Function} g Another predicate
 * @return {Function} a function that applies its arguments to `f` and `g` and `&&`s their outputs together.
 * @see R.either, R.and
 * @example
 *
 *      const gt10 = R.gt(R.__, 10)
 *      const lt20 = R.lt(R.__, 20)
 *      const f = R.both(gt10, lt20);
 *      f(15); //=> true
 *      f(30); //=> false
 *
 *      R.both(Maybe.Just(false), Maybe.Just(55)); // => Maybe.Just(false)
 *      R.both([false, false, 'a'], [11]); //=> [false, false, 11]
 */

var both$1 =
/*#__PURE__*/
_curry2(function both(f, g) {
  return _isFunction(f) ? function _both() {
    return f.apply(this, arguments) && g.apply(this, arguments);
  } : lift(and$1)(f, g);
});

/**
 * Returns the result of calling its first argument with the remaining
 * arguments. This is occasionally useful as a converging function for
 * [`R.converge`](#converge): the first branch can produce a function while the
 * remaining branches produce values to be passed to that function as its
 * arguments.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Function
 * @sig ((*... -> a), *...) -> a
 * @param {Function} fn The function to apply to the remaining arguments.
 * @param {...*} args Any number of positional arguments.
 * @return {*}
 * @see R.apply
 * @example
 *
 *      R.call(R.add, 1, 2); //=> 3
 *
 *      const indentN = R.pipe(
 *        R.repeat(' '),
 *        R.join(''),
 *        R.replace(/^(?!$)/gm)
 *      );
 *
 *      const format = R.converge(
 *        R.call,
 *        [
 *          R.pipe(R.prop('indent'), indentN),
 *          R.prop('value')
 *        ]
 *      );
 *
 *      format({indent: 2, value: 'foo\nbar\nbaz\n'}); //=> '  foo\n  bar\n  baz\n'
 * @symb R.call(f, a, b) = f(a, b)
 */

var call$1 =
/*#__PURE__*/
_curry1(function call(fn) {
  return fn.apply(this, Array.prototype.slice.call(arguments, 1));
});

/**
 * `_makeFlat` is a helper function that returns a one-level or fully recursive
 * function based on the flag passed in.
 *
 * @private
 */

function _makeFlat(recursive) {
  return function flatt(list) {
    var value, jlen, j;
    var result = [];
    var idx = 0;
    var ilen = list.length;

    while (idx < ilen) {
      if (_isArrayLike(list[idx])) {
        value = recursive ? flatt(list[idx]) : list[idx];
        j = 0;
        jlen = value.length;

        while (j < jlen) {
          result[result.length] = value[j];
          j += 1;
        }
      } else {
        result[result.length] = list[idx];
      }

      idx += 1;
    }

    return result;
  };
}

function _forceReduced(x) {
  return {
    '@@transducer/value': x,
    '@@transducer/reduced': true
  };
}

var preservingReduced = function (xf) {
  return {
    '@@transducer/init': _xfBase.init,
    '@@transducer/result': function (result) {
      return xf['@@transducer/result'](result);
    },
    '@@transducer/step': function (result, input) {
      var ret = xf['@@transducer/step'](result, input);
      return ret['@@transducer/reduced'] ? _forceReduced(ret) : ret;
    }
  };
};

var _flatCat = function _xcat(xf) {
  var rxf = preservingReduced(xf);
  return {
    '@@transducer/init': _xfBase.init,
    '@@transducer/result': function (result) {
      return rxf['@@transducer/result'](result);
    },
    '@@transducer/step': function (result, input) {
      return !_isArrayLike(input) ? _reduce(rxf, result, [input]) : _reduce(rxf, result, input);
    }
  };
};

var _xchain =
/*#__PURE__*/
_curry2(function _xchain(f, xf) {
  return map$1(f, _flatCat(xf));
});

/**
 * `chain` maps a function over a list and concatenates the results. `chain`
 * is also known as `flatMap` in some libraries.
 *
 * Dispatches to the `chain` method of the second argument, if present,
 * according to the [FantasyLand Chain spec](https://github.com/fantasyland/fantasy-land#chain).
 *
 * If second argument is a function, `chain(f, g)(x)` is equivalent to `f(g(x), x)`.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category List
 * @sig Chain m => (a -> m b) -> m a -> m b
 * @param {Function} fn The function to map with
 * @param {Array} list The list to map over
 * @return {Array} The result of flat-mapping `list` with `fn`
 * @example
 *
 *      const duplicate = n => [n, n];
 *      R.chain(duplicate, [1, 2, 3]); //=> [1, 1, 2, 2, 3, 3]
 *
 *      R.chain(R.append, R.head)([1, 2, 3]); //=> [1, 2, 3, 1]
 */

var chain$1 =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['fantasy-land/chain', 'chain'], _xchain, function chain(fn, monad) {
  if (typeof monad === 'function') {
    return function (x) {
      return fn(monad(x))(x);
    };
  }

  return _makeFlat(false)(map$1(fn, monad));
}));

/**
 * Restricts a number to be within a range.
 *
 * Also works for other ordered types such as Strings and Dates.
 *
 * @func
 * @memberOf R
 * @since v0.20.0
 * @category Relation
 * @sig Ord a => a -> a -> a -> a
 * @param {Number} minimum The lower limit of the clamp (inclusive)
 * @param {Number} maximum The upper limit of the clamp (inclusive)
 * @param {Number} value Value to be clamped
 * @return {Number} Returns `minimum` when `val < minimum`, `maximum` when `val > maximum`, returns `val` otherwise
 * @example
 *
 *      R.clamp(1, 10, -5) // => 1
 *      R.clamp(1, 10, 15) // => 10
 *      R.clamp(1, 10, 4)  // => 4
 */

var clamp =
/*#__PURE__*/
_curry3(function clamp(min, max, value) {
  if (min > max) {
    throw new Error('min must not be greater than max in clamp(min, max, value)');
  }

  return value < min ? min : value > max ? max : value;
});

function _cloneRegExp(pattern) {
  return new RegExp(pattern.source, (pattern.global ? 'g' : '') + (pattern.ignoreCase ? 'i' : '') + (pattern.multiline ? 'm' : '') + (pattern.sticky ? 'y' : '') + (pattern.unicode ? 'u' : ''));
}

/**
 * Gives a single-word string description of the (native) type of a value,
 * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
 * attempt to distinguish user Object types any further, reporting them all as
 * 'Object'.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Type
 * @sig (* -> {*}) -> String
 * @param {*} val The value to test
 * @return {String}
 * @example
 *
 *      R.type({}); //=> "Object"
 *      R.type(1); //=> "Number"
 *      R.type(false); //=> "Boolean"
 *      R.type('s'); //=> "String"
 *      R.type(null); //=> "Null"
 *      R.type([]); //=> "Array"
 *      R.type(/[A-z]/); //=> "RegExp"
 *      R.type(() => {}); //=> "Function"
 *      R.type(undefined); //=> "Undefined"
 */

var type$1 =
/*#__PURE__*/
_curry1(function type(val) {
  return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
});

/**
 * Copies an object.
 *
 * @private
 * @param {*} value The value to be copied
 * @param {Array} refFrom Array containing the source references
 * @param {Array} refTo Array containing the copied source references
 * @param {Boolean} deep Whether or not to perform deep cloning.
 * @return {*} The copied value.
 */

function _clone(value, refFrom, refTo, deep) {
  var copy = function copy(copiedValue) {
    var len = refFrom.length;
    var idx = 0;

    while (idx < len) {
      if (value === refFrom[idx]) {
        return refTo[idx];
      }

      idx += 1;
    }

    refFrom[idx] = value;
    refTo[idx] = copiedValue;

    for (var key in value) {
      if (value.hasOwnProperty(key)) {
        copiedValue[key] = deep ? _clone(value[key], refFrom, refTo, true) : value[key];
      }
    }

    return copiedValue;
  };

  switch (type$1(value)) {
    case 'Object':
      return copy(Object.create(Object.getPrototypeOf(value)));

    case 'Array':
      return copy([]);

    case 'Date':
      return new Date(value.valueOf());

    case 'RegExp':
      return _cloneRegExp(value);

    case 'Int8Array':
    case 'Uint8Array':
    case 'Uint8ClampedArray':
    case 'Int16Array':
    case 'Uint16Array':
    case 'Int32Array':
    case 'Uint32Array':
    case 'Float32Array':
    case 'Float64Array':
    case 'BigInt64Array':
    case 'BigUint64Array':
      return value.slice();

    default:
      return value;
  }
}

/**
 * Creates a deep copy of the source that can be used in place of the source
 * object without retaining any references to it.
 * The source object may contain (nested) `Array`s and `Object`s,
 * `Number`s, `String`s, `Boolean`s and `Date`s.
 * `Function`s are assigned by reference rather than copied.
 *
 * Dispatches to a `clone` method if present.
 *
 * Note that if the source object has multiple nodes that share a reference,
 * the returned object will have the same structure, but the references will
 * be pointed to the location within the cloned value.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig {*} -> {*}
 * @param {*} value The object or array to clone
 * @return {*} A deeply cloned copy of `val`
 * @example
 *
 *      const objects = [{}, {}, {}];
 *      const objectsClone = R.clone(objects);
 *      objects === objectsClone; //=> false
 *      objects[0] === objectsClone[0]; //=> false
 */

var clone =
/*#__PURE__*/
_curry1(function clone(value) {
  return value != null && typeof value.clone === 'function' ? value.clone() : _clone(value, [], [], true);
});

/**
 * Splits a list into sub-lists, based on the result of calling a key-returning function on each element,
 * and grouping the results according to values returned.
 *
 * @func
 * @memberOf R
 * @since v0.28.0
 * @category List
 * @typedefn Idx = String | Int | Symbol
 * @sig Idx a => (b -> a) -> [b] -> [[b]]
 * @param {Function} fn Function :: a -> Idx
 * @param {Array} list The array to group
 * @return {Array}
 *    An array of arrays where each sub-array contains items for which
 *    the String-returning function has returned the same value.
 * @see R.groupBy, R.partition
 * @example
 *      R.collectBy(R.prop('type'), [
 *        {type: 'breakfast', item: '☕️'},
 *        {type: 'lunch', item: '🌯'},
 *        {type: 'dinner', item: '🍝'},
 *        {type: 'breakfast', item: '🥐'},
 *        {type: 'lunch', item: '🍕'}
 *      ]);
 *
 *      // [ [ {type: 'breakfast', item: '☕️'},
 *      //     {type: 'breakfast', item: '🥐'} ],
 *      //   [ {type: 'lunch', item: '🌯'},
 *      //     {type: 'lunch', item: '🍕'} ],
 *      //   [ {type: 'dinner', item: '🍝'} ] ]
 */

var collectBy =
/*#__PURE__*/
_curry2(function collectBy(fn, list) {
  var group = _reduce(function (o, x) {
    var tag = fn(x);

    if (o[tag] === undefined) {
      o[tag] = [];
    }

    o[tag].push(x);
    return o;
  }, {}, list);

  var newList = [];

  for (var tag in group) {
    newList.push(group[tag]);
  }

  return newList;
});

/**
 * Makes a comparator function out of a function that reports whether the first
 * element is less than the second.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig ((a, b) -> Boolean) -> ((a, b) -> Number)
 * @param {Function} pred A predicate function of arity two which will return `true` if the first argument
 * is less than the second, `false` otherwise
 * @return {Function} A Function :: a -> b -> Int that returns `-1` if a < b, `1` if b < a, otherwise `0`
 * @example
 *
 *      const byAge = R.comparator((a, b) => a.age < b.age);
 *      const people = [
 *        { name: 'Emma', age: 70 },
 *        { name: 'Peter', age: 78 },
 *        { name: 'Mikhail', age: 62 },
 *      ];
 *      const peopleByIncreasingAge = R.sort(byAge, people);
 *        //=> [{ name: 'Mikhail', age: 62 },{ name: 'Emma', age: 70 }, { name: 'Peter', age: 78 }]
 */

var comparator =
/*#__PURE__*/
_curry1(function comparator(pred) {
  return function (a, b) {
    return pred(a, b) ? -1 : pred(b, a) ? 1 : 0;
  };
});

/**
 * A function that returns the `!` of its argument. It will return `true` when
 * passed false-y value, and `false` when passed a truth-y one.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Logic
 * @sig * -> Boolean
 * @param {*} a any value
 * @return {Boolean} the logical inverse of passed argument.
 * @see R.complement
 * @example
 *
 *      R.not(true); //=> false
 *      R.not(false); //=> true
 *      R.not(0); //=> true
 *      R.not(1); //=> false
 */

var not =
/*#__PURE__*/
_curry1(function not(a) {
  return !a;
});

/**
 * Takes a function `f` and returns a function `g` such that if called with the same arguments
 * when `f` returns a "truthy" value, `g` returns `false` and when `f` returns a "falsy" value `g` returns `true`.
 *
 * `R.complement` may be applied to any functor
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category Logic
 * @sig (*... -> *) -> (*... -> Boolean)
 * @param {Function} f
 * @return {Function}
 * @see R.not
 * @example
 *
 *      const isNotNil = R.complement(R.isNil);
 *      R.isNil(null); //=> true
 *      isNotNil(null); //=> false
 *      R.isNil(7); //=> false
 *      isNotNil(7); //=> true
 */

var complement =
/*#__PURE__*/
lift(not);

function _pipe(f, g) {
  return function () {
    return g.call(this, f.apply(this, arguments));
  };
}

/**
 * This checks whether a function has a [methodname] function. If it isn't an
 * array it will execute that function otherwise it will default to the ramda
 * implementation.
 *
 * @private
 * @param {Function} fn ramda implementation
 * @param {String} methodname property to check for a custom implementation
 * @return {Object} Whatever the return value of the method is.
 */

function _checkForMethod(methodname, fn) {
  return function () {
    var length = arguments.length;

    if (length === 0) {
      return fn();
    }

    var obj = arguments[length - 1];
    return _isArray(obj) || typeof obj[methodname] !== 'function' ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
  };
}

/**
 * Returns the elements of the given list or string (or object with a `slice`
 * method) from `fromIndex` (inclusive) to `toIndex` (exclusive).
 *
 * Dispatches to the `slice` method of the third argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.4
 * @category List
 * @sig Number -> Number -> [a] -> [a]
 * @sig Number -> Number -> String -> String
 * @param {Number} fromIndex The start index (inclusive).
 * @param {Number} toIndex The end index (exclusive).
 * @param {*} list
 * @return {*}
 * @example
 *
 *      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
 *      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
 *      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
 *      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
 *      R.slice(0, 3, 'ramda');                     //=> 'ram'
 */

var slice =
/*#__PURE__*/
_curry3(
/*#__PURE__*/
_checkForMethod('slice', function slice(fromIndex, toIndex, list) {
  return Array.prototype.slice.call(list, fromIndex, toIndex);
}));

/**
 * Returns all but the first element of the given list or string (or object
 * with a `tail` method).
 *
 * Dispatches to the `slice` method of the first argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [a]
 * @sig String -> String
 * @param {*} list
 * @return {*}
 * @see R.head, R.init, R.last
 * @example
 *
 *      R.tail([1, 2, 3]);  //=> [2, 3]
 *      R.tail([1, 2]);     //=> [2]
 *      R.tail([1]);        //=> []
 *      R.tail([]);         //=> []
 *
 *      R.tail('abc');  //=> 'bc'
 *      R.tail('ab');   //=> 'b'
 *      R.tail('a');    //=> ''
 *      R.tail('');     //=> ''
 */

var tail =
/*#__PURE__*/
_curry1(
/*#__PURE__*/
_checkForMethod('tail',
/*#__PURE__*/
slice(1, Infinity)));

/**
 * Performs left-to-right function composition. The first argument may have
 * any arity; the remaining arguments must be unary.
 *
 * In some libraries this function is named `sequence`.
 *
 * **Note:** The result of pipe is not automatically curried.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> ((a, b, ..., n) -> z)
 * @param {...Function} functions
 * @return {Function}
 * @see R.compose
 * @example
 *
 *      const f = R.pipe(Math.pow, R.negate, R.inc);
 *
 *      f(3, 4); // -(3^4) + 1
 * @symb R.pipe(f, g, h)(a, b) = h(g(f(a, b)))
 * @symb R.pipe(f, g, h)(a)(b) = h(g(f(a)))(b)
 */

function pipe$1() {
  if (arguments.length === 0) {
    throw new Error('pipe requires at least one argument');
  }

  return _arity(arguments[0].length, reduce(_pipe, arguments[0], tail(arguments)));
}

/**
 * Returns a new list or string with the elements or characters in reverse
 * order.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [a]
 * @sig String -> String
 * @param {Array|String} list
 * @return {Array|String}
 * @example
 *
 *      R.reverse([1, 2, 3]);  //=> [3, 2, 1]
 *      R.reverse([1, 2]);     //=> [2, 1]
 *      R.reverse([1]);        //=> [1]
 *      R.reverse([]);         //=> []
 *
 *      R.reverse('abc');      //=> 'cba'
 *      R.reverse('ab');       //=> 'ba'
 *      R.reverse('a');        //=> 'a'
 *      R.reverse('');         //=> ''
 */

var reverse$1 =
/*#__PURE__*/
_curry1(function reverse(list) {
  return _isString(list) ? list.split('').reverse().join('') : Array.prototype.slice.call(list, 0).reverse();
});

/**
 * Performs right-to-left function composition. The last argument may have
 * any arity; the remaining arguments must be unary.
 *
 * **Note:** The result of compose is not automatically curried.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig ((y -> z), (x -> y), ..., (o -> p), ((a, b, ..., n) -> o)) -> ((a, b, ..., n) -> z)
 * @param {...Function} ...functions The functions to compose
 * @return {Function}
 * @see R.pipe
 * @example
 *
 *      const classyGreeting = (firstName, lastName) => "The name's " + lastName + ", " + firstName + " " + lastName
 *      const yellGreeting = R.compose(R.toUpper, classyGreeting);
 *      yellGreeting('James', 'Bond'); //=> "THE NAME'S BOND, JAMES BOND"
 *
 *      R.compose(Math.abs, R.add(1), R.multiply(2))(-4) //=> 7
 *
 * @symb R.compose(f, g, h)(a, b) = f(g(h(a, b)))
 * @symb R.compose(f, g, h)(a)(b) = f(g(h(a)))(b)
 */

function compose() {
  if (arguments.length === 0) {
    throw new Error('compose requires at least one argument');
  }

  return pipe$1.apply(this, reverse$1(arguments));
}

/**
 * Returns the first element of the given list or string. In some libraries
 * this function is named `first`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> a | Undefined
 * @sig String -> String
 * @param {Array|String} list
 * @return {*}
 * @see R.tail, R.init, R.last
 * @example
 *
 *      R.head(['fi', 'fo', 'fum']); //=> 'fi'
 *      R.head([]); //=> undefined
 *
 *      R.head('abc'); //=> 'a'
 *      R.head(''); //=> ''
 */

var head =
/*#__PURE__*/
nth(0);

function _identity(x) {
  return x;
}

/**
 * A function that does nothing but return the parameter supplied to it. Good
 * as a default or placeholder function.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig a -> a
 * @param {*} x The value to return.
 * @return {*} The input value, `x`.
 * @example
 *
 *      R.identity(1); //=> 1
 *
 *      const obj = {};
 *      R.identity(obj) === obj; //=> true
 * @symb R.identity(a) = a
 */

var identity =
/*#__PURE__*/
_curry1(_identity);

/**
 * Performs left-to-right function composition using transforming function. The first function may have
 * any arity; the remaining functions must be unary.
 *
 * **Note:** The result of pipeWith is not automatically curried. Transforming function is not used on the
 * first argument.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category Function
 * @sig ((* -> *), [((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)]) -> ((a, b, ..., n) -> z)
 * @param {Function} transformer The transforming function
 * @param {Array} functions The functions to pipe
 * @return {Function}
 * @see R.composeWith, R.pipe
 * @example
 *
 *      const pipeWhileNotNil = R.pipeWith((f, res) => R.isNil(res) ? res : f(res));
 *      const f = pipeWhileNotNil([Math.pow, R.negate, R.inc])
 *
 *      f(3, 4); // -(3^4) + 1
 * @symb R.pipeWith(f)([g, h, i])(...args) = f(i, f(h, g(...args)))
 */

var pipeWith =
/*#__PURE__*/
_curry2(function pipeWith(xf, list) {
  if (list.length <= 0) {
    return identity;
  }

  var headList = head(list);
  var tailList = tail(list);
  return _arity(headList.length, function () {
    return _reduce(function (result, f) {
      return xf.call(this, f, result);
    }, headList.apply(this, arguments), tailList);
  });
});

/**
 * Performs right-to-left function composition using transforming function. The last function may have
 * any arity; the remaining functions must be unary.
 *
 * **Note:** The result of composeWith is not automatically curried. Transforming function is not used
 * on the last argument.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category Function
 * @sig ((* -> *), [(y -> z), (x -> y), ..., (o -> p), ((a, b, ..., n) -> o)]) -> ((a, b, ..., n) -> z)
 * @param {Function} transformer The transforming function
 * @param {Array} functions The functions to compose
 * @return {Function}
 * @see R.compose, R.pipeWith
 * @example
 *
 *      const composeWhileNotNil = R.composeWith((f, res) => R.isNil(res) ? res : f(res));
 *
 *      composeWhileNotNil([R.inc, R.prop('age')])({age: 1}) //=> 2
 *      composeWhileNotNil([R.inc, R.prop('age')])({}) //=> undefined
 *
 * @symb R.composeWith(f)([g, h, i])(...args) = f(g, f(h, i(...args)))
 */

var composeWith =
/*#__PURE__*/
_curry2(function composeWith(xf, list) {
  return pipeWith.apply(this, [xf, reverse$1(list)]);
});

function _arrayFromIterator(iter) {
  var list = [];
  var next;

  while (!(next = iter.next()).done) {
    list.push(next.value);
  }

  return list;
}

function _includesWith(pred, x, list) {
  var idx = 0;
  var len = list.length;

  while (idx < len) {
    if (pred(x, list[idx])) {
      return true;
    }

    idx += 1;
  }

  return false;
}

function _functionName(f) {
  // String(x => x) evaluates to "x => x", so the pattern may not match.
  var match = String(f).match(/^function (\w*)/);
  return match == null ? '' : match[1];
}

// Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
function _objectIs(a, b) {
  // SameValue algorithm
  if (a === b) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return a !== 0 || 1 / a === 1 / b;
  } else {
    // Step 6.a: NaN == NaN
    return a !== a && b !== b;
  }
}

var _objectIs$1 = typeof Object.is === 'function' ? Object.is : _objectIs;

/**
 * private _uniqContentEquals function.
 * That function is checking equality of 2 iterator contents with 2 assumptions
 * - iterators lengths are the same
 * - iterators values are unique
 *
 * false-positive result will be returned for comparison of, e.g.
 * - [1,2,3] and [1,2,3,4]
 * - [1,1,1] and [1,2,3]
 * */

function _uniqContentEquals(aIterator, bIterator, stackA, stackB) {
  var a = _arrayFromIterator(aIterator);

  var b = _arrayFromIterator(bIterator);

  function eq(_a, _b) {
    return _equals(_a, _b, stackA.slice(), stackB.slice());
  } // if *a* array contains any element that is not included in *b*


  return !_includesWith(function (b, aItem) {
    return !_includesWith(eq, aItem, b);
  }, b, a);
}

function _equals(a, b, stackA, stackB) {
  if (_objectIs$1(a, b)) {
    return true;
  }

  var typeA = type$1(a);

  if (typeA !== type$1(b)) {
    return false;
  }

  if (typeof a['fantasy-land/equals'] === 'function' || typeof b['fantasy-land/equals'] === 'function') {
    return typeof a['fantasy-land/equals'] === 'function' && a['fantasy-land/equals'](b) && typeof b['fantasy-land/equals'] === 'function' && b['fantasy-land/equals'](a);
  }

  if (typeof a.equals === 'function' || typeof b.equals === 'function') {
    return typeof a.equals === 'function' && a.equals(b) && typeof b.equals === 'function' && b.equals(a);
  }

  switch (typeA) {
    case 'Arguments':
    case 'Array':
    case 'Object':
      if (typeof a.constructor === 'function' && _functionName(a.constructor) === 'Promise') {
        return a === b;
      }

      break;

    case 'Boolean':
    case 'Number':
    case 'String':
      if (!(typeof a === typeof b && _objectIs$1(a.valueOf(), b.valueOf()))) {
        return false;
      }

      break;

    case 'Date':
      if (!_objectIs$1(a.valueOf(), b.valueOf())) {
        return false;
      }

      break;

    case 'Error':
      return a.name === b.name && a.message === b.message;

    case 'RegExp':
      if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
        return false;
      }

      break;
  }

  var idx = stackA.length - 1;

  while (idx >= 0) {
    if (stackA[idx] === a) {
      return stackB[idx] === b;
    }

    idx -= 1;
  }

  switch (typeA) {
    case 'Map':
      if (a.size !== b.size) {
        return false;
      }

      return _uniqContentEquals(a.entries(), b.entries(), stackA.concat([a]), stackB.concat([b]));

    case 'Set':
      if (a.size !== b.size) {
        return false;
      }

      return _uniqContentEquals(a.values(), b.values(), stackA.concat([a]), stackB.concat([b]));

    case 'Arguments':
    case 'Array':
    case 'Object':
    case 'Boolean':
    case 'Number':
    case 'String':
    case 'Date':
    case 'Error':
    case 'RegExp':
    case 'Int8Array':
    case 'Uint8Array':
    case 'Uint8ClampedArray':
    case 'Int16Array':
    case 'Uint16Array':
    case 'Int32Array':
    case 'Uint32Array':
    case 'Float32Array':
    case 'Float64Array':
    case 'ArrayBuffer':
      break;

    default:
      // Values of other types are only equal if identical.
      return false;
  }

  var keysA = keys(a);

  if (keysA.length !== keys(b).length) {
    return false;
  }

  var extendedStackA = stackA.concat([a]);
  var extendedStackB = stackB.concat([b]);
  idx = keysA.length - 1;

  while (idx >= 0) {
    var key = keysA[idx];

    if (!(_has(key, b) && _equals(b[key], a[key], extendedStackA, extendedStackB))) {
      return false;
    }

    idx -= 1;
  }

  return true;
}

/**
 * Returns `true` if its arguments are equivalent, `false` otherwise. Handles
 * cyclical data structures.
 *
 * Dispatches symmetrically to the `equals` methods of both arguments, if
 * present.
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category Relation
 * @sig a -> b -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @example
 *
 *      R.equals(1, 1); //=> true
 *      R.equals(1, '1'); //=> false
 *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
 *
 *      const a = {}; a.v = a;
 *      const b = {}; b.v = b;
 *      R.equals(a, b); //=> true
 */

var equals =
/*#__PURE__*/
_curry2(function equals(a, b) {
  return _equals(a, b, [], []);
});

function _indexOf(list, a, idx) {
  var inf, item; // Array.prototype.indexOf doesn't exist below IE9

  if (typeof list.indexOf === 'function') {
    switch (typeof a) {
      case 'number':
        if (a === 0) {
          // manually crawl the list to distinguish between +0 and -0
          inf = 1 / a;

          while (idx < list.length) {
            item = list[idx];

            if (item === 0 && 1 / item === inf) {
              return idx;
            }

            idx += 1;
          }

          return -1;
        } else if (a !== a) {
          // NaN
          while (idx < list.length) {
            item = list[idx];

            if (typeof item === 'number' && item !== item) {
              return idx;
            }

            idx += 1;
          }

          return -1;
        } // non-zero numbers can utilise Set


        return list.indexOf(a, idx);
      // all these types can utilise Set

      case 'string':
      case 'boolean':
      case 'function':
      case 'undefined':
        return list.indexOf(a, idx);

      case 'object':
        if (a === null) {
          // null can utilise Set
          return list.indexOf(a, idx);
        }

    }
  } // anything else not covered above, defer to R.equals


  while (idx < list.length) {
    if (equals(list[idx], a)) {
      return idx;
    }

    idx += 1;
  }

  return -1;
}

function _includes(a, list) {
  return _indexOf(list, a, 0) >= 0;
}

function _quote(s) {
  var escaped = s.replace(/\\/g, '\\\\').replace(/[\b]/g, '\\b') // \b matches word boundary; [\b] matches backspace
  .replace(/\f/g, '\\f').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t').replace(/\v/g, '\\v').replace(/\0/g, '\\0');
  return '"' + escaped.replace(/"/g, '\\"') + '"';
}

/**
 * Polyfill from <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString>.
 */
var pad = function pad(n) {
  return (n < 10 ? '0' : '') + n;
};

var _toISOString = typeof Date.prototype.toISOString === 'function' ? function _toISOString(d) {
  return d.toISOString();
} : function _toISOString(d) {
  return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + '.' + (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + 'Z';
};

function _complement(f) {
  return function () {
    return !f.apply(this, arguments);
  };
}

function _filter(fn, list) {
  var idx = 0;
  var len = list.length;
  var result = [];

  while (idx < len) {
    if (fn(list[idx])) {
      result[result.length] = list[idx];
    }

    idx += 1;
  }

  return result;
}

function _isObject(x) {
  return Object.prototype.toString.call(x) === '[object Object]';
}

var XFilter =
/*#__PURE__*/
function () {
  function XFilter(f, xf) {
    this.xf = xf;
    this.f = f;
  }

  XFilter.prototype['@@transducer/init'] = _xfBase.init;
  XFilter.prototype['@@transducer/result'] = _xfBase.result;

  XFilter.prototype['@@transducer/step'] = function (result, input) {
    return this.f(input) ? this.xf['@@transducer/step'](result, input) : result;
  };

  return XFilter;
}();

var _xfilter =
/*#__PURE__*/
_curry2(function _xfilter(f, xf) {
  return new XFilter(f, xf);
});

/**
 * Takes a predicate and a `Filterable`, and returns a new filterable of the
 * same type containing the members of the given filterable which satisfy the
 * given predicate. Filterable objects include plain objects or any object
 * that has a filter method such as `Array`.
 *
 * Dispatches to the `filter` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Filterable f => (a -> Boolean) -> f a -> f a
 * @param {Function} pred
 * @param {Array} filterable
 * @return {Array} Filterable
 * @see R.reject, R.transduce, R.addIndex
 * @example
 *
 *      const isEven = n => n % 2 === 0;
 *
 *      R.filter(isEven, [1, 2, 3, 4]); //=> [2, 4]
 *
 *      R.filter(isEven, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
 */

var filter =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['fantasy-land/filter', 'filter'], _xfilter, function (pred, filterable) {
  return _isObject(filterable) ? _reduce(function (acc, key) {
    if (pred(filterable[key])) {
      acc[key] = filterable[key];
    }

    return acc;
  }, {}, keys(filterable)) : // else
  _filter(pred, filterable);
}));

/**
 * The complement of [`filter`](#filter).
 *
 * Acts as a transducer if a transformer is given in list position. Filterable
 * objects include plain objects or any object that has a filter method such
 * as `Array`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Filterable f => (a -> Boolean) -> f a -> f a
 * @param {Function} pred
 * @param {Array} filterable
 * @return {Array}
 * @see R.filter, R.transduce, R.addIndex
 * @example
 *
 *      const isOdd = (n) => n % 2 !== 0;
 *
 *      R.reject(isOdd, [1, 2, 3, 4]); //=> [2, 4]
 *
 *      R.reject(isOdd, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
 */

var reject$1 =
/*#__PURE__*/
_curry2(function reject(pred, filterable) {
  return filter(_complement(pred), filterable);
});

function _toString(x, seen) {
  var recur = function recur(y) {
    var xs = seen.concat([x]);
    return _includes(y, xs) ? '<Circular>' : _toString(y, xs);
  }; //  mapPairs :: (Object, [String]) -> [String]


  var mapPairs = function (obj, keys) {
    return _map(function (k) {
      return _quote(k) + ': ' + recur(obj[k]);
    }, keys.slice().sort());
  };

  switch (Object.prototype.toString.call(x)) {
    case '[object Arguments]':
      return '(function() { return arguments; }(' + _map(recur, x).join(', ') + '))';

    case '[object Array]':
      return '[' + _map(recur, x).concat(mapPairs(x, reject$1(function (k) {
        return /^\d+$/.test(k);
      }, keys(x)))).join(', ') + ']';

    case '[object Boolean]':
      return typeof x === 'object' ? 'new Boolean(' + recur(x.valueOf()) + ')' : x.toString();

    case '[object Date]':
      return 'new Date(' + (isNaN(x.valueOf()) ? recur(NaN) : _quote(_toISOString(x))) + ')';

    case '[object Null]':
      return 'null';

    case '[object Number]':
      return typeof x === 'object' ? 'new Number(' + recur(x.valueOf()) + ')' : 1 / x === -Infinity ? '-0' : x.toString(10);

    case '[object String]':
      return typeof x === 'object' ? 'new String(' + recur(x.valueOf()) + ')' : _quote(x);

    case '[object Undefined]':
      return 'undefined';

    default:
      if (typeof x.toString === 'function') {
        var repr = x.toString();

        if (repr !== '[object Object]') {
          return repr;
        }
      }

      return '{' + mapPairs(x, keys(x)).join(', ') + '}';
  }
}

/**
 * Returns the string representation of the given value. `eval`'ing the output
 * should result in a value equivalent to the input value. Many of the built-in
 * `toString` methods do not satisfy this requirement.
 *
 * If the given value is an `[object Object]` with a `toString` method other
 * than `Object.prototype.toString`, this method is invoked with no arguments
 * to produce the return value. This means user-defined constructor functions
 * can provide a suitable `toString` method. For example:
 *
 *     function Point(x, y) {
 *       this.x = x;
 *       this.y = y;
 *     }
 *
 *     Point.prototype.toString = function() {
 *       return 'new Point(' + this.x + ', ' + this.y + ')';
 *     };
 *
 *     R.toString(new Point(1, 2)); //=> 'new Point(1, 2)'
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category String
 * @sig * -> String
 * @param {*} val
 * @return {String}
 * @example
 *
 *      R.toString(42); //=> '42'
 *      R.toString('abc'); //=> '"abc"'
 *      R.toString([1, 2, 3]); //=> '[1, 2, 3]'
 *      R.toString({foo: 1, bar: 2, baz: 3}); //=> '{"bar": 2, "baz": 3, "foo": 1}'
 *      R.toString(new Date('2001-02-03T04:05:06Z')); //=> 'new Date("2001-02-03T04:05:06.000Z")'
 */

var toString =
/*#__PURE__*/
_curry1(function toString(val) {
  return _toString(val, []);
});

/**
 * Returns the result of concatenating the given lists or strings.
 *
 * Note: `R.concat` expects both arguments to be of the same type,
 * unlike the native `Array.prototype.concat` method. It will throw
 * an error if you `concat` an Array with a non-Array value.
 *
 * Dispatches to the `concat` method of the first argument, if present.
 * Can also concatenate two members of a [fantasy-land
 * compatible semigroup](https://github.com/fantasyland/fantasy-land#semigroup).
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [a] -> [a]
 * @sig String -> String -> String
 * @param {Array|String} firstList The first list
 * @param {Array|String} secondList The second list
 * @return {Array|String} A list consisting of the elements of `firstList` followed by the elements of
 * `secondList`.
 *
 * @example
 *
 *      R.concat('ABC', 'DEF'); // 'ABCDEF'
 *      R.concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
 *      R.concat([], []); //=> []
 */

var concat =
/*#__PURE__*/
_curry2(function concat(a, b) {
  if (_isArray(a)) {
    if (_isArray(b)) {
      return a.concat(b);
    }

    throw new TypeError(toString(b) + ' is not an array');
  }

  if (_isString(a)) {
    if (_isString(b)) {
      return a + b;
    }

    throw new TypeError(toString(b) + ' is not a string');
  }

  if (a != null && _isFunction(a['fantasy-land/concat'])) {
    return a['fantasy-land/concat'](b);
  }

  if (a != null && _isFunction(a.concat)) {
    return a.concat(b);
  }

  throw new TypeError(toString(a) + ' does not have a method named "concat" or "fantasy-land/concat"');
});

/**
 * Returns a function, `fn`, which encapsulates `if/else, if/else, ...` logic.
 * `R.cond` takes a list of [predicate, transformer] pairs. All of the arguments
 * to `fn` are applied to each of the predicates in turn until one returns a
 * "truthy" value, at which point `fn` returns the result of applying its
 * arguments to the corresponding transformer. If none of the predicates
 * matches, `fn` returns undefined.
 *
 * **Please note**: This is not a direct substitute for a `switch` statement.
 * Remember that both elements of every pair passed to `cond` are *functions*,
 * and `cond` returns a function.
 *
 * @func
 * @memberOf R
 * @since v0.6.0
 * @category Logic
 * @sig [[(*... -> Boolean),(*... -> *)]] -> (*... -> *)
 * @param {Array} pairs A list of [predicate, transformer]
 * @return {Function}
 * @see R.ifElse, R.unless, R.when
 * @example
 *
 *      const fn = R.cond([
 *        [R.equals(0),   R.always('water freezes at 0°C')],
 *        [R.equals(100), R.always('water boils at 100°C')],
 *        [R.T,           temp => 'nothing special happens at ' + temp + '°C']
 *      ]);
 *      fn(0); //=> 'water freezes at 0°C'
 *      fn(50); //=> 'nothing special happens at 50°C'
 *      fn(100); //=> 'water boils at 100°C'
 */

var cond =
/*#__PURE__*/
_curry1(function cond(pairs) {
  var arity = reduce(max, 0, map$1(function (pair) {
    return pair[0].length;
  }, pairs));
  return _arity(arity, function () {
    var idx = 0;

    while (idx < pairs.length) {
      if (pairs[idx][0].apply(this, arguments)) {
        return pairs[idx][1].apply(this, arguments);
      }

      idx += 1;
    }
  });
});

/**
 * Returns a curried equivalent of the provided function. The curried function
 * has two unusual capabilities. First, its arguments needn't be provided one
 * at a time. If `f` is a ternary function and `g` is `R.curry(f)`, the
 * following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
 * the following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (* -> a) -> (* -> a)
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curryN, R.partial
 * @example
 *
 *      const addFourNumbers = (a, b, c, d) => a + b + c + d;
 *
 *      const curriedAddFourNumbers = R.curry(addFourNumbers);
 *      const f = curriedAddFourNumbers(1, 2);
 *      const g = f(3);
 *      g(4); //=> 10
 */

var curry =
/*#__PURE__*/
_curry1(function curry(fn) {
  return curryN(fn.length, fn);
});

/**
 * Wraps a constructor function inside a curried function that can be called
 * with the same arguments and returns the same type. The arity of the function
 * returned is specified to allow using variadic constructor functions.
 *
 * @func
 * @memberOf R
 * @since v0.4.0
 * @category Function
 * @sig Number -> (* -> {*}) -> (* -> {*})
 * @param {Number} n The arity of the constructor function.
 * @param {Function} Fn The constructor function to wrap.
 * @return {Function} A wrapped, curried constructor function.
 * @example
 *
 *      // Variadic Constructor function
 *      function Salad() {
 *        this.ingredients = arguments;
 *      }
 *
 *      Salad.prototype.recipe = function() {
 *        const instructions = R.map(ingredient => 'Add a dollop of ' + ingredient, this.ingredients);
 *        return R.join('\n', instructions);
 *      };
 *
 *      const ThreeLayerSalad = R.constructN(3, Salad);
 *
 *      // Notice we no longer need the 'new' keyword, and the constructor is curried for 3 arguments.
 *      const salad = ThreeLayerSalad('Mayonnaise')('Potato Chips')('Ketchup');
 *
 *      console.log(salad.recipe());
 *      // Add a dollop of Mayonnaise
 *      // Add a dollop of Potato Chips
 *      // Add a dollop of Ketchup
 */

var constructN =
/*#__PURE__*/
_curry2(function constructN(n, Fn) {
  if (n > 10) {
    throw new Error('Constructor with greater than ten arguments');
  }

  if (n === 0) {
    return function () {
      return new Fn();
    };
  }

  return curry(nAry(n, function ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9) {
    switch (arguments.length) {
      case 1:
        return new Fn($0);

      case 2:
        return new Fn($0, $1);

      case 3:
        return new Fn($0, $1, $2);

      case 4:
        return new Fn($0, $1, $2, $3);

      case 5:
        return new Fn($0, $1, $2, $3, $4);

      case 6:
        return new Fn($0, $1, $2, $3, $4, $5);

      case 7:
        return new Fn($0, $1, $2, $3, $4, $5, $6);

      case 8:
        return new Fn($0, $1, $2, $3, $4, $5, $6, $7);

      case 9:
        return new Fn($0, $1, $2, $3, $4, $5, $6, $7, $8);

      case 10:
        return new Fn($0, $1, $2, $3, $4, $5, $6, $7, $8, $9);
    }
  }));
});

/**
 * Wraps a constructor function inside a curried function that can be called
 * with the same arguments and returns the same type.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (* -> {*}) -> (* -> {*})
 * @param {Function} fn The constructor function to wrap.
 * @return {Function} A wrapped, curried constructor function.
 * @see R.invoker
 * @example
 *
 *      // Constructor function
 *      function Animal(kind) {
 *        this.kind = kind;
 *      };
 *      Animal.prototype.sighting = function() {
 *        return "It's a " + this.kind + "!";
 *      }
 *
 *      const AnimalConstructor = R.construct(Animal)
 *
 *      // Notice we no longer need the 'new' keyword:
 *      AnimalConstructor('Pig'); //=> {"kind": "Pig", "sighting": function (){...}};
 *
 *      const animalTypes = ["Lion", "Tiger", "Bear"];
 *      const animalSighting = R.invoker(0, 'sighting');
 *      const sightNewAnimal = R.compose(animalSighting, AnimalConstructor);
 *      R.map(sightNewAnimal, animalTypes); //=> ["It's a Lion!", "It's a Tiger!", "It's a Bear!"]
 */

var construct =
/*#__PURE__*/
_curry1(function construct(Fn) {
  return constructN(Fn.length, Fn);
});

/**
 * Accepts a converging function and a list of branching functions and returns
 * a new function. The arity of the new function is the same as the arity of
 * the longest branching function. When invoked, this new function is applied
 * to some arguments, and each branching function is applied to those same
 * arguments. The results of each branching function are passed as arguments
 * to the converging function to produce the return value.
 *
 * @func
 * @memberOf R
 * @since v0.4.2
 * @category Function
 * @sig ((x1, x2, ...) -> z) -> [((a, b, ...) -> x1), ((a, b, ...) -> x2), ...] -> (a -> b -> ... -> z)
 * @param {Function} after A function. `after` will be invoked with the return values of
 *        `fn1` and `fn2` as its arguments.
 * @param {Array} functions A list of functions.
 * @return {Function} A new function.
 * @see R.useWith
 * @example
 *
 *      const average = R.converge(R.divide, [R.sum, R.length])
 *      average([1, 2, 3, 4, 5, 6, 7]) //=> 4
 *
 *      const strangeConcat = R.converge(R.concat, [R.toUpper, R.toLower])
 *      strangeConcat("Yodel") //=> "YODELyodel"
 *
 * @symb R.converge(f, [g, h])(a, b) = f(g(a, b), h(a, b))
 */

var converge =
/*#__PURE__*/
_curry2(function converge(after, fns) {
  return curryN(reduce(max, 0, pluck('length', fns)), function () {
    var args = arguments;
    var context = this;
    return after.apply(context, _map(function (fn) {
      return fn.apply(context, args);
    }, fns));
  });
});

/**
 * Returns the number of items in a given `list` matching the predicate `f`
 *
 * @func
 * @memberOf R
 * @since v0.28.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> Number
 * @param {Function} predicate to match items against
 * @return {Array} list of items to count in
 * @example
 *
 *      const even = x => x % 2 == 0;
 *
 *      R.count(even, [1, 2, 3, 4, 5]); // => 2
 *      R.map(R.count(even), [[1, 1, 1], [2, 3, 4, 5], [6]]); // => [0, 2, 1]
 */

var count =
/*#__PURE__*/
curry(function (pred, list) {
  return _reduce(function (a, e) {
    return pred(e) ? a + 1 : a;
  }, 0, list);
});

var XReduceBy =
/*#__PURE__*/
function () {
  function XReduceBy(valueFn, valueAcc, keyFn, xf) {
    this.valueFn = valueFn;
    this.valueAcc = valueAcc;
    this.keyFn = keyFn;
    this.xf = xf;
    this.inputs = {};
  }

  XReduceBy.prototype['@@transducer/init'] = _xfBase.init;

  XReduceBy.prototype['@@transducer/result'] = function (result) {
    var key;

    for (key in this.inputs) {
      if (_has(key, this.inputs)) {
        result = this.xf['@@transducer/step'](result, this.inputs[key]);

        if (result['@@transducer/reduced']) {
          result = result['@@transducer/value'];
          break;
        }
      }
    }

    this.inputs = null;
    return this.xf['@@transducer/result'](result);
  };

  XReduceBy.prototype['@@transducer/step'] = function (result, input) {
    var key = this.keyFn(input);
    this.inputs[key] = this.inputs[key] || [key, this.valueAcc];
    this.inputs[key][1] = this.valueFn(this.inputs[key][1], input);
    return result;
  };

  return XReduceBy;
}();

var _xreduceBy =
/*#__PURE__*/
_curryN(4, [], function _xreduceBy(valueFn, valueAcc, keyFn, xf) {
  return new XReduceBy(valueFn, valueAcc, keyFn, xf);
});

/**
 * Groups the elements of the list according to the result of calling
 * the String-returning function `keyFn` on each element and reduces the elements
 * of each group to a single value via the reducer function `valueFn`.
 *
 * The value function receives two values: *(acc, value)*. It may use
 * [`R.reduced`](#reduced) to short circuit the iteration.
 *
 * This function is basically a more general [`groupBy`](#groupBy) function.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.20.0
 * @category List
 * @sig ((a, b) -> a) -> a -> (b -> String) -> [b] -> {String: a}
 * @param {Function} valueFn The function that reduces the elements of each group to a single
 *        value. Receives two values, accumulator for a particular group and the current element.
 * @param {*} acc The (initial) accumulator value for each group.
 * @param {Function} keyFn The function that maps the list's element into a key.
 * @param {Array} list The array to group.
 * @return {Object} An object with the output of `keyFn` for keys, mapped to the output of
 *         `valueFn` for elements which produced that key when passed to `keyFn`.
 * @see R.groupBy, R.reduce, R.reduced
 * @example
 *
 *      const groupNames = (acc, {name}) => acc.concat(name)
 *      const toGrade = ({score}) =>
 *        score < 65 ? 'F' :
 *        score < 70 ? 'D' :
 *        score < 80 ? 'C' :
 *        score < 90 ? 'B' : 'A'
 *
 *      var students = [
 *        {name: 'Abby', score: 83},
 *        {name: 'Bart', score: 62},
 *        {name: 'Curt', score: 88},
 *        {name: 'Dora', score: 92},
 *      ]
 *
 *      reduceBy(groupNames, [], toGrade, students)
 *      //=> {"A": ["Dora"], "B": ["Abby", "Curt"], "F": ["Bart"]}
 */

var reduceBy =
/*#__PURE__*/
_curryN(4, [],
/*#__PURE__*/
_dispatchable([], _xreduceBy, function reduceBy(valueFn, valueAcc, keyFn, list) {
  return _reduce(function (acc, elt) {
    var key = keyFn(elt);
    var value = valueFn(_has(key, acc) ? acc[key] : _clone(valueAcc, [], [], false), elt);

    if (value && value['@@transducer/reduced']) {
      return _reduced(acc);
    }

    acc[key] = value;
    return acc;
  }, {}, list);
}));

/**
 * Counts the elements of a list according to how many match each value of a
 * key generated by the supplied function. Returns an object mapping the keys
 * produced by `fn` to the number of occurrences in the list. Note that all
 * keys are coerced to strings because of how JavaScript objects work.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig (a -> String) -> [a] -> {*}
 * @param {Function} fn The function used to map values to keys.
 * @param {Array} list The list to count elements from.
 * @return {Object} An object mapping keys to number of occurrences in the list.
 * @example
 *
 *      const numbers = [1.0, 1.1, 1.2, 2.0, 3.0, 2.2];
 *      R.countBy(Math.floor)(numbers);    //=> {'1': 3, '2': 2, '3': 1}
 *
 *      const letters = ['a', 'b', 'A', 'a', 'B', 'c'];
 *      R.countBy(R.toLower)(letters);   //=> {'a': 3, 'b': 2, 'c': 1}
 */

var countBy =
/*#__PURE__*/
reduceBy(function (acc, elem) {
  return acc + 1;
}, 0);

/**
 * Decrements its argument.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Math
 * @sig Number -> Number
 * @param {Number} n
 * @return {Number} n - 1
 * @see R.inc
 * @example
 *
 *      R.dec(42); //=> 41
 */

var dec =
/*#__PURE__*/
add(-1);

/**
 * Returns the second argument if it is not `null`, `undefined` or `NaN`;
 * otherwise the first argument is returned.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category Logic
 * @sig a -> b -> a | b
 * @param {a} default The default value.
 * @param {b} val `val` will be returned instead of `default` unless `val` is `null`, `undefined` or `NaN`.
 * @return {*} The second value if it is not `null`, `undefined` or `NaN`, otherwise the default value
 * @example
 *
 *      const defaultTo42 = R.defaultTo(42);
 *
 *      defaultTo42(null);  //=> 42
 *      defaultTo42(undefined);  //=> 42
 *      defaultTo42(false);  //=> false
 *      defaultTo42('Ramda');  //=> 'Ramda'
 *      // parseInt('string') results in NaN
 *      defaultTo42(parseInt('string')); //=> 42
 */

var defaultTo =
/*#__PURE__*/
_curry2(function defaultTo(d, v) {
  return v == null || v !== v ? d : v;
});

/**
 * Makes a descending comparator function out of a function that returns a value
 * that can be compared with `<` and `>`.
 *
 * @func
 * @memberOf R
 * @since v0.23.0
 * @category Function
 * @sig Ord b => (a -> b) -> a -> a -> Number
 * @param {Function} fn A function of arity one that returns a value that can be compared
 * @param {*} a The first item to be compared.
 * @param {*} b The second item to be compared.
 * @return {Number} `-1` if fn(a) > fn(b), `1` if fn(b) > fn(a), otherwise `0`
 * @see R.ascend
 * @example
 *
 *      const byAge = R.descend(R.prop('age'));
 *      const people = [
 *        { name: 'Emma', age: 70 },
 *        { name: 'Peter', age: 78 },
 *        { name: 'Mikhail', age: 62 },
 *      ];
 *      const peopleByOldestFirst = R.sort(byAge, people);
 *        //=> [{ name: 'Peter', age: 78 }, { name: 'Emma', age: 70 }, { name: 'Mikhail', age: 62 }]
 */

var descend =
/*#__PURE__*/
_curry3(function descend(fn, a, b) {
  var aa = fn(a);
  var bb = fn(b);
  return aa > bb ? -1 : aa < bb ? 1 : 0;
});

var _Set =
/*#__PURE__*/
function () {
  function _Set() {
    /* globals Set */
    this._nativeSet = typeof Set === 'function' ? new Set() : null;
    this._items = {};
  }

  // until we figure out why jsdoc chokes on this
  // @param item The item to add to the Set
  // @returns {boolean} true if the item did not exist prior, otherwise false
  //
  _Set.prototype.add = function (item) {
    return !hasOrAdd(item, true, this);
  }; //
  // @param item The item to check for existence in the Set
  // @returns {boolean} true if the item exists in the Set, otherwise false
  //


  _Set.prototype.has = function (item) {
    return hasOrAdd(item, false, this);
  }; //
  // Combines the logic for checking whether an item is a member of the set and
  // for adding a new item to the set.
  //
  // @param item       The item to check or add to the Set instance.
  // @param shouldAdd  If true, the item will be added to the set if it doesn't
  //                   already exist.
  // @param set        The set instance to check or add to.
  // @return {boolean} true if the item already existed, otherwise false.
  //


  return _Set;
}();

function hasOrAdd(item, shouldAdd, set) {
  var type = typeof item;
  var prevSize, newSize;

  switch (type) {
    case 'string':
    case 'number':
      // distinguish between +0 and -0
      if (item === 0 && 1 / item === -Infinity) {
        if (set._items['-0']) {
          return true;
        } else {
          if (shouldAdd) {
            set._items['-0'] = true;
          }

          return false;
        }
      } // these types can all utilise the native Set


      if (set._nativeSet !== null) {
        if (shouldAdd) {
          prevSize = set._nativeSet.size;

          set._nativeSet.add(item);

          newSize = set._nativeSet.size;
          return newSize === prevSize;
        } else {
          return set._nativeSet.has(item);
        }
      } else {
        if (!(type in set._items)) {
          if (shouldAdd) {
            set._items[type] = {};
            set._items[type][item] = true;
          }

          return false;
        } else if (item in set._items[type]) {
          return true;
        } else {
          if (shouldAdd) {
            set._items[type][item] = true;
          }

          return false;
        }
      }

    case 'boolean':
      // set._items['boolean'] holds a two element array
      // representing [ falseExists, trueExists ]
      if (type in set._items) {
        var bIdx = item ? 1 : 0;

        if (set._items[type][bIdx]) {
          return true;
        } else {
          if (shouldAdd) {
            set._items[type][bIdx] = true;
          }

          return false;
        }
      } else {
        if (shouldAdd) {
          set._items[type] = item ? [false, true] : [true, false];
        }

        return false;
      }

    case 'function':
      // compare functions for reference equality
      if (set._nativeSet !== null) {
        if (shouldAdd) {
          prevSize = set._nativeSet.size;

          set._nativeSet.add(item);

          newSize = set._nativeSet.size;
          return newSize === prevSize;
        } else {
          return set._nativeSet.has(item);
        }
      } else {
        if (!(type in set._items)) {
          if (shouldAdd) {
            set._items[type] = [item];
          }

          return false;
        }

        if (!_includes(item, set._items[type])) {
          if (shouldAdd) {
            set._items[type].push(item);
          }

          return false;
        }

        return true;
      }

    case 'undefined':
      if (set._items[type]) {
        return true;
      } else {
        if (shouldAdd) {
          set._items[type] = true;
        }

        return false;
      }

    case 'object':
      if (item === null) {
        if (!set._items['null']) {
          if (shouldAdd) {
            set._items['null'] = true;
          }

          return false;
        }

        return true;
      }

    /* falls through */

    default:
      // reduce the search size of heterogeneous sets by creating buckets
      // for each type.
      type = Object.prototype.toString.call(item);

      if (!(type in set._items)) {
        if (shouldAdd) {
          set._items[type] = [item];
        }

        return false;
      } // scan through all previously applied items


      if (!_includes(item, set._items[type])) {
        if (shouldAdd) {
          set._items[type].push(item);
        }

        return false;
      }

      return true;
  }
} // A simple Set type that honours R.equals semantics

/**
 * Finds the set (i.e. no duplicates) of all elements in the first list not
 * contained in the second list. Objects and Arrays are compared in terms of
 * value equality, not reference equality.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig [*] -> [*] -> [*]
 * @param {Array} list1 The first list.
 * @param {Array} list2 The second list.
 * @return {Array} The elements in `list1` that are not in `list2`.
 * @see R.differenceWith, R.symmetricDifference, R.symmetricDifferenceWith, R.without
 * @example
 *
 *      R.difference([1,2,3,4], [7,6,5,4,3]); //=> [1,2]
 *      R.difference([7,6,5,4,3], [1,2,3,4]); //=> [7,6,5]
 *      R.difference([{a: 1}, {b: 2}], [{a: 1}, {c: 3}]) //=> [{b: 2}]
 */

var difference =
/*#__PURE__*/
_curry2(function difference(first, second) {
  var out = [];
  var idx = 0;
  var firstLen = first.length;
  var secondLen = second.length;
  var toFilterOut = new _Set();

  for (var i = 0; i < secondLen; i += 1) {
    toFilterOut.add(second[i]);
  }

  while (idx < firstLen) {
    if (toFilterOut.add(first[idx])) {
      out[out.length] = first[idx];
    }

    idx += 1;
  }

  return out;
});

/**
 * Finds the set (i.e. no duplicates) of all elements in the first list not
 * contained in the second list. Duplication is determined according to the
 * value returned by applying the supplied predicate to two list elements.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig ((a, a) -> Boolean) -> [a] -> [a] -> [a]
 * @param {Function} pred A predicate used to test whether two items are equal.
 * @param {Array} list1 The first list.
 * @param {Array} list2 The second list.
 * @return {Array} The elements in `list1` that are not in `list2`.
 * @see R.difference, R.symmetricDifference, R.symmetricDifferenceWith
 * @example
 *
 *      const cmp = (x, y) => x.a === y.a;
 *      const l1 = [{a: 1}, {a: 2}, {a: 3}];
 *      const l2 = [{a: 3}, {a: 4}];
 *      R.differenceWith(cmp, l1, l2); //=> [{a: 1}, {a: 2}]
 */

var differenceWith =
/*#__PURE__*/
_curry3(function differenceWith(pred, first, second) {
  var out = [];
  var idx = 0;
  var firstLen = first.length;

  while (idx < firstLen) {
    if (!_includesWith(pred, first[idx], second) && !_includesWith(pred, first[idx], out)) {
      out.push(first[idx]);
    }

    idx += 1;
  }

  return out;
});

/**
 * Removes the sub-list of `list` starting at index `start` and containing
 * `count` elements. _Note that this is not destructive_: it returns a copy of
 * the list with the changes.
 * <small>No lists have been harmed in the application of this function.</small>
 *
 * @func
 * @memberOf R
 * @since v0.2.2
 * @category List
 * @sig Number -> Number -> [a] -> [a]
 * @param {Number} start The position to start removing elements
 * @param {Number} count The number of elements to remove
 * @param {Array} list The list to remove from
 * @return {Array} A new Array with `count` elements from `start` removed.
 * @see R.without
 * @example
 *
 *      R.remove(2, 3, [1,2,3,4,5,6,7,8]); //=> [1,2,6,7,8]
 */

var remove =
/*#__PURE__*/
_curry3(function remove(start, count, list) {
  var result = Array.prototype.slice.call(list, 0);
  result.splice(start, count);
  return result;
});

/**
 * Returns a new object that does not contain a `prop` property.
 *
 * @private
 * @param {String|Number} prop The name of the property to dissociate
 * @param {Object|Array} obj The object to clone
 * @return {Object} A new object equivalent to the original but without the specified property
 */

function _dissoc(prop, obj) {
  if (obj == null) {
    return obj;
  }

  if (_isInteger(prop) && _isArray(obj)) {
    return remove(prop, 1, obj);
  }

  var result = {};

  for (var p in obj) {
    result[p] = obj[p];
  }

  delete result[prop];
  return result;
}

/**
 * Makes a shallow clone of an object. Note that this copies and flattens
 * prototype properties onto the new object as well. All non-primitive
 * properties are copied by reference.
 *
 * @private
 * @param {String|Integer} prop The prop operating
 * @param {Object|Array} obj The object to clone
 * @return {Object|Array} A new object equivalent to the original.
 */

function _shallowCloneObject(prop, obj) {
  if (_isInteger(prop) && _isArray(obj)) {
    return [].concat(obj);
  }

  var result = {};

  for (var p in obj) {
    result[p] = obj[p];
  }

  return result;
}
/**
 * Makes a shallow clone of an object, omitting the property at the given path.
 * Note that this copies and flattens prototype properties onto the new object
 * as well. All non-primitive properties are copied by reference.
 *
 * @func
 * @memberOf R
 * @since v0.11.0
 * @category Object
 * @typedefn Idx = String | Int | Symbol
 * @sig [Idx] -> {k: v} -> {k: v}
 * @param {Array} path The path to the value to omit
 * @param {Object} obj The object to clone
 * @return {Object} A new object without the property at path
 * @see R.assocPath
 * @example
 *
 *      R.dissocPath(['a', 'b', 'c'], {a: {b: {c: 42}}}); //=> {a: {b: {}}}
 */


var dissocPath =
/*#__PURE__*/
_curry2(function dissocPath(path, obj) {
  if (obj == null) {
    return obj;
  }

  switch (path.length) {
    case 0:
      return obj;

    case 1:
      return _dissoc(path[0], obj);

    default:
      var head = path[0];
      var tail = Array.prototype.slice.call(path, 1);

      if (obj[head] == null) {
        return _shallowCloneObject(head, obj);
      } else {
        return assoc(head, dissocPath(tail, obj[head]), obj);
      }

  }
});

/**
 * Returns a new object that does not contain a `prop` property.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category Object
 * @sig String -> {k: v} -> {k: v}
 * @param {String} prop The name of the property to dissociate
 * @param {Object} obj The object to clone
 * @return {Object} A new object equivalent to the original but without the specified property
 * @see R.assoc, R.omit
 * @example
 *
 *      R.dissoc('b', {a: 1, b: 2, c: 3}); //=> {a: 1, c: 3}
 */

var dissoc =
/*#__PURE__*/
_curry2(function dissoc(prop, obj) {
  return dissocPath([prop], obj);
});

/**
 * Divides two numbers. Equivalent to `a / b`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Math
 * @sig Number -> Number -> Number
 * @param {Number} a The first value.
 * @param {Number} b The second value.
 * @return {Number} The result of `a / b`.
 * @see R.multiply
 * @example
 *
 *      R.divide(71, 100); //=> 0.71
 *
 *      const half = R.divide(R.__, 2);
 *      half(42); //=> 21
 *
 *      const reciprocal = R.divide(1);
 *      reciprocal(4);   //=> 0.25
 */

var divide =
/*#__PURE__*/
_curry2(function divide(a, b) {
  return a / b;
});

var XDrop =
/*#__PURE__*/
function () {
  function XDrop(n, xf) {
    this.xf = xf;
    this.n = n;
  }

  XDrop.prototype['@@transducer/init'] = _xfBase.init;
  XDrop.prototype['@@transducer/result'] = _xfBase.result;

  XDrop.prototype['@@transducer/step'] = function (result, input) {
    if (this.n > 0) {
      this.n -= 1;
      return result;
    }

    return this.xf['@@transducer/step'](result, input);
  };

  return XDrop;
}();

var _xdrop =
/*#__PURE__*/
_curry2(function _xdrop(n, xf) {
  return new XDrop(n, xf);
});

/**
 * Returns all but the first `n` elements of the given list, string, or
 * transducer/transformer (or object with a `drop` method).
 *
 * Dispatches to the `drop` method of the second argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Number -> [a] -> [a]
 * @sig Number -> String -> String
 * @param {Number} n
 * @param {*} list
 * @return {*} A copy of list without the first `n` elements
 * @see R.take, R.transduce, R.dropLast, R.dropWhile
 * @example
 *
 *      R.drop(1, ['foo', 'bar', 'baz']); //=> ['bar', 'baz']
 *      R.drop(2, ['foo', 'bar', 'baz']); //=> ['baz']
 *      R.drop(3, ['foo', 'bar', 'baz']); //=> []
 *      R.drop(4, ['foo', 'bar', 'baz']); //=> []
 *      R.drop(3, 'ramda');               //=> 'da'
 */

var drop =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['drop'], _xdrop, function drop(n, xs) {
  return slice(Math.max(0, n), Infinity, xs);
}));

var XTake =
/*#__PURE__*/
function () {
  function XTake(n, xf) {
    this.xf = xf;
    this.n = n;
    this.i = 0;
  }

  XTake.prototype['@@transducer/init'] = _xfBase.init;
  XTake.prototype['@@transducer/result'] = _xfBase.result;

  XTake.prototype['@@transducer/step'] = function (result, input) {
    this.i += 1;
    var ret = this.n === 0 ? result : this.xf['@@transducer/step'](result, input);
    return this.n >= 0 && this.i >= this.n ? _reduced(ret) : ret;
  };

  return XTake;
}();

var _xtake =
/*#__PURE__*/
_curry2(function _xtake(n, xf) {
  return new XTake(n, xf);
});

/**
 * Returns the first `n` elements of the given list, string, or
 * transducer/transformer (or object with a `take` method).
 *
 * Dispatches to the `take` method of the second argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Number -> [a] -> [a]
 * @sig Number -> String -> String
 * @param {Number} n
 * @param {*} list
 * @return {*}
 * @see R.drop
 * @example
 *
 *      R.take(1, ['foo', 'bar', 'baz']); //=> ['foo']
 *      R.take(2, ['foo', 'bar', 'baz']); //=> ['foo', 'bar']
 *      R.take(3, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
 *      R.take(4, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
 *      R.take(3, 'ramda');               //=> 'ram'
 *
 *      const personnel = [
 *        'Dave Brubeck',
 *        'Paul Desmond',
 *        'Eugene Wright',
 *        'Joe Morello',
 *        'Gerry Mulligan',
 *        'Bob Bates',
 *        'Joe Dodge',
 *        'Ron Crotty'
 *      ];
 *
 *      const takeFive = R.take(5);
 *      takeFive(personnel);
 *      //=> ['Dave Brubeck', 'Paul Desmond', 'Eugene Wright', 'Joe Morello', 'Gerry Mulligan']
 * @symb R.take(-1, [a, b]) = [a, b]
 * @symb R.take(0, [a, b]) = []
 * @symb R.take(1, [a, b]) = [a]
 * @symb R.take(2, [a, b]) = [a, b]
 */

var take =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['take'], _xtake, function take(n, xs) {
  return slice(0, n < 0 ? Infinity : n, xs);
}));

function dropLast$1(n, xs) {
  return take(n < xs.length ? xs.length - n : 0, xs);
}

var XDropLast =
/*#__PURE__*/
function () {
  function XDropLast(n, xf) {
    this.xf = xf;
    this.pos = 0;
    this.full = false;
    this.acc = new Array(n);
  }

  XDropLast.prototype['@@transducer/init'] = _xfBase.init;

  XDropLast.prototype['@@transducer/result'] = function (result) {
    this.acc = null;
    return this.xf['@@transducer/result'](result);
  };

  XDropLast.prototype['@@transducer/step'] = function (result, input) {
    if (this.full) {
      result = this.xf['@@transducer/step'](result, this.acc[this.pos]);
    }

    this.store(input);
    return result;
  };

  XDropLast.prototype.store = function (input) {
    this.acc[this.pos] = input;
    this.pos += 1;

    if (this.pos === this.acc.length) {
      this.pos = 0;
      this.full = true;
    }
  };

  return XDropLast;
}();

var _xdropLast =
/*#__PURE__*/
_curry2(function _xdropLast(n, xf) {
  return new XDropLast(n, xf);
});

/**
 * Returns a list containing all but the last `n` elements of the given `list`.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category List
 * @sig Number -> [a] -> [a]
 * @sig Number -> String -> String
 * @param {Number} n The number of elements of `list` to skip.
 * @param {Array} list The list of elements to consider.
 * @return {Array} A copy of the list with only the first `list.length - n` elements
 * @see R.takeLast, R.drop, R.dropWhile, R.dropLastWhile
 * @example
 *
 *      R.dropLast(1, ['foo', 'bar', 'baz']); //=> ['foo', 'bar']
 *      R.dropLast(2, ['foo', 'bar', 'baz']); //=> ['foo']
 *      R.dropLast(3, ['foo', 'bar', 'baz']); //=> []
 *      R.dropLast(4, ['foo', 'bar', 'baz']); //=> []
 *      R.dropLast(3, 'ramda');               //=> 'ra'
 */

var dropLast =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xdropLast, dropLast$1));

function dropLastWhile$1(pred, xs) {
  var idx = xs.length - 1;

  while (idx >= 0 && pred(xs[idx])) {
    idx -= 1;
  }

  return slice(0, idx + 1, xs);
}

var XDropLastWhile =
/*#__PURE__*/
function () {
  function XDropLastWhile(fn, xf) {
    this.f = fn;
    this.retained = [];
    this.xf = xf;
  }

  XDropLastWhile.prototype['@@transducer/init'] = _xfBase.init;

  XDropLastWhile.prototype['@@transducer/result'] = function (result) {
    this.retained = null;
    return this.xf['@@transducer/result'](result);
  };

  XDropLastWhile.prototype['@@transducer/step'] = function (result, input) {
    return this.f(input) ? this.retain(result, input) : this.flush(result, input);
  };

  XDropLastWhile.prototype.flush = function (result, input) {
    result = _reduce(this.xf['@@transducer/step'], result, this.retained);
    this.retained = [];
    return this.xf['@@transducer/step'](result, input);
  };

  XDropLastWhile.prototype.retain = function (result, input) {
    this.retained.push(input);
    return result;
  };

  return XDropLastWhile;
}();

var _xdropLastWhile =
/*#__PURE__*/
_curry2(function _xdropLastWhile(fn, xf) {
  return new XDropLastWhile(fn, xf);
});

/**
 * Returns a new list excluding all the tailing elements of a given list which
 * satisfy the supplied predicate function. It passes each value from the right
 * to the supplied predicate function, skipping elements until the predicate
 * function returns a `falsy` value. The predicate function is applied to one argument:
 * *(value)*.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> [a]
 * @sig (a -> Boolean) -> String -> String
 * @param {Function} predicate The function to be called on each element
 * @param {Array} xs The collection to iterate over.
 * @return {Array} A new array without any trailing elements that return `falsy` values from the `predicate`.
 * @see R.takeLastWhile, R.addIndex, R.drop, R.dropWhile
 * @example
 *
 *      const lteThree = x => x <= 3;
 *
 *      R.dropLastWhile(lteThree, [1, 2, 3, 4, 3, 2, 1]); //=> [1, 2, 3, 4]
 *
 *      R.dropLastWhile(x => x !== 'd' , 'Ramda'); //=> 'Ramd'
 */

var dropLastWhile =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xdropLastWhile, dropLastWhile$1));

var XDropRepeatsWith =
/*#__PURE__*/
function () {
  function XDropRepeatsWith(pred, xf) {
    this.xf = xf;
    this.pred = pred;
    this.lastValue = undefined;
    this.seenFirstValue = false;
  }

  XDropRepeatsWith.prototype['@@transducer/init'] = _xfBase.init;
  XDropRepeatsWith.prototype['@@transducer/result'] = _xfBase.result;

  XDropRepeatsWith.prototype['@@transducer/step'] = function (result, input) {
    var sameAsLast = false;

    if (!this.seenFirstValue) {
      this.seenFirstValue = true;
    } else if (this.pred(this.lastValue, input)) {
      sameAsLast = true;
    }

    this.lastValue = input;
    return sameAsLast ? result : this.xf['@@transducer/step'](result, input);
  };

  return XDropRepeatsWith;
}();

var _xdropRepeatsWith =
/*#__PURE__*/
_curry2(function _xdropRepeatsWith(pred, xf) {
  return new XDropRepeatsWith(pred, xf);
});

/**
 * Returns the last element of the given list or string.
 *
 * @func
 * @memberOf R
 * @since v0.1.4
 * @category List
 * @sig [a] -> a | Undefined
 * @sig String -> String
 * @param {*} list
 * @return {*}
 * @see R.init, R.head, R.tail
 * @example
 *
 *      R.last(['fi', 'fo', 'fum']); //=> 'fum'
 *      R.last([]); //=> undefined
 *
 *      R.last('abc'); //=> 'c'
 *      R.last(''); //=> ''
 */

var last =
/*#__PURE__*/
nth(-1);

/**
 * Returns a new list without any consecutively repeating elements. Equality is
 * determined by applying the supplied predicate to each pair of consecutive elements. The
 * first element in a series of equal elements will be preserved.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category List
 * @sig ((a, a) -> Boolean) -> [a] -> [a]
 * @param {Function} pred A predicate used to test whether two items are equal.
 * @param {Array} list The array to consider.
 * @return {Array} `list` without repeating elements.
 * @see R.transduce
 * @example
 *
 *      const l = [1, -1, 1, 3, 4, -4, -4, -5, 5, 3, 3];
 *      R.dropRepeatsWith(R.eqBy(Math.abs), l); //=> [1, 3, 4, -5, 3]
 */

var dropRepeatsWith =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xdropRepeatsWith, function dropRepeatsWith(pred, list) {
  var result = [];
  var idx = 1;
  var len = list.length;

  if (len !== 0) {
    result[0] = list[0];

    while (idx < len) {
      if (!pred(last(result), list[idx])) {
        result[result.length] = list[idx];
      }

      idx += 1;
    }
  }

  return result;
}));

/**
 * Returns a new list without any consecutively repeating elements.
 * [`R.equals`](#equals) is used to determine equality.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category List
 * @sig [a] -> [a]
 * @param {Array} list The array to consider.
 * @return {Array} `list` without repeating elements.
 * @see R.transduce
 * @example
 *
 *     R.dropRepeats([1, 1, 1, 2, 3, 4, 4, 2, 2]); //=> [1, 2, 3, 4, 2]
 */

var dropRepeats =
/*#__PURE__*/
_curry1(
/*#__PURE__*/
_dispatchable([],
/*#__PURE__*/
_xdropRepeatsWith(equals),
/*#__PURE__*/
dropRepeatsWith(equals)));

var XDropWhile =
/*#__PURE__*/
function () {
  function XDropWhile(f, xf) {
    this.xf = xf;
    this.f = f;
  }

  XDropWhile.prototype['@@transducer/init'] = _xfBase.init;
  XDropWhile.prototype['@@transducer/result'] = _xfBase.result;

  XDropWhile.prototype['@@transducer/step'] = function (result, input) {
    if (this.f) {
      if (this.f(input)) {
        return result;
      }

      this.f = null;
    }

    return this.xf['@@transducer/step'](result, input);
  };

  return XDropWhile;
}();

var _xdropWhile =
/*#__PURE__*/
_curry2(function _xdropWhile(f, xf) {
  return new XDropWhile(f, xf);
});

/**
 * Returns a new list excluding the leading elements of a given list which
 * satisfy the supplied predicate function. It passes each value to the supplied
 * predicate function, skipping elements while the predicate function returns
 * `true`. The predicate function is applied to one argument: *(value)*.
 *
 * Dispatches to the `dropWhile` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> [a]
 * @sig (a -> Boolean) -> String -> String
 * @param {Function} fn The function called per iteration.
 * @param {Array} xs The collection to iterate over.
 * @return {Array} A new array.
 * @see R.takeWhile, R.transduce, R.addIndex
 * @example
 *
 *      const lteTwo = x => x <= 2;
 *
 *      R.dropWhile(lteTwo, [1, 2, 3, 4, 3, 2, 1]); //=> [3, 4, 3, 2, 1]
 *
 *      R.dropWhile(x => x !== 'd' , 'Ramda'); //=> 'da'
 */

var dropWhile =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['dropWhile'], _xdropWhile, function dropWhile(pred, xs) {
  var idx = 0;
  var len = xs.length;

  while (idx < len && pred(xs[idx])) {
    idx += 1;
  }

  return slice(idx, Infinity, xs);
}));

/**
 * Returns the first argument if it is truthy, otherwise the second argument.
 * Acts as the boolean `or` statement if both inputs are `Boolean`s.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Logic
 * @sig a -> b -> a | b
 * @param {Any} a
 * @param {Any} b
 * @return {Any}
 * @see R.either, R.and
 * @example
 *
 *      R.or(true, true); //=> true
 *      R.or(true, false); //=> true
 *      R.or(false, true); //=> true
 *      R.or(false, false); //=> false
 */

var or =
/*#__PURE__*/
_curry2(function or(a, b) {
  return a || b;
});

/**
 * A function wrapping calls to the two functions in an `||` operation,
 * returning the result of the first function if it is truth-y and the result
 * of the second function otherwise. Note that this is short-circuited,
 * meaning that the second function will not be invoked if the first returns a
 * truth-y value.
 *
 * In addition to functions, `R.either` also accepts any fantasy-land compatible
 * applicative functor.
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category Logic
 * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
 * @param {Function} f a predicate
 * @param {Function} g another predicate
 * @return {Function} a function that applies its arguments to `f` and `g` and `||`s their outputs together.
 * @see R.both, R.or
 * @example
 *
 *      const gt10 = x => x > 10;
 *      const even = x => x % 2 === 0;
 *      const f = R.either(gt10, even);
 *      f(101); //=> true
 *      f(8); //=> true
 *
 *      R.either(Maybe.Just(false), Maybe.Just(55)); // => Maybe.Just(55)
 *      R.either([false, false, 'a'], [11]) // => [11, 11, "a"]
 */

var either =
/*#__PURE__*/
_curry2(function either(f, g) {
  return _isFunction(f) ? function _either() {
    return f.apply(this, arguments) || g.apply(this, arguments);
  } : lift(or)(f, g);
});

/**
 * Tests whether or not an object is a typed array.
 *
 * @private
 * @param {*} val The object to test.
 * @return {Boolean} `true` if `val` is a typed array, `false` otherwise.
 * @example
 *
 *      _isTypedArray(new Uint8Array([])); //=> true
 *      _isTypedArray(new Float32Array([])); //=> true
 *      _isTypedArray([]); //=> false
 *      _isTypedArray(null); //=> false
 *      _isTypedArray({}); //=> false
 */
function _isTypedArray(val) {
  var type = Object.prototype.toString.call(val);
  return type === '[object Uint8ClampedArray]' || type === '[object Int8Array]' || type === '[object Uint8Array]' || type === '[object Int16Array]' || type === '[object Uint16Array]' || type === '[object Int32Array]' || type === '[object Uint32Array]' || type === '[object Float32Array]' || type === '[object Float64Array]' || type === '[object BigInt64Array]' || type === '[object BigUint64Array]';
}

/**
 * Returns the empty value of its argument's type. Ramda defines the empty
 * value of Array (`[]`), Object (`{}`), String (`''`),
 * TypedArray (`Uint8Array []`, `Float32Array []`, etc), and Arguments. Other
 * types are supported if they define `<Type>.empty`,
 * `<Type>.prototype.empty` or implement the
 * [FantasyLand Monoid spec](https://github.com/fantasyland/fantasy-land#monoid).
 *
 * Dispatches to the `empty` method of the first argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category Function
 * @sig a -> a
 * @param {*} x
 * @return {*}
 * @example
 *
 *      R.empty(Just(42));               //=> Nothing()
 *      R.empty([1, 2, 3]);              //=> []
 *      R.empty('unicorns');             //=> ''
 *      R.empty({x: 1, y: 2});           //=> {}
 *      R.empty(Uint8Array.from('123')); //=> Uint8Array []
 */

var empty =
/*#__PURE__*/
_curry1(function empty(x) {
  return x != null && typeof x['fantasy-land/empty'] === 'function' ? x['fantasy-land/empty']() : x != null && x.constructor != null && typeof x.constructor['fantasy-land/empty'] === 'function' ? x.constructor['fantasy-land/empty']() : x != null && typeof x.empty === 'function' ? x.empty() : x != null && x.constructor != null && typeof x.constructor.empty === 'function' ? x.constructor.empty() : _isArray(x) ? [] : _isString(x) ? '' : _isObject(x) ? {} : _isArguments(x) ? function () {
    return arguments;
  }() : _isTypedArray(x) ? x.constructor.from('') : void 0 // else
  ;
});

/**
 * Returns a new list containing the last `n` elements of the given list.
 * If `n > list.length`, returns a list of `list.length` elements.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category List
 * @sig Number -> [a] -> [a]
 * @sig Number -> String -> String
 * @param {Number} n The number of elements to return.
 * @param {Array} xs The collection to consider.
 * @return {Array}
 * @see R.dropLast
 * @example
 *
 *      R.takeLast(1, ['foo', 'bar', 'baz']); //=> ['baz']
 *      R.takeLast(2, ['foo', 'bar', 'baz']); //=> ['bar', 'baz']
 *      R.takeLast(3, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
 *      R.takeLast(4, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
 *      R.takeLast(3, 'ramda');               //=> 'mda'
 */

var takeLast =
/*#__PURE__*/
_curry2(function takeLast(n, xs) {
  return drop(n >= 0 ? xs.length - n : 0, xs);
});

/**
 * Checks if a list ends with the provided sublist.
 *
 * Similarly, checks if a string ends with the provided substring.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category List
 * @sig [a] -> [a] -> Boolean
 * @sig String -> String -> Boolean
 * @param {*} suffix
 * @param {*} list
 * @return {Boolean}
 * @see R.startsWith
 * @example
 *
 *      R.endsWith('c', 'abc')                //=> true
 *      R.endsWith('b', 'abc')                //=> false
 *      R.endsWith(['c'], ['a', 'b', 'c'])    //=> true
 *      R.endsWith(['b'], ['a', 'b', 'c'])    //=> false
 */

var endsWith =
/*#__PURE__*/
_curry2(function (suffix, list) {
  return equals(takeLast(suffix.length, list), suffix);
});

/**
 * Takes a function and two values in its domain and returns `true` if the
 * values map to the same value in the codomain; `false` otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.18.0
 * @category Relation
 * @sig (a -> b) -> a -> a -> Boolean
 * @param {Function} f
 * @param {*} x
 * @param {*} y
 * @return {Boolean}
 * @example
 *
 *      R.eqBy(Math.abs, 5, -5); //=> true
 */

var eqBy =
/*#__PURE__*/
_curry3(function eqBy(f, x, y) {
  return equals(f(x), f(y));
});

/**
 * Reports whether two objects have the same value, in [`R.equals`](#equals)
 * terms, for the specified property. Useful as a curried predicate.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig k -> {k: v} -> {k: v} -> Boolean
 * @param {String} prop The name of the property to compare
 * @param {Object} obj1
 * @param {Object} obj2
 * @return {Boolean}
 *
 * @example
 *
 *      const o1 = { a: 1, b: 2, c: 3, d: 4 };
 *      const o2 = { a: 10, b: 20, c: 3, d: 40 };
 *      R.eqProps('a', o1, o2); //=> false
 *      R.eqProps('c', o1, o2); //=> true
 */

var eqProps =
/*#__PURE__*/
_curry3(function eqProps(prop, obj1, obj2) {
  return equals(obj1[prop], obj2[prop]);
});

/**
 * Creates a new object by recursively evolving a shallow copy of `object`,
 * according to the `transformation` functions. All non-primitive properties
 * are copied by reference.
 *
 * A `transformation` function will not be invoked if its corresponding key
 * does not exist in the evolved object.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Object
 * @sig {k: (v -> v)} -> {k: v} -> {k: v}
 * @param {Object} transformations The object specifying transformation functions to apply
 *        to the object.
 * @param {Object} object The object to be transformed.
 * @return {Object} The transformed object.
 * @example
 *
 *      const tomato = {firstName: '  Tomato ', data: {elapsed: 100, remaining: 1400}, id:123};
 *      const transformations = {
 *        firstName: R.trim,
 *        lastName: R.trim, // Will not get invoked.
 *        data: {elapsed: R.add(1), remaining: R.add(-1)}
 *      };
 *      R.evolve(transformations, tomato); //=> {firstName: 'Tomato', data: {elapsed: 101, remaining: 1399}, id:123}
 */

var evolve =
/*#__PURE__*/
_curry2(function evolve(transformations, object) {
  if (!_isObject(object) && !_isArray(object)) {
    return object;
  }

  var result = object instanceof Array ? [] : {};
  var transformation, key, type;

  for (key in object) {
    transformation = transformations[key];
    type = typeof transformation;
    result[key] = type === 'function' ? transformation(object[key]) : transformation && type === 'object' ? evolve(transformation, object[key]) : object[key];
  }

  return result;
});

var XFind =
/*#__PURE__*/
function () {
  function XFind(f, xf) {
    this.xf = xf;
    this.f = f;
    this.found = false;
  }

  XFind.prototype['@@transducer/init'] = _xfBase.init;

  XFind.prototype['@@transducer/result'] = function (result) {
    if (!this.found) {
      result = this.xf['@@transducer/step'](result, void 0);
    }

    return this.xf['@@transducer/result'](result);
  };

  XFind.prototype['@@transducer/step'] = function (result, input) {
    if (this.f(input)) {
      this.found = true;
      result = _reduced(this.xf['@@transducer/step'](result, input));
    }

    return result;
  };

  return XFind;
}();

var _xfind =
/*#__PURE__*/
_curry2(function _xfind(f, xf) {
  return new XFind(f, xf);
});

/**
 * Returns the first element of the list which matches the predicate, or
 * `undefined` if no element matches.
 *
 * Dispatches to the `find` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> a | undefined
 * @param {Function} fn The predicate function used to determine if the element is the
 *        desired one.
 * @param {Array} list The array to consider.
 * @return {Object} The element found, or `undefined`.
 * @see R.transduce
 * @example
 *
 *      const xs = [{a: 1}, {a: 2}, {a: 3}];
 *      R.find(R.propEq('a', 2))(xs); //=> {a: 2}
 *      R.find(R.propEq('a', 4))(xs); //=> undefined
 */

var find =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['find'], _xfind, function find(fn, list) {
  var idx = 0;
  var len = list.length;

  while (idx < len) {
    if (fn(list[idx])) {
      return list[idx];
    }

    idx += 1;
  }
}));

var XFindIndex =
/*#__PURE__*/
function () {
  function XFindIndex(f, xf) {
    this.xf = xf;
    this.f = f;
    this.idx = -1;
    this.found = false;
  }

  XFindIndex.prototype['@@transducer/init'] = _xfBase.init;

  XFindIndex.prototype['@@transducer/result'] = function (result) {
    if (!this.found) {
      result = this.xf['@@transducer/step'](result, -1);
    }

    return this.xf['@@transducer/result'](result);
  };

  XFindIndex.prototype['@@transducer/step'] = function (result, input) {
    this.idx += 1;

    if (this.f(input)) {
      this.found = true;
      result = _reduced(this.xf['@@transducer/step'](result, this.idx));
    }

    return result;
  };

  return XFindIndex;
}();

var _xfindIndex =
/*#__PURE__*/
_curry2(function _xfindIndex(f, xf) {
  return new XFindIndex(f, xf);
});

/**
 * Returns the index of the first element of the list which matches the
 * predicate, or `-1` if no element matches.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category List
 * @sig (a -> Boolean) -> [a] -> Number
 * @param {Function} fn The predicate function used to determine if the element is the
 * desired one.
 * @param {Array} list The array to consider.
 * @return {Number} The index of the element found, or `-1`.
 * @see R.transduce, R.indexOf
 * @example
 *
 *      const xs = [{a: 1}, {a: 2}, {a: 3}];
 *      R.findIndex(R.propEq('a', 2))(xs); //=> 1
 *      R.findIndex(R.propEq('a', 4))(xs); //=> -1
 */

var findIndex =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xfindIndex, function findIndex(fn, list) {
  var idx = 0;
  var len = list.length;

  while (idx < len) {
    if (fn(list[idx])) {
      return idx;
    }

    idx += 1;
  }

  return -1;
}));

var XFindLast =
/*#__PURE__*/
function () {
  function XFindLast(f, xf) {
    this.xf = xf;
    this.f = f;
  }

  XFindLast.prototype['@@transducer/init'] = _xfBase.init;

  XFindLast.prototype['@@transducer/result'] = function (result) {
    return this.xf['@@transducer/result'](this.xf['@@transducer/step'](result, this.last));
  };

  XFindLast.prototype['@@transducer/step'] = function (result, input) {
    if (this.f(input)) {
      this.last = input;
    }

    return result;
  };

  return XFindLast;
}();

var _xfindLast =
/*#__PURE__*/
_curry2(function _xfindLast(f, xf) {
  return new XFindLast(f, xf);
});

/**
 * Returns the last element of the list which matches the predicate, or
 * `undefined` if no element matches.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category List
 * @sig (a -> Boolean) -> [a] -> a | undefined
 * @param {Function} fn The predicate function used to determine if the element is the
 * desired one.
 * @param {Array} list The array to consider.
 * @return {Object} The element found, or `undefined`.
 * @see R.transduce
 * @example
 *
 *      const xs = [{a: 1, b: 0}, {a:1, b: 1}];
 *      R.findLast(R.propEq('a', 1))(xs); //=> {a: 1, b: 1}
 *      R.findLast(R.propEq('a', 4))(xs); //=> undefined
 */

var findLast =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xfindLast, function findLast(fn, list) {
  var idx = list.length - 1;

  while (idx >= 0) {
    if (fn(list[idx])) {
      return list[idx];
    }

    idx -= 1;
  }
}));

var XFindLastIndex =
/*#__PURE__*/
function () {
  function XFindLastIndex(f, xf) {
    this.xf = xf;
    this.f = f;
    this.idx = -1;
    this.lastIdx = -1;
  }

  XFindLastIndex.prototype['@@transducer/init'] = _xfBase.init;

  XFindLastIndex.prototype['@@transducer/result'] = function (result) {
    return this.xf['@@transducer/result'](this.xf['@@transducer/step'](result, this.lastIdx));
  };

  XFindLastIndex.prototype['@@transducer/step'] = function (result, input) {
    this.idx += 1;

    if (this.f(input)) {
      this.lastIdx = this.idx;
    }

    return result;
  };

  return XFindLastIndex;
}();

var _xfindLastIndex =
/*#__PURE__*/
_curry2(function _xfindLastIndex(f, xf) {
  return new XFindLastIndex(f, xf);
});

/**
 * Returns the index of the last element of the list which matches the
 * predicate, or `-1` if no element matches.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category List
 * @sig (a -> Boolean) -> [a] -> Number
 * @param {Function} fn The predicate function used to determine if the element is the
 * desired one.
 * @param {Array} list The array to consider.
 * @return {Number} The index of the element found, or `-1`.
 * @see R.transduce, R.lastIndexOf
 * @example
 *
 *      const xs = [{a: 1, b: 0}, {a:1, b: 1}];
 *      R.findLastIndex(R.propEq('a', 1))(xs); //=> 1
 *      R.findLastIndex(R.propEq('a', 4))(xs); //=> -1
 */

var findLastIndex =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xfindLastIndex, function findLastIndex(fn, list) {
  var idx = list.length - 1;

  while (idx >= 0) {
    if (fn(list[idx])) {
      return idx;
    }

    idx -= 1;
  }

  return -1;
}));

/**
 * Returns a new list by pulling every item out of it (and all its sub-arrays)
 * and putting them in a new array, depth-first.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [b]
 * @param {Array} list The array to consider.
 * @return {Array} The flattened list.
 * @see R.unnest
 * @example
 *
 *      R.flatten([1, 2, [3, 4], 5, [6, [7, 8, [9, [10, 11], 12]]]]);
 *      //=> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
 */

var flatten =
/*#__PURE__*/
_curry1(
/*#__PURE__*/
_makeFlat(true));

/**
 * Returns a new function much like the supplied one, except that the first two
 * arguments' order is reversed.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig ((a, b, c, ...) -> z) -> (b -> a -> c -> ... -> z)
 * @param {Function} fn The function to invoke with its first two parameters reversed.
 * @return {*} The result of invoking `fn` with its first two parameters' order reversed.
 * @example
 *
 *      const mergeThree = (a, b, c) => [].concat(a, b, c);
 *
 *      mergeThree(1, 2, 3); //=> [1, 2, 3]
 *
 *      R.flip(mergeThree)(1, 2, 3); //=> [2, 1, 3]
 * @symb R.flip(f)(a, b, c) = f(b, a, c)
 */

var flip =
/*#__PURE__*/
_curry1(function flip(fn) {
  return curryN(fn.length, function (a, b) {
    var args = Array.prototype.slice.call(arguments, 0);
    args[0] = b;
    args[1] = a;
    return fn.apply(this, args);
  });
});

/**
 * Iterate over an input `list`, calling a provided function `fn` for each
 * element in the list.
 *
 * `fn` receives one argument: *(value)*.
 *
 * Note: `R.forEach` does not skip deleted or unassigned indices (sparse
 * arrays), unlike the native `Array.prototype.forEach` method. For more
 * details on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Description
 *
 * Also note that, unlike `Array.prototype.forEach`, Ramda's `forEach` returns
 * the original array. In some libraries this function is named `each`.
 *
 * Dispatches to the `forEach` method of the second argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category List
 * @sig (a -> *) -> [a] -> [a]
 * @param {Function} fn The function to invoke. Receives one argument, `value`.
 * @param {Array} list The list to iterate over.
 * @return {Array} The original list.
 * @see R.addIndex
 * @example
 *
 *      const printXPlusFive = x => console.log(x + 5);
 *      R.forEach(printXPlusFive, [1, 2, 3]); //=> [1, 2, 3]
 *      // logs 6
 *      // logs 7
 *      // logs 8
 * @symb R.forEach(f, [a, b, c]) = [a, b, c]
 */

var forEach =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_checkForMethod('forEach', function forEach(fn, list) {
  var len = list.length;
  var idx = 0;

  while (idx < len) {
    fn(list[idx]);
    idx += 1;
  }

  return list;
}));

/**
 * Iterate over an input `object`, calling a provided function `fn` for each
 * key and value in the object.
 *
 * `fn` receives three argument: *(value, key, obj)*.
 *
 * @func
 * @memberOf R
 * @since v0.23.0
 * @category Object
 * @sig ((a, String, StrMap a) -> Any) -> StrMap a -> StrMap a
 * @param {Function} fn The function to invoke. Receives three argument, `value`, `key`, `obj`.
 * @param {Object} obj The object to iterate over.
 * @return {Object} The original object.
 * @example
 *
 *      const printKeyConcatValue = (value, key) => console.log(key + ':' + value);
 *      R.forEachObjIndexed(printKeyConcatValue, {x: 1, y: 2}); //=> {x: 1, y: 2}
 *      // logs x:1
 *      // logs y:2
 * @symb R.forEachObjIndexed(f, {x: a, y: b}) = {x: a, y: b}
 */

var forEachObjIndexed =
/*#__PURE__*/
_curry2(function forEachObjIndexed(fn, obj) {
  var keyList = keys(obj);
  var idx = 0;

  while (idx < keyList.length) {
    var key = keyList[idx];
    fn(obj[key], key, obj);
    idx += 1;
  }

  return obj;
});

/**
 * Creates a new object from a list key-value pairs. If a key appears in
 * multiple pairs, the rightmost pair is included in the object.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category List
 * @sig [[k,v]] -> {k: v}
 * @param {Array} pairs An array of two-element arrays that will be the keys and values of the output object.
 * @return {Object} The object made by pairing up `keys` and `values`.
 * @see R.toPairs, R.pair
 * @example
 *
 *      R.fromPairs([['a', 1], ['b', 2], ['c', 3]]); //=> {a: 1, b: 2, c: 3}
 */

var fromPairs =
/*#__PURE__*/
_curry1(function fromPairs(pairs) {
  var result = {};
  var idx = 0;

  while (idx < pairs.length) {
    result[pairs[idx][0]] = pairs[idx][1];
    idx += 1;
  }

  return result;
});

/**
 * Splits a list into sub-lists stored in an object, based on the result of
 * calling a key-returning function on each element, and grouping the
 * results according to values returned.
 *
 * Dispatches to the `groupBy` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @typedefn Idx = String | Int | Symbol
 * @sig Idx a => (b -> a) -> [b] -> {a: [b]}
 * @param {Function} fn Function :: a -> Idx
 * @param {Array} list The array to group
 * @return {Object} An object with the output of `fn` for keys, mapped to arrays of elements
 *         that produced that key when passed to `fn`.
 * @see R.reduceBy, R.transduce, R.indexBy
 * @example
 *
 *      const byGrade = R.groupBy(function(student) {
 *        const score = student.score;
 *        return score < 65 ? 'F' :
 *               score < 70 ? 'D' :
 *               score < 80 ? 'C' :
 *               score < 90 ? 'B' : 'A';
 *      });
 *      const students = [{name: 'Abby', score: 84},
 *                      {name: 'Eddy', score: 58},
 *                      // ...
 *                      {name: 'Jack', score: 69}];
 *      byGrade(students);
 *      // {
 *      //   'A': [{name: 'Dianne', score: 99}],
 *      //   'B': [{name: 'Abby', score: 84}]
 *      //   // ...,
 *      //   'F': [{name: 'Eddy', score: 58}]
 *      // }
 */

var groupBy =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_checkForMethod('groupBy',
/*#__PURE__*/
reduceBy(function (acc, item) {
  acc.push(item);
  return acc;
}, [])));

/**
 * Takes a list and returns a list of lists where each sublist's elements are
 * all satisfied pairwise comparison according to the provided function.
 * Only adjacent elements are passed to the comparison function.
 *
 * @func
 * @memberOf R
 * @since v0.21.0
 * @category List
 * @sig ((a, a) → Boolean) → [a] → [[a]]
 * @param {Function} fn Function for determining whether two given (adjacent)
 *        elements should be in the same group
 * @param {Array} list The array to group. Also accepts a string, which will be
 *        treated as a list of characters.
 * @return {List} A list that contains sublists of elements,
 *         whose concatenations are equal to the original list.
 * @example
 *
 * R.groupWith(R.equals, [0, 1, 1, 2, 3, 5, 8, 13, 21])
 * //=> [[0], [1, 1], [2], [3], [5], [8], [13], [21]]
 *
 * R.groupWith((a, b) => a + 1 === b, [0, 1, 1, 2, 3, 5, 8, 13, 21])
 * //=> [[0, 1], [1, 2, 3], [5], [8], [13], [21]]
 *
 * R.groupWith((a, b) => a % 2 === b % 2, [0, 1, 1, 2, 3, 5, 8, 13, 21])
 * //=> [[0], [1, 1], [2], [3, 5], [8], [13, 21]]
 *
 * const isVowel = R.test(/^[aeiou]$/i);
 * R.groupWith(R.eqBy(isVowel), 'aestiou')
 * //=> ['ae', 'st', 'iou']
 */

var groupWith =
/*#__PURE__*/
_curry2(function (fn, list) {
  var res = [];
  var idx = 0;
  var len = list.length;

  while (idx < len) {
    var nextidx = idx + 1;

    while (nextidx < len && fn(list[nextidx - 1], list[nextidx])) {
      nextidx += 1;
    }

    res.push(list.slice(idx, nextidx));
    idx = nextidx;
  }

  return res;
});

/**
 * Returns `true` if the first argument is greater than the second; `false`
 * otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord a => a -> a -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @see R.lt
 * @example
 *
 *      R.gt(2, 1); //=> true
 *      R.gt(2, 2); //=> false
 *      R.gt(2, 3); //=> false
 *      R.gt('a', 'z'); //=> false
 *      R.gt('z', 'a'); //=> true
 */

var gt =
/*#__PURE__*/
_curry2(function gt(a, b) {
  return a > b;
});

/**
 * Returns `true` if the first argument is greater than or equal to the second;
 * `false` otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord a => a -> a -> Boolean
 * @param {Number} a
 * @param {Number} b
 * @return {Boolean}
 * @see R.lte
 * @example
 *
 *      R.gte(2, 1); //=> true
 *      R.gte(2, 2); //=> true
 *      R.gte(2, 3); //=> false
 *      R.gte('a', 'z'); //=> false
 *      R.gte('z', 'a'); //=> true
 */

var gte =
/*#__PURE__*/
_curry2(function gte(a, b) {
  return a >= b;
});

/**
 * Returns whether or not a path exists in an object. Only the object's
 * own properties are checked.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category Object
 * @typedefn Idx = String | Int | Symbol
 * @sig [Idx] -> {a} -> Boolean
 * @param {Array} path The path to use.
 * @param {Object} obj The object to check the path in.
 * @return {Boolean} Whether the path exists.
 * @see R.has
 * @example
 *
 *      R.hasPath(['a', 'b'], {a: {b: 2}});         // => true
 *      R.hasPath(['a', 'b'], {a: {b: undefined}}); // => true
 *      R.hasPath(['a', 'b'], {a: {c: 2}});         // => false
 *      R.hasPath(['a', 'b'], {});                  // => false
 */

var hasPath =
/*#__PURE__*/
_curry2(function hasPath(_path, obj) {
  if (_path.length === 0 || isNil$1(obj)) {
    return false;
  }

  var val = obj;
  var idx = 0;

  while (idx < _path.length) {
    if (!isNil$1(val) && _has(_path[idx], val)) {
      val = val[_path[idx]];
      idx += 1;
    } else {
      return false;
    }
  }

  return true;
});

/**
 * Returns whether or not an object has an own property with the specified name
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category Object
 * @sig s -> {s: x} -> Boolean
 * @param {String} prop The name of the property to check for.
 * @param {Object} obj The object to query.
 * @return {Boolean} Whether the property exists.
 * @example
 *
 *      const hasName = R.has('name');
 *      hasName({name: 'alice'});   //=> true
 *      hasName({name: 'bob'});     //=> true
 *      hasName({});                //=> false
 *
 *      const point = {x: 0, y: 0};
 *      const pointHas = R.has(R.__, point);
 *      pointHas('x');  //=> true
 *      pointHas('y');  //=> true
 *      pointHas('z');  //=> false
 */

var has =
/*#__PURE__*/
_curry2(function has(prop, obj) {
  return hasPath([prop], obj);
});

/**
 * Returns whether or not an object or its prototype chain has a property with
 * the specified name
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category Object
 * @sig s -> {s: x} -> Boolean
 * @param {String} prop The name of the property to check for.
 * @param {Object} obj The object to query.
 * @return {Boolean} Whether the property exists.
 * @example
 *
 *      function Rectangle(width, height) {
 *        this.width = width;
 *        this.height = height;
 *      }
 *      Rectangle.prototype.area = function() {
 *        return this.width * this.height;
 *      };
 *
 *      const square = new Rectangle(2, 2);
 *      R.hasIn('width', square);  //=> true
 *      R.hasIn('area', square);  //=> true
 */

var hasIn =
/*#__PURE__*/
_curry2(function hasIn(prop, obj) {
  if (isNil$1(obj)) {
    return false;
  }

  return prop in obj;
});

/**
 * Returns true if its arguments are identical, false otherwise. Values are
 * identical if they reference the same memory. `NaN` is identical to `NaN`;
 * `0` and `-0` are not identical.
 *
 * Note this is merely a curried version of ES6 `Object.is`.
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category Relation
 * @sig a -> a -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @example
 *
 *      const o = {};
 *      R.identical(o, o); //=> true
 *      R.identical(1, 1); //=> true
 *      R.identical(1, '1'); //=> false
 *      R.identical([], []); //=> false
 *      R.identical(0, -0); //=> false
 *      R.identical(NaN, NaN); //=> true
 */

var identical =
/*#__PURE__*/
_curry2(_objectIs$1);

/**
 * Creates a function that will process either the `onTrue` or the `onFalse`
 * function depending upon the result of the `condition` predicate.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Logic
 * @sig (*... -> Boolean) -> (*... -> *) -> (*... -> *) -> (*... -> *)
 * @param {Function} condition A predicate function
 * @param {Function} onTrue A function to invoke when the `condition` evaluates to a truthy value.
 * @param {Function} onFalse A function to invoke when the `condition` evaluates to a falsy value.
 * @return {Function} A new function that will process either the `onTrue` or the `onFalse`
 *                    function depending upon the result of the `condition` predicate.
 * @see R.unless, R.when, R.cond
 * @example
 *
 *      const incCount = R.ifElse(
 *        R.has('count'),
 *        R.over(R.lensProp('count'), R.inc),
 *        R.assoc('count', 1)
 *      );
 *      incCount({ count: 1 }); //=> { count: 2 }
 *      incCount({});           //=> { count: 1 }
 */

var ifElse =
/*#__PURE__*/
_curry3(function ifElse(condition, onTrue, onFalse) {
  return curryN(Math.max(condition.length, onTrue.length, onFalse.length), function _ifElse() {
    return condition.apply(this, arguments) ? onTrue.apply(this, arguments) : onFalse.apply(this, arguments);
  });
});

/**
 * Increments its argument.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Math
 * @sig Number -> Number
 * @param {Number} n
 * @return {Number} n + 1
 * @see R.dec
 * @example
 *
 *      R.inc(42); //=> 43
 */

var inc =
/*#__PURE__*/
add(1);

/**
 * Returns `true` if the specified value is equal, in [`R.equals`](#equals)
 * terms, to at least one element of the given list; `false` otherwise.
 * Also works with strings.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category List
 * @sig a -> [a] -> Boolean
 * @param {Object} a The item to compare against.
 * @param {Array} list The array to consider.
 * @return {Boolean} `true` if an equivalent item is in the list, `false` otherwise.
 * @see R.any
 * @example
 *
 *      R.includes(3, [1, 2, 3]); //=> true
 *      R.includes(4, [1, 2, 3]); //=> false
 *      R.includes({ name: 'Fred' }, [{ name: 'Fred' }]); //=> true
 *      R.includes([42], [[42]]); //=> true
 *      R.includes('ba', 'banana'); //=>true
 */

var includes =
/*#__PURE__*/
_curry2(_includes);

/**
 * Given a function that generates a key, turns a list of objects into an
 * object indexing the objects by the given key. Note that if multiple
 * objects generate the same value for the indexing key only the last value
 * will be included in the generated object.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @typedefn Idx = String | Int | Symbol
 * @sig Idx a => (b -> a) -> [b] -> {a: b}
 * @param {Function} fn Function :: a -> Idx
 * @param {Array} array The array of objects to index
 * @return {Object} An object indexing each array element by the given property.
 * @see R.groupBy
 * @example
 *
 *      const list = [{id: 'xyz', title: 'A'}, {id: 'abc', title: 'B'}];
 *      R.indexBy(R.prop('id'), list);
 *      //=> {abc: {id: 'abc', title: 'B'}, xyz: {id: 'xyz', title: 'A'}}
 */

var indexBy =
/*#__PURE__*/
reduceBy(function (acc, elem) {
  return elem;
}, null);

/**
 * Returns the position of the first occurrence of an item in an array, or -1
 * if the item is not included in the array. [`R.equals`](#equals) is used to
 * determine equality.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig a -> [a] -> Number
 * @param {*} target The item to find.
 * @param {Array} xs The array to search in.
 * @return {Number} the index of the target, or -1 if the target is not found.
 * @see R.lastIndexOf, R.findIndex
 * @example
 *
 *      R.indexOf(3, [1,2,3,4]); //=> 2
 *      R.indexOf(10, [1,2,3,4]); //=> -1
 */

var indexOf =
/*#__PURE__*/
_curry2(function indexOf(target, xs) {
  return typeof xs.indexOf === 'function' && !_isArray(xs) ? xs.indexOf(target) : _indexOf(xs, target, 0);
});

/**
 * Returns all but the last element of the given list or string.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category List
 * @sig [a] -> [a]
 * @sig String -> String
 * @param {*} list
 * @return {*}
 * @see R.last, R.head, R.tail
 * @example
 *
 *      R.init([1, 2, 3]);  //=> [1, 2]
 *      R.init([1, 2]);     //=> [1]
 *      R.init([1]);        //=> []
 *      R.init([]);         //=> []
 *
 *      R.init('abc');  //=> 'ab'
 *      R.init('ab');   //=> 'a'
 *      R.init('a');    //=> ''
 *      R.init('');     //=> ''
 */

var init =
/*#__PURE__*/
slice(0, -1);

/**
 * Takes a predicate `pred`, a list `xs`, and a list `ys`, and returns a list
 * `xs'` comprising each of the elements of `xs` which is equal to one or more
 * elements of `ys` according to `pred`.
 *
 * `pred` must be a binary function expecting an element from each list.
 *
 * `xs`, `ys`, and `xs'` are treated as sets, semantically, so ordering should
 * not be significant, but since `xs'` is ordered the implementation guarantees
 * that its values are in the same order as they appear in `xs`. Duplicates are
 * not removed, so `xs'` may contain duplicates if `xs` contains duplicates.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Relation
 * @sig ((a, b) -> Boolean) -> [a] -> [b] -> [a]
 * @param {Function} pred
 * @param {Array} xs
 * @param {Array} ys
 * @return {Array}
 * @see R.intersection
 * @example
 *
 *      R.innerJoin(
 *        (record, id) => record.id === id,
 *        [{id: 824, name: 'Richie Furay'},
 *         {id: 956, name: 'Dewey Martin'},
 *         {id: 313, name: 'Bruce Palmer'},
 *         {id: 456, name: 'Stephen Stills'},
 *         {id: 177, name: 'Neil Young'}],
 *        [177, 456, 999]
 *      );
 *      //=> [{id: 456, name: 'Stephen Stills'}, {id: 177, name: 'Neil Young'}]
 */

var innerJoin =
/*#__PURE__*/
_curry3(function innerJoin(pred, xs, ys) {
  return _filter(function (x) {
    return _includesWith(pred, x, ys);
  }, xs);
});

/**
 * Inserts the supplied element into the list, at the specified `index`. _Note that

 * this is not destructive_: it returns a copy of the list with the changes.
 * <small>No lists have been harmed in the application of this function.</small>
 *
 * @func
 * @memberOf R
 * @since v0.2.2
 * @category List
 * @sig Number -> a -> [a] -> [a]
 * @param {Number} index The position to insert the element
 * @param {*} elt The element to insert into the Array
 * @param {Array} list The list to insert into
 * @return {Array} A new Array with `elt` inserted at `index`.
 * @example
 *
 *      R.insert(2, 'x', [1,2,3,4]); //=> [1,2,'x',3,4]
 */

var insert =
/*#__PURE__*/
_curry3(function insert(idx, elt, list) {
  idx = idx < list.length && idx >= 0 ? idx : list.length;
  var result = Array.prototype.slice.call(list, 0);
  result.splice(idx, 0, elt);
  return result;
});

/**
 * Inserts the sub-list into the list, at the specified `index`. _Note that this is not
 * destructive_: it returns a copy of the list with the changes.
 * <small>No lists have been harmed in the application of this function.</small>
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category List
 * @sig Number -> [a] -> [a] -> [a]
 * @param {Number} index The position to insert the sub-list
 * @param {Array} elts The sub-list to insert into the Array
 * @param {Array} list The list to insert the sub-list into
 * @return {Array} A new Array with `elts` inserted starting at `index`.
 * @example
 *
 *      R.insertAll(2, ['x','y','z'], [1,2,3,4]); //=> [1,2,'x','y','z',3,4]
 */

var insertAll =
/*#__PURE__*/
_curry3(function insertAll(idx, elts, list) {
  idx = idx < list.length && idx >= 0 ? idx : list.length;
  return [].concat(Array.prototype.slice.call(list, 0, idx), elts, Array.prototype.slice.call(list, idx));
});

var XUniqBy =
/*#__PURE__*/
function () {
  function XUniqBy(f, xf) {
    this.xf = xf;
    this.f = f;
    this.set = new _Set();
  }

  XUniqBy.prototype['@@transducer/init'] = _xfBase.init;
  XUniqBy.prototype['@@transducer/result'] = _xfBase.result;

  XUniqBy.prototype['@@transducer/step'] = function (result, input) {
    return this.set.add(this.f(input)) ? this.xf['@@transducer/step'](result, input) : result;
  };

  return XUniqBy;
}();

var _xuniqBy =
/*#__PURE__*/
_curry2(function _xuniqBy(f, xf) {
  return new XUniqBy(f, xf);
});

/**
 * Returns a new list containing only one copy of each element in the original
 * list, based upon the value returned by applying the supplied function to
 * each list element. Prefers the first item if the supplied function produces
 * the same value on two items. [`R.equals`](#equals) is used for comparison.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category List
 * @sig (a -> b) -> [a] -> [a]
 * @param {Function} fn A function used to produce a value to use during comparisons.
 * @param {Array} list The array to consider.
 * @return {Array} The list of unique items.
 * @example
 *
 *      R.uniqBy(Math.abs, [-1, -5, 2, 10, 1, 2]); //=> [-1, -5, 2, 10]
 */

var uniqBy =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xuniqBy, function (fn, list) {
  var set = new _Set();
  var result = [];
  var idx = 0;
  var appliedItem, item;

  while (idx < list.length) {
    item = list[idx];
    appliedItem = fn(item);

    if (set.add(appliedItem)) {
      result.push(item);
    }

    idx += 1;
  }

  return result;
}));

/**
 * Returns a new list containing only one copy of each element in the original
 * list. [`R.equals`](#equals) is used to determine equality.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [a]
 * @param {Array} list The array to consider.
 * @return {Array} The list of unique items.
 * @example
 *
 *      R.uniq([1, 1, 2, 1]); //=> [1, 2]
 *      R.uniq([1, '1']);     //=> [1, '1']
 *      R.uniq([[42], [42]]); //=> [[42]]
 */

var uniq =
/*#__PURE__*/
uniqBy(identity);

/**
 * Combines two lists into a set (i.e. no duplicates) composed of those
 * elements common to both lists.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig [*] -> [*] -> [*]
 * @param {Array} list1 The first list.
 * @param {Array} list2 The second list.
 * @return {Array} The list of elements found in both `list1` and `list2`.
 * @see R.innerJoin
 * @example
 *
 *      R.intersection([1,2,3,4], [7,6,5,4,3]); //=> [4, 3]
 */

var intersection =
/*#__PURE__*/
_curry2(function intersection(list1, list2) {
  var lookupList, filteredList;

  if (list1.length > list2.length) {
    lookupList = list1;
    filteredList = list2;
  } else {
    lookupList = list2;
    filteredList = list1;
  }

  return uniq(_filter(flip(_includes)(lookupList), filteredList));
});

/**
 * Creates a new list with the separator interposed between elements.
 *
 * Dispatches to the `intersperse` method of the second argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category List
 * @sig a -> [a] -> [a]
 * @param {*} separator The element to add to the list.
 * @param {Array} list The list to be interposed.
 * @return {Array} The new list.
 * @example
 *
 *      R.intersperse('a', ['b', 'n', 'n', 's']); //=> ['b', 'a', 'n', 'a', 'n', 'a', 's']
 */

var intersperse =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_checkForMethod('intersperse', function intersperse(separator, list) {
  var out = [];
  var idx = 0;
  var length = list.length;

  while (idx < length) {
    if (idx === length - 1) {
      out.push(list[idx]);
    } else {
      out.push(list[idx], separator);
    }

    idx += 1;
  }

  return out;
}));

function _objectAssign(target) {
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  var output = Object(target);
  var idx = 1;
  var length = arguments.length;

  while (idx < length) {
    var source = arguments[idx];

    if (source != null) {
      for (var nextKey in source) {
        if (_has(nextKey, source)) {
          output[nextKey] = source[nextKey];
        }
      }
    }

    idx += 1;
  }

  return output;
}

var _objectAssign$1 = typeof Object.assign === 'function' ? Object.assign : _objectAssign;

/**
 * Creates an object containing a single key:value pair.
 *
 * @func
 * @memberOf R
 * @since v0.18.0
 * @category Object
 * @sig String -> a -> {String:a}
 * @param {String} key
 * @param {*} val
 * @return {Object}
 * @see R.pair
 * @example
 *
 *      const matchPhrases = R.compose(
 *        R.objOf('must'),
 *        R.map(R.objOf('match_phrase'))
 *      );
 *      matchPhrases(['foo', 'bar', 'baz']); //=> {must: [{match_phrase: 'foo'}, {match_phrase: 'bar'}, {match_phrase: 'baz'}]}
 */

var objOf =
/*#__PURE__*/
_curry2(function objOf(key, val) {
  var obj = {};
  obj[key] = val;
  return obj;
});

var _stepCatArray = {
  '@@transducer/init': Array,
  '@@transducer/step': function (xs, x) {
    xs.push(x);
    return xs;
  },
  '@@transducer/result': _identity
};
var _stepCatString = {
  '@@transducer/init': String,
  '@@transducer/step': function (a, b) {
    return a + b;
  },
  '@@transducer/result': _identity
};
var _stepCatObject = {
  '@@transducer/init': Object,
  '@@transducer/step': function (result, input) {
    return _objectAssign$1(result, _isArrayLike(input) ? objOf(input[0], input[1]) : input);
  },
  '@@transducer/result': _identity
};
function _stepCat(obj) {
  if (_isTransformer(obj)) {
    return obj;
  }

  if (_isArrayLike(obj)) {
    return _stepCatArray;
  }

  if (typeof obj === 'string') {
    return _stepCatString;
  }

  if (typeof obj === 'object') {
    return _stepCatObject;
  }

  throw new Error('Cannot create transformer for ' + obj);
}

/**
 * Transforms the items of the list with the transducer and appends the
 * transformed items to the accumulator using an appropriate iterator function
 * based on the accumulator type.
 *
 * The accumulator can be an array, string, object or a transformer. Iterated
 * items will be appended to arrays and concatenated to strings. Objects will
 * be merged directly or 2-item arrays will be merged as key, value pairs.
 *
 * The accumulator can also be a transformer object that provides a 2-arity
 * reducing iterator function, step, 0-arity initial value function, init, and
 * 1-arity result extraction function result. The step function is used as the
 * iterator function in reduce. The result function is used to convert the
 * final accumulator into the return type and in most cases is R.identity. The
 * init function is used to provide the initial accumulator.
 *
 * The iteration is performed with [`R.reduce`](#reduce) after initializing the
 * transducer.
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category List
 * @sig a -> (b -> b) -> [c] -> a
 * @param {*} acc The initial accumulator value.
 * @param {Function} xf The transducer function. Receives a transformer and returns a transformer.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.transduce
 * @example
 *
 *      const numbers = [1, 2, 3, 4];
 *      const transducer = R.compose(R.map(R.add(1)), R.take(2));
 *
 *      R.into([], transducer, numbers); //=> [2, 3]
 *
 *      const intoArray = R.into([]);
 *      intoArray(transducer, numbers); //=> [2, 3]
 */

var into =
/*#__PURE__*/
_curry3(function into(acc, xf, list) {
  return _isTransformer(acc) ? _reduce(xf(acc), acc['@@transducer/init'](), list) : _reduce(xf(_stepCat(acc)), _clone(acc, [], [], false), list);
});

/**
 * Same as [`R.invertObj`](#invertObj), however this accounts for objects with
 * duplicate values by putting the values into an array.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Object
 * @sig {s: x} -> {x: [ s, ... ]}
 * @param {Object} obj The object or array to invert
 * @return {Object} out A new object with keys in an array.
 * @see R.invertObj
 * @example
 *
 *      const raceResultsByFirstName = {
 *        first: 'alice',
 *        second: 'jake',
 *        third: 'alice',
 *      };
 *      R.invert(raceResultsByFirstName);
 *      //=> { 'alice': ['first', 'third'], 'jake':['second'] }
 */

var invert =
/*#__PURE__*/
_curry1(function invert(obj) {
  var props = keys(obj);
  var len = props.length;
  var idx = 0;
  var out = {};

  while (idx < len) {
    var key = props[idx];
    var val = obj[key];
    var list = _has(val, out) ? out[val] : out[val] = [];
    list[list.length] = key;
    idx += 1;
  }

  return out;
});

/**
 * Returns a new object with the keys of the given object as values, and the
 * values of the given object, which are coerced to strings, as keys. Note
 * that the last key found is preferred when handling the same value.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Object
 * @sig {s: x} -> {x: s}
 * @param {Object} obj The object or array to invert
 * @return {Object} out A new object
 * @see R.invert
 * @example
 *
 *      const raceResults = {
 *        first: 'alice',
 *        second: 'jake'
 *      };
 *      R.invertObj(raceResults);
 *      //=> { 'alice': 'first', 'jake':'second' }
 *
 *      // Alternatively:
 *      const raceResults = ['alice', 'jake'];
 *      R.invertObj(raceResults);
 *      //=> { 'alice': '0', 'jake':'1' }
 */

var invertObj =
/*#__PURE__*/
_curry1(function invertObj(obj) {
  var props = keys(obj);
  var len = props.length;
  var idx = 0;
  var out = {};

  while (idx < len) {
    var key = props[idx];
    out[obj[key]] = key;
    idx += 1;
  }

  return out;
});

/**
 * Turns a named method with a specified arity into a function that can be
 * called directly supplied with arguments and a target object.
 *
 * The returned function is curried and accepts `arity + 1` parameters where
 * the final parameter is the target object.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig Number -> String -> (a -> b -> ... -> n -> Object -> *)
 * @param {Number} arity Number of arguments the returned function should take
 *        before the target object.
 * @param {String} method Name of any of the target object's methods to call.
 * @return {Function} A new curried function.
 * @see R.construct
 * @example
 *
 *      const sliceFrom = R.invoker(1, 'slice');
 *      sliceFrom(6, 'abcdefghijklm'); //=> 'ghijklm'
 *      const sliceFrom6 = R.invoker(2, 'slice')(6);
 *      sliceFrom6(8, 'abcdefghijklm'); //=> 'gh'
 *
 *      const dog = {
 *        speak: async () => 'Woof!'
 *      };
 *      const speak = R.invoker(0, 'speak');
 *      speak(dog).then(console.log) //~> 'Woof!'
 *
 * @symb R.invoker(0, 'method')(o) = o['method']()
 * @symb R.invoker(1, 'method')(a, o) = o['method'](a)
 * @symb R.invoker(2, 'method')(a, b, o) = o['method'](a, b)
 */

var invoker =
/*#__PURE__*/
_curry2(function invoker(arity, method) {
  return curryN(arity + 1, function () {
    var target = arguments[arity];

    if (target != null && _isFunction(target[method])) {
      return target[method].apply(target, Array.prototype.slice.call(arguments, 0, arity));
    }

    throw new TypeError(toString(target) + ' does not have a method named "' + method + '"');
  });
});

/**
 * See if an object (i.e. `val`) is an instance of the supplied constructor. This
 * function will check up the inheritance chain, if any.
 * If `val` was created using `Object.create`, `R.is(Object, val) === true`.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category Type
 * @sig (* -> {*}) -> a -> Boolean
 * @param {Object} ctor A constructor
 * @param {*} val The value to test
 * @return {Boolean}
 * @example
 *
 *      R.is(Object, {}); //=> true
 *      R.is(Number, 1); //=> true
 *      R.is(Object, 1); //=> false
 *      R.is(String, 's'); //=> true
 *      R.is(String, new String('')); //=> true
 *      R.is(Object, new String('')); //=> true
 *      R.is(Object, 's'); //=> false
 *      R.is(Number, {}); //=> false
 */

var is =
/*#__PURE__*/
_curry2(function is(Ctor, val) {
  return val instanceof Ctor || val != null && (val.constructor === Ctor || Ctor.name === 'Object' && typeof val === 'object');
});

/**
 * Returns `true` if the given value is its type's empty value; `false`
 * otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Logic
 * @sig a -> Boolean
 * @param {*} x
 * @return {Boolean}
 * @see R.empty
 * @example
 *
 *      R.isEmpty([1, 2, 3]);           //=> false
 *      R.isEmpty([]);                  //=> true
 *      R.isEmpty('');                  //=> true
 *      R.isEmpty(null);                //=> false
 *      R.isEmpty({});                  //=> true
 *      R.isEmpty({length: 0});         //=> false
 *      R.isEmpty(Uint8Array.from('')); //=> true
 */

var isEmpty =
/*#__PURE__*/
_curry1(function isEmpty(x) {
  return x != null && equals(x, empty(x));
});

/**
 * Returns a string made by inserting the `separator` between each element and
 * concatenating all the elements into a single string.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig String -> [a] -> String
 * @param {Number|String} separator The string used to separate the elements.
 * @param {Array} xs The elements to join into a string.
 * @return {String} str The string made by concatenating `xs` with `separator`.
 * @see R.split
 * @example
 *
 *      const spacer = R.join(' ');
 *      spacer(['a', 2, 3.4]);   //=> 'a 2 3.4'
 *      R.join('|', [1, 2, 3]);    //=> '1|2|3'
 */

var join =
/*#__PURE__*/
invoker(1, 'join');

/**
 * juxt applies a list of functions to a list of values.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Function
 * @sig [(a, b, ..., m) -> n] -> ((a, b, ..., m) -> [n])
 * @param {Array} fns An array of functions
 * @return {Function} A function that returns a list of values after applying each of the original `fns` to its parameters.
 * @see R.applySpec
 * @example
 *
 *      const getRange = R.juxt([Math.min, Math.max]);
 *      getRange(3, 4, 9, -3); //=> [-3, 9]
 * @symb R.juxt([f, g, h])(a, b) = [f(a, b), g(a, b), h(a, b)]
 */

var juxt =
/*#__PURE__*/
_curry1(function juxt(fns) {
  return converge(function () {
    return Array.prototype.slice.call(arguments, 0);
  }, fns);
});

/**
 * Returns a list containing the names of all the properties of the supplied
 * object, including prototype properties.
 * Note that the order of the output array is not guaranteed to be consistent
 * across different JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category Object
 * @sig {k: v} -> [k]
 * @param {Object} obj The object to extract properties from
 * @return {Array} An array of the object's own and prototype properties.
 * @see R.keys, R.valuesIn
 * @example
 *
 *      const F = function() { this.x = 'X'; };
 *      F.prototype.y = 'Y';
 *      const f = new F();
 *      R.keysIn(f); //=> ['x', 'y']
 */

var keysIn =
/*#__PURE__*/
_curry1(function keysIn(obj) {
  var prop;
  var ks = [];

  for (prop in obj) {
    ks[ks.length] = prop;
  }

  return ks;
});

/**
 * Returns the position of the last occurrence of an item in an array, or -1 if
 * the item is not included in the array. [`R.equals`](#equals) is used to
 * determine equality.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig a -> [a] -> Number
 * @param {*} target The item to find.
 * @param {Array} xs The array to search in.
 * @return {Number} the index of the target, or -1 if the target is not found.
 * @see R.indexOf, R.findLastIndex
 * @example
 *
 *      R.lastIndexOf(3, [-1,3,3,0,1,2,3,4]); //=> 6
 *      R.lastIndexOf(10, [1,2,3,4]); //=> -1
 */

var lastIndexOf =
/*#__PURE__*/
_curry2(function lastIndexOf(target, xs) {
  if (typeof xs.lastIndexOf === 'function' && !_isArray(xs)) {
    return xs.lastIndexOf(target);
  } else {
    var idx = xs.length - 1;

    while (idx >= 0) {
      if (equals(xs[idx], target)) {
        return idx;
      }

      idx -= 1;
    }

    return -1;
  }
});

function _isNumber(x) {
  return Object.prototype.toString.call(x) === '[object Number]';
}

/**
 * Returns the number of elements in the array by returning `list.length`.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category List
 * @sig [a] -> Number
 * @param {Array} list The array to inspect.
 * @return {Number} The length of the array.
 * @example
 *
 *      R.length([]); //=> 0
 *      R.length([1, 2, 3]); //=> 3
 */

var length =
/*#__PURE__*/
_curry1(function length(list) {
  return list != null && _isNumber(list.length) ? list.length : NaN;
});

/**
 * Returns a lens for the given getter and setter functions. The getter "gets"
 * the value of the focus; the setter "sets" the value of the focus. The setter
 * should not mutate the data structure.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig (s -> a) -> ((a, s) -> s) -> Lens s a
 * @param {Function} getter
 * @param {Function} setter
 * @return {Lens}
 * @see R.view, R.set, R.over, R.lensIndex, R.lensProp
 * @example
 *
 *      const xLens = R.lens(R.prop('x'), R.assoc('x'));
 *
 *      R.view(xLens, {x: 1, y: 2});            //=> 1
 *      R.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}
 *      R.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}
 */

var lens =
/*#__PURE__*/
_curry2(function lens(getter, setter) {
  return function (toFunctorFn) {
    return function (target) {
      return map$1(function (focus) {
        return setter(focus, target);
      }, toFunctorFn(getter(target)));
    };
  };
});

/**
 * Returns a new copy of the array with the element at the provided index
 * replaced with the given value.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category List
 * @sig Number -> a -> [a] -> [a]
 * @param {Number} idx The index to update.
 * @param {*} x The value to exist at the given index of the returned array.
 * @param {Array|Arguments} list The source array-like object to be updated.
 * @return {Array} A copy of `list` with the value at index `idx` replaced with `x`.
 * @see R.adjust
 * @example
 *
 *      R.update(1, '_', ['a', 'b', 'c']);      //=> ['a', '_', 'c']
 *      R.update(-1, '_', ['a', 'b', 'c']);     //=> ['a', 'b', '_']
 * @symb R.update(-1, a, [b, c]) = [b, a]
 * @symb R.update(0, a, [b, c]) = [a, c]
 * @symb R.update(1, a, [b, c]) = [b, a]
 */

var update =
/*#__PURE__*/
_curry3(function update(idx, x, list) {
  return adjust(idx, always(x), list);
});

/**
 * Returns a lens whose focus is the specified index.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig Number -> Lens s a
 * @param {Number} n
 * @return {Lens}
 * @see R.view, R.set, R.over, R.nth
 * @example
 *
 *      const headLens = R.lensIndex(0);
 *
 *      R.view(headLens, ['a', 'b', 'c']);            //=> 'a'
 *      R.set(headLens, 'x', ['a', 'b', 'c']);        //=> ['x', 'b', 'c']
 *      R.over(headLens, R.toUpper, ['a', 'b', 'c']); //=> ['A', 'b', 'c']
 */

var lensIndex =
/*#__PURE__*/
_curry1(function lensIndex(n) {
  return lens(nth(n), update(n));
});

/**
 * Retrieves the values at given paths of an object.
 *
 * @func
 * @memberOf R
 * @since v0.27.1
 * @category Object
 * @typedefn Idx = [String | Int | Symbol]
 * @sig [Idx] -> {a} -> [a | Undefined]
 * @param {Array} pathsArray The array of paths to be fetched.
 * @param {Object} obj The object to retrieve the nested properties from.
 * @return {Array} A list consisting of values at paths specified by "pathsArray".
 * @see R.path
 * @example
 *
 *      R.paths([['a', 'b'], ['p', 0, 'q']], {a: {b: 2}, p: [{q: 3}]}); //=> [2, 3]
 *      R.paths([['a', 'b'], ['p', 'r']], {a: {b: 2}, p: [{q: 3}]}); //=> [2, undefined]
 */

var paths =
/*#__PURE__*/
_curry2(function paths(pathsArray, obj) {
  return pathsArray.map(function (paths) {
    var val = obj;
    var idx = 0;
    var p;

    while (idx < paths.length) {
      if (val == null) {
        return;
      }

      p = paths[idx];
      val = _isInteger(p) ? nth(p, val) : val[p];
      idx += 1;
    }

    return val;
  });
});

/**
 * Retrieve the value at a given path.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category Object
 * @typedefn Idx = String | Int | Symbol
 * @sig [Idx] -> {a} -> a | Undefined
 * @param {Array} path The path to use.
 * @param {Object} obj The object to retrieve the nested property from.
 * @return {*} The data at `path`.
 * @see R.prop, R.nth
 * @example
 *
 *      R.path(['a', 'b'], {a: {b: 2}}); //=> 2
 *      R.path(['a', 'b'], {c: {b: 2}}); //=> undefined
 *      R.path(['a', 'b', 0], {a: {b: [1, 2, 3]}}); //=> 1
 *      R.path(['a', 'b', -2], {a: {b: [1, 2, 3]}}); //=> 2
 */

var path =
/*#__PURE__*/
_curry2(function path(pathAr, obj) {
  return paths([pathAr], obj)[0];
});

/**
 * Returns a lens whose focus is the specified path.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Object
 * @typedefn Idx = String | Int | Symbol
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig [Idx] -> Lens s a
 * @param {Array} path The path to use.
 * @return {Lens}
 * @see R.view, R.set, R.over
 * @example
 *
 *      const xHeadYLens = R.lensPath(['x', 0, 'y']);
 *
 *      R.view(xHeadYLens, {x: [{y: 2, z: 3}, {y: 4, z: 5}]});
 *      //=> 2
 *      R.set(xHeadYLens, 1, {x: [{y: 2, z: 3}, {y: 4, z: 5}]});
 *      //=> {x: [{y: 1, z: 3}, {y: 4, z: 5}]}
 *      R.over(xHeadYLens, R.negate, {x: [{y: 2, z: 3}, {y: 4, z: 5}]});
 *      //=> {x: [{y: -2, z: 3}, {y: 4, z: 5}]}
 */

var lensPath =
/*#__PURE__*/
_curry1(function lensPath(p) {
  return lens(path(p), assocPath(p));
});

/**
 * Returns a lens whose focus is the specified property.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig String -> Lens s a
 * @param {String} k
 * @return {Lens}
 * @see R.view, R.set, R.over
 * @example
 *
 *      const xLens = R.lensProp('x');
 *
 *      R.view(xLens, {x: 1, y: 2});            //=> 1
 *      R.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}
 *      R.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}
 */

var lensProp =
/*#__PURE__*/
_curry1(function lensProp(k) {
  return lens(prop(k), assoc(k));
});

/**
 * Returns `true` if the first argument is less than the second; `false`
 * otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord a => a -> a -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @see R.gt
 * @example
 *
 *      R.lt(2, 1); //=> false
 *      R.lt(2, 2); //=> false
 *      R.lt(2, 3); //=> true
 *      R.lt('a', 'z'); //=> true
 *      R.lt('z', 'a'); //=> false
 */

var lt =
/*#__PURE__*/
_curry2(function lt(a, b) {
  return a < b;
});

/**
 * Returns `true` if the first argument is less than or equal to the second;
 * `false` otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord a => a -> a -> Boolean
 * @param {Number} a
 * @param {Number} b
 * @return {Boolean}
 * @see R.gte
 * @example
 *
 *      R.lte(2, 1); //=> false
 *      R.lte(2, 2); //=> true
 *      R.lte(2, 3); //=> true
 *      R.lte('a', 'z'); //=> true
 *      R.lte('z', 'a'); //=> false
 */

var lte =
/*#__PURE__*/
_curry2(function lte(a, b) {
  return a <= b;
});

/**
 * The `mapAccum` function behaves like a combination of map and reduce; it
 * applies a function to each element of a list, passing an accumulating
 * parameter from left to right, and returning a final value of this
 * accumulator together with the new list.
 *
 * The iterator function receives two arguments, *acc* and *value*, and should
 * return a tuple *[acc, value]*.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category List
 * @sig ((acc, x) -> (acc, y)) -> acc -> [x] -> (acc, [y])
 * @param {Function} fn The function to be called on every element of the input `list`.
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.scan, R.addIndex, R.mapAccumRight
 * @example
 *
 *      const digits = ['1', '2', '3', '4'];
 *      const appender = (a, b) => [a + b, a + b];
 *
 *      R.mapAccum(appender, 0, digits); //=> ['01234', ['01', '012', '0123', '01234']]
 * @symb R.mapAccum(f, a, [b, c, d]) = [
 *   f(f(f(a, b)[0], c)[0], d)[0],
 *   [
 *     f(a, b)[1],
 *     f(f(a, b)[0], c)[1],
 *     f(f(f(a, b)[0], c)[0], d)[1]
 *   ]
 * ]
 */

var mapAccum =
/*#__PURE__*/
_curry3(function mapAccum(fn, acc, list) {
  var idx = 0;
  var len = list.length;
  var result = [];
  var tuple = [acc];

  while (idx < len) {
    tuple = fn(tuple[0], list[idx]);
    result[idx] = tuple[1];
    idx += 1;
  }

  return [tuple[0], result];
});

/**
 * The `mapAccumRight` function behaves like a combination of map and reduce; it
 * applies a function to each element of a list, passing an accumulating
 * parameter from right to left, and returning a final value of this
 * accumulator together with the new list.
 *
 * Similar to [`mapAccum`](#mapAccum), except moves through the input list from
 * the right to the left.
 *
 * The iterator function receives two arguments, *acc* and *value*, and should
 * return a tuple *[acc, value]*.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category List
 * @sig ((acc, x) -> (acc, y)) -> acc -> [x] -> (acc, [y])
 * @param {Function} fn The function to be called on every element of the input `list`.
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.addIndex, R.mapAccum
 * @example
 *
 *      const digits = ['1', '2', '3', '4'];
 *      const appender = (a, b) => [b + a, b + a];
 *
 *      R.mapAccumRight(appender, 5, digits); //=> ['12345', ['12345', '2345', '345', '45']]
 * @symb R.mapAccumRight(f, a, [b, c, d]) = [
 *   f(f(f(a, d)[0], c)[0], b)[0],
 *   [
 *     f(a, d)[1],
 *     f(f(a, d)[0], c)[1],
 *     f(f(f(a, d)[0], c)[0], b)[1]
 *   ]
 * ]
 */

var mapAccumRight =
/*#__PURE__*/
_curry3(function mapAccumRight(fn, acc, list) {
  var idx = list.length - 1;
  var result = [];
  var tuple = [acc];

  while (idx >= 0) {
    tuple = fn(tuple[0], list[idx]);
    result[idx] = tuple[1];
    idx -= 1;
  }

  return [tuple[0], result];
});

/**
 * An Object-specific version of [`map`](#map). The function is applied to three
 * arguments: *(value, key, obj)*. If only the value is significant, use
 * [`map`](#map) instead.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Object
 * @sig ((*, String, Object) -> *) -> Object -> Object
 * @param {Function} fn
 * @param {Object} obj
 * @return {Object}
 * @see R.map
 * @example
 *
 *      const xyz = { x: 1, y: 2, z: 3 };
 *      const prependKeyAndDouble = (num, key, obj) => key + (num * 2);
 *
 *      R.mapObjIndexed(prependKeyAndDouble, xyz); //=> { x: 'x2', y: 'y4', z: 'z6' }
 */

var mapObjIndexed =
/*#__PURE__*/
_curry2(function mapObjIndexed(fn, obj) {
  return _reduce(function (acc, key) {
    acc[key] = fn(obj[key], key, obj);
    return acc;
  }, {}, keys(obj));
});

/**
 * Tests a regular expression against a String. Note that this function will
 * return an empty array when there are no matches. This differs from
 * [`String.prototype.match`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)
 * which returns `null` when there are no matches.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category String
 * @sig RegExp -> String -> [String | Undefined]
 * @param {RegExp} rx A regular expression.
 * @param {String} str The string to match against
 * @return {Array} The list of matches or empty array.
 * @see R.test
 * @example
 *
 *      R.match(/([a-z]a)/g, 'bananas'); //=> ['ba', 'na', 'na']
 *      R.match(/a/, 'b'); //=> []
 *      R.match(/a/, null); //=> TypeError: null does not have a method named "match"
 */

var match =
/*#__PURE__*/
_curry2(function match(rx, str) {
  return str.match(rx) || [];
});

/**
 * `mathMod` behaves like the modulo operator should mathematically, unlike the
 * `%` operator (and by extension, [`R.modulo`](#modulo)). So while
 * `-17 % 5` is `-2`, `mathMod(-17, 5)` is `3`. `mathMod` requires Integer
 * arguments, and returns NaN when the modulus is zero or negative.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category Math
 * @sig Number -> Number -> Number
 * @param {Number} m The dividend.
 * @param {Number} p the modulus.
 * @return {Number} The result of `b mod a`.
 * @see R.modulo
 * @example
 *
 *      R.mathMod(-17, 5);  //=> 3
 *      R.mathMod(17, 5);   //=> 2
 *      R.mathMod(17, -5);  //=> NaN
 *      R.mathMod(17, 0);   //=> NaN
 *      R.mathMod(17.2, 5); //=> NaN
 *      R.mathMod(17, 5.3); //=> NaN
 *
 *      const clock = R.mathMod(R.__, 12);
 *      clock(15); //=> 3
 *      clock(24); //=> 0
 *
 *      const seventeenMod = R.mathMod(17);
 *      seventeenMod(3);  //=> 2
 *      seventeenMod(4);  //=> 1
 *      seventeenMod(10); //=> 7
 */

var mathMod =
/*#__PURE__*/
_curry2(function mathMod(m, p) {
  if (!_isInteger(m)) {
    return NaN;
  }

  if (!_isInteger(p) || p < 1) {
    return NaN;
  }

  return (m % p + p) % p;
});

/**
 * Takes a function and two values, and returns whichever value produces the
 * larger result when passed to the provided function.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Relation
 * @sig Ord b => (a -> b) -> a -> a -> a
 * @param {Function} f
 * @param {*} a
 * @param {*} b
 * @return {*}
 * @see R.max, R.minBy
 * @example
 *
 *      //  square :: Number -> Number
 *      const square = n => n * n;
 *
 *      R.maxBy(square, -3, 2); //=> -3
 *
 *      R.reduce(R.maxBy(square), 0, [3, -5, 4, 1, -2]); //=> -5
 *      R.reduce(R.maxBy(square), 0, []); //=> 0
 */

var maxBy =
/*#__PURE__*/
_curry3(function maxBy(f, a, b) {
  return f(b) > f(a) ? b : a;
});

/**
 * Adds together all the elements of a list.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Math
 * @sig [Number] -> Number
 * @param {Array} list An array of numbers
 * @return {Number} The sum of all the numbers in the list.
 * @see R.reduce
 * @example
 *
 *      R.sum([2,4,6,8,100,1]); //=> 121
 */

var sum =
/*#__PURE__*/
reduce(add, 0);

/**
 * Returns the mean of the given list of numbers.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category Math
 * @sig [Number] -> Number
 * @param {Array} list
 * @return {Number}
 * @see R.median
 * @example
 *
 *      R.mean([2, 7, 9]); //=> 6
 *      R.mean([]); //=> NaN
 */

var mean =
/*#__PURE__*/
_curry1(function mean(list) {
  return sum(list) / list.length;
});

/**
 * Returns the median of the given list of numbers.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category Math
 * @sig [Number] -> Number
 * @param {Array} list
 * @return {Number}
 * @see R.mean
 * @example
 *
 *      R.median([2, 9, 7]); //=> 7
 *      R.median([7, 2, 10, 9]); //=> 8
 *      R.median([]); //=> NaN
 */

var median =
/*#__PURE__*/
_curry1(function median(list) {
  var len = list.length;

  if (len === 0) {
    return NaN;
  }

  var width = 2 - len % 2;
  var idx = (len - width) / 2;
  return mean(Array.prototype.slice.call(list, 0).sort(function (a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  }).slice(idx, idx + width));
});

/**
 * Creates a new function that, when invoked, caches the result of calling `fn`
 * for a given argument set and returns the result. Subsequent calls to the
 * memoized `fn` with the same argument set will not result in an additional
 * call to `fn`; instead, the cached result for that set of arguments will be
 * returned.
 *
 * Care must be taken when implementing key generation to avoid key collision,
 * or if tracking references, memory leaks and mutating arguments.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Function
 * @sig (*... -> String) -> (*... -> a) -> (*... -> a)
 * @param {Function} fn The function to generate the cache key.
 * @param {Function} fn The function to memoize.
 * @return {Function} Memoized version of `fn`.
 * @example
 *
 *      let count = 0;
 *      const factorial = R.memoizeWith(Number, n => {
 *        count += 1;
 *        return R.product(R.range(1, n + 1));
 *      });
 *      factorial(5); //=> 120
 *      factorial(5); //=> 120
 *      factorial(5); //=> 120
 *      count; //=> 1
 */

var memoizeWith =
/*#__PURE__*/
_curry2(function memoizeWith(mFn, fn) {
  var cache = {};
  return _arity(fn.length, function () {
    var key = mFn.apply(this, arguments);

    if (!_has(key, cache)) {
      cache[key] = fn.apply(this, arguments);
    }

    return cache[key];
  });
});

/**
 * Creates one new object with the own properties from a list of objects.
 * If a key exists in more than one object, the value from the last
 * object it exists in will be used.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category List
 * @sig [{k: v}] -> {k: v}
 * @param {Array} list An array of objects
 * @return {Object} A merged object.
 * @see R.reduce
 * @example
 *
 *      R.mergeAll([{foo:1},{bar:2},{baz:3}]); //=> {foo:1,bar:2,baz:3}
 *      R.mergeAll([{foo:1},{foo:2},{bar:2}]); //=> {foo:2,bar:2}
 * @symb R.mergeAll([{ x: 1 }, { y: 2 }, { z: 3 }]) = { x: 1, y: 2, z: 3 }
 */

var mergeAll =
/*#__PURE__*/
_curry1(function mergeAll(list) {
  return _objectAssign$1.apply(null, [{}].concat(list));
});

/**
 * Creates a new object with the own properties of the two provided objects. If
 * a key exists in both objects, the provided function is applied to the key
 * and the values associated with the key in each object, with the result being
 * used as the value associated with the key in the returned object.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Object
 * @sig ((String, a, a) -> a) -> {a} -> {a} -> {a}
 * @param {Function} fn
 * @param {Object} l
 * @param {Object} r
 * @return {Object}
 * @see R.mergeDeepWithKey, R.merge, R.mergeWith
 * @example
 *
 *      let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r
 *      R.mergeWithKey(concatValues,
 *                     { a: true, thing: 'foo', values: [10, 20] },
 *                     { b: true, thing: 'bar', values: [15, 35] });
 *      //=> { a: true, b: true, thing: 'bar', values: [10, 20, 15, 35] }
 * @symb R.mergeWithKey(f, { x: 1, y: 2 }, { y: 5, z: 3 }) = { x: 1, y: f('y', 2, 5), z: 3 }
 */

var mergeWithKey =
/*#__PURE__*/
_curry3(function mergeWithKey(fn, l, r) {
  var result = {};
  var k;

  for (k in l) {
    if (_has(k, l)) {
      result[k] = _has(k, r) ? fn(k, l[k], r[k]) : l[k];
    }
  }

  for (k in r) {
    if (_has(k, r) && !_has(k, result)) {
      result[k] = r[k];
    }
  }

  return result;
});

/**
 * Creates a new object with the own properties of the two provided objects.
 * If a key exists in both objects:
 * - and both associated values are also objects then the values will be
 *   recursively merged.
 * - otherwise the provided function is applied to the key and associated values
 *   using the resulting value as the new value associated with the key.
 * If a key only exists in one object, the value will be associated with the key
 * of the resulting object.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Object
 * @sig ((String, a, a) -> a) -> {a} -> {a} -> {a}
 * @param {Function} fn
 * @param {Object} lObj
 * @param {Object} rObj
 * @return {Object}
 * @see R.mergeWithKey, R.mergeDeepWith
 * @example
 *
 *      let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r
 *      R.mergeDeepWithKey(concatValues,
 *                         { a: true, c: { thing: 'foo', values: [10, 20] }},
 *                         { b: true, c: { thing: 'bar', values: [15, 35] }});
 *      //=> { a: true, b: true, c: { thing: 'bar', values: [10, 20, 15, 35] }}
 */

var mergeDeepWithKey =
/*#__PURE__*/
_curry3(function mergeDeepWithKey(fn, lObj, rObj) {
  return mergeWithKey(function (k, lVal, rVal) {
    if (_isObject(lVal) && _isObject(rVal)) {
      return mergeDeepWithKey(fn, lVal, rVal);
    } else {
      return fn(k, lVal, rVal);
    }
  }, lObj, rObj);
});

/**
 * Creates a new object with the own properties of the first object merged with
 * the own properties of the second object. If a key exists in both objects:
 * - and both values are objects, the two values will be recursively merged
 * - otherwise the value from the first object will be used.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Object
 * @sig {a} -> {a} -> {a}
 * @param {Object} lObj
 * @param {Object} rObj
 * @return {Object}
 * @see R.merge, R.mergeDeepRight, R.mergeDeepWith, R.mergeDeepWithKey
 * @example
 *
 *      R.mergeDeepLeft({ name: 'fred', age: 10, contact: { email: 'moo@example.com' }},
 *                      { age: 40, contact: { email: 'baa@example.com' }});
 *      //=> { name: 'fred', age: 10, contact: { email: 'moo@example.com' }}
 */

var mergeDeepLeft =
/*#__PURE__*/
_curry2(function mergeDeepLeft(lObj, rObj) {
  return mergeDeepWithKey(function (k, lVal, rVal) {
    return lVal;
  }, lObj, rObj);
});

/**
 * Creates a new object with the own properties of the first object merged with
 * the own properties of the second object. If a key exists in both objects:
 * - and both values are objects, the two values will be recursively merged
 * - otherwise the value from the second object will be used.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Object
 * @sig {a} -> {a} -> {a}
 * @param {Object} lObj
 * @param {Object} rObj
 * @return {Object}
 * @see R.merge, R.mergeDeepLeft, R.mergeDeepWith, R.mergeDeepWithKey
 * @example
 *
 *      R.mergeDeepRight({ name: 'fred', age: 10, contact: { email: 'moo@example.com' }},
 *                       { age: 40, contact: { email: 'baa@example.com' }});
 *      //=> { name: 'fred', age: 40, contact: { email: 'baa@example.com' }}
 */

var mergeDeepRight =
/*#__PURE__*/
_curry2(function mergeDeepRight(lObj, rObj) {
  return mergeDeepWithKey(function (k, lVal, rVal) {
    return rVal;
  }, lObj, rObj);
});

/**
 * Creates a new object with the own properties of the two provided objects.
 * If a key exists in both objects:
 * - and both associated values are also objects then the values will be
 *   recursively merged.
 * - otherwise the provided function is applied to associated values using the
 *   resulting value as the new value associated with the key.
 * If a key only exists in one object, the value will be associated with the key
 * of the resulting object.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Object
 * @sig ((a, a) -> a) -> {a} -> {a} -> {a}
 * @param {Function} fn
 * @param {Object} lObj
 * @param {Object} rObj
 * @return {Object}
 * @see R.mergeWith, R.mergeDeepWithKey
 * @example
 *
 *      R.mergeDeepWith(R.concat,
 *                      { a: true, c: { values: [10, 20] }},
 *                      { b: true, c: { values: [15, 35] }});
 *      //=> { a: true, b: true, c: { values: [10, 20, 15, 35] }}
 */

var mergeDeepWith =
/*#__PURE__*/
_curry3(function mergeDeepWith(fn, lObj, rObj) {
  return mergeDeepWithKey(function (k, lVal, rVal) {
    return fn(lVal, rVal);
  }, lObj, rObj);
});

/**
 * Create a new object with the own properties of the first object merged with
 * the own properties of the second object. If a key exists in both objects,
 * the value from the first object will be used.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category Object
 * @sig {k: v} -> {k: v} -> {k: v}
 * @param {Object} l
 * @param {Object} r
 * @return {Object}
 * @see R.mergeRight, R.mergeDeepLeft, R.mergeWith, R.mergeWithKey
 * @example
 *
 *      R.mergeLeft({ 'age': 40 }, { 'name': 'fred', 'age': 10 });
 *      //=> { 'name': 'fred', 'age': 40 }
 *
 *      const resetToDefault = R.mergeLeft({x: 0});
 *      resetToDefault({x: 5, y: 2}); //=> {x: 0, y: 2}
 * @symb R.mergeLeft(a, b) = {...b, ...a}
 */

var mergeLeft =
/*#__PURE__*/
_curry2(function mergeLeft(l, r) {
  return _objectAssign$1({}, r, l);
});

/**
 * Create a new object with the own properties of the first object merged with
 * the own properties of the second object. If a key exists in both objects,
 * the value from the second object will be used.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category Object
 * @sig {k: v} -> {k: v} -> {k: v}
 * @param {Object} l
 * @param {Object} r
 * @return {Object}
 * @see R.mergeLeft, R.mergeDeepRight, R.mergeWith, R.mergeWithKey
 * @example
 *
 *      R.mergeRight({ 'name': 'fred', 'age': 10 }, { 'age': 40 });
 *      //=> { 'name': 'fred', 'age': 40 }
 *
 *      const withDefaults = R.mergeRight({x: 0, y: 0});
 *      withDefaults({y: 2}); //=> {x: 0, y: 2}
 * @symb R.mergeRight(a, b) = {...a, ...b}
 */

var mergeRight =
/*#__PURE__*/
_curry2(function mergeRight(l, r) {
  return _objectAssign$1({}, l, r);
});

/**
 * Creates a new object with the own properties of the two provided objects. If
 * a key exists in both objects, the provided function is applied to the values
 * associated with the key in each object, with the result being used as the
 * value associated with the key in the returned object.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Object
 * @sig ((a, a) -> a) -> {a} -> {a} -> {a}
 * @param {Function} fn
 * @param {Object} l
 * @param {Object} r
 * @return {Object}
 * @see R.mergeDeepWith, R.merge, R.mergeWithKey
 * @example
 *
 *      R.mergeWith(R.concat,
 *                  { a: true, values: [10, 20] },
 *                  { b: true, values: [15, 35] });
 *      //=> { a: true, b: true, values: [10, 20, 15, 35] }
 */

var mergeWith =
/*#__PURE__*/
_curry3(function mergeWith(fn, l, r) {
  return mergeWithKey(function (_, _l, _r) {
    return fn(_l, _r);
  }, l, r);
});

/**
 * Returns the smaller of its two arguments.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord a => a -> a -> a
 * @param {*} a
 * @param {*} b
 * @return {*}
 * @see R.minBy, R.max
 * @example
 *
 *      R.min(789, 123); //=> 123
 *      R.min('a', 'b'); //=> 'a'
 */

var min =
/*#__PURE__*/
_curry2(function min(a, b) {
  return b < a ? b : a;
});

/**
 * Takes a function and two values, and returns whichever value produces the
 * smaller result when passed to the provided function.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Relation
 * @sig Ord b => (a -> b) -> a -> a -> a
 * @param {Function} f
 * @param {*} a
 * @param {*} b
 * @return {*}
 * @see R.min, R.maxBy
 * @example
 *
 *      //  square :: Number -> Number
 *      const square = n => n * n;
 *
 *      R.minBy(square, -3, 2); //=> 2
 *
 *      R.reduce(R.minBy(square), Infinity, [3, -5, 4, 1, -2]); //=> 1
 *      R.reduce(R.minBy(square), Infinity, []); //=> Infinity
 */

var minBy =
/*#__PURE__*/
_curry3(function minBy(f, a, b) {
  return f(b) < f(a) ? b : a;
});

/**
 * Makes a shallow clone of an object, applying the given fn to the specified
 * property with the given value. Note that this copies and flattens prototype
 * properties onto the new object as well. All non-primitive properties are
 * copied by reference.
 *
 * @private
 * @param {String|Number} prop The property name to set
 * @param {Function} fn The function to apply to the property
 * @param {Object|Array} obj The object to clone
 * @return {Object|Array} A new object equivalent to the original except for the changed property.
 */

function _modify(prop, fn, obj) {
  if (_isInteger(prop) && _isArray(obj)) {
    var arr = [].concat(obj);
    arr[prop] = fn(arr[prop]);
    return arr;
  }

  var result = {};

  for (var p in obj) {
    result[p] = obj[p];
  }

  result[prop] = fn(result[prop]);
  return result;
}

/**
 * Creates a shallow clone of the passed object by applying an `fn` function
 * to the value at the given path.
 *
 * The function will not be invoked, and the object will not change
 * if its corresponding path does not exist in the object.
 * All non-primitive properties are copied to the new object by reference.
 *
 * @func
 * @memberOf R
 * @since v0.28.0
 * @category Object
 * @sig [Idx] -> (v -> v) -> {k: v} -> {k: v}
 * @param {Array} path The path to be modified.
 * @param {Function} fn The function to apply to the path.
 * @param {Object} object The object to be transformed.
 * @return {Object} The transformed object.
 * @example
 *
 *      const person = {name: 'James', address: { zipCode: '90216' }};
 *      R.modifyPath(['address', 'zipCode'], R.reverse, person); //=> {name: 'James', address: { zipCode: '61209' }}
 *
 *      // Can handle arrays too
 *      const person = {name: 'James', addresses: [{ zipCode: '90216' }]};
 *      R.modifyPath(['addresses', 0, 'zipCode'], R.reverse, person); //=> {name: 'James', addresses: [{ zipCode: '61209' }]}
 */

var modifyPath =
/*#__PURE__*/
_curry3(function modifyPath(path, fn, object) {
  if (!_isObject(object) && !_isArray(object) || path.length === 0) {
    return object;
  }

  var idx = path[0];

  if (!_has(idx, object)) {
    return object;
  }

  if (path.length === 1) {
    return _modify(idx, fn, object);
  }

  var val = modifyPath(Array.prototype.slice.call(path, 1), fn, object[idx]);

  if (val === object[idx]) {
    return object;
  }

  return _assoc(idx, val, object);
});

/**
 * Creates a copy of the passed object by applying an `fn` function to the given `prop` property.
 *
 * The function will not be invoked, and the object will not change
 * if its corresponding property does not exist in the object.
 * All non-primitive properties are copied to the new object by reference.
 *
 * @func
 * @memberOf R
 * @since v0.28.0
 * @category Object
 * @sig Idx -> (v -> v) -> {k: v} -> {k: v}
 * @param {String|Number} prop The property to be modified.
 * @param {Function} fn The function to apply to the property.
 * @param {Object} object The object to be transformed.
 * @return {Object} The transformed object.
 * @example
 *
 *      const person = {name: 'James', age: 20, pets: ['dog', 'cat']};
 *      R.modify('age', R.add(1), person); //=> {name: 'James', age: 21, pets: ['dog', 'cat']}
 *      R.modify('pets', R.append('turtle'), person); //=> {name: 'James', age: 20, pets: ['dog', 'cat', 'turtle']}
 */

var modify =
/*#__PURE__*/
_curry3(function modify(prop, fn, object) {
  return modifyPath([prop], fn, object);
});

/**
 * Divides the first parameter by the second and returns the remainder. Note
 * that this function preserves the JavaScript-style behavior for modulo. For
 * mathematical modulo see [`mathMod`](#mathMod).
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category Math
 * @sig Number -> Number -> Number
 * @param {Number} a The value to the divide.
 * @param {Number} b The pseudo-modulus
 * @return {Number} The result of `b % a`.
 * @see R.mathMod
 * @example
 *
 *      R.modulo(17, 3); //=> 2
 *      // JS behavior:
 *      R.modulo(-17, 3); //=> -2
 *      R.modulo(17, -3); //=> 2
 *
 *      const isOdd = R.modulo(R.__, 2);
 *      isOdd(42); //=> 0
 *      isOdd(21); //=> 1
 */

var modulo =
/*#__PURE__*/
_curry2(function modulo(a, b) {
  return a % b;
});

/**
 * Move an item, at index `from`, to index `to`, in a list of elements.
 * A new list will be created containing the new elements order.
 *
 * @func
 * @memberOf R
 * @since v0.27.1
 * @category List
 * @sig Number -> Number -> [a] -> [a]
 * @param {Number} from The source index
 * @param {Number} to The destination index
 * @param {Array} list The list which will serve to realise the move
 * @return {Array} The new list reordered
 * @example
 *
 *      R.move(0, 2, ['a', 'b', 'c', 'd', 'e', 'f']); //=> ['b', 'c', 'a', 'd', 'e', 'f']
 *      R.move(-1, 0, ['a', 'b', 'c', 'd', 'e', 'f']); //=> ['f', 'a', 'b', 'c', 'd', 'e'] list rotation
 */

var move =
/*#__PURE__*/
_curry3(function (from, to, list) {
  var length = list.length;
  var result = list.slice();
  var positiveFrom = from < 0 ? length + from : from;
  var positiveTo = to < 0 ? length + to : to;
  var item = result.splice(positiveFrom, 1);
  return positiveFrom < 0 || positiveFrom >= list.length || positiveTo < 0 || positiveTo >= list.length ? list : [].concat(result.slice(0, positiveTo)).concat(item).concat(result.slice(positiveTo, list.length));
});

/**
 * Multiplies two numbers. Equivalent to `a * b` but curried.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Math
 * @sig Number -> Number -> Number
 * @param {Number} a The first value.
 * @param {Number} b The second value.
 * @return {Number} The result of `a * b`.
 * @see R.divide
 * @example
 *
 *      const double = R.multiply(2);
 *      const triple = R.multiply(3);
 *      double(3);       //=>  6
 *      triple(4);       //=> 12
 *      R.multiply(2, 5);  //=> 10
 */

var multiply =
/*#__PURE__*/
_curry2(function multiply(a, b) {
  return a * b;
});

/**
 * Takes a function `f` and an object, and returns a function `g`.
 * When applied, `g` returns the result of applying `f` to the object
 * provided initially merged deeply (right) with the object provided as an argument to `g`.
 *
 * @func
 * @memberOf R
 * @since v0.28.0
 * @category Function
 * @sig (({ a, b, c, ..., n }) -> x) -> { a, b, c, ...} -> ({ d, e, f, ..., n } -> x)
 * @param {Function} f
 * @param {Object} props
 * @return {Function}
 * @see R.partial, R.partialRight, R.curry, R.mergeDeepRight
 * @example
 *
 *      const multiply2 = ({ a, b }) => a * b;
 *      const double = R.partialObject(multiply2, { a: 2 });
 *      double({ b: 2 }); //=> 4
 *
 *      const greet = ({ salutation, title, firstName, lastName }) =>
 *        salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
 *
 *      const sayHello = R.partialObject(greet, { salutation: 'Hello' });
 *      const sayHelloToMs = R.partialObject(sayHello, { title: 'Ms.' });
 *      sayHelloToMs({ firstName: 'Jane', lastName: 'Jones' }); //=> 'Hello, Ms. Jane Jones!'
 * @symb R.partialObject(f, { a, b })({ c, d }) = f({ a, b, c, d })
 */

var partialObject = /*#__PURE__*/
_curry2((f, o) => props => f.call(this, mergeDeepRight(o, props)));

/**
 * Negates its argument.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Math
 * @sig Number -> Number
 * @param {Number} n
 * @return {Number}
 * @example
 *
 *      R.negate(42); //=> -42
 */

var negate =
/*#__PURE__*/
_curry1(function negate(n) {
  return -n;
});

/**
 * Returns `true` if no elements of the list match the predicate, `false`
 * otherwise.
 *
 * Dispatches to the `all` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> Boolean
 * @param {Function} fn The predicate function.
 * @param {Array} list The array to consider.
 * @return {Boolean} `true` if the predicate is not satisfied by every element, `false` otherwise.
 * @see R.all, R.any
 * @example
 *
 *      const isEven = n => n % 2 === 0;
 *      const isOdd = n => n % 2 !== 0;
 *
 *      R.none(isEven, [1, 3, 5, 7, 9, 11]); //=> true
 *      R.none(isOdd, [1, 3, 5, 7, 8, 11]); //=> false
 */

var none =
/*#__PURE__*/
_curry2(function none(fn, input) {
  return all(_complement(fn), input);
});

/**
 * Returns a function which returns its nth argument.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Function
 * @sig Number -> *... -> *
 * @param {Number} n
 * @return {Function}
 * @example
 *
 *      R.nthArg(1)('a', 'b', 'c'); //=> 'b'
 *      R.nthArg(-1)('a', 'b', 'c'); //=> 'c'
 * @symb R.nthArg(-1)(a, b, c) = c
 * @symb R.nthArg(0)(a, b, c) = a
 * @symb R.nthArg(1)(a, b, c) = b
 */

var nthArg =
/*#__PURE__*/
_curry1(function nthArg(n) {
  var arity = n < 0 ? 1 : n + 1;
  return curryN(arity, function () {
    return nth(n, arguments);
  });
});

/**
 * `o` is a curried composition function that returns a unary function.
 * Like [`compose`](#compose), `o` performs right-to-left function composition.
 * Unlike [`compose`](#compose), the rightmost function passed to `o` will be
 * invoked with only one argument. Also, unlike [`compose`](#compose), `o` is
 * limited to accepting only 2 unary functions. The name o was chosen because
 * of its similarity to the mathematical composition operator ∘.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Function
 * @sig (b -> c) -> (a -> b) -> a -> c
 * @param {Function} f
 * @param {Function} g
 * @return {Function}
 * @see R.compose, R.pipe
 * @example
 *
 *      const classyGreeting = name => "The name's " + name.last + ", " + name.first + " " + name.last
 *      const yellGreeting = R.o(R.toUpper, classyGreeting);
 *      yellGreeting({first: 'James', last: 'Bond'}); //=> "THE NAME'S BOND, JAMES BOND"
 *
 *      R.o(R.multiply(10), R.add(10))(-4) //=> 60
 *
 * @symb R.o(f, g, x) = f(g(x))
 */

var o =
/*#__PURE__*/
_curry3(function o(f, g, x) {
  return f(g(x));
});

function _of(x) {
  return [x];
}

/**
 * Returns a singleton array containing the value provided.
 *
 * Note this `of` is different from the ES6 `of`; See
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category Function
 * @sig a -> [a]
 * @param {*} x any value
 * @return {Array} An array wrapping `x`.
 * @example
 *
 *      R.of(null); //=> [null]
 *      R.of([42]); //=> [[42]]
 */

var of =
/*#__PURE__*/
_curry1(_of);

/**
 * Returns a partial copy of an object omitting the keys specified.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig [String] -> {String: *} -> {String: *}
 * @param {Array} names an array of String property names to omit from the new object
 * @param {Object} obj The object to copy from
 * @return {Object} A new object with properties from `names` not on it.
 * @see R.pick
 * @example
 *
 *      R.omit(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, c: 3}
 */

var omit =
/*#__PURE__*/
_curry2(function omit(names, obj) {
  var result = {};
  var index = {};
  var idx = 0;
  var len = names.length;

  while (idx < len) {
    index[names[idx]] = 1;
    idx += 1;
  }

  for (var prop in obj) {
    if (!index.hasOwnProperty(prop)) {
      result[prop] = obj[prop];
    }
  }

  return result;
});

/**
 * Takes a binary function `f`, a unary function `g`, and two values.
 * Applies `g` to each value, then applies the result of each to `f`.
 *
 * Also known as the P combinator.
 *
 * @func
 * @memberOf R
 * @since v0.28.0
 * @category Function
 * @sig ((a, a) -> b) -> (c -> a) -> c -> c -> b
 * @param {Function} f a binary function
 * @param {Function} g a unary function
 * @param {any} a any value
 * @param {any} b any value
 * @return {any} The result of `f`
 * @example
 *
 *      const eqBy = R.on((a, b) => a === b);
 *      eqBy(R.prop('a'), {b:0, a:1}, {a:1}) //=> true;
 *
 *      const containsInsensitive = R.on(R.contains, R.toLower);
 *      containsInsensitive('o', 'FOO'); //=> true
 * @symb R.on(f, g, a, b) = f(g(a), g(b))
 */

var on =
/*#__PURE__*/
_curryN(4, [], function on(f, g, a, b) {
  return f(g(a), g(b));
});

/**
 * Accepts a function `fn` and returns a function that guards invocation of
 * `fn` such that `fn` can only ever be called once, no matter how many times
 * the returned function is invoked. The first value calculated is returned in
 * subsequent invocations.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (a... -> b) -> (a... -> b)
 * @param {Function} fn The function to wrap in a call-only-once wrapper.
 * @return {Function} The wrapped function.
 * @example
 *
 *      const addOneOnce = R.once(x => x + 1);
 *      addOneOnce(10); //=> 11
 *      addOneOnce(addOneOnce(50)); //=> 11
 */

var once =
/*#__PURE__*/
_curry1(function once(fn) {
  var called = false;
  var result;
  return _arity(fn.length, function () {
    if (called) {
      return result;
    }

    called = true;
    result = fn.apply(this, arguments);
    return result;
  });
});

function _assertPromise(name, p) {
  if (p == null || !_isFunction(p.then)) {
    throw new TypeError('`' + name + '` expected a Promise, received ' + _toString(p, []));
  }
}

/**
 * Returns the result of applying the onFailure function to the value inside
 * a failed promise. This is useful for handling rejected promises
 * inside function compositions.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category Function
 * @sig (e -> b) -> (Promise e a) -> (Promise e b)
 * @sig (e -> (Promise f b)) -> (Promise e a) -> (Promise f b)
 * @param {Function} onFailure The function to apply. Can return a value or a promise of a value.
 * @param {Promise} p
 * @return {Promise} The result of calling `p.then(null, onFailure)`
 * @see R.andThen
 * @example
 *
 *      const failedFetch = id => Promise.reject('bad ID');
 *      const useDefault = () => ({ firstName: 'Bob', lastName: 'Loblaw' });
 *
 *      //recoverFromFailure :: String -> Promise ({ firstName, lastName })
 *      const recoverFromFailure = R.pipe(
 *        failedFetch,
 *        R.otherwise(useDefault),
 *        R.andThen(R.pick(['firstName', 'lastName'])),
 *      );
 *      recoverFromFailure(12345).then(console.log);
 */

var otherwise =
/*#__PURE__*/
_curry2(function otherwise(f, p) {
  _assertPromise('otherwise', p);

  return p.then(null, f);
});

// transforms the held value with the provided function.

var Identity = function (x) {
  return {
    value: x,
    map: function (f) {
      return Identity(f(x));
    }
  };
};
/**
 * Returns the result of "setting" the portion of the given data structure
 * focused by the given lens to the result of applying the given function to
 * the focused value.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig Lens s a -> (a -> a) -> s -> s
 * @param {Lens} lens
 * @param {*} v
 * @param {*} x
 * @return {*}
 * @see R.view, R.set, R.lens, R.lensIndex, R.lensProp, R.lensPath
 * @example
 *
 *      const headLens = R.lensIndex(0);
 *
 *      R.over(headLens, R.toUpper, ['foo', 'bar', 'baz']); //=> ['FOO', 'bar', 'baz']
 */


var over =
/*#__PURE__*/
_curry3(function over(lens, f, x) {
  // The value returned by the getter function is first transformed with `f`,
  // then set as the value of an `Identity`. This is then mapped over with the
  // setter function of the lens.
  return lens(function (y) {
    return Identity(f(y));
  })(x).value;
});

/**
 * Takes two arguments, `fst` and `snd`, and returns `[fst, snd]`.
 *
 * @func
 * @memberOf R
 * @since v0.18.0
 * @category List
 * @sig a -> b -> (a,b)
 * @param {*} fst
 * @param {*} snd
 * @return {Array}
 * @see R.objOf, R.of
 * @example
 *
 *      R.pair('foo', 'bar'); //=> ['foo', 'bar']
 */

var pair =
/*#__PURE__*/
_curry2(function pair(fst, snd) {
  return [fst, snd];
});

function _createPartialApplicator(concat) {
  return _curry2(function (fn, args) {
    return _arity(Math.max(0, fn.length - args.length), function () {
      return fn.apply(this, concat(args, arguments));
    });
  });
}

/**
 * Takes a function `f` and a list of arguments, and returns a function `g`.
 * When applied, `g` returns the result of applying `f` to the arguments
 * provided initially followed by the arguments provided to `g`.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category Function
 * @sig ((a, b, c, ..., n) -> x) -> [a, b, c, ...] -> ((d, e, f, ..., n) -> x)
 * @param {Function} f
 * @param {Array} args
 * @return {Function}
 * @see R.partialRight, R.curry
 * @example
 *
 *      const multiply2 = (a, b) => a * b;
 *      const double = R.partial(multiply2, [2]);
 *      double(3); //=> 6
 *
 *      const greet = (salutation, title, firstName, lastName) =>
 *        salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
 *
 *      const sayHello = R.partial(greet, ['Hello']);
 *      const sayHelloToMs = R.partial(sayHello, ['Ms.']);
 *      sayHelloToMs('Jane', 'Jones'); //=> 'Hello, Ms. Jane Jones!'
 * @symb R.partial(f, [a, b])(c, d) = f(a, b, c, d)
 */

var partial =
/*#__PURE__*/
_createPartialApplicator(_concat);

/**
 * Takes a function `f` and a list of arguments, and returns a function `g`.
 * When applied, `g` returns the result of applying `f` to the arguments
 * provided to `g` followed by the arguments provided initially.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category Function
 * @sig ((a, b, c, ..., n) -> x) -> [d, e, f, ..., n] -> ((a, b, c, ...) -> x)
 * @param {Function} f
 * @param {Array} args
 * @return {Function}
 * @see R.partial
 * @example
 *
 *      const greet = (salutation, title, firstName, lastName) =>
 *        salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
 *
 *      const greetMsJaneJones = R.partialRight(greet, ['Ms.', 'Jane', 'Jones']);
 *
 *      greetMsJaneJones('Hello'); //=> 'Hello, Ms. Jane Jones!'
 * @symb R.partialRight(f, [a, b])(c, d) = f(c, d, a, b)
 */

var partialRight =
/*#__PURE__*/
_createPartialApplicator(
/*#__PURE__*/
flip(_concat));

/**
 * Takes a predicate and a list or other `Filterable` object and returns the
 * pair of filterable objects of the same type of elements which do and do not
 * satisfy, the predicate, respectively. Filterable objects include plain objects or any object
 * that has a filter method such as `Array`.
 *
 * @func
 * @memberOf R
 * @since v0.1.4
 * @category List
 * @sig Filterable f => (a -> Boolean) -> f a -> [f a, f a]
 * @param {Function} pred A predicate to determine which side the element belongs to.
 * @param {Array} filterable the list (or other filterable) to partition.
 * @return {Array} An array, containing first the subset of elements that satisfy the
 *         predicate, and second the subset of elements that do not satisfy.
 * @see R.filter, R.reject
 * @example
 *
 *      R.partition(R.includes('s'), ['sss', 'ttt', 'foo', 'bars']);
 *      // => [ [ 'sss', 'bars' ],  [ 'ttt', 'foo' ] ]
 *
 *      R.partition(R.includes('s'), { a: 'sss', b: 'ttt', foo: 'bars' });
 *      // => [ { a: 'sss', foo: 'bars' }, { b: 'ttt' }  ]
 */

var partition =
/*#__PURE__*/
juxt([filter, reject$1]);

/**
 * Determines whether a nested path on an object has a specific value, in
 * [`R.equals`](#equals) terms. Most likely used to filter a list.
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category Relation
 * @typedefn Idx = String | Int | Symbol
 * @sig [Idx] -> a -> {a} -> Boolean
 * @param {Array} path The path of the nested property to use
 * @param {*} val The value to compare the nested property with
 * @param {Object} obj The object to check the nested property in
 * @return {Boolean} `true` if the value equals the nested object property,
 *         `false` otherwise.
 * @example
 *
 *      const user1 = { address: { zipCode: 90210 } };
 *      const user2 = { address: { zipCode: 55555 } };
 *      const user3 = { name: 'Bob' };
 *      const users = [ user1, user2, user3 ];
 *      const isFamous = R.pathEq(['address', 'zipCode'], 90210);
 *      R.filter(isFamous, users); //=> [ user1 ]
 */

var pathEq =
/*#__PURE__*/
_curry3(function pathEq(_path, val, obj) {
  return equals(path(_path, obj), val);
});

/**
 * If the given, non-null object has a value at the given path, returns the
 * value at that path. Otherwise returns the provided default value.
 *
 * @func
 * @memberOf R
 * @since v0.18.0
 * @category Object
 * @typedefn Idx = String | Int | Symbol
 * @sig a -> [Idx] -> {a} -> a
 * @param {*} d The default value.
 * @param {Array} p The path to use.
 * @param {Object} obj The object to retrieve the nested property from.
 * @return {*} The data at `path` of the supplied object or the default value.
 * @example
 *
 *      R.pathOr('N/A', ['a', 'b'], {a: {b: 2}}); //=> 2
 *      R.pathOr('N/A', ['a', 'b'], {c: {b: 2}}); //=> "N/A"
 */

var pathOr =
/*#__PURE__*/
_curry3(function pathOr(d, p, obj) {
  return defaultTo(d, path(p, obj));
});

/**
 * Returns `true` if the specified object property at given path satisfies the
 * given predicate; `false` otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Logic
 * @typedefn Idx = String | Int | Symbol
 * @sig (a -> Boolean) -> [Idx] -> {a} -> Boolean
 * @param {Function} pred
 * @param {Array} propPath
 * @param {*} obj
 * @return {Boolean}
 * @see R.propSatisfies, R.path
 * @example
 *
 *      R.pathSatisfies(y => y > 0, ['x', 'y'], {x: {y: 2}}); //=> true
 *      R.pathSatisfies(R.is(Object), [], {x: {y: 2}}); //=> true
 */

var pathSatisfies =
/*#__PURE__*/
_curry3(function pathSatisfies(pred, propPath, obj) {
  return pred(path(propPath, obj));
});

/**
 * Returns a partial copy of an object containing only the keys specified. If
 * the key does not exist, the property is ignored.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig [k] -> {k: v} -> {k: v}
 * @param {Array} names an array of String property names to copy onto a new object
 * @param {Object} obj The object to copy from
 * @return {Object} A new object with only properties from `names` on it.
 * @see R.omit, R.props
 * @example
 *
 *      R.pick(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, d: 4}
 *      R.pick(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1}
 */

var pick =
/*#__PURE__*/
_curry2(function pick(names, obj) {
  var result = {};
  var idx = 0;

  while (idx < names.length) {
    if (names[idx] in obj) {
      result[names[idx]] = obj[names[idx]];
    }

    idx += 1;
  }

  return result;
});

/**
 * Similar to `pick` except that this one includes a `key: undefined` pair for
 * properties that don't exist.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig [k] -> {k: v} -> {k: v}
 * @param {Array} names an array of String property names to copy onto a new object
 * @param {Object} obj The object to copy from
 * @return {Object} A new object with only properties from `names` on it.
 * @see R.pick
 * @example
 *
 *      R.pickAll(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, d: 4}
 *      R.pickAll(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, e: undefined, f: undefined}
 */

var pickAll =
/*#__PURE__*/
_curry2(function pickAll(names, obj) {
  var result = {};
  var idx = 0;
  var len = names.length;

  while (idx < len) {
    var name = names[idx];
    result[name] = obj[name];
    idx += 1;
  }

  return result;
});

/**
 * Returns a partial copy of an object containing only the keys that satisfy
 * the supplied predicate.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Object
 * @sig ((v, k) -> Boolean) -> {k: v} -> {k: v}
 * @param {Function} pred A predicate to determine whether or not a key
 *        should be included on the output object.
 * @param {Object} obj The object to copy from
 * @return {Object} A new object with only properties that satisfy `pred`
 *         on it.
 * @see R.pick, R.filter
 * @example
 *
 *      const isUpperCase = (val, key) => key.toUpperCase() === key;
 *      R.pickBy(isUpperCase, {a: 1, b: 2, A: 3, B: 4}); //=> {A: 3, B: 4}
 */

var pickBy =
/*#__PURE__*/
_curry2(function pickBy(test, obj) {
  var result = {};

  for (var prop in obj) {
    if (test(obj[prop], prop, obj)) {
      result[prop] = obj[prop];
    }
  }

  return result;
});

/**
 * Returns a new list with the given element at the front, followed by the
 * contents of the list.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig a -> [a] -> [a]
 * @param {*} el The item to add to the head of the output list.
 * @param {Array} list The array to add to the tail of the output list.
 * @return {Array} A new array.
 * @see R.append
 * @example
 *
 *      R.prepend('fee', ['fi', 'fo', 'fum']); //=> ['fee', 'fi', 'fo', 'fum']
 */

var prepend =
/*#__PURE__*/
_curry2(function prepend(el, list) {
  return _concat([el], list);
});

/**
 * Multiplies together all the elements of a list.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Math
 * @sig [Number] -> Number
 * @param {Array} list An array of numbers
 * @return {Number} The product of all the numbers in the list.
 * @see R.reduce
 * @example
 *
 *      R.product([2,4,6,8,100,1]); //=> 38400
 */

var product =
/*#__PURE__*/
reduce(multiply, 1);

/**
 * Accepts a function `fn` and a list of transformer functions and returns a
 * new curried function. When the new function is invoked, it calls the
 * function `fn` with parameters consisting of the result of calling each
 * supplied handler on successive arguments to the new function.
 *
 * If more arguments are passed to the returned function than transformer
 * functions, those arguments are passed directly to `fn` as additional
 * parameters. If you expect additional arguments that don't need to be
 * transformed, although you can ignore them, it's best to pass an identity
 * function so that the new function reports the correct arity.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig ((x1, x2, ...) -> z) -> [(a -> x1), (b -> x2), ...] -> (a -> b -> ... -> z)
 * @param {Function} fn The function to wrap.
 * @param {Array} transformers A list of transformer functions
 * @return {Function} The wrapped function.
 * @see R.converge
 * @example
 *
 *      R.useWith(Math.pow, [R.identity, R.identity])(3, 4); //=> 81
 *      R.useWith(Math.pow, [R.identity, R.identity])(3)(4); //=> 81
 *      R.useWith(Math.pow, [R.dec, R.inc])(3, 4); //=> 32
 *      R.useWith(Math.pow, [R.dec, R.inc])(3)(4); //=> 32
 * @symb R.useWith(f, [g, h])(a, b) = f(g(a), h(b))
 */

var useWith =
/*#__PURE__*/
_curry2(function useWith(fn, transformers) {
  return curryN(transformers.length, function () {
    var args = [];
    var idx = 0;

    while (idx < transformers.length) {
      args.push(transformers[idx].call(this, arguments[idx]));
      idx += 1;
    }

    return fn.apply(this, args.concat(Array.prototype.slice.call(arguments, transformers.length)));
  });
});

/**
 * Reasonable analog to SQL `select` statement.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @category Relation
 * @sig [k] -> [{k: v}] -> [{k: v}]
 * @param {Array} props The property names to project
 * @param {Array} objs The objects to query
 * @return {Array} An array of objects with just the `props` properties.
 * @see R.pluck, R.props, R.prop
 * @example
 *
 *      const abby = {name: 'Abby', age: 7, hair: 'blond', grade: 2};
 *      const fred = {name: 'Fred', age: 12, hair: 'brown', grade: 7};
 *      const kids = [abby, fred];
 *      R.project(['name', 'grade'], kids); //=> [{name: 'Abby', grade: 2}, {name: 'Fred', grade: 7}]
 */

var project =
/*#__PURE__*/
useWith(_map, [pickAll, identity]); // passing `identity` gives correct arity

function _promap(f, g, profunctor) {
  return function (x) {
    return g(profunctor(f(x)));
  };
}

var XPromap =
/*#__PURE__*/
function () {
  function XPromap(f, g, xf) {
    this.xf = xf;
    this.f = f;
    this.g = g;
  }

  XPromap.prototype['@@transducer/init'] = _xfBase.init;
  XPromap.prototype['@@transducer/result'] = _xfBase.result;

  XPromap.prototype['@@transducer/step'] = function (result, input) {
    return this.xf['@@transducer/step'](result, _promap(this.f, this.g, input));
  };

  return XPromap;
}();

var _xpromap =
/*#__PURE__*/
_curry3(function _xpromap(f, g, xf) {
  return new XPromap(f, g, xf);
});

/**
 * Takes two functions as pre- and post- processors respectively for a third function,
 * i.e. `promap(f, g, h)(x) === g(h(f(x)))`.
 *
 * Dispatches to the `promap` method of the third argument, if present,
 * according to the [FantasyLand Profunctor spec](https://github.com/fantasyland/fantasy-land#profunctor).
 *
 * Acts as a transducer if a transformer is given in profunctor position.
 *
 * @func
 * @memberOf R
 * @since v0.28.0
 * @category Function
 * @sig (a -> b) -> (c -> d) -> (b -> c) -> (a -> d)
 * @sig Profunctor p => (a -> b) -> (c -> d) -> p b c -> p a d
 * @param {Function} f The preprocessor function, a -> b
 * @param {Function} g The postprocessor function, c -> d
 * @param {Profunctor} profunctor The profunctor instance to be promapped, e.g. b -> c
 * @return {Profunctor} The new profunctor instance, e.g. a -> d
 * @see R.transduce
 * @example
 *
 *      const decodeChar = R.promap(s => s.charCodeAt(), String.fromCharCode, R.add(-8))
 *      const decodeString = R.promap(R.split(''), R.join(''), R.map(decodeChar))
 *      decodeString("ziuli") //=> "ramda"
 *
 * @symb R.promap(f, g, h) = x => g(h(f(x)))
 * @symb R.promap(f, g, profunctor) = profunctor.promap(f, g)
 */

var promap =
/*#__PURE__*/
_curry3(
/*#__PURE__*/
_dispatchable(['fantasy-land/promap', 'promap'], _xpromap, _promap));

/**
 * Returns `true` if the specified object property is equal, in
 * [`R.equals`](#equals) terms, to the given value; `false` otherwise.
 * You can test multiple properties with [`R.whereEq`](#whereEq).
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig String -> a -> Object -> Boolean
 * @param {String} name
 * @param {*} val
 * @param {*} obj
 * @return {Boolean}
 * @see R.whereEq, R.propSatisfies, R.equals
 * @example
 *
 *      const abby = {name: 'Abby', age: 7, hair: 'blond'};
 *      const fred = {name: 'Fred', age: 12, hair: 'brown'};
 *      const rusty = {name: 'Rusty', age: 10, hair: 'brown'};
 *      const alois = {name: 'Alois', age: 15, disposition: 'surly'};
 *      const kids = [abby, fred, rusty, alois];
 *      const hasBrownHair = R.propEq('hair', 'brown');
 *      R.filter(hasBrownHair, kids); //=> [fred, rusty]
 */

var propEq =
/*#__PURE__*/
_curry3(function propEq(name, val, obj) {
  return equals(val, prop(name, obj));
});

/**
 * Returns `true` if the specified object property is of the given type;
 * `false` otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Type
 * @sig Type -> String -> Object -> Boolean
 * @param {Function} type
 * @param {String} name
 * @param {*} obj
 * @return {Boolean}
 * @see R.is, R.propSatisfies
 * @example
 *
 *      R.propIs(Number, 'x', {x: 1, y: 2});  //=> true
 *      R.propIs(Number, 'x', {x: 'foo'});    //=> false
 *      R.propIs(Number, 'x', {});            //=> false
 */

var propIs =
/*#__PURE__*/
_curry3(function propIs(type, name, obj) {
  return is(type, prop(name, obj));
});

/**
 * Return the specified property of the given non-null object if the property
 * is present and it's value is not `null`, `undefined` or `NaN`.
 *
 * Otherwise the first argument is returned.
 *
 * @func
 * @memberOf R
 * @since v0.6.0
 * @category Object
 * @sig a -> String -> Object -> a
 * @param {*} val The default value.
 * @param {String} p The name of the property to return.
 * @param {Object} obj The object to query.
 * @return {*} The value of given property of the supplied object or the default value.
 * @example
 *
 *      const alice = {
 *        name: 'ALICE',
 *        age: 101
 *      };
 *      const favorite = R.prop('favoriteLibrary');
 *      const favoriteWithDefault = R.propOr('Ramda', 'favoriteLibrary');
 *
 *      favorite(alice);  //=> undefined
 *      favoriteWithDefault(alice);  //=> 'Ramda'
 */

var propOr =
/*#__PURE__*/
_curry3(function propOr(val, p, obj) {
  return defaultTo(val, prop(p, obj));
});

/**
 * Returns `true` if the specified object property satisfies the given
 * predicate; `false` otherwise. You can test multiple properties with
 * [`R.where`](#where).
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Logic
 * @sig (a -> Boolean) -> String -> {String: a} -> Boolean
 * @param {Function} pred
 * @param {String} name
 * @param {*} obj
 * @return {Boolean}
 * @see R.where, R.propEq, R.propIs
 * @example
 *
 *      R.propSatisfies(x => x > 0, 'x', {x: 1, y: 2}); //=> true
 */

var propSatisfies =
/*#__PURE__*/
_curry3(function propSatisfies(pred, name, obj) {
  return pred(prop(name, obj));
});

/**
 * Acts as multiple `prop`: array of keys in, array of values out. Preserves
 * order.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig [k] -> {k: v} -> [v]
 * @param {Array} ps The property names to fetch
 * @param {Object} obj The object to query
 * @return {Array} The corresponding values or partially applied function.
 * @see R.prop, R.pluck, R.project
 * @example
 *
 *      R.props(['x', 'y'], {x: 1, y: 2}); //=> [1, 2]
 *      R.props(['c', 'a', 'b'], {b: 2, a: 1}); //=> [undefined, 1, 2]
 *
 *      const fullName = R.compose(R.join(' '), R.props(['first', 'last']));
 *      fullName({last: 'Bullet-Tooth', age: 33, first: 'Tony'}); //=> 'Tony Bullet-Tooth'
 */

var props =
/*#__PURE__*/
_curry2(function props(ps, obj) {
  return ps.map(function (p) {
    return path([p], obj);
  });
});

/**
 * Returns a list of numbers from `from` (inclusive) to `to` (exclusive).
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Number -> Number -> [Number]
 * @param {Number} from The first number in the list.
 * @param {Number} to One more than the last number in the list.
 * @return {Array} The list of numbers in the set `[a, b)`.
 * @example
 *
 *      R.range(1, 5);    //=> [1, 2, 3, 4]
 *      R.range(50, 53);  //=> [50, 51, 52]
 */

var range =
/*#__PURE__*/
_curry2(function range(from, to) {
  if (!(_isNumber(from) && _isNumber(to))) {
    throw new TypeError('Both arguments to range must be numbers');
  }

  var result = [];
  var n = from;

  while (n < to) {
    result.push(n);
    n += 1;
  }

  return result;
});

/**
 * Returns a single item by iterating through the list, successively calling
 * the iterator function and passing it an accumulator value and the current
 * value from the array, and then passing the result to the next call.
 *
 * Similar to [`reduce`](#reduce), except moves through the input list from the
 * right to the left.
 *
 * The iterator function receives two values: *(value, acc)*, while the arguments'
 * order of `reduce`'s iterator function is *(acc, value)*. `reduceRight` may use [`reduced`](#reduced)
 * to short circuit the iteration.
 *
 * Note: `R.reduceRight` does not skip deleted or unassigned indices (sparse
 * arrays), unlike the native `Array.prototype.reduceRight` method. For more details
 * on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight#Description
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig ((a, b) -> b) -> b -> [a] -> b
 * @param {Function} fn The iterator function. Receives two values, the current element from the array
 *        and the accumulator.
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.reduce, R.addIndex, R.reduced
 * @example
 *
 *      R.reduceRight(R.subtract, 0, [1, 2, 3, 4]) // => (1 - (2 - (3 - (4 - 0)))) = -2
 *      //    -               -2
 *      //   / \              / \
 *      //  1   -            1   3
 *      //     / \              / \
 *      //    2   -     ==>    2  -1
 *      //       / \              / \
 *      //      3   -            3   4
 *      //         / \              / \
 *      //        4   0            4   0
 *
 * @symb R.reduceRight(f, a, [b, c, d]) = f(b, f(c, f(d, a)))
 */

var reduceRight =
/*#__PURE__*/
_curry3(function reduceRight(fn, acc, list) {
  var idx = list.length - 1;

  while (idx >= 0) {
    acc = fn(list[idx], acc);

    if (acc && acc['@@transducer/reduced']) {
      acc = acc['@@transducer/value'];
      break;
    }

    idx -= 1;
  }

  return acc;
});

/**
 * Like [`reduce`](#reduce), `reduceWhile` returns a single item by iterating
 * through the list, successively calling the iterator function. `reduceWhile`
 * also takes a predicate that is evaluated before each step. If the predicate
 * returns `false`, it "short-circuits" the iteration and returns the current
 * value of the accumulator. `reduceWhile` may alternatively be short-circuited
 * via [`reduced`](#reduced).
 *
 * @func
 * @memberOf R
 * @since v0.22.0
 * @category List
 * @sig ((a, b) -> Boolean) -> ((a, b) -> a) -> a -> [b] -> a
 * @param {Function} pred The predicate. It is passed the accumulator and the
 *        current element.
 * @param {Function} fn The iterator function. Receives two values, the
 *        accumulator and the current element.
 * @param {*} a The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.reduce, R.reduced
 * @example
 *
 *      const isOdd = (acc, x) => x % 2 !== 0;
 *      const xs = [1, 3, 5, 60, 777, 800];
 *      R.reduceWhile(isOdd, R.add, 0, xs); //=> 9
 *
 *      const ys = [2, 4, 6]
 *      R.reduceWhile(isOdd, R.add, 111, ys); //=> 111
 */

var reduceWhile =
/*#__PURE__*/
_curryN(4, [], function _reduceWhile(pred, fn, a, list) {
  return _reduce(function (acc, x) {
    return pred(acc, x) ? fn(acc, x) : _reduced(acc);
  }, a, list);
});

/**
 * Returns a value wrapped to indicate that it is the final value of the reduce
 * and transduce functions. The returned value should be considered a black
 * box: the internal structure is not guaranteed to be stable.
 *
 * This optimization is available to the below functions:
 * - [`reduce`](#reduce)
 * - [`reduceWhile`](#reduceWhile)
 * - [`reduceBy`](#reduceBy)
 * - [`reduceRight`](#reduceRight)
 * - [`transduce`](#transduce)
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category List
 * @sig a -> *
 * @param {*} x The final value of the reduce.
 * @return {*} The wrapped value.
 * @see R.reduce, R.reduceWhile, R.reduceBy, R.reduceRight, R.transduce
 * @example
 *
 *     R.reduce(
 *       (acc, item) => item > 3 ? R.reduced(acc) : acc.concat(item),
 *       [],
 *       [1, 2, 3, 4, 5]) // [1, 2, 3]
 */

var reduced =
/*#__PURE__*/
_curry1(_reduced);

/**
 * Calls an input function `n` times, returning an array containing the results
 * of those function calls.
 *
 * `fn` is passed one argument: The current value of `n`, which begins at `0`
 * and is gradually incremented to `n - 1`.
 *
 * @func
 * @memberOf R
 * @since v0.2.3
 * @category List
 * @sig (Number -> a) -> Number -> [a]
 * @param {Function} fn The function to invoke. Passed one argument, the current value of `n`.
 * @param {Number} n A value between `0` and `n - 1`. Increments after each function call.
 * @return {Array} An array containing the return values of all calls to `fn`.
 * @see R.repeat
 * @example
 *
 *      R.times(R.identity, 5); //=> [0, 1, 2, 3, 4]
 * @symb R.times(f, 0) = []
 * @symb R.times(f, 1) = [f(0)]
 * @symb R.times(f, 2) = [f(0), f(1)]
 */

var times =
/*#__PURE__*/
_curry2(function times(fn, n) {
  var len = Number(n);
  var idx = 0;
  var list;

  if (len < 0 || isNaN(len)) {
    throw new RangeError('n must be a non-negative number');
  }

  list = new Array(len);

  while (idx < len) {
    list[idx] = fn(idx);
    idx += 1;
  }

  return list;
});

/**
 * Returns a fixed list of size `n` containing a specified identical value.
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category List
 * @sig a -> n -> [a]
 * @param {*} value The value to repeat.
 * @param {Number} n The desired size of the output list.
 * @return {Array} A new array containing `n` `value`s.
 * @see R.times
 * @example
 *
 *      R.repeat('hi', 5); //=> ['hi', 'hi', 'hi', 'hi', 'hi']
 *
 *      const obj = {};
 *      const repeatedObjs = R.repeat(obj, 5); //=> [{}, {}, {}, {}, {}]
 *      repeatedObjs[0] === repeatedObjs[1]; //=> true
 * @symb R.repeat(a, 0) = []
 * @symb R.repeat(a, 1) = [a]
 * @symb R.repeat(a, 2) = [a, a]
 */

var repeat =
/*#__PURE__*/
_curry2(function repeat(value, n) {
  return times(always(value), n);
});

/**
 * Replace a substring or regex match in a string with a replacement.
 *
 * The first two parameters correspond to the parameters of the
 * `String.prototype.replace()` function, so the second parameter can also be a
 * function.
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category String
 * @sig RegExp|String -> String -> String -> String
 * @param {RegExp|String} pattern A regular expression or a substring to match.
 * @param {String} replacement The string to replace the matches with.
 * @param {String} str The String to do the search and replacement in.
 * @return {String} The result.
 * @example
 *
 *      R.replace('foo', 'bar', 'foo foo foo'); //=> 'bar foo foo'
 *      R.replace(/foo/, 'bar', 'foo foo foo'); //=> 'bar foo foo'
 *
 *      // Use the "g" (global) flag to replace all occurrences:
 *      R.replace(/foo/g, 'bar', 'foo foo foo'); //=> 'bar bar bar'
 */

var replace =
/*#__PURE__*/
_curry3(function replace(regex, replacement, str) {
  return str.replace(regex, replacement);
});

/**
 * Scan is similar to [`reduce`](#reduce), but returns a list of successively
 * reduced values from the left
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category List
 * @sig ((a, b) -> a) -> a -> [b] -> [a]
 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
 *        current element from the array
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {Array} A list of all intermediately reduced values.
 * @see R.reduce, R.mapAccum
 * @example
 *
 *      const numbers = [1, 2, 3, 4];
 *      const factorials = R.scan(R.multiply, 1, numbers); //=> [1, 1, 2, 6, 24]
 * @symb R.scan(f, a, [b, c]) = [a, f(a, b), f(f(a, b), c)]
 */

var scan =
/*#__PURE__*/
_curry3(function scan(fn, acc, list) {
  var idx = 0;
  var len = list.length;
  var result = [acc];

  while (idx < len) {
    acc = fn(acc, list[idx]);
    result[idx + 1] = acc;
    idx += 1;
  }

  return result;
});

/**
 * Transforms a [Traversable](https://github.com/fantasyland/fantasy-land#traversable)
 * of [Applicative](https://github.com/fantasyland/fantasy-land#applicative) into an
 * Applicative of Traversable.
 *
 * Dispatches to the `sequence` method of the second argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig (Applicative f, Traversable t) => (a -> f a) -> t (f a) -> f (t a)
 * @param {Function} of
 * @param {*} traversable
 * @return {*}
 * @see R.traverse
 * @example
 *
 *      R.sequence(Maybe.of, [Just(1), Just(2), Just(3)]);   //=> Just([1, 2, 3])
 *      R.sequence(Maybe.of, [Just(1), Just(2), Nothing()]); //=> Nothing()
 *
 *      R.sequence(R.of, Just([1, 2, 3])); //=> [Just(1), Just(2), Just(3)]
 *      R.sequence(R.of, Nothing());       //=> [Nothing()]
 */

var sequence =
/*#__PURE__*/
_curry2(function sequence(of, traversable) {
  return typeof traversable.sequence === 'function' ? traversable.sequence(of) : reduceRight(function (x, acc) {
    return ap$1(map$1(prepend, x), acc);
  }, of([]), traversable);
});

/**
 * Returns the result of "setting" the portion of the given data structure
 * focused by the given lens to the given value.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig Lens s a -> a -> s -> s
 * @param {Lens} lens
 * @param {*} v
 * @param {*} x
 * @return {*}
 * @see R.view, R.over, R.lens, R.lensIndex, R.lensProp, R.lensPath
 * @example
 *
 *      const xLens = R.lensProp('x');
 *
 *      R.set(xLens, 4, {x: 1, y: 2});  //=> {x: 4, y: 2}
 *      R.set(xLens, 8, {x: 1, y: 2});  //=> {x: 8, y: 2}
 */

var set =
/*#__PURE__*/
_curry3(function set(lens, v, x) {
  return over(lens, always(v), x);
});

/**
 * Returns a copy of the list, sorted according to the comparator function,
 * which should accept two values at a time and return a negative number if the
 * first value is smaller, a positive number if it's larger, and zero if they
 * are equal. Please note that this is a **copy** of the list. It does not
 * modify the original.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig ((a, a) -> Number) -> [a] -> [a]
 * @param {Function} comparator A sorting function :: a -> b -> Int
 * @param {Array} list The list to sort
 * @return {Array} a new array with its elements sorted by the comparator function.
 * @see R.ascend, R.descend
 * @example
 *
 *      const diff = function(a, b) { return a - b; };
 *      R.sort(diff, [4,2,7,5]); //=> [2, 4, 5, 7]
 */

var sort =
/*#__PURE__*/
_curry2(function sort(comparator, list) {
  return Array.prototype.slice.call(list, 0).sort(comparator);
});

/**
 * Sorts the list according to the supplied function.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord b => (a -> b) -> [a] -> [a]
 * @param {Function} fn
 * @param {Array} list The list to sort.
 * @return {Array} A new list sorted by the keys generated by `fn`.
 * @example
 *
 *      const sortByFirstItem = R.sortBy(R.prop(0));
 *      const pairs = [[-1, 1], [-2, 2], [-3, 3]];
 *      sortByFirstItem(pairs); //=> [[-3, 3], [-2, 2], [-1, 1]]
 *
 *      const sortByNameCaseInsensitive = R.sortBy(R.compose(R.toLower, R.prop('name')));
 *      const alice = {
 *        name: 'ALICE',
 *        age: 101
 *      };
 *      const bob = {
 *        name: 'Bob',
 *        age: -10
 *      };
 *      const clara = {
 *        name: 'clara',
 *        age: 314.159
 *      };
 *      const people = [clara, bob, alice];
 *      sortByNameCaseInsensitive(people); //=> [alice, bob, clara]
 */

var sortBy =
/*#__PURE__*/
_curry2(function sortBy(fn, list) {
  return Array.prototype.slice.call(list, 0).sort(function (a, b) {
    var aa = fn(a);
    var bb = fn(b);
    return aa < bb ? -1 : aa > bb ? 1 : 0;
  });
});

/**
 * Sorts a list according to a list of comparators.
 *
 * @func
 * @memberOf R
 * @since v0.23.0
 * @category Relation
 * @sig [(a, a) -> Number] -> [a] -> [a]
 * @param {Array} functions A list of comparator functions.
 * @param {Array} list The list to sort.
 * @return {Array} A new list sorted according to the comarator functions.
 * @see R.ascend, R.descend
 * @example
 *
 *      const alice = {
 *        name: 'alice',
 *        age: 40
 *      };
 *      const bob = {
 *        name: 'bob',
 *        age: 30
 *      };
 *      const clara = {
 *        name: 'clara',
 *        age: 40
 *      };
 *      const people = [clara, bob, alice];
 *      const ageNameSort = R.sortWith([
 *        R.descend(R.prop('age')),
 *        R.ascend(R.prop('name'))
 *      ]);
 *      ageNameSort(people); //=> [alice, clara, bob]
 */

var sortWith =
/*#__PURE__*/
_curry2(function sortWith(fns, list) {
  return Array.prototype.slice.call(list, 0).sort(function (a, b) {
    var result = 0;
    var i = 0;

    while (result === 0 && i < fns.length) {
      result = fns[i](a, b);
      i += 1;
    }

    return result;
  });
});

/**
 * Splits a string into an array of strings based on the given
 * separator.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category String
 * @sig (String | RegExp) -> String -> [String]
 * @param {String|RegExp} sep The pattern.
 * @param {String} str The string to separate into an array.
 * @return {Array} The array of strings from `str` separated by `sep`.
 * @see R.join
 * @example
 *
 *      const pathComponents = R.split('/');
 *      R.tail(pathComponents('/usr/local/bin/node')); //=> ['usr', 'local', 'bin', 'node']
 *
 *      R.split('.', 'a.b.c.xyz.d'); //=> ['a', 'b', 'c', 'xyz', 'd']
 */

var split =
/*#__PURE__*/
invoker(1, 'split');

/**
 * Splits a given list or string at a given index.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig Number -> [a] -> [[a], [a]]
 * @sig Number -> String -> [String, String]
 * @param {Number} index The index where the array/string is split.
 * @param {Array|String} array The array/string to be split.
 * @return {Array}
 * @example
 *
 *      R.splitAt(1, [1, 2, 3]);          //=> [[1], [2, 3]]
 *      R.splitAt(5, 'hello world');      //=> ['hello', ' world']
 *      R.splitAt(-1, 'foobar');          //=> ['fooba', 'r']
 */

var splitAt =
/*#__PURE__*/
_curry2(function splitAt(index, array) {
  return [slice(0, index, array), slice(index, length(array), array)];
});

/**
 * Splits a collection into slices of the specified length.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category List
 * @sig Number -> [a] -> [[a]]
 * @sig Number -> String -> [String]
 * @param {Number} n
 * @param {Array} list
 * @return {Array}
 * @example
 *
 *      R.splitEvery(3, [1, 2, 3, 4, 5, 6, 7]); //=> [[1, 2, 3], [4, 5, 6], [7]]
 *      R.splitEvery(3, 'foobarbaz'); //=> ['foo', 'bar', 'baz']
 */

var splitEvery =
/*#__PURE__*/
_curry2(function splitEvery(n, list) {
  if (n <= 0) {
    throw new Error('First argument to splitEvery must be a positive integer');
  }

  var result = [];
  var idx = 0;

  while (idx < list.length) {
    result.push(slice(idx, idx += n, list));
  }

  return result;
});

/**
 * Takes a list and a predicate and returns a pair of lists with the following properties:
 *
 *  - the result of concatenating the two output lists is equivalent to the input list;
 *  - none of the elements of the first output list satisfies the predicate; and
 *  - if the second output list is non-empty, its first element satisfies the predicate.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> [[a], [a]]
 * @param {Function} pred The predicate that determines where the array is split.
 * @param {Array} list The array to be split.
 * @return {Array}
 * @example
 *
 *      R.splitWhen(R.equals(2), [1, 2, 3, 1, 2, 3]);   //=> [[1], [2, 3, 1, 2, 3]]
 */

var splitWhen =
/*#__PURE__*/
_curry2(function splitWhen(pred, list) {
  var idx = 0;
  var len = list.length;
  var prefix = [];

  while (idx < len && !pred(list[idx])) {
    prefix.push(list[idx]);
    idx += 1;
  }

  return [prefix, Array.prototype.slice.call(list, idx)];
});

/**
 * Splits an array into slices on every occurrence of a value.
 *
 * @func
 * @memberOf R
 * @since v0.26.1
 * @category List
 * @sig (a -> Boolean) -> [a] -> [[a]]
 * @param {Function} pred The predicate that determines where the array is split.
 * @param {Array} list The array to be split.
 * @return {Array}
 * @example
 *
 *      R.splitWhenever(R.equals(2), [1, 2, 3, 2, 4, 5, 2, 6, 7]); //=> [[1], [3], [4, 5], [6, 7]]
 */

var splitWhenever =
/*#__PURE__*/
_curryN(2, [], function splitWhenever(pred, list) {
  var acc = [];
  var curr = [];

  for (var i = 0; i < list.length; i = i + 1) {
    if (!pred(list[i])) {
      curr.push(list[i]);
    }

    if ((i < list.length - 1 && pred(list[i + 1]) || i === list.length - 1) && curr.length > 0) {
      acc.push(curr);
      curr = [];
    }
  }

  return acc;
});

/**
 * Checks if a list starts with the provided sublist.
 *
 * Similarly, checks if a string starts with the provided substring.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category List
 * @sig [a] -> [a] -> Boolean
 * @sig String -> String -> Boolean
 * @param {*} prefix
 * @param {*} list
 * @return {Boolean}
 * @see R.endsWith
 * @example
 *
 *      R.startsWith('a', 'abc')                //=> true
 *      R.startsWith('b', 'abc')                //=> false
 *      R.startsWith(['a'], ['a', 'b', 'c'])    //=> true
 *      R.startsWith(['b'], ['a', 'b', 'c'])    //=> false
 */

var startsWith =
/*#__PURE__*/
_curry2(function (prefix, list) {
  return equals(take(prefix.length, list), prefix);
});

/**
 * Subtracts its second argument from its first argument.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Math
 * @sig Number -> Number -> Number
 * @param {Number} a The first value.
 * @param {Number} b The second value.
 * @return {Number} The result of `a - b`.
 * @see R.add
 * @example
 *
 *      R.subtract(10, 8); //=> 2
 *
 *      const minus5 = R.subtract(R.__, 5);
 *      minus5(17); //=> 12
 *
 *      const complementaryAngle = R.subtract(90);
 *      complementaryAngle(30); //=> 60
 *      complementaryAngle(72); //=> 18
 */

var subtract =
/*#__PURE__*/
_curry2(function subtract(a, b) {
  return Number(a) - Number(b);
});

/**
 * Finds the set (i.e. no duplicates) of all elements contained in the first or
 * second list, but not both.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Relation
 * @sig [*] -> [*] -> [*]
 * @param {Array} list1 The first list.
 * @param {Array} list2 The second list.
 * @return {Array} The elements in `list1` or `list2`, but not both.
 * @see R.symmetricDifferenceWith, R.difference, R.differenceWith
 * @example
 *
 *      R.symmetricDifference([1,2,3,4], [7,6,5,4,3]); //=> [1,2,7,6,5]
 *      R.symmetricDifference([7,6,5,4,3], [1,2,3,4]); //=> [7,6,5,1,2]
 */

var symmetricDifference =
/*#__PURE__*/
_curry2(function symmetricDifference(list1, list2) {
  return concat(difference(list1, list2), difference(list2, list1));
});

/**
 * Finds the set (i.e. no duplicates) of all elements contained in the first or
 * second list, but not both. Duplication is determined according to the value
 * returned by applying the supplied predicate to two list elements.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Relation
 * @sig ((a, a) -> Boolean) -> [a] -> [a] -> [a]
 * @param {Function} pred A predicate used to test whether two items are equal.
 * @param {Array} list1 The first list.
 * @param {Array} list2 The second list.
 * @return {Array} The elements in `list1` or `list2`, but not both.
 * @see R.symmetricDifference, R.difference, R.differenceWith
 * @example
 *
 *      const eqA = R.eqBy(R.prop('a'));
 *      const l1 = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];
 *      const l2 = [{a: 3}, {a: 4}, {a: 5}, {a: 6}];
 *      R.symmetricDifferenceWith(eqA, l1, l2); //=> [{a: 1}, {a: 2}, {a: 5}, {a: 6}]
 */

var symmetricDifferenceWith =
/*#__PURE__*/
_curry3(function symmetricDifferenceWith(pred, list1, list2) {
  return concat(differenceWith(pred, list1, list2), differenceWith(pred, list2, list1));
});

/**
 * Returns a new list containing the last `n` elements of a given list, passing
 * each value to the supplied predicate function, and terminating when the
 * predicate function returns `false`. Excludes the element that caused the
 * predicate function to fail. The predicate function is passed one argument:
 * *(value)*.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> [a]
 * @sig (a -> Boolean) -> String -> String
 * @param {Function} fn The function called per iteration.
 * @param {Array} xs The collection to iterate over.
 * @return {Array} A new array.
 * @see R.dropLastWhile, R.addIndex
 * @example
 *
 *      const isNotOne = x => x !== 1;
 *
 *      R.takeLastWhile(isNotOne, [1, 2, 3, 4]); //=> [2, 3, 4]
 *
 *      R.takeLastWhile(x => x !== 'R' , 'Ramda'); //=> 'amda'
 */

var takeLastWhile =
/*#__PURE__*/
_curry2(function takeLastWhile(fn, xs) {
  var idx = xs.length - 1;

  while (idx >= 0 && fn(xs[idx])) {
    idx -= 1;
  }

  return slice(idx + 1, Infinity, xs);
});

var XTakeWhile =
/*#__PURE__*/
function () {
  function XTakeWhile(f, xf) {
    this.xf = xf;
    this.f = f;
  }

  XTakeWhile.prototype['@@transducer/init'] = _xfBase.init;
  XTakeWhile.prototype['@@transducer/result'] = _xfBase.result;

  XTakeWhile.prototype['@@transducer/step'] = function (result, input) {
    return this.f(input) ? this.xf['@@transducer/step'](result, input) : _reduced(result);
  };

  return XTakeWhile;
}();

var _xtakeWhile =
/*#__PURE__*/
_curry2(function _xtakeWhile(f, xf) {
  return new XTakeWhile(f, xf);
});

/**
 * Returns a new list containing the first `n` elements of a given list,
 * passing each value to the supplied predicate function, and terminating when
 * the predicate function returns `false`. Excludes the element that caused the
 * predicate function to fail. The predicate function is passed one argument:
 * *(value)*.
 *
 * Dispatches to the `takeWhile` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> [a]
 * @sig (a -> Boolean) -> String -> String
 * @param {Function} fn The function called per iteration.
 * @param {Array} xs The collection to iterate over.
 * @return {Array} A new array.
 * @see R.dropWhile, R.transduce, R.addIndex
 * @example
 *
 *      const isNotFour = x => x !== 4;
 *
 *      R.takeWhile(isNotFour, [1, 2, 3, 4, 3, 2, 1]); //=> [1, 2, 3]
 *
 *      R.takeWhile(x => x !== 'd' , 'Ramda'); //=> 'Ram'
 */

var takeWhile =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['takeWhile'], _xtakeWhile, function takeWhile(fn, xs) {
  var idx = 0;
  var len = xs.length;

  while (idx < len && fn(xs[idx])) {
    idx += 1;
  }

  return slice(0, idx, xs);
}));

var XTap =
/*#__PURE__*/
function () {
  function XTap(f, xf) {
    this.xf = xf;
    this.f = f;
  }

  XTap.prototype['@@transducer/init'] = _xfBase.init;
  XTap.prototype['@@transducer/result'] = _xfBase.result;

  XTap.prototype['@@transducer/step'] = function (result, input) {
    this.f(input);
    return this.xf['@@transducer/step'](result, input);
  };

  return XTap;
}();

var _xtap =
/*#__PURE__*/
_curry2(function _xtap(f, xf) {
  return new XTap(f, xf);
});

/**
 * Runs the given function with the supplied object, then returns the object.
 *
 * Acts as a transducer if a transformer is given as second parameter.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (a -> *) -> a -> a
 * @param {Function} fn The function to call with `x`. The return value of `fn` will be thrown away.
 * @param {*} x
 * @return {*} `x`.
 * @example
 *
 *      const sayX = x => console.log('x is ' + x);
 *      R.tap(sayX, 100); //=> 100
 *      // logs 'x is 100'
 * @symb R.tap(f, a) = a
 */

var tap =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xtap, function tap(fn, x) {
  fn(x);
  return x;
}));

function _isRegExp(x) {
  return Object.prototype.toString.call(x) === '[object RegExp]';
}

/**
 * Determines whether a given string matches a given regular expression.
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category String
 * @sig RegExp -> String -> Boolean
 * @param {RegExp} pattern
 * @param {String} str
 * @return {Boolean}
 * @see R.match
 * @example
 *
 *      R.test(/^x/, 'xyz'); //=> true
 *      R.test(/^y/, 'xyz'); //=> false
 */

var test =
/*#__PURE__*/
_curry2(function test(pattern, str) {
  if (!_isRegExp(pattern)) {
    throw new TypeError('‘test’ requires a value of type RegExp as its first argument; received ' + toString(pattern));
  }

  return _cloneRegExp(pattern).test(str);
});

/**
 * Returns the result of applying the onSuccess function to the value inside
 * a successfully resolved promise. This is useful for working with promises
 * inside function compositions.
 *
 * @func
 * @memberOf R
 * @since v0.27.1
 * @category Function
 * @sig (a -> b) -> (Promise e a) -> (Promise e b)
 * @sig (a -> (Promise e b)) -> (Promise e a) -> (Promise e b)
 * @param {Function} onSuccess The function to apply. Can return a value or a promise of a value.
 * @param {Promise} p
 * @return {Promise} The result of calling `p.then(onSuccess)`
 * @see R.otherwise
 * @example
 *
 *      const makeQuery = email => ({ query: { email }});
 *      const fetchMember = request =>
 *        Promise.resolve({ firstName: 'Bob', lastName: 'Loblaw', id: 42 });
 *
 *      //getMemberName :: String -> Promise ({ firstName, lastName })
 *      const getMemberName = R.pipe(
 *        makeQuery,
 *        fetchMember,
 *        R.andThen(R.pick(['firstName', 'lastName']))
 *      );
 *
 *      getMemberName('bob@gmail.com').then(console.log);
 */

var andThen =
/*#__PURE__*/
_curry2(function andThen(f, p) {
  _assertPromise('andThen', p);

  return p.then(f);
});

/**
 * The lower case version of a string.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category String
 * @sig String -> String
 * @param {String} str The string to lower case.
 * @return {String} The lower case version of `str`.
 * @see R.toUpper
 * @example
 *
 *      R.toLower('XYZ'); //=> 'xyz'
 */

var toLower =
/*#__PURE__*/
invoker(0, 'toLowerCase');

/**
 * Converts an object into an array of key, value arrays. Only the object's
 * own properties are used.
 * Note that the order of the output array is not guaranteed to be consistent
 * across different JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.4.0
 * @category Object
 * @sig {String: *} -> [[String,*]]
 * @param {Object} obj The object to extract from
 * @return {Array} An array of key, value arrays from the object's own properties.
 * @see R.fromPairs, R.keys, R.values
 * @example
 *
 *      R.toPairs({a: 1, b: 2, c: 3}); //=> [['a', 1], ['b', 2], ['c', 3]]
 */

var toPairs =
/*#__PURE__*/
_curry1(function toPairs(obj) {
  var pairs = [];

  for (var prop in obj) {
    if (_has(prop, obj)) {
      pairs[pairs.length] = [prop, obj[prop]];
    }
  }

  return pairs;
});

/**
 * Converts an object into an array of key, value arrays. The object's own
 * properties and prototype properties are used. Note that the order of the
 * output array is not guaranteed to be consistent across different JS
 * platforms.
 *
 * @func
 * @memberOf R
 * @since v0.4.0
 * @category Object
 * @sig {String: *} -> [[String,*]]
 * @param {Object} obj The object to extract from
 * @return {Array} An array of key, value arrays from the object's own
 *         and prototype properties.
 * @example
 *
 *      const F = function() { this.x = 'X'; };
 *      F.prototype.y = 'Y';
 *      const f = new F();
 *      R.toPairsIn(f); //=> [['x','X'], ['y','Y']]
 */

var toPairsIn =
/*#__PURE__*/
_curry1(function toPairsIn(obj) {
  var pairs = [];

  for (var prop in obj) {
    pairs[pairs.length] = [prop, obj[prop]];
  }

  return pairs;
});

/**
 * The upper case version of a string.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category String
 * @sig String -> String
 * @param {String} str The string to upper case.
 * @return {String} The upper case version of `str`.
 * @see R.toLower
 * @example
 *
 *      R.toUpper('abc'); //=> 'ABC'
 */

var toUpper =
/*#__PURE__*/
invoker(0, 'toUpperCase');

/**
 * Initializes a transducer using supplied iterator function. Returns a single
 * item by iterating through the list, successively calling the transformed
 * iterator function and passing it an accumulator value and the current value
 * from the array, and then passing the result to the next call.
 *
 * The iterator function receives two values: *(acc, value)*. It will be
 * wrapped as a transformer to initialize the transducer. A transformer can be
 * passed directly in place of an iterator function. In both cases, iteration
 * may be stopped early with the [`R.reduced`](#reduced) function.
 *
 * A transducer is a function that accepts a transformer and returns a
 * transformer and can be composed directly.
 *
 * A transformer is an object that provides a 2-arity reducing iterator
 * function, step, 0-arity initial value function, init, and 1-arity result
 * extraction function, result. The step function is used as the iterator
 * function in reduce. The result function is used to convert the final
 * accumulator into the return type and in most cases is
 * [`R.identity`](#identity). The init function can be used to provide an
 * initial accumulator, but is ignored by transduce.
 *
 * The iteration is performed with [`R.reduce`](#reduce) after initializing the transducer.
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category List
 * @sig (c -> c) -> ((a, b) -> a) -> a -> [b] -> a
 * @param {Function} xf The transducer function. Receives a transformer and returns a transformer.
 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
 *        current element from the array. Wrapped as transformer, if necessary, and used to
 *        initialize the transducer
 * @param {*} acc The initial accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.reduce, R.reduced, R.into
 * @example
 *
 *      const numbers = [1, 2, 3, 4];
 *      const transducer = R.compose(R.map(R.add(1)), R.take(2));
 *      R.transduce(transducer, R.flip(R.append), [], numbers); //=> [2, 3]
 *
 *      const isOdd = (x) => x % 2 !== 0;
 *      const firstOddTransducer = R.compose(R.filter(isOdd), R.take(1));
 *      R.transduce(firstOddTransducer, R.flip(R.append), [], R.range(0, 100)); //=> [1]
 */

var transduce =
/*#__PURE__*/
curryN(4, function transduce(xf, fn, acc, list) {
  return _reduce(xf(typeof fn === 'function' ? _xwrap(fn) : fn), acc, list);
});

/**
 * Transposes the rows and columns of a 2D list.
 * When passed a list of `n` lists of length `x`,
 * returns a list of `x` lists of length `n`.
 *
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig [[a]] -> [[a]]
 * @param {Array} list A 2D list
 * @return {Array} A 2D list
 * @example
 *
 *      R.transpose([[1, 'a'], [2, 'b'], [3, 'c']]) //=> [[1, 2, 3], ['a', 'b', 'c']]
 *      R.transpose([[1, 2, 3], ['a', 'b', 'c']]) //=> [[1, 'a'], [2, 'b'], [3, 'c']]
 *
 *      // If some of the rows are shorter than the following rows, their elements are skipped:
 *      R.transpose([[10, 11], [20], [], [30, 31, 32]]) //=> [[10, 20, 30], [11, 31], [32]]
 * @symb R.transpose([[a], [b], [c]]) = [a, b, c]
 * @symb R.transpose([[a, b], [c, d]]) = [[a, c], [b, d]]
 * @symb R.transpose([[a, b], [c]]) = [[a, c], [b]]
 */

var transpose =
/*#__PURE__*/
_curry1(function transpose(outerlist) {
  var i = 0;
  var result = [];

  while (i < outerlist.length) {
    var innerlist = outerlist[i];
    var j = 0;

    while (j < innerlist.length) {
      if (typeof result[j] === 'undefined') {
        result[j] = [];
      }

      result[j].push(innerlist[j]);
      j += 1;
    }

    i += 1;
  }

  return result;
});

/**
 * Maps an [Applicative](https://github.com/fantasyland/fantasy-land#applicative)-returning
 * function over a [Traversable](https://github.com/fantasyland/fantasy-land#traversable),
 * then uses [`sequence`](#sequence) to transform the resulting Traversable of Applicative
 * into an Applicative of Traversable.
 *
 * Dispatches to the `traverse` method of the third argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig (Applicative f, Traversable t) => (a -> f a) -> (a -> f b) -> t a -> f (t b)
 * @param {Function} of
 * @param {Function} f
 * @param {*} traversable
 * @return {*}
 * @see R.sequence
 * @example
 *
 *      // Returns `Maybe.Nothing` if the given divisor is `0`
 *      const safeDiv = n => d => d === 0 ? Maybe.Nothing() : Maybe.Just(n / d)
 *
 *      R.traverse(Maybe.of, safeDiv(10), [2, 4, 5]); //=> Maybe.Just([5, 2.5, 2])
 *      R.traverse(Maybe.of, safeDiv(10), [2, 0, 5]); //=> Maybe.Nothing
 */

var traverse =
/*#__PURE__*/
_curry3(function traverse(of, f, traversable) {
  return typeof traversable['fantasy-land/traverse'] === 'function' ? traversable['fantasy-land/traverse'](f, of) : typeof traversable.traverse === 'function' ? traversable.traverse(f, of) : sequence(of, map$1(f, traversable));
});

var ws = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u2000\u2001\u2002\u2003' + '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' + '\u2029\uFEFF';
var zeroWidth = '\u200b';
var hasProtoTrim = typeof String.prototype.trim === 'function';
/**
 * Removes (strips) whitespace from both ends of the string.
 *
 * @func
 * @memberOf R
 * @since v0.6.0
 * @category String
 * @sig String -> String
 * @param {String} str The string to trim.
 * @return {String} Trimmed version of `str`.
 * @example
 *
 *      R.trim('   xyz  '); //=> 'xyz'
 *      R.map(R.trim, R.split(',', 'x, y, z')); //=> ['x', 'y', 'z']
 */

var trim = !hasProtoTrim ||
/*#__PURE__*/
ws.trim() || !
/*#__PURE__*/
zeroWidth.trim() ?
/*#__PURE__*/
_curry1(function trim(str) {
  var beginRx = new RegExp('^[' + ws + '][' + ws + ']*');
  var endRx = new RegExp('[' + ws + '][' + ws + ']*$');
  return str.replace(beginRx, '').replace(endRx, '');
}) :
/*#__PURE__*/
_curry1(function trim(str) {
  return str.trim();
});

/**
 * `tryCatch` takes two functions, a `tryer` and a `catcher`. The returned
 * function evaluates the `tryer`; if it does not throw, it simply returns the
 * result. If the `tryer` *does* throw, the returned function evaluates the
 * `catcher` function and returns its result. Note that for effective
 * composition with this function, both the `tryer` and `catcher` functions
 * must return the same type of results.
 *
 * @func
 * @memberOf R
 * @since v0.20.0
 * @category Function
 * @sig (...x -> a) -> ((e, ...x) -> a) -> (...x -> a)
 * @param {Function} tryer The function that may throw.
 * @param {Function} catcher The function that will be evaluated if `tryer` throws.
 * @return {Function} A new function that will catch exceptions and send them to the catcher.
 * @example
 *
 *      R.tryCatch(R.prop('x'), R.F)({x: true}); //=> true
 *      R.tryCatch(() => { throw 'foo'}, R.always('caught'))('bar') // =>
 *      'caught'
 *      R.tryCatch(R.times(R.identity), R.always([]))('s') // => []
 *      R.tryCatch(() => { throw 'this is not a valid value'}, (err, value)=>({error : err,  value }))('bar') // => {'error': 'this is not a valid value', 'value': 'bar'}
 */

var tryCatch =
/*#__PURE__*/
_curry2(function _tryCatch(tryer, catcher) {
  return _arity(tryer.length, function () {
    try {
      return tryer.apply(this, arguments);
    } catch (e) {
      return catcher.apply(this, _concat([e], arguments));
    }
  });
});

/**
 * Takes a function `fn`, which takes a single array argument, and returns a
 * function which:
 *
 *   - takes any number of positional arguments;
 *   - passes these arguments to `fn` as an array; and
 *   - returns the result.
 *
 * In other words, `R.unapply` derives a variadic function from a function which
 * takes an array. `R.unapply` is the inverse of [`R.apply`](#apply).
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Function
 * @sig ([*...] -> a) -> (*... -> a)
 * @param {Function} fn
 * @return {Function}
 * @see R.apply
 * @example
 *
 *      R.unapply(JSON.stringify)(1, 2, 3); //=> '[1,2,3]'
 * @symb R.unapply(f)(a, b) = f([a, b])
 */

var unapply =
/*#__PURE__*/
_curry1(function unapply(fn) {
  return function () {
    return fn(Array.prototype.slice.call(arguments, 0));
  };
});

/**
 * Wraps a function of any arity (including nullary) in a function that accepts
 * exactly 1 parameter. Any extraneous parameters will not be passed to the
 * supplied function.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category Function
 * @sig (a -> b -> c -> ... -> z) -> (a -> z)
 * @param {Function} fn The function to wrap.
 * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
 *         arity 1.
 * @see R.binary, R.nAry
 * @example
 *
 *      const takesTwoArgs = function(a, b) {
 *        return [a, b];
 *      };
 *      takesTwoArgs.length; //=> 2
 *      takesTwoArgs(1, 2); //=> [1, 2]
 *
 *      const takesOneArg = R.unary(takesTwoArgs);
 *      takesOneArg.length; //=> 1
 *      // Only 1 argument is passed to the wrapped function
 *      takesOneArg(1, 2); //=> [1, undefined]
 * @symb R.unary(f)(a, b, c) = f(a)
 */

var unary =
/*#__PURE__*/
_curry1(function unary(fn) {
  return nAry(1, fn);
});

/**
 * Returns a function of arity `n` from a (manually) curried function.
 * Note that, the returned function is actually a ramda style
 * curryied function, which can accept one or more arguments in each
 * function calling.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category Function
 * @sig Number -> (a -> b -> c ... -> z) -> ((a -> b -> c ...) -> z)
 * @param {Number} length The arity for the returned function.
 * @param {Function} fn The function to uncurry.
 * @return {Function} A new function.
 * @see R.curry, R.curryN
 * @example
 *
 *      const addFour = a => b => c => d => a + b + c + d;
 *
 *      const uncurriedAddFour = R.uncurryN(4, addFour);
 *      uncurriedAddFour(1, 2, 3, 4); //=> 10
 */

var uncurryN =
/*#__PURE__*/
_curry2(function uncurryN(depth, fn) {
  return curryN(depth, function () {
    var currentDepth = 1;
    var value = fn;
    var idx = 0;
    var endIdx;

    while (currentDepth <= depth && typeof value === 'function') {
      endIdx = currentDepth === depth ? arguments.length : idx + value.length;
      value = value.apply(this, Array.prototype.slice.call(arguments, idx, endIdx));
      currentDepth += 1;
      idx = endIdx;
    }

    return value;
  });
});

/**
 * Builds a list from a seed value. Accepts an iterator function, which returns
 * either false to stop iteration or an array of length 2 containing the value
 * to add to the resulting list and the seed to be used in the next call to the
 * iterator function.
 *
 * The iterator function receives one argument: *(seed)*.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category List
 * @sig (a -> [b]) -> * -> [b]
 * @param {Function} fn The iterator function. receives one argument, `seed`, and returns
 *        either false to quit iteration or an array of length two to proceed. The element
 *        at index 0 of this array will be added to the resulting array, and the element
 *        at index 1 will be passed to the next call to `fn`.
 * @param {*} seed The seed value.
 * @return {Array} The final list.
 * @example
 *
 *      const f = n => n > 50 ? false : [-n, n + 10];
 *      R.unfold(f, 10); //=> [-10, -20, -30, -40, -50]
 * @symb R.unfold(f, x) = [f(x)[0], f(f(x)[1])[0], f(f(f(x)[1])[1])[0], ...]
 */

var unfold =
/*#__PURE__*/
_curry2(function unfold(fn, seed) {
  var pair = fn(seed);
  var result = [];

  while (pair && pair.length) {
    result[result.length] = pair[0];
    pair = fn(pair[1]);
  }

  return result;
});

/**
 * Combines two lists into a set (i.e. no duplicates) composed of the elements
 * of each list.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig [*] -> [*] -> [*]
 * @param {Array} as The first list.
 * @param {Array} bs The second list.
 * @return {Array} The first and second lists concatenated, with
 *         duplicates removed.
 * @example
 *
 *      R.union([1, 2, 3], [2, 3, 4]); //=> [1, 2, 3, 4]
 */

var union =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
compose(uniq, _concat));

var XUniqWith =
/*#__PURE__*/
function () {
  function XUniqWith(pred, xf) {
    this.xf = xf;
    this.pred = pred;
    this.items = [];
  }

  XUniqWith.prototype['@@transducer/init'] = _xfBase.init;
  XUniqWith.prototype['@@transducer/result'] = _xfBase.result;

  XUniqWith.prototype['@@transducer/step'] = function (result, input) {
    if (_includesWith(this.pred, input, this.items)) {
      return result;
    } else {
      this.items.push(input);
      return this.xf['@@transducer/step'](result, input);
    }
  };

  return XUniqWith;
}();

var _xuniqWith =
/*#__PURE__*/
_curry2(function _xuniqWith(pred, xf) {
  return new XUniqWith(pred, xf);
});

/**
 * Returns a new list containing only one copy of each element in the original
 * list, based upon the value returned by applying the supplied predicate to
 * two list elements. Prefers the first item if two items compare equal based
 * on the predicate.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category List
 * @sig ((a, a) -> Boolean) -> [a] -> [a]
 * @param {Function} pred A predicate used to test whether two items are equal.
 * @param {Array} list The array to consider.
 * @return {Array} The list of unique items.
 * @example
 *
 *      const strEq = R.eqBy(String);
 *      R.uniqWith(strEq)([1, '1', 2, 1]); //=> [1, 2]
 *      R.uniqWith(strEq)([{}, {}]);       //=> [{}]
 *      R.uniqWith(strEq)([1, '1', 1]);    //=> [1]
 *      R.uniqWith(strEq)(['1', 1, 1]);    //=> ['1']
 */

var uniqWith =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xuniqWith, function (pred, list) {
  var idx = 0;
  var len = list.length;
  var result = [];
  var item;

  while (idx < len) {
    item = list[idx];

    if (!_includesWith(pred, item, result)) {
      result[result.length] = item;
    }

    idx += 1;
  }

  return result;
}));

/**
 * Combines two lists into a set (i.e. no duplicates) composed of the elements
 * of each list. Duplication is determined according to the value returned by
 * applying the supplied predicate to two list elements. If an element exists
 * in both lists, the first element from the first list will be used.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig ((a, a) -> Boolean) -> [*] -> [*] -> [*]
 * @param {Function} pred A predicate used to test whether two items are equal.
 * @param {Array} list1 The first list.
 * @param {Array} list2 The second list.
 * @return {Array} The first and second lists concatenated, with
 *         duplicates removed.
 * @see R.union
 * @example
 *
 *      const l1 = [{a: 1}, {a: 2}];
 *      const l2 = [{a: 1}, {a: 4}];
 *      R.unionWith(R.eqBy(R.prop('a')), l1, l2); //=> [{a: 1}, {a: 2}, {a: 4}]
 */

var unionWith =
/*#__PURE__*/
_curry3(function unionWith(pred, list1, list2) {
  return uniqWith(pred, _concat(list1, list2));
});

/**
 * Tests the final argument by passing it to the given predicate function. If
 * the predicate is not satisfied, the function will return the result of
 * calling the `whenFalseFn` function with the same argument. If the predicate
 * is satisfied, the argument is returned as is.
 *
 * @func
 * @memberOf R
 * @since v0.18.0
 * @category Logic
 * @sig (a -> Boolean) -> (a -> b) -> a -> a | b
 * @param {Function} pred        A predicate function
 * @param {Function} whenFalseFn A function to invoke when the `pred` evaluates
 *                               to a falsy value.
 * @param {*}        x           An object to test with the `pred` function and
 *                               pass to `whenFalseFn` if necessary.
 * @return {*} Either `x` or the result of applying `x` to `whenFalseFn`.
 * @see R.ifElse, R.when, R.cond
 * @example
 *
 *      let safeInc = R.unless(R.isNil, R.inc);
 *      safeInc(null); //=> null
 *      safeInc(1); //=> 2
 */

var unless =
/*#__PURE__*/
_curry3(function unless(pred, whenFalseFn, x) {
  return pred(x) ? x : whenFalseFn(x);
});

/**
 * Shorthand for `R.chain(R.identity)`, which removes one level of nesting from
 * any [Chain](https://github.com/fantasyland/fantasy-land#chain).
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category List
 * @sig Chain c => c (c a) -> c a
 * @param {*} list
 * @return {*}
 * @see R.flatten, R.chain
 * @example
 *
 *      R.unnest([1, [2], [[3]]]); //=> [1, 2, [3]]
 *      R.unnest([[1, 2], [3, 4], [5, 6]]); //=> [1, 2, 3, 4, 5, 6]
 */

var unnest =
/*#__PURE__*/
chain$1(_identity);

/**
 * Takes a predicate, a transformation function, and an initial value,
 * and returns a value of the same type as the initial value.
 * It does so by applying the transformation until the predicate is satisfied,
 * at which point it returns the satisfactory value.
 *
 * @func
 * @memberOf R
 * @since v0.20.0
 * @category Logic
 * @sig (a -> Boolean) -> (a -> a) -> a -> a
 * @param {Function} pred A predicate function
 * @param {Function} fn The iterator function
 * @param {*} init Initial value
 * @return {*} Final value that satisfies predicate
 * @example
 *
 *      R.until(R.gt(R.__, 100), R.multiply(2))(1) // => 128
 */

var until =
/*#__PURE__*/
_curry3(function until(pred, fn, init) {
  var val = init;

  while (!pred(val)) {
    val = fn(val);
  }

  return val;
});

/**
 *
 * Deconstructs an array field from the input documents to output a document for each element.
 * Each output document is the input document with the value of the array field replaced by the element.
 *
 * @func
 * @memberOf R
 * @since v0.28.0
 * @category Object
 * @sig String -> {k: [v]} -> [{k: v}]
 * @param {String} key The key to determine which property of the object should be unwind
 * @param {Object} object The object containing list under property named as key which is to unwind
 * @return {List} A new list of object containing the value of input key having list replaced by each element in the object.
 * @example
 *
 * R.unwind('hobbies', {
 *   name: 'alice',
 *   hobbies: ['Golf', 'Hacking'],
 *   colors: ['red', 'green'],
 * });
 * // [
 * //   { name: 'alice', hobbies: 'Golf', colors: ['red', 'green'] },
 * //   { name: 'alice', hobbies: 'Hacking', colors: ['red', 'green'] }
 * // ]
 */

var unwind =
/*#__PURE__*/
_curry2(function (key, object) {
  // If key is not in object or key is not as a list in object
  if (!(key in object && _isArray(object[key]))) {
    return [object];
  } // Map over object[key] which is a list and assoc each element with key


  return _map(function (item) {
    return _assoc(key, item, object);
  }, object[key]);
});

/**
 * Returns a list of all the properties, including prototype properties, of the
 * supplied object.
 * Note that the order of the output array is not guaranteed to be consistent
 * across different JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category Object
 * @sig {k: v} -> [v]
 * @param {Object} obj The object to extract values from
 * @return {Array} An array of the values of the object's own and prototype properties.
 * @see R.values, R.keysIn
 * @example
 *
 *      const F = function() { this.x = 'X'; };
 *      F.prototype.y = 'Y';
 *      const f = new F();
 *      R.valuesIn(f); //=> ['X', 'Y']
 */

var valuesIn =
/*#__PURE__*/
_curry1(function valuesIn(obj) {
  var prop;
  var vs = [];

  for (prop in obj) {
    vs[vs.length] = obj[prop];
  }

  return vs;
});

var Const = function (x) {
  return {
    value: x,
    'fantasy-land/map': function () {
      return this;
    }
  };
};
/**
 * Returns a "view" of the given data structure, determined by the given lens.
 * The lens's focus determines which portion of the data structure is visible.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig Lens s a -> s -> a
 * @param {Lens} lens
 * @param {*} x
 * @return {*}
 * @see R.set, R.over, R.lens, R.lensIndex, R.lensProp, R.lensPath
 * @example
 *
 *      const xLens = R.lensProp('x');
 *
 *      R.view(xLens, {x: 1, y: 2});  //=> 1
 *      R.view(xLens, {x: 4, y: 2});  //=> 4
 */


var view =
/*#__PURE__*/
_curry2(function view(lens, x) {
  // Using `Const` effectively ignores the setter function of the `lens`,
  // leaving the value returned by the getter function unmodified.
  return lens(Const)(x).value;
});

/**
 * Tests the final argument by passing it to the given predicate function. If
 * the predicate is satisfied, the function will return the result of calling
 * the `whenTrueFn` function with the same argument. If the predicate is not
 * satisfied, the argument is returned as is.
 *
 * @func
 * @memberOf R
 * @since v0.18.0
 * @category Logic
 * @sig (a -> Boolean) -> (a -> b) -> a -> a | b
 * @param {Function} pred       A predicate function
 * @param {Function} whenTrueFn A function to invoke when the `condition`
 *                              evaluates to a truthy value.
 * @param {*}        x          An object to test with the `pred` function and
 *                              pass to `whenTrueFn` if necessary.
 * @return {*} Either `x` or the result of applying `x` to `whenTrueFn`.
 * @see R.ifElse, R.unless, R.cond
 * @example
 *
 *      // truncate :: String -> String
 *      const truncate = R.when(
 *        R.propSatisfies(R.gt(R.__, 10), 'length'),
 *        R.pipe(R.take(10), R.append('…'), R.join(''))
 *      );
 *      truncate('12345');         //=> '12345'
 *      truncate('0123456789ABC'); //=> '0123456789…'
 */

var when =
/*#__PURE__*/
_curry3(function when(pred, whenTrueFn, x) {
  return pred(x) ? whenTrueFn(x) : x;
});

/**
 * Takes a spec object and a test object; returns true if the test satisfies
 * the spec. Each of the spec's own properties must be a predicate function.
 * Each predicate is applied to the value of the corresponding property of the
 * test object. `where` returns true if all the predicates return true, false
 * otherwise.
 *
 * `where` is well suited to declaratively expressing constraints for other
 * functions such as [`filter`](#filter) and [`find`](#find).
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category Object
 * @sig {String: (* -> Boolean)} -> {String: *} -> Boolean
 * @param {Object} spec
 * @param {Object} testObj
 * @return {Boolean}
 * @see R.propSatisfies, R.whereEq
 * @example
 *
 *      // pred :: Object -> Boolean
 *      const pred = R.where({
 *        a: R.equals('foo'),
 *        b: R.complement(R.equals('bar')),
 *        x: R.gt(R.__, 10),
 *        y: R.lt(R.__, 20)
 *      });
 *
 *      pred({a: 'foo', b: 'xxx', x: 11, y: 19}); //=> true
 *      pred({a: 'xxx', b: 'xxx', x: 11, y: 19}); //=> false
 *      pred({a: 'foo', b: 'bar', x: 11, y: 19}); //=> false
 *      pred({a: 'foo', b: 'xxx', x: 10, y: 19}); //=> false
 *      pred({a: 'foo', b: 'xxx', x: 11, y: 20}); //=> false
 */

var where =
/*#__PURE__*/
_curry2(function where(spec, testObj) {
  for (var prop in spec) {
    if (_has(prop, spec) && !spec[prop](testObj[prop])) {
      return false;
    }
  }

  return true;
});

/**
 * Takes a spec object and a test object; each of the spec's own properties must be a predicate function.
 * Each predicate is applied to the value of the corresponding property of the
 * test object. `whereAny` returns true if at least one of the predicates return true,
 * false otherwise.
 *
 * `whereAny` is well suited to declaratively expressing constraints for other
 * functions such as [`filter`](#filter) and [`find`](#find).
 *
 * @func
 * @memberOf R
 * @since v0.28.0
 * @category Object
 * @sig {String: (* -> Boolean)} -> {String: *} -> Boolean
 * @param {Object} spec
 * @param {Object} testObj
 * @return {Boolean}
 * @see R.propSatisfies, R.where
 * @example
 *
 *      // pred :: Object -> Boolean
 *      const pred = R.whereAny({
 *        a: R.equals('foo'),
 *        b: R.complement(R.equals('xxx')),
 *        x: R.gt(R.__, 10),
 *        y: R.lt(R.__, 20)
 *      });
 *
 *      pred({a: 'foo', b: 'xxx', x: 8, y: 34}); //=> true
 *      pred({a: 'xxx', b: 'xxx', x: 9, y: 21}); //=> false
 *      pred({a: 'bar', b: 'xxx', x: 10, y: 20}); //=> false
 *      pred({a: 'foo', b: 'bar', x: 10, y: 20}); //=> true
 *      pred({a: 'foo', b: 'xxx', x: 11, y: 20}); //=> true
 */

var whereAny =
/*#__PURE__*/
_curry2(function whereAny(spec, testObj) {
  for (var prop in spec) {
    if (_has(prop, spec) && spec[prop](testObj[prop])) {
      return true;
    }
  }

  return false;
});

/**
 * Takes a spec object and a test object; returns true if the test satisfies
 * the spec, false otherwise. An object satisfies the spec if, for each of the
 * spec's own properties, accessing that property of the object gives the same
 * value (in [`R.equals`](#equals) terms) as accessing that property of the
 * spec.
 *
 * `whereEq` is a specialization of [`where`](#where).
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category Object
 * @sig {String: *} -> {String: *} -> Boolean
 * @param {Object} spec
 * @param {Object} testObj
 * @return {Boolean}
 * @see R.propEq, R.where
 * @example
 *
 *      // pred :: Object -> Boolean
 *      const pred = R.whereEq({a: 1, b: 2});
 *
 *      pred({a: 1});              //=> false
 *      pred({a: 1, b: 2});        //=> true
 *      pred({a: 1, b: 2, c: 3});  //=> true
 *      pred({a: 1, b: 1});        //=> false
 */

var whereEq =
/*#__PURE__*/
_curry2(function whereEq(spec, testObj) {
  return where(map$1(equals, spec), testObj);
});

/**
 * Returns a new list without values in the first argument.
 * [`R.equals`](#equals) is used to determine equality.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig [a] -> [a] -> [a]
 * @param {Array} list1 The values to be removed from `list2`.
 * @param {Array} list2 The array to remove values from.
 * @return {Array} The new array without values in `list1`.
 * @see R.transduce, R.difference, R.remove
 * @example
 *
 *      R.without([1, 2], [1, 2, 1, 3, 4]); //=> [3, 4]
 */

var without =
/*#__PURE__*/
_curry2(function (xs, list) {
  return reject$1(flip(_includes)(xs), list);
});

/**
 * Exclusive disjunction logical operation.
 * Returns `true` if one of the arguments is truthy and the other is falsy.
 * Otherwise, it returns `false`.
 *
 * @func
 * @memberOf R
 * @since v0.27.1
 * @category Logic
 * @sig a -> b -> Boolean
 * @param {Any} a
 * @param {Any} b
 * @return {Boolean} true if one of the arguments is truthy and the other is falsy
 * @see R.or, R.and
 * @example
 *
 *      R.xor(true, true); //=> false
 *      R.xor(true, false); //=> true
 *      R.xor(false, true); //=> true
 *      R.xor(false, false); //=> false
 */

var xor =
/*#__PURE__*/
_curry2(function xor(a, b) {
  return Boolean(!a ^ !b);
});

/**
 * Creates a new list out of the two supplied by creating each possible pair
 * from the lists.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [b] -> [[a,b]]
 * @param {Array} as The first list.
 * @param {Array} bs The second list.
 * @return {Array} The list made by combining each possible pair from
 *         `as` and `bs` into pairs (`[a, b]`).
 * @example
 *
 *      R.xprod([1, 2], ['a', 'b']); //=> [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
 * @symb R.xprod([a, b], [c, d]) = [[a, c], [a, d], [b, c], [b, d]]
 */

var xprod =
/*#__PURE__*/
_curry2(function xprod(a, b) {
  // = xprodWith(prepend); (takes about 3 times as long...)
  var idx = 0;
  var ilen = a.length;
  var j;
  var jlen = b.length;
  var result = [];

  while (idx < ilen) {
    j = 0;

    while (j < jlen) {
      result[result.length] = [a[idx], b[j]];
      j += 1;
    }

    idx += 1;
  }

  return result;
});

/**
 * Creates a new list out of the two supplied by pairing up equally-positioned
 * items from both lists. The returned list is truncated to the length of the
 * shorter of the two input lists.
 * Note: `zip` is equivalent to `zipWith(function(a, b) { return [a, b] })`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [b] -> [[a,b]]
 * @param {Array} list1 The first array to consider.
 * @param {Array} list2 The second array to consider.
 * @return {Array} The list made by pairing up same-indexed elements of `list1` and `list2`.
 * @example
 *
 *      R.zip([1, 2, 3], ['a', 'b', 'c']); //=> [[1, 'a'], [2, 'b'], [3, 'c']]
 * @symb R.zip([a, b, c], [d, e, f]) = [[a, d], [b, e], [c, f]]
 */

var zip =
/*#__PURE__*/
_curry2(function zip(a, b) {
  var rv = [];
  var idx = 0;
  var len = Math.min(a.length, b.length);

  while (idx < len) {
    rv[idx] = [a[idx], b[idx]];
    idx += 1;
  }

  return rv;
});

/**
 * Creates a new object out of a list of keys and a list of values.
 * Key/value pairing is truncated to the length of the shorter of the two lists.
 * Note: `zipObj` is equivalent to `pipe(zip, fromPairs)`.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category List
 * @sig [String] -> [*] -> {String: *}
 * @param {Array} keys The array that will be properties on the output object.
 * @param {Array} values The list of values on the output object.
 * @return {Object} The object made by pairing up same-indexed elements of `keys` and `values`.
 * @example
 *
 *      R.zipObj(['a', 'b', 'c'], [1, 2, 3]); //=> {a: 1, b: 2, c: 3}
 */

var zipObj =
/*#__PURE__*/
_curry2(function zipObj(keys, values) {
  var idx = 0;
  var len = Math.min(keys.length, values.length);
  var out = {};

  while (idx < len) {
    out[keys[idx]] = values[idx];
    idx += 1;
  }

  return out;
});

/**
 * Creates a new list out of the two supplied by applying the function to each
 * equally-positioned pair in the lists. The returned list is truncated to the
 * length of the shorter of the two input lists.
 *
 * @function
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig ((a, b) -> c) -> [a] -> [b] -> [c]
 * @param {Function} fn The function used to combine the two elements into one value.
 * @param {Array} list1 The first array to consider.
 * @param {Array} list2 The second array to consider.
 * @return {Array} The list made by combining same-indexed elements of `list1` and `list2`
 *         using `fn`.
 * @example
 *
 *      const f = (x, y) => {
 *        // ...
 *      };
 *      R.zipWith(f, [1, 2, 3], ['a', 'b', 'c']);
 *      //=> [f(1, 'a'), f(2, 'b'), f(3, 'c')]
 * @symb R.zipWith(fn, [a, b, c], [d, e, f]) = [fn(a, d), fn(b, e), fn(c, f)]
 */

var zipWith =
/*#__PURE__*/
_curry3(function zipWith(fn, a, b) {
  var rv = [];
  var idx = 0;
  var len = Math.min(a.length, b.length);

  while (idx < len) {
    rv[idx] = fn(a[idx], b[idx]);
    idx += 1;
  }

  return rv;
});

/**
 * Creates a thunk out of a function. A thunk delays a calculation until
 * its result is needed, providing lazy evaluation of arguments.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category Function
 * @sig ((a, b, ..., j) -> k) -> (a, b, ..., j) -> (() -> k)
 * @param {Function} fn A function to wrap in a thunk
 * @return {Function} Expects arguments for `fn` and returns a new function
 *  that, when called, applies those arguments to `fn`.
 * @see R.partial, R.partialRight
 * @example
 *
 *      R.thunkify(R.identity)(42)(); //=> 42
 *      R.thunkify((a, b) => a + b)(25, 17)(); //=> 42
 */

var thunkify =
/*#__PURE__*/
_curry1(function thunkify(fn) {
  return curryN(fn.length, function createThunk() {
    var fnArgs = arguments;
    return function invokeThunk() {
      return fn.apply(this, fnArgs);
    };
  });
});

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  F: F$1,
  T: T,
  __: __,
  add: add,
  addIndex: addIndex,
  adjust: adjust,
  all: all,
  allPass: allPass,
  always: always,
  and: and$1,
  andThen: andThen,
  any: any$1,
  anyPass: anyPass,
  ap: ap$1,
  aperture: aperture,
  append: append,
  apply: apply$1,
  applySpec: applySpec,
  applyTo: applyTo,
  ascend: ascend,
  assoc: assoc,
  assocPath: assocPath,
  binary: binary,
  bind: bind,
  both: both$1,
  call: call$1,
  chain: chain$1,
  clamp: clamp,
  clone: clone,
  collectBy: collectBy,
  comparator: comparator,
  complement: complement,
  compose: compose,
  composeWith: composeWith,
  concat: concat,
  cond: cond,
  construct: construct,
  constructN: constructN,
  converge: converge,
  count: count,
  countBy: countBy,
  curry: curry,
  curryN: curryN,
  dec: dec,
  defaultTo: defaultTo,
  descend: descend,
  difference: difference,
  differenceWith: differenceWith,
  dissoc: dissoc,
  dissocPath: dissocPath,
  divide: divide,
  drop: drop,
  dropLast: dropLast,
  dropLastWhile: dropLastWhile,
  dropRepeats: dropRepeats,
  dropRepeatsWith: dropRepeatsWith,
  dropWhile: dropWhile,
  either: either,
  empty: empty,
  endsWith: endsWith,
  eqBy: eqBy,
  eqProps: eqProps,
  equals: equals,
  evolve: evolve,
  filter: filter,
  find: find,
  findIndex: findIndex,
  findLast: findLast,
  findLastIndex: findLastIndex,
  flatten: flatten,
  flip: flip,
  forEach: forEach,
  forEachObjIndexed: forEachObjIndexed,
  fromPairs: fromPairs,
  groupBy: groupBy,
  groupWith: groupWith,
  gt: gt,
  gte: gte,
  has: has,
  hasIn: hasIn,
  hasPath: hasPath,
  head: head,
  identical: identical,
  identity: identity,
  ifElse: ifElse,
  inc: inc,
  includes: includes,
  indexBy: indexBy,
  indexOf: indexOf,
  init: init,
  innerJoin: innerJoin,
  insert: insert,
  insertAll: insertAll,
  intersection: intersection,
  intersperse: intersperse,
  into: into,
  invert: invert,
  invertObj: invertObj,
  invoker: invoker,
  is: is,
  isEmpty: isEmpty,
  isNil: isNil$1,
  join: join,
  juxt: juxt,
  keys: keys,
  keysIn: keysIn,
  last: last,
  lastIndexOf: lastIndexOf,
  length: length,
  lens: lens,
  lensIndex: lensIndex,
  lensPath: lensPath,
  lensProp: lensProp,
  lift: lift,
  liftN: liftN,
  lt: lt,
  lte: lte,
  map: map$1,
  mapAccum: mapAccum,
  mapAccumRight: mapAccumRight,
  mapObjIndexed: mapObjIndexed,
  match: match,
  mathMod: mathMod,
  max: max,
  maxBy: maxBy,
  mean: mean,
  median: median,
  memoizeWith: memoizeWith,
  mergeAll: mergeAll,
  mergeDeepLeft: mergeDeepLeft,
  mergeDeepRight: mergeDeepRight,
  mergeDeepWith: mergeDeepWith,
  mergeDeepWithKey: mergeDeepWithKey,
  mergeLeft: mergeLeft,
  mergeRight: mergeRight,
  mergeWith: mergeWith,
  mergeWithKey: mergeWithKey,
  min: min,
  minBy: minBy,
  modify: modify,
  modifyPath: modifyPath,
  modulo: modulo,
  move: move,
  multiply: multiply,
  nAry: nAry,
  negate: negate,
  none: none,
  not: not,
  nth: nth,
  nthArg: nthArg,
  o: o,
  objOf: objOf,
  of: of,
  omit: omit,
  on: on,
  once: once,
  or: or,
  otherwise: otherwise,
  over: over,
  pair: pair,
  partial: partial,
  partialObject: partialObject,
  partialRight: partialRight,
  partition: partition,
  path: path,
  pathEq: pathEq,
  pathOr: pathOr,
  pathSatisfies: pathSatisfies,
  paths: paths,
  pick: pick,
  pickAll: pickAll,
  pickBy: pickBy,
  pipe: pipe$1,
  pipeWith: pipeWith,
  pluck: pluck,
  prepend: prepend,
  product: product,
  project: project,
  promap: promap,
  prop: prop,
  propEq: propEq,
  propIs: propIs,
  propOr: propOr,
  propSatisfies: propSatisfies,
  props: props,
  range: range,
  reduce: reduce,
  reduceBy: reduceBy,
  reduceRight: reduceRight,
  reduceWhile: reduceWhile,
  reduced: reduced,
  reject: reject$1,
  remove: remove,
  repeat: repeat,
  replace: replace,
  reverse: reverse$1,
  scan: scan,
  sequence: sequence,
  set: set,
  slice: slice,
  sort: sort,
  sortBy: sortBy,
  sortWith: sortWith,
  split: split,
  splitAt: splitAt,
  splitEvery: splitEvery,
  splitWhen: splitWhen,
  splitWhenever: splitWhenever,
  startsWith: startsWith,
  subtract: subtract,
  sum: sum,
  symmetricDifference: symmetricDifference,
  symmetricDifferenceWith: symmetricDifferenceWith,
  tail: tail,
  take: take,
  takeLast: takeLast,
  takeLastWhile: takeLastWhile,
  takeWhile: takeWhile,
  tap: tap,
  test: test,
  thunkify: thunkify,
  times: times,
  toLower: toLower,
  toPairs: toPairs,
  toPairsIn: toPairsIn,
  toString: toString,
  toUpper: toUpper,
  transduce: transduce,
  transpose: transpose,
  traverse: traverse,
  trim: trim,
  tryCatch: tryCatch,
  type: type$1,
  unapply: unapply,
  unary: unary,
  uncurryN: uncurryN,
  unfold: unfold,
  union: union,
  unionWith: unionWith,
  uniq: uniq,
  uniqBy: uniqBy,
  uniqWith: uniqWith,
  unless: unless,
  unnest: unnest,
  until: until,
  unwind: unwind,
  update: update,
  useWith: useWith,
  values: values,
  valuesIn: valuesIn,
  view: view,
  when: when,
  where: where,
  whereAny: whereAny,
  whereEq: whereEq,
  without: without,
  xor: xor,
  xprod: xprod,
  zip: zip,
  zipObj: zipObj,
  zipWith: zipWith
});

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var sanctuaryTypeIdentifiers = {exports: {}};

/*
        @@@@@@@            @@@@@@@         @@
      @@       @@        @@       @@      @@@
    @@   @@@ @@  @@    @@   @@@ @@  @@   @@@@@@ @@   @@@  @@ @@@      @@@@
   @@  @@   @@@   @@  @@  @@   @@@   @@   @@@   @@   @@@  @@@   @@  @@@   @@
   @@  @@   @@@   @@  @@  @@   @@@   @@   @@@   @@   @@@  @@@   @@  @@@@@@@@
   @@  @@   @@@  @@   @@  @@   @@@  @@    @@@   @@   @@@  @@@   @@  @@@
    @@   @@@ @@@@@     @@   @@@ @@@@@      @@@    @@@ @@  @@@@@@      @@@@@
      @@                 @@                           @@  @@
        @@@@@@@            @@@@@@@               @@@@@    @@
                                                          */

(function (module) {
	//. # sanctuary-type-identifiers
	//.
	//. A type is a set of values. Boolean, for example, is the type comprising
	//. `true` and `false`. A value may be a member of multiple types (`42` is a
	//. member of Number, PositiveNumber, Integer, and many other types).
	//.
	//. In certain situations it is useful to divide JavaScript values into
	//. non-overlapping types. The language provides two constructs for this
	//. purpose: the [`typeof`][1] operator and [`Object.prototype.toString`][2].
	//. Each has pros and cons, but neither supports user-defined types.
	//.
	//. sanctuary-type-identifiers comprises:
	//.
	//.   - an npm and browser -compatible package for deriving the
	//.     _type identifier_ of a JavaScript value; and
	//.   - a specification which authors may follow to specify type
	//.     identifiers for their types.
	//.
	//. ### Specification
	//.
	//. For a type to be compatible with the algorithm:
	//.
	//.   - every member of the type MUST have a `@@type` property
	//.     (the _type identifier_); and
	//.
	//.   - the type identifier MUST be a string primitive and SHOULD have
	//.     format `'<namespace>/<name>[@<version>]'`, where:
	//.
	//.       - `<namespace>` MUST consist of one or more characters, and
	//.         SHOULD equal the name of the npm package which defines the
	//.         type (including [scope][3] where appropriate);
	//.
	//.       - `<name>` MUST consist of one or more characters, and SHOULD
	//.         be the unique name of the type; and
	//.
	//.       - `<version>` MUST consist of one or more digits, and SHOULD
	//.         represent the version of the type.
	//.
	//. If the type identifier does not conform to the format specified above,
	//. it is assumed that the entire string represents the _name_ of the type;
	//. _namespace_ will be `null` and _version_ will be `0`.
	//.
	//. If the _version_ is not given, it is assumed to be `0`.

	(function(f) {

	  /* istanbul ignore else */
	  {
	    module.exports = f ();
	  }

	} (function() {

	  //  $$type :: String
	  var $$type = '@@type';

	  //  pattern :: RegExp
	  var pattern = new RegExp (
	    '^'
	  + '([\\s\\S]+)'   //  <namespace>
	  + '/'             //  SOLIDUS (U+002F)
	  + '([\\s\\S]+?)'  //  <name>
	  + '(?:'           //  optional non-capturing group {
	  +   '@'           //    COMMERCIAL AT (U+0040)
	  +   '([0-9]+)'    //    <version>
	  + ')?'            //  }
	  + '$'
	  );

	  //. ### Usage
	  //.
	  //. ```javascript
	  //. const type = require ('sanctuary-type-identifiers');
	  //. ```
	  //.
	  //. ```javascript
	  //. > const Identity$prototype = {
	  //. .   '@@type': 'my-package/Identity@1',
	  //. .   '@@show': function() {
	  //. .     return 'Identity (' + show (this.value) + ')';
	  //. .   }
	  //. . }
	  //.
	  //. > const Identity = value =>
	  //. .   Object.assign (Object.create (Identity$prototype), {value})
	  //.
	  //. > type (Identity (0))
	  //. 'my-package/Identity@1'
	  //.
	  //. > type.parse (type (Identity (0)))
	  //. {namespace: 'my-package', name: 'Identity', version: 1}
	  //. ```
	  //.
	  //. ### API
	  //.
	  //# type :: Any -> String
	  //.
	  //. Takes any value and returns a string which identifies its type. If the
	  //. value conforms to the [specification][4], the custom type identifier is
	  //. returned.
	  //.
	  //. ```javascript
	  //. > type (null)
	  //. 'Null'
	  //.
	  //. > type (true)
	  //. 'Boolean'
	  //.
	  //. > type (Identity (0))
	  //. 'my-package/Identity@1'
	  //. ```
	  function type(x) {
	    return x != null &&
	           x.constructor != null &&
	           x.constructor.prototype !== x &&
	           typeof x[$$type] === 'string' ?
	      x[$$type] :
	      (Object.prototype.toString.call (x)).slice ('[object '.length,
	                                                  -']'.length);
	  }

	  //# type.parse :: String -> { namespace :: Nullable String, name :: String, version :: Number }
	  //.
	  //. Takes any string and parses it according to the [specification][4],
	  //. returning an object with `namespace`, `name`, and `version` fields.
	  //.
	  //. ```javascript
	  //. > type.parse ('my-package/List@2')
	  //. {namespace: 'my-package', name: 'List', version: 2}
	  //.
	  //. > type.parse ('nonsense!')
	  //. {namespace: null, name: 'nonsense!', version: 0}
	  //.
	  //. > type.parse (type (Identity (0)))
	  //. {namespace: 'my-package', name: 'Identity', version: 1}
	  //. ```
	  type.parse = function parse(s) {
	    var namespace = null;
	    var name = s;
	    var version = 0;
	    var groups = pattern.exec (s);
	    if (groups != null) {
	      namespace = groups[1];
	      name = groups[2];
	      if (groups[3] != null) version = Number (groups[3]);
	    }
	    return {namespace: namespace, name: name, version: version};
	  };

	  return type;

	}));

	//. [1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
	//. [2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
	//. [3]: https://docs.npmjs.com/misc/scope
	//. [4]: #specification 
} (sanctuaryTypeIdentifiers));

var sanctuaryTypeIdentifiersExports = sanctuaryTypeIdentifiers.exports;
var type = /*@__PURE__*/getDefaultExportFromCjs(sanctuaryTypeIdentifiersExports);

var FL = {
  alt: 'fantasy-land/alt',
  ap: 'fantasy-land/ap',
  bimap: 'fantasy-land/bimap',
  chain: 'fantasy-land/chain',
  chainRec: 'fantasy-land/chainRec',
  map: 'fantasy-land/map',
  of: 'fantasy-land/of',
  zero: 'fantasy-land/zero'
};

var ordinal = ['first', 'second', 'third', 'fourth', 'fifth'];

var namespace = 'fluture';
var name = 'Future';
var version = 5;

var $$type$1 = namespace + '/' + name + '@' + version;

function List(head, tail){
  this.head = head;
  this.tail = tail;
}

List.prototype.toJSON = function(){
  return toArray(this);
};

var nil = new List(null, null);
nil.tail = nil;

function isNil(list){
  return list.tail === list;
}

// cons :: (a, List a) -> List a
//      -- O(1) append operation
function cons(head, tail){
  return new List(head, tail);
}

// reverse :: List a -> List a
//         -- O(n) list reversal
function reverse(xs){
  var ys = nil, tail = xs;
  while(!isNil(tail)){
    ys = cons(tail.head, ys);
    tail = tail.tail;
  }
  return ys;
}

// cat :: (List a, List a) -> List a
//     -- O(n) list concatenation
function cat(xs, ys){
  var zs = ys, tail = reverse(xs);
  while(!isNil(tail)){
    zs = cons(tail.head, zs);
    tail = tail.tail;
  }
  return zs;
}

// toArray :: List a -> Array a
//         -- O(n) list to Array
function toArray(xs){
  var tail = xs, arr = [];
  while(!isNil(tail)){
    arr.push(tail.head);
    tail = tail.tail;
  }
  return arr;
}

/* c8 ignore next */
var captureStackTrace = Error.captureStackTrace || captureStackTraceFallback;
var _debug = debugHandleNone;

function debugMode(debug){
  _debug = debug ? debugHandleAll : debugHandleNone;
}

function debugHandleNone(x){
  return x;
}

function debugHandleAll(x, fn, a, b, c){
  return fn(a, b, c);
}

function debug(x, fn, a, b, c){
  return _debug(x, fn, a, b, c);
}

function captureContext(previous, tag, fn){
  return debug(previous, debugCaptureContext, previous, tag, fn);
}

function debugCaptureContext(previous, tag, fn){
  var context = {tag: tag, name: ' from ' + tag + ':'};
  captureStackTrace(context, fn);
  return cons(context, previous);
}

function captureApplicationContext(context, n, f){
  return debug(context, debugCaptureApplicationContext, context, n, f);
}

function debugCaptureApplicationContext(context, n, f){
  return debugCaptureContext(context, ordinal[n - 1] + ' application of ' + f.name, f);
}

function captureStackTraceFallback(x){
  var e = new Error;
  if(typeof e.stack === 'string'){
    x.stack = x.name + '\n' + e.stack.split('\n').slice(1).join('\n');
  /* c8 ignore next 3 */
  }else {
    x.stack = x.name;
  }
}

var sanctuaryShow = {exports: {}};

(function (module) {
	//. # sanctuary-show
	//.
	//. Haskell has a `show` function which can be applied to a compatible value to
	//. produce a descriptive string representation of that value. The idea is that
	//. the string representation should, if possible, be an expression which would
	//. produce the original value if evaluated.
	//.
	//. This library provides a similar [`show`](#show) function.
	//.
	//. In general, this property should hold: `eval (show (x)) = x`. In some cases
	//. parens are necessary to ensure correct interpretation (`{}`, for example,
	//. is an empty block rather than an empty object in some contexts). Thus the
	//. property is more accurately stated `eval ('(' + show (x) + ')') = x`.
	//.
	//. One can make values of a custom type compatible with [`show`](#show) by
	//. defining a `@@show` method. For example:
	//.
	//. ```javascript
	//. //# Maybe#@@show :: Maybe a ~> () -> String
	//. //.
	//. //. ```javascript
	//. //. > show (Nothing)
	//. //. 'Nothing'
	//. //.
	//. //. > show (Just (['foo', 'bar', 'baz']))
	//. //. 'Just (["foo", "bar", "baz"])'
	//. //. ```
	//. Maybe.prototype['@@show'] = function() {
	//.   return this.isNothing ? 'Nothing' : 'Just (' + show (this.value) + ')';
	//. };
	//. ```

	(function(f) {

	  /* istanbul ignore else */
	  {
	    module.exports = f ();
	  }

	} (function() {

	  //  $$show :: String
	  var $$show = '@@show';

	  //  seen :: Array Any
	  var seen = [];

	  //  entry :: Object -> String -> String
	  function entry(o) {
	    return function(k) {
	      return show (k) + ': ' + show (o[k]);
	    };
	  }

	  //  sortedKeys :: Object -> Array String
	  function sortedKeys(o) {
	    return (Object.keys (o)).sort ();
	  }

	  //# show :: Showable a => a -> String
	  //.
	  //. Returns a useful string representation of the given value.
	  //.
	  //. Dispatches to the value's `@@show` method if present.
	  //.
	  //. Where practical, `show (eval ('(' + show (x) + ')')) = show (x)`.
	  //.
	  //. ```javascript
	  //. > show (null)
	  //. 'null'
	  //.
	  //. > show (undefined)
	  //. 'undefined'
	  //.
	  //. > show (true)
	  //. 'true'
	  //.
	  //. > show (new Boolean (false))
	  //. 'new Boolean (false)'
	  //.
	  //. > show (-0)
	  //. '-0'
	  //.
	  //. > show (NaN)
	  //. 'NaN'
	  //.
	  //. > show (new Number (Infinity))
	  //. 'new Number (Infinity)'
	  //.
	  //. > show ('foo\n"bar"\nbaz\n')
	  //. '"foo\\n\\"bar\\"\\nbaz\\n"'
	  //.
	  //. > show (new String (''))
	  //. 'new String ("")'
	  //.
	  //. > show (['foo', 'bar', 'baz'])
	  //. '["foo", "bar", "baz"]'
	  //.
	  //. > show ([[[[[0]]]]])
	  //. '[[[[[0]]]]]'
	  //.
	  //. > show ({x: [1, 2], y: [3, 4], z: [5, 6]})
	  //. '{"x": [1, 2], "y": [3, 4], "z": [5, 6]}'
	  //. ```
	  function show(x) {
	    if (seen.indexOf (x) >= 0) return '<Circular>';

	    switch (Object.prototype.toString.call (x)) {

	      case '[object Boolean]':
	        return typeof x === 'object' ?
	          'new Boolean (' + show (x.valueOf ()) + ')' :
	          x.toString ();

	      case '[object Number]':
	        return typeof x === 'object' ?
	          'new Number (' + show (x.valueOf ()) + ')' :
	          1 / x === -Infinity ? '-0' : x.toString (10);

	      case '[object String]':
	        return typeof x === 'object' ?
	          'new String (' + show (x.valueOf ()) + ')' :
	          JSON.stringify (x);

	      case '[object Date]':
	        return 'new Date (' +
	               show (isNaN (x.valueOf ()) ? NaN : x.toISOString ()) +
	               ')';

	      case '[object Error]':
	        return 'new ' + x.name + ' (' + show (x.message) + ')';

	      case '[object Arguments]':
	        return 'function () { return arguments; } (' +
	               (Array.prototype.map.call (x, show)).join (', ') +
	               ')';

	      case '[object Array]':
	        seen.push (x);
	        try {
	          return '[' + ((x.map (show)).concat (
	            sortedKeys (x)
	            .filter (function(k) { return !(/^\d+$/.test (k)); })
	            .map (entry (x))
	          )).join (', ') + ']';
	        } finally {
	          seen.pop ();
	        }

	      case '[object Object]':
	        seen.push (x);
	        try {
	          return (
	            $$show in x &&
	            (x.constructor == null || x.constructor.prototype !== x) ?
	              x[$$show] () :
	              '{' + ((sortedKeys (x)).map (entry (x))).join (', ') + '}'
	          );
	        } finally {
	          seen.pop ();
	        }

	      case '[object Set]':
	        seen.push (x);
	        try {
	          return 'new Set (' + show (Array.from (x.values ())) + ')';
	        } finally {
	          seen.pop ();
	        }

	      case '[object Map]':
	        seen.push (x);
	        try {
	          return 'new Map (' + show (Array.from (x.entries ())) + ')';
	        } finally {
	          seen.pop ();
	        }

	      default:
	        return String (x);

	    }
	  }

	  return show;

	})); 
} (sanctuaryShow));

var sanctuaryShowExports = sanctuaryShow.exports;
var show = /*@__PURE__*/getDefaultExportFromCjs(sanctuaryShowExports);

/* c8 ignore next */
var setImmediate = typeof setImmediate === 'undefined' ? setImmediateFallback : setImmediate;

function noop(){}
function moop(){ return this }
function call(f, x){ return f(x) }

function setImmediateFallback(f, x){
  return setTimeout(f, 0, x);
}

function raise(x){
  setImmediate(function rethrowErrorDelayedToEscapePromiseCatch(){
    throw x;
  });
}

function showArg$1(x){
  return show(x) + ' :: ' + type.parse(type(x)).name;
}

function error(message){
  return new Error(message);
}

function typeError(message){
  return new TypeError(message);
}

function invalidArgument(it, at, expected, actual){
  return typeError(
    it + '() expects its ' + ordinal[at] + ' argument to ' + expected + '.' +
    '\n  Actual: ' + showArg$1(actual)
  );
}

function invalidArgumentOf(expected){
  return function(it, at, actual){
    return invalidArgument(it, at, expected, actual);
  };
}

function invalidArity(f, args){
  return new TypeError(
    f.name + '() expects to be called with a single argument per invocation\n' +
    '  Saw: ' + args.length + ' arguments' +
    Array.prototype.slice.call(args).map(function(arg, i){
      return '\n  ' + (
        ordinal[i] ?
        ordinal[i].charAt(0).toUpperCase() + ordinal[i].slice(1) :
        'Argument ' + String(i + 1)
      ) + ': ' + showArg$1(arg);
    }).join('')
  );
}

function invalidNamespace(m, x){
  return (
    'The Future was not created by ' + namespace + '. '
  + 'Make sure you transform other Futures to ' + namespace + ' Futures. '
  + 'Got ' + (x ? ('a Future from ' + x) : 'an unscoped Future') + '.'
  + '\n  See: https://github.com/fluture-js/Fluture#casting-futures'
  );
}

function invalidVersion(m, x){
  return (
    'The Future was created by ' + (x < version ? 'an older' : 'a newer')
  + ' version of ' + namespace + '. '
  + 'This means that one of the sources which creates Futures is outdated. '
  + 'Update this source, or transform its created Futures to be compatible.'
  + '\n  See: https://github.com/fluture-js/Fluture#casting-futures'
  );
}

function invalidFuture(desc, m, s){
  var id = type.parse(type(m));
  var info = id.name === name ? '\n' + (
    id.namespace !== namespace ? invalidNamespace(m, id.namespace)
  : id.version !== version ? invalidVersion(m, id.version)
  : 'Nothing seems wrong. Contact the Fluture maintainers.') : '';
  return typeError(
    desc + ' to be a valid Future.' + info + '\n' +
    '  Actual: ' + show(m) + ' :: ' + id.name + (s || '')
  );
}

function invalidFutureArgument(it, at, m, s){
  return invalidFuture(it + '() expects its ' + ordinal[at] + ' argument', m, s);
}

function ensureError(value, fn){
  var message;
  try{
    if(value instanceof Error) return value;
    message = 'A Non-Error was thrown from a Future: ' + show(value);
  }catch (_){
    message = 'Something was thrown from a Future, but it could not be converted to String';
  }
  var e = error(message);
  captureStackTrace(e, fn);
  return e;
}

function assignUnenumerable(o, prop, value){
  Object.defineProperty(o, prop, {value: value, writable: true, configurable: true});
}

function wrapException(caught, callingFuture){
  var origin = ensureError(caught, wrapException);
  var context = cat(origin.context || nil, callingFuture.context);
  var e = error(origin.message);
  assignUnenumerable(e, 'future', origin.future || callingFuture);
  assignUnenumerable(e, 'reason', origin.reason || origin);
  assignUnenumerable(e, 'stack', e.reason.stack);
  return withExtraContext(e, context);
}

function withExtraContext(e, context){
  assignUnenumerable(e, 'context', context);
  assignUnenumerable(e, 'stack', e.stack + contextToStackTrace(context));
  return e;
}

function contextToStackTrace(context){
  var stack = '', tail = context;
  while(tail !== nil){
    stack = stack + '\n' + tail.head.stack;
    tail = tail.tail;
  }
  return stack;
}

function isFunction(f){
  return typeof f === 'function';
}

function isThenable(m){
  return m instanceof Promise || m != null && isFunction(m.then);
}

function isBoolean(f){
  return typeof f === 'boolean';
}

function isNumber(f){
  return typeof f === 'number';
}

function isUnsigned(n){
  return (n === Infinity || isNumber(n) && n > 0 && n % 1 === 0);
}

function isObject$1(o){
  return o !== null && typeof o === 'object';
}

function isIterator(i){
  return isObject$1(i) && isFunction(i.next);
}

function isArray(x){
  return Array.isArray(x);
}

function hasMethod(method, x){
  return x != null && isFunction(x[method]);
}

function isFunctor(x){
  return hasMethod(FL.map, x);
}

function isAlt(x){
  return isFunctor(x) && hasMethod(FL.alt, x);
}

function isApply(x){
  return isFunctor(x) && hasMethod(FL.ap, x);
}

function isBifunctor(x){
  return isFunctor(x) && hasMethod(FL.bimap, x);
}

function isChain(x){
  return isApply(x) && hasMethod(FL.chain, x);
}

function Next(x){
  return {done: false, value: x};
}

function Done(x){
  return {done: true, value: x};
}

function isIteration(x){
  return isObject$1(x) && isBoolean(x.done);
}

/*eslint no-cond-assign:0, no-constant-condition:0 */

function alwaysTrue(){
  return true;
}

function getArgs(it){
  var args = new Array(it.arity);
  for(var i = 1; i <= it.arity; i++){
    args[i - 1] = it['$' + String(i)];
  }
  return args;
}

function showArg(arg){
  return ' (' + show(arg) + ')';
}

var any = {pred: alwaysTrue, error: invalidArgumentOf('be anything')};
var func = {pred: isFunction, error: invalidArgumentOf('be a Function')};
var future = {pred: isFuture, error: invalidFutureArgument};
var positiveInteger = {pred: isUnsigned, error: invalidArgumentOf('be a positive Integer')};

function application(n, f, type, args, prev){
  if(args.length < 2 && type.pred(args[0])) return captureApplicationContext(prev, n, f);
  var e = args.length > 1 ? invalidArity(f, args) : type.error(f.name, n - 1, args[0]);
  captureStackTrace(e, f);
  throw withExtraContext(e, prev);
}

function application1(f, type, args){
  return application(1, f, type, args, nil);
}

function Future$1(computation){
  var context = application1(Future$1, func, arguments);
  return new Computation(context, computation);
}

function isFuture(x){
  return x instanceof Future$1 || type(x) === $$type$1;
}

// Compliance with sanctuary-type-identifiers versions 1 and 2.
// To prevent sanctuary-type-identifiers version 3 from identifying 'Future'
// as being of the type denoted by $$type, we ensure that
// Future.constructor.prototype is equal to Future.
Future$1['@@type'] = $$type$1;
Future$1.constructor = {prototype: Future$1};

Future$1[FL.of] = resolve;
Future$1[FL.chainRec] = chainRec;

Future$1.prototype['@@type'] = $$type$1;

Future$1.prototype['@@show'] = function Future$show(){
  return this.toString();
};

Future$1.prototype.pipe = function Future$pipe(f){
  if(!isFunction(f)) throw invalidArgument('Future#pipe', 0, 'be a Function', f);
  return f(this);
};

Future$1.prototype[FL.ap] = function Future$FL$ap(other){
  var context = captureContext(nil, 'a Fantasy Land dispatch to ap', Future$FL$ap);
  return other._transform(new ApTransformation(context, this));
};

Future$1.prototype[FL.map] = function Future$FL$map(mapper){
  var context = captureContext(nil, 'a Fantasy Land dispatch to map', Future$FL$map);
  return this._transform(new MapTransformation(context, mapper));
};

Future$1.prototype[FL.bimap] = function Future$FL$bimap(lmapper, rmapper){
  var context = captureContext(nil, 'a Fantasy Land dispatch to bimap', Future$FL$bimap);
  return this._transform(new BimapTransformation(context, lmapper, rmapper));
};

Future$1.prototype[FL.chain] = function Future$FL$chain(mapper){
  var context = captureContext(nil, 'a Fantasy Land dispatch to chain', Future$FL$chain);
  return this._transform(new ChainTransformation(context, mapper));
};

Future$1.prototype[FL.alt] = function Future$FL$alt(other){
  var context = captureContext(nil, 'a Fantasy Land dispatch to alt', Future$FL$alt);
  return this._transform(new AltTransformation(context, other));
};

Future$1.prototype.extractLeft = function Future$extractLeft(){
  return [];
};

Future$1.prototype.extractRight = function Future$extractRight(){
  return [];
};

Future$1.prototype._transform = function Future$transform(transformation){
  return new Transformer(transformation.context, this, cons(transformation, nil));
};

Future$1.prototype.isTransformer = false;
Future$1.prototype.context = nil;
Future$1.prototype.arity = 0;
Future$1.prototype.name = 'future';

Future$1.prototype.toString = function Future$toString(){
  return this.name + getArgs(this).map(showArg).join('');
};

Future$1.prototype.toJSON = function Future$toJSON(){
  return {$: $$type$1, kind: 'interpreter', type: this.name, args: getArgs(this)};
};

function createInterpreter(arity, name, interpret){
  var Interpreter = function(context, $1, $2, $3){
    this.context = context;
    this.$1 = $1;
    this.$2 = $2;
    this.$3 = $3;
  };

  Interpreter.prototype = Object.create(Future$1.prototype);
  Interpreter.prototype.arity = arity;
  Interpreter.prototype.name = name;
  Interpreter.prototype._interpret = interpret;

  return Interpreter;
}

var Computation =
createInterpreter(1, 'Future', function Computation$interpret(rec, rej, res){
  var computation = this.$1, open = false, cancel = noop, cont = function(){ open = true; };
  try{
    cancel = computation(function Computation$rej(x){
      cont = function Computation$rej$cont(){
        open = false;
        rej(x);
      };
      if(open){
        cont();
      }
    }, function Computation$res(x){
      cont = function Computation$res$cont(){
        open = false;
        res(x);
      };
      if(open){
        cont();
      }
    });
  }catch(e){
    rec(wrapException(e, this));
    return noop;
  }
  if(!(isFunction(cancel) && cancel.length === 0)){
    rec(wrapException(typeError(
      'The computation was expected to return a nullary cancellation function\n' +
      '  Actual: ' + show(cancel)
    ), this));
    return noop;
  }
  cont();
  return function Computation$cancel(){
    if(open){
      open = false;
      cancel && cancel();
    }
  };
});

var Never = createInterpreter(0, 'never', function Never$interpret(){
  return noop;
});

Never.prototype._isNever = true;

var never = new Never(nil);

function isNever(x){
  return isFuture(x) && x._isNever === true;
}

var Crash = createInterpreter(1, 'crash', function Crash$interpret(rec){
  rec(this.$1);
  return noop;
});

function crash(x){
  return new Crash(application1(crash, any, arguments), x);
}

var Reject = createInterpreter(1, 'reject', function Reject$interpret(rec, rej){
  rej(this.$1);
  return noop;
});

Reject.prototype.extractLeft = function Reject$extractLeft(){
  return [this.$1];
};

function reject(x){
  return new Reject(application1(reject, any, arguments), x);
}

var Resolve = createInterpreter(1, 'resolve', function Resolve$interpret(rec, rej, res){
  res(this.$1);
  return noop;
});

Resolve.prototype.extractRight = function Resolve$extractRight(){
  return [this.$1];
};

function resolve(x){
  return new Resolve(application1(resolve, any, arguments), x);
}

//Note: This function is not curried because it's only used to satisfy the
//      Fantasy Land ChainRec specification.
function chainRec(step, init){
  return resolve(Next(init))._transform(new ChainTransformation(nil, function chainRec$recur(o){
    return o.done ?
           resolve(o.value) :
           step(Next, Done, o.value)._transform(new ChainTransformation(nil, chainRec$recur));
  }));
}

var Transformer =
createInterpreter(2, 'transform', function Transformer$interpret(rec, rej, res){

  //These are the cold, and hot, transformation stacks. The cold actions are those that
  //have yet to run parallel computations, and hot are those that have.
  var cold = nil, hot = nil;

  //These combined variables define our current state.
  // future         = the future we are currently forking
  // transformation = the transformation to be informed when the future settles
  // cancel         = the cancel function of the current future
  // settled        = a boolean indicating whether a new tick should start
  // async          = a boolean indicating whether we are awaiting a result asynchronously
  var future, transformation, cancel = noop, settled, async = true, it;

  //Takes a transformation from the top of the hot stack and returns it.
  function nextHot(){
    var x = hot.head;
    hot = hot.tail;
    return x;
  }

  //Takes a transformation from the top of the cold stack and returns it.
  function nextCold(){
    var x = cold.head;
    cold = cold.tail;
    return x;
  }

  //This function is called with a future to use in the next tick.
  //Here we "flatten" the actions of another Sequence into our own actions,
  //this is the magic that allows for infinitely stack safe recursion because
  //actions like ChainAction will return a new Sequence.
  //If we settled asynchronously, we call drain() directly to run the next tick.
  function settle(m){
    settled = true;
    future = m;
    if(future.isTransformer){
      var tail = future.$2;
      while(!isNil(tail)){
        cold = cons(tail.head, cold);
        tail = tail.tail;
      }
      future = future.$1;
    }
    if(async) drain();
  }

  //This function serves as a rejection handler for our current future.
  //It will tell the current transformation that the future rejected, and it will
  //settle the current tick with the transformation's answer to that.
  function rejected(x){
    settle(transformation.rejected(x));
  }

  //This function serves as a resolution handler for our current future.
  //It will tell the current transformation that the future resolved, and it will
  //settle the current tick with the transformation's answer to that.
  function resolved(x){
    settle(transformation.resolved(x));
  }

  //This function is passed into actions when they are "warmed up".
  //If the transformation decides that it has its result, without the need to await
  //anything else, then it can call this function to force "early termination".
  //When early termination occurs, all actions which were stacked prior to the
  //terminator will be skipped. If they were already hot, they will also be
  //sent a cancel signal so they can cancel their own concurrent computations,
  //as their results are no longer needed.
  function early(m, terminator){
    cancel();
    cold = nil;
    if(async && transformation !== terminator){
      transformation.cancel();
      while((it = nextHot()) && it !== terminator) it.cancel();
    }
    settle(m);
  }

  //This will cancel the current Future, the current transformation, and all stacked hot actions.
  function Sequence$cancel(){
    cancel();
    transformation && transformation.cancel();
    while(it = nextHot()) it.cancel();
  }

  //This function is called when an exception is caught.
  function exception(e){
    Sequence$cancel();
    settled = true;
    cold = hot = nil;
    var error = wrapException(e, future);
    future = never;
    rec(error);
  }

  //This function serves to kickstart concurrent computations.
  //Takes all actions from the cold stack in reverse order, and calls run() on
  //each of them, passing them the "early" function. If any of them settles (by
  //calling early()), we abort. After warming up all actions in the cold queue,
  //we warm up the current transformation as well.
  function warmupActions(){
    cold = reverse(cold);
    while(cold !== nil){
      it = cold.head.run(early);
      if(settled) return;
      hot = cons(it, hot);
      cold = cold.tail;
    }
    transformation = transformation.run(early);
  }

  //This function represents our main execution loop. By "tick", we've been
  //referring to the execution of one iteration in the while-loop below.
  function drain(){
    async = false;
    while(true){
      settled = false;
      if(transformation = nextCold()){
        cancel = future._interpret(exception, rejected, resolved);
        if(!settled) warmupActions();
      }else if(transformation = nextHot()){
        cancel = future._interpret(exception, rejected, resolved);
      }else break;
      if(settled) continue;
      async = true;
      return;
    }
    cancel = future._interpret(exception, rej, res);
  }

  //Start the execution loop.
  settle(this);

  //Return the cancellation function.
  return Sequence$cancel;

});

Transformer.prototype.isTransformer = true;

Transformer.prototype._transform = function Transformer$_transform(transformation){
  return new Transformer(transformation.context, this.$1, cons(transformation, this.$2));
};

Transformer.prototype.toString = function Transformer$toString(){
  return toArray(reverse(this.$2)).reduce(function(str, action){
    return action.name + getArgs(action).map(showArg).join('') + ' (' + str + ')';
  }, this.$1.toString());
};

function BaseTransformation$rejected(x){
  this.cancel();
  return new Reject(this.context, x);
}

function BaseTransformation$resolved(x){
  this.cancel();
  return new Resolve(this.context, x);
}

function BaseTransformation$toJSON(){
  return {$: $$type$1, kind: 'transformation', type: this.name, args: getArgs(this)};
}

var BaseTransformation = {
  rejected: BaseTransformation$rejected,
  resolved: BaseTransformation$resolved,
  run: moop,
  cancel: noop,
  context: nil,
  arity: 0,
  name: 'transform',
  toJSON: BaseTransformation$toJSON
};

function wrapHandler(handler){
  return function transformationHandler(x){
    var m;
    try{
      m = handler.call(this, x);
    }catch(e){
      return new Crash(this.context, e);
    }
    if(isFuture(m)){
      return m;
    }
    return new Crash(this.context, invalidFuture(
      this.name + ' expects the return value from the function it\'s given', m,
      '\n  When called with: ' + show(x)
    ));
  };
}

function createTransformation(arity, name, prototype){
  var Transformation = function(context, $1, $2){
    this.context = context;
    this.$1 = $1;
    this.$2 = $2;
  };

  Transformation.prototype = Object.create(BaseTransformation);
  Transformation.prototype.arity = arity;
  Transformation.prototype.name = name;

  if(typeof prototype.rejected === 'function'){
    Transformation.prototype.rejected = wrapHandler(prototype.rejected);
  }

  if(typeof prototype.resolved === 'function'){
    Transformation.prototype.resolved = wrapHandler(prototype.resolved);
  }

  if(typeof prototype.run === 'function'){
    Transformation.prototype.run = prototype.run;
  }

  return Transformation;
}

var ApTransformation = createTransformation(1, 'ap', {
  resolved: function ApTransformation$resolved(f){
    if(isFunction(f)) return this.$1._transform(new MapTransformation(this.context, f));
    throw typeError(
      'ap expects the second Future to resolve to a Function\n' +
      '  Actual: ' + show(f)
    );
  }
});

var AltTransformation = createTransformation(1, 'alt', {
  rejected: function AltTransformation$rejected(){ return this.$1 }
});

var MapTransformation = createTransformation(1, 'map', {
  resolved: function MapTransformation$resolved(x){
    return new Resolve(this.context, call(this.$1, x));
  }
});

var BimapTransformation = createTransformation(2, 'bimap', {
  rejected: function BimapTransformation$rejected(x){
    return new Reject(this.context, call(this.$1, x));
  },
  resolved: function BimapTransformation$resolved(x){
    return new Resolve(this.context, call(this.$2, x));
  }
});

var ChainTransformation = createTransformation(1, 'chain', {
  resolved: function ChainTransformation$resolved(x){ return call(this.$1, x) }
});

var After = createInterpreter(2, 'after', function After$interpret(rec, rej, res){
  var id = setTimeout(res, this.$1, this.$2);
  return function After$cancel(){ clearTimeout(id); };
});

After.prototype.extractRight = function After$extractRight(){
  return [this.$2];
};

function alwaysNever$1(_){
  return never;
}

function after(time){
  var context1 = application1(after, positiveInteger, arguments);
  return time === Infinity ? alwaysNever$1 : (function after(value){
    var context2 = application(2, after, any, arguments, context1);
    return new After(context2, time, value);
  });
}

var alternative = {pred: isAlt, error: invalidArgumentOf('have Alt implemented')};

function alt(left){
  if(isFuture(left)){
    var context1 = application1(alt, future, arguments);
    return function alt(right){
      var context2 = application(2, alt, future, arguments, context1);
      return right._transform(new AltTransformation(context2, left));
    };
  }

  var context = application1(alt, alternative, arguments);
  return function alt(right){
    application(2, alt, alternative, arguments, context);
    return left[FL.alt](right);
  };
}

var AndTransformation = createTransformation(1, 'and', {
  resolved: function AndTransformation$resolved(){ return this.$1 }
});

function and(left){
  var context1 = application1(and, future, arguments);
  return function and(right){
    var context2 = application(2, and, future, arguments, context1);
    return right._transform(new AndTransformation(context2, left));
  };
}

var apply = {pred: isApply, error: invalidArgumentOf('have Apply implemented')};

function ap(mx){
  if(isFuture(mx)){
    var context1 = application1(ap, future, arguments);
    return function ap(mf){
      var context2 = application(2, ap, future, arguments, context1);
      return mf._transform(new ApTransformation(context2, mx));
    };
  }

  var context = application1(ap, apply, arguments);
  return function ap(mf){
    application(2, ap, apply, arguments, context);
    return mx[FL.ap](mf);
  };
}

function invalidPromise(p, f, a){
  return typeError(
    'encaseP() expects the function it\'s given to return a Promise/Thenable'
    + '\n  Actual: ' + show(p) + '\n  From calling: ' + show(f)
    + '\n  With: ' + show(a)
  );
}

var EncaseP = createInterpreter(2, 'encaseP', function EncaseP$interpret(rec, rej, res){
  var open = true, fn = this.$1, arg = this.$2, p;
  try{
    p = fn(arg);
  }catch(e){
    rec(wrapException(e, this));
    return noop;
  }
  if(!isThenable(p)){
    rec(wrapException(invalidPromise(p, fn, arg), this));
    return noop;
  }
  p.then(function EncaseP$res(x){
    if(open){
      open = false;
      res(x);
    }
  }, function EncaseP$rej(x){
    if(open){
      open = false;
      rej(x);
    }
  });
  return function EncaseP$cancel(){ open = false; };
});

function encaseP(f){
  var context1 = application1(encaseP, func, arguments);
  return function encaseP(x){
    var context2 = application(2, encaseP, any, arguments, context1);
    return new EncaseP(context2, f, x);
  };
}

function attemptP$1(_){
  return encaseP.apply(this, arguments)(undefined);
}

var Encase = createInterpreter(2, 'encase', function Encase$interpret(rec, rej, res){
  var fn = this.$1, r;
  try{ r = fn(this.$2); }catch(e){ rej(e); return noop }
  res(r);
  return noop;
});

function encase(f){
  var context1 = application1(encase, func, arguments);
  return function encase(x){
    var context2 = application(2, encase, any, arguments, context1);
    return new Encase(context2, f, x);
  };
}

function attempt(_){
  return encase.apply(this, arguments)(undefined);
}

var bifunctor = {pred: isBifunctor, error: invalidArgumentOf('have Bifunctor implemented')};

function bimap(f){
  var context1 = application1(bimap, func, arguments);
  return function bimap(g){
    var context2 = application(2, bimap, func, arguments, context1);
    return function bimap(m){
      var context3 = application(3, bimap, bifunctor, arguments, context2);
      return isFuture(m) ?
             m._transform(new BimapTransformation(context3, f, g)) :
             m[FL.bimap](f, g);
    };
  };
}

var BichainTransformation = createTransformation(2, 'bichain', {
  rejected: function BichainTransformation$rejected(x){ return call(this.$1, x) },
  resolved: function BichainTransformation$resolved(x){ return call(this.$2, x) }
});

function bichain(f){
  var context1 = application1(bichain, func, arguments);
  return function bichain(g){
    var context2 = application(2, bichain, func, arguments, context1);
    return function bichain(m){
      var context3 = application(3, bichain, future, arguments, context2);
      return m._transform(new BichainTransformation(context3, f, g));
    };
  };
}

function Eager(future){
  var _this = this;
  _this.rec = noop;
  _this.rej = noop;
  _this.res = noop;
  _this.crashed = false;
  _this.rejected = false;
  _this.resolved = false;
  _this.value = null;
  _this.cancel = future._interpret(function Eager$crash(x){
    _this.value = x;
    _this.crashed = true;
    _this.cancel = noop;
    _this.rec(x);
  }, function Eager$reject(x){
    _this.value = x;
    _this.rejected = true;
    _this.cancel = noop;
    _this.rej(x);
  }, function Eager$resolve(x){
    _this.value = x;
    _this.resolved = true;
    _this.cancel = noop;
    _this.res(x);
  });
}

Eager.prototype = Object.create(Future$1.prototype);

Eager.prototype._interpret = function Eager$interpret(rec, rej, res){
  if(this.crashed) rec(this.value);
  else if(this.rejected) rej(this.value);
  else if(this.resolved) res(this.value);
  else {
    this.rec = rec;
    this.rej = rej;
    this.res = res;
  }
  return this.cancel;
};

function earlyCrash(early, x){
  early(crash(x));
}

function earlyReject(early, x){
  early(reject(x));
}

function earlyResolve(early, x){
  early(resolve(x));
}

function createParallelTransformation(name, rec, rej, res, prototype){
  var ParallelTransformation = createTransformation(1, name, Object.assign({
    run: function Parallel$run(early){
      var eager = new Eager(this.$1);
      var transformation = new ParallelTransformation(this.context, eager);
      function Parallel$early(m){ early(m, transformation); }
      transformation.cancel = eager._interpret(
        function Parallel$rec(x){ rec(Parallel$early, x); },
        function Parallel$rej(x){ rej(Parallel$early, x); },
        function Parallel$res(x){ res(Parallel$early, x); }
      );
      return transformation;
    }
  }, prototype));
  return ParallelTransformation;
}

var PairTransformation = createTransformation(1, 'pair', {
  resolved: function PairTransformation$resolved(x){
    return new Resolve(this.context, [x, this.$1]);
  }
});

var BothTransformation =
createParallelTransformation('both', earlyCrash, earlyReject, noop, {
  resolved: function BothTransformation$resolved(x){
    return this.$1._transform(new PairTransformation(this.context, x));
  }
});

function both(left){
  var context1 = application1(both, future, arguments);
  return function both(right){
    var context2 = application(2, both, future, arguments, context1);
    return right._transform(new BothTransformation(context2, left));
  };
}

var Cold = 0;
var Pending = 1;
var Crashed = 2;
var Rejected = 3;
var Resolved = 4;

function Queued(rec, rej, res){
  this[Crashed] = rec;
  this[Rejected] = rej;
  this[Resolved] = res;
}

var Cache = createInterpreter(1, 'cache', function Cache$interpret(rec, rej, res){
  var cancel = noop;

  switch(this._state){
    /* c8 ignore next 4 */
    case Pending: cancel = this._addToQueue(rec, rej, res); break;
    case Crashed: rec(this._value); break;
    case Rejected: rej(this._value); break;
    case Resolved: res(this._value); break;
    default:
      this._queue = [];
      cancel = this._addToQueue(rec, rej, res);
      this.run();
  }

  return cancel;
});

Cache.prototype._cancel = noop;
Cache.prototype._queue = null;
Cache.prototype._queued = 0;
Cache.prototype._value = undefined;
Cache.prototype._state = Cold;

Cache.prototype.extractLeft = function Cache$extractLeft(){
  return this._state === Rejected ? [this._value] : [];
};

Cache.prototype.extractRight = function Cache$extractRight(){
  return this._state === Resolved ? [this._value] : [];
};

Cache.prototype._addToQueue = function Cache$addToQueue(rec, rej, res){
  var _this = this;
  if(_this._state > Pending) return noop;
  var i = _this._queue.push(new Queued(rec, rej, res)) - 1;
  _this._queued = _this._queued + 1;

  return function Cache$removeFromQueue(){
    if(_this._state > Pending) return;
    _this._queue[i] = undefined;
    _this._queued = _this._queued - 1;
    if(_this._queued === 0) _this.reset();
  };
};

Cache.prototype._drainQueue = function Cache$drainQueue(){
  if(this._state <= Pending) return;
  if(this._queued === 0) return;
  var queue = this._queue;
  var length = queue.length;
  var state = this._state;
  var value = this._value;

  for(var i = 0; i < length; i++){
    queue[i] && queue[i][state](value);
    queue[i] = undefined;
  }

  this._queue = undefined;
  this._queued = 0;
};

Cache.prototype.crash = function Cache$crash(error){
  if(this._state > Pending) return;
  this._value = error;
  this._state = Crashed;
  this._drainQueue();
};

Cache.prototype.reject = function Cache$reject(reason){
  if(this._state > Pending) return;
  this._value = reason;
  this._state = Rejected;
  this._drainQueue();
};

Cache.prototype.resolve = function Cache$resolve(value){
  if(this._state > Pending) return;
  this._value = value;
  this._state = Resolved;
  this._drainQueue();
};

Cache.prototype.run = function Cache$run(){
  var _this = this;
  if(_this._state > Cold) return;
  _this._state = Pending;
  _this._cancel = _this.$1._interpret(
    function Cache$fork$rec(x){ _this.crash(x); },
    function Cache$fork$rej(x){ _this.reject(x); },
    function Cache$fork$res(x){ _this.resolve(x); }
  );
};

Cache.prototype.reset = function Cache$reset(){
  if(this._state === Cold) return;
  if(this._state === Pending) this._cancel();
  this._cancel = noop;
  this._queue = [];
  this._queued = 0;
  this._value = undefined;
  this._state = Cold;
};

function cache(m){
  return new Cache(application1(cache, future, arguments), m);
}

var ChainRejTransformation = createTransformation(1, 'chainRej', {
  rejected: function ChainRejTransformation$rejected(x){ return call(this.$1, x) }
});

function chainRej(f){
  var context1 = application1(chainRej, func, arguments);
  return function chainRej(m){
    var context2 = application(2, chainRej, future, arguments, context1);
    return m._transform(new ChainRejTransformation(context2, f));
  };
}

var monad = {pred: isChain, error: invalidArgumentOf('have Chain implemented')};

function chain(f){
  var context1 = application1(chain, func, arguments);
  return function chain(m){
    var context2 = application(2, chain, monad, arguments, context1);
    return isFuture(m) ?
           m._transform(new ChainTransformation(context2, f)) :
           m[FL.chain](f);
  };
}

function done(callback){
  var context1 = application1(done, func, arguments);
  function done$res(x){
    callback(null, x);
  }
  return function done(m){
    application(2, done, future, arguments, context1);
    return m._interpret(raise, callback, done$res);
  };
}

function extractLeft(m){
  application1(extractLeft, future, arguments);
  return m.extractLeft();
}

function extractRight(m){
  application1(extractRight, future, arguments);
  return m.extractRight();
}

var CoalesceTransformation = createTransformation(2, 'coalesce', {
  rejected: function CoalesceTransformation$rejected(x){
    return new Resolve(this.context, call(this.$1, x));
  },
  resolved: function CoalesceTransformation$resolved(x){
    return new Resolve(this.context, call(this.$2, x));
  }
});

function coalesce(f){
  var context1 = application1(coalesce, func, arguments);
  return function coalesce(g){
    var context2 = application(2, coalesce, func, arguments, context1);
    return function coalesce(m){
      var context3 = application(3, coalesce, future, arguments, context2);
      return m._transform(new CoalesceTransformation(context3, f, g));
    };
  };
}

function forkCatch(f){
  var context1 = application1(forkCatch, func, arguments);
  return function forkCatch(g){
    var context2 = application(2, forkCatch, func, arguments, context1);
    return function forkCatch(h){
      var context3 = application(3, forkCatch, func, arguments, context2);
      return function forkCatch(m){
        application(4, forkCatch, future, arguments, context3);
        return m._interpret(f, g, h);
      };
    };
  };
}

function fork(f){
  var context1 = application1(fork, func, arguments);
  return function fork(g){
    var context2 = application(2, fork, func, arguments, context1);
    return function fork(m){
      application(3, fork, future, arguments, context2);
      return m._interpret(raise, f, g);
    };
  };
}

var Undetermined = 0;
var Synchronous = 1;
var Asynchronous = 2;

/*eslint consistent-return: 0 */


function invalidIteration(o){
  return typeError(
    'The iterator did not return a valid iteration from iterator.next()\n' +
    '  Actual: ' + show(o)
  );
}

function invalidState(x){
  return invalidFuture(
    'go() expects the value produced by the iterator', x,
    '\n  Tip: If you\'re using a generator, make sure you always yield a Future'
  );
}

var Go = createInterpreter(1, 'go', function Go$interpret(rec, rej, res){

  var _this = this, timing = Undetermined, cancel = noop, state, value, iterator;

  function crash(e){
    rec(wrapException(e, _this));
  }

  try{
    iterator = _this.$1();
  }catch(e){
    crash(e);
    return noop;
  }

  if(!isIterator(iterator)){
    crash(invalidArgument('go', 0, 'return an iterator, maybe you forgot the "*"', iterator));
    return noop;
  }

  function resolved(x){
    value = x;
    if(timing === Asynchronous) return drain();
    timing = Synchronous;
  }

  function drain(){
    //eslint-disable-next-line no-constant-condition
    while(true){
      try{
        state = iterator.next(value);
      }catch(e){
        return crash(e);
      }
      if(!isIteration(state)) return crash(invalidIteration(state));
      if(state.done) break;
      if(!isFuture(state.value)){
        return crash(invalidState(state.value));
      }
      timing = Undetermined;
      cancel = state.value._interpret(crash, rej, resolved);
      if(timing === Undetermined) return timing = Asynchronous;
    }
    res(state.value);
  }

  drain();

  return function Go$cancel(){ cancel(); };

});

function go(generator){
  return new Go(application1(go, func, arguments), generator);
}

function invalidDisposal(m, f, x){
  return invalidFuture(
    'hook() expects the return value from the first function it\'s given', m,
    '\n  From calling: ' + show(f) + '\n  With: ' + show(x)
  );
}

function invalidConsumption(m, f, x){
  return invalidFuture(
    'hook() expects the return value from the second function it\'s given', m,
    '\n  From calling: ' + show(f) + '\n  With: ' + show(x)
  );
}

var Hook = createInterpreter(3, 'hook', function Hook$interpret(rec, rej, res){

  var _this = this, _acquire = this.$1, _dispose = this.$2, _consume = this.$3;
  var cancel, cancelConsume = noop, resource, value, cont = noop;

  function Hook$done(){
    cont(value);
  }

  function Hook$rec(x){
    rec(wrapException(x, _this));
  }

  function Hook$dispose(){
    var disposal;
    try{
      disposal = _dispose(resource);
    }catch(e){
      return Hook$rec(e);
    }
    if(!isFuture(disposal)){
      return Hook$rec(invalidDisposal(disposal, _dispose, resource));
    }
    cancel = Hook$cancelDisposal;
    disposal._interpret(Hook$rec, Hook$disposalRejected, Hook$done);
  }

  function Hook$cancelConsumption(){
    cancelConsume();
    Hook$dispose();
    Hook$cancelDisposal();
  }

  function Hook$cancelDisposal(){
    cont = noop;
  }

  function Hook$disposalRejected(x){
    Hook$rec(new Error('The disposal Future rejected with ' + show(x)));
  }

  function Hook$consumptionException(x){
    cont = Hook$rec;
    value = x;
    Hook$dispose();
  }

  function Hook$consumptionRejected(x){
    cont = rej;
    value = x;
    Hook$dispose();
  }

  function Hook$consumptionResolved(x){
    cont = res;
    value = x;
    Hook$dispose();
  }

  function Hook$consume(x){
    resource = x;
    var consumption;
    try{
      consumption = _consume(resource);
    }catch(e){
      return Hook$consumptionException(e);
    }
    if(!isFuture(consumption)){
      return Hook$consumptionException(invalidConsumption(consumption, _consume, resource));
    }
    cancel = Hook$cancelConsumption;
    cancelConsume = consumption._interpret(
      Hook$consumptionException,
      Hook$consumptionRejected,
      Hook$consumptionResolved
    );
  }

  var cancelAcquire = _acquire._interpret(Hook$rec, rej, Hook$consume);
  cancel = cancel || cancelAcquire;

  return function Hook$fork$cancel(){
    rec = raise;
    cancel();
  };

});

function hook(acquire){
  var context1 = application1(hook, future, arguments);
  return function hook(dispose){
    var context2 = application(2, hook, func, arguments, context1);
    return function hook(consume){
      var context3 = application(3, hook, func, arguments, context2);
      return new Hook(context3, acquire, dispose, consume);
    };
  };
}

var LastlyTransformation = createTransformation(1, 'lastly', {
  rejected: function LastlyAction$rejected(x){
    return this.$1._transform(new AndTransformation(this.context, new Reject(this.context, x)));
  },
  resolved: function LastlyAction$resolved(x){
    return this.$1._transform(new AndTransformation(this.context, new Resolve(this.context, x)));
  }
});

function lastly(cleanup){
  var context1 = application1(lastly, future, arguments);
  return function lastly(program){
    var context2 = application(2, lastly, future, arguments, context1);
    return program._transform(new LastlyTransformation(context2, cleanup));
  };
}

var MapRejTransformation = createTransformation(1, 'mapRej', {
  rejected: function MapRejTransformation$rejected(x){
    return new Reject(this.context, call(this.$1, x));
  }
});

function mapRej(f){
  var context1 = application1(mapRej, func, arguments);
  return function mapRej(m){
    var context2 = application(2, mapRej, future, arguments, context1);
    return m._transform(new MapRejTransformation(context2, f));
  };
}

var functor = {pred: isFunctor, error: invalidArgumentOf('have Functor implemented')};

function map(f){
  var context1 = application1(map, func, arguments);
  return function map(m){
    var context2 = application(2, map, functor, arguments, context1);
    return isFuture(m) ?
           m._transform(new MapTransformation(context2, f)) :
           m[FL.map](f);
  };
}

var Node = createInterpreter(1, 'node', function Node$interpret(rec, rej, res){
  function Node$done(err, val){
    cont = err ? function EncaseN3$rej(){
      open = false;
      rej(err);
    } : function EncaseN3$res(){
      open = false;
      res(val);
    };
    if(open){
      cont();
    }
  }
  var open = false, cont = function(){ open = true; };
  try{
    call(this.$1, Node$done);
  }catch(e){
    rec(wrapException(e, this));
    open = false;
    return noop;
  }
  cont();
  return function Node$cancel(){ open = false; };
});

function node(f){
  return new Node(application1(node, func, arguments), f);
}

var ParallelApTransformation =
createParallelTransformation('pap', earlyCrash, earlyReject, noop, {
  resolved: function ParallelApTransformation$resolved(f){
    if(isFunction(f)) return this.$1._transform(new MapTransformation(this.context, f));
    throw typeError(
      'pap expects the second Future to resolve to a Function\n' +
      '  Actual: ' + show(f)
    );
  }
});

function pap(mx){
  var context1 = application1(pap, future, arguments);
  return function pap(mf){
    var context2 = application(2, pap, future, arguments, context1);
    return mf._transform(new ParallelApTransformation(context2, mx));
  };
}

function isFutureArray(xs){
  if(!isArray(xs)) return false;
  for(var i = 0; i < xs.length; i++){
    if(!isFuture(xs[i])) return false;
  }
  return true;
}

var futureArray = {
  pred: isFutureArray,
  error: invalidArgumentOf('be an Array of valid Futures')
};

var Parallel = createInterpreter(2, 'parallel', function Parallel$interpret(rec, rej, res){

  var _this = this, futures = this.$2, length = futures.length;
  var max = Math.min(this.$1, length), cancels = new Array(length), out = new Array(length);
  var cursor = 0, running = 0, blocked = false, cont = noop;

  function Parallel$cancel(){
    rec = noop;
    rej = noop;
    res = noop;
    cursor = length;
    for(var n = 0; n < length; n++) cancels[n] && cancels[n]();
  }

  function Parallel$run(idx){
    running++;
    cancels[idx] = futures[idx]._interpret(function Parallel$rec(e){
      cont = rec;
      cancels[idx] = noop;
      Parallel$cancel();
      cont(wrapException(e, _this));
    }, function Parallel$rej(reason){
      cont = rej;
      cancels[idx] = noop;
      Parallel$cancel();
      cont(reason);
    }, function Parallel$res(value){
      cancels[idx] = noop;
      out[idx] = value;
      running--;
      if(cursor === length && running === 0) res(out);
      else if(blocked) Parallel$drain();
    });
  }

  function Parallel$drain(){
    blocked = false;
    while(cursor < length && running < max) Parallel$run(cursor++);
    blocked = true;
  }

  Parallel$drain();

  return Parallel$cancel;

});

var emptyArray = resolve([]);

function parallel$2(max){
  var context1 = application1(parallel$2, positiveInteger, arguments);
  return function parallel(ms){
    var context2 = application(2, parallel, futureArray, arguments, context1);
    return ms.length === 0 ? emptyArray : new Parallel(context2, max, ms);
  };
}

var RaceTransformation =
createParallelTransformation('race', earlyCrash, earlyReject, earlyResolve, {});

function race(left){
  var context1 = application1(race, future, arguments);
  return function race(right){
    var context2 = application(2, race, future, arguments, context1);
    return right._transform(new RaceTransformation(context2, left));
  };
}

function ConcurrentFuture (sequential){
  this.sequential = sequential;
}

ConcurrentFuture.prototype = Object.create(Par.prototype);

function Par (sequential){
  if(!isFuture(sequential)) throw invalidFutureArgument(Par.name, 0, sequential);
  return new ConcurrentFuture(sequential);
}

var $$type = namespace + '/ConcurrentFuture@' + version;
var zeroInstance = new ConcurrentFuture(never);

// Compliance with sanctuary-type-identifiers versions 1 and 2.
// To prevent sanctuary-type-identifiers version 3 from identifying
// 'Par' as being of the type denoted by $$type, we ensure that
// Par.constructor.prototype is equal to Par.
Par['@@type'] = $$type;
Par.constructor = {prototype: Par};

Par[FL.of] = function Par$of(x){
  return new ConcurrentFuture(resolve(x));
};

Par[FL.zero] = function Par$zero(){
  return zeroInstance;
};

Par.prototype['@@type'] = $$type;

Par.prototype['@@show'] = function Par$show(){
  return this.toString();
};

Par.prototype.toString = function Par$toString(){
  return 'Par (' + this.sequential.toString() + ')';
};

Par.prototype[FL.map] = function Par$FL$map(f){
  var context = captureContext(
    nil,
    'a Fantasy Land dispatch to map via ConcurrentFuture',
    Par$FL$map
  );
  return new ConcurrentFuture(this.sequential._transform(new MapTransformation(context, f)));
};

Par.prototype[FL.ap] = function Par$FL$ap(other){
  var context = captureContext(
    nil,
    'a Fantasy Land dispatch to ap via ConcurrentFuture',
    Par$FL$ap
  );
  return new ConcurrentFuture(other.sequential._transform(
    new ParallelApTransformation(context, this.sequential)
  ));
};

Par.prototype[FL.alt] = function Par$FL$alt(other){
  var context = captureContext(
    nil,
    'a Fantasy Land dispatch to alt via ConcurrentFuture',
    Par$FL$alt
  );
  return new ConcurrentFuture(other.sequential._transform(
    new RaceTransformation(context, this.sequential)
  ));
};

function isParallel(x){
  return x instanceof ConcurrentFuture || type(x) === $$type;
}

function promise(m){
  application1(promise, future, arguments);
  return new Promise(function promise$computation(res, rej){
    m._interpret(rej, rej, res);
  });
}

var RejectAfter =
createInterpreter(2, 'rejectAfter', function RejectAfter$interpret(rec, rej){
  var id = setTimeout(rej, this.$1, this.$2);
  return function RejectAfter$cancel(){ clearTimeout(id); };
});

RejectAfter.prototype.extractLeft = function RejectAfter$extractLeft(){
  return [this.$2];
};

function alwaysNever(_){
  return never;
}

function rejectAfter(time){
  var context1 = application1(rejectAfter, positiveInteger, arguments);
  return time === Infinity ? alwaysNever : (function rejectAfter(value){
    var context2 = application(2, rejectAfter, any, arguments, context1);
    return new RejectAfter(context2, time, value);
  });
}

var parallel$1 = {pred: isParallel, error: invalidArgumentOf('be a ConcurrentFuture')};

function seq(par){
  application1(seq, parallel$1, arguments);
  return par.sequential;
}

var SwapTransformation = createTransformation(0, 'swap', {
  resolved: function SwapTransformation$resolved(x){
    return new Reject(this.context, x);
  },
  rejected: function SwapTransformation$rejected(x){
    return new Resolve(this.context, x);
  }
});

function swap(m){
  var context = application1(swap, future, arguments);
  return m._transform(new SwapTransformation(context));
}

function value(res){
  var context1 = application1(value, func, arguments);
  return function value(m){
    application(2, value, future, arguments, context1);
    function value$rej(x){
      raise(error(
        'Future#value was called on a rejected Future\n' +
        '  Rejection: ' + show(x) + '\n' +
        '  Future: ' + show(m)
      ));
    }
    return m._interpret(raise, value$rej, res);
  };
}

var F = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Future: Future$1,
  Par: Par,
  after: after,
  alt: alt,
  and: and,
  ap: ap,
  attempt: attempt,
  attemptP: attemptP$1,
  bichain: bichain,
  bimap: bimap,
  both: both,
  cache: cache,
  chain: chain,
  chainRej: chainRej,
  coalesce: coalesce,
  debugMode: debugMode,
  default: Future$1,
  done: done,
  encase: encase,
  encaseP: encaseP,
  extractLeft: extractLeft,
  extractRight: extractRight,
  fork: fork,
  forkCatch: forkCatch,
  go: go,
  hook: hook,
  isFuture: isFuture,
  isNever: isNever,
  lastly: lastly,
  map: map,
  mapRej: mapRej,
  never: never,
  node: node,
  pap: pap,
  parallel: parallel$2,
  promise: promise,
  race: race,
  reject: reject,
  rejectAfter: rejectAfter,
  resolve: resolve,
  seq: seq,
  swap: swap,
  value: value
});

// ts-check

// //Only needed for testing
// import {  after, both, chain, map, fork } from 'fluture';
// import { repeat } from './jsUtils.js' 

const RE = {};

const groupByWithCalcUnc = (cond, keyOp) => data => {

  const opsToApply = Object.entries(keyOp);

  const groupObj = data.reduce(
    (acum, current, index) => {
      const indexRow = cond(current);
      opsToApply.forEach(
        ([key, opFunc]) => {
          acum[indexRow] = acum[indexRow] ?? {};
          acum[indexRow][key] = opFunc(acum[indexRow]?.[key], current?.[key], acum[indexRow], current );
        }
      );
      acum[indexRow] = { ...current, ...acum[indexRow] };
      return acum
    },
    {}
  );

  return Object.values(groupObj)
};

const groupByWithCalc = curryN(2, groupByWithCalcUnc);
RE.groupByWithCalc = groupByWithCalc;
// RE.groupByWithCalc(
//   (row) => row.date,
//   {
//     total:(acum,current) => (acum??0) + current,
//     count:(acum,current) => (acum??0) + 1,
//     line:(acum,current) => acum??current,
//     listOfLines:(acum,current, acumRow, currentRow) =>{(acum=acum??[]).push(currentRow.line); return acum},
//     rowCalc:(acum,_,acumRow, currentRow) => (acum??0) + currentRow.line + currentRow.total
//   },
// )(
//   [
//     {date:'2020-01-02', line:1, total:6}, 
//     {date:'2020-01-03', line:2, total:5}, 
//     {date:'2020-01-02', line:3, total:11}, 
//     {date:'2020-01-03', line:4, total:6}, 
//     {date:'2020-01-02', line:5, total:-5}
//   ]
// )//?

const innerRightJoinWithUnc = (joinCond, transform = (k, l, r) => r, left, right) => {

  const joinCondCurry = uncurryN(2, joinCond);
  return chain$1(rightRow => {

    const mergeRecords = pipe$1(
      filter(joinCondCurry(__, rightRow)),
      map$1(mergeWithKey(transform, __, rightRow))
    )(left);

    if (mergeRecords.length === 0) return rightRow

    return mergeRecords

  })(right)

};
const innerRightJoinWith = curryN(4, innerRightJoinWithUnc);
RE.innerRightJoinWith = innerRightJoinWith;
// RE.innerRightJoinWith(
//   (l,r) => l.date === r.date,
//   (k, l, r) => k==='total' 
//     ? l + r
//     : r,
//   [{date:'2020-01-02', total:6},  {date:'2020-01-08', total:8}, {date:'2020-01-03', total:5}]
// )
// (
//   [{date:'2020-01-02', total:11},  {date:'2020-01-09', total:9}, {date:'2020-01-03', total:6}]
// )//?

function unionWithHashKeysUnc(isAsc, hashAddNoDups, addNoDupsToTheEnd, hashMaster, master) {
  const union = new Map();

  for (let elem of master) {
    union.set(hashMaster(elem), elem);
  }

  for (let elem of addNoDupsToTheEnd) {
    if (union.get(hashAddNoDups(elem)) === undefined) union.set(hashAddNoDups(elem), elem);
  }

  if (isAsc === true || isAsc === false) {
    return Array.from(union.entries()).sort(sorterByPaths('0', isAsc)).map(elem => elem[1])
  }

  return Array.from(union.values())
}
const unionWithHashKeys = curryN(5, unionWithHashKeysUnc);
RE.unionWithHashKeys = unionWithHashKeys;
// RE.unionWithHashKeys(undefined,
//   elem=>elem.date,
//   [{date:'2020-01-02', a:4},{date:'2020-01-03'}],
//   elem=>elem.date
// )(
//   [{date:'2020-01-01'},{date:'2020-01-02',a:1}]
// )//?


function isOldLessThanNew(hashOldRecords, hashNewRecords) {
  if (hashOldRecords === hashNewRecords) return false

  if (hashNewRecords === undefined) return true
  if (hashOldRecords < hashNewRecords) return true

  return false
}

function isOldGreatThanNew(hashOldRecords, hashNewRecords) {
  if (hashOldRecords === hashNewRecords) return false

  if (hashOldRecords === undefined) return true
  if (hashOldRecords > hashNewRecords) return true

  return false
}

function callFuncOrUndefinedIfError(value, func) {
  try {
    return func(value)
  } catch (err) {
    return undefined
  }
}

function updateWithHashKeysUnc(isAsc, getHashNewRecords, newRecords, getHashOldRecords, oldRecords) {
  const union = new Map();

  let hashNewRecords = callFuncOrUndefinedIfError(newRecords[0], getHashNewRecords);
  let hashOldRecords = callFuncOrUndefinedIfError(oldRecords[0], getHashOldRecords);

  for (let i = 0, j = 0; i < newRecords.length || j < oldRecords.length;) {
    if (isOldLessThanNew(hashOldRecords, hashNewRecords)) {
      if (union.get(hashOldRecords) === undefined) union.set(hashOldRecords, oldRecords[j]);
      j++;
      hashOldRecords = callFuncOrUndefinedIfError(oldRecords[j], getHashOldRecords);
    } else {
      if (isOldGreatThanNew(hashOldRecords, hashNewRecords)) {
        union.set(hashNewRecords, newRecords[i]);
        i++;
        hashNewRecords = callFuncOrUndefinedIfError(newRecords[i], getHashNewRecords);
      } else {
        union.set(hashNewRecords, newRecords[i]);
        i++;
        j++;

        hashNewRecords = callFuncOrUndefinedIfError(newRecords[i], getHashNewRecords);
        hashOldRecords = callFuncOrUndefinedIfError(oldRecords[j], getHashOldRecords);
      }
    }
  }

  if (isAsc === true || isAsc === false) {
    return Array.from(union.entries()).sort(sorterByPaths('0', isAsc)).map(elem => elem[1])
  }

  return Array.from(union.values())
}
const updateWithHashKeys = curryN(5, updateWithHashKeysUnc);
RE.updateWithHashKeys = updateWithHashKeys;
// RE.updateWithHashKeys(
//   true,
//   elem=>elem.date,
//    [{date:'2020-01-08'},{date:'2020-01-03'},{date:'2020-01-02',a:2},{date:'2020-01-05',a:1}],
//    elem=>elem.date
// )(
//   [{date:'2020-01-08',a:4},{date:'2020-01-01',a:1},{date:'2020-01-05',a:5}]
// )//?

// RE.updateWithHashKeys(
//   undefined,
//   elem=>elem.date,
//    [{date:'2020-01-01'},{date:'2020-01-03'},{date:'2020-01-05',a:2},{date:'2020-01-08',a:1}],
//    elem=>elem.date
// )(
//   [{date:'2020-01-02',a:4},{date:'2020-01-03',a:1},{date:'2020-01-08',a:5}]
// )//?



const between = curry((l, r) => (both$1(gte(__, l), lt(__, r))));
RE.between = between;

const matchById = (l, r) =>
  isNil$1(l) === false
  && isNil$1(r) === false
  && ((l.id || l.Id || l.ID) === (r.id || r.Id || r.ID))
  && ((l.id || l.Id || l.ID) !== undefined);


const matchByPropId = curryN(2, matchById);
RE.matchByPropId = matchByPropId;

// Returns matching in 1st index and filtered out in 0 index... followin success goes to the end rule.
function splitCondUnc(condFun, array) {
  return reduce((acu, cur) => {
    if (condFun(cur)) return update(1, append(cur, acu[1]), acu)
    else return update(0, append(cur, acu[0]), acu)
  }, [[], []])
}
const splitCond = curryN(2, splitCondUnc);
RE.splitCond = splitCond;

const filterMap = curry(
  (filter, map, data) => 
    data.reduce(
      (acum, current, index, data) => {
        if (filter(current, index, data)) {
          acum.push(map(current, index, data));
        }
        return acum
      }, 
      []
    )
);
RE.filterMap = filterMap;

const mapWithNext = curry(
  (mapper, endValue, array) =>
    array.map(
      (elem, index) => {
        let nextValue;
        if (index === array.length - 1) nextValue = endValue;
        else nextValue = array[index + 1];
        return mapper(elem, nextValue)
      }
    )
);
RE.mapWithNext = mapWithNext;

const mapWithPrevious = curry(
  (mapper, iniValue, array) =>
    array.map(
      (elem, index) => {
        let previousValue;
        if (index === 0) previousValue = iniValue;
        else previousValue = array[index - 1];
        return mapper(previousValue, elem)
      }
    )
);
RE.mapWithPrevious = mapWithPrevious;


const exclude = curry(
  (fieldToRemove, valuesToRemove, fieldSubject, subjectArray) => 
    subjectArray.filter(
      (subjectEl) => {
        let finalSubjectEl = subjectEl;
    
        
        if(fieldSubject !== undefined && fieldSubject !== null && typeof fieldSubject !== 'function') 
          finalSubjectEl = subjectEl[fieldSubject];
    
        if(fieldSubject !== undefined && fieldSubject !== null && typeof fieldSubject === 'function') 
          finalSubjectEl = fieldSubject(subjectEl);
    
        return !valuesToRemove.find(
          (valToRemove) => {
            let finalValToRemove = valToRemove;
            if(fieldToRemove !== undefined && fieldToRemove !== null && typeof fieldToRemove !== 'function') 
              finalValToRemove = valToRemove[fieldToRemove];
    
            if(fieldToRemove !== undefined && fieldToRemove !== null && typeof fieldToRemove === 'function') 
              finalValToRemove = fieldToRemove(valToRemove);
    
            return finalSubjectEl === finalValToRemove
          } 
        )
      }    
    )
);
RE.exclude = exclude;
// exclude('id',[{id:2},{id:6}], undefined, [1,2,3,4,5,6,7,8]) //?
// exclude('id',[{id:2},{id:6}], 'key', [{key:1, age:1},{key:2, age:2},{key:4, age:4},{key:5, age:5}]) //?
// exclude(
//   (el=>el.date.toISOString()),
//   [{date:new Date('2023-01-01')},{date:new Date('2023-03-03')}],
//   (el=>el.myDate.toISOString()),
//   [{myDate:new Date('2023-01-12'),a:2}, {myDate:new Date('2023-01-01')},{myDate:new Date('2023-01-12'),a:8},{myDate:new Date('2023-01-04')},{myDate:new Date('2023-03-03')}, {myDate:new Date('2023-03-01')}],
// )//?

const n0IsNotUnfold =
  pipe$1(
    propEq('0', 'unfold'),
    not
  );

const n1IsFunction =
  pipe$1(
    prop('1'),
    type$1,
    equals('Function')
  );

function something(lib) {
  return (...args) =>
    pipe$1(
      // Convert to an array of for each function with array of 2 elements: 0 (key) name of function, 1 (value) function
      Object.entries,
      RE.filterMap(
        both$1(
          n0IsNotUnfold,
          n1IsFunction
        ),
        chain$1(
          // add a 3rd value. Now we will have 0: name function, 1: function, 2 result
          append,
          pipe$1(
            //R.tap(R.pipe(R.prop('0'),console.log)),
            prop('1'),
            tryCatch(
              pipe$1(
                //R.uncurryN(args.length),
                fun => {
                  const funU = uncurry(true)(fun);
                  const firstResult = funU(...clone(args));

                  if (typeof firstResult[0] === 'function' && args.length > 1) {
                    return funU(clone(...init(args)))(clone(last(args)))
                  }
                  return firstResult
                }
              ),
              (exc, fun) => {
                try {
                  return [
                    fun(clone(...init(args)))(clone(last(args))),
                    '(all,arguments,but)(last)'
                  ]
                } catch (e) {
                  return ['error']
                }
              }
            ),
            //R.tap(console.log)//(R.pipe(R.prop('2'),console.log)),
          )
        )
      )
    )(lib)
}

/* Returns:
[ { fun: 'applySpec', sign: '(object)(object)' },
  { fun: 'juxt', sign: '(object)(object)' } ]
*/
//findSolution([{a:2},{a:2,b:2}, 7], something(R)([obj=>obj,obj=>({...obj, b:2}), obj=>obj.a+5], {a:2})) //?

/*
  findSolution(solution, something(R)(param1, param2, param3))

  Find the function in the library (this case R) that calling using the params gives the input solution.

  for example below: 
    We need to find a function in R that given the parameters 4,3 the result is 7. Of course it is R.add
*/
//const Rsomething = something(R)
//findSolution(7, Rsomething(4, 3)) //?
//
// findSolution(
//   [[true,false],[1,{a:2},3]], 
//   something(R)(
//     (elem)=> typeof elem === 'boolean'?0:1,
//     [true, 1, {a:2},false,3]
//   )
// ) //? [ { fun: 'collectBy', sign: '(function,object)' } ]

function findSolution(solutionToFind, solutions) {
  return tryCatch(
    pipe$1(
      filter(
        (solution) => equals(solution[2][0], solutionToFind)
      ),
      map$1(applySpec({ fun: prop('0'), sign: path(['2', '1']) }))
    ),
    () => []
  )(solutions)
}

function partialAtPos(fun, pos) {
  return (...paramValues) => {
    let funAcum = fun;
    let count = 0;
    if (pos === 0) return funAcum(...paramValues)

    const iteFun = (...params) => {
      if (count >= pos) return funAcum(...paramValues)(...params)

      funAcum = funAcum(...params);
      count = count + params.length;

      if (count >= pos) return funAcum(...paramValues)

      return iteFun
    };

    return iteFun
  }
}
RE.partialAtPos = partialAtPos;
// const nestedFun = (a,b) => c => (d,e) => f => console.log(a,b,c,d,e,f)
// partialAtPos(nestedFun, 3)('jose','Luchi')('a','b')('c')('d')
// partialAtPos(nestedFun, 5)('jose')('a','b')('c')('d','e')


function uncurry(withLog = false) {
  return function uncurryWithOrWithoutLog(funcParam) {
    let prevConsumedUpTo = 0;
    let func = funcParam;
    let howWasCalled = '';

    return uncurryFunc

    function uncurryFunc(...args) {
      let end, listOfArgs;
      while (prevConsumedUpTo < args.length && typeof func === 'function') {
        if (func.length === 0) end = args.length;
        else end = prevConsumedUpTo + func.length;

        listOfArgs = args.slice(prevConsumedUpTo, end);
        prevConsumedUpTo = end;

        if (typeof func === 'function') {
          howWasCalled = `${howWasCalled}(${listOfArgs.map((elem) => typeof elem).join(',')})`;

          func = func(...listOfArgs);
        }
      }

      if (typeof func === 'function')
        return withLog ? [uncurryWithOrWithoutLog(func), howWasCalled] : uncurryWithOrWithoutLog(func)

      return withLog ? [func, howWasCalled] : func
    }
  }
}

function createReject(baseObject, elem) {
  return baseObject.constructor(
    (rej, res) => {
      rej(elem);
      return (() => { })
    }
  )
}

function isAcumAFutureAndElemAnError(acum, elem) {
  return elem instanceof Error && acum?.constructor?.name === 'Future'
}

function isAcumAPromiseAndElemAnError(acum, elem) {
  return elem instanceof Error && isPromise(acum)
}

const pipeWithChain = function (...func) {
  return function (...params) {
    return func.reduce(
      // iterate over functions to call in a specific way with the acum value. 
      (acum, currentPipeFunc, index$1) => {

        let chainFun;
        let pipeFunc = currentPipeFunc;

        // First function accepts multiVariant function... but there must meet certain condition.
        if (index$1 === 0 && acum.length > 1) {
          const numberOfFutures = acum.filter(param => param?.constructor?.name === 'Future').length;
          if (numberOfFutures > 1)
            acum[acum.length - 1] = reject(new Error('Only one Future allowed...'));
          else
            if (numberOfFutures === 1 && last(acum)?.constructor?.name !== 'Future')
              acum[acum.length - 1] = reject(new Error('Future param must be the last param of the function'));
            else
              //Apply all the parameters to convert it to a unary function.
              pipeFunc = currentPipeFunc?.bind(undefined, ...acum.slice(0, acum.length - 1));
        }

        // Then extract last parameter
        if (index$1 === 0) {
          acum = acum[acum.length - 1];
        }

        if (acum instanceof Error) {
          return acum
        }

        // Try to find a chain kind of method for the accumlated drag value
        if (typeof acum?.chain === 'function')
          chainFun = acum.chain;
        else if (typeof acum?.['fantasy-land/chain'] === 'function')
          chainFun = acum['fantasy-land/chain'].bind(acum);
        else if (typeof acum?.flatMap === 'function')
          chainFun = acum.flatMap.bind(acum);

        // if acum is a chain type the pipeFunc will be executed inside the chain.
        if (chainFun) {
          return chainFun(
            (elem) => {
              if (isAcumAFutureAndElemAnError(acum, elem)) {
                return createReject(acum, elem)
              }

              let result;

              // For flutures we try catch so there will be transformed in a reject,
              if (acum?.constructor?.name === 'Future') {
                try {
                  result = pipeFunc(elem);
                } catch (e) {
                  result = e;
                }
              } else
              {
                // Exceptions in pipeFunc will need to be handle by the caller in sync calls.
                result = pipeFunc(elem);
              }

              if (isAcumAFutureAndElemAnError(acum, result)) {
                return createReject(acum, result)
              }

              // inside chainFun the return needs to be of the same type as the original acum drag value.
              // else we wrap the result using the constructor.
              if (result?.constructor?.name === acum?.constructor?.name)
                return result
              else {
                if (typeof acum?.constructor?.of === 'function') return acum.constructor.of(result)
                if (typeof acum?.constructor?.['fantasy-land/of'] === 'function') return acum.constructor['fantasy-land/of'](result)

                return result
              }
            }
          )
        }

        // If acum drag value is not chainable we execute pipeFunc in a normal way.
        return pipeFunc(acum)
      }
      , params
    )

  }
};

RE.pipeWithChain = pipeWithChain;

// Example with Future monad
// last parameter (and only this one) must be wrapped in a Future as in ((5, resolve(6)), and resolve(6) gives us that.
// pipeWithChain will chain the function (called flatmap as well). It means to descend the function to be executed with the unwrapepd value. 
// Chain always wraps the function return value... BUT if this value is already wrapped it will collapsed the two nested wraps into one,
// flatting the structure. then we will use this wrap value in the next function and so on.
// RE.pipeWithChain(
//   (x,y) => x+y,
//   x => x * 2,
//   x => resolve([x+8, x+3]),
//   x => resolve([x[0] +2, x[1] + 4]),
//   x => x.filter(elem => elem > 15)
// )(5, 6)
// .pipe(fork(RLog('pipeWithChain-Ex1-Err: '))(RLog('pipeWithChain-Ex1-OK: ')))

// // //
// // // Example with Array monad
// RE.pipeWithChain(
//   (x,y) => x+y,
//   (x) => (x+1)/2,
//   x => [x * 2, x+5],
//   //x => { throw new Error('asdas') },
//   x => [x+5, x*2]
// )(5, 6)
// .filter(elem => elem >= 17)//?

// // Example with Future and Array monad mixed
// RE.pipeWithChain(
//   R.map(
//     R.pipe (
//       R.add(2),
//       R.divide(3)
//     )
//   )
// )(resolve([1,2,3,4,56]))
// .pipe(fork(RLog('pipeWithChain-Ex2-Err: '))(RLog('pipeWithChain-Ex2-OK: ')))

// // Example with error
// RE.pipeWithChain(
//   (x,y) => x+y,
//   x => resolve([x+8, x+3]),
//   x => new Error('My controlled error...'),
//   x => x.filter(elem => elem > 15)
// )(5, 6)
// .pipe(fork(RLog('pipeWithChain-Ex3-Err: '))(RLog('pipeWithChain-Ex3-OK: ')))

// RE.pipeWithChain(
//   (x,y) => x+y,
//   x => new Error('My controlled error...'),
// )(5, 6).message //?


// RE.pipeWithChain(
//   (x,y) => x+y,
//   x => reject('my error...'),
//   x=>x+3
// )(5, 6)
// .pipe(fork(RLog('pipeWithChain-Ex4-Err: '))(RLog('pipeWithChain-Ex4-OK: ')))

// // Example with throw error
// RE.pipeWithChain(
//   (x,y) => x+y,
//   x => resolve([x+8, x+3]),
//   // throw new error for flutures are transform to reject.
//   x => {throw new Error('aaaa')},
//   x => x.filter(elem => elem > 15)
// )(5, 6)
// .pipe(fork(RLog('pipeWithChain-Ex5-Err: '))(RLog('pipeWithChain-Ex5-OK: ')))

// // Example with throw error
// RE.pipeWithChain(
//   (x,y) => x,
//   x => x +2,
// )(5, reject(10))
// .pipe(fork(RLog('pipeWithChain-Ex6-Err: '))(RLog('pipeWithChain-Ex6-OK: ')))

// // Passing a Future as a parameter. Remember this must be the last one.
// RE.pipeWithChain(
//   (x,y) => x + y,
//   x => x + ' --- The End!!! ---',
// )('the value after 5ms is: ', after(5)('5'))
// .pipe(fork(RLog('pipeWithChain-Ex7-Err: '))(RLog('pipeWithChain-Ex7-OK: ')))

// // Example with throw error
// RE.pipeWithChain(
//   (x,y) => x,
//   x => x +2,
// )(5, new Error('return error')).message //?

// // Note!: Arrays passing through each function of the pipeWithChain will be flatmap
// RLog
//   ('pipe doesnt apply flatmap to arrays: ')
//   (
//     RE.pipe(
//       R.identity
//     )([['a','b'], ['c','d']])
//   )

// Same as pipe with chain but arrays are not chainable:
const pipe = function (...func) {
  return function (...params) {
    return func.reduce(
      // iterate over functions to call in a specific way with the acum value. 
      (acum, currentPipeFunc, index$1) => {

        let chainFun;
        let pipeFunc = currentPipeFunc;

        // First function accepts multiVariant function... but there must meet certain condition.
        if (index$1 === 0 && acum.length > 1) {
          const numberOfFutures = acum.filter(param => param?.constructor?.name === 'Future').length;
          if (numberOfFutures > 1)
            acum[acum.length - 1] = reject(new Error('Only one Future allowed...'));
          else
            if (numberOfFutures === 1 && last(acum)?.constructor?.name !== 'Future')
              acum[acum.length - 1] = reject(new Error('Future param must be the last param of the function'));
            else
              //Apply all the parameters to convert it to a unary function.
              pipeFunc = currentPipeFunc?.bind(undefined, ...acum.slice(0, acum.length - 1));
        }

        // Then extract last parameter
        if (index$1 === 0) {
          acum = acum[acum.length - 1];
        }

        if (acum instanceof Error) {
          return acum
        }

        // Try to find a chain kind of method for the accumlated drag value
        if (typeof acum?.chain === 'function')
          chainFun = acum.chain;
        else if (typeof acum?.['fantasy-land/chain'] === 'function')
          chainFun = acum['fantasy-land/chain'].bind(acum);
        else if (isPromise(acum))
          chainFun = acum.then.bind(acum);
        //else if (typeof acum?.flatMap === 'function')
        //  chainFun = acum.flatMap.bind(acum)

        // if acum is a chain type the pipeFunc will be executed inside the chain.
        if (chainFun) {
          return chainFun(
            (elem) => {
              if (isAcumAFutureAndElemAnError(acum, elem)) {
                return createReject(acum, elem)
              }

              let result;

              // For flutures we try catch so there will be transformed in a reject,
              if (acum?.constructor?.name === 'Future' || isPromise(acum)) {
                try {
                  result = pipeFunc(elem);
                } catch (e) {
                  result = e;
                }
              } else 
              {
                // Exceptions in pipeFunc will need to be handle by the caller in sync calls.
                result = pipeFunc(elem);
              }

              if (isAcumAFutureAndElemAnError(acum, result)) {
                return createReject(acum, result)
              }

              if (isAcumAPromiseAndElemAnError(acum, result)) {
                return acum.then(() => Promise.reject(result))
              }

              // inside chainFun the return needs to be of the same type as the original acum drag value.
              // else we wrap the result using the constructor.
              if (result?.constructor?.name === acum?.constructor?.name)
                return result
              else {
                if (typeof acum?.constructor?.of === 'function') return acum.constructor.of(result)
                if (typeof acum?.constructor?.['fantasy-land/of'] === 'function') return acum.constructor['fantasy-land/of'](result)

                return result
              }
            }
          )
        }

        // If acum drag value is not chainable we execute pipeFunc in a normal way.
        return pipeFunc(acum)
      }
      , params
    )

  }
};

RE.pipe = pipe;

// RLog
//   ('pipe doesnt apply flatmap to arrays: ')
//   (
//     RE.pipe(
//       R.identity
//     )([['a','b'], ['c','d']])
//   )


// RE.pipe(
//   R.identity,
//   RLog('RLog print the whole array in one go. RLog is not iterated as it would in pipeWithChain ')
// )([['a','b'], ['c','d']])

// // Example with error
// RE.pipe(
//   (x,y) => x+y,
//   x => resolve([x+8, x+3]),
//   x => new Error('My controlled error...'),
//   x => x.filter(elem => elem > 15)
// )(5, 6)
// .pipe(fork(RLog('pipeWithChain-Ex3-Err: '))(RLog('pipeWithChain-Ex3-OK: ')))


// // Example with Future reject(error)
// RE.pipe(
//   (x,y) => x+y,
//   x => reject('my error...'),
//   x=>x+3
// )(5, 6)
// .pipe(fork(RLog('pipe-Ex4-Err: '))(RLog('pipe-Ex4-OK: ')))

// // Example with Promise.reject(error)
// RE.pipe(
//   (x,y) => x+y,
//   x => Promise.reject('my error...'),
//   x=>x+3
// )(5, 6)
// .then(RLog('pipe-Ex5-OK: '),RLog('pipe-Ex5-Err: ') )


// // Example with throw error Future
// RE.pipe(
//   (x,y) => x+y,
//   x => resolve([x+8, x+3]),
//   // throw new error for flutures are transform to reject.
//   x => {throw new Error('aaaa')},
//   x => x.filter(elem => elem > 15)
// )(5, 6)
// .pipe(fork(RLog('pipeWithChain-Ex6-Err: '))(RLog('pipeWithChain-Ex6-OK: ')))

// // Example with throw error Promise
// RE.pipe(
//   (x,y) => x+y,
//   x => Promise.resolve([x+8, x+3]),
//   // throw new error for flutures are transform to reject.
//   x => {throw new Error('aaaa')},
//   x => x.filter(elem => elem > 15)
// )(5, 6)
// .then(RLog('pipe-Ex7-OK: '),RLog('pipe-Ex7-Err: ') )

// // Example with throw error sync
// // Exeption is raised up in sync mode vs async
// // where exception is transjform in rejec(exception)
// try {
//   RE.pipe(
//     (x,y) => x+y,
//     x => {throw new Error('aaaa')},
//     x => x.filter(elem => elem > 15)
//   )(5, 6)
// } catch(e)
// {
//   console.log('Sync failed with: ', e)
// }

const pipeWhile = (funCond, ini) => (...funcs) => (...inputs) => {
  if (
    typeof funCond !== 'function' ||
    funcs.some(func => typeof func !== 'function') ||
    (ini !== undefined && typeof ini !== 'function')
  ) {
    const dataErrorString =
      `funCond: ${typeof funCond} ${ini === undefined ? '' : 'ini: ' + typeof ini} funcs: ${funcs.map(el => typeof el)}`;
    throw new Error(`pipeWhile was called without funcfion/s in funCond or pipe functions ${dataErrorString}`)
  }

  if (typeof ini === 'function') ini(...inputs);

  let finalReturn = inputs;
  while (funCond(...finalReturn)) {
    finalReturn = funcs.reduce(
      (acum, func) => [func(...acum)],
      finalReturn
    );
  }

  return last(finalReturn)
};
RE.pipeWhile = pipeWhile;

// pipeWhile(x => x < 20)
// (
//  x => x + 2
// )(2) //?

function parallel(numberOfthreads = Infinity) {
  return futuresOrValues =>
    parallel$2
      (numberOfthreads)
      (futuresOrValues.map(elem => isFuture(elem) ? elem : resolve(elem)))
}
RE.parallel = parallel;

const runFutureFunctionsInParallel =
  (numberOfThreads = Infinity) =>
    (functionsToRunInParallel) =>
      data =>
        RE.parallel(numberOfThreads)
          (
            functionsToRunInParallel.map(fun => fun(data))
          );
RE.runFutureFunctionsInParallel = runFutureFunctionsInParallel;


const runFunctionsSyncOrParallel =
  (numberOfFunctionsToRunInParallel = Infinity) =>
    (functionsToRun) =>
      data => {
        if (!(numberOfFunctionsToRunInParallel > 0))
          throw new CustomError('NUMBEROFFUNCTIONSTORUNINPARALLEL_MUST_BE_BETWEEN_0_TO_INFINITY')

        let activeFunctions = 0;
        let nextIndex = 0;
        let globalTypeSync = 'sync';
        let currentTypeSync = 'sync';
        let resultWithValuesPromisesOrFuture = [];


        return run()
        function run() {

          if (nextIndex >= functionsToRun.length) return finalResult()

          if (currentTypeSync === 'promise' && activeFunctions >= numberOfFunctionsToRunInParallel) {
            activeFunctions--;
            return last(resultWithValuesPromisesOrFuture).then(run)
          } else {
            resultWithValuesPromisesOrFuture[nextIndex] = functionsToRun[nextIndex](data);
            setGlobalTypeSync(resultWithValuesPromisesOrFuture[nextIndex]);
            if (currentTypeSync === 'promise') activeFunctions++;
            nextIndex++;
            return run()
          }
        }

        function finalResult() {
          if (globalTypeSync === 'future') {
            return RE.parallel
              (numberOfFunctionsToRunInParallel)
              (resultWithValuesPromisesOrFuture)
          }

          if (globalTypeSync === 'promise') {
            return Promise.all(resultWithValuesPromisesOrFuture)
          }

          return resultWithValuesPromisesOrFuture
        }

        function setGlobalTypeSync(task) {
          currentTypeSync =
            isFuture(task)
              ? 'future'
              : isPromise(task)
                ? 'promise'
                : 'sync';

          if (globalTypeSync === 'sync')
            globalTypeSync = currentTypeSync;

          if (currentTypeSync !== 'sync' && globalTypeSync !== currentTypeSync)
            throw new CustomError('MIX_PROMISE_AND_FUTURE', `Promises and future cannot be mixed ${globalTypeSync} ${currentTypeSync}`)

        }

      };

RE.runFunctionsSyncOrParallel = runFunctionsSyncOrParallel;

//runFunctionsSyncOrParallel(2)([()=>Promise.resolve(3), ()=>4])() //?

function pickPathsUnc(pickTransformations, obj) {

  if (Array.isArray(pickTransformations) === false) return pickPathsUnc([pickTransformations], obj)

  return pickTransformations.reduce(
    (acum, pickObj) => {
      let pickObjToProcess = pickObj;
      if (typeof pickObj === 'string') pickObjToProcess = { path: pickObj };

      let { path: path$1, name, apply } = pickObjToProcess;

      let paths = path$1.split('.');
      if (name === undefined) name = last(paths);

      let valueAtPath = path(paths, obj);
      acum[name] =
        typeof apply === 'function'
          ? apply(valueAtPath)
          : valueAtPath;

      return acum
    }
    , {}
  )
}
const pickPaths = curryN(2, pickPathsUnc);
RE.pickPaths = pickPaths;
// pickPaths(
//   //'a.1.b'
//   //['a.1.b', 'c.0.d']
//   //{path:'a.1.b', name:'x'}
//   //{path:'a.1.b', apply: toFixed(2)}
//   //{path:'a.1.b', name:'x', apply: toFixed(2)}
//   [{ path: 'a.1.b', name: 'x', apply: toFixed(2) }, { path: 'c.0.d' }]
// )
//   (
//     {
//       a: [{},
//       {
//         c: 3,
//         b: 6.32321,
//         d: 1
//       }, {}
//       ],
//       c: [{ d: 8.54332 }]
//     }
//   ) //?


function mergeArrayOfObjectsRenamingPropsUnc(newValues, propPaths, original) {
  const offset = newValues.length - original.length;

  return original.map(
    (elem, index) =>
    ({
      ...elem,
      ...pickPaths(propPaths, newValues[index + offset])
    })
  )
}
const mergeArrayOfObjectsRenamingProps = curryN(3, mergeArrayOfObjectsRenamingPropsUnc);
RE.mergeArrayOfObjectsRenamingProps = mergeArrayOfObjectsRenamingProps;
// mergeArrayOfObjectsRenamingProps(
//   [{ close: 5 }, { close: 6 }, { close: 30 }, { close: 50 }],
//   [{ path: 'close', name: 'gspc' }, { path: 'close', name: 'anotherCopy' }],
//   [{ close: 3 }, { close: 2 }]
// )//?


function RLog(prefixOrFormatter) {
  return (...obj) => {
    if(typeof prefixOrFormatter === 'function') {
      const cloneObj = collectionClone(obj);
      console.log(prefixOrFormatter(...cloneObj));
    }else console.log(prefixOrFormatter, ...obj);

    return last(obj)
  }
}

// RLog('test')('a','b',[1,2,'test']) //?
// RLog(
//   (x,y,z)=> {
//     // changing values in object doesn't change the return value.
//     z[2].a=z[2].a.toUpperCase()
//     return `param1: ${x} param2: ${y} param3[0]: ${z[0]} param3[1]: ${z[1]} param3[2].a: ${z[2].a}`
//   })
//   ('a','b',[1,2,{a:'test'}]) //?

RE.RLog = RLog;
RE.findSolution = findSolution;
RE.something = something;
RE.uncurry = uncurry;

function center(text, size) {
  let sizeInt = parseInt(size, 10);
  if (typeof text !== 'string' || isNaN(sizeInt)) return text

  const trimText = text.trim();
  if (trimText.length >= sizeInt) return trimText

  const leftPadding = Math.floor((sizeInt - trimText.length) / 2);
  const rightPadding = sizeInt - trimText.length - leftPadding;

  return ''.padEnd(leftPadding) + trimText + ''.padEnd(rightPadding)
}

function left(text, size) {
  let sizeInt = parseInt(size, 10);
  if (typeof text !== 'string' || isNaN(sizeInt)) return text

  const trimText = text.trim();
  if (trimText.length >= sizeInt) return trimText

  return trimText.padEnd(sizeInt)
}

function putCenteredValueAtPosIfFit(line, value, pos, margins) {
  let valueStr = '' + value;
  let rightHalf = Math.floor((valueStr.length - 1) / 2);
  let leftHalf = valueStr.length - 1 - rightHalf;
  if (
    line.length < pos + rightHalf + margins ||
    line
      .substring(pos - leftHalf - margins, pos + rightHalf + margins)
      .split('')
      .some((el) => el !== ' ')
  )
    return line
  else {
    return line.substring(0, pos - leftHalf) + valueStr + line.substring(pos + rightHalf + 1)
  }
}

//let asas =               'ms 0 2300  112  ' //?
//putInLineScaleValueAtPos('ms 0 2300       ', 112, 12, 2) //?

function putValueAtPos(line, value, pos) {
  return line.substring(0, pos) + value + line.substring(pos + value.length)
}

function Text({ HEADING_IDENTATION, ROW_IDENTATION } = { HEADING_IDENTATION: center, ROW_IDENTATION: left }) {
  let size;
  let id;
  let title;
  let data;

  return {
    loadParams: paramId => paramTitle => {
      id = paramId;
      title = paramTitle;

      return {
        id,

        load: columnData => {
          data = columnData;
          size = data.reduce(
            (acum, current) => {
              let currentCellLength = ('' + (current??'')).length;
              if(acum < currentCellLength)
                return currentCellLength
              else
                return acum
            }
            , title.length
          );
        },

        getSize: () => size,

        heading: {
          nextValue: function* () {
            yield HEADING_IDENTATION(title, size);
          }
        },
        
        row: {
          nextValue: function* () {
            for (let el of data)
              yield ROW_IDENTATION(''+ (el ?? ''), size);
          }
        }
      }
    }
  }
}

const Index = Symbol();

function Table(data) {
  let tableData;

  if(Array.isArray(data)) {
    tableData = data.map((row, index) => {
      if(typeof row === 'object') return {[Index]: index, ...row}
      else return {[Index]: index}
    });
  }

  if(typeof data === 'object' && Array.isArray(data) === false) {
    tableData = Object.entries(data).map(([key, value]) => {
      if(typeof value === 'object') return {[Index]: key, ...value}
      else return value = {[Index]: key}
    });
  }
  
  const VERTICAL_LINE_CHAR = '│';
  const TOP_LEFT_CORNNER_CHAR = '┌';
  const TOP_RIGHT_CORNNER_CHAR = '┐';
  const TOP_COLUMN_SEPARATOR_CHAR = '┬';
  const BOTTON_LEFT_CORNNER_CHAR = '└';
  const BOTTON_RIGHT_CORNNER_CHAR = '┘';
  const BOTTON_COLUMN_SEPARATOR_CHAR = '┴';
  const HORIZONTAL_LINE_CHAR = '─';
  const MIDDLE_COLUMN_SEPARATOR_CHAR = '┼';
  const MIDDLE_LEFT_SEPARATOR = '├';
  const MIDDLE_RIGHT_SEPARATOR = '┤';
  const COLUMN_LEFT_MARGIN_CHARS = ' ';
  const COLUMN_RIGHT_MARGIN_CHARS = ' ';
  const TABLE_LEFT_MARGIN_CHARS = '';

  const listOfColumns = [];

  function getTopLine() {
    return listOfColumns.reduce(
      (line, column, index) =>
        line +
        HORIZONTAL_LINE_CHAR +
        ''.padEnd(column.getSize(), HORIZONTAL_LINE_CHAR) +
        HORIZONTAL_LINE_CHAR +
        (index < listOfColumns.length - 1 ? TOP_COLUMN_SEPARATOR_CHAR : TOP_RIGHT_CORNNER_CHAR),
      TABLE_LEFT_MARGIN_CHARS + TOP_LEFT_CORNNER_CHAR
    )
  }

  function getBottonLine() {
    return listOfColumns.reduce(
      (line, column, index) =>
        line +
        HORIZONTAL_LINE_CHAR +
        ''.padEnd(column.getSize(), HORIZONTAL_LINE_CHAR) +
        HORIZONTAL_LINE_CHAR +
        (index < listOfColumns.length - 1
          ? BOTTON_COLUMN_SEPARATOR_CHAR
          : BOTTON_RIGHT_CORNNER_CHAR),
      TABLE_LEFT_MARGIN_CHARS + BOTTON_LEFT_CORNNER_CHAR
    )
  }

  function getDownTableLine() {
    return listOfColumns.reduce(
      (line, column, index) =>
        line +
        HORIZONTAL_LINE_CHAR +
        ''.padEnd(column.getSize(), HORIZONTAL_LINE_CHAR) +
        HORIZONTAL_LINE_CHAR +
        (index < listOfColumns.length - 1 ? MIDDLE_COLUMN_SEPARATOR_CHAR : MIDDLE_RIGHT_SEPARATOR),
      TABLE_LEFT_MARGIN_CHARS + MIDDLE_LEFT_SEPARATOR
    )
  }

  function linesOfData(section) {
    let allValuesAreDone;
    let lines = [];
    let isFirstRow = true;
    let values = {};
    // Each iteration is a row in the table.
    // first row is used to initialize the generator function for each column.
    // So then we can extract each row with next()
    do {
      allValuesAreDone = true;

      const aLine = listOfColumns.reduce((line, component, index) => {
        if (isFirstRow) {
          values[index] = component[section].nextValue();
        }
        const { value: columnValue, done } = values[index].next();
        if (done !== true) allValuesAreDone = false;

        return (
          line +
          COLUMN_LEFT_MARGIN_CHARS +
          columnValue +
          COLUMN_RIGHT_MARGIN_CHARS +
          VERTICAL_LINE_CHAR
        )
      }, TABLE_LEFT_MARGIN_CHARS + VERTICAL_LINE_CHAR);

      if (allValuesAreDone === false) lines.push(aLine);
      isFirstRow = false;
    } while (allValuesAreDone === false)

    return lines
  }

  function draw() {
    listOfColumns.forEach((column) => column.load(tableData.map(row => row[column.id])));

    if(listOfColumns.length === 0) return ('[]')
    
    const lines = [
      // Top Line
      getTopLine(),
      // Heading line
      ...linesOfData('heading'),
      // Down Line of Heading
      getDownTableLine(),
      // detail lines
      ...linesOfData('row'),
      // botton line of the table
      getBottonLine(),
    ];

    return lines.join('\n')
  }

  function addColumn({ type, id, title }) {
    let column = type.loadParams(id)(title??id);
    listOfColumns.push(column);
    return {
      addColumn,
      draw
    }
  }

  function auto() {
    tableData.map((row) => {
        Object.keys(row).map((id) => {
          if(listOfColumns.find((el) => el.id === id) === undefined)
            addColumn({type: Text(), id});
        });
    });

    return { draw }
  }

  return {
    addColumn,
    auto,
    draw
  }
}

function consoleTable(toLog)
{
  console.log(Table(toLog).auto().draw());
}

function consoleTableExtended(toLog)
{

  let myGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof this !== 'undefined' ? this : {};

  if (console.table) {
    if(myGlobal?.process?.argv0 === 'bun') console.log(Table(toLog).auto().draw());
    else console.table(toLog);
  }else console.log(toLog);  
}

const LENGTH_IN_CHARS_OF_INI_END_TIMELINE = 80;
const START_OF_INTERVAL_CHAR = '|';
const END_OF_INTERVAL_CHAR = '|';
const INTERVAL_UNIT_CHAR = '-';
const LAST_SCALE_VALUE_MARGIN = 2;

//if from the oldest start to the newest end the difference in ms < the limit value then scale will be represented
// in this unit.
// The limit is calculated by applying:
//15% of miliseconds of two units above. ex: ms limit is 15% of one minute
const timelineScales = [
  //1000*60*(15/100) 15% of 1 minute
  { limit: 9000, label: 'ms', valueInUnits: start => time => time - start }, 
  
  //1000*60*60*(15/100) 15% of 1 hour
  { limit: 540000, label: 'sec', valueInUnits: start => time => Math.floor((time - start)/1000).toString() },
  
  //1000*60*60*24*(15/100)
  { limit: 12960000, label: 'min', valueInUnits: start => time => Math.floor((time - start)/60000).toString() },
  
  //1000*60*60*24*365*(15/100)
  { limit: 4730400000, label: 'hr', valueInUnits: start => time => Math.floor((time - start)/3600000).toString() },
  
  //1000*60*60*24*365*100*(15/100)
  { limit: 473040000000, label: 'day', valueInUnits: start => time => Math.floor((time - start)/86400000).toString() },
  
  //1000*60*60*24*365*100*10*(15/100)
  { limit: 4730400000000, label: 'year',valueInUnits: start => time => Math.floor((time - start)/31536000000).toString() },
  { limit: Infinity, label: 'cen', valueInUnits: start => time => Math.floor((time - start)/3153600000000).toString() },
];

function drawInterval(line, startInterval, endInterval)
{
  let value = 
    START_OF_INTERVAL_CHAR + 
    ''.padEnd(endInterval - startInterval - 1, INTERVAL_UNIT_CHAR) + 
    END_OF_INTERVAL_CHAR;

  return putValueAtPos(line, value, startInterval)
}

function Timeline()
{
  let size;
  let id;
  let data;
  let scalePoints;
  let resolution;
  let timelineScale;

  function convertToResolution(point)
  {
    return Math.floor((point - scalePoints[0])/resolution)
  }


  return {
    loadParams: paramId => paramTitle => {
      id = paramId;

      return {
        id,
        load: columnData => {
          data = columnData.map(
            intervals =>
              intervals.map( 
                interval => {
                  const start = new Date(interval.start).valueOf();
                  const end = new Date(interval.end).valueOf();
                  return {
                    start,
                    end
                  }
                }
              )
          );

          scalePoints = 
            [...new Set(
              data.flatMap(el => el).reduce(
                (scalePoints, point) =>
                  [...scalePoints, point.start, point.end],
                []
              ).sort(arraySorter())
            )];
          
          resolution = (scalePoints[scalePoints.length - 1] - scalePoints[0])/LENGTH_IN_CHARS_OF_INI_END_TIMELINE;
        
          let timelineScaleIndex = timelineScales.findIndex(el => (scalePoints[scalePoints.length - 1] - scalePoints[0]) < el.limit );
          timelineScale = timelineScales[timelineScaleIndex];

          size = timelineScale.label.length + 1 + LENGTH_IN_CHARS_OF_INI_END_TIMELINE + LAST_SCALE_VALUE_MARGIN;
        },
        getSize: () => size,

        heading: {
          nextValue: function*() {
            yield scalePoints.reduce(
              (line, scalePoint) => {
                return putCenteredValueAtPosIfFit(
                  line, 
                  timelineScale.valueInUnits(scalePoints[0])(scalePoint),
                  convertToResolution(scalePoint) + 3,
                  1
                )
              },
              timelineScale.label + ' ' + ''.padEnd(LENGTH_IN_CHARS_OF_INI_END_TIMELINE + LAST_SCALE_VALUE_MARGIN)
            );
          }
        },

        row: {
          nextValue: function*() {
            for (let intervals of data)
            {
              yield intervals.reduce(
                (line, interval) => 
                drawInterval(
                  line, 
                  convertToResolution(interval.start) + timelineScale.label.length + 1, 
                  convertToResolution(interval.end) + timelineScale.label.length + 1, 
                ),
                ''.padEnd(size)
              );
            }

          }
        }
      }
    }
  }

}

// needed only for debuging
//import { RE } from './ramdaExt.js';


function Chrono() {
  let milisecondsNow;
  if (performance?.now) milisecondsNow = () => performance.now();
  if (milisecondsNow === undefined) milisecondsNow = () => Date.now();

  let historyTimeIntervals = {};

  let chronoEvents = {};
  createTimeEvent('chronoCreation');

  let rangeType = Range(
    {
      type: 'miliseconds',
      displayFormat: 'ms',
      referenceMiliseconds: chronoEvents['chronoCreation'].miliseconds
    }
  );

  function createTimeEvent(eventName) {
    chronoEvents[eventName] = {
      date: new Date(),
      miliseconds: milisecondsNow()
    };
  }

  function validateEventName(eventName) {
    if (typeof eventName !== 'string' || isNaN(Number(eventName)) === false)
      throw new CustomError(
        'EVENT_NAME_MUST_HAVE_ALPHABETICS_CHARS',
        `Event name '${eventName}' must be of type string and contain some non numeric character`,
        eventName
      )
  }

  function time(eventNames) {

    let currentMiliseconds = milisecondsNow();

    let listOfEvents = typeof eventNames === 'string'
      ? [eventNames]
      : eventNames;

    listOfEvents.forEach(eventName => {

      validateEventName(eventName);

      historyTimeIntervals[eventName] ??= {};

      historyTimeIntervals[eventName].start ??= [];
      historyTimeIntervals[eventName].start.push(currentMiliseconds);
    });
  }


  function timeEnd(eventNames) {
    let currentMiliseconds = milisecondsNow();

    let listOfEvents =
      typeof eventNames === 'string'
        ? [eventNames]
        : eventNames;

    listOfEvents.forEach(eventName => {
      if (historyTimeIntervals[eventName] === undefined) {
        throw new CustomError(
          'EVENT_NAME_NOT_FOUND',
          `No such Label '${eventName}' for .timeEnd(...)`,
          eventName
        )
      }

      let start = historyTimeIntervals[eventName].start.pop();

      if (start === undefined) {
        throw new CustomError(
          'EVENT_NAME_ALREADY_CONSUMED',
          `eventName: '${eventName}' was already consumed by a previous call to .timeEnd(...)`,
          eventName
        )
      }

      historyTimeIntervals[eventName].ranges ??= [];
      historyTimeIntervals[eventName].ranges.push(
        rangeType(
          start,
          currentMiliseconds
        )
      );

    });
  }

  function fillWithUndefinedRanges() {

    Object.entries(historyTimeIntervals).forEach(
      ([eventName, currentEventValues], indexEvent, intervalEntries) => {
        let indexRangeForEvent = 0;
        intervalEntries[0][1].ranges.forEach(
          ({ start: startRef, end: endRef }, indexRangeRef) => {
            if (indexEvent === 0) {
              currentEventValues.ranges[indexRangeRef] = rangeType(startRef, endRef, indexRangeRef);
              return
            }

            const isCurrentEventSameIntervalAsReference = () => {
              const currentEventStart = currentEventValues.ranges[indexRangeForEvent]?.start;
              const nextEventStart = intervalEntries[0][1].ranges[indexRangeRef + 1]?.start;

              const isStartOfCurrentEventAfterStartOfReference =
                currentEventStart >= startRef;

              const isStartOfCurrentEventBeforeStartOfNextReference =
                indexRangeRef + 1 === intervalEntries[0][1].ranges.length
                || currentEventStart < nextEventStart;

              return isStartOfCurrentEventAfterStartOfReference
                && isStartOfCurrentEventBeforeStartOfNextReference
            };

            let foundMatchingInterval = false;
            while (isCurrentEventSameIntervalAsReference()) {
              foundMatchingInterval = true;

              const currentRange = currentEventValues.ranges[indexRangeForEvent];
              currentEventValues.ranges[indexRangeForEvent + 1];
              const previousRange = currentEventValues.ranges[indexRangeForEvent - 1];

              // Accrued ranges for same interval, deleting the current one
              const isSameIntervalAsPreviousOne = previousRange?.interval === indexRangeRef;

              if (isSameIntervalAsPreviousOne) {
                currentEventValues.ranges[indexRangeRef] =
                  rangeType(
                    currentRange.start - (previousRange.end - previousRange.start),
                    currentRange.end,
                    indexRangeRef
                  );
                currentEventValues.ranges.splice(indexRangeForEvent, 1);
              } else {
                currentEventValues.ranges[indexRangeForEvent] =
                  rangeType(
                    currentRange.start,
                    currentRange.end,
                    indexRangeRef
                  );
                indexRangeForEvent++;
              }
            }

            if (foundMatchingInterval === false) {
              pushAt(
                indexRangeForEvent,
                rangeType(undefined, undefined, indexRangeRef),
                currentEventValues.ranges
              );
              indexRangeForEvent++;
            }
          }
        );
      }
    );
  }

  function findParentRanges(eventValues, indexEvent, intervalEntries) {
    let isNotAParent = true;
    while (indexEvent !== 0 && isNotAParent === true) {
      indexEvent--;
      isNotAParent = intervalEntries[indexEvent][1].ranges.some(
        ({ start, end }, index) =>
          (start === undefined || end === undefined) &&
          (eventValues.ranges[index].start !== undefined || eventValues.ranges[index].end !== undefined)
      );
    }

    return [intervalEntries[indexEvent][1].ranges, intervalEntries[indexEvent][0]]
  }

  //TDL
  function average() {
    fillWithUndefinedRanges();

    historyTimeIntervals = Object.entries(historyTimeIntervals).reduce(
      (newHistoryIntervals, [eventName, eventValues], indexEvent, intervalEntries) => {

        const [parentRanges, parentEventName] = findParentRanges(eventValues, indexEvent, intervalEntries);

        const [totalElapse, totalEndToStartGap, totalStartToStartGap] =
          eventValues.ranges.reduce(
            ([totalElapse, totalEndToStartGap, totalStartToStartGap], { start = 0, end = 0 }, indexRange) => {
              totalElapse = totalElapse + end - start;
              if (indexEvent !== 0 && start !== 0 && end !== 0) {
                totalEndToStartGap = totalEndToStartGap + start - parentRanges[indexRange].end;
                totalStartToStartGap = totalStartToStartGap + start - parentRanges[indexRange].start;
              }

              return [
                totalElapse,
                totalEndToStartGap,
                totalStartToStartGap
              ]
            },
            [0, 0, 0]
          );

        let averagetart;
        let avarageEventEnd;

        const totalRangesWithValues =
          eventValues.ranges.filter(
            ({ start, end }) => start !== undefined & end !== undefined
          ).length;

        if (indexEvent === 0) {
          averagetart = intervalEntries[0][1].ranges[0].start;
        }

        if (indexEvent !== 0 && Math.abs(totalEndToStartGap) <= Math.abs(totalStartToStartGap)) {
          averagetart =
            newHistoryIntervals[parentEventName].ranges[0].end +
            totalEndToStartGap / totalRangesWithValues;
        }

        if (indexEvent !== 0 && Math.abs(totalStartToStartGap) < Math.abs(totalEndToStartGap)) {
          averagetart =
            newHistoryIntervals[parentEventName].ranges[0].start +
            totalStartToStartGap / eventValues.ranges.length;
        }

        avarageEventEnd = averagetart + totalElapse / eventValues.ranges.length;

        newHistoryIntervals[eventName] =
        {
          ranges: [
            rangeType(
              averagetart,
              avarageEventEnd,
              0
            )
          ]
        };

        return newHistoryIntervals
      },
      {}
    );
    //range: { start:3.5852760076522827 <-133.67405599355698-> end:137.25933200120926 }
  }

  function eventsReport(events) {
    const entriesEvents = Object.entries(events);
    entriesEvents.reduce(
      (acum, [eventName, eventObject]) => {
        eventObject.ranges.forEach(
          range => {
            if (acum[0] > range.start) acum[0] = range.start;
            if (acum[1] < range.end) acum[1] = range.end;
          });
        return acum
      },
      [Infinity, 0]
    );

    return events
  }

  function totalEventsElapseTimeReport(events) {
    let totalElapse = 0;
    const toLog = events.reduce(
      (acum, current) => {
        let found = acum.find(el => el.name === current.name);

        const currentElapseMs = current.range.end - current.range.start;
        totalElapse = totalElapse + currentElapseMs;
        if (found) found.elapse = found.elapse + currentElapseMs;
        else acum.push({ name: current.name, elapse: currentElapseMs });

        return acum
      },
      []
    ).map(nameRange => {
      nameRange.percentage = Number(Number(100 * nameRange.elapse / totalElapse).toFixed(2));
      nameRange.elapse = Math.floor(nameRange.elapse);
      return nameRange
    });

    console.log('');
    console.log('Total elapse Time of each event: ');
    consoleTable(toLog);

    return events
  }

  function coincidingEventsReport(elapseTable) {

    pipe$1(
      groupByWithCalc(
        (row) => JSON.stringify(row.runningEvents.sort(arraySorter())),
        { percentage: (l, r) => (l ?? 0) + r, elapseMs: (l, r) => (l ?? 0) + r }
      ),
      map$1(row => ({ ...row, elapseMs: Math.floor(row.elapseMs), percentage: Number(row.percentage.toFixed(2)) })),
      (coincidingEvents) => {
        console.log('');
        console.log('Coinciding Events timeline: ');
        consoleTable(coincidingEvents);
      }
    )(elapseTable);

    return elapseTable
  }

  function logTimeline(timeline) {
    console.log('');
    console.log('Timeline of events:');
    console.log(timeline.draw());
  }

  function createTimeline(data) {
    const timeline = Table(data);

    timeline.addColumn({ type: Text(), id: 'event', title: 'Events' });
    timeline.addColumn({ type: Timeline(), id: 'ranges' });

    return timeline
  }

  function formatReportAndReturnInputParam(data) {
    let toReport = Object.entries(data).map(
      ([eventName, event]) => (
        {
          event: eventName,
          ranges: event.ranges.map(
            ({ start, end }) => ({ start: Math.floor(start), end: Math.floor(end) })
          )
        }));
    const toLog = createTimeline(toReport);
    logTimeline(toLog);

    return data
  }

  function timelineLines() {
    let toReport = Object.entries(historyTimeIntervals).map(
      ([eventName, event]) => (
        {
          event: eventName,
          ranges: event.ranges.map(
            ({ start, end }) => ({ start: Math.floor(start), end: Math.floor(end) })
          )
        }));
    return createTimeline(toReport).draw()
  }

  function chronoReport() {
    console.log('');
    Object.entries(chronoEvents).forEach(
      ([key, value]) => console.log(key, ': ', value.date)
    );
  }

  function report() {
    createTimeEvent('report');
    chronoReport();
    pipe$1(
      //RE.RLog('0-->: '),
      formatReportAndReturnInputParam,
      eventsReport,
      historyToListOfNameRanges,
      //RE.RLog('1-->: '),
      totalEventsElapseTimeReport,
      //RE.RLog('2-->: '),
      compactListOfNameRanges,
      //RE.RLog('3-->: '),
      sort(sorterByPaths('range.start')),
      reportListOfNameRanges,
      //RE.RLog('4-->: '),
      coincidingEventsReport
    )(historyTimeIntervals);
  }

  function historyToListOfNameRanges(historyTimeIntervals) {
    return Object.entries(historyTimeIntervals)
      .reduce(
        (acum, [key, value]) => {
          acum.push(
            ...(value.ranges?.map(
              range => ({ name: key, range })
            )) ?? []
          );

          return acum
        },
        []
      )
  }

  function compactListOfNameRanges(ListOfRangeNames) {
    return ListOfRangeNames.reduce(
      (acum, { name, range }) => {
        acum.push({ name, isLeft: true, edge: range.start, edgeEnd: range.end });
        acum.push({ name, isLeft: false, edge: range.end });
        return acum
      },
      []
    )
      .sort(sorterByPaths('edge'))
      .reduce(
        (acum, { name, isLeft, edge, edgeEnd }, index, table) => {
          if (isLeft) {
            let i = index;
            do {
              pushUniqueKeyOrChange(
                { runningEvents: [name], range: rangeType(table[i].edge, table[i + 1].edge) }
                , acum
                , ['range']
                , (newRow, existingRow) => {
                  pushUniqueKey(name, existingRow.runningEvents);
                  return existingRow
                }
              );
              i++;
            } while (!(table[i].name === name && table[i].isLeft === false && table[i].edge === edgeEnd))
          }

          return acum
        },
        []
      ).filter(
        elem => elem.range.start !== elem.range.end
      )
  }

  function reportListOfNameRanges(listOfNameRanges) {
    let totalElapse = 0;
    return listOfNameRanges.map(
      ({ runningEvents, range }) => {
        let elapseMs = milisecondsRangeToElapseMs(range);
        totalElapse = totalElapse + elapseMs;
        return {
          runningEvents,
          elapseMs
        }
      }
    ).map(nameRange => {
      nameRange.percentage = 100 * nameRange.elapseMs / totalElapse;
      return nameRange
    })
  }

  const setTime = event => data => {
    time(event);
    return data
  };

  const setTimeEnd = event => data => {
    timeEnd(event);
    return data
  };

  const logReport = data => {
    report();
    return data
  };

  const getChronoState = () => historyTimeIntervals;

  const setChronoStateUsingPerformanceAPIFormat = (performanceGetEntriesByTypeOjb) => {
    historyTimeIntervals =
      performanceGetEntriesByTypeOjb.reduce(
        (historyAcum, { name, startTime, duration, entryType }) => {
          validateEventName(name);

          if (entryType === 'mark') {
            historyAcum[name] ??= {};
            historyAcum[name].start ??= [];
            historyAcum[name].start.push(startTime);
          }

          if (entryType === 'measure') {
            historyAcum[name] ??= {};
            historyAcum[name].ranges ??= [];
            historyAcum[name].ranges.push(
              rangeType(startTime, startTime + duration)
            );
          }

          return historyAcum
        },
        {}
      );
  };

  const getChronoStateUsingPerformanceAPIFormat = () => {
    return Object.entries(historyTimeIntervals).reduce(
      (performanceAPIFormatAcum, [eventName, eventValue]) => {

        eventValue.start?.forEach(
          start => performanceAPIFormatAcum.push(
            {
              duration: 0,
              startTime: start,
              name: eventName,
              entryType: 'mark'
            }
          )
        );

        eventValue.ranges?.forEach(
          range =>
            performanceAPIFormatAcum.push(
              {
                duration: range.end - range.start,
                startTime: range.start,
                name: eventName,
                entryType: 'measure'
              }
            )
        );

        return performanceAPIFormatAcum
      },
      []
    )
  };

  function reset()
  {
    historyTimeIntervals = {};
    chronoEvents = { chronoCreation:chronoEvents['chronoCreation'] };
  }

  return {
    time, timeEnd, report, setTime, setTimeEnd, logReport, timelineLines,
    getChronoState, setChronoStateUsingPerformanceAPIFormat, getChronoStateUsingPerformanceAPIFormat, average,
    reset
  }
}


function milisecondsRangeToElapseMs({ start, end }) {
  return end - start
}




function Range(...params) {
  let type;
  let displayFormat;
  let referenceMiliseconds;

  if (params.length >= 2) {
    return range(...params)
  }
  else {
    ({ type, displayFormat, referenceMiliseconds } = params[0]);
    return range
  }

  function range(start, end, interval) {
    //console.log(interval) 
    if (start > end) throw new Error('range(start, end) start cannot be > than end')

    function toString() {
      if (type === 'miliseconds' && displayFormat === 'ms' && referenceMiliseconds !== undefined) {
        const startMs = milisecondsRangeToElapseMs({ start: referenceMiliseconds, end: start });
        const endMs = milisecondsRangeToElapseMs({ start: referenceMiliseconds, end });
        return `${'interval: ' + interval} { start:${startMs} <-${endMs - startMs}-> end:${endMs} }`
      }

      return `{ start:${start}, end:${end} }`
    }

    function intersect(rangeB) {
      let newStart = start > rangeB.start ? start : rangeB.start;
      let newEnd = end < rangeB.end ? end : rangeB.end;

      if (newStart === undefined || newEnd === undefined) return range(undefined, undefined)
      if (newStart > newEnd) return range(undefined, undefined)

      return range(newStart, newEnd)
    }

    return {
      [Symbol.for('nodejs.util.inspect.custom')]: toString,
      toString,
      intersect,
      start,
      end,
      interval
    }
  }
}

async function fetchImproved(...args) {
  const result = await fetch(...args);
  const body = await result.json();

  return { status: result.status, body }
}

const { attemptP, Future } = F;

const fletch = ({url, options} = {}) => attemptP(() => fetchImproved(url, options));

const promiseFunToFutureFun = (futurizePromFun) => (...input) => attemptP(() => futurizePromFun(...input));


/*
const {  pipe, fork } = F

const ffletch = ffletchMaker([
  {
    input: {url: 'customerRef/F3456789'},
    output: {
      status: 200,
      body: {name:'jose'}
    }
  },
  {
    input: {url: 'customerRef/F3456789'},
    output: {
      status: 200,
      body: {name:'jose'}
    }
  }
], 50) // Last paramater is the delay to resolve the promise.

ffletch({url: 'customerRef/F3456789'}).pipe(fork(console.log)(console.log))

*/

function ffletchMaker(fetchsDef, delay) {

  //[{input:{url},output:{status,body}]
  let urlToResponse = fetchsDef.reduce(
    (acum, {input, output}) => {
      acum[JSON.stringify(input)] = output;
      return acum
    },
    {}
  );

  function ffletch(input) {

    const key = JSON.stringify(input);


    const ffletchResolution = (resolve, reject) => {
      if (urlToResponse[key] === undefined) {
        reject(new Error(`Fake Response not found for Request with key: ${key} in ${urlToResponse}`));
        return
      }
      if (urlToResponse[key].status >= 600) {
        reject(new Error(JSON.stringify(urlToResponse[key].body), null, 2));
        return
      }


      resolve({
        status: urlToResponse[key].status,
        body: urlToResponse[key].body,
      });

      return
    };

    return Future(
      (reject, resolve) => {
        setTimeout(
          () => ffletchResolution(resolve, reject),
          parseInt(delay, 10) || 0
        );

        return function onCancel () {
          // Clearing the timeout releases the resources we were holding.
          //clearTimeout (timeoutId)
        }

      }
    )


  }


  return ffletch
}

var loglevel$1 = {exports: {}};

/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/

(function (module) {
	(function (root, definition) {
	    if (module.exports) {
	        module.exports = definition();
	    } else {
	        root.log = definition();
	    }
	}(commonjsGlobal, function () {

	    // Slightly dubious tricks to cut down minimized file size
	    var noop = function() {};
	    var undefinedType = "undefined";
	    var isIE = (typeof window !== undefinedType) && (typeof window.navigator !== undefinedType) && (
	        /Trident\/|MSIE /.test(window.navigator.userAgent)
	    );

	    var logMethods = [
	        "trace",
	        "debug",
	        "info",
	        "warn",
	        "error"
	    ];

	    // Cross-browser bind equivalent that works at least back to IE6
	    function bindMethod(obj, methodName) {
	        var method = obj[methodName];
	        if (typeof method.bind === 'function') {
	            return method.bind(obj);
	        } else {
	            try {
	                return Function.prototype.bind.call(method, obj);
	            } catch (e) {
	                // Missing bind shim or IE8 + Modernizr, fallback to wrapping
	                return function() {
	                    return Function.prototype.apply.apply(method, [obj, arguments]);
	                };
	            }
	        }
	    }

	    // Trace() doesn't print the message in IE, so for that case we need to wrap it
	    function traceForIE() {
	        if (console.log) {
	            if (console.log.apply) {
	                console.log.apply(console, arguments);
	            } else {
	                // In old IE, native console methods themselves don't have apply().
	                Function.prototype.apply.apply(console.log, [console, arguments]);
	            }
	        }
	        if (console.trace) console.trace();
	    }

	    // Build the best logging method possible for this env
	    // Wherever possible we want to bind, not wrap, to preserve stack traces
	    function realMethod(methodName) {
	        if (methodName === 'debug') {
	            methodName = 'log';
	        }

	        if (typeof console === undefinedType) {
	            return false; // No method possible, for now - fixed later by enableLoggingWhenConsoleArrives
	        } else if (methodName === 'trace' && isIE) {
	            return traceForIE;
	        } else if (console[methodName] !== undefined) {
	            return bindMethod(console, methodName);
	        } else if (console.log !== undefined) {
	            return bindMethod(console, 'log');
	        } else {
	            return noop;
	        }
	    }

	    // These private functions always need `this` to be set properly

	    function replaceLoggingMethods(level, loggerName) {
	        /*jshint validthis:true */
	        for (var i = 0; i < logMethods.length; i++) {
	            var methodName = logMethods[i];
	            this[methodName] = (i < level) ?
	                noop :
	                this.methodFactory(methodName, level, loggerName);
	        }

	        // Define log.log as an alias for log.debug
	        this.log = this.debug;
	    }

	    // In old IE versions, the console isn't present until you first open it.
	    // We build realMethod() replacements here that regenerate logging methods
	    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
	        return function () {
	            if (typeof console !== undefinedType) {
	                replaceLoggingMethods.call(this, level, loggerName);
	                this[methodName].apply(this, arguments);
	            }
	        };
	    }

	    // By default, we use closely bound real methods wherever possible, and
	    // otherwise we wait for a console to appear, and then try again.
	    function defaultMethodFactory(methodName, level, loggerName) {
	        /*jshint validthis:true */
	        return realMethod(methodName) ||
	               enableLoggingWhenConsoleArrives.apply(this, arguments);
	    }

	    function Logger(name, defaultLevel, factory) {
	      var self = this;
	      var currentLevel;
	      defaultLevel = defaultLevel == null ? "WARN" : defaultLevel;

	      var storageKey = "loglevel";
	      if (typeof name === "string") {
	        storageKey += ":" + name;
	      } else if (typeof name === "symbol") {
	        storageKey = undefined;
	      }

	      function persistLevelIfPossible(levelNum) {
	          var levelName = (logMethods[levelNum] || 'silent').toUpperCase();

	          if (typeof window === undefinedType || !storageKey) return;

	          // Use localStorage if available
	          try {
	              window.localStorage[storageKey] = levelName;
	              return;
	          } catch (ignore) {}

	          // Use session cookie as fallback
	          try {
	              window.document.cookie =
	                encodeURIComponent(storageKey) + "=" + levelName + ";";
	          } catch (ignore) {}
	      }

	      function getPersistedLevel() {
	          var storedLevel;

	          if (typeof window === undefinedType || !storageKey) return;

	          try {
	              storedLevel = window.localStorage[storageKey];
	          } catch (ignore) {}

	          // Fallback to cookies if local storage gives us nothing
	          if (typeof storedLevel === undefinedType) {
	              try {
	                  var cookie = window.document.cookie;
	                  var location = cookie.indexOf(
	                      encodeURIComponent(storageKey) + "=");
	                  if (location !== -1) {
	                      storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
	                  }
	              } catch (ignore) {}
	          }

	          // If the stored level is not valid, treat it as if nothing was stored.
	          if (self.levels[storedLevel] === undefined) {
	              storedLevel = undefined;
	          }

	          return storedLevel;
	      }

	      function clearPersistedLevel() {
	          if (typeof window === undefinedType || !storageKey) return;

	          // Use localStorage if available
	          try {
	              window.localStorage.removeItem(storageKey);
	              return;
	          } catch (ignore) {}

	          // Use session cookie as fallback
	          try {
	              window.document.cookie =
	                encodeURIComponent(storageKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
	          } catch (ignore) {}
	      }

	      /*
	       *
	       * Public logger API - see https://github.com/pimterry/loglevel for details
	       *
	       */

	      self.name = name;

	      self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
	          "ERROR": 4, "SILENT": 5};

	      self.methodFactory = factory || defaultMethodFactory;

	      self.getLevel = function () {
	          return currentLevel;
	      };

	      self.setLevel = function (level, persist) {
	          if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
	              level = self.levels[level.toUpperCase()];
	          }
	          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
	              currentLevel = level;
	              if (persist !== false) {  // defaults to true
	                  persistLevelIfPossible(level);
	              }
	              replaceLoggingMethods.call(self, level, name);
	              if (typeof console === undefinedType && level < self.levels.SILENT) {
	                  return "No console available for logging";
	              }
	          } else {
	              throw "log.setLevel() called with invalid level: " + level;
	          }
	      };

	      self.setDefaultLevel = function (level) {
	          defaultLevel = level;
	          if (!getPersistedLevel()) {
	              self.setLevel(level, false);
	          }
	      };

	      self.resetLevel = function () {
	          self.setLevel(defaultLevel, false);
	          clearPersistedLevel();
	      };

	      self.enableAll = function(persist) {
	          self.setLevel(self.levels.TRACE, persist);
	      };

	      self.disableAll = function(persist) {
	          self.setLevel(self.levels.SILENT, persist);
	      };

	      // Initialize with the right level
	      var initialLevel = getPersistedLevel();
	      if (initialLevel == null) {
	          initialLevel = defaultLevel;
	      }
	      self.setLevel(initialLevel, false);
	    }

	    /*
	     *
	     * Top-level API
	     *
	     */

	    var defaultLogger = new Logger();

	    var _loggersByName = {};
	    defaultLogger.getLogger = function getLogger(name) {
	        if ((typeof name !== "symbol" && typeof name !== "string") || name === "") {
	          throw new TypeError("You must supply a name when creating a logger.");
	        }

	        var logger = _loggersByName[name];
	        if (!logger) {
	          logger = _loggersByName[name] = new Logger(
	            name, defaultLogger.getLevel(), defaultLogger.methodFactory);
	        }
	        return logger;
	    };

	    // Grab the current global log variable in case of overwrite
	    var _log = (typeof window !== undefinedType) ? window.log : undefined;
	    defaultLogger.noConflict = function() {
	        if (typeof window !== undefinedType &&
	               window.log === defaultLogger) {
	            window.log = _log;
	        }

	        return defaultLogger;
	    };

	    defaultLogger.getLoggers = function getLoggers() {
	        return _loggersByName;
	    };

	    // ES6 default export, for compatibility
	    defaultLogger['default'] = defaultLogger;

	    return defaultLogger;
	})); 
} (loglevel$1));

var loglevelExports = loglevel$1.exports;
var loglevel = /*@__PURE__*/getDefaultExportFromCjs(loglevelExports);

// log acts as a bridge with some ehancements to loglelvel

const log = logAsProxyOfLogLevel();

function logAsProxyOfLogLevel() {
  const formattedDate = formatDate('$YYYY-$MM-$DD $hh:$mm:$ss', new Date());

  const logBridge = {
    get: function (target, prop, receiver) {
      const addPrefix = {
        apply: function (target, thisArg, listOfArg) {
          return target(`${formattedDate} ${listOfArg.join(' ')} `)
        }
      };

      if (typeof target[prop] === 'function' && ['trace', 'debug', 'info', 'warn', 'error', 'log'].includes(prop)) return new Proxy(target[prop], addPrefix)
      else if (logBridge[prop] !== undefined) return logBridge[prop]
      else return target[prop]
    },

    set: function (obj, prop, value) {
      if (logBridge[prop] !== undefined) logBridge[prop] = value;
      else obj[prop] = value;
      return true
    }
  };

  return new Proxy(loglevel, logBridge)
}



//log.LEVEL_NUMBER_TO_NAME = ['TRACE', 'DEBUG','INFO','WARN','ERROR', 'SILENT']
log.LEVEL_NUMBER_TO_NAME = Object.entries(loglevel.levels).map(elem => elem[0]);

//log.NAME_TO_LEVEL_NUMBER={ 'TRACE': 0, 'DEBUG': 1, 'INFO': 2, 'WARN': 3, 'ERROR': 4, 'SILENT': 5}
log.NAME_TO_LEVEL_NUMBER = { ...loglevel.levels };

function levelName(levelNameOrLevelNumber) {
  if (typeof levelNameOrLevelNumber === 'number') return log.LEVEL_NUMBER_TO_NAME[levelNameOrLevelNumber]

  return levelNameOrLevelNumber
}

function levelNumber(levelNameOrLevelNumber) {
  if (typeof levelNameOrLevelNumber === 'string') return log.NAME_TO_LEVEL_NUMBER[levelNameOrLevelNumber.toUpperCase()]

  return levelNameOrLevelNumber
}

log.levelName = levelName;
log.levelNumber = levelNumber;

var collectionCompare = compare;

/*
  primitives: value1 === value2
  functions: value1.toString == value2.toString
  arrays: if length, sequence and values of properties are identical
  objects: if length, names and values of properties are identical
  compare([[1, [2, 3]], [[1, [2, 3]]); // true
  compare([[1, [2, 3], 4], [[1, [2, 3]]); // false
  compare({a: 2, b: 3}, {a: 2, b: 3}); // true
  compare({a: 2, b: 3}, {b: 3, a: 2}); // true
  compare({a: 2, b: 3, c: 4}, {a: 2, b: 3}); // false
  compare({a: 2, b: 3}, {a: 2, b: 3, c: 4}); // false
  compare([[1, [2, {a: 4}], 4], [[1, [2, {a: 4}]]); // true
*/

function compare(value1, value2) {
  if (value1 === value2) {
    return true;
  }

  /* eslint-disable no-self-compare */
  // if both values are NaNs return true
  if (value1 !== value1 && value2 !== value2) {
    return true;
  }

  if (
    typeof value1 != typeof value2 || // primitive != primitive wrapper
    {}.toString.call(value1) != {}.toString.call(value2) // check for other (maybe nullish) objects
  ) {
    return false;
  }

  if (value1 !== Object(value1)) {
    // non equal primitives
    return false;
  }

  if (!value1) {
    return false;
  }

  if (Array.isArray(value1)) {
    return compareArrays(value1, value2);
  }

  if ({}.toString.call(value1) == '[object Set]') {
    return compareArrays(Array.from(value1), Array.from(value2));
  }

  if ({}.toString.call(value1) == '[object Object]') {
    return compareObjects(value1, value2);
  }

  return compareNativeSubtypes(value1, value2);
}

function compareNativeSubtypes(value1, value2) {
  // e.g. Function, RegExp, Date
  return value1.toString() === value2.toString();
}

function compareArrays(value1, value2) {
  var len = value1.length;

  if (len != value2.length) {
    return false;
  }

  for (var i = 0; i < len; i++) {
    if (!compare(value1[i], value2[i])) {
      return false;
    }
  }

  return true;
}

function compareObjects(value1, value2) {
  var keys1 = Object.keys(value1);
  var len = keys1.length;

  if (len != Object.keys(value2).length) {
    return false;
  }

  for (var i = 0; i < len; i++) {
    var key1 = keys1[i];

    if (!(value2.hasOwnProperty(key1) && compare(value1[key1], value2[key1]))) {
      return false;
    }
  }

  return true;
}

const convertPathToStackPath = 
  path => 
    path.map(
      (el, index) => {
        if( index === 0 ) return 0

        return parseInt(el,10)
      }
    );

function generateStack(plan)
{
  let stack = [];

  const reviver = (nodeRef, currentPath, parent) => {
    if(typeof nodeRef === 'function' && isNaN(parseInt(currentPath.at(-1),10)) === false)
      stack.push({value: nodeRef, path:  convertPathToStackPath(currentPath)});
  
    return undefined
  };

  traverse$1(
    plan,
    reviver,
  );

  stack.push({value:identity, path:[1]});

  return stack
}

        
const isAncestorOf = 
  son => 
    parent => 
      son?.length > parent?.length && collectionCompare(parent, son.slice(0, parent.length));


const isSiblingOf = 
  sibling1 => 
    sibling2 => 
      collectionCompare(
        sibling1?.slice(0,-1),
        sibling2?.slice(0,-1)
      );

function getDescendants(stack)
{ 
  return path => 
    stack.filter(
      el => 
        path.length < el.path.length &&
        collectionCompare(
          el.path.slice(0, path.length),
          path
        )
    )
}

// areRelativeFrom([0,0])([0,0,0,0])([0,0]) //?

const stackSiblingsReducer = 
  (acum, el, index$1) => {
    if(
      isSiblingOf(last(acum)?.path)(el.path)
    ) 
    { 
      acum[acum.length - 1].value = pipe(last(acum).value, el.value);
    }else
    {
      acum.push(el);
    }

    return acum
  };

function acumSiblings(stack)
{
  return stack.reduce( 
    stackSiblingsReducer,
    []
  )
}

const stackParallelReducer = function(numberOfThreads){
  let accruingParallel = false;
  let stackItemsToParallelize = [];

  return (acum, el, index$1, stack) => {
    const elParent = el.path.slice(0,-1);
    const elGrandparent = elParent?.slice(0,-1);
    const nextToEl = stack[index$1+1]?.path;
    const nextToElParent = nextToEl?.slice(0,-1);
    const nextToElGrandparent = nextToElParent?.slice(0,-1);
    const previousToEl = stack[index$1-1]?.path;
    previousToEl?.slice(0,-2);

    let isElToAccrue = 
      el.path.length >= 3 &&
      collectionCompare(elGrandparent, nextToElGrandparent) && 
      // el is the only child of parent
      collectionCompare(getDescendants(stack)(elParent), [el]) &&
      // If previous was not accrued we dont want this to be desdendent of the current grandParent unless previous
      // is a brother of the parent (function header of subsequent parellel functions).
      (
       accruingParallel || 
       isAncestorOf(previousToEl)(elGrandparent) === false ||
       ( isAncestorOf(previousToEl)(elGrandparent) === true  && previousToEl.length < el.path.length )
      );

    if(isElToAccrue === true)
    {
      accruingParallel = true;
      stackItemsToParallelize.push(el);
    }
    
    if(isElToAccrue === false && accruingParallel === true) {
      // In cases we stopped because next element is more nested than our current parallelization
      // even though it has the grandParent as ancestor, then we need to cancel accruing and 
      // restore all elements to acum.
      if( nextToEl?.length > el.path.length && isAncestorOf(nextToEl)(elGrandparent) )
      {
        acum.push(...stackItemsToParallelize);
        acum.push(el);
        accruingParallel = false;
        stackItemsToParallelize = [];

        return acum
      }

      // Rest of cases we need to follow with parallelization including current element.
      stackItemsToParallelize.push(el);
      acum.push(
        {
          value: runFunctionsSyncOrParallel(numberOfThreads)(pluck('value',stackItemsToParallelize)),
          path: el.path.slice(0,-1)
        }
      );
    }
    
    if(isElToAccrue === false &&  accruingParallel === false)
    {
      acum.push(el);
    }

    if(isElToAccrue === false)
    {
      accruingParallel = false;
      stackItemsToParallelize = [];
    }

    return acum
  }
};

const acumParallel = numberOfThreads => stack =>
{
  return stack.reduce( 
    stackParallelReducer(numberOfThreads),
    []
  )
};


const reduceNesting = (stack)=> 
{
  let biggerLengthIndex;
  let biggerLengthValue = -1;

  repeat$1(stack.length).times(
    index => {
      if(stack[index]?.path?.length > stack[index+1]?.path?.length)
      {
        if(biggerLengthValue < stack[index]?.path?.length)
        {
          biggerLengthValue = stack[index]?.path?.length;
          biggerLengthIndex = index;
        }
      }
    }
  );

  let newStack = stack;

  if(biggerLengthIndex !== undefined)
  {
    newStack = [...stack];
    newStack[biggerLengthIndex] =         
      {
        value: newStack[biggerLengthIndex].value,
        path: newStack[biggerLengthIndex].path.slice(0,-1)
      };
  }

  return newStack
};


const extractFinalValue = x => x[0]?.value ?? x?.value;


const lengthStackPrevLessThanCurr = function ()
{
  let prevStack;
  
  return [
    function funCond(stack) {
      const result = (stack?.length < prevStack?.length) || prevStack === undefined;
      prevStack = stack;
      return result
    },
    function ini(){
      prevStack = undefined;
    }
  ]
};

function changeFunWithMockupsObj(mockupsObj)
{
  return stack => {
    if (!mockupsObj) return stack

    return stack.map(
      ({path, value}) => {
        if(mockupsObj?.[value.name] !== undefined)
        {
          if(typeof mockupsObj[value.name] === 'function') {
            return {
              value:mockupsObj[value.name],
              path
            }
          }

          return {
            value: () =>  mockupsObj[value.name],
            path
          }      
        }

        return {value:value, path}
      }
    )
  }
}

function plan({numberOfThreads=Infinity, mockupsObj={}} = {numberOfThreads: Infinity, mockupsObj: {}})
{

  function build(planDef)
  {
    const toExec = pipe(
      generateStack,
      changeFunWithMockupsObj(mockupsObj),
      pipeWhile(stack => stack.length > 1)(
        pipeWhile(...lengthStackPrevLessThanCurr())
        (
          acumSiblings,
          acumParallel(numberOfThreads),
        ),
        reduceNesting,
      ),
      extractFinalValue,
    )(planDef);

      toExec.rebuild = (options) => {
        setOptions(options);
        return build(planDef)
      };
    return toExec
  }

  function setOptions(options) {
    ({numberOfThreads, mockupsObj} = options);
  }

  function map(fun, mapThreads=numberOfThreads) {

    return (data) => {
      if(Array.isArray(data)) return runFunctionsSyncOrParallel(mapThreads)(data.map(param => fun.bind(fun, param)))()
      
      return [fun(data)]
    }
  }

  return { build, map }

}

var objectDeepMapValues = deepMapValues;

function deepMapValues(obj, fn) {
  if (!isObject(obj)) {
    throw new Error('First argument must be an object');
  }
  if (!(fn instanceof Function)) {
    throw new Error('Second argument must be a function');
  }

  var result = {};
  var keys = Object.keys(obj);
  var len = keys.length;
  for (let i = 0; i < len; i++) {
    var key = keys[i];
    var value = obj[key];
    result[key] = isObject(value) ? deepMapValues(value, fn) : fn(value, key);
  }
  return result;
}

function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

const lengthSanitizer = (_, value) => {
  if(typeof value !== 'string' || value.length < 1) return value

  const lengthString = 'length=' + value.length;

  if(value.length >= lengthString.length) {
    
    const numberOfRightAsteriscs = Math.floor((value.length - lengthString.length) / 2);
    
    return lengthString
      .padEnd(
        lengthString.length + numberOfRightAsteriscs, '*'
      )
      .padStart(value.length, '*')
  }

  return ''.padEnd(value.length,'*')

};

const bearerSanitizer = (_, bearerToken) => bearerToken.substring(0, 7) + lengthSanitizer(undefined, bearerToken.substring(7));


const sanitizedGroups = {
  ibmApis: [
    { value: /^Bearer .*$/i, replacer: bearerSanitizer },
    { field: /^client_secret$/i, replacer: lengthSanitizer },
    { field: /^x-ibm-client-secret$/i, replacer: lengthSanitizer },
    { field: /.*token$/i, replacer: lengthSanitizer },
    { field: /^jwt$/i, replacer: lengthSanitizer },
    { field: /^authorization$/i, replacer: lengthSanitizer },
    { field: /^deviceId$/i, replacer: lengthSanitizer },
  ],

  pushNotification: [
    { field: /^body$/i, type: 'string', replacer: lengthSanitizer },
    { field: /^title$/i, replacer: lengthSanitizer },
    {
      sanitizer: (key, value) => {
        return key?.toLowerCase() === 'customer'
          ? 'F' + lengthSanitizer(undefined, value.substring(1))
          : value
      }
    }
  ]

};

function isRegExp(obj) {
  if (typeof obj === 'object' && obj.constructor.name === 'RegExp') return true

  return false
}

function validateDefinition(sanitizer) {

  const validateOneDef = elem => {

    let options = { rule: undefined, ops: 0, name: undefined };

    if (elem.sanitizer !== undefined) {
      options.ops = options.ops + 1;
      options.rule = elem.sanitizer;
      options.name = 'sanitizer';
    }

    if (elem.field !== undefined) {
      options.ops = options.ops + 2;
      options.rule = elem.field;
      options.name = 'field';
    }

    if (elem.value !== undefined) {
      options.ops = options.ops + 4;
      options.rule = elem.value;
      options.name = 'value';
    }

    if (options.name === undefined)
      throw new CustomError('SANITIZER_DEF_ERROR', 'Expected at least one filled property of: value, field or sanitizer.', elem)

    if (options.name === 'field' && typeof options.rule !== 'string' && isRegExp(options.rule) === false)
      throw new CustomError('SANITIZER_DEF_ERROR', 'field property must be of string type', elem)

    if (elem.type !== undefined && ['string', 'object', 'number', 'boolean'].indexOf(elem.type) === -1)
      throw new CustomError('SANITIZER_DEF_ERROR', 'type property must be of a valid type: string, object, number or boolean', elem)

    if (options.name === 'sanitizer' && typeof options.rule !== 'function')
      throw new CustomError('SANITIZER_DEF_ERROR', 'sanitizer property must be a function.', elem)

    if ([3, 5, 6, 7].indexOf(options.ops) !== -1)
      throw new CustomError(
        'SANITIZER_DEF_ERROR',
        `${options > 6 ? 3 : 2} properties informed and only one allowed between: sanitizer, value or field.`,
        elem
      )

    if (elem.replacer === undefined && elem.sanitizer === undefined)
      throw new CustomError(
        'SANITIZER_DEF_ERROR',
        `Replacer OR sanitizer property must be defined.`,
        elem
      )

    if (elem.replacer !== undefined && elem.sanitizer !== undefined)
      throw new CustomError(
        'SANITIZER_DEF_ERROR',
        `Replacer AND sanitizer cannot be used together`,
        elem
      )
  };

  sanitizer.forEach(validateOneDef);
}

function consolidateGroups(sanitizers) {
  return sanitizers.flatMap(
    sanitizer => {

      let toReturn;
      if (typeof sanitizer === 'string') toReturn = sanitizedGroups[sanitizer];
      else toReturn = sanitizer;

      validateDefinition(toReturn);
      return toReturn
    })
}

function sanitize(obj, sanitizers = ['ibmApis'], noSanitzedUptoLogLevel) {


  const indexLevel = log.levelNumber(noSanitzedUptoLogLevel);

  if (indexLevel !== undefined && log.getLevel() <= indexLevel) return obj;

  const allGroupsConsolidated = consolidateGroups(sanitizers);

  return objectDeepMapValues(obj, customizer)

  function isToReplace(fieldOrValue, key, val, keyOrVal) {
    if (typeof fieldOrValue === 'function')
      return fieldOrValue(key, val)

    if (isRegExp(fieldOrValue) && typeof keyOrVal === 'string')
      return keyOrVal?.match(fieldOrValue)

    return collectionCompare(fieldOrValue, keyOrVal)
  }

  function toReplace(replacer, key, val) {
    if (typeof replacer === 'function') return replacer(key, val)
    else return replacer
  }

  function typeMet(value, type) {
    if (type === undefined || typeof value === type) return true
    else return false
  }

  function customizer(leafValue, keyOfLeaf) {
    if (leafValue === null || leafValue === undefined || Object.keys(leafValue).length === 0) return leafValue

    for (let { field, value, type, sanitizer, replacer } of allGroupsConsolidated) {
      if (typeMet(leafValue, type) === false) return leafValue
      if (sanitizer !== undefined) return sanitizer(keyOfLeaf, leafValue)
      if (field !== undefined && isToReplace(field, keyOfLeaf, leafValue, keyOfLeaf)) return toReplace(replacer, keyOfLeaf, leafValue)
      if (value !== undefined && isToReplace(value, keyOfLeaf, leafValue, leafValue)) return toReplace(replacer, keyOfLeaf, leafValue)
    }

  }

}

export { Chrono, CustomError, Enum, EnumMap, F, Index, index as R, RE, RLog, Table, Text, Timeline, YYYY_MM_DD_hh_mm_ss_ToUtcDate, addDays, anonymize, arrayOfObjectsToObject, arraySorter, arrayToObject, bearerSanitizer, between, cleanString, cloneCopy, colorByStatus, colorMessage, colorMessageByStatus, colors, consoleTable, consoleTableExtended, copyPropsWithValue, copyPropsWithValueUsingRules, createCustomErrorClass, dateFormatter, dateToObj, deepFreeze, diffInDaysYYYY_MM_DD, exclude, fetchImproved, ffletchMaker, fillWith, filterFlatMap, filterMap, findDeepKey, findSolution, firstCapital, fletch, formatDate, getAt, getSameDateOrPreviousFridayForWeekends, groupByWithCalc, indexOfNthMatch, innerRightJoinWith, isDate, isDateMidnight, isEmpty$1 as isEmpty, isPromise, isStringADate, lengthSanitizer, log, logWithPrefix, loopIndexGenerator, mapWithNext, mapWithPrevious, matchByPropId, memoize, mergeArrayOfObjectsRenamingProps, notTo, oneIn, parallel, partialAtPos, pickPaths, pipe, pipeWhile, pipeWithChain, plan, previousDayOfWeek, processExit, project$1 as project, promiseAll, promiseFunToFutureFun, pushAt, pushUniqueKey, pushUniqueKeyOrChange, queryObjToStr, removeDuplicates, repeat$1 as repeat, replaceAll, retryWithSleep, runFunctionsSyncOrParallel, runFutureFunctionsInParallel, sanitize, setAt, setDateToMidnight, sleep, sleepWithFunction, sleepWithValue, something, sorterByPaths, splitCond, subtractDays, transition, traverse$1 as traverse, traverseVertically, uncurry, unionWithHashKeys, updateWithHashKeys, urlCompose, urlDecompose, varSubsDoubleBracket, wildcardToRegExp };
