/**
 * 14.4
 */
// 迷宫老鼠问题
function ratInAMaze(maze) {
  const solution = [];
  for (let i = 0; i < maze.length; i++) { // {1}
    solution[i] = [];
    for (let j = 0; j < maze[i].length; j++) {
      solution[i][j] = 0;
    }
  }
  if (findPath(maze, 0, 0, solution) === true) { // {2}
    return solution;
  }
  return 'NO PATH FOUND'; // {3}
}

function findPath(maze, x, y, solution) {
  const n = maze.length;

  if (x === n - 1 && y === n - 1){ // {4}
    solution[x][y] = 1;
    return true;
  }

  if (isSafe(maze, x, y) === true) { // {5}
    solution[x][y] = 1; // {6}
    if (findPath(maze, x + 1, y, solution)) { // {7}
      return true;
    }

    if (findPath(maze, x, y + 1, solution)) { // {8}
      return true;
    }

    solution[x][y] = 0; // {9}
    return false;
  }
  return false; // {10}
}

function isSafe(maze, x, y) {
  const n = maze.length;
  if (x >= 0 && y >= 0 && x < n && y < n && maze[x][y] !== 0) {
    return true; // {11}
  }
  return false;
}

const maze = [
  [1, 0, 0, 0],
  [1, 1, 1, 1],
  [0, 0, 1, 0],
  [0, 1, 1, 1]
];
const aa = ratInAMaze(maze);
console.log(aa);

/**
 * 14.4.2 数独解题器
 */
function sudokuSolver(matrix) {
  if (solveSudoku(matrix) === true) {
    return matrix;
  }
  return '问题无解!'
}

const UNASSIGNED = 0;
function solveSudoku(matrix) {
  let row = 0;
  let col = 0;
  let checkBlankSpaces = false;
  for (row = 0; row < matrix.length; row++) { // {1} //这个循环检查游戏是否结束
    for (col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] === UNASSIGNED) {
        checkBlankSpaces = true; // {2}
        break;
      }
    }
    if (checkBlankSpaces === true) { // {3}
      break;
    }
  }
  if (checkBlankSpaces === false) {
    return true; // {4}
  }
  for (let num = 1; num <= 9; num++) { // {5}
    if (isSafe_sudoku(matrix, row, col, num)) { // {6} 如果isSafe_sudoku返回false说明错误，上一级递归会得到false，重置当前点为 0
      matrix[row][col] = num; // {7}
      if (solveSudoku(matrix)) { // {8}
        return true;
      }
      matrix[row][col] = UNASSIGNED; // {9}
    }
  }
  return false; // {10}
}

function isSafe_sudoku(matrix, row, col, num) {
  return (
    !usedInRow(matrix, row, num) &&
    !usedInCol(matrix, col, num) &&
    !usedInBox(matrix, row - (row % 3), col - (col % 3), num)
  );
}

function usedInRow(matrix, row, num) {
  for (let col = 0; col < matrix.length; col++) {
    if (matrix[row][col] === num) {
      return true;
    }
  }
  return false;
}
function usedInCol(matrix, col, num) {
  for (let row = 0; row < matrix.length; row++) {
    if (matrix[row][col] === num) {
      return true;
    }
  }
  return false;
}
function usedInBox(matrix, boxStartRow, boxStartCol, num) {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (matrix[row + boxStartRow][col + boxStartCol] === num) { // {13}
        return true;
      }
    }
  }
  return false;
}

const sudokuGrid = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
];
const bb = sudokuSolver(sudokuGrid)
console.log(bb);