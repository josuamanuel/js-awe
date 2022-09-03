var awe = (function (exports, _, R, F, types, fetch, loglevel, stream, streamTransform, util, fs) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n["default"] = e;
    return Object.freeze(n);
  }

  var ___default = /*#__PURE__*/_interopDefaultLegacy(_);
  var R__namespace = /*#__PURE__*/_interopNamespace(R);
  var F__namespace = /*#__PURE__*/_interopNamespace(F);
  var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);
  var loglevel__default = /*#__PURE__*/_interopDefaultLegacy(loglevel);
  var stream__default = /*#__PURE__*/_interopDefaultLegacy(stream);
  var util__default = /*#__PURE__*/_interopDefaultLegacy(util);
  var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

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

  /**
   * lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="npm" -o ./`
   * Copyright jQuery Foundation and other contributors <https://jquery.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      symbolTag = '[object Symbol]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
  cloneableTags[boolTag] = cloneableTags[dateTag] =
  cloneableTags[float32Tag] = cloneableTags[float64Tag] =
  cloneableTags[int8Tag] = cloneableTags[int16Tag] =
  cloneableTags[int32Tag] = cloneableTags[mapTag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[setTag] =
  cloneableTags[stringTag] = cloneableTags[symbolTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[weakMapTag] = false;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /** Detect free variable `exports`. */
  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /**
   * Adds the key-value `pair` to `map`.
   *
   * @private
   * @param {Object} map The map to modify.
   * @param {Array} pair The key-value pair to add.
   * @returns {Object} Returns `map`.
   */
  function addMapEntry(map, pair) {
    // Don't return `map.set` because it's not chainable in IE 11.
    map.set(pair[0], pair[1]);
    return map;
  }

  /**
   * Adds `value` to `set`.
   *
   * @private
   * @param {Object} set The set to modify.
   * @param {*} value The value to add.
   * @returns {Object} Returns `set`.
   */
  function addSetEntry(set, value) {
    // Don't return `set.add` because it's not chainable in IE 11.
    set.add(value);
    return set;
  }

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array ? array.length : 0;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  /**
   * A specialized version of `_.reduce` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the first element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1,
        length = array ? array.length : 0;

    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Checks if `value` is a host object in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
   */
  function isHostObject(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;
    if (value != null && typeof value.toString != 'function') {
      try {
        result = !!(value + '');
      } catch (e) {}
    }
    return result;
  }

  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */
  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);

    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */
  function setToArray(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }

  /** Used for built-in method references. */
  var arrayProto = Array.prototype,
      funcProto = Function.prototype,
      objectProto = Object.prototype;

  /** Used to detect overreaching core-js shims. */
  var coreJsData = root['__core-js_shared__'];

  /** Used to detect methods masquerading as native. */
  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? ('Symbol(src)_1.' + uid) : '';
  }());

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objectToString = objectProto.toString;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' +
    funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /** Built-in value references. */
  var Buffer = moduleExports ? root.Buffer : undefined,
      Symbol$1 = root.Symbol,
      Uint8Array = root.Uint8Array,
      getPrototype = overArg(Object.getPrototypeOf, Object),
      objectCreate = Object.create,
      propertyIsEnumerable = objectProto.propertyIsEnumerable,
      splice = arrayProto.splice;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeGetSymbols = Object.getOwnPropertySymbols,
      nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
      nativeKeys = overArg(Object.keys, Object);

  /* Built-in method references that are verified to be native. */
  var DataView = getNative(root, 'DataView'),
      Map$1 = getNative(root, 'Map'),
      Promise$1 = getNative(root, 'Promise'),
      Set$1 = getNative(root, 'Set'),
      WeakMap = getNative(root, 'WeakMap'),
      nativeCreate = getNative(Object, 'create');

  /** Used to detect maps, sets, and weakmaps. */
  var dataViewCtorString = toSource(DataView),
      mapCtorString = toSource(Map$1),
      promiseCtorString = toSource(Promise$1),
      setCtorString = toSource(Set$1),
      weakMapCtorString = toSource(WeakMap);

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
      symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash(entries) {
    var index = -1,
        length = entries ? entries.length : 0;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
  }

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function hashDelete(key) {
    return this.has(key) && delete this.__data__[key];
  }

  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty.call(data, key) ? data[key] : undefined;
  }

  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
  }

  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */
  function hashSet(key, value) {
    var data = this.__data__;
    data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
    return this;
  }

  // Add methods to `Hash`.
  Hash.prototype.clear = hashClear;
  Hash.prototype['delete'] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function ListCache(entries) {
    var index = -1,
        length = entries ? entries.length : 0;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
  }

  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function listCacheDelete(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    return true;
  }

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function listCacheGet(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    return index < 0 ? undefined : data[index][1];
  }

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }

  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */
  function listCacheSet(key, value) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }

  // Add methods to `ListCache`.
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype['delete'] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function MapCache(entries) {
    var index = -1,
        length = entries ? entries.length : 0;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear() {
    this.__data__ = {
      'hash': new Hash,
      'map': new (Map$1 || ListCache),
      'string': new Hash
    };
  }

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function mapCacheDelete(key) {
    return getMapData(this, key)['delete'](key);
  }

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }

  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */
  function mapCacheSet(key, value) {
    getMapData(this, key).set(key, value);
    return this;
  }

  // Add methods to `MapCache`.
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype['delete'] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;

  /**
   * Creates a stack cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Stack(entries) {
    this.__data__ = new ListCache(entries);
  }

  /**
   * Removes all key-value entries from the stack.
   *
   * @private
   * @name clear
   * @memberOf Stack
   */
  function stackClear() {
    this.__data__ = new ListCache;
  }

  /**
   * Removes `key` and its value from the stack.
   *
   * @private
   * @name delete
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function stackDelete(key) {
    return this.__data__['delete'](key);
  }

  /**
   * Gets the stack value for `key`.
   *
   * @private
   * @name get
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function stackGet(key) {
    return this.__data__.get(key);
  }

  /**
   * Checks if a stack value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function stackHas(key) {
    return this.__data__.has(key);
  }

  /**
   * Sets the stack `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Stack
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the stack cache instance.
   */
  function stackSet(key, value) {
    var cache = this.__data__;
    if (cache instanceof ListCache) {
      var pairs = cache.__data__;
      if (!Map$1 || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
        pairs.push([key, value]);
        return this;
      }
      cache = this.__data__ = new MapCache(pairs);
    }
    cache.set(key, value);
    return this;
  }

  // Add methods to `Stack`.
  Stack.prototype.clear = stackClear;
  Stack.prototype['delete'] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;

  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */
  function arrayLikeKeys(value, inherited) {
    // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    // Safari 9 makes `arguments.length` enumerable in strict mode.
    var result = (isArray(value) || isArguments(value))
      ? baseTimes(value.length, String)
      : [];

    var length = result.length,
        skipIndexes = !!length;

    for (var key in value) {
      if ((inherited || hasOwnProperty.call(value, key)) &&
          !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * Assigns `value` to `key` of `object` if the existing value is not equivalent
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
        (value === undefined && !(key in object))) {
      object[key] = value;
    }
  }

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.assign` without support for multiple sources
   * or `customizer` functions.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @returns {Object} Returns `object`.
   */
  function baseAssign(object, source) {
    return object && copyObject(source, keys(source), object);
  }

  /**
   * The base implementation of `_.clone` and `_.cloneDeep` which tracks
   * traversed objects.
   *
   * @private
   * @param {*} value The value to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @param {boolean} [isFull] Specify a clone including symbols.
   * @param {Function} [customizer] The function to customize cloning.
   * @param {string} [key] The key of `value`.
   * @param {Object} [object] The parent object of `value`.
   * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
   * @returns {*} Returns the cloned value.
   */
  function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
    var result;
    if (customizer) {
      result = object ? customizer(value, key, object, stack) : customizer(value);
    }
    if (result !== undefined) {
      return result;
    }
    if (!isObject(value)) {
      return value;
    }
    var isArr = isArray(value);
    if (isArr) {
      result = initCloneArray(value);
      if (!isDeep) {
        return copyArray(value, result);
      }
    } else {
      var tag = getTag(value),
          isFunc = tag == funcTag || tag == genTag;

      if (isBuffer(value)) {
        return cloneBuffer(value, isDeep);
      }
      if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
        if (isHostObject(value)) {
          return object ? value : {};
        }
        result = initCloneObject(isFunc ? {} : value);
        if (!isDeep) {
          return copySymbols(value, baseAssign(result, value));
        }
      } else {
        if (!cloneableTags[tag]) {
          return object ? value : {};
        }
        result = initCloneByTag(value, tag, baseClone, isDeep);
      }
    }
    // Check for circular references and return its corresponding clone.
    stack || (stack = new Stack);
    var stacked = stack.get(value);
    if (stacked) {
      return stacked;
    }
    stack.set(value, result);

    if (!isArr) {
      var props = isFull ? getAllKeys(value) : keys(value);
    }
    arrayEach(props || value, function(subValue, key) {
      if (props) {
        key = subValue;
        subValue = value[key];
      }
      // Recursively populate clone (susceptible to call stack limits).
      assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
    });
    return result;
  }

  /**
   * The base implementation of `_.create` without support for assigning
   * properties to the created object.
   *
   * @private
   * @param {Object} prototype The object to inherit from.
   * @returns {Object} Returns the new object.
   */
  function baseCreate(proto) {
    return isObject(proto) ? objectCreate(proto) : {};
  }

  /**
   * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
   * `keysFunc` and `symbolsFunc` to get the enumerable property names and
   * symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @param {Function} symbolsFunc The function to get the symbols of `object`.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
  }

  /**
   * The base implementation of `getTag`.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    return objectToString.call(value);
  }

  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }

  /**
   * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty.call(object, key) && key != 'constructor') {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * Creates a clone of  `buffer`.
   *
   * @private
   * @param {Buffer} buffer The buffer to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Buffer} Returns the cloned buffer.
   */
  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var result = new buffer.constructor(buffer.length);
    buffer.copy(result);
    return result;
  }

  /**
   * Creates a clone of `arrayBuffer`.
   *
   * @private
   * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
   * @returns {ArrayBuffer} Returns the cloned array buffer.
   */
  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array(result).set(new Uint8Array(arrayBuffer));
    return result;
  }

  /**
   * Creates a clone of `dataView`.
   *
   * @private
   * @param {Object} dataView The data view to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned data view.
   */
  function cloneDataView(dataView, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
  }

  /**
   * Creates a clone of `map`.
   *
   * @private
   * @param {Object} map The map to clone.
   * @param {Function} cloneFunc The function to clone values.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned map.
   */
  function cloneMap(map, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
    return arrayReduce(array, addMapEntry, new map.constructor);
  }

  /**
   * Creates a clone of `regexp`.
   *
   * @private
   * @param {Object} regexp The regexp to clone.
   * @returns {Object} Returns the cloned regexp.
   */
  function cloneRegExp(regexp) {
    var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
  }

  /**
   * Creates a clone of `set`.
   *
   * @private
   * @param {Object} set The set to clone.
   * @param {Function} cloneFunc The function to clone values.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned set.
   */
  function cloneSet(set, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
    return arrayReduce(array, addSetEntry, new set.constructor);
  }

  /**
   * Creates a clone of the `symbol` object.
   *
   * @private
   * @param {Object} symbol The symbol object to clone.
   * @returns {Object} Returns the cloned symbol object.
   */
  function cloneSymbol(symbol) {
    return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
  }

  /**
   * Creates a clone of `typedArray`.
   *
   * @private
   * @param {Object} typedArray The typed array to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned typed array.
   */
  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }

  /**
   * Copies the values of `source` to `array`.
   *
   * @private
   * @param {Array} source The array to copy values from.
   * @param {Array} [array=[]] The array to copy values to.
   * @returns {Array} Returns `array`.
   */
  function copyArray(source, array) {
    var index = -1,
        length = source.length;

    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }

  /**
   * Copies properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy properties from.
   * @param {Array} props The property identifiers to copy.
   * @param {Object} [object={}] The object to copy properties to.
   * @param {Function} [customizer] The function to customize copied values.
   * @returns {Object} Returns `object`.
   */
  function copyObject(source, props, object, customizer) {
    object || (object = {});

    var index = -1,
        length = props.length;

    while (++index < length) {
      var key = props[index];

      var newValue = customizer
        ? customizer(object[key], source[key], key, object, source)
        : undefined;

      assignValue(object, key, newValue === undefined ? source[key] : newValue);
    }
    return object;
  }

  /**
   * Copies own symbol properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy symbols from.
   * @param {Object} [object={}] The object to copy symbols to.
   * @returns {Object} Returns `object`.
   */
  function copySymbols(source, object) {
    return copyObject(source, getSymbols(source), object);
  }

  /**
   * Creates an array of own enumerable property names and symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols);
  }

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key)
      ? data[typeof key == 'string' ? 'string' : 'hash']
      : data.map;
  }

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }

  /**
   * Creates an array of the own enumerable symbol properties of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of symbols.
   */
  var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

  /**
   * Gets the `toStringTag` of `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  var getTag = baseGetTag;

  // Fallback for data views, maps, sets, and weak maps in IE 11,
  // for data views in Edge < 14, and promises in Node.js.
  if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
      (Map$1 && getTag(new Map$1) != mapTag) ||
      (Promise$1 && getTag(Promise$1.resolve()) != promiseTag) ||
      (Set$1 && getTag(new Set$1) != setTag) ||
      (WeakMap && getTag(new WeakMap) != weakMapTag)) {
    getTag = function(value) {
      var result = objectToString.call(value),
          Ctor = result == objectTag ? value.constructor : undefined,
          ctorString = Ctor ? toSource(Ctor) : undefined;

      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString: return dataViewTag;
          case mapCtorString: return mapTag;
          case promiseCtorString: return promiseTag;
          case setCtorString: return setTag;
          case weakMapCtorString: return weakMapTag;
        }
      }
      return result;
    };
  }

  /**
   * Initializes an array clone.
   *
   * @private
   * @param {Array} array The array to clone.
   * @returns {Array} Returns the initialized clone.
   */
  function initCloneArray(array) {
    var length = array.length,
        result = array.constructor(length);

    // Add properties assigned by `RegExp#exec`.
    if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
      result.index = array.index;
      result.input = array.input;
    }
    return result;
  }

  /**
   * Initializes an object clone.
   *
   * @private
   * @param {Object} object The object to clone.
   * @returns {Object} Returns the initialized clone.
   */
  function initCloneObject(object) {
    return (typeof object.constructor == 'function' && !isPrototype(object))
      ? baseCreate(getPrototype(object))
      : {};
  }

  /**
   * Initializes an object clone based on its `toStringTag`.
   *
   * **Note:** This function only supports cloning values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   * @private
   * @param {Object} object The object to clone.
   * @param {string} tag The `toStringTag` of the object to clone.
   * @param {Function} cloneFunc The function to clone values.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the initialized clone.
   */
  function initCloneByTag(object, tag, cloneFunc, isDeep) {
    var Ctor = object.constructor;
    switch (tag) {
      case arrayBufferTag:
        return cloneArrayBuffer(object);

      case boolTag:
      case dateTag:
        return new Ctor(+object);

      case dataViewTag:
        return cloneDataView(object, isDeep);

      case float32Tag: case float64Tag:
      case int8Tag: case int16Tag: case int32Tag:
      case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
        return cloneTypedArray(object, isDeep);

      case mapTag:
        return cloneMap(object, isDeep, cloneFunc);

      case numberTag:
      case stringTag:
        return new Ctor(object);

      case regexpTag:
        return cloneRegExp(object);

      case setTag:
        return cloneSet(object, isDeep, cloneFunc);

      case symbolTag:
        return cloneSymbol(object);
    }
  }

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length &&
      (typeof value == 'number' || reIsUint.test(value)) &&
      (value > -1 && value % 1 == 0 && value < length);
  }

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = typeof value;
    return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
      ? (value !== '__proto__')
      : (value === null);
  }

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked(func) {
    return !!maskSrcKey && (maskSrcKey in func);
  }

  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */
  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

    return value === proto;
  }

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to process.
   * @returns {string} Returns the source code.
   */
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}
      try {
        return (func + '');
      } catch (e) {}
    }
    return '';
  }

  /**
   * This method is like `_.clone` except that it recursively clones `value`.
   *
   * @static
   * @memberOf _
   * @since 1.0.0
   * @category Lang
   * @param {*} value The value to recursively clone.
   * @returns {*} Returns the deep cloned value.
   * @see _.clone
   * @example
   *
   * var objects = [{ 'a': 1 }, { 'b': 2 }];
   *
   * var deep = _.cloneDeep(objects);
   * console.log(deep[0] === objects[0]);
   * // => false
   */
  function cloneDeep$1(value) {
    return baseClone(value, true, true);
  }

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || (value !== value && other !== other);
  }

  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  function isArguments(value) {
    // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
      (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
  }

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }

  /**
   * This method is like `_.isArrayLike` except that it also checks if `value`
   * is an object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array-like object,
   *  else `false`.
   * @example
   *
   * _.isArrayLikeObject([1, 2, 3]);
   * // => true
   *
   * _.isArrayLikeObject(document.body.children);
   * // => true
   *
   * _.isArrayLikeObject('abc');
   * // => false
   *
   * _.isArrayLikeObject(_.noop);
   * // => false
   */
  function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
  }

  /**
   * Checks if `value` is a buffer.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
   * @example
   *
   * _.isBuffer(new Buffer(2));
   * // => true
   *
   * _.isBuffer(new Uint8Array(2));
   * // => false
   */
  var isBuffer = nativeIsBuffer || stubFalse;

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 8-9 which returns 'object' for typed array and other constructors.
    var tag = isObject(value) ? objectToString.call(value) : '';
    return tag == funcTag || tag == genTag;
  }

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */
  function isLength(value) {
    return typeof value == 'number' &&
      value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
  }

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }

  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * for more details.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */
  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }

  /**
   * This method returns a new empty array.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {Array} Returns the new empty array.
   * @example
   *
   * var arrays = _.times(2, _.stubArray);
   *
   * console.log(arrays);
   * // => [[], []]
   *
   * console.log(arrays[0] === arrays[1]);
   * // => false
   */
  function stubArray() {
    return [];
  }

  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */
  function stubFalse() {
    return false;
  }

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

    static of=CustomError
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

        stateRules = cloneDeep$1(rules);
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

      return new Proxy(cloneDeep$1(values), this)
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

      return new EnumMap(cloneDeep$1(invertedValues))
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


  function transition(states, events, transitions)
  {
    states.forEach(validateStateFormat);
    events.forEach(validateEventFormat);

    let state = states[0];
    let finalTransitions = Object.entries(transitions).reduce(
      (acum, [stateKey, stateValue]) => {
        // validations
        validateState(stateKey);

        let newStateValue = stateValue;
        if(typeof stateValue === 'string') 
        {
          validateState(stateValue);

          newStateValue = events.reduce(
            (acum, current) => {
              acum[current] = stateValue;
              return acum
            },
            {}
          );
        }else
        {
          Object.entries(newStateValue).forEach(([key, value])=> {
            validateEvent(key);
            validateState(value);
          });
        }

        

        acum[stateKey] = {...acum[stateKey], ...newStateValue};
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

    function validateStateFormat(state)
    {
      if(state !== state.toUpperCase())
        throw new CustomError('STATE_MUST_BE_UPPERCASE', `The state: ${state} does not have all characters in uppercase`)
    }

    function validateState(state)
    {
      if(states.some(el => el === state) === false)
        throw new CustomError('STATE_NOT_FOUND', `The state: ${state} was not found in the list of states supplied: ${states}`)
    }


    function validateEventFormat(event)
    {
      if(event !== event.toLowerCase())
        throw new CustomError('EVENT_MUST_BE_LOWERCASE', `The event: ${event} does not have all characters in lowercase`)
    }


    function validateEvent(event)
    {
      if(events.some(el => el === event) === false)
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

  // reviver is called for each node as: reviver(nodeRef, currentPath, parent). For example: currentPath=['root', 'parent', 'son', '0', 'jose']
  // reviver return value will impact traverse: 
  //  undefined: do nothing.
  //  Any value: assign this value (parent[key])
  //  traverse.stop: stop inmediatly traverse
  //  traverse.skip: skip node. It doesnt look at children of node.
  //  prune: if true remove node.


  function traverse(objIni, reviver, pureFunction = true) {
    const currentPath = ['root'];

    const objClone = pureFunction ? cloneDeep$1(objIni) : objIni;

    let exitVar = false;
    let objForReviver = {};
    objForReviver['root'] = objClone;

    let isSkipNodeOnce = reviverProcess(reviver, objForReviver, 'root', currentPath);

    if (objClone !== objForReviver['root']) return objForReviver['root']

    if (exitVar === true) return objForReviver['root']

    if (isSkipNodeOnce === false) {
      traverseRec(objForReviver['root']);
    }

    return objForReviver['root']

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
        if (resultReviver !== undefined && resultReviver !== traverse.stop && resultReviver !== traverse.skip && resultReviver !== traverse.delete) {
          obj[prop] = resultReviver;
        }

        if (resultReviver === traverse.stop) {
          exitVar = true;
        }

        if (resultReviver === traverse.skip) {
          isSkipNodeOnce = true;
        }

        if (resultReviver === traverse.delete) {
          obj[prop] = undefined;
          isSkipNodeOnce = true;
        }
      }

      return isSkipNodeOnce
    }

  }

  traverse.skip = Symbol();
  traverse.stop = Symbol();
  traverse.delete = Symbol();


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

          let valueToCopy = getValueAtPath(inputObj, from);

          if (valueToCopy === undefined || valueToCopy === null) return

          if (shouldUpdateOnlyEmptyFields === true && isEmpty(getValueAtPath(objDest, to)))
            setValueAtPath(objDest, to, valueToCopy);

          if (shouldUpdateOnlyEmptyFields === false)
            setValueAtPath(objDest, to, valueToCopy);

        }
      );

      return objDest
    }
  }
  // {
  //   let objTo = {a:{b:2},c:3}
  //   let objFrom = {a:{b:4},c:8,d:{e:{f:12}}}
  //   copyPropsWithValueUsingRules(objTo, [{from:'a.b', to:'c'}, {from:'d.e.f', to:'d'}])(objFrom)
  //   objTo
  // }
  // {
  //   let objTo = {a:{b:2},c:3}
  //   let objFrom = {a:{b:4},c:8,d:{e:{f:12}}}
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

  function copyPropsWithValue(objDest, shouldUpdateOnlyEmptyFields = false) {
    return function (input) {
      traverse(input, (nodeValue, currentPath) => {

        if (isALeaf(nodeValue) === false) return

        if (nodeValue === undefined || nodeValue === null) return

        const destPath = currentPath.slice(1 - currentPath.length);

        if (shouldUpdateOnlyEmptyFields === true) {
          const valueAtDest = getValueAtPath(objDest, destPath);
          if (isEmpty(valueAtDest)) setValueAtPath(objDest, destPath, nodeValue);

          return
        }

        setValueAtPath(objDest, destPath, nodeValue); //?

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

  function isEmpty(value) {
    if (
      value === undefined ||
      value === null ||
      value === '' ||
      value === 0 ||
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

    /*
      
    {
      "response": {
        "id": 1231,
        "description": "{{description=\"This is a test\"}}",
        "car": "{{plate}}",
        "active": "{{active=true}}",
        "ratenumber": "{{rate=10}}"
      }
    }
    */

    // regex to deal with the case the entire value is a substitution group
    let regexVar = /"{{(.*?)(?:=(.*?))?}}"/g;

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
    let regexVarPartial = /{{(.*?)(?:=(.*?))?}}/g;
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

  function isDate(d) {
    return d instanceof Date && !isNaN(d);
  }

  function isStringADate(stringDate) {
    if (typeof stringDate !== 'string') return false

    const date = new Date(stringDate);

    if (date >= new Date('0000-01-01') && date <= new Date('9999-12-31')) return true

    return false
  }

  function dateFormatter(format) {
    return (date) => formatDate(format, date)
  }

  function formatDate(format, date) {

    let dateToProcess = (date ? new Date(date) : new Date());

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

    const YYYY = dateIsoString.substr(0, 4);
    const YY = dateIsoString.substr(2, 2);
    const MM = dateIsoString.substr(5, 2);
    const DD = dateIsoString.substr(8, 2);
    const D = parseInt(DD, 10).toString();
    const hh = dateIsoString.substr(11, 2);
    const h = parseInt(hh, 10).toString();
    const mm = dateIsoString.substr(14, 2);
    const ss = dateIsoString.substr(17, 2);
    const mil = dateIsoString.substr(20, 3);
    const mi = dateIsoString.substr(20, 2);

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
    const dateYYYY = parseInt(dateYYYY_MM_DD_hh_mm_ss.substr(0, 4));
    const dateMM = parseInt(dateYYYY_MM_DD_hh_mm_ss.substr(5, 2)) - 1; // Months start with 0
    const dateDD = parseInt(dateYYYY_MM_DD_hh_mm_ss.substr(8, 2));
    const datehh = parseInt(dateYYYY_MM_DD_hh_mm_ss.substr(11, 2));
    const datemm = parseInt(dateYYYY_MM_DD_hh_mm_ss.substr(14, 2));
    const datess = parseInt(dateYYYY_MM_DD_hh_mm_ss.substr(17, 2));

    return Date.UTC(dateYYYY, dateMM, dateDD, datehh, datemm, datess)
  }

  function dateToObj(date) {
    let dateToProcess = new Date(date) ?? new Date();
    let ISODate = dateToProcess.toISOString();

    return {
      YYYY: parseInt(ISODate.substr(0, 4)),
      MM: parseInt(ISODate.substr(5, 2)),
      DD: parseInt(ISODate.substr(8, 2)),
      hh: parseInt(ISODate.substr(11, 2)),
      mm: parseInt(ISODate.substr(14, 2)),
      ss: parseInt(ISODate.substr(17, 2)),
      mil: parseInt(ISODate.substr(20, 3))
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
    let dateToReturn =
      date
        ? new Date(date)
        : new Date();

    if (isDate(dateToReturn) === false) return date

    dateToReturn.setDate(dateToReturn.getDate() - daysToSubtract);
    return dateToReturn
  }
  //subtractDays(40).toISOString() //?
  //subtractDays(3, new Date('2021-03-25')) //?

  function previousDayOfWeek(dayOfWeek, date) {
    let dateObj = date ?? new Date();

    if (isDate(dateObj) === false) return date

    let diffInDaysOfWeek = dateObj.getDay() - dayOfWeek;

    let toSubtract = diffInDaysOfWeek >= 0
      ? diffInDaysOfWeek
      : 7 + diffInDaysOfWeek;

    return subtractDays(toSubtract, dateObj)
  }
  //previousDayOfWeek(6,new Date('2021-05-07')).toISOString() //?
  //previousDayOfWeek(1,new Date('2021-03-25'))

  function getSameDateOrPreviousFridayForWeekends(date) {
    let dateObj = date ?? new Date();

    if (isDate(dateObj) === false) return date

    const dayOfWeek = dateObj.getUTCDay();

    if (dayOfWeek > 0 && dayOfWeek < 6) return dateObj

    //Sunday
    if (dayOfWeek === 0) return subtractDays(2, dateObj)

    //Saturday (dayOfWeek === 6)
    return subtractDays(1, dateObj)
  }
  // getSameDateOrPreviousFridayForWeekends() //?
  // //2021-05-14T00:00:00.000Z
  // getSameDateOrPreviousFridayForWeekends(new Date('2021-05-15')).toISOString() //?
  // ////2021-05-14T00:00:00.000Z
  // getSameDateOrPreviousFridayForWeekends(new Date('2021-05-16')).toISOString() //?


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

  function getValueAtPath(obj, valuePath) {
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
  // getValueAtPath(undefined, '') //?
  // getValueAtPath(5, '') //?
  // getValueAtPath({arr:[1,2,{b:3}],j:{n:3}}, 'j') //?
  // getValueAtPath({arr:[1,2,{b:3}],j:{n:3}}, 'arr.$last.b') //?
  // getValueAtPath({arr:[1,2,{b:3}],j:{n:3}}, 'j') //?


  function setValueAtPath(obj, valuePath, value) {
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
      throw { name: 'setValueAtPathParamsException', msg: 'obj: ' + obj + ', valuePath: ' + valuePath + ', value: ' + value }
    }

    try {
      valuePathArray = typeof valuePath === 'string' ? valuePath.split('.') : valuePath;
      valuePathArray;
      for (let i = 0, j = valuePathArray.length; i < j; i++) {

        if (i === (valuePathArray.length - 1)) {
          if (result?.[valuePathArray[i]] !== undefined) {
            result?.[valuePathArray[i]]; //?
            valueReturn;
            if (valueReturn !== CREATED) valueReturn = MODIFIED;
          } else {
            if (valueReturn !== CREATED) valueReturn = ADDED;
          }
          result[valuePathArray[i]] = value;
        } else {
          if (typeof result[valuePathArray[i]] !== 'object') {
            if (Number.isNaN(Number(valuePathArray[i + 1]))) result[valuePathArray[i]] = {};
            else result[valuePathArray[i]] = [];

            valueReturn = CREATED;
          }

          result = result[valuePathArray[i]];
        }
      }
      if (valueReturn === FAILED) {
        throw { name: 'setValueAtPathException', msg: 'obj: ' + obj + ', valuePath: ' + valuePath + ', value: ' + value }
      }
    }
    catch (e) {
      console.log(e + ' Warning: There was an exception in setValueAtPath(obj, valuePath, value)... obj: ' + obj + ' valuePath: ' + valuePath + ' value: ' + value);
      valueReturn = FAILED;
      return valueReturn
    }
    return valueReturn
  }
  // {
  //   let obj = {}
  //   setValueAtPath(obj, 'a', '8') //?
  //   obj //?
  //   let obj2 = {a:3}
  //   setValueAtPath(obj2, 'b', '8') //?
  //   setValueAtPath(obj2, 'a.b', '8') //?
  //   setValueAtPath(obj2, 'd.e', 'a') //?
  //   obj2
  //   setValueAtPath(obj2, 'd.f', 'b') //?
  //   setValueAtPath(obj2, 'd.e', 'aa') //?
  //   setValueAtPath(obj2, 'e.g', 'c') //?
  //   obj2 //?
  // }

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
        if (getValueAtPath(objA, currentPath) > getValueAtPath(objB, currentPath)) return great
        else if (getValueAtPath(objA, currentPath) < getValueAtPath(objB, currentPath)) return less
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
    return new Promise(resolve =>
      setTimeout(() => resolve(value), ms)
    )
  }

  function sleepWithFunction(ms, func, ...params) {
    return new Promise(resolve =>
      setTimeout(() => resolve(func(...params)), ms)
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

  function repeat(numberOfTimes) {
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

  function runEvery(period) {

    let count = 0;

    function calls(runFunc) {

      function toExecute(...args) {
        count++;
        if (count === period) {
          count = 0;
          return runFunc(...args)
        }
      }

      toExecute.reset = () => count = 0;

      return toExecute
    }

    return { calls }
  }

  // let myRunEvery = runEvery(3).calls((txt1, txt2, txt3)=>{console.log(txt1, txt2, txt3);return 3})
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
    process.exit(1);
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
    getValueAtPath,
    setValueAtPath,
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
    traverse,
    copyPropsWithValue,
    copyPropsWithValueUsingRules,
    EnumMap,
    Enum,
    transition,
    pushUniqueKey,
    pushUniqueKeyOrChange,
    memoize,
    fillWith,
    isDate,
    isEmpty,
    isStringADate,
    formatDate,
    dateFormatter,
    YYYY_MM_DD_hh_mm_ss_ToUtcDate,
    dateToObj,
    diffInDaysYYYY_MM_DD,
    subtractDays,
    previousDayOfWeek,
    getSameDateOrPreviousFridayForWeekends,
    replaceAll,
    cleanString,
    repeat,
    runEvery,
    loopIndexGenerator,
    retryWithSleep,
    processExit
  };

  function reviverPromiseForCloneDeep(value) {
    if (jsUtils.isPromise(value)) return value
  }

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
          to[prop] = ___default["default"].cloneDeepWith(from[prop], reviverPromiseForCloneDeep);
        }
      }
    }

    return to
  }

  function wildcardToRegExp(pathSearch, flagsString, separator = '.') {

    let escSeparator = escapeRegExp(separator);

    let result = pathSearch.split(separator).join(`${escSeparator}`);
    result = result.split('*').join(`[^${escSeparator}]*`);
    result = result.split(`[^${escSeparator}]*[^${escSeparator}]*`).join('.*');
    result = '^' + result + '$';
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

  // ts-check
  const { cloneDeep } = ___default["default"]; 

  // Only needed for testing
  // import {  after, both, chain, map, fork } from 'fluture';
  // import { repeat, CustomError } from './jsUtils.js' 

  const RE = {};

  const groupByWithCalcUnc = (cond, keyOp) => data => {

    const opsToApply = Object.entries(keyOp);

    const groupObj = data.reduce(
      (acum, current, index) => {
        const indexRow = cond(current);
        opsToApply.forEach(
          ([key, opFunc]) => {
            acum[indexRow] = acum[indexRow] ?? {};
            acum[indexRow][key] = opFunc(acum[indexRow]?.[key], current?.[key]);
          }
        );
        acum[indexRow] = { ...current, ...acum[indexRow] };
        return acum
      },
      {}
    );

    return Object.values(groupObj)
  };

  const groupByWithCalc = R__namespace.curryN(2, groupByWithCalcUnc);
  RE.groupByWithCalc = groupByWithCalc;
  // RE.groupByWithCalc(
  //   (row) => row.date,
  //   {
  //     total:(l,r) => (l??0) + r,
  //     count:(l,r) => (l??0) + 1
  //   },
  // )(
  //   [
  //     {date:'2020-01-02', total:6}, 
  //     {date:'2020-01-03', total:5}, 
  //     {date:'2020-01-02', total:11}, 
  //     {date:'2020-01-03', total:6}, 
  //     {date:'2020-01-02', total:-5}
  //   ]
  // )//?

  const innerRightJoinWithUnc = (joinCond, transform = (k, l, r) => r, left, right) => {

    const joinCondCurry = R__namespace.uncurryN(2, joinCond);
    return R__namespace.chain(rightRow => {

      const mergeRecords = R__namespace.pipe(
        R__namespace.filter(joinCondCurry(R__namespace.__, rightRow)),
        R__namespace.map(R__namespace.mergeWithKey(transform, R__namespace.__, rightRow))
      )(left);

      if (mergeRecords.length === 0) return rightRow

      return mergeRecords

    })(right)

  };
  const innerRightJoinWith = R__namespace.curryN(4, innerRightJoinWithUnc);
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
  const unionWithHashKeys = R__namespace.curryN(5, unionWithHashKeysUnc);
  RE.unionWithHashKeys = unionWithHashKeys;
  // RE.unionWithHashKeys(undefined,
  //   elem=>elem.date,
  //   [{date:'2020-01-02', a:4},{date:'2020-01-03'}],
  //   elem=>elem.date
  // )(
  //   [{date:'2020-01-01'},{date:'2020-01-02',a:1}]
  // )//?


  // function updateWithHashKeysUnc(isAsc, hashAddNoDups, addNoDupsToTheEnd, hashMaster, master) {
  //   const union = new Map()

  //   for (let elem of master) {
  //     union.set(hashMaster(elem), elem)
  //   }

  //   for (let elem of addNoDupsToTheEnd) {
  //     union.set(hashAddNoDups(elem), elem)
  //   }

  //   if(isAsc === true || isAsc === false) {
  //     return Array.from(union.entries()).sort(sorterByPaths('0',isAsc)).map(elem => elem[1]) 
  //   }

  //   return Array.from(union.values())
  // }
  // const updateWithHashKeys = R.curryN(5, updateWithHashKeysUnc)
  // RE.updateWithHashKeys = updateWithHashKeys
  // RE.updateWithHashKeys(
  //   true,
  //   elem=>elem.date,
  //   [{date:'2020-01-08'},{date:'2020-01-03'},{date:'2020-01-02',a:2},{date:'2020-01-05',a:1}],
  //   elem=>elem.date
  // )(
  //   [{date:'2020-01-08',a:4},{date:'2020-01-01',a:1},{date:'2020-01-05',a:5}]
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
  const updateWithHashKeys = R__namespace.curryN(5, updateWithHashKeysUnc);
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



  const between = R__namespace.curry((l, r) => (R__namespace.both(R__namespace.gte(R__namespace.__, l), R__namespace.lt(R__namespace.__, r))));
  RE.between = between;

  const matchById = (l, r) =>
    R__namespace.isNil(l) === false
    && R__namespace.isNil(r) === false
    && ((l.id || l.Id || l.ID) === (r.id || r.Id || r.ID))
    && ((l.id || l.Id || l.ID) !== undefined);


  const matchByPropId = R__namespace.curryN(2, matchById);
  RE.matchByPropId = matchByPropId;

  // Returns matching in 1st index and filtered out in 0 index... followin success goes to the end rule.
  function splitCondUnc(condFun, array) {
    return R__namespace.reduce((acu, cur) => {
      if (condFun(cur)) return R__namespace.update(1, R__namespace.append(cur, acu[1]), acu)
      else return R__namespace.update(0, R__namespace.append(cur, acu[0]), acu)
    }, [[], []])
  }
  const splitCond = R__namespace.curryN(2, splitCondUnc);
  RE.splitCond = splitCond;

  const filterMap = R__namespace.curry(
    (filter, map, data) =>
      R__namespace.reduce(
        (acum, current) =>
          filter(current) ?
            R__namespace.append(map(current), acum) :
            acum, [], data)
  );
  RE.filterMap = filterMap;

  const mapWithNext = R__namespace.curry(
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

  const mapWithPrevious = R__namespace.curry(
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

  const n0IsNotUnfold =
    R__namespace.pipe(
      R__namespace.propEq('0', 'unfold'),
      R__namespace.not
    );

  const n1IsFunction =
    R__namespace.pipe(
      R__namespace.prop('1'),
      R__namespace.type,
      R__namespace.equals('Function')
    );

  function something(lib) {
    return (...args) =>
      R__namespace.pipe(
        // Convert to an array of for each function with array of 2 elements: 0 (key) name of function, 1 (value) function
        Object.entries,
        RE.filterMap(
          R__namespace.both(
            n0IsNotUnfold,
            n1IsFunction
          ),
          R__namespace.chain(
            // add a 3rd value. Now we will have 0: name function, 1: function, 2 result
            R__namespace.append,
            R__namespace.pipe(
              //R.tap(R.pipe(R.prop('0'),console.log)),
              R__namespace.prop('1'),
              R__namespace.tryCatch(
                R__namespace.pipe(
                  //R.uncurryN(args.length),
                  fun => {
                    const funU = uncurry(true)(fun);
                    const firstResult = funU(...R__namespace.clone(args));

                    if (typeof firstResult[0] === 'function' && args.length > 1) {
                      return funU(R__namespace.clone(...R__namespace.init(args)))(R__namespace.clone(R__namespace.last(args)))
                    }
                    return firstResult
                  }
                ),
                (exc, fun) => {
                  try {
                    return [
                      fun(R__namespace.clone(...R__namespace.init(args)))(R__namespace.clone(R__namespace.last(args))),
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
    return R__namespace.tryCatch(
      R__namespace.pipe(
        R__namespace.filter(
          (solution) => R__namespace.equals(solution[2][0], solutionToFind)
        ),
        R__namespace.map(R__namespace.applySpec({ fun: R__namespace.prop('0'), sign: R__namespace.path(['2', '1']) }))
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
    return elem instanceof Error && types.isPromise(acum)
  }

  const pipeWithChain = function (...func) {
    return function (...params) {
      return func.reduce(
        // iterate over functions to call in a specific way with the acum value. 
        (acum, currentPipeFunc, index) => {

          let chainFun;
          let pipeFunc = currentPipeFunc;

          // First function accepts multiVariant function... but there must meet certain condition.
          if (index === 0 && acum.length > 1) {
            const numberOfFutures = acum.filter(param => param?.constructor?.name === 'Future').length;
            if (numberOfFutures > 1)
              acum[acum.length - 1] = F.reject(new Error('Only one Future allowed...'));
            else
              if (numberOfFutures === 1 && R__namespace.last(acum)?.constructor?.name !== 'Future')
                acum[acum.length - 1] = F.reject(new Error('Future param must be the last param of the function'));
              else
                //Apply all the parameters to convert it to a unary function.
                pipeFunc = currentPipeFunc.bind(undefined, ...acum.slice(0, acum.length - 1));
          }

          // Then extract last parameter
          if (index === 0) {
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
                } else result = pipeFunc(elem);

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
        (acum, currentPipeFunc, index) => {

          let chainFun;
          let pipeFunc = currentPipeFunc;

          // First function accepts multiVariant function... but there must meet certain condition.
          if (index === 0 && acum.length > 1) {
            const numberOfFutures = acum.filter(param => param?.constructor?.name === 'Future').length;
            if (numberOfFutures > 1)
              acum[acum.length - 1] = F.reject(new Error('Only one Future allowed...'));
            else
              if (numberOfFutures === 1 && R__namespace.last(acum)?.constructor?.name !== 'Future')
                acum[acum.length - 1] = F.reject(new Error('Future param must be the last param of the function'));
              else
                //Apply all the parameters to convert it to a unary function.
                pipeFunc = currentPipeFunc.bind(undefined, ...acum.slice(0, acum.length - 1));
          }

          // Then extract last parameter
          if (index === 0) {
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
          else if (types.isPromise(acum))
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
                if (acum?.constructor?.name === 'Future' || types.isPromise(acum)) {
                  try {
                    result = pipeFunc(elem);
                  } catch (e) {
                    result = e;
                  }
                } else result = pipeFunc(elem);

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

    return R__namespace.last(finalReturn)
  };
  RE.pipeWhile = pipeWhile;

  // pipeWhile(x => x < 20)
  // (
  //  x => x + 2
  // )(2) //?

  function parallel(numberOfthreads = Infinity) {
    return futuresOrValues =>
      F.parallel
        (numberOfthreads)
        (futuresOrValues.map(elem => F.isFuture(elem) ? elem : F.resolve(elem)))
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
              return R__namespace.last(resultWithValuesPromisesOrFuture).then(run)
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
              F.isFuture(task)
                ? 'future'
                : types.isPromise(task)
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

        let { path, name, apply } = pickObjToProcess;

        let paths = path.split('.');
        if (name === undefined) name = R__namespace.last(paths);

        let valueAtPath = R__namespace.path(paths, obj);
        acum[name] =
          typeof apply === 'function'
            ? apply(valueAtPath)
            : valueAtPath;

        return acum
      }
      , {}
    )
  }
  const pickPaths = R__namespace.curryN(2, pickPathsUnc);
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
  const mergeArrayOfObjectsRenamingProps = R__namespace.curryN(3, mergeArrayOfObjectsRenamingPropsUnc);
  RE.mergeArrayOfObjectsRenamingProps = mergeArrayOfObjectsRenamingProps;
  // mergeArrayOfObjectsRenamingProps(
  //   [{ close: 5 }, { close: 6 }, { close: 30 }, { close: 50 }],
  //   [{ path: 'close', name: 'gspc' }, { path: 'close', name: 'anotherCopy' }],
  //   [{ close: 3 }, { close: 2 }]
  // )//?


  function RLog(prefixOrFormatter) {
    return (...obj) => {
      if(typeof prefixOrFormatter === 'function') {
        const cloneObj = cloneDeep(obj);
        console.log(prefixOrFormatter(...cloneObj));
      }else console.log(prefixOrFormatter, ...obj);

      return R__namespace.last(obj)
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

  function Table()
  {
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

    const listOfColumns = [
    ];

    function getTopLine()
    {
      return listOfColumns.reduce(
        (line, column, index) => 
            line + HORIZONTAL_LINE_CHAR + ''.padEnd(column.getSize(),  HORIZONTAL_LINE_CHAR) + 
            HORIZONTAL_LINE_CHAR + 
            (index < listOfColumns.length -1 ? TOP_COLUMN_SEPARATOR_CHAR : TOP_RIGHT_CORNNER_CHAR)
        , TABLE_LEFT_MARGIN_CHARS  + TOP_LEFT_CORNNER_CHAR
      )
    }

    function getBottonLine()
    {
      return listOfColumns.reduce(
        (line, column, index) => 
            line + HORIZONTAL_LINE_CHAR + ''.padEnd(column.getSize(),  HORIZONTAL_LINE_CHAR) + 
            HORIZONTAL_LINE_CHAR + 
            (index < listOfColumns.length -1 ? BOTTON_COLUMN_SEPARATOR_CHAR : BOTTON_RIGHT_CORNNER_CHAR)
        , TABLE_LEFT_MARGIN_CHARS  + BOTTON_LEFT_CORNNER_CHAR
      )
    }

    function getDownTableLine()
    {
      return listOfColumns.reduce(
        (line, column, index) => 
            line + HORIZONTAL_LINE_CHAR + ''.padEnd(column.getSize(),  HORIZONTAL_LINE_CHAR) + 
            HORIZONTAL_LINE_CHAR + 
            (index < listOfColumns.length -1 ? MIDDLE_COLUMN_SEPARATOR_CHAR : MIDDLE_RIGHT_SEPARATOR )
        , TABLE_LEFT_MARGIN_CHARS  + MIDDLE_LEFT_SEPARATOR
      )  
    }

    function linesOfData(section)
    {
      let allValuesAreDone; 
      let lines = [];
      let isFirstRow = true;
      let values = {};
      // Each iteration is a row in the table.
      // first row is used to initialize the generator function for each column.
      // So then we can extract each row with next()
      do {
        allValuesAreDone = true;

        const aLine = 
          listOfColumns
            .reduce(
              (line, component, index) => {
                if(isFirstRow) {
                  values[index] = component[section].nextValue();
                }
                const {value:columnValue, done} =values[index].next();
                if(done !== true) allValuesAreDone = false;

                return line + 
                      COLUMN_LEFT_MARGIN_CHARS + 
                      ( columnValue ?? component.getUndefinedRepresentation() ) +
                      COLUMN_RIGHT_MARGIN_CHARS + 
                      VERTICAL_LINE_CHAR
              },
              TABLE_LEFT_MARGIN_CHARS + VERTICAL_LINE_CHAR
            );

        if(allValuesAreDone === false) lines.push(aLine);
        isFirstRow = false;
      } while (allValuesAreDone === false);

      return lines
    }

    function draw(loadData)
    {

      listOfColumns.forEach(column => column.load(R__namespace.pluck(column.id)(loadData)));

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

    function addColumn({type, id, title })
    {
      let column = type.loadParams(id)(title);
      listOfColumns.push(column);
    }

    return {
      addColumn,
      draw
    }
  }

  function center(text, size) {
    let sizeInt = parseInt(size, 10);
    if (typeof text !== 'string' || isNaN(sizeInt)) return text

    const trimText = text.trim();
    if (trimText.length + 1 >= sizeInt) return trimText

    const leftPading = Math.floor((sizeInt - trimText.length) / 2);
    const rightPading = sizeInt - trimText.length - leftPading;

    return ''.padEnd(leftPading) + trimText + ''.padEnd(rightPading)
  }

  function left(text, size) {
    let sizeInt = parseInt(size, 10);
    if (typeof text !== 'string' || isNaN(sizeInt)) return text

    const trimText = text.trim();
    if (trimText.length >= sizeInt) return trimText

    return trimText.padEnd(sizeInt)
  }


  function putCenteredValueAtPosIfFit(line, value, pos, margins)
  {
    let valueStr = ('' + value);
    let rightHalf = Math.floor((valueStr.length - 1)/2);
    let leftHalf = valueStr.length - 1 - rightHalf;
    if(
      line.length < pos + rightHalf + margins ||
      line.substring(pos -leftHalf - margins, pos + rightHalf + margins).split('').some(el => el !== ' ')
    )
      return line
    else {
      return line.substring(0, pos - leftHalf) + valueStr + line.substring(pos + rightHalf + 1)
    }
  }

  //let asas =               'ms 0 2300  112  ' //?
  //putInLineScaleValueAtPos('ms 0 2300       ', 112, 12, 2) //?

  function putValueAtPos(line, value, pos)
  {
    return line.substring(0, pos ) + value + line.substring(pos + value.length)
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
              (acum, current) =>
                acum < current.length
                  ? current.length
                  : acum
              , 0
            );

            size = Math.max(size, title.length ?? 0);
          },

          getUndefinedRepresentation: () => ''.padEnd(size),
          getSize: () => size,

          heading: {
            nextValue: function* () {
              yield HEADING_IDENTATION(title, size);
            }
          },
          
          row: {
            nextValue: function* () {
              for (let el of data)
                yield ROW_IDENTATION(el, size);
            }
          }
        }
      }
    }
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
                data.flatMap(R__namespace.identity).reduce(
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
          getUndefinedRepresentation: ()=>''.padEnd(size),
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

  function Chrono() {

    let historyTimeIntervals = {};

    let chronoEvents = {};
    createTimeEvent('chronoCreation');

    let rangeType = Range({type:'hrtimeBigInt', displayFormat:'ms', referenceHrtime: chronoEvents['chronoCreation'].hrtime});

    function createTimeEvent(eventName) {
      chronoEvents[eventName] = {
        date: new Date(),
        hrtime: process.hrtime.bigint()
      };
    }

    function time(eventNames) {

      let currentHrtime = process.hrtime.bigint();

      let listOfEvents = typeof eventNames === 'string' ? [eventNames] : eventNames;

      listOfEvents.forEach(eventName => {
        historyTimeIntervals[eventName] = historyTimeIntervals[eventName] ?? {};

        historyTimeIntervals[eventName].start = historyTimeIntervals[eventName].start ?? [];
        historyTimeIntervals[eventName].start.push(currentHrtime);
      });
    }


    function timeEnd(eventNames) {
      let currentHrtime = process.hrtime.bigint();

      let listOfEvents = typeof eventNames === 'string' ? [eventNames] : eventNames;

      listOfEvents.forEach(eventName => {
        if (historyTimeIntervals[eventName] === undefined) {
          process.emitWarning(`No such Label '${eventName}' for .timeEnd(...)`, 'CustomWarning', 'WARN002');
          return
        }

        let start = historyTimeIntervals[eventName].start.pop();

        if (start === undefined) {
          process.emitWarning(`Label '${eventName}' was already consumed by a previous call to .timeEnd(...)`, 'CustomWarning', 'WARN003');
          return
        }

        historyTimeIntervals[eventName].ranges = historyTimeIntervals[eventName].ranges ?? [];
        historyTimeIntervals[eventName].ranges.push(
          rangeType(
            start,
            currentHrtime
          )
        );

      });
    }

    function eventsReport(events)
    {
      const entriesEvents = Object.entries(events);
      entriesEvents.reduce(
        (acum, [eventName, eventObject]) => {
          eventObject.ranges.forEach(
            range => {
              if(acum[0] > range.start) acum[0] = range.start;
              if(acum[1] <range.end) acum[1] = range.end;
            });
         return acum
        },
        [Infinity,0]
      ); //?
      
       
    //   console.log(`
    //  -------------------------------------------------------------------------------------------
    // | events              | ms  0     80        200   500        900     1100                   |
    // |---------------------|---------------------------------------------------------------------|          
    // | loadConfig          |     |----------------------|          |--------|                    |
    // | getCards            |     |-----------|          |---------------|                        |
    // | getAccounts         |     |------|                                                        |
    // | compeseFinalOutput  |                       |--------------|         |---------------|    |
    //  -------------------------------------------------------------------------------------------
    //   `)
      //plot(entriesEvents, minHrtime, maxHrtime)
      return events
    }

    function totalEventsElapseTimeReport(events)
    {
      let totalElapse = 0;
      const toLog = events.reduce(
        (acum, current) => {
          let found = acum.find(el => el.name === current.name);

          const currentElapseMs = hrtimeBigIntToMs(current.range.end - current.range.start);
          totalElapse = totalElapse + currentElapseMs;
          if(found) found.elapse = found.elapse + currentElapseMs;
          else acum.push({name: current.name, elapse: currentElapseMs});

          return acum
        },
        []
      ).map(nameRange => {
        nameRange.percentage = Number(Number(100 * nameRange.elapse / totalElapse).toFixed(2));
        return nameRange
      });

      console.log('');
      console.log('Total elapse Time of each event: ');
      console.table(toLog);

      return events
    }

    function coincidingEventsReport(elapseTable)
    {

      R__namespace.pipe(
        groupByWithCalc(
          (row) => JSON.stringify(row.runningEvents.sort(arraySorter())),
          { percentage: (l, r) => (l??0) + r, elapseMs: (l, r) => (l??0) + r }
        ),
        R__namespace.map( row => ({...row, percentage: Number(row.percentage.toFixed(2))}) ),
        (coincidingEvents) => {
          console.log('');
          console.log('Coinciding Events timeline: ');
          console.table(coincidingEvents);
        }
      )(elapseTable);

      return elapseTable
    }

    function timelineReport(data)
    {
      const timeline = Table();

      timeline.addColumn({ type: Text(), id: 'event', title: 'Events' });
      timeline.addColumn({ type: Timeline(), id: 'ranges' });

      console.log('');
      console.log('Timeline of events:');
      console.log(timeline.draw(data));

      return data
    }

    function formatReportAndReturnInputParam(data)
    {
      let toReport = Object.entries(data).map(
        ([eventName, event]) => (
          {
            event: eventName, 
            ranges: event.ranges.map(
              ({start, end} ) => ({start: hrtimeBigIntToMs(start), end: hrtimeBigIntToMs(end)})
            )
          }));
      timelineReport(toReport);

      return data
    }
    
    function chronoReport()
    {
      console.log('');
      Object.entries(chronoEvents).forEach(
        ([key, value]) => console.log(key, ': ', value.date)
      );
    }

    function report() {
      createTimeEvent('report');
      chronoReport();
        R__namespace.pipe(
          //RE.RLog('-1-->: '),
          formatReportAndReturnInputParam,
          eventsReport,
          historyToListOfNameRanges,
          //RE.RLog('0-->: '),
          totalEventsElapseTimeReport,
          compactListOfNameRanges,
          //RE.RLog('1-->: '),
          R__namespace.sort(sorterByPaths('range')),
          reportListOfNameRanges,
          //RE.RLog('3-->: '),
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
              ))??[]
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
          let elapseMs = hrtimeBigIntRangeToElapseMs(range);
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

    return { time, timeEnd, report }
  }


  function hrtimeBigIntRangeToElapseMs({start, end}) {
    return Number((end - start) / BigInt(1000000))
  }
  //hrtimeBigIntRangeToElapseMs(Range(BigInt(1953997827221605), BigInt(1953997981407671) )) //?
  //hrtimeBigIntRangeToElapseMs({ start:BigInt(1953997827221605), end:BigInt(1953997981407671) }) //?

  function hrtimeBigIntToMs(hrtime) {
    return Number(hrtime / BigInt(1000000))
  }

  function Range(...params) {
    let type;
    let displayFormat;
    let referenceHrtime;

    if(params.length === 2 ) {
      return range(params[0], params[1])
    }
    else {
      ({ type, displayFormat, referenceHrtime} = params[0]);
      return range
    }

    function range(start, end)
    {
      if (start > end) throw new Error('range(start, end) start cannot be > than end')

      function toString() 
      {
        if(type === 'hrtimeBigInt' && displayFormat === 'ms' && referenceHrtime !== undefined) {
          const startMs = hrtimeBigIntRangeToElapseMs({start:referenceHrtime, end:start});
          const endMs = hrtimeBigIntRangeToElapseMs({start:referenceHrtime, end});
          return `{ start:${startMs} <-${endMs - startMs}-> end:${endMs} }`
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
        end
      }
    }
  }


  let chrono = Chrono();

  chrono.time('step1');
  tasks().then(()=>{
    chrono.timeEnd('step1');
    chrono.report();
  });

  async function tasks()
  {

    await sleepWithFunction(
      650,
      () => {
        chrono.timeEnd('step1');
      }
    );

    await sleepWithFunction(
      20,
      () => {
        chrono.time('step2');
      }
    );

    await sleepWithFunction(
      12,
      () => {
        chrono.time('step3');
      }
    );

    await sleepWithFunction(
      500,
      () => {
        chrono.timeEnd('step3');
      }
    ),
    await sleepWithFunction(
      100,
      () => {
        chrono.timeEnd('step2');
      }
    ),
    await sleepWithFunction(
      15,
      () => {
        chrono.time('step1');
      }
    );
  }

  async function fetchImproved(...args) {
    const result = await fetch__default["default"](...args);
    const body = await result.json();

    return { status: result.status, body }
  }

  const { attemptP, Future } = F__namespace;

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

    return new Proxy(loglevel__default["default"], logBridge)
  }



  //log.LEVEL_NUMBER_TO_NAME = ['TRACE', 'DEBUG','INFO','WARN','ERROR', 'SILENT']
  log.LEVEL_NUMBER_TO_NAME = Object.entries(loglevel__default["default"].levels).map(elem => elem[0]);

  //log.NAME_TO_LEVEL_NUMBER={ 'TRACE': 0, 'DEBUG': 1, 'INFO': 2, 'WARN': 3, 'ERROR': 4, 'SILENT': 5}
  log.NAME_TO_LEVEL_NUMBER = { ...loglevel__default["default"].levels };

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

    const reviver = 
      (nodeRef, currentPath, parent) => {
       if(typeof nodeRef === 'function')
          stack.push({value: nodeRef, path:  convertPathToStackPath(currentPath)});
      
        return undefined
      };

    traverse(
      plan,
      reviver,
    );

    stack.push({value:R__namespace.identity, path:[1]});

    return stack
  }

          
  const isAncestorOf = 
    son => 
      parent => 
        son?.length > parent?.length && ___default["default"].isEqual(parent, son.slice(0, parent.length));


  const isSiblingOf = 
    sibling1 => 
      sibling2 => 
        ___default["default"].isEqual(
          sibling1?.slice(0,-1),
          sibling2?.slice(0,-1)
        );

  function getDescendants(stack)
  { 
    return path => 
      stack.filter(
        el => 
          path.length < el.path.length &&
          ___default["default"].isEqual(
            el.path.slice(0, path.length),
            path
          )
      )
  }

  function areRelativeFrom(ancestorInCommon)
  {
    if(ancestorInCommon === undefined || ancestorInCommon.length === 0) return false

    return familyMember1 => familyMember2 => 
      ___default["default"].isEqual(ancestorInCommon, familyMember1?.slice(0, ancestorInCommon.length)) &&
      ___default["default"].isEqual(ancestorInCommon, familyMember2?.slice(0, ancestorInCommon.length))
  }

  areRelativeFrom([0,0])([0,0,0,0])([0,0]); //?

  const stackSiblingsReducer = 
    (acum, el, index) => {
      if(
        isSiblingOf(R__namespace.last(acum)?.path)(el.path)
      ) 
      { 
        acum[acum.length - 1].value = pipe(R__namespace.last(acum).value, el.value);
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

    return (acum, el, index, stack) => {
      const elParent = el.path.slice(0,-1);
      const elGrandparent = elParent?.slice(0,-1);
      const nextToEl = stack[index+1]?.path;
      const nextToElParent = nextToEl?.slice(0,-1);
      const nextToElGrandparent = nextToElParent?.slice(0,-1);
      const previousToEl = stack[index-1]?.path;
      previousToEl?.slice(0,-2);

      let isElToAccrue = 
        el.path.length >= 3 &&
        ___default["default"].isEqual(elGrandparent, nextToElGrandparent) && 
        // el is the only child of parent
        ___default["default"].isEqual(getDescendants(stack)(elParent), [el]) &&
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
            value: runFunctionsSyncOrParallel(numberOfThreads)(R__namespace.pluck('value',stackItemsToParallelize)),
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

    repeat(stack.length).times(
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

  function plan(plan, {numberOfThreads, mockupsObj} = {numberOfThreads: Infinity, mockupsObj: {}})
  {

    return pipe(
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
    )(plan)
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

    return ___default["default"].cloneDeepWith(obj, customizer)

    function isToReplace(fieldOrValue, key, val, keyOrVal) {
      if (typeof fieldOrValue === 'function')
        return fieldOrValue(key, val)

      if (isRegExp(fieldOrValue) && typeof keyOrVal === 'string')
        return keyOrVal?.match(fieldOrValue)

      return ___default["default"].isEqual(fieldOrValue, keyOrVal)
    }

    function toReplace(replacer, key, val) {
      if (typeof replacer === 'function') return replacer(key, val)
      else return replacer
    }

    function typeMet(value, type) {
      if (type === undefined || typeof value === type) return true
      else return false
    }

    function customizer(obj, parentKey, parentObj) {
      if (obj === null || obj === undefined || obj === {}) return undefined

      for (let { field, value, type, sanitizer, replacer } of allGroupsConsolidated) {
        if (typeMet(obj, type) === false) return undefined
        if (sanitizer !== undefined) return sanitizer(parentKey, obj)
        if (field !== undefined && isToReplace(field, parentKey, obj, parentKey)) return toReplace(replacer, parentKey, obj)
        if (value !== undefined && isToReplace(value, parentKey, obj, obj)) return toReplace(replacer, parentKey, obj)
      }

    }

  }

  const pipeline = util__default["default"].promisify(stream__default["default"].pipeline);

  const filterStream = (filterFunc) => 
    streamTransform.transform(
      function(record, callback)
      {
        if(filterFunc(record)) {
          if(typeof record === 'object') record = {...record};
          callback(null, record);
        }else callback(null, undefined);
      }
    );

  const mapStream = (mapFunc) => 
    streamTransform.transform(
      function(record, callback)
      {
        callback(null, mapFunc(record));
      }
    );


  const filterMapStream = (filterFunc, mapFunc) => 
    streamTransform.transform(
      function(record, callback)
      {
        if(typeof record === 'object') record = {...record};
        if(filterFunc === undefined && mapFunc === undefined) throw new Error('filterMap called without parameters. filterFunc or mapFunc needed')
        if(filterFunc === undefined) {
          callback(null, mapFunc(record));
          return
        }

        if(mapFunc === undefined) 
        {
          if(filterFunc(record)) callback(null, record);
          else callback(null, undefined);
          return
        }

        if(filterFunc(record)) callback(null, mapFunc(record));
        else callback(null, undefined);
      }
    );


  const fsWriteFilePromise = util__default["default"].promisify(fs__default["default"].writeFile);

  Object.defineProperty(exports, '_', {
    enumerable: true,
    get: function () { return ___default["default"]; }
  });
  exports.R = R__namespace;
  exports.F = F__namespace;
  Object.defineProperty(exports, 'fetch', {
    enumerable: true,
    get: function () { return fetch__default["default"]; }
  });
  exports.Chrono = Chrono;
  exports.CustomError = CustomError;
  exports.Enum = Enum;
  exports.EnumMap = EnumMap;
  exports.RE = RE;
  exports.RLog = RLog;
  exports.YYYY_MM_DD_hh_mm_ss_ToUtcDate = YYYY_MM_DD_hh_mm_ss_ToUtcDate;
  exports.anonymize = anonymize;
  exports.arrayOfObjectsToObject = arrayOfObjectsToObject;
  exports.arraySorter = arraySorter;
  exports.arrayToObject = arrayToObject;
  exports.bearerSanitizer = bearerSanitizer;
  exports.between = between;
  exports.cleanString = cleanString;
  exports.cloneCopy = cloneCopy;
  exports.colorByStatus = colorByStatus;
  exports.colorMessage = colorMessage;
  exports.colorMessageByStatus = colorMessageByStatus;
  exports.colors = colors;
  exports.copyPropsWithValue = copyPropsWithValue;
  exports.copyPropsWithValueUsingRules = copyPropsWithValueUsingRules;
  exports.dateFormatter = dateFormatter;
  exports.dateToObj = dateToObj;
  exports.deepFreeze = deepFreeze;
  exports.diffInDaysYYYY_MM_DD = diffInDaysYYYY_MM_DD;
  exports.fetchImproved = fetchImproved;
  exports.ffletchMaker = ffletchMaker;
  exports.fillWith = fillWith;
  exports.filterFlatMap = filterFlatMap;
  exports.filterMap = filterMap;
  exports.filterMapStream = filterMapStream;
  exports.filterStream = filterStream;
  exports.findDeepKey = findDeepKey;
  exports.findSolution = findSolution;
  exports.firstCapital = firstCapital;
  exports.fletch = fletch;
  exports.formatDate = formatDate;
  exports.fsWriteFilePromise = fsWriteFilePromise;
  exports.getSameDateOrPreviousFridayForWeekends = getSameDateOrPreviousFridayForWeekends;
  exports.getValueAtPath = getValueAtPath;
  exports.groupByWithCalc = groupByWithCalc;
  exports.indexOfNthMatch = indexOfNthMatch;
  exports.innerRightJoinWith = innerRightJoinWith;
  exports.isDate = isDate;
  exports.isEmpty = isEmpty;
  exports.isPromise = isPromise;
  exports.isStringADate = isStringADate;
  exports.lengthSanitizer = lengthSanitizer;
  exports.log = log;
  exports.logWithPrefix = logWithPrefix;
  exports.loopIndexGenerator = loopIndexGenerator;
  exports.mapStream = mapStream;
  exports.mapWithNext = mapWithNext;
  exports.mapWithPrevious = mapWithPrevious;
  exports.matchByPropId = matchByPropId;
  exports.memoize = memoize;
  exports.mergeArrayOfObjectsRenamingProps = mergeArrayOfObjectsRenamingProps;
  exports.notTo = notTo;
  exports.parallel = parallel;
  exports.partialAtPos = partialAtPos;
  exports.pickPaths = pickPaths;
  exports.pipe = pipe;
  exports.pipeWhile = pipeWhile;
  exports.pipeWithChain = pipeWithChain;
  exports.pipeline = pipeline;
  exports.plan = plan;
  exports.previousDayOfWeek = previousDayOfWeek;
  exports.processExit = processExit;
  exports.promiseAll = promiseAll;
  exports.promiseFunToFutureFun = promiseFunToFutureFun;
  exports.pushUniqueKey = pushUniqueKey;
  exports.pushUniqueKeyOrChange = pushUniqueKeyOrChange;
  exports.queryObjToStr = queryObjToStr;
  exports.removeDuplicates = removeDuplicates;
  exports.repeat = repeat;
  exports.replaceAll = replaceAll;
  exports.retryWithSleep = retryWithSleep;
  exports.runEvery = runEvery;
  exports.runFunctionsSyncOrParallel = runFunctionsSyncOrParallel;
  exports.runFutureFunctionsInParallel = runFutureFunctionsInParallel;
  exports.sanitize = sanitize;
  exports.setValueAtPath = setValueAtPath;
  exports.sleep = sleep;
  exports.sleepWithFunction = sleepWithFunction;
  exports.sleepWithValue = sleepWithValue;
  exports.something = something;
  exports.sorterByPaths = sorterByPaths;
  exports.splitCond = splitCond;
  exports.subtractDays = subtractDays;
  exports.transition = transition;
  exports.traverse = traverse;
  exports.uncurry = uncurry;
  exports.unionWithHashKeys = unionWithHashKeys;
  exports.updateWithHashKeys = updateWithHashKeys;
  exports.urlCompose = urlCompose;
  exports.urlDecompose = urlDecompose;
  exports.varSubsDoubleBracket = varSubsDoubleBracket;
  exports.wildcardToRegExp = wildcardToRegExp;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({}, _, R, F, types, fetch, loglevel, stream, streamTransform, util, fs);
