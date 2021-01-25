---
date: '2021-01-25'
title: 'Привязка контекста к функции'
spoiler: 'Проблема потери this, и способы решения. Метод bind и «частичное применение».'
---

При передаче методов объекта в качестве колбэков, например для `setTimeout`, возникает проблема — потеря `this`.

## Потеря this

Как только метод передается отдельно от объекта — `this` теряется.

Вот как это может произойти в случае с `setTimeout`:

```jsx
const user = {
  firstname: 'Вася',
  sayHi() {
    console.log(`Привет, ${this.firstname}!`)
  }
}

setTimeout(user.sayHi, 1000); // -> Привет, undefined!
```

Это произошло потому, что `setTimeout` получил функцию `sayHi` отдельно от объекта `user` (именно здесь функция потеряла
контекст). То есть последняя строка может быть переписана как:

```jsx
let f = user.sayHi;
setTimeout(user.sayHi, 1000); // контекст user потерян
```

## Решение 1: сделать функцию-обертку

Самый простой вариант решения — это обернуть вызов в анонимную функцию, создав замыкание:

```jsx
const user = {
  firstname: 'Вася',
  sayHi() {
    console.log(`Привет, ${this.firstname}!`)
  }
}

setTimeout(() => user.sayHi(), 1000); // -> Привет, Вася!
```

В таком коде есть небольшая уязвимость.

Если до момента срабатывания `setTimeout` (задержка 1 секунда) в переменную `user` будет записано другое значение, тогда
вызов будет не тот, что ожидался.

```jsx
let user = {
  firstname: 'Вася',
  sayHi() {
    console.log(`Привет, ${this.firstname}!`)
  }
}

setTimeout(() => user.sayHi(), 1000);

// ...в течении 1 секунды
user = {
  sayHi() {
    console.log('Другой пользователь в "setTimeout"')
  }
};

// -> Другой пользователь в "setTimeout"
```

Следующее решение гарантирует, что такого не случится.

## Решение 2: привязать контекст с помощью bind

У функций в JavaScript есть встроенный
метод [bind](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Function/bind), который
позволяет зафиксировать `this`.

Базовый синтаксис `bind`:

```jsx
// полный синтаксис представлен ниже
const boundFunc = func.bind(context);
```

Результатом вызова `func.bind(context)` является *необычный функциональный объект*, который является оберткой над
исходным функциональным объектом. Вызывается как функция и прозрачно передает вызов в `func`, при этом
устанавливая `this=context`.

Другими словами, вызов `boundFunc` подобен вызову `func` с фиксированным `this`.

Например, здесь `funcUser` передает вызов в `func`, фиксируя `this=user`:

```jsx
const user = {
  firstname: 'Вася',
}

function func() {
  console.log(this.firstname);
}

// привязка this к user
const funcUser = func.bind(user);
funcUser(); // -> Вася
```

Здесь `func.bind(user)` — это «связанный вариант» `func`, с фиксированным `this=user`.

Все аргументы передаются исходному методу `func` как есть, например:

```jsx
const user = {
  firstname: 'Вася',
}

function func(phrase) {
  console.log(`${phrase}, ${this.firstname}!`);
}

// привязка this к user
const funcUser = func.bind(user);

funcUser('Привет'); // -> Привет, Вася!
// (аргумент "Привет" передан, при этом this = user)
```

Теперь тоже самое с методом объекта:

```jsx
const user = {
  firstname: 'Вася',
  sayHi() {
    console.log(`Привет, ${this.firstname}!`)
  },
}

const sayHi = user.sayHi.bind(user); // (*)

sayHi(); // -> Привет, Вася!

setTimeout(sayHi, 1000); // -> Привет, Вася!
```

В строке `(*)` мы берем метод user.sayHi и привязываем его к `user`. Теперь `sayHi` — это «связанная» функция, которая
может быть вызвана отдельно или передана в `setTimeout` (контекст всегда будет правильным).

Пример с методом объекта, где `bind` исправляет только `this`, а аргументы передаются как есть:

```jsx
const user = {
  firstname: 'Вася',
  say(phrase) {
    console.log(`${phrase}, ${this.firstname}!`)
  },
}

const say = user.say.bind(user);

say('Привет'); // -> Привет, Вася! (аргумент "Привет" передан в функцию "say")
say('Пока'); // -> Пока, Вася! (аргумент "Пока" передан в функцию "say")
```

## Частичное применение

До сих пор мы привязывали только `this`. Но с помощью метода `bind` можно привязывать и аргументы.

Полный синтаксис `bind`:

```jsx
let bound = func.bind(context, [arg1], [arg2], ...);
```

Это позволяет привязать контекст `this` и начальные аргументы функции.

Например, есть функция умножения `mul(a, b)`:

```jsx
function mul(a, b) {
  return a * b;
}
```

Воспользуемся `bind`, чтобы создать функцию `double` на основе `mul()`:

```jsx
function mul(a, b) {
  return a * b;
}

const double = mul.bind(null, 2);

console.log(double(3)); // mul(2, 3) -> 6
console.log(double(4)); // mul(2, 4) -> 8
console.log(double(5)); // mul(2, 5) -> 10
```

Вызов `mul.bind(null, 2)` создает новую функцию `double`, которая передает вызов `mul`, фиксируя `null` как контекст,
и `2` — как первый аргумент. Следующие аргументы передаются как есть.

Это
называется [частичное применение](https://ru.wikipedia.org/wiki/%D0%A7%D0%B0%D1%81%D1%82%D0%B8%D1%87%D0%BD%D0%BE%D0%B5_%D0%BF%D1%80%D0%B8%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5)
— мы создаем новую функцию, фиксируя некоторые из существующих параметров.

А также, так как мы не используем `this`, но для `bind` это обязательный параметр, то необходимо передать `null` первым
аргументом.

В следующем коде функция `triple` умножает значение на три:

```jsx
function mul(a, b) {
  return a * b;
}

const triple = mul.bind(null, 3);

console.log(triple(3)); // mul(3, 3) -> 9
console.log(triple(4)); // mul(3, 4) -> 12
console.log(triple(5)); // mul(3, 5) -> 15
```

## Частичное применение без контекста

Для ситуаций, когда необходимо зафиксировать некоторые аргументы, но не контекст `this` используется вспомогательная
функция `partial`, которая привязывает только аргументы.

```jsx
function partial(func, ...argsBound) {
  return funtion(...args)
  { // (*)
    return func.call(this, ...argsBound, ...args);
  }
}

// использование:
let user = {
  firstname: 'John',
  say(time, phrase) {
    console.log(`${time}, ${this.firstname}: ${phrase}!`);
  }
}

// добавляем частично примененный метод с фиксированным именем
user.sayNow = partial(user.say, new Date().getHours() + ':' + new Date().getMinutes())

user.sayNow('Hello'); // -> 10:00, John: Hello!
```

Результатом вызова `partial(func[, arg1, arg2...])` будет обертка `(*)`, которая вызывает `func` с:

- Тем же `this`, который она получает (для вызова `user.sayNow` — это будет `user`)
- Затем передает ей `...argsBound` — аргументы из вызова `partial` (`'10:00'`)
- Затем передает ей `...args` — аргументы, полученные оберткой (`'Hello'`)

Также есть готовый вариант [_.partial](https://lodash.com/docs/4.17.15#partial) из библиотеки lodash.

## Итого

Метод `bind` возвращает «привязанный вариант» функции `func`, фиксируя контекст `this` и первые аргументы `arg1`, `arg2`
..., если они заданы.

Обычно `bind` применяется для фиксации `this` в методе объекта, чтобы передать его в качестве колбэка. Например,
для `setTimeout`.

Когда мы привязываем аргументы, такая функция называется «частично примененной» или «частичной».

Частичное применение удобно, когда мы не хотим повторять один и тот же аргумент много раз. Например, если есть
функция `send(from, to)` и `from` все время будет одинаков для нашей задачи, то мы можем создать частично примененную
функцию и дальше работать с ней.


> Конспект статьи из [учебника по JavaScript](https://learn.javascript.ru/) — [Привязка контекста к функции](https://learn.javascript.ru/bind)
