var pattern = /s$/;
// or
var pattern = new RegExp("s$");

/**
 * 10.2 
 */
"Javascript".search(/script/i);
var text = '';
text.replace(/javascript/gi, "JavaScript");

var quote = /"([^"]*)"/g;
text.replace(quote, ' “$1” ');

"1 plus 2 equals 3".match(/\d+/g)

var url = /(\w+):\/\/([\w.]+)\/(\S*)/;
var text = "Visit my blog at http://www.example.com/~david";
var result = text.match(url);

if (result != null) {
  var fullurl = result[0];
  var protocol = result[1];
  var host = result[2];
  var path = result[3];
}

/**
 * 10.3
 */

var zipcode = new RegExp("\\d{5}", "g");

var pattern = /Java/g;
var text = "JavaScript is more fun than Java!";
var result;
while((result = pattern.exec(text)) != null) {
  console.log(result)
  alert("Matched '" + result[0] + "'" + " at position " + result.index + "; next search begins at " + pattern.lastIndex);
}
var pattern = /java/i;
pattern.test("JavaScript");