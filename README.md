# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание проекта
### Интерфейсы и типы данных


#### ILotItem

Интерфейс `ILotItem` представляет собой данные о товаре в магазине. Каждый товар имеет уникальный идентификатор (`id`), название (`title`), описание (`description`), изображение (`image`), цену (`price`) и категорию (`category`).

```typescript
export interface ILotItem {
    id: string;
    title: string;
    description?: string;
    image: string;
    price: number | null;
    category: string;
}
```

#### IBasketItem
Тип `IBasketItem` представляет собой данные о товаре, хранимые в корзине покупок. Он включает только часть информации о товаре: идентификатор (`id`), название (`title`) и цену (`price`)

```typescript
export type IBasketItem = Pick<ILotItem, 'id' | 'title' | 'price'> & {
    isMyBid: boolean
};
```


#### IAppState
Интерфейс `IAppState` описывает состояние приложения. Включает в себя каталог товаров (`catalog`), содержимое корзины (`basket`), превью выбранного товара (`preview`) и информацию о заказе (`order`).

```typescript
export interface IAppState {
    catalog: ILotItem[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
}
```

#### IOrderForm и IOrder
Интерфейс `IOrderForm` определяет данные о покупателе, такие как электронная почта (`email`) и номер телефона (`phone`).
`IOrder` расширяет `IOrderForm`, добавляя массив идентификаторов товаров (`items`), составляющих заказ.

```typescript
export interface IOrderForm {
    email: string;
    phone: string;
}

export interface IOrder extends IOrderForm {
    items: string[];
}
```

#### FormErrors
Тип `FormErrors` представляет собой частичное соответствие между полями формы заказа и строками с сообщениями об ошибках.

```typescript
export type FormErrors = Partial<Record<keyof IOrder, string>>;
```

#### IOrderResult
Интерфейс `IOrderResult` описывает результат заказа, включая уникальный идентификатор (`id`) полученного заказа.

```typescript
export interface IOrderResult {
    id: string;
}
```
#### ICardAPI
Интерфейс `ICardAPI` представляет собой набор методов для взаимодействия с API приложения. Включает методы для получения списка товаров (`getLotList`), получения информации о конкретном товаре (`getLotItem`) и оформления заказа (`orderLots`).

```typescript
export interface ICardAPI {
    getLotList: () => Promise<ILotItem[]>;
    getLotItem: (id: string) => Promise<ILotItem>;
    orderLots: (order: IOrder) => Promise<IOrderResult>;
}
```
# Реализация
### Базовый код
#### Взаимодействие с сервером

Для общения с сервером используется класс `Api`, который предоставляет удобный интерфейс для отправки запросов. Он содержит базовый URL сервера и методы для выполнения GET и POST запросов.

### Класс Api

```typescript
class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    protected handleResponse(response: Response): Promise<object> {
        if (response.ok) return response.json();
        else return response.json()
            .then(data => Promise.reject(data.error ?? response.statusText));
    }

    get(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse);
    }

    post(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse);
    }
}
```
### Методы класса Api
* `constructor(baseUrl: string, options?: RequestInit)`: Создает новый экземпляр класса Api с указанным базовым URL и опциями запроса.

* `get(uri: string)`: Выполняет GET запрос по указанному URI и возвращает Promise с результатом запроса в формате JSON.

* `post(uri: string, data: object, method: ApiPostMethods = 'POST')`: Выполняет POST запрос по указанному URI с переданными данными и методом (по умолчанию 'POST'). Возвращает Promise с результатом запроса в формате JSON.

## Абстрактный класс Component `<T>`

Абстрактный класс `Component<T>` предоставляет инструментарий для работы с DOM в дочерних компонентах.

### Конструктор

```typescript
constructor(container: HTMLElement)
```

### Методы
1) `toggleClass(element: HTMLElement, className: string, force?: boolean)`: Переключает класс элемента.

2) `setText(element: HTMLElement, value: unknown)`: Устанавливает текстовое содержимое элемента.

3) `setDisabled(element: HTMLElement, state: boolean)`: Устанавливает или убирает атрибут disabled для элемента.

4) `setHidden(element: HTMLElement)`: Скрывает элемент.

5) `setVisible(element: HTMLElement)`: Показывает элемент.

6) `setImage(element: HTMLImageElement, src: string, alt?: string)`: Устанавливает изображение с альтернативным текстом для элемента `<img`>.

7) `render(data?: Partial<T>): HTMLElement`: Возвращает корневой DOM-элемент компонента. Может принимать данные в виде объекта `Partial<T>`, которые будут применены к компоненту.

## Абстрактный класс Model `<T>`

Абстрактный класс `Model<T>` представляет базовую модель данных событийного уведомления.

### Конструктор

```typescript
constructor(data: Partial<T>, events: IEvents)
```

### Методы
* `emitChanges(event: string, payload?: object)`: Оповещает об изменениях в модели, отправляя событие event с переданным payload.

## Класс EventEmitter

Класс `EventEmitter` реализует интерфейс `IEvents` и предоставляет функциональность для управления событиями.

### Конструктор

```typescript
constructor()
```

### Методы
* `on(eventName: EventName, callback: (event: T) => void)`: Устанавливает обработчик для указанного события.

* `off(eventName: EventName, callback: Subscriber)`: Снимает обработчик с указанного события.

* `emit(eventName: string, data?: T)`: Инициирует указанное событие с переданными данными.

* `onAll(callback: (event: EmitterEvent) => void)`: Устанавливает обработчик для всех событий.

* `offAll()`: Удаляет все обработчики событий.

* `trigger(eventName: string, context?: Partial<T>)`: Создает коллбек-триггер, который генерирует указанное событие при вызове.


## Класс CardAPI

Класс `CardAPI` расширяет класс `Api` и реализует интерфейс `ICardAPI`, предоставляя методы для взаимодействия с API приложения для работы с карточками товаров.

### Конструктор

```typescript
constructor(cdn: string, baseUrl: string, options?: RequestInit)
```
*Создает новый экземпляр класса CardAPI с указанным базовым URL сервера, настройками запроса и URL для контента CDN.*

### Свойства
* `cdn`: строка, представляющая URL для контента CDN.

### Методы
* `getLotItem(id: string): Promise<ILotItem>`: Получает информацию о карточке товара по ее идентификатору.

* `getLotList(): Promise<ILotItem[]>`: Получает список карточек товаров.

* `orderLots(order: IOrder): Promise<IOrderResult>`: Добавляет одну или несколько товаров в корзину и оформляет заказ.


# Presenter
## Обработка событий

### Событие `'items:changed'`

Это событие вызывается при изменении списка товаров. В ответ на это событие происходит обновление каталога на странице, где каждая карточка товара создается с помощью экземпляра класса `CatalogItem`. При клике на карточку товара генерируется событие `'card:select'`, которое передает информацию о выбранном товаре.

### Событие `'card:select'`

Это событие вызывается при выборе карточки товара. В ответ на это событие открывается модальное окно с подробной информацией о товаре. Если товар уже добавлен в корзину, он может быть удален с помощью события `'item.remove'`. В противном случае товар добавляется в корзину с помощью события `'item.add'`.

### События `'item.add'` и `'item.remove'`

Эти события вызываются при добавлении или удалении товара из корзины. При добавлении товара вызывается метод `addItemToBasket()` объекта `appData`, который добавляет товар в корзину. При удалении товара вызывается метод `removeItemFromBasket()` объекта `appData`, который удаляет товар из корзины.

### Прочие события

Существуют также другие события, такие как `'basketInfo:changed'`, `'bucket:open'`, `'order:open'`, `'order:submit'`, `'contacts:submit'`, `'paymentMethod:changed'`, `'formErrors:change'`, `'modal:open'` и `'modal:close'`. Они управляют различными аспектами работы приложения, такими как обновление информации о корзине, открытие модального окна для оформления заказа, управление состоянием формы и блокировка/разблокировка прокрутки страницы при открытии модального окна.