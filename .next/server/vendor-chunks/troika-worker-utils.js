/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/troika-worker-utils";
exports.ids = ["vendor-chunks/troika-worker-utils"];
exports.modules = {

/***/ "(ssr)/./node_modules/troika-worker-utils/dist/troika-worker-utils.umd.js":
/*!**************************************************************************!*\
  !*** ./node_modules/troika-worker-utils/dist/troika-worker-utils.umd.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

eval("(function (global, factory) {\n   true ? factory(exports) :\n  0;\n}(this, (function (exports) { 'use strict';\n\n  /**\n   * Main content for the worker that handles the loading and execution of\n   * modules within it.\n   */\n  function workerBootstrap() {\n    var modules = Object.create(null);\n\n    // Handle messages for registering a module\n    function registerModule(ref, callback) {\n      var id = ref.id;\n      var name = ref.name;\n      var dependencies = ref.dependencies; if ( dependencies === void 0 ) dependencies = [];\n      var init = ref.init; if ( init === void 0 ) init = function(){};\n      var getTransferables = ref.getTransferables; if ( getTransferables === void 0 ) getTransferables = null;\n\n      // Only register once\n      if (modules[id]) { return }\n\n      try {\n        // If any dependencies are modules, ensure they're registered and grab their value\n        dependencies = dependencies.map(function (dep) {\n          if (dep && dep.isWorkerModule) {\n            registerModule(dep, function (depResult) {\n              if (depResult instanceof Error) { throw depResult }\n            });\n            dep = modules[dep.id].value;\n          }\n          return dep\n        });\n\n        // Rehydrate functions\n        init = rehydrate((\"<\" + name + \">.init\"), init);\n        if (getTransferables) {\n          getTransferables = rehydrate((\"<\" + name + \">.getTransferables\"), getTransferables);\n        }\n\n        // Initialize the module and store its value\n        var value = null;\n        if (typeof init === 'function') {\n          value = init.apply(void 0, dependencies);\n        } else {\n          console.error('worker module init function failed to rehydrate');\n        }\n        modules[id] = {\n          id: id,\n          value: value,\n          getTransferables: getTransferables\n        };\n        callback(value);\n      } catch(err) {\n        if (!(err && err.noLog)) {\n          console.error(err);\n        }\n        callback(err);\n      }\n    }\n\n    // Handle messages for calling a registered module's result function\n    function callModule(ref, callback) {\n      var ref$1;\n\n      var id = ref.id;\n      var args = ref.args;\n      if (!modules[id] || typeof modules[id].value !== 'function') {\n        callback(new Error((\"Worker module \" + id + \": not found or its 'init' did not return a function\")));\n      }\n      try {\n        var result = (ref$1 = modules[id]).value.apply(ref$1, args);\n        if (result && typeof result.then === 'function') {\n          result.then(handleResult, function (rej) { return callback(rej instanceof Error ? rej : new Error('' + rej)); });\n        } else {\n          handleResult(result);\n        }\n      } catch(err) {\n        callback(err);\n      }\n      function handleResult(result) {\n        try {\n          var tx = modules[id].getTransferables && modules[id].getTransferables(result);\n          if (!tx || !Array.isArray(tx) || !tx.length) {\n            tx = undefined; //postMessage is very picky about not passing null or empty transferables\n          }\n          callback(result, tx);\n        } catch(err) {\n          console.error(err);\n          callback(err);\n        }\n      }\n    }\n\n    function rehydrate(name, str) {\n      var result = void 0;\n      self.troikaDefine = function (r) { return result = r; };\n      var url = URL.createObjectURL(\n        new Blob(\n          [(\"/** \" + (name.replace(/\\*/g, '')) + \" **/\\n\\ntroikaDefine(\\n\" + str + \"\\n)\")],\n          {type: 'application/javascript'}\n        )\n      );\n      try {\n        importScripts(url);\n      } catch(err) {\n        console.error(err);\n      }\n      URL.revokeObjectURL(url);\n      delete self.troikaDefine;\n      return result\n    }\n\n    // Handler for all messages within the worker\n    self.addEventListener('message', function (e) {\n      var ref = e.data;\n      var messageId = ref.messageId;\n      var action = ref.action;\n      var data = ref.data;\n      try {\n        // Module registration\n        if (action === 'registerModule') {\n          registerModule(data, function (result) {\n            if (result instanceof Error) {\n              postMessage({\n                messageId: messageId,\n                success: false,\n                error: result.message\n              });\n            } else {\n              postMessage({\n                messageId: messageId,\n                success: true,\n                result: {isCallable: typeof result === 'function'}\n              });\n            }\n          });\n        }\n        // Invocation\n        if (action === 'callModule') {\n          callModule(data, function (result, transferables) {\n            if (result instanceof Error) {\n              postMessage({\n                messageId: messageId,\n                success: false,\n                error: result.message\n              });\n            } else {\n              postMessage({\n                messageId: messageId,\n                success: true,\n                result: result\n              }, transferables || undefined);\n            }\n          });\n        }\n      } catch(err) {\n        postMessage({\n          messageId: messageId,\n          success: false,\n          error: err.stack\n        });\n      }\n    });\n  }\n\n  /**\n   * Fallback for `defineWorkerModule` that behaves identically but runs in the main\n   * thread, for when the execution environment doesn't support web workers or they\n   * are disallowed due to e.g. CSP security restrictions.\n   */\n  function defineMainThreadModule(options) {\n    var moduleFunc = function() {\n      var args = [], len = arguments.length;\n      while ( len-- ) args[ len ] = arguments[ len ];\n\n      return moduleFunc._getInitResult().then(function (initResult) {\n        if (typeof initResult === 'function') {\n          return initResult.apply(void 0, args)\n        } else {\n          throw new Error('Worker module function was called but `init` did not return a callable function')\n        }\n      })\n    };\n    moduleFunc._getInitResult = function() {\n      // We can ignore getTransferables in main thread. TODO workerId?\n      var dependencies = options.dependencies;\n      var init = options.init;\n\n      // Resolve dependencies\n      dependencies = Array.isArray(dependencies) ? dependencies.map(function (dep) { return dep && dep._getInitResult ? dep._getInitResult() : dep; }\n      ) : [];\n\n      // Invoke init with the resolved dependencies\n      var initPromise = Promise.all(dependencies).then(function (deps) {\n        return init.apply(null, deps)\n      });\n\n      // Cache the resolved promise for subsequent calls\n      moduleFunc._getInitResult = function () { return initPromise; };\n\n      return initPromise\n    };\n    return moduleFunc\n  }\n\n  var supportsWorkers = function () {\n    var supported = false;\n\n    // Only attempt worker initialization in browsers; elsewhere it would just be\n    // noise e.g. loading into a Node environment for SSR.\n    if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {\n      try {\n        // TODO additional checks for things like importScripts within the worker?\n        //  Would need to be an async check.\n        var worker = new Worker(\n          URL.createObjectURL(new Blob([''], { type: 'application/javascript' }))\n        );\n        worker.terminate();\n        supported = true;\n      } catch (err) {\n        if (typeof process !== 'undefined' && \"development\" === 'test') {} else {\n          console.log(\n            (\"Troika createWorkerModule: web workers not allowed; falling back to main thread execution. Cause: [\" + (err.message) + \"]\")\n          );\n        }\n      }\n    }\n\n    // Cached result\n    supportsWorkers = function () { return supported; };\n    return supported\n  };\n\n  var _workerModuleId = 0;\n  var _messageId = 0;\n  var _allowInitAsString = false;\n  var workers = Object.create(null);\n  var registeredModules = Object.create(null); //workerId -> Set<unregisterFn>\n  var openRequests = Object.create(null);\n\n\n  /**\n   * Define a module of code that will be executed with a web worker. This provides a simple\n   * interface for moving chunks of logic off the main thread, and managing their dependencies\n   * among one another.\n   *\n   * @param {object} options\n   * @param {function} options.init\n   * @param {array} [options.dependencies]\n   * @param {function} [options.getTransferables]\n   * @param {string} [options.name]\n   * @param {string} [options.workerId]\n   * @return {function(...[*]): {then}}\n   */\n  function defineWorkerModule(options) {\n    if ((!options || typeof options.init !== 'function') && !_allowInitAsString) {\n      throw new Error('requires `options.init` function')\n    }\n    var dependencies = options.dependencies;\n    var init = options.init;\n    var getTransferables = options.getTransferables;\n    var workerId = options.workerId;\n\n    if (!supportsWorkers()) {\n      return defineMainThreadModule(options)\n    }\n\n    if (workerId == null) {\n      workerId = '#default';\n    }\n    var id = \"workerModule\" + (++_workerModuleId);\n    var name = options.name || id;\n    var registrationPromise = null;\n\n    dependencies = dependencies && dependencies.map(function (dep) {\n      // Wrap raw functions as worker modules with no dependencies\n      if (typeof dep === 'function' && !dep.workerModuleData) {\n        _allowInitAsString = true;\n        dep = defineWorkerModule({\n          workerId: workerId,\n          name: (\"<\" + name + \"> function dependency: \" + (dep.name)),\n          init: (\"function(){return (\\n\" + (stringifyFunction(dep)) + \"\\n)}\")\n        });\n        _allowInitAsString = false;\n      }\n      // Grab postable data for worker modules\n      if (dep && dep.workerModuleData) {\n        dep = dep.workerModuleData;\n      }\n      return dep\n    });\n\n    function moduleFunc() {\n      var args = [], len = arguments.length;\n      while ( len-- ) args[ len ] = arguments[ len ];\n\n      // Register this module if needed\n      if (!registrationPromise) {\n        registrationPromise = callWorker(workerId,'registerModule', moduleFunc.workerModuleData);\n        var unregister = function () {\n          registrationPromise = null;\n          registeredModules[workerId].delete(unregister);\n        }\n        ;(registeredModules[workerId] || (registeredModules[workerId] = new Set())).add(unregister);\n      }\n\n      // Invoke the module, returning a promise\n      return registrationPromise.then(function (ref) {\n        var isCallable = ref.isCallable;\n\n        if (isCallable) {\n          return callWorker(workerId,'callModule', {id: id, args: args})\n        } else {\n          throw new Error('Worker module function was called but `init` did not return a callable function')\n        }\n      })\n    }\n    moduleFunc.workerModuleData = {\n      isWorkerModule: true,\n      id: id,\n      name: name,\n      dependencies: dependencies,\n      init: stringifyFunction(init),\n      getTransferables: getTransferables && stringifyFunction(getTransferables)\n    };\n    return moduleFunc\n  }\n\n  /**\n   * Terminate an active Worker by a workerId that was passed to defineWorkerModule.\n   * This only terminates the Worker itself; the worker module will remain available\n   * and if you call it again its Worker will be respawned.\n   * @param {string} workerId\n   */\n  function terminateWorker(workerId) {\n    // Unregister all modules that were registered in that worker\n    if (registeredModules[workerId]) {\n      registeredModules[workerId].forEach(function (unregister) {\n        unregister();\n      });\n    }\n    // Terminate the Worker object\n    if (workers[workerId]) {\n      workers[workerId].terminate();\n      delete workers[workerId];\n    }\n  }\n\n  /**\n   * Stringifies a function into a form that can be deserialized in the worker\n   * @param fn\n   */\n  function stringifyFunction(fn) {\n    var str = fn.toString();\n    // If it was defined in object method/property format, it needs to be modified\n    if (!/^function/.test(str) && /^\\w+\\s*\\(/.test(str)) {\n      str = 'function ' + str;\n    }\n    return str\n  }\n\n\n  function getWorker(workerId) {\n    var worker = workers[workerId];\n    if (!worker) {\n      // Bootstrap the worker's content\n      var bootstrap = stringifyFunction(workerBootstrap);\n\n      // Create the worker from the bootstrap function content\n      worker = workers[workerId] = new Worker(\n        URL.createObjectURL(\n          new Blob(\n            [(\"/** Worker Module Bootstrap: \" + (workerId.replace(/\\*/g, '')) + \" **/\\n\\n;(\" + bootstrap + \")()\")],\n            {type: 'application/javascript'}\n          )\n        )\n      );\n\n      // Single handler for response messages from the worker\n      worker.onmessage = function (e) {\n        var response = e.data;\n        var msgId = response.messageId;\n        var callback = openRequests[msgId];\n        if (!callback) {\n          throw new Error('WorkerModule response with empty or unknown messageId')\n        }\n        delete openRequests[msgId];\n        callback(response);\n      };\n    }\n    return worker\n  }\n\n  // Issue a call to the worker with a callback to handle the response\n  function callWorker(workerId, action, data) {\n    return new Promise(function (resolve, reject) {\n      var messageId = ++_messageId;\n      openRequests[messageId] = function (response) {\n        if (response.success) {\n          resolve(response.result);\n        } else {\n          reject(new Error((\"Error in worker \" + action + \" call: \" + (response.error))));\n        }\n      };\n      getWorker(workerId).postMessage({\n        messageId: messageId,\n        action: action,\n        data: data\n      });\n    })\n  }\n\n  exports.defineWorkerModule = defineWorkerModule;\n  exports.stringifyFunction = stringifyFunction;\n  exports.terminateWorker = terminateWorker;\n\n  Object.defineProperty(exports, '__esModule', { value: true });\n\n})));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvdHJvaWthLXdvcmtlci11dGlscy9kaXN0L3Ryb2lrYS13b3JrZXItdXRpbHMudW1kLmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0EsRUFBRSxLQUE0RDtBQUM5RCxFQUFFLENBQ29IO0FBQ3RILENBQUMsNkJBQTZCOztBQUU5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0MsMkJBQTJCO0FBQzNCLG1EQUFtRDs7QUFFbkQ7QUFDQSx5QkFBeUI7O0FBRXpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0Q7QUFDaEQsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCxvRUFBb0U7QUFDekgsVUFBVTtBQUNWO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUNBQXlDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsZUFBZTtBQUNmO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQSxXQUFXO0FBQ1g7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxRkFBcUY7QUFDckY7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBLGdEQUFnRDs7QUFFaEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSx1REFBdUQ7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLGdDQUFnQztBQUMvRTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1IsOENBQThDLGFBQW9CLGFBQWEsRUFBQyxDQUFDO0FBQ2pGO0FBQ0Esa0VBQWtFO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxVQUFVO0FBQ3ZCLGFBQWEsT0FBTztBQUNwQixhQUFhLFVBQVU7QUFDdkIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixjQUFjLG1CQUFtQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2Qiw4Q0FBOEM7QUFDM0UsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0RBQW9ELG1CQUFtQjtBQUN2RSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBGQUEwRjtBQUMxRixhQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxpREFBaUQsYUFBYTs7QUFFOUQsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3NwYWNlcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL3Ryb2lrYS13b3JrZXItdXRpbHMvZGlzdC90cm9pa2Etd29ya2VyLXV0aWxzLnVtZC5qcz8zOWQ3Il0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcbiAgKGdsb2JhbCA9IHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbFRoaXMgOiBnbG9iYWwgfHwgc2VsZiwgZmFjdG9yeShnbG9iYWwudHJvaWthX3dvcmtlcl91dGlscyA9IHt9KSk7XG59KHRoaXMsIChmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbiAgLyoqXG4gICAqIE1haW4gY29udGVudCBmb3IgdGhlIHdvcmtlciB0aGF0IGhhbmRsZXMgdGhlIGxvYWRpbmcgYW5kIGV4ZWN1dGlvbiBvZlxuICAgKiBtb2R1bGVzIHdpdGhpbiBpdC5cbiAgICovXG4gIGZ1bmN0aW9uIHdvcmtlckJvb3RzdHJhcCgpIHtcbiAgICB2YXIgbW9kdWxlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICAvLyBIYW5kbGUgbWVzc2FnZXMgZm9yIHJlZ2lzdGVyaW5nIGEgbW9kdWxlXG4gICAgZnVuY3Rpb24gcmVnaXN0ZXJNb2R1bGUocmVmLCBjYWxsYmFjaykge1xuICAgICAgdmFyIGlkID0gcmVmLmlkO1xuICAgICAgdmFyIG5hbWUgPSByZWYubmFtZTtcbiAgICAgIHZhciBkZXBlbmRlbmNpZXMgPSByZWYuZGVwZW5kZW5jaWVzOyBpZiAoIGRlcGVuZGVuY2llcyA9PT0gdm9pZCAwICkgZGVwZW5kZW5jaWVzID0gW107XG4gICAgICB2YXIgaW5pdCA9IHJlZi5pbml0OyBpZiAoIGluaXQgPT09IHZvaWQgMCApIGluaXQgPSBmdW5jdGlvbigpe307XG4gICAgICB2YXIgZ2V0VHJhbnNmZXJhYmxlcyA9IHJlZi5nZXRUcmFuc2ZlcmFibGVzOyBpZiAoIGdldFRyYW5zZmVyYWJsZXMgPT09IHZvaWQgMCApIGdldFRyYW5zZmVyYWJsZXMgPSBudWxsO1xuXG4gICAgICAvLyBPbmx5IHJlZ2lzdGVyIG9uY2VcbiAgICAgIGlmIChtb2R1bGVzW2lkXSkgeyByZXR1cm4gfVxuXG4gICAgICB0cnkge1xuICAgICAgICAvLyBJZiBhbnkgZGVwZW5kZW5jaWVzIGFyZSBtb2R1bGVzLCBlbnN1cmUgdGhleSdyZSByZWdpc3RlcmVkIGFuZCBncmFiIHRoZWlyIHZhbHVlXG4gICAgICAgIGRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcy5tYXAoZnVuY3Rpb24gKGRlcCkge1xuICAgICAgICAgIGlmIChkZXAgJiYgZGVwLmlzV29ya2VyTW9kdWxlKSB7XG4gICAgICAgICAgICByZWdpc3Rlck1vZHVsZShkZXAsIGZ1bmN0aW9uIChkZXBSZXN1bHQpIHtcbiAgICAgICAgICAgICAgaWYgKGRlcFJlc3VsdCBpbnN0YW5jZW9mIEVycm9yKSB7IHRocm93IGRlcFJlc3VsdCB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRlcCA9IG1vZHVsZXNbZGVwLmlkXS52YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGRlcFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBSZWh5ZHJhdGUgZnVuY3Rpb25zXG4gICAgICAgIGluaXQgPSByZWh5ZHJhdGUoKFwiPFwiICsgbmFtZSArIFwiPi5pbml0XCIpLCBpbml0KTtcbiAgICAgICAgaWYgKGdldFRyYW5zZmVyYWJsZXMpIHtcbiAgICAgICAgICBnZXRUcmFuc2ZlcmFibGVzID0gcmVoeWRyYXRlKChcIjxcIiArIG5hbWUgKyBcIj4uZ2V0VHJhbnNmZXJhYmxlc1wiKSwgZ2V0VHJhbnNmZXJhYmxlcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbml0aWFsaXplIHRoZSBtb2R1bGUgYW5kIHN0b3JlIGl0cyB2YWx1ZVxuICAgICAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgICAgICBpZiAodHlwZW9mIGluaXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB2YWx1ZSA9IGluaXQuYXBwbHkodm9pZCAwLCBkZXBlbmRlbmNpZXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3dvcmtlciBtb2R1bGUgaW5pdCBmdW5jdGlvbiBmYWlsZWQgdG8gcmVoeWRyYXRlJyk7XG4gICAgICAgIH1cbiAgICAgICAgbW9kdWxlc1tpZF0gPSB7XG4gICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICBnZXRUcmFuc2ZlcmFibGVzOiBnZXRUcmFuc2ZlcmFibGVzXG4gICAgICAgIH07XG4gICAgICAgIGNhbGxiYWNrKHZhbHVlKTtcbiAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgIGlmICghKGVyciAmJiBlcnIubm9Mb2cpKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICB9XG4gICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIG1lc3NhZ2VzIGZvciBjYWxsaW5nIGEgcmVnaXN0ZXJlZCBtb2R1bGUncyByZXN1bHQgZnVuY3Rpb25cbiAgICBmdW5jdGlvbiBjYWxsTW9kdWxlKHJlZiwgY2FsbGJhY2spIHtcbiAgICAgIHZhciByZWYkMTtcblxuICAgICAgdmFyIGlkID0gcmVmLmlkO1xuICAgICAgdmFyIGFyZ3MgPSByZWYuYXJncztcbiAgICAgIGlmICghbW9kdWxlc1tpZF0gfHwgdHlwZW9mIG1vZHVsZXNbaWRdLnZhbHVlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcigoXCJXb3JrZXIgbW9kdWxlIFwiICsgaWQgKyBcIjogbm90IGZvdW5kIG9yIGl0cyAnaW5pdCcgZGlkIG5vdCByZXR1cm4gYSBmdW5jdGlvblwiKSkpO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IChyZWYkMSA9IG1vZHVsZXNbaWRdKS52YWx1ZS5hcHBseShyZWYkMSwgYXJncyk7XG4gICAgICAgIGlmIChyZXN1bHQgJiYgdHlwZW9mIHJlc3VsdC50aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmVzdWx0LnRoZW4oaGFuZGxlUmVzdWx0LCBmdW5jdGlvbiAocmVqKSB7IHJldHVybiBjYWxsYmFjayhyZWogaW5zdGFuY2VvZiBFcnJvciA/IHJlaiA6IG5ldyBFcnJvcignJyArIHJlaikpOyB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBoYW5kbGVSZXN1bHQocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGhhbmRsZVJlc3VsdChyZXN1bHQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgdHggPSBtb2R1bGVzW2lkXS5nZXRUcmFuc2ZlcmFibGVzICYmIG1vZHVsZXNbaWRdLmdldFRyYW5zZmVyYWJsZXMocmVzdWx0KTtcbiAgICAgICAgICBpZiAoIXR4IHx8ICFBcnJheS5pc0FycmF5KHR4KSB8fCAhdHgubGVuZ3RoKSB7XG4gICAgICAgICAgICB0eCA9IHVuZGVmaW5lZDsgLy9wb3N0TWVzc2FnZSBpcyB2ZXJ5IHBpY2t5IGFib3V0IG5vdCBwYXNzaW5nIG51bGwgb3IgZW1wdHkgdHJhbnNmZXJhYmxlc1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYWxsYmFjayhyZXN1bHQsIHR4KTtcbiAgICAgICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlaHlkcmF0ZShuYW1lLCBzdHIpIHtcbiAgICAgIHZhciByZXN1bHQgPSB2b2lkIDA7XG4gICAgICBzZWxmLnRyb2lrYURlZmluZSA9IGZ1bmN0aW9uIChyKSB7IHJldHVybiByZXN1bHQgPSByOyB9O1xuICAgICAgdmFyIHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoXG4gICAgICAgIG5ldyBCbG9iKFxuICAgICAgICAgIFsoXCIvKiogXCIgKyAobmFtZS5yZXBsYWNlKC9cXCovZywgJycpKSArIFwiICoqL1xcblxcbnRyb2lrYURlZmluZShcXG5cIiArIHN0ciArIFwiXFxuKVwiKV0sXG4gICAgICAgICAge3R5cGU6ICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0J31cbiAgICAgICAgKVxuICAgICAgKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGltcG9ydFNjcmlwdHModXJsKTtcbiAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwodXJsKTtcbiAgICAgIGRlbGV0ZSBzZWxmLnRyb2lrYURlZmluZTtcbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9XG5cbiAgICAvLyBIYW5kbGVyIGZvciBhbGwgbWVzc2FnZXMgd2l0aGluIHRoZSB3b3JrZXJcbiAgICBzZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyIHJlZiA9IGUuZGF0YTtcbiAgICAgIHZhciBtZXNzYWdlSWQgPSByZWYubWVzc2FnZUlkO1xuICAgICAgdmFyIGFjdGlvbiA9IHJlZi5hY3Rpb247XG4gICAgICB2YXIgZGF0YSA9IHJlZi5kYXRhO1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gTW9kdWxlIHJlZ2lzdHJhdGlvblxuICAgICAgICBpZiAoYWN0aW9uID09PSAncmVnaXN0ZXJNb2R1bGUnKSB7XG4gICAgICAgICAgcmVnaXN0ZXJNb2R1bGUoZGF0YSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlSWQ6IG1lc3NhZ2VJZCxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogcmVzdWx0Lm1lc3NhZ2VcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZUlkOiBtZXNzYWdlSWQsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICByZXN1bHQ6IHtpc0NhbGxhYmxlOiB0eXBlb2YgcmVzdWx0ID09PSAnZnVuY3Rpb24nfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJbnZvY2F0aW9uXG4gICAgICAgIGlmIChhY3Rpb24gPT09ICdjYWxsTW9kdWxlJykge1xuICAgICAgICAgIGNhbGxNb2R1bGUoZGF0YSwgZnVuY3Rpb24gKHJlc3VsdCwgdHJhbnNmZXJhYmxlcykge1xuICAgICAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlSWQ6IG1lc3NhZ2VJZCxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogcmVzdWx0Lm1lc3NhZ2VcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZUlkOiBtZXNzYWdlSWQsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdFxuICAgICAgICAgICAgICB9LCB0cmFuc2ZlcmFibGVzIHx8IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgICBtZXNzYWdlSWQ6IG1lc3NhZ2VJZCxcbiAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICBlcnJvcjogZXJyLnN0YWNrXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZhbGxiYWNrIGZvciBgZGVmaW5lV29ya2VyTW9kdWxlYCB0aGF0IGJlaGF2ZXMgaWRlbnRpY2FsbHkgYnV0IHJ1bnMgaW4gdGhlIG1haW5cbiAgICogdGhyZWFkLCBmb3Igd2hlbiB0aGUgZXhlY3V0aW9uIGVudmlyb25tZW50IGRvZXNuJ3Qgc3VwcG9ydCB3ZWIgd29ya2VycyBvciB0aGV5XG4gICAqIGFyZSBkaXNhbGxvd2VkIGR1ZSB0byBlLmcuIENTUCBzZWN1cml0eSByZXN0cmljdGlvbnMuXG4gICAqL1xuICBmdW5jdGlvbiBkZWZpbmVNYWluVGhyZWFkTW9kdWxlKG9wdGlvbnMpIHtcbiAgICB2YXIgbW9kdWxlRnVuYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MgPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgIHdoaWxlICggbGVuLS0gKSBhcmdzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuIF07XG5cbiAgICAgIHJldHVybiBtb2R1bGVGdW5jLl9nZXRJbml0UmVzdWx0KCkudGhlbihmdW5jdGlvbiAoaW5pdFJlc3VsdCkge1xuICAgICAgICBpZiAodHlwZW9mIGluaXRSZXN1bHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICByZXR1cm4gaW5pdFJlc3VsdC5hcHBseSh2b2lkIDAsIGFyZ3MpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdXb3JrZXIgbW9kdWxlIGZ1bmN0aW9uIHdhcyBjYWxsZWQgYnV0IGBpbml0YCBkaWQgbm90IHJldHVybiBhIGNhbGxhYmxlIGZ1bmN0aW9uJylcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9O1xuICAgIG1vZHVsZUZ1bmMuX2dldEluaXRSZXN1bHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIC8vIFdlIGNhbiBpZ25vcmUgZ2V0VHJhbnNmZXJhYmxlcyBpbiBtYWluIHRocmVhZC4gVE9ETyB3b3JrZXJJZD9cbiAgICAgIHZhciBkZXBlbmRlbmNpZXMgPSBvcHRpb25zLmRlcGVuZGVuY2llcztcbiAgICAgIHZhciBpbml0ID0gb3B0aW9ucy5pbml0O1xuXG4gICAgICAvLyBSZXNvbHZlIGRlcGVuZGVuY2llc1xuICAgICAgZGVwZW5kZW5jaWVzID0gQXJyYXkuaXNBcnJheShkZXBlbmRlbmNpZXMpID8gZGVwZW5kZW5jaWVzLm1hcChmdW5jdGlvbiAoZGVwKSB7IHJldHVybiBkZXAgJiYgZGVwLl9nZXRJbml0UmVzdWx0ID8gZGVwLl9nZXRJbml0UmVzdWx0KCkgOiBkZXA7IH1cbiAgICAgICkgOiBbXTtcblxuICAgICAgLy8gSW52b2tlIGluaXQgd2l0aCB0aGUgcmVzb2x2ZWQgZGVwZW5kZW5jaWVzXG4gICAgICB2YXIgaW5pdFByb21pc2UgPSBQcm9taXNlLmFsbChkZXBlbmRlbmNpZXMpLnRoZW4oZnVuY3Rpb24gKGRlcHMpIHtcbiAgICAgICAgcmV0dXJuIGluaXQuYXBwbHkobnVsbCwgZGVwcylcbiAgICAgIH0pO1xuXG4gICAgICAvLyBDYWNoZSB0aGUgcmVzb2x2ZWQgcHJvbWlzZSBmb3Igc3Vic2VxdWVudCBjYWxsc1xuICAgICAgbW9kdWxlRnVuYy5fZ2V0SW5pdFJlc3VsdCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGluaXRQcm9taXNlOyB9O1xuXG4gICAgICByZXR1cm4gaW5pdFByb21pc2VcbiAgICB9O1xuICAgIHJldHVybiBtb2R1bGVGdW5jXG4gIH1cblxuICB2YXIgc3VwcG9ydHNXb3JrZXJzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdXBwb3J0ZWQgPSBmYWxzZTtcblxuICAgIC8vIE9ubHkgYXR0ZW1wdCB3b3JrZXIgaW5pdGlhbGl6YXRpb24gaW4gYnJvd3NlcnM7IGVsc2V3aGVyZSBpdCB3b3VsZCBqdXN0IGJlXG4gICAgLy8gbm9pc2UgZS5nLiBsb2FkaW5nIGludG8gYSBOb2RlIGVudmlyb25tZW50IGZvciBTU1IuXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUT0RPIGFkZGl0aW9uYWwgY2hlY2tzIGZvciB0aGluZ3MgbGlrZSBpbXBvcnRTY3JpcHRzIHdpdGhpbiB0aGUgd29ya2VyP1xuICAgICAgICAvLyAgV291bGQgbmVlZCB0byBiZSBhbiBhc3luYyBjaGVjay5cbiAgICAgICAgdmFyIHdvcmtlciA9IG5ldyBXb3JrZXIoXG4gICAgICAgICAgVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbJyddLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JyB9KSlcbiAgICAgICAgKTtcbiAgICAgICAgd29ya2VyLnRlcm1pbmF0ZSgpO1xuICAgICAgICBzdXBwb3J0ZWQgPSB0cnVlO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICd0ZXN0JykgOyBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIChcIlRyb2lrYSBjcmVhdGVXb3JrZXJNb2R1bGU6IHdlYiB3b3JrZXJzIG5vdCBhbGxvd2VkOyBmYWxsaW5nIGJhY2sgdG8gbWFpbiB0aHJlYWQgZXhlY3V0aW9uLiBDYXVzZTogW1wiICsgKGVyci5tZXNzYWdlKSArIFwiXVwiKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDYWNoZWQgcmVzdWx0XG4gICAgc3VwcG9ydHNXb3JrZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gc3VwcG9ydGVkOyB9O1xuICAgIHJldHVybiBzdXBwb3J0ZWRcbiAgfTtcblxuICB2YXIgX3dvcmtlck1vZHVsZUlkID0gMDtcbiAgdmFyIF9tZXNzYWdlSWQgPSAwO1xuICB2YXIgX2FsbG93SW5pdEFzU3RyaW5nID0gZmFsc2U7XG4gIHZhciB3b3JrZXJzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgdmFyIHJlZ2lzdGVyZWRNb2R1bGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTsgLy93b3JrZXJJZCAtPiBTZXQ8dW5yZWdpc3RlckZuPlxuICB2YXIgb3BlblJlcXVlc3RzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuXG4gIC8qKlxuICAgKiBEZWZpbmUgYSBtb2R1bGUgb2YgY29kZSB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgd2l0aCBhIHdlYiB3b3JrZXIuIFRoaXMgcHJvdmlkZXMgYSBzaW1wbGVcbiAgICogaW50ZXJmYWNlIGZvciBtb3ZpbmcgY2h1bmtzIG9mIGxvZ2ljIG9mZiB0aGUgbWFpbiB0aHJlYWQsIGFuZCBtYW5hZ2luZyB0aGVpciBkZXBlbmRlbmNpZXNcbiAgICogYW1vbmcgb25lIGFub3RoZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9wdGlvbnMuaW5pdFxuICAgKiBAcGFyYW0ge2FycmF5fSBbb3B0aW9ucy5kZXBlbmRlbmNpZXNdXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvcHRpb25zLmdldFRyYW5zZmVyYWJsZXNdXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5uYW1lXVxuICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMud29ya2VySWRdXG4gICAqIEByZXR1cm4ge2Z1bmN0aW9uKC4uLlsqXSk6IHt0aGVufX1cbiAgICovXG4gIGZ1bmN0aW9uIGRlZmluZVdvcmtlck1vZHVsZShvcHRpb25zKSB7XG4gICAgaWYgKCghb3B0aW9ucyB8fCB0eXBlb2Ygb3B0aW9ucy5pbml0ICE9PSAnZnVuY3Rpb24nKSAmJiAhX2FsbG93SW5pdEFzU3RyaW5nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlcXVpcmVzIGBvcHRpb25zLmluaXRgIGZ1bmN0aW9uJylcbiAgICB9XG4gICAgdmFyIGRlcGVuZGVuY2llcyA9IG9wdGlvbnMuZGVwZW5kZW5jaWVzO1xuICAgIHZhciBpbml0ID0gb3B0aW9ucy5pbml0O1xuICAgIHZhciBnZXRUcmFuc2ZlcmFibGVzID0gb3B0aW9ucy5nZXRUcmFuc2ZlcmFibGVzO1xuICAgIHZhciB3b3JrZXJJZCA9IG9wdGlvbnMud29ya2VySWQ7XG5cbiAgICBpZiAoIXN1cHBvcnRzV29ya2VycygpKSB7XG4gICAgICByZXR1cm4gZGVmaW5lTWFpblRocmVhZE1vZHVsZShvcHRpb25zKVxuICAgIH1cblxuICAgIGlmICh3b3JrZXJJZCA9PSBudWxsKSB7XG4gICAgICB3b3JrZXJJZCA9ICcjZGVmYXVsdCc7XG4gICAgfVxuICAgIHZhciBpZCA9IFwid29ya2VyTW9kdWxlXCIgKyAoKytfd29ya2VyTW9kdWxlSWQpO1xuICAgIHZhciBuYW1lID0gb3B0aW9ucy5uYW1lIHx8IGlkO1xuICAgIHZhciByZWdpc3RyYXRpb25Qcm9taXNlID0gbnVsbDtcblxuICAgIGRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcyAmJiBkZXBlbmRlbmNpZXMubWFwKGZ1bmN0aW9uIChkZXApIHtcbiAgICAgIC8vIFdyYXAgcmF3IGZ1bmN0aW9ucyBhcyB3b3JrZXIgbW9kdWxlcyB3aXRoIG5vIGRlcGVuZGVuY2llc1xuICAgICAgaWYgKHR5cGVvZiBkZXAgPT09ICdmdW5jdGlvbicgJiYgIWRlcC53b3JrZXJNb2R1bGVEYXRhKSB7XG4gICAgICAgIF9hbGxvd0luaXRBc1N0cmluZyA9IHRydWU7XG4gICAgICAgIGRlcCA9IGRlZmluZVdvcmtlck1vZHVsZSh7XG4gICAgICAgICAgd29ya2VySWQ6IHdvcmtlcklkLFxuICAgICAgICAgIG5hbWU6IChcIjxcIiArIG5hbWUgKyBcIj4gZnVuY3Rpb24gZGVwZW5kZW5jeTogXCIgKyAoZGVwLm5hbWUpKSxcbiAgICAgICAgICBpbml0OiAoXCJmdW5jdGlvbigpe3JldHVybiAoXFxuXCIgKyAoc3RyaW5naWZ5RnVuY3Rpb24oZGVwKSkgKyBcIlxcbil9XCIpXG4gICAgICAgIH0pO1xuICAgICAgICBfYWxsb3dJbml0QXNTdHJpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIEdyYWIgcG9zdGFibGUgZGF0YSBmb3Igd29ya2VyIG1vZHVsZXNcbiAgICAgIGlmIChkZXAgJiYgZGVwLndvcmtlck1vZHVsZURhdGEpIHtcbiAgICAgICAgZGVwID0gZGVwLndvcmtlck1vZHVsZURhdGE7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVwXG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBtb2R1bGVGdW5jKCkge1xuICAgICAgdmFyIGFyZ3MgPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgIHdoaWxlICggbGVuLS0gKSBhcmdzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuIF07XG5cbiAgICAgIC8vIFJlZ2lzdGVyIHRoaXMgbW9kdWxlIGlmIG5lZWRlZFxuICAgICAgaWYgKCFyZWdpc3RyYXRpb25Qcm9taXNlKSB7XG4gICAgICAgIHJlZ2lzdHJhdGlvblByb21pc2UgPSBjYWxsV29ya2VyKHdvcmtlcklkLCdyZWdpc3Rlck1vZHVsZScsIG1vZHVsZUZ1bmMud29ya2VyTW9kdWxlRGF0YSk7XG4gICAgICAgIHZhciB1bnJlZ2lzdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJlZ2lzdHJhdGlvblByb21pc2UgPSBudWxsO1xuICAgICAgICAgIHJlZ2lzdGVyZWRNb2R1bGVzW3dvcmtlcklkXS5kZWxldGUodW5yZWdpc3Rlcik7XG4gICAgICAgIH1cbiAgICAgICAgOyhyZWdpc3RlcmVkTW9kdWxlc1t3b3JrZXJJZF0gfHwgKHJlZ2lzdGVyZWRNb2R1bGVzW3dvcmtlcklkXSA9IG5ldyBTZXQoKSkpLmFkZCh1bnJlZ2lzdGVyKTtcbiAgICAgIH1cblxuICAgICAgLy8gSW52b2tlIHRoZSBtb2R1bGUsIHJldHVybmluZyBhIHByb21pc2VcbiAgICAgIHJldHVybiByZWdpc3RyYXRpb25Qcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlZikge1xuICAgICAgICB2YXIgaXNDYWxsYWJsZSA9IHJlZi5pc0NhbGxhYmxlO1xuXG4gICAgICAgIGlmIChpc0NhbGxhYmxlKSB7XG4gICAgICAgICAgcmV0dXJuIGNhbGxXb3JrZXIod29ya2VySWQsJ2NhbGxNb2R1bGUnLCB7aWQ6IGlkLCBhcmdzOiBhcmdzfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1dvcmtlciBtb2R1bGUgZnVuY3Rpb24gd2FzIGNhbGxlZCBidXQgYGluaXRgIGRpZCBub3QgcmV0dXJuIGEgY2FsbGFibGUgZnVuY3Rpb24nKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICBtb2R1bGVGdW5jLndvcmtlck1vZHVsZURhdGEgPSB7XG4gICAgICBpc1dvcmtlck1vZHVsZTogdHJ1ZSxcbiAgICAgIGlkOiBpZCxcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBkZXBlbmRlbmNpZXM6IGRlcGVuZGVuY2llcyxcbiAgICAgIGluaXQ6IHN0cmluZ2lmeUZ1bmN0aW9uKGluaXQpLFxuICAgICAgZ2V0VHJhbnNmZXJhYmxlczogZ2V0VHJhbnNmZXJhYmxlcyAmJiBzdHJpbmdpZnlGdW5jdGlvbihnZXRUcmFuc2ZlcmFibGVzKVxuICAgIH07XG4gICAgcmV0dXJuIG1vZHVsZUZ1bmNcbiAgfVxuXG4gIC8qKlxuICAgKiBUZXJtaW5hdGUgYW4gYWN0aXZlIFdvcmtlciBieSBhIHdvcmtlcklkIHRoYXQgd2FzIHBhc3NlZCB0byBkZWZpbmVXb3JrZXJNb2R1bGUuXG4gICAqIFRoaXMgb25seSB0ZXJtaW5hdGVzIHRoZSBXb3JrZXIgaXRzZWxmOyB0aGUgd29ya2VyIG1vZHVsZSB3aWxsIHJlbWFpbiBhdmFpbGFibGVcbiAgICogYW5kIGlmIHlvdSBjYWxsIGl0IGFnYWluIGl0cyBXb3JrZXIgd2lsbCBiZSByZXNwYXduZWQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3b3JrZXJJZFxuICAgKi9cbiAgZnVuY3Rpb24gdGVybWluYXRlV29ya2VyKHdvcmtlcklkKSB7XG4gICAgLy8gVW5yZWdpc3RlciBhbGwgbW9kdWxlcyB0aGF0IHdlcmUgcmVnaXN0ZXJlZCBpbiB0aGF0IHdvcmtlclxuICAgIGlmIChyZWdpc3RlcmVkTW9kdWxlc1t3b3JrZXJJZF0pIHtcbiAgICAgIHJlZ2lzdGVyZWRNb2R1bGVzW3dvcmtlcklkXS5mb3JFYWNoKGZ1bmN0aW9uICh1bnJlZ2lzdGVyKSB7XG4gICAgICAgIHVucmVnaXN0ZXIoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBUZXJtaW5hdGUgdGhlIFdvcmtlciBvYmplY3RcbiAgICBpZiAod29ya2Vyc1t3b3JrZXJJZF0pIHtcbiAgICAgIHdvcmtlcnNbd29ya2VySWRdLnRlcm1pbmF0ZSgpO1xuICAgICAgZGVsZXRlIHdvcmtlcnNbd29ya2VySWRdO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdHJpbmdpZmllcyBhIGZ1bmN0aW9uIGludG8gYSBmb3JtIHRoYXQgY2FuIGJlIGRlc2VyaWFsaXplZCBpbiB0aGUgd29ya2VyXG4gICAqIEBwYXJhbSBmblxuICAgKi9cbiAgZnVuY3Rpb24gc3RyaW5naWZ5RnVuY3Rpb24oZm4pIHtcbiAgICB2YXIgc3RyID0gZm4udG9TdHJpbmcoKTtcbiAgICAvLyBJZiBpdCB3YXMgZGVmaW5lZCBpbiBvYmplY3QgbWV0aG9kL3Byb3BlcnR5IGZvcm1hdCwgaXQgbmVlZHMgdG8gYmUgbW9kaWZpZWRcbiAgICBpZiAoIS9eZnVuY3Rpb24vLnRlc3Qoc3RyKSAmJiAvXlxcdytcXHMqXFwoLy50ZXN0KHN0cikpIHtcbiAgICAgIHN0ciA9ICdmdW5jdGlvbiAnICsgc3RyO1xuICAgIH1cbiAgICByZXR1cm4gc3RyXG4gIH1cblxuXG4gIGZ1bmN0aW9uIGdldFdvcmtlcih3b3JrZXJJZCkge1xuICAgIHZhciB3b3JrZXIgPSB3b3JrZXJzW3dvcmtlcklkXTtcbiAgICBpZiAoIXdvcmtlcikge1xuICAgICAgLy8gQm9vdHN0cmFwIHRoZSB3b3JrZXIncyBjb250ZW50XG4gICAgICB2YXIgYm9vdHN0cmFwID0gc3RyaW5naWZ5RnVuY3Rpb24od29ya2VyQm9vdHN0cmFwKTtcblxuICAgICAgLy8gQ3JlYXRlIHRoZSB3b3JrZXIgZnJvbSB0aGUgYm9vdHN0cmFwIGZ1bmN0aW9uIGNvbnRlbnRcbiAgICAgIHdvcmtlciA9IHdvcmtlcnNbd29ya2VySWRdID0gbmV3IFdvcmtlcihcbiAgICAgICAgVVJMLmNyZWF0ZU9iamVjdFVSTChcbiAgICAgICAgICBuZXcgQmxvYihcbiAgICAgICAgICAgIFsoXCIvKiogV29ya2VyIE1vZHVsZSBCb290c3RyYXA6IFwiICsgKHdvcmtlcklkLnJlcGxhY2UoL1xcKi9nLCAnJykpICsgXCIgKiovXFxuXFxuOyhcIiArIGJvb3RzdHJhcCArIFwiKSgpXCIpXSxcbiAgICAgICAgICAgIHt0eXBlOiAnYXBwbGljYXRpb24vamF2YXNjcmlwdCd9XG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApO1xuXG4gICAgICAvLyBTaW5nbGUgaGFuZGxlciBmb3IgcmVzcG9uc2UgbWVzc2FnZXMgZnJvbSB0aGUgd29ya2VyXG4gICAgICB3b3JrZXIub25tZXNzYWdlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHJlc3BvbnNlID0gZS5kYXRhO1xuICAgICAgICB2YXIgbXNnSWQgPSByZXNwb25zZS5tZXNzYWdlSWQ7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IG9wZW5SZXF1ZXN0c1ttc2dJZF07XG4gICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1dvcmtlck1vZHVsZSByZXNwb25zZSB3aXRoIGVtcHR5IG9yIHVua25vd24gbWVzc2FnZUlkJylcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgb3BlblJlcXVlc3RzW21zZ0lkXTtcbiAgICAgICAgY2FsbGJhY2socmVzcG9uc2UpO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHdvcmtlclxuICB9XG5cbiAgLy8gSXNzdWUgYSBjYWxsIHRvIHRoZSB3b3JrZXIgd2l0aCBhIGNhbGxiYWNrIHRvIGhhbmRsZSB0aGUgcmVzcG9uc2VcbiAgZnVuY3Rpb24gY2FsbFdvcmtlcih3b3JrZXJJZCwgYWN0aW9uLCBkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciBtZXNzYWdlSWQgPSArK19tZXNzYWdlSWQ7XG4gICAgICBvcGVuUmVxdWVzdHNbbWVzc2FnZUlkXSA9IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UucmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKChcIkVycm9yIGluIHdvcmtlciBcIiArIGFjdGlvbiArIFwiIGNhbGw6IFwiICsgKHJlc3BvbnNlLmVycm9yKSkpKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGdldFdvcmtlcih3b3JrZXJJZCkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICBtZXNzYWdlSWQ6IG1lc3NhZ2VJZCxcbiAgICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICAgIGRhdGE6IGRhdGFcbiAgICAgIH0pO1xuICAgIH0pXG4gIH1cblxuICBleHBvcnRzLmRlZmluZVdvcmtlck1vZHVsZSA9IGRlZmluZVdvcmtlck1vZHVsZTtcbiAgZXhwb3J0cy5zdHJpbmdpZnlGdW5jdGlvbiA9IHN0cmluZ2lmeUZ1bmN0aW9uO1xuICBleHBvcnRzLnRlcm1pbmF0ZVdvcmtlciA9IHRlcm1pbmF0ZVdvcmtlcjtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG59KSkpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/troika-worker-utils/dist/troika-worker-utils.umd.js\n");

/***/ })

};
;