
//интерфейс карточки
export interface ILotItem {
    id: string;
    title: string;
    description?: string | string[];
    image: string;
    price: number | null;
    category: string;
}

//данные хранениня карточки в корзине
export interface IBasketItem {
    id: string;
    title: string;
    price: number;
    index?: number;
}

// интерфейс состояния приложения
export interface IAppState {
    catalog: ILotItem[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
}

//интерфейс где данные покупателя
export interface IOrderForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

//интерфейс о данных заказа
export interface IOrder extends IOrderForm {
    total: number;
    items: string[]
}

//ошибка для всех формов
export type FormErrors = Partial<Record<keyof IOrder, string>>;

//интерфейс для конечного результата
export interface IOrderResult {
    id: string;
    total: number;
}

export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
}

//интерфейс для запроса api приложения
export interface ICardAPI {
    getLotList: () => Promise<ILotItem[]>;
    getLotItem: (id: string) => Promise<ILotItem>;
    orderLots: (order: IOrder) => Promise<IOrderResult>;
}