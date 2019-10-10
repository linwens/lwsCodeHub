const myVertices = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

export const breadthFirstSearch = (graph, startVertex, callback) => {
  const vertices = graph.getVertices();
  const adjList = graph.getAdjList();
  const color = initializeColor(vertices);
  const queue = new queue();

  // 寻找最短路径-----
  const distances = {};
  const predecessors = {};
  // -------
  queue.enqueue(startVertex);

  // 寻找最短路径-----
  for (let i = 0; i < vertices.length; i++) {
    distances[vertices[i]] = 0;
    predecessors[vertices[i]] = null;
  }
  // -------

  while (!queue.isEmpty()) {
    const u = queue.dequeue(); // 找到顶点，并从队列里移除
    const neighbors = adjList.get(u); // 找到顶点的所有相邻顶点
    color[u] = Colors.GREY; // 访问 到就置灰，此时还没 探索 完。
    for (let i = 0; i < neighbors.length; i++) { // 访问 相邻顶点 的 相邻顶点
      const w = neighbors[i];
      if (color[w] === Colors.WHITE) {
        color[w] = Colors.GREY;
        // 寻找最短路径-----
        distances[w] = distances[u] + 1;
        predecessors[w] = u;
        // -------
        queue.enqueue(w);
      }
    }
    // 遍历完，说明顶点也 探索 过了，变黑
    color[u] = Colors.BLACK;
    if (callback) {
      callback(u);
    }
  }

  // 寻找最短路径-----
  return {
    distances,
    predecessors
  }
  // -------
}

const fromVertex = myVertices[0];
for (i = 1; i < myVertices.length; i++) {
  const toVertex = myVertices[i];
  const path = new Stack(); // 每个顶点存一个路径
  for (let v = toVertex; v !== fromVertex; v = shortestPathA.predecessors[v]) {
    path.push(v);
  }
  path.push(fromVertex);
  let s = path.pop();
  while (!path.isEmpty()) {
    s += ' - ' + path.pop();
  }
  console.log(s);
}