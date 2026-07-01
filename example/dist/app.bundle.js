var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target2, all) => {
  for (var name in all)
    __defProp(target2, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from2, except, desc) => {
  if (from2 && typeof from2 === "object" || typeof from2 === "function") {
    for (let key of __getOwnPropNames(from2))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target2) => (target2 = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target2, "default", { value: mod, enumerable: true }) : target2,
  mod
));

// node_modules/.deno/ms@2.1.3/node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/.deno/ms@2.1.3/node_modules/ms/index.js"(exports, module) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse2(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse2(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/.deno/debug@4.4.3/node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/.deno/debug@4.4.3/node_modules/debug/src/common.js"(exports, module) {
    function setup2(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash2 = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash2 = (hash2 << 5) - hash2 + namespace.charCodeAt(i);
          hash2 |= 0;
        }
        return createDebug.colors[Math.abs(hash2) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug8(...args) {
          if (!debug8.enabled) {
            return;
          }
          const self2 = debug8;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self2, args);
          const logFn = self2.log || createDebug.log;
          logFn.apply(self2, args);
        }
        debug8.namespace = namespace;
        debug8.useColors = createDebug.useColors();
        debug8.color = createDebug.selectColor(namespace);
        debug8.extend = extend;
        debug8.destroy = createDebug.destroy;
        Object.defineProperty(debug8, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug8);
        }
        return debug8;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
        for (const ns of split) {
          if (ns[0] === "-") {
            createDebug.skips.push(ns.slice(1));
          } else {
            createDebug.names.push(ns);
          }
        }
      }
      function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while (searchIndex < search.length) {
          if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
            if (template[templateIndex] === "*") {
              starIndex = templateIndex;
              matchIndex = searchIndex;
              templateIndex++;
            } else {
              searchIndex++;
              templateIndex++;
            }
          } else if (starIndex !== -1) {
            templateIndex = starIndex + 1;
            matchIndex++;
            searchIndex = matchIndex;
          } else {
            return false;
          }
        }
        while (templateIndex < template.length && template[templateIndex] === "*") {
          templateIndex++;
        }
        return templateIndex === template.length;
      }
      function disable() {
        const namespaces = [
          ...createDebug.names,
          ...createDebug.skips.map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        for (const skip of createDebug.skips) {
          if (matchesTemplate(name, skip)) {
            return false;
          }
        }
        for (const ns of createDebug.names) {
          if (matchesTemplate(name, ns)) {
            return true;
          }
        }
        return false;
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module.exports = setup2;
  }
});

// node_modules/.deno/debug@4.4.3/node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/.deno/debug@4.4.3/node_modules/debug/src/browser.js"(exports, module) {
    exports.formatArgs = formatArgs;
    exports.save = save2;
    exports.load = load4;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save2(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load4() {
      let r;
      try {
        r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = require_common()(exports);
    var { formatters } = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/.deno/eventemitter3@5.0.4/node_modules/eventemitter3/index.js
var require_eventemitter3 = __commonJS({
  "node_modules/.deno/eventemitter3@5.0.4/node_modules/eventemitter3/index.js"(exports, module) {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    var prefix = "~";
    function Events() {
    }
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__) prefix = false;
    }
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
      else emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0) emitter._events = new Events();
      else delete emitter._events[evt];
    }
    function EventEmitter2() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter2.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0) return names;
      for (name in events = this._events) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter2.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers) return [];
      if (handlers.fn) return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    };
    EventEmitter2.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners) return 0;
      if (listeners.fn) return 1;
      return listeners.length;
    };
    EventEmitter2.prototype.emit = function emit2(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length, j;
        for (i = 0; i < length; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);
              break;
            default:
              if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
                args[j - 1] = arguments[j];
              }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter2.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };
    EventEmitter2.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };
    EventEmitter2.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
    EventEmitter2.prefixed = prefix;
    EventEmitter2.EventEmitter = EventEmitter2;
    if ("undefined" !== typeof module) {
      module.exports = EventEmitter2;
    }
  }
});

// node_modules/.deno/xstate@5.32.2/node_modules/xstate/dist/xstate-dev.cjs.js
var require_xstate_dev_cjs = __commonJS({
  "node_modules/.deno/xstate@5.32.2/node_modules/xstate/dist/xstate-dev.cjs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getGlobal() {
      if (typeof globalThis !== "undefined") {
        return globalThis;
      }
      if (typeof self !== "undefined") {
        return self;
      }
      if (typeof window !== "undefined") {
        return window;
      }
      if (typeof global !== "undefined") {
        return global;
      }
    }
    function getDevTools() {
      const w = getGlobal();
      if (w.__xstate__) {
        return w.__xstate__;
      }
      return void 0;
    }
    function registerService(service) {
      if (typeof window === "undefined") {
        return;
      }
      const devTools = getDevTools();
      if (devTools) {
        devTools.register(service);
      }
    }
    var devToolsAdapter = (service) => {
      if (typeof window === "undefined") {
        return;
      }
      const devTools = getDevTools();
      if (devTools) {
        devTools.register(service);
      }
    };
    exports.devToolsAdapter = devToolsAdapter;
    exports.getGlobal = getGlobal;
    exports.registerService = registerService;
  }
});

// node_modules/.deno/xstate@5.32.2/node_modules/xstate/dist/raise-c445379d.cjs.js
var require_raise_c445379d_cjs = __commonJS({
  "node_modules/.deno/xstate@5.32.2/node_modules/xstate/dist/raise-c445379d.cjs.js"(exports) {
    "use strict";
    var dist_xstateDev = require_xstate_dev_cjs();
    var Mailbox = class {
      constructor(_process) {
        this._process = _process;
        this._active = false;
        this._current = null;
        this._last = null;
      }
      start() {
        this._active = true;
        this.flush();
      }
      clear() {
        if (this._current) {
          this._current.next = null;
          this._last = this._current;
        }
      }
      enqueue(event) {
        const enqueued = {
          value: event,
          next: null
        };
        if (this._current) {
          this._last.next = enqueued;
          this._last = enqueued;
          return;
        }
        this._current = enqueued;
        this._last = enqueued;
        if (this._active) {
          this.flush();
        }
      }
      flush() {
        while (this._current) {
          const consumed = this._current;
          this._process(consumed.value);
          this._current = consumed.next;
        }
        this._last = null;
      }
    };
    var STATE_DELIMITER = ".";
    var TARGETLESS_KEY = "";
    var NULL_EVENT = "";
    var STATE_IDENTIFIER = "#";
    var WILDCARD = "*";
    var XSTATE_INIT = "xstate.init";
    var XSTATE_ERROR = "xstate.error";
    var XSTATE_STOP = "xstate.stop";
    function createAfterEvent(delayRef, id) {
      return {
        type: `xstate.after.${delayRef}.${id}`
      };
    }
    function createDoneStateEvent(id, output) {
      return {
        type: `xstate.done.state.${id}`,
        output
      };
    }
    function createDoneActorEvent(invokeId, output) {
      return {
        type: `xstate.done.actor.${invokeId}`,
        output,
        actorId: invokeId
      };
    }
    function createErrorActorEvent(id, error) {
      return {
        type: `xstate.error.actor.${id}`,
        error,
        actorId: id
      };
    }
    function createInitEvent(input) {
      return {
        type: XSTATE_INIT,
        input
      };
    }
    function reportUnhandledError(err) {
      setTimeout(() => {
        throw err;
      });
    }
    var symbolObservable = (() => typeof Symbol === "function" && Symbol.observable || "@@observable")();
    function matchesState2(parentStateId, childStateId) {
      const parentStateValue = toStateValue(parentStateId);
      const childStateValue = toStateValue(childStateId);
      if (typeof childStateValue === "string") {
        if (typeof parentStateValue === "string") {
          return childStateValue === parentStateValue;
        }
        return false;
      }
      if (typeof parentStateValue === "string") {
        return parentStateValue in childStateValue;
      }
      return Object.keys(parentStateValue).every((key) => {
        if (!(key in childStateValue)) {
          return false;
        }
        return matchesState2(parentStateValue[key], childStateValue[key]);
      });
    }
    function toStatePath(stateId) {
      if (isArray(stateId)) {
        return stateId;
      }
      const result = [];
      let segment = "";
      for (let i = 0; i < stateId.length; i++) {
        const char = stateId.charCodeAt(i);
        switch (char) {
          // \
          case 92:
            segment += stateId[i + 1];
            i++;
            continue;
          // .
          case 46:
            result.push(segment);
            segment = "";
            continue;
        }
        segment += stateId[i];
      }
      result.push(segment);
      return result;
    }
    function toStateValue(stateValue) {
      if (isMachineSnapshot2(stateValue)) {
        return stateValue.value;
      }
      if (typeof stateValue !== "string") {
        return stateValue;
      }
      const statePath = toStatePath(stateValue);
      return pathToStateValue2(statePath);
    }
    function pathToStateValue2(statePath) {
      if (statePath.length === 1) {
        return statePath[0];
      }
      const value = {};
      let marker = value;
      for (let i = 0; i < statePath.length - 1; i++) {
        if (i === statePath.length - 2) {
          marker[statePath[i]] = statePath[i + 1];
        } else {
          const previous = marker;
          marker = {};
          previous[statePath[i]] = marker;
        }
      }
      return value;
    }
    function mapValues(collection, iteratee) {
      const result = {};
      const collectionKeys = Object.keys(collection);
      for (let i = 0; i < collectionKeys.length; i++) {
        const key = collectionKeys[i];
        result[key] = iteratee(collection[key], key, collection, i);
      }
      return result;
    }
    function toArrayStrict(value) {
      if (isArray(value)) {
        return value;
      }
      return [value];
    }
    function toArray(value) {
      if (value === void 0) {
        return [];
      }
      return toArrayStrict(value);
    }
    function resolveOutput(mapper, context, event, self2) {
      if (typeof mapper === "function") {
        return mapper({
          context,
          event,
          self: self2
        });
      }
      return mapper;
    }
    function isArray(value) {
      return Array.isArray(value);
    }
    function isErrorActorEvent(event) {
      return event.type.startsWith("xstate.error.actor");
    }
    function toTransitionConfigArray(configLike) {
      return toArrayStrict(configLike).map((transitionLike) => {
        if (typeof transitionLike === "undefined" || typeof transitionLike === "string") {
          return {
            target: transitionLike
          };
        }
        return transitionLike;
      });
    }
    function normalizeTarget(target2) {
      if (target2 === void 0 || target2 === TARGETLESS_KEY) {
        return void 0;
      }
      return toArray(target2);
    }
    function toObserver2(nextHandler, errorHandler, completionHandler) {
      const isObserver = typeof nextHandler === "object";
      const self2 = isObserver ? nextHandler : void 0;
      return {
        next: (isObserver ? nextHandler.next : nextHandler)?.bind(self2),
        error: (isObserver ? nextHandler.error : errorHandler)?.bind(self2),
        complete: (isObserver ? nextHandler.complete : completionHandler)?.bind(self2)
      };
    }
    function createInvokeId(stateNodeId, index) {
      return `${index}.${stateNodeId}`;
    }
    function resolveReferencedActor(machine, src2) {
      const match = src2.match(/^xstate\.invoke\.(\d+)\.(.*)/);
      if (!match) {
        return machine.implementations.actors[src2];
      }
      const [, indexStr, nodeId] = match;
      const node = machine.getStateNodeById(nodeId);
      const invokeConfig = node.config.invoke;
      return (Array.isArray(invokeConfig) ? invokeConfig[indexStr] : invokeConfig).src;
    }
    function getAllOwnEventDescriptors(snapshot) {
      return [.../* @__PURE__ */ new Set([...snapshot._nodes.flatMap((sn) => sn.ownEvents)])];
    }
    function matchesEventDescriptor(eventType, descriptor) {
      if (descriptor === eventType) {
        return true;
      }
      if (descriptor === WILDCARD) {
        return true;
      }
      if (!descriptor.endsWith(".*")) {
        return false;
      }
      const partialEventTokens = descriptor.split(".");
      const eventTokens = eventType.split(".");
      for (let tokenIndex = 0; tokenIndex < partialEventTokens.length; tokenIndex++) {
        const partialEventToken = partialEventTokens[tokenIndex];
        const eventToken = eventTokens[tokenIndex];
        if (partialEventToken === "*") {
          const isLastToken = tokenIndex === partialEventTokens.length - 1;
          return isLastToken;
        }
        if (partialEventToken !== eventToken) {
          return false;
        }
      }
      return true;
    }
    function createScheduledEventId(actorRef, id) {
      return `${actorRef.sessionId}.${id}`;
    }
    var idCounter = 0;
    function createSystem(rootActor, options) {
      const children = /* @__PURE__ */ new Map();
      const keyedActors = /* @__PURE__ */ new Map();
      const reverseKeyedActors = /* @__PURE__ */ new WeakMap();
      const inspectionObservers = /* @__PURE__ */ new Set();
      const timerMap = {};
      const {
        clock,
        logger
      } = options;
      const scheduler = {
        schedule: (source, target2, event, delay, id = Math.random().toString(36).slice(2)) => {
          const scheduledEvent = {
            source,
            target: target2,
            event,
            delay,
            id,
            startedAt: Date.now()
          };
          const scheduledEventId = createScheduledEventId(source, id);
          system._snapshot._scheduledEvents[scheduledEventId] = scheduledEvent;
          const timeout = clock.setTimeout(() => {
            delete timerMap[scheduledEventId];
            delete system._snapshot._scheduledEvents[scheduledEventId];
            system._relay(source, target2, event);
          }, delay);
          timerMap[scheduledEventId] = timeout;
        },
        cancel: (source, id) => {
          const scheduledEventId = createScheduledEventId(source, id);
          const timeout = timerMap[scheduledEventId];
          delete timerMap[scheduledEventId];
          delete system._snapshot._scheduledEvents[scheduledEventId];
          if (timeout !== void 0) {
            clock.clearTimeout(timeout);
          }
        },
        cancelAll: (actorRef) => {
          for (const scheduledEventId in system._snapshot._scheduledEvents) {
            const scheduledEvent = system._snapshot._scheduledEvents[scheduledEventId];
            if (scheduledEvent.source === actorRef) {
              scheduler.cancel(actorRef, scheduledEvent.id);
            }
          }
        }
      };
      const sendInspectionEvent = (event) => {
        if (!inspectionObservers.size) {
          return;
        }
        const resolvedInspectionEvent = {
          ...event,
          rootId: rootActor.sessionId
        };
        inspectionObservers.forEach((observer) => observer.next?.(resolvedInspectionEvent));
      };
      const system = {
        _snapshot: {
          _scheduledEvents: (options?.snapshot && options.snapshot.scheduler) ?? {}
        },
        _bookId: () => `x:${idCounter++}`,
        _register: (sessionId2, actorRef) => {
          children.set(sessionId2, actorRef);
          return sessionId2;
        },
        _unregister: (actorRef) => {
          children.delete(actorRef.sessionId);
          const systemId = reverseKeyedActors.get(actorRef);
          if (systemId !== void 0) {
            keyedActors.delete(systemId);
            reverseKeyedActors.delete(actorRef);
          }
        },
        get: (systemId) => {
          return keyedActors.get(systemId);
        },
        getAll: () => {
          return Object.fromEntries(keyedActors.entries());
        },
        _set: (systemId, actorRef) => {
          const existing = keyedActors.get(systemId);
          if (existing && existing !== actorRef) {
            throw new Error(`Actor with system ID '${systemId}' already exists.`);
          }
          keyedActors.set(systemId, actorRef);
          reverseKeyedActors.set(actorRef, systemId);
        },
        inspect: (observerOrFn) => {
          const observer = toObserver2(observerOrFn);
          inspectionObservers.add(observer);
          return {
            unsubscribe() {
              inspectionObservers.delete(observer);
            }
          };
        },
        _sendInspectionEvent: sendInspectionEvent,
        _relay: (source, target2, event) => {
          system._sendInspectionEvent({
            type: "@xstate.event",
            sourceRef: source,
            actorRef: target2,
            event
          });
          target2._send(event);
        },
        scheduler,
        getSnapshot: () => {
          return {
            _scheduledEvents: {
              ...system._snapshot._scheduledEvents
            }
          };
        },
        start: () => {
          const scheduledEvents = system._snapshot._scheduledEvents;
          system._snapshot._scheduledEvents = {};
          for (const scheduledId in scheduledEvents) {
            const {
              source,
              target: target2,
              event,
              delay,
              id
            } = scheduledEvents[scheduledId];
            scheduler.schedule(source, target2, event, delay, id);
          }
        },
        _clock: clock,
        _logger: logger
      };
      return system;
    }
    var executingCustomAction = false;
    var $$ACTOR_TYPE = 1;
    var ProcessingStatus = /* @__PURE__ */ (function(ProcessingStatus2) {
      ProcessingStatus2[ProcessingStatus2["NotStarted"] = 0] = "NotStarted";
      ProcessingStatus2[ProcessingStatus2["Running"] = 1] = "Running";
      ProcessingStatus2[ProcessingStatus2["Stopped"] = 2] = "Stopped";
      return ProcessingStatus2;
    })({});
    var defaultOptions2 = {
      clock: {
        setTimeout: (fn, ms) => {
          return setTimeout(fn, ms);
        },
        clearTimeout: (id) => {
          return clearTimeout(id);
        }
      },
      logger: console.log.bind(console),
      devTools: false
    };
    var Actor2 = class {
      /**
       * Creates a new actor instance for the given logic with the provided options,
       * if any.
       *
       * @param logic The logic to create an actor from
       * @param options Actor options
       */
      constructor(logic, options) {
        this.logic = logic;
        this._snapshot = void 0;
        this.clock = void 0;
        this.options = void 0;
        this.id = void 0;
        this.mailbox = new Mailbox(this._process.bind(this));
        this.observers = /* @__PURE__ */ new Set();
        this.eventListeners = /* @__PURE__ */ new Map();
        this.logger = void 0;
        this._processingStatus = ProcessingStatus.NotStarted;
        this._parent = void 0;
        this._syncSnapshot = void 0;
        this.ref = void 0;
        this._actorScope = void 0;
        this.systemId = void 0;
        this.sessionId = void 0;
        this.system = void 0;
        this._doneEvent = void 0;
        this.src = void 0;
        this._deferred = [];
        const resolvedOptions = {
          ...defaultOptions2,
          ...options
        };
        const {
          clock,
          logger,
          parent,
          syncSnapshot,
          id,
          systemId,
          inspect
        } = resolvedOptions;
        this.system = parent ? parent.system : createSystem(this, {
          clock,
          logger
        });
        if (inspect && !parent) {
          this.system.inspect(toObserver2(inspect));
        }
        this.sessionId = this.system._bookId();
        this.id = id ?? this.sessionId;
        this.logger = options?.logger ?? this.system._logger;
        this.clock = options?.clock ?? this.system._clock;
        this._parent = parent;
        this._syncSnapshot = syncSnapshot;
        this.options = resolvedOptions;
        this.src = resolvedOptions.src ?? logic;
        this.ref = this;
        this._actorScope = {
          self: this,
          id: this.id,
          sessionId: this.sessionId,
          logger: this.logger,
          defer: (fn) => {
            this._deferred.push(fn);
          },
          system: this.system,
          stopChild: (child) => {
            if (child._parent !== this) {
              throw new Error(`Cannot stop child actor ${child.id} of ${this.id} because it is not a child`);
            }
            child._stop();
          },
          emit: (emittedEvent) => {
            const listeners = this.eventListeners.get(emittedEvent.type);
            const wildcardListener = this.eventListeners.get("*");
            if (!listeners && !wildcardListener) {
              return;
            }
            const allListeners = [...listeners ? listeners.values() : [], ...wildcardListener ? wildcardListener.values() : []];
            for (const handler of allListeners) {
              try {
                handler(emittedEvent);
              } catch (err) {
                reportUnhandledError(err);
              }
            }
          },
          actionExecutor: (action) => {
            const exec = () => {
              this._actorScope.system._sendInspectionEvent({
                type: "@xstate.action",
                actorRef: this,
                action: {
                  type: action.type,
                  params: action.params
                }
              });
              if (!action.exec) {
                return;
              }
              const saveExecutingCustomAction = executingCustomAction;
              try {
                executingCustomAction = true;
                action.exec(action.info, action.params);
              } finally {
                executingCustomAction = saveExecutingCustomAction;
              }
            };
            if (this._processingStatus === ProcessingStatus.Running) {
              exec();
            } else {
              this._deferred.push(exec);
            }
          }
        };
        this.send = this.send.bind(this);
        this.system._sendInspectionEvent({
          type: "@xstate.actor",
          actorRef: this
        });
        if (systemId) {
          this.systemId = systemId;
          this.system._set(systemId, this);
        }
        this._initState(options?.snapshot ?? options?.state);
        if (systemId && this._snapshot.status !== "active") {
          this.system._unregister(this);
        }
      }
      _initState(persistedState) {
        try {
          this._snapshot = persistedState ? this.logic.restoreSnapshot ? this.logic.restoreSnapshot(persistedState, this._actorScope) : persistedState : this.logic.getInitialSnapshot(this._actorScope, this.options?.input);
        } catch (err) {
          this._snapshot = {
            status: "error",
            output: void 0,
            error: err
          };
        }
      }
      update(snapshot, event) {
        this._snapshot = snapshot;
        let deferredFn;
        while (deferredFn = this._deferred.shift()) {
          try {
            deferredFn();
          } catch (err) {
            this._deferred.length = 0;
            this._snapshot = {
              ...snapshot,
              status: "error",
              error: err
            };
          }
        }
        switch (this._snapshot.status) {
          case "active":
            for (const observer of this.observers) {
              try {
                observer.next?.(snapshot);
              } catch (err) {
                reportUnhandledError(err);
              }
            }
            break;
          case "done":
            for (const observer of this.observers) {
              try {
                observer.next?.(snapshot);
              } catch (err) {
                reportUnhandledError(err);
              }
            }
            this._stopProcedure();
            this._complete();
            this._doneEvent = createDoneActorEvent(this.id, this._snapshot.output);
            if (this._parent) {
              this.system._relay(this, this._parent, this._doneEvent);
            }
            break;
          case "error":
            this._error(this._snapshot.error);
            break;
        }
        this.system._sendInspectionEvent({
          type: "@xstate.snapshot",
          actorRef: this,
          event,
          snapshot
        });
      }
      /**
       * Subscribe an observer to an actor’s snapshot values.
       *
       * @remarks
       * The observer will receive the actor’s snapshot value when it is emitted.
       * The observer can be:
       *
       * - A plain function that receives the latest snapshot, or
       * - An observer object whose `.next(snapshot)` method receives the latest
       *   snapshot
       *
       * @example
       *
       * ```ts
       * // Observer as a plain function
       * const subscription = actor.subscribe((snapshot) => {
       *   console.log(snapshot);
       * });
       * ```
       *
       * @example
       *
       * ```ts
       * // Observer as an object
       * const subscription = actor.subscribe({
       *   next(snapshot) {
       *     console.log(snapshot);
       *   },
       *   error(err) {
       *     // ...
       *   },
       *   complete() {
       *     // ...
       *   }
       * });
       * ```
       *
       * The return value of `actor.subscribe(observer)` is a subscription object
       * that has an `.unsubscribe()` method. You can call
       * `subscription.unsubscribe()` to unsubscribe the observer:
       *
       * @example
       *
       * ```ts
       * const subscription = actor.subscribe((snapshot) => {
       *   // ...
       * });
       *
       * // Unsubscribe the observer
       * subscription.unsubscribe();
       * ```
       *
       * When the actor is stopped, all of its observers will automatically be
       * unsubscribed.
       *
       * @param observer - Either a plain function that receives the latest
       *   snapshot, or an observer object whose `.next(snapshot)` method receives
       *   the latest snapshot
       */
      subscribe(nextListenerOrObserver, errorListener, completeListener) {
        const observer = toObserver2(nextListenerOrObserver, errorListener, completeListener);
        if (this._processingStatus !== ProcessingStatus.Stopped) {
          this.observers.add(observer);
        } else {
          switch (this._snapshot.status) {
            case "done":
              try {
                observer.complete?.();
              } catch (err) {
                reportUnhandledError(err);
              }
              break;
            case "error": {
              const err = this._snapshot.error;
              if (!observer.error) {
                reportUnhandledError(err);
              } else {
                try {
                  observer.error(err);
                } catch (err2) {
                  reportUnhandledError(err2);
                }
              }
              break;
            }
          }
        }
        return {
          unsubscribe: () => {
            this.observers.delete(observer);
          }
        };
      }
      on(type, handler) {
        let listeners = this.eventListeners.get(type);
        if (!listeners) {
          listeners = /* @__PURE__ */ new Set();
          this.eventListeners.set(type, listeners);
        }
        const wrappedHandler = handler.bind(void 0);
        listeners.add(wrappedHandler);
        return {
          unsubscribe: () => {
            listeners.delete(wrappedHandler);
          }
        };
      }
      select(selector, equalityFn = Object.is) {
        return {
          subscribe: (observerOrFn) => {
            const observer = toObserver2(observerOrFn);
            const snapshot = this.getSnapshot();
            let previousSelected = selector(snapshot);
            return this.subscribe((snapshot2) => {
              const nextSelected = selector(snapshot2);
              if (!equalityFn(previousSelected, nextSelected)) {
                previousSelected = nextSelected;
                observer.next?.(nextSelected);
              }
            });
          },
          get: () => selector(this.getSnapshot())
        };
      }
      /** Starts the Actor from the initial state */
      start() {
        if (this._processingStatus === ProcessingStatus.Running) {
          return this;
        }
        if (this._syncSnapshot) {
          this.subscribe({
            next: (snapshot) => {
              if (snapshot.status === "active") {
                this.system._relay(this, this._parent, {
                  type: `xstate.snapshot.${this.id}`,
                  snapshot
                });
              }
            },
            error: () => {
            }
          });
        }
        this.system._register(this.sessionId, this);
        if (this.systemId) {
          this.system._set(this.systemId, this);
        }
        this._processingStatus = ProcessingStatus.Running;
        const initEvent = createInitEvent(this.options.input);
        this.system._sendInspectionEvent({
          type: "@xstate.event",
          sourceRef: this._parent,
          actorRef: this,
          event: initEvent
        });
        const status = this._snapshot.status;
        switch (status) {
          case "done":
            this.update(this._snapshot, initEvent);
            return this;
          case "error":
            this._error(this._snapshot.error);
            return this;
        }
        if (!this._parent) {
          this.system.start();
        }
        if (this.logic.start) {
          try {
            this.logic.start(this._snapshot, this._actorScope);
          } catch (err) {
            this._snapshot = {
              ...this._snapshot,
              status: "error",
              error: err
            };
            this._error(err);
            return this;
          }
        }
        this.update(this._snapshot, initEvent);
        if (this.options.devTools) {
          this.attachDevTools();
        }
        this.mailbox.start();
        return this;
      }
      _process(event) {
        let nextState;
        let caughtError;
        try {
          nextState = this.logic.transition(this._snapshot, event, this._actorScope);
        } catch (err) {
          caughtError = {
            err
          };
        }
        if (caughtError) {
          const {
            err
          } = caughtError;
          this._snapshot = {
            ...this._snapshot,
            status: "error",
            error: err
          };
          this._error(err);
          return;
        }
        this.update(nextState, event);
        if (event.type === XSTATE_STOP) {
          this._stopProcedure();
          this._complete();
        }
      }
      _stop() {
        if (this._processingStatus === ProcessingStatus.Stopped) {
          return this;
        }
        this.mailbox.clear();
        if (this._processingStatus === ProcessingStatus.NotStarted) {
          this._processingStatus = ProcessingStatus.Stopped;
          return this;
        }
        this.mailbox.enqueue({
          type: XSTATE_STOP
        });
        return this;
      }
      /** Stops the Actor and unsubscribe all listeners. */
      stop() {
        if (this._parent) {
          throw new Error("A non-root actor cannot be stopped directly.");
        }
        return this._stop();
      }
      _complete() {
        for (const observer of this.observers) {
          try {
            observer.complete?.();
          } catch (err) {
            reportUnhandledError(err);
          }
        }
        this.observers.clear();
        this.eventListeners.clear();
      }
      _reportError(err) {
        if (!this.observers.size) {
          if (!this._parent) {
            reportUnhandledError(err);
          }
          this.eventListeners.clear();
          return;
        }
        let reportError = false;
        for (const observer of this.observers) {
          const errorListener = observer.error;
          reportError ||= !errorListener;
          try {
            errorListener?.(err);
          } catch (err2) {
            reportUnhandledError(err2);
          }
        }
        this.observers.clear();
        this.eventListeners.clear();
        if (reportError) {
          reportUnhandledError(err);
        }
      }
      _error(err) {
        this._stopProcedure();
        this._reportError(err);
        if (this._parent) {
          this.system._relay(this, this._parent, createErrorActorEvent(this.id, err));
        }
      }
      // TODO: atm children don't belong entirely to the actor so
      // in a way - it's not even super aware of them
      // so we can't stop them from here but we really should!
      // right now, they are being stopped within the machine's transition
      // but that could throw and leave us with "orphaned" active actors
      _stopProcedure() {
        if (this._processingStatus !== ProcessingStatus.Running) {
          return this;
        }
        this.system.scheduler.cancelAll(this);
        this.mailbox.clear();
        this.mailbox = new Mailbox(this._process.bind(this));
        this._processingStatus = ProcessingStatus.Stopped;
        this.system._unregister(this);
        return this;
      }
      /** @internal */
      _send(event) {
        if (this._processingStatus === ProcessingStatus.Stopped) {
          return;
        }
        this.mailbox.enqueue(event);
      }
      /**
       * Sends an event to the running Actor to trigger a transition.
       *
       * @param event The event to send
       */
      send(event) {
        this.system._relay(void 0, this, event);
      }
      attachDevTools() {
        const {
          devTools
        } = this.options;
        if (devTools) {
          const resolvedDevToolsAdapter = typeof devTools === "function" ? devTools : dist_xstateDev.devToolsAdapter;
          resolvedDevToolsAdapter(this);
        }
      }
      toJSON() {
        return {
          xstate$$type: $$ACTOR_TYPE,
          id: this.id
        };
      }
      /**
       * Obtain the internal state of the actor, which can be persisted.
       *
       * @remarks
       * The internal state can be persisted from any actor, not only machines.
       *
       * Note that the persisted state is not the same as the snapshot from
       * {@link Actor.getSnapshot}. Persisted state represents the internal state of
       * the actor, while snapshots represent the actor's last emitted value.
       *
       * Can be restored with {@link ActorOptions.state}
       * @see https://stately.ai/docs/persistence
       */
      getPersistedSnapshot(options) {
        return this.logic.getPersistedSnapshot(this._snapshot, options);
      }
      [symbolObservable]() {
        return this;
      }
      /**
       * Read an actor’s snapshot synchronously.
       *
       * @remarks
       * The snapshot represent an actor's last emitted value.
       *
       * When an actor receives an event, its internal state may change. An actor
       * may emit a snapshot when a state transition occurs.
       *
       * Note that some actors, such as callback actors generated with
       * `fromCallback`, will not emit snapshots.
       * @see {@link Actor.subscribe} to subscribe to an actor’s snapshot values.
       * @see {@link Actor.getPersistedSnapshot} to persist the internal state of an actor (which is more than just a snapshot).
       */
      getSnapshot() {
        return this._snapshot;
      }
    };
    function createActor2(logic, ...[options]) {
      return new Actor2(logic, options);
    }
    var interpret2 = createActor2;
    function resolveCancel(_, snapshot, actionArgs, actionParams, {
      sendId
    }) {
      const resolvedSendId = typeof sendId === "function" ? sendId(actionArgs, actionParams) : sendId;
      return [snapshot, {
        sendId: resolvedSendId
      }, void 0];
    }
    function executeCancel(actorScope, params) {
      actorScope.defer(() => {
        actorScope.system.scheduler.cancel(actorScope.self, params.sendId);
      });
    }
    function cancel2(sendId) {
      function cancel3(_args, _params) {
      }
      cancel3.type = "xstate.cancel";
      cancel3.sendId = sendId;
      cancel3.resolve = resolveCancel;
      cancel3.execute = executeCancel;
      return cancel3;
    }
    function resolveSpawn(actorScope, snapshot, actionArgs, _actionParams, {
      id,
      systemId,
      src: src2,
      input,
      syncSnapshot
    }) {
      const logic = typeof src2 === "string" ? resolveReferencedActor(snapshot.machine, src2) : src2;
      const resolvedId = typeof id === "function" ? id(actionArgs) : id;
      let actorRef;
      let resolvedInput = void 0;
      if (logic) {
        resolvedInput = typeof input === "function" ? input({
          context: snapshot.context,
          event: actionArgs.event,
          self: actorScope.self
        }) : input;
        actorRef = createActor2(logic, {
          id: resolvedId,
          src: src2,
          parent: actorScope.self,
          syncSnapshot,
          systemId,
          input: resolvedInput
        });
      }
      return [cloneMachineSnapshot(snapshot, {
        children: {
          ...snapshot.children,
          [resolvedId]: actorRef
        }
      }), {
        id,
        systemId,
        actorRef,
        src: src2,
        input: resolvedInput
      }, void 0];
    }
    function executeSpawn(actorScope, {
      actorRef
    }) {
      if (!actorRef) {
        return;
      }
      actorScope.defer(() => {
        if (actorRef._processingStatus === ProcessingStatus.Stopped) {
          return;
        }
        actorRef.start();
      });
    }
    function spawnChild2(...[src2, {
      id,
      systemId,
      input,
      syncSnapshot = false
    } = {}]) {
      function spawnChild3(_args, _params) {
      }
      spawnChild3.type = "xstate.spawnChild";
      spawnChild3.id = id;
      spawnChild3.systemId = systemId;
      spawnChild3.src = src2;
      spawnChild3.input = input;
      spawnChild3.syncSnapshot = syncSnapshot;
      spawnChild3.resolve = resolveSpawn;
      spawnChild3.execute = executeSpawn;
      return spawnChild3;
    }
    function resolveStop(_, snapshot, args, actionParams, {
      actorRef
    }) {
      const actorRefOrString = typeof actorRef === "function" ? actorRef(args, actionParams) : actorRef;
      const resolvedActorRef = typeof actorRefOrString === "string" ? snapshot.children[actorRefOrString] : actorRefOrString;
      let children = snapshot.children;
      if (resolvedActorRef) {
        children = {
          ...children
        };
        delete children[resolvedActorRef.id];
      }
      return [cloneMachineSnapshot(snapshot, {
        children
      }), resolvedActorRef, void 0];
    }
    function unregisterRecursively(actorScope, actorRef) {
      const snapshot = actorRef.getSnapshot();
      if (snapshot && "children" in snapshot) {
        for (const child of Object.values(snapshot.children)) {
          unregisterRecursively(actorScope, child);
        }
      }
      actorScope.system._unregister(actorRef);
    }
    function executeStop(actorScope, actorRef) {
      if (!actorRef) {
        return;
      }
      unregisterRecursively(actorScope, actorRef);
      if (actorRef._processingStatus !== ProcessingStatus.Running) {
        actorScope.stopChild(actorRef);
        return;
      }
      actorScope.defer(() => {
        actorScope.stopChild(actorRef);
      });
    }
    function stopChild2(actorRef) {
      function stop3(_args, _params) {
      }
      stop3.type = "xstate.stopChild";
      stop3.actorRef = actorRef;
      stop3.resolve = resolveStop;
      stop3.execute = executeStop;
      return stop3;
    }
    var stop2 = stopChild2;
    function checkStateIn(snapshot, _, {
      stateValue
    }) {
      if (typeof stateValue === "string" && isStateId(stateValue)) {
        const target2 = snapshot.machine.getStateNodeById(stateValue);
        return snapshot._nodes.some((sn) => sn === target2);
      }
      return snapshot.matches(stateValue);
    }
    function stateIn2(stateValue) {
      function stateIn3() {
        return false;
      }
      stateIn3.check = checkStateIn;
      stateIn3.stateValue = stateValue;
      return stateIn3;
    }
    function checkNot(snapshot, {
      context,
      event
    }, {
      guards
    }) {
      return !evaluateGuard(guards[0], context, event, snapshot);
    }
    function not2(guard) {
      function not3(_args, _params) {
        return false;
      }
      not3.check = checkNot;
      not3.guards = [guard];
      return not3;
    }
    function checkAnd(snapshot, {
      context,
      event
    }, {
      guards
    }) {
      return guards.every((guard) => evaluateGuard(guard, context, event, snapshot));
    }
    function and2(guards) {
      function and3(_args, _params) {
        return false;
      }
      and3.check = checkAnd;
      and3.guards = guards;
      return and3;
    }
    function checkOr(snapshot, {
      context,
      event
    }, {
      guards
    }) {
      return guards.some((guard) => evaluateGuard(guard, context, event, snapshot));
    }
    function or2(guards) {
      function or3(_args, _params) {
        return false;
      }
      or3.check = checkOr;
      or3.guards = guards;
      return or3;
    }
    function evaluateGuard(guard, context, event, snapshot) {
      const {
        machine
      } = snapshot;
      const isInline = typeof guard === "function";
      const resolved = isInline ? guard : machine.implementations.guards[typeof guard === "string" ? guard : guard.type];
      if (!isInline && !resolved) {
        throw new Error(`Guard '${typeof guard === "string" ? guard : guard.type}' is not implemented.'.`);
      }
      if (typeof resolved !== "function") {
        return evaluateGuard(resolved, context, event, snapshot);
      }
      const guardArgs = {
        context,
        event
      };
      const guardParams = isInline || typeof guard === "string" ? void 0 : "params" in guard ? typeof guard.params === "function" ? guard.params({
        context,
        event
      }) : guard.params : void 0;
      if (!("check" in resolved)) {
        return resolved(guardArgs, guardParams);
      }
      const builtinGuard = resolved;
      return builtinGuard.check(
        snapshot,
        guardArgs,
        resolved
        // this holds all params
      );
    }
    function isAtomicStateNode(stateNode) {
      return stateNode.type === "atomic" || stateNode.type === "final";
    }
    function getChildren(stateNode) {
      return Object.values(stateNode.states).filter((sn) => sn.type !== "history");
    }
    function getProperAncestors(stateNode, toStateNode) {
      const ancestors = [];
      if (toStateNode === stateNode) {
        return ancestors;
      }
      let m = stateNode.parent;
      while (m && m !== toStateNode) {
        ancestors.push(m);
        m = m.parent;
      }
      return ancestors;
    }
    function getAllStateNodes(stateNodes) {
      const nodeSet = new Set(stateNodes);
      const adjList = getAdjList(nodeSet);
      for (const s of nodeSet) {
        if (s.type === "compound" && (!adjList.get(s) || !adjList.get(s).length)) {
          getInitialStateNodesWithTheirAncestors(s).forEach((sn) => nodeSet.add(sn));
        } else {
          if (s.type === "parallel") {
            for (const child of getChildren(s)) {
              if (child.type === "history") {
                continue;
              }
              if (!nodeSet.has(child)) {
                const initialStates = getInitialStateNodesWithTheirAncestors(child);
                for (const initialStateNode of initialStates) {
                  nodeSet.add(initialStateNode);
                }
              }
            }
          }
        }
      }
      for (const s of nodeSet) {
        let m = s.parent;
        while (m) {
          nodeSet.add(m);
          m = m.parent;
        }
      }
      return nodeSet;
    }
    function getValueFromAdj(baseNode, adjList) {
      const childStateNodes = adjList.get(baseNode);
      if (!childStateNodes) {
        return {};
      }
      if (baseNode.type === "compound") {
        const childStateNode = childStateNodes[0];
        if (childStateNode) {
          if (isAtomicStateNode(childStateNode)) {
            return childStateNode.key;
          }
        } else {
          return {};
        }
      }
      const stateValue = {};
      for (const childStateNode of childStateNodes) {
        stateValue[childStateNode.key] = getValueFromAdj(childStateNode, adjList);
      }
      return stateValue;
    }
    function getAdjList(stateNodes) {
      const adjList = /* @__PURE__ */ new Map();
      for (const s of stateNodes) {
        if (!adjList.has(s)) {
          adjList.set(s, []);
        }
        if (s.parent) {
          if (!adjList.has(s.parent)) {
            adjList.set(s.parent, []);
          }
          adjList.get(s.parent).push(s);
        }
      }
      return adjList;
    }
    function getStateValue(rootNode, stateNodes) {
      const config = getAllStateNodes(stateNodes);
      return getValueFromAdj(rootNode, getAdjList(config));
    }
    function isInFinalState(stateNodeSet, stateNode) {
      if (stateNode.type === "compound") {
        return getChildren(stateNode).some((s) => s.type === "final" && stateNodeSet.has(s));
      }
      if (stateNode.type === "parallel") {
        return getChildren(stateNode).every((sn) => isInFinalState(stateNodeSet, sn));
      }
      return stateNode.type === "final";
    }
    var isStateId = (str) => str[0] === STATE_IDENTIFIER;
    function getCandidates(stateNode, receivedEventType) {
      const exactMatch = stateNode.transitions.get(receivedEventType);
      const wildcardCandidates = [...stateNode.transitions.keys()].filter((eventDescriptor) => eventDescriptor !== receivedEventType && matchesEventDescriptor(receivedEventType, eventDescriptor)).sort((a, b) => b.length - a.length).flatMap((key) => stateNode.transitions.get(key));
      return exactMatch ? [...exactMatch, ...wildcardCandidates] : wildcardCandidates;
    }
    function getDelayedTransitions(stateNode) {
      const afterConfig = stateNode.config.after;
      if (!afterConfig) {
        return [];
      }
      const mutateEntryExit = (delay) => {
        const afterEvent = createAfterEvent(delay, stateNode.id);
        const eventType = afterEvent.type;
        stateNode.entry.push(raise2(afterEvent, {
          id: eventType,
          delay
        }));
        stateNode.exit.push(cancel2(eventType));
        return eventType;
      };
      const delayedTransitions = Object.keys(afterConfig).flatMap((delay) => {
        const configTransition = afterConfig[delay];
        const resolvedTransition = typeof configTransition === "string" ? {
          target: configTransition
        } : configTransition;
        const resolvedDelay = Number.isNaN(+delay) ? delay : +delay;
        const eventType = mutateEntryExit(resolvedDelay);
        return toArray(resolvedTransition).map((transition2) => ({
          ...transition2,
          event: eventType,
          delay: resolvedDelay
        }));
      });
      return delayedTransitions.map((delayedTransition) => {
        const {
          delay
        } = delayedTransition;
        return {
          ...formatTransition(stateNode, delayedTransition.event, delayedTransition),
          delay
        };
      });
    }
    function formatTransition(stateNode, descriptor, transitionConfig) {
      const normalizedTarget = normalizeTarget(transitionConfig.target);
      const reenter = transitionConfig.reenter ?? false;
      const target2 = resolveTarget(stateNode, normalizedTarget);
      const transition2 = {
        ...transitionConfig,
        actions: toArray(transitionConfig.actions),
        guard: transitionConfig.guard,
        target: target2,
        source: stateNode,
        reenter,
        eventType: descriptor,
        toJSON: () => ({
          ...transition2,
          source: `#${stateNode.id}`,
          target: target2 ? target2.map((t) => `#${t.id}`) : void 0
        })
      };
      return transition2;
    }
    function formatTransitions(stateNode) {
      const transitions = /* @__PURE__ */ new Map();
      if (stateNode.config.on) {
        for (const descriptor of Object.keys(stateNode.config.on)) {
          if (descriptor === NULL_EVENT) {
            throw new Error('Null events ("") cannot be specified as a transition key. Use `always: { ... }` instead.');
          }
          const transitionsConfig = stateNode.config.on[descriptor];
          transitions.set(descriptor, toTransitionConfigArray(transitionsConfig).map((t) => formatTransition(stateNode, descriptor, t)));
        }
      }
      if (stateNode.config.onDone) {
        const descriptor = `xstate.done.state.${stateNode.id}`;
        transitions.set(descriptor, toTransitionConfigArray(stateNode.config.onDone).map((t) => formatTransition(stateNode, descriptor, t)));
      }
      for (const invokeDef of stateNode.invoke) {
        if (invokeDef.onDone) {
          const descriptor = `xstate.done.actor.${invokeDef.id}`;
          transitions.set(descriptor, toTransitionConfigArray(invokeDef.onDone).map((t) => formatTransition(stateNode, descriptor, t)));
        }
        if (invokeDef.onError) {
          const descriptor = `xstate.error.actor.${invokeDef.id}`;
          transitions.set(descriptor, toTransitionConfigArray(invokeDef.onError).map((t) => formatTransition(stateNode, descriptor, t)));
        }
        if (invokeDef.onSnapshot) {
          const descriptor = `xstate.snapshot.${invokeDef.id}`;
          transitions.set(descriptor, toTransitionConfigArray(invokeDef.onSnapshot).map((t) => formatTransition(stateNode, descriptor, t)));
        }
      }
      for (const delayedTransition of stateNode.after) {
        let existing = transitions.get(delayedTransition.eventType);
        if (!existing) {
          existing = [];
          transitions.set(delayedTransition.eventType, existing);
        }
        existing.push(delayedTransition);
      }
      return transitions;
    }
    function formatRouteTransitions(rootStateNode) {
      const routeTransitions = [];
      const collectRoutes = (states) => {
        Object.values(states).forEach((sn) => {
          if (sn.config.route && sn.config.id) {
            const routeId = sn.config.id;
            const userGuard = sn.config.route.guard;
            const routeMatches = ({
              event
            }) => event.to === `#${routeId}`;
            const transition2 = {
              ...sn.config.route,
              guard: userGuard ? and2([routeMatches, userGuard]) : routeMatches,
              target: `#${routeId}`
            };
            routeTransitions.push(formatTransition(rootStateNode, "xstate.route", transition2));
          }
          if (sn.states) {
            collectRoutes(sn.states);
          }
        });
      };
      collectRoutes(rootStateNode.states);
      if (routeTransitions.length > 0) {
        rootStateNode.transitions.set("xstate.route", routeTransitions);
      }
    }
    function formatInitialTransition(stateNode, _target) {
      const resolvedTarget = typeof _target === "string" ? stateNode.states[_target] : _target ? stateNode.states[_target.target] : void 0;
      if (!resolvedTarget && _target) {
        throw new Error(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
          `Initial state node "${_target}" not found on parent state node #${stateNode.id}`
        );
      }
      const transition2 = {
        source: stateNode,
        actions: !_target || typeof _target === "string" ? [] : toArray(_target.actions),
        eventType: null,
        reenter: false,
        target: resolvedTarget ? [resolvedTarget] : [],
        toJSON: () => ({
          ...transition2,
          source: `#${stateNode.id}`,
          target: resolvedTarget ? [`#${resolvedTarget.id}`] : []
        })
      };
      return transition2;
    }
    function resolveTarget(stateNode, targets) {
      if (targets === void 0) {
        return void 0;
      }
      return targets.map((target2) => {
        if (typeof target2 !== "string") {
          return target2;
        }
        if (isStateId(target2)) {
          return stateNode.machine.getStateNodeById(target2);
        }
        const isInternalTarget = target2[0] === STATE_DELIMITER;
        if (isInternalTarget && !stateNode.parent) {
          return getStateNodeByPath(stateNode, target2.slice(1));
        }
        const resolvedTarget = isInternalTarget ? stateNode.key + target2 : target2;
        if (stateNode.parent) {
          try {
            const targetStateNode = getStateNodeByPath(stateNode.parent, resolvedTarget);
            return targetStateNode;
          } catch (err) {
            throw new Error(`Invalid transition definition for state node '${stateNode.id}':
${err.message}`);
          }
        } else {
          throw new Error(`Invalid target: "${target2}" is not a valid target from the root node. Did you mean ".${target2}"?`);
        }
      });
    }
    function resolveHistoryDefaultTransition(stateNode) {
      const normalizedTarget = normalizeTarget(stateNode.config.target);
      if (!normalizedTarget) {
        return stateNode.parent.initial;
      }
      return {
        target: normalizedTarget.map((t) => typeof t === "string" ? getStateNodeByPath(stateNode.parent, t) : t)
      };
    }
    function isHistoryNode(stateNode) {
      return stateNode.type === "history";
    }
    function getInitialStateNodesWithTheirAncestors(stateNode) {
      const states = getInitialStateNodes(stateNode);
      for (const initialState of states) {
        for (const ancestor of getProperAncestors(initialState, stateNode)) {
          states.add(ancestor);
        }
      }
      return states;
    }
    function getInitialStateNodes(stateNode) {
      const set = /* @__PURE__ */ new Set();
      function iter(descStateNode) {
        if (set.has(descStateNode)) {
          return;
        }
        set.add(descStateNode);
        if (descStateNode.type === "compound") {
          iter(descStateNode.initial.target[0]);
        } else if (descStateNode.type === "parallel") {
          for (const child of getChildren(descStateNode)) {
            iter(child);
          }
        }
      }
      iter(stateNode);
      return set;
    }
    function getStateNode(stateNode, stateKey) {
      if (isStateId(stateKey)) {
        return stateNode.machine.getStateNodeById(stateKey);
      }
      if (!stateNode.states) {
        throw new Error(`Unable to retrieve child state '${stateKey}' from '${stateNode.id}'; no child states exist.`);
      }
      const result = stateNode.states[stateKey];
      if (!result) {
        throw new Error(`Child state '${stateKey}' does not exist on '${stateNode.id}'`);
      }
      return result;
    }
    function getStateNodeByPath(stateNode, statePath) {
      if (typeof statePath === "string" && isStateId(statePath)) {
        try {
          return stateNode.machine.getStateNodeById(statePath);
        } catch {
        }
      }
      const arrayStatePath = toStatePath(statePath).slice();
      let currentStateNode = stateNode;
      while (arrayStatePath.length) {
        const key = arrayStatePath.shift();
        if (!key.length) {
          break;
        }
        currentStateNode = getStateNode(currentStateNode, key);
      }
      return currentStateNode;
    }
    function getStateNodes2(stateNode, stateValue) {
      if (typeof stateValue === "string") {
        const childStateNode = stateNode.states[stateValue];
        if (!childStateNode) {
          throw new Error(`State '${stateValue}' does not exist on '${stateNode.id}'`);
        }
        return [stateNode, childStateNode];
      }
      const childStateKeys = Object.keys(stateValue);
      const childStateNodes = childStateKeys.map((subStateKey) => getStateNode(stateNode, subStateKey)).filter(Boolean);
      return [stateNode.machine.root, stateNode].concat(childStateNodes, childStateKeys.reduce((allSubStateNodes, subStateKey) => {
        const subStateNode = getStateNode(stateNode, subStateKey);
        if (!subStateNode) {
          return allSubStateNodes;
        }
        const subStateNodes = getStateNodes2(subStateNode, stateValue[subStateKey]);
        return allSubStateNodes.concat(subStateNodes);
      }, []));
    }
    function transitionAtomicNode(stateNode, stateValue, snapshot, event) {
      const childStateNode = getStateNode(stateNode, stateValue);
      const next = childStateNode.next(snapshot, event);
      if (!next || !next.length) {
        return stateNode.next(snapshot, event);
      }
      return next;
    }
    function transitionCompoundNode(stateNode, stateValue, snapshot, event) {
      const subStateKeys = Object.keys(stateValue);
      const childStateNode = getStateNode(stateNode, subStateKeys[0]);
      const next = transitionNode(childStateNode, stateValue[subStateKeys[0]], snapshot, event);
      if (!next || !next.length) {
        return stateNode.next(snapshot, event);
      }
      return next;
    }
    function transitionParallelNode(stateNode, stateValue, snapshot, event) {
      const allInnerTransitions = [];
      for (const subStateKey of Object.keys(stateValue)) {
        const subStateValue = stateValue[subStateKey];
        if (!subStateValue) {
          continue;
        }
        const subStateNode = getStateNode(stateNode, subStateKey);
        const innerTransitions = transitionNode(subStateNode, subStateValue, snapshot, event);
        if (innerTransitions) {
          allInnerTransitions.push(...innerTransitions);
        }
      }
      if (!allInnerTransitions.length) {
        return stateNode.next(snapshot, event);
      }
      return allInnerTransitions;
    }
    function transitionNode(stateNode, stateValue, snapshot, event) {
      if (typeof stateValue === "string") {
        return transitionAtomicNode(stateNode, stateValue, snapshot, event);
      }
      if (Object.keys(stateValue).length === 1) {
        return transitionCompoundNode(stateNode, stateValue, snapshot, event);
      }
      return transitionParallelNode(stateNode, stateValue, snapshot, event);
    }
    function getHistoryNodes(stateNode) {
      return Object.keys(stateNode.states).map((key) => stateNode.states[key]).filter((sn) => sn.type === "history");
    }
    function isDescendant(childStateNode, parentStateNode) {
      let marker = childStateNode;
      while (marker.parent && marker.parent !== parentStateNode) {
        marker = marker.parent;
      }
      return marker.parent === parentStateNode;
    }
    function hasIntersection(s1, s2) {
      const set1 = new Set(s1);
      const set2 = new Set(s2);
      for (const item of set1) {
        if (set2.has(item)) {
          return true;
        }
      }
      for (const item of set2) {
        if (set1.has(item)) {
          return true;
        }
      }
      return false;
    }
    function removeConflictingTransitions(enabledTransitions, stateNodeSet, historyValue) {
      const filteredTransitions = /* @__PURE__ */ new Set();
      for (const t1 of enabledTransitions) {
        let t1Preempted = false;
        const transitionsToRemove = /* @__PURE__ */ new Set();
        for (const t2 of filteredTransitions) {
          if (hasIntersection(computeExitSet([t1], stateNodeSet, historyValue), computeExitSet([t2], stateNodeSet, historyValue))) {
            if (isDescendant(t1.source, t2.source)) {
              transitionsToRemove.add(t2);
            } else {
              t1Preempted = true;
              break;
            }
          }
        }
        if (!t1Preempted) {
          for (const t3 of transitionsToRemove) {
            filteredTransitions.delete(t3);
          }
          filteredTransitions.add(t1);
        }
      }
      return Array.from(filteredTransitions);
    }
    function findLeastCommonAncestor(stateNodes) {
      const [head, ...tail] = stateNodes;
      for (const ancestor of getProperAncestors(head, void 0)) {
        if (tail.every((sn) => isDescendant(sn, ancestor))) {
          return ancestor;
        }
      }
    }
    function getEffectiveTargetStates(transition2, historyValue) {
      if (!transition2.target) {
        return [];
      }
      const targets = /* @__PURE__ */ new Set();
      for (const targetNode of transition2.target) {
        if (isHistoryNode(targetNode)) {
          if (historyValue[targetNode.id]) {
            for (const node of historyValue[targetNode.id]) {
              targets.add(node);
            }
          } else {
            for (const node of getEffectiveTargetStates(resolveHistoryDefaultTransition(targetNode), historyValue)) {
              targets.add(node);
            }
          }
        } else {
          targets.add(targetNode);
        }
      }
      return [...targets];
    }
    function getTransitionDomain(transition2, historyValue) {
      const targetStates = getEffectiveTargetStates(transition2, historyValue);
      if (!targetStates) {
        return;
      }
      if (!transition2.reenter && targetStates.every((target2) => target2 === transition2.source || isDescendant(target2, transition2.source))) {
        return transition2.source;
      }
      const lca = findLeastCommonAncestor(targetStates.concat(transition2.source));
      if (lca) {
        return lca;
      }
      if (transition2.reenter) {
        return;
      }
      return transition2.source.machine.root;
    }
    function computeExitSet(transitions, stateNodeSet, historyValue) {
      const statesToExit = /* @__PURE__ */ new Set();
      for (const t of transitions) {
        if (t.target?.length) {
          const domain = getTransitionDomain(t, historyValue);
          if (t.reenter && t.source === domain) {
            statesToExit.add(domain);
          }
          for (const stateNode of stateNodeSet) {
            if (isDescendant(stateNode, domain)) {
              statesToExit.add(stateNode);
            }
          }
        }
      }
      return [...statesToExit];
    }
    function areStateNodeCollectionsEqual(prevStateNodes, nextStateNodeSet) {
      if (prevStateNodes.length !== nextStateNodeSet.size) {
        return false;
      }
      for (const node of prevStateNodes) {
        if (!nextStateNodeSet.has(node)) {
          return false;
        }
      }
      return true;
    }
    function initialMicrostep(root, preInitialState, actorScope, initEvent, internalQueue) {
      return microstep([{
        target: [...getInitialStateNodes(root)],
        source: root,
        reenter: true,
        actions: [],
        eventType: null,
        toJSON: null
      }], preInitialState, actorScope, initEvent, true, internalQueue);
    }
    function microstep(transitions, currentSnapshot, actorScope, event, isInitial, internalQueue) {
      const actions = [];
      if (!transitions.length) {
        return [currentSnapshot, actions];
      }
      const originalExecutor = actorScope.actionExecutor;
      actorScope.actionExecutor = (action) => {
        actions.push(action);
        originalExecutor(action);
      };
      try {
        const mutStateNodeSet = new Set(currentSnapshot._nodes);
        let historyValue = currentSnapshot.historyValue;
        const filteredTransitions = removeConflictingTransitions(transitions, mutStateNodeSet, historyValue);
        let nextState = currentSnapshot;
        if (!isInitial) {
          [nextState, historyValue] = exitStates(nextState, event, actorScope, filteredTransitions, mutStateNodeSet, historyValue, internalQueue, actorScope.actionExecutor);
        }
        nextState = resolveActionsAndContext(nextState, event, actorScope, filteredTransitions.flatMap((t) => t.actions), internalQueue, void 0);
        nextState = enterStates(nextState, event, actorScope, filteredTransitions, mutStateNodeSet, internalQueue, historyValue, isInitial);
        const nextStateNodes = [...mutStateNodeSet];
        if (nextState.status === "done") {
          nextState = resolveActionsAndContext(nextState, event, actorScope, nextStateNodes.sort((a, b) => b.order - a.order).flatMap((state) => state.exit), internalQueue, void 0);
        }
        try {
          if (historyValue === currentSnapshot.historyValue && areStateNodeCollectionsEqual(currentSnapshot._nodes, mutStateNodeSet)) {
            return [nextState, actions];
          }
          return [cloneMachineSnapshot(nextState, {
            _nodes: nextStateNodes,
            historyValue
          }), actions];
        } catch (e) {
          throw e;
        }
      } finally {
        actorScope.actionExecutor = originalExecutor;
      }
    }
    function getMachineOutput(snapshot, event, actorScope, rootNode, rootCompletionNode) {
      if (rootNode.output === void 0) {
        return;
      }
      const doneStateEvent = createDoneStateEvent(rootCompletionNode.id, rootCompletionNode.output !== void 0 && rootCompletionNode.parent ? resolveOutput(rootCompletionNode.output, snapshot.context, event, actorScope.self) : void 0);
      return resolveOutput(rootNode.output, snapshot.context, doneStateEvent, actorScope.self);
    }
    function enterStates(currentSnapshot, event, actorScope, filteredTransitions, mutStateNodeSet, internalQueue, historyValue, isInitial) {
      let nextSnapshot = currentSnapshot;
      const statesToEnter = /* @__PURE__ */ new Set();
      const statesForDefaultEntry = /* @__PURE__ */ new Set();
      computeEntrySet(filteredTransitions, historyValue, statesForDefaultEntry, statesToEnter);
      if (isInitial) {
        statesForDefaultEntry.add(currentSnapshot.machine.root);
      }
      const completedNodes = /* @__PURE__ */ new Set();
      for (const stateNodeToEnter of [...statesToEnter].sort((a, b) => a.order - b.order)) {
        mutStateNodeSet.add(stateNodeToEnter);
        const actions = [];
        actions.push(...stateNodeToEnter.entry);
        for (const invokeDef of stateNodeToEnter.invoke) {
          actions.push(spawnChild2(invokeDef.src, {
            ...invokeDef,
            syncSnapshot: !!invokeDef.onSnapshot
          }));
        }
        if (statesForDefaultEntry.has(stateNodeToEnter)) {
          const initialActions = stateNodeToEnter.initial.actions;
          actions.push(...initialActions);
        }
        nextSnapshot = resolveActionsAndContext(nextSnapshot, event, actorScope, actions, internalQueue, stateNodeToEnter.invoke.map((invokeDef) => invokeDef.id));
        if (stateNodeToEnter.type === "final") {
          const parent = stateNodeToEnter.parent;
          let ancestorMarker = parent?.type === "parallel" ? parent : parent?.parent;
          let rootCompletionNode = ancestorMarker || stateNodeToEnter;
          if (parent?.type === "compound") {
            internalQueue.push(createDoneStateEvent(parent.id, stateNodeToEnter.output !== void 0 ? resolveOutput(stateNodeToEnter.output, nextSnapshot.context, event, actorScope.self) : void 0));
          }
          while (ancestorMarker?.type === "parallel" && !completedNodes.has(ancestorMarker) && isInFinalState(mutStateNodeSet, ancestorMarker)) {
            completedNodes.add(ancestorMarker);
            internalQueue.push(createDoneStateEvent(ancestorMarker.id));
            rootCompletionNode = ancestorMarker;
            ancestorMarker = ancestorMarker.parent;
          }
          if (ancestorMarker) {
            continue;
          }
          nextSnapshot = cloneMachineSnapshot(nextSnapshot, {
            status: "done",
            output: getMachineOutput(nextSnapshot, event, actorScope, nextSnapshot.machine.root, rootCompletionNode)
          });
        }
      }
      return nextSnapshot;
    }
    function computeEntrySet(transitions, historyValue, statesForDefaultEntry, statesToEnter) {
      for (const t of transitions) {
        const domain = getTransitionDomain(t, historyValue);
        for (const s of t.target || []) {
          if (!isHistoryNode(s) && // if the target is different than the source then it will *definitely* be entered
          (t.source !== s || // we know that the domain can't lie within the source
          // if it's different than the source then it's outside of it and it means that the target has to be entered as well
          t.source !== domain || // reentering transitions always enter the target, even if it's the source itself
          t.reenter)) {
            statesToEnter.add(s);
            statesForDefaultEntry.add(s);
          }
          addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
        }
        const targetStates = getEffectiveTargetStates(t, historyValue);
        for (const s of targetStates) {
          const ancestors = getProperAncestors(s, domain);
          if (domain?.type === "parallel") {
            ancestors.push(domain);
          }
          addAncestorStatesToEnter(statesToEnter, historyValue, statesForDefaultEntry, ancestors, !t.source.parent && t.reenter ? void 0 : domain);
        }
      }
    }
    function addDescendantStatesToEnter(stateNode, historyValue, statesForDefaultEntry, statesToEnter) {
      if (isHistoryNode(stateNode)) {
        if (historyValue[stateNode.id]) {
          const historyStateNodes = historyValue[stateNode.id];
          for (const s of historyStateNodes) {
            statesToEnter.add(s);
            addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
          }
          for (const s of historyStateNodes) {
            addProperAncestorStatesToEnter(s, stateNode.parent, statesToEnter, historyValue, statesForDefaultEntry);
          }
        } else {
          const historyDefaultTransition = resolveHistoryDefaultTransition(stateNode);
          for (const s of historyDefaultTransition.target) {
            statesToEnter.add(s);
            if (historyDefaultTransition === stateNode.parent?.initial) {
              statesForDefaultEntry.add(stateNode.parent);
            }
            addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
          }
          for (const s of historyDefaultTransition.target) {
            addProperAncestorStatesToEnter(s, stateNode.parent, statesToEnter, historyValue, statesForDefaultEntry);
          }
        }
      } else {
        if (stateNode.type === "compound") {
          const [initialState] = stateNode.initial.target;
          if (!isHistoryNode(initialState)) {
            statesToEnter.add(initialState);
            statesForDefaultEntry.add(initialState);
          }
          addDescendantStatesToEnter(initialState, historyValue, statesForDefaultEntry, statesToEnter);
          addProperAncestorStatesToEnter(initialState, stateNode, statesToEnter, historyValue, statesForDefaultEntry);
        } else {
          if (stateNode.type === "parallel") {
            for (const child of getChildren(stateNode).filter((sn) => !isHistoryNode(sn))) {
              if (![...statesToEnter].some((s) => isDescendant(s, child))) {
                if (!isHistoryNode(child)) {
                  statesToEnter.add(child);
                  statesForDefaultEntry.add(child);
                }
                addDescendantStatesToEnter(child, historyValue, statesForDefaultEntry, statesToEnter);
              }
            }
          }
        }
      }
    }
    function addAncestorStatesToEnter(statesToEnter, historyValue, statesForDefaultEntry, ancestors, reentrancyDomain) {
      for (const anc of ancestors) {
        if (!reentrancyDomain || isDescendant(anc, reentrancyDomain)) {
          statesToEnter.add(anc);
        }
        if (anc.type === "parallel") {
          for (const child of getChildren(anc).filter((sn) => !isHistoryNode(sn))) {
            if (![...statesToEnter].some((s) => isDescendant(s, child))) {
              statesToEnter.add(child);
              addDescendantStatesToEnter(child, historyValue, statesForDefaultEntry, statesToEnter);
            }
          }
        }
      }
    }
    function addProperAncestorStatesToEnter(stateNode, toStateNode, statesToEnter, historyValue, statesForDefaultEntry) {
      addAncestorStatesToEnter(statesToEnter, historyValue, statesForDefaultEntry, getProperAncestors(stateNode, toStateNode));
    }
    function exitStates(currentSnapshot, event, actorScope, transitions, mutStateNodeSet, historyValue, internalQueue, _actionExecutor) {
      let nextSnapshot = currentSnapshot;
      const statesToExit = computeExitSet(transitions, mutStateNodeSet, historyValue);
      statesToExit.sort((a, b) => b.order - a.order);
      let changedHistory;
      for (const exitStateNode of statesToExit) {
        for (const historyNode of getHistoryNodes(exitStateNode)) {
          let predicate;
          if (historyNode.history === "deep") {
            predicate = (sn) => isAtomicStateNode(sn) && isDescendant(sn, exitStateNode);
          } else {
            predicate = (sn) => {
              return sn.parent === exitStateNode;
            };
          }
          changedHistory ??= {
            ...historyValue
          };
          changedHistory[historyNode.id] = Array.from(mutStateNodeSet).filter(predicate);
        }
      }
      for (const s of statesToExit) {
        nextSnapshot = resolveActionsAndContext(nextSnapshot, event, actorScope, [...s.exit, ...s.invoke.map((def) => stopChild2(def.id))], internalQueue, void 0);
        mutStateNodeSet.delete(s);
      }
      return [nextSnapshot, changedHistory || historyValue];
    }
    function getAction(machine, actionType) {
      return machine.implementations.actions[actionType];
    }
    function resolveAndExecuteActionsWithContext(currentSnapshot, event, actorScope, actions, extra, retries) {
      const {
        machine
      } = currentSnapshot;
      let intermediateSnapshot = currentSnapshot;
      for (const action of actions) {
        const isInline = typeof action === "function";
        const resolvedAction = isInline ? action : (
          // the existing type of `.actions` assumes non-nullable `TExpressionAction`
          // it's fine to cast this here to get a common type and lack of errors in the rest of the code
          // our logic below makes sure that we call those 2 "variants" correctly
          getAction(machine, typeof action === "string" ? action : action.type)
        );
        const actionArgs = {
          context: intermediateSnapshot.context,
          event,
          self: actorScope.self,
          system: actorScope.system
        };
        const actionParams = isInline || typeof action === "string" ? void 0 : "params" in action ? typeof action.params === "function" ? action.params({
          context: intermediateSnapshot.context,
          event
        }) : action.params : void 0;
        if (!resolvedAction || !("resolve" in resolvedAction)) {
          actorScope.actionExecutor({
            type: typeof action === "string" ? action : typeof action === "object" ? action.type : action.name || "(anonymous)",
            info: actionArgs,
            params: actionParams,
            exec: resolvedAction
          });
          continue;
        }
        const builtinAction = resolvedAction;
        const [nextState, params, actions2] = builtinAction.resolve(
          actorScope,
          intermediateSnapshot,
          actionArgs,
          actionParams,
          resolvedAction,
          // this holds all params
          extra
        );
        intermediateSnapshot = nextState;
        if ("retryResolve" in builtinAction) {
          retries?.push([builtinAction, params]);
        }
        if ("execute" in builtinAction) {
          actorScope.actionExecutor({
            type: builtinAction.type,
            info: actionArgs,
            params,
            exec: builtinAction.execute.bind(null, actorScope, params)
          });
        }
        if (actions2) {
          intermediateSnapshot = resolveAndExecuteActionsWithContext(intermediateSnapshot, event, actorScope, actions2, extra, retries);
        }
      }
      return intermediateSnapshot;
    }
    function resolveActionsAndContext(currentSnapshot, event, actorScope, actions, internalQueue, deferredActorIds) {
      const retries = deferredActorIds ? [] : void 0;
      const nextState = resolveAndExecuteActionsWithContext(currentSnapshot, event, actorScope, actions, {
        internalQueue,
        deferredActorIds
      }, retries);
      retries?.forEach(([builtinAction, params]) => {
        builtinAction.retryResolve(actorScope, nextState, params);
      });
      return nextState;
    }
    function macrostep(snapshot, event, actorScope, internalQueue) {
      let nextSnapshot = snapshot;
      const microsteps = [];
      function addMicrostep(step, event2, transitions) {
        actorScope.system._sendInspectionEvent({
          type: "@xstate.microstep",
          actorRef: actorScope.self,
          event: event2,
          snapshot: step[0],
          _transitions: transitions
        });
        microsteps.push(step);
      }
      if (event.type === XSTATE_STOP) {
        nextSnapshot = cloneMachineSnapshot(stopChildren(nextSnapshot, event, actorScope), {
          status: "stopped"
        });
        addMicrostep([nextSnapshot, []], event, []);
        return {
          snapshot: nextSnapshot,
          microsteps
        };
      }
      let nextEvent = event;
      if (nextEvent.type !== XSTATE_INIT) {
        const currentEvent = nextEvent;
        const isErr = isErrorActorEvent(currentEvent);
        const transitions = selectTransitions(currentEvent, nextSnapshot);
        if (isErr && !transitions.length) {
          nextSnapshot = cloneMachineSnapshot(snapshot, {
            status: "error",
            error: currentEvent.error
          });
          addMicrostep([nextSnapshot, []], currentEvent, []);
          return {
            snapshot: nextSnapshot,
            microsteps
          };
        }
        const step = microstep(
          transitions,
          snapshot,
          actorScope,
          nextEvent,
          false,
          // isInitial
          internalQueue
        );
        nextSnapshot = step[0];
        addMicrostep(step, currentEvent, transitions);
      }
      let shouldSelectEventlessTransitions = true;
      const maxIterations = snapshot.machine.options?.maxIterations ?? Infinity;
      let iterationCount = 0;
      while (nextSnapshot.status === "active") {
        iterationCount++;
        if (iterationCount > maxIterations) {
          throw new Error(`Infinite loop detected: the machine has processed more than ${maxIterations} microsteps without reaching a stable state. This usually happens when there's a cycle of transitions (e.g., eventless transitions or raised events causing state A -> B -> C -> A).`);
        }
        let enabledTransitions = shouldSelectEventlessTransitions ? selectEventlessTransitions(nextSnapshot, nextEvent) : [];
        const previousState = enabledTransitions.length ? nextSnapshot : void 0;
        if (!enabledTransitions.length) {
          if (!internalQueue.length) {
            break;
          }
          nextEvent = internalQueue.shift();
          enabledTransitions = selectTransitions(nextEvent, nextSnapshot);
        }
        const step = microstep(enabledTransitions, nextSnapshot, actorScope, nextEvent, false, internalQueue);
        nextSnapshot = step[0];
        shouldSelectEventlessTransitions = nextSnapshot !== previousState;
        addMicrostep(step, nextEvent, enabledTransitions);
      }
      if (nextSnapshot.status !== "active") {
        stopChildren(nextSnapshot, nextEvent, actorScope);
      }
      return {
        snapshot: nextSnapshot,
        microsteps
      };
    }
    function stopChildren(nextState, event, actorScope) {
      return resolveActionsAndContext(nextState, event, actorScope, Object.values(nextState.children).map((child) => stopChild2(child)), [], void 0);
    }
    function selectTransitions(event, nextState) {
      return nextState.machine.getTransitionData(nextState, event);
    }
    function selectEventlessTransitions(nextState, event) {
      const enabledTransitionSet = /* @__PURE__ */ new Set();
      const atomicStates = nextState._nodes.filter(isAtomicStateNode);
      for (const stateNode of atomicStates) {
        loop: for (const s of [stateNode].concat(getProperAncestors(stateNode, void 0))) {
          if (!s.always) {
            continue;
          }
          for (const transition2 of s.always) {
            if (transition2.guard === void 0 || evaluateGuard(transition2.guard, nextState.context, event, nextState)) {
              enabledTransitionSet.add(transition2);
              break loop;
            }
          }
        }
      }
      return removeConflictingTransitions(Array.from(enabledTransitionSet), new Set(nextState._nodes), nextState.historyValue);
    }
    function resolveStateValue(rootNode, stateValue) {
      const allStateNodes = getAllStateNodes(getStateNodes2(rootNode, stateValue));
      return getStateValue(rootNode, [...allStateNodes]);
    }
    function isMachineSnapshot2(value) {
      return !!value && typeof value === "object" && "machine" in value && "value" in value;
    }
    var machineSnapshotMatches = function matches(testValue) {
      return matchesState2(testValue, this.value);
    };
    var machineSnapshotHasTag = function hasTag(tag) {
      return this.tags.has(tag);
    };
    var machineSnapshotCan = function can(event) {
      const transitionData = this.machine.getTransitionData(this, event);
      return !!transitionData?.length && // Check that at least one transition is not forbidden
      transitionData.some((t) => t.target !== void 0 || t.actions.length);
    };
    var machineSnapshotToJSON = function toJSON() {
      const {
        _nodes: nodes,
        tags,
        machine,
        getMeta,
        toJSON: toJSON2,
        can,
        hasTag,
        matches,
        ...jsonValues
      } = this;
      return {
        ...jsonValues,
        tags: Array.from(tags)
      };
    };
    var machineSnapshotGetMeta = function getMeta() {
      return this._nodes.reduce((acc, stateNode) => {
        if (stateNode.meta !== void 0) {
          acc[stateNode.id] = stateNode.meta;
        }
        return acc;
      }, {});
    };
    function createMachineSnapshot(config, machine) {
      return {
        status: config.status,
        output: config.output,
        error: config.error,
        machine,
        context: config.context,
        _nodes: config._nodes,
        value: getStateValue(machine.root, config._nodes),
        tags: new Set(config._nodes.flatMap((sn) => sn.tags)),
        children: config.children,
        historyValue: config.historyValue || {},
        matches: machineSnapshotMatches,
        hasTag: machineSnapshotHasTag,
        can: machineSnapshotCan,
        getMeta: machineSnapshotGetMeta,
        toJSON: machineSnapshotToJSON
      };
    }
    function cloneMachineSnapshot(snapshot, config = {}) {
      return createMachineSnapshot({
        ...snapshot,
        ...config
      }, snapshot.machine);
    }
    function serializeHistoryValue(historyValue) {
      if (typeof historyValue !== "object" || historyValue === null) {
        return {};
      }
      const result = {};
      for (const key in historyValue) {
        const value = historyValue[key];
        if (Array.isArray(value)) {
          result[key] = value.map((item) => ({
            id: item.id
          }));
        }
      }
      return result;
    }
    function getPersistedSnapshot(snapshot, options) {
      const {
        _nodes: nodes,
        tags,
        machine,
        children,
        context,
        can,
        hasTag,
        matches,
        getMeta,
        toJSON,
        ...jsonValues
      } = snapshot;
      const childrenJson = {};
      for (const id in children) {
        const child = children[id];
        childrenJson[id] = {
          snapshot: child.getPersistedSnapshot(options),
          src: child.src,
          systemId: child.systemId,
          syncSnapshot: child._syncSnapshot
        };
      }
      const persisted = {
        ...jsonValues,
        context: persistContext(context),
        children: childrenJson,
        historyValue: serializeHistoryValue(jsonValues.historyValue)
      };
      return persisted;
    }
    function persistContext(contextPart) {
      let copy;
      for (const key in contextPart) {
        const value = contextPart[key];
        if (value && typeof value === "object") {
          if ("sessionId" in value && "send" in value && "ref" in value) {
            copy ??= Array.isArray(contextPart) ? contextPart.slice() : {
              ...contextPart
            };
            copy[key] = {
              xstate$$type: $$ACTOR_TYPE,
              id: value.id
            };
          } else {
            const result = persistContext(value);
            if (result !== value) {
              copy ??= Array.isArray(contextPart) ? contextPart.slice() : {
                ...contextPart
              };
              copy[key] = result;
            }
          }
        }
      }
      return copy ?? contextPart;
    }
    function resolveRaise(_, snapshot, args, actionParams, {
      event: eventOrExpr,
      id,
      delay
    }, {
      internalQueue
    }) {
      const delaysMap = snapshot.machine.implementations.delays;
      if (typeof eventOrExpr === "string") {
        throw new Error(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `Only event objects may be used with raise; use raise({ type: "${eventOrExpr}" }) instead`
        );
      }
      const resolvedEvent = typeof eventOrExpr === "function" ? eventOrExpr(args, actionParams) : eventOrExpr;
      let resolvedDelay;
      if (typeof delay === "string") {
        const configDelay = delaysMap && delaysMap[delay];
        resolvedDelay = typeof configDelay === "function" ? configDelay(args, actionParams) : configDelay;
      } else {
        resolvedDelay = typeof delay === "function" ? delay(args, actionParams) : delay;
      }
      if (typeof resolvedDelay !== "number") {
        internalQueue.push(resolvedEvent);
      }
      return [snapshot, {
        event: resolvedEvent,
        id,
        delay: resolvedDelay
      }, void 0];
    }
    function executeRaise(actorScope, params) {
      const {
        event,
        delay,
        id
      } = params;
      if (typeof delay === "number") {
        actorScope.defer(() => {
          const self2 = actorScope.self;
          actorScope.system.scheduler.schedule(self2, self2, event, delay, id);
        });
        return;
      }
    }
    function raise2(eventOrExpr, options) {
      function raise3(_args, _params) {
      }
      raise3.type = "xstate.raise";
      raise3.event = eventOrExpr;
      raise3.id = options?.id;
      raise3.delay = options?.delay;
      raise3.resolve = resolveRaise;
      raise3.execute = executeRaise;
      return raise3;
    }
    exports.$$ACTOR_TYPE = $$ACTOR_TYPE;
    exports.Actor = Actor2;
    exports.NULL_EVENT = NULL_EVENT;
    exports.ProcessingStatus = ProcessingStatus;
    exports.STATE_DELIMITER = STATE_DELIMITER;
    exports.XSTATE_ERROR = XSTATE_ERROR;
    exports.XSTATE_STOP = XSTATE_STOP;
    exports.and = and2;
    exports.cancel = cancel2;
    exports.cloneMachineSnapshot = cloneMachineSnapshot;
    exports.createActor = createActor2;
    exports.createErrorActorEvent = createErrorActorEvent;
    exports.createInitEvent = createInitEvent;
    exports.createInvokeId = createInvokeId;
    exports.createMachineSnapshot = createMachineSnapshot;
    exports.evaluateGuard = evaluateGuard;
    exports.formatInitialTransition = formatInitialTransition;
    exports.formatRouteTransitions = formatRouteTransitions;
    exports.formatTransition = formatTransition;
    exports.formatTransitions = formatTransitions;
    exports.getAllOwnEventDescriptors = getAllOwnEventDescriptors;
    exports.getAllStateNodes = getAllStateNodes;
    exports.getCandidates = getCandidates;
    exports.getDelayedTransitions = getDelayedTransitions;
    exports.getPersistedSnapshot = getPersistedSnapshot;
    exports.getProperAncestors = getProperAncestors;
    exports.getStateNodeByPath = getStateNodeByPath;
    exports.getStateNodes = getStateNodes2;
    exports.initialMicrostep = initialMicrostep;
    exports.interpret = interpret2;
    exports.isAtomicStateNode = isAtomicStateNode;
    exports.isInFinalState = isInFinalState;
    exports.isMachineSnapshot = isMachineSnapshot2;
    exports.isStateId = isStateId;
    exports.macrostep = macrostep;
    exports.mapValues = mapValues;
    exports.matchesEventDescriptor = matchesEventDescriptor;
    exports.matchesState = matchesState2;
    exports.not = not2;
    exports.or = or2;
    exports.pathToStateValue = pathToStateValue2;
    exports.raise = raise2;
    exports.resolveActionsAndContext = resolveActionsAndContext;
    exports.resolveReferencedActor = resolveReferencedActor;
    exports.resolveStateValue = resolveStateValue;
    exports.spawnChild = spawnChild2;
    exports.stateIn = stateIn2;
    exports.stop = stop2;
    exports.stopChild = stopChild2;
    exports.toArray = toArray;
    exports.toObserver = toObserver2;
    exports.toStatePath = toStatePath;
    exports.toTransitionConfigArray = toTransitionConfigArray;
    exports.transitionNode = transitionNode;
  }
});

// node_modules/.deno/xstate@5.32.2/node_modules/xstate/dist/xstate-actors.cjs.js
var require_xstate_actors_cjs = __commonJS({
  "node_modules/.deno/xstate@5.32.2/node_modules/xstate/dist/xstate-actors.cjs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dist_xstateGuards = require_raise_c445379d_cjs();
    require_xstate_dev_cjs();
    function fromTransition2(transition2, initialContext) {
      return {
        config: transition2,
        transition: (snapshot, event, actorScope) => {
          return {
            ...snapshot,
            context: transition2(snapshot.context, event, actorScope)
          };
        },
        getInitialSnapshot: (_, input) => {
          return {
            status: "active",
            output: void 0,
            error: void 0,
            context: typeof initialContext === "function" ? initialContext({
              input
            }) : initialContext
          };
        },
        getPersistedSnapshot: (snapshot) => snapshot,
        restoreSnapshot: (snapshot) => snapshot
      };
    }
    var instanceStates = /* @__PURE__ */ new WeakMap();
    function fromCallback2(callback) {
      const logic = {
        config: callback,
        start: (state, actorScope) => {
          const {
            self: self2,
            system,
            emit: emit2
          } = actorScope;
          const callbackState = {
            receivers: void 0,
            dispose: void 0
          };
          instanceStates.set(self2, callbackState);
          callbackState.dispose = callback({
            input: state.input,
            system,
            self: self2,
            sendBack: (event) => {
              if (self2.getSnapshot().status === "stopped") {
                return;
              }
              if (self2._parent) {
                system._relay(self2, self2._parent, event);
              }
            },
            receive: (listener) => {
              callbackState.receivers ??= /* @__PURE__ */ new Set();
              callbackState.receivers.add(listener);
            },
            emit: emit2
          });
        },
        transition: (state, event, actorScope) => {
          const callbackState = instanceStates.get(actorScope.self);
          if (event.type === dist_xstateGuards.XSTATE_STOP) {
            state = {
              ...state,
              status: "stopped",
              error: void 0
            };
            instanceStates.delete(actorScope.self);
            callbackState.receivers?.clear();
            callbackState.dispose?.();
            return state;
          }
          callbackState.receivers?.forEach((receiver) => receiver(event));
          return state;
        },
        getInitialSnapshot: (_, input) => {
          return {
            status: "active",
            output: void 0,
            error: void 0,
            input
          };
        },
        getPersistedSnapshot: (snapshot) => snapshot,
        restoreSnapshot: (snapshot) => snapshot
      };
      return logic;
    }
    var XSTATE_OBSERVABLE_NEXT = "xstate.observable.next";
    var XSTATE_OBSERVABLE_ERROR = "xstate.observable.error";
    var XSTATE_OBSERVABLE_COMPLETE = "xstate.observable.complete";
    function fromObservable2(observableCreator) {
      const logic = {
        config: observableCreator,
        transition: (snapshot, event) => {
          if (snapshot.status !== "active") {
            return snapshot;
          }
          switch (event.type) {
            case XSTATE_OBSERVABLE_NEXT: {
              const newSnapshot = {
                ...snapshot,
                context: event.data
              };
              return newSnapshot;
            }
            case XSTATE_OBSERVABLE_ERROR:
              return {
                ...snapshot,
                status: "error",
                error: event.data,
                input: void 0,
                _subscription: void 0
              };
            case XSTATE_OBSERVABLE_COMPLETE:
              return {
                ...snapshot,
                status: "done",
                input: void 0,
                _subscription: void 0
              };
            case dist_xstateGuards.XSTATE_STOP:
              snapshot._subscription.unsubscribe();
              return {
                ...snapshot,
                status: "stopped",
                input: void 0,
                _subscription: void 0
              };
            default:
              return snapshot;
          }
        },
        getInitialSnapshot: (_, input) => {
          return {
            status: "active",
            output: void 0,
            error: void 0,
            context: void 0,
            input,
            _subscription: void 0
          };
        },
        start: (state, {
          self: self2,
          system,
          emit: emit2
        }) => {
          if (state.status === "done") {
            return;
          }
          state._subscription = observableCreator({
            input: state.input,
            system,
            self: self2,
            emit: emit2
          }).subscribe({
            next: (value) => {
              system._relay(self2, self2, {
                type: XSTATE_OBSERVABLE_NEXT,
                data: value
              });
            },
            error: (err) => {
              system._relay(self2, self2, {
                type: XSTATE_OBSERVABLE_ERROR,
                data: err
              });
            },
            complete: () => {
              system._relay(self2, self2, {
                type: XSTATE_OBSERVABLE_COMPLETE
              });
            }
          });
        },
        getPersistedSnapshot: ({
          _subscription,
          ...state
        }) => state,
        restoreSnapshot: (state) => ({
          ...state,
          _subscription: void 0
        })
      };
      return logic;
    }
    function fromEventObservable2(lazyObservable) {
      const logic = {
        config: lazyObservable,
        transition: (state, event) => {
          if (state.status !== "active") {
            return state;
          }
          switch (event.type) {
            case XSTATE_OBSERVABLE_ERROR:
              return {
                ...state,
                status: "error",
                error: event.data,
                input: void 0,
                _subscription: void 0
              };
            case XSTATE_OBSERVABLE_COMPLETE:
              return {
                ...state,
                status: "done",
                input: void 0,
                _subscription: void 0
              };
            case dist_xstateGuards.XSTATE_STOP:
              state._subscription.unsubscribe();
              return {
                ...state,
                status: "stopped",
                input: void 0,
                _subscription: void 0
              };
            default:
              return state;
          }
        },
        getInitialSnapshot: (_, input) => {
          return {
            status: "active",
            output: void 0,
            error: void 0,
            context: void 0,
            input,
            _subscription: void 0
          };
        },
        start: (state, {
          self: self2,
          system,
          emit: emit2
        }) => {
          if (state.status === "done") {
            return;
          }
          state._subscription = lazyObservable({
            input: state.input,
            system,
            self: self2,
            emit: emit2
          }).subscribe({
            next: (value) => {
              if (self2._parent) {
                system._relay(self2, self2._parent, value);
              }
            },
            error: (err) => {
              system._relay(self2, self2, {
                type: XSTATE_OBSERVABLE_ERROR,
                data: err
              });
            },
            complete: () => {
              system._relay(self2, self2, {
                type: XSTATE_OBSERVABLE_COMPLETE
              });
            }
          });
        },
        getPersistedSnapshot: ({
          _subscription,
          ...snapshot
        }) => snapshot,
        restoreSnapshot: (snapshot) => ({
          ...snapshot,
          _subscription: void 0
        })
      };
      return logic;
    }
    var XSTATE_PROMISE_RESOLVE = "xstate.promise.resolve";
    var XSTATE_PROMISE_REJECT = "xstate.promise.reject";
    var controllerMap = /* @__PURE__ */ new WeakMap();
    function fromPromise2(promiseCreator) {
      const logic = {
        config: promiseCreator,
        transition: (state, event, scope) => {
          if (state.status !== "active") {
            return state;
          }
          switch (event.type) {
            case XSTATE_PROMISE_RESOLVE: {
              const resolvedValue = event.data;
              return {
                ...state,
                status: "done",
                output: resolvedValue,
                input: void 0
              };
            }
            case XSTATE_PROMISE_REJECT:
              return {
                ...state,
                status: "error",
                error: event.data,
                input: void 0
              };
            case dist_xstateGuards.XSTATE_STOP: {
              controllerMap.get(scope.self)?.abort();
              controllerMap.delete(scope.self);
              return {
                ...state,
                status: "stopped",
                input: void 0
              };
            }
            default:
              return state;
          }
        },
        start: (state, {
          self: self2,
          system,
          emit: emit2
        }) => {
          if (state.status !== "active") {
            return;
          }
          const controller = new AbortController();
          controllerMap.set(self2, controller);
          const resolvedPromise = Promise.resolve(promiseCreator({
            input: state.input,
            system,
            self: self2,
            signal: controller.signal,
            emit: emit2
          }));
          resolvedPromise.then((response) => {
            if (self2.getSnapshot().status !== "active") {
              return;
            }
            controllerMap.delete(self2);
            system._relay(self2, self2, {
              type: XSTATE_PROMISE_RESOLVE,
              data: response
            });
          }, (errorData) => {
            if (self2.getSnapshot().status !== "active") {
              return;
            }
            controllerMap.delete(self2);
            system._relay(self2, self2, {
              type: XSTATE_PROMISE_REJECT,
              data: errorData
            });
          });
        },
        getInitialSnapshot: (_, input) => {
          return {
            status: "active",
            output: void 0,
            error: void 0,
            input
          };
        },
        getPersistedSnapshot: (snapshot) => snapshot,
        restoreSnapshot: (snapshot) => snapshot
      };
      return logic;
    }
    var emptyLogic = fromTransition2((_) => void 0, void 0);
    function createEmptyActor2() {
      return dist_xstateGuards.createActor(emptyLogic);
    }
    exports.createEmptyActor = createEmptyActor2;
    exports.fromCallback = fromCallback2;
    exports.fromEventObservable = fromEventObservable2;
    exports.fromObservable = fromObservable2;
    exports.fromPromise = fromPromise2;
    exports.fromTransition = fromTransition2;
  }
});

// node_modules/.deno/xstate@5.32.2/node_modules/xstate/dist/assign-b5bc78f7.cjs.js
var require_assign_b5bc78f7_cjs = __commonJS({
  "node_modules/.deno/xstate@5.32.2/node_modules/xstate/dist/assign-b5bc78f7.cjs.js"(exports) {
    "use strict";
    var dist_xstateGuards = require_raise_c445379d_cjs();
    function createSpawner(actorScope, {
      machine,
      context
    }, event, spawnedChildren) {
      const spawn = (src2, options) => {
        if (typeof src2 === "string") {
          const logic = dist_xstateGuards.resolveReferencedActor(machine, src2);
          if (!logic) {
            throw new Error(`Actor logic '${src2}' not implemented in machine '${machine.id}'`);
          }
          const actorRef = dist_xstateGuards.createActor(logic, {
            id: options?.id,
            parent: actorScope.self,
            syncSnapshot: options?.syncSnapshot,
            input: typeof options?.input === "function" ? options.input({
              context,
              event,
              self: actorScope.self
            }) : options?.input,
            src: src2,
            systemId: options?.systemId
          });
          spawnedChildren[actorRef.id] = actorRef;
          return actorRef;
        } else {
          const actorRef = dist_xstateGuards.createActor(src2, {
            id: options?.id,
            parent: actorScope.self,
            syncSnapshot: options?.syncSnapshot,
            input: options?.input,
            src: src2,
            systemId: options?.systemId
          });
          return actorRef;
        }
      };
      return (src2, options) => {
        const actorRef = spawn(src2, options);
        spawnedChildren[actorRef.id] = actorRef;
        actorScope.defer(() => {
          if (actorRef._processingStatus === dist_xstateGuards.ProcessingStatus.Stopped) {
            return;
          }
          actorRef.start();
        });
        return actorRef;
      };
    }
    function resolveAssign(actorScope, snapshot, actionArgs, actionParams, {
      assignment
    }) {
      if (!snapshot.context) {
        throw new Error("Cannot assign to undefined `context`. Ensure that `context` is defined in the machine config.");
      }
      const spawnedChildren = {};
      const assignArgs = {
        context: snapshot.context,
        event: actionArgs.event,
        spawn: createSpawner(actorScope, snapshot, actionArgs.event, spawnedChildren),
        self: actorScope.self,
        system: actorScope.system
      };
      let partialUpdate = {};
      if (typeof assignment === "function") {
        partialUpdate = assignment(assignArgs, actionParams);
      } else {
        for (const key of Object.keys(assignment)) {
          const propAssignment = assignment[key];
          partialUpdate[key] = typeof propAssignment === "function" ? propAssignment(assignArgs, actionParams) : propAssignment;
        }
      }
      const updatedContext = Object.assign({}, snapshot.context, partialUpdate);
      return [dist_xstateGuards.cloneMachineSnapshot(snapshot, {
        context: updatedContext,
        children: Object.keys(spawnedChildren).length ? {
          ...snapshot.children,
          ...spawnedChildren
        } : snapshot.children
      }), void 0, void 0];
    }
    function assign2(assignment) {
      function assign3(_args, _params) {
      }
      assign3.type = "xstate.assign";
      assign3.assignment = assignment;
      assign3.resolve = resolveAssign;
      return assign3;
    }
    exports.assign = assign2;
  }
});

// node_modules/.deno/xstate@5.32.2/node_modules/xstate/dist/StateMachine-94d215e3.cjs.js
var require_StateMachine_94d215e3_cjs = __commonJS({
  "node_modules/.deno/xstate@5.32.2/node_modules/xstate/dist/StateMachine-94d215e3.cjs.js"(exports) {
    "use strict";
    var dist_xstateGuards = require_raise_c445379d_cjs();
    var assign2 = require_assign_b5bc78f7_cjs();
    var cache = /* @__PURE__ */ new WeakMap();
    function memo(object, key, fn) {
      let memoizedData = cache.get(object);
      if (!memoizedData) {
        memoizedData = {
          [key]: fn()
        };
        cache.set(object, memoizedData);
      } else if (!(key in memoizedData)) {
        memoizedData[key] = fn();
      }
      return memoizedData[key];
    }
    var EMPTY_OBJECT = {};
    var toSerializableAction = (action) => {
      if (typeof action === "string") {
        return {
          type: action
        };
      }
      if (typeof action === "function") {
        if ("resolve" in action) {
          return {
            type: action.type
          };
        }
        return {
          type: action.name
        };
      }
      return action;
    };
    var StateNode2 = class _StateNode {
      constructor(config, options) {
        this.config = config;
        this.key = void 0;
        this.id = void 0;
        this.type = void 0;
        this.path = void 0;
        this.states = void 0;
        this.history = void 0;
        this.entry = void 0;
        this.exit = void 0;
        this.parent = void 0;
        this.machine = void 0;
        this.meta = void 0;
        this.output = void 0;
        this.order = -1;
        this.description = void 0;
        this.tags = [];
        this.transitions = void 0;
        this.always = void 0;
        this.parent = options._parent;
        this.key = options._key;
        this.machine = options._machine;
        this.path = this.parent ? this.parent.path.concat(this.key) : [];
        this.id = this.config.id || [this.machine.id, ...this.path].join(dist_xstateGuards.STATE_DELIMITER);
        this.type = this.config.type || (this.config.states && Object.keys(this.config.states).length ? "compound" : this.config.history ? "history" : "atomic");
        this.description = this.config.description;
        this.order = this.machine.idMap.size;
        this.machine.idMap.set(this.id, this);
        this.states = this.config.states ? dist_xstateGuards.mapValues(this.config.states, (stateConfig, key) => {
          const stateNode = new _StateNode(stateConfig, {
            _parent: this,
            _key: key,
            _machine: this.machine
          });
          return stateNode;
        }) : EMPTY_OBJECT;
        if (this.type === "compound" && !this.config.initial) {
          throw new Error(`No initial state specified for compound state node "#${this.id}". Try adding { initial: "${Object.keys(this.states)[0]}" } to the state config.`);
        }
        this.history = this.config.history === true ? "shallow" : this.config.history || false;
        this.entry = dist_xstateGuards.toArray(this.config.entry).slice();
        this.exit = dist_xstateGuards.toArray(this.config.exit).slice();
        this.meta = this.config.meta;
        this.output = this.type === "final" || !this.parent ? this.config.output : void 0;
        this.tags = dist_xstateGuards.toArray(config.tags).slice();
      }
      /** @internal */
      _initialize() {
        this.transitions = dist_xstateGuards.formatTransitions(this);
        if (this.config.always) {
          this.always = dist_xstateGuards.toTransitionConfigArray(this.config.always).map((t) => dist_xstateGuards.formatTransition(this, dist_xstateGuards.NULL_EVENT, t));
        }
        Object.keys(this.states).forEach((key) => {
          this.states[key]._initialize();
        });
      }
      /** The well-structured state node definition. */
      get definition() {
        return {
          id: this.id,
          key: this.key,
          version: this.machine.version,
          type: this.type,
          initial: this.initial ? {
            target: this.initial.target,
            source: this,
            actions: this.initial.actions.map(toSerializableAction),
            eventType: null,
            reenter: false,
            toJSON: () => ({
              target: this.initial.target.map((t) => `#${t.id}`),
              source: `#${this.id}`,
              actions: this.initial.actions.map(toSerializableAction),
              eventType: null
            })
          } : void 0,
          history: this.history,
          states: dist_xstateGuards.mapValues(this.states, (state) => {
            return state.definition;
          }),
          on: this.on,
          transitions: [...this.transitions.values()].flat().map((t) => ({
            ...t,
            actions: t.actions.map(toSerializableAction)
          })),
          entry: this.entry.map(toSerializableAction),
          exit: this.exit.map(toSerializableAction),
          meta: this.meta,
          order: this.order || -1,
          output: this.output,
          invoke: this.invoke,
          description: this.description,
          tags: this.tags
        };
      }
      /** @internal */
      toJSON() {
        return this.definition;
      }
      /** The logic invoked as actors by this state node. */
      get invoke() {
        return memo(this, "invoke", () => dist_xstateGuards.toArray(this.config.invoke).map((invokeConfig, i) => {
          const {
            src: src2,
            systemId
          } = invokeConfig;
          const resolvedId = invokeConfig.id ?? dist_xstateGuards.createInvokeId(this.id, i);
          const sourceName = typeof src2 === "string" ? src2 : `xstate.invoke.${dist_xstateGuards.createInvokeId(this.id, i)}`;
          return {
            ...invokeConfig,
            src: sourceName,
            id: resolvedId,
            systemId,
            toJSON() {
              const {
                onDone,
                onError,
                ...invokeDefValues
              } = invokeConfig;
              return {
                ...invokeDefValues,
                type: "xstate.invoke",
                src: sourceName,
                id: resolvedId
              };
            }
          };
        }));
      }
      /** The mapping of events to transitions. */
      get on() {
        return memo(this, "on", () => {
          const transitions = this.transitions;
          return [...transitions].flatMap(([descriptor, t]) => t.map((t2) => [descriptor, t2])).reduce((map, [descriptor, transition2]) => {
            map[descriptor] = map[descriptor] || [];
            map[descriptor].push(transition2);
            return map;
          }, {});
        });
      }
      get after() {
        return memo(this, "delayedTransitions", () => dist_xstateGuards.getDelayedTransitions(this));
      }
      get initial() {
        return memo(this, "initial", () => dist_xstateGuards.formatInitialTransition(this, this.config.initial));
      }
      /** @internal */
      next(snapshot, event) {
        const eventType = event.type;
        const actions = [];
        let selectedTransition;
        const candidates = memo(this, `candidates-${eventType}`, () => dist_xstateGuards.getCandidates(this, eventType));
        for (const candidate of candidates) {
          const {
            guard
          } = candidate;
          const resolvedContext = snapshot.context;
          let guardPassed = false;
          try {
            guardPassed = !guard || dist_xstateGuards.evaluateGuard(guard, resolvedContext, event, snapshot);
          } catch (err) {
            const guardType = typeof guard === "string" ? guard : typeof guard === "object" ? guard.type : void 0;
            throw new Error(`Unable to evaluate guard ${guardType ? `'${guardType}' ` : ""}in transition for event '${eventType}' in state node '${this.id}':
${err.message}`);
          }
          if (guardPassed) {
            actions.push(...candidate.actions);
            selectedTransition = candidate;
            break;
          }
        }
        return selectedTransition ? [selectedTransition] : void 0;
      }
      /** All the event types accepted by this state node and its descendants. */
      get events() {
        return memo(this, "events", () => {
          const {
            states
          } = this;
          const events = new Set(this.ownEvents);
          if (states) {
            for (const stateId of Object.keys(states)) {
              const state = states[stateId];
              if (state.states) {
                for (const event of state.events) {
                  events.add(`${event}`);
                }
              }
            }
          }
          return Array.from(events);
        });
      }
      /**
       * All the events that have transitions directly from this state node.
       *
       * Excludes any inert events.
       */
      get ownEvents() {
        const keys = Object.keys(Object.fromEntries(this.transitions));
        const events = new Set(keys.filter((descriptor) => {
          return this.transitions.get(descriptor).some((transition2) => !(!transition2.target && !transition2.actions.length && !transition2.reenter));
        }));
        return Array.from(events);
      }
    };
    var STATE_IDENTIFIER = "#";
    var StateMachine2 = class _StateMachine {
      constructor(config, implementations) {
        this.config = config;
        this.version = void 0;
        this.schemas = void 0;
        this.implementations = void 0;
        this.options = void 0;
        this.__xstatenode = true;
        this.idMap = /* @__PURE__ */ new Map();
        this.root = void 0;
        this.id = void 0;
        this.states = void 0;
        this.events = void 0;
        this.id = config.id || "(machine)";
        this.implementations = {
          actors: implementations?.actors ?? {},
          actions: implementations?.actions ?? {},
          delays: implementations?.delays ?? {},
          guards: implementations?.guards ?? {}
        };
        this.version = this.config.version;
        this.schemas = this.config.schemas;
        this.options = {
          maxIterations: Infinity,
          ...this.config.options
        };
        this.transition = this.transition.bind(this);
        this.getInitialSnapshot = this.getInitialSnapshot.bind(this);
        this.getPersistedSnapshot = this.getPersistedSnapshot.bind(this);
        this.restoreSnapshot = this.restoreSnapshot.bind(this);
        this.start = this.start.bind(this);
        this.root = new StateNode2(config, {
          _key: this.id,
          _machine: this
        });
        this.root._initialize();
        dist_xstateGuards.formatRouteTransitions(this.root);
        this.states = this.root.states;
        this.events = this.root.events;
      }
      /**
       * Clones this state machine with the provided implementations.
       *
       * @param implementations Options (`actions`, `guards`, `actors`, `delays`) to
       *   recursively merge with the existing options.
       * @returns A new `StateMachine` instance with the provided implementations.
       */
      provide(implementations) {
        const {
          actions,
          guards,
          actors,
          delays
        } = this.implementations;
        return new _StateMachine(this.config, {
          actions: {
            ...actions,
            ...implementations.actions
          },
          guards: {
            ...guards,
            ...implementations.guards
          },
          actors: {
            ...actors,
            ...implementations.actors
          },
          delays: {
            ...delays,
            ...implementations.delays
          }
        });
      }
      resolveState(config) {
        const resolvedStateValue = dist_xstateGuards.resolveStateValue(this.root, config.value);
        const nodeSet = dist_xstateGuards.getAllStateNodes(dist_xstateGuards.getStateNodes(this.root, resolvedStateValue));
        return dist_xstateGuards.createMachineSnapshot({
          _nodes: [...nodeSet],
          context: config.context || {},
          children: {},
          status: dist_xstateGuards.isInFinalState(nodeSet, this.root) ? "done" : config.status || "active",
          output: config.output,
          error: config.error,
          historyValue: config.historyValue
        }, this);
      }
      /**
       * Determines the next snapshot given the current `snapshot` and received
       * `event`. Calculates a full macrostep from all microsteps.
       *
       * @param snapshot The current snapshot
       * @param event The received event
       */
      transition(snapshot, event, actorScope) {
        return dist_xstateGuards.macrostep(snapshot, event, actorScope, []).snapshot;
      }
      /**
       * Determines the next state given the current `state` and `event`. Calculates
       * a microstep.
       *
       * @param state The current state
       * @param event The received event
       */
      microstep(snapshot, event, actorScope) {
        return dist_xstateGuards.macrostep(snapshot, event, actorScope, []).microsteps.map(([s]) => s);
      }
      getTransitionData(snapshot, event) {
        return dist_xstateGuards.transitionNode(this.root, snapshot.value, snapshot, event) || [];
      }
      /**
       * The initial state _before_ evaluating any microsteps. This "pre-initial"
       * state is provided to initial actions executed in the initial state.
       *
       * @internal
       */
      _getPreInitialState(actorScope, initEvent, internalQueue) {
        const {
          context
        } = this.config;
        const preInitial = dist_xstateGuards.createMachineSnapshot({
          context: typeof context !== "function" && context ? context : {},
          _nodes: [this.root],
          children: {},
          status: "active"
        }, this);
        if (typeof context === "function") {
          const assignment = ({
            spawn,
            event,
            self: self2
          }) => context({
            spawn,
            input: event.input,
            self: self2
          });
          return dist_xstateGuards.resolveActionsAndContext(preInitial, initEvent, actorScope, [assign2.assign(assignment)], internalQueue, void 0);
        }
        return preInitial;
      }
      /**
       * Returns the initial `State` instance, with reference to `self` as an
       * `ActorRef`.
       */
      getInitialSnapshot(actorScope, input) {
        const initEvent = dist_xstateGuards.createInitEvent(input);
        const internalQueue = [];
        const preInitialState = this._getPreInitialState(actorScope, initEvent, internalQueue);
        const [nextState] = dist_xstateGuards.initialMicrostep(this.root, preInitialState, actorScope, initEvent, internalQueue);
        const {
          snapshot: macroState
        } = dist_xstateGuards.macrostep(nextState, initEvent, actorScope, internalQueue);
        return macroState;
      }
      start(snapshot) {
        Object.values(snapshot.children).forEach((child) => {
          if (child.getSnapshot().status === "active") {
            child.start();
          }
        });
      }
      getStateNodeById(stateId) {
        const fullPath = dist_xstateGuards.toStatePath(stateId);
        const relativePath = fullPath.slice(1);
        const resolvedStateId = dist_xstateGuards.isStateId(fullPath[0]) ? fullPath[0].slice(STATE_IDENTIFIER.length) : fullPath[0];
        const stateNode = this.idMap.get(resolvedStateId);
        if (!stateNode) {
          throw new Error(`Child state node '#${resolvedStateId}' does not exist on machine '${this.id}'`);
        }
        return dist_xstateGuards.getStateNodeByPath(stateNode, relativePath);
      }
      get definition() {
        return this.root.definition;
      }
      toJSON() {
        return this.definition;
      }
      getPersistedSnapshot(snapshot, options) {
        return dist_xstateGuards.getPersistedSnapshot(snapshot, options);
      }
      restoreSnapshot(snapshot, _actorScope) {
        const children = {};
        const snapshotChildren = snapshot.children;
        Object.keys(snapshotChildren).forEach((actorId) => {
          const actorData = snapshotChildren[actorId];
          const childState = actorData.snapshot;
          const src2 = actorData.src;
          const logic = typeof src2 === "string" ? dist_xstateGuards.resolveReferencedActor(this, src2) : src2;
          if (!logic) {
            return;
          }
          const actorRef = dist_xstateGuards.createActor(logic, {
            id: actorId,
            parent: _actorScope.self,
            syncSnapshot: actorData.syncSnapshot,
            snapshot: childState,
            src: src2,
            systemId: actorData.systemId
          });
          children[actorId] = actorRef;
        });
        function resolveHistoryReferencedState(root, referenced) {
          if (referenced instanceof StateNode2) {
            return referenced;
          }
          try {
            return root.machine.getStateNodeById(referenced.id);
          } catch {
          }
        }
        function reviveHistoryValue(root, historyValue) {
          if (!historyValue || typeof historyValue !== "object") {
            return {};
          }
          const revived = {};
          for (const key in historyValue) {
            const arr = historyValue[key];
            for (const item of arr) {
              const resolved = resolveHistoryReferencedState(root, item);
              if (!resolved) {
                continue;
              }
              revived[key] ??= [];
              revived[key].push(resolved);
            }
          }
          return revived;
        }
        const revivedHistoryValue = reviveHistoryValue(this.root, snapshot.historyValue);
        const restoredSnapshot = dist_xstateGuards.createMachineSnapshot({
          ...snapshot,
          children,
          _nodes: Array.from(dist_xstateGuards.getAllStateNodes(dist_xstateGuards.getStateNodes(this.root, snapshot.value))),
          historyValue: revivedHistoryValue
        }, this);
        const seen = /* @__PURE__ */ new Set();
        function reviveContext(contextPart, children2) {
          if (seen.has(contextPart)) {
            return;
          }
          seen.add(contextPart);
          for (const key in contextPart) {
            const value = contextPart[key];
            if (value && typeof value === "object") {
              if ("xstate$$type" in value && value.xstate$$type === dist_xstateGuards.$$ACTOR_TYPE) {
                contextPart[key] = children2[value.id];
                continue;
              }
              reviveContext(value, children2);
            }
          }
        }
        reviveContext(restoredSnapshot.context, children);
        return restoredSnapshot;
      }
    };
    exports.StateMachine = StateMachine2;
    exports.StateNode = StateNode2;
  }
});

// node_modules/.deno/xstate@5.32.2/node_modules/xstate/dist/log-c94995c7.cjs.js
var require_log_c94995c7_cjs = __commonJS({
  "node_modules/.deno/xstate@5.32.2/node_modules/xstate/dist/log-c94995c7.cjs.js"(exports) {
    "use strict";
    var dist_xstateGuards = require_raise_c445379d_cjs();
    var assign2 = require_assign_b5bc78f7_cjs();
    function resolveEmit(_, snapshot, args, actionParams, {
      event: eventOrExpr
    }) {
      const resolvedEvent = typeof eventOrExpr === "function" ? eventOrExpr(args, actionParams) : eventOrExpr;
      return [snapshot, {
        event: resolvedEvent
      }, void 0];
    }
    function executeEmit(actorScope, {
      event
    }) {
      actorScope.defer(() => actorScope.emit(event));
    }
    function emit2(eventOrExpr) {
      function emit3(_args, _params) {
      }
      emit3.type = "xstate.emit";
      emit3.event = eventOrExpr;
      emit3.resolve = resolveEmit;
      emit3.execute = executeEmit;
      return emit3;
    }
    var SpecialTargets2 = /* @__PURE__ */ (function(SpecialTargets3) {
      SpecialTargets3["Parent"] = "#_parent";
      SpecialTargets3["Internal"] = "#_internal";
      return SpecialTargets3;
    })({});
    function resolveSendTo(actorScope, snapshot, args, actionParams, {
      to,
      event: eventOrExpr,
      id,
      delay
    }, extra) {
      const delaysMap = snapshot.machine.implementations.delays;
      if (typeof eventOrExpr === "string") {
        throw new Error(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `Only event objects may be used with sendTo; use sendTo({ type: "${eventOrExpr}" }) instead`
        );
      }
      const resolvedEvent = typeof eventOrExpr === "function" ? eventOrExpr(args, actionParams) : eventOrExpr;
      let resolvedDelay;
      if (typeof delay === "string") {
        const configDelay = delaysMap && delaysMap[delay];
        resolvedDelay = typeof configDelay === "function" ? configDelay(args, actionParams) : configDelay;
      } else {
        resolvedDelay = typeof delay === "function" ? delay(args, actionParams) : delay;
      }
      const resolvedTarget = typeof to === "function" ? to(args, actionParams) : to;
      let targetActorRef;
      if (typeof resolvedTarget === "string") {
        if (resolvedTarget === SpecialTargets2.Parent) {
          targetActorRef = actorScope.self._parent;
        } else if (resolvedTarget === SpecialTargets2.Internal) {
          targetActorRef = actorScope.self;
        } else if (resolvedTarget.startsWith("#_")) {
          targetActorRef = snapshot.children[resolvedTarget.slice(2)];
        } else {
          targetActorRef = extra.deferredActorIds?.includes(resolvedTarget) ? resolvedTarget : snapshot.children[resolvedTarget];
        }
        if (!targetActorRef) {
          throw new Error(`Unable to send event to actor '${resolvedTarget}' from machine '${snapshot.machine.id}'.`);
        }
      } else {
        targetActorRef = resolvedTarget || actorScope.self;
      }
      return [snapshot, {
        to: targetActorRef,
        targetId: typeof resolvedTarget === "string" ? resolvedTarget : void 0,
        event: resolvedEvent,
        id,
        delay: resolvedDelay
      }, void 0];
    }
    function retryResolveSendTo(_, snapshot, params) {
      if (typeof params.to === "string") {
        params.to = snapshot.children[params.to];
      }
    }
    function executeSendTo(actorScope, params) {
      actorScope.defer(() => {
        const {
          to,
          event,
          delay,
          id
        } = params;
        if (typeof delay === "number") {
          actorScope.system.scheduler.schedule(actorScope.self, to, event, delay, id);
          return;
        }
        actorScope.system._relay(
          actorScope.self,
          // at this point, in a deferred task, it should already be mutated by retryResolveSendTo
          // if it initially started as a string
          to,
          event.type === dist_xstateGuards.XSTATE_ERROR ? dist_xstateGuards.createErrorActorEvent(actorScope.self.id, event.data) : event
        );
      });
    }
    function sendTo2(to, eventOrExpr, options) {
      function sendTo3(_args, _params) {
      }
      sendTo3.type = "xstate.sendTo";
      sendTo3.to = to;
      sendTo3.event = eventOrExpr;
      sendTo3.id = options?.id;
      sendTo3.delay = options?.delay;
      sendTo3.resolve = resolveSendTo;
      sendTo3.retryResolve = retryResolveSendTo;
      sendTo3.execute = executeSendTo;
      return sendTo3;
    }
    function sendParent2(event, options) {
      return sendTo2(SpecialTargets2.Parent, event, options);
    }
    function forwardTo2(target2, options) {
      return sendTo2(target2, ({
        event
      }) => event, options);
    }
    function resolveEnqueueActions(actorScope, snapshot, args, actionParams, {
      collect
    }) {
      const actions = [];
      const enqueue = function enqueue2(action) {
        actions.push(action);
      };
      enqueue.assign = (...args2) => {
        actions.push(assign2.assign(...args2));
      };
      enqueue.cancel = (...args2) => {
        actions.push(dist_xstateGuards.cancel(...args2));
      };
      enqueue.raise = (...args2) => {
        actions.push(dist_xstateGuards.raise(...args2));
      };
      enqueue.sendTo = (...args2) => {
        actions.push(sendTo2(...args2));
      };
      enqueue.sendParent = (...args2) => {
        actions.push(sendParent2(...args2));
      };
      enqueue.spawnChild = (...args2) => {
        actions.push(dist_xstateGuards.spawnChild(...args2));
      };
      enqueue.stopChild = (...args2) => {
        actions.push(dist_xstateGuards.stopChild(...args2));
      };
      enqueue.emit = (...args2) => {
        actions.push(emit2(...args2));
      };
      collect({
        context: args.context,
        event: args.event,
        enqueue,
        check: (guard) => dist_xstateGuards.evaluateGuard(guard, snapshot.context, args.event, snapshot),
        self: actorScope.self,
        system: actorScope.system
      }, actionParams);
      return [snapshot, void 0, actions];
    }
    function enqueueActions2(collect) {
      function enqueueActions3(_args, _params) {
      }
      enqueueActions3.type = "xstate.enqueueActions";
      enqueueActions3.collect = collect;
      enqueueActions3.resolve = resolveEnqueueActions;
      return enqueueActions3;
    }
    function resolveLog(_, snapshot, actionArgs, actionParams, {
      value,
      label
    }) {
      return [snapshot, {
        value: typeof value === "function" ? value(actionArgs, actionParams) : value,
        label
      }, void 0];
    }
    function executeLog({
      logger
    }, {
      value,
      label
    }) {
      if (label) {
        logger(label, value);
      } else {
        logger(value);
      }
    }
    function log3(value = ({
      context,
      event
    }) => ({
      context,
      event
    }), label) {
      function log4(_args, _params) {
      }
      log4.type = "xstate.log";
      log4.value = value;
      log4.label = label;
      log4.resolve = resolveLog;
      log4.execute = executeLog;
      return log4;
    }
    exports.SpecialTargets = SpecialTargets2;
    exports.emit = emit2;
    exports.enqueueActions = enqueueActions2;
    exports.forwardTo = forwardTo2;
    exports.log = log3;
    exports.sendParent = sendParent2;
    exports.sendTo = sendTo2;
  }
});

// node_modules/.deno/xstate@5.32.2/node_modules/xstate/dist/xstate.cjs.js
var require_xstate_cjs = __commonJS({
  "node_modules/.deno/xstate@5.32.2/node_modules/xstate/dist/xstate.cjs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dist_xstateActors = require_xstate_actors_cjs();
    var dist_xstateGuards = require_raise_c445379d_cjs();
    var StateMachine2 = require_StateMachine_94d215e3_cjs();
    var assign2 = require_assign_b5bc78f7_cjs();
    var log3 = require_log_c94995c7_cjs();
    require_xstate_dev_cjs();
    function assertEvent2(event, type) {
      const types = dist_xstateGuards.toArray(type);
      const matches = types.some((descriptor) => dist_xstateGuards.matchesEventDescriptor(event.type, descriptor));
      if (!matches) {
        const typesText = types.length === 1 ? `type matching "${types[0]}"` : `one of types matching "${types.join('", "')}"`;
        throw new Error(`Expected event ${JSON.stringify(event)} to have ${typesText}`);
      }
    }
    function createMachine2(config, implementations) {
      return new StateMachine2.StateMachine(config, implementations);
    }
    function mapState2(snapshot, mapper) {
      const results = [];
      const findMapper = (currentMapper, nodePath) => {
        let mapper2 = currentMapper;
        for (const key of nodePath) {
          if (!mapper2?.states) {
            return void 0;
          }
          const states = mapper2.states;
          if (!(key in states)) {
            return void 0;
          }
          mapper2 = states[key];
        }
        return mapper2;
      };
      const visited = /* @__PURE__ */ new Set();
      for (const atomicNode of snapshot._nodes.filter(dist_xstateGuards.isAtomicStateNode)) {
        let current = atomicNode;
        while (current && !visited.has(current)) {
          visited.add(current);
          const nodeMapper = findMapper(mapper, current.path);
          if (nodeMapper?.map) {
            results.push({
              stateNode: current,
              result: nodeMapper.map(snapshot)
            });
          }
          current = current.parent;
        }
      }
      return results;
    }
    function createInertActorScope(actorLogic) {
      const self2 = dist_xstateGuards.createActor(actorLogic);
      const inertActorScope = {
        self: self2,
        defer: () => {
        },
        id: "",
        logger: () => {
        },
        sessionId: "",
        stopChild: () => {
        },
        system: self2.system,
        emit: () => {
        },
        actionExecutor: () => {
        }
      };
      return inertActorScope;
    }
    function getInitialSnapshot2(actorLogic, ...[input]) {
      const actorScope = createInertActorScope(actorLogic);
      return actorLogic.getInitialSnapshot(actorScope, input);
    }
    function getNextSnapshot2(actorLogic, snapshot, event) {
      const inertActorScope = createInertActorScope(actorLogic);
      inertActorScope.self._snapshot = snapshot;
      return actorLogic.transition(snapshot, event, inertActorScope);
    }
    function setup2({
      schemas,
      actors,
      actions,
      guards,
      delays
    }) {
      return {
        assign: assign2.assign,
        sendTo: log3.sendTo,
        raise: dist_xstateGuards.raise,
        log: log3.log,
        cancel: dist_xstateGuards.cancel,
        stopChild: dist_xstateGuards.stopChild,
        enqueueActions: log3.enqueueActions,
        emit: log3.emit,
        spawnChild: dist_xstateGuards.spawnChild,
        createStateConfig: (config) => config,
        createAction: (fn) => fn,
        createMachine: (config) => createMachine2({
          ...config,
          schemas
        }, {
          actors,
          actions,
          guards,
          delays
        }),
        extend: (extended) => setup2({
          schemas,
          actors,
          actions: {
            ...actions,
            ...extended.actions
          },
          guards: {
            ...guards,
            ...extended.guards
          },
          delays: {
            ...delays,
            ...extended.delays
          }
        })
      };
    }
    var SimulatedClock2 = class {
      constructor() {
        this.timeouts = /* @__PURE__ */ new Map();
        this._now = 0;
        this._id = 0;
        this._flushing = false;
        this._flushingInvalidated = false;
      }
      now() {
        return this._now;
      }
      getId() {
        return this._id++;
      }
      setTimeout(fn, timeout) {
        this._flushingInvalidated = this._flushing;
        const id = this.getId();
        this.timeouts.set(id, {
          start: this.now(),
          timeout,
          fn
        });
        return id;
      }
      clearTimeout(id) {
        this._flushingInvalidated = this._flushing;
        this.timeouts.delete(id);
      }
      set(time) {
        if (this._now > time) {
          throw new Error("Unable to travel back in time");
        }
        this._now = time;
        this.flushTimeouts();
      }
      flushTimeouts() {
        if (this._flushing) {
          this._flushingInvalidated = true;
          return;
        }
        this._flushing = true;
        const sorted = [...this.timeouts].sort(([_idA, timeoutA], [_idB, timeoutB]) => {
          const endA = timeoutA.start + timeoutA.timeout;
          const endB = timeoutB.start + timeoutB.timeout;
          return endB > endA ? -1 : 1;
        });
        for (const [id, timeout] of sorted) {
          if (this._flushingInvalidated) {
            this._flushingInvalidated = false;
            this._flushing = false;
            this.flushTimeouts();
            return;
          }
          if (this.now() - timeout.start >= timeout.timeout) {
            this.timeouts.delete(id);
            timeout.fn.call(null);
          }
        }
        this._flushing = false;
      }
      increment(ms) {
        this._now += ms;
        this.flushTimeouts();
      }
    };
    function toPromise2(actor) {
      return new Promise((resolve, reject) => {
        actor.subscribe({
          complete: () => {
            resolve(actor.getSnapshot().output);
          },
          error: reject
        });
      });
    }
    function transition2(logic, snapshot, event) {
      const executableActions = [];
      const actorScope = createInertActorScope(logic);
      actorScope.actionExecutor = (action) => {
        executableActions.push(action);
      };
      const nextSnapshot = logic.transition(snapshot, event, actorScope);
      return [nextSnapshot, executableActions];
    }
    function initialTransition2(logic, ...[input]) {
      const executableActions = [];
      const actorScope = createInertActorScope(logic);
      actorScope.actionExecutor = (action) => {
        executableActions.push(action);
      };
      const nextSnapshot = logic.getInitialSnapshot(actorScope, input);
      return [nextSnapshot, executableActions];
    }
    function getMicrosteps2(machine, snapshot, event) {
      const actorScope = createInertActorScope(machine);
      const {
        microsteps
      } = dist_xstateGuards.macrostep(snapshot, event, actorScope, []);
      return microsteps;
    }
    function getInitialMicrosteps2(machine, ...[input]) {
      const actorScope = createInertActorScope(machine);
      const initEvent = dist_xstateGuards.createInitEvent(input);
      const internalQueue = [];
      const preInitialSnapshot = machine._getPreInitialState(actorScope, initEvent, internalQueue);
      const first = dist_xstateGuards.initialMicrostep(machine.root, preInitialSnapshot, actorScope, initEvent, internalQueue);
      const {
        microsteps
      } = dist_xstateGuards.macrostep(first[0], initEvent, actorScope, internalQueue);
      return [first, ...microsteps];
    }
    function getNextTransitions2(state) {
      const potentialTransitions = [];
      const atomicStates = state._nodes.filter(dist_xstateGuards.isAtomicStateNode);
      const visited = /* @__PURE__ */ new Set();
      for (const stateNode of atomicStates) {
        for (const s of [stateNode].concat(dist_xstateGuards.getProperAncestors(stateNode, void 0))) {
          if (visited.has(s.id)) {
            continue;
          }
          visited.add(s.id);
          for (const [, transitions] of s.transitions) {
            potentialTransitions.push(...transitions);
          }
          if (s.always) {
            potentialTransitions.push(...s.always);
          }
        }
      }
      return potentialTransitions;
    }
    var defaultWaitForOptions = {
      timeout: Infinity
      // much more than 10 seconds
    };
    function waitFor2(actorRef, predicate, options) {
      const resolvedOptions = {
        ...defaultWaitForOptions,
        ...options
      };
      return new Promise((res, rej) => {
        const {
          signal
        } = resolvedOptions;
        if (signal?.aborted) {
          rej(signal.reason);
          return;
        }
        let done = false;
        const handle2 = resolvedOptions.timeout === Infinity ? void 0 : setTimeout(() => {
          dispose();
          rej(new Error(`Timeout of ${resolvedOptions.timeout} ms exceeded`));
        }, resolvedOptions.timeout);
        const dispose = () => {
          clearTimeout(handle2);
          done = true;
          sub?.unsubscribe();
          if (abortListener) {
            signal.removeEventListener("abort", abortListener);
          }
        };
        function checkEmitted(emitted) {
          if (predicate(emitted)) {
            dispose();
            res(emitted);
          }
        }
        let abortListener;
        let sub;
        checkEmitted(actorRef.getSnapshot());
        if (done) {
          return;
        }
        if (signal) {
          abortListener = () => {
            dispose();
            rej(signal.reason);
          };
          signal.addEventListener("abort", abortListener);
        }
        sub = actorRef.subscribe({
          next: checkEmitted,
          error: (err) => {
            dispose();
            rej(err);
          },
          complete: () => {
            dispose();
            rej(new Error(`Actor terminated without satisfying predicate`));
          }
        });
        if (done) {
          sub.unsubscribe();
        }
      });
    }
    exports.createEmptyActor = dist_xstateActors.createEmptyActor;
    exports.fromCallback = dist_xstateActors.fromCallback;
    exports.fromEventObservable = dist_xstateActors.fromEventObservable;
    exports.fromObservable = dist_xstateActors.fromObservable;
    exports.fromPromise = dist_xstateActors.fromPromise;
    exports.fromTransition = dist_xstateActors.fromTransition;
    exports.Actor = dist_xstateGuards.Actor;
    exports.__unsafe_getAllOwnEventDescriptors = dist_xstateGuards.getAllOwnEventDescriptors;
    exports.and = dist_xstateGuards.and;
    exports.cancel = dist_xstateGuards.cancel;
    exports.createActor = dist_xstateGuards.createActor;
    exports.getStateNodes = dist_xstateGuards.getStateNodes;
    exports.interpret = dist_xstateGuards.interpret;
    exports.isMachineSnapshot = dist_xstateGuards.isMachineSnapshot;
    exports.matchesState = dist_xstateGuards.matchesState;
    exports.not = dist_xstateGuards.not;
    exports.or = dist_xstateGuards.or;
    exports.pathToStateValue = dist_xstateGuards.pathToStateValue;
    exports.raise = dist_xstateGuards.raise;
    exports.spawnChild = dist_xstateGuards.spawnChild;
    exports.stateIn = dist_xstateGuards.stateIn;
    exports.stop = dist_xstateGuards.stop;
    exports.stopChild = dist_xstateGuards.stopChild;
    exports.toObserver = dist_xstateGuards.toObserver;
    exports.StateMachine = StateMachine2.StateMachine;
    exports.StateNode = StateMachine2.StateNode;
    exports.assign = assign2.assign;
    exports.SpecialTargets = log3.SpecialTargets;
    exports.emit = log3.emit;
    exports.enqueueActions = log3.enqueueActions;
    exports.forwardTo = log3.forwardTo;
    exports.log = log3.log;
    exports.sendParent = log3.sendParent;
    exports.sendTo = log3.sendTo;
    exports.SimulatedClock = SimulatedClock2;
    exports.assertEvent = assertEvent2;
    exports.createMachine = createMachine2;
    exports.getInitialMicrosteps = getInitialMicrosteps2;
    exports.getInitialSnapshot = getInitialSnapshot2;
    exports.getMicrosteps = getMicrosteps2;
    exports.getNextSnapshot = getNextSnapshot2;
    exports.getNextTransitions = getNextTransitions2;
    exports.initialTransition = initialTransition2;
    exports.mapState = mapState2;
    exports.setup = setup2;
    exports.toPromise = toPromise2;
    exports.transition = transition2;
    exports.waitFor = waitFor2;
  }
});

// node_modules/.deno/@noble+hashes@1.8.0/node_modules/@noble/hashes/crypto.js
var require_crypto = __commonJS({
  "node_modules/.deno/@noble+hashes@1.8.0/node_modules/@noble/hashes/crypto.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.crypto = void 0;
    exports.crypto = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
  }
});

// node_modules/.deno/@noble+hashes@1.8.0/node_modules/@noble/hashes/utils.js
var require_utils = __commonJS({
  "node_modules/.deno/@noble+hashes@1.8.0/node_modules/@noble/hashes/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wrapXOFConstructorWithOpts = exports.wrapConstructorWithOpts = exports.wrapConstructor = exports.Hash = exports.nextTick = exports.swap32IfBE = exports.byteSwapIfBE = exports.swap8IfBE = exports.isLE = void 0;
    exports.isBytes = isBytes;
    exports.anumber = anumber;
    exports.abytes = abytes;
    exports.ahash = ahash;
    exports.aexists = aexists;
    exports.aoutput = aoutput;
    exports.u8 = u8;
    exports.u32 = u32;
    exports.clean = clean;
    exports.createView = createView;
    exports.rotr = rotr;
    exports.rotl = rotl;
    exports.byteSwap = byteSwap;
    exports.byteSwap32 = byteSwap32;
    exports.bytesToHex = bytesToHex;
    exports.hexToBytes = hexToBytes;
    exports.asyncLoop = asyncLoop;
    exports.utf8ToBytes = utf8ToBytes;
    exports.bytesToUtf8 = bytesToUtf8;
    exports.toBytes = toBytes;
    exports.kdfInputToBytes = kdfInputToBytes;
    exports.concatBytes = concatBytes2;
    exports.checkOpts = checkOpts;
    exports.createHasher = createHasher;
    exports.createOptHasher = createOptHasher;
    exports.createXOFer = createXOFer;
    exports.randomBytes = randomBytes;
    var crypto_1 = require_crypto();
    function isBytes(a) {
      return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
    }
    function anumber(n) {
      if (!Number.isSafeInteger(n) || n < 0)
        throw new Error("positive integer expected, got " + n);
    }
    function abytes(b, ...lengths) {
      if (!isBytes(b))
        throw new Error("Uint8Array expected");
      if (lengths.length > 0 && !lengths.includes(b.length))
        throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
    }
    function ahash(h) {
      if (typeof h !== "function" || typeof h.create !== "function")
        throw new Error("Hash should be wrapped by utils.createHasher");
      anumber(h.outputLen);
      anumber(h.blockLen);
    }
    function aexists(instance, checkFinished = true) {
      if (instance.destroyed)
        throw new Error("Hash instance has been destroyed");
      if (checkFinished && instance.finished)
        throw new Error("Hash#digest() has already been called");
    }
    function aoutput(out, instance) {
      abytes(out);
      const min = instance.outputLen;
      if (out.length < min) {
        throw new Error("digestInto() expects output buffer of length at least " + min);
      }
    }
    function u8(arr) {
      return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
    }
    function u32(arr) {
      return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
    }
    function clean(...arrays) {
      for (let i = 0; i < arrays.length; i++) {
        arrays[i].fill(0);
      }
    }
    function createView(arr) {
      return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
    }
    function rotr(word, shift) {
      return word << 32 - shift | word >>> shift;
    }
    function rotl(word, shift) {
      return word << shift | word >>> 32 - shift >>> 0;
    }
    exports.isLE = (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
    function byteSwap(word) {
      return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
    }
    exports.swap8IfBE = exports.isLE ? (n) => n : (n) => byteSwap(n);
    exports.byteSwapIfBE = exports.swap8IfBE;
    function byteSwap32(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = byteSwap(arr[i]);
      }
      return arr;
    }
    exports.swap32IfBE = exports.isLE ? (u) => u : byteSwap32;
    var hasHexBuiltin = /* @__PURE__ */ (() => (
      // @ts-ignore
      typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
    ))();
    var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
    function bytesToHex(bytes) {
      abytes(bytes);
      if (hasHexBuiltin)
        return bytes.toHex();
      let hex = "";
      for (let i = 0; i < bytes.length; i++) {
        hex += hexes[bytes[i]];
      }
      return hex;
    }
    var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
    function asciiToBase16(ch) {
      if (ch >= asciis._0 && ch <= asciis._9)
        return ch - asciis._0;
      if (ch >= asciis.A && ch <= asciis.F)
        return ch - (asciis.A - 10);
      if (ch >= asciis.a && ch <= asciis.f)
        return ch - (asciis.a - 10);
      return;
    }
    function hexToBytes(hex) {
      if (typeof hex !== "string")
        throw new Error("hex string expected, got " + typeof hex);
      if (hasHexBuiltin)
        return Uint8Array.fromHex(hex);
      const hl = hex.length;
      const al = hl / 2;
      if (hl % 2)
        throw new Error("hex string expected, got unpadded hex of length " + hl);
      const array = new Uint8Array(al);
      for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
        const n1 = asciiToBase16(hex.charCodeAt(hi));
        const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
        if (n1 === void 0 || n2 === void 0) {
          const char = hex[hi] + hex[hi + 1];
          throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
        }
        array[ai] = n1 * 16 + n2;
      }
      return array;
    }
    var nextTick = async () => {
    };
    exports.nextTick = nextTick;
    async function asyncLoop(iters, tick, cb) {
      let ts = Date.now();
      for (let i = 0; i < iters; i++) {
        cb(i);
        const diff2 = Date.now() - ts;
        if (diff2 >= 0 && diff2 < tick)
          continue;
        await (0, exports.nextTick)();
        ts += diff2;
      }
    }
    function utf8ToBytes(str) {
      if (typeof str !== "string")
        throw new Error("string expected");
      return new Uint8Array(new TextEncoder().encode(str));
    }
    function bytesToUtf8(bytes) {
      return new TextDecoder().decode(bytes);
    }
    function toBytes(data) {
      if (typeof data === "string")
        data = utf8ToBytes(data);
      abytes(data);
      return data;
    }
    function kdfInputToBytes(data) {
      if (typeof data === "string")
        data = utf8ToBytes(data);
      abytes(data);
      return data;
    }
    function concatBytes2(...arrays) {
      let sum = 0;
      for (let i = 0; i < arrays.length; i++) {
        const a = arrays[i];
        abytes(a);
        sum += a.length;
      }
      const res = new Uint8Array(sum);
      for (let i = 0, pad = 0; i < arrays.length; i++) {
        const a = arrays[i];
        res.set(a, pad);
        pad += a.length;
      }
      return res;
    }
    function checkOpts(defaults, opts) {
      if (opts !== void 0 && {}.toString.call(opts) !== "[object Object]")
        throw new Error("options should be object or undefined");
      const merged = Object.assign(defaults, opts);
      return merged;
    }
    var Hash = class {
    };
    exports.Hash = Hash;
    function createHasher(hashCons) {
      const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
      const tmp = hashCons();
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = () => hashCons();
      return hashC;
    }
    function createOptHasher(hashCons) {
      const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
      const tmp = hashCons({});
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = (opts) => hashCons(opts);
      return hashC;
    }
    function createXOFer(hashCons) {
      const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
      const tmp = hashCons({});
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = (opts) => hashCons(opts);
      return hashC;
    }
    exports.wrapConstructor = createHasher;
    exports.wrapConstructorWithOpts = createOptHasher;
    exports.wrapXOFConstructorWithOpts = createXOFer;
    function randomBytes(bytesLength = 32) {
      if (crypto_1.crypto && typeof crypto_1.crypto.getRandomValues === "function") {
        return crypto_1.crypto.getRandomValues(new Uint8Array(bytesLength));
      }
      if (crypto_1.crypto && typeof crypto_1.crypto.randomBytes === "function") {
        return Uint8Array.from(crypto_1.crypto.randomBytes(bytesLength));
      }
      throw new Error("crypto.getRandomValues must be defined");
    }
  }
});

// node_modules/.deno/@noble+hashes@1.8.0/node_modules/@noble/hashes/_md.js
var require_md = __commonJS({
  "node_modules/.deno/@noble+hashes@1.8.0/node_modules/@noble/hashes/_md.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SHA512_IV = exports.SHA384_IV = exports.SHA224_IV = exports.SHA256_IV = exports.HashMD = void 0;
    exports.setBigUint64 = setBigUint64;
    exports.Chi = Chi;
    exports.Maj = Maj;
    var utils_ts_1 = require_utils();
    function setBigUint64(view3, byteOffset, value, isLE) {
      if (typeof view3.setBigUint64 === "function")
        return view3.setBigUint64(byteOffset, value, isLE);
      const _32n = BigInt(32);
      const _u32_max = BigInt(4294967295);
      const wh = Number(value >> _32n & _u32_max);
      const wl = Number(value & _u32_max);
      const h = isLE ? 4 : 0;
      const l = isLE ? 0 : 4;
      view3.setUint32(byteOffset + h, wh, isLE);
      view3.setUint32(byteOffset + l, wl, isLE);
    }
    function Chi(a, b, c) {
      return a & b ^ ~a & c;
    }
    function Maj(a, b, c) {
      return a & b ^ a & c ^ b & c;
    }
    var HashMD = class extends utils_ts_1.Hash {
      constructor(blockLen, outputLen, padOffset, isLE) {
        super();
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE;
        this.buffer = new Uint8Array(blockLen);
        this.view = (0, utils_ts_1.createView)(this.buffer);
      }
      update(data) {
        (0, utils_ts_1.aexists)(this);
        data = (0, utils_ts_1.toBytes)(data);
        (0, utils_ts_1.abytes)(data);
        const { view: view3, buffer, blockLen } = this;
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          if (take === blockLen) {
            const dataView2 = (0, utils_ts_1.createView)(data);
            for (; blockLen <= len - pos; pos += blockLen)
              this.process(dataView2, pos);
            continue;
          }
          buffer.set(data.subarray(pos, pos + take), this.pos);
          this.pos += take;
          pos += take;
          if (this.pos === blockLen) {
            this.process(view3, 0);
            this.pos = 0;
          }
        }
        this.length += data.length;
        this.roundClean();
        return this;
      }
      digestInto(out) {
        (0, utils_ts_1.aexists)(this);
        (0, utils_ts_1.aoutput)(out, this);
        this.finished = true;
        const { buffer, view: view3, blockLen, isLE } = this;
        let { pos } = this;
        buffer[pos++] = 128;
        (0, utils_ts_1.clean)(this.buffer.subarray(pos));
        if (this.padOffset > blockLen - pos) {
          this.process(view3, 0);
          pos = 0;
        }
        for (let i = pos; i < blockLen; i++)
          buffer[i] = 0;
        setBigUint64(view3, blockLen - 8, BigInt(this.length * 8), isLE);
        this.process(view3, 0);
        const oview = (0, utils_ts_1.createView)(out);
        const len = this.outputLen;
        if (len % 4)
          throw new Error("_sha2: outputLen should be aligned to 32bit");
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length)
          throw new Error("_sha2: outputLen bigger than state");
        for (let i = 0; i < outLen; i++)
          oview.setUint32(4 * i, state[i], isLE);
      }
      digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
      }
      _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.destroyed = destroyed;
        to.finished = finished;
        to.length = length;
        to.pos = pos;
        if (length % blockLen)
          to.buffer.set(buffer);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
    };
    exports.HashMD = HashMD;
    exports.SHA256_IV = Uint32Array.from([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]);
    exports.SHA224_IV = Uint32Array.from([
      3238371032,
      914150663,
      812702999,
      4144912697,
      4290775857,
      1750603025,
      1694076839,
      3204075428
    ]);
    exports.SHA384_IV = Uint32Array.from([
      3418070365,
      3238371032,
      1654270250,
      914150663,
      2438529370,
      812702999,
      355462360,
      4144912697,
      1731405415,
      4290775857,
      2394180231,
      1750603025,
      3675008525,
      1694076839,
      1203062813,
      3204075428
    ]);
    exports.SHA512_IV = Uint32Array.from([
      1779033703,
      4089235720,
      3144134277,
      2227873595,
      1013904242,
      4271175723,
      2773480762,
      1595750129,
      1359893119,
      2917565137,
      2600822924,
      725511199,
      528734635,
      4215389547,
      1541459225,
      327033209
    ]);
  }
});

// node_modules/.deno/@noble+hashes@1.8.0/node_modules/@noble/hashes/_u64.js
var require_u64 = __commonJS({
  "node_modules/.deno/@noble+hashes@1.8.0/node_modules/@noble/hashes/_u64.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toBig = exports.shrSL = exports.shrSH = exports.rotrSL = exports.rotrSH = exports.rotrBL = exports.rotrBH = exports.rotr32L = exports.rotr32H = exports.rotlSL = exports.rotlSH = exports.rotlBL = exports.rotlBH = exports.add5L = exports.add5H = exports.add4L = exports.add4H = exports.add3L = exports.add3H = void 0;
    exports.add = add;
    exports.fromBig = fromBig;
    exports.split = split;
    var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
    var _32n = /* @__PURE__ */ BigInt(32);
    function fromBig(n, le = false) {
      if (le)
        return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
      return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
    }
    function split(lst, le = false) {
      const len = lst.length;
      let Ah = new Uint32Array(len);
      let Al = new Uint32Array(len);
      for (let i = 0; i < len; i++) {
        const { h, l } = fromBig(lst[i], le);
        [Ah[i], Al[i]] = [h, l];
      }
      return [Ah, Al];
    }
    var toBig = (h, l) => BigInt(h >>> 0) << _32n | BigInt(l >>> 0);
    exports.toBig = toBig;
    var shrSH = (h, _l, s) => h >>> s;
    exports.shrSH = shrSH;
    var shrSL = (h, l, s) => h << 32 - s | l >>> s;
    exports.shrSL = shrSL;
    var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
    exports.rotrSH = rotrSH;
    var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
    exports.rotrSL = rotrSL;
    var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
    exports.rotrBH = rotrBH;
    var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
    exports.rotrBL = rotrBL;
    var rotr32H = (_h, l) => l;
    exports.rotr32H = rotr32H;
    var rotr32L = (h, _l) => h;
    exports.rotr32L = rotr32L;
    var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
    exports.rotlSH = rotlSH;
    var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
    exports.rotlSL = rotlSL;
    var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
    exports.rotlBH = rotlBH;
    var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
    exports.rotlBL = rotlBL;
    function add(Ah, Al, Bh, Bl) {
      const l = (Al >>> 0) + (Bl >>> 0);
      return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
    }
    var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
    exports.add3L = add3L;
    var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
    exports.add3H = add3H;
    var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
    exports.add4L = add4L;
    var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
    exports.add4H = add4H;
    var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
    exports.add5L = add5L;
    var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
    exports.add5H = add5H;
    var u64 = {
      fromBig,
      split,
      toBig,
      shrSH,
      shrSL,
      rotrSH,
      rotrSL,
      rotrBH,
      rotrBL,
      rotr32H,
      rotr32L,
      rotlSH,
      rotlSL,
      rotlBH,
      rotlBL,
      add,
      add3L,
      add3H,
      add4L,
      add4H,
      add5H,
      add5L
    };
    exports.default = u64;
  }
});

// node_modules/.deno/@noble+hashes@1.8.0/node_modules/@noble/hashes/sha2.js
var require_sha2 = __commonJS({
  "node_modules/.deno/@noble+hashes@1.8.0/node_modules/@noble/hashes/sha2.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sha512_224 = exports.sha512_256 = exports.sha384 = exports.sha512 = exports.sha224 = exports.sha256 = exports.SHA512_256 = exports.SHA512_224 = exports.SHA384 = exports.SHA512 = exports.SHA224 = exports.SHA256 = void 0;
    var _md_ts_1 = require_md();
    var u64 = require_u64();
    var utils_ts_1 = require_utils();
    var SHA256_K = /* @__PURE__ */ Uint32Array.from([
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ]);
    var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
    var SHA256 = class extends _md_ts_1.HashMD {
      constructor(outputLen = 32) {
        super(64, outputLen, 8, false);
        this.A = _md_ts_1.SHA256_IV[0] | 0;
        this.B = _md_ts_1.SHA256_IV[1] | 0;
        this.C = _md_ts_1.SHA256_IV[2] | 0;
        this.D = _md_ts_1.SHA256_IV[3] | 0;
        this.E = _md_ts_1.SHA256_IV[4] | 0;
        this.F = _md_ts_1.SHA256_IV[5] | 0;
        this.G = _md_ts_1.SHA256_IV[6] | 0;
        this.H = _md_ts_1.SHA256_IV[7] | 0;
      }
      get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
      }
      // prettier-ignore
      set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
      }
      process(view3, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          SHA256_W[i] = view3.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
          const W15 = SHA256_W[i - 15];
          const W2 = SHA256_W[i - 2];
          const s0 = (0, utils_ts_1.rotr)(W15, 7) ^ (0, utils_ts_1.rotr)(W15, 18) ^ W15 >>> 3;
          const s1 = (0, utils_ts_1.rotr)(W2, 17) ^ (0, utils_ts_1.rotr)(W2, 19) ^ W2 >>> 10;
          SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
        }
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
          const sigma1 = (0, utils_ts_1.rotr)(E, 6) ^ (0, utils_ts_1.rotr)(E, 11) ^ (0, utils_ts_1.rotr)(E, 25);
          const T1 = H + sigma1 + (0, _md_ts_1.Chi)(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
          const sigma0 = (0, utils_ts_1.rotr)(A, 2) ^ (0, utils_ts_1.rotr)(A, 13) ^ (0, utils_ts_1.rotr)(A, 22);
          const T2 = sigma0 + (0, _md_ts_1.Maj)(A, B, C) | 0;
          H = G;
          G = F;
          F = E;
          E = D + T1 | 0;
          D = C;
          C = B;
          B = A;
          A = T1 + T2 | 0;
        }
        A = A + this.A | 0;
        B = B + this.B | 0;
        C = C + this.C | 0;
        D = D + this.D | 0;
        E = E + this.E | 0;
        F = F + this.F | 0;
        G = G + this.G | 0;
        H = H + this.H | 0;
        this.set(A, B, C, D, E, F, G, H);
      }
      roundClean() {
        (0, utils_ts_1.clean)(SHA256_W);
      }
      destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        (0, utils_ts_1.clean)(this.buffer);
      }
    };
    exports.SHA256 = SHA256;
    var SHA224 = class extends SHA256 {
      constructor() {
        super(28);
        this.A = _md_ts_1.SHA224_IV[0] | 0;
        this.B = _md_ts_1.SHA224_IV[1] | 0;
        this.C = _md_ts_1.SHA224_IV[2] | 0;
        this.D = _md_ts_1.SHA224_IV[3] | 0;
        this.E = _md_ts_1.SHA224_IV[4] | 0;
        this.F = _md_ts_1.SHA224_IV[5] | 0;
        this.G = _md_ts_1.SHA224_IV[6] | 0;
        this.H = _md_ts_1.SHA224_IV[7] | 0;
      }
    };
    exports.SHA224 = SHA224;
    var K512 = /* @__PURE__ */ (() => u64.split([
      "0x428a2f98d728ae22",
      "0x7137449123ef65cd",
      "0xb5c0fbcfec4d3b2f",
      "0xe9b5dba58189dbbc",
      "0x3956c25bf348b538",
      "0x59f111f1b605d019",
      "0x923f82a4af194f9b",
      "0xab1c5ed5da6d8118",
      "0xd807aa98a3030242",
      "0x12835b0145706fbe",
      "0x243185be4ee4b28c",
      "0x550c7dc3d5ffb4e2",
      "0x72be5d74f27b896f",
      "0x80deb1fe3b1696b1",
      "0x9bdc06a725c71235",
      "0xc19bf174cf692694",
      "0xe49b69c19ef14ad2",
      "0xefbe4786384f25e3",
      "0x0fc19dc68b8cd5b5",
      "0x240ca1cc77ac9c65",
      "0x2de92c6f592b0275",
      "0x4a7484aa6ea6e483",
      "0x5cb0a9dcbd41fbd4",
      "0x76f988da831153b5",
      "0x983e5152ee66dfab",
      "0xa831c66d2db43210",
      "0xb00327c898fb213f",
      "0xbf597fc7beef0ee4",
      "0xc6e00bf33da88fc2",
      "0xd5a79147930aa725",
      "0x06ca6351e003826f",
      "0x142929670a0e6e70",
      "0x27b70a8546d22ffc",
      "0x2e1b21385c26c926",
      "0x4d2c6dfc5ac42aed",
      "0x53380d139d95b3df",
      "0x650a73548baf63de",
      "0x766a0abb3c77b2a8",
      "0x81c2c92e47edaee6",
      "0x92722c851482353b",
      "0xa2bfe8a14cf10364",
      "0xa81a664bbc423001",
      "0xc24b8b70d0f89791",
      "0xc76c51a30654be30",
      "0xd192e819d6ef5218",
      "0xd69906245565a910",
      "0xf40e35855771202a",
      "0x106aa07032bbd1b8",
      "0x19a4c116b8d2d0c8",
      "0x1e376c085141ab53",
      "0x2748774cdf8eeb99",
      "0x34b0bcb5e19b48a8",
      "0x391c0cb3c5c95a63",
      "0x4ed8aa4ae3418acb",
      "0x5b9cca4f7763e373",
      "0x682e6ff3d6b2b8a3",
      "0x748f82ee5defb2fc",
      "0x78a5636f43172f60",
      "0x84c87814a1f0ab72",
      "0x8cc702081a6439ec",
      "0x90befffa23631e28",
      "0xa4506cebde82bde9",
      "0xbef9a3f7b2c67915",
      "0xc67178f2e372532b",
      "0xca273eceea26619c",
      "0xd186b8c721c0c207",
      "0xeada7dd6cde0eb1e",
      "0xf57d4f7fee6ed178",
      "0x06f067aa72176fba",
      "0x0a637dc5a2c898a6",
      "0x113f9804bef90dae",
      "0x1b710b35131c471b",
      "0x28db77f523047d84",
      "0x32caab7b40c72493",
      "0x3c9ebe0a15c9bebc",
      "0x431d67c49c100d4c",
      "0x4cc5d4becb3e42b6",
      "0x597f299cfc657e2a",
      "0x5fcb6fab3ad6faec",
      "0x6c44198c4a475817"
    ].map((n) => BigInt(n))))();
    var SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
    var SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
    var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
    var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
    var SHA512 = class extends _md_ts_1.HashMD {
      constructor(outputLen = 64) {
        super(128, outputLen, 16, false);
        this.Ah = _md_ts_1.SHA512_IV[0] | 0;
        this.Al = _md_ts_1.SHA512_IV[1] | 0;
        this.Bh = _md_ts_1.SHA512_IV[2] | 0;
        this.Bl = _md_ts_1.SHA512_IV[3] | 0;
        this.Ch = _md_ts_1.SHA512_IV[4] | 0;
        this.Cl = _md_ts_1.SHA512_IV[5] | 0;
        this.Dh = _md_ts_1.SHA512_IV[6] | 0;
        this.Dl = _md_ts_1.SHA512_IV[7] | 0;
        this.Eh = _md_ts_1.SHA512_IV[8] | 0;
        this.El = _md_ts_1.SHA512_IV[9] | 0;
        this.Fh = _md_ts_1.SHA512_IV[10] | 0;
        this.Fl = _md_ts_1.SHA512_IV[11] | 0;
        this.Gh = _md_ts_1.SHA512_IV[12] | 0;
        this.Gl = _md_ts_1.SHA512_IV[13] | 0;
        this.Hh = _md_ts_1.SHA512_IV[14] | 0;
        this.Hl = _md_ts_1.SHA512_IV[15] | 0;
      }
      // prettier-ignore
      get() {
        const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
      }
      // prettier-ignore
      set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
        this.Ah = Ah | 0;
        this.Al = Al | 0;
        this.Bh = Bh | 0;
        this.Bl = Bl | 0;
        this.Ch = Ch | 0;
        this.Cl = Cl | 0;
        this.Dh = Dh | 0;
        this.Dl = Dl | 0;
        this.Eh = Eh | 0;
        this.El = El | 0;
        this.Fh = Fh | 0;
        this.Fl = Fl | 0;
        this.Gh = Gh | 0;
        this.Gl = Gl | 0;
        this.Hh = Hh | 0;
        this.Hl = Hl | 0;
      }
      process(view3, offset) {
        for (let i = 0; i < 16; i++, offset += 4) {
          SHA512_W_H[i] = view3.getUint32(offset);
          SHA512_W_L[i] = view3.getUint32(offset += 4);
        }
        for (let i = 16; i < 80; i++) {
          const W15h = SHA512_W_H[i - 15] | 0;
          const W15l = SHA512_W_L[i - 15] | 0;
          const s0h = u64.rotrSH(W15h, W15l, 1) ^ u64.rotrSH(W15h, W15l, 8) ^ u64.shrSH(W15h, W15l, 7);
          const s0l = u64.rotrSL(W15h, W15l, 1) ^ u64.rotrSL(W15h, W15l, 8) ^ u64.shrSL(W15h, W15l, 7);
          const W2h = SHA512_W_H[i - 2] | 0;
          const W2l = SHA512_W_L[i - 2] | 0;
          const s1h = u64.rotrSH(W2h, W2l, 19) ^ u64.rotrBH(W2h, W2l, 61) ^ u64.shrSH(W2h, W2l, 6);
          const s1l = u64.rotrSL(W2h, W2l, 19) ^ u64.rotrBL(W2h, W2l, 61) ^ u64.shrSL(W2h, W2l, 6);
          const SUMl = u64.add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
          const SUMh = u64.add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
          SHA512_W_H[i] = SUMh | 0;
          SHA512_W_L[i] = SUMl | 0;
        }
        let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        for (let i = 0; i < 80; i++) {
          const sigma1h = u64.rotrSH(Eh, El, 14) ^ u64.rotrSH(Eh, El, 18) ^ u64.rotrBH(Eh, El, 41);
          const sigma1l = u64.rotrSL(Eh, El, 14) ^ u64.rotrSL(Eh, El, 18) ^ u64.rotrBL(Eh, El, 41);
          const CHIh = Eh & Fh ^ ~Eh & Gh;
          const CHIl = El & Fl ^ ~El & Gl;
          const T1ll = u64.add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
          const T1h = u64.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
          const T1l = T1ll | 0;
          const sigma0h = u64.rotrSH(Ah, Al, 28) ^ u64.rotrBH(Ah, Al, 34) ^ u64.rotrBH(Ah, Al, 39);
          const sigma0l = u64.rotrSL(Ah, Al, 28) ^ u64.rotrBL(Ah, Al, 34) ^ u64.rotrBL(Ah, Al, 39);
          const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
          const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
          Hh = Gh | 0;
          Hl = Gl | 0;
          Gh = Fh | 0;
          Gl = Fl | 0;
          Fh = Eh | 0;
          Fl = El | 0;
          ({ h: Eh, l: El } = u64.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
          Dh = Ch | 0;
          Dl = Cl | 0;
          Ch = Bh | 0;
          Cl = Bl | 0;
          Bh = Ah | 0;
          Bl = Al | 0;
          const All = u64.add3L(T1l, sigma0l, MAJl);
          Ah = u64.add3H(All, T1h, sigma0h, MAJh);
          Al = All | 0;
        }
        ({ h: Ah, l: Al } = u64.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
        ({ h: Bh, l: Bl } = u64.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
        ({ h: Ch, l: Cl } = u64.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
        ({ h: Dh, l: Dl } = u64.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
        ({ h: Eh, l: El } = u64.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
        ({ h: Fh, l: Fl } = u64.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
        ({ h: Gh, l: Gl } = u64.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
        ({ h: Hh, l: Hl } = u64.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
        this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
      }
      roundClean() {
        (0, utils_ts_1.clean)(SHA512_W_H, SHA512_W_L);
      }
      destroy() {
        (0, utils_ts_1.clean)(this.buffer);
        this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      }
    };
    exports.SHA512 = SHA512;
    var SHA384 = class extends SHA512 {
      constructor() {
        super(48);
        this.Ah = _md_ts_1.SHA384_IV[0] | 0;
        this.Al = _md_ts_1.SHA384_IV[1] | 0;
        this.Bh = _md_ts_1.SHA384_IV[2] | 0;
        this.Bl = _md_ts_1.SHA384_IV[3] | 0;
        this.Ch = _md_ts_1.SHA384_IV[4] | 0;
        this.Cl = _md_ts_1.SHA384_IV[5] | 0;
        this.Dh = _md_ts_1.SHA384_IV[6] | 0;
        this.Dl = _md_ts_1.SHA384_IV[7] | 0;
        this.Eh = _md_ts_1.SHA384_IV[8] | 0;
        this.El = _md_ts_1.SHA384_IV[9] | 0;
        this.Fh = _md_ts_1.SHA384_IV[10] | 0;
        this.Fl = _md_ts_1.SHA384_IV[11] | 0;
        this.Gh = _md_ts_1.SHA384_IV[12] | 0;
        this.Gl = _md_ts_1.SHA384_IV[13] | 0;
        this.Hh = _md_ts_1.SHA384_IV[14] | 0;
        this.Hl = _md_ts_1.SHA384_IV[15] | 0;
      }
    };
    exports.SHA384 = SHA384;
    var T224_IV = /* @__PURE__ */ Uint32Array.from([
      2352822216,
      424955298,
      1944164710,
      2312950998,
      502970286,
      855612546,
      1738396948,
      1479516111,
      258812777,
      2077511080,
      2011393907,
      79989058,
      1067287976,
      1780299464,
      286451373,
      2446758561
    ]);
    var T256_IV = /* @__PURE__ */ Uint32Array.from([
      573645204,
      4230739756,
      2673172387,
      3360449730,
      596883563,
      1867755857,
      2520282905,
      1497426621,
      2519219938,
      2827943907,
      3193839141,
      1401305490,
      721525244,
      746961066,
      246885852,
      2177182882
    ]);
    var SHA512_224 = class extends SHA512 {
      constructor() {
        super(28);
        this.Ah = T224_IV[0] | 0;
        this.Al = T224_IV[1] | 0;
        this.Bh = T224_IV[2] | 0;
        this.Bl = T224_IV[3] | 0;
        this.Ch = T224_IV[4] | 0;
        this.Cl = T224_IV[5] | 0;
        this.Dh = T224_IV[6] | 0;
        this.Dl = T224_IV[7] | 0;
        this.Eh = T224_IV[8] | 0;
        this.El = T224_IV[9] | 0;
        this.Fh = T224_IV[10] | 0;
        this.Fl = T224_IV[11] | 0;
        this.Gh = T224_IV[12] | 0;
        this.Gl = T224_IV[13] | 0;
        this.Hh = T224_IV[14] | 0;
        this.Hl = T224_IV[15] | 0;
      }
    };
    exports.SHA512_224 = SHA512_224;
    var SHA512_256 = class extends SHA512 {
      constructor() {
        super(32);
        this.Ah = T256_IV[0] | 0;
        this.Al = T256_IV[1] | 0;
        this.Bh = T256_IV[2] | 0;
        this.Bl = T256_IV[3] | 0;
        this.Ch = T256_IV[4] | 0;
        this.Cl = T256_IV[5] | 0;
        this.Dh = T256_IV[6] | 0;
        this.Dl = T256_IV[7] | 0;
        this.Eh = T256_IV[8] | 0;
        this.El = T256_IV[9] | 0;
        this.Fh = T256_IV[10] | 0;
        this.Fl = T256_IV[11] | 0;
        this.Gh = T256_IV[12] | 0;
        this.Gl = T256_IV[13] | 0;
        this.Hh = T256_IV[14] | 0;
        this.Hl = T256_IV[15] | 0;
      }
    };
    exports.SHA512_256 = SHA512_256;
    exports.sha256 = (0, utils_ts_1.createHasher)(() => new SHA256());
    exports.sha224 = (0, utils_ts_1.createHasher)(() => new SHA224());
    exports.sha512 = (0, utils_ts_1.createHasher)(() => new SHA512());
    exports.sha384 = (0, utils_ts_1.createHasher)(() => new SHA384());
    exports.sha512_256 = (0, utils_ts_1.createHasher)(() => new SHA512_256());
    exports.sha512_224 = (0, utils_ts_1.createHasher)(() => new SHA512_224());
  }
});

// node_modules/.deno/@noble+hashes@1.8.0/node_modules/@noble/hashes/sha256.js
var require_sha256 = __commonJS({
  "node_modules/.deno/@noble+hashes@1.8.0/node_modules/@noble/hashes/sha256.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sha224 = exports.SHA224 = exports.sha256 = exports.SHA256 = void 0;
    var sha2_ts_1 = require_sha2();
    exports.SHA256 = sha2_ts_1.SHA256;
    exports.sha256 = sha2_ts_1.sha256;
    exports.SHA224 = sha2_ts_1.SHA224;
    exports.sha224 = sha2_ts_1.sha224;
  }
});

// node_modules/.deno/base-x@4.0.1/node_modules/base-x/src/index.js
var require_src = __commonJS({
  "node_modules/.deno/base-x@4.0.1/node_modules/base-x/src/index.js"(exports, module) {
    "use strict";
    function base(ALPHABET) {
      if (ALPHABET.length >= 255) {
        throw new TypeError("Alphabet too long");
      }
      var BASE_MAP = new Uint8Array(256);
      for (var j = 0; j < BASE_MAP.length; j++) {
        BASE_MAP[j] = 255;
      }
      for (var i = 0; i < ALPHABET.length; i++) {
        var x = ALPHABET.charAt(i);
        var xc = x.charCodeAt(0);
        if (BASE_MAP[xc] !== 255) {
          throw new TypeError(x + " is ambiguous");
        }
        BASE_MAP[xc] = i;
      }
      var BASE = ALPHABET.length;
      var LEADER = ALPHABET.charAt(0);
      var FACTOR = Math.log(BASE) / Math.log(256);
      var iFACTOR = Math.log(256) / Math.log(BASE);
      function encode3(source) {
        if (source instanceof Uint8Array) {
        } else if (ArrayBuffer.isView(source)) {
          source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
        } else if (Array.isArray(source)) {
          source = Uint8Array.from(source);
        }
        if (!(source instanceof Uint8Array)) {
          throw new TypeError("Expected Uint8Array");
        }
        if (source.length === 0) {
          return "";
        }
        var zeroes = 0;
        var length = 0;
        var pbegin = 0;
        var pend = source.length;
        while (pbegin !== pend && source[pbegin] === 0) {
          pbegin++;
          zeroes++;
        }
        var size = (pend - pbegin) * iFACTOR + 1 >>> 0;
        var b58 = new Uint8Array(size);
        while (pbegin !== pend) {
          var carry = source[pbegin];
          var i2 = 0;
          for (var it1 = size - 1; (carry !== 0 || i2 < length) && it1 !== -1; it1--, i2++) {
            carry += 256 * b58[it1] >>> 0;
            b58[it1] = carry % BASE >>> 0;
            carry = carry / BASE >>> 0;
          }
          if (carry !== 0) {
            throw new Error("Non-zero carry");
          }
          length = i2;
          pbegin++;
        }
        var it2 = size - length;
        while (it2 !== size && b58[it2] === 0) {
          it2++;
        }
        var str = LEADER.repeat(zeroes);
        for (; it2 < size; ++it2) {
          str += ALPHABET.charAt(b58[it2]);
        }
        return str;
      }
      function decodeUnsafe(source) {
        if (typeof source !== "string") {
          throw new TypeError("Expected String");
        }
        if (source.length === 0) {
          return new Uint8Array();
        }
        var psz = 0;
        var zeroes = 0;
        var length = 0;
        while (source[psz] === LEADER) {
          zeroes++;
          psz++;
        }
        var size = (source.length - psz) * FACTOR + 1 >>> 0;
        var b256 = new Uint8Array(size);
        while (source[psz]) {
          var charCode = source.charCodeAt(psz);
          if (charCode > 255) {
            return;
          }
          var carry = BASE_MAP[charCode];
          if (carry === 255) {
            return;
          }
          var i2 = 0;
          for (var it3 = size - 1; (carry !== 0 || i2 < length) && it3 !== -1; it3--, i2++) {
            carry += BASE * b256[it3] >>> 0;
            b256[it3] = carry % 256 >>> 0;
            carry = carry / 256 >>> 0;
          }
          if (carry !== 0) {
            throw new Error("Non-zero carry");
          }
          length = i2;
          psz++;
        }
        var it4 = size - length;
        while (it4 !== size && b256[it4] === 0) {
          it4++;
        }
        var vch = new Uint8Array(zeroes + (size - it4));
        var j2 = zeroes;
        while (it4 !== size) {
          vch[j2++] = b256[it4++];
        }
        return vch;
      }
      function decode2(string) {
        var buffer = decodeUnsafe(string);
        if (buffer) {
          return buffer;
        }
        throw new Error("Non-base" + BASE + " character");
      }
      return {
        encode: encode3,
        decodeUnsafe,
        decode: decode2
      };
    }
    module.exports = base;
  }
});

// node_modules/.deno/bs58@5.0.0/node_modules/bs58/index.js
var require_bs58 = __commonJS({
  "node_modules/.deno/bs58@5.0.0/node_modules/bs58/index.js"(exports, module) {
    var basex = require_src();
    var ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    module.exports = basex(ALPHABET);
  }
});

// node_modules/.deno/bs58check@3.0.1/node_modules/bs58check/base.js
var require_base = __commonJS({
  "node_modules/.deno/bs58check@3.0.1/node_modules/bs58check/base.js"(exports, module) {
    "use strict";
    var base58 = require_bs58();
    module.exports = function(checksumFn) {
      function encode3(payload) {
        var payloadU8 = Uint8Array.from(payload);
        var checksum = checksumFn(payloadU8);
        var length = payloadU8.length + 4;
        var both = new Uint8Array(length);
        both.set(payloadU8, 0);
        both.set(checksum.subarray(0, 4), payloadU8.length);
        return base58.encode(both, length);
      }
      function decodeRaw(buffer) {
        var payload = buffer.slice(0, -4);
        var checksum = buffer.slice(-4);
        var newChecksum = checksumFn(payload);
        if (checksum[0] ^ newChecksum[0] | checksum[1] ^ newChecksum[1] | checksum[2] ^ newChecksum[2] | checksum[3] ^ newChecksum[3]) return;
        return payload;
      }
      function decodeUnsafe(string) {
        var buffer = base58.decodeUnsafe(string);
        if (!buffer) return;
        return decodeRaw(buffer);
      }
      function decode2(string) {
        var buffer = base58.decode(string);
        var payload = decodeRaw(buffer, checksumFn);
        if (!payload) throw new Error("Invalid checksum");
        return payload;
      }
      return {
        encode: encode3,
        decode: decode2,
        decodeUnsafe
      };
    };
  }
});

// node_modules/.deno/bs58check@3.0.1/node_modules/bs58check/index.js
var require_bs58check = __commonJS({
  "node_modules/.deno/bs58check@3.0.1/node_modules/bs58check/index.js"(exports, module) {
    "use strict";
    var { sha256: sha2564 } = require_sha256();
    var bs58checkBase = require_base();
    function sha256x2(buffer) {
      return sha2564(sha2564(buffer));
    }
    module.exports = bs58checkBase(sha256x2);
  }
});

// node_modules/.deno/fast-sha256@1.3.0/node_modules/fast-sha256/sha256.js
var require_sha2562 = __commonJS({
  "node_modules/.deno/fast-sha256@1.3.0/node_modules/fast-sha256/sha256.js"(exports, module) {
    (function(root, factory) {
      var exports2 = {};
      factory(exports2);
      var sha2564 = exports2["default"];
      for (var k in exports2) {
        sha2564[k] = exports2[k];
      }
      if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = sha2564;
      } else if (typeof define === "function" && define.amd) {
        define(function() {
          return sha2564;
        });
      } else {
        root.sha256 = sha2564;
      }
    })(exports, function(exports2) {
      "use strict";
      exports2.__esModule = true;
      exports2.digestLength = 32;
      exports2.blockSize = 64;
      var K = new Uint32Array([
        1116352408,
        1899447441,
        3049323471,
        3921009573,
        961987163,
        1508970993,
        2453635748,
        2870763221,
        3624381080,
        310598401,
        607225278,
        1426881987,
        1925078388,
        2162078206,
        2614888103,
        3248222580,
        3835390401,
        4022224774,
        264347078,
        604807628,
        770255983,
        1249150122,
        1555081692,
        1996064986,
        2554220882,
        2821834349,
        2952996808,
        3210313671,
        3336571891,
        3584528711,
        113926993,
        338241895,
        666307205,
        773529912,
        1294757372,
        1396182291,
        1695183700,
        1986661051,
        2177026350,
        2456956037,
        2730485921,
        2820302411,
        3259730800,
        3345764771,
        3516065817,
        3600352804,
        4094571909,
        275423344,
        430227734,
        506948616,
        659060556,
        883997877,
        958139571,
        1322822218,
        1537002063,
        1747873779,
        1955562222,
        2024104815,
        2227730452,
        2361852424,
        2428436474,
        2756734187,
        3204031479,
        3329325298
      ]);
      function hashBlocks(w, v, p, pos, len) {
        var a, b, c, d, e, f, g, h, u, i, j, t1, t2;
        while (len >= 64) {
          a = v[0];
          b = v[1];
          c = v[2];
          d = v[3];
          e = v[4];
          f = v[5];
          g = v[6];
          h = v[7];
          for (i = 0; i < 16; i++) {
            j = pos + i * 4;
            w[i] = (p[j] & 255) << 24 | (p[j + 1] & 255) << 16 | (p[j + 2] & 255) << 8 | p[j + 3] & 255;
          }
          for (i = 16; i < 64; i++) {
            u = w[i - 2];
            t1 = (u >>> 17 | u << 32 - 17) ^ (u >>> 19 | u << 32 - 19) ^ u >>> 10;
            u = w[i - 15];
            t2 = (u >>> 7 | u << 32 - 7) ^ (u >>> 18 | u << 32 - 18) ^ u >>> 3;
            w[i] = (t1 + w[i - 7] | 0) + (t2 + w[i - 16] | 0);
          }
          for (i = 0; i < 64; i++) {
            t1 = (((e >>> 6 | e << 32 - 6) ^ (e >>> 11 | e << 32 - 11) ^ (e >>> 25 | e << 32 - 25)) + (e & f ^ ~e & g) | 0) + (h + (K[i] + w[i] | 0) | 0) | 0;
            t2 = ((a >>> 2 | a << 32 - 2) ^ (a >>> 13 | a << 32 - 13) ^ (a >>> 22 | a << 32 - 22)) + (a & b ^ a & c ^ b & c) | 0;
            h = g;
            g = f;
            f = e;
            e = d + t1 | 0;
            d = c;
            c = b;
            b = a;
            a = t1 + t2 | 0;
          }
          v[0] += a;
          v[1] += b;
          v[2] += c;
          v[3] += d;
          v[4] += e;
          v[5] += f;
          v[6] += g;
          v[7] += h;
          pos += 64;
          len -= 64;
        }
        return pos;
      }
      var Hash = (
        /** @class */
        (function() {
          function Hash2() {
            this.digestLength = exports2.digestLength;
            this.blockSize = exports2.blockSize;
            this.state = new Int32Array(8);
            this.temp = new Int32Array(64);
            this.buffer = new Uint8Array(128);
            this.bufferLength = 0;
            this.bytesHashed = 0;
            this.finished = false;
            this.reset();
          }
          Hash2.prototype.reset = function() {
            this.state[0] = 1779033703;
            this.state[1] = 3144134277;
            this.state[2] = 1013904242;
            this.state[3] = 2773480762;
            this.state[4] = 1359893119;
            this.state[5] = 2600822924;
            this.state[6] = 528734635;
            this.state[7] = 1541459225;
            this.bufferLength = 0;
            this.bytesHashed = 0;
            this.finished = false;
            return this;
          };
          Hash2.prototype.clean = function() {
            for (var i = 0; i < this.buffer.length; i++) {
              this.buffer[i] = 0;
            }
            for (var i = 0; i < this.temp.length; i++) {
              this.temp[i] = 0;
            }
            this.reset();
          };
          Hash2.prototype.update = function(data, dataLength) {
            if (dataLength === void 0) {
              dataLength = data.length;
            }
            if (this.finished) {
              throw new Error("SHA256: can't update because hash was finished.");
            }
            var dataPos = 0;
            this.bytesHashed += dataLength;
            if (this.bufferLength > 0) {
              while (this.bufferLength < 64 && dataLength > 0) {
                this.buffer[this.bufferLength++] = data[dataPos++];
                dataLength--;
              }
              if (this.bufferLength === 64) {
                hashBlocks(this.temp, this.state, this.buffer, 0, 64);
                this.bufferLength = 0;
              }
            }
            if (dataLength >= 64) {
              dataPos = hashBlocks(this.temp, this.state, data, dataPos, dataLength);
              dataLength %= 64;
            }
            while (dataLength > 0) {
              this.buffer[this.bufferLength++] = data[dataPos++];
              dataLength--;
            }
            return this;
          };
          Hash2.prototype.finish = function(out) {
            if (!this.finished) {
              var bytesHashed = this.bytesHashed;
              var left = this.bufferLength;
              var bitLenHi = bytesHashed / 536870912 | 0;
              var bitLenLo = bytesHashed << 3;
              var padLength = bytesHashed % 64 < 56 ? 64 : 128;
              this.buffer[left] = 128;
              for (var i = left + 1; i < padLength - 8; i++) {
                this.buffer[i] = 0;
              }
              this.buffer[padLength - 8] = bitLenHi >>> 24 & 255;
              this.buffer[padLength - 7] = bitLenHi >>> 16 & 255;
              this.buffer[padLength - 6] = bitLenHi >>> 8 & 255;
              this.buffer[padLength - 5] = bitLenHi >>> 0 & 255;
              this.buffer[padLength - 4] = bitLenLo >>> 24 & 255;
              this.buffer[padLength - 3] = bitLenLo >>> 16 & 255;
              this.buffer[padLength - 2] = bitLenLo >>> 8 & 255;
              this.buffer[padLength - 1] = bitLenLo >>> 0 & 255;
              hashBlocks(this.temp, this.state, this.buffer, 0, padLength);
              this.finished = true;
            }
            for (var i = 0; i < 8; i++) {
              out[i * 4 + 0] = this.state[i] >>> 24 & 255;
              out[i * 4 + 1] = this.state[i] >>> 16 & 255;
              out[i * 4 + 2] = this.state[i] >>> 8 & 255;
              out[i * 4 + 3] = this.state[i] >>> 0 & 255;
            }
            return this;
          };
          Hash2.prototype.digest = function() {
            var out = new Uint8Array(this.digestLength);
            this.finish(out);
            return out;
          };
          Hash2.prototype._saveState = function(out) {
            for (var i = 0; i < this.state.length; i++) {
              out[i] = this.state[i];
            }
          };
          Hash2.prototype._restoreState = function(from2, bytesHashed) {
            for (var i = 0; i < this.state.length; i++) {
              this.state[i] = from2[i];
            }
            this.bytesHashed = bytesHashed;
            this.finished = false;
            this.bufferLength = 0;
          };
          return Hash2;
        })()
      );
      exports2.Hash = Hash;
      var HMAC = (
        /** @class */
        (function() {
          function HMAC2(key) {
            this.inner = new Hash();
            this.outer = new Hash();
            this.blockSize = this.inner.blockSize;
            this.digestLength = this.inner.digestLength;
            var pad = new Uint8Array(this.blockSize);
            if (key.length > this.blockSize) {
              new Hash().update(key).finish(pad).clean();
            } else {
              for (var i = 0; i < key.length; i++) {
                pad[i] = key[i];
              }
            }
            for (var i = 0; i < pad.length; i++) {
              pad[i] ^= 54;
            }
            this.inner.update(pad);
            for (var i = 0; i < pad.length; i++) {
              pad[i] ^= 54 ^ 92;
            }
            this.outer.update(pad);
            this.istate = new Uint32Array(8);
            this.ostate = new Uint32Array(8);
            this.inner._saveState(this.istate);
            this.outer._saveState(this.ostate);
            for (var i = 0; i < pad.length; i++) {
              pad[i] = 0;
            }
          }
          HMAC2.prototype.reset = function() {
            this.inner._restoreState(this.istate, this.inner.blockSize);
            this.outer._restoreState(this.ostate, this.outer.blockSize);
            return this;
          };
          HMAC2.prototype.clean = function() {
            for (var i = 0; i < this.istate.length; i++) {
              this.ostate[i] = this.istate[i] = 0;
            }
            this.inner.clean();
            this.outer.clean();
          };
          HMAC2.prototype.update = function(data) {
            this.inner.update(data);
            return this;
          };
          HMAC2.prototype.finish = function(out) {
            if (this.outer.finished) {
              this.outer.finish(out);
            } else {
              this.inner.finish(out);
              this.outer.update(out, this.digestLength).finish(out);
            }
            return this;
          };
          HMAC2.prototype.digest = function() {
            var out = new Uint8Array(this.digestLength);
            this.finish(out);
            return out;
          };
          return HMAC2;
        })()
      );
      exports2.HMAC = HMAC;
      function hash2(data) {
        var h = new Hash().update(data);
        var digest = h.digest();
        h.clean();
        return digest;
      }
      exports2.hash = hash2;
      exports2["default"] = hash2;
      function hmac(key, data) {
        var h = new HMAC(key).update(data);
        var digest = h.digest();
        h.clean();
        return digest;
      }
      exports2.hmac = hmac;
      function fillBuffer(buffer, hmac2, info, counter) {
        var num = counter[0];
        if (num === 0) {
          throw new Error("hkdf: cannot expand more");
        }
        hmac2.reset();
        if (num > 1) {
          hmac2.update(buffer);
        }
        if (info) {
          hmac2.update(info);
        }
        hmac2.update(counter);
        hmac2.finish(buffer);
        counter[0]++;
      }
      var hkdfSalt = new Uint8Array(exports2.digestLength);
      function hkdf2(key, salt, info, length) {
        if (salt === void 0) {
          salt = hkdfSalt;
        }
        if (length === void 0) {
          length = 32;
        }
        var counter = new Uint8Array([1]);
        var okm = hmac(salt, key);
        var hmac_ = new HMAC(okm);
        var buffer = new Uint8Array(hmac_.digestLength);
        var bufpos = buffer.length;
        var out = new Uint8Array(length);
        for (var i = 0; i < length; i++) {
          if (bufpos === buffer.length) {
            fillBuffer(buffer, hmac_, info, counter);
            bufpos = 0;
          }
          out[i] = buffer[bufpos++];
        }
        hmac_.clean();
        buffer.fill(0);
        counter.fill(0);
        return out;
      }
      exports2.hkdf = hkdf2;
      function pbkdf2(password, salt, iterations, dkLen) {
        var prf = new HMAC(password);
        var len = prf.digestLength;
        var ctr = new Uint8Array(4);
        var t = new Uint8Array(len);
        var u = new Uint8Array(len);
        var dk = new Uint8Array(dkLen);
        for (var i = 0; i * len < dkLen; i++) {
          var c = i + 1;
          ctr[0] = c >>> 24 & 255;
          ctr[1] = c >>> 16 & 255;
          ctr[2] = c >>> 8 & 255;
          ctr[3] = c >>> 0 & 255;
          prf.reset();
          prf.update(salt);
          prf.update(ctr);
          prf.finish(u);
          for (var j = 0; j < len; j++) {
            t[j] = u[j];
          }
          for (var j = 2; j <= iterations; j++) {
            prf.reset();
            prf.update(u).finish(u);
            for (var k = 0; k < len; k++) {
              t[k] ^= u[k];
            }
          }
          for (var j = 0; j < len && i * len + j < dkLen; j++) {
            dk[i * len + j] = t[j];
          }
        }
        for (var i = 0; i < len; i++) {
          t[i] = u[i] = 0;
        }
        for (var i = 0; i < 4; i++) {
          ctr[i] = 0;
        }
        prf.clean();
        return dk;
      }
      exports2.pbkdf2 = pbkdf2;
    });
  }
});

// node_modules/.deno/@automerge+automerge@3.2.6/node_modules/@automerge/automerge/dist/mjs/wasm_bindgen_output/web/automerge_wasm.js
var automerge_wasm_exports = {};
__export(automerge_wasm_exports, {
  Automerge: () => Automerge,
  SyncState: () => SyncState,
  create: () => create,
  decodeChange: () => decodeChange,
  decodeSyncMessage: () => decodeSyncMessage,
  decodeSyncState: () => decodeSyncState,
  default: () => __wbg_init,
  encodeChange: () => encodeChange,
  encodeSyncMessage: () => encodeSyncMessage,
  encodeSyncState: () => encodeSyncState,
  exportSyncState: () => exportSyncState,
  importSyncState: () => importSyncState,
  initSync: () => initSync,
  initSyncState: () => initSyncState,
  load: () => load,
  readBundle: () => readBundle,
  wasmReleaseInfo: () => wasmReleaseInfo
});
var Automerge = class _Automerge {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(_Automerge.prototype);
    obj.__wbg_ptr = ptr;
    AutomergeFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    AutomergeFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_automerge_free(ptr, 0);
  }
  /**
   * @param {any} object
   * @param {any} meta
   * @returns {any}
   */
  applyAndReturnPatches(object, meta) {
    const ret = wasm.automerge_applyAndReturnPatches(this.__wbg_ptr, object, meta);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @param {Change[]} changes
   */
  applyChanges(changes) {
    const ret = wasm.automerge_applyChanges(this.__wbg_ptr, changes);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {any} object
   * @param {any} meta
   * @returns {any}
   */
  applyPatches(object, meta) {
    const ret = wasm.automerge_applyPatches(this.__wbg_ptr, object, meta);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @param {string | null} [actor]
   * @returns {Automerge}
   */
  clone(actor) {
    var ptr0 = isLikeNone(actor) ? 0 : passStringToWasm0(actor, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    const ret = wasm.automerge_clone(this.__wbg_ptr, ptr0, len0);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return _Automerge.__wrap(ret[0]);
  }
  /**
   * @param {string | null} [message]
   * @param {number | null} [time]
   * @returns {Hash | null}
   */
  commit(message, time) {
    var ptr0 = isLikeNone(message) ? 0 : passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    const ret = wasm.automerge_commit(this.__wbg_ptr, ptr0, len0, !isLikeNone(time), isLikeNone(time) ? 0 : time);
    return ret;
  }
  /**
   * @param {ObjID} obj
   * @param {Prop} prop
   */
  delete(obj, prop) {
    const ret = wasm.automerge_delete(this.__wbg_ptr, obj, prop);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {Heads} before
   * @param {Heads} after
   * @returns {Patch[]}
   */
  diff(before, after) {
    const ret = wasm.automerge_diff(this.__wbg_ptr, before, after);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @returns {Patch[]}
   */
  diffIncremental() {
    const ret = wasm.automerge_diffIncremental(this.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @param {Prop[] | string} path
   * @param {Heads} before
   * @param {Heads} after
   * @param {any} options
   * @returns {Array<any>}
   */
  diffPath(path, before, after, options) {
    const ret = wasm.automerge_diffPath(this.__wbg_ptr, path, before, after, options);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  dump() {
    wasm.automerge_dump(this.__wbg_ptr);
  }
  /**
   * @param {string | null} [message]
   * @param {number | null} [time]
   * @returns {Hash}
   */
  emptyChange(message, time) {
    var ptr0 = isLikeNone(message) ? 0 : passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    const ret = wasm.automerge_emptyChange(this.__wbg_ptr, ptr0, len0, !isLikeNone(time), isLikeNone(time) ? 0 : time);
    return ret;
  }
  /**
   * @param {boolean} enable
   * @returns {boolean}
   */
  enableFreeze(enable) {
    const ret = wasm.automerge_enableFreeze(this.__wbg_ptr, enable);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
  }
  /**
   * @param {string | null | undefined} actor
   * @param {any} heads
   * @returns {Automerge}
   */
  fork(actor, heads) {
    var ptr0 = isLikeNone(actor) ? 0 : passStringToWasm0(actor, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    const ret = wasm.automerge_fork(this.__wbg_ptr, ptr0, len0, heads);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return _Automerge.__wrap(ret[0]);
  }
  /**
   * @param {SyncState} state
   * @returns {SyncMessage | null}
   */
  generateSyncMessage(state) {
    _assertClass(state, SyncState);
    const ret = wasm.automerge_generateSyncMessage(this.__wbg_ptr, state.__wbg_ptr);
    return ret;
  }
  /**
   * @param {any} obj
   * @param {any} prop
   * @param {any} heads
   * @returns {any}
   */
  get(obj, prop, heads) {
    const ret = wasm.automerge_get(this.__wbg_ptr, obj, prop, heads);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @returns {Actor}
   */
  getActorId() {
    let deferred1_0;
    let deferred1_1;
    try {
      const ret = wasm.automerge_getActorId(this.__wbg_ptr);
      deferred1_0 = ret[0];
      deferred1_1 = ret[1];
      return getStringFromWasm0(ret[0], ret[1]);
    } finally {
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * @param {any} obj
   * @param {any} arg
   * @param {any} heads
   * @returns {Array<any>}
   */
  getAll(obj, arg, heads) {
    const ret = wasm.automerge_getAll(this.__wbg_ptr, obj, arg, heads);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @param {any} text
   * @param {number} index
   * @param {any} heads
   * @returns {any}
   */
  getBlock(text, index, heads) {
    const ret = wasm.automerge_getBlock(this.__wbg_ptr, text, index, heads);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @param {Hash} hash
   * @returns {Change | null}
   */
  getChangeByHash(hash2) {
    const ret = wasm.automerge_getChangeByHash(this.__wbg_ptr, hash2);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @param {Hash} hash
   * @returns {ChangeMetadata | null}
   */
  getChangeMetaByHash(hash2) {
    const ret = wasm.automerge_getChangeMetaByHash(this.__wbg_ptr, hash2);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @param {Heads} have_deps
   * @returns {Change[]}
   */
  getChanges(have_deps) {
    const ret = wasm.automerge_getChanges(this.__wbg_ptr, have_deps);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @param {Automerge} other
   * @returns {Change[]}
   */
  getChangesAdded(other) {
    _assertClass(other, _Automerge);
    const ret = wasm.automerge_getChangesAdded(this.__wbg_ptr, other.__wbg_ptr);
    return ret;
  }
  /**
   * @param {Heads} have_deps
   * @returns {ChangeMetadata[]}
   */
  getChangesMeta(have_deps) {
    const ret = wasm.automerge_getChangesMeta(this.__wbg_ptr, have_deps);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @param {any} obj
   * @param {any} position
   * @param {any} heads
   * @param {any} move_cursor
   * @returns {string}
   */
  getCursor(obj, position3, heads, move_cursor) {
    let deferred2_0;
    let deferred2_1;
    try {
      const ret = wasm.automerge_getCursor(this.__wbg_ptr, obj, position3, heads, move_cursor);
      var ptr1 = ret[0];
      var len1 = ret[1];
      if (ret[3]) {
        ptr1 = 0;
        len1 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred2_0 = ptr1;
      deferred2_1 = len1;
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  /**
   * @param {any} obj
   * @param {any} cursor
   * @param {any} heads
   * @returns {number}
   */
  getCursorPosition(obj, cursor2, heads) {
    const ret = wasm.automerge_getCursorPosition(this.__wbg_ptr, obj, cursor2, heads);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
  }
  /**
   * @param {Hash} hash
   * @returns {DecodedChange | null}
   */
  getDecodedChangeByHash(hash2) {
    const ret = wasm.automerge_getDecodedChangeByHash(this.__wbg_ptr, hash2);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @returns {Heads}
   */
  getHeads() {
    const ret = wasm.automerge_getHeads(this.__wbg_ptr);
    return ret;
  }
  /**
   * @returns {Change | null}
   */
  getLastLocalChange() {
    const ret = wasm.automerge_getLastLocalChange(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {any} heads
   * @returns {Array<any>}
   */
  getMissingDeps(heads) {
    const ret = wasm.automerge_getMissingDeps(this.__wbg_ptr, heads);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @param {any} obj
   * @param {any} prop
   * @param {any} heads
   * @returns {any}
   */
  getWithType(obj, prop, heads) {
    const ret = wasm.automerge_getWithType(this.__wbg_ptr, obj, prop, heads);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @param {SyncState} state
   * @returns {boolean}
   */
  hasOurChanges(state) {
    _assertClass(state, SyncState);
    const ret = wasm.automerge_hasOurChanges(this.__wbg_ptr, state.__wbg_ptr);
    return ret !== 0;
  }
  /**
   * @param {ObjID} obj
   * @param {Prop} prop
   * @param {number} value
   */
  increment(obj, prop, value) {
    const ret = wasm.automerge_increment(this.__wbg_ptr, obj, prop, value);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * Initialize the root object of an empty document from a JS object.
   * This is much faster than setting keys one at a time for large initial states.
   * @param {any} value
   */
  initRootFromHydrate(value) {
    const ret = wasm.automerge_initRootFromHydrate(this.__wbg_ptr, value);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {any} obj
   * @param {number} index
   * @param {any} value
   * @param {any} datatype
   */
  insert(obj, index, value, datatype) {
    const ret = wasm.automerge_insert(this.__wbg_ptr, obj, index, value, datatype);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {ObjID} obj
   * @param {number} index
   * @param {ObjType} value
   * @returns {ObjID}
   */
  insertObject(obj, index, value) {
    let deferred2_0;
    let deferred2_1;
    try {
      const ret = wasm.automerge_insertObject(this.__wbg_ptr, obj, index, value);
      var ptr1 = ret[0];
      var len1 = ret[1];
      if (ret[3]) {
        ptr1 = 0;
        len1 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred2_0 = ptr1;
      deferred2_1 = len1;
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  /**
   * Insert a nested JavaScript value into a list using batch insertion.
   * This is much faster than insertObject for large nested objects.
   * The value is inserted at the given index, shifting subsequent elements.
   * @param {ObjID} obj
   * @param {number} index
   * @param {any} value
   * @returns {ObjID}
   */
  insertObjectFromHydrate(obj, index, value) {
    const ret = wasm.automerge_insertObjectFromHydrate(this.__wbg_ptr, obj, index, value);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  integrate() {
    wasm.automerge_integrate(this.__wbg_ptr);
  }
  /**
   * @param {Heads} heads
   */
  isolate(heads) {
    const ret = wasm.automerge_isolate(this.__wbg_ptr, heads);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {ObjID} obj
   * @param {number} index
   */
  joinBlock(obj, index) {
    const ret = wasm.automerge_joinBlock(this.__wbg_ptr, obj, index);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {any} obj
   * @param {any} heads
   * @returns {Array<any>}
   */
  keys(obj, heads) {
    const ret = wasm.automerge_keys(this.__wbg_ptr, obj, heads);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @param {any} obj
   * @param {any} heads
   * @returns {number}
   */
  length(obj, heads) {
    const ret = wasm.automerge_length(this.__wbg_ptr, obj, heads);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
  }
  /**
   * @param {Uint8Array} data
   * @returns {number}
   */
  loadIncremental(data) {
    const ret = wasm.automerge_loadIncremental(this.__wbg_ptr, data);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
  }
  /**
   * @param {any} obj
   * @param {any} range
   * @param {any} name
   * @param {any} value
   * @param {any} datatype
   */
  mark(obj, range, name, value, datatype) {
    const ret = wasm.automerge_mark(this.__wbg_ptr, obj, range, name, value, datatype);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {any} obj
   * @param {any} heads
   * @returns {any}
   */
  marks(obj, heads) {
    const ret = wasm.automerge_marks(this.__wbg_ptr, obj, heads);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @param {any} obj
   * @param {number} index
   * @param {any} heads
   * @returns {object}
   */
  marksAt(obj, index, heads) {
    const ret = wasm.automerge_marksAt(this.__wbg_ptr, obj, index, heads);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @param {any} obj
   * @param {any} heads
   * @param {any} meta
   * @returns {any}
   */
  materialize(obj, heads, meta) {
    const ret = wasm.automerge_materialize(this.__wbg_ptr, obj, heads, meta);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @param {Automerge} other
   * @returns {Heads}
   */
  merge(other) {
    _assertClass(other, _Automerge);
    const ret = wasm.automerge_merge(this.__wbg_ptr, other.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @param {string | null} [actor]
   * @returns {Automerge}
   */
  static new(actor) {
    var ptr0 = isLikeNone(actor) ? 0 : passStringToWasm0(actor, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    const ret = wasm.automerge_new(ptr0, len0);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return _Automerge.__wrap(ret[0]);
  }
  /**
   * @param {any} obj
   * @param {any} heads
   * @returns {object}
   */
  objInfo(obj, heads) {
    const ret = wasm.automerge_objInfo(this.__wbg_ptr, obj, heads);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @returns {number}
   */
  pendingOps() {
    const ret = wasm.automerge_pendingOps(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {any} obj
   * @param {any} value
   * @param {any} datatype
   */
  push(obj, value, datatype) {
    const ret = wasm.automerge_push(this.__wbg_ptr, obj, value, datatype);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {ObjID} obj
   * @param {ObjType} value
   * @returns {ObjID}
   */
  pushObject(obj, value) {
    let deferred2_0;
    let deferred2_1;
    try {
      const ret = wasm.automerge_pushObject(this.__wbg_ptr, obj, value);
      var ptr1 = ret[0];
      var len1 = ret[1];
      if (ret[3]) {
        ptr1 = 0;
        len1 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred2_0 = ptr1;
      deferred2_1 = len1;
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  /**
   * @param {any} obj
   * @param {any} prop
   * @param {any} value
   * @param {any} datatype
   */
  put(obj, prop, value, datatype) {
    const ret = wasm.automerge_put(this.__wbg_ptr, obj, prop, value, datatype);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {ObjID} obj
   * @param {Prop} prop
   * @param {ObjType} value
   * @returns {ObjID}
   */
  putObject(obj, prop, value) {
    const ret = wasm.automerge_putObject(this.__wbg_ptr, obj, prop, value);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * Put a nested JavaScript value as a new object tree using batch insertion.
   * This is much faster than putObject for large nested objects.
   * For map keys this overwrites any existing value. For list indices this
   * overwrites the element at that index.
   * @param {ObjID} obj
   * @param {Prop} prop
   * @param {any} value
   * @returns {ObjID}
   */
  putObjectFromHydrate(obj, prop, value) {
    const ret = wasm.automerge_putObjectFromHydrate(this.__wbg_ptr, obj, prop, value);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @param {SyncState} state
   * @param {SyncMessage} message
   */
  receiveSyncMessage(state, message) {
    _assertClass(state, SyncState);
    const ret = wasm.automerge_receiveSyncMessage(this.__wbg_ptr, state.__wbg_ptr, message);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {string} datatype
   * @param {Function} construct
   * @param {(arg: any) => any | undefined} deconstruct
   */
  registerDatatype(datatype, construct, deconstruct) {
    const ret = wasm.automerge_registerDatatype(this.__wbg_ptr, datatype, construct, deconstruct);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  resetDiffCursor() {
    wasm.automerge_resetDiffCursor(this.__wbg_ptr);
  }
  /**
   * @returns {number}
   */
  rollback() {
    const ret = wasm.automerge_rollback(this.__wbg_ptr);
    return ret;
  }
  /**
   * @returns {Uint8Array}
   */
  save() {
    const ret = wasm.automerge_save(this.__wbg_ptr);
    return ret;
  }
  /**
   * @returns {Uint8Array}
   */
  saveAndVerify() {
    const ret = wasm.automerge_saveAndVerify(this.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @param {any} hashes
   * @returns {Uint8Array}
   */
  saveBundle(hashes) {
    const ret = wasm.automerge_saveBundle(this.__wbg_ptr, hashes);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @returns {Uint8Array}
   */
  saveIncremental() {
    const ret = wasm.automerge_saveIncremental(this.__wbg_ptr);
    return ret;
  }
  /**
   * @returns {Uint8Array}
   */
  saveNoCompress() {
    const ret = wasm.automerge_saveNoCompress(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {Heads} heads
   * @returns {Uint8Array}
   */
  saveSince(heads) {
    const ret = wasm.automerge_saveSince(this.__wbg_ptr, heads);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @param {any} obj
   * @param {any} heads
   * @returns {Array<any>}
   */
  spans(obj, heads) {
    const ret = wasm.automerge_spans(this.__wbg_ptr, obj, heads);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @param {any} obj
   * @param {number} start
   * @param {number} delete_count
   * @param {any} text
   */
  splice(obj, start, delete_count, text) {
    const ret = wasm.automerge_splice(this.__wbg_ptr, obj, start, delete_count, text);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * Splice values into a list using batch insertion.
   * This is much faster than individual insert calls for multiple values.
   * @param {ObjID} obj
   * @param {number} index
   * @param {number} del
   * @param {any} values
   */
  spliceFromHydrate(obj, index, del, values) {
    const ret = wasm.automerge_spliceFromHydrate(this.__wbg_ptr, obj, index, del, values);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {ObjID} obj
   * @param {number} index
   * @param {{[key: string]: MaterializeValue}} block
   */
  splitBlock(obj, index, block2) {
    const ret = wasm.automerge_splitBlock(this.__wbg_ptr, obj, index, block2);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @returns {Stats}
   */
  stats() {
    const ret = wasm.automerge_stats(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {any} obj
   * @param {any} heads
   * @returns {string}
   */
  text(obj, heads) {
    let deferred2_0;
    let deferred2_1;
    try {
      const ret = wasm.automerge_text(this.__wbg_ptr, obj, heads);
      var ptr1 = ret[0];
      var len1 = ret[1];
      if (ret[3]) {
        ptr1 = 0;
        len1 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred2_0 = ptr1;
      deferred2_1 = len1;
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  /**
   * @param {any} meta
   * @returns {MaterializeValue}
   */
  toJS(meta) {
    const ret = wasm.automerge_toJS(this.__wbg_ptr, meta);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @returns {Hash[]}
   */
  topoHistoryTraversal() {
    const ret = wasm.automerge_topoHistoryTraversal(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {ObjID} obj
   * @param {MarkRange} range
   * @param {string} name
   */
  unmark(obj, range, name) {
    const ret = wasm.automerge_unmark(this.__wbg_ptr, obj, range, name);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {ObjID} obj
   * @param {number} index
   * @param {{[key: string]: MaterializeValue}} block
   */
  updateBlock(obj, index, block2) {
    const ret = wasm.automerge_updateBlock(this.__wbg_ptr, obj, index, block2);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  updateDiffCursor() {
    wasm.automerge_updateDiffCursor(this.__wbg_ptr);
  }
  /**
   * @param {ObjID} obj
   * @param {Span[]} args
   * @param {UpdateSpansConfig | undefined | null} config
   */
  updateSpans(obj, args, config) {
    const ret = wasm.automerge_updateSpans(this.__wbg_ptr, obj, args, config);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {ObjID} obj
   * @param {string} new_text
   */
  updateText(obj, new_text) {
    const ret = wasm.automerge_updateText(this.__wbg_ptr, obj, new_text);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
};
if (Symbol.dispose) Automerge.prototype[Symbol.dispose] = Automerge.prototype.free;
var SyncState = class _SyncState {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(_SyncState.prototype);
    obj.__wbg_ptr = ptr;
    SyncStateFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    SyncStateFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_syncstate_free(ptr, 0);
  }
  /**
   * @returns {SyncState}
   */
  clone() {
    const ret = wasm.syncstate_clone(this.__wbg_ptr);
    return _SyncState.__wrap(ret);
  }
  /**
   * @returns {Heads}
   */
  get lastSentHeads() {
    const ret = wasm.syncstate_lastSentHeads(this.__wbg_ptr);
    return ret;
  }
  /**
   * @returns {boolean}
   */
  get peerReadOnly() {
    const ret = wasm.syncstate_peerReadOnly(this.__wbg_ptr);
    return ret !== 0;
  }
  /**
   * @returns {boolean}
   */
  get readOnly() {
    const ret = wasm.syncstate_readOnly(this.__wbg_ptr);
    return ret !== 0;
  }
  /**
   * @param {Heads} heads
   */
  set lastSentHeads(heads) {
    const ret = wasm.syncstate_set_lastSentHeads(this.__wbg_ptr, heads);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {boolean} read_only
   */
  set readOnly(read_only) {
    wasm.syncstate_set_readOnly(this.__wbg_ptr, read_only);
  }
  /**
   * @param {Heads} hashes
   */
  set sentHashes(hashes) {
    const ret = wasm.syncstate_set_sentHashes(this.__wbg_ptr, hashes);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @returns {Heads}
   */
  get sharedHeads() {
    const ret = wasm.syncstate_sharedHeads(this.__wbg_ptr);
    return ret;
  }
};
if (Symbol.dispose) SyncState.prototype[Symbol.dispose] = SyncState.prototype.free;
function create(options) {
  const ret = wasm.create(options);
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return Automerge.__wrap(ret[0]);
}
function decodeChange(change2) {
  const ret = wasm.decodeChange(change2);
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return takeFromExternrefTable0(ret[0]);
}
function decodeSyncMessage(msg) {
  const ret = wasm.decodeSyncMessage(msg);
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return takeFromExternrefTable0(ret[0]);
}
function decodeSyncState(data) {
  const ret = wasm.decodeSyncState(data);
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return SyncState.__wrap(ret[0]);
}
function encodeChange(change2) {
  const ret = wasm.encodeChange(change2);
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return takeFromExternrefTable0(ret[0]);
}
function encodeSyncMessage(message) {
  const ret = wasm.encodeSyncMessage(message);
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return takeFromExternrefTable0(ret[0]);
}
function encodeSyncState(state) {
  _assertClass(state, SyncState);
  const ret = wasm.encodeSyncState(state.__wbg_ptr);
  return ret;
}
function exportSyncState(state) {
  _assertClass(state, SyncState);
  const ret = wasm.exportSyncState(state.__wbg_ptr);
  return ret;
}
function importSyncState(state) {
  const ret = wasm.importSyncState(state);
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return SyncState.__wrap(ret[0]);
}
function initSyncState() {
  const ret = wasm.initSyncState();
  return SyncState.__wrap(ret);
}
function load(data, options) {
  const ret = wasm.load(data, options);
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return Automerge.__wrap(ret[0]);
}
function readBundle(bundle) {
  const ret = wasm.readBundle(bundle);
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return takeFromExternrefTable0(ret[0]);
}
function wasmReleaseInfo() {
  const ret = wasm.wasmReleaseInfo();
  return ret;
}
function __wbg_get_imports() {
  const import0 = {
    __proto__: null,
    __wbg_BigInt_65bcea251e788083: function(arg0) {
      const ret = BigInt(arg0);
      return ret;
    },
    __wbg_Error_960c155d3d49e4c2: function(arg0, arg1) {
      const ret = Error(getStringFromWasm0(arg0, arg1));
      return ret;
    },
    __wbg_String_8564e559799eccda: function(arg0, arg1) {
      const ret = String(arg1);
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    },
    __wbg___wbindgen_boolean_get_6ea149f0a8dcc5ff: function(arg0) {
      const v = arg0;
      const ret = typeof v === "boolean" ? v : void 0;
      return isLikeNone(ret) ? 16777215 : ret ? 1 : 0;
    },
    __wbg___wbindgen_debug_string_ab4b34d23d6778bd: function(arg0, arg1) {
      const ret = debugString(arg1);
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    },
    __wbg___wbindgen_gt_fd08d8cbe0a8551c: function(arg0, arg1) {
      const ret = arg0 > arg1;
      return ret;
    },
    __wbg___wbindgen_is_bigint_ec25c7f91b4d9e93: function(arg0) {
      const ret = typeof arg0 === "bigint";
      return ret;
    },
    __wbg___wbindgen_is_function_3baa9db1a987f47d: function(arg0) {
      const ret = typeof arg0 === "function";
      return ret;
    },
    __wbg___wbindgen_is_null_52ff4ec04186736f: function(arg0) {
      const ret = arg0 === null;
      return ret;
    },
    __wbg___wbindgen_is_object_63322ec0cd6ea4ef: function(arg0) {
      const val = arg0;
      const ret = typeof val === "object" && val !== null;
      return ret;
    },
    __wbg___wbindgen_is_string_6df3bf7ef1164ed3: function(arg0) {
      const ret = typeof arg0 === "string";
      return ret;
    },
    __wbg___wbindgen_is_undefined_29a43b4d42920abd: function(arg0) {
      const ret = arg0 === void 0;
      return ret;
    },
    __wbg___wbindgen_jsval_loose_eq_cac3565e89b4134c: function(arg0, arg1) {
      const ret = arg0 == arg1;
      return ret;
    },
    __wbg___wbindgen_lt_78bab382628fb48f: function(arg0, arg1) {
      const ret = arg0 < arg1;
      return ret;
    },
    __wbg___wbindgen_neg_8d39d23ef65c9fdb: function(arg0) {
      const ret = -arg0;
      return ret;
    },
    __wbg___wbindgen_number_get_c7f42aed0525c451: function(arg0, arg1) {
      const obj = arg1;
      const ret = typeof obj === "number" ? obj : void 0;
      getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    },
    __wbg___wbindgen_string_get_7ed5322991caaec5: function(arg0, arg1) {
      const obj = arg1;
      const ret = typeof obj === "string" ? obj : void 0;
      var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      var len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    },
    __wbg___wbindgen_throw_6b64449b9b9ed33c: function(arg0, arg1) {
      throw new Error(getStringFromWasm0(arg0, arg1));
    },
    __wbg_apply_329b2a440415c2e6: function() {
      return handleError(function(arg0, arg1, arg2) {
        const ret = Reflect.apply(arg0, arg1, arg2);
        return ret;
      }, arguments);
    },
    __wbg_assign_752c2af1512cc7fd: function(arg0, arg1) {
      const ret = Object.assign(arg0, arg1);
      return ret;
    },
    __wbg_call_14b169f759b26747: function() {
      return handleError(function(arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
      }, arguments);
    },
    __wbg_call_a24592a6f349a97e: function() {
      return handleError(function(arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
      }, arguments);
    },
    __wbg_concat_1cef5380372e969d: function(arg0, arg1) {
      const ret = arg0.concat(arg1);
      return ret;
    },
    __wbg_defineProperty_aeb95d0434ce03d0: function(arg0, arg1, arg2) {
      const ret = Object.defineProperty(arg0, arg1, arg2);
      return ret;
    },
    __wbg_deleteProperty_d5f7bd763acbdb44: function() {
      return handleError(function(arg0, arg1) {
        const ret = Reflect.deleteProperty(arg0, arg1);
        return ret;
      }, arguments);
    },
    __wbg_done_9158f7cc8751ba32: function(arg0) {
      const ret = arg0.done;
      return ret;
    },
    __wbg_entries_e0b73aa8571ddb56: function(arg0) {
      const ret = Object.entries(arg0);
      return ret;
    },
    __wbg_error_a6fa202b58aa1cd3: function(arg0, arg1) {
      let deferred0_0;
      let deferred0_1;
      try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
      } finally {
        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
      }
    },
    __wbg_for_b0616d1de7774be9: function(arg0, arg1) {
      const ret = Symbol.for(getStringFromWasm0(arg0, arg1));
      return ret;
    },
    __wbg_freeze_c79f45721998bbbc: function(arg0) {
      const ret = Object.freeze(arg0);
      return ret;
    },
    __wbg_from_0dbf29f09e7fb200: function(arg0) {
      const ret = Array.from(arg0);
      return ret;
    },
    __wbg_getRandomValues_76dfc69825c9c552: function() {
      return handleError(function(arg0, arg1) {
        globalThis.crypto.getRandomValues(getArrayU8FromWasm0(arg0, arg1));
      }, arguments);
    },
    __wbg_getTime_da7c55f52b71e8c6: function(arg0) {
      const ret = arg0.getTime();
      return ret;
    },
    __wbg_get_1affdbdd5573b16a: function() {
      return handleError(function(arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
      }, arguments);
    },
    __wbg_get_6011fa3a58f61074: function() {
      return handleError(function(arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
      }, arguments);
    },
    __wbg_get_8360291721e2339f: function(arg0, arg1) {
      const ret = arg0[arg1 >>> 0];
      return ret;
    },
    __wbg_get_unchecked_17f53dad852b9588: function(arg0, arg1) {
      const ret = arg0[arg1 >>> 0];
      return ret;
    },
    __wbg_instanceof_ArrayBuffer_7c8433c6ed14ffe3: function(arg0) {
      let result;
      try {
        result = arg0 instanceof ArrayBuffer;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    },
    __wbg_instanceof_Date_81b75f5ed36b30ea: function(arg0) {
      let result;
      try {
        result = arg0 instanceof Date;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    },
    __wbg_instanceof_Object_7c99480a1cdfb911: function(arg0) {
      let result;
      try {
        result = arg0 instanceof Object;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    },
    __wbg_instanceof_Uint8Array_152ba1f289edcf3f: function(arg0) {
      let result;
      try {
        result = arg0 instanceof Uint8Array;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    },
    __wbg_isArray_2790516aa848bf18: function(arg0) {
      const ret = Array.isArray(arg0);
      return ret;
    },
    __wbg_isArray_c3109d14ffc06469: function(arg0) {
      const ret = Array.isArray(arg0);
      return ret;
    },
    __wbg_iterator_013bc09ec998c2a7: function() {
      const ret = Symbol.iterator;
      return ret;
    },
    __wbg_keys_2fd1bfdda7e278ca: function(arg0) {
      const ret = Object.keys(arg0);
      return ret;
    },
    __wbg_length_3d4ecd04bd8d22f1: function(arg0) {
      const ret = arg0.length;
      return ret;
    },
    __wbg_length_6a846b3b23b74aca: function(arg0) {
      const ret = arg0.length;
      return ret;
    },
    __wbg_length_9f1775224cf1d815: function(arg0) {
      const ret = arg0.length;
      return ret;
    },
    __wbg_log_7e1aa9064a1dbdbd: function(arg0) {
      console.log(arg0);
    },
    __wbg_log_dfa1efedf266562e: function(arg0, arg1) {
      console.log(arg0, arg1);
    },
    __wbg_new_0c7403db6e782f19: function(arg0) {
      const ret = new Uint8Array(arg0);
      return ret;
    },
    __wbg_new_191521fecb171639: function(arg0, arg1) {
      const ret = new RangeError(getStringFromWasm0(arg0, arg1));
      return ret;
    },
    __wbg_new_227d7c05414eb861: function() {
      const ret = new Error();
      return ret;
    },
    __wbg_new_5e360d2ff7b9e1c3: function(arg0, arg1) {
      const ret = new Error(getStringFromWasm0(arg0, arg1));
      return ret;
    },
    __wbg_new_682678e2f47e32bc: function() {
      const ret = new Array();
      return ret;
    },
    __wbg_new_7913666fe5070684: function(arg0) {
      const ret = new Date(arg0);
      return ret;
    },
    __wbg_new_aa8d0fa9762c29bd: function() {
      const ret = new Object();
      return ret;
    },
    __wbg_new_from_slice_b5ea43e23f6008c0: function(arg0, arg1) {
      const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
      return ret;
    },
    __wbg_next_0340c4ae324393c3: function() {
      return handleError(function(arg0) {
        const ret = arg0.next();
        return ret;
      }, arguments);
    },
    __wbg_next_7646edaa39458ef7: function(arg0) {
      const ret = arg0.next;
      return ret;
    },
    __wbg_ownKeys_0231887680f0f945: function() {
      return handleError(function(arg0) {
        const ret = Reflect.ownKeys(arg0);
        return ret;
      }, arguments);
    },
    __wbg_prototypesetcall_a6b02eb00b0f4ce2: function(arg0, arg1, arg2) {
      Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
    },
    __wbg_push_471a5b068a5295f6: function(arg0, arg1) {
      const ret = arg0.push(arg1);
      return ret;
    },
    __wbg_set_022bee52d0b05b19: function() {
      return handleError(function(arg0, arg1, arg2) {
        const ret = Reflect.set(arg0, arg1, arg2);
        return ret;
      }, arguments);
    },
    __wbg_set_3bf1de9fab0cd644: function(arg0, arg1, arg2) {
      arg0[arg1 >>> 0] = arg2;
    },
    __wbg_set_6be42768c690e380: function(arg0, arg1, arg2) {
      arg0[arg1] = arg2;
    },
    __wbg_slice_45916ed2fae7e0ea: function(arg0, arg1, arg2) {
      const ret = arg0.slice(arg1 >>> 0, arg2 >>> 0);
      return ret;
    },
    __wbg_stack_3b0d974bbf31e44f: function(arg0, arg1) {
      const ret = arg1.stack;
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    },
    __wbg_stringify_057c4027271f8007: function(arg0, arg1) {
      const ret = JSON.stringify(arg1);
      var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      var len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    },
    __wbg_toString_5a84b8552b34a19d: function(arg0) {
      const ret = arg0.toString();
      return ret;
    },
    __wbg_toString_c3061af2bf859d19: function() {
      return handleError(function(arg0, arg1) {
        const ret = arg0.toString(arg1);
        return ret;
      }, arguments);
    },
    __wbg_toString_c96dc76d5547a715: function(arg0, arg1, arg2) {
      const ret = arg1.toString(arg2);
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    },
    __wbg_unshift_951ea71d9d2dc660: function(arg0, arg1) {
      const ret = arg0.unshift(arg1);
      return ret;
    },
    __wbg_value_ee3a06f4579184fa: function(arg0) {
      const ret = arg0.value;
      return ret;
    },
    __wbg_values_301a77363cf6c773: function(arg0) {
      const ret = Object.values(arg0);
      return ret;
    },
    __wbindgen_cast_0000000000000001: function(arg0) {
      const ret = arg0;
      return ret;
    },
    __wbindgen_cast_0000000000000002: function(arg0) {
      const ret = arg0;
      return ret;
    },
    __wbindgen_cast_0000000000000003: function(arg0, arg1) {
      const ret = getStringFromWasm0(arg0, arg1);
      return ret;
    },
    __wbindgen_cast_0000000000000004: function(arg0) {
      const ret = BigInt.asUintN(64, arg0);
      return ret;
    },
    __wbindgen_init_externref_table: function() {
      const table = wasm.__wbindgen_externrefs;
      const offset = table.grow(4);
      table.set(0, void 0);
      table.set(offset + 0, void 0);
      table.set(offset + 1, null);
      table.set(offset + 2, true);
      table.set(offset + 3, false);
    }
  };
  return {
    __proto__: null,
    "./automerge_wasm_bg.js": import0
  };
}
var AutomergeFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm.__wbg_automerge_free(ptr >>> 0, 1));
var SyncStateFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm.__wbg_syncstate_free(ptr >>> 0, 1));
function addToExternrefTable0(obj) {
  const idx = wasm.__externref_table_alloc();
  wasm.__wbindgen_externrefs.set(idx, obj);
  return idx;
}
function _assertClass(instance, klass) {
  if (!(instance instanceof klass)) {
    throw new Error(`expected instance of ${klass.name}`);
  }
}
function debugString(val) {
  const type = typeof val;
  if (type == "number" || type == "boolean" || val == null) {
    return `${val}`;
  }
  if (type == "string") {
    return `"${val}"`;
  }
  if (type == "symbol") {
    const description = val.description;
    if (description == null) {
      return "Symbol";
    } else {
      return `Symbol(${description})`;
    }
  }
  if (type == "function") {
    const name = val.name;
    if (typeof name == "string" && name.length > 0) {
      return `Function(${name})`;
    } else {
      return "Function";
    }
  }
  if (Array.isArray(val)) {
    const length = val.length;
    let debug8 = "[";
    if (length > 0) {
      debug8 += debugString(val[0]);
    }
    for (let i = 1; i < length; i++) {
      debug8 += ", " + debugString(val[i]);
    }
    debug8 += "]";
    return debug8;
  }
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches && builtInMatches.length > 1) {
    className = builtInMatches[1];
  } else {
    return toString.call(val);
  }
  if (className == "Object") {
    try {
      return "Object(" + JSON.stringify(val) + ")";
    } catch (_) {
      return "Object";
    }
  }
  if (val instanceof Error) {
    return `${val.name}: ${val.message}
${val.stack}`;
  }
  return className;
}
function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
var cachedDataViewMemory0 = null;
function getDataViewMemory0() {
  if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm.memory.buffer) {
    cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
  }
  return cachedDataViewMemory0;
}
function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return decodeText(ptr, len);
}
var cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
  if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}
function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    const idx = addToExternrefTable0(e);
    wasm.__wbindgen_exn_store(idx);
  }
}
function isLikeNone(x) {
  return x === void 0 || x === null;
}
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === void 0) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr2 = malloc(buf.length, 1) >>> 0;
    getUint8ArrayMemory0().subarray(ptr2, ptr2 + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr2;
  }
  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;
  const mem = getUint8ArrayMemory0();
  let offset = 0;
  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 127) break;
    mem[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
    const view3 = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
    const ret = cachedTextEncoder.encodeInto(arg, view3);
    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}
function takeFromExternrefTable0(idx) {
  const value = wasm.__wbindgen_externrefs.get(idx);
  wasm.__externref_table_dealloc(idx);
  return value;
}
var cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
var MAX_SAFARI_DECODE_BYTES = 2146435072;
var numBytesDecoded = 0;
function decodeText(ptr, len) {
  numBytesDecoded += len;
  if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
    cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
    cachedTextDecoder.decode();
    numBytesDecoded = len;
  }
  return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}
var cachedTextEncoder = new TextEncoder();
if (!("encodeInto" in cachedTextEncoder)) {
  cachedTextEncoder.encodeInto = function(arg, view3) {
    const buf = cachedTextEncoder.encode(arg);
    view3.set(buf);
    return {
      read: arg.length,
      written: buf.length
    };
  };
}
var WASM_VECTOR_LEN = 0;
var wasmModule;
var wasm;
function __wbg_finalize_init(instance, module) {
  wasm = instance.exports;
  wasmModule = module;
  cachedDataViewMemory0 = null;
  cachedUint8ArrayMemory0 = null;
  wasm.__wbindgen_start();
  return wasm;
}
async function __wbg_load(module, imports) {
  if (typeof Response === "function" && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") {
      try {
        return await WebAssembly.instantiateStreaming(module, imports);
      } catch (e) {
        const validResponse = module.ok && expectedResponseType(module.type);
        if (validResponse && module.headers.get("Content-Type") !== "application/wasm") {
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
        } else {
          throw e;
        }
      }
    }
    const bytes = await module.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module, imports);
    if (instance instanceof WebAssembly.Instance) {
      return { instance, module };
    } else {
      return instance;
    }
  }
  function expectedResponseType(type) {
    switch (type) {
      case "basic":
      case "cors":
      case "default":
        return true;
    }
    return false;
  }
}
function initSync(module) {
  if (wasm !== void 0) return wasm;
  if (module !== void 0) {
    if (Object.getPrototypeOf(module) === Object.prototype) {
      ({ module } = module);
    } else {
      console.warn("using deprecated parameters for `initSync()`; pass a single object instead");
    }
  }
  const imports = __wbg_get_imports();
  if (!(module instanceof WebAssembly.Module)) {
    module = new WebAssembly.Module(module);
  }
  const instance = new WebAssembly.Instance(module, imports);
  return __wbg_finalize_init(instance, module);
}
async function __wbg_init(module_or_path) {
  if (wasm !== void 0) return wasm;
  if (module_or_path !== void 0) {
    if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
      ({ module_or_path } = module_or_path);
    } else {
      console.warn("using deprecated parameters for the initialization function; pass a single object instead");
    }
  }
  if (module_or_path === void 0) {
    module_or_path = new /* @vite-ignore */
    URL("automerge_wasm_bg.wasm", import.meta.url);
  }
  const imports = __wbg_get_imports();
  if (typeof module_or_path === "string" || typeof Request === "function" && module_or_path instanceof Request || typeof URL === "function" && module_or_path instanceof URL) {
    module_or_path = fetch(module_or_path);
  }
  const { instance, module } = await __wbg_load(await module_or_path, imports);
  return __wbg_finalize_init(instance, module);
}

// node_modules/.deno/@automerge+automerge@3.2.6/node_modules/@automerge/automerge/dist/mjs/low_level.js
var _initialized = false;
var _initializeListeners = [];
function UseApi(api2) {
  for (const k in api2) {
    ;
    ApiHandler[k] = api2[k];
  }
  _initialized = true;
  for (const listener of _initializeListeners) {
    listener();
  }
}
var ApiHandler = {
  create(options) {
    throw new RangeError("Automerge.use() not called");
  },
  load(data, options) {
    throw new RangeError("Automerge.use() not called (load)");
  },
  encodeChange(change2) {
    throw new RangeError("Automerge.use() not called (encodeChange)");
  },
  decodeChange(change2) {
    throw new RangeError("Automerge.use() not called (decodeChange)");
  },
  initSyncState() {
    throw new RangeError("Automerge.use() not called (initSyncState)");
  },
  encodeSyncMessage(message) {
    throw new RangeError("Automerge.use() not called (encodeSyncMessage)");
  },
  decodeSyncMessage(msg) {
    throw new RangeError("Automerge.use() not called (decodeSyncMessage)");
  },
  encodeSyncState(state) {
    throw new RangeError("Automerge.use() not called (encodeSyncState)");
  },
  decodeSyncState(data) {
    throw new RangeError("Automerge.use() not called (decodeSyncState)");
  },
  exportSyncState(state) {
    throw new RangeError("Automerge.use() not called (exportSyncState)");
  },
  importSyncState(state) {
    throw new RangeError("Automerge.use() not called (importSyncState)");
  },
  readBundle(data) {
    throw new RangeError("Automerge.use() not called (readBundle)");
  },
  wasmReleaseInfo() {
    throw new RangeError("Automerge.use() not called (wasmReleaseInfo)");
  }
};
function initializeWasm(wasmBlob) {
  return __wbg_init({ module_or_path: wasmBlob }).then((_) => {
    UseApi(automerge_wasm_exports);
  });
}
function initializeBase64Wasm(wasmBase64) {
  return initializeWasm(Uint8Array.from(atob(wasmBase64), (c) => c.charCodeAt(0)));
}
function wasmInitialized() {
  if (_initialized)
    return Promise.resolve();
  return new Promise((resolve) => {
    _initializeListeners.push(resolve);
  });
}
function isWasmInitialized() {
  return _initialized;
}

// node_modules/.deno/@automerge+automerge@3.2.6/node_modules/@automerge/automerge/dist/mjs/wasm_bindgen_output/bundler/automerge_wasm.js
var automerge_wasm_exports2 = {};
__export(automerge_wasm_exports2, {
  Automerge: () => Automerge2,
  SyncState: () => SyncState2,
  create: () => create2,
  decodeChange: () => decodeChange2,
  decodeSyncMessage: () => decodeSyncMessage2,
  decodeSyncState: () => decodeSyncState2,
  encodeChange: () => encodeChange2,
  encodeSyncMessage: () => encodeSyncMessage2,
  encodeSyncState: () => encodeSyncState2,
  exportSyncState: () => exportSyncState2,
  importSyncState: () => importSyncState2,
  initSyncState: () => initSyncState2,
  load: () => load2,
  readBundle: () => readBundle2,
  wasmReleaseInfo: () => wasmReleaseInfo2
});

// node_modules/.deno/@automerge+automerge@3.2.6/node_modules/@automerge/automerge/dist/mjs/wasm_bindgen_output/bundler/automerge_wasm_bg.wasm
var automerge_wasm_bg_exports = {};
__export(automerge_wasm_bg_exports, {
  default: () => automerge_wasm_bg_default
});
var automerge_wasm_bg_default = "/automerge_wasm_bg.wasm";

// node_modules/.deno/@automerge+automerge@3.2.6/node_modules/@automerge/automerge/dist/mjs/wasm_bindgen_output/bundler/automerge_wasm_bg.js
var Automerge2 = class _Automerge {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(_Automerge.prototype);
    obj.__wbg_ptr = ptr;
    AutomergeFinalization2.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    AutomergeFinalization2.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm2.__wbg_automerge_free(ptr, 0);
  }
  /**
   * @param {any} object
   * @param {any} meta
   * @returns {any}
   */
  applyAndReturnPatches(object, meta) {
    const ret = wasm2.automerge_applyAndReturnPatches(this.__wbg_ptr, object, meta);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @param {Change[]} changes
   */
  applyChanges(changes) {
    const ret = wasm2.automerge_applyChanges(this.__wbg_ptr, changes);
    if (ret[1]) {
      throw takeFromExternrefTable02(ret[0]);
    }
  }
  /**
   * @param {any} object
   * @param {any} meta
   * @returns {any}
   */
  applyPatches(object, meta) {
    const ret = wasm2.automerge_applyPatches(this.__wbg_ptr, object, meta);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @param {string | null} [actor]
   * @returns {Automerge}
   */
  clone(actor) {
    var ptr0 = isLikeNone2(actor) ? 0 : passStringToWasm02(actor, wasm2.__wbindgen_malloc, wasm2.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN2;
    const ret = wasm2.automerge_clone(this.__wbg_ptr, ptr0, len0);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return _Automerge.__wrap(ret[0]);
  }
  /**
   * @param {string | null} [message]
   * @param {number | null} [time]
   * @returns {Hash | null}
   */
  commit(message, time) {
    var ptr0 = isLikeNone2(message) ? 0 : passStringToWasm02(message, wasm2.__wbindgen_malloc, wasm2.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN2;
    const ret = wasm2.automerge_commit(this.__wbg_ptr, ptr0, len0, !isLikeNone2(time), isLikeNone2(time) ? 0 : time);
    return ret;
  }
  /**
   * @param {ObjID} obj
   * @param {Prop} prop
   */
  delete(obj, prop) {
    const ret = wasm2.automerge_delete(this.__wbg_ptr, obj, prop);
    if (ret[1]) {
      throw takeFromExternrefTable02(ret[0]);
    }
  }
  /**
   * @param {Heads} before
   * @param {Heads} after
   * @returns {Patch[]}
   */
  diff(before, after) {
    const ret = wasm2.automerge_diff(this.__wbg_ptr, before, after);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @returns {Patch[]}
   */
  diffIncremental() {
    const ret = wasm2.automerge_diffIncremental(this.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @param {Prop[] | string} path
   * @param {Heads} before
   * @param {Heads} after
   * @param {any} options
   * @returns {Array<any>}
   */
  diffPath(path, before, after, options) {
    const ret = wasm2.automerge_diffPath(this.__wbg_ptr, path, before, after, options);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  dump() {
    wasm2.automerge_dump(this.__wbg_ptr);
  }
  /**
   * @param {string | null} [message]
   * @param {number | null} [time]
   * @returns {Hash}
   */
  emptyChange(message, time) {
    var ptr0 = isLikeNone2(message) ? 0 : passStringToWasm02(message, wasm2.__wbindgen_malloc, wasm2.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN2;
    const ret = wasm2.automerge_emptyChange(this.__wbg_ptr, ptr0, len0, !isLikeNone2(time), isLikeNone2(time) ? 0 : time);
    return ret;
  }
  /**
   * @param {boolean} enable
   * @returns {boolean}
   */
  enableFreeze(enable) {
    const ret = wasm2.automerge_enableFreeze(this.__wbg_ptr, enable);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return ret[0] !== 0;
  }
  /**
   * @param {string | null | undefined} actor
   * @param {any} heads
   * @returns {Automerge}
   */
  fork(actor, heads) {
    var ptr0 = isLikeNone2(actor) ? 0 : passStringToWasm02(actor, wasm2.__wbindgen_malloc, wasm2.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN2;
    const ret = wasm2.automerge_fork(this.__wbg_ptr, ptr0, len0, heads);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return _Automerge.__wrap(ret[0]);
  }
  /**
   * @param {SyncState} state
   * @returns {SyncMessage | null}
   */
  generateSyncMessage(state) {
    _assertClass2(state, SyncState2);
    const ret = wasm2.automerge_generateSyncMessage(this.__wbg_ptr, state.__wbg_ptr);
    return ret;
  }
  /**
   * @param {any} obj
   * @param {any} prop
   * @param {any} heads
   * @returns {any}
   */
  get(obj, prop, heads) {
    const ret = wasm2.automerge_get(this.__wbg_ptr, obj, prop, heads);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @returns {Actor}
   */
  getActorId() {
    let deferred1_0;
    let deferred1_1;
    try {
      const ret = wasm2.automerge_getActorId(this.__wbg_ptr);
      deferred1_0 = ret[0];
      deferred1_1 = ret[1];
      return getStringFromWasm02(ret[0], ret[1]);
    } finally {
      wasm2.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * @param {any} obj
   * @param {any} arg
   * @param {any} heads
   * @returns {Array<any>}
   */
  getAll(obj, arg, heads) {
    const ret = wasm2.automerge_getAll(this.__wbg_ptr, obj, arg, heads);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @param {any} text
   * @param {number} index
   * @param {any} heads
   * @returns {any}
   */
  getBlock(text, index, heads) {
    const ret = wasm2.automerge_getBlock(this.__wbg_ptr, text, index, heads);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @param {Hash} hash
   * @returns {Change | null}
   */
  getChangeByHash(hash2) {
    const ret = wasm2.automerge_getChangeByHash(this.__wbg_ptr, hash2);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @param {Hash} hash
   * @returns {ChangeMetadata | null}
   */
  getChangeMetaByHash(hash2) {
    const ret = wasm2.automerge_getChangeMetaByHash(this.__wbg_ptr, hash2);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @param {Heads} have_deps
   * @returns {Change[]}
   */
  getChanges(have_deps) {
    const ret = wasm2.automerge_getChanges(this.__wbg_ptr, have_deps);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @param {Automerge} other
   * @returns {Change[]}
   */
  getChangesAdded(other) {
    _assertClass2(other, _Automerge);
    const ret = wasm2.automerge_getChangesAdded(this.__wbg_ptr, other.__wbg_ptr);
    return ret;
  }
  /**
   * @param {Heads} have_deps
   * @returns {ChangeMetadata[]}
   */
  getChangesMeta(have_deps) {
    const ret = wasm2.automerge_getChangesMeta(this.__wbg_ptr, have_deps);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @param {any} obj
   * @param {any} position
   * @param {any} heads
   * @param {any} move_cursor
   * @returns {string}
   */
  getCursor(obj, position3, heads, move_cursor) {
    let deferred2_0;
    let deferred2_1;
    try {
      const ret = wasm2.automerge_getCursor(this.__wbg_ptr, obj, position3, heads, move_cursor);
      var ptr1 = ret[0];
      var len1 = ret[1];
      if (ret[3]) {
        ptr1 = 0;
        len1 = 0;
        throw takeFromExternrefTable02(ret[2]);
      }
      deferred2_0 = ptr1;
      deferred2_1 = len1;
      return getStringFromWasm02(ptr1, len1);
    } finally {
      wasm2.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  /**
   * @param {any} obj
   * @param {any} cursor
   * @param {any} heads
   * @returns {number}
   */
  getCursorPosition(obj, cursor2, heads) {
    const ret = wasm2.automerge_getCursorPosition(this.__wbg_ptr, obj, cursor2, heads);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return ret[0];
  }
  /**
   * @param {Hash} hash
   * @returns {DecodedChange | null}
   */
  getDecodedChangeByHash(hash2) {
    const ret = wasm2.automerge_getDecodedChangeByHash(this.__wbg_ptr, hash2);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @returns {Heads}
   */
  getHeads() {
    const ret = wasm2.automerge_getHeads(this.__wbg_ptr);
    return ret;
  }
  /**
   * @returns {Change | null}
   */
  getLastLocalChange() {
    const ret = wasm2.automerge_getLastLocalChange(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {any} heads
   * @returns {Array<any>}
   */
  getMissingDeps(heads) {
    const ret = wasm2.automerge_getMissingDeps(this.__wbg_ptr, heads);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @param {any} obj
   * @param {any} prop
   * @param {any} heads
   * @returns {any}
   */
  getWithType(obj, prop, heads) {
    const ret = wasm2.automerge_getWithType(this.__wbg_ptr, obj, prop, heads);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @param {SyncState} state
   * @returns {boolean}
   */
  hasOurChanges(state) {
    _assertClass2(state, SyncState2);
    const ret = wasm2.automerge_hasOurChanges(this.__wbg_ptr, state.__wbg_ptr);
    return ret !== 0;
  }
  /**
   * @param {ObjID} obj
   * @param {Prop} prop
   * @param {number} value
   */
  increment(obj, prop, value) {
    const ret = wasm2.automerge_increment(this.__wbg_ptr, obj, prop, value);
    if (ret[1]) {
      throw takeFromExternrefTable02(ret[0]);
    }
  }
  /**
   * Initialize the root object of an empty document from a JS object.
   * This is much faster than setting keys one at a time for large initial states.
   * @param {any} value
   */
  initRootFromHydrate(value) {
    const ret = wasm2.automerge_initRootFromHydrate(this.__wbg_ptr, value);
    if (ret[1]) {
      throw takeFromExternrefTable02(ret[0]);
    }
  }
  /**
   * @param {any} obj
   * @param {number} index
   * @param {any} value
   * @param {any} datatype
   */
  insert(obj, index, value, datatype) {
    const ret = wasm2.automerge_insert(this.__wbg_ptr, obj, index, value, datatype);
    if (ret[1]) {
      throw takeFromExternrefTable02(ret[0]);
    }
  }
  /**
   * @param {ObjID} obj
   * @param {number} index
   * @param {ObjType} value
   * @returns {ObjID}
   */
  insertObject(obj, index, value) {
    let deferred2_0;
    let deferred2_1;
    try {
      const ret = wasm2.automerge_insertObject(this.__wbg_ptr, obj, index, value);
      var ptr1 = ret[0];
      var len1 = ret[1];
      if (ret[3]) {
        ptr1 = 0;
        len1 = 0;
        throw takeFromExternrefTable02(ret[2]);
      }
      deferred2_0 = ptr1;
      deferred2_1 = len1;
      return getStringFromWasm02(ptr1, len1);
    } finally {
      wasm2.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  /**
   * Insert a nested JavaScript value into a list using batch insertion.
   * This is much faster than insertObject for large nested objects.
   * The value is inserted at the given index, shifting subsequent elements.
   * @param {ObjID} obj
   * @param {number} index
   * @param {any} value
   * @returns {ObjID}
   */
  insertObjectFromHydrate(obj, index, value) {
    const ret = wasm2.automerge_insertObjectFromHydrate(this.__wbg_ptr, obj, index, value);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  integrate() {
    wasm2.automerge_integrate(this.__wbg_ptr);
  }
  /**
   * @param {Heads} heads
   */
  isolate(heads) {
    const ret = wasm2.automerge_isolate(this.__wbg_ptr, heads);
    if (ret[1]) {
      throw takeFromExternrefTable02(ret[0]);
    }
  }
  /**
   * @param {ObjID} obj
   * @param {number} index
   */
  joinBlock(obj, index) {
    const ret = wasm2.automerge_joinBlock(this.__wbg_ptr, obj, index);
    if (ret[1]) {
      throw takeFromExternrefTable02(ret[0]);
    }
  }
  /**
   * @param {any} obj
   * @param {any} heads
   * @returns {Array<any>}
   */
  keys(obj, heads) {
    const ret = wasm2.automerge_keys(this.__wbg_ptr, obj, heads);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @param {any} obj
   * @param {any} heads
   * @returns {number}
   */
  length(obj, heads) {
    const ret = wasm2.automerge_length(this.__wbg_ptr, obj, heads);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return ret[0];
  }
  /**
   * @param {Uint8Array} data
   * @returns {number}
   */
  loadIncremental(data) {
    const ret = wasm2.automerge_loadIncremental(this.__wbg_ptr, data);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return ret[0];
  }
  /**
   * @param {any} obj
   * @param {any} range
   * @param {any} name
   * @param {any} value
   * @param {any} datatype
   */
  mark(obj, range, name, value, datatype) {
    const ret = wasm2.automerge_mark(this.__wbg_ptr, obj, range, name, value, datatype);
    if (ret[1]) {
      throw takeFromExternrefTable02(ret[0]);
    }
  }
  /**
   * @param {any} obj
   * @param {any} heads
   * @returns {any}
   */
  marks(obj, heads) {
    const ret = wasm2.automerge_marks(this.__wbg_ptr, obj, heads);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @param {any} obj
   * @param {number} index
   * @param {any} heads
   * @returns {object}
   */
  marksAt(obj, index, heads) {
    const ret = wasm2.automerge_marksAt(this.__wbg_ptr, obj, index, heads);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @param {any} obj
   * @param {any} heads
   * @param {any} meta
   * @returns {any}
   */
  materialize(obj, heads, meta) {
    const ret = wasm2.automerge_materialize(this.__wbg_ptr, obj, heads, meta);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @param {Automerge} other
   * @returns {Heads}
   */
  merge(other) {
    _assertClass2(other, _Automerge);
    const ret = wasm2.automerge_merge(this.__wbg_ptr, other.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @param {string | null} [actor]
   * @returns {Automerge}
   */
  static new(actor) {
    var ptr0 = isLikeNone2(actor) ? 0 : passStringToWasm02(actor, wasm2.__wbindgen_malloc, wasm2.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN2;
    const ret = wasm2.automerge_new(ptr0, len0);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return _Automerge.__wrap(ret[0]);
  }
  /**
   * @param {any} obj
   * @param {any} heads
   * @returns {object}
   */
  objInfo(obj, heads) {
    const ret = wasm2.automerge_objInfo(this.__wbg_ptr, obj, heads);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @returns {number}
   */
  pendingOps() {
    const ret = wasm2.automerge_pendingOps(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {any} obj
   * @param {any} value
   * @param {any} datatype
   */
  push(obj, value, datatype) {
    const ret = wasm2.automerge_push(this.__wbg_ptr, obj, value, datatype);
    if (ret[1]) {
      throw takeFromExternrefTable02(ret[0]);
    }
  }
  /**
   * @param {ObjID} obj
   * @param {ObjType} value
   * @returns {ObjID}
   */
  pushObject(obj, value) {
    let deferred2_0;
    let deferred2_1;
    try {
      const ret = wasm2.automerge_pushObject(this.__wbg_ptr, obj, value);
      var ptr1 = ret[0];
      var len1 = ret[1];
      if (ret[3]) {
        ptr1 = 0;
        len1 = 0;
        throw takeFromExternrefTable02(ret[2]);
      }
      deferred2_0 = ptr1;
      deferred2_1 = len1;
      return getStringFromWasm02(ptr1, len1);
    } finally {
      wasm2.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  /**
   * @param {any} obj
   * @param {any} prop
   * @param {any} value
   * @param {any} datatype
   */
  put(obj, prop, value, datatype) {
    const ret = wasm2.automerge_put(this.__wbg_ptr, obj, prop, value, datatype);
    if (ret[1]) {
      throw takeFromExternrefTable02(ret[0]);
    }
  }
  /**
   * @param {ObjID} obj
   * @param {Prop} prop
   * @param {ObjType} value
   * @returns {ObjID}
   */
  putObject(obj, prop, value) {
    const ret = wasm2.automerge_putObject(this.__wbg_ptr, obj, prop, value);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * Put a nested JavaScript value as a new object tree using batch insertion.
   * This is much faster than putObject for large nested objects.
   * For map keys this overwrites any existing value. For list indices this
   * overwrites the element at that index.
   * @param {ObjID} obj
   * @param {Prop} prop
   * @param {any} value
   * @returns {ObjID}
   */
  putObjectFromHydrate(obj, prop, value) {
    const ret = wasm2.automerge_putObjectFromHydrate(this.__wbg_ptr, obj, prop, value);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @param {SyncState} state
   * @param {SyncMessage} message
   */
  receiveSyncMessage(state, message) {
    _assertClass2(state, SyncState2);
    const ret = wasm2.automerge_receiveSyncMessage(this.__wbg_ptr, state.__wbg_ptr, message);
    if (ret[1]) {
      throw takeFromExternrefTable02(ret[0]);
    }
  }
  /**
   * @param {string} datatype
   * @param {Function} construct
   * @param {(arg: any) => any | undefined} deconstruct
   */
  registerDatatype(datatype, construct, deconstruct) {
    const ret = wasm2.automerge_registerDatatype(this.__wbg_ptr, datatype, construct, deconstruct);
    if (ret[1]) {
      throw takeFromExternrefTable02(ret[0]);
    }
  }
  resetDiffCursor() {
    wasm2.automerge_resetDiffCursor(this.__wbg_ptr);
  }
  /**
   * @returns {number}
   */
  rollback() {
    const ret = wasm2.automerge_rollback(this.__wbg_ptr);
    return ret;
  }
  /**
   * @returns {Uint8Array}
   */
  save() {
    const ret = wasm2.automerge_save(this.__wbg_ptr);
    return ret;
  }
  /**
   * @returns {Uint8Array}
   */
  saveAndVerify() {
    const ret = wasm2.automerge_saveAndVerify(this.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @param {any} hashes
   * @returns {Uint8Array}
   */
  saveBundle(hashes) {
    const ret = wasm2.automerge_saveBundle(this.__wbg_ptr, hashes);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @returns {Uint8Array}
   */
  saveIncremental() {
    const ret = wasm2.automerge_saveIncremental(this.__wbg_ptr);
    return ret;
  }
  /**
   * @returns {Uint8Array}
   */
  saveNoCompress() {
    const ret = wasm2.automerge_saveNoCompress(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {Heads} heads
   * @returns {Uint8Array}
   */
  saveSince(heads) {
    const ret = wasm2.automerge_saveSince(this.__wbg_ptr, heads);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @param {any} obj
   * @param {any} heads
   * @returns {Array<any>}
   */
  spans(obj, heads) {
    const ret = wasm2.automerge_spans(this.__wbg_ptr, obj, heads);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @param {any} obj
   * @param {number} start
   * @param {number} delete_count
   * @param {any} text
   */
  splice(obj, start, delete_count, text) {
    const ret = wasm2.automerge_splice(this.__wbg_ptr, obj, start, delete_count, text);
    if (ret[1]) {
      throw takeFromExternrefTable02(ret[0]);
    }
  }
  /**
   * Splice values into a list using batch insertion.
   * This is much faster than individual insert calls for multiple values.
   * @param {ObjID} obj
   * @param {number} index
   * @param {number} del
   * @param {any} values
   */
  spliceFromHydrate(obj, index, del, values) {
    const ret = wasm2.automerge_spliceFromHydrate(this.__wbg_ptr, obj, index, del, values);
    if (ret[1]) {
      throw takeFromExternrefTable02(ret[0]);
    }
  }
  /**
   * @param {ObjID} obj
   * @param {number} index
   * @param {{[key: string]: MaterializeValue}} block
   */
  splitBlock(obj, index, block2) {
    const ret = wasm2.automerge_splitBlock(this.__wbg_ptr, obj, index, block2);
    if (ret[1]) {
      throw takeFromExternrefTable02(ret[0]);
    }
  }
  /**
   * @returns {Stats}
   */
  stats() {
    const ret = wasm2.automerge_stats(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {any} obj
   * @param {any} heads
   * @returns {string}
   */
  text(obj, heads) {
    let deferred2_0;
    let deferred2_1;
    try {
      const ret = wasm2.automerge_text(this.__wbg_ptr, obj, heads);
      var ptr1 = ret[0];
      var len1 = ret[1];
      if (ret[3]) {
        ptr1 = 0;
        len1 = 0;
        throw takeFromExternrefTable02(ret[2]);
      }
      deferred2_0 = ptr1;
      deferred2_1 = len1;
      return getStringFromWasm02(ptr1, len1);
    } finally {
      wasm2.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  /**
   * @param {any} meta
   * @returns {MaterializeValue}
   */
  toJS(meta) {
    const ret = wasm2.automerge_toJS(this.__wbg_ptr, meta);
    if (ret[2]) {
      throw takeFromExternrefTable02(ret[1]);
    }
    return takeFromExternrefTable02(ret[0]);
  }
  /**
   * @returns {Hash[]}
   */
  topoHistoryTraversal() {
    const ret = wasm2.automerge_topoHistoryTraversal(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {ObjID} obj
   * @param {MarkRange} range
   * @param {string} name
   */
  unmark(obj, range, name) {
    const ret = wasm2.automerge_unmark(this.__wbg_ptr, obj, range, name);
    if (ret[1]) {
      throw takeFromExternrefTable02(ret[0]);
    }
  }
  /**
   * @param {ObjID} obj
   * @param {number} index
   * @param {{[key: string]: MaterializeValue}} block
   */
  updateBlock(obj, index, block2) {
    const ret = wasm2.automerge_updateBlock(this.__wbg_ptr, obj, index, block2);
    if (ret[1]) {
      throw takeFromExternrefTable02(ret[0]);
    }
  }
  updateDiffCursor() {
    wasm2.automerge_updateDiffCursor(this.__wbg_ptr);
  }
  /**
   * @param {ObjID} obj
   * @param {Span[]} args
   * @param {UpdateSpansConfig | undefined | null} config
   */
  updateSpans(obj, args, config) {
    const ret = wasm2.automerge_updateSpans(this.__wbg_ptr, obj, args, config);
    if (ret[1]) {
      throw takeFromExternrefTable02(ret[0]);
    }
  }
  /**
   * @param {ObjID} obj
   * @param {string} new_text
   */
  updateText(obj, new_text) {
    const ret = wasm2.automerge_updateText(this.__wbg_ptr, obj, new_text);
    if (ret[1]) {
      throw takeFromExternrefTable02(ret[0]);
    }
  }
};
if (Symbol.dispose) Automerge2.prototype[Symbol.dispose] = Automerge2.prototype.free;
var SyncState2 = class _SyncState {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(_SyncState.prototype);
    obj.__wbg_ptr = ptr;
    SyncStateFinalization2.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    SyncStateFinalization2.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm2.__wbg_syncstate_free(ptr, 0);
  }
  /**
   * @returns {SyncState}
   */
  clone() {
    const ret = wasm2.syncstate_clone(this.__wbg_ptr);
    return _SyncState.__wrap(ret);
  }
  /**
   * @returns {Heads}
   */
  get lastSentHeads() {
    const ret = wasm2.syncstate_lastSentHeads(this.__wbg_ptr);
    return ret;
  }
  /**
   * @returns {boolean}
   */
  get peerReadOnly() {
    const ret = wasm2.syncstate_peerReadOnly(this.__wbg_ptr);
    return ret !== 0;
  }
  /**
   * @returns {boolean}
   */
  get readOnly() {
    const ret = wasm2.syncstate_readOnly(this.__wbg_ptr);
    return ret !== 0;
  }
  /**
   * @param {Heads} heads
   */
  set lastSentHeads(heads) {
    const ret = wasm2.syncstate_set_lastSentHeads(this.__wbg_ptr, heads);
    if (ret[1]) {
      throw takeFromExternrefTable02(ret[0]);
    }
  }
  /**
   * @param {boolean} read_only
   */
  set readOnly(read_only) {
    wasm2.syncstate_set_readOnly(this.__wbg_ptr, read_only);
  }
  /**
   * @param {Heads} hashes
   */
  set sentHashes(hashes) {
    const ret = wasm2.syncstate_set_sentHashes(this.__wbg_ptr, hashes);
    if (ret[1]) {
      throw takeFromExternrefTable02(ret[0]);
    }
  }
  /**
   * @returns {Heads}
   */
  get sharedHeads() {
    const ret = wasm2.syncstate_sharedHeads(this.__wbg_ptr);
    return ret;
  }
};
if (Symbol.dispose) SyncState2.prototype[Symbol.dispose] = SyncState2.prototype.free;
function create2(options) {
  const ret = wasm2.create(options);
  if (ret[2]) {
    throw takeFromExternrefTable02(ret[1]);
  }
  return Automerge2.__wrap(ret[0]);
}
function decodeChange2(change2) {
  const ret = wasm2.decodeChange(change2);
  if (ret[2]) {
    throw takeFromExternrefTable02(ret[1]);
  }
  return takeFromExternrefTable02(ret[0]);
}
function decodeSyncMessage2(msg) {
  const ret = wasm2.decodeSyncMessage(msg);
  if (ret[2]) {
    throw takeFromExternrefTable02(ret[1]);
  }
  return takeFromExternrefTable02(ret[0]);
}
function decodeSyncState2(data) {
  const ret = wasm2.decodeSyncState(data);
  if (ret[2]) {
    throw takeFromExternrefTable02(ret[1]);
  }
  return SyncState2.__wrap(ret[0]);
}
function encodeChange2(change2) {
  const ret = wasm2.encodeChange(change2);
  if (ret[2]) {
    throw takeFromExternrefTable02(ret[1]);
  }
  return takeFromExternrefTable02(ret[0]);
}
function encodeSyncMessage2(message) {
  const ret = wasm2.encodeSyncMessage(message);
  if (ret[2]) {
    throw takeFromExternrefTable02(ret[1]);
  }
  return takeFromExternrefTable02(ret[0]);
}
function encodeSyncState2(state) {
  _assertClass2(state, SyncState2);
  const ret = wasm2.encodeSyncState(state.__wbg_ptr);
  return ret;
}
function exportSyncState2(state) {
  _assertClass2(state, SyncState2);
  const ret = wasm2.exportSyncState(state.__wbg_ptr);
  return ret;
}
function importSyncState2(state) {
  const ret = wasm2.importSyncState(state);
  if (ret[2]) {
    throw takeFromExternrefTable02(ret[1]);
  }
  return SyncState2.__wrap(ret[0]);
}
function initSyncState2() {
  const ret = wasm2.initSyncState();
  return SyncState2.__wrap(ret);
}
function load2(data, options) {
  const ret = wasm2.load(data, options);
  if (ret[2]) {
    throw takeFromExternrefTable02(ret[1]);
  }
  return Automerge2.__wrap(ret[0]);
}
function readBundle2(bundle) {
  const ret = wasm2.readBundle(bundle);
  if (ret[2]) {
    throw takeFromExternrefTable02(ret[1]);
  }
  return takeFromExternrefTable02(ret[0]);
}
function wasmReleaseInfo2() {
  const ret = wasm2.wasmReleaseInfo();
  return ret;
}
var AutomergeFinalization2 = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm2.__wbg_automerge_free(ptr >>> 0, 1));
var SyncStateFinalization2 = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm2.__wbg_syncstate_free(ptr >>> 0, 1));
function _assertClass2(instance, klass) {
  if (!(instance instanceof klass)) {
    throw new Error(`expected instance of ${klass.name}`);
  }
}
function getStringFromWasm02(ptr, len) {
  ptr = ptr >>> 0;
  return decodeText2(ptr, len);
}
var cachedUint8ArrayMemory02 = null;
function getUint8ArrayMemory02() {
  if (cachedUint8ArrayMemory02 === null || cachedUint8ArrayMemory02.byteLength === 0) {
    cachedUint8ArrayMemory02 = new Uint8Array(wasm2.memory.buffer);
  }
  return cachedUint8ArrayMemory02;
}
function isLikeNone2(x) {
  return x === void 0 || x === null;
}
function passStringToWasm02(arg, malloc, realloc) {
  if (realloc === void 0) {
    const buf = cachedTextEncoder2.encode(arg);
    const ptr2 = malloc(buf.length, 1) >>> 0;
    getUint8ArrayMemory02().subarray(ptr2, ptr2 + buf.length).set(buf);
    WASM_VECTOR_LEN2 = buf.length;
    return ptr2;
  }
  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;
  const mem = getUint8ArrayMemory02();
  let offset = 0;
  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 127) break;
    mem[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
    const view3 = getUint8ArrayMemory02().subarray(ptr + offset, ptr + len);
    const ret = cachedTextEncoder2.encodeInto(arg, view3);
    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }
  WASM_VECTOR_LEN2 = offset;
  return ptr;
}
function takeFromExternrefTable02(idx) {
  const value = wasm2.__wbindgen_externrefs.get(idx);
  wasm2.__externref_table_dealloc(idx);
  return value;
}
var cachedTextDecoder2 = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
cachedTextDecoder2.decode();
var MAX_SAFARI_DECODE_BYTES2 = 2146435072;
var numBytesDecoded2 = 0;
function decodeText2(ptr, len) {
  numBytesDecoded2 += len;
  if (numBytesDecoded2 >= MAX_SAFARI_DECODE_BYTES2) {
    cachedTextDecoder2 = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
    cachedTextDecoder2.decode();
    numBytesDecoded2 = len;
  }
  return cachedTextDecoder2.decode(getUint8ArrayMemory02().subarray(ptr, ptr + len));
}
var cachedTextEncoder2 = new TextEncoder();
if (!("encodeInto" in cachedTextEncoder2)) {
  cachedTextEncoder2.encodeInto = function(arg, view3) {
    const buf = cachedTextEncoder2.encode(arg);
    view3.set(buf);
    return {
      read: arg.length,
      written: buf.length
    };
  };
}
var WASM_VECTOR_LEN2 = 0;
var wasm2;
function __wbg_set_wasm(val) {
  wasm2 = val;
}

// node_modules/.deno/@automerge+automerge@3.2.6/node_modules/@automerge/automerge/dist/mjs/wasm_bindgen_output/bundler/automerge_wasm.js
__wbg_set_wasm(automerge_wasm_bg_exports);
(void 0)();

// node_modules/.deno/@automerge+automerge@3.2.6/node_modules/@automerge/automerge/dist/mjs/implementation.js
var implementation_exports = {};
__export(implementation_exports, {
  Counter: () => Counter,
  Float64: () => Float64,
  ImmutableString: () => ImmutableString,
  Int: () => Int,
  RawString: () => RawString,
  Uint: () => Uint,
  applyChanges: () => applyChanges,
  applyPatch: () => applyPatch,
  applyPatches: () => applyPatches,
  block: () => block,
  change: () => change,
  changeAt: () => changeAt,
  clone: () => clone,
  decodeChange: () => decodeChange3,
  decodeSyncMessage: () => decodeSyncMessage3,
  decodeSyncState: () => decodeSyncState3,
  deleteAt: () => deleteAt,
  diff: () => diff,
  diffPath: () => diffPath,
  dump: () => dump,
  emptyChange: () => emptyChange,
  encodeChange: () => encodeChange3,
  encodeSyncMessage: () => encodeSyncMessage3,
  encodeSyncState: () => encodeSyncState3,
  equals: () => equals,
  free: () => free,
  from: () => from,
  generateSyncMessage: () => generateSyncMessage,
  getActorId: () => getActorId,
  getAllChanges: () => getAllChanges,
  getBackend: () => getBackend,
  getChanges: () => getChanges,
  getChangesMetaSince: () => getChangesMetaSince,
  getChangesSince: () => getChangesSince,
  getConflicts: () => getConflicts,
  getCursor: () => getCursor,
  getCursorPosition: () => getCursorPosition,
  getHeads: () => getHeads,
  getHistory: () => getHistory,
  getLastLocalChange: () => getLastLocalChange,
  getMissingDeps: () => getMissingDeps,
  getObjectId: () => getObjectId,
  hasHeads: () => hasHeads,
  hasOurChanges: () => hasOurChanges,
  init: () => init,
  initSyncState: () => initSyncState3,
  initializeBase64Wasm: () => initializeBase64Wasm,
  initializeWasm: () => initializeWasm,
  insertAt: () => insertAt,
  inspectChange: () => inspectChange,
  isAutomerge: () => isAutomerge,
  isCounter: () => isCounter,
  isImmutableString: () => isImmutableString,
  isRawString: () => isRawString,
  isWasmInitialized: () => isWasmInitialized,
  joinBlock: () => joinBlock,
  load: () => load3,
  loadIncremental: () => loadIncremental,
  mark: () => mark,
  marks: () => marks,
  marksAt: () => marksAt,
  merge: () => merge,
  readBundle: () => readBundle3,
  receiveSyncMessage: () => receiveSyncMessage,
  releaseInfo: () => releaseInfo,
  save: () => save,
  saveBundle: () => saveBundle,
  saveIncremental: () => saveIncremental,
  saveSince: () => saveSince,
  spans: () => spans,
  splice: () => splice,
  splitBlock: () => splitBlock,
  stats: () => stats,
  toJS: () => toJS,
  topoHistoryTraversal: () => topoHistoryTraversal,
  unmark: () => unmark,
  updateBlock: () => updateBlock,
  updateSpans: () => updateSpans,
  updateText: () => updateText,
  use: () => use,
  view: () => view,
  wasmInitialized: () => wasmInitialized
});

// node_modules/.deno/@automerge+automerge@3.2.6/node_modules/@automerge/automerge/dist/mjs/constants.js
var STATE = /* @__PURE__ */ Symbol.for("_am_meta");
var TRACE = /* @__PURE__ */ Symbol.for("_am_trace");
var OBJECT_ID = /* @__PURE__ */ Symbol.for("_am_objectId");
var IS_PROXY = /* @__PURE__ */ Symbol.for("_am_isProxy");
var CLEAR_CACHE = /* @__PURE__ */ Symbol.for("_am_clearCache");
var UINT = /* @__PURE__ */ Symbol.for("_am_uint");
var INT = /* @__PURE__ */ Symbol.for("_am_int");
var F64 = /* @__PURE__ */ Symbol.for("_am_f64");
var COUNTER = /* @__PURE__ */ Symbol.for("_am_counter");
var IMMUTABLE_STRING = /* @__PURE__ */ Symbol.for("_am_immutableString");

// node_modules/.deno/@automerge+automerge@3.2.6/node_modules/@automerge/automerge/dist/mjs/counter.js
var Counter = class {
  constructor(value) {
    this.value = value || 0;
    Reflect.defineProperty(this, COUNTER, { value: true });
  }
  /**
   * A peculiar JavaScript language feature from its early days: if the object
   * `x` has a `valueOf()` method that returns a number, you can use numerical
   * operators on the object `x` directly, such as `x + 1` or `x < 4`.
   * This method is also called when coercing a value to a string by
   * concatenating it with another string, as in `x + ''`.
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf
   */
  valueOf() {
    return this.value;
  }
  /**
   * Returns the counter value as a decimal string. If `x` is a counter object,
   * this method is called e.g. when you do `['value: ', x].join('')` or when
   * you use string interpolation: `value: ${x}`.
   */
  toString() {
    return this.valueOf().toString();
  }
  /**
   * Returns the counter value, so that a JSON serialization of an Automerge
   * document represents the counter simply as an integer.
   */
  toJSON() {
    return this.value;
  }
  /**
   * Increases the value of the counter by `delta`. If `delta` is not given,
   * increases the value of the counter by 1.
   *
   * Will throw an error if used outside of a change callback.
   */
  increment(_delta) {
    throw new Error("Counters should not be incremented outside of a change callback");
  }
  /**
   * Decreases the value of the counter by `delta`. If `delta` is not given,
   * decreases the value of the counter by 1.
   *
   * Will throw an error if used outside of a change callback.
   */
  decrement(_delta) {
    throw new Error("Counters should not be decremented outside of a change callback");
  }
};
var WriteableCounter = class extends Counter {
  constructor(value, context, path, objectId, key) {
    super(value);
    this.context = context;
    this.path = path;
    this.objectId = objectId;
    this.key = key;
  }
  /**
   * Increases the value of the counter by `delta`. If `delta` is not given,
   * increases the value of the counter by 1.
   */
  increment(delta) {
    delta = typeof delta === "number" ? delta : 1;
    this.context.increment(this.objectId, this.key, delta);
    this.value += delta;
    return this.value;
  }
  /**
   * Decreases the value of the counter by `delta`. If `delta` is not given,
   * decreases the value of the counter by 1.
   */
  decrement(delta) {
    return this.increment(typeof delta === "number" ? -delta : -1);
  }
};
function getWriteableCounter(value, context, path, objectId, key) {
  return new WriteableCounter(value, context, path, objectId, key);
}

// node_modules/.deno/@automerge+automerge@3.2.6/node_modules/@automerge/automerge/dist/mjs/immutable_string.js
var _a;
var ImmutableString = class {
  constructor(val) {
    this[_a] = true;
    this.val = val;
  }
  /**
   * Returns the content of the ImmutableString object as a simple string
   */
  toString() {
    return this.val;
  }
  toJSON() {
    return this.val;
  }
};
_a = IMMUTABLE_STRING;

// node_modules/.deno/@automerge+automerge@3.2.6/node_modules/@automerge/automerge/dist/mjs/proxies.js
var MAX_I64 = BigInt("9223372036854775807");
function validateForBatchInsert(value, context, path) {
  if (value === void 0) {
    throw new RangeError([
      `Cannot assign undefined value at ${printPath(path)}, `,
      "You might consider setting the property's value to `null`, ",
      "or using `delete` to remove it altogether."
    ].join(""));
  }
  if (value === null)
    return;
  const type = typeof value;
  if (type !== "object")
    return;
  if (context && isSameDocument(value, context)) {
    throw new RangeError("Cannot create a reference to an existing document object");
  }
  if (value instanceof Array) {
    for (let i = 0; i < value.length; i++) {
      validateForBatchInsert(value[i], context, [...path, i]);
    }
  } else if (Object.prototype.toString.call(value) === "[object Object]") {
    for (const k in value) {
      validateForBatchInsert(value[k], context, [...path, k]);
    }
  }
}
function parseListIndex(key) {
  if (typeof key === "string" && /^[0-9]+$/.test(key))
    key = parseInt(key, 10);
  if (typeof key !== "number") {
    return key;
  }
  if (key < 0 || isNaN(key) || key === Infinity || key === -Infinity) {
    throw new RangeError("A list index must be positive, but you passed " + key);
  }
  return key;
}
function valueAt(target2, prop) {
  const { context, objectId, path } = target2;
  const value = context.getWithType(objectId, prop);
  if (value === null) {
    return;
  }
  const datatype = value[0];
  const val = value[1];
  switch (datatype) {
    case void 0:
      return;
    case "map":
      return mapProxy(context, val, [...path, prop]);
    case "list":
      return listProxy(context, val, [...path, prop]);
    case "text":
      return context.text(val);
    case "str":
      return new ImmutableString(val);
    case "uint":
      return val;
    case "int":
      return val;
    case "f64":
      return val;
    case "boolean":
      return val;
    case "null":
      return null;
    case "bytes":
      return val;
    case "timestamp":
      return val;
    case "counter": {
      const counter = getWriteableCounter(val, context, path, objectId, prop);
      return counter;
    }
    default:
      throw RangeError(`datatype ${datatype} unimplemented`);
  }
}
function import_value(value, path, context) {
  const type = typeof value;
  switch (type) {
    case "object":
      if (value == null) {
        return [null, "null"];
      } else if (value[UINT]) {
        return [value.value, "uint"];
      } else if (value[INT]) {
        return [value.value, "int"];
      } else if (value[F64]) {
        return [value.value, "f64"];
      } else if (value[COUNTER]) {
        return [value.value, "counter"];
      } else if (value instanceof Date) {
        return [value.getTime(), "timestamp"];
      } else if (isImmutableString(value)) {
        return [value.toString(), "str"];
      } else if (value instanceof Uint8Array) {
        return [value, "bytes"];
      } else if (value instanceof Array) {
        return [value, "list"];
      } else if (Object.prototype.toString.call(value) === "[object Object]") {
        return [value, "map"];
      } else if (isSameDocument(value, context)) {
        throw new RangeError("Cannot create a reference to an existing document object");
      } else {
        throw new RangeError(`Cannot assign unknown object: ${value}`);
      }
    case "boolean":
      return [value, "boolean"];
    case "bigint":
      if (value > MAX_I64) {
        return [value, "uint"];
      } else {
        return [value, "int"];
      }
    case "number":
      if (Number.isInteger(value)) {
        return [value, "int"];
      } else {
        return [value, "f64"];
      }
    case "string":
      return [value, "text"];
    case "undefined":
      throw new RangeError([
        `Cannot assign undefined value at ${printPath(path)}, `,
        "because `undefined` is not a valid JSON data type. ",
        "You might consider setting the property's value to `null`, ",
        "or using `delete` to remove it altogether."
      ].join(""));
    default:
      throw new RangeError([
        `Cannot assign ${type} value at ${printPath(path)}. `,
        `All JSON primitive datatypes (object, array, string, number, boolean, null) `,
        `are supported in an Automerge document; ${type} values are not. `
      ].join(""));
  }
}
function isSameDocument(val, context) {
  var _b, _c;
  if (val instanceof Date) {
    return false;
  }
  if (val && ((_c = (_b = val[STATE]) === null || _b === void 0 ? void 0 : _b.handle) === null || _c === void 0 ? void 0 : _c.__wbg_ptr) === context.__wbg_ptr) {
    return true;
  }
  return false;
}
var MapHandler = {
  get(target2, key) {
    const { context, objectId, cache } = target2;
    if (key === Symbol.toStringTag) {
      return target2[Symbol.toStringTag];
    }
    if (key === OBJECT_ID)
      return objectId;
    if (key === IS_PROXY)
      return true;
    if (key === TRACE)
      return target2.trace;
    if (key === STATE)
      return { handle: context };
    if (!cache[key]) {
      cache[key] = valueAt(target2, key);
    }
    return cache[key];
  },
  set(target2, key, val) {
    const { context, objectId, path } = target2;
    target2.cache = {};
    if (isSameDocument(val, context)) {
      throw new RangeError("Cannot create a reference to an existing document object");
    }
    if (key === TRACE) {
      target2.trace = val;
      return true;
    }
    if (key === CLEAR_CACHE) {
      return true;
    }
    const [value, datatype] = import_value(val, [...path, key], context);
    switch (datatype) {
      case "list":
      case "map": {
        validateForBatchInsert(value, context, [...path, key]);
        context.putObjectFromHydrate(objectId, key, value);
        break;
      }
      case "text": {
        context.putObject(objectId, key, value);
        break;
      }
      default:
        context.put(objectId, key, value, datatype);
    }
    return true;
  },
  deleteProperty(target2, key) {
    const { context, objectId } = target2;
    target2.cache = {};
    context.delete(objectId, key);
    return true;
  },
  has(target2, key) {
    const value = this.get(target2, key);
    return value !== void 0;
  },
  getOwnPropertyDescriptor(target2, key) {
    const value = this.get(target2, key);
    if (typeof value !== "undefined") {
      return {
        configurable: true,
        enumerable: true,
        value
      };
    }
  },
  ownKeys(target2) {
    const { context, objectId } = target2;
    const keys = context.keys(objectId);
    return [...new Set(keys)];
  }
};
var ListHandler = {
  get(target2, index) {
    const { context, objectId } = target2;
    index = parseListIndex(index);
    if (index === Symbol.hasInstance) {
      return (instance) => {
        return Array.isArray(instance);
      };
    }
    if (index === Symbol.toStringTag) {
      return target2[Symbol.toStringTag];
    }
    if (index === OBJECT_ID)
      return objectId;
    if (index === IS_PROXY)
      return true;
    if (index === TRACE)
      return target2.trace;
    if (index === STATE)
      return { handle: context };
    if (index === "length")
      return context.length(objectId);
    if (typeof index === "number") {
      return valueAt(target2, index);
    } else {
      return listMethods(target2)[index];
    }
  },
  set(target2, index, val) {
    const { context, objectId, path } = target2;
    index = parseListIndex(index);
    if (isSameDocument(val, context)) {
      throw new RangeError("Cannot create a reference to an existing document object");
    }
    if (index === CLEAR_CACHE) {
      return true;
    }
    if (index === TRACE) {
      target2.trace = val;
      return true;
    }
    if (typeof index == "string") {
      throw new RangeError("list index must be a number");
    }
    const [value, datatype] = import_value(val, [...path, index], context);
    switch (datatype) {
      case "list":
      case "map": {
        validateForBatchInsert(value, context, [...path, index]);
        if (index >= context.length(objectId)) {
          context.insertObjectFromHydrate(objectId, index, value);
        } else {
          context.putObjectFromHydrate(objectId, index, value);
        }
        break;
      }
      case "text": {
        if (index >= context.length(objectId)) {
          context.insertObject(objectId, index, value);
        } else {
          context.putObject(objectId, index, value);
        }
        break;
      }
      default:
        if (index >= context.length(objectId)) {
          context.insert(objectId, index, value, datatype);
        } else {
          context.put(objectId, index, value, datatype);
        }
    }
    return true;
  },
  deleteProperty(target2, index) {
    const { context, objectId } = target2;
    index = parseListIndex(index);
    const elem = context.get(objectId, index);
    if (elem != null && elem[0] == "counter") {
      throw new TypeError("Unsupported operation: deleting a counter from a list");
    }
    context.delete(objectId, index);
    return true;
  },
  has(target2, index) {
    const { context, objectId } = target2;
    index = parseListIndex(index);
    if (typeof index === "number") {
      return index < context.length(objectId);
    }
    return index === "length";
  },
  getOwnPropertyDescriptor(target2, index) {
    const { context, objectId } = target2;
    if (index === "length")
      return { writable: true, value: context.length(objectId) };
    if (index === OBJECT_ID)
      return { configurable: false, enumerable: false, value: objectId };
    index = parseListIndex(index);
    const value = valueAt(target2, index);
    return { configurable: true, enumerable: true, value };
  },
  getPrototypeOf(target2) {
    return Object.getPrototypeOf(target2);
  },
  ownKeys() {
    const keys = [];
    keys.push("length");
    return keys;
  }
};
function mapProxy(context, objectId, path) {
  const target2 = {
    context,
    objectId,
    path: path || [],
    cache: {}
  };
  const proxied = {};
  Object.assign(proxied, target2);
  const result = new Proxy(proxied, MapHandler);
  return result;
}
function listProxy(context, objectId, path) {
  const target2 = {
    context,
    objectId,
    path: path || [],
    cache: {}
  };
  const proxied = [];
  Object.assign(proxied, target2);
  return new Proxy(proxied, ListHandler);
}
function rootProxy(context) {
  return mapProxy(context, "_root", []);
}
function listMethods(target2) {
  const { context, objectId, path } = target2;
  const methods = {
    at(index) {
      return valueAt(target2, index);
    },
    deleteAt(index, numDelete) {
      if (typeof numDelete === "number") {
        context.splice(objectId, index, numDelete);
      } else {
        context.delete(objectId, index);
      }
      return this;
    },
    fill(val, start, end) {
      const [value, datatype] = import_value(val, [...path, start], context);
      const length = context.length(objectId);
      start = parseListIndex(start || 0);
      end = parseListIndex(end || length);
      for (let i = start; i < Math.min(end, length); i++) {
        if (datatype === "list" || datatype === "map") {
          context.putObject(objectId, i, value);
        } else if (datatype === "text") {
          context.putObject(objectId, i, value);
        } else {
          context.put(objectId, i, value, datatype);
        }
      }
      return this;
    },
    indexOf(searchElement, start = 0) {
      const length = context.length(objectId);
      for (let i = start; i < length; i++) {
        const valueWithType = context.getWithType(objectId, i);
        if (!valueWithType) {
          continue;
        }
        const [valType, value] = valueWithType;
        const isObject3 = ["map", "list", "text"].includes(valType);
        if (!isObject3) {
          if (value === searchElement) {
            return i;
          } else {
            continue;
          }
        }
        if (valType === "text" && typeof searchElement === "string") {
          if (searchElement === valueAt(target2, i)) {
            return i;
          }
        }
        if (searchElement[OBJECT_ID] === value) {
          return i;
        }
      }
      return -1;
    },
    insertAt(index, ...values) {
      this.splice(index, 0, ...values);
      return this;
    },
    pop() {
      const length = context.length(objectId);
      if (length == 0) {
        return void 0;
      }
      const last = valueAt(target2, length - 1);
      context.delete(objectId, length - 1);
      return last;
    },
    push(...values) {
      const len = context.length(objectId);
      this.splice(len, 0, ...values);
      return context.length(objectId);
    },
    shift() {
      if (context.length(objectId) == 0)
        return;
      const first = valueAt(target2, 0);
      context.delete(objectId, 0);
      return first;
    },
    splice(index, del, ...vals) {
      index = parseListIndex(index);
      if (typeof del !== "number") {
        del = context.length(objectId) - index;
      }
      del = parseListIndex(del);
      for (const val of vals) {
        if (isSameDocument(val, context)) {
          throw new RangeError("Cannot create a reference to an existing document object");
        }
      }
      const result = [];
      for (let i = 0; i < del; i++) {
        const value = valueAt(target2, index + i);
        if (value !== void 0) {
          result.push(value);
        }
      }
      for (let i = 0; i < vals.length; i++) {
        try {
          validateForBatchInsert(vals[i], context, [...path, index + i]);
        } catch (e) {
          if (e instanceof RangeError) {
            throw new RangeError(`${e.message} (at index ${i} in the input)`);
          } else {
            throw e;
          }
        }
      }
      context.spliceFromHydrate(objectId, index, del, vals);
      return result;
    },
    unshift(...values) {
      this.splice(0, 0, ...values);
      return context.length(objectId);
    },
    entries() {
      let i = 0;
      const iterator = {
        next: () => {
          const value = valueAt(target2, i);
          if (value === void 0) {
            return { value: void 0, done: true };
          } else {
            return { value: [i++, value], done: false };
          }
        },
        [Symbol.iterator]() {
          return this;
        }
      };
      return iterator;
    },
    keys() {
      let i = 0;
      const len = context.length(objectId);
      const iterator = {
        next: () => {
          if (i < len) {
            return { value: i++, done: false };
          }
          return { value: void 0, done: true };
        },
        [Symbol.iterator]() {
          return this;
        }
      };
      return iterator;
    },
    values() {
      let i = 0;
      const iterator = {
        next: () => {
          const value = valueAt(target2, i++);
          if (value === void 0) {
            return { value: void 0, done: true };
          } else {
            return { value, done: false };
          }
        },
        [Symbol.iterator]() {
          return this;
        }
      };
      return iterator;
    },
    toArray() {
      const list = [];
      let value;
      do {
        value = valueAt(target2, list.length);
        if (value !== void 0) {
          list.push(value);
        }
      } while (value !== void 0);
      return list;
    },
    map(f) {
      return this.toArray().map(f);
    },
    toString() {
      return this.toArray().toString();
    },
    toLocaleString() {
      return this.toArray().toLocaleString();
    },
    forEach(f) {
      return this.toArray().forEach(f);
    },
    // todo: real concat function is different
    concat(other) {
      return this.toArray().concat(other);
    },
    every(f) {
      return this.toArray().every(f);
    },
    filter(f) {
      return this.toArray().filter(f);
    },
    find(f) {
      let index = 0;
      for (const v of this) {
        if (f(v, index)) {
          return v;
        }
        index += 1;
      }
    },
    findIndex(f) {
      let index = 0;
      for (const v of this) {
        if (f(v, index)) {
          return index;
        }
        index += 1;
      }
      return -1;
    },
    includes(elem) {
      return this.find((e) => e === elem) !== void 0;
    },
    join(sep) {
      return this.toArray().join(sep);
    },
    reduce(f, initialValue) {
      return this.toArray().reduce(f, initialValue);
    },
    reduceRight(f, initialValue) {
      return this.toArray().reduceRight(f, initialValue);
    },
    lastIndexOf(search, fromIndex = Infinity) {
      return this.toArray().lastIndexOf(search, fromIndex);
    },
    slice(index, num) {
      return this.toArray().slice(index, num);
    },
    some(f) {
      let index = 0;
      for (const v of this) {
        if (f(v, index)) {
          return true;
        }
        index += 1;
      }
      return false;
    },
    [Symbol.iterator]: function* () {
      let i = 0;
      let value = valueAt(target2, i);
      while (value !== void 0) {
        yield value;
        i += 1;
        value = valueAt(target2, i);
      }
    }
  };
  return methods;
}
function printPath(path) {
  const jsonPointerComponents = path.map((component) => {
    if (typeof component === "number") {
      return component.toString();
    } else if (typeof component === "string") {
      return component.replace(/~/g, "~0").replace(/\//g, "~1");
    }
  });
  if (path.length === 0) {
    return "";
  } else {
    return "/" + jsonPointerComponents.join("/");
  }
}
function isImmutableString(obj) {
  return typeof obj === "object" && obj !== null && Object.prototype.hasOwnProperty.call(obj, IMMUTABLE_STRING);
}
function isCounter(obj) {
  return typeof obj === "object" && obj !== null && Object.prototype.hasOwnProperty.call(obj, COUNTER);
}

// node_modules/.deno/@automerge+automerge@3.2.6/node_modules/@automerge/automerge/dist/mjs/numbers.js
var Int = class {
  constructor(value) {
    if (!(Number.isInteger(value) && value <= Number.MAX_SAFE_INTEGER && value >= Number.MIN_SAFE_INTEGER)) {
      throw new RangeError(`Value ${value} cannot be a uint`);
    }
    this.value = value;
    Reflect.defineProperty(this, INT, { value: true });
    Object.freeze(this);
  }
};
var Uint = class {
  constructor(value) {
    if (!(Number.isInteger(value) && value <= Number.MAX_SAFE_INTEGER && value >= 0)) {
      throw new RangeError(`Value ${value} cannot be a uint`);
    }
    this.value = value;
    Reflect.defineProperty(this, UINT, { value: true });
    Object.freeze(this);
  }
};
var Float64 = class {
  constructor(value) {
    if (typeof value !== "number") {
      throw new RangeError(`Value ${value} cannot be a float64`);
    }
    this.value = value || 0;
    Reflect.defineProperty(this, F64, { value: true });
    Object.freeze(this);
  }
};

// node_modules/.deno/@automerge+automerge@3.2.6/node_modules/@automerge/automerge/dist/mjs/generated/release-info.js
var JS_GIT_HEAD = "a11222254d2f86ec9df0738e7002f15a930fe9b4";

// node_modules/.deno/@automerge+automerge@3.2.6/node_modules/@automerge/automerge/dist/mjs/internal_state.js
function _state(doc, checkroot = true) {
  if (typeof doc !== "object") {
    throw new RangeError("must be the document root");
  }
  const state = Reflect.get(doc, STATE);
  if (state === void 0 || state == null || checkroot && _obj(doc) !== "_root") {
    throw new RangeError("must be the document root");
  }
  return state;
}
function _clear_cache(doc) {
  Reflect.set(doc, CLEAR_CACHE, true);
}
function _trace(doc) {
  return Reflect.get(doc, TRACE);
}
function _obj(doc) {
  if (!(typeof doc === "object") || doc === null) {
    return null;
  }
  return Reflect.get(doc, OBJECT_ID);
}
function _is_proxy(doc) {
  return !!Reflect.get(doc, IS_PROXY);
}

// node_modules/.deno/@automerge+automerge@3.2.6/node_modules/@automerge/automerge/dist/mjs/apply_patches.js
function applyPatch(doc, patch) {
  let path = resolvePath(doc, patch.path);
  if (patch.action === "put") {
    applyPutPatch(doc, path, patch);
  } else if (patch.action === "insert") {
    applyInsertPatch(doc, path, patch);
  } else if (patch.action === "del") {
    applyDelPatch(doc, path, patch);
  } else if (patch.action === "splice") {
    applySplicePatch(doc, path, patch);
  } else if (patch.action === "inc") {
    applyIncPatch(doc, path, patch);
  } else if (patch.action === "mark") {
    applyMarkPatch(doc, path, patch);
  } else if (patch.action === "unmark") {
    applyUnmarkPatch(doc, path, patch);
  } else if (patch.action === "conflict") {
  } else {
    throw new RangeError(`unsupported patch: ${patch}`);
  }
}
function applyPutPatch(doc, path, patch) {
  let { obj: parent, prop } = pathElemAt(path, -1);
  parent[prop] = patch.value;
}
function applyInsertPatch(doc, path, patch) {
  let { obj: parent, prop } = pathElemAt(path, -1);
  if (!Array.isArray(parent)) {
    throw new RangeError(`target is not an array for patch`);
  }
  if (!(typeof prop === "number")) {
    throw new RangeError(`index is not a number for patch`);
  }
  parent.splice(prop, 0, ...patch.values);
}
function applyDelPatch(doc, path, patch) {
  let { obj: parent, prop, parentPath } = pathElemAt(path, -1);
  if (!(typeof prop === "number")) {
    throw new RangeError(`index is not a number for patch`);
  }
  if (Array.isArray(parent)) {
    parent.splice(prop, patch.length || 1);
  } else if (typeof parent === "string") {
    if (isAutomerge(doc)) {
      splice(doc, parentPath, prop, patch.length || 1);
    } else {
      let { obj: grandParent, prop: grandParentProp } = pathElemAt(path, -2);
      if (typeof prop !== "number") {
        throw new RangeError(`index is not a number for patch`);
      }
      let target2 = grandParent[grandParentProp];
      if (target2 == null || typeof target2 !== "string") {
        throw new RangeError(`target is not a string for patch`);
      }
      let newString = target2.slice(0, prop) + target2.slice(prop + (patch.length || 1));
      grandParent[grandParentProp] = newString;
    }
  } else {
    throw new RangeError(`target is not an array or string for patch`);
  }
}
function applySplicePatch(doc, path, patch) {
  if (isAutomerge(doc)) {
    let { obj: parent, prop, parentPath } = pathElemAt(path, -1);
    if (!(typeof prop === "number")) {
      throw new RangeError(`index is not a number for patch`);
    }
    splice(doc, parentPath, prop, 0, patch.value);
  } else {
    let { obj: parent, prop } = pathElemAt(path, -1);
    let { obj: grandParent, prop: grandParentProp } = pathElemAt(path, -2);
    if (typeof prop !== "number") {
      throw new RangeError(`index is not a number for patch`);
    }
    let target2 = grandParent[grandParentProp];
    if (target2 == null || typeof target2 !== "string") {
      throw new RangeError(`target is not a string for patch`);
    }
    let newString = target2.slice(0, prop) + patch.value + target2.slice(prop);
    grandParent[grandParentProp] = newString;
  }
}
function applyIncPatch(doc, path, patch) {
  let { obj: parent, prop } = pathElemAt(path, -1);
  const counter = parent[prop];
  if (isAutomerge(doc)) {
    if (!isCounter(counter)) {
      throw new RangeError(`target is not a counter for patch`);
    }
    counter.increment(patch.value);
  } else {
    if (!(typeof counter === "number")) {
      throw new RangeError(`target is not a number for patch`);
    }
    parent[prop] = counter + patch.value;
  }
}
function applyMarkPatch(doc, path, patch) {
  let { obj: parent, prop } = pathElemAt(path, -1);
  if (!isAutomerge(doc)) {
    return;
  }
  for (const markSpec of patch.marks) {
    mark(
      doc,
      patch.path,
      // TODO: add mark expansion to patches. This will require emitting
      // the expand values in patches.
      { start: markSpec.start, end: markSpec.end, expand: "none" },
      markSpec.name,
      markSpec.value
    );
  }
}
function applyUnmarkPatch(doc, path, patch) {
  if (!isAutomerge(doc)) {
    return;
  }
  unmark(doc, patch.path, { start: patch.start, end: patch.end, expand: "none" }, patch.name);
}
function applyPatches(doc, patches) {
  for (const patch of patches) {
    applyPatch(doc, patch);
  }
}
function resolvePath(doc, path) {
  const result = [];
  let current = doc;
  let currentPath = [];
  for (const [index, prop] of path.entries()) {
    result.push({ obj: current, prop, parentPath: currentPath.slice() });
    currentPath.push(prop);
    if (index !== path.length - 1) {
      if (current == null || typeof current != "object") {
        throw new Error(`Invalid path: ${path}`);
      }
      current = current[prop];
    } else {
      break;
    }
  }
  return result;
}
function pathElemAt(resolved, index) {
  let result = resolved.at(index);
  if (result == void 0) {
    throw new Error("invalid path");
  }
  return result;
}

// node_modules/.deno/@automerge+automerge@3.2.6/node_modules/@automerge/automerge/dist/mjs/conflicts.js
function conflictAt(context, objectId, prop, withinChangeCallback) {
  const values = context.getAll(objectId, prop);
  if (values.length <= 1) {
    return;
  }
  const result = {};
  for (const fullVal of values) {
    switch (fullVal[0]) {
      case "map":
        if (withinChangeCallback) {
          result[fullVal[1]] = mapProxy(context, fullVal[1], [prop]);
        } else {
          result[fullVal[1]] = reifyFullValue(context, [fullVal[0], fullVal[1]]);
        }
        break;
      case "list":
        if (withinChangeCallback) {
          result[fullVal[1]] = listProxy(context, fullVal[1], [prop]);
        } else {
          result[fullVal[1]] = reifyFullValue(context, [fullVal[0], fullVal[1]]);
        }
        break;
      case "text":
        result[fullVal[1]] = context.text(fullVal[1]);
        break;
      case "str":
      case "uint":
      case "int":
      case "f64":
      case "boolean":
      case "bytes":
      case "null":
        result[fullVal[2]] = fullVal[1];
        break;
      case "counter":
        result[fullVal[2]] = new Counter(fullVal[1]);
        break;
      case "timestamp":
        result[fullVal[2]] = new Date(fullVal[1]);
        break;
      default:
        throw RangeError(`datatype ${fullVal[0]} unimplemented`);
    }
  }
  return result;
}
function reifyFullValue(context, fullValue) {
  switch (fullValue[0]) {
    case "map":
      const mapResult = {};
      for (const key of context.keys(fullValue[1])) {
        let subVal = context.getWithType(fullValue[1], key);
        if (!subVal) {
          throw new Error("unexpected null map value");
        }
        mapResult[key] = reifyFullValue(context, subVal);
      }
      return Object.freeze(mapResult);
    case "list":
      const listResult = [];
      const length = context.length(fullValue[1]);
      for (let i = 0; i < length; i++) {
        let subVal = context.getWithType(fullValue[1], i);
        if (!subVal) {
          throw new Error("unexpected null list element");
        }
        listResult.push(reifyFullValue(context, subVal));
      }
      return Object.freeze(listResult);
    case "text":
      return context.text(fullValue[1]);
    case "str":
    case "uint":
    case "int":
    case "f64":
    case "boolean":
    case "bytes":
    case "null":
      return fullValue[1];
    case "counter":
      return new Counter(fullValue[1]);
    case "timestamp":
      return new Date(fullValue[1]);
    default:
      throw RangeError(`datatype ${fullValue[0]} unimplemented`);
  }
}

// node_modules/.deno/@automerge+automerge@3.2.6/node_modules/@automerge/automerge/dist/mjs/implementation.js
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
function insertAt(list, index, ...values) {
  if (!_is_proxy(list)) {
    throw new RangeError("object cannot be modified outside of a change block");
  }
  ;
  list.insertAt(index, ...values);
}
function deleteAt(list, index, numDelete) {
  if (!_is_proxy(list)) {
    throw new RangeError("object cannot be modified outside of a change block");
  }
  ;
  list.deleteAt(index, numDelete);
}
function use(api2) {
  UseApi(api2);
}
function getBackend(doc) {
  return _state(doc).handle;
}
function importOpts(_actor) {
  if (typeof _actor === "object") {
    return _actor;
  } else {
    return { actor: _actor };
  }
}
function getChangesSince(state, heads) {
  const n = _state(state);
  return n.handle.getChanges(heads);
}
function getChangesMetaSince(state, heads) {
  const n = _state(state);
  return n.handle.getChangesMeta(heads);
}
function cursorToIndex(state, value, index) {
  if (typeof index == "string") {
    if (/^-?[0-9]+@[0-9a-zA-Z]+$|^[se]$/.test(index)) {
      return state.handle.getCursorPosition(value, index);
    } else {
      throw new RangeError("index must be a number or cursor");
    }
  } else {
    return index;
  }
}
function init(_opts) {
  const opts = importOpts(_opts);
  const freeze = !!opts.freeze;
  const patchCallback = opts.patchCallback;
  const actor = opts.actor;
  const handle2 = ApiHandler.create({ actor });
  handle2.enableFreeze(!!opts.freeze);
  registerDatatypes(handle2);
  const doc = handle2.materialize("/", void 0, {
    handle: handle2,
    heads: void 0,
    freeze,
    patchCallback
  });
  return doc;
}
function view(doc, heads) {
  const state = _state(doc);
  const handle2 = state.handle;
  return state.handle.materialize("/", heads, Object.assign(Object.assign({}, state), {
    handle: handle2,
    heads
  }));
}
function clone(doc, _opts) {
  const state = _state(doc);
  const heads = state.heads;
  const opts = importOpts(_opts);
  const handle2 = state.handle.fork(opts.actor, heads);
  handle2.updateDiffCursor();
  const { heads: _oldHeads } = state, stateSansHeads = __rest(state, ["heads"]);
  stateSansHeads.patchCallback = opts.patchCallback;
  return handle2.applyPatches(doc, Object.assign(Object.assign({}, stateSansHeads), { handle: handle2 }));
}
function free(doc) {
  return _state(doc).handle.free();
}
function from(initialState, _opts) {
  const opts = importOpts(_opts);
  if (typeof initialState !== "object" || Array.isArray(initialState)) {
    initialState = Object.assign({}, initialState);
  }
  validateForBatchInsert(initialState, null, []);
  const doc = init(_opts);
  return _change(doc, "from", {}, (d) => {
    _state(doc).handle.initRootFromHydrate(initialState);
    return d;
  }).newDoc;
}
function change(doc, options, callback) {
  if (typeof options === "function") {
    return _change(doc, "change", {}, options).newDoc;
  } else if (typeof callback === "function") {
    if (typeof options === "string") {
      options = { message: options };
    }
    return _change(doc, "change", options, callback).newDoc;
  } else {
    throw RangeError("Invalid args for change");
  }
}
function changeAt(doc, scope, options, callback) {
  if (typeof options === "function") {
    return _change(doc, "changeAt", {}, options, scope);
  } else if (typeof callback === "function") {
    if (typeof options === "string") {
      options = { message: options };
    }
    return _change(doc, "changeAt", options, callback, scope);
  } else {
    throw RangeError("Invalid args for changeAt");
  }
}
function progressDocument(doc, source, heads, callback) {
  if (heads == null) {
    return doc;
  }
  const state = _state(doc);
  const nextState = Object.assign(Object.assign({}, state), { heads: void 0 });
  const { value: nextDoc, patches } = state.handle.applyAndReturnPatches(doc, nextState);
  if (patches.length > 0) {
    if (callback != null) {
      callback(patches, { before: doc, after: nextDoc, source });
    }
    const newState = _state(nextDoc);
    newState.mostRecentPatch = {
      before: _state(doc).heads,
      after: newState.handle.getHeads(),
      patches
    };
  }
  state.heads = heads;
  return nextDoc;
}
function _change(doc, source, options, callback, scope) {
  if (typeof callback !== "function") {
    throw new RangeError("invalid change function");
  }
  const state = _state(doc);
  if (doc === void 0 || state === void 0) {
    throw new RangeError("must be the document root");
  }
  if (state.heads) {
    throw new RangeError("Attempting to change an outdated document.  Use Automerge.clone() if you wish to make a writable copy.");
  }
  if (_is_proxy(doc)) {
    throw new RangeError("Calls to Automerge.change cannot be nested");
  }
  let heads = state.handle.getHeads();
  if (scope && headsEqual(scope, heads)) {
    scope = void 0;
  }
  if (scope) {
    state.handle.isolate(scope);
    heads = scope;
  }
  if (!("time" in options)) {
    options.time = Math.floor(Date.now() / 1e3);
  }
  try {
    state.heads = heads;
    const root = rootProxy(state.handle);
    callback(root);
    if (state.handle.pendingOps() === 0) {
      state.heads = void 0;
      if (scope) {
        state.handle.integrate();
      }
      return {
        newDoc: doc,
        newHeads: null
      };
    } else {
      const newHead = state.handle.commit(options.message, options.time);
      state.handle.integrate();
      return {
        newDoc: progressDocument(doc, source, heads, options.patchCallback || state.patchCallback),
        newHeads: newHead != null ? [newHead] : null
      };
    }
  } catch (e) {
    state.heads = void 0;
    state.handle.rollback();
    throw e;
  }
}
function emptyChange(doc, options) {
  if (options === void 0) {
    options = {};
  }
  if (typeof options === "string") {
    options = { message: options };
  }
  if (!("time" in options)) {
    options.time = Math.floor(Date.now() / 1e3);
  }
  const state = _state(doc);
  if (state.heads) {
    throw new RangeError("Attempting to change an outdated document.  Use Automerge.clone() if you wish to make a writable copy.");
  }
  if (_is_proxy(doc)) {
    throw new RangeError("Calls to Automerge.change cannot be nested");
  }
  const heads = state.handle.getHeads();
  state.handle.emptyChange(options.message, options.time);
  return progressDocument(doc, "emptyChange", heads);
}
function load3(data, _opts) {
  const opts = importOpts(_opts);
  if (opts.patchCallback) {
    return loadIncremental(init(opts), data);
  }
  const actor = opts.actor;
  const patchCallback = opts.patchCallback;
  const unchecked = opts.unchecked || false;
  const allowMissingDeps = opts.allowMissingChanges || false;
  const convertImmutableStringsToText = opts.convertImmutableStringsToText || false;
  const handle2 = ApiHandler.load(data, {
    actor,
    unchecked,
    allowMissingDeps,
    convertImmutableStringsToText
  });
  handle2.enableFreeze(!!opts.freeze);
  registerDatatypes(handle2);
  const doc = handle2.materialize("/", void 0, {
    handle: handle2,
    heads: void 0,
    patchCallback
  });
  return doc;
}
function loadIncremental(doc, data, opts) {
  if (!opts) {
    opts = {};
  }
  const state = _state(doc);
  if (state.heads) {
    throw new RangeError("Attempting to change an out of date document - set at: " + _trace(doc));
  }
  if (_is_proxy(doc)) {
    throw new RangeError("Calls to Automerge.change cannot be nested");
  }
  const heads = state.handle.getHeads();
  state.handle.loadIncremental(data);
  return progressDocument(doc, "loadIncremental", heads, opts.patchCallback || state.patchCallback);
}
function saveIncremental(doc) {
  const state = _state(doc);
  if (state.heads) {
    throw new RangeError("Attempting to change an out of date document - set at: " + _trace(doc));
  }
  if (_is_proxy(doc)) {
    throw new RangeError("Calls to Automerge.change cannot be nested");
  }
  return state.handle.saveIncremental();
}
function save(doc) {
  return _state(doc).handle.save();
}
function merge(local, remote) {
  const localState = _state(local);
  if (localState.heads) {
    throw new RangeError("Attempting to change an out of date document - set at: " + _trace(local));
  }
  const heads = localState.handle.getHeads();
  const remoteState = _state(remote);
  const changes = localState.handle.getChangesAdded(remoteState.handle);
  localState.handle.applyChanges(changes);
  return progressDocument(local, "merge", heads, localState.patchCallback);
}
function getActorId(doc) {
  const state = _state(doc);
  return state.handle.getActorId();
}
function getConflicts(doc, prop) {
  const state = _state(doc, false);
  const objectId = _obj(doc);
  if (objectId != null) {
    const withinChangeCallback = _is_proxy(doc);
    return conflictAt(state.handle, objectId, prop, withinChangeCallback);
  } else {
    return void 0;
  }
}
function getLastLocalChange(doc) {
  const state = _state(doc);
  return state.handle.getLastLocalChange() || void 0;
}
function getObjectId(doc, prop) {
  if (prop) {
    const state = _state(doc, false);
    const objectId = _obj(doc);
    if (!state || !objectId) {
      return null;
    }
    return state.handle.get(objectId, prop);
  } else {
    return _obj(doc);
  }
}
function getChanges(oldState, newState) {
  const n = _state(newState);
  return n.handle.getChanges(getHeads(oldState));
}
function getAllChanges(doc) {
  const state = _state(doc);
  return state.handle.getChanges([]);
}
function applyChanges(doc, changes, opts) {
  const state = _state(doc);
  if (!opts) {
    opts = {};
  }
  if (state.heads) {
    throw new RangeError("Attempting to change an outdated document.  Use Automerge.clone() if you wish to make a writable copy.");
  }
  if (_is_proxy(doc)) {
    throw new RangeError("Calls to Automerge.change cannot be nested");
  }
  const heads = state.handle.getHeads();
  state.handle.applyChanges(changes);
  state.heads = heads;
  return [
    progressDocument(doc, "applyChanges", heads, opts.patchCallback || state.patchCallback)
  ];
}
function getHistory(doc) {
  const history = getAllChanges(doc);
  return history.map((change2, index) => ({
    get change() {
      return decodeChange3(change2);
    },
    get snapshot() {
      const [state] = applyChanges(init(), history.slice(0, index + 1));
      return state;
    }
  }));
}
function diff(doc, before, after) {
  checkHeads(before, "before heads");
  checkHeads(after, "after heads");
  const state = _state(doc);
  if (state.mostRecentPatch && equals(state.mostRecentPatch.before, before) && equals(state.mostRecentPatch.after, after)) {
    return state.mostRecentPatch.patches;
  }
  return state.handle.diff(before, after);
}
function diffPath(doc, path, before, after, opts) {
  checkHeads(before, "before");
  checkHeads(after, "after");
  const state = _state(doc);
  const objPath = absoluteObjPath(doc, path, "diff");
  return state.handle.diffPath(objPath, before, after, opts);
}
function headsEqual(heads1, heads2) {
  if (heads1.length !== heads2.length) {
    return false;
  }
  for (let i = 0; i < heads1.length; i++) {
    if (heads1[i] !== heads2[i]) {
      return false;
    }
  }
  return true;
}
function checkHeads(heads, fieldname) {
  if (!Array.isArray(heads)) {
    throw new Error(`invalid ${fieldname}: must be an array`);
  }
}
function equals(val1, val2) {
  if (!isObject(val1) || !isObject(val2))
    return val1 === val2;
  const keys1 = Object.keys(val1).sort(), keys2 = Object.keys(val2).sort();
  if (keys1.length !== keys2.length)
    return false;
  for (let i = 0; i < keys1.length; i++) {
    if (keys1[i] !== keys2[i])
      return false;
    if (!equals(val1[keys1[i]], val2[keys2[i]]))
      return false;
  }
  return true;
}
function encodeSyncState3(state) {
  const sync = ApiHandler.importSyncState(state);
  const result = ApiHandler.encodeSyncState(sync);
  sync.free();
  return result;
}
function decodeSyncState3(state) {
  const sync = ApiHandler.decodeSyncState(state);
  const result = ApiHandler.exportSyncState(sync);
  sync.free();
  return result;
}
function generateSyncMessage(doc, inState) {
  const state = _state(doc);
  const syncState = ApiHandler.importSyncState(inState);
  const message = state.handle.generateSyncMessage(syncState);
  const outState = ApiHandler.exportSyncState(syncState);
  return [outState, message];
}
function receiveSyncMessage(doc, inState, message, opts) {
  const syncState = ApiHandler.importSyncState(inState);
  if (!opts) {
    opts = {};
  }
  const state = _state(doc);
  if (state.heads) {
    throw new RangeError("Attempting to change an outdated document.  Use Automerge.clone() if you wish to make a writable copy.");
  }
  if (_is_proxy(doc)) {
    throw new RangeError("Calls to Automerge.change cannot be nested");
  }
  const heads = state.handle.getHeads();
  state.handle.receiveSyncMessage(syncState, message);
  const outSyncState = ApiHandler.exportSyncState(syncState);
  return [
    progressDocument(doc, "receiveSyncMessage", heads, opts.patchCallback || state.patchCallback),
    outSyncState,
    null
  ];
}
function hasOurChanges(doc, remoteState) {
  const state = _state(doc);
  const syncState = ApiHandler.importSyncState(remoteState);
  return state.handle.hasOurChanges(syncState);
}
function initSyncState3(options) {
  if (options === null || options === void 0 ? void 0 : options.readOnly) {
    const syncState = ApiHandler.initSyncState();
    syncState.readOnly = true;
    const result = ApiHandler.exportSyncState(syncState);
    syncState.free();
    return result;
  }
  return ApiHandler.exportSyncState(ApiHandler.initSyncState());
}
function encodeChange3(change2) {
  return ApiHandler.encodeChange(change2);
}
function decodeChange3(data) {
  return ApiHandler.decodeChange(data);
}
function encodeSyncMessage3(message) {
  return ApiHandler.encodeSyncMessage(message);
}
function decodeSyncMessage3(message) {
  return ApiHandler.decodeSyncMessage(message);
}
function getMissingDeps(doc, heads) {
  const state = _state(doc);
  return state.handle.getMissingDeps(heads);
}
function getHeads(doc) {
  const state = _state(doc);
  return state.heads || state.handle.getHeads();
}
function dump(doc) {
  const state = _state(doc);
  state.handle.dump();
}
function toJS(doc) {
  const state = _state(doc);
  const enabled = state.handle.enableFreeze(false);
  const result = state.handle.materialize("/", state.heads);
  state.handle.enableFreeze(enabled);
  return result;
}
function isAutomerge(doc) {
  if (typeof doc == "object" && doc !== null) {
    return getObjectId(doc) === "_root" && !!Reflect.get(doc, STATE);
  } else {
    return false;
  }
}
function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}
function saveSince(doc, heads) {
  const state = _state(doc);
  const result = state.handle.saveSince(heads);
  return result;
}
function hasHeads(doc, heads) {
  const state = _state(doc);
  for (const hash2 of heads) {
    if (!state.handle.getChangeByHash(hash2)) {
      return false;
    }
  }
  return true;
}
function registerDatatypes(handle2) {
  handle2.registerDatatype("counter", (n) => new Counter(n), (n) => {
    if (n instanceof Counter) {
      return n.value;
    }
  });
  handle2.registerDatatype("str", (n) => {
    return new ImmutableString(n);
  }, (s) => {
    if (isImmutableString(s)) {
      return s.val;
    }
  });
}
function topoHistoryTraversal(doc) {
  const state = _state(doc);
  return state.handle.topoHistoryTraversal();
}
function inspectChange(doc, changeHash) {
  const state = _state(doc);
  return state.handle.getDecodedChangeByHash(changeHash);
}
function stats(doc) {
  var _a2, _b, _c, _d, _e, _f;
  const state = _state(doc);
  const wasmStats = state.handle.stats();
  const release = releaseInfo();
  return Object.assign(Object.assign({}, wasmStats), { cargoPackageName: (_b = (_a2 = release.wasm) === null || _a2 === void 0 ? void 0 : _a2.cargoPackageName) !== null && _b !== void 0 ? _b : "unknown", cargoPackageVersion: (_d = (_c = release.wasm) === null || _c === void 0 ? void 0 : _c.cargoPackageVersion) !== null && _d !== void 0 ? _d : "unknown", rustcVersion: (_f = (_e = release.wasm) === null || _e === void 0 ? void 0 : _e.rustcVersion) !== null && _f !== void 0 ? _f : "unknown" });
}
function releaseInfo() {
  let wasm3 = null;
  try {
    wasm3 = ApiHandler.wasmReleaseInfo();
  } catch (_a2) {
  }
  return {
    js: {
      gitHead: JS_GIT_HEAD
    },
    wasm: wasm3
  };
}
function splice(doc, path, index, del, newText) {
  const objPath = absoluteObjPath(doc, path, "splice");
  if (!_is_proxy(doc)) {
    throw new RangeError("object cannot be modified outside of a change block");
  }
  const state = _state(doc, false);
  _clear_cache(doc);
  index = cursorToIndex(state, objPath, index);
  try {
    return state.handle.splice(objPath, index, del, newText);
  } catch (e) {
    throw new RangeError(`Cannot splice: ${e}`);
  }
}
function updateText(doc, path, newText) {
  const objPath = absoluteObjPath(doc, path, "updateText");
  if (!_is_proxy(doc)) {
    throw new RangeError("object cannot be modified outside of a change block");
  }
  const state = _state(doc, false);
  _clear_cache(doc);
  try {
    return state.handle.updateText(objPath, newText);
  } catch (e) {
    throw new RangeError(`Cannot updateText: ${e}`);
  }
}
function spans(doc, path) {
  const state = _state(doc, false);
  const objPath = absoluteObjPath(doc, path, "spans");
  try {
    return state.handle.spans(objPath, state.heads);
  } catch (e) {
    throw new RangeError(`Cannot splice: ${e}`);
  }
}
function block(doc, path, index) {
  const objPath = absoluteObjPath(doc, path, "splitBlock");
  const state = _state(doc, false);
  index = cursorToIndex(state, objPath, index);
  try {
    return state.handle.getBlock(objPath, index);
  } catch (e) {
    throw new RangeError(`Cannot get block: ${e}`);
  }
}
function splitBlock(doc, path, index, block2) {
  if (!_is_proxy(doc)) {
    throw new RangeError("object cannot be modified outside of a change block");
  }
  const objPath = absoluteObjPath(doc, path, "splitBlock");
  const state = _state(doc, false);
  _clear_cache(doc);
  index = cursorToIndex(state, objPath, index);
  try {
    state.handle.splitBlock(objPath, index, block2);
  } catch (e) {
    throw new RangeError(`Cannot splice: ${e}`);
  }
}
function joinBlock(doc, path, index) {
  if (!_is_proxy(doc)) {
    throw new RangeError("object cannot be modified outside of a change block");
  }
  const objPath = absoluteObjPath(doc, path, "joinBlock");
  const state = _state(doc, false);
  _clear_cache(doc);
  index = cursorToIndex(state, objPath, index);
  try {
    state.handle.joinBlock(objPath, index);
  } catch (e) {
    throw new RangeError(`Cannot joinBlock: ${e}`);
  }
}
function updateBlock(doc, path, index, block2) {
  if (!_is_proxy(doc)) {
    throw new RangeError("object cannot be modified outside of a change block");
  }
  const objPath = absoluteObjPath(doc, path, "updateBlock");
  const state = _state(doc, false);
  _clear_cache(doc);
  index = cursorToIndex(state, objPath, index);
  try {
    state.handle.updateBlock(objPath, index, block2);
  } catch (e) {
    throw new RangeError(`Cannot updateBlock: ${e}`);
  }
}
function updateSpans(doc, path, newSpans, config) {
  if (!_is_proxy(doc)) {
    throw new RangeError("object cannot be modified outside of a change block");
  }
  const objPath = absoluteObjPath(doc, path, "updateSpans");
  const state = _state(doc, false);
  _clear_cache(doc);
  try {
    state.handle.updateSpans(objPath, newSpans, config);
  } catch (e) {
    throw new RangeError(`Cannot updateSpans: ${e}`);
  }
}
function getCursor(doc, path, position3, move) {
  const objPath = absoluteObjPath(doc, path, "getCursor");
  const state = _state(doc, false);
  try {
    return state.handle.getCursor(objPath, position3, state.heads, move);
  } catch (e) {
    throw new RangeError(`Cannot getCursor: ${e}`);
  }
}
function getCursorPosition(doc, path, cursor2) {
  const objPath = absoluteObjPath(doc, path, "getCursorPosition");
  const state = _state(doc, false);
  try {
    return state.handle.getCursorPosition(objPath, cursor2, state.heads);
  } catch (e) {
    throw new RangeError(`Cannot getCursorPosition: ${e}`);
  }
}
function mark(doc, path, range, name, value) {
  const objPath = absoluteObjPath(doc, path, "mark");
  if (!_is_proxy(doc)) {
    throw new RangeError("object cannot be modified outside of a change block");
  }
  const state = _state(doc, false);
  try {
    return state.handle.mark(objPath, range, name, value);
  } catch (e) {
    throw new RangeError(`Cannot mark: ${e}`);
  }
}
function unmark(doc, path, range, name) {
  const objPath = absoluteObjPath(doc, path, "unmark");
  if (!_is_proxy(doc)) {
    throw new RangeError("object cannot be modified outside of a change block");
  }
  const state = _state(doc, false);
  try {
    return state.handle.unmark(objPath, range, name);
  } catch (e) {
    throw new RangeError(`Cannot unmark: ${e}`);
  }
}
function marks(doc, path) {
  const objPath = absoluteObjPath(doc, path, "marks");
  const state = _state(doc, false);
  try {
    return state.handle.marks(objPath);
  } catch (e) {
    throw new RangeError(`Cannot call marks(): ${e}`);
  }
}
function marksAt(doc, path, index) {
  const objPath = absoluteObjPath(doc, path, "marksAt");
  const state = _state(doc, false);
  try {
    return state.handle.marksAt(objPath, index);
  } catch (e) {
    throw new RangeError(`Cannot call marksAt(): ${e}`);
  }
}
function absoluteObjPath(doc, path, functionName) {
  path = path.slice();
  const objectId = _obj(doc);
  if (!objectId) {
    throw new RangeError(`invalid object for ${functionName}`);
  }
  path.unshift(objectId);
  return path.join("/");
}
var isRawString = isImmutableString;
var RawString = ImmutableString;
function saveBundle(doc, hashes) {
  const state = _state(doc, false);
  return state.handle.saveBundle(hashes);
}
function readBundle3(bundle) {
  return ApiHandler.readBundle(bundle);
}

// node_modules/.deno/@automerge+automerge@3.2.6/node_modules/@automerge/automerge/dist/mjs/entrypoints/fullfat_bundler.js
UseApi(automerge_wasm_exports2);

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/DocHandle.js
var import_debug = __toESM(require_browser(), 1);

// node_modules/.deno/eventemitter3@5.0.4/node_modules/eventemitter3/index.mjs
var import_index = __toESM(require_eventemitter3(), 1);

// node_modules/.deno/xstate@5.32.2/node_modules/xstate/dist/xstate.cjs.mjs
var import_xstate_cjs = __toESM(require_xstate_cjs(), 1);

// node_modules/.deno/uuid@9.0.1/node_modules/uuid/dist/esm-browser/rng.js
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}

// node_modules/.deno/uuid@9.0.1/node_modules/uuid/dist/esm-browser/regex.js
var regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

// node_modules/.deno/uuid@9.0.1/node_modules/uuid/dist/esm-browser/validate.js
function validate(uuid) {
  return typeof uuid === "string" && regex_default.test(uuid);
}
var validate_default = validate;

// node_modules/.deno/uuid@9.0.1/node_modules/uuid/dist/esm-browser/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

// node_modules/.deno/uuid@9.0.1/node_modules/uuid/dist/esm-browser/parse.js
function parse(uuid) {
  if (!validate_default(uuid)) {
    throw TypeError("Invalid UUID");
  }
  let v;
  const arr = new Uint8Array(16);
  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 255;
  arr[2] = v >>> 8 & 255;
  arr[3] = v & 255;
  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 255;
  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 255;
  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 255;
  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 1099511627776 & 255;
  arr[11] = v / 4294967296 & 255;
  arr[12] = v >>> 24 & 255;
  arr[13] = v >>> 16 & 255;
  arr[14] = v >>> 8 & 255;
  arr[15] = v & 255;
  return arr;
}
var parse_default = parse;

// node_modules/.deno/uuid@9.0.1/node_modules/uuid/dist/esm-browser/native.js
var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native_default = {
  randomUUID
};

// node_modules/.deno/uuid@9.0.1/node_modules/uuid/dist/esm-browser/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/AutomergeUrl.js
var import_bs58check = __toESM(require_bs58check(), 1);

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/helpers/bufferFromHex.js
var uint8ArrayFromHexString = (hexString) => {
  if (hexString.length % 2 !== 0) {
    throw new Error("Hex string must have an even length");
  }
  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    bytes[i >> 1] = parseInt(hexString.slice(i, i + 2), 16);
  }
  return bytes;
};
var uint8ArrayToHexString = (data) => {
  return Array.from(data, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/AutomergeUrl.js
var urlPrefix = "automerge:";
var parseAutomergeUrl = (url) => {
  const [baseUrl, headsSection, ...rest] = url.split("#");
  if (rest.length > 0) {
    throw new Error("Invalid URL: contains multiple heads sections");
  }
  const regex = new RegExp(`^${urlPrefix}(\\w+)$`);
  const [, docMatch] = baseUrl.match(regex) || [];
  const documentId = docMatch;
  const binaryDocumentId = documentIdToBinary(documentId);
  if (!binaryDocumentId)
    throw new Error("Invalid document URL: " + url);
  if (headsSection === void 0)
    return { binaryDocumentId, documentId };
  const heads = headsSection === "" ? [] : headsSection.split("|");
  const hexHeads = heads.map((head) => {
    try {
      return uint8ArrayToHexString(import_bs58check.default.decode(head));
    } catch (e) {
      throw new Error(`Invalid head in URL: ${head}`);
    }
  });
  return { binaryDocumentId, hexHeads, documentId, heads };
};
var stringifyAutomergeUrl = (arg) => {
  if (arg instanceof Uint8Array || typeof arg === "string") {
    return urlPrefix + (arg instanceof Uint8Array ? binaryToDocumentId(arg) : arg);
  }
  const { documentId, heads = void 0 } = arg;
  if (documentId === void 0)
    throw new Error("Invalid documentId: " + documentId);
  const encodedDocumentId = documentId instanceof Uint8Array ? binaryToDocumentId(documentId) : documentId;
  let url = `${urlPrefix}${encodedDocumentId}`;
  if (heads !== void 0) {
    heads.forEach((head) => {
      try {
        import_bs58check.default.decode(head);
      } catch (e) {
        throw new Error(`Invalid head: ${head}`);
      }
    });
    url += "#" + heads.join("|");
  }
  return url;
};
var isValidAutomergeUrl = (str) => {
  if (typeof str !== "string" || !str || !str.startsWith(urlPrefix))
    return false;
  try {
    const { documentId, heads } = parseAutomergeUrl(str);
    if (!isValidDocumentId(documentId))
      return false;
    if (heads && !heads.every((head) => {
      try {
        import_bs58check.default.decode(head);
        return true;
      } catch {
        return false;
      }
    }))
      return false;
    return true;
  } catch {
    return false;
  }
};
var isValidDocumentId = (str) => {
  if (typeof str !== "string")
    return false;
  const binaryDocumentID = documentIdToBinary(str);
  return binaryDocumentID !== void 0;
};
var isValidUuid = (str) => typeof str === "string" && validate_default(str);
var generateAutomergeUrl = () => {
  const documentId = v4_default(null, new Uint8Array(16));
  return stringifyAutomergeUrl({ documentId });
};
var documentIdToBinary = (docId) => import_bs58check.default.decodeUnsafe(docId);
var binaryToDocumentId = (docId) => import_bs58check.default.encode(docId);
var encodeHeads = (heads) => heads.map((h) => import_bs58check.default.encode(uint8ArrayFromHexString(h)));
var decodeHeads = (heads) => heads.map((h) => uint8ArrayToHexString(import_bs58check.default.decode(h)));
var interpretAsDocumentId = (id) => {
  if (id instanceof Uint8Array)
    return binaryToDocumentId(id);
  if (isValidAutomergeUrl(id))
    return parseAutomergeUrl(id).documentId;
  if (isValidDocumentId(id))
    return id;
  if (isValidUuid(id)) {
    console.warn("Future versions will not support UUIDs as document IDs; use Automerge URLs instead.");
    const binaryDocumentID = parse_default(id);
    return binaryToDocumentId(binaryDocumentID);
  }
  throw new Error(`Invalid AutomergeUrl: '${id}'`);
};

// node_modules/.deno/cbor-x@1.6.4/node_modules/cbor-x/decode.js
var decoder;
try {
  decoder = new TextDecoder();
} catch (error) {
}
var src;
var srcEnd;
var position = 0;
var EMPTY_ARRAY = [];
var LEGACY_RECORD_INLINE_ID = 105;
var RECORD_DEFINITIONS_ID = 57342;
var RECORD_INLINE_ID = 57343;
var BUNDLED_STRINGS_ID = 57337;
var PACKED_REFERENCE_TAG_ID = 6;
var STOP_CODE = {};
var maxArraySize = 11281e4;
var maxMapSize = 1681e4;
var strings = EMPTY_ARRAY;
var stringPosition = 0;
var currentDecoder = {};
var currentStructures;
var srcString;
var srcStringStart = 0;
var srcStringEnd = 0;
var bundledStrings;
var referenceMap;
var currentExtensions = [];
var currentExtensionRanges = [];
var packedValues;
var dataView;
var restoreMapsAsObject;
var defaultOptions = {
  useRecords: false,
  mapsAsObjects: true
};
var sequentialMode = false;
var inlineObjectReadThreshold = 2;
try {
  new Function("");
} catch (error) {
  inlineObjectReadThreshold = Infinity;
}
var Decoder = class _Decoder {
  constructor(options) {
    if (options) {
      if ((options.keyMap || options._keyMap) && !options.useRecords) {
        options.useRecords = false;
        options.mapsAsObjects = true;
      }
      if (options.useRecords === false && options.mapsAsObjects === void 0)
        options.mapsAsObjects = true;
      if (options.getStructures)
        options.getShared = options.getStructures;
      if (options.getShared && !options.structures)
        (options.structures = []).uninitialized = true;
      if (options.keyMap) {
        this.mapKey = /* @__PURE__ */ new Map();
        for (let [k, v] of Object.entries(options.keyMap)) this.mapKey.set(v, k);
      }
    }
    Object.assign(this, options);
  }
  /*
  decodeKey(key) {
  	return this.keyMap
  		? Object.keys(this.keyMap)[Object.values(this.keyMap).indexOf(key)] || key
  		: key
  }
  */
  decodeKey(key) {
    return this.keyMap ? this.mapKey.get(key) || key : key;
  }
  encodeKey(key) {
    return this.keyMap && this.keyMap.hasOwnProperty(key) ? this.keyMap[key] : key;
  }
  encodeKeys(rec) {
    if (!this._keyMap) return rec;
    let map = /* @__PURE__ */ new Map();
    for (let [k, v] of Object.entries(rec)) map.set(this._keyMap.hasOwnProperty(k) ? this._keyMap[k] : k, v);
    return map;
  }
  decodeKeys(map) {
    if (!this._keyMap || map.constructor.name != "Map") return map;
    if (!this._mapKey) {
      this._mapKey = /* @__PURE__ */ new Map();
      for (let [k, v] of Object.entries(this._keyMap)) this._mapKey.set(v, k);
    }
    let res = {};
    map.forEach((v, k) => res[safeKey(this._mapKey.has(k) ? this._mapKey.get(k) : k)] = v);
    return res;
  }
  mapDecode(source, end) {
    let res = this.decode(source);
    if (this._keyMap) {
      switch (res.constructor.name) {
        case "Array":
          return res.map((r) => this.decodeKeys(r));
      }
    }
    return res;
  }
  decode(source, end) {
    if (src) {
      return saveState(() => {
        clearSource();
        return this ? this.decode(source, end) : _Decoder.prototype.decode.call(defaultOptions, source, end);
      });
    }
    srcEnd = end > -1 ? end : source.length;
    position = 0;
    stringPosition = 0;
    srcStringEnd = 0;
    srcString = null;
    strings = EMPTY_ARRAY;
    bundledStrings = null;
    src = source;
    try {
      dataView = source.dataView || (source.dataView = new DataView(source.buffer, source.byteOffset, source.byteLength));
    } catch (error) {
      src = null;
      if (source instanceof Uint8Array)
        throw error;
      throw new Error("Source must be a Uint8Array or Buffer but was a " + (source && typeof source == "object" ? source.constructor.name : typeof source));
    }
    if (this instanceof _Decoder) {
      currentDecoder = this;
      packedValues = this.sharedValues && (this.pack ? new Array(this.maxPrivatePackedValues || 16).concat(this.sharedValues) : this.sharedValues);
      if (this.structures) {
        currentStructures = this.structures;
        return checkedRead();
      } else if (!currentStructures || currentStructures.length > 0) {
        currentStructures = [];
      }
    } else {
      currentDecoder = defaultOptions;
      if (!currentStructures || currentStructures.length > 0)
        currentStructures = [];
      packedValues = null;
    }
    return checkedRead();
  }
  decodeMultiple(source, forEach) {
    let values, lastPosition = 0;
    try {
      let size = source.length;
      sequentialMode = true;
      let value = this ? this.decode(source, size) : defaultDecoder.decode(source, size);
      if (forEach) {
        if (forEach(value) === false) {
          return;
        }
        while (position < size) {
          lastPosition = position;
          if (forEach(checkedRead()) === false) {
            return;
          }
        }
      } else {
        values = [value];
        while (position < size) {
          lastPosition = position;
          values.push(checkedRead());
        }
        return values;
      }
    } catch (error) {
      error.lastPosition = lastPosition;
      error.values = values;
      throw error;
    } finally {
      sequentialMode = false;
      clearSource();
    }
  }
};
function checkedRead() {
  try {
    let result = read();
    if (bundledStrings) {
      if (position >= bundledStrings.postBundlePosition) {
        let error = new Error("Unexpected bundle position");
        error.incomplete = true;
        throw error;
      }
      position = bundledStrings.postBundlePosition;
      bundledStrings = null;
    }
    if (position == srcEnd) {
      currentStructures = null;
      src = null;
      if (referenceMap)
        referenceMap = null;
    } else if (position > srcEnd) {
      let error = new Error("Unexpected end of CBOR data");
      error.incomplete = true;
      throw error;
    } else if (!sequentialMode) {
      throw new Error("Data read, but end of buffer not reached");
    }
    return result;
  } catch (error) {
    clearSource();
    if (error instanceof RangeError || error.message.startsWith("Unexpected end of buffer")) {
      error.incomplete = true;
    }
    throw error;
  }
}
function read() {
  let token = src[position++];
  let majorType = token >> 5;
  token = token & 31;
  if (token > 23) {
    switch (token) {
      case 24:
        token = src[position++];
        break;
      case 25:
        if (majorType == 7) {
          return getFloat16();
        }
        token = dataView.getUint16(position);
        position += 2;
        break;
      case 26:
        if (majorType == 7) {
          let value = dataView.getFloat32(position);
          if (currentDecoder.useFloat32 > 2) {
            let multiplier = mult10[(src[position] & 127) << 1 | src[position + 1] >> 7];
            position += 4;
            return (multiplier * value + (value > 0 ? 0.5 : -0.5) >> 0) / multiplier;
          }
          position += 4;
          return value;
        }
        token = dataView.getUint32(position);
        position += 4;
        if (majorType === 1) return -1 - token;
        break;
      case 27:
        if (majorType == 7) {
          let value = dataView.getFloat64(position);
          position += 8;
          return value;
        }
        if (majorType > 1) {
          if (dataView.getUint32(position) > 0)
            throw new Error("JavaScript does not support arrays, maps, or strings with length over 4294967295");
          token = dataView.getUint32(position + 4);
        } else if (currentDecoder.int64AsNumber) {
          token = dataView.getUint32(position) * 4294967296;
          token += dataView.getUint32(position + 4);
        } else token = dataView.getBigUint64(position);
        position += 8;
        break;
      case 31:
        switch (majorType) {
          case 2:
          // byte string
          case 3:
            throw new Error("Indefinite length not supported for byte or text strings");
          case 4:
            let array = [];
            let value, i = 0;
            while ((value = read()) != STOP_CODE) {
              if (i >= maxArraySize) throw new Error(`Array length exceeds ${maxArraySize}`);
              array[i++] = value;
            }
            return majorType == 4 ? array : majorType == 3 ? array.join("") : Buffer.concat(array);
          case 5:
            let key;
            if (currentDecoder.mapsAsObjects) {
              let object = {};
              let i2 = 0;
              if (currentDecoder.keyMap) {
                while ((key = read()) != STOP_CODE) {
                  if (i2++ >= maxMapSize) throw new Error(`Property count exceeds ${maxMapSize}`);
                  object[safeKey(currentDecoder.decodeKey(key))] = read();
                }
              } else {
                while ((key = read()) != STOP_CODE) {
                  if (i2++ >= maxMapSize) throw new Error(`Property count exceeds ${maxMapSize}`);
                  object[safeKey(key)] = read();
                }
              }
              return object;
            } else {
              if (restoreMapsAsObject) {
                currentDecoder.mapsAsObjects = true;
                restoreMapsAsObject = false;
              }
              let map = /* @__PURE__ */ new Map();
              if (currentDecoder.keyMap) {
                let i2 = 0;
                while ((key = read()) != STOP_CODE) {
                  if (i2++ >= maxMapSize) {
                    throw new Error(`Map size exceeds ${maxMapSize}`);
                  }
                  map.set(currentDecoder.decodeKey(key), read());
                }
              } else {
                let i2 = 0;
                while ((key = read()) != STOP_CODE) {
                  if (i2++ >= maxMapSize) {
                    throw new Error(`Map size exceeds ${maxMapSize}`);
                  }
                  map.set(key, read());
                }
              }
              return map;
            }
          case 7:
            return STOP_CODE;
          default:
            throw new Error("Invalid major type for indefinite length " + majorType);
        }
      default:
        throw new Error("Unknown token " + token);
    }
  }
  switch (majorType) {
    case 0:
      return token;
    case 1:
      return ~token;
    case 2:
      return readBin(token);
    case 3:
      if (srcStringEnd >= position) {
        return srcString.slice(position - srcStringStart, (position += token) - srcStringStart);
      }
      if (srcStringEnd == 0 && srcEnd < 140 && token < 32) {
        let string = token < 16 ? shortStringInJS(token) : longStringInJS(token);
        if (string != null)
          return string;
      }
      return readFixedString(token);
    case 4:
      if (token >= maxArraySize) throw new Error(`Array length exceeds ${maxArraySize}`);
      let array = new Array(token);
      for (let i = 0; i < token; i++) array[i] = read();
      return array;
    case 5:
      if (token >= maxMapSize) throw new Error(`Map size exceeds ${maxArraySize}`);
      if (currentDecoder.mapsAsObjects) {
        let object = {};
        if (currentDecoder.keyMap) for (let i = 0; i < token; i++) object[safeKey(currentDecoder.decodeKey(read()))] = read();
        else for (let i = 0; i < token; i++) object[safeKey(read())] = read();
        return object;
      } else {
        if (restoreMapsAsObject) {
          currentDecoder.mapsAsObjects = true;
          restoreMapsAsObject = false;
        }
        let map = /* @__PURE__ */ new Map();
        if (currentDecoder.keyMap) for (let i = 0; i < token; i++) map.set(currentDecoder.decodeKey(read()), read());
        else for (let i = 0; i < token; i++) map.set(read(), read());
        return map;
      }
    case 6:
      if (token >= BUNDLED_STRINGS_ID) {
        let structure = currentStructures[token & 8191];
        if (structure) {
          if (!structure.read) structure.read = createStructureReader(structure);
          return structure.read();
        }
        if (token < 65536) {
          if (token == RECORD_INLINE_ID) {
            let length = readJustLength();
            let id = read();
            let structure2 = read();
            recordDefinition(id, structure2);
            let object = {};
            if (currentDecoder.keyMap) for (let i = 2; i < length; i++) {
              let key = currentDecoder.decodeKey(structure2[i - 2]);
              object[safeKey(key)] = read();
            }
            else for (let i = 2; i < length; i++) {
              let key = structure2[i - 2];
              object[safeKey(key)] = read();
            }
            return object;
          } else if (token == RECORD_DEFINITIONS_ID) {
            let length = readJustLength();
            let id = read();
            for (let i = 2; i < length; i++) {
              recordDefinition(id++, read());
            }
            return read();
          } else if (token == BUNDLED_STRINGS_ID) {
            return readBundleExt();
          }
          if (currentDecoder.getShared) {
            loadShared();
            structure = currentStructures[token & 8191];
            if (structure) {
              if (!structure.read)
                structure.read = createStructureReader(structure);
              return structure.read();
            }
          }
        }
      }
      let extension = currentExtensions[token];
      if (extension) {
        if (extension.handlesRead)
          return extension(read);
        else
          return extension(read());
      } else {
        let input = read();
        for (let i = 0; i < currentExtensionRanges.length; i++) {
          let value = currentExtensionRanges[i](token, input);
          if (value !== void 0)
            return value;
        }
        return new Tag(input, token);
      }
    case 7:
      switch (token) {
        case 20:
          return false;
        case 21:
          return true;
        case 22:
          return null;
        case 23:
          return;
        // undefined
        case 31:
        default:
          let packedValue = (packedValues || getPackedValues())[token];
          if (packedValue !== void 0)
            return packedValue;
          throw new Error("Unknown token " + token);
      }
    default:
      if (isNaN(token)) {
        let error = new Error("Unexpected end of CBOR data");
        error.incomplete = true;
        throw error;
      }
      throw new Error("Unknown CBOR token " + token);
  }
}
var validName = /^[a-zA-Z_$][a-zA-Z\d_$]*$/;
function createStructureReader(structure) {
  if (!structure) throw new Error("Structure is required in record definition");
  function readObject() {
    let length = src[position++];
    length = length & 31;
    if (length > 23) {
      switch (length) {
        case 24:
          length = src[position++];
          break;
        case 25:
          length = dataView.getUint16(position);
          position += 2;
          break;
        case 26:
          length = dataView.getUint32(position);
          position += 4;
          break;
        default:
          throw new Error("Expected array header, but got " + src[position - 1]);
      }
    }
    let compiledReader = this.compiledReader;
    while (compiledReader) {
      if (compiledReader.propertyCount === length)
        return compiledReader(read);
      compiledReader = compiledReader.next;
    }
    if (this.slowReads++ >= inlineObjectReadThreshold) {
      let array = this.length == length ? this : this.slice(0, length);
      compiledReader = currentDecoder.keyMap ? new Function("r", "return {" + array.map((k) => currentDecoder.decodeKey(k)).map((k) => validName.test(k) ? safeKey(k) + ":r()" : "[" + JSON.stringify(k) + "]:r()").join(",") + "}") : new Function("r", "return {" + array.map((key) => validName.test(key) ? safeKey(key) + ":r()" : "[" + JSON.stringify(key) + "]:r()").join(",") + "}");
      if (this.compiledReader)
        compiledReader.next = this.compiledReader;
      compiledReader.propertyCount = length;
      this.compiledReader = compiledReader;
      return compiledReader(read);
    }
    let object = {};
    if (currentDecoder.keyMap) for (let i = 0; i < length; i++) object[safeKey(currentDecoder.decodeKey(this[i]))] = read();
    else for (let i = 0; i < length; i++) {
      object[safeKey(this[i])] = read();
    }
    return object;
  }
  structure.slowReads = 0;
  return readObject;
}
function safeKey(key) {
  if (typeof key === "string") return key === "__proto__" ? "__proto_" : key;
  if (typeof key === "number" || typeof key === "boolean" || typeof key === "bigint") return key.toString();
  if (key == null) return key + "";
  throw new Error("Invalid property name type " + typeof key);
}
var readFixedString = readStringJS;
function readStringJS(length) {
  let result;
  if (length < 16) {
    if (result = shortStringInJS(length))
      return result;
  }
  if (length > 64 && decoder)
    return decoder.decode(src.subarray(position, position += length));
  const end = position + length;
  const units = [];
  result = "";
  while (position < end) {
    const byte1 = src[position++];
    if ((byte1 & 128) === 0) {
      units.push(byte1);
    } else if ((byte1 & 224) === 192) {
      const byte2 = src[position++] & 63;
      const codePoint = (byte1 & 31) << 6 | byte2;
      if (codePoint < 128) {
        units.push(65533);
      } else {
        units.push(codePoint);
      }
    } else if ((byte1 & 240) === 224) {
      const byte2 = src[position++] & 63;
      const byte3 = src[position++] & 63;
      const codePoint = (byte1 & 31) << 12 | byte2 << 6 | byte3;
      if (codePoint < 2048 || codePoint >= 55296 && codePoint <= 57343) {
        units.push(65533);
      } else {
        units.push(codePoint);
      }
    } else if ((byte1 & 248) === 240) {
      const byte2 = src[position++] & 63;
      const byte3 = src[position++] & 63;
      const byte4 = src[position++] & 63;
      let unit = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4;
      if (unit < 65536 || unit > 1114111) {
        units.push(65533);
      } else if (unit > 65535) {
        unit -= 65536;
        units.push(unit >>> 10 & 1023 | 55296);
        unit = 56320 | unit & 1023;
        units.push(unit);
      } else {
        units.push(unit);
      }
    } else {
      units.push(65533);
    }
    if (units.length >= 4096) {
      result += fromCharCode.apply(String, units);
      units.length = 0;
    }
  }
  if (units.length > 0) {
    result += fromCharCode.apply(String, units);
  }
  return result;
}
var fromCharCode = String.fromCharCode;
function longStringInJS(length) {
  let start = position;
  let bytes = new Array(length);
  for (let i = 0; i < length; i++) {
    const byte = src[position++];
    if ((byte & 128) > 0) {
      position = start;
      return;
    }
    bytes[i] = byte;
  }
  return fromCharCode.apply(String, bytes);
}
function shortStringInJS(length) {
  if (length < 4) {
    if (length < 2) {
      if (length === 0)
        return "";
      else {
        let a = src[position++];
        if ((a & 128) > 1) {
          position -= 1;
          return;
        }
        return fromCharCode(a);
      }
    } else {
      let a = src[position++];
      let b = src[position++];
      if ((a & 128) > 0 || (b & 128) > 0) {
        position -= 2;
        return;
      }
      if (length < 3)
        return fromCharCode(a, b);
      let c = src[position++];
      if ((c & 128) > 0) {
        position -= 3;
        return;
      }
      return fromCharCode(a, b, c);
    }
  } else {
    let a = src[position++];
    let b = src[position++];
    let c = src[position++];
    let d = src[position++];
    if ((a & 128) > 0 || (b & 128) > 0 || (c & 128) > 0 || (d & 128) > 0) {
      position -= 4;
      return;
    }
    if (length < 6) {
      if (length === 4)
        return fromCharCode(a, b, c, d);
      else {
        let e = src[position++];
        if ((e & 128) > 0) {
          position -= 5;
          return;
        }
        return fromCharCode(a, b, c, d, e);
      }
    } else if (length < 8) {
      let e = src[position++];
      let f = src[position++];
      if ((e & 128) > 0 || (f & 128) > 0) {
        position -= 6;
        return;
      }
      if (length < 7)
        return fromCharCode(a, b, c, d, e, f);
      let g = src[position++];
      if ((g & 128) > 0) {
        position -= 7;
        return;
      }
      return fromCharCode(a, b, c, d, e, f, g);
    } else {
      let e = src[position++];
      let f = src[position++];
      let g = src[position++];
      let h = src[position++];
      if ((e & 128) > 0 || (f & 128) > 0 || (g & 128) > 0 || (h & 128) > 0) {
        position -= 8;
        return;
      }
      if (length < 10) {
        if (length === 8)
          return fromCharCode(a, b, c, d, e, f, g, h);
        else {
          let i = src[position++];
          if ((i & 128) > 0) {
            position -= 9;
            return;
          }
          return fromCharCode(a, b, c, d, e, f, g, h, i);
        }
      } else if (length < 12) {
        let i = src[position++];
        let j = src[position++];
        if ((i & 128) > 0 || (j & 128) > 0) {
          position -= 10;
          return;
        }
        if (length < 11)
          return fromCharCode(a, b, c, d, e, f, g, h, i, j);
        let k = src[position++];
        if ((k & 128) > 0) {
          position -= 11;
          return;
        }
        return fromCharCode(a, b, c, d, e, f, g, h, i, j, k);
      } else {
        let i = src[position++];
        let j = src[position++];
        let k = src[position++];
        let l = src[position++];
        if ((i & 128) > 0 || (j & 128) > 0 || (k & 128) > 0 || (l & 128) > 0) {
          position -= 12;
          return;
        }
        if (length < 14) {
          if (length === 12)
            return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l);
          else {
            let m = src[position++];
            if ((m & 128) > 0) {
              position -= 13;
              return;
            }
            return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m);
          }
        } else {
          let m = src[position++];
          let n = src[position++];
          if ((m & 128) > 0 || (n & 128) > 0) {
            position -= 14;
            return;
          }
          if (length < 15)
            return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
          let o = src[position++];
          if ((o & 128) > 0) {
            position -= 15;
            return;
          }
          return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
        }
      }
    }
  }
}
function readBin(length) {
  return currentDecoder.copyBuffers ? (
    // specifically use the copying slice (not the node one)
    Uint8Array.prototype.slice.call(src, position, position += length)
  ) : src.subarray(position, position += length);
}
var f32Array = new Float32Array(1);
var u8Array = new Uint8Array(f32Array.buffer, 0, 4);
function getFloat16() {
  let byte0 = src[position++];
  let byte1 = src[position++];
  let exponent = (byte0 & 127) >> 2;
  if (exponent === 31) {
    if (byte1 || byte0 & 3)
      return NaN;
    return byte0 & 128 ? -Infinity : Infinity;
  }
  if (exponent === 0) {
    let abs = ((byte0 & 3) << 8 | byte1) / (1 << 24);
    return byte0 & 128 ? -abs : abs;
  }
  u8Array[3] = byte0 & 128 | // sign bit
  (exponent >> 1) + 56;
  u8Array[2] = (byte0 & 7) << 5 | // last exponent bit and first two mantissa bits
  byte1 >> 3;
  u8Array[1] = byte1 << 5;
  u8Array[0] = 0;
  return f32Array[0];
}
var keyCache = new Array(4096);
var Tag = class {
  constructor(value, tag) {
    this.value = value;
    this.tag = tag;
  }
};
currentExtensions[0] = (dateString) => {
  return new Date(dateString);
};
currentExtensions[1] = (epochSec) => {
  return new Date(Math.round(epochSec * 1e3));
};
currentExtensions[2] = (buffer) => {
  let value = BigInt(0);
  for (let i = 0, l = buffer.byteLength; i < l; i++) {
    value = BigInt(buffer[i]) + (value << BigInt(8));
  }
  return value;
};
currentExtensions[3] = (buffer) => {
  return BigInt(-1) - currentExtensions[2](buffer);
};
currentExtensions[4] = (fraction) => {
  return +(fraction[1] + "e" + fraction[0]);
};
currentExtensions[5] = (fraction) => {
  return fraction[1] * Math.exp(fraction[0] * Math.log(2));
};
var recordDefinition = (id, structure) => {
  id = id - 57344;
  let existingStructure = currentStructures[id];
  if (existingStructure && existingStructure.isShared) {
    (currentStructures.restoreStructures || (currentStructures.restoreStructures = []))[id] = existingStructure;
  }
  currentStructures[id] = structure;
  structure.read = createStructureReader(structure);
};
currentExtensions[LEGACY_RECORD_INLINE_ID] = (data) => {
  let length = data.length;
  let structure = data[1];
  recordDefinition(data[0], structure);
  let object = {};
  for (let i = 2; i < length; i++) {
    let key = structure[i - 2];
    object[safeKey(key)] = data[i];
  }
  return object;
};
currentExtensions[14] = (value) => {
  if (bundledStrings)
    return bundledStrings[0].slice(bundledStrings.position0, bundledStrings.position0 += value);
  return new Tag(value, 14);
};
currentExtensions[15] = (value) => {
  if (bundledStrings)
    return bundledStrings[1].slice(bundledStrings.position1, bundledStrings.position1 += value);
  return new Tag(value, 15);
};
var glbl = { Error, RegExp };
currentExtensions[27] = (data) => {
  return (glbl[data[0]] || Error)(data[1], data[2]);
};
var packedTable = (read2) => {
  if (src[position++] != 132) {
    let error = new Error("Packed values structure must be followed by a 4 element array");
    if (src.length < position)
      error.incomplete = true;
    throw error;
  }
  let newPackedValues = read2();
  if (!newPackedValues || !newPackedValues.length) {
    let error = new Error("Packed values structure must be followed by a 4 element array");
    error.incomplete = true;
    throw error;
  }
  packedValues = packedValues ? newPackedValues.concat(packedValues.slice(newPackedValues.length)) : newPackedValues;
  packedValues.prefixes = read2();
  packedValues.suffixes = read2();
  return read2();
};
packedTable.handlesRead = true;
currentExtensions[51] = packedTable;
currentExtensions[PACKED_REFERENCE_TAG_ID] = (data) => {
  if (!packedValues) {
    if (currentDecoder.getShared)
      loadShared();
    else
      return new Tag(data, PACKED_REFERENCE_TAG_ID);
  }
  if (typeof data == "number")
    return packedValues[16 + (data >= 0 ? 2 * data : -2 * data - 1)];
  let error = new Error("No support for non-integer packed references yet");
  if (data === void 0)
    error.incomplete = true;
  throw error;
};
currentExtensions[28] = (read2) => {
  if (!referenceMap) {
    referenceMap = /* @__PURE__ */ new Map();
    referenceMap.id = 0;
  }
  let id = referenceMap.id++;
  let startingPosition = position;
  let token = src[position];
  let target2;
  if (token >> 5 == 4)
    target2 = [];
  else
    target2 = {};
  let refEntry = { target: target2 };
  referenceMap.set(id, refEntry);
  let targetProperties = read2();
  if (refEntry.used) {
    if (Object.getPrototypeOf(target2) !== Object.getPrototypeOf(targetProperties)) {
      position = startingPosition;
      target2 = targetProperties;
      referenceMap.set(id, { target: target2 });
      targetProperties = read2();
    }
    return Object.assign(target2, targetProperties);
  }
  refEntry.target = targetProperties;
  return targetProperties;
};
currentExtensions[28].handlesRead = true;
currentExtensions[29] = (id) => {
  let refEntry = referenceMap.get(id);
  refEntry.used = true;
  return refEntry.target;
};
currentExtensions[258] = (array) => new Set(array);
(currentExtensions[259] = (read2) => {
  if (currentDecoder.mapsAsObjects) {
    currentDecoder.mapsAsObjects = false;
    restoreMapsAsObject = true;
  }
  return read2();
}).handlesRead = true;
function combine(a, b) {
  if (typeof a === "string")
    return a + b;
  if (a instanceof Array)
    return a.concat(b);
  return Object.assign({}, a, b);
}
function getPackedValues() {
  if (!packedValues) {
    if (currentDecoder.getShared)
      loadShared();
    else
      throw new Error("No packed values available");
  }
  return packedValues;
}
var SHARED_DATA_TAG_ID = 1399353956;
currentExtensionRanges.push((tag, input) => {
  if (tag >= 225 && tag <= 255)
    return combine(getPackedValues().prefixes[tag - 224], input);
  if (tag >= 28704 && tag <= 32767)
    return combine(getPackedValues().prefixes[tag - 28672], input);
  if (tag >= 1879052288 && tag <= 2147483647)
    return combine(getPackedValues().prefixes[tag - 1879048192], input);
  if (tag >= 216 && tag <= 223)
    return combine(input, getPackedValues().suffixes[tag - 216]);
  if (tag >= 27647 && tag <= 28671)
    return combine(input, getPackedValues().suffixes[tag - 27639]);
  if (tag >= 1811940352 && tag <= 1879048191)
    return combine(input, getPackedValues().suffixes[tag - 1811939328]);
  if (tag == SHARED_DATA_TAG_ID) {
    return {
      packedValues,
      structures: currentStructures.slice(0),
      version: input
    };
  }
  if (tag == 55799)
    return input;
});
var isLittleEndianMachine = new Uint8Array(new Uint16Array([1]).buffer)[0] == 1;
var typedArrays = [
  Uint8Array,
  Uint8ClampedArray,
  Uint16Array,
  Uint32Array,
  typeof BigUint64Array == "undefined" ? { name: "BigUint64Array" } : BigUint64Array,
  Int8Array,
  Int16Array,
  Int32Array,
  typeof BigInt64Array == "undefined" ? { name: "BigInt64Array" } : BigInt64Array,
  Float32Array,
  Float64Array
];
var typedArrayTags = [64, 68, 69, 70, 71, 72, 77, 78, 79, 85, 86];
for (let i = 0; i < typedArrays.length; i++) {
  registerTypedArray(typedArrays[i], typedArrayTags[i]);
}
function registerTypedArray(TypedArray, tag) {
  let dvMethod = "get" + TypedArray.name.slice(0, -5);
  let bytesPerElement;
  if (typeof TypedArray === "function")
    bytesPerElement = TypedArray.BYTES_PER_ELEMENT;
  else
    TypedArray = null;
  for (let littleEndian = 0; littleEndian < 2; littleEndian++) {
    if (!littleEndian && bytesPerElement == 1)
      continue;
    let sizeShift = bytesPerElement == 2 ? 1 : bytesPerElement == 4 ? 2 : bytesPerElement == 8 ? 3 : 0;
    currentExtensions[littleEndian ? tag : tag - 4] = bytesPerElement == 1 || littleEndian == isLittleEndianMachine ? (buffer) => {
      if (!TypedArray)
        throw new Error("Could not find typed array for code " + tag);
      if (!currentDecoder.copyBuffers) {
        if (bytesPerElement === 1 || bytesPerElement === 2 && !(buffer.byteOffset & 1) || bytesPerElement === 4 && !(buffer.byteOffset & 3) || bytesPerElement === 8 && !(buffer.byteOffset & 7))
          return new TypedArray(buffer.buffer, buffer.byteOffset, buffer.byteLength >> sizeShift);
      }
      return new TypedArray(Uint8Array.prototype.slice.call(buffer, 0).buffer);
    } : (buffer) => {
      if (!TypedArray)
        throw new Error("Could not find typed array for code " + tag);
      let dv = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      let elements = buffer.length >> sizeShift;
      let ta = new TypedArray(elements);
      let method = dv[dvMethod];
      for (let i = 0; i < elements; i++) {
        ta[i] = method.call(dv, i << sizeShift, littleEndian);
      }
      return ta;
    };
  }
}
function readBundleExt() {
  let length = readJustLength();
  let bundlePosition = position + read();
  for (let i = 2; i < length; i++) {
    let bundleLength = readJustLength();
    position += bundleLength;
  }
  let dataPosition = position;
  position = bundlePosition;
  bundledStrings = [readStringJS(readJustLength()), readStringJS(readJustLength())];
  bundledStrings.position0 = 0;
  bundledStrings.position1 = 0;
  bundledStrings.postBundlePosition = position;
  position = dataPosition;
  return read();
}
function readJustLength() {
  let token = src[position++] & 31;
  if (token > 23) {
    switch (token) {
      case 24:
        token = src[position++];
        break;
      case 25:
        token = dataView.getUint16(position);
        position += 2;
        break;
      case 26:
        token = dataView.getUint32(position);
        position += 4;
        break;
    }
  }
  return token;
}
function loadShared() {
  if (currentDecoder.getShared) {
    let sharedData = saveState(() => {
      src = null;
      return currentDecoder.getShared();
    }) || {};
    let updatedStructures = sharedData.structures || [];
    currentDecoder.sharedVersion = sharedData.version;
    packedValues = currentDecoder.sharedValues = sharedData.packedValues;
    if (currentStructures === true)
      currentDecoder.structures = currentStructures = updatedStructures;
    else
      currentStructures.splice.apply(currentStructures, [0, updatedStructures.length].concat(updatedStructures));
  }
}
function saveState(callback) {
  let savedSrcEnd = srcEnd;
  let savedPosition = position;
  let savedStringPosition = stringPosition;
  let savedSrcStringStart = srcStringStart;
  let savedSrcStringEnd = srcStringEnd;
  let savedSrcString = srcString;
  let savedStrings = strings;
  let savedReferenceMap = referenceMap;
  let savedBundledStrings = bundledStrings;
  let savedSrc = new Uint8Array(src.slice(0, srcEnd));
  let savedStructures = currentStructures;
  let savedDecoder = currentDecoder;
  let savedSequentialMode = sequentialMode;
  let value = callback();
  srcEnd = savedSrcEnd;
  position = savedPosition;
  stringPosition = savedStringPosition;
  srcStringStart = savedSrcStringStart;
  srcStringEnd = savedSrcStringEnd;
  srcString = savedSrcString;
  strings = savedStrings;
  referenceMap = savedReferenceMap;
  bundledStrings = savedBundledStrings;
  src = savedSrc;
  sequentialMode = savedSequentialMode;
  currentStructures = savedStructures;
  currentDecoder = savedDecoder;
  dataView = new DataView(src.buffer, src.byteOffset, src.byteLength);
  return value;
}
function clearSource() {
  src = null;
  referenceMap = null;
  currentStructures = null;
}
var mult10 = new Array(147);
for (let i = 0; i < 256; i++) {
  mult10[i] = +("1e" + Math.floor(45.15 - i * 0.30103));
}
var defaultDecoder = new Decoder({ useRecords: false });
var decode = defaultDecoder.decode;
var decodeMultiple = defaultDecoder.decodeMultiple;
var FLOAT32_OPTIONS = {
  NEVER: 0,
  ALWAYS: 1,
  DECIMAL_ROUND: 3,
  DECIMAL_FIT: 4
};

// node_modules/.deno/cbor-x@1.6.4/node_modules/cbor-x/encode.js
var textEncoder;
try {
  textEncoder = new TextEncoder();
} catch (error) {
}
var extensions;
var extensionClasses;
var Buffer2 = typeof globalThis === "object" && globalThis.Buffer;
var hasNodeBuffer = typeof Buffer2 !== "undefined";
var ByteArrayAllocate = hasNodeBuffer ? Buffer2.allocUnsafeSlow : Uint8Array;
var ByteArray = hasNodeBuffer ? Buffer2 : Uint8Array;
var MAX_STRUCTURES = 256;
var MAX_BUFFER_SIZE = hasNodeBuffer ? 4294967296 : 2144337920;
var throwOnIterable;
var target;
var targetView;
var position2 = 0;
var safeEnd;
var bundledStrings2 = null;
var MAX_BUNDLE_SIZE = 61440;
var hasNonLatin = /[\u0080-\uFFFF]/;
var RECORD_SYMBOL = /* @__PURE__ */ Symbol("record-id");
var Encoder = class extends Decoder {
  constructor(options) {
    super(options);
    this.offset = 0;
    let typeBuffer;
    let start;
    let sharedStructures;
    let hasSharedUpdate;
    let structures;
    let referenceMap2;
    options = options || {};
    let encodeUtf8 = ByteArray.prototype.utf8Write ? function(string, position3) {
      return target.utf8Write(string, position3, target.byteLength - position3);
    } : textEncoder && textEncoder.encodeInto ? function(string, position3) {
      return textEncoder.encodeInto(string, target.subarray(position3)).written;
    } : false;
    let encoder = this;
    let hasSharedStructures = options.structures || options.saveStructures;
    let maxSharedStructures = options.maxSharedStructures;
    if (maxSharedStructures == null)
      maxSharedStructures = hasSharedStructures ? 128 : 0;
    if (maxSharedStructures > 8190)
      throw new Error("Maximum maxSharedStructure is 8190");
    let isSequential = options.sequential;
    if (isSequential) {
      maxSharedStructures = 0;
    }
    if (!this.structures)
      this.structures = [];
    if (this.saveStructures)
      this.saveShared = this.saveStructures;
    let samplingPackedValues, packedObjectMap2, sharedValues = options.sharedValues;
    let sharedPackedObjectMap2;
    if (sharedValues) {
      sharedPackedObjectMap2 = /* @__PURE__ */ Object.create(null);
      for (let i = 0, l = sharedValues.length; i < l; i++) {
        sharedPackedObjectMap2[sharedValues[i]] = i;
      }
    }
    let recordIdsToRemove = [];
    let transitionsCount = 0;
    let serializationsSinceTransitionRebuild = 0;
    this.mapEncode = function(value, encodeOptions) {
      if (this._keyMap && !this._mapped) {
        switch (value.constructor.name) {
          case "Array":
            value = value.map((r) => this.encodeKeys(r));
            break;
        }
      }
      return this.encode(value, encodeOptions);
    };
    this.encode = function(value, encodeOptions) {
      if (!target) {
        target = new ByteArrayAllocate(8192);
        targetView = new DataView(target.buffer, 0, 8192);
        position2 = 0;
      }
      safeEnd = target.length - 10;
      if (safeEnd - position2 < 2048) {
        target = new ByteArrayAllocate(target.length);
        targetView = new DataView(target.buffer, 0, target.length);
        safeEnd = target.length - 10;
        position2 = 0;
      } else if (encodeOptions === REUSE_BUFFER_MODE)
        position2 = position2 + 7 & 2147483640;
      start = position2;
      if (encoder.useSelfDescribedHeader) {
        targetView.setUint32(position2, 3654940416);
        position2 += 3;
      }
      referenceMap2 = encoder.structuredClone ? /* @__PURE__ */ new Map() : null;
      if (encoder.bundleStrings && typeof value !== "string") {
        bundledStrings2 = [];
        bundledStrings2.size = Infinity;
      } else
        bundledStrings2 = null;
      sharedStructures = encoder.structures;
      if (sharedStructures) {
        if (sharedStructures.uninitialized) {
          let sharedData = encoder.getShared() || {};
          encoder.structures = sharedStructures = sharedData.structures || [];
          encoder.sharedVersion = sharedData.version;
          let sharedValues2 = encoder.sharedValues = sharedData.packedValues;
          if (sharedValues2) {
            sharedPackedObjectMap2 = {};
            for (let i = 0, l = sharedValues2.length; i < l; i++)
              sharedPackedObjectMap2[sharedValues2[i]] = i;
          }
        }
        let sharedStructuresLength = sharedStructures.length;
        if (sharedStructuresLength > maxSharedStructures && !isSequential)
          sharedStructuresLength = maxSharedStructures;
        if (!sharedStructures.transitions) {
          sharedStructures.transitions = /* @__PURE__ */ Object.create(null);
          for (let i = 0; i < sharedStructuresLength; i++) {
            let keys = sharedStructures[i];
            if (!keys)
              continue;
            let nextTransition, transition2 = sharedStructures.transitions;
            for (let j = 0, l = keys.length; j < l; j++) {
              if (transition2[RECORD_SYMBOL] === void 0)
                transition2[RECORD_SYMBOL] = i;
              let key = keys[j];
              nextTransition = transition2[key];
              if (!nextTransition) {
                nextTransition = transition2[key] = /* @__PURE__ */ Object.create(null);
              }
              transition2 = nextTransition;
            }
            transition2[RECORD_SYMBOL] = i | 1048576;
          }
        }
        if (!isSequential)
          sharedStructures.nextId = sharedStructuresLength;
      }
      if (hasSharedUpdate)
        hasSharedUpdate = false;
      structures = sharedStructures || [];
      packedObjectMap2 = sharedPackedObjectMap2;
      if (options.pack) {
        let packedValues2 = /* @__PURE__ */ new Map();
        packedValues2.values = [];
        packedValues2.encoder = encoder;
        packedValues2.maxValues = options.maxPrivatePackedValues || (sharedPackedObjectMap2 ? 16 : Infinity);
        packedValues2.objectMap = sharedPackedObjectMap2 || false;
        packedValues2.samplingPackedValues = samplingPackedValues;
        findRepetitiveStrings(value, packedValues2);
        if (packedValues2.values.length > 0) {
          target[position2++] = 216;
          target[position2++] = 51;
          writeArrayHeader(4);
          let valuesArray = packedValues2.values;
          encode3(valuesArray);
          writeArrayHeader(0);
          writeArrayHeader(0);
          packedObjectMap2 = Object.create(sharedPackedObjectMap2 || null);
          for (let i = 0, l = valuesArray.length; i < l; i++) {
            packedObjectMap2[valuesArray[i]] = i;
          }
        }
      }
      throwOnIterable = encodeOptions & THROW_ON_ITERABLE;
      try {
        if (throwOnIterable)
          return;
        encode3(value);
        if (bundledStrings2) {
          writeBundles(start, encode3);
        }
        encoder.offset = position2;
        if (referenceMap2 && referenceMap2.idsToInsert) {
          position2 += referenceMap2.idsToInsert.length * 2;
          if (position2 > safeEnd)
            makeRoom(position2);
          encoder.offset = position2;
          let serialized = insertIds(target.subarray(start, position2), referenceMap2.idsToInsert);
          referenceMap2 = null;
          return serialized;
        }
        if (encodeOptions & REUSE_BUFFER_MODE) {
          target.start = start;
          target.end = position2;
          return target;
        }
        return target.subarray(start, position2);
      } finally {
        if (sharedStructures) {
          if (serializationsSinceTransitionRebuild < 10)
            serializationsSinceTransitionRebuild++;
          if (sharedStructures.length > maxSharedStructures)
            sharedStructures.length = maxSharedStructures;
          if (transitionsCount > 1e4) {
            sharedStructures.transitions = null;
            serializationsSinceTransitionRebuild = 0;
            transitionsCount = 0;
            if (recordIdsToRemove.length > 0)
              recordIdsToRemove = [];
          } else if (recordIdsToRemove.length > 0 && !isSequential) {
            for (let i = 0, l = recordIdsToRemove.length; i < l; i++) {
              recordIdsToRemove[i][RECORD_SYMBOL] = void 0;
            }
            recordIdsToRemove = [];
          }
        }
        if (hasSharedUpdate && encoder.saveShared) {
          if (encoder.structures.length > maxSharedStructures) {
            encoder.structures = encoder.structures.slice(0, maxSharedStructures);
          }
          let returnBuffer = target.subarray(start, position2);
          if (encoder.updateSharedData() === false)
            return encoder.encode(value);
          return returnBuffer;
        }
        if (encodeOptions & RESET_BUFFER_MODE)
          position2 = start;
      }
    };
    this.findCommonStringsToPack = () => {
      samplingPackedValues = /* @__PURE__ */ new Map();
      if (!sharedPackedObjectMap2)
        sharedPackedObjectMap2 = /* @__PURE__ */ Object.create(null);
      return (options2) => {
        let threshold = options2 && options2.threshold || 4;
        let position3 = this.pack ? options2.maxPrivatePackedValues || 16 : 0;
        if (!sharedValues)
          sharedValues = this.sharedValues = [];
        for (let [key, status] of samplingPackedValues) {
          if (status.count > threshold) {
            sharedPackedObjectMap2[key] = position3++;
            sharedValues.push(key);
            hasSharedUpdate = true;
          }
        }
        while (this.saveShared && this.updateSharedData() === false) {
        }
        samplingPackedValues = null;
      };
    };
    const encode3 = (value) => {
      if (position2 > safeEnd)
        target = makeRoom(position2);
      var type = typeof value;
      var length;
      if (type === "string") {
        if (packedObjectMap2) {
          let packedPosition = packedObjectMap2[value];
          if (packedPosition >= 0) {
            if (packedPosition < 16)
              target[position2++] = packedPosition + 224;
            else {
              target[position2++] = 198;
              if (packedPosition & 1)
                encode3(15 - packedPosition >> 1);
              else
                encode3(packedPosition - 16 >> 1);
            }
            return;
          } else if (samplingPackedValues && !options.pack) {
            let status = samplingPackedValues.get(value);
            if (status)
              status.count++;
            else
              samplingPackedValues.set(value, {
                count: 1
              });
          }
        }
        let strLength = value.length;
        if (bundledStrings2 && strLength >= 4 && strLength < 1024) {
          if ((bundledStrings2.size += strLength) > MAX_BUNDLE_SIZE) {
            let extStart;
            let maxBytes2 = (bundledStrings2[0] ? bundledStrings2[0].length * 3 + bundledStrings2[1].length : 0) + 10;
            if (position2 + maxBytes2 > safeEnd)
              target = makeRoom(position2 + maxBytes2);
            target[position2++] = 217;
            target[position2++] = 223;
            target[position2++] = 249;
            target[position2++] = bundledStrings2.position ? 132 : 130;
            target[position2++] = 26;
            extStart = position2 - start;
            position2 += 4;
            if (bundledStrings2.position) {
              writeBundles(start, encode3);
            }
            bundledStrings2 = ["", ""];
            bundledStrings2.size = 0;
            bundledStrings2.position = extStart;
          }
          let twoByte = hasNonLatin.test(value);
          bundledStrings2[twoByte ? 0 : 1] += value;
          target[position2++] = twoByte ? 206 : 207;
          encode3(strLength);
          return;
        }
        let headerSize;
        if (strLength < 32) {
          headerSize = 1;
        } else if (strLength < 256) {
          headerSize = 2;
        } else if (strLength < 65536) {
          headerSize = 3;
        } else {
          headerSize = 5;
        }
        let maxBytes = strLength * 3;
        if (position2 + maxBytes > safeEnd)
          target = makeRoom(position2 + maxBytes);
        if (strLength < 64 || !encodeUtf8) {
          let i, c1, c2, strPosition = position2 + headerSize;
          for (i = 0; i < strLength; i++) {
            c1 = value.charCodeAt(i);
            if (c1 < 128) {
              target[strPosition++] = c1;
            } else if (c1 < 2048) {
              target[strPosition++] = c1 >> 6 | 192;
              target[strPosition++] = c1 & 63 | 128;
            } else if ((c1 & 64512) === 55296 && ((c2 = value.charCodeAt(i + 1)) & 64512) === 56320) {
              c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
              i++;
              target[strPosition++] = c1 >> 18 | 240;
              target[strPosition++] = c1 >> 12 & 63 | 128;
              target[strPosition++] = c1 >> 6 & 63 | 128;
              target[strPosition++] = c1 & 63 | 128;
            } else {
              target[strPosition++] = c1 >> 12 | 224;
              target[strPosition++] = c1 >> 6 & 63 | 128;
              target[strPosition++] = c1 & 63 | 128;
            }
          }
          length = strPosition - position2 - headerSize;
        } else {
          length = encodeUtf8(value, position2 + headerSize, maxBytes);
        }
        if (length < 24) {
          target[position2++] = 96 | length;
        } else if (length < 256) {
          if (headerSize < 2) {
            target.copyWithin(position2 + 2, position2 + 1, position2 + 1 + length);
          }
          target[position2++] = 120;
          target[position2++] = length;
        } else if (length < 65536) {
          if (headerSize < 3) {
            target.copyWithin(position2 + 3, position2 + 2, position2 + 2 + length);
          }
          target[position2++] = 121;
          target[position2++] = length >> 8;
          target[position2++] = length & 255;
        } else {
          if (headerSize < 5) {
            target.copyWithin(position2 + 5, position2 + 3, position2 + 3 + length);
          }
          target[position2++] = 122;
          targetView.setUint32(position2, length);
          position2 += 4;
        }
        position2 += length;
      } else if (type === "number") {
        if (!this.alwaysUseFloat && value >>> 0 === value) {
          if (value < 24) {
            target[position2++] = value;
          } else if (value < 256) {
            target[position2++] = 24;
            target[position2++] = value;
          } else if (value < 65536) {
            target[position2++] = 25;
            target[position2++] = value >> 8;
            target[position2++] = value & 255;
          } else {
            target[position2++] = 26;
            targetView.setUint32(position2, value);
            position2 += 4;
          }
        } else if (!this.alwaysUseFloat && value >> 0 === value) {
          if (value >= -24) {
            target[position2++] = 31 - value;
          } else if (value >= -256) {
            target[position2++] = 56;
            target[position2++] = ~value;
          } else if (value >= -65536) {
            target[position2++] = 57;
            targetView.setUint16(position2, ~value);
            position2 += 2;
          } else {
            target[position2++] = 58;
            targetView.setUint32(position2, ~value);
            position2 += 4;
          }
        } else if (!this.alwaysUseFloat && value < 0 && value >= -4294967296 && Math.floor(value) === value) {
          target[position2++] = 58;
          targetView.setUint32(position2, -1 - value);
          position2 += 4;
        } else {
          let useFloat32;
          if ((useFloat32 = this.useFloat32) > 0 && value < 4294967296 && value >= -2147483648) {
            target[position2++] = 250;
            targetView.setFloat32(position2, value);
            let xShifted;
            if (useFloat32 < 4 || // this checks for rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
            (xShifted = value * mult10[(target[position2] & 127) << 1 | target[position2 + 1] >> 7]) >> 0 === xShifted) {
              position2 += 4;
              return;
            } else
              position2--;
          }
          target[position2++] = 251;
          targetView.setFloat64(position2, value);
          position2 += 8;
        }
      } else if (type === "object") {
        if (!value)
          target[position2++] = 246;
        else {
          if (referenceMap2) {
            let referee = referenceMap2.get(value);
            if (referee) {
              target[position2++] = 216;
              target[position2++] = 29;
              target[position2++] = 25;
              if (!referee.references) {
                let idsToInsert = referenceMap2.idsToInsert || (referenceMap2.idsToInsert = []);
                referee.references = [];
                idsToInsert.push(referee);
              }
              referee.references.push(position2 - start);
              position2 += 2;
              return;
            } else
              referenceMap2.set(value, { offset: position2 - start });
          }
          let constructor = value.constructor;
          if (constructor === Object) {
            if (this.skipFunction === true) {
              value = Object.fromEntries([...Object.keys(value).filter((x) => typeof value[x] !== "function").map((x) => [x, value[x]])]);
            }
            writeObject(value);
          } else if (constructor === Array) {
            length = value.length;
            if (length < 24) {
              target[position2++] = 128 | length;
            } else {
              writeArrayHeader(length);
            }
            for (let i = 0; i < length; i++) {
              encode3(value[i]);
            }
          } else if (constructor === Map) {
            if (this.mapsAsObjects ? this.useTag259ForMaps !== false : this.useTag259ForMaps) {
              target[position2++] = 217;
              target[position2++] = 1;
              target[position2++] = 3;
            }
            length = value.size;
            if (length < 24) {
              target[position2++] = 160 | length;
            } else if (length < 256) {
              target[position2++] = 184;
              target[position2++] = length;
            } else if (length < 65536) {
              target[position2++] = 185;
              target[position2++] = length >> 8;
              target[position2++] = length & 255;
            } else {
              target[position2++] = 186;
              targetView.setUint32(position2, length);
              position2 += 4;
            }
            if (encoder.keyMap) {
              for (let [key, entryValue] of value) {
                encode3(encoder.encodeKey(key));
                encode3(entryValue);
              }
            } else {
              for (let [key, entryValue] of value) {
                encode3(key);
                encode3(entryValue);
              }
            }
          } else {
            for (let i = 0, l = extensions.length; i < l; i++) {
              let extensionClass = extensionClasses[i];
              if (value instanceof extensionClass) {
                let extension = extensions[i];
                let tag = extension.tag;
                if (tag == void 0)
                  tag = extension.getTag && extension.getTag.call(this, value);
                if (tag < 24) {
                  target[position2++] = 192 | tag;
                } else if (tag < 256) {
                  target[position2++] = 216;
                  target[position2++] = tag;
                } else if (tag < 65536) {
                  target[position2++] = 217;
                  target[position2++] = tag >> 8;
                  target[position2++] = tag & 255;
                } else if (tag > -1) {
                  target[position2++] = 218;
                  targetView.setUint32(position2, tag);
                  position2 += 4;
                }
                extension.encode.call(this, value, encode3, makeRoom);
                return;
              }
            }
            if (value[Symbol.iterator]) {
              if (throwOnIterable) {
                let error = new Error("Iterable should be serialized as iterator");
                error.iteratorNotHandled = true;
                throw error;
              }
              target[position2++] = 159;
              for (let entry of value) {
                encode3(entry);
              }
              target[position2++] = 255;
              return;
            }
            if (value[Symbol.asyncIterator] || isBlob(value)) {
              let error = new Error("Iterable/blob should be serialized as iterator");
              error.iteratorNotHandled = true;
              throw error;
            }
            if (this.useToJSON && value.toJSON) {
              const json = value.toJSON();
              if (json !== value)
                return encode3(json);
            }
            writeObject(value);
          }
        }
      } else if (type === "boolean") {
        target[position2++] = value ? 245 : 244;
      } else if (type === "bigint") {
        if (value < BigInt(1) << BigInt(64) && value >= 0) {
          target[position2++] = 27;
          targetView.setBigUint64(position2, value);
        } else if (value > -(BigInt(1) << BigInt(64)) && value < 0) {
          target[position2++] = 59;
          targetView.setBigUint64(position2, -value - BigInt(1));
        } else {
          if (this.largeBigIntToFloat) {
            target[position2++] = 251;
            targetView.setFloat64(position2, Number(value));
          } else {
            if (value >= BigInt(0))
              target[position2++] = 194;
            else {
              target[position2++] = 195;
              value = BigInt(-1) - value;
            }
            let bytes = [];
            while (value) {
              bytes.push(Number(value & BigInt(255)));
              value >>= BigInt(8);
            }
            writeBuffer(new Uint8Array(bytes.reverse()), makeRoom);
            return;
          }
        }
        position2 += 8;
      } else if (type === "undefined") {
        target[position2++] = 247;
      } else {
        throw new Error("Unknown type: " + type);
      }
    };
    const writeObject = this.useRecords === false ? this.variableMapSize ? (object) => {
      let keys = Object.keys(object);
      let vals = Object.values(object);
      let length = keys.length;
      if (length < 24) {
        target[position2++] = 160 | length;
      } else if (length < 256) {
        target[position2++] = 184;
        target[position2++] = length;
      } else if (length < 65536) {
        target[position2++] = 185;
        target[position2++] = length >> 8;
        target[position2++] = length & 255;
      } else {
        target[position2++] = 186;
        targetView.setUint32(position2, length);
        position2 += 4;
      }
      let key;
      if (encoder.keyMap) {
        for (let i = 0; i < length; i++) {
          encode3(encoder.encodeKey(keys[i]));
          encode3(vals[i]);
        }
      } else {
        for (let i = 0; i < length; i++) {
          encode3(keys[i]);
          encode3(vals[i]);
        }
      }
    } : (object) => {
      target[position2++] = 185;
      let objectOffset = position2 - start;
      position2 += 2;
      let size = 0;
      if (encoder.keyMap) {
        for (let key in object) if (typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key)) {
          encode3(encoder.encodeKey(key));
          encode3(object[key]);
          size++;
        }
      } else {
        for (let key in object) if (typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key)) {
          encode3(key);
          encode3(object[key]);
          size++;
        }
      }
      target[objectOffset++ + start] = size >> 8;
      target[objectOffset + start] = size & 255;
    } : (object, skipValues) => {
      let nextTransition, transition2 = structures.transitions || (structures.transitions = /* @__PURE__ */ Object.create(null));
      let newTransitions = 0;
      let length = 0;
      let parentRecordId;
      let keys;
      if (this.keyMap) {
        keys = Object.keys(object).map((k) => this.encodeKey(k));
        length = keys.length;
        for (let i = 0; i < length; i++) {
          let key = keys[i];
          nextTransition = transition2[key];
          if (!nextTransition) {
            nextTransition = transition2[key] = /* @__PURE__ */ Object.create(null);
            newTransitions++;
          }
          transition2 = nextTransition;
        }
      } else {
        for (let key in object) if (typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key)) {
          nextTransition = transition2[key];
          if (!nextTransition) {
            if (transition2[RECORD_SYMBOL] & 1048576) {
              parentRecordId = transition2[RECORD_SYMBOL] & 65535;
            }
            nextTransition = transition2[key] = /* @__PURE__ */ Object.create(null);
            newTransitions++;
          }
          transition2 = nextTransition;
          length++;
        }
      }
      let recordId = transition2[RECORD_SYMBOL];
      if (recordId !== void 0) {
        recordId &= 65535;
        target[position2++] = 217;
        target[position2++] = recordId >> 8 | 224;
        target[position2++] = recordId & 255;
      } else {
        if (!keys)
          keys = transition2.__keys__ || (transition2.__keys__ = Object.keys(object));
        if (parentRecordId === void 0) {
          recordId = structures.nextId++;
          if (!recordId) {
            recordId = 0;
            structures.nextId = 1;
          }
          if (recordId >= MAX_STRUCTURES) {
            structures.nextId = (recordId = maxSharedStructures) + 1;
          }
        } else {
          recordId = parentRecordId;
        }
        structures[recordId] = keys;
        if (recordId < maxSharedStructures) {
          target[position2++] = 217;
          target[position2++] = recordId >> 8 | 224;
          target[position2++] = recordId & 255;
          transition2 = structures.transitions;
          for (let i = 0; i < length; i++) {
            if (transition2[RECORD_SYMBOL] === void 0 || transition2[RECORD_SYMBOL] & 1048576)
              transition2[RECORD_SYMBOL] = recordId;
            transition2 = transition2[keys[i]];
          }
          transition2[RECORD_SYMBOL] = recordId | 1048576;
          hasSharedUpdate = true;
        } else {
          transition2[RECORD_SYMBOL] = recordId;
          targetView.setUint32(position2, 3655335680);
          position2 += 3;
          if (newTransitions)
            transitionsCount += serializationsSinceTransitionRebuild * newTransitions;
          if (recordIdsToRemove.length >= MAX_STRUCTURES - maxSharedStructures)
            recordIdsToRemove.shift()[RECORD_SYMBOL] = void 0;
          recordIdsToRemove.push(transition2);
          writeArrayHeader(length + 2);
          encode3(57344 + recordId);
          encode3(keys);
          if (skipValues) return;
          for (let key in object)
            if (typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key))
              encode3(object[key]);
          return;
        }
      }
      if (length < 24) {
        target[position2++] = 128 | length;
      } else {
        writeArrayHeader(length);
      }
      if (skipValues) return;
      for (let key in object)
        if (typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key))
          encode3(object[key]);
    };
    const makeRoom = (end) => {
      let newSize;
      if (end > 16777216) {
        if (end - start > MAX_BUFFER_SIZE)
          throw new Error("Encoded buffer would be larger than maximum buffer size");
        newSize = Math.min(
          MAX_BUFFER_SIZE,
          Math.round(Math.max((end - start) * (end > 67108864 ? 1.25 : 2), 4194304) / 4096) * 4096
        );
      } else
        newSize = (Math.max(end - start << 2, target.length - 1) >> 12) + 1 << 12;
      let newBuffer = new ByteArrayAllocate(newSize);
      targetView = new DataView(newBuffer.buffer, 0, newSize);
      if (target.copy)
        target.copy(newBuffer, 0, start, end);
      else
        newBuffer.set(target.slice(start, end));
      position2 -= start;
      start = 0;
      safeEnd = newBuffer.length - 10;
      return target = newBuffer;
    };
    let chunkThreshold = 100;
    let continuedChunkThreshold = 1e3;
    this.encodeAsIterable = function(value, options2) {
      return startEncoding(value, options2, encodeObjectAsIterable);
    };
    this.encodeAsAsyncIterable = function(value, options2) {
      return startEncoding(value, options2, encodeObjectAsAsyncIterable);
    };
    function* encodeObjectAsIterable(object, iterateProperties, finalIterable) {
      let constructor = object.constructor;
      if (constructor === Object) {
        let useRecords = encoder.useRecords !== false;
        if (useRecords)
          writeObject(object, true);
        else
          writeEntityLength(Object.keys(object).length, 160);
        for (let key in object) {
          let value = object[key];
          if (!useRecords) encode3(key);
          if (value && typeof value === "object") {
            if (iterateProperties[key])
              yield* encodeObjectAsIterable(value, iterateProperties[key]);
            else
              yield* tryEncode(value, iterateProperties, key);
          } else encode3(value);
        }
      } else if (constructor === Array) {
        let length = object.length;
        writeArrayHeader(length);
        for (let i = 0; i < length; i++) {
          let value = object[i];
          if (value && (typeof value === "object" || position2 - start > chunkThreshold)) {
            if (iterateProperties.element)
              yield* encodeObjectAsIterable(value, iterateProperties.element);
            else
              yield* tryEncode(value, iterateProperties, "element");
          } else encode3(value);
        }
      } else if (object[Symbol.iterator] && !object.buffer) {
        target[position2++] = 159;
        for (let value of object) {
          if (value && (typeof value === "object" || position2 - start > chunkThreshold)) {
            if (iterateProperties.element)
              yield* encodeObjectAsIterable(value, iterateProperties.element);
            else
              yield* tryEncode(value, iterateProperties, "element");
          } else encode3(value);
        }
        target[position2++] = 255;
      } else if (isBlob(object)) {
        writeEntityLength(object.size, 64);
        yield target.subarray(start, position2);
        yield object;
        restartEncoding();
      } else if (object[Symbol.asyncIterator]) {
        target[position2++] = 159;
        yield target.subarray(start, position2);
        yield object;
        restartEncoding();
        target[position2++] = 255;
      } else {
        encode3(object);
      }
      if (finalIterable && position2 > start) yield target.subarray(start, position2);
      else if (position2 - start > chunkThreshold) {
        yield target.subarray(start, position2);
        restartEncoding();
      }
    }
    function* tryEncode(value, iterateProperties, key) {
      let restart = position2 - start;
      try {
        encode3(value);
        if (position2 - start > chunkThreshold) {
          yield target.subarray(start, position2);
          restartEncoding();
        }
      } catch (error) {
        if (error.iteratorNotHandled) {
          iterateProperties[key] = {};
          position2 = start + restart;
          yield* encodeObjectAsIterable.call(this, value, iterateProperties[key]);
        } else throw error;
      }
    }
    function restartEncoding() {
      chunkThreshold = continuedChunkThreshold;
      encoder.encode(null, THROW_ON_ITERABLE);
    }
    function startEncoding(value, options2, encodeIterable) {
      if (options2 && options2.chunkThreshold)
        chunkThreshold = continuedChunkThreshold = options2.chunkThreshold;
      else
        chunkThreshold = 100;
      if (value && typeof value === "object") {
        encoder.encode(null, THROW_ON_ITERABLE);
        return encodeIterable(value, encoder.iterateProperties || (encoder.iterateProperties = {}), true);
      }
      return [encoder.encode(value)];
    }
    async function* encodeObjectAsAsyncIterable(value, iterateProperties) {
      for (let encodedValue of encodeObjectAsIterable(value, iterateProperties, true)) {
        let constructor = encodedValue.constructor;
        if (constructor === ByteArray || constructor === Uint8Array)
          yield encodedValue;
        else if (isBlob(encodedValue)) {
          let reader = encodedValue.stream().getReader();
          let next;
          while (!(next = await reader.read()).done) {
            yield next.value;
          }
        } else if (encodedValue[Symbol.asyncIterator]) {
          for await (let asyncValue of encodedValue) {
            restartEncoding();
            if (asyncValue)
              yield* encodeObjectAsAsyncIterable(asyncValue, iterateProperties.async || (iterateProperties.async = {}));
            else yield encoder.encode(asyncValue);
          }
        } else {
          yield encodedValue;
        }
      }
    }
  }
  useBuffer(buffer) {
    target = buffer;
    targetView = new DataView(target.buffer, target.byteOffset, target.byteLength);
    position2 = 0;
  }
  clearSharedData() {
    if (this.structures)
      this.structures = [];
    if (this.sharedValues)
      this.sharedValues = void 0;
  }
  updateSharedData() {
    let lastVersion = this.sharedVersion || 0;
    this.sharedVersion = lastVersion + 1;
    let structuresCopy = this.structures.slice(0);
    let sharedData = new SharedData(structuresCopy, this.sharedValues, this.sharedVersion);
    let saveResults = this.saveShared(
      sharedData,
      (existingShared) => (existingShared && existingShared.version || 0) == lastVersion
    );
    if (saveResults === false) {
      sharedData = this.getShared() || {};
      this.structures = sharedData.structures || [];
      this.sharedValues = sharedData.packedValues;
      this.sharedVersion = sharedData.version;
      this.structures.nextId = this.structures.length;
    } else {
      structuresCopy.forEach((structure, i) => this.structures[i] = structure);
    }
    return saveResults;
  }
};
function writeEntityLength(length, majorValue) {
  if (length < 24)
    target[position2++] = majorValue | length;
  else if (length < 256) {
    target[position2++] = majorValue | 24;
    target[position2++] = length;
  } else if (length < 65536) {
    target[position2++] = majorValue | 25;
    target[position2++] = length >> 8;
    target[position2++] = length & 255;
  } else {
    target[position2++] = majorValue | 26;
    targetView.setUint32(position2, length);
    position2 += 4;
  }
}
var SharedData = class {
  constructor(structures, values, version) {
    this.structures = structures;
    this.packedValues = values;
    this.version = version;
  }
};
function writeArrayHeader(length) {
  if (length < 24)
    target[position2++] = 128 | length;
  else if (length < 256) {
    target[position2++] = 152;
    target[position2++] = length;
  } else if (length < 65536) {
    target[position2++] = 153;
    target[position2++] = length >> 8;
    target[position2++] = length & 255;
  } else {
    target[position2++] = 154;
    targetView.setUint32(position2, length);
    position2 += 4;
  }
}
var BlobConstructor = typeof Blob === "undefined" ? function() {
} : Blob;
function isBlob(object) {
  if (object instanceof BlobConstructor)
    return true;
  let tag = object[Symbol.toStringTag];
  return tag === "Blob" || tag === "File";
}
function findRepetitiveStrings(value, packedValues2) {
  switch (typeof value) {
    case "string":
      if (value.length > 3) {
        if (packedValues2.objectMap[value] > -1 || packedValues2.values.length >= packedValues2.maxValues)
          return;
        let packedStatus = packedValues2.get(value);
        if (packedStatus) {
          if (++packedStatus.count == 2) {
            packedValues2.values.push(value);
          }
        } else {
          packedValues2.set(value, {
            count: 1
          });
          if (packedValues2.samplingPackedValues) {
            let status = packedValues2.samplingPackedValues.get(value);
            if (status)
              status.count++;
            else
              packedValues2.samplingPackedValues.set(value, {
                count: 1
              });
          }
        }
      }
      break;
    case "object":
      if (value) {
        if (value instanceof Array) {
          for (let i = 0, l = value.length; i < l; i++) {
            findRepetitiveStrings(value[i], packedValues2);
          }
        } else {
          let includeKeys = !packedValues2.encoder.useRecords;
          for (var key in value) {
            if (value.hasOwnProperty(key)) {
              if (includeKeys)
                findRepetitiveStrings(key, packedValues2);
              findRepetitiveStrings(value[key], packedValues2);
            }
          }
        }
      }
      break;
    case "function":
      console.log(value);
  }
}
var isLittleEndianMachine2 = new Uint8Array(new Uint16Array([1]).buffer)[0] == 1;
extensionClasses = [
  Date,
  Set,
  Error,
  RegExp,
  Tag,
  ArrayBuffer,
  Uint8Array,
  Uint8ClampedArray,
  Uint16Array,
  Uint32Array,
  typeof BigUint64Array == "undefined" ? function() {
  } : BigUint64Array,
  Int8Array,
  Int16Array,
  Int32Array,
  typeof BigInt64Array == "undefined" ? function() {
  } : BigInt64Array,
  Float32Array,
  Float64Array,
  SharedData
];
extensions = [
  {
    // Date
    tag: 1,
    encode(date, encode3) {
      let seconds = date.getTime() / 1e3;
      if ((this.useTimestamp32 || date.getMilliseconds() === 0) && seconds >= 0 && seconds < 4294967296) {
        target[position2++] = 26;
        targetView.setUint32(position2, seconds);
        position2 += 4;
      } else {
        target[position2++] = 251;
        targetView.setFloat64(position2, seconds);
        position2 += 8;
      }
    }
  },
  {
    // Set
    tag: 258,
    // https://github.com/input-output-hk/cbor-sets-spec/blob/master/CBOR_SETS.md
    encode(set, encode3) {
      let array = Array.from(set);
      encode3(array);
    }
  },
  {
    // Error
    tag: 27,
    // http://cbor.schmorp.de/generic-object
    encode(error, encode3) {
      encode3([error.name, error.message]);
    }
  },
  {
    // RegExp
    tag: 27,
    // http://cbor.schmorp.de/generic-object
    encode(regex, encode3) {
      encode3(["RegExp", regex.source, regex.flags]);
    }
  },
  {
    // Tag
    getTag(tag) {
      return tag.tag;
    },
    encode(tag, encode3) {
      encode3(tag.value);
    }
  },
  {
    // ArrayBuffer
    encode(arrayBuffer, encode3, makeRoom) {
      writeBuffer(arrayBuffer, makeRoom);
    }
  },
  {
    // Uint8Array
    getTag(typedArray) {
      if (typedArray.constructor === Uint8Array) {
        if (this.tagUint8Array || hasNodeBuffer && this.tagUint8Array !== false)
          return 64;
      }
    },
    encode(typedArray, encode3, makeRoom) {
      writeBuffer(typedArray, makeRoom);
    }
  },
  typedArrayEncoder(68, 1),
  typedArrayEncoder(69, 2),
  typedArrayEncoder(70, 4),
  typedArrayEncoder(71, 8),
  typedArrayEncoder(72, 1),
  typedArrayEncoder(77, 2),
  typedArrayEncoder(78, 4),
  typedArrayEncoder(79, 8),
  typedArrayEncoder(85, 4),
  typedArrayEncoder(86, 8),
  {
    encode(sharedData, encode3) {
      let packedValues2 = sharedData.packedValues || [];
      let sharedStructures = sharedData.structures || [];
      if (packedValues2.values.length > 0) {
        target[position2++] = 216;
        target[position2++] = 51;
        writeArrayHeader(4);
        let valuesArray = packedValues2.values;
        encode3(valuesArray);
        writeArrayHeader(0);
        writeArrayHeader(0);
        packedObjectMap = Object.create(sharedPackedObjectMap || null);
        for (let i = 0, l = valuesArray.length; i < l; i++) {
          packedObjectMap[valuesArray[i]] = i;
        }
      }
      if (sharedStructures) {
        targetView.setUint32(position2, 3655335424);
        position2 += 3;
        let definitions = sharedStructures.slice(0);
        definitions.unshift(57344);
        definitions.push(new Tag(sharedData.version, 1399353956));
        encode3(definitions);
      } else
        encode3(new Tag(sharedData.version, 1399353956));
    }
  }
];
function typedArrayEncoder(tag, size) {
  if (!isLittleEndianMachine2 && size > 1)
    tag -= 4;
  return {
    tag,
    encode: function writeExtBuffer(typedArray, encode3) {
      let length = typedArray.byteLength;
      let offset = typedArray.byteOffset || 0;
      let buffer = typedArray.buffer || typedArray;
      encode3(hasNodeBuffer ? Buffer2.from(buffer, offset, length) : new Uint8Array(buffer, offset, length));
    }
  };
}
function writeBuffer(buffer, makeRoom) {
  let length = buffer.byteLength;
  if (length < 24) {
    target[position2++] = 64 + length;
  } else if (length < 256) {
    target[position2++] = 88;
    target[position2++] = length;
  } else if (length < 65536) {
    target[position2++] = 89;
    target[position2++] = length >> 8;
    target[position2++] = length & 255;
  } else {
    target[position2++] = 90;
    targetView.setUint32(position2, length);
    position2 += 4;
  }
  if (position2 + length >= target.length) {
    makeRoom(position2 + length);
  }
  target.set(buffer.buffer ? buffer : new Uint8Array(buffer), position2);
  position2 += length;
}
function insertIds(serialized, idsToInsert) {
  let nextId;
  let distanceToMove = idsToInsert.length * 2;
  let lastEnd = serialized.length - distanceToMove;
  idsToInsert.sort((a, b) => a.offset > b.offset ? 1 : -1);
  for (let id = 0; id < idsToInsert.length; id++) {
    let referee = idsToInsert[id];
    referee.id = id;
    for (let position3 of referee.references) {
      serialized[position3++] = id >> 8;
      serialized[position3] = id & 255;
    }
  }
  while (nextId = idsToInsert.pop()) {
    let offset = nextId.offset;
    serialized.copyWithin(offset + distanceToMove, offset, lastEnd);
    distanceToMove -= 2;
    let position3 = offset + distanceToMove;
    serialized[position3++] = 216;
    serialized[position3++] = 28;
    lastEnd = offset;
  }
  return serialized;
}
function writeBundles(start, encode3) {
  targetView.setUint32(bundledStrings2.position + start, position2 - bundledStrings2.position - start + 1);
  let writeStrings = bundledStrings2;
  bundledStrings2 = null;
  encode3(writeStrings[0]);
  encode3(writeStrings[1]);
}
var defaultEncoder = new Encoder({ useRecords: false });
var encode = defaultEncoder.encode;
var encodeAsIterable = defaultEncoder.encodeAsIterable;
var encodeAsAsyncIterable = defaultEncoder.encodeAsAsyncIterable;
var { NEVER, ALWAYS, DECIMAL_ROUND, DECIMAL_FIT } = FLOAT32_OPTIONS;
var REUSE_BUFFER_MODE = 512;
var RESET_BUFFER_MODE = 1024;
var THROW_ON_ITERABLE = 2048;

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/helpers/cbor.js
function encode2(obj) {
  const encoder = new Encoder({ tagUint8Array: false, useRecords: false });
  return encoder.encode(obj);
}

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/helpers/arraysAreEqual.js
var arraysAreEqual = (a, b) => a.length === b.length && a.every((element, index) => element === b[index]);

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/helpers/headsAreSame.js
var headsAreSame = (a, b) => {
  return arraysAreEqual(a, b);
};

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/helpers/withTimeout.js
var withTimeout = async (promise, t) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new TimeoutError(`withTimeout: timed out after ${t}ms`)), t);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
};
var TimeoutError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "TimeoutError";
  }
};

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/helpers/abortable.js
var AbortError = class extends DOMException {
  constructor(message) {
    super(message ?? "Operation aborted", "AbortError");
  }
};
var isAbortErrorLike = (candidate) => {
  return candidate instanceof AbortError || (candidate instanceof Error || //In some JS environments, DOMException is not defined, and sometimes when defined, it does not extend Error; hence extra checks
  DOMException && candidate instanceof DOMException) && candidate.name === "AbortError";
};
function abortable(p, signal) {
  if (signal?.aborted)
    return Promise.reject(signal.reason);
  let settled = false;
  return new Promise((resolve, reject) => {
    const onAbort = () => {
      if (!settled) {
        reject(new AbortError());
      }
    };
    signal?.addEventListener("abort", onAbort, { once: true });
    p.then((result) => {
      resolve(result);
    }).catch((error) => {
      reject(error);
    }).finally(() => {
      settled = true;
      signal?.removeEventListener("abort", onAbort);
    });
  });
}

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/DocHandle.js
var DocHandle = class _DocHandle extends import_index.default {
  documentId;
  #log;
  /** The XState actor running our state machine.  */
  #machine;
  /** If set, this handle will only show the document at these heads */
  #fixedHeads;
  /** The last known state of our document. */
  #prevDocState = implementation_exports.init();
  /** How long to wait before giving up on a document. (Note that a document will be marked
   * unavailable much sooner if all known peers respond that they don't have it.) */
  #timeoutDelay = 6e4;
  /** A dictionary mapping each peer to the last known heads we have. */
  #syncInfoByStorageId = {};
  /** Cache for view handles, keyed by the stringified heads */
  #viewCache = /* @__PURE__ */ new Map();
  /** Cache for ref instances, keyed by serialized path */
  #refCache = /* @__PURE__ */ new Map();
  /** Factory for creating Ref instances, injected by Repo to avoid circular imports */
  #refConstructor;
  /** @hidden */
  constructor(documentId, refConstructor, options = {}) {
    super();
    this.documentId = documentId;
    this.#refConstructor = refConstructor;
    if ("timeoutDelay" in options && options.timeoutDelay) {
      this.#timeoutDelay = options.timeoutDelay;
    }
    if ("heads" in options) {
      this.#fixedHeads = options.heads;
    }
    const doc = implementation_exports.init();
    this.#log = (0, import_debug.default)(`automerge-repo:dochandle:${this.documentId.slice(0, 5)}`);
    const delay = this.#timeoutDelay;
    const machine = (0, import_xstate_cjs.setup)({
      types: {
        context: {},
        events: {}
      },
      actions: {
        /** Update the doc using the given callback and put the modified doc in context */
        onUpdate: (0, import_xstate_cjs.assign)(({ context, event }) => {
          const oldDoc = context.doc;
          (0, import_xstate_cjs.assertEvent)(event, UPDATE);
          const { callback } = event.payload;
          const doc2 = callback(oldDoc);
          return { doc: doc2 };
        }),
        onDelete: (0, import_xstate_cjs.assign)(() => {
          this.emit("delete", { handle: this });
          return { doc: implementation_exports.init() };
        }),
        onUnavailable: (0, import_xstate_cjs.assign)(() => {
          return { doc: implementation_exports.init() };
        }),
        onUnload: (0, import_xstate_cjs.assign)(() => {
          return { doc: implementation_exports.init() };
        })
      }
    }).createMachine({
      /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAYgFUAFAEQEEAVAUQG0AGAXUVAAcB7WXAC64e+TiAAeiAOwAOAKwA6ACxSAzKqks1ATjlTdAGhABPRAFolAJksKN2y1KtKAbFLla5AX09G0WPISkVAwAMgyMrBxIILz8QiJikggAjCzOijKqLEqqybJyLizaRqYIFpbJtro5Uo7J2o5S3r4YOATECrgQADZgJADCAEoM9MzsYrGCwqLRSeoyCtra8pa5adquySXmDjY5ac7JljLJeepKzSB+bYGdPX0AYgCSAHJUkRN8UwmziM7HCgqyVcUnqcmScmcMm2ZV2yiyzkOx1OalUFx8V1aAQ63R46AgBCgJGGAEUyAwAMp0D7RSbxGagJKHFgKOSWJTJGRSCosCpKaEmRCqbQKU5yXINeTaer6LwY67YogKXH4wkkKgAeX6AH1hjQqABNGncL70xKIJQ5RY5BHOJag6wwpRyEWImQVeT1aWrVSXBXtJUqgn4Ik0ADqNCedG1L3CYY1gwA0saYqbpuaEG4pKLksKpFDgcsCjDhTnxTKpTLdH6sQGFOgAO7oKYhl5gAQNngAJwA1iRY3R40ndSNDSm6enfpm5BkWAVkvy7bpuTCKq7ndZnfVeSwuTX-HWu2AAI4AVzgQhD6q12rILxoADVIyEaAAhMLjtM-RmIE4LVSQi4nLLDIGzOCWwLKA0cgyLBoFWNy+43B0R5nheaqajqepjuMtJfgyEh-FoixqMCoKqOyhzgYKCDOq6UIeuCSxHOoSGKgop74OgABuzbdOgABGvTXlho5GrhJpxJOP4pLulT6KoMhpJY2hzsWNF0QobqMV6LG+pc+A8BAcBiP6gSfFJ36EQgKksksKxrHamwwmY7gLKB85QjBzoAWxdZdL0FnfARST8ooLC7qoTnWBU4pyC5ViVMKBQaHUDQuM4fm3EGhJBWaU7-CysEAUp3LpEpWw0WYRw2LmqzgqciIsCxWUdI2zaXlAbYdt2PZ5dJ1n5jY2iJY1ikOIcMJHCyUWHC62hRZkUVNPKta3Kh56wJ1-VWUyzhFc64JWJCtQNBBzhQW4cHwbsrVKpxPF8YJgV4ZZIWIKkiKiiNSkqZYWjzCWaQ5hFh0AcCuR3QoR74qUknBRmzholpv3OkpRQNNRpTzaKTWKbIWR5FDxm9AIkA7e9skUYCWayLILBZGoLkUSKbIyIdpxHPoyTeN4QA */
      // You can use the XState extension for VS Code to visualize this machine.
      // Or, you can see this static visualization (last updated April 2024): https://stately.ai/registry/editor/d7af9b58-c518-44f1-9c36-92a238b04a7a?machineId=91c387e7-0f01-42c9-a21d-293e9bf95bb7
      initial: "idle",
      context: { documentId, doc },
      on: {
        UPDATE: { actions: "onUpdate" },
        UNLOAD: ".unloaded",
        DELETE: ".deleted"
      },
      states: {
        idle: {
          on: {
            BEGIN: "loading"
          }
        },
        loading: {
          on: {
            REQUEST: "requesting",
            DOC_READY: "ready"
          },
          after: { [delay]: "unavailable" }
        },
        requesting: {
          on: {
            DOC_UNAVAILABLE: "unavailable",
            DOC_READY: "ready"
          },
          after: { [delay]: "unavailable" }
        },
        unavailable: {
          entry: "onUnavailable",
          on: { DOC_READY: "ready" }
        },
        ready: {},
        unloaded: {
          entry: "onUnload",
          on: {
            RELOAD: "loading"
          }
        },
        deleted: { entry: "onDelete", type: "final" }
      }
    });
    this.#machine = (0, import_xstate_cjs.createActor)(machine);
    this.#machine.subscribe((state) => {
      const before = this.#prevDocState;
      const after = state.context.doc;
      this.#log(`\u2192 ${state.value} %o`, after);
      this.#checkForChanges(before, after);
    });
    this.#machine.start();
    this.begin();
  }
  // PRIVATE
  /** Returns the current document, regardless of state */
  get #doc() {
    return this.#machine?.getSnapshot().context.doc;
  }
  /** Returns the docHandle's state (READY, etc.) */
  get #state() {
    return this.#machine?.getSnapshot().value;
  }
  /**
   * Returns a promise that resolves when the docHandle is in one of the given states
   *
   * @param awaitStates - HandleState or HandleStates to wait for
   * @param signal - Optional AbortSignal to cancel the waiting operation
   */
  #statePromise(awaitStates, options) {
    const awaitStatesArray = Array.isArray(awaitStates) ? awaitStates : [awaitStates];
    return (0, import_xstate_cjs.waitFor)(
      this.#machine,
      (s) => awaitStatesArray.some((state) => s.matches(state)),
      // use a longer delay here so as not to race with other delays
      { timeout: this.#timeoutDelay * 2, ...options }
    );
  }
  /**
   * Update the document with whatever the result of callback is
   *
   * This is necessary instead of directly calling
   * `this.#machine.send({ type: UPDATE, payload: { callback } })` because we
   * want to catch any exceptions that the callback might throw, then rethrow
   * them after the state machine has processed the update.
   */
  #sendUpdate(callback) {
    let thrownException = null;
    this.#machine.send({
      type: UPDATE,
      payload: {
        callback: (doc) => {
          try {
            return callback(doc);
          } catch (e) {
            thrownException = e;
            return doc;
          }
        }
      }
    });
    if (thrownException) {
      throw thrownException;
    }
  }
  /**
   * Called after state transitions. If the document has changed, emits a change event. If we just
   * received the document for the first time, signal that our request has been completed.
   */
  #checkForChanges(before, after) {
    const beforeHeads = implementation_exports.getHeads(before);
    const afterHeads = implementation_exports.getHeads(after);
    const docChanged = !headsAreSame(encodeHeads(afterHeads), encodeHeads(beforeHeads));
    if (docChanged) {
      this.emit("heads-changed", { handle: this, doc: after });
      const patches = implementation_exports.diff(after, beforeHeads, afterHeads);
      if (patches.length > 0) {
        this.emit("change", {
          handle: this,
          doc: after,
          patches,
          // TODO: pass along the source (load/change/network)
          patchInfo: { before, after, source: "change" }
        });
      }
      if (!this.isReady())
        this.#machine.send({ type: DOC_READY });
    }
    this.#prevDocState = after;
  }
  // PUBLIC
  /** Our documentId in Automerge URL form.
   */
  get url() {
    return stringifyAutomergeUrl({
      documentId: this.documentId,
      heads: this.#fixedHeads
    });
  }
  /**
   * @returns true if the document is ready for accessing or changes.
   *
   * Note that for documents already stored locally this occurs before synchronization with any
   * peers. We do not currently have an equivalent `whenSynced()`.
   */
  isReady = () => this.inState(["ready"]);
  /**
   * @returns true if the document has been unloaded.
   *
   * Unloaded documents are freed from memory but not removed from local storage. It's not currently
   * possible at runtime to reload an unloaded document.
   */
  isUnloaded = () => this.inState(["unloaded"]);
  /**
   * @returns true if the document has been marked as deleted.
   *
   * Deleted documents are removed from local storage and the sync process. It's not currently
   * possible at runtime to undelete a document.
   */
  isDeleted = () => this.inState(["deleted"]);
  /**
   * @returns true if the document is currently unavailable.
   *
   * This will be the case if the document is not found in storage and no peers have shared it with us.
   */
  isUnavailable = () => this.inState(["unavailable"]);
  /**
   * @returns true if the handle is in one of the given states.
   */
  inState = (states) => states.some((s) => this.#machine.getSnapshot().matches(s));
  /** @hidden */
  get state() {
    return this.#machine.getSnapshot().value;
  }
  /**
   * Returns promise that resolves when document is in one of the given states (default is 'ready' state)
   *
   * Use this to block until the document handle has finished loading. The async equivalent to
   * checking `inState()`.
   *
   * @param awaitStates - HandleState or HandleStates to wait for
   * @param signal - Optional AbortSignal to cancel the waiting operation
   * @returns a promise that resolves when the document is in one of the given states (if no states
   * are passed, when the document is ready)
   */
  async whenReady(awaitStates = ["ready"], options) {
    try {
      await withTimeout(this.#statePromise(awaitStates, options), this.#timeoutDelay);
    } catch (error) {
      if (isAbortErrorLike(error)) {
        throw new AbortError();
      }
      console.log(`error waiting for ${this.documentId} to be in one of states: ${awaitStates.join(", ")}`);
      throw error;
    }
  }
  /**
   * Returns the current state of the Automerge document this handle manages.
   *
   * @returns the current document
   * @throws on deleted and unavailable documents
   *
   */
  doc() {
    if (!this.isReady())
      throw new Error("DocHandle is not ready");
    if (this.#fixedHeads) {
      return implementation_exports.view(this.#doc, decodeHeads(this.#fixedHeads));
    }
    return this.#doc;
  }
  /**
   *
   * @deprecated */
  docSync() {
    console.warn("docSync is deprecated. Use doc() instead. This function will be removed as part of the 2.0 release.");
    return this.doc();
  }
  /**
   * Returns the current "heads" of the document, akin to a git commit.
   * This precisely defines the state of a document.
   * @returns the current document's heads, or undefined if the document is not ready
   */
  heads() {
    if (!this.isReady())
      throw new Error("DocHandle is not ready");
    if (this.#fixedHeads) {
      return this.#fixedHeads;
    }
    return encodeHeads(implementation_exports.getHeads(this.#doc));
  }
  begin() {
    this.#machine.send({ type: BEGIN });
  }
  /**
   * Returns an array of all past "heads" for the document in topological order.
   *
   * @remarks
   * A point-in-time in an automerge document is an *array* of heads since there may be
   * concurrent edits. This API just returns a topologically sorted history of all edits
   * so every previous entry will be (in some sense) before later ones, but the set of all possible
   * history views would be quite large under concurrency (every thing in each branch against each other).
   * There might be a clever way to think about this, but we haven't found it yet, so for now at least
   * we present a single traversable view which excludes concurrency.
   * @returns UrlHeads[] - The individual heads for every change in the document. Each item is a tagged string[1].
   */
  history() {
    if (!this.isReady()) {
      return void 0;
    }
    return implementation_exports.topoHistoryTraversal(this.#doc).map((h) => encodeHeads([h]));
  }
  /**
   * Creates a fixed "view" of an automerge document at the given point in time represented
   * by the `heads` passed in. The return value is the same type as doc() and will return
   * undefined if the object hasn't finished loading.
   *
   * @remarks
   * Note that our Typescript types do not consider change over time and the current version
   * of Automerge doesn't check types at runtime, so if you go back to an old set of heads
   * that doesn't match the heads here, Typescript will not save you.
   *
   * @argument heads - The heads to view the document at. See history().
   * @returns DocHandle<T> at the time of `heads`
   */
  view(heads) {
    if (!this.isReady()) {
      throw new Error(`DocHandle#${this.documentId} is not ready. Check \`handle.isReady()\` before calling view().`);
    }
    const cacheKey = JSON.stringify(heads);
    const cachedHandle = this.#viewCache.get(cacheKey);
    if (cachedHandle) {
      return cachedHandle;
    }
    const handle2 = new _DocHandle(this.documentId, this.#refConstructor, {
      heads,
      timeoutDelay: this.#timeoutDelay
    });
    handle2.update(() => implementation_exports.clone(this.#doc));
    handle2.doneLoading();
    this.#viewCache.set(cacheKey, handle2);
    return handle2;
  }
  /**
   * Returns a set of Patch operations that will move a materialized document from one state to another
   * if applied.
   *
   * @remarks
   * We allow specifying either:
   * - Two sets of heads to compare directly
   * - A single set of heads to compare against our current heads
   * - Another DocHandle to compare against (which must share history with this document)
   *
   * @throws Error if the documents don't share history or if either document is not ready
   * @returns Automerge patches that go from one document state to the other
   */
  diff(first, second) {
    if (!this.isReady()) {
      throw new Error(`DocHandle#${this.documentId} is not ready. Check \`handle.isReady()\` before calling diff().`);
    }
    const doc = this.#doc;
    if (!doc)
      throw new Error("Document not available");
    if (first instanceof _DocHandle) {
      if (!first.isReady()) {
        throw new Error("Cannot diff against a handle that isn't ready");
      }
      const otherHeads = first.heads();
      if (!otherHeads)
        throw new Error("Other document's heads not available");
      const mergedDoc = implementation_exports.merge(implementation_exports.clone(doc), first.doc());
      return implementation_exports.diff(mergedDoc, decodeHeads(this.heads()), decodeHeads(otherHeads));
    }
    const from2 = second ? first : this.heads() || [];
    const to = second ? second : first;
    return implementation_exports.diff(doc, decodeHeads(from2), decodeHeads(to));
  }
  /**
   * `metadata(head?)` allows you to look at the metadata for a change
   * this can be used to build history graphs to find commit messages and edit times.
   * this interface.
   *
   * @remarks
   * I'm really not convinced this is the right way to surface this information so
   * I'm leaving this API "hidden".
   *
   * @hidden
   */
  metadata(change2) {
    if (!this.isReady()) {
      return void 0;
    }
    if (!change2) {
      change2 = this.heads()[0];
    }
    return implementation_exports.inspectChange(this.#doc, decodeHeads([change2])[0]) || void 0;
  }
  /**
   * `update` is called any time we have a new document state; could be
   * from a local change, a remote change, or a new document from storage.
   * Does not cause state changes.
   * @hidden
   */
  update(callback) {
    this.#sendUpdate(callback);
  }
  /**
   * `doneLoading` is called by the repo after it decides it has all the changes
   * it's going to get during setup. This might mean it was created locally,
   * or that it was loaded from storage, or that it was received from a peer.
   */
  doneLoading() {
    this.#machine.send({ type: DOC_READY });
  }
  /**
   * Called by the repo when a doc handle changes or we receive new remote heads.
   * @hidden
   */
  setSyncInfo(storageId, syncInfo) {
    this.#syncInfoByStorageId[storageId] = syncInfo;
    this.emit("remote-heads", {
      storageId,
      heads: syncInfo.lastHeads,
      timestamp: syncInfo.lastSyncTimestamp
    });
  }
  /** Returns the heads of the storageId.
   *
   * @deprecated Use getSyncInfo instead.
   */
  getRemoteHeads(storageId) {
    return this.#syncInfoByStorageId[storageId]?.lastHeads;
  }
  /** Returns the heads and the timestamp of the last update for the storageId. */
  getSyncInfo(storageId) {
    return this.#syncInfoByStorageId[storageId];
  }
  /**
   * All changes to an Automerge document should be made through this method.
   * Inside the callback, the document should be treated as mutable: all edits will be recorded
   * using a Proxy and translated into operations as part of a single recorded "change".
   *
   * Note that assignment via ES6 spread operators will result in *replacing* the object
   * instead of mutating it which will prevent clean merges. This may be what you want, but
   * `doc.foo = { ...doc.foo, bar: "baz" }` is not equivalent to `doc.foo.bar = "baz"`.
   *
   * Local changes will be stored (by the StorageSubsystem) and synchronized (by the
   * DocSynchronizer) to any peers you are sharing it with.
   *
   * @param callback - A function that takes the current document and mutates it.
   *
   */
  change(callback, options = {}) {
    if (!this.isReady()) {
      throw new Error(`DocHandle#${this.documentId} is in ${this.state} and not ready. Check \`handle.isReady()\` before accessing the document.`);
    }
    if (this.#fixedHeads) {
      throw new Error(`DocHandle#${this.documentId} is in view-only mode at specific heads. Use clone() to create a new document from this state.`);
    }
    this.#sendUpdate((doc) => implementation_exports.change(doc, options, callback));
  }
  /**
   * Makes a change as if the document were at `heads`.
   *
   * @returns A set of heads representing the concurrent change that was made.
   */
  changeAt(heads, callback, options = {}) {
    if (!this.isReady()) {
      throw new Error(`DocHandle#${this.documentId} is not ready. Check \`handle.isReady()\` before accessing the document.`);
    }
    if (this.#fixedHeads) {
      throw new Error(`DocHandle#${this.documentId} is in view-only mode at specific heads. Use clone() to create a new document from this state.`);
    }
    let resultHeads = void 0;
    this.#sendUpdate((doc) => {
      const result = implementation_exports.changeAt(doc, decodeHeads(heads), options, callback);
      resultHeads = result.newHeads ? encodeHeads(result.newHeads) : void 0;
      return result.newDoc;
    });
    return resultHeads;
  }
  /**
   * Check if the document can be change()ed. Currently, documents can be
   * edited unless we are viewing a particular point in time.
   *
   * @remarks It is technically possible to back-date changes using changeAt(),
   *          but we block it for usability reasons when viewing a particular point in time.
   *          To make changes in the past, use the primary document handle with no heads set.
   *
   * @returns boolean indicating whether changes are possible
   */
  isReadOnly() {
    return !!this.#fixedHeads;
  }
  /**
   * Merges another document into this document. Any peers we are sharing changes with will be
   * notified of the changes resulting from the merge.
   *
   * @returns the merged document.
   *
   * @throws if either document is not ready or if `otherHandle` is unavailable.
   */
  merge(otherHandle) {
    if (!this.isReady() || !otherHandle.isReady()) {
      throw new Error("Both handles must be ready to merge");
    }
    if (this.#fixedHeads) {
      throw new Error(`DocHandle#${this.documentId} is in view-only mode at specific heads. Use clone() to create a new document from this state.`);
    }
    const mergingDoc = otherHandle.doc();
    this.update((doc) => {
      return implementation_exports.merge(doc, mergingDoc);
    });
  }
  /**
   * Updates the internal state machine to mark the document unavailable.
   * @hidden
   */
  unavailable() {
    this.#machine.send({ type: DOC_UNAVAILABLE });
  }
  /**
   * Called by the repo either when the document is not found in storage.
   * @hidden
   * */
  request() {
    if (this.#state === "loading")
      this.#machine.send({ type: REQUEST });
  }
  /** Called by the repo to free memory used by the document. */
  unload() {
    this.#machine.send({ type: UNLOAD });
  }
  /** Called by the repo to reuse an unloaded handle. */
  reload() {
    this.#machine.send({ type: RELOAD });
  }
  /** Called by the repo when the document is deleted. */
  delete() {
    this.#machine.send({ type: DELETE });
  }
  /**
   * Sends an arbitrary ephemeral message out to all reachable peers who would receive sync messages
   * from you. It has no guarantee of delivery, and is not persisted to the underlying automerge doc
   * in any way. Messages will have a sending PeerId but this is *not* a useful user identifier (a
   * user could have multiple tabs open and would appear as multiple PeerIds). Every message source
   * must have a unique PeerId.
   */
  broadcast(message) {
    this.emit("ephemeral-message-outbound", {
      handle: this,
      data: new Uint8Array(encode2(message))
    });
  }
  metrics() {
    return implementation_exports.stats(this.#doc);
  }
  /**
   * Create a ref to a location in this document.
   *
   * Returns the same ref instance for the same path, ensuring referential equality.
   *
   * @experimental This API is experimental and may change in future versions.
   *
   * @example
   * ```ts
   * const titleRef = handle.ref('todos', 0, 'title');
   * titleRef.value(); // string | undefined
   *
   * // Same ref instance is returned for same path
   * const sameRef = handle.ref('todos', 0, 'title');
   * titleRef === sameRef; // true
   * ```
   */
  ref(...segments) {
    const cacheKey = this.#pathToCacheKey(segments);
    const existingRef = this.#refCache.get(cacheKey)?.deref();
    if (existingRef) {
      return existingRef;
    }
    const newRef = this.#refConstructor(this, segments);
    this.#refCache.set(cacheKey, new WeakRef(newRef));
    return newRef;
  }
  /**
   * Create a stable cache key from path segments.
   * Serializes the path to a string for comparison.
   */
  #pathToCacheKey(segments) {
    return segments.map((seg) => {
      if (typeof seg === "string")
        return `s:${seg}`;
      if (typeof seg === "number")
        return `n:${seg}`;
      if (typeof seg === "object" && seg !== null) {
        return `o:${JSON.stringify(seg)}`;
      }
      return `?:${String(seg)}`;
    }).join("/");
  }
};
var HandleState = {
  /** The handle has been created but not yet loaded or requested */
  IDLE: "idle",
  /** We are waiting for storage to finish loading */
  LOADING: "loading",
  /** We are waiting for someone in the network to respond to a sync request */
  REQUESTING: "requesting",
  /** The document is available */
  READY: "ready",
  /** The document has been unloaded from the handle, to free memory usage */
  UNLOADED: "unloaded",
  /** The document has been deleted from the repo */
  DELETED: "deleted",
  /** The document was not available in storage or from any connected peers */
  UNAVAILABLE: "unavailable"
};
var { IDLE, LOADING, REQUESTING, READY, UNLOADED, DELETED, UNAVAILABLE } = HandleState;
var BEGIN = "BEGIN";
var REQUEST = "REQUEST";
var DOC_READY = "DOC_READY";
var UPDATE = "UPDATE";
var UNLOAD = "UNLOAD";
var RELOAD = "RELOAD";
var DELETE = "DELETE";
var DOC_UNAVAILABLE = "DOC_UNAVAILABLE";

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/Repo.js
var import_debug7 = __toESM(require_browser(), 1);

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/RemoteHeadsSubscriptions.js
var import_debug2 = __toESM(require_browser(), 1);
var RemoteHeadsSubscriptions = class extends import_index.default {
  // Last known heads and timestamp for each storageId that we know about
  #syncInfoByDocId = /* @__PURE__ */ new Map();
  // Storage IDs we have subscribed to via Repo.subscribeToRemoteHeads
  #ourSubscriptions = /* @__PURE__ */ new Set();
  // Storage IDs other peers have subscribed to by sending us a control message
  #theirSubscriptions = /* @__PURE__ */ new Map();
  // Peers we will always share remote heads with even if they are not subscribed
  #generousPeers = /* @__PURE__ */ new Set();
  // Documents each peer has open, we need this information so we only send remote heads of documents that the peer knows
  #subscribedDocsByPeer = /* @__PURE__ */ new Map();
  #log = (0, import_debug2.default)("automerge-repo:remote-heads-subscriptions");
  subscribeToRemotes(remotes) {
    this.#log("subscribeToRemotes", remotes);
    const remotesToAdd = [];
    for (const remote of remotes) {
      if (!this.#ourSubscriptions.has(remote)) {
        this.#ourSubscriptions.add(remote);
        remotesToAdd.push(remote);
      }
    }
    if (remotesToAdd.length > 0) {
      this.emit("change-remote-subs", {
        add: remotesToAdd,
        peers: Array.from(this.#generousPeers)
      });
    }
  }
  unsubscribeFromRemotes(remotes) {
    this.#log("subscribeToRemotes", remotes);
    const remotesToRemove = [];
    for (const remote of remotes) {
      if (this.#ourSubscriptions.has(remote)) {
        this.#ourSubscriptions.delete(remote);
        if (!this.#theirSubscriptions.has(remote)) {
          remotesToRemove.push(remote);
        }
      }
    }
    if (remotesToRemove.length > 0) {
      this.emit("change-remote-subs", {
        remove: remotesToRemove,
        peers: Array.from(this.#generousPeers)
      });
    }
  }
  handleControlMessage(control) {
    const remotesToAdd = [];
    const remotesToRemove = [];
    const addedRemotesWeKnow = [];
    this.#log("handleControlMessage", control);
    if (control.add) {
      for (const remote of control.add) {
        let theirSubs = this.#theirSubscriptions.get(remote);
        if (this.#ourSubscriptions.has(remote) || theirSubs) {
          addedRemotesWeKnow.push(remote);
        }
        if (!theirSubs) {
          theirSubs = /* @__PURE__ */ new Set();
          this.#theirSubscriptions.set(remote, theirSubs);
          if (!this.#ourSubscriptions.has(remote)) {
            remotesToAdd.push(remote);
          }
        }
        theirSubs.add(control.senderId);
      }
    }
    if (control.remove) {
      for (const remote of control.remove) {
        const theirSubs = this.#theirSubscriptions.get(remote);
        if (theirSubs) {
          theirSubs.delete(control.senderId);
          if (theirSubs.size == 0 && !this.#ourSubscriptions.has(remote)) {
            remotesToRemove.push(remote);
          }
        }
      }
    }
    if (remotesToAdd.length > 0 || remotesToRemove.length > 0) {
      this.emit("change-remote-subs", {
        peers: Array.from(this.#generousPeers),
        add: remotesToAdd,
        remove: remotesToRemove
      });
    }
    for (const remote of addedRemotesWeKnow) {
      const subscribedDocs = this.#subscribedDocsByPeer.get(control.senderId);
      if (subscribedDocs) {
        for (const documentId of subscribedDocs) {
          const syncInfo = this.#syncInfoByDocId.get(documentId);
          if (!syncInfo) {
            continue;
          }
          const syncInfoForRemote = syncInfo.get(remote);
          if (syncInfoForRemote) {
            this.emit("notify-remote-heads", {
              targetId: control.senderId,
              documentId,
              heads: syncInfoForRemote.lastHeads,
              timestamp: syncInfoForRemote.lastSyncTimestamp,
              storageId: remote
            });
          }
        }
      }
    }
  }
  /** A peer we are not directly connected to has changed their heads */
  handleRemoteHeads(msg) {
    this.#log("handleRemoteHeads", msg);
    const changedHeads = this.#changedHeads(msg);
    for (const event of changedHeads) {
      if (this.#ourSubscriptions.has(event.storageId)) {
        this.emit("remote-heads-changed", event);
      }
    }
    for (const event of changedHeads) {
      for (const peer of this.#generousPeers) {
        if (peer === msg.senderId) {
          continue;
        }
        this.emit("notify-remote-heads", {
          targetId: peer,
          documentId: event.documentId,
          heads: event.remoteHeads,
          timestamp: event.timestamp,
          storageId: event.storageId
        });
      }
    }
    for (const event of changedHeads) {
      const theirSubs = this.#theirSubscriptions.get(event.storageId);
      if (theirSubs) {
        for (const peerId of theirSubs) {
          if (this.#isPeerSubscribedToDoc(peerId, event.documentId)) {
            this.emit("notify-remote-heads", {
              targetId: peerId,
              documentId: event.documentId,
              heads: event.remoteHeads,
              timestamp: event.timestamp,
              storageId: event.storageId
            });
          }
        }
      }
    }
  }
  /** A peer we are directly connected to has updated their heads */
  handleImmediateRemoteHeadsChanged(documentId, storageId, heads) {
    this.#log("handleLocalHeadsChanged", documentId, storageId, heads);
    const remote = this.#syncInfoByDocId.get(documentId);
    const timestamp = Date.now();
    if (!remote) {
      this.#syncInfoByDocId.set(documentId, /* @__PURE__ */ new Map([
        [storageId, { lastSyncTimestamp: timestamp, lastHeads: heads }]
      ]));
    } else {
      const docRemote = remote.get(storageId);
      if (!docRemote || docRemote.lastSyncTimestamp < Date.now()) {
        remote.set(storageId, {
          lastSyncTimestamp: Date.now(),
          lastHeads: heads
        });
      }
    }
    const theirSubs = this.#theirSubscriptions.get(storageId);
    if (theirSubs) {
      for (const peerId of theirSubs) {
        if (this.#isPeerSubscribedToDoc(peerId, documentId)) {
          this.emit("notify-remote-heads", {
            targetId: peerId,
            documentId,
            heads,
            timestamp,
            storageId
          });
        }
      }
    }
  }
  addGenerousPeer(peerId) {
    this.#log("addGenerousPeer", peerId);
    this.#generousPeers.add(peerId);
    if (this.#ourSubscriptions.size > 0) {
      this.emit("change-remote-subs", {
        add: Array.from(this.#ourSubscriptions),
        peers: [peerId]
      });
    }
    for (const [documentId, remote] of this.#syncInfoByDocId) {
      for (const [storageId, { lastHeads, lastSyncTimestamp }] of remote) {
        this.emit("notify-remote-heads", {
          targetId: peerId,
          documentId,
          heads: lastHeads,
          timestamp: lastSyncTimestamp,
          storageId
        });
      }
    }
  }
  removePeer(peerId) {
    this.#log("removePeer", peerId);
    const remotesToRemove = [];
    this.#generousPeers.delete(peerId);
    this.#subscribedDocsByPeer.delete(peerId);
    for (const [storageId, peerIds] of this.#theirSubscriptions) {
      if (peerIds.has(peerId)) {
        peerIds.delete(peerId);
        if (peerIds.size == 0) {
          remotesToRemove.push(storageId);
          this.#theirSubscriptions.delete(storageId);
        }
      }
    }
    if (remotesToRemove.length > 0) {
      this.emit("change-remote-subs", {
        remove: remotesToRemove,
        peers: Array.from(this.#generousPeers)
      });
    }
  }
  subscribePeerToDoc(peerId, documentId) {
    let subscribedDocs = this.#subscribedDocsByPeer.get(peerId);
    if (!subscribedDocs) {
      subscribedDocs = /* @__PURE__ */ new Set();
      this.#subscribedDocsByPeer.set(peerId, subscribedDocs);
    }
    subscribedDocs.add(documentId);
    const remoteHeads = this.#syncInfoByDocId.get(documentId);
    if (remoteHeads) {
      for (const [storageId, lastHeads] of remoteHeads) {
        const subscribedPeers = this.#theirSubscriptions.get(storageId);
        if (subscribedPeers && subscribedPeers.has(peerId)) {
          this.emit("notify-remote-heads", {
            targetId: peerId,
            documentId,
            heads: lastHeads.lastHeads,
            timestamp: lastHeads.lastSyncTimestamp,
            storageId
          });
        }
      }
    }
  }
  #isPeerSubscribedToDoc(peerId, documentId) {
    const subscribedDocs = this.#subscribedDocsByPeer.get(peerId);
    return subscribedDocs && subscribedDocs.has(documentId);
  }
  /** Returns the (document, storageId) pairs which have changed after processing msg */
  #changedHeads(msg) {
    const changedHeads = [];
    const { documentId, newHeads } = msg;
    for (const [storageId, { heads, timestamp }] of Object.entries(newHeads)) {
      if (!this.#ourSubscriptions.has(storageId) && !this.#theirSubscriptions.has(storageId)) {
        continue;
      }
      let remote = this.#syncInfoByDocId.get(documentId);
      if (!remote) {
        remote = /* @__PURE__ */ new Map();
        this.#syncInfoByDocId.set(documentId, remote);
      }
      const docRemote = remote.get(storageId);
      if (docRemote && docRemote.lastSyncTimestamp >= timestamp) {
        continue;
      } else {
        remote.set(storageId, {
          lastSyncTimestamp: timestamp,
          lastHeads: heads
        });
        changedHeads.push({
          documentId,
          storageId,
          remoteHeads: heads,
          timestamp
        });
      }
    }
    return changedHeads;
  }
};

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/helpers/throttle.js
var asyncThrottle = (fn, delay) => {
  let lastCall = Date.now();
  let timeout;
  let currentPromise;
  return async function(...args) {
    if (currentPromise) {
      try {
        await currentPromise;
      } catch {
      }
    }
    if (timeout) {
      clearTimeout(timeout);
    }
    const wait = lastCall + delay - Date.now();
    return new Promise((resolve, reject) => {
      timeout = setTimeout(async () => {
        try {
          currentPromise = fn(...args);
          resolve(await currentPromise);
        } catch (error) {
          reject(error);
        } finally {
          lastCall = Date.now();
          currentPromise = void 0;
          timeout = void 0;
        }
      }, wait);
    });
  };
};

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/network/NetworkSubsystem.js
var import_debug3 = __toESM(require_browser(), 1);

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/network/messages.js
var isRepoMessage = (message) => isSyncMessage(message) || isEphemeralMessage(message) || isRequestMessage(message) || isDocumentUnavailableMessage(message) || isRemoteSubscriptionControlMessage(message) || isRemoteHeadsChanged(message);
var isDocumentUnavailableMessage = (msg) => msg.type === "doc-unavailable";
var isRequestMessage = (msg) => msg.type === "request";
var isSyncMessage = (msg) => msg.type === "sync";
var isEphemeralMessage = (msg) => msg.type === "ephemeral";
var isRemoteSubscriptionControlMessage = (msg) => msg.type === "remote-subscription-change";
var isRemoteHeadsChanged = (msg) => msg.type === "remote-heads-changed";

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/network/NetworkSubsystem.js
var getEphemeralMessageSource = (message) => `${message.senderId}:${message.sessionId}`;
var NetworkSubsystem = class extends import_index.default {
  peerId;
  peerMetadata;
  #log;
  #adaptersByPeer = {};
  #count = 0;
  #sessionId = Math.random().toString(36).slice(2);
  #ephemeralSessionCounts = {};
  adapters = [];
  constructor(adapters, peerId, peerMetadata) {
    super();
    this.peerId = peerId;
    this.peerMetadata = peerMetadata;
    this.#log = (0, import_debug3.default)(`automerge-repo:network:${this.peerId}`);
    adapters.forEach((a) => this.addNetworkAdapter(a));
  }
  disconnect() {
    this.adapters.forEach((a) => a.disconnect());
  }
  reconnect() {
    this.adapters.forEach((a) => a.connect(this.peerId));
  }
  addNetworkAdapter(networkAdapter) {
    this.adapters.push(networkAdapter);
    networkAdapter.on("peer-candidate", ({ peerId, peerMetadata }) => {
      this.#log(`peer candidate: ${peerId} `);
      if (!this.#adaptersByPeer[peerId]) {
        this.#adaptersByPeer[peerId] = networkAdapter;
      }
      this.emit("peer", { peerId, peerMetadata });
    });
    networkAdapter.on("peer-disconnected", ({ peerId }) => {
      this.#log(`peer disconnected: ${peerId} `);
      delete this.#adaptersByPeer[peerId];
      this.emit("peer-disconnected", { peerId });
    });
    networkAdapter.on("message", (msg) => {
      if (!isRepoMessage(msg)) {
        this.#log(`invalid message: ${JSON.stringify(msg)}`);
        return;
      }
      this.#log(`message from ${msg.senderId}`);
      if (isEphemeralMessage(msg)) {
        const source = getEphemeralMessageSource(msg);
        if (this.#ephemeralSessionCounts[source] === void 0 || msg.count > this.#ephemeralSessionCounts[source]) {
          this.#ephemeralSessionCounts[source] = msg.count;
          this.emit("message", msg);
        }
        return;
      }
      this.emit("message", msg);
    });
    networkAdapter.on("close", () => {
      this.#log("adapter closed");
      Object.entries(this.#adaptersByPeer).forEach(([peerId, other]) => {
        if (other === networkAdapter) {
          delete this.#adaptersByPeer[peerId];
        }
      });
      this.adapters = this.adapters.filter((a) => a !== networkAdapter);
    });
    this.peerMetadata.then((peerMetadata) => {
      networkAdapter.connect(this.peerId, peerMetadata);
    }).catch((err) => {
      this.#log("error connecting to network", err);
    });
  }
  // TODO: this probably introduces a race condition for the ready event
  // but I plan to refactor that as part of this branch in another patch
  removeNetworkAdapter(networkAdapter) {
    this.adapters = this.adapters.filter((a) => a !== networkAdapter);
    networkAdapter.disconnect();
  }
  send(message) {
    const peer = this.#adaptersByPeer[message.targetId];
    if (!peer) {
      this.#log(`Tried to send message but peer not found: ${message.targetId}`);
      return;
    }
    const prepareMessage = (message2) => {
      if (message2.type === "ephemeral") {
        if ("count" in message2) {
          return message2;
        } else {
          return {
            ...message2,
            count: ++this.#count,
            sessionId: this.#sessionId,
            senderId: this.peerId
          };
        }
      } else {
        return {
          ...message2,
          senderId: this.peerId
        };
      }
    };
    const outbound = prepareMessage(message);
    this.#log("sending message %o", outbound);
    peer.send(outbound);
  }
  isReady = () => {
    return this.adapters.every((a) => a.isReady());
  };
  whenReady = async () => {
    return Promise.all(this.adapters.map((a) => a.whenReady()));
  };
};

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/storage/StorageSubsystem.js
var import_debug4 = __toESM(require_browser(), 1);

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/helpers/mergeArrays.js
function mergeArrays(myArrays) {
  let length = 0;
  myArrays.forEach((item) => {
    length += item.length;
  });
  const mergedArray = new Uint8Array(length);
  let offset = 0;
  myArrays.forEach((item) => {
    mergedArray.set(item, offset);
    offset += item.length;
  });
  return mergedArray;
}

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/storage/keyHash.js
var sha2562 = __toESM(require_sha2562(), 1);
function keyHash(binary) {
  const hash2 = sha2562.hash(binary);
  return bufferToHexString(hash2);
}
function headsHash(heads) {
  const encoder = new TextEncoder();
  const headsbinary = mergeArrays(heads.map((h) => encoder.encode(h)));
  return keyHash(headsbinary);
}
function bufferToHexString(data) {
  return Array.from(data, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/storage/SavedHeads.js
var SavedHeads = class {
  #seq = 0;
  #data = /* @__PURE__ */ new Map();
  /**
   * Get the last saved heads for a document
   */
  lastSavedHeads(documentId) {
    return new HeadsHandle(documentId, ++this.#seq, this.#data);
  }
};
var HeadsHandle = class {
  #documentId;
  #seq;
  #storedHeads;
  #appliedHeads = null;
  constructor(documentId, seq, storedHeads) {
    this.#documentId = documentId;
    this.#seq = seq;
    this.#storedHeads = storedHeads;
  }
  get value() {
    return this.#storedHeads.get(this.#documentId)?.heads ?? null;
  }
  update(newHeads) {
    if (this.#appliedHeads && !headsAreSame(encodeHeads(newHeads), encodeHeads(this.#appliedHeads))) {
      throw new Error("attempting to reuase a heads update with different heads");
    }
    this.#appliedHeads = newHeads;
    const currentSeq = this.#storedHeads.get(this.#documentId)?.seq ?? 0;
    if (this.#seq >= currentSeq) {
      this.#storedHeads.set(this.#documentId, {
        heads: newHeads,
        seq: this.#seq
      });
    }
  }
};

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/storage/StorageSubsystem.js
var StorageSubsystem = class extends import_index.default {
  /** The storage adapter to use for saving and loading documents */
  #storageAdapter;
  /** Record of the latest heads we've loaded or saved for each document  */
  #storedHeads = new SavedHeads();
  /** Metadata on the chunks we've already loaded for each document */
  #chunkInfos = /* @__PURE__ */ new Map();
  /** Flag to avoid compacting when a compaction is already underway */
  #compacting = false;
  #log = (0, import_debug4.default)(`automerge-repo:storage-subsystem`);
  constructor(storageAdapter) {
    super();
    this.#storageAdapter = storageAdapter;
  }
  async id() {
    const storedId = await this.#storageAdapter.load(["storage-adapter-id"]);
    let id;
    if (storedId) {
      id = new TextDecoder().decode(storedId);
    } else {
      id = v4_default();
      await this.#storageAdapter.save(["storage-adapter-id"], new TextEncoder().encode(id));
    }
    return id;
  }
  // ARBITRARY KEY/VALUE STORAGE
  // The `load`, `save`, and `remove` methods are for generic key/value storage, as opposed to
  // Automerge documents. For example, they're used by the LocalFirstAuthProvider to persist the
  // encrypted team graph that encodes group membership and permissions.
  //
  // The namespace parameter is to prevent collisions with other users of the storage subsystem.
  // Typically this will be the name of the plug-in, adapter, or other system that is using it. For
  // example, the LocalFirstAuthProvider uses the namespace `LocalFirstAuthProvider`.
  /** Loads a value from storage. */
  async load(namespace, key) {
    const storageKey = [namespace, key];
    return await this.#storageAdapter.load(storageKey);
  }
  /** Saves a value in storage. */
  async save(namespace, key, data) {
    const storageKey = [namespace, key];
    await this.#storageAdapter.save(storageKey, data);
  }
  /** Removes a value from storage. */
  async remove(namespace, key) {
    const storageKey = [namespace, key];
    await this.#storageAdapter.remove(storageKey);
  }
  // AUTOMERGE DOCUMENT STORAGE
  /**
   * Loads and combines document chunks from storage, with snapshots first.
   */
  async loadDocData(documentId) {
    const snapshotChunks = await this.#storageAdapter.loadRange([
      documentId,
      "snapshot"
    ]);
    const incrementalChunks = await this.#storageAdapter.loadRange([
      documentId,
      "incremental"
    ]);
    const binaries = [];
    const chunkInfos = [];
    for (const chunk of snapshotChunks) {
      if (chunk.data === void 0)
        continue;
      chunkInfos.push({
        key: chunk.key,
        type: "snapshot",
        size: chunk.data.length
      });
      binaries.push(chunk.data);
    }
    for (const chunk of incrementalChunks) {
      if (chunk.data === void 0)
        continue;
      chunkInfos.push({
        key: chunk.key,
        type: "incremental",
        size: chunk.data.length
      });
      binaries.push(chunk.data);
    }
    this.#chunkInfos.set(documentId, chunkInfos);
    if (binaries.length === 0) {
      return null;
    }
    return mergeArrays(binaries);
  }
  /**
   * Loads the Automerge document with the given ID from storage.
   */
  async loadDoc(documentId) {
    const headsHandle = this.#storedHeads.lastSavedHeads(documentId);
    const binary = await this.loadDocData(documentId);
    if (!binary)
      return null;
    const start = performance.now();
    const newDoc = implementation_exports.loadIncremental(implementation_exports.init(), binary);
    const end = performance.now();
    this.emit("document-loaded", {
      documentId,
      durationMillis: end - start,
      ...implementation_exports.stats(newDoc)
    });
    headsHandle.update(implementation_exports.getHeads(newDoc));
    return newDoc;
  }
  /**
   * Saves the provided Automerge document to storage.
   *
   * @remarks
   * Under the hood this makes incremental saves until the incremental size is greater than the
   * snapshot size, at which point the document is compacted into a single snapshot.
   */
  async saveDoc(documentId, doc) {
    if (!this.#shouldSave(documentId, doc))
      return;
    const sourceChunks = this.#chunkInfos.get(documentId) ?? [];
    if (this.#shouldCompact(sourceChunks)) {
      await this.#saveTotal(documentId, doc, sourceChunks);
    } else {
      await this.#saveIncremental(documentId, doc);
    }
  }
  /**
   * Removes the Automerge document with the given ID from storage
   */
  async removeDoc(documentId) {
    await this.#storageAdapter.removeRange([documentId, "snapshot"]);
    await this.#storageAdapter.removeRange([documentId, "incremental"]);
    await this.#storageAdapter.removeRange([documentId, "sync-state"]);
  }
  /**
   * Saves just the incremental changes since the last save.
   */
  async #saveIncremental(documentId, doc) {
    const headsHandle = this.#storedHeads.lastSavedHeads(documentId);
    const sinceHeads = headsHandle.value;
    if (!sinceHeads || sinceHeads.length === 0) {
      await this.#saveTotal(documentId, doc, this.#chunkInfos.get(documentId) ?? []);
      return;
    }
    const start = performance.now();
    const binary = implementation_exports.saveSince(doc, sinceHeads);
    const end = performance.now();
    this.emit("doc-saved", {
      documentId,
      durationMillis: end - start,
      sinceHeads,
      savedHeads: implementation_exports.getHeads(doc)
    });
    if (binary && binary.length > 0) {
      const key = [documentId, "incremental", keyHash(binary)];
      this.#log(`Saving incremental ${key} for document ${documentId}`);
      await this.#storageAdapter.save(key, binary);
      if (!this.#chunkInfos.has(documentId)) {
        this.#chunkInfos.set(documentId, []);
      }
      this.#chunkInfos.get(documentId).push({
        key,
        type: "incremental",
        size: binary.length
      });
      headsHandle.update(implementation_exports.getHeads(doc));
    } else {
      return Promise.resolve();
    }
  }
  /**
   * Compacts the document storage into a single shapshot.
   */
  async #saveTotal(documentId, doc, sourceChunks) {
    this.#compacting = true;
    const headsHandle = this.#storedHeads.lastSavedHeads(documentId);
    const start = performance.now();
    const binary = implementation_exports.save(doc);
    const end = performance.now();
    this.emit("doc-compacted", {
      documentId,
      durationMillis: end - start,
      savedHeads: implementation_exports.getHeads(doc)
    });
    const snapshotHash = headsHash(implementation_exports.getHeads(doc));
    const key = [documentId, "snapshot", snapshotHash];
    const oldKeys = new Set(sourceChunks.map((c) => c.key).filter((k) => k[2] !== snapshotHash));
    this.#log(`Saving snapshot ${key} for document ${documentId}`);
    this.#log(`deleting old chunks ${Array.from(oldKeys)}`);
    await this.#storageAdapter.save(key, binary);
    for (const key2 of oldKeys) {
      await this.#storageAdapter.remove(key2);
    }
    const newChunkInfos = this.#chunkInfos.get(documentId)?.filter((c) => !oldKeys.has(c.key)) ?? [];
    newChunkInfos.push({ key, type: "snapshot", size: binary.length });
    this.#chunkInfos.set(documentId, newChunkInfos);
    headsHandle.update(implementation_exports.getHeads(doc));
    this.#compacting = false;
  }
  async loadSyncState(documentId, storageId) {
    const key = [documentId, "sync-state", storageId];
    try {
      const loaded = await this.#storageAdapter.load(key);
      return loaded ? implementation_exports.decodeSyncState(loaded) : void 0;
    } catch (e) {
      this.#log(`Error loading sync state for ${documentId} from ${storageId}`);
      return void 0;
    }
  }
  async saveSyncState(documentId, storageId, syncState) {
    const key = [documentId, "sync-state", storageId];
    await this.#storageAdapter.save(key, implementation_exports.encodeSyncState(syncState));
  }
  /**
   * Returns true if the document has changed since the last time it was saved.
   */
  #shouldSave(documentId, doc) {
    const oldHeads = this.#storedHeads.lastSavedHeads(documentId).value;
    if (!oldHeads) {
      return true;
    }
    const newHeads = implementation_exports.getHeads(doc);
    if (headsAreSame(encodeHeads(newHeads), encodeHeads(oldHeads))) {
      return false;
    }
    return true;
  }
  /**
   * We only compact if the incremental size is greater than the snapshot size.
   */
  #shouldCompact(sourceChunks) {
    if (this.#compacting)
      return false;
    let snapshotSize = 0;
    let incrementalSize = 0;
    for (const chunk of sourceChunks) {
      if (chunk.type === "snapshot") {
        snapshotSize += chunk.size;
      } else {
        incrementalSize += chunk.size;
      }
    }
    return snapshotSize < 1024 || incrementalSize >= snapshotSize;
  }
};

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/synchronizer/CollectionSynchronizer.js
var import_debug6 = __toESM(require_browser(), 1);

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/synchronizer/DocSynchronizer.js
var import_debug5 = __toESM(require_browser(), 1);

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/synchronizer/Synchronizer.js
var Synchronizer = class extends import_index.default {
};

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/synchronizer/DocSynchronizer.js
var DocSynchronizer = class extends Synchronizer {
  #log;
  syncDebounceRate = 100;
  /** Active peers */
  #peers = [];
  #pendingSyncStateCallbacks = {};
  #peerDocumentStatuses = {};
  /** Sync state for each peer we've communicated with (including inactive peers) */
  #syncStates = {};
  #pendingSyncMessages = [];
  // We keep this around at least in part for debugging.
  // eslint-disable-next-line no-unused-private-class-members
  #peerId;
  #syncStarted = false;
  #handle;
  #onLoadSyncState;
  constructor({ handle: handle2, peerId, onLoadSyncState }) {
    super();
    this.#peerId = peerId;
    this.#handle = handle2;
    this.#onLoadSyncState = onLoadSyncState ?? (() => Promise.resolve(void 0));
    const docId = handle2.documentId.slice(0, 5);
    this.#log = (0, import_debug5.default)(`automerge-repo:docsync:${docId}`);
    handle2.on("change", asyncThrottle(() => this.#syncWithPeers(), this.syncDebounceRate));
    handle2.on("ephemeral-message-outbound", (payload) => this.#broadcastToPeers(payload));
    void (async () => {
      this.#processAllPendingSyncMessages();
    })();
  }
  get peerStates() {
    return this.#peerDocumentStatuses;
  }
  get documentId() {
    return this.#handle.documentId;
  }
  /// PRIVATE
  async #syncWithPeers() {
    try {
      await this.#handle.whenReady();
      const doc = this.#handle.doc();
      this.#peers.forEach((peerId) => this.#sendSyncMessage(peerId, doc));
    } catch (e) {
      console.log("sync with peers threw an exception");
    }
  }
  async #broadcastToPeers({ data }) {
    this.#log(`broadcastToPeers`, this.#peers);
    this.#peers.forEach((peerId) => this.#sendEphemeralMessage(peerId, data));
  }
  #sendEphemeralMessage(peerId, data) {
    this.#log(`sendEphemeralMessage ->${peerId}`);
    const message = {
      type: "ephemeral",
      targetId: peerId,
      documentId: this.#handle.documentId,
      data
    };
    this.emit("message", message);
  }
  #withSyncState(peerId, callback) {
    this.#addPeer(peerId);
    if (!(peerId in this.#peerDocumentStatuses)) {
      this.#peerDocumentStatuses[peerId] = "unknown";
    }
    const syncState = this.#syncStates[peerId];
    if (syncState) {
      callback(syncState);
      return;
    }
    let pendingCallbacks = this.#pendingSyncStateCallbacks[peerId];
    if (!pendingCallbacks) {
      this.#onLoadSyncState(peerId).then((syncState2) => {
        this.#initSyncState(peerId, syncState2 ?? implementation_exports.initSyncState());
      }).catch((err) => {
        this.#log(`Error loading sync state for ${peerId}: ${err}`);
      });
      pendingCallbacks = this.#pendingSyncStateCallbacks[peerId] = [];
    }
    pendingCallbacks.push(callback);
  }
  #addPeer(peerId) {
    if (!this.#peers.includes(peerId)) {
      this.#peers.push(peerId);
      this.emit("open-doc", { documentId: this.documentId, peerId });
    }
  }
  #initSyncState(peerId, syncState) {
    const pendingCallbacks = this.#pendingSyncStateCallbacks[peerId];
    if (pendingCallbacks) {
      for (const callback of pendingCallbacks) {
        callback(syncState);
      }
    }
    delete this.#pendingSyncStateCallbacks[peerId];
    this.#syncStates[peerId] = syncState;
  }
  #setSyncState(peerId, syncState) {
    this.#syncStates[peerId] = syncState;
    this.emit("sync-state", {
      peerId,
      syncState,
      documentId: this.#handle.documentId
    });
  }
  #sendSyncMessage(peerId, doc) {
    this.#log(`sendSyncMessage ->${peerId}`);
    this.#withSyncState(peerId, (syncState) => {
      const start = performance.now();
      const [newSyncState, message] = implementation_exports.generateSyncMessage(doc, syncState);
      const end = performance.now();
      this.emit("metrics", {
        type: "generate-sync-message",
        documentId: this.#handle.documentId,
        durationMillis: end - start,
        forPeer: peerId
      });
      this.#setSyncState(peerId, newSyncState);
      if (message) {
        const isNew = implementation_exports.getHeads(doc).length === 0;
        if (!this.#handle.isReady() && isNew && newSyncState.sharedHeads.length === 0 && !Object.values(this.#peerDocumentStatuses).includes("has") && this.#peerDocumentStatuses[peerId] === "unknown") {
          this.emit("message", {
            type: "request",
            targetId: peerId,
            documentId: this.#handle.documentId,
            data: message
          });
        } else {
          this.emit("message", {
            type: "sync",
            targetId: peerId,
            data: message,
            documentId: this.#handle.documentId
          });
        }
        if (!isNew) {
          this.#peerDocumentStatuses[peerId] = "has";
        }
      }
    });
  }
  /// PUBLIC
  hasPeer(peerId) {
    return this.#peers.includes(peerId);
  }
  async beginSync(peerIds) {
    void this.#handle.whenReady([READY, REQUESTING, UNAVAILABLE]).then(() => {
      this.#syncStarted = true;
      this.#checkDocUnavailable();
    }).catch((e) => {
      console.log("caught whenready", e);
      this.#syncStarted = true;
      this.#checkDocUnavailable();
    });
    const peersWithDocument = this.#peers.some((peerId) => {
      return this.#peerDocumentStatuses[peerId] == "has";
    });
    if (peersWithDocument) {
      await this.#handle.whenReady();
    }
    peerIds.forEach((peerId) => {
      this.#withSyncState(peerId, (syncState) => {
        const reparsedSyncState = implementation_exports.decodeSyncState(implementation_exports.encodeSyncState(syncState));
        this.#setSyncState(peerId, reparsedSyncState);
        this.#handle.whenReady([READY, REQUESTING, UNAVAILABLE]).then(() => {
          const doc = this.#handle.isReady() ? this.#handle.doc() : implementation_exports.init();
          const noPeersWithDocument = peerIds.every((peerId2) => this.#peerDocumentStatuses[peerId2] in ["unavailable", "wants"]);
          const wasUnavailable = doc === void 0;
          if (wasUnavailable && noPeersWithDocument) {
            return;
          }
          this.#sendSyncMessage(peerId, doc ?? implementation_exports.init());
        }).catch((err) => {
          this.#log(`Error loading doc for ${peerId}: ${err}`);
        });
      });
    });
  }
  endSync(peerId) {
    this.#log(`removing peer ${peerId}`);
    this.#peers = this.#peers.filter((p) => p !== peerId);
    delete this.#peerDocumentStatuses[peerId];
    this.#checkDocUnavailable();
  }
  receiveMessage(message) {
    switch (message.type) {
      case "sync":
      case "request":
        this.receiveSyncMessage(message);
        break;
      case "ephemeral":
        this.receiveEphemeralMessage(message);
        break;
      case "doc-unavailable":
        this.#peerDocumentStatuses[message.senderId] = "unavailable";
        this.#checkDocUnavailable();
        break;
      default:
        throw new Error(`unknown message type: ${message}`);
    }
  }
  receiveEphemeralMessage(message) {
    if (message.documentId !== this.#handle.documentId)
      throw new Error(`channelId doesn't match documentId`);
    const { senderId, data } = message;
    const contents = decode(new Uint8Array(data));
    this.#handle.emit("ephemeral-message", {
      handle: this.#handle,
      senderId,
      message: contents
    });
    this.#peers.forEach((peerId) => {
      if (peerId === senderId)
        return;
      this.emit("message", {
        ...message,
        targetId: peerId
      });
    });
  }
  receiveSyncMessage(message) {
    if (message.documentId !== this.#handle.documentId)
      throw new Error(`channelId doesn't match documentId`);
    if (!this.#handle.inState([READY, REQUESTING, UNAVAILABLE])) {
      this.#pendingSyncMessages.push({ message, received: /* @__PURE__ */ new Date() });
      return;
    }
    this.#processAllPendingSyncMessages();
    this.#processSyncMessage(message);
  }
  #processSyncMessage(message) {
    if (isRequestMessage(message)) {
      this.#peerDocumentStatuses[message.senderId] = "wants";
    }
    this.#checkDocUnavailable();
    if (implementation_exports.decodeSyncMessage(message.data).heads.length > 0) {
      this.#peerDocumentStatuses[message.senderId] = "has";
    }
    this.#withSyncState(message.senderId, (syncState) => {
      this.#handle.update((doc) => {
        const start = performance.now();
        const [newDoc, newSyncState] = implementation_exports.receiveSyncMessage(doc, syncState, message.data);
        const end = performance.now();
        this.emit("metrics", {
          type: "receive-sync-message",
          documentId: this.#handle.documentId,
          durationMillis: end - start,
          fromPeer: message.senderId,
          ...implementation_exports.stats(doc)
        });
        this.#setSyncState(message.senderId, newSyncState);
        this.#sendSyncMessage(message.senderId, doc);
        return newDoc;
      });
      this.#checkDocUnavailable();
    });
  }
  #checkDocUnavailable() {
    if (this.#syncStarted && this.#handle.inState([REQUESTING, UNAVAILABLE]) && this.#peers.every((peerId) => this.#peerDocumentStatuses[peerId] === "unavailable" || this.#peerDocumentStatuses[peerId] === "wants")) {
      this.#peers.filter((peerId) => this.#peerDocumentStatuses[peerId] === "wants").forEach((peerId) => {
        this.#peerDocumentStatuses[peerId] = "unavailable";
        const message = {
          type: "doc-unavailable",
          documentId: this.#handle.documentId,
          targetId: peerId
        };
        this.emit("message", message);
      });
      this.#handle.unavailable();
    }
  }
  #processAllPendingSyncMessages() {
    for (const message of this.#pendingSyncMessages) {
      this.#processSyncMessage(message.message);
    }
    this.#pendingSyncMessages = [];
  }
  metrics() {
    return {
      peers: this.#peers,
      size: this.#handle.metrics()
    };
  }
};

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/synchronizer/CollectionSynchronizer.js
var log2 = (0, import_debug6.default)("automerge-repo:collectionsync");
var CollectionSynchronizer = class extends Synchronizer {
  repo;
  /** The set of peers we are connected with */
  #peers = /* @__PURE__ */ new Set();
  /** A map of documentIds to their synchronizers */
  /** @hidden */
  docSynchronizers = {};
  /** Used to determine if the document is know to the Collection and a synchronizer exists or is being set up */
  #docSetUp = {};
  #denylist;
  #hasRequested = /* @__PURE__ */ new Map();
  constructor(repo2, denylist = []) {
    super();
    this.repo = repo2;
    this.#denylist = denylist.map((url) => parseAutomergeUrl(url).documentId);
  }
  /** Returns a synchronizer for the given document, creating one if it doesn't already exist.  */
  #fetchDocSynchronizer(handle2) {
    if (!this.docSynchronizers[handle2.documentId]) {
      this.docSynchronizers[handle2.documentId] = this.#initDocSynchronizer(handle2);
    }
    return this.docSynchronizers[handle2.documentId];
  }
  /** Creates a new docSynchronizer and sets it up to propagate messages */
  #initDocSynchronizer(handle2) {
    const docSynchronizer = new DocSynchronizer({
      handle: handle2,
      peerId: this.repo.networkSubsystem.peerId,
      onLoadSyncState: async (peerId) => {
        if (!this.repo.storageSubsystem) {
          return;
        }
        const { storageId, isEphemeral } = this.repo.peerMetadataByPeerId[peerId] || {};
        if (!storageId || isEphemeral) {
          return;
        }
        return this.repo.storageSubsystem.loadSyncState(handle2.documentId, storageId);
      }
    });
    docSynchronizer.on("message", (event) => this.emit("message", event));
    docSynchronizer.on("open-doc", (event) => this.emit("open-doc", event));
    docSynchronizer.on("sync-state", (event) => this.emit("sync-state", event));
    docSynchronizer.on("metrics", (event) => this.emit("metrics", event));
    return docSynchronizer;
  }
  /** returns an array of peerIds that we share this document generously with */
  async #documentGenerousPeers(documentId) {
    const peers = Array.from(this.#peers);
    const generousPeers = [];
    for (const peerId of peers) {
      const okToShare = await this.#shouldShare(peerId, documentId);
      if (okToShare)
        generousPeers.push(peerId);
    }
    return generousPeers;
  }
  // PUBLIC
  /**
   * When we receive a sync message for a document we haven't got in memory, we
   * register it with the repo and start synchronizing
   */
  async receiveMessage(message) {
    log2(`onSyncMessage: ${message.senderId}, ${message.documentId}, ${"data" in message ? message.data.byteLength + "bytes" : ""}`);
    const documentId = message.documentId;
    if (!documentId) {
      throw new Error("received a message with an invalid documentId");
    }
    if (this.#denylist.includes(documentId)) {
      this.emit("metrics", {
        type: "doc-denied",
        documentId
      });
      this.emit("message", {
        type: "doc-unavailable",
        documentId,
        targetId: message.senderId
      });
      return;
    }
    if (message.type === "request" || message.type === "sync") {
      if (!this.#hasRequested.has(documentId)) {
        this.#hasRequested.set(documentId, /* @__PURE__ */ new Set());
      }
      this.#hasRequested.get(documentId)?.add(message.senderId);
    }
    const hasAccess = await this.repo.shareConfig.access(message.senderId, documentId);
    if (!hasAccess) {
      log2("access denied");
      this.emit("message", {
        type: "doc-unavailable",
        documentId,
        targetId: message.senderId
      });
      return;
    }
    this.#docSetUp[documentId] = true;
    const handle2 = await this.repo.find(documentId, {
      allowableStates: ["ready", "unavailable", "requesting"]
    });
    const docSynchronizer = this.#fetchDocSynchronizer(handle2);
    docSynchronizer.receiveMessage(message);
    const peers = await this.#documentGenerousPeers(documentId);
    void docSynchronizer.beginSync(peers.filter((peerId) => !docSynchronizer.hasPeer(peerId)));
  }
  /**
   * Starts synchronizing the given document with all peers that we share it generously with.
   */
  addDocument(handle2) {
    if (this.#docSetUp[handle2.documentId]) {
      return;
    }
    this.#docSetUp[handle2.documentId] = true;
    const docSynchronizer = this.#fetchDocSynchronizer(handle2);
    void this.#documentGenerousPeers(handle2.documentId).then((peers) => {
      void docSynchronizer.beginSync(peers);
    });
  }
  /** Removes a document and stops synchronizing them */
  removeDocument(documentId) {
    log2(`removing document ${documentId}`);
    const docSynchronizer = this.docSynchronizers[documentId];
    if (docSynchronizer !== void 0) {
      this.peers.forEach((peerId) => docSynchronizer.endSync(peerId));
    }
    delete this.docSynchronizers[documentId];
    delete this.#docSetUp[documentId];
  }
  /** Adds a peer and maybe starts synchronizing with them */
  addPeer(peerId) {
    log2(`adding ${peerId} & synchronizing with them`);
    if (this.#peers.has(peerId)) {
      return;
    }
    this.#peers.add(peerId);
    for (const docSynchronizer of Object.values(this.docSynchronizers)) {
      const { documentId } = docSynchronizer;
      void this.#shouldShare(peerId, documentId).then((okToShare) => {
        if (okToShare)
          void docSynchronizer.beginSync([peerId]);
      });
    }
  }
  /** Removes a peer and stops synchronizing with them */
  removePeer(peerId) {
    log2(`removing peer ${peerId}`);
    this.#peers.delete(peerId);
    for (const requested of this.#hasRequested.values()) {
      requested.delete(peerId);
    }
    for (const docSynchronizer of Object.values(this.docSynchronizers)) {
      docSynchronizer.endSync(peerId);
    }
  }
  /** Returns a list of all connected peer ids */
  get peers() {
    return Array.from(this.#peers);
  }
  /**
   * Re-evaluates share policy for a document and updates sync accordingly
   *
   * @remarks
   * This is called when the share policy for a document has changed. It re-evaluates
   * which peers should have access and starts/stops synchronization as needed.
   */
  async reevaluateDocumentShare() {
    const peers = Array.from(this.#peers);
    const docPromises = [];
    for (const docSynchronizer of Object.values(this.docSynchronizers)) {
      const documentId = docSynchronizer.documentId;
      docPromises.push((async () => {
        for (const peerId of peers) {
          const shouldShare = await this.#shouldShare(peerId, documentId);
          const isAlreadySyncing = docSynchronizer.hasPeer(peerId);
          log2(`reevaluateDocumentShare: ${peerId} for ${documentId}, shouldShare: ${shouldShare}, isAlreadySyncing: ${isAlreadySyncing}`);
          if (shouldShare && !isAlreadySyncing) {
            log2(`reevaluateDocumentShare: starting sync with ${peerId} for ${documentId}`);
            void docSynchronizer.beginSync([peerId]);
          } else if (!shouldShare && isAlreadySyncing) {
            log2(`reevaluateDocumentShare: stopping sync with ${peerId} for ${documentId}`);
            docSynchronizer.endSync(peerId);
          }
        }
      })().catch((e) => {
        console.log(`error reevaluating document share for ${documentId}: ${e}`);
      }));
    }
    await Promise.allSettled(docPromises);
  }
  metrics() {
    return Object.fromEntries(Object.entries(this.docSynchronizers).map(([documentId, synchronizer]) => {
      return [documentId, synchronizer.metrics()];
    }));
  }
  async #shouldShare(peerId, documentId) {
    const [announce, access] = await Promise.all([
      this.repo.shareConfig.announce(peerId, documentId),
      this.repo.shareConfig.access(peerId, documentId)
    ]);
    const hasRequested = this.#hasRequested.get(documentId)?.has(peerId) ?? false;
    return announce || access && hasRequested;
  }
};

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/refs/types.js
var KIND = "AUTOMERGE_REF_KIND";
var CURSOR_MARKER = "AUTOMERGE_REF_CURSOR_MARKER";

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/refs/parser.js
var URL_PREFIX = "automerge:";
var ESCAPE_CHAR = "\\";
var ESCAPE_PREFIX = "%5C";
var INDEX_PREFIX = "@";
var CURSOR_OPEN = "[";
var CURSOR_CLOSE = "]";
var CURSOR_SEPARATOR = "-";
var ESCAPE_TRIGGERS = [ESCAPE_CHAR, INDEX_PREFIX, "{", CURSOR_OPEN];
var INDEX_PATTERN = /^@(\d+)$/;
var indexCodec = {
  kind: "index",
  match: (s) => INDEX_PATTERN.test(s),
  parse: (s) => {
    const m = s.match(INDEX_PATTERN);
    if (!m)
      throw new Error(`Invalid index: ${s}`);
    return { [KIND]: "index", index: parseInt(m[1], 10) };
  },
  serialize: (seg) => `${INDEX_PREFIX}${seg.index}`
};
var matchCodec = {
  kind: "match",
  // Match both raw JSON and URL-encoded JSON
  match: (s) => s.startsWith("{") || s.startsWith("%7B"),
  parse: (s) => {
    try {
      const decoded = decodeURIComponent(s);
      const parsed = JSON.parse(decoded);
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        throw new Error("Match pattern must be a plain object");
      }
      return { [KIND]: "match", match: parsed };
    } catch (e) {
      throw new Error(`Invalid match pattern: ${s}. ${e instanceof Error ? e.message : ""}`);
    }
  },
  // URL-encode the JSON to protect slashes and other special characters
  // from being interpreted as path separators
  serialize: (seg) => encodeURIComponent(JSON.stringify(seg.match))
};
var cursorsCodec = {
  kind: "cursors",
  match: (s) => s.startsWith(CURSOR_OPEN) && s.endsWith(CURSOR_CLOSE),
  parse: (s) => {
    const inner = s.slice(1, -1);
    if (!inner) {
      throw new Error("Invalid cursor range: empty brackets");
    }
    const sepIndex = inner.indexOf(CURSOR_SEPARATOR);
    if (sepIndex === -1) {
      const cursor2 = inner;
      return { [KIND]: "cursors", start: cursor2, end: cursor2 };
    }
    const start = inner.slice(0, sepIndex);
    const end = inner.slice(sepIndex + 1);
    if (!start || !end) {
      throw new Error(`Invalid cursor range: ${s}. Expected format: [cursor] or [start-end]`);
    }
    return { [KIND]: "cursors", start, end };
  },
  serialize: (seg) => {
    if (seg.start === seg.end) {
      return `${CURSOR_OPEN}${seg.start}${CURSOR_CLOSE}`;
    }
    return `${CURSOR_OPEN}${seg.start}${CURSOR_SEPARATOR}${seg.end}${CURSOR_CLOSE}`;
  }
};
var keyCodec = {
  kind: "key",
  match: (s) => {
    if (s.startsWith(ESCAPE_PREFIX) || s.startsWith(ESCAPE_CHAR)) {
      return true;
    }
    const decoded = safeDecodeURIComponent(s);
    return !ESCAPE_TRIGGERS.some((p) => s.startsWith(p) || decoded.startsWith(p));
  },
  parse: (s) => {
    if (s.startsWith(ESCAPE_PREFIX)) {
      return {
        [KIND]: "key",
        key: decodeURIComponent(s.slice(ESCAPE_PREFIX.length))
      };
    }
    if (s.startsWith(ESCAPE_CHAR)) {
      return {
        [KIND]: "key",
        key: decodeURIComponent(s.slice(ESCAPE_CHAR.length))
      };
    }
    return { [KIND]: "key", key: decodeURIComponent(s) };
  },
  serialize: (seg) => {
    const needsEscape = ESCAPE_TRIGGERS.some((p) => seg.key.startsWith(p));
    const encoded = encodeURIComponent(seg.key);
    return needsEscape ? `${ESCAPE_PREFIX}${encoded}` : encoded;
  }
};
function safeDecodeURIComponent(s) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}
var SEGMENT_CODECS = [indexCodec, matchCodec, cursorsCodec, keyCodec];
function serializeSegment(segment) {
  for (const codec of SEGMENT_CODECS) {
    if (segment[KIND] === codec.kind) {
      return codec.serialize(segment);
    }
  }
  throw new Error(`No codec found for segment kind: ${segment[KIND]}`);
}
function serializePath(segments) {
  return segments.map(serializeSegment).join("/");
}
function serializeHeads(heads) {
  return heads.length > 0 ? `#${heads.join("|")}` : "";
}
function stringifyRefUrl(documentId, segments, heads) {
  const pathStr = serializePath(segments);
  const headsStr = heads ? serializeHeads(heads) : "";
  return `${URL_PREFIX}${documentId}/${pathStr}${headsStr}`;
}

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/refs/guards.js
function isObject2(val) {
  return val !== null && typeof val === "object" && !Array.isArray(val);
}
function isSegment(val) {
  return isObject2(val) && KIND in val;
}
function isCursorMarker(val) {
  return isObject2(val) && CURSOR_MARKER in val;
}
function isPattern(val) {
  return isObject2(val) && !isSegment(val) && !isCursorMarker(val);
}

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/refs/utils.js
function matchesPattern(item, pattern) {
  return Object.entries(pattern).every(([key, value]) => item[key] === value);
}

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/refs/mutable-text.js
function MutableText(doc, propPath, value) {
  const mutations = {
    splice(index, deleteCount, insert) {
      splice(doc, propPath, index, deleteCount, insert);
    },
    updateText(newValue) {
      updateText(doc, propPath, newValue);
    }
  };
  return new Proxy(mutations, {
    get(target2, prop) {
      if (prop in target2) {
        return target2[prop];
      }
      const stringValue = value;
      const member = stringValue[prop];
      return typeof member === "function" ? member.bind(value) : member;
    },
    // Support iteration (for...of, spread)
    getPrototypeOf() {
      return String.prototype;
    }
  });
}

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/refs/ref.js
var refCleanupRegistry = new FinalizationRegistry((cleanup) => cleanup());
var RefImpl = class {
  docHandle;
  path;
  range;
  #onChangeCallbacks = /* @__PURE__ */ new Set();
  #updateHandler;
  constructor(docHandle, segments) {
    this.docHandle = docHandle;
    const doc = docHandle.doc();
    const { path, range } = this.#normalizePath(doc, segments);
    this.path = path;
    this.range = range;
    this.#updateHandler = () => {
      const currentDoc = this.docHandle.doc();
      this.#updateProps(currentDoc);
    };
    this.docHandle.on("change", this.#updateHandler);
    refCleanupRegistry.register(this, () => this.#cleanup(), this);
  }
  #cleanup() {
    this.docHandle.off("change", this.#updateHandler);
    for (const callback of this.#onChangeCallbacks) {
      this.docHandle.off("change", callback);
    }
    this.#onChangeCallbacks.clear();
  }
  get rangePositions() {
    if (!this.range)
      return void 0;
    const propPath = this.#getPropPath();
    if (!propPath)
      return void 0;
    const doc = this.doc();
    return this.#getRangePositions(doc, propPath, this.range);
  }
  viewAt(heads) {
    const viewHandle = this.docHandle.view(encodeHeads(heads));
    return viewHandle.ref(...this.path);
  }
  value() {
    const doc = this.doc();
    const propPath = this.#getPropPath();
    if (!propPath)
      return void 0;
    const value = this.#getValueAt(doc, propPath);
    return this.range ? this.#extractRange(doc, propPath, value, this.range) : value;
  }
  doc() {
    return this.docHandle.doc();
  }
  change(fnOrValue) {
    if (this.docHandle.isReadOnly()) {
      throw new Error("Cannot change a Ref on a read-only handle");
    }
    const fn = typeof fnOrValue === "function" ? fnOrValue : () => fnOrValue;
    this.docHandle.change((doc) => {
      if (this.path.length === 0 && !this.range) {
        fn(doc);
        return;
      }
      const propPath = this.#getPropPath();
      if (!propPath)
        throw new Error("Cannot resolve path");
      let current;
      if (this.range) {
        const parent = this.#getValueAt(doc, propPath);
        if (typeof parent !== "string") {
          throw new Error("Range refs can only be used on string values");
        }
        current = this.#extractRange(doc, propPath, parent, this.range);
      } else {
        current = this.#getValueAt(doc, propPath);
      }
      const valueToPass = typeof current === "string" ? MutableText(doc, propPath, current) : current;
      const newValue = fn(valueToPass);
      if (newValue === void 0)
        return;
      if (!(newValue === null || typeof newValue === "string" || typeof newValue === "number" || typeof newValue === "boolean" || typeof newValue === "bigint")) {
        console.warn("Ref.change() returned a non-primitive value. For objects and arrays, you should mutate them in place rather than returning a new instance. Returning new instances loses granular change tracking.");
      }
      if (this.range) {
        this.#spliceRange(doc, propPath, this.range, newValue);
      } else {
        this.#setValueAt(doc, propPath, newValue);
      }
    });
  }
  remove() {
    if (this.docHandle.isReadOnly()) {
      throw new Error("Cannot remove from a Ref on a read-only handle");
    }
    if (this.path.length === 0 && !this.range) {
      throw new Error("Cannot remove the root document");
    }
    this.docHandle.change((doc) => {
      const propPath = this.#getPropPath();
      if (!propPath || propPath.length === 0) {
        throw new Error("Cannot resolve path for removal");
      }
      if (this.range) {
        this.#spliceRange(doc, propPath, this.range, "");
        return;
      }
      const parentPath = propPath.slice(0, -1);
      const key = propPath[propPath.length - 1];
      const parent = parentPath.length === 0 ? doc : this.#getValueAt(doc, parentPath);
      if (parent == null) {
        throw new Error("Cannot remove: parent is null or undefined");
      }
      if (Array.isArray(parent)) {
        if (typeof key !== "number") {
          throw new Error("Cannot remove from array: key is not a number");
        }
        parent.splice(key, 1);
      } else {
        delete parent[key];
      }
    });
  }
  onChange(callback) {
    const wrappedCallback = (payload) => {
      if (this.#patchAffectsRef(payload.patches)) {
        const value = this.value();
        callback(value, payload);
      }
    };
    this.docHandle.on("change", wrappedCallback);
    this.#onChangeCallbacks.add(wrappedCallback);
    const unsubscribe = () => {
      this.docHandle.off("change", wrappedCallback);
      this.#onChangeCallbacks.delete(wrappedCallback);
    };
    return unsubscribe;
  }
  get url() {
    const allSegments = this.range ? [...this.path, this.range] : this.path;
    const heads = this.docHandle.isReadOnly() ? decodeHeads(this.docHandle.heads()) : void 0;
    return stringifyRefUrl(this.docHandle.documentId, allSegments, heads);
  }
  equals(other) {
    return this.url === other.url;
  }
  contains(other) {
    if (this.docHandle.documentId !== other.docHandle.documentId) {
      return false;
    }
    if (this.docHandle.url !== other.docHandle.url) {
      return false;
    }
    if (this.path.length >= other.path.length) {
      return false;
    }
    for (let i = 0; i < this.path.length; i++) {
      if (!this.#segmentsEqual(this.path[i], other.path[i])) {
        return false;
      }
    }
    return true;
  }
  isChildOf(parent) {
    if (this.docHandle.documentId !== parent.docHandle.documentId) {
      return false;
    }
    if (this.docHandle.url !== parent.docHandle.url) {
      return false;
    }
    if (this.path.length < parent.path.length) {
      return false;
    }
    for (let i = 0; i < parent.path.length; i++) {
      if (!this.#segmentsEqual(this.path[i], parent.path[i])) {
        return false;
      }
    }
    if (this.path.length === parent.path.length) {
      return this.range !== void 0 && parent.range === void 0;
    }
    if (this.path.length === parent.path.length + 1) {
      return true;
    }
    return false;
  }
  overlaps(other) {
    if (this.docHandle.documentId !== other.docHandle.documentId) {
      return false;
    }
    if (this.docHandle.url !== other.docHandle.url) {
      return false;
    }
    if (!this.range || !other.range) {
      return false;
    }
    if (this.path.length !== other.path.length) {
      return false;
    }
    for (let i = 0; i < this.path.length; i++) {
      if (!this.#segmentsEqual(this.path[i], other.path[i])) {
        return false;
      }
    }
    const doc = this.doc();
    const propPath = this.#getPropPath();
    if (!propPath)
      return false;
    const thisPositions = this.#getRangePositions(doc, propPath, this.range);
    const otherPositions = this.#getRangePositions(doc, propPath, other.range);
    if (!thisPositions || !otherPositions)
      return false;
    const [thisStart, thisEnd] = thisPositions;
    const [otherStart, otherEnd] = otherPositions;
    return thisStart < otherEnd && otherStart < thisEnd;
  }
  isEquivalent(other) {
    if (this === other) {
      return true;
    }
    if (this.docHandle.documentId !== other.docHandle.documentId) {
      return false;
    }
    if (!this.#headsEquivalent(other)) {
      return false;
    }
    if (this.path.length !== other.path.length) {
      return false;
    }
    if (this.range === void 0 !== (other.range === void 0)) {
      return false;
    }
    let segmentsEqual = true;
    for (let i = 0; i < this.path.length; i++) {
      if (!this.#segmentsEqual(this.path[i], other.path[i])) {
        segmentsEqual = false;
        break;
      }
    }
    if (segmentsEqual) {
      if (!this.range && !other.range) {
        return true;
      }
      return this.range.start === other.range.start && this.range.end === other.range.end;
    }
    for (let i = 0; i < this.path.length; i++) {
      const thisProp = this.path[i].prop;
      const otherProp = other.path[i].prop;
      if (thisProp === void 0 || otherProp === void 0) {
        return false;
      }
      if (thisProp !== otherProp) {
        return false;
      }
    }
    if (!this.range && !other.range) {
      return true;
    }
    return this.range.start === other.range.start && this.range.end === other.range.end;
  }
  valueOf() {
    return this.url;
  }
  toString() {
    return this.url;
  }
  /**
   * Check if this ref's heads are equivalent to another ref's heads.
   * A ref on a non-read-only handle represents "current document state",
   * so it's equivalent to a ref on a read-only handle with heads matching the current document.
   */
  #headsEquivalent(other) {
    if (this.docHandle.url === other.docHandle.url) {
      return true;
    }
    const thisHeadsStr = this.docHandle.heads().join(",");
    const otherHeadsStr = other.docHandle.heads().join(",");
    return thisHeadsStr === otherHeadsStr;
  }
  /**
   * Normalize path inputs and extract stable IDs where possible.
   */
  #normalizePath(doc, inputs) {
    const pathSegments = [];
    const propPath = [];
    let current = doc;
    let rangeSegment;
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      if (isCursorMarker(input)) {
        if (i < inputs.length - 1) {
          throw new Error("cursor() must be the last segment in a ref path. Segments after cursor() are not allowed.");
        }
        rangeSegment = this.#createCursorRange(doc, propPath, current, input);
        break;
      }
      const segment = isSegment(input) ? this.#ensureSegmentResolved(current, input) : this.#normalizeInput(current, input);
      if (segment[KIND] === "cursors") {
        if (i < inputs.length - 1) {
          throw new Error("Cursor range must be the last segment in a ref path. Segments after cursor range are not allowed.");
        }
        rangeSegment = segment;
        break;
      }
      pathSegments.push(segment);
      if (segment.prop !== void 0 && current !== void 0 && current !== null) {
        propPath.push(segment.prop);
        current = current[segment.prop];
      }
    }
    return { path: pathSegments, range: rangeSegment };
  }
  /** Ensure a segment has its prop set */
  #ensureSegmentResolved(container, segment) {
    const prop = this.#resolveSegmentProp(container, segment);
    return { ...segment, prop };
  }
  /**
   * Resolve a path segment to its Automerge prop.
   * Returns undefined if the segment cannot be resolved.
   */
  #resolveSegmentProp(container, segment) {
    if (container === void 0 || container === null)
      return void 0;
    switch (segment[KIND]) {
      case "key":
        return segment.key;
      case "index":
        return segment.index;
      case "match": {
        if (!Array.isArray(container))
          return void 0;
        const matchIndex = container.findIndex((item) => matchesPattern(item, segment.match));
        return matchIndex !== -1 ? matchIndex : void 0;
      }
      case "cursors":
        return void 0;
      default:
        segment;
        return void 0;
    }
  }
  /** Update resolved props for all path segments based on current document state */
  #updateProps(doc) {
    let current = doc;
    for (const segment of this.path) {
      const prop = this.#resolveSegmentProp(current, segment);
      segment.prop = prop;
      if (prop !== void 0 && current !== void 0 && current !== null) {
        current = current[prop];
      } else {
        break;
      }
    }
  }
  /**
   * Check if two PathSegments are equal.
   * Used by `contains` and `overlaps` methods.
   */
  #segmentsEqual(a, b) {
    if (a[KIND] !== b[KIND]) {
      return false;
    }
    switch (a[KIND]) {
      case "key":
        return a.key === b.key;
      case "index":
        return a.index === b.index;
      case "match": {
        const aKeys = Object.keys(a.match);
        const bKeys = Object.keys(b.match);
        if (aKeys.length !== bKeys.length)
          return false;
        return aKeys.every((key) => a.match[key] === b.match[key]);
      }
      default:
        a;
        return false;
    }
  }
  #normalizeInput(container, input) {
    if (typeof input === "string") {
      return { [KIND]: "key", key: input, prop: input };
    }
    if (typeof input === "number") {
      return { [KIND]: "index", index: input, prop: input };
    }
    if (isPattern(input)) {
      if (!Array.isArray(container)) {
        return { [KIND]: "match", match: input, prop: void 0 };
      }
      const index = container.findIndex((obj) => matchesPattern(obj, input));
      return {
        [KIND]: "match",
        match: input,
        prop: index !== -1 ? index : void 0
      };
    }
    throw new Error(`Unsupported path input type: ${typeof input}. Expected string, number, or plain object.`);
  }
  /** Create a cursor-based range from a CursorMarker */
  #createCursorRange(doc, propPath, container, marker) {
    const { start, end } = marker;
    if (typeof container !== "string") {
      throw new Error(`cursor() can only be used on string values, got ${typeof container}`);
    }
    const startCursor = getCursor(doc, propPath, start);
    const endCursor = getCursor(doc, propPath, end);
    if (!startCursor || !endCursor) {
      throw new Error(`Failed to create cursors at positions ${start}-${end}.`);
    }
    return { [KIND]: "cursors", start: startCursor, end: endCursor };
  }
  /** Extract cached navigation path from segments */
  #getPropPath() {
    const props = [];
    for (const segment of this.path) {
      if (segment.prop === void 0)
        return void 0;
      props.push(segment.prop);
    }
    return props;
  }
  /** Navigate to a value by following a prop path */
  #getValueAt(container, propPath) {
    let current = container;
    for (const prop of propPath) {
      if (current == null)
        return void 0;
      current = current[prop];
    }
    return current;
  }
  /** Extract substring from a text value using a range */
  #extractRange(doc, propPath, text, range) {
    const positions = this.#getRangePositions(doc, propPath, range);
    if (!positions)
      return void 0;
    return text.slice(positions[0], positions[1]);
  }
  /** Set a value at a prop path (change-only: mutates the doc proxy) */
  #setValueAt(container, propPath, value) {
    if (propPath.length === 0) {
      throw new Error("Internal error: #setValueAt called with empty path. Root document changes should be handled by the caller.");
    }
    const parent = this.#getValueAt(container, propPath.slice(0, -1));
    if (parent == null) {
      throw new Error("Cannot set value: parent is null or undefined");
    }
    parent[propPath[propPath.length - 1]] = value;
  }
  /** Replace a substring at a range using Automerge.splice (change-only: mutates the doc proxy) */
  #spliceRange(doc, propPath, range, newValue) {
    const positions = this.#getRangePositions(doc, propPath, range);
    if (!positions) {
      throw new Error("Cannot resolve range positions");
    }
    const [start, end] = positions;
    splice(doc, propPath, start, end - start, newValue);
  }
  /** Convert cursor positions to numeric [start, end] positions */
  #getRangePositions(doc, propPath, range) {
    const start = getCursorPosition(doc, propPath, range.start);
    const end = getCursorPosition(doc, propPath, range.end);
    return start !== void 0 && end !== void 0 ? [start, end] : void 0;
  }
  #patchAffectsRef(patches) {
    const refPropPath = [];
    for (const segment of this.path) {
      if (segment.prop === void 0)
        break;
      refPropPath.push(segment.prop);
    }
    if (refPropPath.length === 0)
      return false;
    return patches.some((patch) => this.#pathsOverlap(patch.path, refPropPath));
  }
  #pathsOverlap(patchPath, refPropPath) {
    const minLength = Math.min(patchPath.length, refPropPath.length);
    return patchPath.slice(0, minLength).every((prop, i) => prop === refPropPath[i]);
  }
};

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/helpers/foreverPromise.js
var foreverPromise = new Promise(() => {
});

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/helpers/noop.js
var noop = () => {
};

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/helpers/truePromiseFactory.js
var truePromiseFactory = async () => true;

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/helpers/isPlainObject.js
function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/helpers/has-at-least-one-key.js
var hasAtLeastOneKey = (obj) => {
  for (const _ in obj) {
    if (Object.hasOwn(obj, _))
      return true;
  }
  return false;
};

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/Repo.js
function randomPeerId() {
  return "peer-" + Math.random().toString(36).slice(4);
}
var Repo = class extends import_index.default {
  #log;
  /** @hidden */
  networkSubsystem;
  /** @hidden */
  storageSubsystem;
  /** @hidden */
  #saveDebounceRate;
  /** @hidden */
  #saveFn;
  #handleCache = {};
  /** @hidden */
  synchronizer;
  #shareConfig = {
    announce: truePromiseFactory,
    access: truePromiseFactory
  };
  /** maps peer id to to persistence information (storageId, isEphemeral), access by collection synchronizer  */
  /** @hidden */
  peerMetadataByPeerId = {};
  #remoteHeadsSubscriptions = new RemoteHeadsSubscriptions();
  #remoteHeadsGossipingEnabled = false;
  #progressCache = {};
  #saveFns = {};
  #idFactory;
  constructor({ storage, network = [], peerId = randomPeerId(), sharePolicy, shareConfig, isEphemeral = storage === void 0, enableRemoteHeadsGossiping = false, denylist = [], saveDebounceRate = 100, idFactory } = {}) {
    super();
    this.#remoteHeadsGossipingEnabled = enableRemoteHeadsGossiping;
    this.#log = (0, import_debug7.default)(`automerge-repo:repo`);
    this.#idFactory = idFactory || null;
    if (sharePolicy != null && shareConfig != null) {
      throw new Error("cannot provide both sharePolicy and shareConfig at once");
    }
    if (sharePolicy) {
      this.#shareConfig = {
        announce: sharePolicy,
        access: truePromiseFactory
      };
    }
    if (shareConfig) {
      this.#shareConfig = shareConfig;
    }
    this.on("delete-document", ({ documentId }) => {
      this.synchronizer.removeDocument(documentId);
      if (storageSubsystem) {
        storageSubsystem.removeDoc(documentId).catch((err) => {
          this.#log("error deleting document", { documentId, err });
        });
      }
    });
    this.synchronizer = new CollectionSynchronizer(this, denylist);
    this.synchronizer.on("message", (message) => {
      this.#log(`sending ${message.type} message to ${message.targetId}`);
      networkSubsystem.send(message);
    });
    this.synchronizer.on("metrics", (event) => this.emit("doc-metrics", event));
    if (this.#remoteHeadsGossipingEnabled) {
      this.synchronizer.on("open-doc", ({ peerId: peerId2, documentId }) => {
        this.#remoteHeadsSubscriptions.subscribePeerToDoc(peerId2, documentId);
      });
    }
    const storageSubsystem = storage ? new StorageSubsystem(storage) : void 0;
    if (storageSubsystem) {
      storageSubsystem.on("document-loaded", (event) => this.emit("doc-metrics", { type: "doc-loaded", ...event }));
      storageSubsystem.on("doc-compacted", (event) => this.emit("doc-metrics", { type: "doc-compacted", ...event }));
      storageSubsystem.on("doc-saved", (event) => this.emit("doc-metrics", { type: "doc-saved", ...event }));
    }
    this.storageSubsystem = storageSubsystem;
    this.#saveDebounceRate = saveDebounceRate;
    if (this.storageSubsystem) {
      this.#saveFn = ({ handle: handle2, doc }) => {
        let fn = this.#saveFns[handle2.documentId];
        if (!fn) {
          fn = this.#saveFns[handle2.documentId] = asyncThrottle(({ doc: doc2, handle: handle3 }) => this.storageSubsystem.saveDoc(handle3.documentId, doc2), this.#saveDebounceRate);
        }
        void fn({ handle: handle2, doc });
      };
    } else {
      this.#saveFn = noop;
    }
    const myPeerMetadata = (async () => ({
      storageId: await storageSubsystem?.id(),
      isEphemeral
    }))();
    const networkSubsystem = new NetworkSubsystem(network, peerId, myPeerMetadata);
    this.networkSubsystem = networkSubsystem;
    networkSubsystem.on("peer", async ({ peerId: peerId2, peerMetadata }) => {
      this.#log("peer connected", { peerId: peerId2 });
      if (peerMetadata) {
        this.peerMetadataByPeerId[peerId2] = { ...peerMetadata };
      }
      this.#shareConfig.announce(peerId2).then((shouldShare) => {
        if (shouldShare && this.#remoteHeadsGossipingEnabled) {
          this.#remoteHeadsSubscriptions.addGenerousPeer(peerId2);
        }
      }).catch((err) => {
        console.log("error in share policy", { err });
      });
      this.synchronizer.addPeer(peerId2);
    });
    networkSubsystem.on("peer-disconnected", ({ peerId: peerId2 }) => {
      this.synchronizer.removePeer(peerId2);
      this.#remoteHeadsSubscriptions.removePeer(peerId2);
    });
    networkSubsystem.on("message", async (msg) => {
      this.#receiveMessage(msg);
    });
    this.synchronizer.on("sync-state", (message) => {
      this.#saveSyncState(message);
      const handle2 = this.#handleCache[message.documentId];
      const { storageId } = this.peerMetadataByPeerId[message.peerId] || {};
      if (!storageId) {
        return;
      }
      const heads = handle2.getSyncInfo(storageId)?.lastHeads;
      const haveHeadsChanged = message.syncState.theirHeads && (!heads || !headsAreSame(heads, encodeHeads(message.syncState.theirHeads)));
      if (haveHeadsChanged && message.syncState.theirHeads) {
        handle2.setSyncInfo(storageId, {
          lastHeads: encodeHeads(message.syncState.theirHeads),
          lastSyncTimestamp: Date.now()
        });
        if (storageId && this.#remoteHeadsGossipingEnabled) {
          this.#remoteHeadsSubscriptions.handleImmediateRemoteHeadsChanged(message.documentId, storageId, encodeHeads(message.syncState.theirHeads));
        }
      }
    });
    if (this.#remoteHeadsGossipingEnabled) {
      this.#remoteHeadsSubscriptions.on("notify-remote-heads", (message) => {
        this.networkSubsystem.send({
          type: "remote-heads-changed",
          targetId: message.targetId,
          documentId: message.documentId,
          newHeads: {
            [message.storageId]: {
              heads: message.heads,
              timestamp: message.timestamp
            }
          }
        });
      });
      this.#remoteHeadsSubscriptions.on("change-remote-subs", (message) => {
        this.#log("change-remote-subs", message);
        for (const peer of message.peers) {
          this.networkSubsystem.send({
            type: "remote-subscription-change",
            targetId: peer,
            add: message.add,
            remove: message.remove
          });
        }
      });
      this.#remoteHeadsSubscriptions.on("remote-heads-changed", ({ documentId, storageId, remoteHeads, timestamp }) => {
        const handle2 = this.#handleCache[documentId];
        handle2.setSyncInfo(storageId, {
          lastHeads: remoteHeads,
          lastSyncTimestamp: timestamp
        });
      });
    }
  }
  // The `document` event is fired by the DocCollection any time we create a new document or look
  // up a document by ID. We listen for it in order to wire up storage and network synchronization.
  #registerHandleWithSubsystems(handle2) {
    if (this.storageSubsystem) {
      const existingListeners = handle2.listeners("heads-changed");
      if (!existingListeners.some((listener) => listener === this.#saveFn)) {
        handle2.on("heads-changed", this.#saveFn);
      }
    }
    this.synchronizer.addDocument(handle2);
  }
  #receiveMessage(message) {
    switch (message.type) {
      case "remote-subscription-change":
        if (this.#remoteHeadsGossipingEnabled) {
          this.#remoteHeadsSubscriptions.handleControlMessage(message);
        }
        break;
      case "remote-heads-changed":
        if (this.#remoteHeadsGossipingEnabled) {
          this.#remoteHeadsSubscriptions.handleRemoteHeads(message);
        }
        break;
      case "sync":
      case "request":
      case "ephemeral":
      case "doc-unavailable":
        this.synchronizer.receiveMessage(message).catch((err) => {
          console.log("error receiving message", { err, message });
        });
    }
  }
  #throttledSaveSyncStateHandlers = {};
  /** saves sync state throttled per storage id, if a peer doesn't have a storage id it's sync state is not persisted */
  #saveSyncState(payload) {
    if (!this.storageSubsystem) {
      return;
    }
    const { storageId, isEphemeral } = this.peerMetadataByPeerId[payload.peerId] || {};
    if (!storageId || isEphemeral) {
      return;
    }
    let handler = this.#throttledSaveSyncStateHandlers[storageId];
    if (!handler) {
      handler = this.#throttledSaveSyncStateHandlers[storageId] = asyncThrottle(({ documentId, syncState }) => this.storageSubsystem.saveSyncState(documentId, storageId, syncState), this.#saveDebounceRate);
    }
    void handler(payload);
  }
  /** Returns an existing handle if we have it; creates one otherwise. */
  #getHandle({ documentId }) {
    if (this.#handleCache[documentId])
      return this.#handleCache[documentId];
    if (!documentId)
      throw new Error(`Invalid documentId ${documentId}`);
    const handle2 = new DocHandle(documentId, (handle3, path) => new RefImpl(handle3, path));
    this.#handleCache[documentId] = handle2;
    return handle2;
  }
  /** Returns all the handles we have cached. */
  get handles() {
    return this.#handleCache;
  }
  /** Returns a list of all connected peer ids */
  get peers() {
    return this.synchronizer.peers;
  }
  get peerId() {
    return this.networkSubsystem.peerId;
  }
  /** @hidden */
  get sharePolicy() {
    return this.#shareConfig.announce;
  }
  /** @hidden */
  set sharePolicy(policy) {
    this.#shareConfig.announce = policy;
  }
  /** @hidden */
  get shareConfig() {
    return this.#shareConfig;
  }
  /** @hidden */
  set shareConfig(config) {
    this.#shareConfig = config;
  }
  getStorageIdOfPeer(peerId) {
    return this.peerMetadataByPeerId[peerId]?.storageId;
  }
  /**
   * Creates a new document and returns a handle to it. The initial value of the document is an
   * empty object `{}` unless an initial value is provided. Its documentId is generated by the
   * system. we emit a `document` event to advertise interest in the document.
   */
  create(initialValue) {
    let initialDoc;
    if (isPlainObject(initialValue) && hasAtLeastOneKey(initialValue)) {
      initialDoc = implementation_exports.from(initialValue);
    } else {
      initialDoc = implementation_exports.emptyChange(implementation_exports.init());
    }
    const { documentId } = parseAutomergeUrl(generateAutomergeUrl());
    const handle2 = this.#getHandle({
      documentId
    });
    this.#registerHandleWithSubsystems(handle2);
    handle2.update(() => {
      return initialDoc;
    });
    handle2.doneLoading();
    return handle2;
  }
  /**
   * Creates a new document and returns a handle to it. The initial value of the
   * document is an empty object `{}` unless an initial value is provided. The
   * main difference between this and Repo.create is that if an `idGenerator`
   * was provided at repo construction, that idGenerator will be used to
   * generate the document ID of the document returned by this method.
   *
   * This is a hidden, experimental API which is subject to change or removal without notice.
   * @hidden
   * @experimental
   */
  async create2(initialValue) {
    let initialDoc;
    if (initialValue) {
      initialDoc = implementation_exports.from(initialValue);
    } else {
      initialDoc = implementation_exports.emptyChange(implementation_exports.init());
    }
    let { documentId } = parseAutomergeUrl(generateAutomergeUrl());
    if (this.#idFactory) {
      const rawDocId = await this.#idFactory(implementation_exports.getHeads(initialDoc));
      documentId = binaryToDocumentId(rawDocId);
    }
    const handle2 = this.#getHandle({
      documentId
    });
    this.#registerHandleWithSubsystems(handle2);
    handle2.update(() => {
      return initialDoc;
    });
    handle2.doneLoading();
    return handle2;
  }
  /** Create a new DocHandle by cloning the history of an existing DocHandle.
   *
   * @param clonedHandle - The handle to clone
   *
   * @remarks This is a wrapper around the `clone` function in the Automerge library.
   * The new `DocHandle` will have a new URL but will share history with the original,
   * which means that changes made to the cloned handle can be sensibly merged back
   * into the original.
   *
   * Any peers this `Repo` is connected to for whom `sharePolicy` returns `true` will
   * be notified of the newly created DocHandle.
   *
   */
  clone(clonedHandle) {
    if (!clonedHandle.isReady()) {
      throw new Error(`Cloned handle is not yet in ready state.
        (Try await handle.whenReady() first.)`);
    }
    const sourceDoc = clonedHandle.doc();
    const handle2 = this.create();
    handle2.update(() => {
      return implementation_exports.clone(sourceDoc);
    });
    return handle2;
  }
  findWithProgress(id, options = {}) {
    const { signal } = options;
    const { documentId, heads } = isValidAutomergeUrl(id) ? parseAutomergeUrl(id) : { documentId: interpretAsDocumentId(id), heads: void 0 };
    if (this.#handleCache[documentId]) {
      const handle3 = this.#handleCache[documentId];
      if (handle3.state === UNAVAILABLE) {
        const result2 = {
          state: "unavailable",
          error: new Error(`Document ${id} is unavailable`),
          handle: handle3
        };
        return result2;
      }
      if (handle3.state === DELETED) {
        const result2 = {
          state: "failed",
          error: new Error(`Document ${id} was deleted`),
          handle: handle3
        };
        return result2;
      }
      if (handle3.state === READY) {
        const result2 = {
          state: "ready",
          handle: heads ? handle3.view(heads) : handle3
        };
        return result2;
      }
    }
    const cachedProgress = this.#progressCache[documentId];
    if (cachedProgress) {
      const handle3 = this.#handleCache[documentId];
      if (handle3 && (handle3.state === READY || handle3.state === UNAVAILABLE || handle3.state === DELETED || handle3.state === "loading")) {
        return cachedProgress;
      }
    }
    const handle2 = this.#getHandle({ documentId });
    const initial = {
      state: "loading",
      progress: 0,
      handle: handle2
    };
    const progressSignal = {
      subscribers: /* @__PURE__ */ new Set(),
      currentProgress: void 0,
      notify: (progress) => {
        progressSignal.currentProgress = progress;
        progressSignal.subscribers.forEach((callback) => callback(progress));
        this.#progressCache[documentId] = progress;
      },
      peek: () => progressSignal.currentProgress || initial,
      subscribe: (callback) => {
        progressSignal.subscribers.add(callback);
        return () => progressSignal.subscribers.delete(callback);
      }
    };
    progressSignal.notify(initial);
    void this.#loadDocumentWithProgress(id, documentId, handle2, progressSignal, signal ? abortable(foreverPromise, signal) : foreverPromise);
    const result = {
      ...initial,
      peek: progressSignal.peek,
      subscribe: progressSignal.subscribe
    };
    this.#progressCache[documentId] = result;
    return result;
  }
  async #loadDocumentWithProgress(id, documentId, handle2, progressSignal, abortPromise) {
    try {
      progressSignal.notify({
        state: "loading",
        progress: 25,
        handle: handle2
      });
      const loadingPromise = await (this.storageSubsystem ? this.storageSubsystem.loadDoc(handle2.documentId) : Promise.resolve(null));
      const loadedDoc = await Promise.race([loadingPromise, abortPromise]);
      if (loadedDoc) {
        handle2.update(() => loadedDoc);
        handle2.doneLoading();
        progressSignal.notify({
          state: "loading",
          progress: 50,
          handle: handle2
        });
      } else {
        await Promise.race([this.networkSubsystem.whenReady(), abortPromise]);
        handle2.request();
        progressSignal.notify({
          state: "loading",
          progress: 75,
          handle: handle2
        });
      }
      this.#registerHandleWithSubsystems(handle2);
      await Promise.race([handle2.whenReady([READY, UNAVAILABLE]), abortPromise]);
      if (handle2.state === UNAVAILABLE) {
        const unavailableProgress = {
          state: "unavailable",
          handle: handle2
        };
        progressSignal.notify(unavailableProgress);
        return;
      }
      if (handle2.state === DELETED) {
        throw new Error(`Document ${id} was deleted`);
      }
      progressSignal.notify({ state: "ready", handle: handle2 });
    } catch (error) {
      progressSignal.notify({
        state: "failed",
        error: (
          // In most JS environments DOMException extends Error, but not always, in some environments it's a separate type.
          // Some Node.js DOM polyfills do not always extend the Error
          // Jsdom polyfill doesn't extend Error, whereas happy-dom does.
          error instanceof Error || error instanceof DOMException ? error : new Error(String(error))
        ),
        handle: this.#getHandle({ documentId })
      });
    }
  }
  async find(id, options = {}) {
    const { allowableStates = ["ready"], signal } = options;
    if (signal?.aborted) {
      throw new AbortError();
    }
    const progress = this.findWithProgress(id, { signal });
    if ("subscribe" in progress) {
      this.#registerHandleWithSubsystems(progress.handle);
      return new Promise((resolve, reject) => {
        const unsubscribe = progress.subscribe((state) => {
          if (allowableStates.includes(state.handle.state)) {
            unsubscribe();
            resolve(state.handle);
          } else if (state.state === "unavailable") {
            unsubscribe();
            reject(new Error(`Document ${id} is unavailable`));
          } else if (state.state === "failed") {
            unsubscribe();
            reject(state.error);
          }
        });
      });
    } else {
      if (progress.handle.state === READY) {
        return progress.handle;
      }
      await progress.handle.whenReady([READY, UNAVAILABLE]);
      if (progress.handle.state === "unavailable" && !allowableStates.includes(UNAVAILABLE)) {
        throw new Error(`Document ${id} is unavailable`);
      }
      return progress.handle;
    }
  }
  /**
   * Loads a document without waiting for ready state
   */
  async #loadDocument(documentId) {
    if (this.#handleCache[documentId]) {
      return this.#handleCache[documentId];
    }
    const handle2 = this.#getHandle({ documentId });
    const loadedDoc = await (this.storageSubsystem ? this.storageSubsystem.loadDoc(handle2.documentId) : Promise.resolve(null));
    if (loadedDoc) {
      handle2.update(() => loadedDoc);
      handle2.doneLoading();
    } else {
      await this.networkSubsystem.whenReady();
      handle2.request();
    }
    this.#registerHandleWithSubsystems(handle2);
    return handle2;
  }
  /**
   * Retrieves a document by id. It gets data from the local system, but also emits a `document`
   * event to advertise interest in the document.
   */
  async findClassic(id, options = {}) {
    const documentId = interpretAsDocumentId(id);
    const { allowableStates, signal } = options;
    return abortable((async () => {
      const handle2 = await this.#loadDocument(documentId);
      if (!allowableStates) {
        await handle2.whenReady([READY, UNAVAILABLE]);
        if (handle2.state === UNAVAILABLE && !signal?.aborted) {
          throw new Error(`Document ${id} is unavailable`);
        }
      }
      return handle2;
    })(), signal);
  }
  delete(id) {
    const documentId = interpretAsDocumentId(id);
    const handle2 = this.#getHandle({ documentId });
    handle2.delete();
    delete this.#handleCache[documentId];
    delete this.#progressCache[documentId];
    delete this.#saveFns[documentId];
    this.emit("delete-document", { documentId });
  }
  /**
   * Exports a document to a binary format.
   * @param id - The url or documentId of the handle to export
   *
   * @returns Promise<Uint8Array | undefined> - A Promise containing the binary document,
   * or undefined if the document is unavailable.
   */
  async export(id) {
    const documentId = interpretAsDocumentId(id);
    const handle2 = await this.find(documentId);
    const doc = handle2.doc();
    return implementation_exports.save(doc);
  }
  /**
   * Imports document binary into the repo.
   * @param binary - The binary to import
   * @param args - Optional argument specifying what document ID to import into,
   *              if at all possible avoid using this, see the remarks below
   *
   * @remarks
   * If no document ID is provided, a new document will be created. When
   * specifying the document ID it is important to ensure that two documents using
   * the same ID share the same history - i.e. don't create a document with the
   * same ID on unrelated processes that have never communicated with each
   * other. If you need to ship around a bunch of documents with their IDs
   * consider using the `automerge-repo-bundles` package which provides a
   * serialization format for documents and IDs and handles the boilerplate of
   * importing and exporting these bundles.
   */
  import(binary, args) {
    const docId = args?.docId;
    if (docId != null) {
      const handle2 = this.#getHandle({ documentId: docId });
      handle2.update((doc) => {
        return implementation_exports.loadIncremental(doc, binary);
      });
      this.#registerHandleWithSubsystems(handle2);
      return handle2;
    } else {
      const doc = implementation_exports.load(binary);
      const handle2 = this.create();
      handle2.update(() => {
        return implementation_exports.clone(doc);
      });
      return handle2;
    }
  }
  subscribeToRemotes = (remotes) => {
    if (this.#remoteHeadsGossipingEnabled) {
      this.#log("subscribeToRemotes", { remotes });
      this.#remoteHeadsSubscriptions.subscribeToRemotes(remotes);
    } else {
      this.#log("WARN: subscribeToRemotes called but remote heads gossiping is not enabled");
    }
  };
  storageId = async () => {
    if (!this.storageSubsystem) {
      return void 0;
    } else {
      return this.storageSubsystem.id();
    }
  };
  /**
   * Writes Documents to a disk.
   * @hidden this API is experimental and may change.
   * @param documents - if provided, only writes the specified documents.
   * @returns Promise<void>
   */
  async flush(documents) {
    if (!this.storageSubsystem) {
      return;
    }
    const handles = documents ? documents.map((id) => this.#handleCache[id]) : Object.values(this.#handleCache);
    await Promise.all(handles.map(async (handle2) => {
      return this.storageSubsystem.saveDoc(handle2.documentId, handle2.doc());
    }));
  }
  /**
   * Removes a DocHandle from the handleCache.
   * @hidden this API is experimental and may change.
   * @param documentId - documentId of the DocHandle to remove from handleCache, if present in cache.
   * @returns Promise<void>
   */
  async removeFromCache(documentId) {
    if (!this.#handleCache[documentId]) {
      this.#log(`WARN: removeFromCache called but handle not found in handleCache for documentId: ${documentId}`);
      return;
    }
    const handle2 = this.#getHandle({ documentId });
    await handle2.whenReady([READY, UNLOADED, DELETED, UNAVAILABLE]);
    const doc = handle2.doc();
    if (doc) {
      if (handle2.isReady()) {
        handle2.unload();
      } else {
        this.#log(`WARN: removeFromCache called but handle for documentId: ${documentId} in unexpected state: ${handle2.state}`);
      }
      delete this.#handleCache[documentId];
      delete this.#progressCache[documentId];
      delete this.#saveFns[documentId];
      this.synchronizer.removeDocument(documentId);
    } else {
      this.#log(`WARN: removeFromCache called but doc undefined for documentId: ${documentId}`);
    }
  }
  shutdown() {
    this.networkSubsystem.adapters.forEach((adapter) => {
      adapter.disconnect();
    });
    return this.flush();
  }
  metrics() {
    return { documents: this.synchronizer.metrics() };
  }
  shareConfigChanged() {
    void this.synchronizer.reevaluateDocumentShare();
  }
};

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/presence/constants.js
var DEFAULT_HEARTBEAT_INTERVAL_MS = 15e3;
var DEFAULT_PEER_TTL_MS = 3 * DEFAULT_HEARTBEAT_INTERVAL_MS;

// node_modules/.deno/@automerge+automerge-repo@2.5.6/node_modules/@automerge/automerge-repo/dist/index.js
var Counter2 = implementation_exports.Counter;
var RawString2 = implementation_exports.RawString;
var ImmutableString2 = implementation_exports.RawString;
var getChanges2 = implementation_exports.getChanges;
var getAllChanges2 = implementation_exports.getAllChanges;
var applyChanges2 = implementation_exports.applyChanges;
var view2 = implementation_exports.view;
var getConflicts2 = implementation_exports.getConflicts;
var getCursor2 = implementation_exports.getCursor;
var getCursorPosition2 = implementation_exports.getCursorPosition;
var splice2 = implementation_exports.splice;
var updateText2 = implementation_exports.updateText;
var insertAt2 = implementation_exports.insertAt;
var deleteAt2 = implementation_exports.deleteAt;
var mark2 = implementation_exports.mark;
var unmark2 = implementation_exports.unmark;
var isRawString2 = implementation_exports.isRawString;
var isImmutableString2 = implementation_exports.isRawString;
var getObjectId2 = implementation_exports.getObjectId;

// node_modules/.deno/@automerge+automerge-repo-storage-indexeddb@2.5.6/node_modules/@automerge/automerge-repo-storage-indexeddb/dist/index.js
var IndexedDBStorageAdapter = class {
  database;
  store;
  dbPromise;
  /** Create a new {@link IndexedDBStorageAdapter}.
   * @param database - The name of the database to use. Defaults to "automerge".
   * @param store - The name of the object store to use. Defaults to "documents".
   */
  constructor(database = "automerge", store = "documents") {
    this.database = database;
    this.store = store;
    this.dbPromise = this.createDatabasePromise();
  }
  createDatabasePromise() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.database, 1);
      request.onerror = () => {
        reject(request.error);
      };
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore(this.store);
      };
      request.onsuccess = (event) => {
        const db = event.target.result;
        resolve(db);
      };
    });
  }
  async load(keyArray) {
    const db = await this.dbPromise;
    const transaction = db.transaction(this.store);
    const objectStore = transaction.objectStore(this.store);
    const request = objectStore.get(keyArray);
    return new Promise((resolve, reject) => {
      transaction.onerror = () => {
        reject(request.error);
      };
      request.onsuccess = (event) => {
        const result = event.target.result;
        if (result && typeof result === "object" && "binary" in result) {
          resolve(result.binary);
        } else {
          resolve(void 0);
        }
      };
    });
  }
  async save(keyArray, binary) {
    const db = await this.dbPromise;
    const transaction = db.transaction(this.store, "readwrite");
    const objectStore = transaction.objectStore(this.store);
    objectStore.put({ key: keyArray, binary }, keyArray);
    return new Promise((resolve, reject) => {
      transaction.onerror = () => {
        reject(transaction.error);
      };
      transaction.oncomplete = () => {
        resolve();
      };
    });
  }
  async remove(keyArray) {
    const db = await this.dbPromise;
    const transaction = db.transaction(this.store, "readwrite");
    const objectStore = transaction.objectStore(this.store);
    objectStore.delete(keyArray);
    return new Promise((resolve, reject) => {
      transaction.onerror = () => {
        reject(transaction.error);
      };
      transaction.oncomplete = () => {
        resolve();
      };
    });
  }
  async loadRange(keyPrefix) {
    const db = await this.dbPromise;
    const lowerBound = keyPrefix;
    const upperBound = [...keyPrefix, "\uFFFF"];
    const range = IDBKeyRange.bound(lowerBound, upperBound);
    const transaction = db.transaction(this.store);
    const objectStore = transaction.objectStore(this.store);
    const request = objectStore.openCursor(range);
    const result = [];
    return new Promise((resolve, reject) => {
      transaction.onerror = () => {
        reject(request.error);
      };
      request.onsuccess = (event) => {
        const cursor2 = event.target.result;
        if (cursor2) {
          result.push({
            data: cursor2.value.binary,
            key: cursor2.key
          });
          cursor2.continue();
        } else {
          resolve(result);
        }
      };
    });
  }
  async removeRange(keyPrefix) {
    const db = await this.dbPromise;
    const lowerBound = keyPrefix;
    const upperBound = [...keyPrefix, "\uFFFF"];
    const range = IDBKeyRange.bound(lowerBound, upperBound);
    const transaction = db.transaction(this.store, "readwrite");
    const objectStore = transaction.objectStore(this.store);
    objectStore.delete(range);
    return new Promise((resolve, reject) => {
      transaction.onerror = () => {
        reject(transaction.error);
      };
      transaction.oncomplete = () => {
        resolve();
      };
    });
  }
};

// ../src/storage/automerge_indexeddb.ts
function createIndexedDbStorageAdapter(databaseName) {
  return new IndexedDBStorageAdapter(databaseName);
}
function createBrowserAutomergeRepoConfig(options = {}) {
  return {
    storage: options.storageAdapter ?? (options.createStorageAdapter ?? createIndexedDbStorageAdapter)(options.databaseName)
  };
}
function createBrowserAutomergeRepo(options = {}) {
  return new Repo(
    createBrowserAutomergeRepoConfig(options)
  );
}

// app.ts
var $login = document.getElementById("login");
var $register = document.getElementById("register");
var $logout = document.getElementById("logout");
var $userId = document.getElementById("userId");
var $status = document.getElementById("status");
var $todos = document.getElementById("todos");
var $newTodo = document.getElementById("newTodo");
var $addBtn = document.getElementById("addBtn");
var ORIGIN = self.location.origin;
var NAMESPACE = "test-todo";
var DOCUMENT_ID = "todo-doc-1";
var ACCOUNT_ID = localStorage.getItem("test-todo-account") || crypto.randomUUID();
localStorage.setItem("test-todo-account", ACCOUNT_ID);
var accountId = ACCOUNT_ID;
var credentialId = localStorage.getItem("test-todo-cred-id") ?? null;
var sessionId = null;
var sessionExpiresAt = null;
var prfSalt = null;
var repo = createBrowserAutomergeRepo({ databaseName: "test-todo" });
var handle;
async function initDoc() {
  const storedUrl = localStorage.getItem("test-todo-doc-url");
  if (storedUrl && isValidAutomergeUrl(storedUrl)) {
    handle = repo.find(storedUrl);
  } else {
    handle = repo.create({ todos: [] });
    localStorage.setItem("test-todo-doc-url", handle.url);
  }
  await handle.whenReady();
  return getTodos();
}
function getTodos() {
  return [...handle.docSync()?.todos ?? []];
}
function b64urlEncode(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes))).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}
function b64urlDecode(value) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}
async function sha2563(bytes) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
}
async function hkdf(key, salt, info, length) {
  const imported = await crypto.subtle.importKey("raw", key, "HKDF", false, ["deriveBits"]);
  return new Uint8Array(
    await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, imported, length * 8)
  );
}
async function deriveSyncKeys(prfOutput, salt) {
  const material = await hkdf(
    prfOutput,
    salt,
    new TextEncoder().encode("denomerge/sync-key-material/v1"),
    64
  );
  return { authKey: material.slice(0, 32), encryptionKey: material.slice(32, 64) };
}
async function api(url, options = {}) {
  const res = await fetch(`${ORIGIN}${url}`, {
    headers: { "Content-Type": "application/json", ...options.headers ?? {} },
    ...options
  });
  if (!res.ok) throw new Error(`API ${options.method ?? "GET"} ${url} \u2192 ${res.status}`);
  return res.json();
}
async function registerResidentKey() {
  const rpId = self.location.hostname;
  const userId = crypto.getRandomValues(new Uint8Array(32));
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const cred = await navigator.credentials.create({
    publicKey: {
      rp: { id: rpId, name: "test-todo" },
      user: { id: userId, name: "test-todo user", displayName: "test-todo user" },
      challenge,
      pubKeyCredParams: [{ type: "public-key", alg: -7 }],
      authenticatorSelection: { residentKey: "required", requireResidentKey: true, userVerification: "required" },
      extensions: { credProps: true, prf: {} }
    }
  });
  if (!cred) throw new Error("No credential returned");
  const resp = cred.response;
  const rawId = b64urlEncode(cred.rawId);
  const clientDataJSON = b64urlEncode(new Uint8Array(resp.clientDataJSON));
  const authenticatorDataBuffer = resp.getAuthenticatorData();
  if (!authenticatorDataBuffer) throw new Error("Could not get authenticatorData");
  const authenticatorData = b64urlEncode(new Uint8Array(authenticatorDataBuffer));
  let publicKeySpki = null;
  const pkBuf = resp.getPublicKey();
  if (pkBuf) publicKeySpki = b64urlEncode(new Uint8Array(pkBuf));
  if (!publicKeySpki) throw new Error("Could not extract credential public key");
  await api("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      accountId,
      credentialId: rawId,
      attestationData: { clientDataJSON, authenticatorData, publicKey: publicKeySpki }
    })
  });
  credentialId = rawId;
  localStorage.setItem("test-todo-cred-id", credentialId);
  setStatus("Registered! Now authenticate to start syncing.");
  $userId.textContent = `Account: ${accountId.slice(0, 8)}\u2026`;
  $register.style.display = "none";
  $login.style.display = "inline-block";
}
async function authenticateAndGetSyncSession() {
  if (!credentialId) {
    setStatus("No credential found. Please register first.");
    return;
  }
  const { challenge, rpId } = await api(
    `/auth/challenge?accountId=${encodeURIComponent(accountId)}`
  );
  const saltBytes = crypto.getRandomValues(new Uint8Array(32));
  prfSalt = saltBytes;
  const saltHash = b64urlEncode(await sha2563(saltBytes));
  const encodedChallenge = typeof challenge === "string" ? challenge : b64urlEncode(challenge);
  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: b64urlDecode(encodedChallenge),
      rpId,
      allowCredentials: [{ type: "public-key", id: b64urlDecode(credentialId) }],
      userVerification: "required",
      extensions: { prf: { eval: { first: saltBytes } } }
    }
  });
  if (!assertion) throw new Error("No assertion returned");
  const aResp = assertion.response;
  const clientDataJSON = b64urlEncode(new Uint8Array(aResp.clientDataJSON));
  const authenticatorData = b64urlEncode(new Uint8Array(aResp.authenticatorData));
  const signature = aResp.signature ? b64urlEncode(new Uint8Array(aResp.signature)) : null;
  const extResults = assertion.getClientExtensionResults();
  const prfResult = extResults?.prf?.results?.first ? new Uint8Array(extResults.prf.results.first) : null;
  if (!prfResult) throw new Error("No PRF result from authenticator");
  await deriveSyncKeys(prfResult, saltBytes);
  const verifyRes = await api("/auth/verify-prf", {
    method: "POST",
    body: JSON.stringify({ accountId, prfResult: b64urlEncode(prfResult), saltHash, challenge: encodedChallenge, signature, clientDataJSON, authenticatorData, credentialId })
  });
  sessionId = verifyRes.sessionId;
  sessionExpiresAt = new Date(verifyRes.expiresAt);
  localStorage.setItem("test-todo-session", sessionId);
  localStorage.setItem("test-todo-session-expires", sessionExpiresAt.toISOString());
  setStatus(`Logged in! Session expires ${sessionExpiresAt.toLocaleTimeString()}`);
  $userId.textContent = `Account: ${accountId.slice(0, 8)}\u2026`;
  $logout.style.display = "inline-block";
  $login.style.display = "none";
  await loadAndRenderTodos();
}
function buildSyncProof() {
  if (!sessionId || !sessionExpiresAt) throw new Error("No active sync session");
  return { sessionId, expiresAt: sessionExpiresAt.toISOString() };
}
async function pushToServer() {
  if (!sessionId || !sessionExpiresAt || sessionExpiresAt < /* @__PURE__ */ new Date()) return;
  const doc = handle.docSync();
  if (!doc) return;
  const bytes = save(doc);
  const res = await fetch(`${ORIGIN}/sync/${NAMESPACE}/${accountId}/${DOCUMENT_ID}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-denomerge-sync-proof": JSON.stringify(buildSyncProof()) },
    body: JSON.stringify({ bytesBase64: b64urlEncode(bytes) })
  });
  if (!res.ok) console.warn("[sync] push failed:", res.status, await res.text());
}
async function loadAndRenderTodos() {
  if (!sessionId || !sessionExpiresAt || sessionExpiresAt < /* @__PURE__ */ new Date()) return;
  try {
    const res = await fetch(`${ORIGIN}/sync/${NAMESPACE}/${accountId}/${DOCUMENT_ID}`, {
      headers: { "x-denomerge-sync-proof": JSON.stringify(buildSyncProof()) }
    });
    if (res.ok && res.status !== 204) {
      const data = await res.json();
      if (data.bytesBase64) {
        const remoteDoc = load3(b64urlDecode(data.bytesBase64));
        const localDoc = handle.docSync();
        const merged = merge(clone(localDoc), remoteDoc);
        const incoming = getChanges(localDoc, merged);
        if (incoming.length > 0) {
          const mergedTodos = [...merged.todos];
          handle.change((d) => {
            while (d.todos.length > 0) d.todos.pop();
            for (const t of mergedTodos) d.todos.push({ id: t.id, text: t.text, done: t.done });
          });
        }
      }
    }
  } catch (e) {
    console.warn("[sync] pull failed:", e);
  }
  renderTodos(getTodos());
}
function renderTodos(items) {
  $todos.innerHTML = "";
  items.forEach((todo, i) => {
    const li = document.createElement("li");
    li.className = todo.done ? "done" : "";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!todo.done;
    checkbox.addEventListener("change", () => toggleTodo(i));
    const label = document.createElement("span");
    label.textContent = todo.text;
    const del = document.createElement("button");
    del.textContent = "\xD7";
    del.addEventListener("click", () => deleteTodo(i));
    li.append(checkbox, label, del);
    $todos.appendChild(li);
  });
}
function setStatus(msg) {
  $status.textContent = msg;
  console.log("[test-todo]", msg);
}
async function addTodo(text) {
  if (!text.trim()) return;
  handle.change((d) => {
    d.todos.push({ id: Date.now(), text: text.trim(), done: false });
  });
  renderTodos(getTodos());
  await pushToServer();
}
async function toggleTodo(index) {
  handle.change((d) => {
    if (d.todos[index]) d.todos[index].done = !d.todos[index].done;
  });
  renderTodos(getTodos());
  await pushToServer();
}
async function deleteTodo(index) {
  handle.change((d) => {
    d.todos.splice(index, 1);
  });
  renderTodos(getTodos());
  await pushToServer();
}
$register.addEventListener("click", async () => {
  try {
    setStatus("Registering passkey\u2026");
    await registerResidentKey();
  } catch (e) {
    setStatus(`Registration failed: ${e.message}`);
  }
});
$login.addEventListener("click", async () => {
  try {
    setStatus("Authenticating\u2026");
    await authenticateAndGetSyncSession();
  } catch (e) {
    setStatus(`Login failed: ${e.message}`);
  }
});
$logout.addEventListener("click", () => {
  sessionId = null;
  sessionExpiresAt = null;
  prfSalt = null;
  localStorage.removeItem("test-todo-session");
  localStorage.removeItem("test-todo-session-expires");
  setStatus("Logged out.");
  $logout.style.display = "none";
  $login.style.display = "inline-block";
  $register.style.display = "inline-block";
  $todos.innerHTML = "";
});
$addBtn.addEventListener("click", async () => {
  await addTodo($newTodo.value);
  $newTodo.value = "";
});
$newTodo.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    await addTodo($newTodo.value);
    $newTodo.value = "";
  }
});
async function init2() {
  const storedSession = localStorage.getItem("test-todo-session");
  const storedExpires = localStorage.getItem("test-todo-session-expires");
  const todos = await initDoc();
  if (storedSession && storedExpires) {
    sessionId = storedSession;
    sessionExpiresAt = new Date(storedExpires);
    if (sessionExpiresAt > /* @__PURE__ */ new Date()) {
      setStatus(`Session active until ${sessionExpiresAt.toLocaleTimeString()}`);
      $userId.textContent = `Account: ${accountId.slice(0, 8)}\u2026`;
      $logout.style.display = "inline-block";
      $login.style.display = "none";
      $register.style.display = "none";
      renderTodos(todos);
      await loadAndRenderTodos();
      return;
    }
  }
  $userId.textContent = `Account: ${accountId.slice(0, 8)}\u2026`;
  setStatus("Please register or log in to start syncing.");
  renderTodos(todos);
}
init2();
/*! Bundled license information:

@noble/hashes/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
