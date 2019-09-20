/**
 * 22.1   chrome被墙，可能会无效
 */
/* navigator.geolocation.getCurrentPosition(function(pos) {
  var latitude = pos.coords.latitude;
  var longitude = pos.coords.longitude;
  console.log("Your position: " + latitude + ", " + longitude);
}) */

function getmap() {
  if (!navigator.geolocation) throw "Geolocation not supported";

  var image = document.createElement("img");
  navigator.geolocation.getCurrentPosition(setMapURL);
  return image;

  function setMapURL(pos) {
    var latitude = pos.coords.latitude;
    var longitude = pos.coords.longitude;
    var accuracy = pos.coords.accuracy;

    var url = "http://maps.google.com/maps/api/staticmap" + "?center=" + latitude + "," + longitude + "&size=640x640&sensor=true";

    var zoomlevel = 20;
    if (accuracy > 80) {
      zoomlevel -= Math.round(Math.log(accuracy/50)/Math.LN2);
    }
    url += "&zoom=" + zoomlevel;
    image.src = url;
  }
}

function whereami(elt) {
  var options = {
    enableHighAccuracy: false,
    maximumAge: 300000,
    timeout: 15000
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error, options);
  } else {
    elt.innerHTML = "Geolocation not supported in this browser";
  }

  function error(e) {
    elt.innerHTML = "Geolocation error " + e.code + ": " + e.message;
  }

  function success(pos) {
    var msg = "At " + new Date(pos.timestamp).toLocaleString() + " you were within " + pos.coords.accuracy + " meters of latitude " + pos.coords.latitude + " longitude " + pos.coords.longitude + "."

    if (pos.coords.altitude) {
      msg += " You are " + pos.coords.altitude + " ± " + pos.coords.altitudeAccuracy + "meters above sea level.";
    }

    if (pos.coords.speed) {
      msg += " You are travelling at " + pos.coords.speed + "m/s on heading " + pos.coords.heading + '.';
    }

    elt.innerHTML = msg;
  }
}

/**
 * 22.2
 */
var state, ui;
function newgame(playagain) {
  ui = {
    heading: null,
    prompt: null,
    input: null,
    low: null,
    mid: null,
    high: null
  };

  for(var id in ui) ui[id] = document.getElementById(id);

  ui.input.onchange = handleGuess;

  state = {
    n: Math.floor(99 * Math.random()) + 1,
    low: 0,
    high: 100,
    guessnum: 0,
    guess: undefined
  };

  display(state);
  if (playagain === true) save(state);
}

function save(state) {
  if (!history.pushState) return;
  var url = "#guess" + state.guessnum;
  history.pushState(state, "", url)
}

function popState(event) {
  if (event.state) {
    state = event.state;
    display(state);
  } else {
    history.replaceState(state, "", "#guess" + state.guessnum);
  }
}

function handleGuess() {
  var g = parseInt(this.value);
  if ((g > state.low) && (g < state.high)) {
    if (g < state.n) {
      state.low = g;
    } else if (g > state.n) {
      state.high = g;
    }
    state.guess = g;
    state.guessnum++;
    save(state);
    display(state);
  } else {
    alert("Please enter a number greater than " + state.low + " and less than " + state.high);
  }
}
function display(state) {
  ui.heading.innerHTML = document.title = "I'm thinking of a number between " + state.low + " and " + state.high + ".";

  ui.low.style.width = state.low + "%";
  ui.mid.style.width = (state.high - state.low) + "%";
  ui.high.style.width = (100 - state.high) + "%";

  ui.input.style.visibility = "visible";
  ui.input.value = "";
  ui.input.focus();

  if (state.guess === undefined) {
    ui.prompt.innerHTML = "Type your guess an dhit Enter: ";
  } else if (state.guess < state.n) {
    ui.prompt.innerHTML = state.guess + " is too low. Guess again: ";
  } else if (state.guess > state.n) {
    ui.prompt.innerHTML = state.guess + " is too high. Guess again: ";
  } else {
    ui.input.style.visibility = "hidden";
    ui.heading.innerHTML = document.title = state.guess + " is correct! ";
    ui.prompt.innerHTML = "You Win! <button onclick='newgame(true)'>Play Again</button>";
  }
}

/**
 * 22.3
 */
window.addEventListener("load", function() {
  var origin = "/";
  var gadget = "tweet.html";
  var iframe = document.createElement("iframe");
  iframe.src = '.' + origin + gadget;
  iframe.width = "250";
  iframe.height = "100%";
  iframe.style.cssFloat = "right";

  document.body.insertBefore(iframe, document.body.firstChild);

  var links = document.getElementsByTagName("a");
  for(var i = 0; i < links.length; i++) {
    links[i].addEventListener("mouseover", function() {
      // 给子窗口发消息
      iframe.contentWindow.postMessage(this.href, '*');
    }, false);
  }
}, false);

/**
 * 22.4
 */
function smear(img) {
  img.crossOrigin = '';
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  var context = canvas.getContext("2d");
      context.drawImage(img, 0, 0);
  var pixels = context.getImageData(0, 0, img.width, img.height);

  var worker = new Worker("./SmearWorker.js");
  worker.postMessage(pixels);

  worker.onmessage = function(e) {
    if (typeof e.data === "string") { // 当上面的worker.postMessage(pixels)直接传字符串时，会进入这个if
      console.log("Worker: " + e.data);
      return;
    }
    var smeared_pixels = e.data;
    context.putImageData(smeared_pixels, 0, 0);
    img.src = canvas.toDataURL();
    worker.terminate();
    canvas.width = canvas.height = 0;
  }
}
// worker里走同步ajax请求
var worker2 = new Worker("./syncXHR.js");
    // 去触发./syncXHR.js里的onmessage
    worker2.postMessage(['https://www.shy-u.top/ajax/getList?curPage=1&pageSize=3&from=front']);
worker2.onmessage = function(e) {
  console.log(e)
  worker2.terminate()
}

/**
 * 22.5 不好懂
 */
var bytes = new Uint8Array(1024);
for (var i = 0; i < bytes.length; i++) {
  bytes[i] = i & 0xFF;
}
var copy = new Uint8Array(bytes);
var ints = new Int32Array([0, 1, 2, 3]);

function sieve(n) {
  var a = new Int8Array(n+1);
  var max = Math.floor(Math.sqrt(n));
  var p = 2;
  while(p <= max) {
    for(var i = 2*p; i <= n; i += p) {
      a[i] = 1;
    }
    while(a[++p]);
  }
  while(a[n]) n--;
  return n;
}

var matrix = new Float64Array(9);
var _3DPoint = new Int16Array(3);
var rgba = new Uint8Array(4);
var sudoku = new Uint8Array(81);

var bytes = new Uint8Array(1024);
var pattern = new Uint8Array([0, 1, 2, 3]);
bytes.set(pattern);
bytes.set(pattern, 4);
bytes.set([0, 1, 2, 3], 8);

var ints = new Int16Array([0,1,2,3,4,5,6,7,8,9]);
var last3 = ints.subarray(ints.length-3, ints.length);
console.log(last3[0]); // 7

var buf = new ArrayBuffer(1024*1024);
var asbytes = new Uint8Array(buf);
var asints = new Int32Array(buf);
var lastK = new Uint8Array(buf, 1023*1024);
var ints2 = new Int32Array(buf, 1024, 256);

var little_endian = new Int8Array(new Int32Array([1]).buffer)[0] === 1;

var data = new ArrayBuffer(4*10);
var view = new DataView(data);
var int = view.getInt32(0);
int = view.getInt32(4, false);
int = view.getInt32(8, true);
view.setInt32(8, int, false);

/**
 * 22.6.1
 */
function fileinfo(files) {
  for(var i = 0; i < files.length; i++) {
    var f = files[i];
    console.log(f.name,'| ' + f.size,'| ' + f.type,'| ' + f.lastModifiedDate);
  }
}

/**
 * 22.6.2
 */
function getBlob(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.responseType = "blob";
  xhr.onload = function() {
    callback(xhr.response);
  }
  xhr.send(null);
}

/**
 * 22.6.3
 */
/* var bb = new BlobBuilder(); // BlobBuilder 已废弃，被 Blob 方法替代
bb.append("this blob contains this text and 10 big-endian 32-bit signed ints.");
bb.append("\0");
var ab = new ArrayBuffer(4*10);
var dv = new DataView(ab);
for(var i = 0; i < 10; i++) {
  dv.setInt32(i*4, i)
}
bb.append(ab);
var blob = bb.getBlob("x-optional/mime-type-here"); */

/**
 * 22.6.4
 */
var getBlobURL = (window.URL && URL.createObjectURL.bind(URL)) || (window.webkitURL && webkitURL.createObjectURL.bind(webkitURL)) || window.createObjectURL;

var revokeBlobURL = (window.URL && URL.revokeObjectURL.bind(URL)) || (window.webkitURL && webkitURL.revokeObjectURL.bind(webkitURL)) || window.revokeObjectURL;

window.onload = function() {
  var droptarget = document.getElementById("droptarget");

  droptarget.ondragenter = function(e) {
    var types = e.dataTransfer.types;
    if (!types || (types.contains && types.contains("Files")) || (types.indexOf && types.indexOf("Files") != -1)) {
      droptarget.classList.add("active");
      return false;
    }
  };

  droptarget.ondragleave = function() {
    droptarget.classList.remove("active");
  }

  droptarget.ondragover = function(e) {
    return false;
  }

  droptarget.ondrop = function(e) {
    var files = e.dataTransfer.files;
    for (var i = 0; i < files.length; i++) {
      var type = files[i].type;
      if (type.substring(0, 6) !== "image/") {
        continue
      }
      var img = document.createElement("img");
      img.src = getBlobURL(files[i]);
      img.onload = function() {
        this.width = 100;
        document.body.appendChild(this);
        revokeBlobURL(this.src);
      }
    }
    droptarget.classList.remove("active");
    return false;
  }
}

/**
 * 22.6.5
 */
function readfile(f) {
  var reader = new FileReader();
  reader.readAsText(f);
  reader.onload = function() {
    var text = reader.result;
    var out = document.getElementById("output");
    out.innerHTML = "";
    out.appendChild(document.createTextNode(text));
  }
  reader.onerror = function(e) {
    console.log("Error", e);
  }
}

function typefile(file) {
  var slice = file.slice(0, 4);
  var reader = new FileReader();
  reader.readAsArrayBuffer(slice);
  reader.onload = function(e) {
    var buffer = reader.result;
    var view = new DataView(buffer);
    var magic = view.getUint32(0, false);
    switch(magic) {
      case 0x89504E47: file.verified_type = "image/png"; break;
      case 0x47494638: file.verified_type = "image/gif"; break;
      case 0x25504446: file.verified_type = "application/pdf"; break;
      case 0x504b0304: file.verified_type = "application/zip"; break;
    }
    console.log(file.name, file.verified_type);
  }
}

/**
 * 22.7
 */
window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
// 同步 worker现成线程下
// var fs = requestFileSystemSync(PERSISTENT, 1024*1024);

// 异步
window.requestFileSystem(TEMPORARY, 50*1024*1024, function(fs) {

}, function(e) {
  console.log(e);
})

window.requestFileSystem(PERSISTENT, 10*1024*1024, function(fs) {
  fs.root.getFile("hello.txt", {}, function(entry) { // 获取文件系统
    entry.file(function(file) { // 获取FileEntry对象
      var reader = new FileReader(); // 获取file对象
      reader.readAsText(file);
      reader.onload = function() {
        console.log(reader.result); // 读取文件内容
      }
    })
  })
})

function logerr(e) {
  console.log(e);
}

var filesystem;
requestFileSystem(PERSISTENT, 10*1024*1024, function(fs) {
  filesystem = fs;
},logerr);

function readTextFile(path, callback) {
  filesystem.root.getFile(path, {}, function(entry) {
    entry.file(function(file) {
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function() {
        callback(reader.result);
      }
      reader.onerror = logerr;
    }, logerr)
  }, logerr)
}

function appendToFile(path, contents, callback) {
  filesystem.root.getFile(path, {create: true}, function(entry) {
    entry.createWriter(function(writer) {
      writer.seek(writer.length);
      
      var bb = new BlobBuilder();
      bb.append(contents);
      var blob = bb.getBlob();

      writer.write(blob);
      writer.onerror = logerr;
      if (callback) {
        writer.onwrite = callback;
      }
    }, logerr)
  },logerr)
}

function deleteFile(name, callback) {
  filesystem.root.getFile(name, {}, function(entry) {
    entry.remove(callback, logerr);
  }, logerr);
}

function makeDirectory(name, callback) {
  filesystem.root.getDirectory(name, {
    create: true,
    exclusive: true
  }, callback, logerr)
}

function listFiles(path, callback) {
  if (!path) {
    getFiles(filesystem.root)
  } else {
    filesystem.root.getDirectory(path, {}, getFiles. logerr)
  }

  function getFiles(dir) {
    var reader = dir.createReader();
    var list = [];
    reader.readEntries(handleEntries, logerr);

    function handleEntries(entries) {
      if (entries.length == 0) {
        callback(list);
      } else {
        for (var i = 0; i <entries.length; i++) {
          var name = entries[i].name;
          if (entries[i].isDirectory) {
            name += "/";
          }
          list.push(name);
        }
        reader.readEntries(handleEntries, logerr);
      }
    }
  }
}