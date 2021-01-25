---
date: '2020-12-24' 
title: 'Работа с массивами в JavaScript'
spoiler: 'Собраны все основные операции над массивами.'
---

## Удаление элементов

```jsx
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
```

`shift()` - удаляет из массива **первый** элемент и возвращает его

```jsx
const first = numbers.shift(); // 0
console.log(numbers); // [1, 2, 3 ...]
```

`pop()` - удаляет из массива **последний** элемент и возвращает его

```jsx
const last = numbers.pop(); // 9
console.log(numbers); // [1, 2, 3, 4, 5, 6, 7, 8]
```

`splice(start, length)` - удаляет и возвращает `length` элементов из массива, начиная с индекса `start`

```jsx
const middle = numbers.splice(4, 3); // [4, 5, 6]
console.log(numbers); // [0, 1, 2, 3, 7, 8, 9]
numbers.splice(3); // удалит все элементы начиная с индекса 3
```

## Поиск элементов

```jsx
const students = [
  {name: "Василий", age: 18},
  {name: "Геннадий", age: 23},
  {name: "Андрей", age: 17},
  {name: "Тимофей", age: 29},
  {name: "Иннокентий", age: 17},
];
```

`find()` - вернет первый попавшийся элемент по заданному условию

`findIndex()` - вернет индекс первого попавшегося элемента по заданному условию

```jsx
students.find(student => student.name === "Андрей" && student.age === 17);
// -> { name: "Андрей", age: 17 }

students.findIndex(student => student.name === "Андрей" && student.age === 17);
// -> 2
```

`every()` - вернет **true**, если все элементы соответствуют заданному условию. **False**, если не соответствуют

```jsx
students.every(student => student.age < 30); // true, все студенты младше 30 лет
students.every(student => student.age >= 18); // false, есть несовершеннолетние
```

`some()` - вернет **true**, если хотя бы один элемент соответствует заданному условию. **False**, если нет таких
элементов;

```jsx
students.some(student => student.age < 18); // true, есть несовершеннолетние
students.every(student => student.name === "Иван"); // false, ни одного Ивана
```

### Отфильтровать массив

```jsx
// Только несовершеннолетние студенты
const kids = students.filter(student => student.age < 18)
/*
[
  { name: "Андрей", age: 17 },
  { name: "Иннокентий", age: 17 },
]
*/
```

```jsx
// Все, кроме Андреев
const notAndrey = students.filter(student => student.name !== "Андрей")
/*
[
  { name: "Василий", age: 18 },
  { name: "Геннадий", age: 23 },
  { name: "Тимофей", age: 29 },
  { name: "Иннокентий", age: 17 },
]
*/
```

## Преобразование/перебор элементов

`map()` - преобразует элементы массива в другие элементы (возвращает новый массив)

```jsx
students.map(student => student.name); // [Василий, Геннадий, Андрей, Тимофей, Иннокентий]
```

`forEach()` - альтернатива циклу. Выполняет произвольный код на каждой итерации

```jsx
students.forEach((student, index) => {
  console.log(`Студент №${index + 1}: №{student.name}`);
});
```

## Пересчет элементов

`reduce(fn(a, b), c)`

**1-й аргумент — функция.** В нее первым аргументом передается уже ***накопленное*** значение, а вторым — очередной ***элемент массива***.

**2-й аргумент — начальное значение**

```jsx
// Товары в корзине
const cartItems = [
  {name: "Гречка", price: 50, quantity: 3},
  {name: "Сок", price: 100, quantity: 1},
  {name: "Перфоратор", price: 8000, quantity: 2},
]

// Посчитаем сумму к оплате
cartItems.reduce(
  (total, item) => total + item.price * item.quantity,
  0 // начальное значение для total
)

// Вычисление без метода reduce
let total = 0;
for (const item of cartItems) {
  total = total + item.price * item.quantity;
}
```

## Другие методы

`reverse()` - вернет новый перевернутый массив

```jsx
const numbersReversed = numbers.reverse();
// -> [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
```

`sort()` - отсортирует по возрастанию значений *(строковые значения)*

```jsx
numbersReversed.sort(); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
numbersReversed.push(10, 11);
numbersReversed.sort(); // [0, 1, 10, 11, 2, 3, 4, 5, 6, 7, 8, 9]
// для правильной сортировки чисел по возрастанию
numbersReversed.sort((a, b) => a - b); // [0, 1, 2 ... 11]
// по убыванию
numbersReversed.sort((a, b) => b - a); // [11, 10, 9 ... 0]
```

`slice()` - полностью или частично копирует массив

```jsx
numbers.slice(); // полная копия
numbers.slice(3); // копия от элемента с индексом 3 и до конца [3, 4 ... 9]
numbers.slice(-5); // копия 5-ти последних элементов [5, 6, 7, 8, 9]
numbers.slice(3, 5); // копия от индекса 3 до индекса 5, последний не включается [3, 4]
numbers.slice(2, -2); // копия от индекса 2 до предпоследнего элемента (2-7)
numbers.slice(100, 100); // пустой массив, в исходном нет таких индексов
```

## Аналогичные строкам методы

`includes()` - проверяет наличие элемента в массиве

```jsx
numbers.includes(100); // false
numbers.includes(8); // true
```

`indexOf()` - находит индекс элемента в массиве

```jsx
numbers.indexOf(100); // -1
numbers.indexOf(0); // 0, индекс первого значения 0 в массиве
```
