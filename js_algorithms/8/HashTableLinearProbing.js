function defaultToString(item) {
  if (item === null) {
    return 'NULL';
  } if (item === undefined) {
    return 'UNDEFINED';
  } if (typeof item === 'string' || item instanceof String) {
    return `${item}`;
  }
  return item.toString();
}

class ValuePair {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
  toString() {
    return `[#${this.key}: ${this.value}]`;
  }
}

class HashTableLinearProbing {
  constructor(toStrFn = defaultToString) {
    this.toStrFn = toStrFn;
    this.table = {};
  }

  loseloseHashCode(key) {
    if (typeof key === 'number') {
      return key;
    }
    const tableKey = this.toStrFn(key);
    let hash = 0;
    for (let i = 0; i < tableKey.length; i++) {
      hash += tableKey.charCodeAt(i)
    }
    return hash % 37;
  }

  hashCode(key) {
    return this.loseloseHashCode(key);
  }

  put(key, value) {
    if (key != null && value != null) {
      const position = this.hashCode(key);
      if (this.table[position] == null) {
        this.table[position] = new ValuePair(key, value);
      } else {
        let index = position + 1;
        while(this.table[index] != null) {
          index++;
        }
        this.table[index] = new ValuePair(key, value);
      }
      return true;
    }
    return false;
  }

  get(key) {
    const position = this.hashCode(key);
    if (this.table[position] != null) {
      if (this.table[position].key === key) { // 查找的值是否在原始位置上
        return this.table[position].value;
      }
      // 如果原始位置不在，说明有冲突，位置被占用，向下一位查找
      let index = position + 1;
      while (this.table[index] != null && this.table[index].key !== key) {
        index++;
      }
      if (this.table[index] != null && this.table[index].key === key) {
        return this.table[position].value;
      }
    }
    return undefined;
  }

  remove(key) {
    const position = this.hashCode(key);
    if (this.table[position] != null) {
      if (this.table[position].key === key) {
        delete this.table[position];
        this.verifyRemoveSideEffect(key, position);
        return true;
      }
      let index = position + 1;
      while (this.table[index] != null && this.table[index].key !== key) {
        index++
      }
      if (this.table[index] != null && this.table[index].key === key) {
        delete this.table[index];
        this.verifyRemoveSideEffect(key, index);
        return true;
      }
    }
    return false;
  }
  verifyRemoveSideEffect(key, removedPosition) { // 要删除的 key 及对应 散列值,  删除后当前索引位置闲置
    // hash用来找同hash，removedPosition用来排先后
    const hash = this.hashCode(key); // 要删除的key的散列值
    let index = removedPosition + 1; // 下一个位置开始迭代
    while (this.table[index] != null) {
      const posHash = this.hashCode(this.table[index].key);
      // 下一项的散列值 <= 删除项的散列值（最开始的值）
      // 或者，下一项的散列值 <= 当前删除项的散列值（会++）
      if (posHash <= hash || posHash <= removedPosition) {
        this.table[removedPosition] = this.table[index]; // 当前项占据上一项的空位
        delete this.table[index]; // 删除当前项
        removedPosition = index; // 删除项的散列值更新
      }
      index++;
    }
  }
}