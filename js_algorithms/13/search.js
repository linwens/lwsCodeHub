export function defaultEquals(a, b) {
  return a === b;
}

export const Compare = {
  LESS_THAN: -1,
  BIGGER_THAN: 1,
  EQUALS: 0
};

export function defaultCompare(a, b) {
  if (a === b) {
    return Compare.EQUALS;
  }
  return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
}


/**
 * 13.2.1 顺序搜索
 */
const DOES_NOT_EXIST = -1;

function sequentialSearch(array, value, equalsFn = defaultEquals) {
  for (let i = 0; i < array.length; i++) {
    if (equalsFn(value, array[i])) {
      return i;
    }
  }
  return DOES_NOT_EXIST;
}

/**
 * 13.2.2 二分搜索
 */
function binarySearch(array, value, compareFn = defaultCompare) {
  const sortedArray = quickSort(array); // {1} 快速排序
  let low = 0; // {2}
  let high = sortedArray.length - 1; // {3}

  while (lesserOrEquals(low, high, compareFn)) { // {4}
    const mid = Math.floor((low + high) / 2); // {5}
    const element = sortedArray[mid]; // {6}
    if (compareFn(element, value) === Compare.LESS_THAN) { // {7}
      low = mid + 1; // {8}
    } else if (compareFn(element, value) === Compare.BIGGER_THAN) { // {9}
      high = mid - 1; // {10}
    } else {
      return mid; // {11}
    }
  }
  return DOES_NOT_EXIST; // {12}
}

function lesserOrEquals(a, b, compareFn) {
  const comp = compareFn(a, b);
  return comp === Compare.LESS_THAN || comp === Compare.EQUALS;
}

/**
 * 13.2.3 内插搜索
 */
function interpolationSearch(array, value, compareFn = defaultCompare, equalsFn = defaultEquals, diffFn = defaultDiff) {
  const { length } = array;
  let low = 0;
  let high = length - 1;
  let position = -1;
  let delta = -1;
  while (low <= high && biggerOrEquals(value, array[low], compareFn) && lesserOrEquals(value, array[high], compareFn)) {
    delta = diffFn(value, array[low]) / diffFn(array[high], array[low]); // {1}
    position = low + Math.floor((high - low) * delta); // {2}
    if (equalsFn(array[position], value)) { // {3}
      return position;
    }
    // array[position]是当前位置的值，value是要搜索的值
    if (compareFn(array[position], value) === Compare.LESS_THAN) { // {4}
      low = position + 1;
    } else {
      high = position - 1;
    }
  }
  return DOES_NOT_EXIST;
}

function biggerOrEquals(a, b, compareFn) {
  const comp = compareFn(a, b);
  return comp === Compare.BIGGER_THAN || comp === Compare.EQUALS;
}
