function heapSort(array, compareFn = defaultCompare) {
  let heapSize = array.length;
  buildMaxHeap(array, compareFn);
  while(heapSize > 1) {
    swap(array, 0, --heapSize);
    heapify(array, 0, heapSize, compareFn);
  }
  return array;
}

function buildMaxHeap(array, compareFn) {
  for (let i = Math.floor(array.length / 2); i >= 0; i -= 1) {
    heapify(array, i, array.length, compareFn);
  }
  return array;
}

const array = [7, 6, 3, 5, 4, 1, 2];
console.log('Before sorting: ', array);
console.log('After sorting: ', heapSort(array));