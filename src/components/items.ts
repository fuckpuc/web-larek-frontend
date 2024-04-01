import { BasketProduct } from '../types';
import { View } from './base/view';
import { ensureElement } from '../utils/utils';

interface CardEvent {
	onClick: (event: MouseEvent) => void;
}

export class BasketItem extends View<BasketProduct> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _index: HTMLElement;
	protected _id: string;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: CardEvent
	) {
		super(container);
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this._button = ensureElement<HTMLButtonElement>(`.${blockName}__button`, container);
		this._button.addEventListener('click', actions.onClick);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		this.setText(this._price, value + ' синапсов');
	}

	set index(value: number) {
		this.setText(this._index, value + 1);
	}
}
