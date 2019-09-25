/**
 * 2.2.7
 */
class Book {
  constructor(title, pages, isbn) {
    this.title = title;
    this.pages = pages;
    this.isbn = isbn;
  }

  printIsbn() {
    console.log(this.isbn)
  }
}

class ITBook extends Book {
  constructor(title, pages, isbn, technology) {
    super(title, pages, isbn);
    this.technology = technology;
  }

  printTechnology() {
    console.log(this.technology);
  }
}

let jsBook = new ITBook('学习JS算法', '200', '1234567890', 'JavaScript');
console.log(jsBook.title);
console.log(jsBook.printTechnology());


class Person1 {
  constructor (name) {
    this._name = name;
  }
  get name() {
    return this._name
  }
  set name(value) {
    this._name = value
  }
}
let lotrChar = new Person1('Frodo')
console.log(lotrChar.name);
lotrChar.name = 'Gandalf';
console.log(lotrChar.name);
lotrChar._name = 'Sam';
console.log(lotrChar.name);