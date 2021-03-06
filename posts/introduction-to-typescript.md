---
date: '2021-03-06' title: 'Введение в TypeScript' spoiler: 'Основные возможности TypeScript и примеры использования.'
---

## Основные типы

В TypeScript поддерживаются те же типы, что и в JavaScript, но с добавлением дополнительных типов.

### Boolean, number, string

```ts
const isDone: boolean = false;  // boolean
const n: number = 2;            // number
const color: string = 'blue';   // string
``` 

### Array

Тип массивов можно записать одним из двух способов. В первом используется тип элементов, за которым следует `[]`, чтобы
обозначить массив элементов этого типа:

```ts
const list: number[] = [1, 2, 3];
``` 

Во втором используется `generic` тип, `Array<elemType>`:

```ts
const list: Array<number> = [1, 2, 3];
```

### Tuple

Тип `tuple` позволяет обозначить массив с фиксированным числом элементов, типы которых известны, но не обязательно
должны быть одинаковыми.

```ts
// Декларируем тип tuple
let x = [string, number];
// Присваиваем значение
x = ['hello', 10]; // OK
// Присваиваем некорректное значение
x = [10, 'hello']; // Error
```

### Enum

`Enum` — это способ дать более понятные имена наборам числовых значений.

```ts
enum Color {
  Red,
  Green,
  Blue,
}

const c: Color = Color.Green;
```

По умолчанию нумерация элементов `enum` начинается с `0`. Но это можно изменить, установив значение вручную. Предыдущий
пример теперь начинается с `1` вместо `0`:

```ts
enum Color {
  Red = 1,
  Green,
  Blue,
}

const c: Color = Color.Green;
```

Или можно установить вручную все значения:

```ts
enum Color {
  Red = 1,
  Green = 2,
  Blue = 4,
}

const c: Color = Color.Green;
```

### Unknown

С помощью `unknown` удобно обозначать переменные, тип которых на данный момент не известен. TypeScript откажется
выполнять с такой переменной какие-либо действия.

### Any

Тип, который выключает типизацию. То есть переменной можно присвоить любое значение, но TypeScript не сможет помочь в
случае ошибки. Может быть полезно при использовании библиотек, которые написаны без использования TypeScript.

### Void

`void` — отсутствие какого-либо типа вообще. Используется как возвращаемый тип функций, которые ничего не возвращают:

```ts
function warnUser(): void {
  console.log('This is my warning message!')
}
```

### Never

Возвращаемый тип функции, как `void`, но обозначает функцию, которая никогда не завершится:

```ts
// функция выкинет ошибку и не завершится
function neverFn(): never {
  throw new Error('error');
}

// функция вызовет бесконечный цикл
function infiniteLoop(): never {
  while (true) {}
}
```

### Null и Undefined

В TypeScript `null` и `undefined` имеют типы `null` и `undefined` соответственно. Сами по себе они не особо полезны:

```ts
// Переменным можно присвоить только одно значение
const n: null = null;
const u: undefined = undefined;
```

## Interfaces

С помощью интерфейсов удобно описывать объекты.

```ts
interface MyInterface {
  a: string;
  b: number[];
}

const myObj: MyInterface = {
  a: 'hello!',
  b: [1, 2, 3],
}
```

### Optional properties

Не все свойства объекта могут быть обязательными. В интерфейсах необязательные свойства помечаются с помощью `?`:

```ts
interface MyInterface {
  a?: string;
  b: number[];
}

const myObj: MyInterface = {
  // Проверка типа не выдаст ошибку из-за пропущенного свойства "a"
  b: [1, 2, 3],
}
```

### Readonly

Иногда нужно, чтобы свойства объекта нельзя было изменить. Для таких свойств используется ключевое слово `readonly`:

```ts
interface MyInterface {
  readonly a: string;
}

const myObj: MyInterface = {
  a: 'hello!',
}
myObj.a = 'bye!'; // error
```

### Index signature

Бывают ситуации, когда мы не знаем какой объект будет получен и сколько у него будет свойств. Известны только значения
этих свойств (например `string`):

```ts
const apiAnswer = { key: 'q', key2: 'w', ..., key99: 'e' }
```

Для таких случаев используется index signature:

```ts
interface IndexInterface {
  [n: string]: string;
}

const apiAnswer: IndexInterface = { key: 'q', key2: 'w', key99: 'e' }

// можем обратиться к любому ключу объекта, и это значение будет "string"
const value = apiAnswer.randomKey; // -> type: string
```

## Functions

Типизация функции на примере `calculate`, которая принимает метод (`add` — сложить, или `sub` — вычесть),
левую часть выражения и правую:

```ts
// method — строка
// left и rigth — числа
// возвращаемое значение функции — число
function calculate(method: 'add' | 'sub', left: number, right: number): number {
  switch (method) {
    case 'add': return left + right;
    case 'sub': return left - right;
  }
}
```

Помимо того, что можно типизировать аргументы функции и ее возвращаемое значение, можно еще дать тип самой функции:

```ts
// с помощью type alias:
type TypeFn = () => number;
const arrowFn: TypeFn = () => 2;

// с помощью interface:
interface FnInterface {
  (a: string): void;
}

const fn: FnInterface = (a) => {
  console.log(a)
}
```

## Classes

TypeScript представляет полную поддержку ключевого слова `class` введенного в ES2015.

### Fields

Объявление поля создает общедоступное записываемое свойство класса:

```ts
class Point {
  x: number;
  y: number;
}

const pt = new Point();
pt.x = 0;
pt.y = 0;
```

Аннотация типа не обязательна. Если тип и значение не будут указаны явно, то тип такого поля будет `any`. Если поле
инициализировано с начальным значением, но без явного типа, то TypeScript выведет тип автоматически:

```ts
class Point {
  x = 0;  // -> number
  y;      // -> any
}
```

### --strictPropertyInitialization

Параметр `--strictPropertyInitialization` определяет, нужно ли инициализировать поля класса в конструкторе:

```ts
class BadGreeter {
  name: string;
  // Error
  // свойство `name` не имеет инициализатора
  // и не определено в конструктуре
}

class GoodGreeter {
  name: string;

  constructor() {
    this.name = 'hello';
  }
}
```

### readonly

Поля могут иметь модификатор `readonly`. Таким полям нельзя присвоить значение вне конструктора.

```ts
class Greeter {
  readonly name: string = 'world';

  constructor(otherName?: string) {
    if (otherName !== undefined) {
      this.name = otherName;
    }
  }

  err() {
    this.name = 'not ok'; // error
    // -> нельзя присвоить значение полю 'name'
    // потому что это read-only поле
  }
}

const g = new Greeter();
g.name = 'also not ok'; // error
```

### Вызов super

Как и в JavaScript, если у вас есть базовый класс, то нужно вызвать `super()` в теле функции конструктора прежде, чем
использовать `this`:

```ts
class Base {
  k = 4;
}

class Derived extends Base {
  constructor() {
    console.log(this.k); // Error
    // перед обращением к 'this' необходимо вызвать 'super'
    super();
  }
}
```

Забыть вызвать `super` — это распространенная ошибка, но TypeScript сообщит нам, когда это необходимо.

### Methods

Свойство-функция в классе называется методом. Методы могут использовать аннотации тех же типов, что и функции и
конструкторы:

```ts
class Point {
  x = 10;
  y = 10;

  scale(n: number): void {
    this.x *= n;
    this.y *= n;
  }
}
```

### Наследование классов

Как и в других языках с объектно-ориентированными функциями, классы в JavaScript могут наследоваться от базовых классов.

#### implements

Мы можем использовать `implements`, чтобы проверить, удовлетворяет ли класс определенному интерфейсу. Если класс не
может правильно реализовать интерфейс, будет выдана ошибка:

```ts
interface Pingable {
  ping(): void;
}

class Sonar implements Pingable {
  ping() {
    console.log('ping!');
  }
}

class Ball implements Pingable {
  // error
  pong() {
    console.log('pong!');
  }
}
```

#### Расширение классов. Extends

Классы могут происходить от базового класса. Производный класс имеет все свойства и методы своего базового класса, а так
же определяет дополнительные свойства.

```ts
class Animal {
  move() {
    console.log('Moving along!');
  }
}

class Dog extends Animal {
  woof(times: number) {
    for (let i = 0; i < times; i++) {
      console.log('woof!');
    }
  }
}

const dog = new Dog();
dog.move();  // метод базового класса
dog.woof(3); // метод дочернего класса
```

#### Переопределение методов

Производный *(дочерний)* класс может переопределять поле или свойство базового класса.

```ts
class Base {
  greet() {
    console.log('Hello, world!');
  }
}

class Derived extends Base {
  greet(name?: string) {
    if (name === undefined) {
      super.greet();
    } else {
      console.log(`Hello, ${name}!`)
    }
  }
}

const d = new Derived();
d.greet(); // -> Hello, world!
d.greet('reader'); // -> Hello, reader!
```

### Модификаторы доступа

Мы можем использовать TypeScript для управления отображением определенных методов и свойств для кода вне класса.

#### public

По умолчанию все свойства класса имеют уровень доступа `public`. Получить доступ к такому свойству можно откуда угодно:

```ts
class Greeter {
  public greet() {
    console.log('hi!');
  }
}

const g = new Greeter();
g.greet();
```

#### protected

Защищенные свойства видны только подклассам того класса, в котором они объявлены.

```ts
class Greeter {
  public greet() {
    console.log('Hello, ' + this.getName())
  }

  protected getName() {
    return 'hi';
  }
}

class SpecialGreeter extends Greeter {
  public howdy() {
    // OK. можем получить доступ к защищенному полю
    console.log('Howdy, ' + this.getName());
  }
}

const g = new SpecialGreeter();
g.greet();   // OK
g.getName(); // Error
```

#### private

`private` похож на `protected`, но не разрешает доступ к свойству даже из подклассов:

```ts
class Base {
  private x = 0;
}

const b = new Base();
console.log(b.x); // Error

class Derived extends Base {
  showX() {
    // нет доступа в подклассе
    console.log(this.x); // Error
  }
}
```

### abstract Classes

Классы, методы и поля в TypeScript могут быть абстрактными. Абстрактный метод или поле — это метод, для которого не
предусмотрена реализация. Такие методы должны быть внутри абстрактного класса, который не может быть создан напрямую.

Роль абстрактных классов — служить базовым классом для подклассов, которые реализуют все абстрактные методы и поля.

```ts
abstract class Base {
  abstract getName(): string;

  printName() {
    console.log('Hello, ' + this.getName());
  }
}

const b = new Base(); // Error. Не можем создать экземпляр абстрактного класса

class Derived extends Base {
  getName() {
    return 'world';
  }
}

const d = new Derived();
d.printName(); // Hello, world
```

> [Документация по классам в
> TypeScript](https://www.typescriptlang.org/docs/handbook/classes.html)

## Generics

Дженерики похожи на аргументы функции, только хранят в себе не значения, а типы значений.

На примере функции `identity`, которая возвращает тоже, что и принимает, объявлен тип `T`, который будет равен типу
переданного аргумента. Мы также можем использовать полученный тип `T`, как тип возвращаемого значения функции:

```ts
function identity<T>(arg: T): T {
  return arg;
}
```

Теперь, можно вызвать функцию `identity` одним из двух способов. Первый способ — передать все аргументы, включая
аргумент типа:

```ts
const result = identity<string>('myString');
//         ^ = const result: string
```

Здесь мы явно устанавливаем `T` как строку в качестве одного из аргументов вызова функции, обозначенного с помощью `<>`
вокруг аргументов, в не `()`.

Второй способ — когда используется автоматическое определение типа компилятором в зависимости от типа аргумента, который
передан в функцию:

```ts
const result = identity('myString');
//         ^ = const result: string
```

> [Документация по дженерикам в
> TypeScript](https://www.typescriptlang.org/docs/handbook/generics.html)

### Встроенные generics (utilits)

TypeScript предоставляет несколько служебных типов для упрощения работы с общими типами.

#### Omit

`Omit` «выкидывает» из переданного интерфейса определенные ключи, создавая на его основе новый тип:

```ts
interface ITodo {
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

type TTodoPreview = Omit<ITodo, 'description' | 'date'>

// Тип TTodoPreview не содержит ключи description и date
const todo: TTodoPreview = {
  title: 'Clean room',
  completed: false,
}
```

#### Pick

`Pick` работает как `Omit`, только наоборот. Он забирает определенные ключи из переданного интерфейса, исключая все
остальные ключи:

```ts
interface ITodo {
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

type TTodoPreview = Pick<ITodo, 'title' | 'completed'>

// Тип TTodoPreview содержит только ключи title и completed
const todo: TTodoPreview = {
  title: 'Clean room',
  completed: false,
}
```

#### Partial

`Partial` принимает только один аргумент (интерфейс), и создает новый тип, делая все ключи интерфейса необязательными.

```ts
interface ITodo {
  title: string;
  description: string;
}

const partialTodo: Partial<ITodo> = {
  title: 'hi',
  // все свойства не обязательны
}
```

> [Полный список служебных типов
> TypeScript](https://www.typescriptlang.org/docs/handbook/utility-types.html)
