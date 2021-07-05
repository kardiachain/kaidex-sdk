import KardiaClient, { KardiaAccount } from 'kardia-js-sdk';
import JSBI from 'jsbi';
import _Decimal from 'decimal.js-light';
import _Big from 'big.js';
import toFormat from 'toformat';
import { BigNumber } from 'bignumber.js';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime_1 = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}
});

var ROUTER = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_factory",
				type: "address"
			},
			{
				internalType: "address",
				name: "_WKAI",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		stateMutability: "payable",
		type: "fallback"
	},
	{
		inputs: [
		],
		name: "WKAI",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "tokenA",
				type: "address"
			},
			{
				internalType: "address",
				name: "tokenB",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amountADesired",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountBDesired",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountAMin",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountBMin",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "addLiquidity",
		outputs: [
			{
				internalType: "uint256",
				name: "amountA",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountB",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "liquidity",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amountTokenDesired",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountTokenMin",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountKAIMin",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "addLiquidityKAI",
		outputs: [
			{
				internalType: "uint256",
				name: "amountToken",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountKAI",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "liquidity",
				type: "uint256"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "factory",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "reserveIn",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "reserveOut",
				type: "uint256"
			}
		],
		name: "getAmountIn",
		outputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			}
		],
		stateMutability: "pure",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "reserveIn",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "reserveOut",
				type: "uint256"
			}
		],
		name: "getAmountOut",
		outputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			}
		],
		stateMutability: "pure",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "path",
				type: "address[]"
			}
		],
		name: "getAmountsIn",
		outputs: [
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "path",
				type: "address[]"
			}
		],
		name: "getAmountsOut",
		outputs: [
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "tokenA",
				type: "address"
			},
			{
				internalType: "address",
				name: "tokenB",
				type: "address"
			}
		],
		name: "getReserves",
		outputs: [
			{
				internalType: "uint256",
				name: "reserveA",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "reserveB",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountA",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "reserveA",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "reserveB",
				type: "uint256"
			}
		],
		name: "quote",
		outputs: [
			{
				internalType: "uint256",
				name: "amountB",
				type: "uint256"
			}
		],
		stateMutability: "pure",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "tokenA",
				type: "address"
			},
			{
				internalType: "address",
				name: "tokenB",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "liquidity",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountAMin",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountBMin",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "removeLiquidity",
		outputs: [
			{
				internalType: "uint256",
				name: "amountA",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountB",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "liquidity",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountTokenMin",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountKAIMin",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "removeLiquidityKAI",
		outputs: [
			{
				internalType: "uint256",
				name: "amountToken",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountKAI",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "liquidity",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountTokenMin",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountETHMin",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "removeLiquidityKAISupportingFeeOnTransferTokens",
		outputs: [
			{
				internalType: "uint256",
				name: "amountKAI",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountOutMin",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "path",
				type: "address[]"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "swapExactKAIForTokens",
		outputs: [
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountOutMin",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "path",
				type: "address[]"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "swapExactKAIForTokensSupportingFeeOnTransferTokens",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountOutMin",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "path",
				type: "address[]"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "swapExactTokensForKAI",
		outputs: [
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountOutMin",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "path",
				type: "address[]"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "swapExactTokensForKAISupportingFeeOnTransferTokens",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountOutMin",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "path",
				type: "address[]"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "swapExactTokensForTokens",
		outputs: [
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountOutMin",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "path",
				type: "address[]"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "swapExactTokensForTokensSupportingFeeOnTransferTokens",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "path",
				type: "address[]"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "swapKAIForExactTokens",
		outputs: [
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountInMax",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "path",
				type: "address[]"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "swapTokensForExactKAI",
		outputs: [
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountInMax",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "path",
				type: "address[]"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "swapTokensForExactTokens",
		outputs: [
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			}
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			},
			{
				internalType: "address[]",
				name: "path",
				type: "address[]"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			}
		],
		name: "swapWithLimitOrder",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		stateMutability: "payable",
		type: "receive"
	}
];

var FACTORY = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_feeToSetter",
				type: "address"
			}
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint8",
				name: "tier",
				type: "uint8"
			}
		],
		name: "AddToken",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "token0",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "token1",
				type: "address"
			},
			{
				indexed: false,
				internalType: "address",
				name: "pair",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		name: "PairCreated",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "pair",
				type: "address"
			}
		],
		name: "RemovePair",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint8",
				name: "tier",
				type: "uint8"
			}
		],
		name: "RemoveToken",
		type: "event"
	},
	{
		constant: true,
		inputs: [
		],
		name: "INIT_CODE_PAIR_HASH",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{
				internalType: "uint8",
				name: "_tier",
				type: "uint8"
			},
			{
				internalType: "address",
				name: "_token",
				type: "address"
			}
		],
		name: "addToken",
		outputs: [
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: true,
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		name: "allPairs",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "allPairsLength",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{
				internalType: "address",
				name: "tokenA",
				type: "address"
			},
			{
				internalType: "address",
				name: "tokenB",
				type: "address"
			}
		],
		name: "createPair",
		outputs: [
			{
				internalType: "address",
				name: "pair",
				type: "address"
			}
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "feeTo",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "feeToSetter",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
			{
				internalType: "uint8",
				name: "_tier",
				type: "uint8"
			}
		],
		name: "getAllTierTokens",
		outputs: [
			{
				internalType: "address[]",
				name: "",
				type: "address[]"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			},
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "getPair",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{
				internalType: "uint8",
				name: "_tier",
				type: "uint8"
			},
			{
				internalType: "address",
				name: "_token",
				type: "address"
			}
		],
		name: "removeToken",
		outputs: [
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{
				internalType: "address",
				name: "_feeTo",
				type: "address"
			}
		],
		name: "setFeeTo",
		outputs: [
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{
				internalType: "address",
				name: "_feeToSetter",
				type: "address"
			}
		],
		name: "setFeeToSetter",
		outputs: [
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: true,
		inputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8"
			},
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		name: "tierTokens",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	}
];

var KRC20 = [
	{
		inputs: [
			{
				internalType: "string",
				name: "_name",
				type: "string"
			},
			{
				internalType: "string",
				name: "_symbol",
				type: "string"
			}
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Approval",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Transfer",
		type: "event"
	},
	{
		constant: true,
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			},
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "allowance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "approve",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: true,
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "balanceOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "burn",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "decimals",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "mint",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "name",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "nonces",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "symbol",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "tokenSwap",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "totalSupply",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "transfer",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "transferFrom",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	}
];

var LIMIT_ORDER = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_swap",
				type: "address"
			},
			{
				internalType: "address",
				name: "_factory",
				type: "address"
			},
			{
				internalType: "address",
				name: "_wkai",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "trader",
				type: "address"
			},
			{
				indexed: false,
				internalType: "address",
				name: "pair",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "orderId",
				type: "uint256"
			}
		],
		name: "CancelOrder",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "trader",
				type: "address"
			},
			{
				indexed: false,
				internalType: "address",
				name: "pair",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "inputAmount",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "outputAmount",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "enum Types.OrderType",
				name: "swapType",
				type: "uint8"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "orderId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "enum SwapSettlement.TradeType",
				name: "tradeType",
				type: "uint8"
			}
		],
		name: "Orders",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "OwnershipTransferred",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
		],
		name: "Pause",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "trader",
				type: "address"
			},
			{
				indexed: false,
				internalType: "string",
				name: "reason",
				type: "string"
			}
		],
		name: "SwapFailed",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
		],
		name: "Unpause",
		type: "event"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_pair",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "_orderId",
				type: "uint256"
			}
		],
		name: "cancelOrder",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "factory",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_pair",
				type: "address"
			}
		],
		name: "fill",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getFactory",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_pair",
				type: "address"
			}
		],
		name: "getOrders",
		outputs: [
			{
				components: [
					{
						internalType: "address",
						name: "trader",
						type: "address"
					},
					{
						internalType: "enum Types.OrderType",
						name: "orderType",
						type: "uint8"
					},
					{
						components: [
							{
								internalType: "address",
								name: "token",
								type: "address"
							},
							{
								internalType: "uint256",
								name: "amount",
								type: "uint256"
							}
						],
						internalType: "struct Types.TokenAmount",
						name: "input",
						type: "tuple"
					},
					{
						components: [
							{
								internalType: "address",
								name: "token",
								type: "address"
							},
							{
								internalType: "uint256",
								name: "amount",
								type: "uint256"
							}
						],
						internalType: "struct Types.TokenAmount",
						name: "output",
						type: "tuple"
					},
					{
						internalType: "uint256",
						name: "orderId",
						type: "uint256"
					}
				],
				internalType: "struct Types.Order[]",
				name: "",
				type: "tuple[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "isOwner",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_outputToken",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "_outputAmount",
				type: "uint256"
			},
			{
				internalType: "enum Types.OrderType",
				name: "_orderType",
				type: "uint8"
			},
			{
				internalType: "enum SwapSettlement.TradeType",
				name: "_type",
				type: "uint8"
			}
		],
		name: "orderInputKAI",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_inputToken",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "_inputAmount",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "_outputToken",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "_outputAmount",
				type: "uint256"
			},
			{
				internalType: "enum Types.OrderType",
				name: "_orderType",
				type: "uint8"
			},
			{
				internalType: "enum SwapSettlement.TradeType",
				name: "_type",
				type: "uint8"
			}
		],
		name: "orderInputTokens",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "pause",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "paused",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		name: "pendingOrder",
		outputs: [
			{
				internalType: "address",
				name: "trader",
				type: "address"
			},
			{
				internalType: "enum Types.OrderType",
				name: "orderType",
				type: "uint8"
			},
			{
				components: [
					{
						internalType: "address",
						name: "token",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amount",
						type: "uint256"
					}
				],
				internalType: "struct Types.TokenAmount",
				name: "input",
				type: "tuple"
			},
			{
				components: [
					{
						internalType: "address",
						name: "token",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amount",
						type: "uint256"
					}
				],
				internalType: "struct Types.TokenAmount",
				name: "output",
				type: "tuple"
			},
			{
				internalType: "uint256",
				name: "orderId",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "renounceOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "swap",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "transferOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "trader",
						type: "address"
					},
					{
						internalType: "enum Types.OrderType",
						name: "orderType",
						type: "uint8"
					},
					{
						components: [
							{
								internalType: "address",
								name: "token",
								type: "address"
							},
							{
								internalType: "uint256",
								name: "amount",
								type: "uint256"
							}
						],
						internalType: "struct Types.TokenAmount",
						name: "input",
						type: "tuple"
					},
					{
						components: [
							{
								internalType: "address",
								name: "token",
								type: "address"
							},
							{
								internalType: "uint256",
								name: "amount",
								type: "uint256"
							}
						],
						internalType: "struct Types.TokenAmount",
						name: "output",
						type: "tuple"
					},
					{
						internalType: "uint256",
						name: "orderId",
						type: "uint256"
					}
				],
				internalType: "struct Types.Order",
				name: "_order",
				type: "tuple"
			},
			{
				internalType: "address",
				name: "_pair",
				type: "address"
			}
		],
		name: "trySwap",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "unpause",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "wkai",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		stateMutability: "payable",
		type: "receive"
	}
];

var methodNames = {
  //Factory
  GET_PAIR: 'getPair',
  //Router
  GET_RESERVES: 'getReserves',
  GET_AMOUNTS_OUT: 'getAmountsOut',
  GET_AMOUNTS_IN: 'getAmountsIn',
  GET_TOTAL_KAI_AMOUNTS_IN: 'getTotalKAIAmountsIn',
  ADD_LIQUIDITY: 'addLiquidity',
  ADD_LIQUIDITY_KAI: 'addLiquidityKAI',
  REMOVE_LIQUIDITY_KAI_SUPPORTING_FEE: 'removeLiquidityKAISupportingFeeOnTransferTokens',
  REMOVE_LIQUIDITY: 'removeLiquidity',
  REMOVE_LIQUIDITY_KAI: 'removeLiquidityKAI',
  SWAP_EXACT_TOKENS_FOR_TOKENS: 'swapExactTokensForTokens',
  SWAP_TOKENS_FOR_EXACT_TOKENS: 'swapTokensForExactTokens',
  SWAP_EXACT_KAI_FOR_TOKENS: 'swapExactKAIForTokens',
  SWAP_EXACT_TOKENS_FOR_KAI: 'swapExactTokensForKAI',
  SWAP_TOKENS_FOR_EXACT_KAI: 'swapTokensForExactKAI',
  SWAP_KAI_FOR_EXACT_TOKENS: 'swapKAIForExactTokens',
  SWAP_EXACT_TOKEN_FOR_TOKEN_SUPPORTING_ON_FEE_TRANSFER: 'swapExactTokensForTokensSupportingFeeOnTransferTokens',
  SWAP_EXACT_KAI_FOR_TOKEN_SUPPORTING_ON_FEE_TRANSFER: 'swapExactKAIForTokensSupportingFeeOnTransferTokens',
  SWAP_EXACT_TOKEN_FOR_KAI_SUPPORTING_ON_FEE_TRANSFER: 'swapExactTokensForKAISupportingFeeOnTransferTokens',
  //KRC20
  APPROVE: 'approve',
  ALLOWANCE: 'allowance',
  BALANCE_OF: 'balanceOf',
  TOTAL_SUPPLY: 'totalSupply',
  //Limit order
  ORDER_INPUT_KAI: 'orderInputKAI',
  ORDER_INPUT_TOKENS: 'orderInputTokens',
  CANCEL_ORDER: 'cancelOrder'
};

var abiJson = {
  ROUTER: ROUTER,
  FACTORY: FACTORY,
  KRC20: KRC20,
  LIMIT_ORDER: LIMIT_ORDER
};
var smcAddresses = {
  ROUTER: '0xD15afC6d61eD34d968176397a89fE5Cbd824D493',
  FACTORY: '0x053Fdaff144a44731f2D9B3847947a9f1c1487Cc',
  LIMIT_ORDER: '0x3E88CE7E64Bb2763CB8e40CF0d6eb9669f391A6b',
  WKAI: '0xbedD01A19B321C01279167709DfF6c7419Eb8AC7'
};
var endpoint = 'https://dev-1.kardiachain.io';

var AbstractSmcService = function AbstractSmcService(_ref) {
  var _this = this;

  var abi = _ref.abi,
      smcAddress = _ref.smcAddress,
      client = _ref.client;

  this.smcCallData = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(_ref2) {
      var abi, contractAddr, methodName, params, invoke;
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              abi = _ref2.abi, contractAddr = _ref2.contractAddr, methodName = _ref2.methodName, params = _ref2.params;

              _this.kardiaContract.updateAbi(abi);

              _context.next = 4;
              return _this.kardiaContract.invokeContract(methodName, params);

            case 4:
              invoke = _context.sent;
              _context.next = 7;
              return invoke.call(contractAddr, {}, 'latest');

            case 7:
              return _context.abrupt("return", _context.sent);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }();

  this.abi = abi;
  this.smcAddress = smcAddress;
  this.kardiaClient = client;
  this.kardiaAccount = client.account;
  this.kardiaContract = client.contract;
  this.kardiaTransaction = client.transaction;
  this.kardiaChain = client.kaiChain;
  this.kardiaKrc20 = client.krc20;
};

var Rounding;

(function (Rounding) {
  Rounding[Rounding["ROUND_DOWN"] = 0] = "ROUND_DOWN";
  Rounding[Rounding["ROUND_HALF_UP"] = 1] = "ROUND_HALF_UP";
  Rounding[Rounding["ROUND_UP"] = 2] = "ROUND_UP";
})(Rounding || (Rounding = {}));

var _toSignificantRoundin, _toFixedRounding;
var ONE = /*#__PURE__*/JSBI.BigInt(1);
var Decimal = /*#__PURE__*/toFormat(_Decimal);
var Big = /*#__PURE__*/toFormat(_Big);
var toSignificantRounding = (_toSignificantRoundin = {}, _toSignificantRoundin[Rounding.ROUND_DOWN] = 0, _toSignificantRoundin[Rounding.ROUND_HALF_UP] = 1, _toSignificantRoundin[Rounding.ROUND_UP] = 2, _toSignificantRoundin);
var toFixedRounding = (_toFixedRounding = {}, _toFixedRounding[Rounding.ROUND_DOWN] = 0, _toFixedRounding[Rounding.ROUND_HALF_UP] = 1, _toFixedRounding[Rounding.ROUND_UP] = 2, _toFixedRounding);
function parseBigintIsh(bigintIsh) {
  return bigintIsh instanceof JSBI ? bigintIsh : JSBI.BigInt(Number(bigintIsh));
}
var Fraction = /*#__PURE__*/function () {
  function Fraction(numerator, denominator) {
    if (denominator === void 0) {
      denominator = ONE;
    }

    this.numerator = parseBigintIsh(numerator);
    this.denominator = parseBigintIsh(denominator);
  } // performs floor division


  var _proto = Fraction.prototype;

  _proto.invert = function invert() {
    return new Fraction(this.denominator, this.numerator);
  };

  _proto.add = function add(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));

    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI.add(this.numerator, otherParsed.numerator), this.denominator);
    }

    return new Fraction(JSBI.add(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator)), JSBI.multiply(this.denominator, otherParsed.denominator));
  };

  _proto.subtract = function subtract(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));

    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI.subtract(this.numerator, otherParsed.numerator), this.denominator);
    }

    return new Fraction(JSBI.subtract(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator)), JSBI.multiply(this.denominator, otherParsed.denominator));
  };

  _proto.lessThan = function lessThan(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return JSBI.lessThan(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  };

  _proto.equalTo = function equalTo(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return JSBI.equal(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  };

  _proto.greaterThan = function greaterThan(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return JSBI.greaterThan(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  };

  _proto.multiply = function multiply(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return new Fraction(JSBI.multiply(this.numerator, otherParsed.numerator), JSBI.multiply(this.denominator, otherParsed.denominator));
  };

  _proto.divide = function divide(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return new Fraction(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(this.denominator, otherParsed.numerator));
  };

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      };
    }

    if (rounding === void 0) {
      rounding = Rounding.ROUND_HALF_UP;
    }

    Decimal.set({
      precision: significantDigits + 1,
      rounding: toSignificantRounding[rounding]
    });
    var quotient = new Decimal(this.numerator.toString()).div(this.denominator.toString()).toSignificantDigits(significantDigits);
    return quotient.toFormat(quotient.decimalPlaces(), format);
  };

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = 0;
    }

    if (format === void 0) {
      format = {
        groupSeparator: ''
      };
    }

    if (rounding === void 0) {
      rounding = Rounding.ROUND_HALF_UP;
    }

    Big.DP = decimalPlaces;
    Big.RM = toFixedRounding[rounding];
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(decimalPlaces, format);
  };

  _createClass(Fraction, [{
    key: "quotient",
    get: function get() {
      return JSBI.divide(this.numerator, this.denominator);
    } // remainder after floor division

  }, {
    key: "remainder",
    get: function get() {
      return new Fraction(JSBI.remainder(this.numerator, this.denominator), this.denominator);
    }
  }]);

  return Fraction;
}();

var validatePath = function validatePath(path) {
  if (!path || !path.length || !path[0] || !KardiaAccount.isAddress(path[0]) || !path[1] || !KardiaAccount.isAddress(path[1])) throw new Error('Invalid token address!');
};

var RouterService = /*#__PURE__*/function (_AbstractSmcService) {
  _inheritsLoose(RouterService, _AbstractSmcService);

  function RouterService() {
    var _this;

    _this = _AbstractSmcService.apply(this, arguments) || this;

    _this.getReserves = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(tokenA, tokenB) {
        return runtime_1.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(!KardiaAccount.isAddress(tokenA) || !KardiaAccount.isAddress(tokenB))) {
                  _context.next = 2;
                  break;
                }

                throw new Error('Invalid token!');

              case 2:
                return _context.abrupt("return", _this.smcCallData({
                  abi: _this.abi,
                  contractAddr: _this.smcAddress,
                  methodName: methodNames.GET_RESERVES,
                  params: [tokenA, tokenB]
                }));

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }();

    _this.getAmountsOut = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(amountIn, path) {
        var result;
        return runtime_1.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (amountIn) {
                  _context2.next = 2;
                  break;
                }

                throw new Error('Invalid input amount!');

              case 2:
                validatePath(path);
                _context2.next = 5;
                return _this.smcCallData({
                  abi: _this.abi,
                  contractAddr: _this.smcAddress,
                  methodName: methodNames.GET_AMOUNTS_OUT,
                  params: [amountIn, path]
                });

              case 5:
                result = _context2.sent;
                return _context2.abrupt("return", result && result.length > 0 ? JSBI.BigInt(result[1]).toString() : '');

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }();

    _this.getAmountsIn = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(amountOut, path) {
        var result;
        return runtime_1.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (amountOut) {
                  _context3.next = 2;
                  break;
                }

                throw new Error('Invalid input amount!');

              case 2:
                validatePath(path);
                _context3.next = 5;
                return _this.smcCallData({
                  abi: _this.abi,
                  contractAddr: _this.smcAddress,
                  methodName: methodNames.GET_AMOUNTS_IN,
                  params: [amountOut, path]
                });

              case 5:
                result = _context3.sent;
                return _context3.abrupt("return", result && result.length > 0 ? JSBI.BigInt(result[0]).toString() : '');

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x5, _x6) {
        return _ref3.apply(this, arguments);
      };
    }();

    return _this;
  }

  return RouterService;
}(AbstractSmcService);

var FactoryService = /*#__PURE__*/function (_AbstractSmcService) {
  _inheritsLoose(FactoryService, _AbstractSmcService);

  function FactoryService() {
    var _this;

    _this = _AbstractSmcService.apply(this, arguments) || this;

    _this.getPair = function (tokenA, tokenB) {
      if (!tokenA.trim() || !tokenB.trim()) throw new Error('Invalid token!');
      return _this.smcCallData({
        abi: _this.abi,
        contractAddr: _this.smcAddress,
        methodName: methodNames.GET_PAIR,
        params: [tokenA, tokenB]
      });
    };

    return _this;
  }

  return FactoryService;
}(AbstractSmcService);

var KRC20Service = /*#__PURE__*/function (_AbstractSmcService) {
  _inheritsLoose(KRC20Service, _AbstractSmcService);

  function KRC20Service() {
    var _this;

    _this = _AbstractSmcService.apply(this, arguments) || this;

    _this.getAllowance = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(tokenAddress, walletAddress, spenderAddress) {
        var amount;
        return runtime_1.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (KardiaAccount.isAddress(tokenAddress)) {
                  _context.next = 2;
                  break;
                }

                throw new Error('Invalid token Address');

              case 2:
                if (KardiaAccount.isAddress(walletAddress)) {
                  _context.next = 4;
                  break;
                }

                throw new Error('Invalid wallet address');

              case 4:
                _context.next = 6;
                return _this.smcCallData({
                  abi: _this.abi,
                  contractAddr: tokenAddress,
                  methodName: methodNames.ALLOWANCE,
                  params: [walletAddress, spenderAddress]
                });

              case 6:
                amount = _context.sent;
                return _context.abrupt("return", JSBI.BigInt(amount));

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }();

    _this.balanceOf = function (tokenAddress, walletAddress) {
      if (!KardiaAccount.isAddress(tokenAddress)) throw new Error('Invalid token Address');
      if (!KardiaAccount.isAddress(walletAddress)) throw new Error('Invalid wallet address');
      return _this.smcCallData({
        abi: _this.abi,
        methodName: methodNames.BALANCE_OF,
        contractAddr: tokenAddress,
        params: [walletAddress]
      });
    };

    return _this;
  }

  var _proto = KRC20Service.prototype;

  _proto.getTotalSupply = function getTotalSupply(tokenAddress) {
    if (!KardiaAccount.isAddress(tokenAddress)) throw new Error('Invalid token Address');
    return this.smcCallData({
      abi: this.abi,
      contractAddr: tokenAddress,
      methodName: methodNames.TOTAL_SUPPLY,
      params: []
    });
  };

  return KRC20Service;
}(AbstractSmcService);

var ZERO = /*#__PURE__*/JSBI.BigInt(0);
var ONE$1 = /*#__PURE__*/JSBI.BigInt(1);
var ONE_FRACTION = /*#__PURE__*/new Fraction(1);

var cellValue = function cellValue(kaiValue, decimals) {
  if (decimals === void 0) {
    decimals = 18;
  }

  var rawValue = new BigNumber(kaiValue);
  return rawValue.multipliedBy(new BigNumber(Math.pow(10, decimals))).toFixed(0, 1);
};

var convertValueFollowDecimal = function convertValueFollowDecimal(value, decimals) {
  try {
    if (!value || value === '0') {
      return '0';
    }

    if (!decimals) {
      return value;
    }

    var rawValue = new BigNumber(value);
    var rawTEN = new BigNumber(10);
    var result = rawValue.dividedBy(rawTEN.exponentiatedBy(decimals));
    return removeTrailingZeros(result.toFixed(decimals));
  } catch (error) {
    console.error("Error converting value from decimal:", error);
    return '0';
  }
};

var removeTrailingZeros = function removeTrailingZeros(value) {
  var regEx1 = /^[0]+/;
  var regEx2 = /[0]+$/;
  var regEx3 = /[.]$/;
  var valueInString = value.toString();
  var after = valueInString.replace(regEx1, ''); // Remove leading 0's

  if (after.indexOf('.') > -1) {
    after = after.replace(regEx2, ''); // Remove trailing 0's
  }

  after = after.replace(regEx3, ''); // Remove trailing decimal

  if (after.indexOf('.') === 0) {
    after = '0' + after;
  }

  return after ? after : '0';
};

var calculateSlippageValue = function calculateSlippageValue(value, slippageTolerance, type) {
  try {
    var _value = new Fraction(value);

    var slippageFrac = new Fraction(cellValue(slippageTolerance), cellValue(100));
    var slippagePercent;

    if (type === 'sub') {
      if (Number(slippageTolerance) > 100) {
        return '0';
      }

      slippagePercent = ONE_FRACTION.subtract(slippageFrac);
    } else {
      slippagePercent = ONE_FRACTION.add(slippageFrac);
    }

    return _value.multiply(slippagePercent).toFixed();
  } catch (error) {
    console.error('Error calculating slippage value:', error);
    return '';
  }
};

var calculateLiquidityProvidersFee = function calculateLiquidityProvidersFee(amountIn) {
  var amountFrac = new Fraction(amountIn);
  return amountFrac.multiply(3).divide(1000).toFixed();
};

var renderPair = function renderPair(tokenIn, tokenOut) {
  if (!tokenIn || !tokenOut) throw new Error('Error render pair: token not found!');
  return [tokenIn, tokenOut];
};

var _9975 = /*#__PURE__*/JSBI.BigInt(9975);
var _10000 = /*#__PURE__*/JSBI.BigInt(10000);
var Utils = {
  cellValue: cellValue,
  convertValueFollowDecimal: convertValueFollowDecimal,
  calculateSlippageValue: calculateSlippageValue,
  calculateLiquidityProvidersFee: calculateLiquidityProvidersFee,
  renderPair: renderPair
};

var KaidexService = /*#__PURE__*/function () {
  function KaidexService(options) {
    var _this = this;

    if (options === void 0) {
      options = {
        abis: {},
        smcAddresses: {},
        rpcEndpoint: ''
      };
    }

    this.isKAI = function (tokenAddress) {
      return !!(tokenAddress && _this.smcAddresses.wkai && tokenAddress.toLowerCase() === _this.smcAddresses.wkai.toLowerCase());
    };

    this.transformAddLiquidityParams = function (params) {
      var slippageTolerance = params.slippageTolerance,
          txDeadline = params.txDeadline,
          inputAmount = params.inputAmount,
          outputAmount = params.outputAmount,
          tokenA = params.tokenA,
          tokenB = params.tokenB,
          walletAddress = params.walletAddress;
      if (!KardiaAccount.isAddress(walletAddress)) throw new Error('Invalid wallet address');
      if (!KardiaAccount.isAddress(tokenA.tokenAddress) || !KardiaAccount.isAddress(tokenB.tokenAddress)) throw new Error('Invalid token address');
      var amountADesiredInDec = inputAmount ? Utils.cellValue(inputAmount, tokenA.decimals) : '0';
      var amountBDesiredInDec = outputAmount ? Utils.cellValue(outputAmount, tokenB.decimals) : '0';
      var calculatedAmountAMinInDec = inputAmount ? Utils.calculateSlippageValue(amountADesiredInDec, slippageTolerance, 'sub') : '0';
      var calculatedAmountBMinInDec = outputAmount ? Utils.calculateSlippageValue(amountBDesiredInDec, slippageTolerance, 'sub') : '0';
      if (!amountADesiredInDec || !calculatedAmountAMinInDec || !amountBDesiredInDec || !calculatedAmountBMinInDec) throw new Error('Invalid token amount');
      if (!txDeadline) throw new Error('Invalid deadline');
      return {
        tokenA: tokenA.tokenAddress,
        tokenB: tokenB.tokenAddress,
        amountADesired: amountADesiredInDec,
        amountBDesired: amountBDesiredInDec,
        amountAMin: calculatedAmountAMinInDec,
        amountBMin: calculatedAmountBMinInDec,
        walletAddress: walletAddress,
        deadlineInMilliseconds: txDeadline
      };
    };

    this.transformAddLiquidityKAIParams = function (params) {
      var _this$transformAddLiq = _this.transformAddLiquidityParams(params),
          amountADesired = _this$transformAddLiq.amountADesired,
          amountBDesired = _this$transformAddLiq.amountBDesired,
          amountAMin = _this$transformAddLiq.amountAMin,
          amountBMin = _this$transformAddLiq.amountBMin,
          tokenA = _this$transformAddLiq.tokenA,
          tokenB = _this$transformAddLiq.tokenB,
          walletAddress = _this$transformAddLiq.walletAddress,
          deadlineInMilliseconds = _this$transformAddLiq.deadlineInMilliseconds;

      var otherTokenAddress = _this.isKAI(tokenA) ? tokenB : tokenA;
      var otherTokenDesiredAmount = _this.isKAI(tokenA) ? amountBDesired : amountADesired;
      var otherTokenMinAmount = _this.isKAI(tokenA) ? amountBMin : amountAMin;
      var amountKAI = _this.isKAI(tokenA) ? amountADesired : amountBDesired;
      var amountKAIMin = _this.isKAI(tokenA) ? amountAMin : amountBMin;
      if (!KardiaAccount.isAddress(walletAddress)) throw new Error('Invalid wallet address');
      if (!KardiaAccount.isAddress(tokenA) || !KardiaAccount.isAddress(tokenB)) throw new Error('Invalid token address');
      if (!amountADesired || !amountAMin || !amountBDesired || !amountBMin) throw new Error('Invalid token amount');
      if (!deadlineInMilliseconds) throw new Error('Invalid deadline');
      return {
        tokenAddress: otherTokenAddress,
        amountTokenMin: otherTokenMinAmount,
        amountTokenDesired: otherTokenDesiredAmount,
        amountKAI: amountKAI,
        amountKAIMin: amountKAIMin,
        walletAddress: walletAddress,
        deadlineInMilliseconds: deadlineInMilliseconds
      };
    };

    this.transformRemoveLiquidityParams = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(params) {
        var pair, withdrawAmount, walletAddress, slippageTolerance, txDeadline, tokenA, tokenB, pairAddress, balance, totalSupply, withdrawPercent, tokenABalance, amountAMin, _amountAMin, tokenBBalance, amountBMin, _amountBMin;

        return runtime_1.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                pair = params.pair, withdrawAmount = params.withdrawAmount, walletAddress = params.walletAddress, slippageTolerance = params.slippageTolerance, txDeadline = params.txDeadline;
                tokenA = pair.tokenA, tokenB = pair.tokenB, pairAddress = pair.pairAddress;
                _context.next = 4;
                return _this.krc20.balanceOf(pairAddress, walletAddress);

              case 4:
                balance = _context.sent;

                if (Number(withdrawAmount)) {
                  _context.next = 7;
                  break;
                }

                throw new Error('Invalid amount!');

              case 7:
                if (walletAddress) {
                  _context.next = 9;
                  break;
                }

                throw new Error('Invalid wallet!');

              case 9:
                if (!(!Number(balance) || Number(withdrawAmount) > Number(balance))) {
                  _context.next = 11;
                  break;
                }

                throw new Error('Not enough balance!');

              case 11:
                _context.next = 13;
                return _this.krc20.getTotalSupply(pairAddress);

              case 13:
                totalSupply = _context.sent;
                withdrawPercent = new Fraction(withdrawAmount).divide(balance).multiply(100);
                _context.next = 17;
                return _this.krc20.balanceOf(tokenA.tokenAddress, pairAddress);

              case 17:
                tokenABalance = _context.sent;
                //amountAMin = (balance / totalSupply) * tokenABalance * withdrawPercent / 100
                amountAMin = new Fraction(balance).divide(totalSupply).multiply(tokenABalance).multiply(withdrawPercent).divide(100).toFixed();
                _amountAMin = Utils.calculateSlippageValue(amountAMin, slippageTolerance, 'sub');
                _context.next = 22;
                return _this.krc20.balanceOf(tokenB.tokenAddress, pairAddress);

              case 22:
                tokenBBalance = _context.sent;
                //amountBMin = (balance / totalSupply) * tokenBBalance * withdrawPercent / 100
                amountBMin = new Fraction(balance).divide(totalSupply).multiply(tokenBBalance).multiply(withdrawPercent).divide(100).toFixed();
                _amountBMin = Utils.calculateSlippageValue(amountBMin, slippageTolerance, 'sub');
                return _context.abrupt("return", {
                  tokenA: tokenA.tokenAddress,
                  tokenB: tokenB.tokenAddress,
                  liquidity: withdrawAmount,
                  amountAMin: _amountAMin,
                  amountBMin: _amountBMin,
                  walletAddress: walletAddress,
                  deadlineInMilliseconds: txDeadline
                });

              case 26:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();

    this.transformRemoveLiquidityKAIParams = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(params) {
        var _yield$_this$transfor, tokenA, tokenB, liquidity, amountAMin, amountBMin, walletAddress, deadlineInMilliseconds, otherToken, amountKAIMin, amountTokenMin;

        return runtime_1.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _this.transformRemoveLiquidityParams(params);

              case 2:
                _yield$_this$transfor = _context2.sent;
                tokenA = _yield$_this$transfor.tokenA;
                tokenB = _yield$_this$transfor.tokenB;
                liquidity = _yield$_this$transfor.liquidity;
                amountAMin = _yield$_this$transfor.amountAMin;
                amountBMin = _yield$_this$transfor.amountBMin;
                walletAddress = _yield$_this$transfor.walletAddress;
                deadlineInMilliseconds = _yield$_this$transfor.deadlineInMilliseconds;
                otherToken = _this.isKAI(tokenA) ? tokenB : tokenA;
                amountKAIMin = _this.isKAI(tokenA) ? amountAMin : amountBMin;
                amountTokenMin = _this.isKAI(tokenA) ? amountBMin : amountAMin;
                return _context2.abrupt("return", {
                  tokenAddress: otherToken,
                  liquidity: liquidity,
                  amountKAIMin: amountKAIMin,
                  amountTokenMin: amountTokenMin,
                  walletAddress: walletAddress,
                  deadlineInMilliseconds: deadlineInMilliseconds
                });

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }();

    this.invokeSMC = /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(_ref3) {
        var abi, smcAddr, methodName, params, _ref3$amount, amount, _ref3$gasLimit, gasLimit, _ref3$gasPrice, gasPrice, abiJson, data;

        return runtime_1.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                abi = _ref3.abi, smcAddr = _ref3.smcAddr, methodName = _ref3.methodName, params = _ref3.params, _ref3$amount = _ref3.amount, amount = _ref3$amount === void 0 ? 0 : _ref3$amount, _ref3$gasLimit = _ref3.gasLimit, gasLimit = _ref3$gasLimit === void 0 ? 5000000 : _ref3$gasLimit, _ref3$gasPrice = _ref3.gasPrice, gasPrice = _ref3$gasPrice === void 0 ? 1 : _ref3$gasPrice;
                abiJson = typeof abi === 'string' ? JSON.parse(abi) : JSON.parse(JSON.stringify(abi));

                _this.kardiaClient.contract.updateAbi(abiJson);

                _context3.next = 5;
                return _this.kardiaClient.contract.invokeContract(methodName, params).txData();

              case 5:
                data = _context3.sent;
                return _context3.abrupt("return", _this.kardiaClient.transaction.sendTransactionToExtension({
                  gas: gasLimit,
                  gasPrice: gasPrice,
                  value: amount,
                  to: smcAddr,
                  data: data
                }, true));

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x3) {
        return _ref4.apply(this, arguments);
      };
    }();

    var _options = options,
        abis = _options.abis,
        rpcEndpoint = _options.rpcEndpoint,
        smcAddresses$1 = _options.smcAddresses;
    this.abiJSON = {
      router: abis && abis.router || abiJson.ROUTER,
      factory: abis && abis.factory || abiJson.FACTORY,
      krc20: abis && abis.krc20 || abiJson.KRC20,
      limitOrder: abis && abis.limitOrder || abiJson.LIMIT_ORDER
    };
    this.smcAddresses = {
      router: smcAddresses$1 && smcAddresses$1.router || smcAddresses.ROUTER,
      factory: smcAddresses$1 && smcAddresses$1.factory || smcAddresses.FACTORY,
      limitOrder: smcAddresses$1 && smcAddresses$1.limitOrder || smcAddresses.LIMIT_ORDER,
      wkai: smcAddresses$1 && smcAddresses$1.wkai || smcAddresses.WKAI
    };
    this.kardiaClient = new KardiaClient({
      endpoint: rpcEndpoint || endpoint
    });
    this.factory = new FactoryService({
      abi: this.abiJSON.factory,
      smcAddress: this.smcAddresses.factory,
      client: this.kardiaClient
    });
    this.router = new RouterService({
      abi: this.abiJSON.router,
      smcAddress: this.smcAddresses.router,
      client: this.kardiaClient
    });
    this.krc20 = new KRC20Service({
      abi: this.abiJSON.krc20,
      client: this.kardiaClient,
      smcAddress: ''
    });
  }

  _createClass(KaidexService, [{
    key: "abis",
    get: function get() {
      return this.abiJSON;
    }
  }, {
    key: "addresses",
    get: function get() {
      return this.smcAddresses;
    }
  }]);

  return KaidexService;
}();

var TradeType;

(function (TradeType) {
  TradeType[TradeType["BUY"] = 0] = "BUY";
  TradeType[TradeType["SELL"] = 1] = "SELL";
})(TradeType || (TradeType = {}));

var InputType;

(function (InputType) {
  InputType[InputType["EXACT_IN"] = 0] = "EXACT_IN";
  InputType[InputType["EXACT_OUT"] = 1] = "EXACT_OUT";
})(InputType || (InputType = {}));

var KaidexClient = /*#__PURE__*/function (_KaidexService) {
  _inheritsLoose(KaidexClient, _KaidexService);

  function KaidexClient() {
    var _this;

    _this = _KaidexService.apply(this, arguments) || this;

    _this.getPair = function (tokenA, tokenB) {
      return _this.factory.getPair(tokenA, tokenB);
    };

    _this.getReserves = function (tokenA, tokenB) {
      return _this.router.getReserves(tokenA, tokenB);
    };

    _this.getApprovalState = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(_ref) {
        var tokenAddr, decimals, walletAddress, spenderAddress, amountToCheck, currentAllowance;
        return runtime_1.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                tokenAddr = _ref.tokenAddr, decimals = _ref.decimals, walletAddress = _ref.walletAddress, spenderAddress = _ref.spenderAddress, amountToCheck = _ref.amountToCheck;

                if (!_this.isKAI(tokenAddr)) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return", true);

              case 3:
                _context.next = 5;
                return _this.krc20.getAllowance(tokenAddr, walletAddress, spenderAddress);

              case 5:
                currentAllowance = _context.sent;
                return _context.abrupt("return", !JSBI.lessThan(currentAllowance, JSBI.BigInt(Utils.cellValue(amountToCheck, decimals))));

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }();

    _this.getTokenBalance = function (tokenAddress, walletAddress) {
      return _this.krc20.balanceOf(tokenAddress, walletAddress);
    };

    _this.addLiquidityCallParameters = function (params) {
      var inputToken = params.tokenA,
          outputToken = params.tokenB; // For KAI Pairs

      if (_this.isKAI(inputToken.tokenAddress) || _this.isKAI(outputToken.tokenAddress)) {
        var _this$transformAddLiq = _this.transformAddLiquidityKAIParams(params),
            tokenAddress = _this$transformAddLiq.tokenAddress,
            amountTokenMin = _this$transformAddLiq.amountTokenMin,
            amountTokenDesired = _this$transformAddLiq.amountTokenDesired,
            amountKAI = _this$transformAddLiq.amountKAI,
            amountKAIMin = _this$transformAddLiq.amountKAIMin,
            _walletAddress = _this$transformAddLiq.walletAddress,
            _deadlineInMilliseconds = _this$transformAddLiq.deadlineInMilliseconds;

        return {
          methodName: methodNames.ADD_LIQUIDITY_KAI,
          args: [tokenAddress, amountTokenDesired, amountTokenMin, amountKAIMin, _walletAddress, _deadlineInMilliseconds],
          amount: amountKAI
        };
      }

      var _this$transformAddLiq2 = _this.transformAddLiquidityParams(params),
          tokenA = _this$transformAddLiq2.tokenA,
          tokenB = _this$transformAddLiq2.tokenB,
          amountADesired = _this$transformAddLiq2.amountADesired,
          amountBDesired = _this$transformAddLiq2.amountBDesired,
          amountAMin = _this$transformAddLiq2.amountAMin,
          amountBMin = _this$transformAddLiq2.amountBMin,
          walletAddress = _this$transformAddLiq2.walletAddress,
          deadlineInMilliseconds = _this$transformAddLiq2.deadlineInMilliseconds;

      return {
        methodName: methodNames.ADD_LIQUIDITY,
        args: [tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, walletAddress, deadlineInMilliseconds]
      };
    };

    _this.removeLiquidityCallParameters = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(params) {
        var _params$pair, inputToken, outputToken, _yield$_this$transfor, tokenAddress, _liquidity, amountKAIMin, amountTokenMin, _walletAddress2, _deadlineInMilliseconds2, _yield$_this$transfor2, tokenA, tokenB, liquidity, amountAMin, amountBMin, walletAddress, deadlineInMilliseconds;

        return runtime_1.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _params$pair = params.pair, inputToken = _params$pair.tokenA, outputToken = _params$pair.tokenB; // For KAI Pairs

                if (!(_this.isKAI(inputToken.tokenAddress) || _this.isKAI(outputToken.tokenAddress))) {
                  _context2.next = 12;
                  break;
                }

                _context2.next = 4;
                return _this.transformRemoveLiquidityKAIParams(params);

              case 4:
                _yield$_this$transfor = _context2.sent;
                tokenAddress = _yield$_this$transfor.tokenAddress;
                _liquidity = _yield$_this$transfor.liquidity;
                amountKAIMin = _yield$_this$transfor.amountKAIMin;
                amountTokenMin = _yield$_this$transfor.amountTokenMin;
                _walletAddress2 = _yield$_this$transfor.walletAddress;
                _deadlineInMilliseconds2 = _yield$_this$transfor.deadlineInMilliseconds;
                return _context2.abrupt("return", {
                  methodName: params.feeOnTransfer ? methodNames.REMOVE_LIQUIDITY_KAI_SUPPORTING_FEE : methodNames.REMOVE_LIQUIDITY_KAI,
                  args: [tokenAddress, _liquidity, amountTokenMin, amountKAIMin, _walletAddress2, _deadlineInMilliseconds2]
                });

              case 12:
                _context2.next = 14;
                return _this.transformRemoveLiquidityParams(params);

              case 14:
                _yield$_this$transfor2 = _context2.sent;
                tokenA = _yield$_this$transfor2.tokenA;
                tokenB = _yield$_this$transfor2.tokenB;
                liquidity = _yield$_this$transfor2.liquidity;
                amountAMin = _yield$_this$transfor2.amountAMin;
                amountBMin = _yield$_this$transfor2.amountBMin;
                walletAddress = _yield$_this$transfor2.walletAddress;
                deadlineInMilliseconds = _yield$_this$transfor2.deadlineInMilliseconds;
                return _context2.abrupt("return", {
                  methodName: methodNames.REMOVE_LIQUIDITY,
                  args: [tokenA, tokenB, liquidity, amountAMin, amountBMin, walletAddress, deadlineInMilliseconds]
                });

              case 23:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }();

    _this.calculateOutputAmount = function (_ref4) {
      var amount = _ref4.amount,
          inputToken = _ref4.inputToken,
          reserveIn = _ref4.reserveIn,
          outputToken = _ref4.outputToken,
          reserveOut = _ref4.reserveOut,
          inputType = _ref4.inputType;
      if (!amount || !inputToken || !outputToken) throw new Error('Params input error.');
      var amountDec;
      var amountOutDec = '';
      var decimals;

      switch (inputType) {
        case InputType.EXACT_IN:
          amountDec = Utils.cellValue(amount, inputToken.decimals); // Get amount

          amountOutDec = _this.getOutputAmount(amountDec, reserveIn, reserveOut);
          decimals = outputToken.decimals;
          break;

        case InputType.EXACT_OUT:
          amountDec = Utils.cellValue(amount, outputToken.decimals);
          amountOutDec = _this.getInputAmount(amountDec, reserveIn, reserveOut);
          decimals = inputToken.decimals;
          break;
      }

      return Utils.convertValueFollowDecimal(amountOutDec, decimals);
    };

    _this.calculatePriceImpact = /*#__PURE__*/function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(_ref5) {
        var inputToken, outputToken, amountIn, amountOut, inputTokenDec, inputTokenAddr, outputTokenDec, outputTokenAddr, _yield$_this$router$g, reserveA, reserveB, amountInDec, amountOutDec, reserveAConvertBigInt, reserveBConvertBigInt, midPrice, amountInFrac, amountOutFrac, exactQuote, slippage;

        return runtime_1.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                inputToken = _ref5.inputToken, outputToken = _ref5.outputToken, amountIn = _ref5.amountIn, amountOut = _ref5.amountOut;

                if (!(!inputToken || !outputToken || !amountIn || !amountOut)) {
                  _context3.next = 3;
                  break;
                }

                throw new Error('Params input error.');

              case 3:
                inputTokenDec = inputToken.decimals, inputTokenAddr = inputToken.tokenAddress;
                outputTokenDec = outputToken.decimals, outputTokenAddr = outputToken.tokenAddress;
                _context3.next = 7;
                return _this.router.getReserves(inputTokenAddr, outputTokenAddr);

              case 7:
                _yield$_this$router$g = _context3.sent;
                reserveA = _yield$_this$router$g.reserveA;
                reserveB = _yield$_this$router$g.reserveB;

                if (!(!reserveA || reserveA === '0' || !reserveB || reserveB === '0')) {
                  _context3.next = 12;
                  break;
                }

                return _context3.abrupt("return", '0');

              case 12:
                amountInDec = Utils.cellValue(amountIn, inputTokenDec);
                amountOutDec = Utils.cellValue(amountOut, outputTokenDec);
                reserveAConvertBigInt = inputTokenDec ? new Fraction(JSBI.BigInt(reserveA), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(inputTokenDec))) : new Fraction(JSBI.BigInt(reserveA));
                reserveBConvertBigInt = outputTokenDec ? new Fraction(JSBI.BigInt(reserveB), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(outputTokenDec))) : new Fraction(JSBI.BigInt(reserveB));
                midPrice = reserveBConvertBigInt.divide(reserveAConvertBigInt);
                amountInFrac = new Fraction(amountInDec, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(inputTokenDec)));
                amountOutFrac = new Fraction(amountOutDec, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(outputTokenDec)));
                exactQuote = midPrice.multiply(amountInFrac);
                slippage = exactQuote.subtract(amountOutFrac).divide(exactQuote);
                return _context3.abrupt("return", slippage.multiply(100).toFixed(5));

              case 22:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x3) {
        return _ref6.apply(this, arguments);
      };
    }();

    _this.calculateExchangeRate = /*#__PURE__*/function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee4(tokenA, tokenB) {
        var _yield$_this$router$g2, reserveA, reserveB, tokenAValue, tokenBValue, _tokenAValue, _tokenBValue, rateAB, rateBA;

        return runtime_1.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _this.router.getReserves(tokenA.tokenAddress, tokenB.tokenAddress);

              case 2:
                _yield$_this$router$g2 = _context4.sent;
                reserveA = _yield$_this$router$g2.reserveA;
                reserveB = _yield$_this$router$g2.reserveB;
                tokenAValue = Utils.convertValueFollowDecimal(JSBI.BigInt(reserveA).toString(), tokenA.decimals);
                tokenBValue = Utils.convertValueFollowDecimal(JSBI.BigInt(reserveB).toString(), tokenB.decimals);
                _tokenAValue = Number(tokenAValue);
                _tokenBValue = Number(tokenBValue);
                rateAB = _tokenAValue ? _tokenBValue / _tokenAValue : 0;
                rateBA = _tokenBValue ? _tokenAValue / _tokenBValue : 0;
                return _context4.abrupt("return", {
                  rateAB: rateAB,
                  rateBA: rateBA
                });

              case 12:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function (_x4, _x5) {
        return _ref7.apply(this, arguments);
      };
    }();

    _this.marketSwapCallParameters = function (_ref8) {
      var amountIn = _ref8.amountIn,
          amountOut = _ref8.amountOut,
          inputToken = _ref8.inputToken,
          outputToken = _ref8.outputToken,
          addressTo = _ref8.addressTo,
          inputType = _ref8.inputType,
          txDeadline = _ref8.txDeadline,
          slippageTolerance = _ref8.slippageTolerance,
          feeOnTransfer = _ref8.feeOnTransfer;
      if (!amountIn || !amountOut || !addressTo || !inputToken || !outputToken) throw new Error('Params input error.');

      var kaiIn = _this.isKAI(inputToken.tokenAddress);

      var kaiOut = _this.isKAI(outputToken.tokenAddress);

      var amountInDec = Utils.cellValue(amountIn, inputToken.decimals);
      var amountOutDec = Utils.cellValue(amountOut, outputToken.decimals);
      var amountOutMinDec = Utils.calculateSlippageValue(amountOutDec, slippageTolerance, 'sub');
      var amountInMaxDec = Utils.calculateSlippageValue(amountInDec, slippageTolerance, 'add');
      var path = Utils.renderPair(inputToken.tokenAddress, outputToken.tokenAddress);
      var swapParams = {};

      switch (inputType) {
        case InputType.EXACT_IN:
          if (kaiIn) {
            swapParams = {
              methodName: feeOnTransfer ? methodNames.SWAP_EXACT_KAI_FOR_TOKEN_SUPPORTING_ON_FEE_TRANSFER : methodNames.SWAP_EXACT_KAI_FOR_TOKENS,
              args: [amountOutMinDec, path, addressTo, txDeadline],
              amount: amountInDec
            };
          } else if (kaiOut) {
            swapParams = {
              methodName: feeOnTransfer ? methodNames.SWAP_EXACT_TOKEN_FOR_KAI_SUPPORTING_ON_FEE_TRANSFER : methodNames.SWAP_EXACT_TOKENS_FOR_KAI,
              args: [amountInDec, amountOutMinDec, path, addressTo, txDeadline]
            };
          } else {
            swapParams = {
              methodName: feeOnTransfer ? methodNames.SWAP_EXACT_TOKEN_FOR_TOKEN_SUPPORTING_ON_FEE_TRANSFER : methodNames.SWAP_EXACT_TOKENS_FOR_TOKENS,
              args: [amountInDec, amountOutMinDec, path, addressTo, txDeadline]
            };
          }

          break;

        case InputType.EXACT_OUT:
          if (kaiIn) {
            swapParams = {
              methodName: methodNames.SWAP_KAI_FOR_EXACT_TOKENS,
              args: [amountOutDec, path, addressTo, txDeadline],
              amount: amountInMaxDec
            };
          } else if (kaiOut) {
            swapParams = {
              methodName: methodNames.SWAP_TOKENS_FOR_EXACT_KAI,
              args: [amountOutDec, amountInMaxDec, path, addressTo, txDeadline]
            };
          } else {
            swapParams = {
              methodName: methodNames.SWAP_TOKENS_FOR_EXACT_TOKENS,
              args: [amountOutDec, amountInMaxDec, path, addressTo, txDeadline]
            };
          }

          break;
      }

      return swapParams;
    };

    _this.limitOrderCallParameters = function (_ref9) {
      var amountIn = _ref9.amountIn,
          amountOut = _ref9.amountOut,
          inputToken = _ref9.inputToken,
          outputToken = _ref9.outputToken,
          inputType = _ref9.inputType,
          tradeType = _ref9.tradeType;
      if (!amountIn || !amountOut || !inputToken || !outputToken) throw new Error('Params input error.');
      var inputTokenAddr = inputToken.tokenAddress,
          inputTokenDec = inputToken.decimals;
      var outputTokenAddr = outputToken.tokenAddress,
          outputTokenDec = outputToken.decimals;
      var amountInDec = Utils.cellValue(amountIn, inputTokenDec);
      var amountOutDec = Utils.cellValue(amountOut, outputTokenDec);

      var kaiIn = _this.isKAI(inputToken.tokenAddress);

      var swapParams;

      if (kaiIn) {
        swapParams = {
          methodName: methodNames.ORDER_INPUT_KAI,
          args: [outputTokenAddr, amountOutDec, inputType, tradeType],
          amount: amountInDec
        };
      } else {
        swapParams = {
          methodName: methodNames.ORDER_INPUT_TOKENS,
          args: [inputTokenAddr, amountInDec, outputTokenAddr, amountOutDec, inputType, tradeType]
        };
      }

      return swapParams;
    };

    _this.cancelLimitOrder = function (_ref10) {
      var pairAddr = _ref10.pairAddr,
          orderID = _ref10.orderID;
      if (!pairAddr || !orderID) throw new Error('Params input error.');
      return {
        methodName: methodNames.CANCEL_ORDER,
        args: [pairAddr, orderID]
      };
    };

    return _this;
  }

  var _proto = KaidexClient.prototype;

  _proto.getOutputAmount = function getOutputAmount(inputAmount, reserveIn, reserveOut) {
    var reserveInBigInt = JSBI.BigInt(reserveIn);
    var reserveOutBigInt = JSBI.BigInt(reserveOut);
    if (JSBI.equal(reserveInBigInt, ZERO) || JSBI.equal(reserveOutBigInt, ZERO)) throw new Error('Insufficient reserves error.');
    var inputAmountWithFee = JSBI.multiply(JSBI.BigInt(inputAmount), _9975);
    var numerator = JSBI.multiply(inputAmountWithFee, reserveOutBigInt);
    var denominator = JSBI.add(JSBI.multiply(reserveInBigInt, _10000), inputAmountWithFee);
    return JSBI.divide(numerator, denominator).toString();
  };

  _proto.getInputAmount = function getInputAmount(outputAmount, reserveIn, reserveOut) {
    var reserveInBigInt = JSBI.BigInt(reserveIn);
    var reserveOutBigInt = JSBI.BigInt(reserveOut);
    if (JSBI.equal(reserveInBigInt, ZERO) || JSBI.equal(reserveOutBigInt, ZERO) || JSBI.greaterThanOrEqual(JSBI.BigInt(outputAmount), reserveOutBigInt)) throw new Error('Insufficient reserves error.');
    var numerator = JSBI.multiply(JSBI.multiply(reserveInBigInt, JSBI.BigInt(outputAmount)), _10000);
    var denominator = JSBI.multiply(JSBI.subtract(reserveOutBigInt, JSBI.BigInt(outputAmount)), _9975);
    return JSBI.add(JSBI.divide(numerator, denominator), ONE$1).toString();
  };

  return KaidexClient;
}(KaidexService);

export default KaidexClient;
export { Fraction, InputType, KRC20Service, KaidexClient, TradeType, Utils };
//# sourceMappingURL=kaidex-sdk.esm.js.map
