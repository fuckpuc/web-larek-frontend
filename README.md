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

## Описание
В проекте используются следующие интерфейсы и типы данных:


Товар в корзине:
```
export type BasketProduct = Pick<ProductItem, 'id' | 'title' | 'price'> & {
    index?: number;
}
```

Товар
```
export interface ProductItem {
    id: string;
    description?: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    Button: boolean;
}
```

Это корзина:
```
export interface Bucket {
   items: BasketProduct[];
   order: Purchase;
   total: number;
}
```


Данные для проложения:
```
export interface AppData {
    catalog: ProductItem[];
    basket: BasketProduct[];
    preview: string | null;
    order: Purchase | null;
}
```

Тип оплаты:
```
export type PaymentType = 'cash' | 'card';

```

Оформление заказа:
```
export interface OrderFormData {
    email: string;
    phone: string;
    address: string;
    payment: PaymentType;
    total: number;
}

export interface Purchase extends OrderFormData { 
    items: string[];
}
```

Ответ от сервера с API:
```
export type ApiResponse<Type> = {
    totalCount: number,
    items: Type[]
};
```


Категории товаров:
```
export const category: Record<string, string> =  {
    "другое": "_other",
    "дополнительное": "_additional",
    "софт-скил": "_soft",
    "хард-скил": "_hard",
    "кнопка": "_button",
}
```

## Классы
### Класс _WebLarekAPI_
WebLarekAPI реализует интерфейс LarekApi.
```
export interface LarekApi {
    getLotList: () => Promise<ProductItem[]>;
    getLotItem: (id: string) => Promise<ProductItem>;
    orderLots: (order: Purchase) => Promise<OrderInfo>;
}
```

### Класс View ```<T>```
View является абстрактным класом для представления страницы. Он содержит методы, общие для всех видов представлений.

Данные класс выполняет такие действия как:

1)  
```
toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}
```
2)
```
	setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}
```

3)
```
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
```

### Kласс _Popup_
Представляет собой модальное окно с возможностью закрыть его через кнопку в правом верхнем углу и нажатием за пределелы модального окна.

Принимает в себя конструктор
```
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }
```
Методы для открытия и закрытия попапа:

1. close() - закрыть
2. open() - открыть
3. render(data: IModalData) - для рендеринга информации в модальном окне

### Класс Contacts
Наследут интерфейс _OrderFormData_

Принимает в конструктор:

1. container:- шаблон темплейта.
2. events: IEvents - событие EventEmitter

Имеет методы:

1. set phone(value: string) - установка телефона в поле phone
2. set email(value: string) - установка почты в поле email

### Класс Success
Наследуется от класса _Popup_, реализующий успешное сообщение с возможностью автоматического закрытия через определенное количество секунд.

Реализует интерфейс success

```
interface success {
	total: number;
}
```
Принимает в себя конструктор
```
	constructor(value: number, container: HTMLElement, actions: SuccessAction) {
		const { onClick } = actions || {};
		super(container);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);

		if (onClick) {
			this._close.addEventListener('click', onClick);
			this._total.textContent = `Списано ${value} синапсов`;
		}
	}
```

### Класс Form
реализует интерфейс _ValidationData_

Имеет методы:

1. onInputChange(field: keyof T, value: string) - для отслеживания изменений в поле инпута.
2. set valid(value: boolean) - блокировка кнопки submit формы.
3. set errors(value: string) - для установки ошибок.
4. render(state: Partial ```<T>``` & IFormState) - рендеринг ошибок.

### Класс Order
Реализует интерфейс _OrderFormData_

Принимает в конструктор
1) container - шаблон темплейта
2) events - события EventEmitter

Имеет медоты:
1) setPayment(name: string) - Переключение и выбор методов оплаты
2) address(value: string) - установка адресса