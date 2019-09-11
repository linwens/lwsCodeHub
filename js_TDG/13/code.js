/**
 * 13.3.1
 */
function loadasync(url) {
  var head = document.getElementsByTagName("head")[0];
  var s = document.createElement("script");
  s.src = url;
  head.appendChild(s);
}

/**
 * 13.3.2
 */
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
  onLoad.loaded = true;
})

/**
 * 13.4.6
 */
/*@cc_on
  @if (@_jscript)
    alert('You are using IE')
  @else*/
    alert('You are not using IE')
 /*@end@*/
