import { Model } from './base/Model';
import {
	FormErrors,
	IAppState,
	IBasketItem,
	IOrderForm,
	IOrder,
	ILotItem,
} from '../types/index';
// import { faIR } from "date-fns/locale";

export type CatalogChangeEvent = {
	catalog: LotItem[];
};

export class LotItem extends Model<ILotItem> {
	description: string;
	id: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export class AppState extends Model<IAppState> {
	basket: IBasketItem[] = [];
	catalog: ILotItem[];
	order: IOrder = {
		email: '',
		phone: '',
		payment: '',
		total: 0,
		address: '',
		items: [],
	};
	preview: string | null;
	formErrors: FormErrors = {};

	addItemToBasket(item: LotItem): void {
		this.basket.push(item);
		this.emitChanges('basketInfo:changed');
	}

	removeItemFromBasket(item: LotItem): void {
		const newBasket = this.basket.filter(
			(basketItem) => basketItem.id !== item.id
		);
		this.basket = newBasket;
		this.emitChanges('basketInfo:changed');
	}

	count() {
		return this.basket.length;
	}

	clearBasket(): void {
		this.basket.splice(0, this.basket.length);
		this.emitChanges('basketInfo:changed');
	}

	getTotal() {
		return this.basket.reduce((a, c) => a + c.price, 0);
	}

	setCatalog(items: ILotItem[]) {
		this.catalog = items.map((item) => new LotItem(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	itemExists(item: IBasketItem): boolean {
		return this.basket.some((basketItem) => basketItem === item);
	}

	setPreview(item: LotItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	confirmBasketItem(){
		this.basket.forEach((item) => {
			if (!this.order.items.includes(item.id)) {
			  this.order.items.push(item.id);
			}
		  });
    }

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	setContactField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateContact()) {
			this.events.emit('order:ready', this.order);
		}
	}
	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Введите адресс';
		}
		if (!this.order.payment) {
			errors.payment = 'Выберите способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContact() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
