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

/**
 * 14.2 动态规划
 */

// 最少硬币找零问题
function minCoinChange(coins, amount) { // 货币面值，总额
  const cache = []; // {1} 记忆化
  const makeChange = (value) => { // {2}
    if (!value) { // {3}
      return [];
    }
    if (cache[value]) { // {4}
      return cache[value];
    }
    let min = [];
    let newMin;
    let newAmount;
    for (let i = 0; i < coins.length; i++) { // {5}
      const coin = coins[i];
      newAmount = value - coin; // {6}
      if (newAmount >= 0) {
        newMin = makeChange(newAmount); // {7}
      }
      if (
        newAmount >= 0 &&  // {8}
        (newMin.length < min.length - 1 || !min.length) &&  // {9}
        (newMin.length || !newAmount)  // {10}
      ) {
        min = [coin].concat(newMin);  // {11}
        console.log('new Min ' + min + ' for ' + amount);
      }
    }
    return (cache[value] = min);  // {12}
  };
  return makeChange(amount);  // {13}
}

console.log(minCoinChange([1, 5, 10, 25], 36));