---
date: '2021-01-29'
title: 'Async/await'
spoiler: 'Синтаксис для работы с промисами «async/await»'
---

Существует специальный синтаксис для работы с промисами, который называется «async/await». Он очень прост для понимания
и использования.

## Асинхронные функции

Начнем с ключевого слова `async`. Оно ставится перед функцией, вот так:

```jsx
async function f() {
  return 1;
}
```

У слова `async` один просто смысл: эта функция всегда возвращает промис. Значения других типов оборачиваются в
завершившийся успешно промис автоматически.

Например, эта функция возвратит выполненный промис с результатом `1`:

```jsx
async function f() {
  return 1;
}

f().then(console.log); // -> 1
```

Так что ключевое слово `async` перед функцией гарантирует, что эта функция вернет промис.

Другое ключевое слово — `await`, можно использовать только внутри `async`-функции.

## Await

Синтаксис:

```jsx
// работает только внутри async-функции
const value = await promise;
```

Ключевое слово `await` заставит интерпретатор JavaScript ждать до тех пор, пока промис справа от `await` не выполнится.
После чего он вернет его результат, и выполнение кода продолжится.

В этом примере промис успешно выполнится через 1 секунду:

```jsx
async function f() {

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve('Готово!'), 1000)
  });

  const result = await promise; // будет ждать, пока промис не выполнится (*)

  console.log(result); // -> Готово!
}

f();
```

В данном примере выполнение функции остановится на строке `(*)` до тех пор, пока промис не выполнится.

По сути, это просто «синтаксический сахар» для получения результата промиса, более наглядный, чем `promise.then`.

Пример функции `showAvatar()` из раздела [Промисы](/promises):

```jsx
async function showAvatar() {
  // запрашиваем JSON с данными пользователя
  const response = await fetch('/article/promise/user.json');
  const user = await response.json();

  // запрашиваем информацию о пользователе из github
  const githubResponse = await fetch(`https://api.github.com/users/${user.name}`);
  const githubUser = await githubResponse.json();

  // отображаем аватар
  const img = document.createElement('img');
  img.src = githubUser.avatar_url;
  img.className = 'promise-avatar';
  document.body.append(img);

  // ждем 3 секунды и затем скрываем автар
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  img.remove();

  return githubUser;
}

showAvatar();
```

## Обработка ошибок

Когда промис завершается успешно, `await promise` возвращает результат. Когда завершается с ошибкой — будет выброшено
исключение. На практике промис может завершится с ошибкой не сразу, а через некоторое время.

Такие ошибки можно ловить, используя `try...catch`, как с обычный `throw`:

```jsx
async function f() {
  try {
    const response = await fetch('http://no-such-url');
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }
}

f();
```

Если у нас нет `try...catch`, асинхронная функция будет возвращать завершившийся с ошибкой промис (в
состоянии `rejected`). В этом случае можно использовать метод `.catch` промиса, чтобы обработать ошибку:

```jsx
async function f() {
  const response = await fetch('http://no-such-url');
}

// f() вернет промис в состоянии rejected
f().catch(console.log); // -> TypeError: failed to fetch
```

## Итого

Ключевое слово `async` перед объявлением функции:

1. Обязывает ее всегда возвращать промис.
2. Позволяет использовать `await` в теле этой функции.

Ключевое слово `await` перед промисом заставит JavaScript дождаться его выполнения, после чего:

1. Если промис завершится с ошибкой, будет сгенерировано исключение, как если бы на этом месте находилось `throw`.
2. Иначе вернется результат промиса.

> Конспект статьи из [учебника по JavaScript](https://learn.javascript.ru/) — [Async/await](https://learn.javascript.ru/async-await)
