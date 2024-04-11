import { Api } from './base/api';
import { IOrder, IOrderResult, ILotItem } from '../types';
import { ICardAPI } from '../types/index';
import { ApiListResponse } from '../types';

//базовый класс апи реализованный на основе тестового проекта
export class CardAPI extends Api implements ICardAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	//получаем единичную карточку по id
	getLotItem(id: string): Promise<ILotItem> {
		return this.get(`/product/${id}`).then((item: ILotItem) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	// так получаем список карточек
	getLotList(): Promise<ILotItem[]> {
		return this.get('/product').then((data: ApiListResponse<ILotItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	// метод для оформления заказа.
	orderLots(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
