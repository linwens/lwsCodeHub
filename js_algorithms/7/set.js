class _Set {
  constructor() {
    this.items = {};
  }

  has(element) {
    return element in this.items
    return Object.prototype.hasOwnProperty.call(this.items, element);
  }

  add(element) {
    if (!this.has(element)) {
      this.items[element] = element;
      return true;
    }
    return false;
  }

  delete(element) {
    if (this.has(element)) {
      delete this.items[element];
      return true;
    }
    return false;
  }

  clear() {
    this.items = {};
  }

  size() {
    return Object.keys(this.items).length;
  }

  sizeLegacy() {
    let count = 0;
    for (let key in this.items) {
      if (this.items.hasOwnProperty(key)) {
        count++;
      }
    }
    return count;
  }

  values() {
    return Object.values(this.items);
  }

  valuesLegacy() {
    let values = [];
    for (let key in this.items) {
      console.log(key)
      if (this.items.hasOwnProperty(key)) {
        values.push(key) // 保存的时候键、值是同一个值
      }
    }
    return values;
  }
  // 并集
  union(otherSet) {
    const unionSet = new _Set();
    this.values().forEach(value => unionSet.add(value));
    otherSet.values().forEach(value => unionSet.add(value));
    return unionSet;
  }
  //交集
  intersection(otherSet) {
    const intersectionSet = new _Set();
    const values = this.values();
    const otherValues = otherSet.values();
    // 比较两个几个的大小，选小的进行迭代
    let biggerSet = values;
    let smallerSet = otherValues;

    if (otherValues.length - values.length > 0) {
      biggerSet = otherValues;
      smallerSet = values;
    }
    smallerSet.forEach(value => {
      if (biggerSet.includes(value)) {
        intersectionSet.add(value);
      }
    });
    return intersectionSet;
  }
  // 差集
  difference(otherSet) {
    const differenceSet = new _Set();
    this.values().forEach(value => {
      if (!otherSet.has(value)) {
        differenceSet.add(value);
      }
    });
    return differenceSet;
  }
  //子集
  isSubsetOf(otherSet) {
    if (this.size() > otherSet.size()) {
      return false;
    }
    let isSubset = true;
    this.values().every(value => {
      if (!otherSet.has(value)) {
        isSubset = false;
        return false;
      }
      return true
    });
    return isSubset;
  }
}

const set = new _Set();
set.add(1);
console.log(set.values());
console.log(set.has(1));
console.log(set.size());

set.add(2);
console.log(set.values());
console.log(set.has(2));
console.log(set.size());

set.delete(1);
console.log(set.values());

set.delete(2);
console.log(set.values());

/**
 * 7.3.1
 */
const setA = new _Set();
setA.add(1);
setA.add(2);
setA.add(3);

const setB = new _Set();
setB.add(3);
setB.add(4);
setB.add(5);
setB.add(6);

const unionAB = setA.union(setB);
console.log(unionAB.values());

/**
 * 7.3.3
 */
const setC = new _Set();
setC.add(1);
setC.add(2);
setC.add(3);
const setD = new _Set();
setD.add(2);
setD.add(3);
setD.add(4);
const differenceCD = setC.difference(setD);
console.log(differenceCD.values());

/**
 * 7.3.4
 */
const setE = new _Set();
setE.add(1);
setE.add(2);
const setF = new _Set();
setF.add(1);
setF.add(2);
setF.add(3);
const setG = new _Set();
setG.add(2);
setG.add(3);
setG.add(4);
console.log(setE.isSubsetOf(setF));
console.log(setE.isSubsetOf(setG));
