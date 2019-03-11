if (typeof JSON !== "object") {
  JSON = {}
}(function() {
  "use strict";

  function f(n) {
    return n < 10 ? "0" + n : n
  }
  if (typeof Date.prototype.toJSON !== "function") {
    Date.prototype.toJSON = function() {
      return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
    };
    String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
      return this.valueOf()
    }
  }
  var cx, escapable, gap, indent, meta, rep;

  function quote(string) {
    escapable.lastIndex = 0;
    return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
      var c = meta[a];
      return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
    }) + '"' : '"' + string + '"'
  }

  function str(key, holder) {
    var i, k, v, length, mind = gap,
      partial, value = holder[key];
    if (value && typeof value === "object" && typeof value.toJSON === "function") {
      value = value.toJSON(key)
    }
    if (typeof rep === "function") {
      value = rep.call(holder, key, value)
    }
    switch (typeof value) {
      case "string":
        return quote(value);
      case "number":
        return isFinite(value) ? String(value) : "null";
      case "boolean":
      case "null":
        return String(value);
      case "object":
        if (!value) {
          return "null"
        }
        gap += indent;
        partial = [];
        if (Object.prototype.toString.apply(value) === "[object Array]") {
          length = value.length;
          for (i = 0; i < length; i += 1) {
            partial[i] = str(i, value) || "null"
          }
          v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
          gap = mind;
          return v
        }
        if (rep && typeof rep === "object") {
          length = rep.length;
          for (i = 0; i < length; i += 1) {
            if (typeof rep[i] === "string") {
              k = rep[i];
              v = str(k, value);
              if (v) {
                partial.push(quote(k) + (gap ? ": " : ":") + v)
              }
            }
          }
        } else {
          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = str(k, value);
              if (v) {
                partial.push(quote(k) + (gap ? ": " : ":") + v)
              }
            }
          }
        }
        v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
        gap = mind;
        return v
    }
  }
  if (typeof JSON.stringify !== "function") {
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    meta = {
      "\b": "\\b",
      "	": "\\t",
      "\n": "\\n",
      "\f": "\\f",
      "\r": "\\r",
      '"': '\\"',
      "\\": "\\\\"
    };
    JSON.stringify = function(value, replacer, space) {
      var i;
      gap = "";
      indent = "";
      if (typeof space === "number") {
        for (i = 0; i < space; i += 1) {
          indent += " "
        }
      } else if (typeof space === "string") {
        indent = space
      }
      rep = replacer;
      if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
        throw new Error("JSON.stringify")
      }
      return str("", {
        "": value
      })
    }
  }
  if (typeof JSON.parse !== "function") {
    cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    JSON.parse = function(text, reviver) {
      var j;

      function walk(holder, key) {
        var k, v, value = holder[key];
        if (value && typeof value === "object") {
          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = walk(value, k);
              if (v !== undefined) {
                value[k] = v
              } else {
                delete value[k]
              }
            }
          }
        }
        return reviver.call(holder, key, value)
      }
      text = String(text);
      cx.lastIndex = 0;
      if (cx.test(text)) {
        text = text.replace(cx, function(a) {
          return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        })
      }
      if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
        j = eval("(" + text + ")");
        return typeof reviver === "function" ? walk({
          "": j
        }, "") : j
      }
      throw new SyntaxError("JSON.parse")
    }
  }
})();
(function() {
  var namespace = "StripeCheckout.require".split("."),
    name = namespace[namespace.length - 1],
    base = this,
    i;
  for (i = 0; i < namespace.length - 1; i++) {
    base = base[namespace[i]] = base[namespace[i]] || {}
  }
  if (base[name] === undefined) {
    base[name] = function() {
      var modules = {},
        cache = {};
      var requireRelative = function(name, root) {
        var path = expand(root, name),
          indexPath = expand(path, "./index"),
          module, fn;
        module = cache[path] || cache[indexPath];
        if (module) {
          return module
        } else if (fn = modules[path] || modules[path = indexPath]) {
          module = {
            id: path,
            exports: {}
          };
          cache[path] = module.exports;
          fn(module.exports, function(name) {
            return require(name, dirname(path))
          }, module);
          return cache[path] = module.exports
        } else {
          throw "module " + name + " not found"
        }
      };
      var expand = function(root, name) {
        var results = [],
          parts, part;
        if (/^\.\.?(\/|$)/.test(name)) {
          parts = [root, name].join("/").split("/")
        } else {
          parts = name.split("/")
        }
        for (var i = 0, length = parts.length; i < length; i++) {
          part = parts[i];
          if (part == "..") {
            results.pop()
          } else if (part != "." && part != "") {
            results.push(part)
          }
        }
        return results.join("/")
      };
      var dirname = function(path) {
        return path.split("/").slice(0, -1).join("/")
      };
      var require = function(name) {
        return requireRelative(name, "")
      };
      require.define = function(bundle) {
        for (var key in bundle) {
          modules[key] = bundle[key]
        }
      };
      require.modules = modules;
      require.cache = cache;
      return require
    }.call()
  }
})();
StripeCheckout.require.define({
  "vendor/cookie": function(exports, require, module) {
    var cookie = {};
    var pluses = /\+/g;

    function extend(target, other) {
      target = target || {};
      for (var prop in other) {
        if (typeof source[prop] === "object") {
          target[prop] = extend(target[prop], source[prop])
        } else {
          target[prop] = source[prop]
        }
      }
      return target
    }

    function raw(s) {
      return s
    }

    function decoded(s) {
      return decodeURIComponent(s.replace(pluses, " "))
    }

    function converted(s) {
      if (s.indexOf('"') === 0) {
        s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\")
      }
      try {
        return config.json ? JSON.parse(s) : s
      } catch (er) {}
    }
    var config = cookie.set = cookie.get = function(key, value, options) {
      if (value !== undefined) {
        options = extend(options, config.defaults);
        if (typeof options.expires === "number") {
          var days = options.expires,
            t = options.expires = new Date;
          t.setDate(t.getDate() + days)
        }
        value = config.json ? JSON.stringify(value) : String(value);
        return document.cookie = [config.raw ? key : encodeURIComponent(key), "=", config.raw ? value : encodeURIComponent(value), options.expires ? "; expires=" + options.expires.toUTCString() : "", options.path ? "; path=" + options.path : "", options.domain ? "; domain=" + options.domain : "", options.secure ? "; secure" : ""].join("")
      }
      var decode = config.raw ? raw : decoded;
      var cookies = document.cookie.split("; ");
      var result = key ? undefined : {};
      for (var i = 0, l = cookies.length; i < l; i++) {
        var parts = cookies[i].split("=");
        var name = decode(parts.shift());
        var cookie = decode(parts.join("="));
        if (key && key === name) {
          result = converted(cookie);
          break
        }
        if (!key) {
          result[name] = converted(cookie)
        }
      }
      return result
    };
    config.defaults = {};
    cookie.remove = function(key, options) {
      if (cookie.get(key) !== undefined) {
        cookie.set(key, "", extend(options, {
          expires: -1
        }));
        return true
      }
      return false
    };
    module.exports = cookie
  }
});
StripeCheckout.require.define({
  "vendor/ready": function(exports, require, module) {
    ! function(name, definition) {
      if (typeof module != "undefined") module.exports = definition();
      else if (typeof define == "function" && typeof define.amd == "object") define(definition);
      else this[name] = definition()
    }("domready", function(ready) {
      var fns = [],
        fn, f = false,
        doc = document,
        testEl = doc.documentElement,
        hack = testEl.doScroll,
        domContentLoaded = "DOMContentLoaded",
        addEventListener = "addEventListener",
        onreadystatechange = "onreadystatechange",
        readyState = "readyState",
        loadedRgx = hack ? /^loaded|^c/ : /^loaded|c/,
        loaded = loadedRgx.test(doc[readyState]);

      function flush(f) {
        loaded = 1;
        while (f = fns.shift()) f()
      }
      doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function() {
        doc.removeEventListener(domContentLoaded, fn, f);
        flush()
      }, f);
      hack && doc.attachEvent(onreadystatechange, fn = function() {
        if (/^c/.test(doc[readyState])) {
          doc.detachEvent(onreadystatechange, fn);
          flush()
        }
      });
      return ready = hack ? function(fn) {
        self != top ? loaded ? fn() : fns.push(fn) : function() {
          try {
            testEl.doScroll("left")
          } catch (e) {
            return setTimeout(function() {
              ready(fn)
            }, 50)
          }
          fn()
        }()
      } : function(fn) {
        loaded ? fn() : fns.push(fn)
      }
    })
  }
});
(function() {
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
      var f, i, j, k, ref, ref1;
      j = this.length;
      f = start ? start : 0;
      for (i = k = ref = f, ref1 = j; ref <= ref1 ? k < ref1 : k > ref1; i = ref <= ref1 ? ++k : --k) {
        if (this[i] === obj) {
          return i
        }
      }
      return -1
    }
  }
}).call(this);
StripeCheckout.require.define({
  "lib/helpers": function(exports, require, module) {
    (function() {
      var delurkWinPhone, helpers, uaVersionFn;
      uaVersionFn = function(re) {
        return function() {
          var uaMatch;
          uaMatch = helpers.userAgent.match(re);
          return uaMatch && parseInt(uaMatch[1])
        }
      };
      delurkWinPhone = function(fn) {
        return function() {
          return fn() && !helpers.isWindowsPhone()
        }
      };
      helpers = {
        userAgent: window.navigator.userAgent,
        escape: function(value) {
          return value && ("" + value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;")
        },
        trim: function(value) {
          return value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
        },
        sanitizeURL: function(value) {
          var SCHEME_WHITELIST, allowed, j, len, scheme;
          if (!value) {
            return
          }
          value = helpers.trim(value);
          SCHEME_WHITELIST = ["data:", "http:", "https:"];
          allowed = false;
          for (j = 0, len = SCHEME_WHITELIST.length; j < len; j++) {
            scheme = SCHEME_WHITELIST[j];
            if (value.indexOf(scheme) === 0) {
              allowed = true;
              break
            }
          }
          if (!allowed) {
            return null
          }
          return encodeURI(value)
        },
        iOSVersion: uaVersionFn(/(?:iPhone OS |iPad; CPU OS )(\d+)_\d+/),
        iOSMinorVersion: uaVersionFn(/(?:iPhone OS |iPad; CPU OS )\d+_(\d+)/),
        iOSBuildVersion: uaVersionFn(/(?:iPhone OS |iPad; CPU OS )\d+_\d+_(\d+)/),
        androidWebkitVersion: uaVersionFn(/Mozilla\/5\.0.*Android.*AppleWebKit\/([\d]+)/),
        androidVersion: uaVersionFn(/Android (\d+)\.\d+/),
        firefoxVersion: uaVersionFn(/Firefox\/(\d+)\.\d+/),
        chromeVersion: uaVersionFn(/Chrome\/(\d+)\.\d+/),
        safariVersion: uaVersionFn(/Version\/(\d+)\.\d+ Safari/),
        iOSChromeVersion: uaVersionFn(/CriOS\/(\d+)\.\d+/),
        iOSNativeVersion: uaVersionFn(/Stripe\/(\d+)\.\d+/),
        ieVersion: uaVersionFn(/(?:MSIE |Trident\/.*rv:)(\d{1,2})\./),
        isiOSChrome: function() {
          return /CriOS/.test(helpers.userAgent)
        },
        isiOSFirefox: function() {
          return helpers.isiOS() && /FxiOS\//.test(helpers.userAgent)
        },
        isiOSWebView: function() {
          return /(iPhone|iPod|iPad).*AppleWebKit((?!.*Safari)|(.*\([^)]*like[^)]*Safari[^)]*\)))/i.test(helpers.userAgent)
        },
        getiOSWebViewType: function() {
          if (helpers.isiOSWebView()) {
            if (window.indexedDB) {
              return "WKWebView"
            } else {
              return "UIWebView"
            }
          }
        },
        isiOS: delurkWinPhone(function() {
          return /(iPhone|iPad|iPod)/i.test(helpers.userAgent)
        }),
        isiOSNative: function() {
          return this.isiOS() && this.iOSNativeVersion() >= 3
        },
        isiPad: function() {
          return /(iPad)/i.test(helpers.userAgent)
        },
        isMac: delurkWinPhone(function() {
          return /mac/i.test(helpers.userAgent)
        }),
        isWindowsPhone: function() {
          return /(Windows\sPhone|IEMobile)/i.test(helpers.userAgent)
        },
        isWindowsOS: function() {
          return /(Windows NT \d\.\d)/i.test(helpers.userAgent)
        },
        isIE: function() {
          return /(MSIE ([0-9]{1,}[\.0-9]{0,})|Trident\/)/i.test(helpers.userAgent)
        },
        isChrome: function() {
          return "chrome" in window
        },
        isSafari: delurkWinPhone(function() {
          var userAgent;
          userAgent = helpers.userAgent;
          return /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)
        }),
        isFirefox: delurkWinPhone(function() {
          return helpers.firefoxVersion() != null
        }),
        isAndroidBrowser: function() {
          var version;
          version = helpers.androidWebkitVersion();
          return version && version < 537
        },
        isAndroidChrome: function() {
          var version;
          version = helpers.androidWebkitVersion();
          return version && version >= 537
        },
        isAndroidDevice: delurkWinPhone(function() {
          return /Android/.test(helpers.userAgent)
        }),
        isAndroidWebView: function() {
          return helpers.isAndroidChrome() && /Version\/\d+\.\d+/.test(helpers.userAgent)
        },
        isAndroidFacebookApp: function() {
          return helpers.isAndroidChrome() && /FBAV\/\d+\.\d+/.test(helpers.userAgent)
        },
        isNativeWebContainer: function() {
          return window.cordova != null || /GSA\/\d+\.\d+/.test(helpers.userAgent)
        },
        isSupportedMobileOS: function() {
          return helpers.isiOS() || helpers.isAndroidDevice()
        },
        isAndroidWebapp: function() {
          var metaTag;
          if (!helpers.isAndroidChrome()) {
            return false
          }
          metaTag = document.getElementsByName("apple-mobile-web-app-capable")[0] || document.getElementsByName("mobile-web-app-capable")[0];
          return metaTag && metaTag.content === "yes"
        },
        isiOSBroken: function() {
          var chromeVersion;
          chromeVersion = helpers.iOSChromeVersion();
          if (helpers.iOSVersion() === 9 && helpers.iOSMinorVersion() >= 2 && chromeVersion && chromeVersion <= 47) {
            return true
          }
          if (helpers.isiPad() && helpers.iOSVersion() === 8) {
            switch (helpers.iOSMinorVersion()) {
              case 0:
                return true;
              case 1:
                return helpers.iOSBuildVersion() < 1
            }
          }
          if (helpers.isiOSFirefox()) {
            return true
          }
          return false
        },
        couldBeBrokenSFSVC: function() {
          var iOSVersion;
          iOSVersion = helpers.iOSVersion();
          return (iOSVersion === 9 || iOSVersion === 10) && !helpers.isiOSWebView() && !helpers.isiOSChrome() && !helpers.isiOSFirefox() && !helpers.isNativeWebContainer() && !helpers.isiPad()
        },
        isSafariStandaloneMode: function() {
          return window.navigator && window.navigator.standalone
        },
        getViewportTags: function() {
          var j, keyval, keyvalSplit, len, metaTags, ref, viewport, viewportContent;
          metaTags = Array.prototype.slice.call(document.getElementsByTagName("meta")).filter(function(tag) {
            return tag.name === "viewport" && tag.getAttribute("content") != null
          });
          if (!metaTags.length) {
            return {}
          }
          viewportContent = metaTags[metaTags.length - 1].content;
          viewport = {};
          ref = viewportContent.split(",");
          for (j = 0, len = ref.length; j < len; j++) {
            keyval = ref[j];
            keyvalSplit = keyval.split("=");
            if (keyvalSplit.length === 2) {
              viewport[keyvalSplit[0].trim()] = keyvalSplit[1].trim()
            }
          }
          return viewport
        },
        isFullscreenMobileCapableViewport: function() {
          var heightIsOK, initialScaleIsOK, viewportTags, widthIsOK;
          viewportTags = this.getViewportTags();
          initialScaleIsOK = !!viewportTags["initial-scale"] && parseInt(viewportTags["initial-scale"], 10) === 1;
          widthIsOK = !viewportTags["width"] || viewportTags["width"] === "device-width";
          heightIsOK = !viewportTags["height"] || viewportTags["height"] === "device-height";
          return initialScaleIsOK && widthIsOK && heightIsOK
        },
        iOSChromeTabViewWillFail: function() {
          var isUserGesture, ref, ref1;
          isUserGesture = (ref = (ref1 = window.event) != null ? ref1.type : void 0) === "click" || ref === "touchstart" || ref === "touchend";
          return helpers.iOSChromeVersion() < 48 && !isUserGesture
        },
        isInsideFrame: function() {
          return window.top !== window.self
        },
        isFallback: function() {
          var androidVersion, criosVersion, ffVersion, iOSVersion;
          if (!("postMessage" in window) || window.postMessageDisabled || document.documentMode && document.documentMode < 8) {
            return true
          }
          androidVersion = helpers.androidVersion();
          if (androidVersion && androidVersion < 4) {
            return true
          }
          iOSVersion = helpers.iOSVersion();
          if (iOSVersion && iOSVersion < 6) {
            return true
          }
          ffVersion = helpers.firefoxVersion();
          if (ffVersion && ffVersion < 11) {
            return true
          }
          criosVersion = helpers.iOSChromeVersion();
          if (criosVersion && criosVersion < 36) {
            return true
          }
          return false
        },
        isSmallScreen: function() {
          return Math.min(window.screen.availHeight, window.screen.availWidth) <= 640 || /FakeCheckoutMobile/.test(helpers.userAgent)
        },
        pad: function(number, width, padding) {
          var leading;
          if (width == null) {
            width = 2
          }
          if (padding == null) {
            padding = "0"
          }
          number = number + "";
          if (number.length > width) {
            return number
          }
          leading = new Array(width - number.length + 1).join(padding);
          return leading + number
        },
        requestAnimationFrame: function(callback) {
          return (typeof window.requestAnimationFrame === "function" ? window.requestAnimationFrame(callback) : void 0) || (typeof window.webkitRequestAnimationFrame === "function" ? window.webkitRequestAnimationFrame(callback) : void 0) || window.setTimeout(callback, 100)
        },
        requestAnimationInterval: function(func, interval) {
          var callback, previous;
          previous = new Date;
          callback = function() {
            var frame, now, remaining;
            frame = helpers.requestAnimationFrame(callback);
            now = new Date;
            remaining = interval - (now - previous);
            if (remaining <= 0) {
              previous = now;
              func()
            }
            return frame
          };
          return callback()
        },
        getQueryParameterByName: function(name) {
          var match;
          match = RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
          return match && decodeURIComponent(match[1].replace(/\+/g, " "))
        },
        addQueryParameter: function(url, name, value) {
          var hashParts, query;
          query = encodeURIComponent(name) + "=" + encodeURIComponent(value);
          hashParts = new String(url).split("#");
          hashParts[0] += hashParts[0].indexOf("?") !== -1 ? "&" : "?";
          hashParts[0] += query;
          return hashParts.join("#")
        },
        bind: function(element, name, callback) {
          if (element.addEventListener) {
            return element.addEventListener(name, callback, false)
          } else {
            return element.attachEvent("on" + name, callback)
          }
        },
        unbind: function(element, name, callback) {
          if (element.removeEventListener) {
            return element.removeEventListener(name, callback, false)
          } else {
            return element.detachEvent("on" + name, callback)
          }
        },
        host: function(url) {
          var parent, parser;
          parent = document.createElement("div");
          parent.innerHTML = '<a href="' + this.escape(url) + '">x</a>';
          parser = parent.firstChild;
          return parser.protocol + "//" + parser.host
        },
        strip: function(html) {
          var ref, ref1, tmp;
          tmp = document.createElement("div");
          tmp.innerHTML = html;
          return (ref = (ref1 = tmp.textContent) != null ? ref1 : tmp.innerText) != null ? ref : ""
        },
        replaceFullWidthNumbers: function(el) {
          var char, fullWidth, halfWidth, idx, j, len, original, ref, replaced;
          fullWidth = "０１２３４５６７８９";
          halfWidth = "0123456789";
          original = el.value;
          replaced = "";
          ref = original.split("");
          for (j = 0, len = ref.length; j < len; j++) {
            char = ref[j];
            idx = fullWidth.indexOf(char);
            if (idx > -1) {
              char = halfWidth[idx]
            }
            replaced += char
          }
          if (original !== replaced) {
            return el.value = replaced
          }
        },
        setAutocomplete: function(el, type) {
          var secureCCFill;
          secureCCFill = helpers.chromeVersion() > 14 || helpers.safariVersion() > 7;
          if (type !== "cc-csc" && (!/^cc-/.test(type) || secureCCFill)) {
            el.setAttribute("x-autocompletetype", type);
            el.setAttribute("autocompletetype", type)
          } else {
            el.setAttribute("autocomplete", "off")
          }
          if (!(type === "country-name" || type === "language" || type === "sex" || type === "gender-identity")) {
            el.setAttribute("autocorrect", "off");
            el.setAttribute("spellcheck", "off")
          }
          if (!(/name|honorific/.test(type) || (type === "locality" || type === "city" || type === "adminstrative-area" || type === "state" || type === "province" || type === "region" || type === "language" || type === "org" || type === "organization-title" || type === "sex" || type === "gender-identity"))) {
            return el.setAttribute("autocapitalize", "off")
          }
        },
        hashCode: function(str) {
          var hash, i, j, ref;
          hash = 5381;
          for (i = j = 0, ref = str.length; j < ref; i = j += 1) {
            hash = (hash << 5) + hash + str.charCodeAt(i)
          }
          return (hash >>> 0) % 65535
        },
        stripeUrlPrefix: function() {
          var match;
          match = window.location.hostname.match("^([a-z-]*)checkout.");
          if (match) {
            return match[1]
          } else {
            return ""
          }
        },
        clientLocale: function() {
          return (window.navigator.languages || [])[0] || window.navigator.userLanguage || window.navigator.language
        },
        dashToCamelCase: function(dashed) {
          return dashed.replace(/-(\w)/g, function(match, char) {
            return char.toUpperCase()
          })
        },
        camelToDashCase: function(cameled) {
          return cameled.replace(/([A-Z])/g, function(g) {
            return "-" + g.toLowerCase()
          })
        },
        isArray: Array.isArray || function(val) {
          return {}.toString.call(val) === "[object Array]"
        }
      };
      module.exports = helpers
    }).call(this)
  }
});
StripeCheckout.require.define({
  "lib/spellChecker": function(exports, require, module) {
    (function() {
      var levenshtein;
      module.exports = {
        levenshtein: levenshtein = function(str1, str2) {
          var d, i, j, k, l, m, n, o, p, ref, ref1, ref2, ref3;
          m = str1.length;
          n = str2.length;
          d = [];
          if (!m) {
            return n
          }
          if (!n) {
            return m
          }
          for (i = k = 0, ref = m; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
            d[i] = [i]
          }
          for (j = l = 1, ref1 = n; 1 <= ref1 ? l <= ref1 : l >= ref1; j = 1 <= ref1 ? ++l : --l) {
            d[0][j] = j
          }
          for (i = o = 1, ref2 = m; 1 <= ref2 ? o <= ref2 : o >= ref2; i = 1 <= ref2 ? ++o : --o) {
            for (j = p = 1, ref3 = n; 1 <= ref3 ? p <= ref3 : p >= ref3; j = 1 <= ref3 ? ++p : --p) {
              if (str1[i - 1] === str2[j - 1]) {
                d[i][j] = d[i - 1][j - 1]
              } else {
                d[i][j] = Math.min(d[i - 1][j], d[i][j - 1], d[i - 1][j - 1]) + 1
              }
            }
          }
          return d[m][n]
        },
        suggest: function(dictionary, badword, threshold) {
          var dist, k, len, maxDist, suggestion, word;
          if (threshold == null) {
            threshold = Infinity
          }
          maxDist = Infinity;
          suggestion = null;
          for (k = 0, len = dictionary.length; k < len; k++) {
            word = dictionary[k];
            dist = levenshtein(word, badword);
            if (dist < maxDist) {
              maxDist = dist;
              suggestion = word
            }
          }
          if (maxDist < threshold) {
            return suggestion
          } else {
            return null
          }
        }
      }
    }).call(this)
  }
});
StripeCheckout.require.define({
  "lib/optionHelpers": function(exports, require, module) {
    (function() {
      var dumpObject, flatten, helpers, identity, prettyPrint, repr, toBoolean, toNumber, toString, truncate;
      helpers = require("lib/helpers");
      flatten = function(obj) {
        var flattened, key, ref, val;
        flattened = {};
        for (key in obj) {
          val = obj[key];
          if ((ref = typeof val) === "function" || ref === "object") {
            flattened[key] = "" + val
          } else {
            flattened[key] = val
          }
        }
        return JSON.stringify(flattened)
      };
      repr = function(val) {
        switch (typeof val) {
          case "function":
            return '"' + val + '"';
          case "object":
            return flatten(val);
          default:
            return "" + JSON.stringify(val)
        }
      };
      truncate = function(val, cap) {
        if (val.length - 3 > cap) {
          return val.slice(0, cap - 3) + "..."
        } else {
          return val
        }
      };
      dumpObject = function(obj) {
        return truncate(repr(obj), 50)
      };
      prettyPrint = function(key, rawOptions) {
        var original, ref;
        original = (ref = rawOptions.__originals) != null ? ref[key] : void 0;
        if (original) {
          return original
        } else if (rawOptions.buttonIntegration) {
          return "data-" + helpers.camelToDashCase(key)
        } else {
          return key
        }
      };
      toBoolean = function(val) {
        return val !== "false" && val !== false && val != null
      };
      toNumber = function(val) {
        if (typeof val === "number") {
          return val
        } else if (typeof val === "string") {
          return parseInt(val)
        }
      };
      toString = function(val) {
        if (val == null) {
          return ""
        } else {
          return "" + val
        }
      };
      identity = function(val) {
        return val
      };
      module.exports = {
        prettyPrint: prettyPrint,
        flatten: flatten,
        repr: repr,
        truncate: truncate,
        dumpObject: dumpObject,
        toBoolean: toBoolean,
        toNumber: toNumber,
        toString: toString,
        identity: identity
      }
    }).call(this)
  }
});
StripeCheckout.require.define({
  "lib/paymentMethods": function(exports, require, module) {
    (function() {
      var ERROR, METHODS, OPTIONAL, PRETTY_METHODS, PRIVATE, REQUIRED, WARNING, _exports, alipayEnabled, alipayToCanonical, canonicalize, checkContext, checkNoDuplicates, checkNoOldAPI, coerceDefaults, deepMethodTypeCheck, helpers, isValidMethod, methodName, methodsArrayToDict, optionHelpers, optionValidator, ref, ref1, simpleMethodTypeCheck, simpleToCanonical, singleMethodTypeCheck, spec, transformMethods, hasProp = {}.hasOwnProperty,
        indexOf = [].indexOf || function(item) {
          for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && this[i] === item) return i
          }
          return -1
        };
      helpers = require("lib/helpers");
      optionHelpers = require("lib/optionHelpers");
      optionValidator = require("lib/optionValidator");
      ref = optionValidator.severities, ERROR = ref.ERROR, WARNING = ref.WARNING;
      ref1 = optionValidator.importances, OPTIONAL = ref1.OPTIONAL, REQUIRED = ref1.REQUIRED, PRIVATE = ref1.PRIVATE;
      alipayEnabled = function(key, val, options) {
        var prettyAlipay, type;
        type = typeof val;
        if (type !== "boolean" && val !== "auto") {
          prettyAlipay = optionHelpers.prettyPrint("alipay", options);
          return {
            type: WARNING,
            message: "The '" + prettyAlipay + "' option can be true, false, or 'auto', but instead we found " + optionHelpers.dumpObject(val) + "."
          }
        } else {
          return null
        }
      };
      METHODS = {
        alipay: {
          method: {
            importance: REQUIRED,
            spec: optionValidator.ignore,
            checkContext: optionValidator.ignore
          },
          enabled: {
            importance: REQUIRED,
            spec: alipayEnabled,
            checkContext: optionValidator.ignore,
            "default": false
          },
          reusable: {
            importance: OPTIONAL,
            spec: optionValidator.isNullableBoolean,
            checkContext: optionValidator.ignore,
            "default": false
          }
        },
        card: {
          method: {
            importance: REQUIRED,
            spec: optionValidator.ignore,
            checkContext: optionValidator.ignore
          },
          enabled: {
            importance: OPTIONAL,
            spec: optionValidator.isBoolean,
            checkContext: optionValidator.ignore,
            "default": true
          }
        },
        bitcoin: {
          method: {
            importance: REQUIRED,
            spec: optionValidator.ignore,
            checkContext: optionValidator.ignore
          },
          enabled: {
            importance: OPTIONAL,
            spec: optionValidator.isBoolean,
            checkContext: optionValidator.ignore,
            "default": false
          }
        }
      };
      isValidMethod = function(method) {
        return method in METHODS
      };
      PRETTY_METHODS = function() {
        var method, methods, n;
        methods = function() {
          var results;
          results = [];
          for (method in METHODS) {
            results.push("'" + method + "'")
          }
          return results
        }();
        n = methods.length;
        methods[n - 1] = "or " + methods[n - 1];
        return methods.join(", ")
      }();
      simpleMethodTypeCheck = function(method) {
        var prettyMethod;
        if (!isValidMethod(method)) {
          prettyMethod = optionHelpers.dumpObject(methodSettings.method);
          return {
            type: ERROR,
            message: "'" + method + "' is not a valid payment method. It must be one of " + PRETTY_METHODS
          }
        } else {
          return null
        }
      };
      deepMethodTypeCheck = function(methodSettings) {
        var error, errors, optionSpec, ref2, warnings;
        error = simpleMethodTypeCheck(methodSettings.method);
        if (error != null) {
          return error
        }
        optionSpec = METHODS[methodSettings.method];
        ref2 = optionValidator.validate(optionSpec, methodSettings), errors = ref2.errors, warnings = ref2.warnings;
        errors = errors.concat(warnings);
        if (errors.length > 0) {
          return {
            type: ERROR,
            message: "Error when checking the '" + methodSettings.method + "' method:\n" + errors[0].toString()
          }
        } else {
          return null
        }
      };
      singleMethodTypeCheck = function(method, idx) {
        var methodSettings, pretty;
        if (typeof method === "string") {
          return simpleMethodTypeCheck(method)
        } else if ((method != null ? method.method : void 0) != null) {
          methodSettings = method;
          return deepMethodTypeCheck(methodSettings)
        } else {
          pretty = optionHelpers.dumpObject(methodSettings);
          return {
            type: ERROR,
            message: "All elements of paymentMethods need to be either an object with a 'method' property or one of these strings: " + PRETTY_METHODS + ".\n At index " + idx + " we found '" + pretty + "' which was neither."
          }
        }
      };
      spec = function(key, val, options) {
        var actualType, error, i, idx, len, method;
        if (val === null) {
          return null
        }
        if (!helpers.isArray(val)) {
          actualType = val === null ? "null" : typeof val;
          return {
            type: ERROR,
            message: "Looking for an Array, but instead we found '" + actualType + "'."
          }
        }
        for (idx = i = 0, len = val.length; i < len; idx = ++i) {
          method = val[idx];
          error = singleMethodTypeCheck(method, idx);
          if (error != null) {
            return error
          }
        }
        return null
      };
      checkNoDuplicates = function(val) {
        var i, idx, len, method, ref2, sortedMethods, usedMethods;
        usedMethods = function() {
          var i, len, results;
          results = [];
          for (i = 0, len = val.length; i < len; i++) {
            method = val[i];
            if (typeof method === "string") {
              results.push(method)
            } else if ((method != null ? method.method : void 0) != null) {
              results.push(method.method)
            } else {
              results.push(null)
            }
          }
          return results
        }();
        sortedMethods = usedMethods.concat().sort();
        ref2 = sortedMethods.slice(1);
        for (idx = i = 0, len = ref2.length; i < len; idx = ++i) {
          method = ref2[idx];
          if (method === sortedMethods[idx]) {
            return {
              type: ERROR,
              message: "You've configured the payment method '" + method + "' multiple times."
            }
          }
        }
        return null
      };
      checkNoOldAPI = function(options) {
        var alipay, alipayReusable, bitcoin, paymentMethods;
        if (options.alipay != null || options.bitcoin != null || options.alipayReusable != null) {
          alipay = optionHelpers.prettyPrint("alipay", options);
          alipayReusable = optionHelpers.prettyPrint("alipayReusable", options);
          bitcoin = optionHelpers.prettyPrint("bitcoin", options);
          paymentMethods = optionHelpers.prettyPrint("paymentMethods", options);
          return {
            type: ERROR,
            message: "Setting any of the the '" + alipay + "', '" + alipayReusable + "', or '" + bitcoin + "' options is disallowed if you are using '" + paymentMethods + "'."
          }
        } else {
          return null
        }
      };
      checkContext = function(key, val, options) {
        var error;
        error = checkNoOldAPI(options);
        if (error != null) {
          return error
        }
        if (val == null) {
          return
        }
        return checkNoDuplicates(val)
      };
      coerceDefaults = function(methodSpec, methodSettings) {
        var results, setting;
        results = [];
        for (setting in methodSpec) {
          if (methodSettings[setting] == null) {
            results.push(methodSettings[setting] = methodSpec[setting]["default"])
          } else {
            results.push(void 0)
          }
        }
        return results
      };
      simpleToCanonical = function(method, enabled) {
        var methodSettings;
        methodSettings = {
          method: method,
          enabled: enabled
        };
        coerceDefaults(METHODS[method], methodSettings);
        return methodSettings
      };
      alipayToCanonical = function(enabled, reusable) {
        var methodSettings;
        methodSettings = {
          method: "alipay",
          enabled: enabled,
          reusable: reusable
        };
        coerceDefaults(METHODS.alipay, methodSettings);
        return methodSettings
      };
      transformMethods = function(paymentMethods) {
        var has, hasMethod, i, len, method, methodSettings, result;
        result = [];
        has = {};
        for (method in METHODS) {
          has[method] = false
        }
        for (i = 0, len = paymentMethods.length; i < len; i++) {
          method = paymentMethods[i];
          if (typeof method === "string") {
            result.push(simpleToCanonical(method, true));
            has[method] = true
          } else {
            methodSettings = method;
            if (methodSettings["enabled"] == null) {
              methodSettings["enabled"] = true
            }
            coerceDefaults(METHODS[methodSettings.method], methodSettings);
            has[methodSettings.method] = true;
            result.push(methodSettings)
          }
        }
        for (method in has) {
          hasMethod = has[method];
          if (!hasMethod) {
            result.push(simpleToCanonical(method, false))
          }
        }
        return result
      };
      methodsArrayToDict = function(paymentMethods) {
        var enabled, i, len, methodSettings, settings;
        settings = {};
        enabled = [];
        for (i = 0, len = paymentMethods.length; i < len; i++) {
          methodSettings = paymentMethods[i];
          settings[methodSettings.method] = methodSettings;
          if (methodSettings.enabled !== false) {
            enabled.push(methodSettings.method)
          }
        }
        return {
          settings: settings,
          enabled: enabled
        }
      };
      canonicalize = function(rawOptions) {
        var blacklist, hasAlipay, option, result, val;
        result = {};
        blacklist = ["bitcoin", "alipay", "alipayReusable"];
        for (option in rawOptions) {
          if (!hasProp.call(rawOptions, option)) continue;
          val = rawOptions[option];
          if (indexOf.call(blacklist, option) < 0) {
            result[option] = val
          }
        }
        if (rawOptions.paymentMethods != null) {
          result.paymentMethods = methodsArrayToDict(transformMethods(rawOptions.paymentMethods))
        } else {
          hasAlipay = rawOptions.alipay || rawOptions.alipayReusable || false;
          result.paymentMethods = methodsArrayToDict([simpleToCanonical("card", true), simpleToCanonical("bitcoin", rawOptions.bitcoin || false), alipayToCanonical(hasAlipay, rawOptions.alipayReusable)])
        }
        return result
      };
      _exports = {
        alipayEnabled: alipayEnabled,
        spec: spec,
        checkContext: checkContext,
        canonicalize: canonicalize,
        methods: function() {
          var results;
          results = [];
          for (methodName in METHODS) {
            results.push(methodName)
          }
          return results
        }()
      };
      for (methodName in METHODS) {
        _exports[methodName] = methodName
      }
      module.exports = _exports
    }).call(this)
  }
});
StripeCheckout.require.define({
      "lib/optionSpecs": function(exports, require, module) {
          (function() {
              var BOOLEAN, BUTTON, BUTTON_CONFIGURE_OPTIONS, BUTTON_OPEN_OPTIONS, CUSTOM, CUSTOM_CONFIGURE_OPTIONS, CUSTOM_OPEN_OPTIONS, ERROR, NULLABLE_BOOLEAN, NULLABLE_NUMBER, NULLABLE_STRING, NULLABLE_URL, NUMBER, OPTIONAL, OPTIONS, OTHER, PRIVATE, REQUIRED, STRING, URL, WARNING, generateOptions, helpers, option, optionHelpers, optionValidator, optsettings, paymentMethods, ref, ref1;
              helpers = require("lib/helpers");
              optionHelpers = require("lib/optionHelpers");
              paymentMethods = require("lib/paymentMethods");
              optionValidator = require("lib/optionValidator");
              ref = optionValidator.severities, ERROR = ref.ERROR, WARNING = ref.WARNING;
              ref1 = optionValidator.importances, OPTIONAL = ref1.OPTIONAL, REQUIRED = ref1.REQUIRED, PRIVATE = ref1.PRIVATE;
              BUTTON = "button";
              CUSTOM = "custom";
              STRING = "string";
              URL = "url";
              BOOLEAN = "boolean";
              NUMBER = "number";
              NULLABLE_STRING = "null-string";
              NULLABLE_URL = "null-url";
              NULLABLE_BOOLEAN = "null-boolean";
              NULLABLE_NUMBER = "null-number";
              OTHER = "other";
              OPTIONS = {
                  address: {
                    importance: PRIVATE,
                    type: OTHER,
                    checkContext: function(key, val, options) {
                      var prettyAddress, prettyBilling;
                      prettyAddress = optionHelpers.prettyPrint("address", options);
                      prettyBilling = optionHelpers.prettyPrint("billingAddress", options);
                      return {
                        type: WARNING,
                        message: "'" + prettyAddress + "' is deprecated.  Use '" + prettyBilling + "' instead."
                      }
                    }
                  },
                  alipay: {
                    importance: OPTIONAL,
                    type: OTHER,
                    coerceTo: function(val) {
                      if (val === "auto") {
                        return val
                      }
                      return optionHelpers.toBoolean(val)
                    },
                    spec: function(key, val, options) {
                      if (val === null) {
                        return null
                      } else {
                        return paymentMethods.alipayEnabled(key, val, options)
                      }
                    }
                  },
                  alipayReusable: {
                    importance: OPTIONAL,
                    type: NULLABLE_BOOLEAN,
                    checkContext: optionValidator.xRequiresY("alipayReusable", "alipay")
                  },
                  allowRememberMe: {
                    importance: OPTIONAL,
                    type: NULLABLE_BOOLEAN,
                    "default": true
                  },
                  amount: {
                    importance: OPTIONAL,
                    type: NULLABLE_NUMBER
                  },
                  billingAddress: {
                    importance: OPTIONAL,
                    type: NULLABLE_BOOLEAN
                  },
                  bitcoin: {
                    importance: OPTIONAL,
                    type: NULLABLE_BOOLEAN
                  },
                  buttonIntegration: {
                    importance: PRIVATE,
                    type: BOOLEAN,
                    "default": false
                  },
                  closed: {
                    only: CUSTOM,
                    importance: OPTIONAL,
                    type: OTHER
                  },
                  color: {
                    importance: PRIVATE,
                    type: STRING
                  },
                  createSource: {
                    importance: PRIVATE,
                    type: BOOLEAN
                  },
                  currency: {
                    importance: OPTIONAL,
                    type: NULLABLE_STRING,
                    "default": "usd"
                  },
                  description: {
                    importance: OPTIONAL,
                    type: NULLABLE_STRING
                  },
                  email: {
                    importance: OPTIONAL,
                    type: NULLABLE_STRING
                  },
                  image: {
                    importance: OPTIONAL,
                    type: NULLABLE_URL
                  },
                  key: {
                    importance: REQUIRED,
                    type: STRING
                  },
                  label: {
                    only: BUTTON,
                    importance: OPTIONAL,
                    type: NULLABLE_STRING
                  },
                  locale: {
                    importance: OPTIONAL,
                    type: NULLABLE_STRING
                  },
                  name: {
                    importance: OPTIONAL,
                    type: NULLABLE_STRING
                  },
                  nostyle: {
                    importance: PRIVATE,
                    type: BOOLEAN
                  },
                  notrack: {
                    importance: PRIVATE,
                    type: BOOLEAN
                  },
                  opened: {
                    only: CUSTOM,
                    importance: OPTIONAL,
                    type: OTHER
                  },
                  panelLabel: {
                    importance: OPTIONAL,
                    type: NULLABLE_STRING
                  },
                  paymentMethods: {
                    only: CUSTOM,
                    importance: OPTIONAL,
                    type: OTHER,
                    spec: paymentMethods.spec,
                    checkContext: paymentMethods.checkContext
                  },
                  referrer: {
                    importance: PRIVATE,
                    type: URL
                  },
                  shippingAddress: {
                    importance: OPTIONAL,
                    type: NULLABLE_BOOLEAN,
                    checkContext: optionValidator.xRequiresY("shippingAddress", "billingAddress")
                  },
                  source: {
                    importance: OPTIONAL,
                    type: OTHER,
                    only: CUSTOM,
                    checkContext: optionValidator.xPrecludesY("source", "token")
                  },
                  supportsTokenCallback: {
                    importance: PRIVATE,
                    type: BOOLEAN
                  },
                  timeLoaded: {
                    importance: PRIVATE,
                    type: OTHER
                  },
                  token: {
                    importance: function(integrationType, isConfigure) {
                        if (isConfigure) {
                          return OPTIONAL
                        } else {
                          if (integrationType === BUTTON) {
                            return REQUIRED
                          } else {
                            return function(option, val, rawOptions) {
                                if (!val && !rawOptions["source"]) {
                                  return new optionValidator.ErrorMissingOneOfRequired(rawOptions, option, "source")