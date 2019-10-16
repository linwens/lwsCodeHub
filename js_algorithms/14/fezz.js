/**
 * 14.1 分而治之
 */
const DOES_NOT_EXIST = -1;
const Compare = {
  LESS_THAN: -1,
  BIGGER_THAN: 1,
  EQUALS: 0
};

function defaultCompare(a, b) {
  if (a === b) {
    return Compare.EQUALS;
  }
  return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
}

function binarySearchRecursive(array, value, low, high, compareFn = defaultCompare) {
  if (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const element = array[mid];

    if (compareFn(element, value) === compareFn.LESS_THAN) { // {1}
      return binarySearchRecursive(array, value, mid+1, high, compareFn);
    } else if (compareFn(element, value) === Compare.BIGGER_THAN) { // {2}
      return binarySearchRecursive(array, value, low, mid - 1, compareFn)
    } else {
      return mid; // {3}
    }
  }
  return DOES_NOT_EXIST; // {4}
}

function binarySearch(array, value, compareFn = defaultCompare) {
  const sortedArray = quickSort(array);
  const low = 0;
  const high = sortedArray.length - 1;

  return binarySearchRecursive(array, value, low, high, compareFn);
}

