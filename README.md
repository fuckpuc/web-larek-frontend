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
- src/styles/styles.scss — корневой файл стилей
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
```
export interface ILotItem {
    id: string;
    title: string;
    description?: string;
    image: string;
    price: number;
    category: string;
}
```

#### IBasketItem
Тип `IBasketItem` представляет собой данные о товаре, хранимые в корзине покупок. Он включает только часть информации о товаре: идентификатор (`id`), название (`title`) и цену (`price`)
```
export type IBasketItem = Pick<ILotItem, 'id' | 'title' | 'price'> & {
    isMyBid: boolean
};
```


#### IAppState
Интерфейс `IAppState` описывает состояние приложения. Включает в себя каталог товаров (`catalog`), содержимое корзины (`basket`), превью выбранного товара (`preview`) и информацию о заказе (`order`).
```
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
```
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
```
export type FormErrors = Partial<Record<keyof IOrder, string>>;
```

#### IOrderResult
Интерфейс `IOrderResult` описывает результат заказа, включая уникальный идентификатор (`id`) полученного заказа.
```
export interface IOrderResult {
    id: string;
}
```
#### ICardAPI
Интерфейс `ICardAPI` представляет собой набор методов для взаимодействия с API приложения. Включает методы для получения списка товаров (`getLotList`), получения информации о конкретном товаре (`getLotItem`) и оформления заказа (`orderLots`).
```
export interface ICardAPI {
    getLotList: () => Promise<ILotItem[]>;
    getLotItem: (id: string) => Promise<ILotItem>;
    orderLots: (order: IOrder) => Promise<IOrderResult>;
}
```