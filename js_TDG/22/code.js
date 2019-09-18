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
