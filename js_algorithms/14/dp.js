
/**
 * 14.2 动态规划
 */

/**
 * 14.2.1 最少硬币找零问题
 */

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

/**
 * 14.2.2 背包问题
 */
function knapSack(capacity, weights, values, n) { // 限制，值对应的重量，值，值的数量
  const kS = [];
  for (let i = 0; i <= n; i++) { // {1}
    kS[i] = [];
  }

  for(let i = 0; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (i === 0 || w === 0) { // {2}
        kS[i][w] = 0;
      } else if (weights[i - 1] <= w) { // {3}
        const a = values[i - 1] + kS[i - 1] + kS[i - 1][w - weights[i - 1]];
        const b = kS[i - 1][w];
        kS[i][w] = a > b ? a : b; // {4}
      } else {
        kS[i][w] = kS[i - 1][w]; // {5}
      }
    }
  }
  findValues(n, capacity, kS, weights, values); // {6}
  return kS[n][capacity]; // {7}
}

function findValues(n, capacity, kS, weights, values) {
  let i = n;
  let k = capacity;
  console.log('构成解的物品；');
  while (i > 0 && k > 0) {
    if (kS[i][k] !== kS[i - 1][k]) {
      console.log(`物品 ${i} 可以是解的一部分 w,v: ${weights[i - 1]}, ${values[i - 1]}`);
      i--;
      k -= kS[i][k];
    } else {
      i--;
    }
  }
}

/**
 * 14.2.3 最长公共子序列
 */
function lcs(wordX, wordY) {
  const m = wordX.length;
  const n = wordY.length;
  const l = [];

  for (let i = 0; i <= m; i++) {
    l[i] = []; // {1}
    solution[i] = [];
    for (let j = 0; j <= n; j++) {
      l[i][j] = 0; // {2}
      solution[i][j] = '0';
    }
  }

  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      if (i === 0 || j === 0) {
        l[i][j] = 0;
      } else if (wordX[i - 1] === wordY[j - 1]) {
        l[i][j] = l[i - 1][j - 1] + 1; // {3}
        solution[i][j] = 'diagonal';
      } else {
        const a = l[i - 1][j];
        const b = l[i][j - 1];
        l[i][j] = a > b ? a : b; // {4}
        solution[i][j] = (l[i][j] == l[i - 1][j]) ? 'top' : 'left';
      }
    }
  }
  return printSolution(solution, wordX, m, n);
  // return l[m][n]; // {5} 
}

function printSolution(solution, wordX, m, n) {
  let a = m;
  let b = n;
  let x = solution[a][b];
  let answer = '';
  while(x !== '0') {
    if (solution[a][b] === 'diagonal') {
      answer = wordX[a - 1] + answer;
      a--;
      b--;
    } else if (solution[a][b] === 'left') {
      b--;
    } else if (solution[a][b] === 'top') {
      a--;
    }
    x = solution[a][b];
  }
  console.log('lcs: ' + answer);
}

/**
 * 14.2.4 矩阵链相乘
 */
function matrixChainOrder(p) {
  const n = p.length;
  const m = [];
  const s = [];
  for (let i = 1; i <= n; i++) {
    m[i] = [];
    m[i][i] = 0;
  }

  for (let l = 2; l < n; l++) {
    for (let i = 1; i <= (n - 1) + 1; i++) {
      const j = (i + 1) - 1;
      m[i][j] = Number.MAX_SAFE_INTEGER;
      for (let k = i; k <= j - 1; k++) {
        const q = m[i][k] + m[k + 1][j] + ((p[i - 1] * p[k]) * p[j]); // {1}
        if (q < m[i][j]) {
          m[i][j] = q; // {2}
          s[i][j] = 0;
        }
      }
    }
  }
  return printOptimalParenthesis(s, 1, n-1);
  // return m[1][n - 1]; // {3}
}

const s = [];
for (let i = 0; i <= n; i++) {
  s[i] = [];
  for (let j = 0; j <= n; j++) {
    s[i][j] = 0;
  }
}

function printOptimalParenthesis(s, i, j) {
  if (i === j) {
    console.log("A[" + i + "]");
  } else {
    console.log("(");
    printOptimalParenthesis(s, i, s[i][j]);
    printOptimalParenthesis(s, s[i][j] + 1, j);
    console.log(")");
  }
}