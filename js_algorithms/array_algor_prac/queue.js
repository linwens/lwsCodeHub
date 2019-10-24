/**
 * 406. 根据身高重建队列[中等]
 */
var reconstructQueue = function(people) {
  let arr = [];
  // 先按身高倒序
  let arrSorted = people.sort((a, b) => {
      return b[0] - a[0]
  })
  // 在身高倒序的基础上，按前面人数进行顺序(小到大)
  arrSorted.sort((a, b) => {
    if (a[0] === b[0]) {
      return a[1] - b[1] 
    } else {
      return b[0] - a[0]
    }
  })
  // 从高到低从老队列A里选人，再在新的队列B里插入人，[h, k]中的 k 代表了B队列这个位置上的人进来的时候前面应该有k个人（因为都是从A中选最高的的插入，所以B队列中的人肯定都比新选的人高，所以排在位子k肯定没错）
  for(let i = 0; i < arrSorted.length; i++) { //arrSorted.length
    arr.splice(arrSorted[i][1], 0, arrSorted[i]); //学会用splice往数组任意位置插入值
  }
  console.log(JSON.stringify(arr))
  return arr
};

reconstructQueue([[7,0], [4,4], [7,1], [5,0], [6,1], [5,2]]);

