const set = new Set();
set.add(1);
console.log(set.values());
console.log(set.has(1));
console.log(set.size);

set.delete(1);

const setA = new Set();
setA.add(1);
setA.add(2);
setA.add(3);
const setB = new Set();
setB.add(2);
setB.add(3);
setB.add(4);

// 模拟并集
const union = (setA, setB) => {
  const unionAb = new Set();
  setA.forEach(value => unionAb.add(value));
  setB.forEach(value => unionAb.add(value));
  return unionAb;
}
console.log(union(setA, setB))

// 模拟交集
const intersection = (setA, setB) => {
  const intersectionAB = new Set();
  setA.forEach(value => {
    if (setB.has(value)) {
      intersectionAB.add(value);
    }
  })
  return intersectionAB;
}
console.log(intersection(setA, setB));

// 模拟差集
const difference = (setA, setB) => {
  const differenceAB = new Set();
  setA.forEach(value => {
    if (!setB.has(value)) {
      differenceAB.add(value)
    }
  })
  return differenceAB;
}
console.log(difference(setA, setB));
