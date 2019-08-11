/**
 * 11.2
 */
function oddsums(n) {
  let total = 0, result = [];
  for(let x = 1; x <= n; x++) {
    let odd = 2*x-1;
    total += odd;
    result.push(total);
  }
  return result;
}
oddsums(5)
 
o = {x: 1, y: 2};
for(let p in o) {
  console.log(p);
}
// for each (let v in o) console.log(v)
/* 
let x = 1;
for(let x = 1; x < 5; x++)
  console.log(x)
{
  let x = x + 1;
  console.log(x);
}

let x=1, y=2;
let (x = x + 1, y = x + 2) {
  console.log(x + y)
};
console.log(x+y);

let x = 1, y = 2;
console.log(let (x = x + 1, y = x + 2) x+y );
 */

 /**
  * 11.3
  */
 