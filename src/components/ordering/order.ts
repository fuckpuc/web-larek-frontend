import { Form } from '../common/form';
import { IOrderForm } from '../../types';
import { IEvents } from '../base/events';

export class Order extends Form<IOrderForm> {
	private _paymentMethod: string;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._paymentMethod = '';

		const cash = this.container.elements.namedItem('cash') as HTMLInputElement;
		const online = this.container.elements.namedItem(
			'card'
		) as HTMLInputElement;

		const togglePaymentMethod = (
			selected: HTMLElement,
			deselected: HTMLElement
		) => {
			selected.classList.add('button_alt-active');
			deselected.classList.remove('button_alt-active');
			this._paymentMethod = selected === cash ? 'cash' : 'online';
			this.events.emit('paymentMethod:changed');
		};

		cash.addEventListener('click', () => {
			togglePaymentMethod(cash, online);
		});

		online.addEventListener('click', () => {
			togglePaymentMethod(online, cash);
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	set payment(value: string) {
		const cash = this.container.elements.namedItem('cash') as HTMLInputElement;
		const online = this.container.elements.namedItem(
			'card'
		) as HTMLInputElement;

		if (value === 'online') {
			this._paymentMethod = 'online';
			online.classList.add('button_alt-active');
			cash.classList.remove('button_alt-active');
		} else {
			this._paymentMethod = 'cash';
			cash.classList.add('button_alt-active');
			online.classList.remove('button_alt-active');
		}
	}

	get paymentMethod() {
		return this._paymentMethod;
	}
}
