/**
 * 14.3 贪心算法
 */
/**
 * 14.3.1 最少硬币找零问题
 */
function minCoinChange(coins, amount) {
  const change = [];
  let total = 0;
  for (let i = coins.length; i >= 0; i--) { // {1}
    const coin = coins[i];
    console.log(coin)
    while (total + coin <= amount) { // {2}
      change.push(coin); // {3}
      total += coin; // {4}
    }
  }
  return change;
}

console.log(minCoinChange([1, 5, 10, 25], 36));

/**
 * 14.3.2 分数背包问题
 */
function knapSack(capacity, weights, values) {
  const n = values.length;
  let load = 0;
  let val = 0;
  for (let i = 0; i < n && load < capacity; i++) { // {1}
    if (weights[i] <= capacity - load) { // {2}
      val += values[i];
      load += weights[i];
    } else {
      const r = (capacity - load) / weights[i]; // {3}
      val += r * values[i];
      load += weights[i];
    }
  }
  return val;
}