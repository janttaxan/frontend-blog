---
date: '2021-02-18'
title: 'Тестовое задание для «Мультибонус» ВТБ'
spoiler: 'Решение задач тестового задания + комментарии.'
---

## Задача 1. Реализовать метод bind

Постановка задачи:

```js
// Реализовать метод bind
function bind(func, context, args) {
}

let foo = function (args) {
  console.log(this, args);
}

let bar = bind(foo, { a: 1 });
bar([1, 2, 3]); //{a: 1}, [1, 2, 3]
```

Метод `bind` служит для того, чтобы создать функцию, в которой будет фиксированный `this`.

В нашем случае, это будет функция, которая принимает функцию `func`, `context`, и аргументы для `func`. Функция `bind`
должна вернуть новую функцию, в которой `this` будет равен переданному `context`. Эта новая функция будет оберткой над
переданной функцией `func`.

Решение:

```js
function bind(func, context, args) {
  return function (localArgs = args) { // (*)
    func.call(context, localArgs); // (**)
  }
}

let foo = function (args) {
  console.log(this, args);
}

let bar = bind(foo, { a: 1 }); // (***)
bar([1, 2, 3]); //{a: 1}, [1, 2, 3]
```

`*` В функции-обертке создана новая локальная переменная (как аргумент)  `localArgs=args`. Это сделано для того, чтобы
значение `args` можно было использовать при вызове `func` `**`. Иначе `args` останется в замыкании при вызове
функции `bind` `***`, и будет равным `undefined`, так как третий аргумент функции `bind` не был указан явно.

Мы могли бы явно привязать и аргументы при вызове `bind`:

```js
let bar = bind(foo, { a: 1 }, [1, 2, 3]);
bar(); //{a: 1}, [1, 2, 3]
```

Результат вызова `bar()` останется таким же.

## Задача 2. Реализовать метод mapping, аналог метода map

Постановка задачи:

```js
// Реализовать метод mapping, аналог метода map 
let arr = [1, 2, 3];
arr.mapping(function (item, index) {
  console.log(item, index);
})
```

Метод `map` создает новый массив с результатом вызова указанной функции для каждого элемента массива.

Мое решение, это функция (`mapping`), которая получает аргумент `func` — другую функцию. Внутри `mapping` создается
новый массив, в который будут пушиться результаты вызова `func`. Далее циклом проходим по всем элементам массива (чтобы
не привязываться к конкретному массиву, я использовал ключевое слово `this`).

Для каждого элемента массива мы вызываем переданную функцию `func` с двумя аргументами: элемент массива, и его индекс.
Результат каждого вызова `func` пушим в `newArray`. Когда цикл будет завершен, то есть элементов в массиве `this` не
останется, мы вернем новый массив `newArray`.

Решение:

```js
let arr = [1, 2, 3];

arr.mapping = function (func) {
  const newArray = [];

  for (let i = 0; i < this.length; i++) {
    newArray.push(func(this[i], i));
  }

  return newArray;
};

// вызов метода без сохранения нового массива
arr.mapping(function (item, index) {
  console.log(item, index);
});

// вызов метода, и сохранение нового массива в переменную
const arr2 = arr.mapping((item, index) => `item-${index}: ${item}`)
console.log(arr2); // -> ["item-0: 1", "item-1: 2", "item-2: 3"] 
```

## Задача 3. Реализовать метод deepEqual для объектов без JSON.Stringify

Постановка задачи:

```js
// Реализовать метод deepEqual для объектов без JSON.Stringify 
let obj1 = {
  a: 1,
  b: { c: 2 }
}
let obj2 = {
  a: 1,
  b: { c: 2 }
}
console.log(deepEqual(obj1, obj2)); //true
```

Метод `deepEqual(obj1, obj2)` сравнивает два объекта и возвращает `true`, если объекты равны.

Решение:

```js
let obj1 = {
  a: 1,
  b: { c: 2 },
  d: 'string'
  // добавлено свойство d, чтобы убедится,что после проверки
  // вложенного объекта,проверка продолжится, а не вернет
  // результат проверки вложенного объекта
}
let obj2 = {
  a: 1,
  b: { c: 2 },
  d: 'string'
}

function deepEqual(obj1, obj2) {
  if (obj1 === obj2) { // 1
    return true;
  } else if (Object.keys(obj1).length === Object.keys(obj2).length) { // 2
    for (const key in obj1) { // 3
      if (obj2.hasOwnProperty(key)) { // 4
        if (typeof obj1[key] === 'object' && !Array.isArray(obj1[key])) { // 5
          if (!deepEqual(obj1[key], obj2[key])) { // (*)
            return false;
          }
        } else if (obj1[key] !== obj2[key]) { // 6
          return false;
        }
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
  return true; // 7
}
```

Данный метод не предусматривает ситуации, когда свойством объекта будет массив или функция. Порядок выполнения:

1. Если сравниваемые объекты, это один и тот же объект, возвращаем `true`.
2. Если у объектов равное количество ключей, продолжаем сравнение. Иначе вернем `false`.
3. Циклом проходимся по всем ключам первого объекта `obj1`.
4. Проверяем, есть ли текущий ключ объекта `obj1` у объекта `obj2`. Если нет, вернем `false`, иначе продолжаем.
5. Если тип текущего свойства равен `'object'` и свойство не является массивом, то рекурсивно вызываем
   функцию `deepEqual` `*`, передав в нее свойство-объект первого и второго объектов. Если рекурсивный вызов
   вернул `false`, то завершаем сравнение, вернув `false`.
6. Если тип текущего свойства — примитив, то просто сравниваем свойства двух объектов и возвращаем `false`, если они не
   равны.
7. Когда все ключи и свойства пройдут проверку не вернув `false`, то функция `deepEqual` возвращает `true`.

## Задача 4. Реализовать функцию, которая принимает количество элементов и возвращает ряд Фибоначчи

Постановка задачи:

```js
//4) Реализовать функцию, которая принимает количество элементов и возвращает ряд Фибоначчи
//1, 1, 2, 3, 5, 8, 13...
function createFib(n) {
}

console.log(createFib(2)); //1, 1
console.log(createFib(5)); //1, 1, 2, 3, 5
```

Для решения этой задачи я использовал цикл и массив, в котором изначально есть два элемента `[1, 1]`.

Решение:

```js
function createFib(n) {
  const fibo = [1, 1];
  for (let i = 1; i < n - 1; i++) {
    fibo.push(fibo[i] + fibo[i - 1]);
  }
  return fibo;
}

console.log(createFib(2)); //1, 1
console.log(createFib(5)); //1, 1, 2, 3, 5
```

Идея заключается в том, что в цикле мы пушим в массив `fibo` результат сложения последнего элемента и предпоследнего.
Именно поэтому в массиве изначально есть значение `[1, 1]`, чтобы успешно выполнить первую итерацию цикла. Цикл будет
выполняться `n - 1` раз, потому что мы считаем индексы массива, счет которых начинается с нуля.

## Задача 5. Реализовать функцию, которая проверяет на валидность скобки

Постановка задачи:

```js
//5) Реализовать функцию, которая проверяет на валидность скобки. 
// ()() - валидно
// ()(()) - невалидно (*)
function isValidBrackets() {
}
```

`*` Если я правильно понял, то в постановке задачи допустили опечатку, и не валидный пример является валидным. Примеры
не валидных скобок:

```js
// ()(   - не валидно
// (() 	 - не валидно
// ()()) - не валидно
```

При решении задачи я ориентировался на свой вариант не валидных скобок.

Решение:

```js
function isValidBrackets(str) {
  const leftBracket = '(';
  const rightBracket = ')';
  const arr = [];

  for (let i = 0; i < str.length; i++) {
    if (str[i] === leftBracket) { // (*)
      arr.push(str[i]);
    } else if (arr[arr.length - 1] === leftBracket && str[i] === rightBracket) { // (**)
      arr.pop();
    } else return false;
  }
  return !arr.length; // (***)
}

console.log(isValidBrackets('()()'));   // -> true
console.log(isValidBrackets('()(())')); // -> true
console.log(isValidBrackets('()(()'));  // -> false
console.log(isValidBrackets('())'));    // -> false
```

Идея решения заключается в том, что циклом проходимся по каждому символу строки, и проверяем:

- `*` если текущий символ, это — `'('`, то пушим символ в массив `arr`.
- `**` если текущий символ, это — `')'`, при этом последний элемент массива — `'('`, то удаляем последний символ из
  массива, иначе возвращаем `false`. (Мы встретили закрывающую скобку раньше открывающей)
- `***` после проверки всех символов, мы проверяем длину массива и возвращаем `false`, если в массиве есть элементы.
  Возвращаем `true`, если элементов в массиве нет.
