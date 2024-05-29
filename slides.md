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
Всем привет я Валера
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

<h3 v-click>Сложность проекта = <br />сложность задачи + сложность способа её решения</h3>

<!--
Чтобы ответить вопрос надо понимать сложность проекта

[[click]]

## читаем

на сложность можно повлять через разговор с бизнесом (1 из 100)

на сложность способа решения - на наших плечах
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
Странно решать простые задачи большими инструментами, как простыми сложные

Мы можем разбить наши приложения на:

- static generated
- тонкие клиенты (мин логика)
- толстые клиенты (много логики: редакторы, банковские приложения, web3)


когда статический контент (лендинги, документации, бложики) = не React

а Astro, либо 11ty

Astro - крута. 

0 js by default

View Transitions

динамические части сайта можно писать на любом фронтенд фреймворке.

стейтменеджмер не актуален

Сегодня будем говорить про приложения над линией реакта
и о том каким из них нужен стейтменеджер и нужен ли вообще

- начнём с управления состоянием в тонких клиентах
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
Что даёт реакт

`useState`: подходит для биндинга данных в инпуты, реализации несложной client side логики

[[смотрим слайды]]

расширение =>
много useState-ов + много мест изменения = спагетти

Грусть работяг

Нам может захотеться использовать redux, 
хотя наши данные не явяляются глобальными и здесь хватит `useReducer`-а

отсрачиваем добавление стейт менеджера

[[смотрим слайд]]
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
Ещё у нас есть контекст, но не попадитесь в ловушку - эта штука не для стейтменеджмента

Почему?
Работа контекста:

Ссылочное сравнение

Хорошо для примитивных, либо неизменяемых данных

changed 1 prop => new ref

Ненужные ререндеры

Не поддерживает селекторы => разделяем на несколько = костыль
10 поляей = 10 контекстов
Есть пропосал https://github.com/reactjs/rfcs/pull/119

контекст для DI (тесты)

контекст чтобы не пропдриллить

можно делать сложные компоненты 

люблю композировать компоненты

без бесконечного добавления лишних пропросв

вложеннные компоненты знают о состоянии родителя 

Проверка гипотез  

delay add statemanager
-->

---

# Чем нам может помочь браузер

- searchParams 
- localStorage 
- sessionStorage

![alt text](/image-7.png){class="max-h-[calc(360px)] object-contain my-4 mx-auto"}

<!--
Как вынести данные за пределы жизненного цикла компонента?

Используем браузерные api

searchParams ...
-->

---

# Search params

- next
- react-router-dom
- @tanstack/react-router

<!--
Механизм searchParams неоправданно редко используется фронтенд разработчиками, хотя

- полезно на сервер сайде - там как у нас нет доступа к бразузерным api
- пользователь сможет расшарить урл, продублировать вкладку, обновить страницу
- пользователь сможет сохранить закладку на страницу в удобном для него состоянии
- Когда нам репортят баг - вы сможете открыть ссылку и увидеть страницу в том же состоянии



searchParams => router-ы. 

роутер дома
вам придётся с ним жить(

То насколько приятно с ними будет работать будет зависеть непосредственно от него

От худшего к лучшему
-->

---

## Next.js - сериализуй меня полностью

```tsx{|4|6-13|17-19|20-22|}
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
В next js можно получить searchParams при помощи хука

[[слайд]]

[[слайд]] но для того, чтобы обновить их - надо сделать переход по ссылке и сериализовать параметры

[[слайд]] 

Удобной работы с вложенными объектами из коробки нету
Разработчики next-а вероятно не считают searchParams важными

можно накостылить = useState для searchParams
-->

---

## React-router-dom - ну хоть что-то

```tsx{*|5|7-11|16-21|} twoslash
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

<!-- [useUrlState](https://ahooks.js.org/hooks/use-url-state){v-click class="block mt-4"} -->

<!--
react router dom чуть менее больно, но можно сильно лучше

searchParams = useState,

[слайд]

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
Возможно кто сделал нормально?

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
Какие минусы?

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
Как пошарить стейт между компонентами и вкладками? 
localStorage, sessionStorage

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
- стейтменеджеры для анимаций ([framer-motion](https://www.framer.com/motion/), [react-spring](https://www.react-spring.dev/))
- performance first стейтменеджеры ([preact-signals](https://github.com/preactjs/signals), [legend-state](https://github.com/LegendApp/legend-state))
- универсальный стейтменеджер ([`nanostores`](https://github.com/nanostores/nanostores))

<!--
Если мы делаем client side приложение, то скорее всего у нас есть более сложные задачи, чем забиндить поля в инпуты.

Многие привычные библиотеки являются стейтменеджерами, но они решают конкретные задачи

- работа с асинхронщиной 
- сложные формы и валидация
- иногда нам надо реализовать анимации
- оптимизация рендеров React -а
- шеринг логики с другими фреймворками (микрофронты)
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
import { useQuery, queryOptions } from '@tanstack/react-query'

const todosOptions = queryOptions({
	queryFn: () => fetchTodos(),
	queryKey: ['todos']
})

const Todos = () => {
	const {data, isLoading} = useQuery(todosOptions)
	// ...
}
```
```ts{*|17|*}
import { useQuery, queryOptions } from '@tanstack/react-query'

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
Большинство приложений работают с асинхронщиной

Хорошие биндинги в реакт - не просто написать

грузим данные 1 раз & статичны - не нужны кэшмедеджеры. 

Мы можем их зашарить в контексте по приложению

Инвалидация, прерывание и повторение запросов - кэшменеджеры

$> приложение =>  гибкости required$

маленьких приложений swr (компактный, не гибкий)

Расширяемость = @tanstack/react-query

[Смотрим слайды]

Внимательно изучите отличия query от mutations => больше пользы

Особенно если у вас REST . 
3 буква - это State. 
99.9 - вам хватит кэш менеджера  

Фабрика ключей сделайм вашу жизнь лучше
-->

---

## Стейтменеджеры для анимаций

```tsx{*|5|6|9-13|*}
import { useMotionValue, useTransform } from "framer-motion"
import { motion } from "framer-motion-3d"

export function Box() {
  const x = useMotionValue(0)
  const scaleZ = useTransform(x, v => v / 100)
  
  return (
    <motion.mesh
      position-x={x}
      scale={[1, 1, scaleZ]}
      animate={{ x: 100 }} 
    />
  )
}
```

<!-- 

Когда мы хотим делать сложные анимации с интерактивностью - нам может понадобиться особый стейтменеджер

framer-motion - стейтменеджер для анимаций

Можно удивиться, но это стейтменеджер

[[смотрим слайды]]

Работает на requestAnimationFrame

Ограничение:

- можно использовать, как стейтменеджер, но неприятно

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
Наши приложения растут, формы тоже растут, с ростом они сложно читаются и медленно работают

Не надо использовать обычный стейтменеджер

`react-hook-form`

- производительный биндинг инпутов (Controller и register)
- решает вопросы валидации. (zod и ajv)
-->

---

# Performance first statemanagement (preact-signals)


````md magic-move
```tsx
import { signal } from '@preact/signals-react'

const applesPrice = signal(0.69)
const applesQuantity = signal(4)
```
```tsx
import { signal, computed } from '@preact/signals-react'

const applesPrice = signal(0.69)
const applesQuantity = signal(4)

const applesTotal = computed(() => applesPrice.value * applesQuantity.value)
```
```tsx
import { signal, computed } from '@preact/signals-react'

const applesPrice = signal(0.69)
const applesQuantity = signal(4)

const applesTotal = computed(() => applesPrice.value * applesQuantity.value)

// inflation
setInterval(() => {
  applesPrice.value = applesPrice.value * 1.01
}, 2_000)
```
```tsx
import { signal, computed } from '@preact/signals-react'

const applesPrice = signal(0.69)
const applesQuantity = signal(4)

const applesTotal = computed(() => applesPrice.value * applesQuantity.value)

// inflation
setInterval(() => {
  applesPrice.value = applesPrice.value * 1.01
}, 2_000)

export const ApplesTotal = () => <p>Total: {applesTotal.value}</p>
```
```tsx
import { signal, computed } from '@preact/signals-react'

const applesPrice = signal(0.69)
const applesQuantity = signal(4)

const applesTotal = computed(() => applesPrice.value * applesQuantity.value)

// inflation
setInterval(() => {
  applesPrice.value = applesPrice.value * 1.01
}, 2_000)

export const ApplesTotal = () => <p>Total: {applesTotal}</p>
```
````

[Работа с глубокими структурами](https://github.com/XantreDev/preact-signals){v-click}

<!--
Если мы хотим иметь контроль за ререндерами в рамках локального стейта

Изячщный стейтменджер => preact-signals
[смотрим пару слайдов]
Красивая интеграция в react  => досматриваем слайды

Сделано с фокусом на производительность

Маленькая система реактивности - 2.4 kB 

Ограничение:
- [смотреть слайд] по дефолту работаем по ссылкам. если хотите работать с объектами можно воспользовать моей либой 

- для удобной интеграции с react нужен build step, скорее всего он у вас уже есть
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
Иногда нам нужно пошарить логику между проектами, и фреймворками

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


# Толстые клиенты

- фото и видео редакторы
- карты
- соц сети
- бэкофисы со сложной функциональностью
- крупные PWA
- web3 приложухи

<!--
Если в нашем приложении есть какой-то сложный процесс, который у нас никак не получается описать без стейтменеджера, 
нужно подумать 10 раз и в крайнем случае добавить его

Тут выбор будет зависеть от ваших вкусов

Секты

я в секте реактивщины

Важен баланс между размером, выразительность, сложность инструмента, тулинг

если хотим мы можем использовать и пару дешёвых стейтменеджеров
-->

---
layout: two-cols-header
layoutClass: 'grid-rows-[auto_1fr]! gap-4'
---

# Избегаем старьё

::left::

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

::div{v-click="5"}
  ```tsx
  import { observer } from "mobx-react-lite"

  const DoublerView = observer(() => (
    <span>
      Seconds passed: {state.value}
    </span>
  ))
  ```
::

::right::

![alt text](/image-2.png){class="max-h-full scale-91 mt--14 object-scale-down" v-click}

<!--
Что же нам брать точно не стоит?

Старье!

- редакс - нет спасибо. 

- Редьюсерах вербозные. 

- Сложно по типам. 

- Плохой перформанс (селекторы).

Redux -> Zustand | Toolkit

Zustand -  учёба на ошибка

Toolkit - костыли над редаксом

mobx

- инноватор: реактивного стейтменеджмента.
- 2016, proxy из es6
- сейчас устарел
- Вес в 17 кб
- 10 равноправных вариаций синтаксиса для создания стейта
[[смотрим слайдики]]
Зачем так сложно - не понятно. Есть ещё вариант на декораторах, на legacy decorators, но для 4-ой версии mobx

[[смотрим слайд]]
На сайте указан миллион ограничений библиотеки. 

Проблемы из-за использования классов (прототипы, приватные поля)

Вероятно это было плохое design решение

Реакт интеграция:

- Всё надо оборачивать в observer
- Компоненты теряют displayName
- Можно забыть обернуть компонент в observer и он не будет обновляться. Если у вас довольно большое приложение - есть шансы это не заметить совсем
-->

---

## Кому брать effector

::div{v-click}
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
::

<!--
А что же у новичков? Начнём с Effector

Сжатый effector весит 20 кбайт

Rxjs для стейтменеджмента

Все же помнят как просто работать с rxjs - давайте писать логику в похожем стиле

[смотрим слайд]

На маленьких примерах выглядит симпатично, как и что угодно. 

В реальности:

Каскады event-ов

Очереди

Так можно описывать логику, но будет сложно

В чем преимущество данного решения - не понятно

Значит эффектор подойдёт команде сеньёров, которые хотят реализовывать простые задачи в сложным стиле

https://bundlejs.com/?q=effector-react@23.2.1,effector@23.2.2
-->

---

## Кому брать Zustand

````md magic-move
```tsx{*|3|5-6|9-11|14|*}
import { create } from 'zustand'

const useBearStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}))

setInterval(() => {
  useBearStore.getState().increasePopulation()
}, 1000)

const BearCounter = () => {
  const bears = useBearStore((state) => state.bears)
  return <h1>{bears} around here ...</h1>
}
```
```tsx
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

const useBearStore = create(immer((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => { state.bears++ }),
  removeAllBears: () => set({ bears: 0 }),
}))

setInterval(() => {
  useBearStore.getState().increasePopulation()
}, 1000)

const BearCounter = () => {
  const bears = useBearStore((state) => state.bears)
  return <h1>{bears} around here ...</h1>
}
```
```tsx
import { create } from 'zustand'

const useBearStore = create((set) => ({
  bears: 0,
  fetchBears: async () => {
    const response = await fetch('https://api.com/bears')
    const bears = await response.json()
    set({ bears })
  },
}))

setInterval(() => {
  useBearStore.getState().fetchBears()
}, 10_000)

const BearCounter = () => {
  const bears = useBearStore((state) => state.bears)
  return <h1>{bears} around here ...</h1>
}
```
````

<!--
Zustand - это антипод Effector. 
сложный - простой, 
Effector большой - zustand 1.2 кБайта. 

Если вам нравится FLUX 

[[смотрим слайд]]

Секрет простоты: Store = pub sub + use-sync-external-store/with-selector

Почему не редакс?

- размер. В 11 раз меньше редакс тулкит https://bundlephobia.com/package/zustand@4.5.2
- более производительный (маленькие сторы)
- redux dev tools
- опциональные фичи
- immer
[смотрим слайд]
- асcихронные действия - из коробки
[смотрим слайд] так делать не нужно, но всё бывает
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

<!--
Хотите глубокую реактивность?

Valtio - реактивность на прокси.
 
маленькая библиотека с tree shaking-ом


[[смотрим слайды]]

мутабельный стейт не лучшим образом подходит для глобального стейта. 

Сложно отследить все изменения

Мут. стейт локальное состояние => но не valtio

Limitations: 
- set и map не проксируются их надо создать при помощи специального конструктора
- можно работать только с объектами,
- урезано, нету effect-ов
- можно затянуть js-а вплодь до 10 кБ

Итог:
- для любителей помутировать
- не нравятся сигналы
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
Если нам нравятся создавать зависимый стейт, то вам понравится атомарный стейтменеджмент

Jotai и recoil, reactom, nanostores

Jotai и recoil похожи друг на друга (контекст)

Reatom, nanostores немного другой. 

Reatom. примерно всё свое: 
- фреймворк
- роутинг
- формы
- свои jsx шаблоны

Меня пугает такой scope

Рассмотрим мейнстрим

[[смотрим слайды]]

похоже на сигналы, но с хуками

Но atom - ы контекстно зависимые. 

В разных react render-ах и контекстах значения countAtom-а будет разным. 
Атом - это не состояние, а его конструктор

Изменить атом вне реакт = найти его стор и записать туда

Зачем так делать? Не знаю ни одного юз кейса

Довольно популярный + много тулинга

Сигналы предпочтительней

nanostores & reatom > jotai & recoil

Консервативные сигналы
-->

---

## Закат Recoil

::div{class="grid grid-cols-[2fr_3fr] gap-4"}
  :::div{class="flex flex-col gap-4"}
    <img alt="alt text" src="/image-3.png" class="max-w-full object-scale-down" />
    <img alt="alt text" src="/image-4.png" class="max-w-full object-scale-down" />
  :::

  :::div{class="flex flex-col"}
    ::::div{v-click}
    ```tsx
    function currentRendererSupportsUseSyncExternalStore(): boolean {
      // $FlowFixMe[incompatible-use]
      const {ReactCurrentDispatcher, ReactCurrentOwner} =
        /* $FlowFixMe[prop-missing] This workaround was approved 
         * as a safer mechanism to detect if the current 
         * renderer supports useSyncExternalStore()
         * https://fb.workplace.com/groups/reactjs/posts/9558682330846963/ */
        React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    ```
    ::::
    ![alt text](/image-5.png){v-click}
  :::
::

<!--
Recoil - это Jotai написанный инженерами Facebook, 

jotai почти в 10 раз меньше 

API менее удобен. 

[[показать слайд]] Ребята использовали SECRET_INTERNALS реакта. 

[[показать слайд]]
Последний коммит 8 месяцев назад


Наверное их уволили
-->

---
layout: center
class: "text-center"
---

::div{v-click}
# Архитертура это стейт**менеджмент**, <br /> а не стейт**менеджер**
::

<!--
Вводим библиотеки по мере их надобности:
- используем хуки реакта и API браузера
- для толстых клиентов либу по вкусами

И помните: 
[показать слайд]
читаем слайд
-->

---

# Спасибо за внимание

::div{class="grid grid-cols-[1fr_1fr_1fr] gap-4"}
  :::div{class="flex flex-col items-start gap-2"}
    [Telegram (javastrippt)](https://t.me/javastrippt)
    ![alt text](/tg-qr-code.svg)
  :::
  :::div{class="flex flex-col items-start gap-2"}
    [GitHub (XantreDev)](https://github.com/XantreDev)
    ![alt text](/github-qr-code.svg)
  :::
  :::div{class="flex flex-col items-start gap-2"}
    [Twitter/X (Xantre)](https://x.com/Xantre_)
    ![alt text](/twitter-qr-code.svg)
  :::
::

<!--
Спасибо

Канал

Github

Twitter

Презентация - в open source

Отвечаем на вопросы
-->
