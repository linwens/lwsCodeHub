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

/**
 * 21.1
 */
/**
 * <img src="" alt="" data-rollover="">
 */
 onLoad(function() {
   for(var i = 0; i < document.images.length; i++) {
     var img = document.images[i];
     var rollover = img.getAttribute("data-rollover");
     if (!rollover) continue;
     (new Image()).src = rollover; // 缓存图片
     img.setAttribute("data-rollout", img.src);
     img.onmouseover = function() {
       this.src = this.getAttribute("data-rollover");
     }
     img.onmouseout = function() {
       this.src = this.getAttribute("data-rollout");
     }
   }
 })

/**
 * 21.3
 */
function pieChart(data, width, height, cx, cy, r, colors, labels, lx, ly) {
  var svgns = "http://www.w3.org/2000/svg";

  var chart = document.createElementNS(svgns, "svg:svg");
  chart.setAttribute("width", width);
  chart.setAttribute("height", height);
  chart.setAttribute("viewBox", "0 0 " + width + " " + height);

  var total = 0;
  for (var i = 0; i < data.length; i++) {
    total += data[i]
  }
  var angles = [];
  for (var i = 0; i < data.length; i++) {
    angles[i] = data[i] / total * Math.PI * 2;
  }
  startangle = 0;
  for (var i = 0; i < data.length; i++) {
    var endangle = startangle + angles[i];
    
    var x1 = cx + r * Math.sin(startangle);
    var y1 = cy - r * Math.cos(startangle);
    var x2 = cx + r * Math.sin(endangle);
    var y2 = cy - r * Math.cos(endangle);

    var big = 0;
    if (endangle - startangle > Math.PI) big = 1;

    var path = document.createElementNS(svgns, "path");
    var d = "M " + cx + "," + cy + " L " + x1 + "," + y1 + " A " + r + "," + r + " 0 " + big + " 1 " + x2 + "," + y2 + " Z";
    
    path.setAttribute("d", d);
    path.setAttribute("fill", colors[i]);
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", "2");
    chart.appendChild(path);

    startangle = endangle;

    var icon = document.createElementNS(svgns, "rect");
    icon.setAttribute("x", lx);
    icon.setAttribute("y", ly + 30*i);
    icon.setAttribute("width", 20);
    icon.setAttribute("height", 20);
    icon.setAttribute("fill", colors[i]);
    icon.setAttribute("stroke", "black");
    icon.setAttribute("stroke-width", "2");
    chart.appendChild(icon);

    var label = document.createElementNS(svgns, "text");
    label.setAttribute("x", lx + 30);
    label.setAttribute("y", ly + 30*i + 18);
    label.setAttribute("font-family", "sans-serif");
    label.setAttribute("font-size", "16");
    label.appendChild(document.createTextNode(labels[i]))
    chart.appendChild(label);
  }
  return chart;
}

// svg时钟
function updateTime(){
  var now = new Date();
  var min = now .getMinutes();
  var hour = (now.getHours() % 12) + min/60;
  var minangle = min * 6;
  var hourangle = hour * 3;

  var minhand = document.getElementById("minutehand");
  var hourhand = document.getElementById("hourhand");

  minhand.setAttribute("transform", "rotate(" + minangle + ",50,50)");
  hourhand.setAttribute("transform", "rotate(" + hourangle + ",50,50)");

  setTimeout(updateTime, 60000);
}

/**
 * 21.4
 */


/**
 * 21.4.1
 */
function polygon(c, n, x, y, r, angle, counterclockwise) {
  angle = angle || 0;
  counterclockwise = counterclockwise || false; // 默认顺时针
  // 一个圆，以半径为斜边求sin cos
  c.moveTo(x + r*Math.sin(angle), y - r*Math.cos(angle)); // 第一个顶点（12点钟方向）
  var delta = 2 * Math.PI/n;
  for (var i = 1; i < n; i++) {
    angle += counterclockwise ? -delta : delta;
    c.lineTo(x + r*Math.sin(angle), y - r*Math.cos(angle));
  }
  c.closePath();
}
onLoad(function() {
  var demo1 = document.getElementById("demo1");
  var ctx1 = demo1.getContext("2d");
  ctx1.beginPath();
  polygon(ctx1, 3, 50, 70, 50);
  polygon(ctx1, 4, 150, 60, 50, Math.PI/4);
  polygon(ctx1, 5, 255, 55, 50);
  polygon(ctx1, 6, 365, 53, 50, Math.PI/6);
  polygon(ctx1, 4, 365, 53, 20, Math.PI/4, true); // 逆时针 ，确保 非零绕线原则

  ctx1.fillStyle = "#ccc";
  ctx1.strokeStyle = "#008";
  ctx1.lineWidth = 5;
  ctx1.fill();
  ctx1.stroke();
})

/**
 * 21.4.2
 */
CanvasRenderingContext2D.prototype.revert = function() {
  this.restore();
  this.save();
  return this;
}
CanvasRenderingContext2D.prototype.attrs = function(o) {
  if (o) {
    for (var a in o) {
      this[a] = o[a];
    }
    return this;
  } else {
    return {
      fillStyle: this.fillStyle,
      font: this.font,
      globalAlpha: this.globalAlpha,
      globalCompositeOperation: this.globalCompositeOperation,
      lineCap: this.lineCap,
      lineJoin: this.lineJoin,
      lineWidth: this.lineWidth,
      miterLimit: this.miterLimit,
      textAlign: this.textAlign,
      textBaseline: this.textBaseline,
      shadowBlur: this.shadowBlur,
      shadowColor: this.shadowColor,
      shadowOffsetX: this.shadowOffsetX,
      shadowOffsetY: this.shadowOffsetY,
      strokeStyle: this.strokeStyle
    }
  }
}

/**
 * 21.4.4
 */
function shear(c, kx, ky) {
  c.transform(1, ky, kx, 1, 0, 0);
}
function rotateAbout(x, theta, x, y) {
  var ct = Math.cos(theta),
  st = Math.sin(theta);
  c.transform(ct, -st, st, ct, -x*ct-y*st+x, x*st-y*ct+y);
}

// 科赫雪花
var deg = Math.PI/180;

function snowflake(c, n, x, y, len) {
  c.save();
  c.translate(x, y);
  c.moveTo(0, 0);
  leg(n);
  c.rotate(-120*deg);
  leg(n);
  c.rotate(-120*deg);
  leg(n);
  c.closePath();
  c.restore();

  function leg(n){
    c.save();
    if (n == 0) {
      c.lineTo(len, 0);
    } else {
      c.scale(1/3, 1/3);
      leg(n-1);
      c.rotate(60*deg);
      leg(n-1);
      c.rotate(-120*deg);
      leg(n-1);
      c.rotate(60*deg);
      leg(n-1);
    }
    c.restore();
    c.translate(len, 0);
  }
}

onLoad(function() {
  var demo2 = document.getElementById("demo2");
  var ctx2 = demo2.getContext("2d");
  snowflake(ctx2, 0, 5, 115, 125)
  snowflake(ctx2, 1, 145, 115, 125)
  snowflake(ctx2, 2, 285, 115, 125)
  snowflake(ctx2, 3, 425, 115, 125)
  snowflake(ctx2, 4, 565, 115, 125)

  ctx2.stroke();
})

/**
 * 21.4.5
 */
function rads(x) {
  return Math.PI*x/180
}

onLoad(function() {
  var demo3 = document.getElementById("demo3");
  var ctx3 = demo3.getContext("2d");

  ctx3.beginPath();
  ctx3.arc(75, 100, 50, 0, rads(360), false);

  ctx3.moveTo(200, 100);
  ctx3.arc(200, 100, 50, rads(-60), rads(0), false);
  ctx3.closePath();

  ctx3.moveTo(325, 100);
  ctx3.arc(325, 100, 50, rads(-60), rads(0), true);
  ctx3.closePath();

  ctx3.moveTo(450, 50);
  ctx3.arcTo(500, 50, 500, 150, 30);
  ctx3.arcTo(500, 150, 400, 150, 20);
  ctx3.arcTo(400, 150, 400, 50, 10);
  ctx3.arcTo(400, 50, 500, 50, 0);
  ctx3.closePath();

  ctx3.moveTo(75, 250);
  ctx3.quadraticCurveTo(100, 200, 175, 250);
  ctx3.fillRect(100-3, 200-3, 6, 6)

  ctx3.moveTo(200, 250);
  ctx3.bezierCurveTo(220, 220, 280, 280, 300, 250);
  ctx3.fillRect(220-3, 220-3, 6, 6);
  ctx3.fillRect(280-3, 280-3, 6, 6);

  ctx3.fillStyle = "#aaa";
  ctx3.lineWidth = 5;
  ctx3.fill();
  ctx3.stroke();
})

/**
 * 21.4.6
 */
onLoad(function() {
  var demo4 = document.getElementById("demo4");
  var ctx4 = demo4.getContext("2d");

  var offscreen = document.createElement("canvas");
  offscreen.width = offscreen.height = 10;
  offscreen.getContext("2d").strokeRect(0, 0, 6, 6);
  var pattern = ctx4.createPattern(offscreen, "repeat");

  var bgfade = ctx4.createLinearGradient(0, 0, demo4.width, demo4.height);
  bgfade.addColorStop(0.0, "transparent");
  bgfade.addColorStop(0.7, "rgba(100, 100, 100, 0.9)");
  bgfade.addColorStop(1.0, "rgba(0, 0, 0, 0)");

  var peekhole = ctx4.createRadialGradient(300, 300, 100, 300, 300, 300);
  peekhole.addColorStop(0.0, "transparent");
  peekhole.addColorStop(0.7, "rgba(100, 100, 100, 0.9)");
  peekhole.addColorStop(1.0, "rgba(0, 0, 0, 0)");

  ctx4.fillStyle = bgfade;
  ctx4.fillRect(0, 0, 600, 600);
  ctx4.strokeStyle = pattern;
  ctx4.lineWidth = 100;
  ctx4.strokeRect(100, 100, 400, 400);
  ctx4.fillStyle = peekhole;
  ctx4.fillRect(0, 0, 600, 600);

});

/**
 * 21.4.10
 */
onLoad(function() {
  var demo5 = document.getElementById("demo5");
  var ctx5 = demo5.getContext("2d");

  ctx5.font = "bold 60pt sans-serif";
  ctx5.lineWidth = 2;
  ctx5.strokeStyle = "#000";

  ctx5.strokeRect(175, 25, 50, 325);
  ctx5.strokeText("<canvas>", 15, 330);

  polygon(ctx5, 3, 200, 225, 200);
  polygon(ctx5, 3, 200, 225, 100, 0, true);

  ctx5.clip();

  ctx5.lineWidth = 10;
  ctx5.stroke();

  ctx5.fillStyle = "#aaa";
  ctx5.fillRect(175, 25, 50, 325);
  ctx5.fillStyle = "#888";
  ctx5.fillText("<canvas>", 15, 330);
});

/**
 * 21.4.11
 */
onLoad(function() {
  var demo6 = document.getElementById("demo6");
  var ctx6 = demo6.getContext("2d");

  ctx6.shadowColor = "rgba(100, 100, 100, 0.4)";
  ctx6.shadowOffsetX = ctx6.shadowOffsetY = 3;
  ctx6.shadowBlur = 5;

  ctx6.lineWidth = 10;
  ctx6.strokeStyle = "blue";
  ctx6.strokeRect(100, 100, 300, 200);
  ctx6.font = "Bold 36pt Helvetica";
  ctx6.fillText("Hello World", 115, 225);

  ctx6.shadowOffsetX = ctx6.shadowOffsetY = 20;
  ctx6.shadowBlur = 10;
  ctx6.fillStyle = "red";
  ctx6.fillRect(50, 25, 200, 65);
  // 命中检测
  demo6.onclick = function(event) {
    if (hitpath(ctx6, event)) {
      alert('Hit!path')
    }
  }
});

/**
 * 21.4.12
 */
onLoad(function() {
  var demo7 = document.getElementById("demo7");
  var ctx7 = demo7.getContext("2d");

  ctx7.moveTo(5, 5);
  ctx7.lineTo(45, 45);
  ctx7.lineWidth = 8;
  ctx7.lineCap = "round";
  ctx7.stroke();

  ctx7.translate(50, 100);
  ctx7.rotate(-45 * Math.PI / 180);
  ctx7.scale(10, 10);

  ctx7.drawImage(ctx7.canvas, 0, 0, 50, 50, 0, 0, 50, 50);

  var img = document.createElement("img");
  img.src = demo7.toDataURL();
  document.body.appendChild(img);
  // 测试动态模糊
  smear(ctx7, 4, 0, 0, 600, 400);
  // 命中检测
  demo7.onclick = function(event) {
    if (hitpaint(ctx7, event)) {
      alert('Hit!paint')
    }
  }
});

/**
 * 21.4.14
 */
function smear(c, n, x, y, w, h) {
  var pixels = c.getImageData(x, y, w, h);

  var width = pixels.width;
  var height = pixels.height;

  var data = pixels.data;
  var m = n-1;
  for (var row = 0; row < height; row++) {
    var i = row*width*4 + 4;
    for (var col = 1; col < width; col++, i += 4) {
      data[i] = (data[i] + data[i-4]*m)/n;
      data[i+1] = (data[i+1] + data[i-3]*m)/n;
      data[i+2] = (data[i+2] + data[i-2]*m)/n;
      data[i+3] = (data[i+3] + data[i-1]*m)/n;
    }
  }
  c.putImageData(pixels, x, y);
}

/**
 * 21.4.15
 */
function hitpath(context, event) {
  var canvas = context.canvas;
  var bb = canvas.getBoundingClientRect();

  var x = (event.clientX-bb.left)*(canvas.width/bb.width);
  var y = (event.clientY-bb.top)*(canvas.height/bb.width);

  return context.isPointInPath(x, y);
}

function hitpaint(context, event) {
  var canvas = context.canvas;
  var bb = canvas.getBoundingClientRect();
  var x = (event.clientX-bb.left)*(canvas.width/bb.width);
  var y = (event.clientY-bb.top)*(canvas.height/bb.width);

  var pixels = context.getImageData(x, y, 1, 1);

  for(var i = 3; i < pixels.data.length; i+=4) {
    if (pixels.data[i] !== 0) return true;
  }
  return false;
}

/**
 * 21.4.16
 */
onLoad(function() {
  var elts = document.getElementsByClassName("sparkline");
  main: for(var e = 0; e < elts.length; e++) {
    var elt = elts[e];
    var content = elt.textContent || elt.innerText;
    var content = content.replace(/^\s+|\s+$/g, "");
    var text = content.replace(/#.*$/gm, "");
    text = text.replace(/[\n\r\t\v\f]/g, " ");
    var data = text.split(/\s+|\s*,\s*/);
    for (var i = 0;i < data.length; i++) {
      data[i] = Number(data[i]);
      if (isNaN(data[i])) continue main;
    }

    var style = getComputedStyle(elt, null);
    var color = style.color;
    var height = parseInt(elt.getAttribute("data-height")) || parseInt(style.fontSize) || 20;
    var width = parseInt(elt.getAttribute("data-width")) || data.length * (parseInt(elt.getAttribute("data-dx")) || height/6);
    var ymin = parseInt(elt.getAttribute("data-ymin")) || Math.min.apply(Math, data);
    var ymax = parseInt(elt.getAttribute("data-ymax")) || Math.max.apply(Math, data);
    if (ymin >= ymax) ymax = ymin + 1;

    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.title = content;
    elt.innerHTML = "";
    elt.appendChild(canvas);

    var context = canvas.getContext("2d");
    for (var i = 0; i < data.length; i++) {
      var x = width*i/data.length;
      var y = (ymax-data[i])*height/(ymax-ymin);
      context.lineTo(x, y);
    }
    context.strokeStyle = color;
    context.stroke();
  }
})