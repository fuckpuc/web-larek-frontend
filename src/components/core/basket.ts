import { EventEmitter } from '../base/events';
import { ensureElement, createElement } from '../../utils/utils';
import { View } from '../base/view';

interface BasketDisplay {
	items: HTMLElement[];
	total: number;
}

export class Basket extends View<BasketDisplay> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		this._button.addEventListener('click', () => {
			events.emit('order:open'); // открываем окно оформления заказа
		});

		this.items = []; // это чтобы корзина не была заполнена
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this._button.removeAttribute('disabled');
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'В корзине пусто...',
				})
			);
			this._button.setAttribute('disabled', '');
		}
	}

	set total(total: number) {
		this.setText(this._total, total + ' синапсов'); // итоговая сумма в корзине
	}
}
