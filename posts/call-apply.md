---
date: '2021-01-24'  
title: 'Методы call и apply'  
spoiler: 'Явное указание this с помощью call/apply.'
---

## Метод call

Метод `call()` вызывает функцию с указанным значением `this` и индивидуально предоставленными аргументами.

Синтаксис метода `call`:

```jsx
func.call(context, arg1, arg2, ...)
```

## Метод apply

Метод `apply()` вызывает функцию с указанным значением `this` и аргументами, предоставленными в виде массива.

Синтаксис метода `apply`:

```jsx
func.apply(context, [arg1, arg2, ...])
```

## В чем разница и примеры использования

> Фундаментальное различие между ними заключается в том, что метод
> `call()` принимает список аргументов, а метод `apply()` — одиночный массив

### Примеры использования метода call

> Вызов `func.call(context, a, b...)` — то же, что обычный вызов
> `func(a, b...)`, но с явно указанным `this (=context)`.

Например, есть функция `showFullName()`, которая работает с `this`:

```jsx
function showFullName() {
  console.log(`${this.firstname} ${this.lastname}`)
}

// каким будет значение this — выяснится в момент запуска
```

Вызов `showFullName.call(user)` запустит функцию, `установив this = user`, вот так:

```jsx
function showFullName() {
  console.log(`${this.firstname} ${this.lastname}`)
}

const user = {
  firstname: 'Иван',
  lastname: 'Петров'
};

// функция вызовется с this=user
showFullName.call(user) // 'Иван Петров'
```

После контекста в `call` можно передать аргументы для функции. Ниже более сложный пример `showFullName()`:

```jsx
const user = {
  firstname: 'Иван',
  surname: 'Петров',
  patronym: 'Васильевич',
};

function showFullName(firstPart, lastPart) {
  console.log(`${this[firstPart]} ${this[lastPart]}`);
}

// func.call(контекст, аргумент1, аргумент2, ...)
showFullName.call(user, 'firstname', 'surname');  // -> 'Иван Петров'
showFullName.call(user, 'firstname', 'patronym'); // -> 'Иван Васильевич'
```

### Примеры использования метода apply

Преимущество `apply` перед `call` отчетливо видно, когда массив аргументов формируется динамически.

Например, в JavaScript есть встроенная функция `Math.max(a, b, c...)`, которая возвращает максимальное значение из
аргументов:

```jsx
console.log(Math.max(1, 5, 2)); // -> 5
```

При помощи `apply` мы могли бы найти максимум в произвольном массиве:

```jsx
const arr = [];
arr.push(1);
arr.push(5);
arr.push(2);

// получить максимум из элементов arr
console.log(Math.max.apply(null, arr)); // -> 5
```

В качестве контекста `this` был передан `null`, так как в своей внутренней реализации метод `Math.max` не
использует `this`.

## Заимствование метода

При помощи `call` можно взять метод одного объекта, в том числе встроенного, и вызвать в контексте другого.

Пример использования этой техники для упрощения манипуляций с `arguments`.

`arguments` — не массив, а обычный объект (псевдомассив или массивоподобный объект), поэтому у него нет методов
массива: `pop`, `push`, `join` и др.

Мы можем скопировать метод `join` из обычного массива:

```jsx
function printArgs() {
  arguments.join = [].join; // заимствование метода (1)

  const argStr = arguments.join(':'); // (2)

  console.log(argStr);
}

printArgs(1, 2, 3); // -> 1:2:3
```

1. В строке (1) объявлен пустой массив `[]` и скопирован его метод `[].join`. Метод `join` не вызван, а просто
   скопирован.
2. В строке (2) запустили `join` в контексте `arguments`.

## Итого про this

Значение `this` устанавливается в зависимости от того, как вызвана функция:

- При вызове функции как метода:

```jsx
obj.func(...); // this = obj
```

- При обычном вызове:

```jsx
func(...); // this = undefined (ES5) / this = window (ES3)
```

- В `new`:

```jsx
new func(...); // this = {} (новый объект)
```

- Явное указание:

```jsx
func.apply(context, args); // this = context (явная передача)
func.call(context, arg1, arg2, ...);
```
