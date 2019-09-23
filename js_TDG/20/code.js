// 例 13-5 onLoad函数
function onLoad(f) {
  if (onLoad.loaded) {
    window.setTimeout(f, 0);
  } else if (window.addEventListener) {
    window.addEventListener("load", f, false);
  } else if (window.attachEvent) {
    window.attachEvent("onload", f)
  }
}
onLoad.loaded = false;

onLoad(function() {
/**
 * 20.1
 */
  onLoad.loaded = true;
  var name = localStorage.username;
      name = localStorage["username"];
  if(!name) {
    name = prompt("What is your name?");
    localStorage.username = name;
  }
  for (var name in localStorage) {
    var value = localStorage[name];
  }

  // 存储格式
  localStorage.x = 10;
  var x = parseInt(localStorage.x);

  localStorage.lastRead = (new Date()).toUTCString();
  var lastRead = new Date(Date.parse(localStorage.lastRead));

  localStorage.data = JSON.stringify({a: 1});
  var data = JSON.parse(localStorage.data);

/**
 * 20.1.2
 */
  localStorage.setItem("x", 1);
  localStorage.getItem("x");

  for (var i = 0; i < localStorage.length; i++) {
    var name = localStorage.key(i);
    var value = localStorage.getItem(name);
  }
  localStorage.o = JSON.stringify({x:1});
  localStorage.getItem("o").x = 2;
  console.log(JSON.parse(localStorage.getItem("o")).x); // 1
  localStorage.removeItem("x");
  localStorage.clear();

  var memory = window.localStorage || (window.UserDataStorage && new UserDataStorage()) || new CookieStorage();
  var username = memory.getItem("username");




})
/**
 * 20.2.2
 */
function setcookie(name, value, daysToLive) {
  var cookie = name + "=" + encodeURIComponent(value);
  if (typeof daysToLive === "number") {
    cookie += "; max-age=" + (daysToLive*60*60*24)
  }
  document.cookie = cookie;
}

/**
 * 20.2.3
 */
function getcookie() {
  var cookie = {};
  var all = document.cookie;
  if (all === "") {
    return cookie;
  }
  var list = all.split("; ");
  for (var i = 0; i < list.length; i++) {
    var cookie = list[i];
    var p = cookie.indexOf("=");
    var name = cookie.substring(0, p);
    var value = cookie.substring(p+1);
        value = decodeURIComponent(value);
    cookie[name] = value;
  }
  return cookie;
}

/**
 * 20.2.5
 */
function cookieStorage(maxage, path) {
  var cookie = (function() {
    var cookie = {};
    var all = document.cookie;
    if (all === "") return cookie;
    var list = all.split("; ");
    for (var i = 0; i < list.length; i++) {
      var cookie = list[i];
      var p = cookie.indexOf("=");
      var name = cookie.substring(0, p);
      var value = cookie.substring(p+1);
          value = decodeURIComponent(value);
      cookie[name] = value;
    }
    return cookie;
  }());

  var keys = [];
  for (var key in cookie) keys.push(key);

  this.length = keys.length;
  this.key = function(n) {
    if (n < 0 || n >=keys.length) return null;
    return keys[n];
  }

  this.getItem = function(name) {
    return cookie[name] || null
  }

  this.setItem = function(key, value) {
    if (!(key in cookie)) {
      keys.push(key);
      this.length++;
    }
    cookie[key] = value;
    var cookie = key + "=" + encodeURIComponent(value);

    if (maxage) cookie += "; max-age" + maxage;
    if (path) cookie+= "; path=" + path;

    document.cookie = cookie;
  };

  this.removeItem = function(key) {
    if (!(key in cookie)) return;

    delete cookie[key];

    for(var i = 0; i < keys.length; i++) {
      if (keys[i] === key) {
        keys.splice(i, 1);
        break;
      }
    }
    this.length--;
    document.cookie = key + "=; max-age=0";
  };

  this.clear = function() {
    for (var i = 0; i < keys.length; i++) {
      document.cookie = keys[i] + "=; max-age=0";
    }
    cookie = {};
    keys= [];
    this.length = 0;
  }
}

/**
 * 20.3
 */
function UserDataStorage(maxage) {
  var memory = document.createElement("div");
      memory.style.display = "none";
      memory.style.behavior = "url('#default#userData')";
  document.body.appendChild(memory);

  if (maxage) {
    var now = new Date().getTime();
    var expires = now + maxage * 1000;
    memory.expires = new Date(expires).toUTCString();
  }

  memory.load("UserDataStorage");

  this.getItem = function(key) {
    return memory.getAttribute(key) || null;
  };

  this.setItem = function(key, value) {
    memory.setAttribute(key, value);
    memory.save("UserDataStorage");
  }

  this.removeItem = function(key) {
    memory.removeAttribute(key);
    memory.save("UserDataStorage");
  };
}

/**
 * 20.4.2
 */
function status(msg) {
  document.getElementById("statusline").innerHTML = msg;
  console.log(msg);
}

window.applicationCache.onchecking = function() {
  status("Checking for a new version.");
  return false;
}

window.applicationCache.onnoupdate = function() {
  status("Downloading new version");
  window.progresscount = 0;
  return false;
}

window.applicationCache.onprogress = function(e) {
  var progress = "";
  if (e && e.lengthComputable) {
    progress = " " + Math.round(100*e.loaded / e.total) + "%"
  } else {
    progress = " (" + ++progresscount + ")"
  }
  status("Downloading new version" + progress);
  return false;
}

window.applicationCache.oncached = function() {
  status("This application is now cached locally");
  return false;
}

window.applicationCache.onupdateready = function() {
  status("A new version has been downloaded. Reload to run it");
  return false;
};

window.applicationCache.onerror = function() {
  status("Couldn't load manifest or cache application");
  return false;
}

window.applicationCache.onobsolete = function() {
  status("This application is no longer cached. " + "Reload to get the latest version from the network.");
  return false;
}
/**
 * 20.4.3
 */
