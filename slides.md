---
# try also 'default' to start simple
# some information about your slides, markdown enabled
title: YAGNI, или Как не выбирать стейт-менеджер 10+ часов
info: |
  YAGNI, или Как не выбирать стейт-менеджер 10+ часов
# apply any unocss classes to the current slide
class: text-center
# https://sli.dev/custom/highlighters.html
highlighter: shiki
# https://sli.dev/guide/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/guide/syntax#mdc-syntax
mdc: true
---

<img src="/YAGNI,_или_Как_не_выбирать_стейт_менеджер_10+_часов.jpg" class="absolute inset-0 object-cover"  />

<!--
Меня зовут

Поговорим про YAGNI в мире стейтменеджмента
-->

---
src: ./pages/whoami.md
---

---
src: ./pages/wiki-architecture.md
---

---
src: ./pages/architecture-as-is.md
---

---
src: ./pages/inertia.md
---

---
src: ./pages/quo.md
---

---
src: ./pages/frontend-architecture.md
---

---
src: ./pages/false-idea.md
---


---
layout: center
class: "text-center"
---

### Сложность проекта = 

### сложность задачи + сложность способа её решения

<!--
Из чего получается сложность проекта

## читаем
-->

---

# Когда стейт менеджер нужен?

<div class="h-full relative">
<img
  src="/image-6.png"
  class="object-scale-down pb-10 mx-auto absolute inset-0 max-h-full max-w-full"
/>
</div>

<!--
Странно решать простые задачи большими инструментами

статический контент (лендинги, документации, бложики) = не React
Astro, либо 11ty

Astro - крута. 
0 js by default
View Transitions
динамические части сайта можно писать на любом фронтенд фреймворке.

В данном случае вопрос стейтменеджмента у нас не стоит

React появляется с тонкими клиентами

-->
---
layout: two-cols
layoutClass: 'gap-16'
---

# `useState`

```tsx{*|2-3|7-19|*}
function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        name="username"
        type="text"
      />
      <br />
      <input
        value={password}
        onChange={e => setPassword(e.target.value)}
        name="password"
        type="password"
      />
      {/* form continue */}
    </form>
  );
}
```



::right::

<h1 v-click><code>useReducer</code></h1>

<v-click>
<img alt="alt text" src="/image-1.png" />
Редьюсеры такие большие, что не помещаются на слайды
</v-click>

<!-- 
`useState`: подходит для биндинга данных в инпуты, реализации несложной client side логики

простой пример для юз стейта

Когда у нас становится слишком много useState-ов и слишком много мест изменения 
Наш код превращается в спагетти. Ментальное состояние работяг, которые до этого дотрагиваются значительно страдает. 
Нам может захотеться использовать redux, хотя наши данные не явяляются глобальными и здесь хватит `useReducer`-а
-->

---

## React Context - не для стейт менеджмента


```jsx
export const App = () => {
  const [value, setValue] = React.useState('left');

  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(value) => {
        if (value) setValue(value);
      }}
    >
      <ToggleGroup.Item value="left">
        <TextAlignLeftIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="center">
        <TextAlignCenterIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="right">
        <TextAlignRightIcon />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};
```


<!--
Контекст - это очень плохой инструмент для стейт менеджмента

Почему?
Контекст решает обновлять ли подписчиков через ссылочное сравнение. соотвественно, если у нас поменялось одно из 10 свойств в объекте, то мы получим новую ссылку. А значит даже те слушатели которые н слушатели контекста будут перезапущены. пойдём ререндерить все места где не пользовались этим свойствам перерендерятся. Контекст не поддерживает селекторы и до тех пор пока не начнёт - мы будем вынуждены использовать подходы с несколькими контекстами, но разделять один контекст с 10 полями на 10 контекстов каждый из которых отвечает за свой - вы не захотите: https://github.com/reactjs/rfcs/pull/119


контекст чтобы не пропдриллить и контекст для контекста

Ещё контекст съедобен для уменьшения пропс дриллинга, но если не создавать большую вложенность у нас этой проблемы и не будет
Если мы хотим создавать компоненты, которые можно будет композировать и расширять без бесконечного добавления лишних пропросв. То нам пригодиться Context для того, чтобы вложеннные компоненты знали о состоянии родителя 

Контекст хорош для проверки гипотез и позволяет отсрочить момент добавления стейтменеджера, если знать что делаешь
-->
---

# Чем нам может помочь браузер
- searchParams 
- localStorage 
- sessionStorage

<!--
Как убрать данные из жизненного цикла компонента?

Используем браузерные api
-->

---

# Search params

- next
- react-router-dom
- @tanstack/react-router

<!-- 
searchParams, localStorage и sessionStorage

Механизм searchParams неоправданно редко используется фронтенд разработчиками, хотя

- полезно на сервер сайде - там как у нас нет доступа к бразузерным api
- пользователь сможет расшарить урл
- Когда нам репортят баг - вы сможете открыть ссылку и увидеть страницу в том же состоянии
- пользователь сможет продублировать вкладку - он получит вкладку в том же состоянии (скорее всего этого он и хочет)
- пользователь сможет получить то же состояние при обновлении страницы, либо навигации назад
- пользователь сможет сохранить закладку на страницу в удобном для него состоянии


Нельзя поговорить про searchParams без того, чтобы обсудить router-ы. 
Скорее всего у вас на проекте уже есть какой роутер и вам придётся с ним жить(
То насколько приятно с ними будет работать будет зависеть непосредственно от него

От худшего к лучшему
 -->

---

## Next.js - сериализуй меня полностью

```tsx{|4|6-13|17-19|20-22}
export default function ExampleClientComponent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )
  return (
    <>
      <p>Sort By</p>
      <button onClick={() => router.push(pathname + '?' + createQueryString('sort', 'asc'))}>
        ASC
      </button>
      <Link href={pathname + '?' + createQueryString('sort', 'desc')}>
        DESC
      </Link>
    </>
  )
}
```

<!-- 
В next js можно получить searchParams при помощи хука, но для того, чтобы обновить их - надо сделать переход по ссылке и сериализовать параметры
Удобной работы с вложенными объектами из коробки нету
Разработчики next-а вероятно не считают searchParams важными

Это можно накостылить, если wrap-нуть некстовые апишки. Можно получить апи, как в react-router-dom 
-->

---

## React-router-dom - ну хоть что-то

```tsx{*|5|16-21|7-11} twoslash
import * as React from "react";
import { useSearchParams } from "react-router-dom";

function App() {
  let [searchParams, setSearchParams] = useSearchParams();

  const changeSort = (newSort: 'desc' | 'asc') => {
    const clonedSearchParams = new URLSearchParams(searchParams);
    clonedSearchParams.set('sort', newSort);
    setSearchParams(clonedSearchParams);
  }

  return (
    <>
      <p>Sort By</p>
      <button onClick={() => changeSort('asc')}>
        ASC
      </button>
      <button onClick={() => changeSort('desc')}>
        DESC
      </button>
    </>
  );
}
```

<!--
Уже менее больно, но с учётом ограничения client side routing-а можно сильно лучше

В данном случае мы можем оперировать с searchParams = useState,
Тыкаем слайды

Удобно ли это?
Нету типобезопасности. Сериализацию вложенные объектов пишем сами

Работать с объектами можно при помощи useUrlState из ahooks: https://ahooks.js.org/hooks/use-url-state
-->

---

# @tanstack/react-router - наконец-то

<!-- - typesafety
- первоклассная поддержка search params 
- можно хранить сложные объекты
- можно использовать селекторы для параметров -->


<<< @/snippets/router.tsx#snippet

<!--
tanstack react router является router-ом нового поколения и заслуживает отдельного доклада

По сути это стейтменеджер для searchParams

typesafety:

- корректная навигация
- searchParams теперь строго типизированы через валидацию 
- json сериализация из коробки (сложные структуры)
- можно использовать селекторы для парамсов
-->

---

# Ограничения searchParams

- длина url
- нельзя хранить приватные данные

<!--
У searchParams есть ряд ограничений

- есть ограничение на длину адреса сайта. 60к, 100к. 
- пессимистично 2000
-  lz-string 
- приватные данные нельзя хранить (как и нигде)
-->

---

# localStorage и sessionStorage

````md magic-move
```tsx{*|5|6-10}
import React from 'react';
import { useLocalStorage } from '@rehooks/local-storage';

function MyComponent() {
  const [user] = useLocalStorage('user', { name: 'Anakin Skywalker' });
  return (
    <div>
      <h1>{user.name}</h1>
    </div>
  );
}
```
```tsx
import React from 'react';
import { useLocalStorage } from '@rehooks/local-storage';

function MyComponent() {
  const [user, setUser] = useLocalStorage('user', { name: 'Anakin Skywalker' });
  return (
    <div>
      <input value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} />
    </div>
  );
}
```
```tsx
import React from 'react';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';

function MyComponent() {
  const [user] = useLocalStorage('user', { name: 'Anakin Skywalker' });
  return (
    <div>
      <input value={user.name} onChange={e => writeStorage('user', { ...user, name: e.target.value })} />
    </div>
  );
}
```
````

<!--
Шерим стейт между компонентами и вкладками

@rehooks/local-storage 
маленький вес, хороший api

[Смотрим слайды]

если будет нужно - можно скопировать весь код библиотеки и заточить под свои нужды

Аналоги в других либах

Стоит обращаться внимание на реализацию
ньансы (вкладки и компоненты)
Например в uidotdev/hooks (парсим json каждый рендер)

Будет работать максимально хорошо плоских данных. 
Но вообще можно зафайнтюнить и добавить селекторы
-->

---

# Task oriented стейтменеджеры

Решения шалонных задач:
- кэши для запросов ([`@tanstack/react-query`](https://tanstack.com/query/v5), [`swr`](https://swr.vercel.app/))
- стейтменеджеры для форм ([`react-hook-form`](https://react-hook-form.com/))
- универсальный стейтменеджер ([`nanostores`](https://github.com/nanostores/nanostores))
- стейтменеджеры для анимаций (framer-motion, react-spring)
- performance first стейтменеджеры (preact-signals, legend-state)

<!--
Если мы делаем client side приложение, то скорее всего у нас есть более сложные задачи, чем забиндить поля в инпуты

- работа с асинхронщиной 
- сложные формы и валидация
- шеринг логики с другими фреймворками (микрофронты)
- иногда нам надо реализовать анимации
- оптимизация рендеров React -а
-->

---

# Кэш менеджеры

````md magic-move
```ts
import { useQuery } from '@tanstack/react-query'

const Todos = () => {
	const { data, isLoading } = useQuery({
		queryFn: () => fetchTodos(),
		queryKey: ['todos']
	})
  // ...
}
```
```ts
import { useQuery } from '@tanstack/react-query'

const todosOptions = queryOptions({
	queryFn: () => fetchTodos(),
	queryKey: ['todos']
})

const Todos = () => {
	const {data, isLoading} = useQuery(todosOptions)
	// ...
}
```
```ts{*|17}
import { useQuery } from '@tanstack/react-query'

const todosOptions = queryOptions({
	queryFn: () => fetchTodos(),
	queryKey: ['todos']
})

const Todos = () => {
	const {data, isLoading} = useQuery(todosOptions)
	// ...
}

const TodosCounter = () => {
	const {data, isLoading} = useQuery({
		...todosOptions,
		// subscribing only to part of state
		select: todosData => todosData.count
	})
	// ...
}
```
````

<!--
В наших приложениях мы часто совершаем асинхронные действия. Хорошие биндинги в реакт - не просто написать

Если мы грузим данные 1 раз и они никогда не изменятся - не нужны кэшмедеджеры. 

Мы можем их зашарить в контексте по приложению

Инвалидация, прерывание и повторение запросов - кэшменеджеры

Чем больше приложение, тем больше гибкости в этом вопросе нам необходимо:
Для маленьких приложений подойдёт swr - он довольно компактный, но не ультра гибкий

Расширяемость = @tanstack/react-query

[Смотрим слайды]

Внимательно изучите отличия query от mutations => больше пользы

Особенно если у вас REST . 
3 буква - это State. 
99.9 - вам хватит кэш менеджера  

Фабрика ключей сделайм вашу жизнь лучше
-->

---

# Формменеджеры

```tsx
import { useForm, SubmitHandler } from "react-hook-form"

interface IFormInput {
  firstName: string
  lastName: string
}

export default function App() {
  const { register, handleSubmit } = useForm<IFormInput>()
  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>First Name</label>
      <input {...register("firstName")} />
      <label>Last name</label>
      <input {...register("lastName")} />

      <input type="submit" />
    </form>
  )
}
```

<!--
Формы выросли => сложно читаются и медленно работают

Не надо использовать обычный стейтменеджер

`react-hook-form`

- производительный биндинг инпутов (Controller и register)
- решает вопросы валидации. (zod и ajv)
-->

---

## Универстальный стейтменеджер (nanostores)

- маленький размер
- простой API

````md magic-move
```tsx
import { atom } from 'nanostores'

export const $users = atom<User[]>([])

export function addUser(user: User) {
  $users.set([...$users.get(), user]);
}
```
```tsx
import { atom, computed } from 'nanostores'

export const $users = atom<User[]>([])

export function addUser(user: User) {
  $users.set([...$users.get(), user]);
}

const admins = computed($users, users => users.filter(user => user.role === 'admin'))
```
```tsx
import { atom, computed } from 'nanostores'
import { useStore } from '@nanostores/react'

export const $users = atom<User[]>([])

export function addUser(user: User) {
  $users.set([...$users.get(), user]);
}

const admins = computed($users, users => users.filter(user => user.role === 'admin'))

export const Admins = () => {
  const admins = useStore($admins)
  return (
    <ul>
      {admins.map(user => <UserItem user={user} />)}
    </ul>
  )
}
```
````

<!--
Шарим логику между проектами
Работает везде

Обратите внимение на nanostores

Андерея Ситник оптимизирован под размер. 
Это ведёт к ряду преимуществ и недостатков:

- 2k, tree shakable
- API минимален, но выразителен. 
- nanostores лучше чем большие библиотеки, чем jotai или recoil

[Смотрим слайды]

Утилиты:
- аналог tanstack query, router, i18n 
- Плюс: работает везде
- Минус: меньше фич и хуже тулинг
-->

---

# Performance first statemanagement (preact-signals)


````md magic-move
```tsx
import { signal } from '@preact/signals'

const applesPrice = signal(0.69)
const applesQuantity = signal(4)
```
```tsx
import { signal, computed } from '@preact/signals'

const applesPrice = signal(0.69)
const applesQuantity = signal(4)

const applesTotal = computed(() => applesPrice.value * applesQuantity.value)
```
```tsx
import { signal, computed } from '@preact/signals'

const applesPrice = signal(0.69)
const applesQuantity = signal(4)

const applesTotal = computed(() => applesPrice.value * applesQuantity.value)

// inflation
setInterval(() => {
  applesPrice.value = applesPrice.value * 1.01
}, 2_000)
```
```tsx
import { signal, computed } from '@preact/signals'

const applesPrice = signal(0.69)
const applesQuantity = signal(4)

const applesTotal = computed(() => applesPrice.value * applesQuantity.value)

// inflation
setInterval(() => {
  applesPrice.value = applesPrice.value * 1.01
}, 2_000)

export const ApplesTotal = () => <p>Total: {applesTotal.value}</p>
```
````

<!--
Зачем?
Если хотим иметь гранулярный контроль над ререндерами

Изячщный стейтменджер => preact-signals
[смотрим пару слайдов]
Красивая интеграция в react  => досматриваем слайды

Сделано с фокусом на производительность

Маленькая система реактивности, которая [весит]2.4 kB 

Ограничение:
- по дефолту работаем по ссылкам. если хотите работать с объектами можно воспользовать моей либой 
- для удобной интеграции с react нужен build step, скорее всего он у вас уже есть
-->

---
layout: two-cols-header
layoutClass: 'grid-rows-[auto_1fr]!'
---

# Избегаем старьё

::left::

## Redux

::right::

## Mobx

````md magic-move
```ts
import { makeObservable, observable, action } from "mobx"

class Doubler {
    value = 0

    constructor() {
        makeObservable(this, {
            value: observable,
            increment: action
        })
    }

    increment() {
        // Intermediate states will 
        // not become visible to observers.
        this.value++
        this.value++
    }
}
```
```ts
import { makeAutoObservable } from "mobx"

class Doubler {
    value = 0

    constructor() {
        makeAutoObservable(this)
    }

    increment() {
        this.value++
        this.value++
    }
}
```
```ts
import { observable, action } from "mobx"

class Doubler {
    @observable value = 0

    @action
    increment() {
        this.value++
        this.value++
    }
}
```
```ts
import { observable, runInAction } from "mobx"

const state = observable({ value: 0 })

runInAction(() => {
    state.value++
    state.value++
})
```
````

<!-- 
Не берём старьё

редакс - нет спасибо. Решение минувшей эпохи.
Описывать всё в редьюсерах вербозно. Сложно по типам. Неоптимально по производительности.
Большой стор + перевычисление селекторов = медленное приложение

Redux -> Zustand | Toolkit

мобх 
Первая мейнстримная реализация реактивного стейтменеджмента для реакт. На момент 2016 была прорывная. Это стало возможным благодаря появлению Proxy объектов в ES6, но на текущий момент библиотека кажется устаревшей. Вес в 17 кб
10 равноправных вариаций синтаксиса для создания стейта
[[смотрим слайдики]]
Зачем так сложно - не понятно. Есть ещё вариант на декораторах, на legacy decorators, но для 4-ой версии mobx
 -->

---
class: 'text-center'
---

## Болячки mobx

![alt text](/image-2.png){class="max-h-full mx-auto w-1/2 object-scale-down"}


<!-- 
На сайте указан миллион ограничений библиотеки. Большая часть из которых связана с тем, что фактом использования классов и прототипным наследованием и миллионом синтаксисов. Вероятно это было плохое design решение


1. Компоненты теряют displayName
2. Можно забыть обернуть компонент в observer и он не будет обновляться. Если у вас довольно большое приложение - есть шансы это не заметить совсем
3. Всё надо оборачивать в observer
-->

---

# Толстые клиенты

- фото и видео редакторы
- карты
- соц сети
- бэкофисы со сложной функциональностью
- крупные PWA
- web3 приложухи

<!-- 
Если в рамках приложения есть сложный процесс - то вероятно вам понадобиться какой-то инструмент для его описания
Тут выбор будет зависеть от ваших вкусов
Если мы делаем сайт, то нам желательно, чтобы набор таких характеристик соотношения веса библиотеки и её возможностей был достаточен. 
Дополнительно мы должны минимизировать сложность

Порой оптимальным в проект затянуть пару дешёвых стейтменеджеров которые хорошо решают конкретную задачу
-->

---

## Кому брать effector

```ts
const birthdayHappend = createEvent()
const $age = createStore(0).on(birthdayHappend, (curAge) => curAge + 1)
const hp = createStore(100)
	.on(birthdayHappend, (curHp) => curHp - 1)

birthdayHappend.watch(() => {
  console.log('new birthday')
})
$age.watch(newAge => {
  console.log('age changed', newAge)
})
```

<!-- 
Начнём с Effector

Сжатый effector весит 20 кбайт
Концептуально - это rxjs для стейтменеджмента. Все же помнят как просто работать с rxjs - давайте писать логику в похожем стиле
[смотрим слайд]
На меленьких примерах выглядит симпатично, как и что угодно. Других примеров никто не предоставляет

Хороший выбор для команды сеньёров которым скучно на проекте
https://bundlejs.com/?q=effector-react@23.2.1,effector@23.2.2
-->

---

## Кому брать Zustand

```ts
import { create } from 'zustand'

const useBearStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}))
```

<!-- 
Zustand - это антипод Effector. Effector сложный - Zustand максимально простой, Effector большой - zustand весит 1.2 кБайта. 

Если вам нравится FLUX, то вам придётся по вкусу и минималистичный Zustand. Получаем get и set методы в конструкторе стора и работаем. 

Секрет простоты: Store представляет pub sub, который биндится в react при помощи use-sync-external-store/with-selector

Почему во многих кейсах это лучше чем редакс?

- Маленький - 1.2 кБ. В 11 раз меньше редакс тулкит https://bundlephobia.com/package/zustand@4.5.2
- более производительный. За счёт того, что мы может создавать маленькие сторы - когда обновился один стор пересчитаются только его селекторы, а не селекторы всех сторов
- Нужен редьюсер - получите редьюсер
- хотите асcихронные действия - делайте асинхронные действия
- можно использовать с redux dev tools
- Дополнительные фичи вынесены в отдельные импорты поэтому вы за них не платите
  - Нужен иммер - получите immer
-->
---

## Кому брать Valtio

```tsx{*|3|5-7|11|10-18|*}
import { proxy, useSnapshot } from 'valtio'

const state = proxy({ count: 0, text: 'hello' })

setInterval(() => {
  ++state.count
}, 1000)

// This will re-render on `state.count` change but not on `state.text` change
function Counter() {
  const snap = useSnapshot(state)
  return (
    <div>
      {snap.count}
      <button onClick={() => ++state.count}>+1</button>
    </div>
  )
}
```

<!-- Valtio - простая система реактивности на прокси объектах. Довольно маленькая библиотека с tree shaking-ом

Стоит отметить, что мутабельный стейт не лучшим образом подходит для глобального стейта. Если вынести его во вне компонента, то по ходу роста проекта будет сложно найти все места где кто-то как-то его меняет
Мутабельный стейт классно подходит для локального состояния так как оно будет просто меньше

Limitations: 
по дефолту set и map не проксируются для этого надо создать при помощи специального конструктора
система реактивности довольно урезанная, можно работать только с объектами, нету effect-ов
если использовать большую часть функциональности - то затянем js-а вплодь до 10 кБ
 -->
 
---

## Кому брать jotai (recoil, reatom)

````md magic-move
```tsx{*|3|6|7-13|*}
import { atom, useAtom } from 'jotai'

const countAtom = atom(0)

function Counter() {
  const [count, setCount] = useAtom(countAtom)
  return (
    <div>
      {count}
      <button onClick={() => setCount((c) => c + 1)}>one up</button>
      {/* ... */}
    </div>
  )
}
```
```tsx
import { atom, useAtom } from 'jotai'

const countAtom = atom(0)
const doubledCountAtom = atom((get) => get(countAtom) * 2)

function Counter() {
  const [count, setCount] = useAtom(countAtom)
  const [doubledCount] = useAtom(doubledCountAtom)
  return (
    <div>
      {count}
      <br />
      {doubledCount}
      <button onClick={() => setCount((c) => c + 1)}>one up</button>
      {/* ... */}
    </div>
  )
}
```
````

<!-- 
Постоенные на концепции атомов стейтменеджеры. 
Синтаксис очень похож на сигналы, но для того, чтобы подписаться на атом нужно его прочитать при помощи специальной функции. Довольно честный подход, но вербозный

Jotai и recoil похожи друг на друга. Reatom же от них довольно сильно отличается. Забавная зверюшка, 
если посмотреть, то у них есть примерно всё свое, даже собственный фреймворк, есть роутинг, формы, свои jsx шаблоны. Меня пугает такой scope проекта

Поговорим про что-то более мейнстримное: Jotai и Recoil
[[смотрим слайд]]
стейт менеджмеры со спрятанным стором
Выглядит довольно симпатично - похоже на сигналы. Но есть ньюанс - atom - ы контекстно зависимые. Можно использовать передавать стор через контекст. Но тогда в разных react render-ах значения countAtom-а будет разным. Atom - это вообще не состояние, а его конструктор
Ищем стор для изменения значения атома
Зачем так было делать? Я не знаю. Не понимаю кому нужна такая фича. С учатом того, что рядом существуют ещё и конструкторы атомов
Но у jotai есть несколько преимуществ - он довольно популярный и для него есть много тулинга
 -->

---

## Закат Recoil

<div class='w-1/2'>
<img alt="alt text" src="/image-3.png" class="max-w-full object-scale-down" />
<img alt="alt text" src="/image-4.png" class="max-w-full object-scale-down" />
</div>

<!-- ```tsx{v-click class="w-1/2 absolute top-0 right-0"} -->
```tsx{v-click}
function currentRendererSupportsUseSyncExternalStore(): boolean {
  // $FlowFixMe[incompatible-use]
  const {ReactCurrentDispatcher, ReactCurrentOwner} =
    /* $FlowFixMe[prop-missing] This workaround was approved as a safer mechanism
     * to detect if the current renderer supports useSyncExternalStore()
     * https://fb.workplace.com/groups/reactjs/posts/9558682330846963/ */
    React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
```

![alt text](/image-5.png){v-click}




<!-- Recoil - это Jotai написанный инженерами Facebook, соотвественно jotai почти в 10 раз меньше 

API менее удобен. А ещё ребята использовали SECRET_INTERNALS реакта. Написали комментарий-извинение, но похоже не помогло - последний коммит в репозиторий был 8 месяцев назад -->


---

# Архитертура это стейтменеджмент а не стейтменеджер

<!-- 
Если наши задачи стейтменеджмента обязательно требуют стейтменеджер - давайте его заиспользуем

Но если стейта у нас немного, то задачи можно решать более просто
 -->

---

# Хендлы
