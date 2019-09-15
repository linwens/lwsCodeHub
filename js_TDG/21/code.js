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
 * 21.4.3
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