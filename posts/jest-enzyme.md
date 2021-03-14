---
date: '2021-03-14'
title: 'Unit-тестирование. Jest & Enzyme'
spoiler: 'Тестирование React-приложения и React-компонентов с помощью библиотек Jest и Enzyme.'
---

## Теория тестирования

**Unit тестирование** — это тестирование логики инкапсулированного компонента.

**Интеграционное тестирование** — проверка взаимодействия созданного модуля с другими, то есть, не сломала ли новая логика
что-то за ее пределами.

**End-to-End (E2E) тестирование** — проверка работы всего приложения или фактически описанных бизнес-кейсов (поведение
пользователя).

> Важное правило unit тестов — один тест, одна проверка

## Тестирование отрисовки

`it` — обертка для одного теста.

`describe` — обертка для группы тестов. Используется, чтобы группировать связанные по логике тесты в один блок.

[`expect`](https://jestjs.io/ru/docs/expect#expectvalue) — функция, которая используется, когда нужно проверить
значение. Вызывается вместе с функцией-проверкой, такой, как `.toBe`.

[`.toBe`](https://jestjs.io/ru/docs/expect#tobevalue) — используется для сравнения примитивных значений.

[`.find(selector)`](https://enzymejs.github.io/enzyme/docs/api/ShallowWrapper/find.html) — находит каждый элемент в
компоненте, который соответствует предоставленному селектору.

[`.text`](https://enzymejs.github.io/enzyme/docs/api/ShallowWrapper/text.html) — вернет строку с текстом, который
содержится внутри элемента.

### Методы отрисовки, и различия между ними

Есть три метода отрисовки, предоставляемых библиотекой Enzyme — `shallow`, `mount`, `render`.

[`shallow`](https://enzymejs.github.io/enzyme/docs/api/shallow.html) — самый часто используемый метод отрисовки
компонента. Реализует «поверхностную» отрисовку. Рендерится только переданный компонент, и никакие дочерние не
затрагиваются.

[`mount`](https://enzymejs.github.io/enzyme/docs/api/mount.html) — более глубокая отрисовка. Рендерится целевой
компонент, а также дочерние компоненты. Данный метод используется, если нужно протестировать методы жизненного цикла.

[`render`](https://enzymejs.github.io/enzyme/docs/api/render.html) — метод, как и `mount`, рендерит всю дочернюю
структуру, но используется, если нужно проверить разметку текущего и дочерних компонентов, а методы жизненного цикла не
интересуют.

```jsx
import React from 'react';
import Post from './Post';

// Объявляем ф-ю, которая принимает props, и возвращает отрисованный компонент
const setUp = (props) => shallow(<Post {...props} />)

// проверяем, что отрендеренный компонент содержит необходимые элементы
// другими словами, что компонент рендерится
describe('should render Post component', () => {
  // проверка, что компонент Post содержит обертку .post
  it('should contain .post wrapper', () => {
    const component = setUp();
    const wrapper = component.find('.post');

    // добавим проверку, что данный элемент 'wrapper'
    // должен встречаться в компоненте только один раз:
    expect(wrapper.length).toBe(1);

    // чтобы посмотреть разметку компонента, можно воспользоваться методом 'debug'
    console.log(component.debug());
  });

  // компонент содержит ссылку
  it('should contain link', () => {
    const component = setUp();
    const link = component.find('a');
    expect(a.length).toBe(1);
  });

  // проверка логики отрисовки даты (если дата есть, дата форматируется и отрисовывается,
  // если даты нет, отрисовывается 'no date')
  it('should render created date', () => {
    const created_at = '13-03-2021';
    const component = setUp({ created_at }); // передаем дату в виде пропсов
    const dateEl = component.find('.date'); // находим элемент 'дата'.

    // теперь проеряем не кол-во найденных элементов, а контент, внутри элемента:
    expect(dateEl.text()).toBe(new Date(created_at).toLocalDateString());
  })
})
```

Такой способ поиска элементов по тегам и классам, и проверка их количества и контента сложно применять к большим
компонентам, так как появляется много избыточных конструкций. На помощь приходит `snapshot` тестирование.

## Snapshot тестирование

Для примера использования `snapshot` тестирования будет использоваться компонент `Posts`. Это список, который рендерит
посты новостей:

```jsx
import Post from './Post';

const NEWS = [
  {
    author: 'John',
    created_at: '2020-05-03T23:36:09.816Z',
    num_comments: 10,
    objectID: 1,
    title: 'Jest & Enzyme',
    points: 100,
    url: '//test.url',
  },
  {
    author: 'Stepan',
    created_at: '2020-05-05T23:36:09.816Z',
    num_comments: 8,
    objectID: 2,
    title: 'TypeScript Basics',
    points: 10,
    url: '//test12.url',
  },
];

export const Posts = () => (
  <ul className="newsList">
    {NEWS.map(
      ({ author, created_at, num_comments, objectID, title, points, url }) => (
        <Post
          key={objectID}
          author={author}
          created_at={created_at}
          num_comments={num_comments}
          title={title}
          points={points}
          url={url}
        />
      )
    )}
  </ul>
)
```

Теперь переходим к тестированию:

```jsx
import React from 'react';
import Posts from './posts';

describe('Posts component', () => {
  it('should render Posts component', () => {
    const component = shallow(<Posts/>);

    // чтобы получить 'snapshot', нужно вызывать метод 'toMatchSnapshot':
    expect(component).toMatchSnapshot();
  })
})
```

Теперь после вызова теста, в папке компонента появится новая папка `__snapshots__`, в которой будет храниться снимок
нашего компонента.

> Важно запомнить, что в снимках не должно содержаться слова
> `undefined`. Если оно есть, то это сигнал на использование `mock`-данных.

После прохождения теста, разметка будет сверяться со снимком. Если тест упал, то у нас есть 2 варианта:

1. Если это не было запланированным изменением, мы должны проверить компонент и исправить найденные проблемы.
2. Если новая разметка верна, нужно обновить снимок. Для этого при запуске теста добавить флаг `-u`: `npm run test -u`.

## Тестирование пропсов

Начнем с простого примера. Компонент `Title`, получает пропс `title` и возвращает заголовок `h1` с переданным текстом:

```jsx
export const Title = ({ title = 'Simple title' }) => (
  <h1 className='title'>{title}</h1>
)
```

Файл тестов:

```jsx
import React from 'react';
import Title from './Title';

describe('Title component', () => {
  // проверяем два кейса - рендер с пропсами и без с помощью 'snapshot' тестов
  it('should render Title component with props', () => {
    const component = shallow(<Title title="Test title"/>);
    expect(component).toMatchSnapShot();
  })
  it('should render Title component without props', () => {
    const component = shallow(<Title/>);
    expect(component).toMatchSnapShot();
  })
})
```

Второй, пример — компонент `Select`:

```jsx
const NOOP = () => {};

const Select = ({ handleChange = NOOP, options = [], value = 0 }) => (
  <div className="selectWrapper">
    {options.length > 0 ? (
      <>
        <select onChange={handleChange} defaultValue={value}>
          {options.map(({ value, label }) =>
            <option key={value} value={value}>
              {label}
            </option>
          )}
        </select>
        <span>per page</span>
      </>
    ) : (
      <div className='placeholder'>no items</div>
    )}
  </div>
)
```

Файл тестов:

```jsx
import React from 'react';
import Select from './Select';
import { shallow } from 'enzyme'; // когда методы не обозначены глобально

// в первую очередь, для компонента нужно создать пропсы:
const props = {
  options: [
    { value: 'text_1', label: 'Test 1' },
    { value: 'text_2', label: 'Test 2' },
  ],
  value: 0,
  handleChange: () => {},
}

// создаем ф-ю `setUp` для создания компонента
const setUp = (props) => shallow(<Select {...props} />);

describe('Select component', () => {
  describe('Has props', () => {
    // кейс, когда пропсы есть
    const component = setUp(props);

    // тестируем на наличие в разметке самого селекта
    it('should render select element', () => {
      const select = component.find('select');
      expect(select).toHaveLength(1);
      // toHaveLength(1) - аналог комбинации с select.length и '.toBe(1)'
    })

    // и двух опций (из массива props.options):
    it('should render 2 options', () => {
      const options = component.find('option');
      expect(options).toHaveLength(2);
    })
  });

  describe('Has no props', () => {
    // кейс, когда пропсов нет
    it('should render placeholder', () => {
      const component = shallow(<Select/>);
      const placeholder = component.find('.placeholder');
      expect(placeholder).toHaveLength(1);
    })
  });

  describe('defaultProps', () => {
    // кейс, с проверкой дефолтных значений пропсов
    it('should use default handleChange', () => {
      const result = Select.handleChange();
      expect(result).toBe(undefined);
    })
  })
})
```

## Тестирование событий и обработчиков событий

Новые методы, используемые в следующем примере:

[`beforeEach`](https://jestjs.io/ru/docs/api#beforeeachfn-timeout) — выполняет переданный `callback` перед каждым
запуском теста (`it`).

[`.instance`](https://enzymejs.github.io/enzyme/docs/api/ShallowWrapper/instance.html) — метод возвращает
ReactComponent, после чего мы можем с ним взаимодействовать: вызывать методы, обращаться к свойствам и т. д.

Пример теста методов React-компонента:

```jsx
import React from 'react';
import Posts from './Posts';

const setUp = (props) => shallow(<Posts {...props}/>);

describe('Posts component', () => {
  const DEFAULT_PAGE = 10;
  let component;
  let instance;

  beforeEach(() => {
    component = setUp();
    instance = component.instance();
  })

  it('should render Posts component', () => {
    expect(component).toMatchSnapshot();
  });

  // добавляем отдельный кейс для тестирования всех хендлеров внутри компонента
  describe('Posts handlers', () => {
    it('should handle search input value', () => {
      // проверяем, что изменяемое значение в стейте сначала пустое
      expect(component.state().searchQuery).toBe('');

      // обращаемся к методу компонента 'handleInputChange'
      // вызывая его с некоторым значением 'test'
      instance.handleInputChange({ target: { value: 'test' } });

      // и проверяем изменение стейта компонента
      expect(component.state().searchQuery).toBe('test');
    });

    // тест аналогичного хендлера
    it('should handle change hits per page', () => {
      expect(component.state().hitsPerPage).toBe(20); // по умолчанию 20
      instance.handleHitsChange({ target: { value: String(DEFAULT_PAGE) } });
      expect(component.state().hitsPerPage).toBe(DEFAULT_PAGE);
    })

    // тест метода getSearch: по клику на 'Enter' значение страницы должно быть
    // сброшено на 0. Вместо значения, мы передаем ключ клавиши
    it('should handle change page if "Enter" clicked', () => {
      instance.setState({ page: DEFAULT_PAGE });
      instance.getSearch({ key: 'Enter' });
      expect(component.state().page).toBe(0);
    })
    // теперь тест негативного варианта, то есть вместо 'Enter',
    // была нажата другая клавиша
    it('should not change page if "a" button is clicked', () => {
      instance.setState({ page: DEFAULT_PAGE });
      instance.getSearch({ key: 'a' });
      expect(component.state().page).toBe(DEFAULT_PAGE);
    })
  });
})
```

Еще пример тестирования методов, когда у метода есть значение по умолчанию `() => {}`. В таких случаях, при вызове
метода мы ожидаем получить `undefined`.

Компонент:

```jsx
const NOOP = () => {};

export const Input = ({ value = '', onChange = NOOP, onKeyPress = NOOP }) => (
  <div className="inputWrapper">
    <i className="seacrh"/>
    <input
      className="input"
      placeholder="Click to search"
      onChange={onChange}
      onKeyPress={onKeyPress}
      value={value}
    />
  </div>
)
```

Тест:

```jsx
import React from 'react';
import Input from './Input';

describe('Input component', () => {
  it('should render Input component', () => {
    const component = shallow(<Input/>);
    expect(component).toMatchSnapshot();
  });

  describe('defaultProps', () => {
    it('should use default onChange', () => {
      const result = Input.onChange();
      expect(result).toBe(undefined);
    });
    it('should use default onKeyPress', () => {
      const result = Input.onChange();
      expect(result).toBe(undefined);
    });
  })
})
```

### Тестирование кликов

Компонент:

```jsx
import React, { Component } from 'react';

export class CounterButton extends Component {
  state = {
    count: 0,
  };

  handleClick = () => {
    this.setState(({ count }) => ({
      count: ++count,
    }));
  };

  handleReset = (count) => {
    this.setState({ count });
  };

  render() {
    return (
      <div>
        <div>{this.state.count}</div>
        <button className="plusOneBtn" onClick={this.handleClick}>
          +1
        </button>
        <button className="resetBtn" onClick={() => this.handleReset(10)}>
          Reset to 10
        </button>
      </div>
    )
  }
}
```

Тест:

```jsx
import React from 'react';
import Counter from './Counter';

const setUp = () => shallow(<Counter/>);

describe('Count component', () => {
  let component;
  let instance;
  beforeEach(() => {
    component = setUp();
    instance = component.instance();
  });

  it('should render Counter component', () => {
    expect(component).toMatchSnapshot();
  })

  // теперь мы не вызваем методы, а симулирем нажатие
  // с помощью метода '.simulate()'
  describe('Counter handlers', () => {
    it('should changecount value to plus one', () => {
      const btn = component.find('.plusOneBtn');
      btn.simulate('click');
      expect(component.state().count).toBe(1);
      // при необходимости делаем снимок для сравнения разметки
      // expect(component).toMatchSnapshot();
    });

    // первый вариант
    it('should reset count value to 10', () => {
      const btn = component.find('.resetBtn');
      btn.simulate('click');
      expect(component.state().count).toBe(10);
    });

    // второй вариант (с вызовом метода напрямую)
    it('should reset count value to custom value', () => {
      instance.handleReset(20);
      expect(component.state().count).toBe(20);
    });
  });
});
```

#### Mock вызываемых функций с помощью jest-function на примере тестирования клика

Компонент:

```jsx
import React, { Component } from 'react';

class Button extends Component {
  handleClick = () => {
    const { onClick } = this.props;
    onClick();
  };

  render() {
    return (
      <button className='btn' onClick={this.handleClick}>
        {this.props.label}
      </button>
    );
  }
}
```

Тест:

```jsx
import React from 'react';
import Button from './Button';

describe('Button component', () => {
  it('should call onClick method', () => {
    // проверяем, действительно ли вызывается переданная (пропсом) функция
    const mockCallBack = jest.fn();
    const component = shallow(<Button onClick={mockCallBack}/>);

    // проверяем количество вызовов jest.fn().
    // до клика = 0
    expect(mockCallBack.mock.calls.length).toBe(0);
    component.find('.btn').simulate('click');
    // после клика = 1
    expect(mockCallBack.mock.calls.length).toBe(1);
  });
});
```

## Тестирование методов жизненного цикла компонента

Новые методы, используемые в следующем примере:

[`.spyOn`](https://jestjs.io/ru/docs/jest-object#jestspyonobject-methodname) — служит оберткой, которая следит за
вызовом определенного метода.

Компонент:

```jsx
import React, { Component } from 'react';

export class Info extends Component {
  state = {
    value: 'Test value',
    width: 0,
  };

  componentDidMount() {
    this.handleChangeTitle();
    window.addEventListener('resize', this.handleWidth);
  }

  componentDidUpdate() {
    this.handleChangeTitle();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWidth);
  }

  handleChangeTitle = () => {
    document.title = this.state.value;
  }

  handleWidth = () => {
    this.setState({
      width: window.innerWidth,
    })
  }

  render() {
    return <h1>{this.state.width}</h1>
  }
}
```

Тест:

```jsx
import React from 'react';
import Info from './Info';

const setUp = () => shallow(<Info/>);

// на каждый из методов жизненного цикла вешаем метод '.spyOn'
const componentDidMountSpy = jest.spyOn(Info.prototype, 'componentDidMount');
const componentDidUpdateSpy = jest.spyOn(Info.prototype, 'componentDidUpdate');
const componentWillUnmountSpy = jest.spyOn(Info.prototype, 'componentWillUnmount');

describe('Info component', () => {
  let component;
  beforeEach(() => {
    jest.spyOn(window, 'addEventListener');
    jest.spyOn(window, 'removeEventListener');
    component = setUp();
  });

  // выполнить код после каждого теста
  afterEach(() => {
    // сбрасываем значения обработчиков
    window.addEventListener.mockRestore();
    window.removeEventListener.mockRestore();
  });

  it('should render Info component', () => {
    expect(component).toMatchSnapshot();
  })

  describe('Lifecycle methods', () => {
    it('should call componentDidMount once', () => {
      // метод должен вызываться один раз (при монтировании)
      expect(componentDidMountSpy).toHaveBeenCalledTimes(1);
    });

    it('should not call componentWillUnmount when component just mounted', () => {
      // метод не должен вызываться после монтирования
      expect(componentWillUnmountSpy).toHaveBeenCalledTimes(0);
    });

    it('should call componentDidUpdateSpy', () => {
      // тестируем, происходит ли обновление компонента
      // при получении новых пропсов
      component.setProps(); // установка пропсов
      expect(componentDidUpdateSpy).toHaveBeenCalled(); // и проверка вызова хука
    });

    it('should call componentDidUpdateSpy', () => {
      // тестируем, что при размонтировании компонента
      // вызывается метод 'componentWillUnmount'
      component.unmount();
      expect(componentWillUnmountSpy).toHaveBeenCalledTimes(1);
    });
  })

  // А также тесты методов самого компонента
  describe('Component handlers', () => {
    // 1. Вешается ли обработчик 'resize' на 'window'
    it('should call addEventListener when component mounted', () => {
      expect(window.addEventListener).toHaveBeenCalledTimes(1);
    })
    // 2. Вызывается ли 'handleChangeTitle' при обновлении компонента
    it('should call handleChangeTitle in componentDidUpdate', () => {
      const instance = setUp().instance();
      instance.handleChangeTitle = jest.fn();
      instance.componentDidUpdate();
      expect(instance.handleChangeTitle).toHaveBeenCalled();
    })
    // 3. Снимается ли обработчик при размонтировании компонента
    it('should call removeEventListener when component unmount', () => {
      component.unmount();
      expect(window.removeEventListener).toHaveBeenCalled()
    })
    // 4. Проверим, что при изменении размера окна будет вызываться нужный метод
    it('should call handleWidth during window resize', () => {
      expect(component.state().width).toBe(0); // сначала state.width = 0
      global.dispatchEvent(new Event('resize')); // вызываем глобальный евент 'resize'
      expect(component.state().width).toBe(window.innerWidth); // проверяем, что значение изменилось
    })
  })
})
```

## Полное тестирование снимками

Данный кейс тестирования подходит для компонентов, в которых много логики рендеринга и нет «бизнес логики». Рассмотрим
на примере компонента пагинации.

Компонент:

```jsx
const renderPaginationBtns = (onClick, page, lastPage) => {
  const startBtns = [page, page + 1, page + 2];
  const gapBtns = [page - 2, page - 1, page];
  const middleBtn = ['...'];
  const lastBtns = [lastPage - 3, lastPage - 2, lastPage - 1];
  let btnsArr = [];

  if (page < lastPage - 6) {
    btnsArr = [...startBtns, ...middleBtn, ...lastBtns];
  } else if (page < lastPage - 4) {
    btnsArr = [...gapBtns, ...middleBtn, ...lastBtns];
  } else if (page < lastPage - 3) {
    btnsArr = [...gapBtns, ...lastBtns]; // last 6 pages
  } else if (page === 0 && lastPage === 0) {
    btnsArr = [];
  } else {
    btnsArr = [...middleBtn, ...lastBtns]; // last 3 pages
  }

  return btnsArr.map((num) => {
    return num === '...' ? (
      num
    ) : (
      <button
        key={num}
        onClick={onClick}
        data-name={name}
        className={num === page ? 'active' : ''}
      >
        {num}
      </button>
    )
  });
}

const NOOP = () => {};

const Pagination = ({ onClick = NOOP, page = 0, lastPage = 0 }) => (
  <div className="paginationWrapper">
    {page !== 0 && (
      <button onClick={onClick} data-name="prev">
        {'<<'}
      </button>
    )}
    {renderPaginationBtns(onClick, page, lastPage)}
    {page !== lastPage && (
      <button onClick={onClick} data-name="next">
        {'>>'}
      </button>
    )}
  </div>
)
```

Тест:

```jsx
import React from 'react';
import Pagination from './Pagination';

describe('Pagination component', () => {
  it('should render Pagination without props', () => {
    const component = shallow(<Pagination/>);
    expect(component).toMatchSnapshot();
  });

  it('should render Pagination with props', () => {
    const component = shallow(<Pagination lastPage={20}/>);
    expect(component).toMatchSnapshot();
  });

  it('should render Pagination for last pages', () => {
    const component = shallow(<Pagination page={15} lastPage={20}/>);
    expect(component).toMatchSnapshot();
  })

  it('should render Pagination without 3dots in the middle', () => {
    const component = shallow(<Pagination page={16} lastPage={20}/>);
    expect(component).toMatchSnapshot();
  })

  it('should render Pagination with 3dots and 3 buttons in the end', () => {
    const component = shallow(<Pagination page={19} lastPage={20}/>);
    expect(component).toMatchSnapshot();
  })

  describe('defaultProps', () => {
    it('should use default onChange', () => {
      const result = Pagination.onClick();
      expect(result).toBe(undefined);
    })
  })
})
```

## Тестирование функций-утилит

Функции:

```js
// 1. ф-я получает строку и число, возвращает обрезанную строку, 
// если длинна больше заданного числа
export const trimString = (string, maxLength) =>
  string && string.trim().length > maxLength
    ? `${string.trim().slice(0, maxLength)}...`
    : string

// 2. ф-я проверяет, является ли переданное значение числом
export const getIsValidNumber = (number) => !Number.isNaN(parseInt(number, 10));

// 3. ф-я удаляет свойство из объекта не мутируя его, и вернет новый объект
export const removeObjPropImmutably = (obj, prop) => {
  const res = { ...obj };
  delete res[prop];
  return res;
}
```

Тесты:

```js
import { trimString, getIsValidNumber, removeObjPropImmutably } from './utils';

describe('trimString util', () => {
  it('Positive trimming cases', () => {
    expect(trimString('LongName', 5)).toBe('LongN...');
    expect(trimString('LongName', 4)).toBe('Long...');
    expect(trimString('LongName', 10)).toBe('LongName');
    expect(trimString('   LongName   ', 3)).toBe('Lon...');
  });

  it('Negative trimming cases', () => {
    expect(trimString('    ', 4)).toBe('    ');
    expect(trimString(null, 4)).toBeNull();
    expect(trimString(undefined, 4)).toBeUndefined();
    expect(trimString(12345, 4)).toBe('1234...');
  });
})

describe('getIsValidNumber util', () => {
  it('Positive checking cases', () => {
    const numbers = [1, 0, 0.5, '123', '321asd']; // valid numbers
    for (let i = 1; i < numbers.length; i++) {
      expect(getIsValidNumber(numbers[i])).toBeTruthy();
    }
  });

  it('Negative checking cases', () => {
    const notNumbers = ['asd321', 'wqe', Infinity, undefined, null, NaN, [], {}];
    for (let i = 1; i < notNumbers.length; i++) {
      expect(getIsValidNumber(numbers[i])).toBeFalsy();
    }
  });
})

describe('removeObjPropImmutably util', () => {
  it('Positive removing', () => {
    expect(removeObjPropImmutably({ a: 1, b: 2 }, 'b')).toMatchObject({ a: 1 });
    expect(removeObjPropImmutably({
      a: () => {
      }, b: 2
    }, 'a')).toMatchObject({ b: 2 });
  });

  it('Negative removing', () => {
    const notValidObjects = [undefined, null, [], {}, 'str', 1];
    for (let i = 1; i < notValidObjects.length; i++) {
      expect(removeObjPropImmutably(notValidObjects[i])).toMatchObject({});
    }
  });
})
```

## Тестирование контекста

Файл контекста:

```jsx
import React, { useState } from 'react';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, toggleLoginStatus] = useState(false);

  const toggleLogin = () => {
    toggleLoginStatus(!isLoggedIn);
  }

  return (
    <AuthContext.Provider value={{ toggleLogin, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}
```

Файл компонента:

```jsx
import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';

export const ContextComponent = () => {
  const { isLoggedIn, toggleLoginStatus } = useContext(AuthContext);

  return (
    <>
      <button className="btn" onClick={toggleLogin}>
        Login
      </button>
      <div className="text">{isLoggedIn.toString()}</div>
    </>
  )
}
```

Тест:

```jsx
import React from 'react';
import { AuthProvider } from './AuthContext';
import { ContextComponent } from './ContextComponent';

describe('ContextComponent component', () => {
  // для получения компонента используем метод mount,
  // так как хотим отрисовать дочерний компонент обертки
  const component = mount(
    <AuthProvider>
      <ContextComponent/>
    </AuthProvider>
  )

  it('should toggle login status', () => {
    expect(component.find('div').text()).toBe('false');
    component.find('.btn').simulate('click');
    expect(component.find('div').text()).toBe('true');

    component.find('.btn').simulate('click');
    expect(component.find('div').text()).toBe('false');
  });
});
```

> Конспект видео [Jest & Enzyme. Полный курс](https://youtu.be/9g4tsfIJz50)
