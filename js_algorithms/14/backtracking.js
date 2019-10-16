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

  if (x === n - 1 && y === n - 1){}
}