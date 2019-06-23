/**
 * 5.2
 */
// 下面是一个语句块
{
  x = Math.PI;
  cx = Math.cos(x);
  console.log("cos(π) = " + cx)
}
// 空语句
var a = []
for (i = 0; i < a.length; a[i++] = 0 ); /* empty */

/**
 * 5.5.1
 */
var count = 0;
while (count < 10) {
  console.log(count)
  count++;
}

/**
 * 5.5.2
 */
function printArray(a) {
  var len = a.length, i = 0;
  if (len == 0) {
    console.log("Empty Array")
  } else {
    do {
      console.log(a[i]);
    } while (++i < len);
  }
}
printArray('ab')

/**
 * 5.5.3
 */
function tail(o) {
  for(; o.text; o = o.next) /* empty */
  return o;
}