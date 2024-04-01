import { Model } from './base/models';
import {
	ProductItem,
	Purchase,
	FormErrors,
	AppData,
	PaymentType,
	BasketProduct,
} from '../types/index';

export type CatalogChangeEvent = {
	catalog: LotItem[];
};

export class LotItem extends Model<ProductItem> {
	id: string;
	title: string;
	category: string;
	price: number | null;
	description?: string;
	image: string;
	Button: boolean;
}

export class AppState extends Model<AppData> {
	basket: BasketProduct[] = [];
	catalog: ProductItem[] = [];
	order: Purchase = {
		email: '',
		phone: '',
		address: '',
		items: [],
		total: 0,
		payment: 'card',
	};
	preview: string;
	formErrors: FormErrors = {};

	addLot(lot: BasketProduct): void {
		this.basket.push(lot);
		this.emitChanges('basketContent:changed');
	}

	removeLot(id: string): void {
		this.basket = this.basket.filter((lot) => lot.id !== id);
		this.emitChanges('basketContent:changed');
	}

	clearOrder(): void {
		this.order = {
			email: '',
			phone: '',
			address: '',
			items: [],
			total: 0,
			payment: 'card',
		};
	}

	setCatalog(items: LotItem[]): void {
		this.catalog = items.map((item) => new LotItem(item, this.events));
		this.emitChanges('lots:show', { catalog: this.catalog });
	}

	setBasket(): BasketProduct[] {
		return this.basket;
	}

	setPayField(value: PaymentType): void {
		console.log(value);
		this.order.payment = value;
		this.checkDeliveryValidation();
	}

	checkBasket(item: BasketProduct): boolean {
		return this.basket.includes(item);
	}

	setOrder(): void {
		this.order.total = this.getTotal();
		this.order.items = this.setBasket().map((item) => item.id);
	}

	setAddressField(value: string): void {
		this.order.address = value;
		this.checkDeliveryValidation();
	}

	setOrderFormField(
		field: keyof Pick<Purchase, 'email' | 'phone'>,
		value: string
	): void {
		this.order[field] = value;
		if (this.validateContactsForm()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateContactsForm(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо заполнить email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо заполнить телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactsErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	checkDeliveryValidation(): void {
		if (this.validateDeliveryForm()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateDeliveryForm(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Выберите метод оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('deliveryErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	clearBasket(): void {
		this.basket.length = 0;
		console.log('clearBasket: ' + this.basket);
		this.emitChanges('basketContent:changed');
	}

	getTotal(): number {
		return this.basket.reduce((total, amount) => {
			return total + amount.price;
		}, 0);
	}
}
