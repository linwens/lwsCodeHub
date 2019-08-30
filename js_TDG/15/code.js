/**
 * 15.2.1
 */
 
function getElements(/*ids...*/) {
  var elements = {};
  for(var i = 0; i < arguments.length; i++) {
    var id = arguments[i];
    var elt = document.getElementById(id);
    if (elt == null) {
      throw new Error("No element width id: " + id);
    }
    elements[id] = elt;
  }
  return elements;
}

/**
 * 15.2.3
 */
