
//интерфейс карточки
export interface ILotItem {
    id: string;
    title: string;
    description?: string;
    image: string;
    price: number;
    category: string;
}

//данные хранениня карточки в корзине
export type IBasketItem = Pick<ILotItem, 'id' | 'title' | 'price'> & {
    isMyBid: boolean
};

// интерфейс состояния приложения
export interface IAppState {
    catalog: ILotItem[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
}

//интерфейс где данные покупателя
export interface IOrderForm {
    email: string;
    phone: string;
}

//интерфейс о данных заказа
export interface IOrder extends IOrderForm {
    items: string[]
}

//ошибка для всех формов
export type FormErrors = Partial<Record<keyof IOrder, string>>;

//интерфейс для конечного результата
export interface IOrderResult {
    id: string;
}

//интерфейс для запроса api приложения
export interface ICardAPI {
    getLotList: () => Promise<ILotItem[]>;
    getLotItem: (id: string) => Promise<ILotItem>;
    orderLots: (order: IOrder) => Promise<IOrderResult>;
}