import { ProductItem, category } from '../types';
import { View } from './base/view';
import { ensureElement } from '../utils/utils';


interface CardItem extends ProductItem {
	button?: string;
}

interface CardClickEvents {
	onClick: (event: MouseEvent) => void;
}

export class Card extends View<CardItem> {
	protected _description?: HTMLElement;
	protected _image: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;
	constructor(protected blockName: string, container: HTMLElement, actions?: CardClickEvents) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
		this._button = container.querySelector(`.${blockName}__button`);
		this._description = container.querySelector(`.${blockName}__text`);
		this._category = ensureElement<HTMLImageElement>(`.${blockName}__category`, container);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);

		if (this._button) {
			this._button.addEventListener('click', actions.onClick);
		} else {
			container.addEventListener('click', actions.onClick);
		}
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.classList.add('card__category' + category[value]);
	}

	set Button(state: boolean) {
		if (state) {
			this.setText(this._button, 'Убрать');
		} else {
			this.setText(this._button, 'В корзину');
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		if (value == null) {
			this.setText(this._price, 'Неизвстно');
			if (this._button) {
				this._button.setAttribute('disabled', '');
			}
		} else {
			this.setText(this._price, value + ' синапсов');
		}
	}
}
