---
date: '2021-01-31'
title: 'Жизненный цикл React-компонента'
spoiler: 'Основные методы жизненного цикла.'
---

Каждый компонент имеет несколько «методов жизненного цикла». Переопределение такого метода позволяет выполнить код на конкретном этапе этого процесса.

[Диаграмма жизненного цикла.](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

Далее на странице с помощью `*` выделены самые распространенные методы жизненного цикла.

## Монтирование
При создании экземпляра компонента, и его вставки в DOM.

Следующие методы вызываются в установленном порядке:
- `*` [`constructor()`](https://ru.reactjs.org/docs/react-component.html#constructor)
- `static getDerivedStateFromProps()`
- `*` [`render()`](https://ru.reactjs.org/docs/react-component.html#render) — единственный обязательный метод в классовом компоненте.
- `*` [`componentDidMount()`](https://ru.reactjs.org/docs/react-component.html#componentdidmount) — вызывается сразу после монтирования (вставки компонента в DOM). Этот метод подходит для настройки подписок.

## Обновление
Обновление происходит при изменении пропсов или состояния.

Следующие методы вызываются в установленном порядке при повторном рендере компонента:
- `static getDerivedStateFromProps()`
- `shouldComponentUpdate()`
- `*` [`render()`](https://ru.reactjs.org/docs/react-component.html#render)
- `getSnapshotBeforeUpdate`
- `*` [`componentDidUpdate()`](https://ru.reactjs.org/docs/react-component.html#componentdidupdate) — вызывается сразу после обновления. Не вызывается при первом рендере. Метод подходит для выполнения таких сетевых запросов, которые выполняются на основании результата сравнения текущих пропсов с предыдущими. Если пропсы не изменились, новый запрос может и не требоваться.

## Размонтирование
Этот метод вызывается при удалении компонента из DOM:
- `*` [`componentWillUnmount()`](https://ru.reactjs.org/docs/react-component.html#componentwillunmount) — в этом методе выполняется необходимый сброс: отмена таймеров, сетевых запросов и подписок, созданных в `componentDidMount()`.

## Обработка ошибок
Следующие методы вызываются, если произошла ошибка в процессе рендеринга, методе жизненного цикла или конструкторе любого дочернего компонента:
- `static getDerivedStateFromError()`
- `componentDidCatch()` — метод используется для логирования ошибок.
