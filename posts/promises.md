---
date: '2021-01-28'
title: 'Промисы'
spoiler: 'Промисы, цепочки вызовов и обработка ошибок.'
---

Синтаксис создания `Promise`:

```jsx
const promise = new Promise(function (resolve, reject) {
  // функция исполнитель (executor)
})
```

Функция, переданная в конструкцию `new Promise`, называется *исполнитель* (executor). Когда промис создается, она
запускается автоматически. Она должна содержать «создающий» код, который когда-нибудь создаст результат.

Ее аргументы `resolve` и `reject` — это колбэки, которые предоставляет сам JavaScript. Наш код — только внутри
функции-исполнителя.

Когда наш код (внутри executor) получает результат, сейчас или позже — неважно, он должен вызвать один из колбэков:

- `resolve(value)` — если работа завершилась успешно, с результатом `value`.
- `reject(error)` — если произошла ошибка, `error` — объект ошибки.

То есть, исполнитель запускается автоматически, он должен выполнить работу, а затем вызвать `resolve` или `reject`.

У объекта `promise`, возвращаемого конструктором `new Promise`, есть внутренние свойства:

- `state` — вначале `pending` («ожидание»), потом меняется на `fulfilled` («выполнено успешно») при вызове `resolve` или
  на `rejected` («выполнено с ошибкой») при вызове `reject`.
- `result` — в начале `undefined`, далее изменяется на `value` при вызове `resolve(value)` или на `error` при
  вызове `reject(error)`

Так что исполнитель по итогу переводит `promise` в одно из двух состояний:

```jsx
// исходное состояние
new Promise(executor) {
  state: 'pending',
  result: undefined,
}

{ // -> Первый исход (успех)
  state: 'fulfilled',
  result: value,
}

{ // -> Второй исход (ошибка)
  state: 'rejected',
  result: error,
}
```

Ниже пример конструктора `Promise` и простого исполнителя с кодом, дающим результат с задержкой (через `setTimeout`):

```jsx
const promise = new Promise((resolve, reject) => {
  // эта функция выполнится автоматически при вызове new Promise

  // через 1 секунду сигнализировать, что задача выполнена с результатом "done" 
  setTimeout(() => resolve('done'), 1000);
})
```

Мы можем наблюдать две вещи, запустив код выше:

1. Функция-исполнитель запускается сразу же при вызове `new Promise`
2. Исполнитель получает два аргумента: `resolve` и `reject` — это функции, встроенные в JavaScript, поэтому их не нужно
   писать. Нам нужно лишь позаботиться, чтобы исполнитель вызвал одну из них по готовности.

> **Может быть что-то одно: либо результат, либо ошибка.**
>
> Исполнитель должен вызвать что-то одно: `resolve` или `reject`.
> Состояние промиса может быть изменено только один раз.

## Потребители: then, catch, finally

Объект `Promise` служит связующим звеном между исполнителем и функциями-потребителями, которые получают либо результат,
либо ошибку. Функции-потребители могут быть зарегистрированы (подписаны) с помощью методов `.then`, `.catch`
и `.finally`.

### then

Наиболее важный и фундаментальный метод — `.then`.

Синтаксис:

```jsx
promise.then(
  function (result) { /* обрабатывает успешное выполнение */ },
  function (error) { /* обрабатывает ошибку */ }
)
```

- Первый аргумент метода `.then` — функция, которая выполняется, когда промис переходит в состояние «выполнен успешно»,
  и получает результат.
- Второй аргумент `.then` — функция, которая выполняется, когда промис переходит в состояние «выполнен с ошибкой», и
  получает ошибку.

Например, вот реакция на успешно выполненный промис:

```jsx
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve('done!'), 1000);
});

// resolve запустит первую функцию, переданную в .then
promise.then(
  result => console.log(result), // выведет "done!" через одну секунду
  error => console.log(error) // не будет запущена
)
```

Выполнилась первая функция.

А в случае ошибки в промисе — выполнится вторая:

```jsx
const promise = new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error('Whoops!')), 1000);
});

// resolve запустит первую функцию, переданную в .then
promise.then(
  result => console.log(result), // не будет запущена
  error => console.log(error) // выведет "Error: Whoops!" спустя одну секунду
)
```

Если мы заинтересованы только в результате успешного выполнения задачи, то в `then` можно передать только одну функцию:

```jsx
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Done!'), 1000);
});

promise.then(console.log); // выведет 'done!' спустя одну секунду
```

### catch

Если мы хотели бы только обработать ошибку, то можно использовать `null` в качестве первого
аргумента: `.then(null, errorHandlingFunction)`. Или можно воспользоваться методом `.carch(errorHandlingFunction)`,
который сделает то же самое:

```jsx
const promise = new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error('Fail!')), 1000);
})

// .catch(f) - это тоже самое, что .then(null, f)
promise.catch(console.log); // выведет "Error: Fail!" спустя одну секунду
```

### finally

Вызов `.finally(f)` похож на `.then(f, f)`, в том смысле, что `f` выполнится в любом случае, когда промис завершится:
успешно или с ошибкой.

`finally` хорошо подходит для очистки, например остановки индикатора загрузки, его ведь нужно остановить вне зависимости
от результата.

Например:

```jsx
new Promise((resolve, reject) => {
  // сделать что-то, что займет время, и после вызвать resolve/reject
})
  .finally(() => stopLoader()) // выполнится, когда промис завершится
  .then(
    result => console.log(result),
    err => console.log(err)
  )
```

Основные отличия `finally` от `then`:

1. Обработчик, вызываемый из `finally`, не имеет аргументов. В `finally` мы не знаем, как был завершен промис. И это
   нормально, потому что обычно наша задача — выполнить «общие» завершающие процедуры.
2. Обработчик `finally` «пропускает» результат или ошибку дальше, к последующим обработчикам. Это удобно, потому
   что `finally` не предназначен для обработки результатов. Так что он просто пропускает его через себя дальше.
3. Вызов `.finally(f)` удобнее, чем `.then(f, f)` — не надо дублировать функции `f`.

Практический пример того, как промисы могут облегчить написание асинхронного кода.

## Пример: loadScript

У нас есть функция `loadScript` для загрузки скрипта.

Так выглядит вариант с колбэками:

```jsx
function loadScript(src, callback) {
  const script = document.createElement('script');
  script.src = src;

  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`Ошибка загрузки скрипта ${src}`));

  document.head.append(script);
}
```

Теперь перепишем ее, используя `Promise`.

Новой функции `loadScript` более не нужен аргумент `callback`. Вместо этого она будет создавать и возвращать
объект `Promise`, который перейдет в состояние «успешно завершен», когда загрузка закончится. Внешний код может
добавлять обработчики, используя `.then`:

```jsx
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;

    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error('Ошибка'));

    document.head.append(script);
  });
}
```

Применение:

```jsx
const promise = loadScript('https://cdn.jsdelivr.net/npm/lodash@4.17.20/lodash.min.js');

promise.then(
  script => console.log(`${script.src} загружен!`),
  error => console.log(`Error: ${error.message}`)
);

promise.then(script => console.log('Еще один обработчик...'));
```

## Цепочка промисов

Допустим у нас есть последовательность асинхронных задач, которые должны быть выполнены одна за другой. Промисы
предоставляют несколько способов решения такой задачи. Один из них — цепочка промисов.

Она выглядит так:

```jsx
new Promise((resolve, reject) => {
  setTimeout(() => resolve(1), 1000); // (*)
}).then((result) => { // (**)
  console.log(result); // -> 1
  return result * 2;
}).then((result) => { // (***)
  console.log(result); // -> 2
  return result * 2;
}).then((result) => {
  console.log(result); // -> 4
  return result * 2;
})
```

Идея состоит в том, что результат первого промиса передается по цепочке обработчиков `.then`.

Поток выполнения такой:

1. Начальный промис успешно выполнится через 1 секунду `(*)`,
2. Затем вызывается обработчик в `.then` `(**)`.
3. Возвращаемое им значение передается дальше в следующий обработчик `.then` `(***)`
4. ...и так далее.

В итоге результат передается по цепочке обработчиков, и мы видим несколько `console.log` подряд, которые выводят `1`
→ `2` → `4`.

Все это работает, потому что вызов `promise.then` тоже возвращает промис, так что мы можем вызвать в нем
следующий `.then`.

Когда обработчик возвращает какое-то значение, то оно становится результатом выполнения соответствующего промиса и
передается в следующий `.then`

## Пример: fetch

Используем метод `fetch`, чтобы подгрузить информацию о пользователях с удаленного сервера. Базовый синтаксис:

```jsx
const promise = fetch(url);
```

Этот код запрашивает по сети `url` и возвращает промис. Промис успешно выполняется и в свою очередь возвращает
объект `response` после того, как удаленный сервер присылает заголовки ответа, но до того, как весь ответ сервера
полностью загружен.

Чтобы прочитать полный ответ, надо вызвать метод `response.text()` или `response.json()`: они тоже возвращают промис,
который выполняется, когда данные полностью загружены, и возвращают эти данные.

Код ниже запрашивает файл `user.json` и загружает его содержимое с сервера:

```jsx
fetch('/article/promise-chaining/user.json')
  // .then в коде ниже выполняется, когда удаленный сервер отвечает
  .then((response) => {
    // response.text() возвращает новый промис,
    // который выполняется и возвращает полный ответ сервера,
    // когда он загрузился
    return response.json();
  })
  .then(user => {
    // ...и здесь содержимое полученного файла
    console.log(user.name); // -> Maxim, получили имя пользователя
  })
```

Теперь можно что-нибудь сделать с полученными данными о пользователе.

Например, послать запрос на GitHub, чтобы загрузить данные из профиля пользователя и показать его аватар:

```jsx
// запрашиваем user.json
fetch('/article/promise-chaining/user.json')
  // загружаем данные в формате json
  .then(response => response.json())
  // делаем запрос к GitHub
  .then(user => fetch(`https://api.github.com/users/${user.name}`))
  // загружаем ответ в формате json
  .then(response => response.json())
  // показываем аватар (githubUser.avatar_url) в течении 3 секунд
  .then(githubUser => {
    const img = document.createElement('img');
    img.src = githubUser.avatar_url;
    img.className = 'promise-avatar-example';
    document.body.append(img);

    setTimeout(() => img.remove(), 3000); // (*)
  })  
```

Код работает, однако в нем есть одна потенциальная проблема.

После того, как аватар удален `(*)`, мы не можем предпринять какие-либо еще действия, например показать форму
редактирования пользователя или что-то еще.

Чтобы сделать код расширяемым, нужно возвращать еще один промис, который выполняется после того, как завершается показ
аватара.

Примерно так:

```jsx
// запрашиваем user.json
fetch('/article/promise-chaining/user.json')
  .then(response => response.json())
  .then(user => fetch(`https://api.github.com/users/${user.name}`))
  .then(response => response.json())
  .then(githubUser => new Promise((resolve, reject) => { // (*)
    const img = document.createElement('img');
    img.src = githubUser.avatar_url;
    img.className = 'promise-avatar-example';
    document.body.append(img);

    setTimeout(() => {
      img.remove();
      resolve(githubUser); // (**)
    }, 3000);
  }))
  // срабатывает через 3 секунды
  .then(githubUser => console.log(`Закончили показ ${githubUser.name}`));
```

То есть обработчик `.then` в строке `(*)` будет возвращать `new Promise`, который перейдет в состояние «выполнен» только
после того, как в `setTimeout` `(**)` будет вызвана resolve(githubUser).

Соответственно, следующий по цепочке `.then` будет ждать этого.

> Как правило, все асинхронные действия должны возвращать промис.

Это позволяет планировать после него какие-то дополнительные действия. Даже если эта возможность не нужна прямо сейчас.

И разобьем написанный код на отдельные функции, пригодные для повторного использования:

```jsx
function loadJson(url) {
  return fetch(url)
    .then(response => response.json());
}

function loadGithubUser(name) {
  return fetch(`https://api.github.com/users/${name}`)
    .then(response => response.json());
}

function showAvatar(githubUser) {
  return new Promise((resolve, reject) => {
    const img = document.createElement('script');
    img.src = githubUser.avatar_url;
    img.className = 'promise-avatar';
    document.body.append(img);

    setTimeout(() => {
      img.remove();
      resolve(githubUser);
    }, 3000);
  })
}

// Используем их:
loadJson('/article/promise-chaining/user.json')
  .then(user => loadGithubUser(user.name))
  .then(showAvatar)
  .then(githubUser => console.log(`Показ аватара ${githubUser.name} завершен`));
// ...
```

## Обработка ошибок

Если промис завершается с ошибкой, то управление переходит в ближайший обработчик ошибок.

Самый легкий способ перехватить все ошибки — добавить `.catch` в конец цепочки:

```jsx
fetch('/article/promise-chaining/user.json')
  .then(response => response.json())
  .then(user => fetch(`https://api.github.com/users/${user.name}`))
  .then(response => response.json())
  .then(githubUser => new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.src = githubUser.avatar_url;
    img.className = 'promise-avatar-example';
    document.body.append(img);

    setTimeout(() => {
      img.remove();
      resolve(githubUser);
    }, 3000);
  }))
  .catch(error => console.log(error.message));
```

Если все в порядке, такой `.catch` вообще не выполнится. Но если любой из промисов будет отклонен, то ошибка будет
перехвачена.

## Promise API

В классе `Promise` есть 5 статических методов:

1. `Promise.all(promises)` — ожидает выполнения всех промисов, и возвращает массив с результатами. Если любой из
   указанных промисов вернет ошибку, то результатом работы `Promise.all` будет эта ошибка. Результаты остальных промисов
   будут игнорироваться.
2. `Promise.allSettled(promises)` — ждет, пока все промисы завершатся и возвращает их результаты в виде массива с
   объектами, у каждого объекта два свойства:

- `state`: `"fulfilled"`, если выполнен успешно или `rejected`, если ошибка,
- `value` — результат, если успешно или `reason` — ошибка, если нет.

3. `Promise.race(promises)` — ожидает первый выполненный промис, который становится его результатом, остальные
   игнорируются.
4. `Promise.resolve(value)` — возвращает успешно выполнившийся промис с результатом `value`.
5. `Promise.reject(error)` — возвращает промис с ошибкой `error`.

Методы `Promise.resolve` и `Promise.reject` редко используются в современном коде, так как синтаксис `async/await`
делает их ненужными.

> Конспект главы из [учебника по JavaScript](https://learn.javascript.ru/) — [Промисы, async/await](https://learn.javascript.ru/async)
